// API Service for Ads Manager - Backend Integration
import axios from "axios";

const API_BASE_URL = "http://localhost:4001/api";

// Create axios instance with default config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add auth token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("authToken");
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

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
    const response = await api.get("/campaigns/screens/search", { params });
    return response.data;
  }

  async getAllScreens() {
    const response = await api.get("/screens");
    return response.data;
  }

  async getScreenDetails(screenId: number) {
    const response = await api.get(`/screens/${screenId}`);
    return response.data;
  }

  async getCitiesList() {
    const response = await api.get("/campaigns/cities");
    return response.data;
  }

  async getFilterOptions() {
    const response = await api.get("/campaigns/filters");
    return response.data;
  }

  async getAvailableTimeSlots(screenId: number, date: string) {
    const response = await api.get(`/campaigns/screens/availability`, {
      params: { screenId, date },
    });
    return response.data;
  }

  // 💰 BUDGET & PRICING
  async estimateBudget(data: {
    screenIds: number[];
    startDate: string;
    endDate: string;
    timeSlots: string[];
  }): Promise<BudgetEstimate> {
    const response = await api.post("/campaigns/estimate-budget", data);
    return (response.data as any).data;
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
    const response = await api.post("/campaigns", data);
    return response.data;
  }

  async getUserCampaigns(params?: {
    status?: string;
    page?: number;
    limit?: number;
  }) {
    const response = await api.get("/campaigns", { params });
    return response.data;
  }

  async updateCampaignStatus(campaignId: number, status: string) {
    const response = await api.put(`/campaigns/${campaignId}/status`, {
      status,
    });
    return response.data;
  }

  async deleteCampaign(campaignId: number) {
    const response = await api.delete(`/campaigns/${campaignId}`);
    return response.data;
  }

  // 📊 ANALYTICS & TRACKING
  async getCampaignTracking(campaignId: number) {
    const response = await api.get(`/campaigns/${campaignId}/tracking`);
    return response.data;
  }

  async getCampaignAnalytics(
    campaignId: number,
    days: number = 30
  ): Promise<CampaignAnalytics> {
    const response = await api.get(`/campaigns/${campaignId}/analytics`, {
      params: { days },
    });
    return (response.data as any).data;
  }

  async getProofOfPlay(campaignId: number) {
    const response = await api.get(`/campaigns/${campaignId}/proof-of-play`);
    return response.data;
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
    const response = await api.post(`/campaigns/${campaignId}/payment`, data);
    return response.data;
  }

  // 🏥 HEALTH CHECK
  async healthCheck() {
    const response = await api.get("/health");
    return response.data;
  }
}

// Export singleton instance
export const adsManagerAPI = new AdsManagerAPI();

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
