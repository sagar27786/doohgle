// Professional Campaign Management - Industry Ready with Advanced Animations
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Play,
  Pause,
  Edit3,
  Eye,
  Calendar,
  Clock,
  Target,
  DollarSign,
  TrendingUp,
  Users,
  MapPin,
  Monitor,
  BarChart3,
  RefreshCw,
  Download,
  Upload,
  Share2,
  Copy,
  AlertCircle,
  CheckCircle,
  XCircle,
  Activity,
  ArrowUp,
  ArrowDown,
  ChevronDown,
  Star,
  Zap,
  PieChart as PieChartIcon,
} from "lucide-react";

// Chart imports
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

// Sample campaign data
const campaignData = [
  {
    id: 1,
    name: "Summer Electronics Sale 2024",
    brand: "TechMart",
    status: "Active",
    startDate: "2024-06-01",
    endDate: "2024-06-30",
    budget: 500000,
    spent: 342000,
    impressions: 2500000,
    clicks: 12500,
    ctr: 0.5,
    screens: [
      { name: "Bandra Kurla Complex LED Wall", city: "Mumbai" },
      { name: "Connaught Place LED Screen", city: "Delhi" },
      { name: "MG Road Digital Billboard", city: "Bangalore" },
    ],
    creatives: [
      { name: "Summer_Sale_Main.mp4", size: "1920x1080" },
      { name: "Electronics_Promo.jpg", size: "1920x1080" },
    ],
    performance: {
      reach: 1800000,
      frequency: 1.4,
      engagement: 0.12,
    },
    schedule: {
      timeSlots: ["06:00-12:00", "18:00-24:00"],
      days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
    },
  },
  {
    id: 2,
    name: "Fashion Week Showcase",
    brand: "StyleHub",
    status: "Scheduled",
    startDate: "2024-07-15",
    endDate: "2024-07-25",
    budget: 750000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    screens: [
      { name: "Marina Beach Billboard", city: "Chennai" },
      { name: "Park Street Digital Display", city: "Kolkata" },
      { name: "Koregaon Park LED Wall", city: "Pune" },
    ],
    creatives: [
      { name: "Fashion_Week_Hero.mp4", size: "1920x1080" },
      { name: "Designer_Collection.jpg", size: "1920x1080" },
      { name: "Runway_Highlights.mp4", size: "1920x1080" },
    ],
    performance: {
      reach: 0,
      frequency: 0,
      engagement: 0,
    },
    schedule: {
      timeSlots: ["12:00-18:00", "18:00-24:00"],
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
    id: 3,
    name: "Food Festival Promotion",
    brand: "FoodieDelight",
    status: "Completed",
    startDate: "2024-05-01",
    endDate: "2024-05-31",
    budget: 300000,
    spent: 295000,
    impressions: 1800000,
    clicks: 8900,
    ctr: 0.49,
    screens: [
      { name: "HITEC City LED Wall", city: "Hyderabad" },
      { name: "CG Road Billboard", city: "Ahmedabad" },
    ],
    creatives: [
      { name: "Food_Festival_Main.jpg", size: "1920x1080" },
      { name: "Cuisine_Variety.mp4", size: "1920x1080" },
    ],
    performance: {
      reach: 1200000,
      frequency: 1.5,
      engagement: 0.15,
    },
    schedule: {
      timeSlots: ["11:00-14:00", "19:00-22:00"],
      days: ["Friday", "Saturday", "Sunday"],
    },
  },
  {
    id: 4,
    name: "Auto Expo Launch",
    brand: "SpeedMotors",
    status: "Paused",
    startDate: "2024-06-10",
    endDate: "2024-07-10",
    budget: 1000000,
    spent: 450000,
    impressions: 1200000,
    clicks: 6000,
    ctr: 0.5,
    screens: [
      { name: "Bandra Kurla Complex LED Wall", city: "Mumbai" },
      { name: "MG Road Digital Billboard", city: "Bangalore" },
      { name: "Marina Beach Billboard", city: "Chennai" },
      { name: "HITEC City LED Wall", city: "Hyderabad" },
    ],
    creatives: [
      { name: "Auto_Expo_Hero.mp4", size: "1920x1080" },
      { name: "New_Models.jpg", size: "1920x1080" },
      { name: "Test_Drive.mp4", size: "1920x1080" },
    ],
    performance: {
      reach: 900000,
      frequency: 1.3,
      engagement: 0.08,
    },
    schedule: {
      timeSlots: ["08:00-12:00", "16:00-20:00"],
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
    id: 5,
    name: "Health & Wellness Week",
    brand: "VitalLife",
    status: "Draft",
    startDate: "2024-08-01",
    endDate: "2024-08-07",
    budget: 400000,
    spent: 0,
    impressions: 0,
    clicks: 0,
    ctr: 0,
    screens: [
      { name: "Park Street Digital Display", city: "Kolkata" },
      { name: "Koregaon Park LED Wall", city: "Pune" },
    ],
    creatives: [{ name: "Wellness_Campaign.jpg", size: "1920x1080" }],
    performance: {
      reach: 0,
      frequency: 0,
      engagement: 0,
    },
    schedule: {
      timeSlots: ["07:00-10:00", "17:00-20:00"],
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
];

const getStatusColor = (status: string) => {
  switch (status) {
    case "Active":
      return "bg-green-100 text-green-800 border-green-200";
    case "Scheduled":
      return "bg-blue-100 text-blue-800 border-blue-200";
    case "Completed":
      return "bg-gray-100 text-gray-800 border-gray-200";
    case "Paused":
      return "bg-yellow-100 text-yellow-800 border-yellow-200";
    case "Draft":
      return "bg-purple-100 text-purple-800 border-purple-200";
    default:
      return "bg-gray-100 text-gray-800 border-gray-200";
  }
};

const getStatusIcon = (status: string) => {
  switch (status) {
    case "Active":
      return <CheckCircle size={16} className="text-green-600" />;
    case "Scheduled":
      return <Clock size={16} className="text-blue-600" />;
    case "Completed":
      return <CheckCircle size={16} className="text-gray-600" />;
    case "Paused":
      return <Pause size={16} className="text-yellow-600" />;
    case "Draft":
      return <Edit3 size={16} className="text-purple-600" />;
    default:
      return <AlertCircle size={16} className="text-gray-600" />;
  }
};

const CampaignManagement: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [countersStarted, setCountersStarted] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [selectedTab, setSelectedTab] = useState("All");
  const [selectedView, setSelectedView] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState<string>("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterStatus, setFilterStatus] = useState<string>("All");

  const tabs = ["All", "Active", "Scheduled", "Paused", "Completed"];

  // Enhanced data sets for campaigns
  const campaignPerformance = [
    { month: "Jan", budget: 400, spent: 350, roi: 180 },
    { month: "Feb", budget: 450, spent: 420, roi: 220 },
    { month: "Mar", budget: 500, spent: 480, roi: 250 },
    { month: "Apr", budget: 550, spent: 520, roi: 310 },
    { month: "May", budget: 600, spent: 580, roi: 340 },
    { month: "Jun", budget: 650, spent: 620, roi: 380 },
  ];

  const campaignTypes = [
    { name: "Video Campaigns", count: 45, color: "#8b5cf6" },
    { name: "Display Ads", count: 32, color: "#06b6d4" },
    { name: "Interactive", count: 18, color: "#10b981" },
    { name: "Branded Content", count: 25, color: "#f59e0b" },
  ];

  const recentActivity = [
    {
      id: 1,
      text: "Summer Sale campaign launched",
      time: "5 min ago",
      type: "success",
      campaign: "TechMart Summer Sale",
    },
    {
      id: 2,
      text: "Fashion Week budget increased",
      time: "12 min ago",
      type: "info",
      campaign: "StyleHub Fashion",
    },
    {
      id: 3,
      text: "Auto Expo campaign paused",
      time: "1 hour ago",
      type: "warning",
      campaign: "SpeedMotors Launch",
    },
    {
      id: 4,
      text: "Holiday campaign completed",
      time: "2 hours ago",
      type: "success",
      campaign: "Holiday Special",
    },
  ];

  // Loading sequence
  useEffect(() => {
    const sequence = async () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2000);

      setTimeout(() => {
        setShowMainContent(true);
        setCountersStarted(true);
      }, 2500);
    };

    sequence();
  }, []);

  // Enhanced animated counter
  const AnimatedCounter: React.FC<{
    value: number;
    suffix?: string;
    prefix?: string;
    decimals?: number;
    duration?: number;
  }> = ({ value, suffix = "", prefix = "", decimals = 0, duration = 2500 }) => {
    const [count, setCount] = useState(0);

    useEffect(() => {
      if (!countersStarted) return;

      let startTime: number;

      const animate = (currentTime: number) => {
        if (!startTime) startTime = currentTime;
        const elapsed = currentTime - startTime;
        const progress = Math.min(elapsed / duration, 1);

        const easeOutExpo =
          progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
        const currentValue = value * easeOutExpo;

        setCount(currentValue);

        if (progress < 1) {
          requestAnimationFrame(animate);
        }
      };

      requestAnimationFrame(animate);
    }, [countersStarted, value, duration]);

    const formatNumber = (num: number) => {
      return num.toFixed(decimals).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    };

    return (
      <motion.span
        initial={{ scale: 0.5, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        {prefix}
        {formatNumber(count)}
        {suffix}
      </motion.span>
    );
  };

  // Professional loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden relative">
        {/* Advanced background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(30)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                left: Math.random() * 100 + "%",
                top: Math.random() * 100 + "%",
              }}
              initial={{ opacity: 0, scale: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                y: [0, -100, -200],
              }}
              transition={{
                duration: Math.random() * 3 + 2,
                repeat: Infinity,
                delay: Math.random() * 2,
                ease: "easeOut",
              }}
            />
          ))}
        </div>

        {/* Gradient orbs */}
        <motion.div
          className="absolute top-1/3 left-1/3 w-72 h-72 bg-purple-500 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />

        <div className="text-center z-10 relative">
          {/* Professional logo animation */}
          <motion.div
            className="relative mb-12"
            initial={{ scale: 0, rotateY: -180, opacity: 0 }}
            animate={{
              scale: 1,
              rotateY: 0,
              opacity: 1,
            }}
            transition={{
              duration: 2.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            <motion.div className="w-40 h-40 mx-auto relative">
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 opacity-40 blur-2xl"
                animate={{
                  scale: [1, 1.2, 1],
                  opacity: [0.4, 0.8, 0.4],
                }}
                transition={{
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              />

              <motion.div className="relative w-full h-full bg-gradient-to-br from-purple-600 via-indigo-600 to-pink-700 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/30">
                <motion.div
                  className="text-white"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  <Target size={48} />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Company section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 1.2 }}
          >
            <h2 className="text-6xl font-bold mb-4">
              {"Campaign Manager".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 100, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: 1 + index * 0.1,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          <motion.div
            className="space-y-6 max-w-2xl mx-auto"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
          >
            <motion.div className="space-y-4">
              <h3 className="text-2xl text-purple-200 font-semibold tracking-wide">
                Professional Campaign Management
              </h3>
              <p className="text-lg text-gray-300 leading-relaxed">
                Create, manage, and optimize high-impact advertising campaigns
                with advanced analytics
              </p>
            </motion.div>

            {/* Enhanced progress bar */}
            <motion.div
              className="space-y-3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1.2, duration: 0.8 }}
            >
              <div className="w-80 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden border border-gray-700">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full relative"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{
                    delay: 1.5,
                    duration: 2,
                    ease: "easeInOut",
                  }}
                >
                  <motion.div
                    className="absolute inset-0 bg-white/30 rounded-full"
                    animate={{ x: ["-100%", "100%"] }}
                    transition={{
                      duration: 1.5,
                      repeat: Infinity,
                      ease: "linear",
                    }}
                  />
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Filter campaigns based on tab and search
  const filteredCampaigns = campaignData
    .filter((campaign) => {
      const matchesTab =
        selectedTab === "All" || campaign.status === selectedTab;
      const matchesSearch =
        campaign.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        campaign.brand.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesTab && matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-indigo-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <Target className="mr-3 text-blue-600" size={36} />
                Campaign Management
              </h1>
              <p className="text-gray-600">
                Create, monitor, and optimize your digital advertising campaigns
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 lg:mt-0">
              <motion.button
                className="flex items-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors font-semibold shadow-lg"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={20} />
                <span>Create Campaign</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Upload size={18} />
                <span>Import</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Download size={18} />
                <span>Export</span>
              </motion.button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Budget
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(totalBudget / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
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
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Spent</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(totalSpent / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
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
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Impressions
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {(totalImpressions / 1000000).toFixed(1)}M
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
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
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Campaigns
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeCampaigns}
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
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

        {/* Tabs and Controls */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6"
        >
          {/* Tab Navigation */}
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div className="flex space-x-1 mb-4 lg:mb-0 overflow-x-auto">
              {tabs.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors whitespace-nowrap ${
                    selectedTab === tab
                      ? "bg-blue-100 text-blue-700 border border-blue-200"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  {tab}
                  <span className="ml-2 text-xs bg-gray-200 px-2 py-1 rounded-full">
                    {tab === "All"
                      ? campaignData.length
                      : campaignData.filter((c) => c.status === tab).length}
                  </span>
                </button>
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
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown
                  className={`transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>
              <motion.button
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={18} />
              </motion.button>
            </div>
          </div>

          {/* Filter Controls */}
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

        {/* Campaign Cards/List */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredCampaigns.map((campaign, index) => (
            <motion.div
              key={campaign.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer overflow-hidden"
              onClick={() => setSelectedCampaign(campaign)}
            >
              {viewMode === "grid" ? (
                <div>
                  {/* Header */}
                  <div className="p-6 border-b border-gray-100">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-bold text-lg text-gray-900 mb-1">
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
                        <button className="p-1 hover:bg-gray-100 rounded transition-colors">
                          <MoreHorizontal size={16} />
                        </button>
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

                    {/* Budget Progress */}
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
                          transition={{ duration: 1, delay: 0.5 }}
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

                  {/* Metrics */}
                  <div className="p-6">
                    <div className="grid grid-cols-3 gap-4 mb-4">
                      <div className="text-center">
                        <p className="text-2xl font-bold text-blue-600">
                          {(campaign.impressions / 1000000).toFixed(1)}M
                        </p>
                        <p className="text-xs text-gray-600">Impressions</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-green-600">
                          {campaign.clicks.toLocaleString()}
                        </p>
                        <p className="text-xs text-gray-600">Clicks</p>
                      </div>
                      <div className="text-center">
                        <p className="text-2xl font-bold text-purple-600">
                          {campaign.ctr.toFixed(2)}%
                        </p>
                        <p className="text-xs text-gray-600">CTR</p>
                      </div>
                    </div>

                    {/* Screens */}
                    <div className="mb-4">
                      <p className="text-sm font-medium text-gray-700 mb-2">
                        Active Screens ({campaign.screens.length})
                      </p>
                      <div className="flex flex-wrap gap-1">
                        {campaign.screens.slice(0, 2).map((screen, idx) => (
                          <div
                            key={idx}
                            className="bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs"
                          >
                            {screen.city}
                          </div>
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
                        whileHover={{ scale: 1.02 }}
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
                <div className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">
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
                      <button className="p-2 hover:bg-gray-100 rounded transition-colors">
                        <MoreHorizontal size={16} />
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Campaign Detail Modal */}
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
                  {/* Header */}
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
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
                      <button
                        onClick={() => setSelectedCampaign(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <XCircle size={24} />
                      </button>
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="text-blue-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Budget</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{(selectedCampaign.budget / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <TrendingUp className="text-green-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Spent</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{(selectedCampaign.spent / 1000).toFixed(0)}K
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
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
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Users className="text-yellow-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Clicks</p>
                          <p className="text-xl font-bold text-gray-900">
                            {selectedCampaign.clicks.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-red-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Target className="text-red-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">CTR</p>
                          <p className="text-xl font-bold text-gray-900">
                            {selectedCampaign.ctr.toFixed(2)}%
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Screens and Schedule */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-4">
                        Active Screens
                      </h3>
                      <div className="space-y-3">
                        {selectedCampaign.screens.map(
                          (screen: any, index: number) => (
                            <div
                              key={index}
                              className="bg-gray-50 rounded-lg p-3"
                            >
                              <h4 className="font-medium text-gray-900">
                                {screen.name}
                              </h4>
                              <p className="text-sm text-gray-600 flex items-center mt-1">
                                <MapPin size={14} className="mr-1" />
                                {screen.city}
                              </p>
                            </div>
                          )
                        )}
                      </div>
                    </div>

                    <div>
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
                                <span
                                  key={index}
                                  className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {slot}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 mb-2">Days</p>
                          <div className="flex flex-wrap gap-2">
                            {selectedCampaign.schedule.days.map(
                              (day: string, index: number) => (
                                <span
                                  key={index}
                                  className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm"
                                >
                                  {day.slice(0, 3)}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-4">
                    <motion.button
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Edit3 size={20} />
                      <span>Edit Campaign</span>
                    </motion.button>
                    <motion.button
                      className="bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Copy size={20} />
                      <span>Duplicate</span>
                    </motion.button>
                    <motion.button
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Share2 size={20} />
                      <span>Share</span>
                    </motion.button>
                    <motion.button
                      className="border border-gray-300 text-gray-700 px-6 py-3 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BarChart3 size={20} />
                      <span>Analytics</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CampaignManagement;
