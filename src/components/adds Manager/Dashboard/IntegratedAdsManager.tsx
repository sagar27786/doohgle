// Complete Integrated Ads Manager Dashboard - Frontend + Backend
import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Search,
  Plus,
  Eye,
  Filter,
  Monitor,
  FileText,
  Target,
} from "lucide-react";

// Backend Integration Components
import {
  DashboardStats,
  LiveCampaignsList,
  LiveScreensStatus,
} from "./BackendIntegration";

// Existing Components
import CampaignManager from "./CampaignManager";
import ScreenManager from "./ScreenManager";

// New Enhanced Components
import AdvancedScreenSearch from "../../Search/AdvancedScreenSearch";
import CampaignCreationWorkflow from "../../Campaign/CampaignCreationWorkflow";
import CampaignTrackingDashboard from "../../Campaign/CampaignTrackingDashboard";
import CampaignManagement from "../../Campaign/CampaignManagement";
import IndiaMapDashboard from "../../Map/IndiaMapDashboard";
import ReportsAnalytics from "../../Reports/ReportsAnalytics";
import EnhancedVenueDashboard from "../../Dashboard/EnhancedVenueDashboard";

type ViewType =
  | "dashboard"
  | "campaigns"
  | "campaignManagement"
  | "screens"
  | "map"
  | "analytics"
  | "reports"
  | "settings"
  | "search"
  | "createCampaign"
  | "trackCampaign"
  | "venueDashboard";

const IntegratedAdsManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    campaign_type: "",
    status: "",
    date_range: "7d",
  });

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "venueDashboard", label: "Venue Dashboard", icon: Calendar },
    { id: "campaignManagement", label: "Campaign Management", icon: Target },
    { id: "campaigns", label: "Campaigns", icon: TrendingUp },
    { id: "screens", label: "Screens", icon: Monitor },
    { id: "search", label: "Search Screens", icon: Search },
    { id: "createCampaign", label: "Create Campaign", icon: Plus },
    { id: "trackCampaign", label: "Track Campaigns", icon: BarChart3 },
    { id: "reports", label: "Reports & Analytics", icon: FileText },
    { id: "map", label: "India Map", icon: MapPin },
    { id: "analytics", label: "Analytics", icon: Users },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <DashboardOverview />;
      case "venueDashboard":
        return <EnhancedVenueDashboard />;
      case "campaignManagement":
        return <CampaignManagement />;
      case "campaigns":
        return <CampaignManager />;
      case "screens":
        return <ScreenManager />;
      case "search":
        return <AdvancedScreenSearch />;
      case "createCampaign":
        return <CampaignCreationWorkflow />;
      case "trackCampaign":
        return <CampaignTrackingDashboard />;
      case "reports":
        return <ReportsAnalytics />;
      case "map":
        return <IndiaMapDashboard />;
      case "analytics":
        return <AnalyticsView />;
      case "settings":
        return <SettingsView />;
      default:
        return <DashboardOverview />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Ads Manager</h2>
          <p className="text-sm text-gray-600">Complete DOOH Platform</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
              className={`w-full flex items-center px-6 py-3 text-left transition-colors ${
                currentView === item.id
                  ? "bg-blue-50 text-blue-600 border-r-2 border-blue-600"
                  : "text-gray-600 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} className="mr-3" />
              {item.label}
            </button>
          ))}
        </nav>

        {/* Quick Actions */}
        <div className="absolute bottom-6 left-6 right-6">
          <button className="w-full flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus size={16} className="mr-2" />
            New Campaign
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {/* Header */}
        <header className="bg-white shadow-sm border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {currentView}
              </h1>
              <p className="text-gray-600">
                {currentView === "dashboard" &&
                  "Overview of your campaigns and screens"}
                {currentView === "venueDashboard" &&
                  "Complete venue management dashboard"}
                {currentView === "campaigns" &&
                  "Manage your advertising campaigns"}
                {currentView === "screens" && "Monitor your digital screens"}
                {currentView === "search" &&
                  "Find and book perfect screens for your ads"}
                {currentView === "createCampaign" &&
                  "Create new advertising campaigns"}
                {currentView === "trackCampaign" &&
                  "Track campaign performance and analytics"}
                {currentView === "map" &&
                  "Interactive India map with city performance"}
                {currentView === "analytics" && "Campaign performance insights"}
                {currentView === "settings" && "Platform configuration"}
              </p>
            </div>

            <div className="flex items-center space-x-4">
              {/* Enhanced Search with Filters */}
              <div className="relative flex items-center space-x-2">
                <div className="relative">
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={16}
                  />
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search campaigns, screens, locations..."
                    className="pl-10 pr-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 w-80"
                  />
                </div>

                {/* Advanced Filters Toggle */}
                <button
                  onClick={() => setShowAdvancedFilters(!showAdvancedFilters)}
                  className={`p-2 rounded-lg border transition-colors ${
                    showAdvancedFilters
                      ? "bg-blue-100 text-blue-600 border-blue-200"
                      : "bg-white text-gray-400 hover:text-gray-600 border-gray-200"
                  }`}
                >
                  <Filter size={16} />
                </button>

                {/* Quick Filter Chips */}
                {searchQuery && (
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-500">Found:</span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-700 rounded-full text-xs font-medium">
                      {Math.floor(Math.random() * 50) + 1} results
                    </span>
                  </div>
                )}
              </div>

              {/* Advanced Filters Panel */}
              {showAdvancedFilters && (
                <motion.div
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute top-full right-0 mt-2 w-96 bg-white rounded-lg shadow-lg border border-gray-200 p-4 z-50"
                >
                  <h4 className="font-semibold text-gray-900 mb-3">
                    Advanced Filters
                  </h4>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Location
                      </label>
                      <select
                        value={selectedFilters.location}
                        onChange={(e) =>
                          setSelectedFilters({
                            ...selectedFilters,
                            location: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Locations</option>
                        <option value="mumbai">Mumbai</option>
                        <option value="delhi">Delhi</option>
                        <option value="bangalore">Bangalore</option>
                        <option value="pune">Pune</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Campaign Type
                      </label>
                      <select
                        value={selectedFilters.campaign_type}
                        onChange={(e) =>
                          setSelectedFilters({
                            ...selectedFilters,
                            campaign_type: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Types</option>
                        <option value="brand">Brand Awareness</option>
                        <option value="product">Product Launch</option>
                        <option value="event">Event Promotion</option>
                        <option value="seasonal">Seasonal</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Status
                      </label>
                      <select
                        value={selectedFilters.status}
                        onChange={(e) =>
                          setSelectedFilters({
                            ...selectedFilters,
                            status: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="">All Status</option>
                        <option value="active">Active</option>
                        <option value="paused">Paused</option>
                        <option value="scheduled">Scheduled</option>
                        <option value="completed">Completed</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Date Range
                      </label>
                      <select
                        value={selectedFilters.date_range}
                        onChange={(e) =>
                          setSelectedFilters({
                            ...selectedFilters,
                            date_range: e.target.value,
                          })
                        }
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="1d">Last 24 Hours</option>
                        <option value="7d">Last 7 Days</option>
                        <option value="30d">Last 30 Days</option>
                        <option value="90d">Last 90 Days</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t">
                    <button
                      onClick={() => {
                        setSelectedFilters({
                          location: "",
                          campaign_type: "",
                          status: "",
                          date_range: "7d",
                        });
                        setSearchQuery("");
                      }}
                      className="text-sm text-gray-500 hover:text-gray-700"
                    >
                      Clear All
                    </button>
                    <div className="flex items-center space-x-2">
                      <button
                        onClick={() => setShowAdvancedFilters(false)}
                        className="px-3 py-1 text-sm text-gray-600 hover:text-gray-800"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => {
                          // Apply filters logic would go here
                          setShowAdvancedFilters(false);
                        }}
                        className="px-4 py-2 bg-blue-600 text-white text-sm rounded-md hover:bg-blue-700"
                      >
                        Apply Filters
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}

              <button
                onClick={() => setShowNotifications(!showNotifications)}
                className="relative p-2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>

              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white font-medium">
                  U
                </div>
                <span className="font-medium">User</span>
              </div>
            </div>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-auto p-6">{renderCurrentView()}</main>
      </div>
    </div>
  );
};

// Dashboard Overview with Real Backend Data
const DashboardOverview: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Real-time Stats from Backend */}
      <DashboardStats />

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-blue-600 text-white p-6 rounded-lg cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="text-lg font-semibold mb-2">Create Campaign</h3>
          <p className="text-blue-100">Launch your next advertising campaign</p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="text-lg font-semibold mb-2">Search Screens</h3>
          <p className="text-green-100">
            Find the perfect screens for your ads
          </p>
        </motion.div>

        <motion.div
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white p-6 rounded-lg cursor-pointer"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <h3 className="text-lg font-semibold mb-2">View Analytics</h3>
          <p className="text-purple-100">Track your campaign performance</p>
        </motion.div>
      </div>

      {/* Live Data Sections */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <LiveCampaignsList />
        <LiveScreensStatus />
      </div>
    </div>
  );
};

// Geographic Map View
// Analytics View
const AnalyticsView: React.FC = () => {
  const [timeRange, setTimeRange] = useState("7d");
  const [selectedMetric, setSelectedMetric] = useState("impressions");

  // Mock analytics data - in real app, this would come from API
  const analyticsData = {
    overview: {
      totalImpressions: 1250000,
      totalClicks: 25000,
      totalSpend: 48000,
      activeCampaigns: 12,
      ctr: 2.0,
      avgCpm: 3.84,
    },
    performance: [
      { date: "2025-08-08", impressions: 45000, clicks: 900, spend: 1800 },
      { date: "2025-08-09", impressions: 52000, clicks: 1040, spend: 2080 },
      { date: "2025-08-10", impressions: 48000, clicks: 960, spend: 1920 },
      { date: "2025-08-11", impressions: 61000, clicks: 1220, spend: 2440 },
      { date: "2025-08-12", impressions: 58000, clicks: 1160, spend: 2320 },
      { date: "2025-08-13", impressions: 67000, clicks: 1340, spend: 2680 },
      { date: "2025-08-14", impressions: 72000, clicks: 1440, spend: 2880 },
    ],
    topCampaigns: [
      {
        id: 1,
        name: "Summer Fashion",
        impressions: 320000,
        ctr: 2.4,
        spend: 12800,
      },
      {
        id: 2,
        name: "Tech Launch",
        impressions: 280000,
        ctr: 1.8,
        spend: 11200,
      },
      {
        id: 3,
        name: "Food Delivery",
        impressions: 190000,
        ctr: 2.1,
        spend: 7600,
      },
    ],
    topScreens: [
      { id: 1, name: "Times Square North", impressions: 89000, revenue: 3560 },
      { id: 2, name: "Mumbai Central Mall", impressions: 76000, revenue: 3040 },
      { id: 3, name: "Delhi CP Metro", impressions: 65000, revenue: 2600 },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Analytics Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Analytics Dashboard
          </h2>
          <p className="text-gray-600">
            Real-time performance metrics and insights
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="1d">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="30d">Last 30 Days</option>
            <option value="90d">Last 90 Days</option>
          </select>
        </div>
      </div>

      {/* Key Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Total Impressions
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {analyticsData.overview.totalImpressions.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <Eye size={16} className="text-blue-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↗ +12.5%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Clicks</p>
              <p className="text-2xl font-bold text-green-600">
                {analyticsData.overview.totalClicks.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <TrendingUp size={16} className="text-green-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↗ +8.3%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Spend</p>
              <p className="text-2xl font-bold text-purple-600">
                ${analyticsData.overview.totalSpend.toLocaleString()}
              </p>
            </div>
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <Calendar size={16} className="text-purple-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-red-600">↓ -2.1%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Active Campaigns
              </p>
              <p className="text-2xl font-bold text-orange-600">
                {analyticsData.overview.activeCampaigns}
              </p>
            </div>
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <BarChart3 size={16} className="text-orange-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↗ +3</span>
            <span className="text-sm text-gray-500 ml-1">new this week</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Average CTR</p>
              <p className="text-2xl font-bold text-indigo-600">
                {analyticsData.overview.ctr}%
              </p>
            </div>
            <div className="w-8 h-8 bg-indigo-100 rounded-full flex items-center justify-center">
              <TrendingUp size={16} className="text-indigo-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↗ +0.3%</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>

        <motion.div
          className="bg-white p-4 rounded-lg shadow-sm border"
          whileHover={{ y: -2 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Avg CPM</p>
              <p className="text-2xl font-bold text-pink-600">
                ${analyticsData.overview.avgCpm}
              </p>
            </div>
            <div className="w-8 h-8 bg-pink-100 rounded-full flex items-center justify-center">
              <Users size={16} className="text-pink-600" />
            </div>
          </div>
          <div className="mt-2">
            <span className="text-sm text-green-600">↗ +$0.12</span>
            <span className="text-sm text-gray-500 ml-1">vs last period</span>
          </div>
        </motion.div>
      </div>

      {/* Performance Chart */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Performance Trends
          </h3>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setSelectedMetric("impressions")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === "impressions"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Impressions
            </button>
            <button
              onClick={() => setSelectedMetric("clicks")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === "clicks"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Clicks
            </button>
            <button
              onClick={() => setSelectedMetric("spend")}
              className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                selectedMetric === "spend"
                  ? "bg-blue-100 text-blue-700"
                  : "text-gray-600 hover:text-gray-900"
              }`}
            >
              Spend
            </button>
          </div>
        </div>

        {/* Simplified Chart Visualization */}
        <div className="h-64 flex items-end justify-between space-x-2">
          {analyticsData.performance.map((day, index) => {
            const value =
              selectedMetric === "impressions"
                ? day.impressions
                : selectedMetric === "clicks"
                ? day.clicks
                : day.spend;
            const maxValue = Math.max(
              ...analyticsData.performance.map((d) =>
                selectedMetric === "impressions"
                  ? d.impressions
                  : selectedMetric === "clicks"
                  ? d.clicks
                  : d.spend
              )
            );
            const height = (value / maxValue) * 200;

            return (
              <div key={index} className="flex-1 flex flex-col items-center">
                <motion.div
                  className="w-full bg-blue-500 rounded-t-sm"
                  style={{ height: `${height}px` }}
                  initial={{ height: 0 }}
                  animate={{ height: `${height}px` }}
                  transition={{ delay: index * 0.1 }}
                />
                <div className="mt-2 text-xs text-gray-600 text-center">
                  {new Date(day.date).toLocaleDateString("en-US", {
                    weekday: "short",
                  })}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Top Performing Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Top Campaigns */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Performing Campaigns
          </h3>
          <div className="space-y-4">
            {analyticsData.topCampaigns.map((campaign, index) => (
              <div
                key={campaign.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-blue-600">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{campaign.name}</p>
                    <p className="text-sm text-gray-600">
                      {campaign.impressions.toLocaleString()} impressions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-gray-900">
                    {campaign.ctr}% CTR
                  </p>
                  <p className="text-sm text-gray-600">
                    ${campaign.spend.toLocaleString()}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Screens */}
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Top Revenue Screens
          </h3>
          <div className="space-y-4">
            {analyticsData.topScreens.map((screen, index) => (
              <div
                key={screen.id}
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                    <span className="text-sm font-bold text-green-600">
                      #{index + 1}
                    </span>
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{screen.name}</p>
                    <p className="text-sm text-gray-600">
                      {screen.impressions.toLocaleString()} impressions
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-medium text-green-600">
                    ${screen.revenue.toLocaleString()}
                  </p>
                  <p className="text-sm text-gray-600">revenue</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Geographic Performance Map */}
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Geographic Performance
        </h3>
        <div className="h-64 bg-gray-100 rounded-lg flex items-center justify-center">
          <div className="text-center">
            <MapPin size={48} className="mx-auto text-gray-400 mb-4" />
            <p className="text-gray-600 font-medium">
              Interactive Map Coming Soon
            </p>
            <p className="text-sm text-gray-500">
              Real-time geographic performance data across all cities
            </p>
            <div className="mt-4 grid grid-cols-3 gap-4 text-center">
              <div>
                <p className="text-lg font-bold text-blue-600">Mumbai</p>
                <p className="text-sm text-gray-600">324K impressions</p>
              </div>
              <div>
                <p className="text-lg font-bold text-green-600">Delhi</p>
                <p className="text-sm text-gray-600">287K impressions</p>
              </div>
              <div>
                <p className="text-lg font-bold text-purple-600">Bangalore</p>
                <p className="text-sm text-gray-600">195K impressions</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Settings View
const SettingsView: React.FC = () => {
  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm border">
        <h3 className="text-lg font-semibold mb-4">Platform Settings</h3>
        <p className="text-gray-600">
          Configuration options and platform settings will be available here.
        </p>
      </div>
    </div>
  );
};

export default IntegratedAdsManager;
