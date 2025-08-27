import { useState, useEffect } from "react";
import { ScreenSearchResult } from "../api/screens";
import ScreenVisibilityService from "../services/screenVisibilityService";

export interface UseScreenVisibilityOptions {
  city?: string;
  autoRefresh?: boolean;
  refreshIntervalMinutes?: number;
}

export interface UseScreenVisibilityReturn {
  screens: ScreenSearchResult[];
  loading: boolean;
  error: string | null;
  refresh: () => Promise<void>;
  getScreensForCity: (city: string) => Promise<ScreenSearchResult[]>;
  getAllScreens: () => Promise<ScreenSearchResult[]>;
  cacheStatus: {
    cities: string[];
    totalCities: number;
    lastRefreshMinutes: number;
    isStale: boolean;
  };
}

/**
 * Hook for managing screen visibility and ensuring screens appear in ads manager
 */
export function useScreenVisibility(
  options: UseScreenVisibilityOptions = {}
): UseScreenVisibilityReturn {
  const { city, autoRefresh = true, refreshIntervalMinutes = 10 } = options;

  const [screens, setScreens] = useState<ScreenSearchResult[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [cacheStatus, setCacheStatus] = useState({
    cities: [] as string[],
    totalCities: 0,
    lastRefreshMinutes: 0,
    isStale: true,
  });

  const service = ScreenVisibilityService.getInstance();

  // Subscribe to service updates
  useEffect(() => {
    const unsubscribe = service.subscribe((updatedScreens) => {
      setScreens(updatedScreens);
      setCacheStatus(service.getCacheStatus());
    });

    return unsubscribe;
  }, [service]);

  // Start auto-refresh if enabled
  useEffect(() => {
    if (autoRefresh && refreshIntervalMinutes > 0) {
      console.log(
        `🔄 Starting auto-refresh for screen visibility (${refreshIntervalMinutes}min intervals)`
      );
      service.startAutoRefresh(refreshIntervalMinutes);
    }
  }, [autoRefresh, refreshIntervalMinutes, service]);

  // Load initial data
  useEffect(() => {
    const loadInitialScreens = async () => {
      try {
        setLoading(true);
        setError(null);

        let initialScreens: ScreenSearchResult[];

        if (city) {
          console.log(`📍 Loading screens for specific city: ${city}`);
          initialScreens = await service.getScreensForCity(city);
        } else {
          console.log(`🌍 Loading screens from all major cities`);
          initialScreens = await service.getAllScreens();
        }

        setScreens(initialScreens);
        setCacheStatus(service.getCacheStatus());

        console.log(
          `✅ Successfully loaded ${initialScreens.length} screens for ads manager`
        );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load screens";
        console.error("❌ Screen loading error:", errorMessage);
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    loadInitialScreens();
  }, [city, service]);

  // Manual refresh function
  const refresh = async () => {
    try {
      setLoading(true);
      setError(null);

      let refreshedScreens: ScreenSearchResult[];

      if (city) {
        console.log(`🔄 Manually refreshing screens for ${city}`);
        refreshedScreens = await service.getScreensForCity(city, true); // force refresh
      } else {
        console.log(`🔄 Manually refreshing all screens`);
        service.clearCache(); // Clear cache for full refresh
        refreshedScreens = await service.getAllScreens();
      }

      setScreens(refreshedScreens);
      setCacheStatus(service.getCacheStatus());

      console.log(
        `✅ Refresh completed: ${refreshedScreens.length} screens available`
      );
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to refresh screens";
      console.error("❌ Refresh error:", errorMessage);
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Get screens for specific city
  const getScreensForCity = async (
    targetCity: string
  ): Promise<ScreenSearchResult[]> => {
    try {
      console.log(`📍 Getting screens for ${targetCity}`);
      const cityScreens = await service.getScreensForCity(targetCity);

      // Update state if this matches current city filter
      if (city === targetCity || !city) {
        setScreens((prev) => {
          // Merge with existing screens from other cities
          const otherCityScreens = city
            ? []
            : prev.filter((s) => s.city !== targetCity);
          return [...otherCityScreens, ...cityScreens];
        });
      }

      return cityScreens;
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : `Failed to get screens for ${targetCity}`;
      console.error(
        `❌ Error getting screens for ${targetCity}:`,
        errorMessage
      );
      throw new Error(errorMessage);
    }
  };

  // Get all screens
  const getAllScreens = async (): Promise<ScreenSearchResult[]> => {
    try {
      console.log(`🌍 Getting all available screens`);
      const allScreens = await service.getAllScreens();

      // Update state
      setScreens(allScreens);
      setCacheStatus(service.getCacheStatus());

      return allScreens;
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to get all screens";
      console.error("❌ Error getting all screens:", errorMessage);
      throw new Error(errorMessage);
    }
  };

  return {
    screens,
    loading,
    error,
    refresh,
    getScreensForCity,
    getAllScreens,
    cacheStatus,
  };
}

/**
 * Hook specifically for ads manager to ensure screen visibility
 */
export function useAdsManagerScreens() {
  const visibility = useScreenVisibility({
    autoRefresh: true,
    refreshIntervalMinutes: 5, // More frequent refresh for ads manager
  });

  // Enhanced logging for ads manager
  useEffect(() => {
    if (visibility.screens.length > 0) {
      console.log(
        `🎯 ADS MANAGER: ${visibility.screens.length} screens available for advertising`
      );

      // Debug log for troubleshooting
      const screenSummary = visibility.screens.reduce((acc, screen) => {
        const city = screen.city || "Unknown";
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log(`🏙️ Screens by city:`, screenSummary);

      // Check if user's own screens are included
      const userScreens = visibility.screens.filter((screen) =>
        screen.description?.includes("Your own screen")
      );
      if (userScreens.length > 0) {
        console.log(
          `👤 User's own screens in ads manager: ${userScreens.length}`
        );
      }
    }
  }, [visibility.screens]);

  return {
    ...visibility,
    // Additional ads manager specific methods
    simulateNewListing: async (city: string) => {
      console.log(`🆕 ADS MANAGER: Simulating new screen listing in ${city}`);
      return await ScreenVisibilityService.getInstance().simulateNewScreen(
        city
      );
    },
    debugLogAllScreens: async () => {
      await ScreenVisibilityService.getInstance().debugLogAllScreens();
    },
    refreshAfterScreenCreation: async () => {
      console.log(`🔄 ADS MANAGER: Refreshing after new screen creation`);
      return await ScreenVisibilityService.getInstance().refreshAfterScreenCreation();
    },
  };
}
