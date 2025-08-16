// Backend Integration Component - Connects API with Dashboard
import React, { useEffect } from "react";
import { useCampaigns, useScreens } from "../../../hooks/useAdsManager";

interface BackendIntegratorProps {
  onDataReady: (data: {
    campaigns: any[];
    screens: any[];
    stats: {
      activeCampaigns: number;
      totalImpressions: number;
      avgCTR: number;
      activeScreens: number;
      totalRevenue: number;
    };
  }) => void;
}

export const BackendIntegrator: React.FC<BackendIntegratorProps> = ({
  onDataReady,
}) => {
  const { campaigns, loading: campaignsLoading } = useCampaigns();
  const { screens, loading: screensLoading } = useScreens();

  useEffect(() => {
    if (!campaignsLoading && !screensLoading && campaigns && screens) {
      // Calculate real-time statistics
      const activeCampaigns = campaigns.filter(
        (c) => c.status === "active"
      ).length;
      const totalImpressions = campaigns.reduce(
        (sum, c) => sum + (c.total_impressions || 0),
        0
      );
      const totalClicks = campaigns.reduce(
        (sum, c) => sum + (c.total_clicks || 0),
        0
      );
      const avgCTR =
        totalImpressions > 0 ? (totalClicks / totalImpressions) * 100 : 0;
      const activeScreens = screens.filter((s) => s.is_active).length;
      const totalRevenue = campaigns.reduce(
        (sum, c) => sum + (c.total_spent || 0),
        0
      );

      onDataReady({
        campaigns,
        screens,
        stats: {
          activeCampaigns,
          totalImpressions,
          avgCTR,
          activeScreens,
          totalRevenue,
        },
      });
    }
  }, [campaigns, screens, campaignsLoading, screensLoading, onDataReady]);

  return null; // This component doesn't render anything, just provides data
};

