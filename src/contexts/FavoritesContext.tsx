import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { toggleFavoriteScreen, getUserFavoriteScreens } from "../api/screens";
import { ScreenSearchResult } from "../api/screens";

interface FavoritesContextType {
  favoriteScreenIds: Set<string | number>;
  favoriteScreens: ScreenSearchResult[];
  isLoading: boolean;
  toggleFavorite: (screenId: string | number) => Promise<boolean>;
  isFavorite: (screenId: string | number) => boolean;
  refreshFavorites: () => Promise<void>;
  getFavoriteScreens: () => ScreenSearchResult[];
}

const FavoritesContext = createContext<FavoritesContextType | undefined>(
  undefined
);

export const useFavorites = () => {
  const context = useContext(FavoritesContext);
  if (!context) {
    throw new Error("useFavorites must be used within a FavoritesProvider");
  }
  return context;
};

interface FavoritesProviderProps {
  children: ReactNode;
}

export const FavoritesProvider: React.FC<FavoritesProviderProps> = ({
  children,
}) => {
  const [favoriteScreenIds, setFavoriteScreenIds] = useState<
    Set<string | number>
  >(new Set());
  const [favoriteScreens, setFavoriteScreens] = useState<ScreenSearchResult[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);

  // Load favorites from localStorage on mount and refresh from API
  useEffect(() => {
    const loadStoredFavorites = () => {
      try {
        const stored = localStorage.getItem("userFavoriteScreens");
        if (stored) {
          const parsed = JSON.parse(stored);
          const storedTime = parsed.timestamp || 0;
          const now = Date.now();
          const maxAge = 5 * 60 * 1000; // 5 minutes

          // Use stored data if it's recent, otherwise refresh from API
          if (now - storedTime < maxAge) {
            setFavoriteScreenIds(new Set(parsed.ids || []));
            setFavoriteScreens(parsed.screens || []);
            console.log("Loaded favorites from localStorage (recent)");
            return;
          } else {
            console.log("Stored favorites are stale, refreshing from API");
          }
        }
      } catch (error) {
        console.error("Error loading stored favorites:", error);
      }
    };

    loadStoredFavorites();

    // Always refresh from API to ensure latest data
    refreshFavorites();
  }, []);

  // Save favorites to localStorage whenever they change
  useEffect(() => {
    try {
      localStorage.setItem(
        "userFavoriteScreens",
        JSON.stringify({
          ids: Array.from(favoriteScreenIds),
          screens: favoriteScreens,
          timestamp: Date.now(),
        })
      );
    } catch (error) {
      console.error("Error saving favorites to localStorage:", error);
    }
  }, [favoriteScreenIds, favoriteScreens]);

  const refreshFavorites = async () => {
    try {
      setIsLoading(true);
      const favorites = await getUserFavoriteScreens();
      console.log("Refreshed favorites from API:", favorites);

      setFavoriteScreens(favorites);
      setFavoriteScreenIds(new Set(favorites.map((screen) => screen.id)));
    } catch (error) {
      console.error("Error refreshing favorites:", error);
      // Don't clear local state on API error, keep what we have
    } finally {
      setIsLoading(false);
    }
  };

  const toggleFavorite = async (
    screenId: string | number
  ): Promise<boolean> => {
    try {
      console.log("Toggling favorite for screen:", screenId);

      // Optimistic update
      const wasAlreadyFavorite = favoriteScreenIds.has(screenId);
      const newFavoriteIds = new Set(favoriteScreenIds);

      if (wasAlreadyFavorite) {
        newFavoriteIds.delete(screenId);
        setFavoriteScreens((prev) =>
          prev.filter((screen) => screen.id !== screenId)
        );
      } else {
        newFavoriteIds.add(screenId);
      }

      setFavoriteScreenIds(newFavoriteIds);

      // Call API
      const result = await toggleFavoriteScreen(screenId);
      console.log("Toggle favorite result:", result);

      // Refresh the full list from API to ensure consistency
      await refreshFavorites();

      return result.is_favorite;
    } catch (error) {
      console.error("Error toggling favorite:", error);

      // Revert optimistic update on error
      await refreshFavorites();

      throw error;
    }
  };

  const isFavorite = (screenId: string | number): boolean => {
    return favoriteScreenIds.has(screenId);
  };

  const getFavoriteScreens = (): ScreenSearchResult[] => {
    return favoriteScreens;
  };

  const value: FavoritesContextType = {
    favoriteScreenIds,
    favoriteScreens,
    isLoading,
    toggleFavorite,
    isFavorite,
    refreshFavorites,
    getFavoriteScreens,
  };

  return (
    <FavoritesContext.Provider value={value}>
      {children}
    </FavoritesContext.Provider>
  );
};
