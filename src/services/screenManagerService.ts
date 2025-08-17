import { apiClient, ApiResponse } from '../api/client';

export interface Screen {
  id: string;
  name: string;
  location: string;
  type: string;
  dimensions: string;
  price: number;
  status: 'active' | 'inactive' | 'maintenance';
  coordinates: {
    lat: number;
    lng: number;
  };
  description?: string;
  images?: string[];
}

export interface ScreenBooking {
  id: string;
  screenId: string;
  clientName: string;
  startDate: string;
  endDate: string;
  totalAmount: number;
  status: 'pending' | 'confirmed' | 'active' | 'completed' | 'cancelled';
}

export class ScreenManagerService {
  async getAllScreens(): Promise<ApiResponse<Screen[]>> {
    return apiClient.get<Screen[]>('/screens');
  }

  async getScreenById(id: string): Promise<ApiResponse<Screen>> {
    return apiClient.get<Screen>(`/screens/${id}`);
  }

  async createScreen(screen: Omit<Screen, 'id'>): Promise<ApiResponse<Screen>> {
    return apiClient.post<Screen>('/screens', screen);
  }

  async updateScreen(id: string, screen: Partial<Screen>): Promise<ApiResponse<Screen>> {
    return apiClient.put<Screen>(`/screens/${id}`, screen);
  }

  async deleteScreen(id: string): Promise<ApiResponse<void>> {
    return apiClient.delete<void>(`/screens/${id}`);
  }

  async getScreenBookings(screenId: string): Promise<ApiResponse<ScreenBooking[]>> {
    return apiClient.get<ScreenBooking[]>(`/screens/${screenId}/bookings`);
  }

  async bookScreen(booking: Omit<ScreenBooking, 'id'>): Promise<ApiResponse<ScreenBooking>> {
    return apiClient.post<ScreenBooking>('/bookings', booking);
  }

  async updateBookingStatus(
    bookingId: string, 
    status: ScreenBooking['status']
  ): Promise<ApiResponse<ScreenBooking>> {
    return apiClient.put<ScreenBooking>(`/bookings/${bookingId}`, { status });
  }

  async searchScreens(params: {
    location?: string;
    type?: string;
    minPrice?: number;
    maxPrice?: number;
    status?: string;
  }): Promise<ApiResponse<Screen[]>> {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    
    return apiClient.get<Screen[]>(`/screens/search?${queryParams}`);
  }
}

export const screenManagerService = new ScreenManagerService();
