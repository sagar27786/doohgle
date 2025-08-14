

const API_URL = 'http://localhost:4000/api/venue';

async function request(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem('token');
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers,
    });
    const data = await response.json().catch(() => ({}));
    return { ok: response.ok, status: response.status, data };
  } catch (error) {
    console.error('API request error:', error);
    return { ok: false, status: 0, data: { message: 'Network error' } };
  }
}

export const addScreenAsset = (payload: { screen_id: string; asset_type: 'image' | 'video'; url: string }) => {
  return request('/screens/assets', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const setScreenPricing = (payload: { screen_id: string; hourly_rate?: number; daily_rate?: number; weekly_rate?: number }) => {
  return request('/screens/pricing', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};

export const getVenueBookings = () => {
  return request('/bookings');
};

export const updateBookingStatus = (payload: { booking_id: string; status: 'accepted' | 'rejected' }) => {
  return request('/bookings/status', {
    method: 'PATCH',
    body: JSON.stringify(payload),
  });
};

export const addProofOfPlay = (payload: { booking_id: string; url: string; type: 'image' | 'video'; captured_at: string }) => {
  return request('/bookings/proof', {
    method: 'POST',
    body: JSON.stringify(payload),
  });
};
