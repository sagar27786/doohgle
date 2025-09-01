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
  private baseUrl = 'http://localhost:4001/api';

  private getAuthHeaders() {
    const token = localStorage.getItem('adminToken') || localStorage.getItem('token');
    return {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`,
    };
  }

  // Admin authentication
  async login(email: string, password: string): Promise<any> {
    // For admin access, use the bypass token since admin auth is not fully implemented
    if (email === 'admin@doohgle.com' && password === 'Admin@2025') {
      const adminToken = 'admin-token-doohgle';
      const adminUser = {
        id: 999,
        email: 'admin@doohgle.com',
        roles: ['admin']
      };
      
      localStorage.setItem('adminToken', adminToken);
      localStorage.setItem('adminUser', JSON.stringify(adminUser));
      
      return { token: adminToken, user: adminUser };
    }
    
    // For other users, try regular auth
    const response = await fetch(`${this.baseUrl}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ email, password }),
    });

    if (!response.ok) {
      throw new Error(`Login failed: ${response.statusText}`);
    }

    const result = await response.json();
    
    if (result.token) {
      localStorage.setItem('adminToken', result.token);
      localStorage.setItem('adminUser', JSON.stringify(result.user));
    }

    return result;
  }

  // Logout
  logout(): void {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
  }

  // Check if user is logged in as admin
  isLoggedIn(): boolean {
    const token = localStorage.getItem('adminToken');
    const user = localStorage.getItem('adminUser');
    
    if (!token || !user) return false;
    
    try {
      const userData = JSON.parse(user);
      return userData.roles?.includes('admin') || userData.id === 999;
    } catch {
      return false;
    }
  }

  // Get dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    const response = await fetch(`${this.baseUrl}/admin/dashboard/stats`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch dashboard stats: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Get all screens for admin
  async getAllScreens(): Promise<AdminScreen[]> {
    const response = await fetch(`${this.baseUrl}/admin/screens`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch screens: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Update screen status (approve/reject)
  async updateScreenStatus(screenId: number, isActive: boolean, adminNotes?: string): Promise<any> {
    const response = await fetch(`${this.baseUrl}/admin/screens/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({
        screen_id: screenId,
        is_active: isActive,
        admin_notes: adminNotes,
      }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update screen status: ${response.statusText}`);
    }

    return response.json();
  }

  // Get all booking requests for admin
  async getAllBookingRequests(): Promise<AdminBookingRequest[]> {
    const response = await fetch(`${this.baseUrl}/admin/bookings`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch booking requests: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Get revenue analytics
  async getRevenueAnalytics(): Promise<RevenueAnalytics> {
    const response = await fetch(`${this.baseUrl}/admin/analytics/revenue`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch revenue analytics: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Update booking status
  async updateBookingStatus(bookingId: string, status: string, adminNotes?: string): Promise<AdminBookingRequest> {
    const response = await fetch(`${this.baseUrl}/admin/bookings/${bookingId}/status`, {
      method: 'PATCH',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ status, adminNotes }),
    });

    if (!response.ok) {
      throw new Error(`Failed to update booking status: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Delete booking request
  async deleteBookingRequest(bookingId: string): Promise<void> {
    const response = await fetch(`${this.baseUrl}/admin/bookings/${bookingId}`, {
      method: 'DELETE',
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to delete booking: ${response.statusText}`);
    }
  }

  // Get booking details
  async getBookingDetails(bookingId: string): Promise<{booking: AdminBookingRequest, logs: any[]}> {
    const response = await fetch(`${this.baseUrl}/admin/bookings/${bookingId}`, {
      headers: this.getAuthHeaders(),
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch booking details: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }

  // Bulk update bookings
  async bulkUpdateBookings(bookingIds: string[], action: string, adminNotes?: string): Promise<any[]> {
    const response = await fetch(`${this.baseUrl}/admin/bookings/bulk-action`, {
      method: 'POST',
      headers: this.getAuthHeaders(),
      body: JSON.stringify({ bookingIds, action, adminNotes }),
    });

    if (!response.ok) {
      throw new Error(`Failed to perform bulk action: ${response.statusText}`);
    }

    const result = await response.json();
    return result.data;
  }
}

export const adminService = new AdminService();
export type { DashboardStats, AdminScreen, AdminBookingRequest, RevenueAnalytics };
