import React, { useEffect, useState } from "react";
import { useAdsManagerScreens } from "../hooks/useScreenVisibility";
import { Monitor, MapPin, Eye, RefreshCw } from "lucide-react";

const ScreenVisibilityDemo: React.FC = () => {
  const { screens, loading, error, refresh, debugLogAllScreens, cacheStatus } =
    useAdsManagerScreens();

  const [lastUpdated, setLastUpdated] = useState<string>("");

  useEffect(() => {
    if (screens.length > 0) {
      setLastUpdated(new Date().toLocaleTimeString());
    }
  }, [screens]);

  const handleRefresh = async () => {
    await refresh();
    setLastUpdated(new Date().toLocaleTimeString());
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🎯 Screen Visibility System Demo
          </h1>
          <p className="text-gray-600 mb-8">
            Testing that venue listings automatically appear in ads manager
          </p>

          {/* Status Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Monitor className="text-blue-600" size={24} />
                <div>
                  <p className="text-blue-800 font-semibold text-lg">
                    {loading ? "..." : screens.length}
                  </p>
                  <p className="text-blue-600 text-sm">Available Screens</p>
                </div>
              </div>
            </div>

            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <Eye className="text-green-600" size={24} />
                <div>
                  <p className="text-green-800 font-semibold">
                    {loading ? "Loading..." : "Active"}
                  </p>
                  <p className="text-green-600 text-sm">Visibility Status</p>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <MapPin className="text-purple-600" size={24} />
                <div>
                  <p className="text-purple-800 font-semibold">
                    {cacheStatus.totalCities}
                  </p>
                  <p className="text-purple-600 text-sm">Cities Covered</p>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={handleRefresh}
              disabled={loading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
              <span>Refresh Screens</span>
            </button>

            <button
              onClick={debugLogAllScreens}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye size={16} />
              <span>Debug Log</span>
            </button>
          </div>

          {/* Last Updated */}
          {lastUpdated && (
            <p className="text-sm text-gray-500 mb-6">
              Last updated: {lastUpdated}
            </p>
          )}

          {/* Loading State */}
          {loading && (
            <div className="text-center py-8">
              <RefreshCw className="animate-spin mx-auto mb-4" size={32} />
              <p className="text-gray-600">
                Loading screens from all venues...
              </p>
            </div>
          )}

          {/* Error State */}
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6">
              <p className="text-red-800 font-medium">Error:</p>
              <p className="text-red-600">{error}</p>
            </div>
          )}

          {/* Success State */}
          {!loading && !error && screens.length > 0 && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-6 mb-6">
              <h3 className="text-green-800 font-bold text-lg mb-2">
                ✅ Success! Screen Visibility is Working
              </h3>
              <p className="text-green-700 mb-4">
                All venue screen listings are now automatically visible to
                advertisers in the ads manager.
              </p>

              <div className="text-sm text-green-600 space-y-1">
                <p>
                  • <strong>{screens.length}</strong> screens loaded and ready
                  for advertising
                </p>
                <p>
                  • <strong>{cacheStatus.totalCities}</strong> cities covered
                </p>
                <p>• Auto-refresh enabled every 5 minutes</p>
                <p>• All screens automatically ads-enabled</p>
              </div>
            </div>
          )}

          {/* Screen List */}
          {!loading && screens.length > 0 && (
            <div>
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Available Screens for Advertising
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {screens.slice(0, 12).map((screen) => (
                  <div
                    key={screen.id}
                    className="bg-gray-50 border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <h4 className="font-medium text-gray-900 mb-2">
                      {screen.name}
                    </h4>

                    <div className="space-y-1 text-sm text-gray-600">
                      <p className="flex items-center space-x-1">
                        <MapPin size={14} />
                        <span>{screen.location_name}</span>
                      </p>

                      {screen.city && <p>City: {screen.city}</p>}

                      {screen.daily_footfall && (
                        <p>
                          Daily Footfall:{" "}
                          {screen.daily_footfall.toLocaleString()}
                        </p>
                      )}

                      {screen.cost_per_10_seconds && (
                        <p className="text-green-600 font-medium">
                          ₹{(screen.cost_per_10_seconds * 360).toLocaleString()}
                          /hour
                        </p>
                      )}
                    </div>

                    <div className="mt-3">
                      <span className="inline-block bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full">
                        Available for Ads
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {screens.length > 12 && (
                <p className="text-center text-gray-500 mt-6">
                  ... and {screens.length - 12} more screens available
                </p>
              )}
            </div>
          )}

          {/* No Screens */}
          {!loading && !error && screens.length === 0 && (
            <div className="text-center py-8">
              <Monitor className="mx-auto mb-4 text-gray-400" size={48} />
              <p className="text-gray-600">
                No screens found. Make sure venue owners have listed their
                screens.
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ScreenVisibilityDemo;
