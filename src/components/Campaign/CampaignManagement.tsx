import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Plus,
  Search,
  Filter,
  ChevronDown,
  RefreshCw,
  Eye,
  Edit3,
  MoreHorizontal,
  DollarSign,
  TrendingUp,
  Activity,
  ArrowUp,
  ArrowDown,
  BarChart3,
  Monitor,
  MapPin,
  XCircle,
  Heart,
} from "lucide-react";
import ImprovedCampaignCreation from "./ImprovedCampaignCreation";
import AnimatedScreenCard from "../AnimatedScreenCard";
import { getAllScreens, toggleFavoriteScreen, getUserFavoriteScreens } from "../../api/screens";

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
  image_url?: string;
  day_photo_url?: string;
  night_photo_url?: string;
  video_url?: string;
  hourly_rate?: number;
  location_name?: string;
  is_favorite?: boolean; // Add favorite status
  favorited_at?: string; // When it was favorited
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
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteScreens, setFavoriteScreens] = useState<Set<number>>(new Set());

  // Tabs for screen filtering by city and status
  const tabs = [
    "All",
    "Favorites",
    "Active",
    "Mumbai",
    "Delhi",
    "Bangalore",
    "Chennai",
    "Hyderabad",
  ];

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

        console.log('Loaded screens from API:', screens);

        // Convert screens data to match our Screen interface
        const formattedScreens: Screen[] = screens.map((screen: any) => ({
          id: screen.id,
          name: screen.screen_name || screen.name,
          city: screen.city,
          // Priority: image_url -> day_photo_url -> video_url -> fallback to dummy
          image_url:
            screen.image_url ||
            screen.day_photo_url ||
            screen.video_url ||
            `/assets/screen${(screen.id % 3) + 1}.png`,
          day_photo_url: screen.day_photo_url,
          night_photo_url: screen.night_photo_url,
          video_url: screen.video_url,
          hourly_rate: parseFloat(screen.hourly_rate || "500"),
          location_name: screen.location_in_venue || screen.location_name,
          is_favorite: screen.is_favorite || false,
          favorited_at: screen.favorited_at,
        }));

        console.log('Formatted screens with favorites:', formattedScreens);

        // Track favorite screens
        const favorites = new Set<number>();
        formattedScreens.forEach(screen => {
          if (screen.is_favorite) {
            favorites.add(screen.id);
            console.log(`Screen ${screen.id} (${screen.name}) is favorited`);
          }
        });
        setFavoriteScreens(favorites);
        console.log('Favorite screens set:', favorites);

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
  const handleFavoriteToggle = async (screenId: number, event?: React.MouseEvent) => {
    if (event) {
      event.stopPropagation(); // Prevent triggering screen selection
    }
    
    try {
      const result = await toggleFavoriteScreen(screenId);
      
      // Update local state immediately for better UX
      const updatedScreens = screensData.map(screen => 
        screen.id === screenId 
          ? { ...screen, is_favorite: result.is_favorite }
          : screen
      );
      setScreensData(updatedScreens);
      
      // Update favorites set
      const newFavorites = new Set(favoriteScreens);
      if (result.is_favorite) {
        newFavorites.add(screenId);
      } else {
        newFavorites.delete(screenId);
      }
      setFavoriteScreens(newFavorites);

      console.log(`Screen ${screenId} favorite status updated to:`, result.is_favorite);
    } catch (error) {
      console.error('Error toggling favorite:', error);
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
        matchesTab = screen.is_favorite === true;
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
        if (a.is_favorite && !b.is_favorite) return -1;
        if (!a.is_favorite && b.is_favorite) return 1;
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
          {/* Tab Navigation */}
          <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center justify-between mb-6">
            <div className="flex space-x-1 overflow-x-auto pb-2 lg:pb-0">
              {tabs.map((tab, index) => (
                <motion.button
                  key={tab}
                  onClick={() => setSelectedTab(tab)}
                  className={`px-3 lg:px-4 py-2 rounded-lg text-sm font-medium transition-all whitespace-nowrap ${
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
                      ? screensData.length
                      : tab === "Favorites"
                      ? screensData.filter((s) => s.is_favorite).length
                      : tab === "Active"
                      ? screensData.length // All screens are active for now
                      : screensData.filter((s) => s.city === tab).length}
                  </span>
                </motion.button>
              ))}
            </div>

            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-3">
              <div className="relative flex-1 sm:flex-none">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search campaigns..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>

              <div className="flex space-x-3">
                <motion.button
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors flex-1 sm:flex-none"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Filter size={18} />
                  <span className="hidden sm:inline">Filters</span>
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
                  location: screen.location_name || 'Not specified',
                  city: screen.city,
                  price_per_day: screen.hourly_rate ? screen.hourly_rate * 24 : 2500,
                  type: screen.screen_type || 'LED Display',
                  status: 'available',
                  media_urls: [screen.image_url, screen.day_photo_url, screen.night_photo_url].filter(Boolean),
                  video_url: screen.video_url,
                  features: ['HD Quality', 'Digital Display', '24/7 Support'],
                  rating: 4.5,
                  views_per_day: Math.floor(Math.random() * 10000) + 5000,
                  isFavorite: screen.is_favorite
                }}
                onFavorite={(screenId) => handleFavoriteToggle(Number(screenId), new Event('click') as any)}
                onView={(screenData) => {
                  const foundScreen = filteredScreens.find(s => s.id.toString() === screenData.id.toString());
                  if (foundScreen) {
                    setSelectedScreen(foundScreen);
                  }
                }}
              />
            </motion.div>
          ))}
        </motion.div>

        {/* Professional Screen Detail Modal */}
        <AnimatePresence>
          {selectedScreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedScreen(null)}
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
                        {selectedScreen.name}
                      </h2>
                      <p className="text-gray-600 flex items-center">
                        <MapPin size={16} className="mr-1" />
                        {selectedScreen.location_name ||
                          "Location not specified"}
                      </p>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="px-4 py-2 rounded-full text-sm font-medium border bg-green-50 text-green-700 border-green-200">
                        <div className="flex items-center space-x-1">
                          <Monitor size={16} />
                          <span>Active</span>
                        </div>
                      </div>
                      <motion.button
                        onClick={() => setSelectedScreen(null)}
                        className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        whileHover={{ scale: 1.1, rotate: 90 }}
                        whileTap={{ scale: 0.9 }}
                      >
                        <XCircle size={24} />
                      </motion.button>
                    </div>
                  </div>

                  {/* Screen Media */}
                  <div className="mb-6">
                    <div className="relative h-64 bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl overflow-hidden">
                      {selectedScreen.video_url &&
                      selectedScreen.video_url.includes(".mp4") ? (
                        <video
                          src={selectedScreen.video_url}
                          className="w-full h-full object-cover"
                          autoPlay
                          loop
                          muted
                          controls
                          onError={(e) => {
                            (e.target as HTMLVideoElement).style.display =
                              "none";
                          }}
                        />
                      ) : selectedScreen.image_url ||
                        selectedScreen.day_photo_url ||
                        selectedScreen.night_photo_url ? (
                        <img
                          src={
                            selectedScreen.image_url ||
                            selectedScreen.day_photo_url ||
                            selectedScreen.night_photo_url
                          }
                          alt={selectedScreen.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display =
                              "none";
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center text-white text-2xl font-medium">
                          {selectedScreen.name}
                        </div>
                      )}
                      <div className="absolute top-4 right-4 bg-white/90 px-3 py-1 rounded-full text-sm font-medium text-gray-700">
                        {selectedScreen.city}
                      </div>
                      {selectedScreen.video_url && (
                        <div className="absolute top-4 left-4 bg-red-500/90 px-3 py-1 rounded-full text-sm font-medium text-white">
                          VIDEO SCREEN
                        </div>
                      )}
                      {/* Day/Night toggle if both photos exist */}
                      {selectedScreen.day_photo_url &&
                        selectedScreen.night_photo_url && (
                          <div className="absolute bottom-4 left-4 flex space-x-2">
                            <button className="bg-yellow-500/90 px-2 py-1 rounded text-white text-xs">
                              Day
                            </button>
                            <button className="bg-blue-900/90 px-2 py-1 rounded text-white text-xs">
                              Night
                            </button>
                          </div>
                        )}
                    </div>
                  </div>

                  {/* Quick Stats */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                    <motion.div
                      className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3">
                        <DollarSign className="text-blue-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Hourly Rate</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{selectedScreen.hourly_rate || "N/A"}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3">
                        <MapPin className="text-green-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">City</p>
                          <p className="text-xl font-bold text-gray-900">
                            {selectedScreen.city}
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="flex items-center space-x-3">
                        <Monitor className="text-purple-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Status</p>
                          <p className="text-xl font-bold text-gray-900">
                            Active
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </div>

                  {/* Screen Details */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Screen Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Basic Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Screen ID:</span>
                            <span className="font-medium">
                              {selectedScreen.id}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Name:</span>
                            <span className="font-medium">
                              {selectedScreen.name}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">City:</span>
                            <span className="font-medium">
                              {selectedScreen.city}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Location:</span>
                            <span className="font-medium">
                              {selectedScreen.location_name || "Not specified"}
                            </span>
                          </div>
                        </div>
                      </div>

                      <div className="bg-white p-4 rounded-lg">
                        <h4 className="font-medium text-gray-900 mb-2">
                          Pricing
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div className="flex justify-between">
                            <span className="text-gray-600">Hourly Rate:</span>
                            <span className="font-medium">
                              ₹{selectedScreen.hourly_rate || "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Daily Rate:</span>
                            <span className="font-medium">
                              ₹
                              {selectedScreen.hourly_rate
                                ? (
                                    selectedScreen.hourly_rate * 24
                                  ).toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-gray-600">Monthly Rate:</span>
                            <span className="font-medium">
                              ₹
                              {selectedScreen.hourly_rate
                                ? (
                                    selectedScreen.hourly_rate *
                                    24 *
                                    30
                                  ).toLocaleString()
                                : "N/A"}
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
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
