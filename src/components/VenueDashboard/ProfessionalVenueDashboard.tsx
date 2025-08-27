// Professional Enhanced Venue Dashboard - Industry Ready with Advanced Animations
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Calendar,
  DollarSign,
  TrendingUp,
  Settings,
  Bell,
  Plus,
  Star,
  ArrowUpRight,
  Upload,
  CheckCircle,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
} from "lucide-react";
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
} from "recharts";
import ScreenList from "./ScreenList";
import BookingList from "./BookingList";
import EarningsList from "./EarningsList";
import EnhancedIncomingCampaignRequests from "../Campaign/EnhancedIncomingCampaignRequests";
import NotificationPanel from "../Campaign/NotificationPanel";

const ProfessionalVenueDashboard: React.FC = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [countersStarted, setCountersStarted] = useState(false);
  const [showTagline, setShowTagline] = useState(false);
  const [showMainContent, setShowMainContent] = useState(false);
  const [logoAnimationComplete, setLogoAnimationComplete] = useState(false);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);

  // Enhanced data sets for venue
  const screenPerformance = [
    { name: "Mon", revenue: 2400, bookings: 12, utilization: 78 },
    { name: "Tue", revenue: 1398, bookings: 8, utilization: 65 },
    { name: "Wed", revenue: 9800, bookings: 18, utilization: 89 },
    { name: "Thu", revenue: 3908, bookings: 15, utilization: 82 },
    { name: "Fri", revenue: 4800, bookings: 20, utilization: 95 },
    { name: "Sat", revenue: 3800, bookings: 22, utilization: 92 },
    { name: "Sun", revenue: 4300, bookings: 16, utilization: 88 },
  ];

  const screenUtilization = [
    { name: "Screen A", utilization: 85, color: "#8b5cf6" },
    { name: "Screen B", utilization: 72, color: "#06b6d4" },
    { name: "Screen C", utilization: 95, color: "#10b981" },
    { name: "Screen D", utilization: 68, color: "#f59e0b" },
    { name: "Screen E", utilization: 90, color: "#ef4444" },
  ];

  const revenueBreakdown = [
    { category: "Premium Slots", value: 45, color: "#a855f7" },
    { category: "Regular Hours", value: 35, color: "#3b82f6" },
    { category: "Off-peak", value: 20, color: "#06b6d4" },
  ];

  const realtimeActivity = [
    {
      id: 1,
      text: "New booking confirmed",
      time: "2 min ago",
      type: "success",
      screen: "Screen A",
    },
    {
      id: 2,
      text: "Screen maintenance due",
      time: "15 min ago",
      type: "warning",
      screen: "Screen C",
    },
    {
      id: 3,
      text: "Payment received ₹15,000",
      time: "1 hour ago",
      type: "success",
      screen: "Screen B",
    },
    {
      id: 4,
      text: "Campaign request pending",
      time: "2 hours ago",
      type: "info",
      screen: "Screen D",
    },
  ];

  // Enhanced loading sequence
  useEffect(() => {
    const sequence = async () => {
      // Logo animation phase
      setTimeout(() => {
        setLogoAnimationComplete(true);
      }, 2000);

      // Tagline phase
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

  const quickActions = [
    {
      icon: Plus,
      label: "Add Screen",
      color: "from-purple-500 to-purple-600",
      bgColor: "bg-purple-50",
      action: () => setActiveTab("add-screen"),
    },
    {
      icon: Calendar,
      label: "View Bookings",
      color: "from-blue-500 to-blue-600",
      bgColor: "bg-blue-50",
      action: () => setActiveTab("bookings"),
    },
    {
      icon: Upload,
      label: "Upload Content",
      color: "from-green-500 to-green-600",
      bgColor: "bg-green-50",
      action: () => console.log("Upload Content"),
    },
    {
      icon: BarChart3,
      label: "Analytics",
      color: "from-orange-500 to-orange-600",
      bgColor: "bg-orange-50",
      action: () => console.log("Analytics"),
    },
    {
      icon: DollarSign,
      label: "Earnings",
      color: "from-pink-500 to-pink-600",
      bgColor: "bg-pink-50",
      action: () => setActiveTab("earnings"),
    },
    {
      icon: Settings,
      label: "Settings",
      color: "from-indigo-500 to-indigo-600",
      bgColor: "bg-indigo-50",
      action: () => console.log("Settings"),
    },
  ];

  // Professional loading screen
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-indigo-900 flex items-center justify-center overflow-hidden relative">
        {/* Advanced background particles */}
        <div className="absolute inset-0 overflow-hidden">
          {[...Array(25)].map((_, i) => (
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
          className="absolute top-1/4 left-1/4 w-64 h-64 bg-purple-500 rounded-full opacity-20 blur-3xl"
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
              scale: logoAnimationComplete ? [1, 1.05, 1] : 1,
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
                  <Monitor size={48} />
                </motion.div>
              </motion.div>
            </motion.div>
          </motion.div>

          {/* Company section */}
          <motion.div
            className="mb-8"
            initial={{ opacity: 0 }}
            animate={{ opacity: logoAnimationComplete ? 1 : 0 }}
            transition={{ delay: 0.8, duration: 1.2 }}
          >
            <h2 className="text-6xl font-bold mb-4">
              {"Venue Hub".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  className="inline-block bg-gradient-to-r from-purple-400 via-pink-400 to-indigo-400 bg-clip-text text-transparent"
                  initial={{ opacity: 0, y: 100, rotateX: -90 }}
                  animate={{ opacity: 1, y: 0, rotateX: 0 }}
                  transition={{
                    delay: logoAnimationComplete ? 1 + index * 0.1 : 0,
                    duration: 0.8,
                    ease: [0.25, 0.46, 0.45, 0.94],
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
                <motion.div className="space-y-4">
                  <h3 className="text-2xl text-purple-200 font-semibold tracking-wide">
                    Professional Venue Management System
                  </h3>

                  <p className="text-lg text-gray-300 leading-relaxed">
                    Streamline your screen operations, maximize revenue
                    potential, and deliver exceptional advertising experiences
                  </p>
                </motion.div>

                {/* Enhanced progress bar */}
                <motion.div
                  className="space-y-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.8 }}
                >
                  <div className="flex justify-between text-sm text-gray-400">
                    <span>Loading Venue Dashboard</span>
                    <motion.span
                      initial={{ opacity: 0 }}
                      animate={{ opacity: [0, 1, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      Initializing...
                    </motion.span>
                  </div>

                  <div className="w-80 h-2 bg-gray-800 rounded-full mx-auto overflow-hidden border border-gray-700">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 via-pink-500 to-indigo-500 rounded-full relative"
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

  const renderContent = () => {
    switch (activeTab) {
      case "screens":
        return <ScreenList />;
      case "bookings":
        return <BookingList />;
      case "earnings":
        return <EarningsList />;
      case "requests":
        return <EnhancedIncomingCampaignRequests />;
      default:
        return renderDashboard();
    }
  };

  const renderDashboard = () => (
    <motion.div
      className="min-h-screen bg-white"
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
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent">
              Venue Dashboard
            </h1>
            <p className="text-gray-600 text-sm mt-1">
              Manage your screens, bookings, and revenue streams
            </p>
          </motion.div>

          <div className="flex items-center space-x-4">
            <motion.button
              className="p-2 text-gray-400 hover:text-gray-600 relative transition-colors duration-200"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="w-5 h-5" />
              <motion.span
                className="absolute top-0 right-0 w-2 h-2 bg-red-500 rounded-full"
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              />
            </motion.button>

            <motion.button
              onClick={() => setActiveTab("add-screen")}
              className="bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 py-2 rounded-xl hover:from-purple-700 hover:to-indigo-700 flex items-center space-x-2 transition-all duration-200 shadow-lg"
              whileHover={{
                scale: 1.05,
                boxShadow: "0 10px 25px -3px rgba(0, 0, 0, 0.1)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="w-4 h-4" />
              <span>Add Screen</span>
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
              {/* Monthly Revenue Card */}
              <motion.div
                className="relative overflow-hidden bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white shadow-xl"
                whileHover={{ scale: 1.02, y: -4 }}
                transition={{ duration: 0.3 }}
              >
                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-4">
                    <div className="p-2 bg-white/20 rounded-lg">
                      <DollarSign className="w-6 h-6" />
                    </div>
                  </div>

                  <h3 className="text-xl font-semibold mb-2">
                    Monthly Revenue
                  </h3>
                  <div className="text-3xl font-bold mb-3">
                    ₹<AnimatedCounter value={1} />,
                    <AnimatedCounter value={245} />,
                    <AnimatedCounter value={680} />
                  </div>

                  <motion.div className="flex items-center text-purple-200">
                    <TrendingUp className="w-4 h-4 mr-2" />
                    <span className="text-sm font-medium">
                      +32% from last month
                    </span>
                  </motion.div>
                </div>
              </motion.div>

              {/* Active Screens */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Active Screens</h3>
                  <Monitor className="w-5 h-5 text-purple-500" />
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-3">
                  <AnimatedCounter value={12} />
                </div>

                <motion.div className="flex items-center text-purple-600">
                  <CheckCircle className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">
                    All systems operational
                  </span>
                </motion.div>
              </motion.div>

              {/* Total Bookings */}
              <motion.div
                className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100"
                whileHover={{
                  y: -4,
                  boxShadow: "0 20px 25px -5px rgba(0, 0, 0, 0.1)",
                }}
                transition={{ duration: 0.3 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-gray-600 font-medium">Total Bookings</h3>
                  <Calendar className="w-5 h-5 text-blue-500" />
                </div>

                <div className="text-3xl font-bold text-gray-900 mb-3">
                  <AnimatedCounter value={847} />
                </div>

                <motion.div className="flex items-center text-blue-600">
                  <ArrowUpRight className="w-4 h-4 mr-2" />
                  <span className="text-sm font-medium">+15% this week</span>
                </motion.div>
              </motion.div>
            </motion.div>

            {/* Charts Section */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Screen Performance */}
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
                      Revenue Trends
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
                    <AreaChart data={screenPerformance}>
                      <defs>
                        <linearGradient
                          id="revenueGradient"
                          x1="0"
                          y1="0"
                          x2="0"
                          y2="1"
                        >
                          <stop
                            offset="5%"
                            stopColor="#a855f7"
                            stopOpacity={0.3}
                          />
                          <stop
                            offset="95%"
                            stopColor="#a855f7"
                            stopOpacity={0}
                          />
                        </linearGradient>
                      </defs>
                      <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                      <XAxis
                        dataKey="name"
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
                        dataKey="revenue"
                        stroke="#a855f7"
                        strokeWidth={3}
                        fill="url(#revenueGradient)"
                        animationDuration={2000}
                      />
                    </AreaChart>
                  </ResponsiveContainer>
                </motion.div>
              </motion.div>

              {/* Screen Utilization */}
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
                    <Activity className="w-5 h-5 text-indigo-500" />
                    <h3 className="text-lg font-semibold text-gray-900">
                      Screen Utilization
                    </h3>
                  </div>
                </div>

                <div className="space-y-4">
                  {screenUtilization.map((screen, index) => (
                    <motion.div
                      key={screen.name}
                      className="flex items-center justify-between"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 1 + index * 0.1, duration: 0.5 }}
                    >
                      <div className="flex items-center space-x-3">
                        <motion.div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: screen.color }}
                          animate={{ scale: [1, 1.2, 1] }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            delay: index * 0.3,
                          }}
                        />
                        <span className="font-medium text-gray-900">
                          {screen.name}
                        </span>
                      </div>

                      <div className="flex items-center space-x-3">
                        <div className="w-24 bg-gray-200 rounded-full h-2 overflow-hidden">
                          <motion.div
                            className="h-full rounded-full"
                            style={{ backgroundColor: screen.color }}
                            initial={{ width: 0 }}
                            animate={{ width: `${screen.utilization}%` }}
                            transition={{
                              delay: 1.2 + index * 0.1,
                              duration: 1,
                              ease: "easeOut",
                            }}
                          />
                        </div>
                        <span className="text-sm font-medium text-gray-600 w-8">
                          {screen.utilization}%
                        </span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
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
                <Star className="w-5 h-5 text-purple-500" />
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
                <Activity className="w-5 h-5 text-green-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Recent Activity
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
                        {activity.screen} • {activity.time}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            {/* Revenue Breakdown */}
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
                <PieChartIcon className="w-5 h-5 text-purple-500" />
                <h3 className="text-lg font-semibold text-gray-900">
                  Revenue Breakdown
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
                      data={revenueBreakdown}
                      cx="50%"
                      cy="50%"
                      innerRadius={40}
                      outerRadius={70}
                      paddingAngle={5}
                      dataKey="value"
                      animationDuration={2000}
                    >
                      {revenueBreakdown.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </motion.div>

              <div className="space-y-2 mt-4">
                {revenueBreakdown.map((item, index) => (
                  <motion.div
                    key={item.category}
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
                      <span className="text-sm text-gray-600">
                        {item.category}
                      </span>
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

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Tabs */}
      <motion.div
        className="bg-white border-b border-gray-200 sticky top-0 z-40"
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6 }}
      >
        <div className="max-w-7xl mx-auto px-6">
          <nav className="flex space-x-8">
            {[
              { id: "dashboard", label: "Dashboard", icon: BarChart3 },
              { id: "screens", label: "My Screens", icon: Monitor },
              { id: "bookings", label: "Bookings", icon: Calendar },
              { id: "earnings", label: "Earnings", icon: DollarSign },
              { id: "requests", label: "Requests", icon: Bell },
            ].map((tab) => (
              <motion.button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center space-x-2 py-4 px-2 border-b-2 font-medium text-sm transition-colors duration-200 ${
                  activeTab === tab.id
                    ? "border-purple-500 text-purple-600"
                    : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
                }`}
                whileHover={{ y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <tab.icon className="w-5 h-5" />
                <span>{tab.label}</span>
              </motion.button>
            ))}
          </nav>
        </div>
      </motion.div>

      {/* Content */}
      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          transition={{ duration: 0.3 }}
        >
          {renderContent()}
        </motion.div>
      </AnimatePresence>

      {/* Notifications Panel */}
      <AnimatePresence>
        {showNotifications && (
          <NotificationPanel
            isOpen={showNotifications}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ProfessionalVenueDashboard;
