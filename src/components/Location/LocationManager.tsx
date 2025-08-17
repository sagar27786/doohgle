import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Users,
  Navigation,
  History,
  Settings,
  X,
  RefreshCw,
  MapIcon,
  Crosshair,
  Clock,
  TrendingUp,
} from "lucide-react";
import IndianMap from "../Map/IndianMap";
import LocationService, {
  LocationData,
  LocationHistory,
} from "../../services/locationService";

interface LocationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: LocationData) => void;
}

const LocationManager: React.FC<LocationManagerProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
}) => {
  const [activeTab, setActiveTab] = useState<
    "map" | "locations" | "history" | "settings"
  >("map");
  const [userLocations, setUserLocations] = useState<LocationData[]>([]);
  const [primaryLocation, setPrimaryLocation] = useState<LocationData | null>(
    null
  );
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Load user locations
  const loadUserLocations = async () => {
    setIsLoading(true);
    setError(null);

    try {
      const data = await LocationService.getUserLocation();
      setUserLocations(data.locations);
      setPrimaryLocation(data.primary);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load location history
  const loadLocationHistory = async () => {
    try {
      const historyData = await LocationService.getLocationHistory(20);
      setLocationHistory(historyData.history);
    } catch (err) {
      console.error("Failed to load location history:", err);
    }
  };

  // Load location statistics
  const loadLocationStats = async () => {
    try {
      const statsData = await LocationService.getLocationStats();
      setStats(statsData);
    } catch (err) {
      console.error("Failed to load location stats:", err);
    }
  };

  // Get current location and update
  const updateCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await LocationService.getCurrentLocationAndSave();
      await loadUserLocations();
    } catch (err: any) {
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Delete a location
  const deleteLocation = async (locationId: number) => {
    try {
      await LocationService.deleteLocation(locationId);
      await loadUserLocations();
    } catch (err: any) {
      setError(err.message);
    }
  };

  // Load data on component mount
  useEffect(() => {
    if (isOpen) {
      loadUserLocations();
      loadLocationHistory();
      loadLocationStats();
    }
  }, [isOpen]);

  const tabs = [
    { id: "map", label: "Map View", icon: MapIcon },
    { id: "locations", label: "My Locations", icon: MapPin },
    { id: "history", label: "History", icon: History },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.9, opacity: 0 }}
          className="bg-white rounded-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl"
        >
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center">
                  <MapPin className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold">Location Manager</h2>
                  <p className="text-blue-100">
                    Manage your locations and view campaign reach
                  </p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="w-10 h-10 bg-white/20 rounded-xl flex items-center justify-center hover:bg-white/30 transition-colors"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {/* Primary Location Info */}
            {primaryLocation && (
              <div className="mt-4 bg-white/10 rounded-xl p-4">
                <div className="flex items-center space-x-3">
                  <Navigation className="w-5 h-5 text-blue-200" />
                  <div>
                    <p className="font-medium">Current Location</p>
                    <p className="text-blue-100 text-sm">
                      {LocationService.formatLocationDisplay(primaryLocation)}
                    </p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Tab Navigation */}
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              {tabs.map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`py-4 px-2 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === tab.id
                      ? "border-blue-500 text-blue-600"
                      : "border-transparent text-gray-500 hover:text-gray-700"
                  }`}
                >
                  <div className="flex items-center space-x-2">
                    <tab.icon className="w-4 h-4" />
                    <span>{tab.label}</span>
                  </div>
                </button>
              ))}
            </nav>
          </div>

          {/* Content */}
          <div className="p-6 overflow-y-auto max-h-96">
            {/* Error Display */}
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
              >
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-white" />
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800">Error</h4>
                    <p className="text-sm text-red-700 mt-1">{error}</p>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Map View Tab */}
            {activeTab === "map" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Interactive Map
                  </h3>
                  <motion.button
                    onClick={updateCurrentLocation}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {isLoading ? (
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Crosshair className="w-4 h-4" />
                    )}
                    <span>Update Location</span>
                  </motion.button>
                </div>

                <IndianMap
                  showUserLocation={true}
                  showNearbyUsers={true}
                  height="400px"
                  className="rounded-xl"
                />
              </div>
            )}

            {/* My Locations Tab */}
            {activeTab === "locations" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    My Saved Locations
                  </h3>
                  <motion.button
                    onClick={loadUserLocations}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                    <span>Refresh</span>
                  </motion.button>
                </div>

                {userLocations.length === 0 ? (
                  <div className="text-center py-12">
                    <MapPin className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No saved locations found</p>
                    <motion.button
                      onClick={updateCurrentLocation}
                      className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      Add Current Location
                    </motion.button>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userLocations.map((location) => (
                      <motion.div
                        key={location.id}
                        className={`p-4 rounded-xl border-2 cursor-pointer ${
                          location.is_primary
                            ? "border-blue-500 bg-blue-50"
                            : "border-gray-200 bg-white hover:border-gray-300"
                        }`}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => onLocationSelect?.(location)}
                        layoutId={`location-${location.id}`}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <MapPin
                                className={`w-4 h-4 ${
                                  location.is_primary
                                    ? "text-blue-600"
                                    : "text-gray-500"
                                }`}
                              />
                              <span
                                className={`text-sm font-medium capitalize ${
                                  location.is_primary
                                    ? "text-blue-900"
                                    : "text-gray-700"
                                }`}
                              >
                                {location.location_type || "Unknown"}
                              </span>
                              {location.is_primary && (
                                <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-xs rounded-full">
                                  Primary
                                </span>
                              )}
                            </div>
                            <p className="text-gray-900 font-medium truncate">
                              {location.city || "Unknown City"}
                            </p>
                            <p className="text-gray-600 text-sm truncate">
                              {LocationService.formatLocationDisplay(location)}
                            </p>
                            <p className="text-gray-400 text-xs mt-1">
                              Last accessed:{" "}
                              {new Date(
                                location.last_accessed ||
                                  location.created_at ||
                                  ""
                              ).toLocaleDateString()}
                            </p>
                          </div>
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              deleteLocation(location.id!);
                            }}
                            className="text-gray-400 hover:text-red-500 transition-colors"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* History Tab */}
            {activeTab === "history" && (
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Location History
                  </h3>
                  <motion.button
                    onClick={loadLocationHistory}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <RefreshCw
                      className={`w-4 h-4 ${isLoading ? "animate-spin" : ""}`}
                    />
                    <span>Refresh</span>
                  </motion.button>
                </div>

                {locationHistory.length === 0 ? (
                  <div className="text-center py-12">
                    <History className="w-12 h-12 text-gray-300 mx-auto mb-4" />
                    <p className="text-gray-500">No location history found</p>
                  </div>
                ) : (
                  <div className="space-y-3">
                    {locationHistory.map((entry, index) => (
                      <motion.div
                        key={entry.id}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg"
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                      >
                        <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                          <Clock className="w-5 h-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <p className="font-medium text-gray-900">
                            {entry.city || "Unknown Location"}
                          </p>
                          <p className="text-gray-600 text-sm">
                            {entry.latitude.toFixed(6)},{" "}
                            {entry.longitude.toFixed(6)}
                          </p>
                          <p className="text-gray-400 text-xs">
                            {new Date(entry.created_at).toLocaleString()}
                          </p>
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500 capitalize">
                            {entry.location_source || "GPS"}
                          </p>
                          {entry.accuracy && (
                            <p className="text-xs text-gray-400">
                              ±{entry.accuracy}m
                            </p>
                          )}
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Settings Tab */}
            {activeTab === "settings" && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">
                  Location Settings
                </h3>

                {/* Statistics */}
                {stats && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl">
                      <div className="flex items-center space-x-3 mb-4">
                        <TrendingUp className="w-8 h-8 text-blue-600" />
                        <h4 className="text-lg font-semibold text-blue-900">
                          Location Stats
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-blue-700">
                            Total Locations:
                          </span>
                          <span className="font-semibold text-blue-900">
                            {stats.locations.total_locations}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">
                            Active Locations:
                          </span>
                          <span className="font-semibold text-blue-900">
                            {stats.locations.active_locations}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-blue-700">
                            Average Accuracy:
                          </span>
                          <span className="font-semibold text-blue-900">
                            {stats.locations.avg_accuracy
                              ? `±${Math.round(stats.locations.avg_accuracy)}m`
                              : "N/A"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl">
                      <div className="flex items-center space-x-3 mb-4">
                        <Users className="w-8 h-8 text-green-600" />
                        <h4 className="text-lg font-semibold text-green-900">
                          Activity Stats
                        </h4>
                      </div>
                      <div className="space-y-3">
                        <div className="flex justify-between">
                          <span className="text-green-700">
                            History Entries:
                          </span>
                          <span className="font-semibold text-green-900">
                            {stats.history.total_history_entries}
                          </span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-green-700">Unique Days:</span>
                          <span className="font-semibold text-green-900">
                            {stats.history.unique_days}
                          </span>
                        </div>
                        {stats.history.first_location && (
                          <div className="flex justify-between">
                            <span className="text-green-700">
                              First Record:
                            </span>
                            <span className="font-semibold text-green-900">
                              {new Date(
                                stats.history.first_location
                              ).toLocaleDateString()}
                            </span>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                )}

                {/* Location Privacy Settings */}
                <div className="bg-white border border-gray-200 rounded-xl p-6">
                  <h4 className="text-lg font-semibold text-gray-900 mb-4">
                    Privacy Settings
                  </h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          Share location with nearby users
                        </p>
                        <p className="text-sm text-gray-500">
                          Allow other users to see your general location
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">
                          High accuracy location
                        </p>
                        <p className="text-sm text-gray-500">
                          Use GPS for more precise location tracking
                        </p>
                      </div>
                      <label className="relative inline-flex items-center cursor-pointer">
                        <input
                          type="checkbox"
                          className="sr-only peer"
                          defaultChecked
                        />
                        <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                      </label>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="text-sm text-gray-500">
                Location data is stored securely and used only for campaign
                targeting
              </div>
              <div className="flex space-x-3">
                <motion.button
                  onClick={onClose}
                  className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Close
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default LocationManager;
