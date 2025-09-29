// ...existing code...
// (Remove this duplicate setScreenPricing definition, as it should only exist inside the VenueService class)
// Helper function to get auth token from localStorage
function getAuthToken(): string | null {
  return localStorage.getItem("token");
}

let API_URL =
  (import.meta as any).env?.VITE_API_URL ||
  "https://doohgle-backend.onrender.com/api";

// Normalize API_URL: ensure it has a protocol. If someone sets VITE_API_URL without protocol
// (e.g. "localhost:4000/api") the browser will treat it as a relative URL and requests
// will break (you'll see requests to "4000/api/..."). Prepend http:// when missing.
if (!/^https?:\/\//i.test(API_URL)) {
  console.warn(
    "VITE_API_URL does not include protocol; prepending http:// for development. Value:",
    API_URL
  );
  API_URL = "http://" + API_URL.replace(/^\/+/, "");
}

// Interfaces
export interface Screen {
  id: number;
  user_id: number;
  screen_name: string;
  location_in_venue: string;
  description?: string;
  address_line1?: string;
  address_line2?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  latitude?: number;
  longitude?: number;
  width_px?: number;
  height_px?: number;
  resolution?: string;
  orientation?: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface ScreenAsset {
  id: number;
  screen_id: number;
  asset_type: "photo_day" | "photo_night" | "video";
  url: string;
  created_at: string;
}

export interface ScreenPricing {
  id: number;
  screen_id: number;
  hourly_rate: number | null;
  daily_rate: number | null;
  weekly_rate: number | null;
  currency: string;
  created_at: string;
  updated_at: string;
}

export interface Booking {
  id: number;
  screen_id: number;
  advertiser_id: number;
  start_time: string;
  end_time: string;
  status: "pending" | "accepted" | "rejected" | "completed";
  content_url: string;
  notes: string | null;
  created_at: string;
  updated_at: string;
  screen_name?: string;
}

export interface ProofOfPlay {
  id: number;
  booking_id: number;
  url: string;
  type: "image" | "video";
  captured_at: string;
  created_at: string;
}

// Helper function to handle API requests
async function apiRequest<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = getAuthToken();
  const url = `${API_URL}${endpoint}`;
  // Debug: show the final URL being requested to detect protocol-less values
  // (will appear in browser console during development)
  // eslint-disable-next-line no-console
  console.debug("[apiRequest] ", (options as any).method || "GET", url);
  const response = await fetch(url, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
      ...options.headers,
    },
  });

  if (!response.ok) {
    const error = await response.json().catch(() => ({}));
    throw new Error(error.message || "Something went wrong");
  }

  return response.json();
}

// Venue Service
class VenueService {
  // Screen Management
  async createScreen(
    screenData: Omit<Screen, "id" | "created_at" | "updated_at" | "is_active">
  ): Promise<Screen> {
    // POST to the screens controller
    return apiRequest<Screen>("/screens", {
      method: "POST",
      body: JSON.stringify(screenData),
    });
  }

  async updateScreen(
    screenId: number,
    screenData: Partial<Screen>
  ): Promise<Screen> {
    return apiRequest<Screen>(`/screens/${screenId}`, {
      method: "PATCH",
      body: JSON.stringify(screenData),
    });
  }

  async deleteScreen(screenId: number): Promise<void> {
    await apiRequest(`/screens/${screenId}`, {
      method: "DELETE",
    });
  }

  async getVenueScreens(): Promise<Screen[]> {
    // Use the screens "mine" endpoint to get screens for the authenticated user
    return apiRequest<Screen[]>("/screens/mine");
  }

  async getScreenDetails(screenId: number): Promise<Screen> {
    return apiRequest<Screen>(`/screens/${screenId}`);
  }

  // Screen Assets
  async uploadScreenAsset(
    screenId: number,
    assetData: { asset_type: string; url: string }
  ): Promise<ScreenAsset> {
    // Backend expects POST /api/venue/screens/assets with screen_id in body
    return apiRequest<ScreenAsset>(`/venue/screens/assets`, {
      method: "POST",
      body: JSON.stringify({ screen_id: String(screenId), ...assetData }),
    });
  }

  // Screen Pricing
  // For pricing, backend exposes /api/venue/screens/pricing which accepts screen_id in the body
  async updateScreenPricing(
    screenId: number,
    pricingData: {
      hourly_rate?: number;
      daily_rate?: number;
      weekly_rate?: number;
    }
  ): Promise<ScreenPricing> {
    return apiRequest<ScreenPricing>(`/venue/screens/pricing`, {
      method: "POST",
      body: JSON.stringify({ screen_id: String(screenId), ...pricingData }),
    });
  }

  // Backwards-compatible helper matching previous frontend usage
  async setScreenPricing({
    screen_id,
    hourly_rate,
    daily_rate,
    weekly_rate,
  }: {
    screen_id: string;
    hourly_rate: string;
    daily_rate: string;
    weekly_rate: string;
  }): Promise<ScreenPricing> {
    const pricing = {
      hourly_rate: hourly_rate ? Number(hourly_rate) : undefined,
      daily_rate: daily_rate ? Number(daily_rate) : undefined,
      weekly_rate: weekly_rate ? Number(weekly_rate) : undefined,
    };
    return this.updateScreenPricing(Number(screen_id), pricing);
  }

  // Bookings
  async getVenueBookings(): Promise<Booking[]> {
    return apiRequest<Booking[]>("/venue/bookings");
  }

  async updateBookingStatus(
    bookingId: number,
    status: "accepted" | "rejected"
  ): Promise<Booking> {
    return apiRequest<Booking>(`/venue/bookings/${bookingId}/status`, {
      method: "PATCH",
      body: JSON.stringify({ status }),
    });
  }

  // Proof of Play
  async addProofOfPlay(
    bookingId: number,
    proofData: { url: string; type: "image" | "video"; captured_at: string }
  ): Promise<ProofOfPlay> {
    return apiRequest<ProofOfPlay>(`/venue/bookings/${bookingId}/proof`, {
      method: "POST",
      body: JSON.stringify(proofData),
    });
  }
}

export const venueService = new VenueService();
