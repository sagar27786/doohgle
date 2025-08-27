import React, { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  X,
  Loader2,
  Check,
  CheckCircle,
  Monitor,
  MapPin,
  Play,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CreditCard,
  Smartphone,
} from "lucide-react";
import { searchScreensByCity, ScreenSearchResult } from "../../api/screens";

// ===== Types =====
interface SelectedScreen {
  id: number;
  name: string;
  location: string;
  city?: string;
  latitude?: number | null; // Added latitude
  longitude?: number | null; // Added longitude
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  size: string;
  traffic: number;
  imageUrl?: string;
  // Added fields for detailed view from ScreenSearchResult / assumed defaults
  resolution?: string;
  orientation?: string; // e.g., 'landscape', 'portrait'
  device_type?: string; // e.g., 'smart_tv', 'media_player'
  viewing_distance?: string;
  ad_frequency?: number;
  peak_viewing_hours?: string[];
  assets?: Array<{ asset_type: string; url: string }>;
}

interface Creative {
  id: string;
  type: "video" | "image" | "html5";
  file: File | null;
  preview: string;
  duration?: number;
  isValid: boolean;
}

// ===== Component =====
const CampaignCreationWorkflow: React.FC = () => {
  // Global state
  const [currentStep, setCurrentStep] = useState<number>(1);

  // Handle viewing screen details
  // const onViewDetails = (screen: SelectedScreen) => {
  //   // You can customize this function to show a modal or navigate to a details page
  //   console.log('Viewing details for screen:', screen);
  //   // Example: Show an alert with the screen details
  //   alert(`Screen Details:\nName: ${screen.name}\nLocation: ${screen.location}\nCity: ${screen.city || 'N/A'}\nSize: ${screen.size}\nTraffic: ${screen.traffic.toLocaleString()}/day`);
  // };

  const [selectedScreens, setSelectedScreens] = useState<SelectedScreen[]>([]);
  const [availableScreens, setAvailableScreens] = useState<SelectedScreen[]>(
    []
  );
  const [isLoading, setIsLoading] = useState(false);
  const [showCitySuggestions, setShowCitySuggestions] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [uploadedCreatives, setUploadedCreatives] = useState<Creative[]>([]);

  const [screenInView, setScreenInView] = useState<SelectedScreen | null>(null);

  // Steps metadata
  const steps = useMemo(
    () => [
      {
        number: 1,
        title: "Select Screens",
        description: "Choose your advertising screens",
      },
      {
        number: 2,
        title: "Schedule",
        description: "Select dates and time slots",
      },
      {
        number: 3,
        title: "Upload Creatives",
        description: "Add your advertising content",
      },
      {
        number: 4,
        title: "Budget & Payment",
        description: "Review costs and pay",
      },
      {
        number: 5,
        title: "Confirmation",
        description: "Campaign setup complete",
      },
    ],
    []
  );

  // Helpers
  const calculateBudget = () => {
    const totalDays = selectedDates.length;
    const baseAmount = selectedScreens.reduce(
      (sum, screen) => sum + (screen.pricing?.daily ?? 0),
      0
    );
    return baseAmount * totalDays;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedScreens.length > 0;
      case 2:
        return selectedDates.length > 0;
      case 3:
        return (
          uploadedCreatives.length > 0 &&
          uploadedCreatives.every((c) => c.isValid)
        );
      case 4:
        return true; // payment form can always proceed in this mock
      case 5:
        return true;
      default:
        return false;
    }
  };

  const handleNext = () => {
    if (!canProceed()) return;
    setCurrentStep((prev) => Math.min(5, prev + 1));
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(1, prev - 1));
  };

  // ===== Step 1: Screen Selection =====
  // Modal component for displaying screen details
  interface ScreenDetails {
    resolution?: string;
    orientation?: string;
    device_type?: string;
    viewing_distance?: string;
    ad_frequency?: number;
    peak_viewing_hours?: string[];
    assets?: Array<{ asset_type: string; url: string }>;
  }

  interface ScreenDetailsModalProps {
    screen: SelectedScreen | null;
    onClose: () => void;
    onSelectScreen: (screen: SelectedScreen) => void;
  }

  const ScreenDetailsModal: React.FC<ScreenDetailsModalProps> = ({
    screen: initialScreen,
    onClose,
    onSelectScreen,
  }) => {
    const [screen, setScreen] = useState<SelectedScreen | null>(initialScreen);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [fullDetails, setFullDetails] = useState<ScreenDetails | null>(null);

    useEffect(() => {
      // Set initial screen and full details from the prop
      setScreen(initialScreen);
      if (initialScreen) {
        // Map relevant fields from SelectedScreen to ScreenDetails for consistency
        setFullDetails({
          resolution: initialScreen.resolution,
          orientation: initialScreen.orientation,
          device_type: initialScreen.device_type,
          viewing_distance: initialScreen.viewing_distance,
          ad_frequency: initialScreen.ad_frequency,
          peak_viewing_hours: initialScreen.peak_viewing_hours,
          assets: initialScreen.assets,
        });
      }
      setIsLoading(false);
      setError(null);
    }, [initialScreen]);

    if (!screen) return null;

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
          <div className="p-6">
            {/* Header */}
            <div className="flex justify-between items-start mb-6">
              <div>
                <h3 className="text-2xl font-bold text-gray-900">
                  {screen.name}
                </h3>
                <div className="flex items-center text-sm text-gray-600 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>
                    {[screen.location, screen.city].filter(Boolean).join(", ")}
                  </span>
                </div>
              </div>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-gray-600 p-1 -mr-2"
                disabled={isLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>

            {isLoading && (
              <div className="flex justify-center items-center py-8">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-gray-600">Loading details...</span>
              </div>
            )}

            {error && (
              <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                <div className="flex">
                  <div className="flex-shrink-0">
                    <AlertCircle className="h-5 w-5 text-yellow-400" />
                  </div>
                  <div className="ml-3">
                    <p className="text-sm text-yellow-700">{error}</p>
                  </div>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Left Column - Basic Info */}
              <div className="md:col-span-2 space-y-6">
                {/* Screen Image */}
                {fullDetails?.assets?.find(
                  (a: any) => a.asset_type === "photo_day"
                )?.url ? (
                  <div className="bg-gray-100 rounded-lg overflow-hidden">
                    <img
                      src={
                        fullDetails.assets?.find(
                          (a: any) => a.asset_type === "photo_day"
                        )?.url
                      }
                      alt={`${screen.name} - Screen Preview`}
                      className="w-full h-48 object-cover"
                    />
                  </div>
                ) : (
                  <div className="bg-gray-100 rounded-lg h-48 flex items-center justify-center">
                    <Monitor className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                {/* Detailed Information */}
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-3">
                    Screen Specifications
                  </h4>
                  <div className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <p className="text-gray-500">Screen ID</p>
                      <p className="font-medium">#{screen?.id || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Screen Size</p>
                      <p className="font-medium">{screen?.size || "N/A"}</p>
                    </div>
                    <div>
                      <p className="text-gray-500">Latitude</p>
                      <p className="font-medium">
                        {screen?.latitude?.toFixed(4) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Longitude</p>
                      <p className="font-medium">
                        {screen?.longitude?.toFixed(4) || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Resolution</p>
                      <p className="font-medium">
                        {fullDetails?.resolution || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Orientation</p>
                      <p className="font-medium capitalize">
                        {fullDetails?.orientation || "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Device Type</p>
                      <p className="font-medium">
                        {fullDetails?.device_type
                          ? fullDetails.device_type
                              .split("_")
                              .map(
                                (word: string) =>
                                  word.charAt(0).toUpperCase() + word.slice(1)
                              )
                              .join(" ")
                          : "N/A"}
                      </p>
                    </div>
                    <div>
                      <p className="text-gray-500">Viewing Distance</p>
                      <p className="font-medium">
                        {fullDetails?.viewing_distance || "N/A"}
                      </p>
                    </div>
                    {fullDetails?.peak_viewing_hours &&
                      fullDetails.peak_viewing_hours.length > 0 && (
                        <div className="col-span-2">
                          <p className="text-gray-500">Peak Viewing Hours</p>
                          <div className="flex flex-wrap gap-2 mt-1">
                            {fullDetails.peak_viewing_hours.map(
                              (hour: string, i: number) => (
                                <span
                                  key={i}
                                  className="px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs"
                                >
                                  {hour}
                                </span>
                              )
                            )}
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>

            {/* Screen Preview */}
            {screen.imageUrl && (
              <div className="mt-4">
                <h4 className="font-medium text-gray-900 mb-2">
                  Screen Preview
                </h4>
                <img
                  src={screen.imageUrl}
                  alt={`${screen.name} preview`}
                  className="w-full h-48 object-cover rounded-md"
                />
              </div>
            )}
          </div>

          <div className="p-6 border-t border-gray-200">
            <div className="flex justify-end space-x-3">
              <button
                onClick={onClose}
                className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50"
              >
                Close
              </button>
              <button
                onClick={() => {
                  if (screen) {
                    onSelectScreen(screen);
                    onClose();
                  }
                }}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                disabled={isLoading}
              >
                {isLoading ? "Selecting..." : "Select This Screen"}
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  };

  interface ScreenSelectionStepProps {
    // onViewDetails: (screen: SelectedScreen) => void;
  }

  const ScreenSelectionStep: React.FC<ScreenSelectionStepProps> = (
    {
      /* onViewDetails */
    }
  ) => {
    // Major Indian cities for quick suggestions
    const cities = [
      "Mumbai",
      "Delhi",
      "Bangalore",
      "Hyderabad",
      "Ahmedabad",
      "Chennai",
      "Kolkata",
      "Pune",
      "Jaipur",
      "Surat",
    ];

    const mapToSelected = (s: ScreenSearchResult): SelectedScreen => {
      // Best-effort mapping from API to UI model (with safe fallbacks)
      const cost10 = (s as any).cost_per_10_seconds as number | undefined;
      const hourly = cost10 ? cost10 * 360 : 1000; // 10s unit -> 1 hour (360 * 10 sec)
      const daily = cost10 ? cost10 * 360 * 8 : 5000; // 8 hours/day default
      const weekly = daily * 7;

      const width = (s as any).screen_size_width as number | undefined;
      const height = (s as any).screen_size_height as number | undefined;

      return {
        id: (s as any).id ?? Math.floor(Math.random() * 1_000_000),
        name: (s as any).name || "Unnamed Screen",
        location:
          (s as any).location_name ||
          (s as any).address ||
          "Location not specified",
        city: (s as any).city || "Unknown City",
        pricing: { hourly, daily, weekly },
        size:
          width && height
            ? `${width}x${height}`
            : (s as any).resolution || "N/A",
        traffic: (s as any).daily_footfall || 0,
        imageUrl: (s as any).image_url || undefined,
        // Map new fields
        resolution:
          s.resolution_width && s.resolution_height
            ? `${s.resolution_width}x${s.resolution_height}`
            : (s as any).resolution || "N/A",
        orientation: (s as any).orientation || "N/A",
        device_type: (s as any).device_type || "N/A",
        viewing_distance: (s as any).viewing_distance || "N/A",
        ad_frequency: (s as any).daily_footfall || 0, // Using daily_footfall as a proxy for ad_frequency
        peak_viewing_hours: Array.isArray((s as any).peak_hours)
          ? (s as any).peak_hours
          : typeof (s as any).peak_hours === "string"
          ? (s as any).peak_hours.split(", ")
          : [],
        assets: s.image_url
          ? [{ asset_type: "photo_day", url: s.image_url }]
          : [],
        latitude:
          typeof s.latitude === "string"
            ? parseFloat(s.latitude)
            : s.latitude || null, // Ensure latitude is a number
        longitude:
          typeof s.longitude === "string"
            ? parseFloat(s.longitude)
            : s.longitude || null, // Ensure longitude is a number
      };
    };

    const handleSearch = async (city: string) => {
      if (!city.trim()) return;
      setError(null);
      setIsLoading(true);
      setShowCitySuggestions(false); // Hide suggestions when search is triggered
      try {
        const results = await searchScreensByCity(city);
        const formatted = results.map(mapToSelected);
        setAvailableScreens(formatted);
      } catch (err) {
        console.error("Error fetching screens:", err);
        setError("Failed to fetch screens. Please try again.");
        setAvailableScreens([]);
      } finally {
        setIsLoading(false);
      }
    };

    // Handle city selection from dropdown
    const handleCitySelect = (city: string) => {
      setSearchQuery(city);
      setShowCitySuggestions(false);
      handleSearch(city);
    };

    // Handle input focus
    const handleInputFocus = () => {
      if (searchQuery) {
        setShowCitySuggestions(true);
      }
    };

    const toggleScreenSelection = (screen: SelectedScreen) => {
      setSelectedScreens((prev) => {
        const isSelected = prev.some((s) => s.id === screen.id);
        return isSelected
          ? prev.filter((s) => s.id !== screen.id)
          : [...prev, screen];
      });
    };

    const isScreenSelected = (screenId: number) =>
      selectedScreens.some((s) => s.id === screenId);

    // Load initial screens on component mount
    useEffect(() => {
      const loadInitialScreens = async () => {
        if (availableScreens.length === 0) {
          setIsLoading(true);
          try {
            // Load screens from popular cities
            const popularCities = ["Mumbai", "Delhi"];
            const allScreens: SelectedScreen[] = [];

            for (const city of popularCities) {
              try {
                const results = await searchScreensByCity(city);
                const formatted = results.map(mapToSelected);
                allScreens.push(...formatted);
              } catch (err) {
                console.warn(`Failed to load screens for ${city}:`, err);
              }
            }

            if (allScreens.length > 0) {
              setAvailableScreens(allScreens.slice(0, 12)); // Show max 12 screens initially
            }
          } catch (err) {
            console.error("Error loading initial screens:", err);
            setError("Search for screens by city to get started");
          } finally {
            setIsLoading(false);
          }
        }
      };

      loadInitialScreens();
    }, [availableScreens.length]);

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select Screens
          </h2>
          <p className="text-gray-600">
            Choose the digital screens for your campaign
          </p>
        </div>

        {/* City Search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              setShowCitySuggestions(!!value.trim());
            }}
            onKeyDown={(e) => e.key === "Enter" && handleSearch(searchQuery)}
            onFocus={handleInputFocus}
            placeholder="Search by city..."
            className="w-full pl-10 pr-24 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <button
            onClick={() => handleSearch(searchQuery)}
            disabled={isLoading || !searchQuery.trim()}
            className="absolute right-2 top-1/2 -translate-y-1/2 bg-blue-600 text-white px-4 py-1 rounded-md disabled:opacity-50"
          >
            {isLoading ? "Searching..." : "Search"}
          </button>

          {/* City Suggestions */}
          {showCitySuggestions && searchQuery && !isLoading && (
            <div className="absolute z-10 mt-1 w-full bg-white border rounded-lg shadow-lg max-h-60 overflow-auto">
              {cities
                .filter((c) =>
                  c.toLowerCase().includes(searchQuery.toLowerCase())
                )
                .map((c) => (
                  <div
                    key={c}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => handleCitySelect(c)}
                  >
                    {c}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Loading */}
        {isLoading && (
          <div className="flex justify-center items-center py-12">
            <Loader2 className="h-8 w-8 animate-spin" />
            <span className="ml-2">Loading screens...</span>
          </div>
        )}

        {/* Error */}
        {error && (
          <div className="bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {/* No Results */}
        {!isLoading &&
          !error &&
          availableScreens.length === 0 &&
          searchQuery && (
            <div className="text-center py-12 text-gray-500">
              No screens found in {searchQuery}. Try another city.
            </div>
          )}

        {/* Screen Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 mt-8">
          {availableScreens.map((screen, index) => {
            const cardColors = [
              "from-blue-500 to-indigo-600",
              "from-purple-500 to-pink-600",
              "from-green-500 to-teal-600",
              "from-red-500 to-rose-600",
              "from-yellow-500 to-amber-600",
              "from-indigo-500 to-purple-600",
              "from-pink-500 to-rose-600",
              "from-teal-500 to-cyan-600",
            ];
            const colorClass = cardColors[index % cardColors.length];
            const isSelected = isScreenSelected(screen.id);

            return (
              <motion.div
                key={screen.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                transition={{
                  duration: 0.4,
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{
                  scale: 1.05,
                  y: -10,
                  transition: { duration: 0.2 },
                }}
                whileTap={{ scale: 0.98 }}
                onClick={() => toggleScreenSelection(screen)}
                className={`
                  relative cursor-pointer group
                  w-full aspect-square
                  bg-white rounded-2xl 
                  border-2 transition-all duration-300
                  shadow-lg hover:shadow-2xl
                  ${
                    isSelected
                      ? "border-blue-500 ring-4 ring-blue-200 shadow-blue-200/50"
                      : "border-gray-200 hover:border-gray-300"
                  }
                  overflow-hidden
                `}
              >
                {/* Selection Indicator */}
                <AnimatePresence>
                  {isSelected && (
                    <motion.div
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0, opacity: 0 }}
                      className="absolute top-3 right-3 z-10"
                    >
                      <div className="bg-blue-500 text-white rounded-full p-2 shadow-lg">
                        <CheckCircle className="h-5 w-5" />
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* Screen Image/Gradient */}
                <div className="relative h-2/3 overflow-hidden">
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colorClass} opacity-90`}
                  />
                  {screen.imageUrl ? (
                    <img
                      src={screen.imageUrl}
                      alt={screen.name}
                      className="w-full h-full object-cover mix-blend-overlay"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="text-center text-white">
                        <motion.div
                          whileHover={{ rotate: 360 }}
                          transition={{ duration: 0.6 }}
                        >
                          <Monitor className="h-12 w-12 mx-auto mb-2 drop-shadow-lg" />
                        </motion.div>
                        <p className="text-sm font-semibold drop-shadow">
                          Premium Display
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Floating Elements */}
                  <div className="absolute top-3 left-3">
                    <div className="bg-black/20 backdrop-blur-sm rounded-full px-3 py-1">
                      <span className="text-white text-xs font-medium">
                        #{screen.id}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-4 h-1/3 flex flex-col justify-between">
                  <div>
                    <h3 className="font-bold text-gray-900 text-lg leading-tight mb-1 group-hover:text-blue-600 transition-colors">
                      {screen.name}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500">
                      <MapPin className="h-3 w-3 mr-1" />
                      <span className="truncate">{screen.location}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2 mt-2">
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Size</p>
                      <p className="font-semibold text-gray-900">
                        {screen.size}
                      </p>
                    </div>
                    <div className="text-center">
                      <p className="text-xs text-gray-500">Traffic</p>
                      <p className="font-semibold text-gray-900">
                        {(screen.traffic / 1000).toFixed(0)}K
                      </p>
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" />

                {/* Details Button */}
                <motion.button
                  initial={{ opacity: 0, y: 20 }}
                  whileHover={{ opacity: 1, y: 0 }}
                  onClick={(e) => {
                    e.stopPropagation();
                    setScreenInView(screen);
                  }}
                  className="absolute bottom-4 left-4 right-4 bg-white/90 backdrop-blur-sm text-gray-800 font-medium py-2 px-4 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-white"
                >
                  View Details
                </motion.button>
              </motion.div>
            );
          })}
        </div>

        {/* Selected Summary */}
        {selectedScreens.length > 0 && (
          <div className="mt-8 p-4 bg-blue-50 rounded-lg">
            <h3 className="font-medium text-lg mb-3">
              Selected Screens ({selectedScreens.length})
            </h3>
            <div className="space-y-2">
              {selectedScreens.map((screen) => (
                <div
                  key={screen.id}
                  className="flex justify-between items-center p-2 bg-white rounded"
                >
                  <div>
                    <div className="font-medium">{screen.name}</div>
                    <div className="text-sm text-gray-500">
                      {screen.location}
                    </div>
                  </div>
                  <div className="flex items-center space-x-3">
                    {/* NEW: View Details button */}
                    <button
                      onClick={() => setScreenInView(screen)}
                      className="text-blue-600 hover:text-blue-800 text-sm"
                    >
                      View Details
                    </button>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        toggleScreenSelection(screen);
                      }}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== Step 2: Schedule Selection =====
  const [selectedTimeSlots, setSelectedTimeSlots] = useState<{
    [date: string]: string[];
  }>({});
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const ScheduleSelectionStep: React.FC = () => {
    // Generate calendar days
    const generateCalendarDays = (date: Date) => {
      const year = date.getFullYear();
      const month = date.getMonth();
      const firstDay = new Date(year, month, 1);
      const lastDay = new Date(year, month + 1, 0);
      const firstDayWeek = firstDay.getDay();
      const daysInMonth = lastDay.getDate();
      
      const days = [];
      
      // Add empty cells for days before month starts
      for (let i = 0; i < firstDayWeek; i++) {
        days.push(null);
      }
      
      // Add days of the month
      for (let day = 1; day <= daysInMonth; day++) {
        days.push(new Date(year, month, day));
      }
      
      return days;
    };

    const formatDateKey = (date: Date) => {
      return date.toISOString().split("T")[0];
    };

    const isDateSelected = (date: Date) => {
      return selectedDates.includes(formatDateKey(date));
    };

    const toggleDate = (date: Date) => {
      const dateKey = formatDateKey(date);
      setSelectedDates((prev) =>
        prev.includes(dateKey) 
          ? prev.filter((d) => d !== dateKey) 
          : [...prev, dateKey]
      );
      setSelectedDate(date);
    };

    const navigateMonth = (direction: 'prev' | 'next') => {
      setCurrentMonth(prev => {
        const newDate = new Date(prev);
        if (direction === 'prev') {
          newDate.setMonth(prev.getMonth() - 1);
        } else {
          newDate.setMonth(prev.getMonth() + 1);
        }
        return newDate;
      });
    };

    const goToToday = () => {
      setCurrentMonth(new Date());
    };

    const toggleTimeSlot = (hour: number) => {
      if (!selectedDate) return;
      
      const dateKey = formatDateKey(selectedDate);
      const slotId = `${hour.toString().padStart(2, '0')}:00`;
      
      setSelectedTimeSlots(prev => {
        const dateSlots = prev[dateKey] || [];
        const newDateSlots = dateSlots.includes(slotId)
          ? dateSlots.filter(s => s !== slotId)
          : [...dateSlots, slotId];
        
        return {
          ...prev,
          [dateKey]: newDateSlots
        };
      });
    };

    const calendarDays = generateCalendarDays(currentMonth);
    const monthNames = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December"
    ];
    const weekDays = ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Choose a new date & time
          </h2>
          <p className="text-gray-600">
            Select your campaign dates and time slots
          </p>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl border border-gray-200 overflow-hidden max-w-6xl mx-auto"
        >
          {/* Calendar Header */}
          <div className="bg-gradient-to-r from-purple-500 to-blue-600 p-6 text-white">
            <div className="flex items-center justify-between mb-4">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => navigateMonth('prev')}
                className="p-2 rounded-full hover:bg-white/20 transition-colors"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
              </motion.button>
              
              <div className="text-center">
                <h3 className="text-xl font-semibold">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
              </div>
              
              <div className="flex gap-2">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={goToToday}
                  className="px-4 py-2 bg-white/20 rounded-lg hover:bg-white/30 transition-colors text-sm font-medium"
                >
                  Today
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigateMonth('next')}
                  className="p-2 rounded-full hover:bg-white/20 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </motion.button>
              </div>
            </div>
          </div>

          <div className="flex">
            {/* Calendar Section */}
            <div className="flex-1 p-6">
              {/* Week Header */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-sm font-medium text-gray-500 p-2">
                    {day}
                  </div>
                ))}
              </div>

              {/* Calendar Grid */}
              <div className="grid grid-cols-7 gap-2">
                {calendarDays.map((day, index) => {
                  if (!day) {
                    return <div key={index} className="p-2"></div>;
                  }

                  const isSelected = isDateSelected(day);
                  const isToday = day.toDateString() === new Date().toDateString();
                  const isPast = day < new Date(new Date().setHours(0, 0, 0, 0));

                  return (
                    <motion.button
                      key={day.getDate()}
                      whileHover={{ scale: isPast ? 1 : 1.1 }}
                      whileTap={{ scale: isPast ? 1 : 0.95 }}
                      onClick={() => !isPast && toggleDate(day)}
                      disabled={isPast}
                      className={`
                        relative p-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${isPast 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'cursor-pointer hover:shadow-md'
                        }
                        ${isSelected 
                          ? 'bg-blue-500 text-white shadow-lg ring-2 ring-blue-300' 
                          : isToday 
                            ? 'bg-purple-100 text-purple-700 border-2 border-purple-300'
                            : 'hover:bg-gray-100 text-gray-700'
                        }
                      `}
                    >
                      {day.getDate()}
                      {isToday && (
                        <div className="absolute -top-1 -right-1 w-2 h-2 bg-purple-500 rounded-full"></div>
                      )}
                    </motion.button>
                  );
                })}
              </div>
            </div>

            {/* Time Slots Section */}
            {selectedDate && (
              <motion.div 
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                className="w-80 border-l border-gray-200 p-6 bg-gray-50"
              >
                <div className="mb-6">
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {selectedDate.toLocaleDateString('en-US', { 
                      weekday: 'long',
                      month: 'long', 
                      day: 'numeric' 
                    })}
                  </h4>
                  <p className="text-sm text-gray-600">Select time slots</p>
                </div>

                {/* Time Slots Grid */}
                <div className="space-y-3 max-h-96 overflow-y-auto">
                  {Array.from({ length: 12 }, (_, i) => {
                    const hour = i + 9; // 9 AM to 8 PM
                    const dateKey = formatDateKey(selectedDate);
                    const slotId = `${hour.toString().padStart(2, '0')}:00`;
                    const isSelected = selectedTimeSlots[dateKey]?.includes(slotId);

                    return (
                      <motion.button
                        key={hour}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => toggleTimeSlot(hour)}
                        className={`
                          w-full p-4 rounded-xl border-2 transition-all duration-200 text-left
                          ${isSelected
                            ? 'bg-green-100 border-green-300 shadow-md'
                            : 'bg-white border-gray-200 hover:border-gray-300 hover:shadow-sm'
                          }
                        `}
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-medium">
                            {hour}:00 - {hour + 1}:00
                          </span>
                          {isSelected && (
                            <div className="w-5 h-5 bg-green-500 rounded-full flex items-center justify-center">
                              <Check className="w-3 h-3 text-white" />
                            </div>
                          )}
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                          {hour < 12 ? 'Morning' : hour < 17 ? 'Afternoon' : 'Evening'}
                        </div>
                      </motion.button>
                    );
                  })}
                </div>

                {/* Selected Summary */}
                {selectedTimeSlots[formatDateKey(selectedDate)]?.length > 0 && (
                  <motion.div 
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200"
                  >
                    <h5 className="font-medium text-blue-900 mb-2">
                      Selected ({selectedTimeSlots[formatDateKey(selectedDate)]?.length} hours)
                    </h5>
                    <div className="flex flex-wrap gap-2">
                      {selectedTimeSlots[formatDateKey(selectedDate)]?.slice(0, 3).map((slot) => (
                        <span key={slot} className="px-2 py-1 bg-blue-200 text-blue-800 rounded-md text-sm">
                          {slot}
                        </span>
                      ))}
                      {selectedTimeSlots[formatDateKey(selectedDate)]?.length > 3 && (
                        <span className="text-blue-600 text-sm">
                          +{selectedTimeSlots[formatDateKey(selectedDate)]?.length - 3} more
                        </span>
                      )}
                    </div>
                  </motion.div>
                )}
              </motion.div>
            )}
          </div>
        </motion.div>

        {/* Overall Summary */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="bg-gradient-to-r from-green-50 to-blue-50 border border-green-200 rounded-xl p-6"
        >
          <h4 className="font-semibold text-gray-900 mb-3">Campaign Schedule Summary</h4>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700">
                <strong>{selectedDates.length}</strong> days selected
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700">
                <strong>{Object.values(selectedTimeSlots).flat().length}</strong> time slots
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700">
                <strong>{selectedScreens.length}</strong> screens selected
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    );
  };

  // ===== Step 3: Creative Upload =====
  const CreativeUploadStep: React.FC = () => {
    const validateCreative = (
      type: "video" | "image" | "html5",
      file: File
    ): boolean => {
      if (type === "video")
        return file.type.includes("video") && file.size <= 100 * 1024 * 1024; // 100MB
      if (type === "image")
        return file.type.includes("image") && file.size <= 10 * 1024 * 1024; // 10MB
      return true;
    };

    const handleFileUpload = (
      type: "video" | "image" | "html5",
      file: File
    ) => {
      const creative: Creative = {
        id: Date.now().toString(),
        type,
        file,
        preview: URL.createObjectURL(file),
        isValid: validateCreative(type, file),
      };
      setUploadedCreatives((prev) => [...prev, creative]);
    };

    const removeCreative = (id: string) => {
      setUploadedCreatives((prev) => prev.filter((c) => c.id !== id));
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Creatives
          </h2>
          <p className="text-gray-600">Add your advertising content</p>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Video */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Play size={32} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium mb-2">Video Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              MP4, up to 30 seconds, max 100MB
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileUpload("video", e.target.files[0])
              }
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Upload Video
            </label>
          </div>

          {/* Image */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <ImageIcon size={32} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium mb-2">Image Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              JPG/PNG, 1920x1080px recommended
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileUpload("image", e.target.files[0])
              }
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
            >
              Upload Image
            </label>
          </div>

          {/* HTML5 */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <FileText size={32} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium mb-2">Interactive Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              HTML5 creative for interactive displays
            </p>
            <input
              type="file"
              accept=".html,.zip"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileUpload("html5", e.target.files[0])
              }
              className="hidden"
              id="html5-upload"
            />
            <label
              htmlFor="html5-upload"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
            >
              Upload HTML5
            </label>
          </div>
        </div>

        {/* Uploaded */}
        {uploadedCreatives.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Uploaded Creatives</h3>
            <div className="space-y-3">
              {uploadedCreatives.map((creative) => (
                <div
                  key={creative.id}
                  className="flex items-center justify-between bg-white border rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    {creative.type === "image" && (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img
                        src={creative.preview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    {creative.type === "video" && (
                      <video
                        src={creative.preview}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    {creative.type === "html5" && (
                      <div className="w-16 h-16 bg-purple-100 rounded flex items-center justify-center">
                        <FileText size={24} className="text-purple-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{creative.file?.name}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {creative.type} •{" "}
                        {((creative.file?.size ?? 0) / 1024 / 1024).toFixed(1)}
                        MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {creative.isValid ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                    <button
                      onClick={() => removeCreative(creative.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // ===== Step 4: Budget & Payment =====
  const BudgetPaymentStep: React.FC = () => {
    const totalBudget = calculateBudget();

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Budget Estimator & Payment
          </h2>
          <p className="text-gray-600">
            Review your campaign costs and complete payment
          </p>
        </div>

        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Selected Screens:</span>
              <span className="font-medium">
                {selectedScreens.length} screens
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Campaign Duration:</span>
              <span className="font-medium">{selectedDates.length} days</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Uploaded Creatives:</span>
              <span className="font-medium">
                {uploadedCreatives.length} files
              </span>
            </div>
            <div className="flex justify-between items-center py-3 text-lg font-bold text-blue-600 bg-blue-50 px-4 rounded">
              <span>Total Amount:</span>
              <span>₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods (static UI) */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex items-center space-x-3">
              <Smartphone size={24} className="text-blue-600" />
              <div>
                <div className="font-medium">UPI Payment</div>
                <div className="text-sm text-gray-600">
                  PhonePe, GPay, Paytm
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex items-center space-x-3">
              <CreditCard size={24} className="text-green-600" />
              <div>
                <div className="font-medium">Net Banking</div>
                <div className="text-sm text-gray-600">All major banks</div>
              </div>
            </div>
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex items-center space-x-3">
              <CreditCard size={24} className="text-purple-600" />
              <div>
                <div className="font-medium">Credit/Debit Card</div>
                <div className="text-sm text-gray-600">
                  Visa, Mastercard, RuPay
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center">
          <button
            onClick={() => setCurrentStep(5)}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors"
          >
            Pay ₹{totalBudget.toLocaleString()} & Launch Campaign
          </button>
        </div>
      </div>
    );
  };

  // ===== Step 5: Confirmation =====
  const ConfirmationStep: React.FC = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Campaign Created Successfully!
        </h2>
        <p className="text-gray-600">
          Your campaign has been submitted and will go live as scheduled.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold mb-4">Campaign Details:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Campaign ID:</span>
            <span className="font-medium">
              #CAM{Date.now().toString().slice(-6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Screens:</span>
            <span className="font-medium">{selectedScreens.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{selectedDates.length} days</span>
          </div>
          <div className="flex justify-between">
            <span>Total Paid:</span>
            <span className="font-medium text-green-600">
              ₹{calculateBudget().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className="space-x-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          View Campaign Dashboard
        </button>
        <button
          className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg"
          onClick={() => setCurrentStep(1)}
        >
          Create Another Campaign
        </button>
      </div>
    </div>
  );

  // ===== Render =====
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm ${
                    step.number <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check size={16} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-gray-600">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-12 h-0.5 ml-4 ${
                      step.number < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && (
                <ScreenSelectionStep /* onViewDetails={onViewDetails} */ />
              )}
              {currentStep === 2 && <ScheduleSelectionStep />}
              {currentStep === 3 && <CreativeUploadStep />}
              {currentStep === 4 && <BudgetPaymentStep />}
              {currentStep === 5 && <ConfirmationStep />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Modal for viewing screen details */}
        <ScreenDetailsModal
          screen={screenInView}
          onClose={() => setScreenInView(null)}
          onSelectScreen={(screen) => {
            setSelectedScreens((prev) => [...prev, screen]);
            setScreenInView(null);
          }}
        />

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between">
            <button
              onClick={handleBack}
              disabled={currentStep === 1}
              className="px-4 py-2 rounded-lg border disabled:opacity-50"
            >
              Back
            </button>
            <button
              onClick={handleNext}
              disabled={!canProceed()}
              className="px-6 py-2 rounded-lg bg-blue-600 text-white disabled:opacity-50"
            >
              Next
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCreationWorkflow;
