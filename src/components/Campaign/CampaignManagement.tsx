import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Target,
  Plus,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Upload,
  Download,
  Eye,
  Edit3,
  MoreHorizontal,
  Calendar,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  Play,
  Pause,
  Copy,
  BarChart3,
  Users,
  Monitor,
  MapPin,
  XCircle,
  Share2,
} from "lucide-react";
import CampaignCreationWorkflow from "./CampaignCreationWorkflow";

// Types
interface Campaign {
  id: string;
  name: string;
  brand: string;
  status: "Active" | "Paused" | "Completed" | "Draft";
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  startDate: string;
  endDate: string;
  screens: Array<{
    id: string;
    name: string;
    city: string;
  }>;
  schedule: {
    timeSlots: string[];
    days: string[];
  };
}

// Sample data
const sampleCampaigns: Campaign[] = [
  {
    id: "1",
    name: "Summer Fashion Collection",
    brand: "Trendy Styles",
    status: "Active",
    budget: 500000,
    spent: 320000,
    impressions: 1200000,
    clicks: 15400,
    ctr: 1.28,
    startDate: "2024-06-01",
    endDate: "2024-08-31",
    screens: [
      { id: "s1", name: "Mall Central", city: "Mumbai" },
      { id: "s2", name: "Airport Plaza", city: "Delhi" },
      { id: "s3", name: "Metro Station", city: "Bangalore" },
    ],
    schedule: {
      timeSlots: ["09:00-12:00", "18:00-22:00"],
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  {
    id: "2",
    name: "Tech Product Launch",
    brand: "InnovateTech",
    status: "Active",
    budget: 750000,
    spent: 280000,
    impressions: 950000,
    clicks: 12800,
    ctr: 1.35,
    startDate: "2024-07-15",
    endDate: "2024-09-15",
    screens: [
      { id: "s4", name: "Business District", city: "Pune" },
      { id: "s5", name: "Shopping Complex", city: "Chennai" },
    ],
    schedule: {
      timeSlots: ["10:00-14:00", "16:00-20:00"],
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
  },
  {
    id: "3",
    name: "Restaurant Chain Promo",
    brand: "Foodie Delights",
    status: "Paused",
    budget: 300000,
    spent: 180000,
    impressions: 780000,
    clicks: 9600,
    ctr: 1.23,
    startDate: "2024-05-01",
    endDate: "2024-07-31",
    screens: [
      { id: "s6", name: "Food Court", city: "Hyderabad" },
      { id: "s7", name: "University Area", city: "Kolkata" },
    ],
    schedule: {
      timeSlots: ["11:00-15:00", "19:00-23:00"],
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday",
      ],
    },
  },
  {
    id: "4",
    name: "Fitness Equipment Sale",
    brand: "FitLife",
    status: "Completed",
    budget: 200000,
    spent: 195000,
    impressions: 650000,
    clicks: 8900,
    ctr: 1.37,
    startDate: "2024-03-01",
    endDate: "2024-05-31",
    screens: [
      { id: "s8", name: "Sports Complex", city: "Ahmedabad" },
      { id: "s9", name: "Gym District", city: "Jaipur" },
    ],
    schedule: {
      timeSlots: ["06:00-10:00", "17:00-21:00"],
      days: [
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
      ],
    },
  },
  {
    id: "5",
    name: "Educational Course Launch",
    brand: "LearnMore Academy",
    status: "Draft",
    budget: 400000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    startDate: "2024-09-01",
    endDate: "2024-11-30",
    screens: [
      { id: "s10", name: "Student Area", city: "Lucknow" },
      { id: "s11", name: "Education Hub", city: "Kanpur" },
    ],
    schedule: {
      timeSlots: ["08:00-12:00", "14:00-18:00"],
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
];

// Professional Loading screen component with particles and animations
const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-gradient-to-br from-blue-50 via-purple-50 to-cyan-50 flex items-center justify-center z-50"
    >
      <div className="text-center">
        {/* Animated Logo with rotating effect */}
        <motion.div
          className="w-20 h-20 mx-auto mb-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-2xl flex items-center justify-center shadow-2xl"
          animate={{
            rotateY: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Target className="text-white" size={32} />
        </motion.div>

        {/* Moving particle animation in circle */}
        <div className="relative mb-8">
          {[...Array(12)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-2 h-2 bg-gradient-to-r from-purple-400 to-blue-400 rounded-full"
              animate={{
                x: Math.cos((i * 30 * Math.PI) / 180) * 50,
                y: Math.sin((i * 30 * Math.PI) / 180) * 50,
                scale: [0, 1, 0],
                opacity: [0, 1, 0],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.1,
                ease: "easeInOut",
              }}
              style={{ left: "50%", top: "50%" }}
            />
          ))}
        </div>

        {/* Pulsing loading text */}
        <motion.h2
          className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-4"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          Campaign Manager
        </motion.h2>

        <motion.p
          className="text-gray-600 text-lg"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity, delay: 0.5 }}
        >
          Preparing your campaigns...
        </motion.p>

        {/* Animated loading bar */}
        <div className="w-64 h-1 bg-gray-200 rounded-full mx-auto mt-8 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Animated Counter Component with easeOutExpo animation
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  suffix = "",
  prefix = "",
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      // easeOutExpo animation curve
      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = easeOutExpo * value;

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const CampaignManagement: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedCampaign, setSelectedCampaign] = useState<Campaign | null>(
    null
  );
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);

  const tabs = ["All", "Active", "Paused", "Completed", "Draft"];

  // Simulate loading with professional animation
  useEffect(() => {
    const timer = setTimeout(() => {
      setCampaignData(sampleCampaigns);
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Filter and sort campaigns
  const filteredCampaigns = campaignData
    .filter((campaign) => {
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.brand.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesTab =
        selectedTab === "All" || campaign.status === selectedTab;
      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      const aVal = a[sortBy as keyof Campaign];
      const bVal = b[sortBy as keyof Campaign];

      if (sortOrder === "asc") {
        return aVal > bVal ? 1 : -1;
      } else {
        return aVal < bVal ? 1 : -1;
      }
    });

  // Calculate summary metrics for animated counters
  const totalBudget = campaignData.reduce(
    (sum, campaign) => sum + campaign.budget,
    0
  );
  const totalSpent = campaignData.reduce(
    (sum, campaign) => sum + campaign.spent,
    0
  );
  const totalImpressions = campaignData.reduce(
    (sum, campaign) => sum + campaign.impressions,
    0
  );
  const activeCampaigns = campaignData.filter(
    (c) => c.status === "Active"
  ).length;

  // Status styling helpers
  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800 border-green-200";
      case "Paused":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "Completed":
        return "bg-blue-100 text-blue-800 border-blue-200";
      case "Draft":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "Active":
        return <div className="w-2 h-2 bg-green-500 rounded-full" />;
      case "Paused":
        return <div className="w-2 h-2 bg-yellow-500 rounded-full" />;
      case "Completed":
        return <div className="w-2 h-2 bg-blue-500 rounded-full" />;
      case "Draft":
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
      default:
        return <div className="w-2 h-2 bg-gray-500 rounded-full" />;
    }
  };

  if (loading) {
    return <LoadingScreen />;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Professional Header Section with gradient text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Campaign Management
              </h1>
              <p className="text-gray-600 text-lg">
                Manage and monitor your advertising campaigns with real-time
                analytics
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <motion.button
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateWorkflow(true)}
              >
                <Plus size={20} />
                <span>Create Campaign</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload size={18} />
                <span>Import</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                <span>Export</span>
              </motion.button>
            </div>
          </div>

          {/* Animated Key Metrics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹
                    <AnimatedCounter
                      value={totalBudget / 100000}
                      decimals={1}
                      suffix="L"
                    />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                  <DollarSign className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">15.3%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹
                    <AnimatedCounter
                      value={totalSpent / 100000}
                      decimals={1}
                      suffix="L"
                    />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <TrendingUp className="text-green-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">23.1%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Impressions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter
                      value={totalImpressions / 1000000}
                      decimals={1}
                      suffix="M"
                    />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg">
                  <Eye className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">18.7%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
              whileHover={{ y: -5 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Campaigns
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={activeCampaigns} />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-yellow-100 to-orange-100 rounded-lg">
                  <Activity className="text-yellow-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowDown className="text-red-600 mr-1" size={16} />
                <span className="text-red-600 font-medium">5.2%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>
          </div>
        </motion.div>


        {/* Professional Tabs and Controls Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6"
        >
          {/* Tab Navigation */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div className="flex space-x-1 mb-4 lg:mb-0 overflow-x-auto">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
                    selectedTab === tab
                      ? "bg-gradient-to-r from-blue-100 to-purple-100 text-blue-700 border border-blue-200 shadow-sm"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                >
                  {tab}
                  <span
                    className={`ml-2 text-xs px-2 py-1 rounded-full ${
                      selectedTab === tab
                        ? "bg-blue-200 text-blue-800"
                        : "bg-gray-200 text-gray-600"
                    }`}
                  >
                    {tab === "All"
                      ? campaignData.length
                      : campaignData.filter((c) => c.status === tab).length}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown
                  className={`transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </motion.button>
              <motion.button
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={18} />
              </motion.button>
            </div>
          </div>

          {/* Expandable Filter Controls */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6 overflow-hidden border-t pt-4"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Name</option>
                    <option value="brand">Brand</option>
                    <option value="budget">Budget</option>
                    <option value="spent">Spent</option>
                    <option value="impressions">Impressions</option>
                    <option value="startDate">Start Date</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) =>
                      setSortOrder(e.target.value as "asc" | "desc")
                    }
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="asc">Ascending</option>
                    <option value="desc">Descending</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    View Mode
                  </label>
                  <div className="flex items-center bg-gray-100 rounded-lg p-1">
                    <button
                      onClick={() => setViewMode("grid")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        viewMode === "grid"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600"
                      }`}
                    >
                      Grid
                    </button>
                    <button
                      onClick={() => setViewMode("list")}
                      className={`flex-1 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
                        viewMode === "list"
                          ? "bg-white text-blue-600 shadow-sm"
                          : "text-gray-600"
                      }`}
                    >
                      List
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Campaign Cards/List with staggered animations */}
        <motion.div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
        >
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + 0.1 * index }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer overflow-hidden group"
              whileHover={{ y: -5, scale: 1.02 }}
              onClick={() => setSelectedCampaign(campaign)}
            >
              {viewMode === "grid" ? (
                <div className="h-full">
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                          {campaign.name}
                        </h3>
                        <p className="text-gray-600 text-sm">
                          {campaign.brand}
                        </p>
                      </div>
                      <div className="flex items-center space-x-2">
                        <div
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                            campaign.status
                          )}`}
                        >
                          <div className="flex items-center space-x-1">
                            {getStatusIcon(campaign.status)}
                            <span>{campaign.status}</span>
                          </div>
                        </div>
                        <motion.button
                          className="p-1 hover:bg-gray-100 rounded transition-colors"
                          whileHover={{ rotate: 90 }}
                        >
                          <MoreHorizontal size={16} />
                        </motion.button>
                      </div>
                    </div>

                    {/* Date Range */}
                    <div className="flex items-center text-sm text-gray-600 mb-4">
                      <Calendar className="mr-2" size={16} />
                      <span>
                        {new Date(campaign.startDate).toLocaleDateString()} -{" "}
                        {new Date(campaign.endDate).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Budget Progress with animated bar */}
                    <div className="mb-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-600">
                          Budget Utilization
                        </span>
                        <span className="text-sm font-medium text-gray-900">
                          ₹{(campaign.spent / 1000).toFixed(0)}K / ₹
                          {(campaign.budget / 1000).toFixed(0)}K
                        </span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <motion.div
                          className="h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{
                            width: `${Math.min(
                              (campaign.spent / campaign.budget) * 100,
                              100
                            )}%`,
                          }}
                          transition={{
                            duration: 1.5,
                            delay: 0.8 + index * 0.1,
                          }}
                        />
                      </div>
                      <div className="flex justify-between mt-1 text-xs text-gray-500">
                        <span>
                          {((campaign.spent / campaign.budget) * 100).toFixed(
                            1
                          )}
                          % used
                        </span>
                        <span>
                          ₹
                          {((campaign.budget - campaign.spent) / 1000).toFixed(
                            0
                          )}
                          K remaining
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Metrics Section */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <motion.p
                          className="text-2xl font-bold text-blue-600"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 1 + index * 0.1,
                            type: "spring",
                          }}
                        >
                          {(campaign.impressions / 1000000).toFixed(1)}M
                        </motion.p>
                        <p className="text-xs text-gray-600">Impressions</p>
                      </div>
                      <div className="text-center">
                        <motion.p
                          className="text-2xl font-bold text-green-600"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 1.1 + index * 0.1,
                            type: "spring",
                          }}
                        >
                          {campaign.clicks.toLocaleString()}
                        </motion.p>
                        <p className="text-xs text-gray-600">Clicks</p>
                      </div>
                      <div className="text-center">
                        <motion.p
                          className="text-2xl font-bold text-purple-600"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          transition={{
                            delay: 1.2 + index * 0.1,
                            type: "spring",
                          }}
                        >
                          {campaign.ctr.toFixed(2)}%
                        </motion.p>
                        <p className="text-xs text-gray-600">CTR</p>
                      </div>
                    </div>

                    {/* Active Screens */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Active Screens ({campaign.screens.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {campaign.screens.slice(0, 2).map((screen, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: 1.3 + idx * 0.1 }}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {screen.city}
                          </motion.div>
                        ))}
                        {campaign.screens.length > 2 && (
                          <div className="bg-gray-100 text-gray-600 px-2 py-1 rounded text-xs">
                            +{campaign.screens.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex space-x-2">
                      {campaign.status === "Active" ? (
                        <motion.button
                          className="flex-1 flex items-center justify-center space-x-2 bg-yellow-100 text-yellow-700 py-2 px-3 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Pause size={16} />
                          <span>Pause</span>
                        </motion.button>
                      ) : campaign.status === "Paused" ? (
                        <motion.button
                          className="flex-1 flex items-center justify-center space-x-2 bg-green-100 text-green-700 py-2 px-3 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Play size={16} />
                          <span>Resume</span>
                        </motion.button>
                      ) : (
                        <motion.button
                          className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          <Eye size={16} />
                          <span>View</span>
                        </motion.button>
                      )}
                      <motion.button
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.02, rotate: 5 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Edit3 size={16} />
                      </motion.button>
                      <motion.button
                        className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <BarChart3 size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              ) : (
                // List View Layout
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                          {campaign.name}
                        </h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                          <span>{campaign.brand}</span>
                          <span className="flex items-center">
                            <Calendar size={14} className="mr-1" />
                            {new Date(
                              campaign.startDate
                            ).toLocaleDateString()}{" "}
                            - {new Date(campaign.endDate).toLocaleDateString()}
                          </span>
                          <span className="flex items-center">
                            <Monitor size={14} className="mr-1" />
                            {campaign.screens.length} screens
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-bold text-lg text-gray-900">
                          ₹{(campaign.budget / 1000).toFixed(0)}K
                        </p>
                        <p className="text-sm text-gray-600">budget</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-purple-600">
                          {(campaign.impressions / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-sm text-gray-600">impressions</p>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-lg text-green-600">
                          {campaign.ctr.toFixed(2)}%
                        </p>
                        <p className="text-sm text-gray-600">CTR</p>
                      </div>
                      <div
                        className={`px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                          campaign.status
                        )}`}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(campaign.status)}
                          <span>{campaign.status}</span>
                        </div>
                      </div>
                      <motion.button
                        className="p-2 hover:bg-gray-100 rounded transition-colors"
                        whileHover={{ rotate: 90 }}
                      >
                        <MoreHorizontal size={16} />
                      </motion.button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </motion.div>

        {/* Professional Campaign Detail Modal */}
        <AnimatePresence>
          {selectedCampaign && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedCampaign(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  {/* Modal Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent">
                        {selectedCampaign.name}
                      </h2>
                      <p className="text-gray-600">{selectedCampaign.brand}</p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div
                        className={`px-4 py-2 rounded-full text-sm font-medium border ${getStatusColor(
                          selectedCampaign.status
                        )}`}
                      >
                        <div className="flex items-center space-x-1">
                          {getStatusIcon(selectedCampaign.status)}
                          <span>{selectedCampaign.status}</span>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSelectedCampaign(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <XCircle size={24} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Quick Stats with gradient backgrounds */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <motion.div
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3">
                        <DollarSign className="text-blue-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{(selectedCampaign.budget / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="text-green-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Spent</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{(selectedCampaign.spent / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Eye className="text-purple-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Impressions</p>
                          <p className="text-xl font-bold text-gray-900">
                            {(selectedCampaign.impressions / 1000000).toFixed(
                              1
                            )}
                            M
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Users className="text-yellow-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Clicks</p>
                          <p className="text-xl font-bold text-gray-900">
                            {selectedCampaign.clicks.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                    <motion.div
                      className="bg-gradient-to-r from-red-50 to-rose-50 rounded-lg p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Target className="text-red-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">CTR</p>
                          <p className="text-xl font-bold text-gray-900">
                            {selectedCampaign.ctr.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Screens and Schedule */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <motion.div
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Active Screens
                      </h3>
                      <div className="space-y-3">
                        {selectedCampaign.screens.map(
                          (screen: any, index: number) => (
                            <motion.div
                              key={index}
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 + index * 0.1 }}
                              className="bg-gray-50 rounded-lg p-3 hover:bg-gray-100 transition-colors"
                            >
                              <h4 className="font-medium text-gray-900">
                                {screen.name}
                              </h4>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <MapPin size={14} className="mr-1" />
                                {screen.city}
                              </p>
                            </motion.div>
                          )
                        )}
                      </div>
                    </motion.div>

                    <motion.div
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Schedule
                      </h3>
                      <div className="bg-gray-50 rounded-lg p-4">
                        <div className="mb-4">
                          <p className="font-medium text-gray-900 mb-2">
                            Time Slots
                          </p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCampaign.schedule.timeSlots.map(
                              (slot: string, index: number) => (
                                <motion.span
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.5 + index * 0.1 }}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {slot}
                                </motion.span>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-2">Days</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCampaign.schedule.days.map(
                              (day: string, index: number) => (
                                <motion.span
                                  key={index}
                                  initial={{ opacity: 0, scale: 0.8 }}
                                  animate={{ opacity: 1, scale: 1 }}
                                  transition={{ delay: 0.7 + index * 0.1 }}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {day.slice(0, 3)}
                                </motion.span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Professional Action Buttons */}
                  <motion.div
                    className="flex space-x-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 }}
                  >
                    <motion.button
                      className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-purple-700 transition-all flex items-center space-x-2"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit3 size={20} />
                      <span>Edit Campaign</span>
                    </motion.button>
                    <motion.button
                      className="bg-gradient-to-r from-green-600 to-emerald-600 text-white px-6 py-3 rounded-lg font-semibold hover:from-green-700 hover:to-emerald-700 transition-all flex items-center space-x-2"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Copy size={20} />
                      <span>Duplicate</span>
                    </motion.button>
                    <motion.button
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center space-x-2"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Share2 size={20} />
                      <span>Share</span>
                    </motion.button>
                    <motion.button
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-all flex items-center space-x-2"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BarChart3 size={20} />
                      <span>Analytics</span>
                    </motion.button>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Campaign Creation Workflow Modal */}
        <AnimatePresence>
          {showCreateWorkflow && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  setShowCreateWorkflow(false);
                }
              }}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-hidden shadow-2xl"
              >
                <CampaignCreationWorkflow
                  onClose={() => setShowCreateWorkflow(false)}
                  onCampaignCreated={(campaign: any) => {
                    // Handle successful campaign creation
                    console.log("Campaign created:", campaign);
                    setShowCreateWorkflow(false);
                    // You can add campaign to the local state or refetch data
                    setCampaignData((prev) => [...prev, campaign]);
                  }}
                />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CampaignManagement;
