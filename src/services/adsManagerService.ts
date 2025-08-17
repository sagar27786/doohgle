// API Service for Ads Manager - Backend Integration
const API_BASE_URL = "http://localhost:4000/api";

// Fetch wrapper with auth handling
async function apiRequest(endpoint: string, options: RequestInit = {}) {
  const token = localStorage.getItem("token");
  
  const config: RequestInit = {
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers || {}),
    },
    ...options,
  };

  try {
    const response = await fetch(`${API_BASE_URL}${endpoint}`, config);
    
    if (response.status === 401) {
      // Clear stored auth data
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      if (typeof window !== "undefined") {
        window.location.href = "/auth/login";
      }
      throw new Error("Unauthorized");
    }

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  } catch (error) {
    throw error;
  }
}

// API Response Types
export interface Screen {
  id: number;
  name: string;
  description: string;
  screen_type: string;
  location_name: string;
  address: string;
  city: string;
  state: string;
  latitude: number;
  longitude: number;
  screen_size_width: number;
  screen_size_height: number;
  resolution_width: number;
  resolution_height: number;
  daily_footfall: number;
  vehicle_count: number;
  peak_hours: string;
  demographics: string;
  cost_per_10_seconds: number;
  image_url?: string;
  video_url?: string;
  is_active: boolean;
  price_per_day?: number;
  price_per_hour?: number;
  price_per_week?: number;
  traffic_estimate?: number;
}

export interface Campaign {
  id: number;
  user_id: number;
  name: string;
  description: string;
  start_date: string;
  end_date: string;
  budget: number;
  target_audience: string;
  status: "active" | "paused" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  screens_count?: number;
  total_impressions?: number;
  total_clicks?: number;
  total_spent?: number;
}

export interface CampaignAnalytics {
  daily_analytics: Array<{
    date: string;
    impressions: number;
    clicks: number;
    plays: number;
    cost: number;
    ctr: number;
  }>;
  summary: {
    total_impressions: number;
    total_clicks: number;
    total_plays: number;
    total_spent: number;
    avg_daily_impressions: number;
    overall_ctr: number;
  };
  screen_performance: Array<{
    id: number;
    location_name: string;
    screen_type: string;
    city: string;
    impressions: number;
    clicks: number;
    plays: number;
    cost: number;
    ctr: number;
  }>;
  hourly_performance: Array<{
    hour: number;
    total_impressions: number;
    total_clicks: number;
  }>;
}

export interface BudgetEstimate {
  subtotal: number;
  platformFee: number;
  taxes: number;
  grandTotal: number;
  days: number;
  totalScreens: number;
  breakdown: Array<{
    screenId: number;
    screenName: string;
    dailyCost: number;
    totalCost: number;
  }>;
}

