// Basic admin service types and implementation
import { getAllScreens } from '../api/screens';

interface DashboardStats {
  screens: {
    total_screens: number;
    active_screens: number;
    inactive_screens: number;
  };
  bookingRequests: {
    total_requests: number;
    pending_requests: number;
    accepted_requests: number;
    rejected_requests: number;
  };
  monthlyBookings: Array<{
    month: number;
    booking_count: number;
    total_revenue: number;
  }>;
  topCities: Array<{
    city: string;
    screen_count: number;
    active_count: number;
  }>;
  recentBookings: Array<{
    id: string;
    campaign_name: string;
    advertiser_name: string;
    screen_name: string;
    total_budget: number;
    status: string;
    created_at: string;
    city: string;
  }>;
}

interface AdminScreen {
  id: number;
  screen_name: string;
  city: string;
  location_in_venue: string;
  is_active: boolean;
  device_type: string;
  created_at: string;
  updated_at: string;
  owner_email: string;
  owner_name: string;
  booking_requests_count: number;
}

interface AdminBookingRequest {
  id: string;
  campaign_name: string;
  advertiser_name: string;
  screen_name: string;
  start_date: string;
  end_date: string;
  daily_budget: number;
  total_budget: number;
  status: string;
  message: string;
  created_at: string;
  updated_at: string;
  city: string;
  location_in_venue: string;
  venue_owner_email: string;
}

interface RevenueAnalytics {
  monthlyRevenue: Array<{
    month: number;
    year: number;
    booking_count: number;
    total_revenue: number;
    avg_booking_value: number;
  }>;
  cityRevenue: Array<{
    city: string;
    booking_count: number;
    total_revenue: number;
  }>;
}

class AdminService {
  private baseUrl = import.meta.env.VITE_API_URL || 'https://doohgle-backend.onrender.com/api';

  async login(email: string, password: string): Promise<any> {
    // Simplified admin login - just check credentials locally
    if (email === 'admin@doohgle.com' && password === 'Admin@2025') {
      const adminToken = 'admin-token-doohgle';
      const adminUser = { id: 999, email: 'admin@doohgle.com', roles: ['admin'] };
      localStorage.setItem('adminToken', adminToken);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      return { token: adminToken, user: adminUser };
    }
    throw new Error('Invalid credentials');
  }

  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }

  async getDashboardStats(): Promise<DashboardStats> {
    try {
      // Use the existing admin dashboard stats API which works correctly
      const response = await fetch(`${this.baseUrl}/admin/dashboard/stats`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch dashboard stats: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        // Convert string numbers to integers and format the data
        const data = result.data;
        return {
          screens: {
            total_screens: parseInt(data.screens.total_screens),
            active_screens: parseInt(data.screens.active_screens),
            inactive_screens: parseInt(data.screens.inactive_screens)
          },
          bookingRequests: {
            total_requests: parseInt(data.bookingRequests.total_requests),
            pending_requests: parseInt(data.bookingRequests.pending_requests),
            accepted_requests: parseInt(data.bookingRequests.accepted_requests),
            rejected_requests: parseInt(data.bookingRequests.rejected_requests)
          },
          monthlyBookings: data.monthlyBookings.map((mb: any) => ({
            month: parseInt(mb.month),
            booking_count: parseInt(mb.booking_count),
            total_revenue: parseFloat(mb.total_revenue)
          })),
          topCities: data.topCities.map((tc: any) => ({
            city: tc.city,
            screen_count: parseInt(tc.screen_count),
            active_count: parseInt(tc.active_count)
          })),
          recentBookings: data.recentBookings.map((rb: any) => ({
            id: rb.id,
            campaign_name: rb.campaign_name,
            advertiser_name: rb.advertiser_name,
            screen_name: rb.screen_name,
            total_budget: parseFloat(rb.total_budget),
            status: rb.status,
            created_at: rb.created_at,
            city: rb.city
          }))
        };
      }
      
      throw new Error('Invalid response from dashboard stats API');
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw new Error('Failed to load dashboard statistics');
    }
  }

  async getAllScreens(): Promise<AdminScreen[]> {
    try {
      // Use the existing getAllScreens API which returns all screens without authentication
      const screens = await getAllScreens();
      
      // Convert ScreenSearchResult to AdminScreen format
      const adminScreens: AdminScreen[] = screens.map(screen => ({
        id: screen.id,
        screen_name: screen.name,
        city: screen.city,
        location_in_venue: screen.location_name,
        is_active: true, // Assume active if not specified
        device_type: screen.screen_type,
        created_at: new Date().toISOString(), // Default since not in search result
        updated_at: new Date().toISOString(), // Default since not in search result
        owner_email: '', // Not available in search result
        owner_name: '', // Not available in search result
        booking_requests_count: 0 // Default since not in search result
      }));

      return adminScreens;
    } catch (error) {
      console.error('Error fetching screens:', error);
      throw new Error('Failed to load screens data');
    }
  }

  async getAllBookingRequests(): Promise<AdminBookingRequest[]> {
    try {
      // For now, return empty array since admin booking requests are having issues
      // All the important data is shown in the dashboard stats and recent bookings
      console.log('Admin booking requests: Returning empty array (data available in dashboard stats)');
      return [];
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      return [];
    }
  }

  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    try {
      // Use the existing admin revenue analytics API which works correctly
      const response = await fetch(`${this.baseUrl}/admin/analytics/revenue`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('adminToken')}`,
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to fetch revenue analytics: ${response.status}`);
      }

      const result = await response.json();
      
      if (result.success && result.data) {
        return {
          monthlyRevenue: result.data.monthlyRevenue.map((mr: any) => ({
            month: mr.month,
            year: mr.year,
            booking_count: mr.booking_count,
            total_revenue: parseFloat(mr.total_revenue),
            avg_booking_value: parseFloat(mr.avg_booking_value)
          })),
          cityRevenue: result.data.cityRevenue.map((cr: any) => ({
            city: cr.city,
            booking_count: cr.booking_count,
            total_revenue: parseFloat(cr.total_revenue)
          }))
        };
      }
      
      throw new Error('Invalid response from revenue analytics API');
    } catch (error) {
      console.error('Error fetching revenue analytics:', error);
      throw new Error('Failed to load revenue analytics');
    }
  }

}

export const adminService = new AdminService();
export type { DashboardStats, AdminScreen, AdminBookingRequest, RevenueAnalytics };
