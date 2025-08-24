import React, { useState, useEffect, useRef } from "react";
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
  Monitor,
  Tv,
  Play,
  Pause,
  Eye,
  EyeOff,
  Zap,
  Cloud,
  Wifi,
  WifiOff,
  BarChart3,
  Activity,
  AlertCircle,
  CheckCircle,
} from "lucide-react";
import IndianGoogleMap from "../Map/IndianGoogleMap";
import LocationService, {
  LocationData,
  LocationHistory,
} from "../../services/locationService";
import GoogleMapService from "../../services/googleMapService";
import AWSCredentialsForm from "../AWS/AWSCredentialsForm";
import {
  awsCloudWatchService,
  ScreenMetrics,
} from "../../services/awsCloudWatchService";

// Declare Google Maps types
declare global {
  interface Window {
    google: any;
  }
}

interface LocationManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onLocationSelect?: (location: LocationData) => void;
}

// Enhanced Screen Marker Interface
interface ScreenMarker {
  id: number;
  name: string;
  position: { lat: number; lng: number };
  city: string;
  status: "active" | "inactive" | "maintenance";
  type: "indoor" | "outdoor" | "transit";
  size: "small" | "medium" | "large";
  impressions?: number;
  revenue?: number;
}

// Sample enhanced screen data
const sampleScreens: ScreenMarker[] = [
  {
    id: 1,
    name: "Delhi Metro Station Display",
    position: { lat: 28.6139, lng: 77.209 },
    city: "New Delhi",
    status: "active",
    type: "transit",
    size: "large",
    impressions: 150000,
    revenue: 25000,
  },
  {
    id: 2,
    name: "Mumbai Mall Billboard",
    position: { lat: 19.076, lng: 72.8777 },
    city: "Mumbai",
    status: "active",
    type: "indoor",
    size: "medium",
    impressions: 89000,
    revenue: 18500,
  },
  {
    id: 3,
    name: "Bangalore Tech Park Screen",
    position: { lat: 12.9716, lng: 77.5946 },
    city: "Bengaluru",
    status: "inactive",
    type: "indoor",
    size: "medium",
    impressions: 0,
    revenue: 0,
  },
  {
    id: 4,
    name: "Chennai Bus Terminal",
    position: { lat: 13.0827, lng: 80.2707 },
    city: "Chennai",
    status: "maintenance",
    type: "outdoor",
    size: "large",
    impressions: 45000,
    revenue: 8900,
  },
  {
    id: 5,
    name: "Kolkata Shopping Complex",
    position: { lat: 22.5726, lng: 88.3639 },
    city: "Kolkata",
    status: "active",
    type: "indoor",
    size: "small",
    impressions: 32000,
    revenue: 6700,
  },
  {
    id: 6,
    name: "Hyderabad IT Hub Display",
    position: { lat: 17.385, lng: 78.4867 },
    city: "Hyderabad",
    status: "active",
    type: "indoor",
    size: "large",
    impressions: 125000,
    revenue: 22800,
  },
];

