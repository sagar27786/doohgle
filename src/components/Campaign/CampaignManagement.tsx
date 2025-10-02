import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Eye,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
} from "lucide-react";
import ImprovedCampaignCreation from "./ImprovedCampaignCreation";
import AnimatedScreenCard from "../AnimatedScreenCard";
import ScreenDetailModal from "../ScreenDetailModalDazzling";
import { getAllScreens } from "../../api/screens";
import { useFavorites } from "../../contexts/FavoritesContext";

// Import campaign service for real data
const API_BASE_URL =
  import.meta.env.VITE_API_URL || "http://localhost:4000/api";

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

// Screen interface
interface Screen {
  id: number;
  name: string;
  city: string;
  screen_type?: string;
  is_active?: boolean;
  image_url?: string;
  day_photo_url?: string;
  night_photo_url?: string;
  video_url?: string;
  hourly_rate?: number | string;
  daily_rate?: number | string;
  weekly_rate?: number | string;
  location_name?: string;
  is_favorite?: boolean; // Add favorite status
  favorited_at?: string; // When it was favorited
  screen_size_width?: number;
  screen_size_height?: number;
  resolution_width?: number;
  resolution_height?: number;
  daily_footfall?: number;
  peak_hours?: string[];
  latitude?: number;
  longitude?: number;
  pricing?: {
    hourly?: string;
    daily?: string;
    weekly?: string;
    currency?: string;
    cost_per_10_seconds?: string;
  };
}

