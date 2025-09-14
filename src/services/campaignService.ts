import { awsCloudWatchService, CampaignMetrics } from "./awsCloudWatchService";

// Campaign types
export interface Campaign {
  id: number;
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  status: "active" | "paused" | "completed" | "draft" | "scheduled";
  screenIds: number[];
  impressions: number;
  views: number;
  clicks: number;
  ctr: number;
  cost: number;
  roi: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateCampaignPayload {
  name: string;
  description: string;
  budget: number;
  startDate: string;
  endDate: string;
  screenIds: number[];
  targetAudience?: string;
  creativeAssets?: string[];
}

class CampaignService {
  private baseUrl = `${import.meta.env.VITE_API_URL || 'https://doohgle-backend.onrender.com/api'}/campaigns`;

  // Get all campaigns with real-time AWS data
  public async getCampaigns(): Promise<Campaign[]> {
    try {
      const response = await fetch(this.baseUrl);
      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to fetch campaigns");
      }

      // Enhance campaigns with real-time AWS metrics
      const campaigns: Campaign[] = data.data;
      const enhancedCampaigns = await Promise.all(
        campaigns.map(async (campaign) => {
          try {
            // Get real-time metrics from AWS
            if (
              awsCloudWatchService.isConfigured() &&
              campaign.screenIds?.length > 0
            ) {
              const metrics = await awsCloudWatchService.getCampaignMetrics(
                campaign.id,
                campaign.screenIds
              );

              return {
                ...campaign,
                impressions: metrics.totalImpressions,
                views: metrics.totalViews,
                clicks: metrics.totalClicks,
                ctr: metrics.ctr,
                cost: metrics.cost,
                roi: metrics.roi,
                updatedAt: new Date().toISOString(),
              };
            }
            return campaign;
          } catch (error) {
            console.warn(
              `Failed to fetch AWS metrics for campaign ${campaign.id}:`,
              error
            );
            return campaign;
          }
        })
      );

      return enhancedCampaigns;
    } catch (error) {
      console.error("Failed to fetch campaigns:", error);
      return [];
    }
  }

  // Create a new campaign
  public async createCampaign(
    payload: CreateCampaignPayload
  ): Promise<Campaign> {
    try {
      const response = await fetch(this.baseUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to create campaign");
      }

      return data.data;
    } catch (error) {
      console.error("Failed to create campaign:", error);
      throw error;
    }
  }

  // Update campaign status
  public async updateCampaignStatus(
    campaignId: number,
    status: Campaign["status"]
  ): Promise<Campaign> {
    try {
      const response = await fetch(`${this.baseUrl}/${campaignId}/status`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify({ status }),
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to update campaign status");
      }

      return data.data;
    } catch (error) {
      console.error("Failed to update campaign status:", error);
      throw error;
    }
  }

  // Delete campaign
  public async deleteCampaign(campaignId: number): Promise<void> {
    try {
      const response = await fetch(`${this.baseUrl}/${campaignId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });

      const data = await response.json();

      if (!data.success) {
        throw new Error(data.message || "Failed to delete campaign");
      }
    } catch (error) {
      console.error("Failed to delete campaign:", error);
      throw error;
    }
  }

  // Get campaign metrics with AWS integration
  public async getCampaignMetrics(
    campaignId: number
  ): Promise<CampaignMetrics | null> {
    try {
      // First get campaign details
      const campaigns = await this.getCampaigns();
      const campaign = campaigns.find((c) => c.id === campaignId);

      if (!campaign || !campaign.screenIds?.length) {
        return null;
      }

      // Get real-time metrics from AWS
      if (awsCloudWatchService.isConfigured()) {
        return await awsCloudWatchService.getCampaignMetrics(
          campaignId,
          campaign.screenIds
        );
      }

      return null;
    } catch (error) {
      console.error("Failed to fetch campaign metrics:", error);
      return null;
    }
  }

  // Get campaign dashboard statistics
  public async getDashboardStats(): Promise<{
    totalCampaigns: number;
    activeCampaigns: number;
    totalBudget: number;
    totalSpent: number;
    avgROI: number;
    topPerformingCampaign: Campaign | null;
  }> {
    try {
      const campaigns = await this.getCampaigns();

      const totalCampaigns = campaigns.length;
      const activeCampaigns = campaigns.filter(
        (c) => c.status === "active"
      ).length;
      const totalBudget = campaigns.reduce((sum, c) => sum + c.budget, 0);
      const totalSpent = campaigns.reduce((sum, c) => sum + c.cost, 0);
      const avgROI =
        campaigns.length > 0
          ? campaigns.reduce((sum, c) => sum + c.roi, 0) / campaigns.length
          : 0;

      const topPerformingCampaign =
        campaigns.length > 0
          ? campaigns.reduce((best, current) =>
              current.roi > best.roi ? current : best
            )
          : null;

      return {
        totalCampaigns,
        activeCampaigns,
        totalBudget,
        totalSpent,
        avgROI,
        topPerformingCampaign,
      };
    } catch (error) {
      console.error("Failed to fetch dashboard stats:", error);
      return {
        totalCampaigns: 0,
        activeCampaigns: 0,
        totalBudget: 0,
        totalSpent: 0,
        avgROI: 0,
        topPerformingCampaign: null,
      };
    }
  }

  // Mock campaigns for fallback
}

export const campaignService = new CampaignService();
export default campaignService;