// Enhanced Screen Map Component with TV Screen Markers
const EnhancedScreenMap: React.FC<{
  screens: ScreenMarker[];
  showScreens: boolean;
  center: { lat: number; lng: number };
  zoom: number;
  onScreenSelect: (screen: ScreenMarker | null) => void;
  onLocationSelect: (lat: number, lng: number) => void;
}> = ({
  screens,
  showScreens,
  center,
  zoom,
  onScreenSelect,
  onLocationSelect,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  // Initialize Google Map with enhanced styling
  useEffect(() => {
    const initMap = async () => {
      if (!mapRef.current) return;

      // Load Google Maps API if not already loaded
      try {
        await GoogleMapService.getInstance().loadGoogleMapsAPI();

        if (!window.google) return;

        const map = new window.google.maps.Map(mapRef.current, {
          center: center,
          zoom: zoom,
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#242f3e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.stroke",
              stylers: [{ color: "#242f3e" }],
            },
            {
              featureType: "all",
              elementType: "labels.text.fill",
              stylers: [{ color: "#746855" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#17263c" }],
            },
            {
              featureType: "road",
              elementType: "geometry",
              stylers: [{ color: "#38414e" }],
            },
            {
              featureType: "poi",
              elementType: "labels.text.fill",
              stylers: [{ color: "#6f9ba4" }],
            },
            {
              featureType: "transit",
              elementType: "geometry",
              stylers: [{ color: "#2f3948" }],
            },
          ],
          mapTypeControl: true,
          streetViewControl: true,
          fullscreenControl: true,
        });

        mapInstance.current = map;

        // Add click listener
        map.addListener("click", (event: any) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();
          onLocationSelect(lat, lng);
        });

        // Add screen markers when map is ready
        if (showScreens) {
          addEnhancedScreenMarkers(map);
        }
      } catch (error) {
        console.error("Failed to load Google Maps:", error);
      }
    };

    initMap();
  }, [center, zoom, showScreens, onLocationSelect]);

  // Add enhanced TV screen markers
  const addEnhancedScreenMarkers = (map: any) => {
    // Clear existing markers
    markersRef.current.forEach((marker) => marker.setMap(null));
    markersRef.current = [];

    screens.forEach((screen) => {
      const isActive = screen.status === "active";
      const isMaintenance = screen.status === "maintenance";

      // Enhanced TV Screen SVG Icon
      const tvScreenIcon = {
        url: `data:image/svg+xml,${encodeURIComponent(`
          <svg viewBox="0 0 48 48" xmlns="http://www.w3.org/2000/svg">
            <defs>
              <filter id="glow">
                <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
                <feMerge> 
                  <feMergeNode in="coloredBlur"/>
                  <feMergeNode in="SourceGraphic"/> 
                </feMerge>
              </filter>
              ${
                isActive
                  ? `
                <animate attributeName="opacity" values="0.8;1;0.8" dur="2s" repeatCount="indefinite"/>
              `
                  : ""
              }
            </defs>
            
            <!-- TV Screen Body -->
            <rect x="8" y="12" width="32" height="24" rx="3" ry="3" 
                  fill="${
                    isActive ? "#22c55e" : isMaintenance ? "#f59e0b" : "#ef4444"
                  }" 
                  stroke="#ffffff" stroke-width="2" filter="url(#glow)"/>
            
            <!-- Screen Display -->
            <rect x="11" y="15" width="26" height="18" rx="1" ry="1" 
                  fill="${
                    isActive ? "#065f46" : isMaintenance ? "#92400e" : "#7f1d1d"
                  }" 
                  opacity="0.8"/>
            
            <!-- Power Indicator -->
            <circle cx="${isActive ? "35" : "13"}" cy="17" r="2" 
                    fill="${isActive ? "#10b981" : "#6b7280"}">
              ${
                isActive
                  ? `<animate attributeName="r" values="1.5;2.5;1.5" dur="1.5s" repeatCount="indefinite"/>`
                  : ""
              }
            </circle>
            
            <!-- Base Stand -->
            <rect x="20" y="36" width="8" height="4" rx="1" ry="1" 
                  fill="#4b5563" stroke="#ffffff" stroke-width="1"/>
            
            <!-- Active Screen Effect -->
            ${
              isActive
                ? `
              <rect x="11" y="15" width="26" height="18" rx="1" ry="1" 
                    fill="url(#activeGradient)" opacity="0.3"/>
              <defs>
                <linearGradient id="activeGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                  <stop offset="0%" style="stop-color:#34d399;stop-opacity:1" />
                  <stop offset="100%" style="stop-color:#10b981;stop-opacity:1" />
                </linearGradient>
              </defs>
            `
                : ""
            }
            
            <!-- Screen Type Badge -->
            <rect x="12" y="16" width="8" height="4" rx="1" ry="1" 
                  fill="${
                    screen.type === "indoor"
                      ? "#3b82f6"
                      : screen.type === "outdoor"
                      ? "#f97316"
                      : "#8b5cf6"
                  }" 
                  opacity="0.9"/>
            <text x="16" y="19" text-anchor="middle" fill="white" font-size="3" font-weight="bold">
              ${
                screen.type === "indoor"
                  ? "IN"
                  : screen.type === "outdoor"
                  ? "OUT"
                  : "T"
              }
            </text>
          </svg>
        `)}`,
        scaledSize: new (window.google.maps as any).Size(
          isActive ? 40 : 32,
          isActive ? 40 : 32
        ),
        anchor: new (window.google.maps as any).Point(20, 20),
      };

      const marker = new (window.google.maps as any).Marker({
        position: screen.position,
        map: map,
        icon: tvScreenIcon,
        title: screen.name,
        animation: isActive
          ? (window.google.maps as any).Animation.BOUNCE
          : null,
        zIndex: isActive ? 1000 : 500,
      });

      // Enhanced Info Window
      const infoWindow = new (window.google.maps as any).InfoWindow({
        content: `
          <div style="padding: 16px; min-width: 280px; font-family: 'Inter', sans-serif;">
            <div style="display: flex; align-items: center; margin-bottom: 12px;">
              <div style="width: 32px; height: 32px; background: ${
                isActive ? "#22c55e" : isMaintenance ? "#f59e0b" : "#ef4444"
              }; 
                          border-radius: 6px; display: flex; align-items: center; justify-content: center; margin-right: 12px;">
                <span style="color: white; font-size: 14px;">📺</span>
              </div>
              <div>
                <h3 style="margin: 0; font-size: 16px; font-weight: 600; color: #1f2937;">${
                  screen.name
                }</h3>
                <p style="margin: 0; font-size: 12px; color: #6b7280;">📍 ${
                  screen.city
                }</p>
              </div>
            </div>
            
            <div style="background: ${
              isActive ? "#f0fdf4" : isMaintenance ? "#fffbeb" : "#fef2f2"
            }; 
                        padding: 12px; border-radius: 8px; margin-bottom: 12px;">
              <div style="display: flex; justify-content: space-between; align-items: center;">
                <span style="color: ${
                  isActive ? "#166534" : isMaintenance ? "#92400e" : "#991b1b"
                }; 
                             font-weight: 600; font-size: 14px;">
                  ${
                    screen.status.charAt(0).toUpperCase() +
                    screen.status.slice(1)
                  }
                </span>
                <span style="background: ${
                  isActive ? "#22c55e" : isMaintenance ? "#f59e0b" : "#ef4444"
                }; 
                             color: white; padding: 4px 8px; border-radius: 12px; font-size: 11px; font-weight: 600;">
                  ${screen.size.toUpperCase()} • ${screen.type.toUpperCase()}
                </span>
              </div>
            </div>
            
            ${
              screen.impressions
                ? `
              <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-top: 12px;">
                <div style="text-align: center; padding: 8px; background: #f3f4f6; border-radius: 6px;">
                  <div style="font-size: 18px; font-weight: 700; color: #1f2937;">
                    ${screen.impressions.toLocaleString()}
                  </div>
                  <div style="font-size: 11px; color: #6b7280; font-weight: 500;">IMPRESSIONS</div>
                </div>
                <div style="text-align: center; padding: 8px; background: #f3f4f6; border-radius: 6px;">
                  <div style="font-size: 18px; font-weight: 700; color: #059669;">
                    ₹${(screen.revenue || 0).toLocaleString()}
                  </div>
                  <div style="font-size: 11px; color: #6b7280; font-weight: 500;">REVENUE</div>
                </div>
              </div>
            `
                : ""
            }
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
        onScreenSelect(screen);

        // Enhanced click animation
        if (isActive) {
          marker.setAnimation((window.google.maps as any).Animation.BOUNCE);
          setTimeout(() => marker.setAnimation(null), 2100);
        }
      });

      // Hover effects
      marker.addListener("mouseover", () => {
        marker.setZIndex(2000);
      });

      marker.addListener("mouseout", () => {
        marker.setZIndex(isActive ? 1000 : 500);
      });

      markersRef.current.push(marker);
    });
  };

  return (
    <div className="relative">
      <div
        ref={mapRef}
        className="w-full h-96 rounded-xl overflow-hidden shadow-lg"
      />

      {/* Enhanced Map Legend */}
      <motion.div
        className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm rounded-lg shadow-lg p-3 z-10"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.5 }}
      >
        <h4 className="font-semibold text-sm text-gray-800 mb-2 flex items-center">
          <Tv className="w-4 h-4 mr-2" />
          Screen Status
        </h4>
        <div className="space-y-1 text-xs">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-green-500 rounded flex items-center justify-center animate-pulse">
              <Play className="w-2 h-2 text-white" />
            </div>
            <span className="font-medium">Active & Broadcasting</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-red-500 rounded flex items-center justify-center">
              <Pause className="w-2 h-2 text-white" />
            </div>
            <span>Inactive</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 bg-yellow-500 rounded flex items-center justify-center">
              <Settings className="w-2 h-2 text-white" />
            </div>
            <span>Under Maintenance</span>
          </div>
        </div>
      </motion.div>

      {/* Zoom Controls */}
      <div className="absolute top-4 right-4 bg-white rounded-lg shadow-lg p-1 z-10">
        <motion.button
          onClick={() =>
            mapInstance.current?.setZoom(mapInstance.current.getZoom() + 1)
          }
          className="p-2 hover:bg-gray-100 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M12 4v16m8-8H4"
            />
          </svg>
        </motion.button>
        <motion.button
          onClick={() =>
            mapInstance.current?.setZoom(mapInstance.current.getZoom() - 1)
          }
          className="p-2 hover:bg-gray-100 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <svg
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 12H4"
            />
          </svg>
        </motion.button>
      </div>
    </div>
  );
};

const LocationManager: React.FC<LocationManagerProps> = ({
  isOpen,
  onClose,
  onLocationSelect,
}) => {
  const [activeTab, setActiveTab] = useState<
    "map" | "locations" | "history" | "settings" | "aws"
  >("map");
  const [userLocations, setUserLocations] = useState<LocationData[]>([]);
  const [primaryLocation, setPrimaryLocation] = useState<LocationData | null>(
    null
  );
  const [locationHistory, setLocationHistory] = useState<LocationHistory[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [stats, setStats] = useState<any>(null);

  // Enhanced map state
  const [selectedScreen, setSelectedScreen] = useState<ScreenMarker | null>(
    null
  );
  const [showScreens, setShowScreens] = useState(true);
  const [mapZoom, setMapZoom] = useState(5);
  const [mapCenter, setMapCenter] = useState({ lat: 20.5937, lng: 78.9629 });
  const [showStatsPanel, setShowStatsPanel] = useState(false);
  const [statsAnimating, setStatsAnimating] = useState(false);

  // AWS Integration State
  const [awsConfigured, setAwsConfigured] = useState(false);
  const [realTimeMetrics, setRealTimeMetrics] = useState<ScreenMetrics[]>([]);
  const [dashboardStats, setDashboardStats] = useState<any>(null);
  const [isLoadingMetrics, setIsLoadingMetrics] = useState(false);

  const mapRef = useRef<HTMLDivElement>(null);
  const metricsInterval = useRef<NodeJS.Timeout | null>(null);

  // Check AWS configuration on load
  useEffect(() => {
    const checkAWSConfig = () => {
      const hasCredentials =
        localStorage.getItem("aws_access_key_id") &&
        localStorage.getItem("aws_secret_access_key");
      if (hasCredentials) {
        const credentials = {
          accessKeyId: localStorage.getItem("aws_access_key_id")!,
          secretAccessKey: localStorage.getItem("aws_secret_access_key")!,
          region: localStorage.getItem("aws_region") || "us-east-1",
        };
        awsCloudWatchService.setCredentials(credentials);
        setAwsConfigured(true);
        startRealTimeMetrics();
      }
    };

    if (isOpen) {
      checkAWSConfig();
    }

    return () => {
      if (metricsInterval.current) {
        clearInterval(metricsInterval.current);
      }
    };
  }, [isOpen]);

  // Start real-time metrics polling
  const startRealTimeMetrics = async () => {
    const fetchMetrics = async () => {
      if (!awsConfigured) return;

      setIsLoadingMetrics(true);
      try {
        // Fetch dashboard stats
        const dashStats = await awsCloudWatchService.getDashboardStats();
        setDashboardStats(dashStats);

        // Fetch individual screen metrics
        const screenIds = sampleScreens.map(
          (screen: ScreenMarker) => screen.id
        );
        const metrics = await Promise.all(
          screenIds.map((id: number) =>
            awsCloudWatchService.getScreenMetrics(id)
          )
        );
        setRealTimeMetrics(metrics);
      } catch (error) {
        console.warn("Failed to fetch real-time metrics:", error);
      } finally {
        setIsLoadingMetrics(false);
      }
    };

    // Initial fetch
    await fetchMetrics();

    // Set up polling every 30 seconds
    metricsInterval.current = setInterval(fetchMetrics, 30000);
  };

  // Handle AWS configuration completion
  const handleAWSConfigured = () => {
    setAwsConfigured(true);
    startRealTimeMetrics();
  };

  // Enhanced screen selection with animation
  const handleScreenSelect = (screen: ScreenMarker | null) => {
    if (!screen) return;

    setStatsAnimating(true);
    setSelectedScreen(screen);
    setShowStatsPanel(true);

    // Animate to the selected screen on map
    setMapCenter(screen.position);
    setMapZoom(12);

    // Reset animation flag after animation completes
    setTimeout(() => setStatsAnimating(false), 500);
  };

  // Toggle stats panel
  const toggleStatsPanel = () => {
    if (showStatsPanel) {
      setStatsAnimating(true);
      setTimeout(() => {
        setShowStatsPanel(false);
        setSelectedScreen(null);
        setStatsAnimating(false);
      }, 300);
    } else {
      setShowStatsPanel(true);
    }
  };

  // Reset map view to India center
  const resetMapView = () => {
    setMapCenter({ lat: 20.5937, lng: 78.9629 });
    setMapZoom(5);
    setSelectedScreen(null);
    setShowStatsPanel(false);
  };

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
    { id: "aws", label: "AWS Analytics", icon: Cloud },
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
            {/* Map View Tab */}
            {activeTab === "map" && (
              <div className="space-y-6">
                {/* Enhanced Map Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <motion.button
                      onClick={() => setShowScreens(!showScreens)}
                      className={`flex items-center space-x-2 px-4 py-2 rounded-lg transition-all ${
                        showScreens
                          ? "bg-blue-100 text-blue-700 border-2 border-blue-200"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Tv className="w-4 h-4" />
                      <span>TV Screens</span>
                      {showScreens ? (
                        <Eye className="w-3 h-3" />
                      ) : (
                        <EyeOff className="w-3 h-3" />
                      )}
                    </motion.button>

                    <motion.button
                      onClick={resetMapView}
                      className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-600 rounded-lg hover:bg-gray-200 transition-all"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Navigation className="w-4 h-4" />
                      <span>Reset View</span>
                    </motion.button>

                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                        <span>
                          Active:{" "}
                          {
                            sampleScreens.filter((s) => s.status === "active")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                        <span>
                          Inactive:{" "}
                          {
                            sampleScreens.filter((s) => s.status === "inactive")
                              .length
                          }
                        </span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span>
                          Maintenance:{" "}
                          {
                            sampleScreens.filter(
                              (s) => s.status === "maintenance"
                            ).length
                          }
                        </span>
                      </div>
                    </div>
                  </div>

                  <motion.button
                    onClick={updateCurrentLocation}
                    disabled={isLoading}
                    className="flex items-center space-x-2 px-4 py-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all disabled:opacity-50"
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

                {/* Interactive Map with Floating Info Panel */}
                <div className="relative">
                  <EnhancedScreenMap
                    screens={sampleScreens}
                    showScreens={showScreens}
                    center={mapCenter}
                    zoom={mapZoom}
                    onScreenSelect={handleScreenSelect}
                    onLocationSelect={(lat: number, lng: number) => {
                      setMapCenter({ lat, lng });
                      if (onLocationSelect) {
                        const locationData: LocationData = {
                          id: Date.now(),
                          latitude: lat,
                          longitude: lng,
                          city: "Unknown",
                          state: "Unknown",
                          country: "India",
                          accuracy: 10,
                          formatted_address: `${lat.toFixed(4)}, ${lng.toFixed(
                            4
                          )}`,
                          is_primary: false,
                        };
                        onLocationSelect(locationData);
                      }
                    }}
                  />

                  {/* Floating Screen Info Panel */}
                  <AnimatePresence>
                    {selectedScreen && (
                      <motion.div
                        className="absolute top-4 right-4 bg-white/95 backdrop-blur-md rounded-xl shadow-2xl border border-white/20 p-4 max-w-sm z-20"
                        initial={{ opacity: 0, scale: 0.9, x: 50 }}
                        animate={{ opacity: 1, scale: 1, x: 0 }}
                        exit={{ opacity: 0, scale: 0.9, x: 50 }}
                        transition={{
                          type: "spring",
                          stiffness: 300,
                          damping: 30,
                        }}
                      >
                        <div className="flex items-start justify-between mb-3">
                          <div className="flex items-center space-x-2">
                            <div
                              className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                                selectedScreen.status === "active"
                                  ? "bg-green-500"
                                  : selectedScreen.status === "maintenance"
                                  ? "bg-yellow-500"
                                  : "bg-red-500"
                              }`}
                            >
                              <Tv className="w-4 h-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-gray-900 text-sm">
                                {selectedScreen.name}
                              </h4>
                              <p className="text-xs text-gray-600 flex items-center">
                                <MapPin className="w-3 h-3 mr-1" />
                                {selectedScreen.city}
                              </p>
                            </div>
                          </div>
                          <button
                            onClick={() => setSelectedScreen(null)}
                            className="w-6 h-6 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
                          >
                            <X className="w-3 h-3 text-gray-600" />
                          </button>
                        </div>

                        <div className="space-y-3">
                          <div className="grid grid-cols-2 gap-2">
                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold text-gray-900">
                                {selectedScreen.impressions?.toLocaleString() ||
                                  "0"}
                              </div>
                              <div className="text-xs text-gray-600">
                                Impressions
                              </div>
                            </div>
                            <div className="text-center p-2 bg-gray-50 rounded-lg">
                              <div className="text-lg font-bold text-green-600">
                                ₹
                                {selectedScreen.revenue?.toLocaleString() ||
                                  "0"}
                              </div>
                              <div className="text-xs text-gray-600">
                                Revenue
                              </div>
                            </div>
                          </div>

                          <div className="flex justify-between items-center text-xs">
                            <span
                              className={`px-2 py-1 rounded-full capitalize font-medium ${
                                selectedScreen.status === "active"
                                  ? "bg-green-100 text-green-800"
                                  : selectedScreen.status === "maintenance"
                                  ? "bg-yellow-100 text-yellow-800"
                                  : "bg-red-100 text-red-800"
                              }`}
                            >
                              {selectedScreen.status}
                            </span>
                            <span className="text-gray-600">
                              {selectedScreen.size.toUpperCase()} •{" "}
                              {selectedScreen.type.toUpperCase()}
                            </span>
                          </div>

                          <motion.button
                            className="w-full bg-gradient-to-r from-blue-600 to-purple-600 text-white py-2 px-3 rounded-lg text-sm font-medium hover:from-blue-700 hover:to-purple-700 transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setShowStatsPanel(true)}
                          >
                            View Detailed Stats
                          </motion.button>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Interactive Stats Panel */}
                <AnimatePresence>
                  {showStatsPanel && selectedScreen && (
                    <motion.div
                      className="fixed inset-0 z-50 flex items-center justify-center p-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                      onClick={toggleStatsPanel}
                    >
                      <motion.div
                        className="bg-white rounded-2xl shadow-2xl border border-gray-200 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                        initial={{ scale: 0.7, opacity: 0, y: 50 }}
                        animate={{
                          scale: 1,
                          opacity: 1,
                          y: 0,
                          transition: {
                            type: "spring",
                            stiffness: 300,
                            damping: 30,
                          },
                        }}
                        exit={{
                          scale: 0.7,
                          opacity: 0,
                          y: 50,
                          transition: { duration: 0.2 },
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Header */}
                        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6 rounded-t-2xl">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <div
                                className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                                  selectedScreen.status === "active"
                                    ? "bg-green-500"
                                    : selectedScreen.status === "maintenance"
                                    ? "bg-yellow-500"
                                    : "bg-red-500"
                                }`}
                              >
                                <Tv className="w-6 h-6 text-white" />
                              </div>
                              <div>
                                <h3 className="text-xl font-bold">
                                  {selectedScreen.name}
                                </h3>
                                <p className="text-blue-100 flex items-center">
                                  <MapPin className="w-4 h-4 mr-1" />
                                  {selectedScreen.city} • {selectedScreen.type}{" "}
                                  • {selectedScreen.size}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={toggleStatsPanel}
                              className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center hover:bg-white/30 transition-colors"
                            >
                              <X className="w-4 h-4" />
                            </button>
                          </div>
                        </div>

                        {/* Stats Grid */}
                        <div className="p-6 space-y-6">
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                            <motion.div
                              className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-xl text-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.1 }}
                            >
                              <div className="w-8 h-8 bg-green-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <Activity className="w-4 h-4 text-white" />
                              </div>
                              <div className="text-sm font-medium text-green-700">
                                Status
                              </div>
                              <div
                                className={`text-lg font-bold capitalize ${
                                  selectedScreen.status === "active"
                                    ? "text-green-800"
                                    : selectedScreen.status === "maintenance"
                                    ? "text-yellow-800"
                                    : "text-red-800"
                                }`}
                              >
                                {selectedScreen.status}
                              </div>
                            </motion.div>

                            <motion.div
                              className="bg-gradient-to-br from-blue-50 to-blue-100 p-4 rounded-xl text-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.2 }}
                            >
                              <div className="w-8 h-8 bg-blue-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <Eye className="w-4 h-4 text-white" />
                              </div>
                              <div className="text-sm font-medium text-blue-700">
                                Impressions
                              </div>
                              <div className="text-lg font-bold text-blue-800">
                                {selectedScreen.impressions?.toLocaleString() ||
                                  "0"}
                              </div>
                            </motion.div>

                            <motion.div
                              className="bg-gradient-to-br from-purple-50 to-purple-100 p-4 rounded-xl text-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="w-8 h-8 bg-purple-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <TrendingUp className="w-4 h-4 text-white" />
                              </div>
                              <div className="text-sm font-medium text-purple-700">
                                Revenue
                              </div>
                              <div className="text-lg font-bold text-purple-800">
                                ₹
                                {selectedScreen.revenue?.toLocaleString() ||
                                  "0"}
                              </div>
                            </motion.div>

                            <motion.div
                              className="bg-gradient-to-br from-orange-50 to-orange-100 p-4 rounded-xl text-center"
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ delay: 0.4 }}
                            >
                              <div className="w-8 h-8 bg-orange-500 rounded-lg mx-auto mb-2 flex items-center justify-center">
                                <BarChart3 className="w-4 h-4 text-white" />
                              </div>
                              <div className="text-sm font-medium text-orange-700">
                                Efficiency
                              </div>
                              <div className="text-lg font-bold text-orange-800">
                                {selectedScreen.status === "active"
                                  ? "98%"
                                  : "0%"}
                              </div>
                            </motion.div>
                          </div>

                          {/* Performance Chart Placeholder */}
                          <motion.div
                            className="bg-gradient-to-br from-gray-50 to-gray-100 p-6 rounded-xl"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.5 }}
                          >
                            <h4 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                              <Activity className="w-5 h-5 mr-2" />
                              Performance Metrics
                            </h4>
                            <div className="h-32 bg-white rounded-lg border-2 border-dashed border-gray-300 flex items-center justify-center">
                              <div className="text-center text-gray-500">
                                <BarChart3 className="w-8 h-8 mx-auto mb-2" />
                                <p>Performance chart coming soon</p>
                              </div>
                            </div>
                          </motion.div>

                          {/* Action Buttons */}
                          <motion.div
                            className="flex space-x-3"
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.6 }}
                          >
                            <button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-3 px-4 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-medium">
                              View Details
                            </button>
                            <button className="flex-1 bg-gray-100 text-gray-700 py-3 px-4 rounded-lg hover:bg-gray-200 transition-colors font-medium">
                              Edit Screen
                            </button>
                          </motion.div>
                        </div>
                      </motion.div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Quick Stats Summary with Enhanced Animations */}
                {showScreens && !selectedScreen && (
                  <motion.div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ staggerChildren: 0.1 }}
                  >
                    <motion.div
                      className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl border border-green-200 cursor-pointer group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.02, rotate: 0.5 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: -50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.1 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-green-400/10 to-green-600/10 transform -skew-y-6 group-hover:skew-y-6 transition-transform duration-500"></div>
                      <div className="relative flex items-center space-x-3">
                        <motion.div
                          className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center"
                          animate={{
                            boxShadow: [
                              "0 0 0 0 rgba(34, 197, 94, 0.4)",
                              "0 0 0 10px rgba(34, 197, 94, 0)",
                              "0 0 0 0 rgba(34, 197, 94, 0)",
                            ],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <Play className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-green-700 text-lg">
                            Active Screens
                          </h4>
                          <motion.p
                            className="text-3xl font-bold text-green-800"
                            animate={{ scale: [1, 1.05, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            {
                              sampleScreens.filter((s) => s.status === "active")
                                .length
                            }
                          </motion.p>
                          <p className="text-sm text-green-600">
                            Click screen markers for details
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl border border-blue-200 cursor-pointer group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.02, rotate: -0.5 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, y: 50 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: 0.2 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-l from-blue-400/10 to-blue-600/10 transform skew-x-6 group-hover:-skew-x-6 transition-transform duration-500"></div>
                      <div className="relative flex items-center space-x-3">
                        <motion.div
                          className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center"
                          animate={{
                            rotate: [0, 360],
                          }}
                          transition={{
                            duration: 8,
                            repeat: Infinity,
                            ease: "linear",
                          }}
                        >
                          <Eye className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-blue-700 text-lg">
                            Total Impressions
                          </h4>
                          <motion.p
                            className="text-3xl font-bold text-blue-800"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: 0.5 }}
                          >
                            {sampleScreens
                              .reduce((sum, s) => sum + (s.impressions || 0), 0)
                              .toLocaleString()}
                          </motion.p>
                          <p className="text-sm text-blue-600">
                            Across all screens
                          </p>
                        </div>
                      </div>
                    </motion.div>

                    <motion.div
                      className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl border border-purple-200 cursor-pointer group hover:shadow-lg transition-all duration-300 relative overflow-hidden"
                      whileHover={{ scale: 1.02, rotate: 0.5 }}
                      whileTap={{ scale: 0.98 }}
                      initial={{ opacity: 0, x: 50 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.3 }}
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-purple-400/10 to-purple-600/10 transform -skew-x-6 group-hover:skew-x-6 transition-transform duration-500"></div>
                      <div className="relative flex items-center space-x-3">
                        <motion.div
                          className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center"
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{ duration: 2, repeat: Infinity }}
                        >
                          <TrendingUp className="w-6 h-6 text-white" />
                        </motion.div>
                        <div>
                          <h4 className="font-semibold text-purple-700 text-lg">
                            Total Revenue
                          </h4>
                          <motion.p
                            className="text-3xl font-bold text-purple-800"
                            animate={{
                              backgroundImage: [
                                "linear-gradient(45deg, #7c3aed, #a855f7)",
                                "linear-gradient(45deg, #a855f7, #c084fc)",
                                "linear-gradient(45deg, #7c3aed, #a855f7)",
                              ],
                            }}
                            transition={{ duration: 3, repeat: Infinity }}
                          >
                            ₹
                            {sampleScreens
                              .reduce((sum, s) => sum + (s.revenue || 0), 0)
                              .toLocaleString()}
                          </motion.p>
                          <p className="text-sm text-purple-600">
                            Monthly earnings
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  </motion.div>
                )}
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

            {/* AWS Analytics Tab */}
            {activeTab === "aws" && (
              <div className="space-y-6">
                {!awsConfigured ? (
                  <AWSCredentialsForm onConfigured={handleAWSConfigured} />
                ) : (
                  <div className="space-y-6">
                    {/* AWS Connection Status */}
                    <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                        <div>
                          <h3 className="text-lg font-semibold text-green-900">
                            AWS CloudWatch Connected
                          </h3>
                          <p className="text-green-700 flex items-center">
                            <Wifi className="h-4 w-4 mr-1" />
                            Real-time statistics active
                            {isLoadingMetrics && (
                              <span className="ml-2 flex items-center">
                                <div className="animate-spin rounded-full h-3 w-3 border-2 border-green-600 border-t-transparent"></div>
                                <span className="ml-1 text-sm">
                                  Updating...
                                </span>
                              </span>
                            )}
                          </p>
                        </div>
                      </div>
                    </div>

                    {/* Real-time Dashboard Stats - Interactive Summary */}
                    {dashboardStats && (
                      <div className="space-y-6">
                        {/* Main Stats Grid */}
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                          <motion.div
                            className="bg-gradient-to-br from-blue-50 to-blue-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              console.log("Active Screens clicked");
                            }}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <Activity className="w-8 h-8 text-blue-600" />
                              <h4 className="text-sm font-medium text-blue-900">
                                Active Screens
                              </h4>
                            </div>
                            <div className="text-2xl font-bold text-blue-900">
                              {dashboardStats.activeScreens}
                            </div>
                            <div className="text-sm text-blue-600 flex items-center justify-between">
                              <span>Broadcasting live</span>
                              <span className="text-xs bg-blue-200 px-2 py-1 rounded-full">
                                Click for details
                              </span>
                            </div>
                          </motion.div>

                          <motion.div
                            className="bg-gradient-to-br from-green-50 to-green-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              console.log("Total Impressions clicked");
                            }}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <Eye className="w-8 h-8 text-green-600" />
                              <h4 className="text-sm font-medium text-green-900">
                                Total Impressions
                              </h4>
                            </div>
                            <div className="text-2xl font-bold text-green-900">
                              {dashboardStats.totalImpressions?.toLocaleString()}
                            </div>
                            <div className="text-sm text-green-600 flex items-center justify-between">
                              <span>Last 24 hours</span>
                              <span className="text-xs bg-green-200 px-2 py-1 rounded-full">
                                Click for details
                              </span>
                            </div>
                          </motion.div>

                          <motion.div
                            className="bg-gradient-to-br from-purple-50 to-purple-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              console.log("Total Views clicked");
                            }}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <Users className="w-8 h-8 text-purple-600" />
                              <h4 className="text-sm font-medium text-purple-900">
                                Total Views
                              </h4>
                            </div>
                            <div className="text-2xl font-bold text-purple-900">
                              {dashboardStats.totalViews?.toLocaleString()}
                            </div>
                            <div className="text-sm text-purple-600 flex items-center justify-between">
                              <span>Engagement metric</span>
                              <span className="text-xs bg-purple-200 px-2 py-1 rounded-full">
                                Click for details
                              </span>
                            </div>
                          </motion.div>

                          <motion.div
                            className="bg-gradient-to-br from-orange-50 to-orange-100 p-6 rounded-xl cursor-pointer hover:shadow-lg transition-all"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              console.log("Average CTR clicked");
                            }}
                          >
                            <div className="flex items-center space-x-3 mb-2">
                              <BarChart3 className="w-8 h-8 text-orange-600" />
                              <h4 className="text-sm font-medium text-orange-900">
                                Avg CTR
                              </h4>
                            </div>
                            <div className="text-2xl font-bold text-orange-900">
                              {dashboardStats.averageCTR?.toFixed(2)}%
                            </div>
                            <div className="text-sm text-orange-600 flex items-center justify-between">
                              <span>Click-through rate</span>
                              <span className="text-xs bg-orange-200 px-2 py-1 rounded-full">
                                Click for details
                              </span>
                            </div>
                          </motion.div>
                        </div>

                        {/* Quick Actions */}
                        <div className="bg-white border border-gray-200 rounded-xl p-6">
                          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                            <Zap className="w-5 h-5 mr-2" />
                            Quick Actions
                          </h3>
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                            <motion.button
                              className="p-3 bg-blue-50 hover:bg-blue-100 rounded-lg text-blue-700 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Monitor className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-sm font-medium">
                                Manage Screens
                              </span>
                            </motion.button>

                            <motion.button
                              className="p-3 bg-green-50 hover:bg-green-100 rounded-lg text-green-700 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <BarChart3 className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-sm font-medium">
                                View Reports
                              </span>
                            </motion.button>

                            <motion.button
                              className="p-3 bg-purple-50 hover:bg-purple-100 rounded-lg text-purple-700 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <Settings className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-sm font-medium">
                                Settings
                              </span>
                            </motion.button>

                            <motion.button
                              className="p-3 bg-orange-50 hover:bg-orange-100 rounded-lg text-orange-700 transition-colors"
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                            >
                              <RefreshCw className="w-5 h-5 mx-auto mb-1" />
                              <span className="text-sm font-medium">
                                Refresh Data
                              </span>
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Top Performing Screens */}
                    {dashboardStats?.topPerformingScreens && (
                      <div className="bg-white border border-gray-200 rounded-xl p-6">
                        <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                          <TrendingUp className="w-5 h-5 mr-2" />
                          Top Performing Screens
                        </h3>
                        <div className="space-y-3">
                          {dashboardStats.topPerformingScreens.map(
                            (screen: ScreenMetrics, index: number) => (
                              <motion.div
                                key={screen.screenId}
                                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 cursor-pointer transition-colors"
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                transition={{ delay: index * 0.1 }}
                                whileHover={{ scale: 1.01 }}
                                onClick={() =>
                                  console.log(
                                    `Screen ${screen.screenId} clicked`
                                  )
                                }
                              >
                                <div className="flex items-center space-x-3">
                                  <div className="flex items-center justify-center w-8 h-8 bg-blue-100 rounded-full">
                                    <span className="text-sm font-bold text-blue-600">
                                      #{index + 1}
                                    </span>
                                  </div>
                                  <div>
                                    <div className="font-medium text-gray-900">
                                      Screen #{screen.screenId}
                                    </div>
                                    <div className="text-sm text-gray-500">
                                      Status:{" "}
                                      <span
                                        className={`font-medium ${
                                          screen.status === "active"
                                            ? "text-green-600"
                                            : screen.status === "maintenance"
                                            ? "text-yellow-600"
                                            : "text-red-600"
                                        }`}
                                      >
                                        {screen.status}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-gray-900">
                                    {screen.impressions.toLocaleString()}
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    impressions
                                  </div>
                                </div>
                                <div className="text-right">
                                  <div className="font-bold text-green-600">
                                    {screen.ctr.toFixed(2)}%
                                  </div>
                                  <div className="text-sm text-gray-500">
                                    CTR
                                  </div>
                                </div>
                              </motion.div>
                            )
                          )}
                        </div>
                      </div>
                    )}

                    {/* AWS Settings */}
                    <div className="bg-white border border-gray-200 rounded-xl p-6">
                      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
                        <Cloud className="w-5 h-5 mr-2" />
                        AWS CloudWatch Settings
                      </h3>
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">
                              Auto-refresh metrics
                            </p>
                            <p className="text-sm text-gray-500">
                              Automatically update metrics every 30 seconds
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

                        <div className="pt-4 border-t">
                          <button
                            onClick={() => {
                              localStorage.removeItem("aws_access_key_id");
                              localStorage.removeItem("aws_secret_access_key");
                              localStorage.removeItem("aws_region");
                              setAwsConfigured(false);
                              if (metricsInterval.current) {
                                clearInterval(metricsInterval.current);
                              }
                            }}
                            className="text-red-600 hover:text-red-800 text-sm font-medium"
                          >
                            Disconnect AWS Account
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
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
