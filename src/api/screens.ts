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
  pincode?: string;
  latitude: number | null;
  longitude: number | null;
  screen_size_width?: number;
  screen_size_height?: number;
  resolution_width?: number;
  resolution_height?: number;
  daily_footfall?: number;
  vehicle_count?: number;
  peak_hours?: string;
  demographics?: string;
  cost_per_10_seconds?: number;
  image_url?: string;
  video_url?: string;
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

    const res = await fetch("http://localhost:4000/api/screens", {
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
    console.error("No authentication token found");
    throw new Error("Please log in to view your screens");
  }

  try {
    console.log("Fetching user screens...");
    const response = await fetch("http://localhost:4000/api/screens/mine", {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("Server error:", data);
      if (response.status === 401) {
        // Token is invalid, remove it
        localStorage.removeItem("token");
        throw new Error("Session expired. Please log in again.");
      }
      throw new Error(data.message || `Server error (${response.status})`);
    }

    console.log("Screens loaded successfully:", data);
    return { ok: true, data };
  } catch (error) {
    console.error("Error fetching user screens:", error);

    // Network error
    if (error instanceof TypeError && error.message.includes("fetch")) {
      return {
        ok: false,
        data: {
          message: "Unable to connect to server. Please check your connection.",
        },
      };
    }

    // Other errors
    return {
      ok: false,
      data: {
        message:
          error instanceof Error ? error.message : "Failed to fetch screens",
      },
    };
  }
}

export async function searchScreensByCity(
  city: string
): Promise<ScreenSearchResult[]> {
  try {
    const response = await fetch(
      `http://localhost:4000/api/screens/search?city=${encodeURIComponent(
        city
      )}`
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch screens: ${response.statusText}`);
    }

    const data = await response.json();
    console.log("🔍 SEARCH API RESPONSE:", data);

    if (!data.success) {
      throw new Error(data.message || "Failed to fetch screens");
    }

    // Debug: Log the first screen's image data
    if (data.data && data.data.length > 0) {
      console.log("🔍 FIRST SCREEN DATA:", {
        id: data.data[0].id,
        name: data.data[0].name,
        image_urls: data.data[0].image_urls,
        image_url: data.data[0].image_url,
        type_image_urls: typeof data.data[0].image_urls,
        type_image_url: typeof data.data[0].image_url,
      });
    }

    return data.data || [];
  } catch (error) {
    console.error("Error searching screens by city:", error);
    throw error;
  }
}
