export interface ScreenAsset {
  asset_type: 'photo_day' | 'photo_night' | 'video';
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
  screen_size_inches: number | null;
  resolution: string | null;
  orientation: 'landscape' | 'portrait';
  device_type: 'smart_tv' | 'media_player' | 'custom';
  device_model: string | null;
  ads_enabled: boolean;
  ad_frequency: number;
  viewing_distance: 'close' | 'medium' | 'far';
  typical_viewer_duration: string | null;
  peak_viewing_hours: string[];
  assets?: ScreenAsset[];
  pricing?: ScreenPricing;
  availability?: ScreenAvailability[];
}

export async function createScreen(payload: ScreenPayload) {
  const token = localStorage.getItem('token');
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const res = await fetch('http://localhost:4000/api/screens', {
      method: 'POST',
      headers,
      body: JSON.stringify(payload),
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { message: 'Network error' } };
  }
}

export async function getMyScreens() {
  const token = localStorage.getItem('token');
  try {
    const headers: Record<string, string> = {
      'Content-Type': 'application/json',
    };
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    const res = await fetch('http://localhost:4000/api/screens/mine', {
      method: 'GET',
      headers,
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } catch (e) {
    return { ok: false, status: 0, data: { message: 'Network error' } };
  }
}
