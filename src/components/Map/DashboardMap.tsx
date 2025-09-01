import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  BarChart3,
  Users,
  TrendingUp,
  Activity,
  Target,
  Monitor,
  Zap,
  DollarSign,
} from "lucide-react";
import IndianGoogleMap from "./IndianGoogleMap";
import MapNavigation from "../Navigation/MapNavigation";
import EnhancedMapDashboard from "./EnhancedMapDashboard";
import { LocationDetails } from "../../services/googleMapService";
import { ScreenSearchResult } from "../../api/screens";

interface DashboardMapProps {
  className?: string;
  showNavigation?: boolean;
  initialZoom?: number;
  height?: string;
}

interface MapFilter {
  id: string;
  label: string;
  active: boolean;
  color: string;
  icon: any;
}

interface ScreenLocation {
  id: string;
  name: string;
  coordinates: { lat: number; lng: number };
  city: string;
  state: string;
  status: "active" | "inactive" | "maintenance";
  stats: {
    impressions: number;
    revenue: number;
    campaigns: number;
    uptime: number;
  };
}

const DashboardMap: React.FC<DashboardMapProps> = ({
  className = "",
  showNavigation = true,
  initialZoom = 5,
  height = "600px",
}) => {
  const [showSidebar, setShowSidebar] = useState(showNavigation);
  const [currentView, setCurrentView] = useState<
    "map" | "dashboard" | "analytics" | "settings"
  >("map");
  const [selectedLocation, setSelectedLocation] =
    useState<LocationDetails | null>(null);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<ScreenSearchResult | null>(null);
  const [useEnhancedMap, setUseEnhancedMap] = useState(true);
  const [mapFilters, setMapFilters] = useState<MapFilter[]>([
    {
      id: "active",
      label: "Active Screens",
      active: true,
      color: "green",
      icon: Activity,
    },
    {
      id: "campaigns",
      label: "Live Campaigns",
      active: true,
      color: "blue",
      icon: Target,
    },
    {
      id: "analytics",
      label: "Analytics",
      active: false,
      color: "purple",
      icon: BarChart3,
    },
    {
      id: "traffic",
      label: "Traffic Data",
      active: false,
      color: "orange",
      icon: TrendingUp,
    },
  ]);

  const [screenLocations] = useState<ScreenLocation[]>([
    {
      id: "mumbai-1",
      name: "Mumbai Central Mall",
      coordinates: { lat: 19.076, lng: 72.8777 },
      city: "Mumbai",
      state: "Maharashtra",
      status: "active",
      stats: {
        impressions: 245000,
        revenue: 125000,
        campaigns: 12,
        uptime: 98.5,
      },
    },
    {
      id: "delhi-1",
      name: "Connaught Place",
      coordinates: { lat: 28.6139, lng: 77.209 },
      city: "Delhi",
      state: "Delhi",
      status: "active",
      stats: {
        impressions: 189000,
        revenue: 95000,
        campaigns: 8,
        uptime: 99.1,
      },
    },
    {
      id: "bangalore-1",
      name: "MG Road Junction",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      city: "Bengaluru",
      state: "Karnataka",
      status: "maintenance",
      stats: {
        impressions: 156000,
        revenue: 78000,
        campaigns: 6,
        uptime: 87.2,
      },
    },
  ]);

  const toggleFilter = (filterId: string) => {
    setMapFilters((prev) =>
      prev.map((filter) =>
        filter.id === filterId ? { ...filter, active: !filter.active } : filter
      )
    );
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    console.log("Location selected:", { lat, lng, address });
  };

  const getMapCenter = () => {
    // Center on India
    return { lat: 20.5937, lng: 78.9629 };
  };

  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.key === "f" && !e.ctrlKey) {
        setIsFullscreen(!isFullscreen);
      }
      if (e.key === "Escape" && isFullscreen) {
        setIsFullscreen(false);
      }
    };

    window.addEventListener("keydown", handleKeyPress);
    return () => window.removeEventListener("keydown", handleKeyPress);
  }, [isFullscreen]);

  return (
    <div className={`relative ${className}`}>
      {/* Navigation Sidebar */}
      <AnimatePresence>
        {showNavigation && (
          <MapNavigation
            currentView={currentView}
            onViewChange={(view) =>
              setCurrentView(
                view as "map" | "dashboard" | "analytics" | "settings"
              )
            }
            showSidebar={showSidebar}
            onToggleSidebar={() => setShowSidebar(!showSidebar)}
          />
        )}
      </AnimatePresence>

      {/* Main Map Container */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{
          opacity: 1,
          marginLeft: showNavigation && showSidebar ? 320 : 0,
        }}
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        className={`relative bg-white rounded-xl shadow-lg overflow-hidden ${
          isFullscreen ? "fixed inset-0 z-50" : ""
        }`}
        style={{ height: isFullscreen ? "100vh" : height }}
      >
        {/* Map Header */}
        <motion.div
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="absolute top-0 left-0 right-0 z-20 bg-white/95 backdrop-blur-sm border-b border-gray-200 p-4"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                Interactive Dashboard Map
              </h2>

              {/* Quick Stats */}
              <div className="flex items-center gap-4 ml-6">
                <div className="text-sm">
                  <span className="text-gray-500">Active: </span>
                  <span className="font-semibold text-green-600">2,847</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Cities: </span>
                  <span className="font-semibold text-blue-600">28</span>
                </div>
                <div className="text-sm">
                  <span className="text-gray-500">Revenue: </span>
                  <span className="font-semibold text-purple-600">₹12.5M</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {/* Map Controls */}
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setUseEnhancedMap(!useEnhancedMap)}
                className={`p-2 hover:bg-gray-100 rounded-lg transition-colors ${
                  useEnhancedMap ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
                }`}
                title={`Switch to ${useEnhancedMap ? 'basic' : 'enhanced'} map`}
              >
                <Monitor className="w-4 h-4" />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsFullscreen(!isFullscreen)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title={isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen"}
              >
                {isFullscreen ? (
                  <Minimize2 className="w-4 h-4 text-gray-600" />
                ) : (
                  <Maximize2 className="w-4 h-4 text-gray-600" />
                )}
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowSidebar(!showSidebar)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                title="Toggle Navigation"
              >
                <Navigation className="w-4 h-4 text-gray-600" />
              </motion.button>
            </div>
          </div>

          {/* Map Filters */}
          <motion.div
            initial={{ y: 10, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex items-center gap-2 mt-3 flex-wrap"
          >
            {mapFilters.map((filter) => {
              const IconComponent = filter.icon;
              return (
                <motion.button
                  key={filter.id}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => toggleFilter(filter.id)}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
                    filter.active
                      ? `bg-${filter.color}-100 text-${filter.color}-700 border-2 border-${filter.color}-200`
                      : "bg-gray-100 text-gray-600 border-2 border-transparent hover:bg-gray-200"
                  }`}
                >
                  <IconComponent className="w-3.5 h-3.5" />
                  <span>{filter.label}</span>
                  {filter.active ? (
                    <Eye className="w-3 h-3" />
                  ) : (
                    <EyeOff className="w-3 h-3" />
                  )}
                </motion.button>
              );
            })}
          </motion.div>
        </motion.div>

        {/* Map Component */}
        <div className="pt-24">
          {useEnhancedMap ? (
            <EnhancedMapDashboard
              className="h-full"
              height={isFullscreen ? "calc(100vh - 96px)" : "calc(600px - 96px)"}
              showControls={true}
              onScreenSelect={setSelectedScreen}
            />
          ) : (
            <IndianGoogleMap
              onLocationSelect={handleLocationSelect}
              showScreenLocations={true}
              height={isFullscreen ? "calc(100vh - 96px)" : "calc(600px - 96px)"}
              zoom={initialZoom}
              center={getMapCenter()}
            />
          )}
        </div>

        {/* Selected Screen/Location Details Overlay */}
        <AnimatePresence>
          {(selectedScreen || selectedLocation) && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="absolute bottom-4 left-4 bg-white rounded-xl shadow-2xl p-6 max-w-md border border-gray-200 z-30"
            >
              <div className="flex justify-between items-start mb-4">
                <h3 className="font-bold text-lg text-gray-900">
                  {selectedScreen ? 'Screen Details' : 'Location Details'}
                </h3>
                <button
                  onClick={() => {
                    setSelectedScreen(null);
                    setSelectedLocation(null);
                  }}
                  className="p-1 hover:bg-gray-100 rounded-full"
                >
                  ✕
                </button>
              </div>

              <div className="space-y-3">
                {selectedScreen ? (
                  <>
                    <div className="flex items-center gap-2 mb-2">
                       <div className={`w-3 h-3 rounded-full ${
                         selectedScreen.status === 'active' ? 'bg-green-500' :
                         selectedScreen.status === 'maintenance' ? 'bg-yellow-500' : 'bg-red-500'
                       }`}></div>
                       <span className="font-semibold">{selectedScreen.name}</span>
                     </div>
                    <div>
                      <span className="text-sm text-gray-500">Address:</span>
                      <div className="text-sm">{selectedScreen.address}</div>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4 text-blue-500" />
                        <div>
                          <span className="text-gray-500 block">Daily Footfall</span>
                          <div className="font-medium text-blue-600">
                            {selectedScreen.daily_footfall?.toLocaleString() || 'N/A'}
                          </div>
                        </div>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-500" />
                        <div>
                          <span className="text-gray-500 block">Cost/10s</span>
                          <div className="font-medium text-green-600">
                            ₹{selectedScreen.cost_per_10_seconds || 'N/A'}
                          </div>
                        </div>
                      </div>
                    </div>
                  </>
                ) : (
                  <>
                     {selectedLocation && (
                       <>
                         <div>
                           <span className="text-sm text-gray-500">Coordinates:</span>
                           <div className="text-sm font-mono">
                             {selectedLocation.coordinates.lat.toFixed(6)},{" "}
                             {selectedLocation.coordinates.lng.toFixed(6)}
                           </div>
                         </div>

                         <div>
                           <span className="text-sm text-gray-500">Address:</span>
                           <div className="text-sm">
                             {selectedLocation.formattedAddress}
                           </div>
                         </div>

                         {selectedLocation.locationContext.nearestCity && (
                           <div>
                             <span className="text-sm text-gray-500">Nearest City:</span>
                             <div className="text-sm">
                               {selectedLocation.locationContext.nearestCity.name},{" "}
                               {selectedLocation.locationContext.nearestCity.state}
                             </div>
                           </div>
                         )}
                       </>
                     )}
                   </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Screen Locations Panel */}
        <motion.div
          initial={{ x: 300, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="absolute top-24 right-4 w-72 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto z-20"
        >
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900 flex items-center gap-2">
              <Users className="w-4 h-4" />
              Screen Locations
            </h3>
          </div>

          <div className="p-2">
            {screenLocations.map((location) => (
              <motion.div
                key={location.id}
                whileHover={{ scale: 1.02 }}
                className="p-3 hover:bg-gray-50 rounded-lg cursor-pointer border-b border-gray-100 last:border-b-0"
              >
                <div className="flex justify-between items-start mb-2">
                  <h4 className="font-medium text-sm text-gray-900">
                    {location.name}
                  </h4>
                  <span
                    className={`px-2 py-1 text-xs rounded-full ${
                      location.status === "active"
                        ? "bg-green-100 text-green-700"
                        : location.status === "maintenance"
                        ? "bg-yellow-100 text-yellow-700"
                        : "bg-red-100 text-red-700"
                    }`}
                  >
                    {location.status}
                  </span>
                </div>

                <div className="text-xs text-gray-600 mb-2">
                  {location.city}, {location.state}
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <span className="text-gray-500">Impressions:</span>
                    <div className="font-semibold">
                      {location.stats.impressions.toLocaleString()}
                    </div>
                  </div>
                  <div>
                    <span className="text-gray-500">Revenue:</span>
                    <div className="font-semibold">
                      ₹{(location.stats.revenue / 1000).toFixed(0)}K
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default DashboardMap;