// API Service Class
class AdsManagerAPI {
  // 🔍 SCREEN SEARCH & DISCOVERY
  async searchScreens(params: {
    city?: string;
    location?: string;
    screenType?: string;
    minPrice?: number;
    maxPrice?: number;
    minFootfall?: number;
    latitude?: number;
    longitude?: number;
    radius?: number;
    page?: number;
    limit?: number;
  }) {
    const queryParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined) {
        queryParams.append(key, value.toString());
      }
    });
    const response = await apiRequest(`/campaigns/screens/search?${queryParams.toString()}`);
    return response;
  }

  async getAllScreens() {
    const response = await apiRequest("/screens");
    return response;
  }

  async getScreenDetails(screenId: number) {
    const response = await apiRequest(`/screens/${screenId}`);
    return response;
  }

  async getCitiesList() {
    const response = await apiRequest("/campaigns/cities");
    return response;
  }

  async getFilterOptions() {
    const response = await apiRequest("/campaigns/filters");
    return response;
  }

  async getAvailableTimeSlots(screenId: number, date: string) {
    const queryParams = new URLSearchParams({ 
      screenId: screenId.toString(), 
      date: date 
    });
    const response = await apiRequest(`/campaigns/screens/availability?${queryParams}`);
    return response;
  }

  // 💰 BUDGET & PRICING
  async estimateBudget(data: {
    screenIds: number[];
    startDate: string;
    endDate: string;
    timeSlots: string[];
  }): Promise<BudgetEstimate> {
    const response = await apiRequest("/campaigns/estimate-budget", {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  }

  // 🎯 CAMPAIGN MANAGEMENT
  async createCampaign(data: {
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    budget: number;
    targetAudience: string;
    selectedScreens: Array<{
      screenId: number;
      timeSlots: string[];
    }>;
    creatives: Array<{
      fileUrl: string;
      fileType: string;
      fileSize: number;
      duration?: number;
    }>;
  }) {
    const response = await apiRequest("/campaigns", {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  }

  async getUserCampaigns(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    if (params) {
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined) {
          queryParams.append(key, value.toString());
        }
      });
      const response = await apiRequest(`/campaigns?${queryParams.toString()}`);
      return response;
    } else {
      const response = await apiRequest("/campaigns");
      return response;
    }
  }

  async updateCampaignStatus(campaignId: number, status: string) {
    const response = await apiRequest(`/campaigns/${campaignId}/status`, {
      method: 'PUT',
      body: JSON.stringify({ status })
    });
    return response;
  }

  async deleteCampaign(campaignId: number) {
    const response = await apiRequest(`/campaigns/${campaignId}`, {
      method: 'DELETE'
    });
    return response;
  }

  // 📊 ANALYTICS & TRACKING
  async getCampaignTracking(campaignId: number) {
    const response = await apiRequest(`/campaigns/${campaignId}/tracking`);
    return response;
  }

  async getCampaignAnalytics(
    campaignId: number,
    days: number = 30
  ): Promise<CampaignAnalytics> {
    const queryParams = new URLSearchParams({ days: days.toString() });
    const response = await apiRequest(`/campaigns/${campaignId}/analytics?${queryParams}`);
    return response;
  }

  async getProofOfPlay(campaignId: number) {
    const response = await apiRequest(`/campaigns/${campaignId}/proof-of-play`);
    return response;
  }

  // 💳 PAYMENT PROCESSING
  async processPayment(
    campaignId: number,
    data: {
      paymentMethod: "upi" | "card" | "netbanking";
      amount: number;
      paymentDetails: any;
    }
  ) {
    const response = await apiRequest(`/campaigns/${campaignId}/payment`, {
      method: 'POST',
      body: JSON.stringify(data)
    });
    return response;
  }

  // 🏥 HEALTH CHECK
  async healthCheck() {
    const response = await apiRequest("/health");
    return response;
  }
}

// Export singleton instance
export const adsManagerAPI = new AdsManagerAPI();

