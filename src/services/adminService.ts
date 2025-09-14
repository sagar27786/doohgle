// Basic admin service types and implementation
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
    return {
      screens: { total_screens: 5, active_screens: 5, inactive_screens: 0 },
      bookingRequests: { total_requests: 12, pending_requests: 4, accepted_requests: 6, rejected_requests: 2 },
      monthlyBookings: [
        { month: 1, booking_count: 8, total_revenue: 125000 },
        { month: 2, booking_count: 9, total_revenue: 150000 },
        { month: 3, booking_count: 11, total_revenue: 175000 },
      ],
      topCities: [
        { city: 'Mumbai', screen_count: 2, active_count: 2 },
        { city: 'Delhi', screen_count: 1, active_count: 1 },
        { city: 'Bangalore', screen_count: 1, active_count: 1 },
      ],
      recentBookings: [
        {
          id: '1',
          campaign_name: 'Tech Product Launch',
          advertiser_name: 'TechCorp',
          screen_name: 'Mumbai Central Mall Screen',
          total_budget: 50000,
          status: 'pending',
          created_at: new Date().toISOString(),
          city: 'Mumbai'
        }
      ]
    };
  }

  async getAllScreens(): Promise<AdminScreen[]> {
    return [
      {
        id: 1,
        screen_name: 'Mumbai Central Mall Screen',
        city: 'Mumbai',
        location_in_venue: 'Main Entrance',
        is_active: true,
        device_type: 'LED Billboard',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        owner_email: 'mumbai@doohgle.com',
        owner_name: 'Mumbai Venues',
        booking_requests_count: 3
      }
    ];
  }

  async getAllBookingRequests(): Promise<AdminBookingRequest[]> {
    return [
      {
        id: '1',
        campaign_name: 'Tech Product Launch',
        advertiser_name: 'TechCorp India',
        screen_name: 'Mumbai Central Mall Screen',
        start_date: '2025-09-15',
        end_date: '2025-09-22',
        daily_budget: 7500,
        total_budget: 52500,
        status: 'pending',
        message: 'Looking to launch our new smartphone',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        city: 'Mumbai',
        location_in_venue: 'Main Entrance',
        venue_owner_email: 'mumbai@doohgle.com'
      }
    ];
  }

  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    return {
      monthlyRevenue: [
        { month: 1, year: 2025, booking_count: 8, total_revenue: 125000, avg_booking_value: 15625 },
        { month: 2, year: 2025, booking_count: 12, total_revenue: 180000, avg_booking_value: 15000 },
      ],
      cityRevenue: [
        { city: 'Mumbai', booking_count: 35, total_revenue: 525000 },
        { city: 'Delhi', booking_count: 28, total_revenue: 420000 },
      ]
    };
  }

  async updateBookingStatus(bookingId: string, status: string): Promise<AdminBookingRequest> {
    const booking = (await this.getAllBookingRequests())[0];
    return { ...booking, status, updated_at: new Date().toISOString() };
  }

  async updateScreenStatus(screenId: number, isActive: boolean): Promise<any> {
    return { success: true, message: 'Screen status updated successfully' };
  }
}

export const adminService = new AdminService();
export type { DashboardStats, AdminScreen, AdminBookingRequest, RevenueAnalytics };