interface Campaign {
  id: string | number;
  name: string;
  brand?: string;
  status:
    | "Active"
    | "Paused"
    | "Completed"
    | "Draft"
    | "active"
    | "paused"
    | "completed"
    | "draft";
  budget: number;
  spent: number;
  impressions: number;
  clicks?: number;
  ctr?: number;
  startDate: string;
  endDate: string;
  start_date?: string;
  end_date?: string;
  total_budget?: number;
  spent_amount?: number;
  description?: string;
  screens: Screen[];
  schedule?: {
    timeSlots: string[];
    days: string[];
  };
}

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
  const [campaignData, setCampaignData] = useState<Campaign[]>([]);
  const [screensData, setScreensData] = useState<Screen[]>([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTab, setSelectedTab] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [showCreateWorkflow, setShowCreateWorkflow] = useState(false);
  const [showScreenDetail, setShowScreenDetail] = useState(false);

  // Use favorites context
  const { isFavorite, toggleFavorite } = useFavorites();

  // Load real screens and campaigns from APIs - NO FALLBACK DATA
  useEffect(() => {
    const loadData = async () => {
      try {
        // Load real screens and campaigns from APIs - NO FALLBACK DATA
        const [screensResponse, campaignsResponse] = await Promise.all([
          getAllScreens(),
          fetchCampaigns(),
        ]);

        const screens = screensResponse || [];
        const campaigns = campaignsResponse || [];

        console.log("Loaded screens from API:", screens);

        // Convert screens data to match our Screen interface
        const formattedScreens: Screen[] = screens.map((screen: any) => ({
          id: screen.id,
          name: screen.screen_name || screen.name,
          city: screen.city,
          screen_type: screen.screen_type,
          is_active: screen.is_active,
          // Priority: image_url -> day_photo_url -> video_url -> fallback to dummy
          image_url:
            screen.image_url ||
            screen.day_photo_url ||
            screen.video_url ||
            `/assets/screen${(screen.id % 3) + 1}.png`,
          day_photo_url: screen.day_photo_url,
          night_photo_url: screen.night_photo_url,
          video_url: screen.video_url,
          hourly_rate: screen.hourly_rate
            ? typeof screen.hourly_rate === "string"
              ? parseFloat(screen.hourly_rate)
              : screen.hourly_rate
            : undefined,
          daily_rate: screen.daily_rate
            ? typeof screen.daily_rate === "string"
              ? parseFloat(screen.daily_rate)
              : screen.daily_rate
            : undefined,
          weekly_rate: screen.weekly_rate
            ? typeof screen.weekly_rate === "string"
              ? parseFloat(screen.weekly_rate)
              : screen.weekly_rate
            : undefined,
          pricing: screen.pricing
            ? {
                hourly: screen.pricing.hourly
                  ? typeof screen.pricing.hourly === "string"
                    ? parseFloat(screen.pricing.hourly)
                    : screen.pricing.hourly
                  : undefined,
                daily: screen.pricing.daily
                  ? typeof screen.pricing.daily === "string"
                    ? parseFloat(screen.pricing.daily)
                    : screen.pricing.daily
                  : undefined,
                weekly: screen.pricing.weekly
                  ? typeof screen.pricing.weekly === "string"
                    ? parseFloat(screen.pricing.weekly)
                    : screen.pricing.weekly
                  : undefined,
                currency: screen.pricing.currency,
                cost_per_10_seconds: screen.pricing.cost_per_10_seconds,
              }
            : undefined,
          location_name: screen.location_in_venue || screen.location_name,
          is_favorite: screen.is_favorite || false,
          favorited_at: screen.favorited_at,
          daily_footfall: screen.daily_footfall,
          peak_hours: screen.peak_hours,
          screen_size_width: screen.screen_size_width,
          screen_size_height: screen.screen_size_height,
          resolution_width: screen.resolution_width,
          resolution_height: screen.resolution_height,
          latitude: screen.latitude ? parseFloat(screen.latitude) : undefined,
          longitude: screen.longitude
            ? parseFloat(screen.longitude)
            : undefined,
        }));

        console.log("Formatted screens with favorites:", formattedScreens);

        // DEBUG: Log pricing and coordinates for first screen
        if (formattedScreens.length > 0) {
          console.log("🔍 FIRST SCREEN DATA:", {
            name: formattedScreens[0].name,
            hourly_rate: formattedScreens[0].hourly_rate,
            daily_rate: formattedScreens[0].daily_rate,
            weekly_rate: formattedScreens[0].weekly_rate,
            pricing: formattedScreens[0].pricing,
            latitude: formattedScreens[0].latitude,
            longitude: formattedScreens[0].longitude,
          });
        }

        // Log favorite screens (using context)
        formattedScreens.forEach((screen) => {
          if (isFavorite(screen.id)) {
            console.log(`Screen ${screen.id} (${screen.name}) is favorited`);
          }
        });
        console.log("Favorite screens loaded from context");

        // Convert campaigns data and assign screens to each campaign
        const formattedCampaigns: Campaign[] = campaigns.map(
          (campaign: any, campaignIndex: number) => {
            // Assign different screens to each campaign for variety
            const startIndex = campaignIndex % formattedScreens.length;
            const endIndex = Math.min(startIndex + 3, formattedScreens.length);
            let campaignScreens = formattedScreens.slice(startIndex, endIndex);

            // If we need more screens, wrap around
            if (campaignScreens.length < 3 && formattedScreens.length > 0) {
              const remaining = 3 - campaignScreens.length;
              campaignScreens = [
                ...campaignScreens,
                ...formattedScreens.slice(0, remaining),
              ];
            }

            return {
              id: campaign.id,
              name: campaign.name,
              brand: campaign.brand || "Brand Name",
              status: campaign.status,
              budget: parseFloat(campaign.budget || 0),
              spent: parseFloat(campaign.spent || 0), // Real spent amount from database
              impressions: parseInt(campaign.impressions || 0),
              clicks: parseInt(campaign.clicks || 0),
              ctr: parseFloat(campaign.ctr || 0),
              startDate: campaign.start_date || campaign.startDate,
              endDate: campaign.end_date || campaign.endDate,
              screens: campaignScreens,
              schedule: {
                timeSlots: ["09:00-12:00", "18:00-22:00"],
                days: ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
              },
            };
          }
        );

        setCampaignData(formattedCampaigns);
        setScreensData(formattedScreens);
      } catch (error) {
        console.error("Failed to load data:", error);
        // NO FALLBACK DATA - just set empty arrays if API fails
        setCampaignData([]);
        setScreensData([]);
      } finally {
        // Loading removed
      }
    };

    loadData();
  }, []);

  // Handle favorite toggle
  const handleFavoriteToggle = async (
    screenId: number,
    event?: React.MouseEvent
  ) => {
    if (event) {
      event.stopPropagation(); // Prevent triggering screen selection
    }

    try {
      // Use the favorites context to toggle favorite
      const newFavoriteStatus = await toggleFavorite(screenId);

      // Update local screens data to reflect the change immediately
      const updatedScreens = screensData.map((screen) =>
        screen.id === screenId
          ? { ...screen, is_favorite: newFavoriteStatus }
          : screen
      );
      setScreensData(updatedScreens);

      console.log(
        `Screen ${screenId} favorite status updated to:`,
        newFavoriteStatus
      );
    } catch (error) {
      console.error("Error toggling favorite:", error);
      // You could add a toast notification here
    }
  };

  // Filter and sort screens
  const filteredScreens = screensData
    .filter((screen) => {
      const matchesSearch =
        screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (screen.location_name || "")
          .toLowerCase()
          .includes(searchTerm.toLowerCase());

      let matchesTab = true;
      if (selectedTab === "All") {
        matchesTab = true;
      } else if (selectedTab === "Favorites") {
        matchesTab = isFavorite(screen.id);
      } else if (selectedTab === "Active") {
        matchesTab = true; // All screens are considered active for now
      } else {
        // City filter
        matchesTab = screen.city.toLowerCase() === selectedTab.toLowerCase();
      }

      return matchesSearch && matchesTab;
    })
    .sort((a, b) => {
      // Sort favorites first if not filtering by favorites specifically
      if (selectedTab !== "Favorites") {
        const aIsFavorite = isFavorite(a.id);
        const bIsFavorite = isFavorite(b.id);
        if (aIsFavorite && !bIsFavorite) return -1;
        if (!aIsFavorite && bIsFavorite) return 1;
      }

      const aVal = a[sortBy as keyof Screen];
      const bVal = b[sortBy as keyof Screen];

      if (aVal === undefined || bVal === undefined) return 0;

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
    (c) => c.status.toLowerCase() === "active"
  ).length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 lg:px-6 py-4 lg:py-8">
        {/* Professional Header Section with gradient text */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-6 lg:mb-8"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Screen Management
              </h1>
              <p className="text-gray-600 text-base lg:text-lg">
                Manage and monitor all your digital screens and their campaigns
              </p>
            </div>
            <div className="flex items-center space-x-4 mt-4 lg:mt-0">
              <motion.button
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 lg:px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowCreateWorkflow(true)}
              >
                <Plus size={20} />
                <span>Create Campaign</span>
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
          className="bg-white rounded-xl p-4 lg:p-6 shadow-lg border border-gray-100 mb-6"
        >
          {/* Tab Navigation and Search/Filter Controls - Single Row */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-4 mb-6">
            {/* Left Side: Category Tabs (1/3) */}
            <div className="flex items-center space-x-2">
              {["All", "Favorites", "Active"].map((tab, index) => (
                <motion.button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-5 py-2.5 rounded-xl text-sm font-semibold transition-all whitespace-nowrap ${
                    selectedTab === tab
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                      : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-md"
                  }`}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{
                    delay: 0.6 + index * 0.1,
                    type: "spring",
                    stiffness: 200,
                  }}
                >
                  {tab}
                  <span
                    className={`ml-2 text-xs px-2 py-0.5 rounded-full font-bold ${
                      selectedTab === tab
                        ? "bg-white bg-opacity-30 text-white"
                        : "bg-white text-gray-700"
                    }`}
                  >
                    {tab === "All"
                      ? screensData.length
                      : tab === "Favorites"
                      ? screensData.filter((s) => s.is_favorite).length
                      : screensData.filter((s) => s.is_active).length}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* Right Side: Search and Filter Controls (2/3) */}
            <div className="flex flex-1 items-center space-x-3">
              <motion.div
                className="relative flex-1"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.8, type: "spring", stiffness: 200 }}
              >
                <motion.div
                  animate={{ x: [0, 2, 0] }}
                  transition={{
                    duration: 2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Search
                    className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                    size={20}
                  />
                </motion.div>
                <motion.input
                  type="text"
                  placeholder="Search screens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-11 pr-4 py-2.5 border-2 border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all text-base shadow-sm hover:shadow-md"
                  whileFocus={{ scale: 1.01 }}
                  transition={{ type: "spring", stiffness: 300 }}
                />
              </motion.div>

              <motion.button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center justify-center space-x-2 bg-white border-2 border-gray-200 text-gray-700 px-6 py-2.5 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md font-medium"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.9, type: "spring", stiffness: 200 }}
              >
                <Filter size={18} />
                <span>Filters</span>
                <motion.div
                  animate={{ rotate: showFilters ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <ChevronDown size={16} />
                </motion.div>
              </motion.button>

              <motion.button
                className="p-2.5 bg-white border-2 border-gray-200 text-gray-700 rounded-xl hover:bg-gray-50 hover:border-gray-300 transition-all shadow-sm hover:shadow-md"
                whileHover={{ scale: 1.05, rotate: 90, y: -2 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ delay: 1.0, type: "spring", stiffness: 200 }}
                onClick={() => window.location.reload()}
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                    style={{
                      backgroundColor: "white",
                      color: "#111827",
                    }}
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
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 bg-white text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-transparent appearance-none cursor-pointer hover:border-gray-400 transition-colors"
                    style={{
                      backgroundColor: "white",
                      color: "#111827",
                    }}
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
          {filteredScreens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + 0.1 * index }}
            >
              <AnimatedScreenCard
                screen={{
                  id: screen.id,
                  name: screen.name,
                  location: screen.location_name || "Not specified",
                  city: screen.city,
                  price_per_day: screen.daily_rate
                    ? Number(screen.daily_rate)
                    : screen.hourly_rate
                    ? Number(screen.hourly_rate) * 24
                    : undefined,
                  daily_rate: screen.daily_rate
                    ? Number(screen.daily_rate)
                    : undefined,
                  hourly_rate: screen.hourly_rate
                    ? Number(screen.hourly_rate)
                    : undefined,
                  weekly_rate: screen.weekly_rate
                    ? Number(screen.weekly_rate)
                    : undefined,
                  pricing: screen.pricing,
                  type: screen.screen_type,
                  status: undefined, // Remove status display
                  media_urls: [
                    screen.image_url,
                    screen.day_photo_url,
                    screen.night_photo_url,
                  ].filter(Boolean) as string[],
                  image_url: screen.image_url,
                  video_url: screen.video_url,
                  day_photo_url: screen.day_photo_url,
                  night_photo_url: screen.night_photo_url,
                  latitude: screen.latitude,
                  longitude: screen.longitude,
                  features: [],
                  rating: undefined,
                  views_per_day: screen.daily_footfall,
                  isFavorite: isFavorite(screen.id),
                  // Technical details for the modal
                  screen_size_width: screen.screen_size_width,
                  screen_size_height: screen.screen_size_height,
                  resolution_width: screen.resolution_width,
                  resolution_height: screen.resolution_height,
                  orientation: undefined,
                  device_type: undefined,
                  device_model: undefined,
                  viewing_distance: undefined,
                  typical_viewer_duration: undefined,
                  peak_hours: screen.peak_hours,
                  daily_footfall: screen.daily_footfall,
                }}
                onFavorite={(screenId) =>
                  handleFavoriteToggle(
                    Number(screenId),
                    new Event("click") as any
                  )
                }
                onView={(screenData) => {
                  const foundScreen = filteredScreens.find(
                    (s) => s.id.toString() === screenData.id.toString()
                  );
                  if (foundScreen) {
                    setSelectedScreen(foundScreen);
                    setShowScreenDetail(true);
                  }
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Enhanced Screen Detail Modal */}
        <AnimatePresence>
          {selectedScreen && showScreenDetail && (
            <ScreenDetailModal
              screen={{
                id: selectedScreen.id,
                name: selectedScreen.name,
                location: selectedScreen.location_name || "Not specified",
                city: selectedScreen.city,
                // ALL PRICING DATA - CRITICAL
                hourly_rate: selectedScreen.hourly_rate
                  ? Number(selectedScreen.hourly_rate)
                  : undefined,
                daily_rate: selectedScreen.daily_rate
                  ? Number(selectedScreen.daily_rate)
                  : undefined,
                weekly_rate: selectedScreen.weekly_rate
                  ? Number(selectedScreen.weekly_rate)
                  : undefined,
                pricing: selectedScreen.pricing,
                price_per_day: selectedScreen.daily_rate
                  ? Number(selectedScreen.daily_rate)
                  : selectedScreen.hourly_rate
                  ? Number(selectedScreen.hourly_rate) * 24
                  : undefined,
                // ALL MEDIA FILES
                image_url: selectedScreen.image_url,
                day_photo_url: selectedScreen.day_photo_url,
                night_photo_url: selectedScreen.night_photo_url,
                video_url: selectedScreen.video_url,
                media_urls: [
                  selectedScreen.image_url,
                  selectedScreen.day_photo_url,
                  selectedScreen.night_photo_url,
                ].filter(Boolean) as string[],
                // MAP COORDINATES - CRITICAL
                latitude: selectedScreen.latitude,
                longitude: selectedScreen.longitude,
                // OTHER DATA
                features: [],
                rating: undefined,
                views_per_day: selectedScreen.daily_footfall,
                isFavorite: isFavorite(selectedScreen.id),
                screen_size_width: selectedScreen.screen_size_width,
                screen_size_height: selectedScreen.screen_size_height,
                resolution_width: selectedScreen.resolution_width,
                resolution_height: selectedScreen.resolution_height,
                orientation: "landscape",
                device_type: "smart_tv",
                device_model: "N/A",
                viewing_distance: "close",
                typical_viewer_duration: "N/A",
                peak_hours: selectedScreen.peak_hours || ["09:00-17:00"],
                daily_footfall: selectedScreen.daily_footfall,
              }}
              isOpen={showScreenDetail}
              onClose={() => {
                setShowScreenDetail(false);
                setSelectedScreen(null);
              }}
            />
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
                className="bg-white rounded-2xl w-full max-w-6xl max-h-[90vh] overflow-y-auto shadow-2xl"
              >
                <ImprovedCampaignCreation />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default CampaignManagement;