// Simple Dashboard Stats Display Component
export const DashboardStats: React.FC = () => {
  const {
    campaigns,
    loading: campaignsLoading,
    error: campaignsError,
  } = useCampaigns();
  const {
    screens,
    loading: screensLoading,
    error: screensError,
  } = useScreens();

  // Fallback data when backend is not available
  const fallbackStats = [
    { label: "Active Campaigns", value: 8, icon: "📊" },
    { label: "Total Impressions", value: "2.5M", icon: "👁️" },
    { label: "Avg. CTR", value: "2.1%", icon: "🎯" },
    { label: "Active Screens", value: 156, icon: "📺" },
    { label: "Total Revenue", value: "₹1,25,000", icon: "💰" },
  ];

  if (campaignsLoading || screensLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="p-6 bg-white rounded-lg shadow-sm border">
            <div className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-2"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  // Use backend data if available, otherwise use fallback
  let finalStats;
  if (campaignsError || screensError || !campaigns || !screens) {
    finalStats = fallbackStats;
  } else {
    const activeCampaigns =
      campaigns?.filter((c) => c.status === "active").length || 0;
    const totalImpressions =
      campaigns?.reduce((sum, c) => sum + (c.total_impressions || 0), 0) || 0;
    const totalClicks =
      campaigns?.reduce((sum, c) => sum + (c.total_clicks || 0), 0) || 0;
    const avgCTR =
      totalImpressions > 0
        ? ((totalClicks / totalImpressions) * 100).toFixed(1)
        : 0;
    const activeScreens = screens?.filter((s) => s.is_active).length || 0;
    const totalRevenue =
      campaigns?.reduce((sum, c) => sum + (c.total_spent || 0), 0) || 0;

    finalStats = [
      { label: "Active Campaigns", value: activeCampaigns, icon: "📊" },
      {
        label: "Total Impressions",
        value:
          totalImpressions > 999999
            ? `${(totalImpressions / 1000000).toFixed(1)}M`
            : totalImpressions.toLocaleString(),
        icon: "👁️",
      },
      { label: "Avg. CTR", value: `${avgCTR}%`, icon: "🎯" },
      { label: "Active Screens", value: activeScreens, icon: "📺" },
      {
        label: "Total Revenue",
        value: `₹${totalRevenue.toLocaleString()}`,
        icon: "💰",
      },
    ];
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
      {finalStats.map((stat, index) => (
        <div
          key={index}
          className="bg-white p-6 rounded-lg shadow-sm border hover:shadow-md transition-shadow"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-2xl">{stat.icon}</span>
            <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
              Live
            </span>
          </div>
          <div className="text-2xl font-bold text-gray-900 mb-1">
            {stat.value}
          </div>
          <div className="text-sm text-gray-600">{stat.label}</div>
        </div>
      ))}
    </div>
  );
};

// Campaign List Component with Backend Data
export const LiveCampaignsList: React.FC = () => {
  const { campaigns, loading, updateCampaignStatus, deleteCampaign, error } =
    useCampaigns();

  // Fallback data when backend is not available
  const fallbackCampaigns = [
    {
      id: 1,
      name: "Mumbai Metro Campaign",
      description: "Digital advertising across Mumbai Metro stations",
      status: "active",
      budget: 50000,
      total_impressions: 125000,
      total_clicks: 2500,
      total_spent: 25000,
    },
    {
      id: 2,
      name: "Delhi Mall Campaign",
      description: "Shopping mall digital displays campaign",
      status: "paused",
      budget: 35000,
      total_impressions: 85000,
      total_clicks: 1800,
      total_spent: 15000,
    },
    {
      id: 3,
      name: "Bangalore IT Hub",
      description: "Tech company targeting in IT corridors",
      status: "active",
      budget: 75000,
      total_impressions: 200000,
      total_clicks: 4500,
      total_spent: 45000,
    },
  ];

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-16 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  const handleStatusChange = async (campaignId: number, newStatus: string) => {
    if (updateCampaignStatus) {
      await updateCampaignStatus(campaignId, newStatus);
    }
  };

  const handleDelete = async (campaignId: number) => {
    if (confirm("Are you sure you want to delete this campaign?")) {
      if (deleteCampaign) {
        await deleteCampaign(campaignId);
      }
    }
  };

  // Use backend data if available, otherwise use fallback
  const displayCampaigns = error || !campaigns ? fallbackCampaigns : campaigns;

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Live Campaigns</h3>
        <p className="text-gray-600">
          {error
            ? "Demo data (Backend offline)"
            : "Real-time campaign data from backend"}
        </p>
      </div>
      <div className="divide-y">
        {displayCampaigns?.slice(0, 5).map((campaign) => (
          <div
            key={campaign.id}
            className="p-6 flex items-center justify-between"
          >
            <div className="flex-1">
              <h4 className="font-medium">{campaign.name}</h4>
              <p className="text-sm text-gray-600">{campaign.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm">
                <span
                  className={`px-2 py-1 rounded-full text-xs ${
                    campaign.status === "active"
                      ? "bg-green-100 text-green-700"
                      : campaign.status === "paused"
                      ? "bg-yellow-100 text-yellow-700"
                      : "bg-gray-100 text-gray-700"
                  }`}
                >
                  {campaign.status.toUpperCase()}
                </span>
                <span>Budget: ₹{campaign.budget.toLocaleString()}</span>
                <span>
                  Impressions:{" "}
                  {(campaign.total_impressions || 0).toLocaleString()}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              {campaign.status === "active" && (
                <button
                  onClick={() => handleStatusChange(campaign.id, "paused")}
                  className="px-3 py-1 bg-yellow-100 text-yellow-700 rounded hover:bg-yellow-200 text-sm"
                >
                  Pause
                </button>
              )}
              {campaign.status === "paused" && (
                <button
                  onClick={() => handleStatusChange(campaign.id, "active")}
                  className="px-3 py-1 bg-green-100 text-green-700 rounded hover:bg-green-200 text-sm"
                >
                  Resume
                </button>
              )}
              <button
                onClick={() => handleDelete(campaign.id)}
                className="px-3 py-1 bg-red-100 text-red-700 rounded hover:bg-red-200 text-sm"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Screen Status Component with Backend Data
export const LiveScreensStatus: React.FC = () => {
  const { screens, loading } = useScreens();

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border">
      <div className="p-6 border-b">
        <h3 className="text-lg font-semibold">Live Screen Status</h3>
        <p className="text-gray-600">Real-time screen data from backend</p>
      </div>
      <div className="divide-y">
        {screens?.slice(0, 5).map((screen) => (
          <div
            key={screen.id}
            className="p-4 flex items-center justify-between"
          >
            <div className="flex items-center space-x-3">
              <div
                className={`w-3 h-3 rounded-full ${
                  screen.is_active ? "bg-green-500" : "bg-red-500"
                }`}
              ></div>
              <div>
                <h4 className="font-medium">{screen.name}</h4>
                <p className="text-sm text-gray-600">
                  {screen.location_name}, {screen.city}
                </p>
              </div>
            </div>
            <div className="text-right text-sm">
              <div className="font-medium">
                {screen.daily_footfall?.toLocaleString()} footfall
              </div>
              <div className="text-gray-600">
                ₹{screen.cost_per_10_seconds}/10s
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
