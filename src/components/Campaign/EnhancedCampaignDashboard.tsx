import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Play,
  Pause,
  Square,
  BarChart3,
  TrendingUp,
  TrendingDown,
  DollarSign,
  Target,
  Eye,
  MousePointer,
  Calendar,
  Users,
  Monitor,
  Cloud,
  Wifi,
  WifiOff,
  RefreshCw,
  Settings,
  Plus,
  Edit,
  Trash2,
  AlertCircle,
} from "lucide-react";
import { campaignService, Campaign } from "../../services/campaignService";
import { awsCloudWatchService } from "../../services/awsCloudWatchService";

interface CampaignDashboardProps {
  className?: string;
}

const EnhancedCampaignDashboard: React.FC<CampaignDashboardProps> = ({
  className,
}) => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [awsConnected, setAwsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);

  // Check AWS connection
  useEffect(() => {
    setAwsConnected(awsCloudWatchService.isConfigured());
  }, []);

  // Load campaigns and dashboard data
  const loadCampaigns = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const [campaignData, statsData] = await Promise.all([
        campaignService.getCampaigns(),
        campaignService.getDashboardStats(),
      ]);

      setCampaigns(campaignData);
      setDashboardStats(statsData);
      setLastUpdate(new Date());

      if (selectedCampaign) {
        const updatedCampaign = campaignData.find(
          (c) => c.id === selectedCampaign.id
        );
        if (updatedCampaign) {
          setSelectedCampaign(updatedCampaign);
        }
      }
    } catch (error: any) {
      setError(error.message || "Failed to load campaigns");
      console.error("Error loading campaigns:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadCampaigns();
  }, []);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadCampaigns();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh]);

  // Handle campaign status change
  const handleStatusChange = async (
    campaignId: number,
    newStatus: Campaign["status"]
  ) => {
    try {
      await campaignService.updateCampaignStatus(campaignId, newStatus);
      await loadCampaigns();
    } catch (error: any) {
      console.error("Failed to update campaign status:", error);
      setError(error.message || "Failed to update campaign status");
    }
  };

  // Handle campaign deletion
  const handleDeleteCampaign = async (campaignId: number) => {
    if (!confirm("Are you sure you want to delete this campaign?")) {
      return;
    }

    try {
      await campaignService.deleteCampaign(campaignId);
      await loadCampaigns();
      if (selectedCampaign?.id === campaignId) {
        setSelectedCampaign(null);
      }
    } catch (error: any) {
      console.error("Failed to delete campaign:", error);
      setError(error.message || "Failed to delete campaign");
    }
  };

  // Get status color
  const getStatusColor = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      case "scheduled":
        return "bg-purple-100 text-purple-800 border-purple-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status: Campaign["status"]) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "paused":
        return <Pause className="w-4 h-4" />;
      case "completed":
        return <Square className="w-4 h-4" />;
      case "scheduled":
        return <Calendar className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header with AWS Status */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Campaign Dashboard
            </h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage your advertising campaigns with real-time
              analytics
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* AWS Connection Status */}
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                awsConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {awsConnected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {awsConnected ? "AWS Connected" : "AWS Disconnected"}
              </span>
            </div>

            {/* Auto Refresh Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>

            {/* Refresh Button */}
            <motion.button
              onClick={loadCampaigns}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </motion.button>

            {/* Create Campaign Button */}
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <Plus className="w-4 h-4" />
              <span>New Campaign</span>
            </motion.button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-sm text-gray-500 flex items-center space-x-2">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          {awsConnected && (
            <span className="flex items-center space-x-1">
              <Cloud className="w-3 h-3" />
              <span>Real-time data from AWS CloudWatch</span>
            </span>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </motion.div>
        )}
      </div>

      {/* Dashboard Statistics */}
      {dashboardStats && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-blue-100 rounded-lg">
                <Target className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.totalCampaigns}
                </p>
                <p className="text-sm text-green-600">
                  {dashboardStats.activeCampaigns} active
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-green-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Total Budget</p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹{(dashboardStats.totalBudget / 1000).toFixed(0)}K
                </p>
                <p className="text-sm text-gray-600">
                  ₹{(dashboardStats.totalSpent / 1000).toFixed(0)}K spent
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-purple-100 rounded-lg">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Average ROI</p>
                <p className="text-2xl font-bold text-gray-900">
                  {dashboardStats.avgROI.toFixed(1)}%
                </p>
                <p
                  className={`text-sm ${
                    dashboardStats.avgROI >= 0
                      ? "text-green-600"
                      : "text-red-600"
                  }`}
                >
                  {dashboardStats.avgROI >= 0 ? "+" : ""}
                  {dashboardStats.avgROI.toFixed(1)}%
                </p>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            whileHover={{ scale: 1.02 }}
          >
            <div className="flex items-center space-x-3">
              <div className="p-3 bg-orange-100 rounded-lg">
                <BarChart3 className="w-6 h-6 text-orange-600" />
              </div>
              <div>
                <p className="text-sm text-gray-600">Top Campaign</p>
                <p className="text-lg font-bold text-gray-900 truncate">
                  {dashboardStats.topPerformingCampaign?.name || "N/A"}
                </p>
                <p className="text-sm text-green-600">
                  {dashboardStats.topPerformingCampaign?.roi.toFixed(1)}% ROI
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}

      {/* Campaign List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">
            Active Campaigns
          </h2>
        </div>

        {isLoading ? (
          <div className="p-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading campaigns...</span>
          </div>
        ) : (
          <div className="p-6">
            <div className="grid gap-6">
              <AnimatePresence>
                {campaigns.map((campaign) => (
                  <motion.div
                    key={campaign.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() =>
                      setSelectedCampaign(
                        selectedCampaign?.id === campaign.id ? null : campaign
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center space-x-3">
                          <h3 className="text-lg font-semibold text-gray-900">
                            {campaign.name}
                          </h3>
                          <span
                            className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                              campaign.status
                            )}`}
                          >
                            {getStatusIcon(campaign.status)}
                            <span className="ml-1">{campaign.status}</span>
                          </span>
                        </div>
                        <p className="text-gray-600 mt-1">
                          {campaign.description}
                        </p>

                        <div className="flex items-center space-x-6 mt-3 text-sm text-gray-500">
                          <span className="flex items-center">
                            <Calendar className="w-4 h-4 mr-1" />
                            {new Date(
                              campaign.startDate
                            ).toLocaleDateString()}{" "}
                            - {new Date(campaign.endDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Monitor className="w-4 h-4 mr-1" />
                            {campaign.screenIds?.length || 0} screens
                          </span>
                          <span className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1" />₹
                            {(campaign.budget / 1000).toFixed(0)}K budget
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center space-x-4">
                        {/* Real-time Metrics */}
                        {awsConnected && (
                          <div className="grid grid-cols-2 gap-4 text-center">
                            <div>
                              <div className="text-lg font-bold text-gray-900">
                                {campaign.impressions.toLocaleString()}
                              </div>
                              <div className="text-xs text-gray-500">
                                Impressions
                              </div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-green-600">
                                {campaign.ctr.toFixed(2)}%
                              </div>
                              <div className="text-xs text-gray-500">CTR</div>
                            </div>
                            <div>
                              <div className="text-lg font-bold text-blue-600">
                                ₹{(campaign.cost / 1000).toFixed(1)}K
                              </div>
                              <div className="text-xs text-gray-500">Spent</div>
                            </div>
                            <div>
                              <div
                                className={`text-lg font-bold ${
                                  campaign.roi >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {campaign.roi.toFixed(1)}%
                              </div>
                              <div className="text-xs text-gray-500">ROI</div>
                            </div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex items-center space-x-2">
                          {campaign.status === "active" && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(campaign.id, "paused");
                              }}
                              className="p-2 text-yellow-600 hover:bg-yellow-50 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Pause className="w-4 h-4" />
                            </motion.button>
                          )}

                          {campaign.status === "paused" && (
                            <motion.button
                              onClick={(e) => {
                                e.stopPropagation();
                                handleStatusChange(campaign.id, "active");
                              }}
                              className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                            >
                              <Play className="w-4 h-4" />
                            </motion.button>
                          )}

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              // Handle edit
                            }}
                            className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Edit className="w-4 h-4" />
                          </motion.button>

                          <motion.button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleDeleteCampaign(campaign.id);
                            }}
                            className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                          >
                            <Trash2 className="w-4 h-4" />
                          </motion.button>
                        </div>
                      </div>
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedCampaign?.id === campaign.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                            <div className="text-center">
                              <div className="text-2xl font-bold text-blue-600">
                                {campaign.impressions.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                Total Impressions
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-green-600">
                                {campaign.views.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                Total Views
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-2xl font-bold text-purple-600">
                                {campaign.clicks.toLocaleString()}
                              </div>
                              <div className="text-sm text-gray-500">
                                Total Clicks
                              </div>
                            </div>
                            <div className="text-center">
                              <div
                                className={`text-2xl font-bold ${
                                  campaign.roi >= 0
                                    ? "text-green-600"
                                    : "text-red-600"
                                }`}
                              >
                                {campaign.roi.toFixed(1)}%
                              </div>
                              <div className="text-sm text-gray-500">
                                Return on Investment
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </AnimatePresence>

              {campaigns.length === 0 && !isLoading && (
                <div className="text-center py-8">
                  <Target className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    No campaigns yet
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Create your first campaign to start advertising
                  </p>
                  <motion.button
                    className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Create Campaign
                  </motion.button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedCampaignDashboard;