// Sample data generator for fallback when API is unavailable
export function generateSampleScreens() {
  return [
    {
      id: 1,
      name: "Times Square Mall LED",
      description: "Prime location LED screen at Times Square Mall with high footfall",
      screen_type: "LED",
      location_name: "Times Square Mall",
      address: "SV Road, Andheri West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      latitude: 19.1136,
      longitude: 72.8697,
      screen_size_width: 10,
      screen_size_height: 20,
      resolution_width: 1920,
      resolution_height: 1080,
      daily_footfall: 25000,
      vehicle_count: 15000,
      peak_hours: "18:00-21:00",
      demographics: "Urban professionals, families, shoppers",
      cost_per_10_seconds: 50,
      image_url: "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1926&q=80",
      is_active: true,
      price_per_day: 8000,
      price_per_hour: 500,
      price_per_week: 45000,
      traffic_estimate: 25000
    },
    {
      id: 2,
      name: "CP Metro Station Digital",
      description: "High-traffic digital display at Connaught Place Metro Station",
      screen_type: "Digital",
      location_name: "Connaught Place Metro",
      address: "Connaught Place, New Delhi",
      city: "Delhi",
      state: "Delhi",
      latitude: 28.6315,
      longitude: 77.2167,
      screen_size_width: 8,
      screen_size_height: 12,
      resolution_width: 1920,
      resolution_height: 1080,
      daily_footfall: 45000,
      vehicle_count: 25000,
      peak_hours: "08:00-10:00, 18:00-20:00",
      demographics: "Commuters, office workers, students",
      cost_per_10_seconds: 75,
      image_url: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      is_active: true,
      price_per_day: 12000,
      price_per_hour: 750,
      price_per_week: 70000,
      traffic_estimate: 45000
    },
    {
      id: 3,
      name: "Brigade Road Billboard",
      description: "Traditional billboard on busy Brigade Road shopping street",
      screen_type: "Billboard",
      location_name: "Brigade Road",
      address: "Brigade Road, Bangalore",
      city: "Bangalore",
      state: "Karnataka",
      latitude: 12.9716,
      longitude: 77.5946,
      screen_size_width: 15,
      screen_size_height: 25,
      resolution_width: 0,
      resolution_height: 0,
      daily_footfall: 35000,
      vehicle_count: 20000,
      peak_hours: "19:00-22:00",
      demographics: "Young professionals, shoppers, tourists",
      cost_per_10_seconds: 30,
      image_url: "https://images.unsplash.com/photo-1449824913935-59a10b8d2000?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      is_active: true,
      price_per_day: 6000,
      price_per_hour: 350,
      price_per_week: 35000,
      traffic_estimate: 35000
    },
    {
      id: 4,
      name: "Phoenix Mall LCD Display",
      description: "Indoor LCD display at Phoenix Mall food court",
      screen_type: "LCD",
      location_name: "Phoenix Mall",
      address: "Phoenix Mall, Kurla West, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      latitude: 19.0728,
      longitude: 72.8826,
      screen_size_width: 6,
      screen_size_height: 8,
      resolution_width: 1920,
      resolution_height: 1080,
      daily_footfall: 18000,
      vehicle_count: 0,
      peak_hours: "12:00-15:00, 18:00-21:00",
      demographics: "Families, food enthusiasts, mall visitors",
      cost_per_10_seconds: 25,
      image_url: "https://images.unsplash.com/photo-1441986300917-64674bd600d8?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80",
      is_active: true,
      price_per_day: 4500,
      price_per_hour: 300,
      price_per_week: 25000,
      traffic_estimate: 18000
    },
    {
      id: 5,
      name: "Airport Terminal LED Wall",
      description: "Large LED wall at Chennai Airport departure terminal",
      screen_type: "LED",
      location_name: "Chennai Airport",
      address: "Chennai International Airport, Chennai",
      city: "Chennai",
      state: "Tamil Nadu",
      latitude: 12.9941,
      longitude: 80.1709,
      screen_size_width: 12,
      screen_size_height: 18,
      resolution_width: 2560,
      resolution_height: 1440,
      daily_footfall: 30000,
      vehicle_count: 5000,
      peak_hours: "06:00-09:00, 17:00-20:00",
      demographics: "Business travelers, tourists, international audience",
      cost_per_10_seconds: 100,
      image_url: "https://images.unsplash.com/photo-1436491865332-7a61a109cc05?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80",
      is_active: true,
      price_per_day: 15000,
      price_per_hour: 1000,
      price_per_week: 90000,
      traffic_estimate: 30000
    },
    {
      id: 6,
      name: "Highway Digital Billboard",
      description: "Digital billboard on Mumbai-Pune highway with high visibility",
      screen_type: "Digital",
      location_name: "Mumbai-Pune Highway",
      address: "NH-48, Panvel, Mumbai",
      city: "Mumbai",
      state: "Maharashtra",
      latitude: 18.9894,
      longitude: 73.1175,
      screen_size_width: 20,
      screen_size_height: 30,
      resolution_width: 1920,
      resolution_height: 1080,
      daily_footfall: 0,
      vehicle_count: 80000,
      peak_hours: "07:00-10:00, 17:00-20:00",
      demographics: "Commuters, long-distance travelers, truck drivers",
      cost_per_10_seconds: 40,
      image_url: "https://images.unsplash.com/photo-1494515843206-f3117c992dee?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2106&q=80",
      is_active: true,
      price_per_day: 10000,
      price_per_hour: 600,
      price_per_week: 60000,
      traffic_estimate: 80000
    }
  ];
}

// Export individual functions for easier imports
export const {
  searchScreens,
  getAllScreens,
  getScreenDetails,
  getCitiesList,
  getFilterOptions,
  getAvailableTimeSlots,
  estimateBudget,
  createCampaign,
  getUserCampaigns,
  updateCampaignStatus,
  deleteCampaign,
  getCampaignTracking,
  getCampaignAnalytics,
  getProofOfPlay,
  processPayment,
  healthCheck,
} = adsManagerAPI;
