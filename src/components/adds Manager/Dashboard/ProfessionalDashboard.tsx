// Professional Enhanced Dashboard - Industry Ready with Advanced Animations
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
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
} from "recharts";
import {
  TrendingUp,
  TrendingDown,
  Calendar,
  Settings,
  Bell,
  Search,
  Plus,
  Eye,
  DollarSign,
  CheckCircle,
  Clock,
  ArrowUpRight,
  Star,
  MoreHorizontal,
  RefreshCw,
  Users,
  Target,
  Activity,
  Zap,
  Award,
  MousePointer,
  BarChart3,
  Globe,
  Monitor,
  PlayCircle,
  Upload,
  UserPlus,
  Navigation,
} from "lucide-react";

const ProfessionalDashboard: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [countersStarted, setCountersStarted] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);

  // Enhanced data sets
  const impressionsOverTime = [
    { day: "Mon", clicks: 245, impressions: 2500 },
    { day: "Tue", clicks: 189, impressions: 1800 },
    { day: "Wed", clicks: 510, impressions: 10000 },
    { day: "Thu", clicks: 390, impressions: 4200 },
    { day: "Fri", clicks: 480, impressions: 5000 },
    { day: "Sat", clicks: 340, impressions: 3800 },
    { day: "Sun", clicks: 420, impressions: 4500 },
  ];

  const adSpendVsRevenue = [
    { month: "Jan", spend: 15000, revenue: 18000 },
    { month: "Feb", spend: 18500, revenue: 21000 },
    { month: "Mar", spend: 22000, revenue: 27000 },
    { month: "Apr", spend: 18200, revenue: 24500 },
    { month: "May", spend: 23100, revenue: 29800 },
    { month: "Jun", spend: 24500, revenue: 35200 },
  ];

  const campaignPerformance = [
    { name: "Summer Sale", performance: 35, color: "#8b5cf6" },
    { name: "Brand Awareness", performance: 25, color: "#06b6d4" },
    { name: "Holiday Special", performance: 20, color: "#10b981" },
    { name: "Product Launch", performance: 15, color: "#f59e0b" },
    { name: "Others", performance: 5, color: "#ef4444" },
  ];

  const performanceData = [
    { name: "Click Rate", value: 68, color: "#a855f7" },
    { name: "Engagement", value: 23, color: "#3b82f6" },
    { name: "Conversion", value: 16, color: "#f97316" },
  ];

  const realtimeActivity = [
    { id: 1, text: "New campaign started", time: "2 min ago", type: "success" },
    { id: 2, text: "Screen went offline", time: "5 min ago", type: "warning" },
    {
      id: 3,
      text: "Budget threshold reached",
      time: "8 min ago",
      type: "info",
    },
    { id: 4, text: "High CTR detected", time: "12 min ago", type: "success" },
  ];

  // Enhanced loading sequence
  useEffect(() => {
    const sequence = async () => {
      // Logo animation phase (2.5 seconds)
      setTimeout(() => {
        setLogoAnimationComplete(true);
      }, 2000);

      // Tagline phase (1.5 seconds)
      setTimeout(() => {
        setShowTagline(true);
      }, 2800);

      // Main content phase
      setTimeout(() => {
        setIsLoading(false);
      }, 4500);

      // Counter animations start
      setTimeout(() => {
        setShowMainContent(true);
        setCountersStarted(true);
      }, 5000);
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

        // Advanced easing function
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

  const handleCreateCampaign = () => {
    // Navigate to create campaign page with smooth transition
    navigate("/products/ads-manager/campaigns/create");
  };

  const quickActions = [
    {
      icon: Plus,
      label: "Create Campaign",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      action: handleCreateCampaign,
    },
    {
      icon: Monitor,
      label: "Add Screen",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      action: () => console.log("Add Screen"),
    },
    {
      icon: Upload,
      label: "Upload Creative",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      action: () => console.log("Upload Creative"),
    },
    {
      icon: BarChart3,
      label: "View Reports",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      action: () => console.log("View Reports"),
    },
    {
      icon: UserPlus,
      label: "Manage Users",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      action: () => console.log("Manage Users"),
    },
    {
      icon: Navigation,
      label: "Quick Maps Navigation",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      action: () => console.log("Maps Navigation"),
    },
  ];

  // Professional loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 flex items-center justify-center overflow-hidden relative">
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
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-500 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            opacity: [0.2, 0.4, 0.2],
          }}
          transition={{ duration: 4, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"
          animate={{
            scale: [1, 1.3, 1],
            opacity: [0.2, 0.3, 0.2],
          }}
          transition={{ duration: 5, repeat: Infinity, delay: 1 }}
        />

        <div className="text-center z-10 relative">
          {/* Professional logo animation */}
          <motion.div
            className="relative mb-12"
            initial={{ scale: 0, rotateY: -180, opacity: 0 }}
            animate={{
              scale: logoAnimationComplete ? [1, 1.05, 1] : 1,
              rotateY: 0,
              opacity: 1,
            }}
            transition={{
              duration: 2.5,
              ease: [0.25, 0.46, 0.45, 0.94],
            }}
          >
            {/* Multiple animated rings */}
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className={`absolute inset-0 w-40 h-40 mx-auto border-2 rounded-3xl`}
                style={{
                  borderColor:
                    i === 0 ? "#3b82f6" : i === 1 ? "#8b5cf6" : "#ec4899",
                  borderStyle: "dashed",
                }}
                animate={{ rotate: 360 }}
                transition={{
                  duration: 8 - i * 2,
                  repeat: Infinity,
                  ease: "linear",
                  delay: i * 0.5,
                }}
              />
            ))}

            <motion.div className="w-40 h-40 mx-auto relative">
              {/* Outer glow */}
              <motion.div
                className="absolute inset-0 rounded-3xl bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-40 blur-2xl"
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

              {/* Main logo */}
              <motion.div
                className="relative w-full h-full bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-700 rounded-3xl flex items-center justify-center shadow-2xl border-2 border-white/30"
                animate={{
                  boxShadow: [
                    "0 0 0 0 rgba(59, 130, 246, 0.7)",
                    "0 0 0 20px rgba(59, 130, 246, 0)",
                    "0 0 0 0 rgba(59, 130, 246, 0)",
                  ],
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.span
                  className="text-white font-bold text-5xl tracking-wider"
                  initial={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 1 }}
                >
                  DT
                </motion.span>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Company name with sophisticated animation */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: logoAnimationComplete ? 1 : 0 }}
            transition={{ delay: 0.8, duration: 1.2 }}
          >
            <h2 className="text-6xl font-bold mb-4">
              {"Doohgle Tech".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 100, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: logoAnimationComplete ? 1 + index * 0.1 : 0,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
                  }}
                  whileHover={{
                    scale: 1.2,
                    color: "#fff",
                    transition: { duration: 0.2 },
                  }}
                >
                  {letter === " " ? "\u00A0" : letter}
                </motion.span>
              ))}
            </h2>
          </motion.div>

          {/* Enhanced tagline section */}
          <AnimatePresence>
            {showTagline && (
              <motion.div
                className="space-y-6 max-w-2xl mx-auto"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -50 }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              >
                <motion.div
                  className="space-y-4"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.3, duration: 1 }}
                >
                  <h3 className="text-2xl text-blue-200 font-semibold tracking-wide">
                    Digital Out-of-Home Advertising Platform
                  </h3>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    Revolutionizing outdoor advertising with intelligent
                    campaign management, real-time analytics, and seamless
                    screen network integration
                  </p>
                </motion.div>

                {/* Feature highlights */}
                <motion.div
                  className="flex justify-center space-x-8 text-sm text-gray-400"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  {[
                    "Smart Campaigns",
                    "Real-time Analytics",
                    "Global Network",
                  ].map((feature, i) => (
                    <motion.div
                      key={feature}
                      className="flex items-center space-x-2"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + i * 0.2, duration: 0.5 }}
                    >
                      <motion.div
                        className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                        animate={{ scale: [1, 1.5, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: i * 0.3,
                        }}
                      />
                      <span>{feature}</span>
                    </motion.div>
                  ))}
                </motion.div>

                {/* Enhanced progress bar */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Initializing Dashboard</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Please wait...
                    </motion.span>
                  </div>

                  <div className="w-80 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden border border-gray-700">
                    <motion.div
                      className="h-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-full relative"
                      initial={{ width: "0%" }}
                      animate={{ width: "100%" }}
                      transition={{
                        delay: 1.5,
                        duration: 3,
                        ease: "easeInOut",
                      }}
                    >
                      <motion.div
                        className="absolute inset-0 bg-white/30 rounded-full"
                        animate={{ x: ["-100%", "100%"] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                      />
                    </motion.div>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Professional Header */}
      <motion.div
        className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-6 py-4 sticky top-0 z-50"
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
      >
        <div className="flex items-center justify-between max-w-7xl mx-auto">
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.6 }}
          >
            <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Campaign Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your digital advertising campaigns with precision
            </p>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.div
              className="relative"
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.4, duration: 0.5 }}
            >
              <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Search campaigns, screens..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent w-64 bg-white/70 backdrop-blur-sm transition-all duration-200"
              />
            </motion.div>

            <motion.button
              className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <Bell className="w-5 h-5" />
              <motion.span
                className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            <motion.button
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
              whileHover={{ scale: 1.1, rotate: 90 }}
              transition={{ duration: 0.2 }}
            >
              <Settings className="w-5 h-5" />
            </motion.button>

            <motion.button
              onClick={handleCreateCampaign}
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-2 rounded-xl hover:from-blue-700 hover:to-purple-700 flex items-center space-x-2 transition-all duration-200 shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <Plus className="w-4 h-4" />
              <span>New Campaign</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="p-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-12 gap-6">
          {/* Left Column - Main Content */}
          <div className="col-span-12 lg:col-span-8 space-y-6">
            {/* Top Stats Cards */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: showMainContent ? 1 : 0,
                y: showMainContent ? 0 : 50,
              }}
              transition={{ duration: 0.8, staggerChildren: 0.1 }}
            >
              {/* Revenue Growth Card */}
              <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <motion.div
                  className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16"
                  animate={{ rotate: 360 }}
                  transition={{
                    duration: 20,
                    repeat: Infinity,
                    ease: "linear",
                  }}
                />

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <TrendingUp className="w-6 h-6" />
                    </div>
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 3,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                    >
                      <RefreshCw className="w-4 h-4 text-purple-200" />
                    </motion.div>
                  </div>

                  <div className="mb-2">
                    <span className="text-purple-200 text-sm">
                      📈 Update • Aug 23rd 2025
                    </span>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">Revenue Growth</h3>
                  <div className="text-3xl font-bold mb-3">
                    +<AnimatedCounter value={47} suffix="%" duration={2000} />
                    <span className="text-lg ml-1">this month</span>
                  </div>

                  <motion.button
                    className="text-purple-200 text-sm hover:text-white flex items-center transition-colors duration-200"
                    whileHover={{ x: 4 }}
                  >
                    View Analytics
                    <ArrowUpRight className="w-4 h-4 ml-1" />
                  </motion.button>
                </div>
              </motion.div>

              {/* Campaign Revenue */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">
                    Campaign Revenue
                  </h3>
                  <motion.button
                    className="p-1 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    whileHover={{ rotate: 180 }}
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-3">
                  ₹<AnimatedCounter value={294} />,
                  <AnimatedCounter value={500} />
                </div>

                <motion.div
                  className="flex items-center text-purple-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ y: [-1, 1, -1] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                  >
                    <TrendingUp className="w-4 h-4 mr-2" />
                  </motion.div>
                  <span className="text-sm font-medium">
                    +42% from last month
                  </span>
                </motion.div>
              </motion.div>

              {/* Total Impressions */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Total Reach</h3>
                  <motion.button
                    className="p-1 hover:bg-gray-50 rounded-lg transition-colors duration-200"
                    whileHover={{ rotate: 180 }}
                  >
                    <MoreHorizontal className="w-5 h-5 text-gray-400" />
                  </motion.button>
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-3">
                  <AnimatedCounter value={3} />.<AnimatedCounter value={8} />M
                </div>

                <motion.div
                  className="flex items-center text-blue-600"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.2, duration: 0.5 }}
                >
                  <motion.div
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                  </motion.div>
                  <span className="text-sm font-medium">
                    +18% engagement rate
                  </span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Impressions Over Time */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: -50 }}
                animate={{
                  opacity: showMainContent ? 1 : 0,
                  x: showMainContent ? 0 : -50,
                }}
                transition={{ delay: 0.4, duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-purple-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Impressions Over Time
                    </h3>
                  </div>
                </div>

                <motion.div
                  className="h-64"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.8, duration: 0.8 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={impressionsOverTime}>
                      <defs>
                        <linearGradient
                          id="impressionsGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#8b5cf6"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#8b5cf6"
                            stopOpacity={0}
                          />
                        </linearGradient>
                        <linearGradient
                          id="clicksGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#06b6d4"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#06b6d4"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="day"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Area
                        type="monotone"
                        dataKey="impressions"
                        stroke="#8b5cf6"
                        strokeWidth={3}
                        fill="url(#impressionsGradient)"
                        animationDuration={2000}
                      />
                      <Area
                        type="monotone"
                        dataKey="clicks"
                        stroke="#06b6d4"
                        strokeWidth={2}
                        fill="url(#clicksGradient)"
                        animationDuration={2000}
                        animationDelay={500}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>

              {/* Ad Spend vs Revenue */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                initial={{ opacity: 0, x: 50 }}
                animate={{
                  opacity: showMainContent ? 1 : 0,
                  x: showMainContent ? 0 : 50,
                }}
                transition={{ delay: 0.6, duration: 0.8 }}
              >
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <Star className="w-5 h-5 text-green-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Ad Spend vs Revenue
                    </h3>
                  </div>
                </div>

                <motion.div
                  className="h-64"
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                >
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={adSpendVsRevenue}>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="month"
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <YAxis
                        axisLine={false}
                        tickLine={false}
                        tick={{ fill: "#6b7280", fontSize: 12 }}
                      />
                      <Tooltip
                        contentStyle={{
                          backgroundColor: "white",
                          border: "none",
                          borderRadius: "12px",
                          boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
                        }}
                      />
                      <Bar
                        dataKey="spend"
                        fill="#ef4444"
                        radius={[4, 4, 0, 0]}
                        animationDuration={2000}
                      />
                      <Bar
                        dataKey="revenue"
                        fill="#a855f7"
                        radius={[4, 4, 0, 0]}
                        animationDuration={2000}
                        animationDelay={300}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>
            </div>

            {/* Campaign Performance Section */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, y: 50 }}
              animate={{
                opacity: showMainContent ? 1 : 0,
                y: showMainContent ? 0 : 50,
              }}
              transition={{ delay: 0.8, duration: 0.8 }}
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-2">
                  <Star className="w-5 h-5 text-purple-500" />
                  <h3 className="text-lg font-semibold text-gray-900">
                    Top Performing Campaigns
                  </h3>
                </div>
              </div>

              <div className="space-y-4">
                {campaignPerformance.map((campaign, index) => (
                  <motion.div
                    key={campaign.name}
                    className="flex items-center justify-between p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  >
                    <div className="flex items-center space-x-4">
                      <motion.div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: campaign.color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                      <span className="font-medium text-gray-900">
                        {campaign.name}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                        <motion.div
                          className="h-full rounded-full"
                          style={{ backgroundColor: campaign.color }}
                          initial={{ width: 0 }}
                          animate={{ width: `${campaign.performance}%` }}
                          transition={{
                            delay: 1.2 + index * 0.1,
                            duration: 1,
                            ease: "easeOut",
                          }}
                        />
                      </div>
                      <span className="text-sm font-medium text-gray-600 w-8">
                        {campaign.performance}%
                      </span>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>

          {/* Right Column */}
          <div className="col-span-12 lg:col-span-4 space-y-6">
            {/* Quick Actions */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: showMainContent ? 1 : 0,
                x: showMainContent ? 0 : 50,
              }}
              transition={{ delay: 0.5, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-5 h-5 text-blue-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Quick Actions
                </h3>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {quickActions.map((action, index) => (
                  <motion.button
                    key={action.label}
                    onClick={action.action}
                    className={`${action.bgColor} p-4 rounded-xl border border-gray-100 hover:shadow-lg transition-all duration-200 group`}
                    whileHover={{ scale: 1.02, y: -2 }}
                    whileTap={{ scale: 0.98 }}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.7 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
                      className={`w-8 h-8 bg-gradient-to-r ${action.color} rounded-lg flex items-center justify-center mb-3 mx-auto`}
                      whileHover={{ rotate: 10 }}
                    >
                      <action.icon className="w-4 h-4 text-white" />
                    </motion.div>
                    <p className="text-sm font-medium text-gray-700 group-hover:text-gray-900 text-center">
                      {action.label}
                    </p>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            {/* Real-time Activity */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: showMainContent ? 1 : 0,
                x: showMainContent ? 0 : 50,
              }}
              transition={{ delay: 0.7, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Real-time Activity
                </h3>
              </div>

              <div className="space-y-4">
                {realtimeActivity.map((activity, index) => (
                  <motion.div
                    key={activity.id}
                    className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-xl transition-colors duration-200"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                  >
                    <motion.div
                      className={`w-2 h-2 rounded-full mt-2 ${
                        activity.type === "success"
                          ? "bg-green-500"
                          : activity.type === "warning"
                          ? "bg-yellow-500"
                          : "bg-blue-500"
                      }`}
                      animate={{ scale: [1, 1.3, 1] }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5,
                      }}
                    />
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">
                        {activity.text}
                      </p>
                      <p className="text-xs text-gray-500 mt-1">
                        {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Performance Metrics Pie Chart */}
            <motion.div
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, x: 50 }}
              animate={{
                opacity: showMainContent ? 1 : 0,
                x: showMainContent ? 0 : 50,
              }}
              transition={{ delay: 0.9, duration: 0.8 }}
            >
              <div className="flex items-center space-x-2 mb-6">
                <Star className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Performance Metrics
                </h3>
              </div>

              <motion.div
                className="h-48 relative"
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 1.2, duration: 0.8 }}
              >
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={performanceData}
                      cx="50%"
                      cy="50%"
                      innerRadius={50}
                      outerRadius={80}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={2000}
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
                    <motion.div
                      className="text-2xl font-bold text-gray-900"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      transition={{ delay: 2, duration: 0.5 }}
                    >
                      <AnimatedCounter value={107} suffix="%" />
                    </motion.div>
                    <div className="text-sm text-gray-500">Total Score</div>
                  </div>
                </div>
              </motion.div>

              <div className="space-y-2 mt-4">
                {performanceData.map((item, index) => (
                  <motion.div
                    key={item.name}
                    className="flex items-center justify-between"
                    initial={{ opacity: 0, x: 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 1.5 + index * 0.1, duration: 0.4 }}
                  >
                    <div className="flex items-center space-x-2">
                      <motion.div
                        className="w-3 h-3 rounded-full"
                        style={{ backgroundColor: item.color }}
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          delay: index * 0.3,
                        }}
                      />
                      <span className="text-sm text-gray-600">{item.name}</span>
                    </div>
                    <span className="text-sm font-medium text-gray-900">
                      {item.value}%
                    </span>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default ProfessionalDashboard;
