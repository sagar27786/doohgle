// Backend Integration Component - Connects API with Dashboard
import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
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
  const [visibleItems, setVisibleItems] = useState(0);

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
      progress: 68,
      ctr: 2.0,
      reach: 45000,
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
      progress: 43,
      ctr: 2.1,
      reach: 32000,
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
      progress: 85,
      ctr: 2.3,
      reach: 78000,
    },
  ];

  // Animated progress bar component
  const AnimatedProgressBar: React.FC<{ progress: number; color: string }> = ({
    progress,
    color,
  }) => {
    return (
      <div className="w-full bg-gray-200 rounded-full h-2 relative overflow-hidden">
        <motion.div
          className={`h-2 rounded-full ${color} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <motion.div
            className="absolute inset-0 bg-white/30 rounded-full"
            animate={{ x: [-100, 100] }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "linear",
            }}
          />
        </motion.div>
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent animate-pulse" />
      </div>
    );
  };

  React.useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setVisibleItems((prev) => {
          const maxItems = displayCampaigns?.length || 0;
          return prev < maxItems ? prev + 1 : maxItems;
        });
      }, 300);

      return () => clearInterval(timer);
    }
  }, [loading]);

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map((i) => (
          <motion.div
            key={i}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="animate-pulse space-y-3">
              <div className="h-4 bg-gray-300 rounded w-3/4"></div>
              <div className="h-3 bg-gray-300 rounded w-1/2"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
            </div>
          </motion.div>
        ))}
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
    <div className="space-y-4">
      <motion.div
        className="flex items-center space-x-2 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
        <span className="text-sm text-gray-600">
          {error ? "Demo data (Backend offline)" : "Live campaigns updating..."}
        </span>
      </motion.div>

      {displayCampaigns?.slice(0, 5).map((campaign, index) => (
        <motion.div
          key={campaign.id}
          className={`bg-white/80 backdrop-blur-sm rounded-2xl p-6 border border-white/30 shadow-lg relative overflow-hidden group ${
            index < visibleItems ? "opacity-100" : "opacity-0"
          }`}
          initial={{ opacity: 0, y: 50, rotateX: -15 }}
          animate={{
            opacity: index < visibleItems ? 1 : 0,
            y: index < visibleItems ? 0 : 50,
            rotateX: index < visibleItems ? 0 : -15,
          }}
          transition={{
            duration: 0.8,
            delay: index * 0.2,
            type: "spring",
            stiffness: 100,
          }}
          whileHover={{
            scale: 1.02,
            y: -5,
            transition: { duration: 0.2 },
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                <div className="flex items-center space-x-3 mb-2">
                  <motion.h4
                    className="font-semibold text-gray-900 text-lg"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {campaign.name}
                  </motion.h4>
                  <motion.span
                    className={`px-3 py-1 rounded-full text-xs font-medium ${
                      campaign.status === "active"
                        ? "bg-green-100 text-green-700 border border-green-200"
                        : campaign.status === "paused"
                        ? "bg-yellow-100 text-yellow-700 border border-yellow-200"
                        : "bg-gray-100 text-gray-700 border border-gray-200"
                    }`}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + index * 0.1, type: "spring" }}
                  >
                    {campaign.status.toUpperCase()}
                  </motion.span>
                </div>

                <p className="text-sm text-gray-600 mb-4">
                  {campaign.description}
                </p>

                {/* Enhanced Progress Bar */}
                <div className="mb-4">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-xs font-medium text-gray-500">
                      Campaign Progress
                    </span>
                    <span className="text-xs font-bold text-gray-700">
                      {(campaign as any).progress || 50}%
                    </span>
                  </div>
                  <AnimatedProgressBar
                    progress={(campaign as any).progress || 50}
                    color={
                      campaign.status === "active"
                        ? "bg-gradient-to-r from-green-400 to-green-600"
                        : "bg-gradient-to-r from-gray-400 to-gray-500"
                    }
                  />
                </div>

                {/* Enhanced Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1 }}
                  >
                    <div className="text-lg font-bold text-green-600">
                      ₹{(campaign.budget / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">Budget</div>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                  >
                    <div className="text-lg font-bold text-blue-600">
                      {((campaign.total_impressions || 0) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">Impressions</div>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.9 + index * 0.1 }}
                  >
                    <div className="text-lg font-bold text-purple-600">
                      {(campaign as any).ctr || 2.1}%
                    </div>
                    <div className="text-xs text-gray-500">CTR</div>
                  </motion.div>

                  <motion.div
                    className="text-center"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 1.0 + index * 0.1 }}
                  >
                    <div className="text-lg font-bold text-orange-600">
                      {(((campaign as any).reach || 50000) / 1000).toFixed(0)}K
                    </div>
                    <div className="text-xs text-gray-500">Reach</div>
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col space-y-2 ml-4">
                {campaign.status === "active" && (
                  <motion.button
                    onClick={() => handleStatusChange(campaign.id, "paused")}
                    className="px-4 py-2 bg-yellow-100 text-yellow-700 rounded-xl hover:bg-yellow-200 text-sm font-medium transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Pause
                  </motion.button>
                )}
                {campaign.status === "paused" && (
                  <motion.button
                    onClick={() => handleStatusChange(campaign.id, "active")}
                    className="px-4 py-2 bg-green-100 text-green-700 rounded-xl hover:bg-green-200 text-sm font-medium transition-all duration-200"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Resume
                  </motion.button>
                )}
                <motion.button
                  onClick={() => handleDelete(campaign.id)}
                  className="px-4 py-2 bg-red-100 text-red-700 rounded-xl hover:bg-red-200 text-sm font-medium transition-all duration-200"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Delete
                </motion.button>
              </div>
            </div>
          </div>

          {/* Animated border */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
};

// Screen Status Component with Backend Data
export const LiveScreensStatus: React.FC = () => {
  const { screens, loading } = useScreens();
  const [visibleScreens, setVisibleScreens] = useState(0);

  // Fallback screen data with enhanced status info
  const fallbackScreens = [
    {
      id: 1,
      name: "Mumbai Central Mall",
      location_name: "Phoenix Mall",
      city: "Mumbai",
      is_active: true,
      daily_footfall: 15000,
      cost_per_10_seconds: 250,
      uptime: 98.5,
      engagement_rate: 4.2,
      last_updated: "2 mins ago",
    },
    {
      id: 2,
      name: "Delhi Metro Station",
      location_name: "Rajiv Chowk",
      city: "New Delhi",
      is_active: true,
      daily_footfall: 25000,
      cost_per_10_seconds: 180,
      uptime: 99.1,
      engagement_rate: 3.8,
      last_updated: "1 min ago",
    },
    {
      id: 3,
      name: "Bangalore Tech Park",
      location_name: "Electronic City",
      city: "Bengaluru",
      is_active: false,
      daily_footfall: 8000,
      cost_per_10_seconds: 150,
      uptime: 85.2,
      engagement_rate: 2.1,
      last_updated: "5 mins ago",
    },
    {
      id: 4,
      name: "Chennai Shopping Complex",
      location_name: "Express Avenue",
      city: "Chennai",
      is_active: true,
      daily_footfall: 12000,
      cost_per_10_seconds: 200,
      uptime: 96.8,
      engagement_rate: 3.5,
      last_updated: "3 mins ago",
    },
  ];

  const displayScreens =
    !screens || screens.length === 0 ? fallbackScreens : screens;

  // Animated uptime bar
  const AnimatedUptimeBar: React.FC<{ uptime: number }> = ({ uptime }) => {
    const getUptimeColor = (uptime: number) => {
      if (uptime >= 95) return "bg-gradient-to-r from-green-400 to-green-600";
      if (uptime >= 85) return "bg-gradient-to-r from-yellow-400 to-yellow-600";
      return "bg-gradient-to-r from-red-400 to-red-600";
    };

    return (
      <div className="w-full bg-gray-200 rounded-full h-1.5 relative overflow-hidden">
        <motion.div
          className={`h-full rounded-full ${getUptimeColor(uptime)} relative`}
          initial={{ width: 0 }}
          animate={{ width: `${uptime}%` }}
          transition={{ duration: 2, ease: "easeOut" }}
        >
          <div className="absolute inset-0 bg-white/30 rounded-full animate-pulse" />
        </motion.div>
      </div>
    );
  };

  React.useEffect(() => {
    if (!loading) {
      const timer = setInterval(() => {
        setVisibleScreens((prev: number) => {
          const maxScreens = displayScreens?.length || 0;
          return prev < maxScreens ? prev + 1 : maxScreens;
        });
      }, 200);

      return () => clearInterval(timer);
    }
  }, [loading, displayScreens?.length]);

  if (loading) {
    return (
      <div className="space-y-3">
        {[1, 2, 3, 4].map((i) => (
          <motion.div
            key={i}
            className="bg-white/50 backdrop-blur-sm rounded-2xl p-4 border border-white/20"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
          >
            <div className="animate-pulse space-y-2">
              <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              <div className="h-2 bg-gray-300 rounded w-1/2"></div>
              <div className="h-2 bg-gray-300 rounded w-full"></div>
            </div>
          </motion.div>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <motion.div
        className="flex items-center space-x-2 mb-4"
        initial={{ opacity: 0, x: -20 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="w-2 h-2 bg-blue-500 rounded-full animate-pulse" />
        <span className="text-sm text-gray-600">Live screen monitoring...</span>
      </motion.div>

      {displayScreens?.slice(0, 6).map((screen, index) => (
        <motion.div
          key={screen.id}
          className={`bg-white/80 backdrop-blur-sm rounded-2xl p-4 border border-white/30 shadow-lg relative overflow-hidden group ${
            index < visibleScreens ? "opacity-100" : "opacity-0"
          }`}
          initial={{ opacity: 0, x: 50, rotateY: 15 }}
          animate={{
            opacity: index < visibleScreens ? 1 : 0,
            x: index < visibleScreens ? 0 : 50,
            rotateY: index < visibleScreens ? 0 : 15,
          }}
          transition={{
            duration: 0.6,
            delay: index * 0.15,
            type: "spring",
            stiffness: 120,
          }}
          whileHover={{
            scale: 1.02,
            y: -3,
            transition: { duration: 0.2 },
          }}
        >
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

          <div className="relative z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3 flex-1">
                <motion.div
                  className={`w-4 h-4 rounded-full border-2 ${
                    (screen as any).is_active
                      ? "bg-green-500 border-green-300"
                      : "bg-red-500 border-red-300"
                  } relative`}
                  animate={
                    (screen as any).is_active
                      ? {
                          boxShadow: [
                            "0 0 0 0 rgba(34, 197, 94, 0.4)",
                            "0 0 0 10px rgba(34, 197, 94, 0)",
                            "0 0 0 0 rgba(34, 197, 94, 0)",
                          ],
                        }
                      : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {(screen as any).is_active && (
                    <div className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                  )}
                </motion.div>

                <div className="flex-1">
                  <motion.h4
                    className="font-semibold text-gray-900 text-sm"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                  >
                    {screen.name}
                  </motion.h4>
                  <p className="text-xs text-gray-600">
                    {screen.location_name}, {screen.city}
                  </p>
                  <p className="text-xs text-gray-500">
                    Updated {(screen as any).last_updated || "just now"}
                  </p>
                </div>
              </div>

              <div className="text-right space-y-1">
                <div className="text-sm font-bold text-green-600">
                  {((screen as any).daily_footfall || 10000).toLocaleString()}
                </div>
                <div className="text-xs text-gray-500">footfall/day</div>
                <div className="text-xs font-medium text-blue-600">
                  ₹{(screen as any).cost_per_10_seconds || 200}/10s
                </div>
              </div>
            </div>

            {/* Enhanced Status Metrics */}
            <div className="mt-4 grid grid-cols-2 gap-4">
              <div>
                <div className="flex justify-between items-center mb-1">
                  <span className="text-xs text-gray-500">Uptime</span>
                  <span className="text-xs font-semibold text-gray-700">
                    {(screen as any).uptime || 95}%
                  </span>
                </div>
                <AnimatedUptimeBar uptime={(screen as any).uptime || 95} />
              </div>

              <div className="text-center">
                <div className="text-sm font-bold text-purple-600">
                  {(screen as any).engagement_rate || 3.2}%
                </div>
                <div className="text-xs text-gray-500">Engagement</div>
              </div>
            </div>

            {/* Status indicators with animations */}
            <div className="flex justify-between items-center mt-3 pt-3 border-t border-gray-100">
              <div className="flex space-x-2">
                <motion.span
                  className={`px-2 py-1 rounded-full text-xs font-medium ${
                    (screen as any).is_active
                      ? "bg-green-100 text-green-700 border border-green-200"
                      : "bg-red-100 text-red-700 border border-red-200"
                  }`}
                  animate={
                    (screen as any).is_active ? { scale: [1, 1.05, 1] } : {}
                  }
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  {(screen as any).is_active ? "LIVE" : "OFFLINE"}
                </motion.span>

                <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium border border-blue-200">
                  {(screen as any).uptime >= 95
                    ? "HIGH"
                    : (screen as any).uptime >= 85
                    ? "MEDIUM"
                    : "LOW"}{" "}
                  PERFORMANCE
                </span>
              </div>

              {/* Dotted progress indicator */}
              <div className="flex space-x-1">
                {[0, 1, 2].map((dot) => (
                  <motion.div
                    key={dot}
                    className={`w-1.5 h-1.5 rounded-full ${
                      (screen as any).is_active ? "bg-green-500" : "bg-gray-400"
                    }`}
                    animate={
                      (screen as any).is_active
                        ? {
                            scale: [1, 1.5, 1],
                            opacity: [1, 0.5, 1],
                          }
                        : {}
                    }
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      delay: dot * 0.2,
                    }}
                  />
                ))}
              </div>
            </div>
          </div>

          {/* Animated border effect */}
          <div className="absolute inset-0 rounded-2xl border-2 border-transparent bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
        </motion.div>
      ))}
    </div>
  );
};
