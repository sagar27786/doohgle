// Complete Integrated Ads Manager Dashboard - Frontend + Backend
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  Cloud,
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  PauseCircle,
  StopCircle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Zap,
  Star,
  Award,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

// Chart imports
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

// Backend Integration Components removed (AWS)

// Professional Dashboard Component
import ProfessionalDashboard from "./ProfessionalDashboard";

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
import MyCampaignRequests from "../../Campaign/MyCampaignRequests";
import NotificationPanel from "../../Campaign/NotificationPanel";

// AWS Enhanced Components removed
// LocationManager import removed

type ViewType =
  | "dashboard"
  | "campaigns"
  | "campaignManagement"
  | "campaignRequests"
  | "screens"
  | "map"
  | "analytics"
  | "reports"
  | "settings"
  | "search"
  | "createCampaign"
  | "trackCampaign"
  | "venueDashboard"
  | "locationManager";

const IntegratedAdsManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // showLocationManager removed
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
    { id: "campaignRequests", label: "My Campaign Requests", icon: Bell },
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
        return <ProfessionalDashboard />;
      case "venueDashboard":
        return <EnhancedVenueDashboard />;
  // AWS tabs removed
      case "campaignManagement":
        return <CampaignManagement />;
      case "campaignRequests":
        return <MyCampaignRequests />;
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
        return <ProfessionalDashboard />;
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

              {/* Location Manager Button removed */}

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

      {/* Notification Panel */}
      <NotificationPanel
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  );
};

