import {
  CloudWatchClient,
  GetMetricStatisticsCommand,
} from "@aws-sdk/client-cloudwatch";

// AWS Configuration types
interface AWSCredentials {
  accessKeyId: string;
  secretAccessKey: string;
  region: string;
}

// Real-time statistics types
export interface ScreenMetrics {
  screenId: number;
  impressions: number;
  views: number;
  ctr: number;
  engagement: number;
  status: "active" | "inactive" | "maintenance";
  lastUpdated: Date;
}

export interface CampaignMetrics {
  campaignId: number;
  totalImpressions: number;
  totalViews: number;
  totalClicks: number;
  ctr: number;
  reach: number;
  frequency: number;
  cost: number;
  roi: number;
  screens: ScreenMetrics[];
}

class AWSCloudWatchService {
  private cloudWatchClient: CloudWatchClient | null = null;
  private credentials: AWSCredentials | null = null;

  // Initialize AWS credentials and client
  public setCredentials(credentials: AWSCredentials) {
    this.credentials = credentials;
    this.cloudWatchClient = new CloudWatchClient({
      region: credentials.region,
      credentials: {
        accessKeyId: credentials.accessKeyId,
        secretAccessKey: credentials.secretAccessKey,
      },
    });
  }

  // Check if service is configured
  public isConfigured(): boolean {
    return this.cloudWatchClient !== null && this.credentials !== null;
  }

  // Get real-time screen metrics
  public async getScreenMetrics(screenId: number): Promise<ScreenMetrics> {
    if (!this.cloudWatchClient) {
      throw new Error(
        "AWS CloudWatch not configured. Please set credentials first."
      );
    }

    try {
      const endTime = new Date();
      const startTime = new Date(endTime.getTime() - 60 * 60 * 1000); // Last hour

      // Get impressions metric
      const impressionsCommand = new GetMetricStatisticsCommand({
        Namespace: "DigitalAdvertising/Screens",
        MetricName: "Impressions",
        Dimensions: [
          {
            Name: "ScreenId",
            Value: screenId.toString(),
          },
        ],
        StartTime: startTime,
        EndTime: endTime,
        Period: 300, // 5 minutes
        Statistics: ["Sum"],
      });

      // Get views metric
      const viewsCommand = new GetMetricStatisticsCommand({
        Namespace: "DigitalAdvertising/Screens",
        MetricName: "Views",
        Dimensions: [
          {
            Name: "ScreenId",
            Value: screenId.toString(),
          },
        ],
        StartTime: startTime,
        EndTime: endTime,
        Period: 300,
        Statistics: ["Sum"],
      });

      // Get click-through rate metric
      const ctrCommand = new GetMetricStatisticsCommand({
        Namespace: "DigitalAdvertising/Screens",
        MetricName: "ClickThroughRate",
        Dimensions: [
          {
            Name: "ScreenId",
            Value: screenId.toString(),
          },
        ],
        StartTime: startTime,
        EndTime: endTime,
        Period: 300,
        Statistics: ["Average"],
      });

      const [impressionsResponse, viewsResponse, ctrResponse] =
        await Promise.all([
          this.cloudWatchClient.send(impressionsCommand),
          this.cloudWatchClient.send(viewsCommand),
          this.cloudWatchClient.send(ctrCommand),
        ]);

      const impressions =
        this.extractLatestValue(impressionsResponse.Datapoints || [], "Sum") ||
        0;
      const views =
        this.extractLatestValue(viewsResponse.Datapoints || [], "Sum") || 0;
      const ctr =
        this.extractLatestValue(ctrResponse.Datapoints || [], "Average") || 0;
      const engagement = views > 0 ? (ctr * impressions) / views : 0;

      return {
        screenId,
        impressions,
        views,
        ctr,
        engagement,
        status: this.determineScreenStatus(impressions, views),
        lastUpdated: new Date(),
      };
    } catch (error) {
      console.warn(
        `Failed to fetch real AWS metrics for screen ${screenId}:`,
        error
      );
      // Return mock data if AWS fails
      return this.getMockScreenMetrics(screenId);
    }
  }

  // Get campaign metrics across multiple screens
  public async getCampaignMetrics(
    campaignId: number,
    screenIds: number[]
  ): Promise<CampaignMetrics> {
    if (!this.cloudWatchClient) {
      throw new Error(
        "AWS CloudWatch not configured. Please set credentials first."
      );
    }

    try {
      // Fetch metrics for all screens in parallel
      const screenMetrics = await Promise.all(
        screenIds.map((screenId) => this.getScreenMetrics(screenId))
      );

      // Aggregate campaign totals
      const totalImpressions = screenMetrics.reduce(
        (sum, screen) => sum + screen.impressions,
        0
      );
      const totalViews = screenMetrics.reduce(
        (sum, screen) => sum + screen.views,
        0
      );
      const totalClicks = screenMetrics.reduce(
        (sum, screen) => sum + (screen.ctr * screen.impressions) / 100,
        0
      );
      const avgCtr =
        screenMetrics.length > 0
          ? screenMetrics.reduce((sum, screen) => sum + screen.ctr, 0) /
            screenMetrics.length
          : 0;

      // Calculate advanced metrics
      const reach = Math.floor(totalViews * 0.75); // Estimated unique viewers
      const frequency = reach > 0 ? totalViews / reach : 0;
      const cost = this.calculateCampaignCost(screenMetrics);
      const roi = this.calculateROI(totalClicks, cost);

      return {
        campaignId,
        totalImpressions,
        totalViews,
        totalClicks,
        ctr: avgCtr,
        reach,
        frequency,
        cost,
        roi,
        screens: screenMetrics,
      };
    } catch (error) {
      console.warn(
        `Failed to fetch real AWS metrics for campaign ${campaignId}:`,
        error
      );
      // Return mock data if AWS fails
      return this.getMockCampaignMetrics(campaignId, screenIds);
    }
  }

