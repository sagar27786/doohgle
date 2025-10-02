const API_BASE_URL =
  import.meta.env.VITE_API_URL || "https://doohgle-backend.onrender.com/api";

export interface ScreenAsset {
  asset_type: "photo_day" | "photo_night" | "video";
  url: string;
}

export interface ScreenPricing {
  hourly_rate?: number;
  daily_rate?: number;
  weekly_rate?: number;
  currency?: string;
}

export interface ScreenAvailability {
  date: string; // ISO date string
  is_available: boolean;
}

export interface ScreenPayload {
  screen_name: string;
  location_in_venue: string;
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
  screen_size_inches: number | null;
  resolution: string | null;
  orientation: "landscape" | "portrait";
  device_type: "smart_tv" | "media_player" | "custom";
  device_model: string | null;
  ads_enabled: boolean;
  ad_frequency: number;
  viewing_distance: "close" | "medium" | "far";
  typical_viewer_duration: string | null;
  peak_viewing_hours: string[];
  assets?: ScreenAsset[];
  pricing?: ScreenPricing;
  availability?: ScreenAvailability[];
}

export interface ScreenSearchResult {
  id: number;
  name: string;
  description?: string;
  screen_type: string;
  location_name: string;
  address: string;
  city: string;
  state: string;
  pincode: string;
  latitude: number | null;
  longitude: number | null;
  screen_size_width?: number;
  screen_size_height?: number;
  resolution_width?: number;
  resolution_height?: number;
  daily_footfall?: number;
  vehicle_count?: number;
  peak_hours?: string[];
  demographics?: string;
  cost_per_10_seconds?: number;
  image_url?: string;
  day_photo_url?: string;
  night_photo_url?: string;
  video_url?: string;
  is_active?: boolean;
  hourly_rate?: number;
  daily_rate?: number;
  weekly_rate?: number;
  pricing?: {
    hourly: number;
    daily: number;
    weekly: number;
    cost_per_10_seconds: number;
  };
  is_favorite?: boolean; // Add favorite status
  favorited_at?: string; // When it was favorited
  status?: "active" | "inactive" | "maintenance";
}

export async function createScreen(payload: ScreenPayload) {
  const token = localStorage.getItem("token");
  try {
    const headers: Record<string, string> = {
      "Content-Type": "application/json",
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch(`${API_BASE_URL}/screens`, {
      method: "POST",
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { message: "Network error" } };
  }
}

export async function getMyScreens() {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/screens/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch screens");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching screens:", error);
    throw error;
  }
}

export async function getScreenById(id: string) {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No authentication token found");
  }

  try {
    const response = await fetch(`${API_BASE_URL}/screens/${id}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch screen details");
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching screen details:", error);
    throw error;
  }
}

export async function getAllScreens(): Promise<ScreenSearchResult[]> {
  try {
    const token = localStorage.getItem("token");
    const headers: any = { "Content-Type": "application/json" };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const response = await fetch(`${API_BASE_URL}/screens`, {
      headers,
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch screens: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("All screens API response:", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch screens");
    }

    return data.data || [];
  } catch (error) {
    console.error("Error fetching all screens:", error);
    throw error;
  }
}

export async function searchScreensByCity(
  city: string
): Promise<ScreenSearchResult[]> {
  try {
    const response = await fetch(
      `${API_BASE_URL}/screens/search?city=${encodeURIComponent(city)}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch screens: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Search screens API response:", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch screens");
    }

    return data.data || [];
  } catch (error) {
    console.error("Error searching screens by city:", error);
    throw error;
  }
}

// ==================== FAVORITE SCREENS API ====================

/**
 * Toggle favorite status of a screen
 */
export async function toggleFavoriteScreen(screenId: number | string): Promise<{
  message: string;
  is_favorite: boolean;
}> {
  try {
    const token = localStorage.getItem("token");
    console.log("toggleFavoriteScreen called with screenId:", screenId);
    console.log("Auth token present:", !!token);
    console.log("Token value:", token?.substring(0, 20) + "...");

    if (!token) {
      throw new Error("Authentication required");
    }

    const url = `${API_BASE_URL}/screens/${screenId}/favorite`;
    console.log("Making request to:", url);

    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    console.log(
      "Toggle favorite API response status:",
      response.status,
      response.ok
    );

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Toggle favorite API error text:", errorText);
      throw new Error(`Failed to toggle favorite: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Toggle favorite API response data:", data);

    return data;
  } catch (error) {
    console.error("Error toggling favorite screen:", error);
    throw error;
  }
}

/**
 * Get user's favorite screens
 */
export async function getUserFavoriteScreens(): Promise<ScreenSearchResult[]> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("Authentication required");
    }

    const response = await fetch(`${API_BASE_URL}/screens/favorites/mine`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch favorites: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("User favorites API response:", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch favorite screens");
    }

    return data.favorites || [];
  } catch (error) {
    console.error("Error fetching user favorite screens:", error);
    throw error;
  }
}

/**
 * Check favorite status for multiple screens
 */
export async function checkFavoriteStatus(screenIds: number[]): Promise<{
  [screenId: string]: boolean;
}> {
  try {
    const token = localStorage.getItem("token");
    if (!token) {
      // Return empty object if not authenticated
      return {};
    }

    const response = await fetch(`${API_BASE_URL}/screens/favorites/check`, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ screenIds }),
    });

    if (!response.ok) {
      throw new Error(`Failed to check favorites: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("Check favorites API response:", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to check favorite status");
    }

    return data.favorites || {};
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return {}; // Return empty object on error
  }
}