// Dashboard Overview with Real Backend Data
const DashboardOverview: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [countersStarted, setCountersStarted] = useState(false);
  const [selectedPeriod, setSelectedPeriod] = useState(
    "January 2024 - May 2024"
  );

  // Chart data
  const revenueData = [
    { month: "Jan", income: 45000, expenses: 32000 },
    { month: "Feb", income: 52000, expenses: 38000 },
    { month: "Mar", income: 48000, expenses: 35000 },
    { month: "Apr", income: 61000, expenses: 42000 },
    { month: "May", income: 55000, expenses: 40000 },
    { month: "Jun", income: 67000, expenses: 45000 },
  ];

  const performanceData = [
    { name: "View Count", value: 68, color: "#22c55e" },
    { name: "Percentage", value: 23, color: "#374151" },
    { name: "Sales", value: 16, color: "#f97316" },
  ];

  const salesReportData = [
    { name: "Product Launched", value: 233, color: "#22c55e" },
    { name: "Ongoing Product", value: 23, color: "#eab308" },
    { name: "Product Sold", value: 482, color: "#10b981" },
  ];

  const transactionData = [
    {
      id: 1,
      name: "Premium T-Shirt",
      date: "Jul 12th 2024",
      status: "Completed",
      code: "0JWEJS75NC",
      icon: "👕",
    },
    {
      id: 2,
      name: "Playstation 5",
      date: "Jul 12th 2024",
      status: "Pending",
      code: "0JWEJS75NC",
      icon: "🎮",
    },
    {
      id: 3,
      name: "Hoodie Gombrong",
      date: "Jul 12th 2024",
      status: "Pending",
      code: "0JWEJS75NC",
      icon: "👕",
    },
    {
      id: 4,
      name: "iPhone 15 Pro Max",
      date: "Jul 12th 2024",
      status: "Completed",
      code: "0JWEJS75NC",
      icon: "📱",
    },
    {
      id: 5,
      name: "Lotse",
      date: "Jul 12th 2024",
      status: "Completed",
      code: "0JWEJS75NC",
      icon: "🏺",
    },
    {
      id: 6,
      name: "Starbucks",
      date: "Jul 12th 2024",
      status: "Completed",
      code: "0JWEJS75NC",
      icon: "☕",
    },
    {
      id: 7,
      name: "Tinek Detasar T-Shirt",
      date: "Jul 12th 2024",
      status: "Completed",
      code: "0JWEJS75NC",
      icon: "👕",
    },
  ];

  // Simulate loading and start animations
  React.useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
      setTimeout(() => setCountersStarted(true), 500);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  // Counter animation component
  const AnimatedCounter: React.FC<{
    value: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
  }> = ({ value, suffix = "", prefix = "", decimals = 0 }) => {
    const [count, setCount] = React.useState(0);

    React.useEffect(() => {
      if (!countersStarted) return;

      let startTime: number;
      const duration = 2000; // 2 seconds

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        // Easing function for smooth animation
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        const currentValue = value * easeOutQuart;

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [countersStarted, value]);

    return (
      <span>
        {prefix}
        {count.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",")}
        {suffix}
      </span>
    );
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Completed":
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case "Pending":
        return <Clock className="w-4 h-4 text-yellow-500" />;
      default:
        return <XCircle className="w-4 h-4 text-red-500" />;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          className="text-center"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6"
            initial={{ scale: 0 }}
            animate={{ scale: [0, 1.2, 1] }}
            transition={{ duration: 1, ease: "easeOut" }}
          >
            <div className="w-full h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl flex items-center justify-center shadow-2xl">
              <span className="text-white font-bold text-2xl">DT</span>
            </div>
          </motion.div>
          <motion.h2
            className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
          >
            Doohgle Tech
          </motion.h2>
          <motion.p
            className="text-gray-600 mt-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.8 }}
          >
            Loading your dashboard...
          </motion.p>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <motion.div
        className="bg-white border-b border-gray-200 px-6 py-4"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">
              Sales Admin
            </h1>
            <p className="text-gray-600 mt-1">
              An any way to manage sales with care and precision.
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search anything in Sichioma..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Bell className="w-5 h-5" />
            </button>
            <button className="p-2 text-gray-400 hover:text-gray-600">
              <Settings className="w-5 h-5" />
            </button>
            <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 flex items-center space-x-2">
              <Plus className="w-4 h-4" />
              <span>Add new product</span>
            </button>
          </div>
        </div>
      </motion.div>

      <div className="p-6">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column */}
          <div className="col-span-8 space-y-6">
            {/* Period Selector and Stats Row */}
            <div className="flex items-center justify-between mb-6">
              <motion.div
                className="flex items-center space-x-2"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.6 }}
              >
                <Calendar className="w-5 h-5 text-gray-400" />
                <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                  <option>January 2024 - May 2024</option>
                  <option>June 2024 - December 2024</option>
                </select>
              </motion.div>
            </div>

            {/* Update Banner and Stats Cards */}
            <div className="grid grid-cols-3 gap-6">
              {/* Update Card */}
              <motion.div
                className="bg-gradient-to-r from-green-600 to-green-700 rounded-xl p-6 text-white relative overflow-hidden"
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.3, duration: 0.6 }}
              >
                <div className="absolute top-2 right-2">
                  <RefreshCw className="w-5 h-5 text-green-200" />
                </div>
                <div className="mb-4">
                  <span className="text-green-200 text-sm">Update</span>
                  <p className="text-green-100 text-sm mt-1">Feb 12th 2024</p>
                </div>
                <h3 className="text-xl font-semibold mb-2">
                  Sales revenue increased
                </h3>
                <div className="text-2xl font-bold mb-3">
                  <AnimatedCounter value={40} suffix="%" />
                  <span className="text-lg ml-1">in 1 Week</span>
                </div>
                <button className="text-green-200 text-sm hover:text-white flex items-center">
                  See Statistics
                  <ArrowUpRight className="w-4 h-4 ml-1" />
                </button>
              </motion.div>

              {/* Net Income Card */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4, duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Net Income</h3>
                  <button>
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  $<AnimatedCounter value={193} />,<AnimatedCounter value={0} />
                  00
                </div>
                <div className="flex items-center text-green-600">
                  <TrendingUp className="w-4 h-4 mr-1" />
                  <span className="text-sm">+35% from last month</span>
                </div>
              </motion.div>

              {/* Total Return Card */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Total Return</h3>
                  <button>
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="text-3xl font-bold text-gray-900 mb-2">
                  $<AnimatedCounter value={32} />,<AnimatedCounter value={0} />
                  00
                </div>
                <div className="flex items-center text-red-600">
                  <TrendingDown className="w-4 h-4 mr-1" />
                  <span className="text-sm">-24% from last month</span>
                </div>
              </motion.div>
            </div>

            {/* Transaction and Revenue Row */}
            <div className="grid grid-cols-2 gap-6">
              {/* Transaction List */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.6, duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Transaction
                  </h3>
                  <button>
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </button>
                </div>
                <div className="space-y-4">
                  {transactionData.map((transaction, index) => (
                    <motion.div
                      key={transaction.id}
                      className="flex items-center justify-between py-3 border-b border-gray-50 last:border-b-0"
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.8 + index * 0.1, duration: 0.4 }}
                    >
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-lg">
                          {transaction.icon}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 text-sm">
                            {transaction.name}
                          </p>
                          <p className="text-gray-500 text-xs">
                            {transaction.date}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        {getStatusIcon(transaction.status)}
                        <span
                          className={`text-sm font-medium ${
                            transaction.status === "Completed"
                              ? "text-green-600"
                              : "text-yellow-600"
                          }`}
                        >
                          {transaction.status}
                        </span>
                        <span className="text-xs text-gray-400 ml-2">
                          {transaction.code}
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Revenue Chart */}
              <motion.div
                className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.7, duration: 0.6 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      Revenue
                    </h3>
                    <div className="flex items-center space-x-4 mt-2">
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-gray-800 rounded-full"></div>
                        <span className="text-sm text-gray-600">Income</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-gray-600">Expenses</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-gray-900">
                      $<AnimatedCounter value={193} />,
                      <AnimatedCounter value={0} />
                      00
                    </div>
                    <div className="flex items-center text-green-600 text-sm">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      +35% from last month
                    </div>
                  </div>
                </div>
                <div className="h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={revenueData}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                      />
                      <YAxis hide />
                      <Tooltip />
                      <Bar
                        dataKey="income"
                        fill="#374151"
                        radius={[4, 4, 0, 0]}
                      />
                      <Bar
                        dataKey="expenses"
                        fill="#22c55e"
                        radius={[4, 4, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </motion.div>
            </div>

            {/* Sales Report */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Sales Report
                </h3>
                <button>
                  <MoreHorizontal className="w-5 h-5 text-gray-400" />
                </button>
              </div>
              <div className="space-y-6">
                {salesReportData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="space-y-2"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.2, duration: 0.6 }}
                  >
                    <div className="flex justify-between items-center">
                      <span className="text-sm font-medium text-gray-700">
                        {item.name} ({item.value})
                      </span>
                    </div>
                    <div className="w-full bg-gray-100 rounded-full h-2">
                      <motion.div
                        className="h-2 rounded-full"
                        style={{ backgroundColor: item.color }}
                        initial={{ width: 0 }}
                        animate={{ width: `${(item.value / 500) * 100}%` }}
                        transition={{
                          delay: 1.2 + index * 0.2,
                          duration: 1.5,
                          ease: "easeOut",
                        }}
                      ></motion.div>
                    </div>
                  </motion.div>
                ))}
                <div className="flex justify-between text-sm text-gray-500 mt-4">
                  <span>0</span>
                  <span>100</span>
                  <span>200</span>
                  <span>300</span>
                  <span>400</span>
                </div>
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="col-span-4 space-y-6">
            {/* Total View Performance */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.9, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-6">
                Total View Performance
              </h3>
              <div className="relative h-48 mb-6">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={90}
                      paddingAngle={5}
                      dataKey="value"
                    >
                      {performanceData.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={565} suffix="K" />
                    </div>
                    <div className="text-sm text-gray-500">Total Count</div>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                {performanceData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.2 + index * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-2">
                      <div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                      ></div>
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}%
                    </span>
                  </motion.div>
                ))}
              </div>
              <p className="text-sm text-gray-500 mt-4">
                Here are some tips on how to improve your score.
              </p>
            </motion.div>

            {/* Guide Views */}
            <motion.div
              className="bg-white rounded-xl p-6 shadow-sm border border-gray-100"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Guide Views
              </h3>
              <div className="space-y-3">
                {performanceData.map((item, index) => (
                  <div key={item.name} className="flex items-center space-x-2">
                    <div
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: item.color }}
                    ></div>
                    <span className="text-sm text-gray-600">{item.name}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            {/* Promotion Banner */}
            <motion.div
              className="bg-gradient-to-br from-green-100 to-green-200 rounded-xl p-6 relative overflow-hidden"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 1.1, duration: 0.6 }}
            >
              <div className="absolute top-4 right-4 text-green-600">
                <CheckCircle className="w-8 h-8" />
              </div>
              <div className="absolute bottom-0 right-0 text-green-300 opacity-20">
                <Star className="w-24 h-24" />
              </div>
              <h3 className="text-xl font-semibold text-green-900 mb-2">
                Level up your sales managing to the next level.
              </h3>
              <p className="text-green-700 text-sm mb-4">
                An any way to manage sales with care and precision.
              </p>
              <button className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 text-sm font-medium">
                Update to Sichioma+
              </button>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
};

// Analytics View Component
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

  {/* Location Manager Modal removed */}
    </div>
  );
};

export default IntegratedAdsManager;
