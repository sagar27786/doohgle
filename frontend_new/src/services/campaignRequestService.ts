import api from "./api";

export interface CampaignRequestData {
  screen_id: number;
  campaign_name: string;
  campaign_description?: string;
  start_date: string;
  end_date: string;
  requested_hours?: number[];
  budget_offered: number;
  creative_assets?: any[];
  target_audience?: string;
  notes?: string;
}

export interface CampaignRequest {
  id: number;
  advertiser_id: number;
  venue_owner_id: number;
  screen_id: number;
  screen_name: string;
  screen_location: string;
  screen_city: string;
  campaign_name: string;
  campaign_description: string;
  start_date: string;
  end_date: string;
  requested_hours: number[];
  budget_offered: number;
  creative_assets: any[];
  target_audience: string;
  notes: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
  updated_at: string;
  advertiser_name?: string;
  advertiser_email?: string;
  venue_owner_name?: string;
  venue_owner_email?: string;
  rejection_reason?: string;
}

export interface Notification {
  id: number;
  user_id: number;
  type: string;
  title: string;
  message: string;
  related_id?: number;
  is_read: boolean;
  created_at: string;
}

export const campaignRequestService = {
  // Create new campaign request (Advertiser)
  async createRequest(
    data: CampaignRequestData
  ): Promise<{ success: boolean; data: CampaignRequest; message: string }> {
    const response = await api.post("/campaign-requests/requests", data);
    return response.data as {
      success: boolean;
      data: CampaignRequest;
      message: string;
    };
  },

  // Get my sent requests (Advertiser)
  async getMyRequests(): Promise<{
    success: boolean;
    data: CampaignRequest[];
  }> {
    const response = await api.get("/campaign-requests/requests/sent");
    return response.data as { success: boolean; data: CampaignRequest[] };
  },

  // Get incoming requests (Venue Owner)
  async getIncomingRequests(): Promise<{
    success: boolean;
    data: CampaignRequest[];
  }> {
    const response = await api.get("/campaign-requests/requests/incoming");
    return response.data as { success: boolean; data: CampaignRequest[] };
  },

  // Get specific campaign request
  async getRequest(
    id: number
  ): Promise<{ success: boolean; data: CampaignRequest }> {
    const response = await api.get(`/campaign-requests/requests/${id}`);
    return response.data as { success: boolean; data: CampaignRequest };
  },

  // Approve campaign request (Venue Owner)
  async approveRequest(
    id: number
  ): Promise<{ success: boolean; message: string; data: any }> {
    const response = await api.post(
      `/campaign-requests/requests/${id}/approve`
    );
    return response.data as { success: boolean; message: string; data: any };
  },

  // Reject campaign request (Venue Owner)
  async rejectRequest(
    id: number,
    rejection_reason?: string
  ): Promise<{ success: boolean; message: string; data: any }> {
    const response = await api.post(
      `/campaign-requests/requests/${id}/reject`,
      {
        rejection_reason,
      }
    );
    return response.data as { success: boolean; message: string; data: any };
  },

  // Get notifications
  async getNotifications(params?: {
    limit?: number;
    offset?: number;
    unread_only?: boolean;
  }): Promise<{
    success: boolean;
    data: Notification[];
    unread_count: number;
  }> {
    const response = await api.get("/campaign-requests/notifications", {
      params,
    });
    return response.data as {
      success: boolean;
      data: Notification[];
      unread_count: number;
    };
  },

  // Mark notification as read
  async markNotificationRead(
    id: number
  ): Promise<{ success: boolean; message: string }> {
    const response = await api.patch(
      `/campaign-requests/notifications/${id}/read`
    );
    return response.data as { success: boolean; message: string };
  },

  // Helper: Format hours array for display
  formatRequestedHours(hours: number[]): string {
    if (!hours || hours.length === 0) return "All day";

    const sortedHours = hours.sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sortedHours[0];
    let end = start;

    for (let i = 1; i < sortedHours.length; i++) {
      if (sortedHours[i] === end + 1) {
        end = sortedHours[i];
      } else {
        ranges.push(
          start === end ? `${start}:00` : `${start}:00-${end + 1}:00`
        );
        start = sortedHours[i];
        end = start;
      }
    }
    ranges.push(start === end ? `${start}:00` : `${start}:00-${end + 1}:00`);

    return ranges.join(", ");
  },

  // Helper: Calculate campaign duration
  calculateDuration(start_date: string, end_date: string): string {
    const start = new Date(start_date);
    const end = new Date(end_date);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return "1 day";
    if (diffDays < 7) return `${diffDays} days`;
    if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks`;
    return `${Math.floor(diffDays / 30)} months`;
  },

  // Helper: Format budget
  formatBudget(amount: number): string {
    if (amount >= 100000) {
      return `₹${(amount / 100000).toFixed(1)}L`;
    }
    if (amount >= 1000) {
      return `₹${(amount / 1000).toFixed(1)}K`;
    }
    return `₹${amount}`;
  },
};