  // Real-time dashboard statistics
  public async getDashboardStats(): Promise<{
    activeScreens: number;
    totalImpressions: number;
    totalViews: number;
    averageCTR: number;
    topPerformingScreens: ScreenMetrics[];
  }> {
    try {
      // In a real implementation, you'd fetch all screens from your database
      const mockScreenIds = [1, 2, 3, 4, 5, 6, 7, 8];
      const screenMetrics = await Promise.all(
        mockScreenIds.map((id) => this.getScreenMetrics(id))
      );

      const activeScreens = screenMetrics.filter(
        (s) => s.status === "active"
      ).length;
      const totalImpressions = screenMetrics.reduce(
        (sum, screen) => sum + screen.impressions,
        0
      );
      const totalViews = screenMetrics.reduce(
        (sum, screen) => sum + screen.views,
        0
      );
      const averageCTR =
        screenMetrics.length > 0
          ? screenMetrics.reduce((sum, screen) => sum + screen.ctr, 0) /
            screenMetrics.length
          : 0;

      const topPerformingScreens = screenMetrics
        .sort((a, b) => b.engagement - a.engagement)
        .slice(0, 5);

      return {
        activeScreens,
        totalImpressions,
        totalViews,
        averageCTR,
        topPerformingScreens,
      };
    } catch (error) {
      console.warn("Failed to fetch dashboard stats:", error);
      return this.getMockDashboardStats();
    }
  }

  // Helper methods
  private extractLatestValue(
    datapoints: any[],
    statistic: string
  ): number | undefined {
    if (!datapoints || datapoints.length === 0) return undefined;

    const sortedPoints = datapoints.sort(
      (a, b) =>
        new Date(b.Timestamp).getTime() - new Date(a.Timestamp).getTime()
    );
    return sortedPoints[0]?.[statistic];
  }

  private determineScreenStatus(
    impressions: number,
    views: number
  ): "active" | "inactive" | "maintenance" {
    if (impressions === 0) return "maintenance";
    if (views < impressions * 0.1) return "inactive";
    return "active";
  }

  private calculateCampaignCost(screenMetrics: ScreenMetrics[]): number {
    // Mock calculation - in reality this would use actual billing data
    return screenMetrics.reduce(
      (cost, screen) => cost + screen.impressions * 0.05,
      0
    );
  }

  private calculateROI(clicks: number, cost: number): number {
    if (cost === 0) return 0;
    const revenue = clicks * 25; // Assume $25 value per click
    return ((revenue - cost) / cost) * 100;
  }

  // Mock data methods (fallback when AWS is not available)
  private getMockScreenMetrics(screenId: number): ScreenMetrics {
    const baseImpressions = Math.floor(Math.random() * 5000) + 1000;
    const baseViews = Math.floor(baseImpressions * (0.3 + Math.random() * 0.4));
    const ctr = Math.random() * 3 + 0.5; // 0.5% to 3.5%

    return {
      screenId,
      impressions: baseImpressions,
      views: baseViews,
      ctr: Number(ctr.toFixed(2)),
      engagement: Number((baseViews * (ctr / 100)).toFixed(0)),
      status:
        Math.random() > 0.1
          ? "active"
          : Math.random() > 0.5
          ? "inactive"
          : "maintenance",
      lastUpdated: new Date(),
    };
  }

  private getMockCampaignMetrics(
    campaignId: number,
    screenIds: number[]
  ): CampaignMetrics {
    const screenMetrics = screenIds.map((id) => this.getMockScreenMetrics(id));

    const totalImpressions = screenMetrics.reduce(
      (sum, screen) => sum + screen.impressions,
      0
    );
    const totalViews = screenMetrics.reduce(
      (sum, screen) => sum + screen.views,
      0
    );
    const avgCtr =
      screenMetrics.reduce((sum, screen) => sum + screen.ctr, 0) /
      screenMetrics.length;
    const totalClicks = totalImpressions * (avgCtr / 100);

    return {
      campaignId,
      totalImpressions,
      totalViews,
      totalClicks: Math.floor(totalClicks),
      ctr: Number(avgCtr.toFixed(2)),
      reach: Math.floor(totalViews * 0.75),
      frequency: Number((totalViews / (totalViews * 0.75)).toFixed(2)),
      cost: this.calculateCampaignCost(screenMetrics),
      roi: Number((Math.random() * 200 - 50).toFixed(2)), // -50% to 150% ROI
      screens: screenMetrics,
    };
  }

  private getMockDashboardStats() {
    return {
      activeScreens: Math.floor(Math.random() * 8) + 5,
      totalImpressions: Math.floor(Math.random() * 50000) + 25000,
      totalViews: Math.floor(Math.random() * 20000) + 10000,
      averageCTR: Number((Math.random() * 2 + 1).toFixed(2)),
      topPerformingScreens: Array.from({ length: 5 }, (_, i) =>
        this.getMockScreenMetrics(i + 1)
      ),
    };
  }
}

// Export singleton instance
export const awsCloudWatchService = new AWSCloudWatchService();
export default awsCloudWatchService;
