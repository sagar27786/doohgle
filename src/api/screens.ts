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
  city?: string | null;
  latitude?: number | null;
  longitude?: number | null;
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
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch('http://localhost:4000/api/screens/mine', {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch screens');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching screens:', error);
    throw error;
  }
}

export async function getScreenById(id: string) {
  const token = localStorage.getItem('token');
  if (!token) {
    throw new Error('No authentication token found');
  }

  try {
    const response = await fetch(`http://localhost:4000/api/screens/${id}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error('Failed to fetch screen details');
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching screen details:', error);
    throw error;
  }
}

export async function searchScreensByCity(city: string): Promise<ScreenSearchResult[]> {
  try {
    const response = await fetch(`http://localhost:4000/api/screens/search?city=${encodeURIComponent(city)}`);
    
    if (!response.ok) {
      throw new Error(`Failed to fetch screens: ${response.statusText}`);
    }

    const data = await response.json();
    console.log(data);
    
    if (!data.success) {
      throw new Error(data.message || 'Failed to fetch screens');
    }

    return data.data || [];
  } catch (error) {
    console.error('Error searching screens by city:', error);
    throw error;
  }
}
