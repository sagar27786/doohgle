import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  BarChart3,
  Users,
  TrendingUp,
  Activity,
  MapPin,
  Globe,
  Target,
  Eye,
  ArrowUp,
  ArrowDown,
  Sparkles,
} from "lucide-react";
import DashboardMap from "../components/Map/DashboardMap";
import IndiaMapDashboard from "../components/Map/IndiaMapDashboard";
import { getAllScreens } from "../api/screens";

// API base URL
const API_BASE_URL = import.meta.env.VITE_API_URL || "https://doohgle-backend.onrender.com/api";

// API function to fetch campaigns
const fetchCampaigns = async () => {
  try {
    const response = await fetch(`${API_BASE_URL}/campaigns`);
    const data = await response.json();
    return data.success ? data.campaigns : [];
  } catch (error) {
    console.error("Failed to fetch campaigns:", error);
    return [];
  }
};

// Custom hook for number animation
const useCountAnimation = (
  end: number,
  duration: number = 2000,
  delay: number = 0
) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      let startTimestamp: number;
      const step = (timestamp: number) => {
        if (!startTimestamp) startTimestamp = timestamp;
        const progress = Math.min((timestamp - startTimestamp) / duration, 1);
        setCount(Math.floor(progress * end));

        if (progress < 1) {
          requestAnimationFrame(step);
        }
      };
      requestAnimationFrame(step);
    }, delay);

    return () => clearTimeout(timer);
  }, [end, duration, delay]);

  return count;
};

interface StatsCard {
  id: string;
  title: string;
  value: string;
  change: string;
  trend: "up" | "down" | "stable";
  color: string;
  icon: any;
}

interface ViewMode {
  id: "interactive" | "analytics" | "overview";
  label: string;
  icon: any;
}

// Animated Stats Card Component
const AnimatedStatsCard: React.FC<{
  stat: StatsCard;
  index: number;
  delay: number;
}> = ({ stat, delay }) => {
  const IconComponent = stat.icon;
  const numericValue = parseInt(stat.value.replace(/[^\d]/g, ""));
  const animatedValue = useCountAnimation(numericValue, 2500, delay + 500);

  // Format the animated value back to display format
  const formatValue = (value: number) => {
    if (stat.value.includes("M")) return `${(value / 1000000).toFixed(1)}M`;
    if (stat.value.includes("K")) return `${(value / 1000).toFixed(1)}K`;
    if (stat.value.includes("₹")) return `₹${(value / 1000000).toFixed(1)}M`;
    return value.toLocaleString();
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.3, rotateY: 180 }}
      animate={{
        opacity: 1,
        scale: 1,
        rotateY: 0,
        transition: {
          type: "spring",
          stiffness: 300,
          damping: 30,
          delay: delay,
        },
      }}
      whileHover={{
        scale: 1.08,
        y: -8,
        rotateX: 5,
        boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.25)",
        transition: { duration: 0.3 },
      }}
      whileTap={{ scale: 0.95 }}
      className={`relative bg-gradient-to-br from-white via-white to-${stat.color}-50 rounded-2xl shadow-lg p-6 border border-white/50 backdrop-blur-sm hover:shadow-2xl transition-all duration-500 overflow-hidden group cursor-pointer`}
    >
      {/* Background Pattern */}
      <motion.div
        className={`absolute inset-0 bg-gradient-to-br from-${stat.color}-400/10 via-transparent to-${stat.color}-600/20`}
        initial={{ scale: 0, rotate: 45 }}
        animate={{
          scale: 1,
          rotate: 0,
          transition: { delay: delay + 0.3, duration: 0.8 },
        }}
      />

      {/* Sparkle Effect */}
      <motion.div
        className="absolute top-2 right-2 opacity-0 group-hover:opacity-100"
        animate={{
          rotate: [0, 180, 360],
          scale: [1, 1.2, 1],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      >
        <Sparkles className={`w-4 h-4 text-${stat.color}-400`} />
      </motion.div>

      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{
              scale: 1,
              rotate: 0,
              transition: {
                type: "spring",
                stiffness: 400,
                delay: delay + 0.2,
              },
            }}
            whileHover={{
              rotate: 360,
              transition: { duration: 0.6 },
            }}
            className={`p-3 bg-gradient-to-br from-${stat.color}-500 to-${stat.color}-600 rounded-xl shadow-lg`}
          >
            <IconComponent className="w-6 h-6 text-white" />
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{
              opacity: 1,
              x: 0,
              transition: { delay: delay + 0.4 },
            }}
            className={`flex items-center gap-1 text-sm px-2 py-1 rounded-full ${
              stat.trend === "up"
                ? "text-emerald-600 bg-emerald-100"
                : stat.trend === "down"
                ? "text-red-600 bg-red-100"
                : "text-gray-600 bg-gray-100"
            }`}
          >
            <motion.div
              animate={{
                y:
                  stat.trend === "up"
                    ? [-2, 0]
                    : stat.trend === "down"
                    ? [0, -2]
                    : 0,
              }}
              transition={{
                duration: 1,
                repeat: Infinity,
                repeatType: "reverse",
              }}
            >
              {stat.trend === "up" ? (
                <ArrowUp className="w-3 h-3" />
              ) : stat.trend === "down" ? (
                <ArrowDown className="w-3 h-3" />
              ) : null}
            </motion.div>
            <span className="font-semibold">{stat.change}</span>
          </motion.div>
        </div>

        <div className="space-y-2">
          <motion.h3
            className={`text-3xl font-bold bg-gradient-to-r from-${stat.color}-600 to-${stat.color}-800 bg-clip-text text-transparent`}
            key={animatedValue}
            initial={{ scale: 1.2, opacity: 0 }}
            animate={{
              scale: 1,
              opacity: 1,
              transition: { duration: 0.3 },
            }}
          >
            {formatValue(animatedValue) || stat.value}
          </motion.h3>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{
              opacity: 1,
              y: 0,
              transition: { delay: delay + 0.6 },
            }}
            className="text-sm text-gray-600 font-medium"
          >
            {stat.title}
          </motion.p>
        </div>
      </div>

      {/* Animated Border */}
      <motion.div
        className={`absolute inset-0 rounded-2xl border-2 border-${stat.color}-400/30`}
        initial={{ pathLength: 0 }}
        animate={{
          pathLength: 1,
          transition: {
            duration: 2,
            delay: delay,
            ease: "easeInOut",
          },
        }}
      />
    </motion.div>
  );
};

