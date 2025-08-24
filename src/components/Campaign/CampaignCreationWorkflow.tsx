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
  const [isProcessingPayment, setIsProcessingPayment] = useState(false);

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

  const handlePayment = async () => {
    setIsProcessingPayment(true);
    try {
      // Simulate payment processing
      await new Promise((resolve) => setTimeout(resolve, 3000));
      setCurrentStep(5);
    } catch (error) {
      console.error("Payment failed:", error);
    } finally {
      setIsProcessingPayment(false);
    }
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
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          {availableScreens.map((screen) => (
            <div
              key={screen.id}
              className={`border rounded-lg overflow-hidden transition-all flex flex-col ${
                isScreenSelected(screen.id)
                  ? "ring-2 ring-blue-500"
                  : "hover:shadow-md"
              }`}
            >
              <div className="relative">
                <div className="h-40 bg-gray-100 flex items-center justify-center">
                  {screen.imageUrl ? (
                    <img
                      src={screen.imageUrl}
                      alt={screen.name}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <Monitor className="h-12 w-12 text-gray-400" />
                  )}
                </div>
                {isScreenSelected(screen.id) && (
                  <div className="absolute top-2 right-2 bg-blue-500 text-white rounded-full p-1">
                    <Check className="h-4 w-4" />
                  </div>
                )}
              </div>
              <div className="p-4 flex flex-col flex-1">
                <h3 className="font-medium text-lg">{screen.name}</h3>
                <div className="flex items-center text-sm text-gray-500 mt-1">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{screen.location}</span>
                </div>
                <div className="mt-3 grid grid-cols-2 gap-2 text-sm flex-1">
                  <div>
                    <div className="text-gray-500">Size</div>
                    <div>{screen.size}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Daily Traffic</div>
                    <div>{screen.traffic.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Hourly Rate</div>
                    <div>₹{screen.pricing.hourly.toLocaleString()}</div>
                  </div>
                  <div>
                    <div className="text-gray-500">Daily Rate</div>
                    <div>₹{screen.pricing.daily.toLocaleString()}</div>
                  </div>
                </div>
                {/* NEW: View Details button */}
                <button
                  onClick={() => setScreenInView(screen)}
                  className="mt-3 text-sm text-blue-600 hover:text-blue-800 font-medium self-start"
                >
                  View Details
                </button>
              </div>
            </div>
          ))}
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
  const ScheduleSelectionStep: React.FC = () => {
    const today = new Date();
    const next30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    const toggleDate = (date: string) => {
      setSelectedDates((prev) =>
        prev.includes(date) ? prev.filter((d) => d !== date) : [...prev, date]
      );
    };

    const timeSlots = [
      { label: "Morning (6 AM - 12 PM)", value: "06:00-12:00", price: 1.0 },
      { label: "Afternoon (12 PM - 6 PM)", value: "12:00-18:00", price: 1.2 },
      { label: "Evening (6 PM - 10 PM)", value: "18:00-22:00", price: 1.5 },
      { label: "Night (10 PM - 6 AM)", value: "22:00-06:00", price: 0.8 },
      { label: "Full Day (6 AM - 10 PM)", value: "06:00-22:00", price: 2.5 },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select Schedule
          </h2>
          <p className="text-gray-600">
            Choose your campaign dates and time slots
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Dates</h3>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 p-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {next30Days.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDates.includes(date);
                  return (
                    <button
                      key={date}
                      onClick={() => toggleDate(date)}
                      className={`p-2 text-sm rounded transition-colors ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {dateObj.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Slot Selection (display only for now) */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Time Slots</h3>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot.value}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{slot.label}</div>
                      <div className="text-sm text-gray-500">
                        Multiplier: {slot.price}x base rate
                      </div>
                    </div>
                    <input
                      type="checkbox"
                      className="w-4 h-4 text-blue-600"
                      disabled
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Selected Schedule</h4>
          <div className="text-sm text-green-700">
            <p>Dates: {selectedDates.length} days selected</p>
            <p>Estimated duration: {selectedDates.length} days</p>
          </div>
        </div>
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
            onClick={handlePayment}
            disabled={isProcessingPayment}
            className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:opacity-50 flex items-center justify-center mx-auto gap-2"
          >
            {isProcessingPayment ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Processing Payment...
              </>
            ) : (
              `Pay ₹${totalBudget.toLocaleString()} & Launch Campaign`
            )}
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
    <div className="min-h-screen bg-gray-50 py-8 relative">
      {/* Payment Processing Overlay */}
      <AnimatePresence>
        {isProcessingPayment && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <motion.div
              initial={{ scale: 0.8, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.8, y: 50 }}
              className="bg-white rounded-lg p-8 max-w-md mx-4 text-center"
            >
              <div className="mb-6">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.2, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity },
                  }}
                  className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4"
                >
                  <CreditCard className="w-8 h-8 text-blue-600" />
                </motion.div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Processing Payment
                </h3>
                <p className="text-gray-600">
                  Please wait while we process your payment...
                </p>
                <div className="mt-4 flex justify-center space-x-1">
                  {[0, 1, 2].map((i) => (
                    <motion.div
                      key={i}
                      animate={{
                        scale: [1, 1.2, 1],
                        opacity: [0.5, 1, 0.5],
                      }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        delay: i * 0.2,
                      }}
                      className="w-2 h-2 bg-blue-600 rounded-full"
                    />
                  ))}
                </div>
              </div>
              <p className="text-sm text-gray-500">Do not close this window</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

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
