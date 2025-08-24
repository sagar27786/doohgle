// Professional Screen Manager Component - Enhanced with animations
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Monitor,
  Settings,
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
  Download,
  Upload,
  Zap,
  Activity,
  Globe,
  ArrowUp,
  ArrowDown,
  Target,
} from "lucide-react";

// Backend Integration
import { useScreens } from "../../../hooks/useAdsManager";
import { Screen as BackendScreen } from "../../../services/adsManagerService";

interface Screen extends BackendScreen {
  // Frontend-specific fields can be added here
}

// Professional Loading screen component
const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center h-64"
    >
      <div className="text-center">
        {/* Animated Logo */}
        <motion.div
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-lg"
          animate={{ 
            rotateY: 360,
            scale: [1, 1.1, 1] 
          }}
          transition={{ 
            rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" }
          }}
        >
          <Monitor className="text-white" size={24} />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="text-gray-600 text-lg"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading screens...
        </motion.p>

        {/* Loading Bar */}
        <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            animate={{ x: ['-100%', '100%'] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Animated Counter Component
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
      {prefix}{count.toFixed(decimals)}{suffix}
    </span>
  );
};

const ScreenManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [showStats, setShowStats] = useState(true);

  const { screens, loading, error, refetch } = useScreens();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredScreens =
    screens?.filter((screen: Screen) => {
      const matchesSearch =
        screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.location_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        screen.is_active === (statusFilter === "active");
      const matchesCity = cityFilter === "all" || screen.city === cityFilter;
      return matchesSearch && matchesStatus && matchesCity;
    }) || [];

  // Get unique cities for filter
  const uniqueCities = screens
    ? [...new Set(screens.map((screen: Screen) => screen.city).filter(Boolean))]
    : [];

  // Calculate stats
  const totalScreens = screens?.length || 0;
  const activeScreens = screens?.filter(s => s.is_active).length || 0;
  const offlineScreens = totalScreens - activeScreens;
  const utilizationRate = totalScreens > 0 ? (activeScreens / totalScreens) * 100 : 0;

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle size={16} className="text-green-500" />
    ) : (
      <AlertCircle size={16} className="text-red-500" />
    );
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive 
      ? "bg-green-100 text-green-800 border-green-200" 
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "online" : "offline";
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <motion.div 
        className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="text-red-600" size={24} />
          <h3 className="text-lg font-semibold text-red-800">Error Loading Screens</h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <motion.button
          onClick={() => refetch()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry Loading
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-8">
        {/* Professional Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent mb-2">
                Screen Manager
              </h1>
              <p className="text-gray-600 text-lg">
                Monitor and manage your digital screens in real-time
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => refetch()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={20} />
                <span>Refresh</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Plus size={18} />
                <span>Add Screen</span>
              </motion.button>
            </div>
          </div>

          {/* Animated Statistics Cards */}
          {showStats && (
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
                      Total Screens
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={totalScreens} />
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                    <Monitor className="text-blue-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="text-green-600 mr-1" size={16} />
                  <span className="text-green-600 font-medium">12.5%</span>
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
                    <p className="text-sm font-medium text-gray-600">
                      Active Screens
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={activeScreens} />
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                    <Activity className="text-green-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="text-green-600 mr-1" size={16} />
                  <span className="text-green-600 font-medium">8.2%</span>
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
                      Offline Screens
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={offlineScreens} />
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg">
                    <AlertCircle className="text-red-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowDown className="text-red-600 mr-1" size={16} />
                  <span className="text-red-600 font-medium">3.1%</span>
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
                      Utilization Rate
                    </p>
                    <p className="text-2xl font-bold text-gray-900">
                      <AnimatedCounter value={utilizationRate} decimals={1} suffix="%" />
                    </p>
                  </div>
                  <div className="p-3 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg">
                    <Target className="text-purple-600" size={24} />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <ArrowUp className="text-green-600 mr-1" size={16} />
                  <span className="text-green-600 font-medium">5.7%</span>
                  <span className="text-gray-500 ml-1">vs last month</span>
                </div>
              </motion.div>
            </div>
          )}
        </motion.div>

        {/* Professional Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search screens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Offline</option>
              </select>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <motion.button
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Professional Screen Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {filteredScreens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + (0.1 * index) }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all overflow-hidden group"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Screen Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {screen.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {screen.location_name || 'Unknown Location'}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        screen.is_active
                      )}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(screen.is_active)}
                        <span>{getStatusText(screen.is_active)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {screen.city && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="mr-2" size={16} />
                    <span>{screen.city}</span>
                  </div>
                )}

                {/* Screen Details */}
                <div className="space-y-2">
                  {screen.screen_size && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Size:</span>
                      <span className="font-medium text-gray-900">
                        {screen.screen_size}
                      </span>
                    </div>
                  )}
                  {screen.resolution && (
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-600">Resolution:</span>
                      <span className="font-medium text-gray-900">
                        {screen.resolution}
                      </span>
                    </div>
                  )}
                </div>
              </div>

              {/* Screen Actions */}
              <div className="p-6">
                <div className="flex space-x-2">
                  <motion.button
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </motion.button>
                  <motion.button
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings size={16} />
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
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredScreens.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Monitor className="text-gray-500" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No screens found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== 'all' || cityFilter !== 'all'
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first screen.'}
            </p>
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="inline mr-2" size={20} />
              Add Screen
            </motion.button>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default ScreenManager;
