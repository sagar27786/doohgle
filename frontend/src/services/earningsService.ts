import api from './api';

export interface EarningsFilters {
  startDate?: string;
  endDate?: string;
  status?: 'pending' | 'processed' | 'paid' | 'cancelled';
  screenId?: number;
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface Earnings {
  id: number;
  screen_owner_id: number;
  booking_id: number;
  screen_id: number;
  amount: number;
  currency: string;
  status: 'pending' | 'processed' | 'paid' | 'cancelled';
  payment_method?: string;
  payment_reference?: string;
  period_start: string;
  period_end: string;
  created_at: string;
  updated_at: string;
  paid_at?: string;
  // Joined fields
  screen_name?: string;
  location_in_venue?: string;
  booking_start?: string;
  booking_end?: string;
}

export interface EarningsSummary {
  total_earnings: number;
  total_paid: number;
  pending_payout: number;
  total_earned: number;
  total_screens: number;
}

export const getMyEarnings = async (filters?: EarningsFilters): Promise<PaginatedResponse<Earnings>> => {
  try {
    const response = await api.get<PaginatedResponse<Earnings>>('/earnings', { params: filters });
    return response.data ?? { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  } catch (error) {
    console.error('Error fetching earnings:', error);
    // Return empty paginated response on error
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
};

export const getEarningsByScreen = async (screenId: number, filters?: Omit<EarningsFilters, 'screenId'>): Promise<PaginatedResponse<Earnings>> => {
  try {
    const response = await api.get<PaginatedResponse<Earnings>>(`/screens/${screenId}/earnings`, { 
      params: filters 
    });
    return response.data ?? { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  } catch (error) {
    console.error(`Error fetching earnings for screen ${screenId}:`, error);
    // Return empty paginated response on error to maintain type safety
    return { data: [], total: 0, page: 1, limit: 10, totalPages: 0 };
  }
};

interface EarningsSummaryResponse {
  summary: EarningsSummary;
}

export const getEarningsSummary = async (filters?: Pick<EarningsFilters, 'startDate' | 'endDate' | 'screenId'>): Promise<EarningsSummary> => {
  try {
    const response = await api.get<EarningsSummaryResponse>('/earnings/summary', { params: filters });
    return response.data?.summary || {
      total_earnings: 0,
      total_paid: 0,
      pending_payout: 0,
      total_earned: 0,
      total_screens: 0
    };
  } catch (error) {
    console.error('Error fetching earnings summary:', error);
    return {
      total_earnings: 0,
      total_paid: 0,
      pending_payout: 0,
      total_earned: 0,
      total_screens: 0
    };
  }
};

interface PayoutResponse {
  success: boolean;
  message: string;
}

export const requestPayout = async (amount: number, paymentMethod: string): Promise<PayoutResponse> => {
  try {
    const response = await api.post<PayoutResponse>('/earnings/request-payout', { amount, payment_method: paymentMethod });
    return { success: true, message: response.data.message };
  } catch (error: any) {
    console.error('Error requesting payout:', error);
    return { 
      success: false, 
      message: error.response?.data?.message || 'Failed to request payout' 
    };
  }
};
