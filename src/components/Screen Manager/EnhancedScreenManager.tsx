import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Monitor,
  Tv,
  Play,
  Pause,
  Settings,
  Eye,
  Activity,
  Zap,
  MapPin,
  Signal,
  Wifi,
  WifiOff,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  BarChart3,
  DollarSign,
  Users,
} from "lucide-react";
import {
  awsCloudWatchService,
  ScreenMetrics,
} from "../../services/awsCloudWatchService";
import { screensService } from "../../services/screensService";

interface Screen {
  id: number;
  name: string;
  location: string;
  city: string;
  status: "active" | "inactive" | "maintenance";
  type: "indoor" | "outdoor" | "transit";
  size: string;
  resolution: string;
  lastSeen: Date;
  owner: string;
}

interface EnhancedScreenManagerProps {
  className?: string;
}

const EnhancedScreenManager: React.FC<EnhancedScreenManagerProps> = ({
  className,
}) => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [screenMetrics, setScreenMetrics] = useState<
    Map<number, ScreenMetrics>
  >(new Map());
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [awsConnected, setAwsConnected] = useState(false);
  const [lastUpdate, setLastUpdate] = useState<Date>(new Date());
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [filter, setFilter] = useState<
    "all" | "active" | "inactive" | "maintenance"
  >("all");

  // Check AWS connection
  useEffect(() => {
    setAwsConnected(awsCloudWatchService.isConfigured());
  }, []);

  // Load screens and metrics
  const loadScreensData = async () => {
    setIsLoading(true);
    setError(null);

    try {
      // Load screens from backend
      const screensData = await screensService.getMyScreens();
      const mockScreens: Screen[] = [
        {
          id: 1,
          name: "Mumbai Central Mall - Food Court",
          location: "Food Court, Level 2",
          city: "Mumbai",
          status: "active",
          type: "indoor",
          size: '65"',
          resolution: "4K",
          lastSeen: new Date(),
          owner: "Mall Management",
        },
        {
          id: 2,
          name: "Delhi Metro Station - Platform 1",
          location: "Platform 1, Rajiv Chowk",
          city: "Delhi",
          status: "active",
          type: "transit",
          size: '55"',
          resolution: "1080p",
          lastSeen: new Date(),
          owner: "Metro Authority",
        },
        {
          id: 3,
          name: "Bangalore Tech Park - Lobby",
          location: "Main Lobby, Building A",
          city: "Bangalore",
          status: "maintenance",
          type: "indoor",
          size: '85"',
          resolution: "4K",
          lastSeen: new Date(Date.now() - 3600000), // 1 hour ago
          owner: "IT Park Management",
        },
        {
          id: 4,
          name: "Chennai Highway Billboard",
          location: "Highway Exit 12",
          city: "Chennai",
          status: "active",
          type: "outdoor",
          size: '120"',
          resolution: "1080p",
          lastSeen: new Date(),
          owner: "Outdoor Media Co.",
        },
        {
          id: 5,
          name: "Kolkata Shopping Complex",
          location: "Main Entrance",
          city: "Kolkata",
          status: "inactive",
          type: "indoor",
          size: '75"',
          resolution: "4K",
          lastSeen: new Date(Date.now() - 7200000), // 2 hours ago
          owner: "Shopping Mall",
        },
      ];

      setScreens(mockScreens);

      // Load AWS metrics for each screen if connected
      if (awsConnected) {
        const metricsMap = new Map<number, ScreenMetrics>();
        await Promise.all(
          mockScreens.map(async (screen) => {
            try {
              const metrics = await awsCloudWatchService.getScreenMetrics(
                screen.id
              );
              metricsMap.set(screen.id, metrics);
            } catch (error) {
              console.warn(
                `Failed to load metrics for screen ${screen.id}:`,
                error
              );
            }
          })
        );
        setScreenMetrics(metricsMap);
      }

      setLastUpdate(new Date());
    } catch (error: any) {
      setError(error.message || "Failed to load screens");
      console.error("Error loading screens:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadScreensData();
  }, [awsConnected]);

  // Auto-refresh functionality
  useEffect(() => {
    if (!autoRefresh) return;

    const interval = setInterval(() => {
      loadScreensData();
    }, 30000); // Refresh every 30 seconds

    return () => clearInterval(interval);
  }, [autoRefresh, awsConnected]);

  // Filter screens
  const filteredScreens = screens.filter((screen) => {
    if (filter === "all") return true;
    return screen.status === filter;
  });

  // Get status color
  const getStatusColor = (status: Screen["status"]) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Get status icon
  const getStatusIcon = (status: Screen["status"]) => {
    switch (status) {
      case "active":
        return <Play className="w-4 h-4" />;
      case "inactive":
        return <Pause className="w-4 h-4" />;
      case "maintenance":
        return <Settings className="w-4 h-4" />;
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Screen Manager</h1>
            <p className="text-gray-600 mt-1">
              Monitor and manage your digital advertising screens with real-time
              analytics
            </p>
          </div>

          <div className="flex items-center space-x-4">
            {/* AWS Connection Status */}
            <div
              className={`flex items-center space-x-2 px-3 py-2 rounded-lg ${
                awsConnected
                  ? "bg-green-100 text-green-700"
                  : "bg-gray-100 text-gray-600"
              }`}
            >
              {awsConnected ? (
                <Wifi className="w-4 h-4" />
              ) : (
                <WifiOff className="w-4 h-4" />
              )}
              <span className="text-sm font-medium">
                {awsConnected ? "AWS Connected" : "AWS Disconnected"}
              </span>
            </div>

            {/* Auto Refresh Toggle */}
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={autoRefresh}
                onChange={(e) => setAutoRefresh(e.target.checked)}
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Auto-refresh</span>
            </label>

            {/* Refresh Button */}
            <motion.button
              onClick={loadScreensData}
              disabled={isLoading}
              className="flex items-center space-x-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <RefreshCw
                className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
              />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>

        {/* Last Updated */}
        <div className="mt-4 text-sm text-gray-500 flex items-center space-x-2">
          <span>Last updated: {lastUpdate.toLocaleTimeString()}</span>
          {awsConnected && (
            <span className="flex items-center space-x-1">
              <Activity className="w-3 h-3" />
              <span>Real-time metrics active</span>
            </span>
          )}
        </div>

        {/* Error Display */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-4 bg-red-50 border border-red-200 rounded-lg p-4 flex items-center space-x-3"
          >
            <AlertCircle className="h-5 w-5 text-red-500 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
            <button
              onClick={() => setError(null)}
              className="ml-auto text-red-500 hover:text-red-700"
            >
              ×
            </button>
          </motion.div>
        )}
      </div>

      {/* Screen Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Active Screens</p>
              <p className="text-2xl font-bold text-gray-900">
                {screens.filter((s) => s.status === "active").length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertCircle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Inactive/Issues</p>
              <p className="text-2xl font-bold text-gray-900">
                {screens.filter((s) => s.status !== "active").length}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Total Impressions</p>
              <p className="text-2xl font-bold text-gray-900">
                {Array.from(screenMetrics.values())
                  .reduce((sum, metrics) => sum + metrics.impressions, 0)
                  .toLocaleString()}
              </p>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          whileHover={{ scale: 1.02 }}
        >
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-purple-100 rounded-lg">
              <TrendingUp className="w-6 h-6 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-gray-600">Average CTR</p>
              <p className="text-2xl font-bold text-gray-900">
                {screenMetrics.size > 0
                  ? (
                      Array.from(screenMetrics.values()).reduce(
                        (sum, metrics) => sum + metrics.ctr,
                        0
                      ) / screenMetrics.size
                    ).toFixed(2)
                  : "0.00"}
                %
              </p>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Filter Tabs */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center space-x-1 border-b border-gray-200 pb-4">
          {(["all", "active", "inactive", "maintenance"] as const).map(
            (status) => (
              <button
                key={status}
                onClick={() => setFilter(status)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  filter === status
                    ? "bg-blue-100 text-blue-700 border border-blue-200"
                    : "text-gray-600 hover:bg-gray-100"
                }`}
              >
                {status === "all"
                  ? "All Screens"
                  : status.charAt(0).toUpperCase() + status.slice(1)}
                <span className="ml-2 text-xs bg-gray-200 text-gray-700 px-2 py-1 rounded-full">
                  {status === "all"
                    ? screens.length
                    : screens.filter((s) => s.status === status).length}
                </span>
              </button>
            )
          )}
        </div>

        {/* Screen List */}
        {isLoading ? (
          <div className="py-8 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-2 border-blue-600 border-t-transparent"></div>
            <span className="ml-3 text-gray-600">Loading screens...</span>
          </div>
        ) : (
          <div className="mt-6 space-y-4">
            <AnimatePresence>
              {filteredScreens.map((screen) => {
                const metrics = screenMetrics.get(screen.id);

                return (
                  <motion.div
                    key={screen.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() =>
                      setSelectedScreen(
                        selectedScreen?.id === screen.id ? null : screen
                      )
                    }
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="p-3 bg-gray-100 rounded-lg">
                          <Tv className="w-6 h-6 text-gray-600" />
                        </div>

                        <div>
                          <div className="flex items-center space-x-3">
                            <h3 className="text-lg font-semibold text-gray-900">
                              {screen.name}
                            </h3>
                            <span
                              className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                screen.status
                              )}`}
                            >
                              {getStatusIcon(screen.status)}
                              <span className="ml-1">{screen.status}</span>
                            </span>
                          </div>

                          <div className="flex items-center space-x-4 mt-1 text-sm text-gray-500">
                            <span className="flex items-center">
                              <MapPin className="w-4 h-4 mr-1" />
                              {screen.location}, {screen.city}
                            </span>
                            <span className="flex items-center">
                              <Monitor className="w-4 h-4 mr-1" />
                              {screen.size} • {screen.resolution}
                            </span>
                            <span className="flex items-center">
                              <Clock className="w-4 h-4 mr-1" />
                              {screen.lastSeen.toLocaleTimeString()}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Real-time Metrics */}
                      {awsConnected && metrics && (
                        <div className="grid grid-cols-3 gap-4 text-center">
                          <div>
                            <div className="text-lg font-bold text-gray-900">
                              {metrics.impressions.toLocaleString()}
                            </div>
                            <div className="text-xs text-gray-500">
                              Impressions
                            </div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-green-600">
                              {metrics.ctr.toFixed(2)}%
                            </div>
                            <div className="text-xs text-gray-500">CTR</div>
                          </div>
                          <div>
                            <div className="text-lg font-bold text-blue-600">
                              {metrics.engagement}
                            </div>
                            <div className="text-xs text-gray-500">
                              Engagement
                            </div>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* Expanded Details */}
                    <AnimatePresence>
                      {selectedScreen?.id === screen.id && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          exit={{ opacity: 0, height: 0 }}
                          className="mt-6 pt-6 border-t border-gray-200"
                        >
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            {/* Screen Info */}
                            <div>
                              <h4 className="font-semibold text-gray-900 mb-3">
                                Screen Information
                              </h4>
                              <div className="space-y-2 text-sm">
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Type:</span>
                                  <span className="font-medium">
                                    {screen.type}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Size:</span>
                                  <span className="font-medium">
                                    {screen.size}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Resolution:
                                  </span>
                                  <span className="font-medium">
                                    {screen.resolution}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">Owner:</span>
                                  <span className="font-medium">
                                    {screen.owner}
                                  </span>
                                </div>
                                <div className="flex justify-between">
                                  <span className="text-gray-500">
                                    Last Seen:
                                  </span>
                                  <span className="font-medium">
                                    {screen.lastSeen.toLocaleString()}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Real-time Metrics */}
                            {awsConnected && metrics && (
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-3">
                                  Performance Metrics
                                </h4>
                                <div className="grid grid-cols-2 gap-4">
                                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                                    <div className="text-2xl font-bold text-blue-600">
                                      {metrics.impressions.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Impressions
                                    </div>
                                  </div>
                                  <div className="text-center p-4 bg-green-50 rounded-lg">
                                    <div className="text-2xl font-bold text-green-600">
                                      {metrics.views.toLocaleString()}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Views
                                    </div>
                                  </div>
                                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                                    <div className="text-2xl font-bold text-purple-600">
                                      {metrics.ctr.toFixed(2)}%
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      CTR
                                    </div>
                                  </div>
                                  <div className="text-center p-4 bg-orange-50 rounded-lg">
                                    <div className="text-2xl font-bold text-orange-600">
                                      {metrics.engagement}
                                    </div>
                                    <div className="text-sm text-gray-600">
                                      Engagement
                                    </div>
                                  </div>
                                </div>
                                <div className="mt-3 text-xs text-gray-500">
                                  Last updated:{" "}
                                  {new Date(
                                    metrics.lastUpdated
                                  ).toLocaleTimeString()}
                                </div>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                );
              })}
            </AnimatePresence>

            {filteredScreens.length === 0 && !isLoading && (
              <div className="text-center py-8">
                <Monitor className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No screens found
                </h3>
                <p className="text-gray-600">
                  {filter === "all"
                    ? "Add your first screen to start advertising"
                    : `No ${filter} screens found`}
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default EnhancedScreenManager;
