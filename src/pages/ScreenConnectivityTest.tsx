import React, { useEffect, useState } from "react";
import { useAdsManagerScreens } from "../hooks/useScreenVisibility";
import { getMyScreens } from "../api/screens";
import { Monitor, MapPin, Eye, RefreshCw, User, Globe } from "lucide-react";

const ScreenConnectivityTest: React.FC = () => {
  const {
    screens: adsManagerScreens,
    loading: adsLoading,
    error: adsError,
    refresh: refreshAds,
    debugLogAllScreens,
    refreshAfterScreenCreation,
  } = useAdsManagerScreens();

  const [userScreens, setUserScreens] = useState<any[]>([]);
  const [userLoading, setUserLoading] = useState(true);
  const [userError, setUserError] = useState<string | null>(null);

  // Load user's own screens
  const loadUserScreens = async () => {
    setUserLoading(true);
    setUserError(null);
    try {
      const { ok, data } = await getMyScreens();
      if (ok && data?.screens) {
        setUserScreens(data.screens);
        console.log("👤 User screens loaded:", data.screens);
      } else {
        setUserError(data?.message || "Failed to load user screens");
      }
    } catch (err) {
      setUserError(
        err instanceof Error ? err.message : "Error loading user screens"
      );
    } finally {
      setUserLoading(false);
    }
  };

  useEffect(() => {
    loadUserScreens();
  }, []);

  const handleTestConnection = async () => {
    console.log("🔄 Testing Screen Manager → Ads Manager connection...");
    await loadUserScreens();
    await refreshAfterScreenCreation();
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-8 mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            🔗 Screen Manager ↔️ Ads Manager Connection Test
          </h1>
          <p className="text-gray-600 mb-6">
            Testing that screens from Screen Manager appear in Ads Manager
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap gap-4 mb-8">
            <button
              onClick={handleTestConnection}
              disabled={userLoading || adsLoading}
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
            >
              <RefreshCw
                size={16}
                className={userLoading || adsLoading ? "animate-spin" : ""}
              />
              <span>Test Connection</span>
            </button>

            <button
              onClick={debugLogAllScreens}
              className="flex items-center space-x-2 bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition-colors"
            >
              <Eye size={16} />
              <span>Debug Log</span>
            </button>

            <a
              href="/products/screen-manager"
              target="_blank"
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
            >
              <Monitor size={16} />
              <span>Open Screen Manager</span>
            </a>

            <a
              href="/products/ads-manager/dashboard"
              target="_blank"
              className="flex items-center space-x-2 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors"
            >
              <Globe size={16} />
              <span>Open Ads Manager</span>
            </a>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Screen Manager Screens (User's Own) */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <User className="text-blue-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Screen Manager (Your Screens)
                </h2>
              </div>

              {userLoading && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Loading user screens...</span>
                </div>
              )}

              {userError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium">Error:</p>
                  <p className="text-red-600 text-sm">{userError}</p>
                </div>
              )}

              {!userLoading && !userError && (
                <>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                    <p className="text-blue-800 font-semibold">
                      {userScreens.length} screens found
                    </p>
                    <p className="text-blue-600 text-sm">
                      From Screen Manager dashboard
                    </p>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {userScreens.map((screen, index) => (
                      <div
                        key={screen.id || index}
                        className="bg-gray-50 border border-gray-200 rounded-lg p-4"
                      >
                        <h3 className="font-medium text-gray-900 mb-2">
                          {screen.screen_name}
                        </h3>
                        <div className="space-y-1 text-sm text-gray-600">
                          <p className="flex items-center space-x-1">
                            <MapPin size={14} />
                            <span>{screen.location_in_venue}</span>
                          </p>
                          {screen.city && <p>City: {screen.city}</p>}
                          {screen.device_type && (
                            <p>Type: {screen.device_type}</p>
                          )}
                          <p>
                            Ads Enabled:{" "}
                            {screen.ads_enabled ? "✅ Yes" : "❌ No"}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}

              {!userLoading && !userError && userScreens.length === 0 && (
                <div className="text-center py-8">
                  <Monitor className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600">
                    No screens found in Screen Manager
                  </p>
                  <p className="text-gray-500 text-sm">
                    Create a screen first to test visibility
                  </p>
                </div>
              )}
            </div>

            {/* Ads Manager Screens (Combined) */}
            <div className="border border-gray-200 rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <Globe className="text-purple-600" size={24} />
                <h2 className="text-xl font-semibold text-gray-900">
                  Ads Manager (All Available)
                </h2>
              </div>

              {adsLoading && (
                <div className="flex items-center space-x-2 text-gray-600">
                  <RefreshCw className="animate-spin" size={16} />
                  <span>Loading ads manager screens...</span>
                </div>
              )}

              {adsError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <p className="text-red-800 font-medium">Error:</p>
                  <p className="text-red-600 text-sm">{adsError}</p>
                </div>
              )}

              {!adsLoading && !adsError && (
                <>
                  <div className="bg-purple-50 border border-purple-200 rounded-lg p-4 mb-4">
                    <p className="text-purple-800 font-semibold">
                      {adsManagerScreens.length} screens available
                    </p>
                    <p className="text-purple-600 text-sm">
                      Your screens + public screens
                    </p>
                  </div>

                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {adsManagerScreens.slice(0, 10).map((screen, index) => (
                      <div
                        key={screen.id || index}
                        className={`border rounded-lg p-4 ${
                          screen.description?.includes("Your own screen")
                            ? "bg-blue-50 border-blue-200"
                            : "bg-gray-50 border-gray-200"
                        }`}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-medium text-gray-900">
                            {screen.name}
                          </h3>
                          {screen.description?.includes("Your own screen") && (
                            <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full">
                              Your Screen
                            </span>
                          )}
                        </div>
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
                        </div>
                      </div>
                    ))}
                  </div>

                  {adsManagerScreens.length > 10 && (
                    <p className="text-center text-gray-500 mt-4">
                      ... and {adsManagerScreens.length - 10} more screens
                    </p>
                  )}
                </>
              )}

              {!adsLoading && !adsError && adsManagerScreens.length === 0 && (
                <div className="text-center py-8">
                  <Globe className="mx-auto mb-4 text-gray-400" size={48} />
                  <p className="text-gray-600">
                    No screens found in Ads Manager
                  </p>
                  <p className="text-gray-500 text-sm">Check your connection</p>
                </div>
              )}
            </div>
          </div>

          {/* Connection Status */}
          <div className="mt-8 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Connection Status
            </h3>
            <div className="space-y-2 text-sm">
              <p>
                <span className="font-medium">Screen Manager Screens:</span>{" "}
                <span
                  className={
                    userScreens.length > 0
                      ? "text-green-600"
                      : "text-yellow-600"
                  }
                >
                  {userScreens.length} found
                </span>
              </p>
              <p>
                <span className="font-medium">Ads Manager Screens:</span>{" "}
                <span
                  className={
                    adsManagerScreens.length > 0
                      ? "text-green-600"
                      : "text-red-600"
                  }
                >
                  {adsManagerScreens.length} available
                </span>
              </p>
              <p>
                <span className="font-medium">
                  User Screens in Ads Manager:
                </span>{" "}
                <span className="text-blue-600">
                  {
                    adsManagerScreens.filter((s) =>
                      s.description?.includes("Your own screen")
                    ).length
                  }{" "}
                  visible
                </span>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenConnectivityTest;
