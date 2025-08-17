// Screen Manager Component - Backend Integration
import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
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
} from "lucide-react";

// Backend Integration
import { useScreens } from "../../../hooks/useAdsManager";
import { Screen as BackendScreen } from "../../../services/adsManagerService";

interface Screen extends BackendScreen {
  // Frontend-specific fields can be added here
}

const ScreenManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");

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

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle size={16} className="text-green-500" />
    ) : (
      <AlertCircle size={16} className="text-red-500" />
    );
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "online" : "offline";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <p className="text-red-600">Error loading screens: {error}</p>
        <button
          onClick={() => refetch()}
          className="mt-2 px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Screen Manager</h2>
          <p className="text-gray-600">
            Monitor and manage your digital screens
          </p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            <span className="font-medium">{screens?.length || 0}</span> Total
            Screens
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-col lg:flex-row gap-4">
        <div className="relative flex-1">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={16}
          />
          <input
            type="text"
            placeholder="Search screens by name or location..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2">
            <Filter size={16} className="text-gray-400" />
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Online</option>
              <option value="inactive">Offline</option>
            </select>
          </div>

          <div className="flex items-center space-x-2">
            <MapPin size={16} className="text-gray-400" />
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Online</p>
              <p className="text-2xl font-bold text-green-600">
                {screens?.filter((s: Screen) => s.is_active).length || 0}
              </p>
            </div>
            <CheckCircle className="text-green-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Offline</p>
              <p className="text-2xl font-bold text-red-600">
                {screens?.filter((s: Screen) => !s.is_active).length || 0}
              </p>
            </div>
            <AlertCircle className="text-red-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">
                Avg Daily Footfall
              </p>
              <p className="text-2xl font-bold text-blue-600">
                {screens?.length
                  ? Math.round(
                      screens.reduce(
                        (sum, s) => sum + (s.daily_footfall || 0),
                        0
                      ) / screens.length
                    ).toLocaleString()
                  : 0}
              </p>
            </div>
            <BarChart3 className="text-blue-500" size={24} />
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Screens</p>
              <p className="text-2xl font-bold text-purple-600">
                {screens?.length || 0}
              </p>
            </div>
            <Monitor className="text-purple-500" size={24} />
          </div>
        </div>
      </div>

      {/* Screens Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredScreens.map((screen: Screen) => (
          <motion.div
            key={screen.id}
            className="bg-white rounded-lg shadow-md border border-gray-200 overflow-hidden"
            whileHover={{ y: -4 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {/* Screen Image */}
            {screen.image_url && (
              <div className="h-48 bg-gray-200 overflow-hidden">
                <img
                  src={screen.image_url}
                  alt={screen.name}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = "none";
                  }}
                />
              </div>
            )}

            {/* Screen Header */}
            <div className="p-4 border-b border-gray-200">
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-lg font-semibold text-gray-900 truncate">
                  {screen.name}
                </h3>
                <div className="flex items-center space-x-2">
                  {getStatusIcon(screen.is_active)}
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                      screen.is_active
                    )}`}
                  >
                    {getStatusText(screen.is_active)}
                  </span>
                </div>
              </div>
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin size={14} className="mr-1" />
                <span>{screen.location_name}</span>
              </div>
              <div className="text-gray-600 text-sm mt-1">{screen.address}</div>
            </div>

            {/* Screen Details */}
            <div className="p-4 space-y-3">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Screen Type</p>
                  <p className="text-sm font-semibold capitalize">
                    {screen.screen_type?.replace("_", " ")}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Resolution</p>
                  <p className="text-sm font-semibold">
                    {screen.resolution_width}x{screen.resolution_height}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Size</p>
                  <p className="text-sm font-semibold">
                    {screen.screen_size_width}"×{screen.screen_size_height}"
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">City</p>
                  <p className="text-sm font-semibold">{screen.city}</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-xs text-gray-500">Daily Footfall</p>
                  <p className="text-sm font-semibold">
                    {screen.daily_footfall?.toLocaleString()}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Cost/10sec</p>
                  <p className="text-sm font-semibold">
                    ${screen.cost_per_10_seconds}
                  </p>
                </div>
              </div>

              {/* Screen Metrics */}
              <div className="bg-gray-50 rounded-lg p-3 mt-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs font-medium text-gray-600">
                    Performance
                  </span>
                  <span className="text-xs text-gray-500">Peak Hours</span>
                </div>
                <div className="text-xs text-gray-600">
                  {screen.peak_hours || "Not specified"}
                </div>
                <div className="text-xs text-gray-600 mt-1">
                  <span className="font-medium">Demographics:</span>{" "}
                  {screen.demographics || "General audience"}
                </div>
              </div>
            </div>

            {/* Screen Actions */}
            <div className="p-4 border-t border-gray-200 flex items-center justify-between">
              <motion.button
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Eye size={14} />
                <span className="text-sm">View Details</span>
              </motion.button>

              <motion.button
                className="flex items-center space-x-2 px-3 py-2 text-gray-600 hover:text-gray-800 hover:bg-gray-50 rounded-lg transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Settings size={14} />
                <span className="text-sm">Settings</span>
              </motion.button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Empty State */}
      {filteredScreens.length === 0 && (
        <div className="text-center py-12">
          <Monitor size={48} className="mx-auto text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No screens found
          </h3>
          <p className="text-gray-600 mb-4">
            {searchTerm || statusFilter !== "all" || cityFilter !== "all"
              ? "Try adjusting your search or filter criteria"
              : "No screens are currently available"}
          </p>
        </div>
      )}
    </div>
  );
};

export default ScreenManager;