const MapDashboardPage: React.FC = () => {
  const [activeView, setActiveView] = useState<
    "interactive" | "analytics" | "overview"
  >("interactive");
  const [isLoading, setIsLoading] = useState(true);
  const [realStats, setRealStats] = useState({
    totalScreens: 0,
    activeCampaigns: 0,
    totalImpressions: 0,
    totalRevenue: 0,
    citiesCount: 0,
    activeUsers: 0
  });

  // Load real data from APIs
  useEffect(() => {
    const loadRealData = async () => {
      try {
        const [screensResponse, campaignsResponse] = await Promise.all([
          getAllScreens(),
          fetchCampaigns()
        ]);
        
        const screens = screensResponse || [];
        const campaigns = campaignsResponse || [];

        // Calculate real statistics
        const activeCampaigns = campaigns.filter((c: any) => c.status.toLowerCase() === "active").length;
        const totalImpressions = campaigns.reduce((sum: number, campaign: any) => sum + (parseInt(campaign.impressions) || 0), 0);
        const totalRevenue = campaigns.reduce((sum: number, campaign: any) => sum + (parseFloat(campaign.spent) || 0), 0);
        const citiesSet = new Set(screens.map((screen: any) => screen.city));
        
        setRealStats({
          totalScreens: screens.length,
          activeCampaigns: activeCampaigns,
          totalImpressions: totalImpressions,
          totalRevenue: totalRevenue,
          citiesCount: citiesSet.size,
          activeUsers: campaigns.length * 3 // Estimate 3 users per campaign
        });
        
      } catch (error) {
        console.error("Failed to load real data:", error);
        // Keep default values if API fails
      } finally {
        setIsLoading(false);
      }
    };

    loadRealData();
  }, []);

  const viewModes: ViewMode[] = [
    { id: "interactive", label: "Interactive Map", icon: Map },
    { id: "analytics", label: "Analytics View", icon: BarChart3 },
    { id: "overview", label: "Overview", icon: Globe },
  ];

  // Updated stats cards with real data
  const statsCards: StatsCard[] = [
    {
      id: "total-screens",
      title: "Total Screens",
      value: realStats.totalScreens.toLocaleString(),
      change: "+12.3%",
      trend: "up",
      color: "blue",
      icon: Activity,
    },
    {
      id: "active-campaigns",
      title: "Active Campaigns",
      value: realStats.activeCampaigns.toString(),
      change: "+8.7%",
      trend: "up",
      color: "green",
      icon: Target,
    },
    {
      id: "total-impressions",
      title: "Total Impressions",
      value: realStats.totalImpressions > 1000000 
        ? `${(realStats.totalImpressions / 1000000).toFixed(1)}M`
        : realStats.totalImpressions > 1000
        ? `${(realStats.totalImpressions / 1000).toFixed(1)}K`
        : realStats.totalImpressions.toString(),
      change: "+15.2%",
      trend: "up",
      color: "purple",
      icon: Eye,
    },
    {
      id: "cities-covered",
      title: "Cities Covered",
      value: realStats.citiesCount.toString(),
      change: "+2",
      trend: "up",
      color: "orange",
      icon: MapPin,
    },
    {
      id: "revenue",
      title: "Revenue",
      value: realStats.totalRevenue > 100000 
        ? `₹${(realStats.totalRevenue / 100000).toFixed(1)}L`
        : `₹${realStats.totalRevenue.toLocaleString()}`,
      change: "+18.9%",
      trend: "up",
      color: "indigo",
      icon: TrendingUp,
    },
    {
      id: "active-users",
      title: "Active Users",
      value: realStats.activeUsers.toLocaleString(),
      change: "-2.1%",
      trend: "down",
      color: "red",
      icon: Users,
    },
  ];

  const renderViewContent = () => {
    switch (activeView) {
      case "interactive":
        return (
          <motion.div
            key="interactive"
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -30, scale: 0.95 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.6,
            }}
            className="w-full"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
              <DashboardMap
                showNavigation={true}
                height="700px"
                className="w-full"
              />
            </div>
          </motion.div>
        );

      case "analytics":
        return (
          <motion.div
            key="analytics"
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -100 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full"
          >
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl border border-white/50 overflow-hidden">
              <IndiaMapDashboard />
            </div>
          </motion.div>
        );

      case "overview":
        return (
          <motion.div
            key="overview"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="w-full space-y-6"
          >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/50"
                whileHover={{ scale: 1.02, rotateY: 5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Geographic Distribution
                </h3>
                <div className="h-64 bg-gradient-to-br from-blue-100 to-purple-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-600">
                    Geographic Chart Placeholder
                  </span>
                </div>
              </motion.div>

              <motion.div
                className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/50"
                whileHover={{ scale: 1.02, rotateY: -5 }}
                transition={{ duration: 0.3 }}
              >
                <h3 className="text-lg font-bold text-gray-900 mb-4">
                  Performance Trends
                </h3>
                <div className="h-64 bg-gradient-to-br from-green-100 to-blue-100 rounded-xl flex items-center justify-center">
                  <span className="text-gray-600">
                    Trends Chart Placeholder
                  </span>
                </div>
              </motion.div>
            </div>

            <motion.div
              className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-2xl p-6 border border-white/50"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
            >
              <h3 className="text-lg font-bold text-gray-900 mb-4">
                Top Performing Cities
              </h3>
              <div className="space-y-3">
                {[
                  {
                    city: "Mumbai",
                    screens: 347,
                    impressions: "2.4M",
                    revenue: "₹8.9M",
                  },
                  {
                    city: "Delhi",
                    screens: 298,
                    impressions: "2.1M",
                    revenue: "₹7.2M",
                  },
                  {
                    city: "Bengaluru",
                    screens: 256,
                    impressions: "1.8M",
                    revenue: "₹6.1M",
                  },
                  {
                    city: "Chennai",
                    screens: 198,
                    impressions: "1.4M",
                    revenue: "₹4.8M",
                  },
                  {
                    city: "Hyderabad",
                    screens: 167,
                    impressions: "1.2M",
                    revenue: "₹4.1M",
                  },
                ].map((city, index) => (
                  <motion.div
                    key={city.city}
                    className="flex justify-between items-center p-3 hover:bg-purple-50/50 rounded-xl transition-colors cursor-pointer"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ scale: 1.02, x: 10 }}
                  >
                    <div className="flex items-center gap-3">
                      <motion.span
                        className="text-sm font-bold text-purple-400 w-6 h-6 bg-purple-100 rounded-full flex items-center justify-center"
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.5 }}
                      >
                        #{index + 1}
                      </motion.span>
                      <span className="font-medium text-gray-900">
                        {city.city}
                      </span>
                    </div>
                    <div className="flex gap-6 text-sm">
                      <div className="text-center">
                        <div className="text-gray-500">Screens</div>
                        <div className="font-semibold">{city.screens}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Impressions</div>
                        <div className="font-semibold">{city.impressions}</div>
                      </div>
                      <div className="text-center">
                        <div className="text-gray-500">Revenue</div>
                        <div className="font-semibold">{city.revenue}</div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  // Enhanced loading screen with Doohgle logo zoom effect
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-white via-purple-50 to-purple-100 flex items-center justify-center overflow-hidden">
        {/* Animated background pattern */}
        <motion.div
          className="absolute inset-0 opacity-20"
          initial={{ rotate: 0 }}
          animate={{ rotate: 360 }}
          transition={{ duration: 50, repeat: Infinity, ease: "linear" }}
        >
          <div className="w-full h-full bg-gradient-to-r from-transparent via-purple-200 to-transparent transform rotate-45"></div>
        </motion.div>

        <div className="relative z-10 text-center">
          {/* Doohgle Logo with zoom effect */}
          <motion.div
            initial={{ scale: 0, rotateY: 180 }}
            animate={{
              scale: [0, 1.5, 1],
              rotateY: [180, 0, 0],
            }}
            transition={{
              duration: 2,
              times: [0, 0.6, 1],
              ease: "easeOut",
            }}
            className="mb-8"
          >
            <motion.div
              animate={{
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.3)",
                  "0 0 60px rgba(147, 51, 234, 0.6)",
                  "0 0 20px rgba(147, 51, 234, 0.3)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="w-24 h-24 bg-gradient-to-br from-purple-600 via-purple-500 to-indigo-600 rounded-2xl flex items-center justify-center mx-auto"
            >
              <span className="text-3xl font-bold text-white">D</span>
            </motion.div>
          </motion.div>

          {/* Company name with letter animation */}
          <motion.div className="mb-6">
            <motion.h1 className="text-4xl font-bold text-transparent bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text">
              {"DOOHGLE".split("").map((letter, index) => (
                <motion.span
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{
                    delay: 1.5 + index * 0.1,
                    type: "spring",
                    stiffness: 300,
                  }}
                >
                  {letter}
                </motion.span>
              ))}
            </motion.h1>
            <motion.p
              className="text-lg text-purple-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2.2 }}
            >
              Tech Solutions
            </motion.p>
          </motion.div>

          {/* Loading animation */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 2.5 }}
            className="space-y-4"
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto"
            />
            <p className="text-purple-600 font-medium">
              Loading Map Dashboard...
            </p>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      className="min-h-screen bg-gradient-to-br from-white via-purple-50/30 to-purple-100/50 relative overflow-x-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1 }}
    >
      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          className="absolute top-10 left-10 w-64 h-64 bg-purple-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{ duration: 10, repeat: Infinity }}
        />
        <motion.div
          className="absolute bottom-10 right-10 w-80 h-80 bg-indigo-200/20 rounded-full blur-3xl"
          animate={{
            x: [0, -120, 0],
            y: [0, 80, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{ duration: 12, repeat: Infinity }}
        />
      </div>

      {/* Header with enhanced styling */}
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-white/80 backdrop-blur-md shadow-lg border-b border-white/50 sticky top-0 z-50"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ scale: 1.1, rotate: 10 }}
                className="w-12 h-12 bg-gradient-to-br from-purple-600 to-indigo-600 rounded-xl flex items-center justify-center"
              >
                <span className="text-xl font-bold text-white">D</span>
              </motion.div>
              <div>
                <motion.h1
                  className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-indigo-600 bg-clip-text text-transparent"
                  whileHover={{ scale: 1.05 }}
                >
                  Indian Maps Dashboard
                </motion.h1>
                <p className="text-gray-600">
                  Real-time digital billboard network across India
                </p>
              </div>
            </div>

            <motion.div
              className="flex items-center gap-2 px-4 py-2 bg-white/70 rounded-xl shadow-md"
              whileHover={{ scale: 1.05 }}
            >
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-sm text-gray-600">Live • 2 min ago</span>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Main content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 relative z-10">
        {/* Animated Stats Cards */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 mb-12"
        >
          {statsCards.map((stat, index) => (
            <AnimatedStatsCard
              key={stat.id}
              stat={stat}
              index={index}
              delay={0.6 + index * 0.15}
            />
          ))}
        </motion.div>

        {/* View Mode Selector with enhanced styling */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.2 }}
          className="bg-white/80 backdrop-blur-md rounded-2xl shadow-xl p-3 mb-8 border border-white/50"
        >
          <div className="flex items-center gap-2">
            {viewModes.map((mode) => {
              const IconComponent = mode.icon;
              return (
                <motion.button
                  key={mode.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setActiveView(mode.id)}
                  className={`flex items-center gap-3 px-6 py-3 rounded-xl transition-all duration-300 ${
                    activeView === mode.id
                      ? "bg-gradient-to-r from-purple-600 to-indigo-600 text-white shadow-lg"
                      : "text-gray-600 hover:bg-purple-50"
                  }`}
                >
                  <motion.div
                    animate={{ rotate: activeView === mode.id ? 360 : 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <IconComponent className="w-5 h-5" />
                  </motion.div>
                  <span className="font-medium">{mode.label}</span>
                  {activeView === mode.id && (
                    <motion.div
                      layoutId="activeViewIndicator"
                      className="w-2 h-2 bg-white rounded-full"
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </motion.div>

        {/* Main Content Area with enhanced animations */}
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4 }}
        >
          <AnimatePresence mode="wait">{renderViewContent()}</AnimatePresence>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default MapDashboardPage;
