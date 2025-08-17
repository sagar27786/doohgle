import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  MapPin,
  Calendar,
  Clock,
  DollarSign,
  Users,
  Monitor,
  Filter,
  Grid,
  List,
  Star,
  Eye,
  Wifi,
  Zap,
  Loader2
} from "lucide-react";
import { searchScreensByCity } from "../../api/screens";

// Enhanced Screen Interface
export interface EnhancedScreen {
  id: number;
  name: string;
  location: {
    city: string;
    area: string;
    address: string;
    coordinates: { lat: number; lng: number };
  };
  pricing: {
    hourly: number;
    daily: number;
    weekly: number;
  };
  availability: {
    date: string;
    timeSlots: string[];
  }[];
  traffic: {
    dailyFootfall: number;
    vehicleCount: number;
    peakHours: string[];
  };
  specifications: {
    size: string;
    resolution: string;
    orientation: "landscape" | "portrait";
    screenType: string;
  };
  features: string[];
  rating: number;
  totalBookings: number;
  imageUrl: string;
  isVerified: boolean;
}

// Sample enhanced data for Indian cities
// const sampleScreens: EnhancedScreen[] = [
//   {
//   //   id: 1,
//   //   name: "Times Square Mall LED",
//   //   location: {
//   //     city: "Mumbai",
//   //     area: "Andheri West",
//   //     address: "Times Square Mall, SV Road, Andheri West, Mumbai",
//   //     coordinates: { lat: 19.1136, lng: 72.8697 },
//   //   },
//   //   pricing: { hourly: 500, daily: 8000, weekly: 45000 },
//   //   availability: [
//   //     {
//   //       date: "2025-08-16",
//   //       timeSlots: ["09:00-12:00", "14:00-18:00", "20:00-22:00"],
//   //     },
//   //     { date: "2025-08-17", timeSlots: ["10:00-16:00", "18:00-22:00"] },
//   //   ],
//   //   traffic: {
//   //     dailyFootfall: 25000,
//   //     vehicleCount: 15000,
//   //     peakHours: ["18:00-21:00", "12:00-14:00"],
//   //   },
//   //   specifications: {
//   //     size: "10x20 ft",
//   //     resolution: "1920x1080",
//   //     orientation: "landscape",
//   //     screenType: "LED",
//   //   },
//   //   features: [
//   //     "WiFi Control",
//   //     "Real-time Analytics",
//   //     "Weather Proof",
//   //     "4K Support",
//   //   ],
//   //   rating: 4.8,
//   //   totalBookings: 156,
//   //   imageUrl: "/api/placeholder/400/300",
//   //   isVerified: true,
//   // },
//   // {
//   //   id: 2,
//   //   name: "CP Metro Station Digital",
//   //   location: {
//   //     city: "Delhi",
//   //     area: "Connaught Place",
//   //     address: "Rajiv Chowk Metro Station, Connaught Place, New Delhi",
//   //     coordinates: { lat: 28.6328, lng: 77.2197 },
//   //   },
//   //   pricing: { hourly: 750, daily: 12000, weekly: 65000 },
//   //   availability: [
//   //     { date: "2025-08-16", timeSlots: ["06:00-11:00", "16:00-22:00"] },
//   //     { date: "2025-08-17", timeSlots: ["08:00-20:00"] },
//   //   ],
//   //   traffic: {
//   //     dailyFootfall: 45000,
//   //     vehicleCount: 8000,
//   //     peakHours: ["08:00-10:00", "17:00-20:00"],
//   //   },
//   //   specifications: {
//   //     size: "8x12 ft",
//   //     resolution: "1920x1080",
//   //     orientation: "landscape",
//   //     screenType: "LCD",
//   //   },
//   //   features: ["High Brightness", "Metro Integration", "Digital Audio"],
//   //   rating: 4.6,
//   //   totalBookings: 89,
//   //   imageUrl: "/api/placeholder/400/300",
//   //   isVerified: true,
//   // },
//   // {
//   //   id: 3,
//   //   name: "Electronic City Tech Hub",
//   //   location: {
//   //     city: "Bangalore",
//   //     area: "Electronic City",
//   //     address: "Electronic City Phase 1, Bangalore",
//   //     coordinates: { lat: 12.8456, lng: 77.6603 },
//   //   },
//   //   pricing: { hourly: 400, daily: 6000, weekly: 35000 },
//   //   availability: [
//   //     { date: "2025-08-16", timeSlots: ["09:00-18:00", "19:00-21:00"] },
//   //     { date: "2025-08-17", timeSlots: ["10:00-22:00"] },
//   //   ],
//   //   traffic: {
//   //     dailyFootfall: 18000,
//   //     vehicleCount: 12000,
//   //     peakHours: ["09:00-11:00", "18:00-20:00"],
//   //   },
//   //   specifications: {
//   //     size: "12x8 ft",
//   //     resolution: "1920x1080",
//   //     orientation: "landscape",
//   //     screenType: "LED",
//   //   },
//   //   features: ["Smart Scheduling", "Weather Resistant", "Remote Monitoring"],
//   //   rating: 4.7,
//   //   totalBookings: 134,
//   //   imageUrl: "/api/placeholder/400/300",
//   //   isVerified: true,
//   // },
//   // {
//   //   id: 4,
//   //   name: "FC Road Shopping Hub",
//   //   location: {
//   //     city: "Pune",
//   //     area: "Fergusson College Road",
//   //     address: "FC Road, Near Deccan Gymkhana, Pune",
//   //     coordinates: { lat: 18.5089, lng: 73.8239 },
//   //   },
//   //   pricing: { hourly: 350, daily: 5500, weekly: 30000 },
//   //   availability: [
//   //     { date: "2025-08-16", timeSlots: ["11:00-16:00", "18:00-22:00"] },
//   //     { date: "2025-08-17", timeSlots: ["09:00-21:00"] },
//   //   ],
//   //   traffic: {
//   //     dailyFootfall: 12000,
//   //     vehicleCount: 8000,
//   //     peakHours: ["11:00-14:00", "18:00-21:00"],
//   //   },
//   //   specifications: {
//   //     size: "6x10 ft",
//   //     resolution: "1280x720",
//   //     orientation: "portrait",
//   //     screenType: "LCD",
//   //   },
//   //   features: ["Mobile Integration", "QR Code Support", "Local Language"],
//   //   rating: 4.4,
//   //   totalBookings: 67,
//   //   imageUrl: "/api/placeholder/400/300",
//   //   isVerified: false,
//   // },
// ];

const AdvancedScreenSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [filters, setFilters] = useState({
    priceRange: { min: 0, max: 20000 },
    screenSize: "",
    availability: "",
    traffic: "",
    rating: 0,
  });
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [showFilters, setShowFilters] = useState(false);
  const [filteredScreens, setFilteredScreens] = useState<EnhancedScreen[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const cities = ["Mumbai", "Delhi", "Bangalore", "Pune", "Hyderabad", "Chennai", "Kolkata"];

  const fetchScreensByCity = async (city: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const screens = await searchScreensByCity(city);
      
      // Transform the API response to match the EnhancedScreen interface
      const transformedScreens: EnhancedScreen[] = screens.map((screen) => ({
        id: screen.id,
        name: screen.name || `${screen.screen_type} Screen`,
        location: {
          city: screen.city,
          area: screen.location_name || '',
          address: screen.address || '',
          coordinates: {
            lat: screen.latitude || 0,
            lng: screen.longitude || 0
          }
        },
        pricing: {
          hourly: screen.cost_per_10_seconds ? screen.cost_per_10_seconds * 360 : 1000, // Convert to hourly rate
          daily: screen.cost_per_10_seconds ? screen.cost_per_10_seconds * 8640 : 10000, // Convert to daily rate
          weekly: screen.cost_per_10_seconds ? screen.cost_per_10_seconds * 60480 : 70000 // Convert to weekly rate
        },
        specifications: {
          size: screen.screen_size_width && screen.screen_size_height 
            ? `${screen.screen_size_width}x${screen.screen_size_height} ft` 
            : 'Not specified',
          resolution: screen.resolution_width && screen.resolution_height
            ? `${screen.resolution_width}x${screen.resolution_height}`
            : 'HD',
          orientation: 'landscape', // Default value
          screenType: screen.screen_type || 'LED Display'
        },
        availability: [{
          date: new Date().toISOString().split('T')[0],
          timeSlots: ['09:00-12:00', '14:00-18:00']
        }],
        traffic: {
          dailyFootfall: screen.daily_footfall || 1000,
          vehicleCount: screen.vehicle_count || 500,
          peakHours: Array.isArray(screen.peak_hours) 
            ? screen.peak_hours 
            : screen.peak_hours 
              ? [screen.peak_hours] 
              : ['08:00-10:00', '17:00-20:00']
        },
        features: ['HD Display', '24/7 Operation'],
        rating: 4.5,
        totalBookings: 42,
        imageUrl: screen.image_url || 'https://via.placeholder.com/400x300',
        isVerified: true
      }));

      setFilteredScreens(transformedScreens);
    } catch (err) {
      console.error('Error fetching screens:', err);
      setError('Failed to load screens. Please try again.');
      // setFilteredScreens(sampleScreens); // Fallback to sample data
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = () => {
    if (selectedCity) {
      fetchScreensByCity(selectedCity);
    } else if (searchQuery) {
      // If no city is selected but there's a search query, use that
      fetchScreensByCity(searchQuery);
    }
  };

  // Load sample data on initial render
  useEffect(() => {
    if (filteredScreens.length === 0) {
      // setFilteredScreens(sampleScreens);
    }
  }, []);

  // Apply filters to the fetched screens
  useEffect(() => {
    let filtered = [...filteredScreens];

    // Price filter
    filtered = filtered.filter(
      (screen) =>
        screen.pricing.daily >= filters.priceRange.min &&
        screen.pricing.daily <= filters.priceRange.max
    );

    // Rating filter
    if (filters.rating > 0) {
      filtered = filtered.filter((screen) => screen.rating >= filters.rating);
    }

    setFilteredScreens(prev => {
      // Only update if there are actual changes to prevent infinite loops
      if (JSON.stringify(prev) !== JSON.stringify(filtered)) {
        return filtered;
      }
      return prev;
    });
  }, [filters]);

  const ScreenCard: React.FC<{ screen: EnhancedScreen }> = ({ screen }) => (
    <motion.div
      className="bg-white rounded-lg shadow-sm border hover:shadow-md transition-shadow cursor-pointer"
      whileHover={{ y: -2 }}
      layout
    >
      <div className="relative">
        <img
          src={screen.imageUrl}
          alt={screen.name}
          className="w-full h-48 object-cover rounded-t-lg"
        />
        {screen.isVerified && (
          <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs flex items-center">
            <Zap size={12} className="mr-1" />
            Verified
          </div>
        )}
        <div className="absolute bottom-2 left-2 bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
          {screen.specifications.size}
        </div>
      </div>

      <div className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 text-lg">{screen.name}</h3>
          <div className="flex items-center">
            <Star size={14} className="text-yellow-400 fill-current" />
            <span className="text-sm text-gray-600 ml-1">{screen.rating}</span>
          </div>
        </div>

        <div className="flex items-center text-gray-600 mb-2">
          <MapPin size={14} className="mr-1" />
          <span className="text-sm">
            {screen.location.area}, {screen.location.city}
          </span>
        </div>

        <div className="grid grid-cols-2 gap-2 mb-3 text-xs">
          <div className="flex items-center text-gray-500">
            <Users size={12} className="mr-1" />
            {screen.traffic.dailyFootfall.toLocaleString()} daily
          </div>
          <div className="flex items-center text-gray-500">
            <Monitor size={12} className="mr-1" />
            {screen.specifications.resolution}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div>
            <div className="text-lg font-bold text-blue-600">
              ₹{screen.pricing.daily.toLocaleString()}
            </div>
            <div className="text-xs text-gray-500">per day</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-gray-900">
              {screen.availability[0]?.timeSlots.length || 0} slots
            </div>
            <div className="text-xs text-gray-500">available today</div>
          </div>
        </div>

        <div className="mt-3 pt-3 border-t">
          <div className="flex flex-wrap gap-1">
            {screen.features.slice(0, 2).map((feature, idx) => (
              <span
                key={idx}
                className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded"
              >
                {feature}
              </span>
            ))}
            {screen.features.length > 2 && (
              <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded">
                +{screen.features.length - 2} more
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );

  const ScreenListItem: React.FC<{ screen: EnhancedScreen }> = ({ screen }) => (
    <motion.div
      className="bg-white rounded-lg shadow-sm border p-4 hover:shadow-md transition-shadow cursor-pointer"
      whileHover={{ x: 2 }}
      layout
    >
      <div className="flex items-center space-x-4">
        <img
          src={screen.imageUrl}
          alt={screen.name}
          className="w-20 h-20 object-cover rounded-lg"
        />

        <div className="flex-1">
          <div className="flex items-start justify-between">
            <div>
              <h3 className="font-semibold text-gray-900">{screen.name}</h3>
              <p className="text-sm text-gray-600 flex items-center">
                <MapPin size={12} className="mr-1" />
                {screen.location.area}, {screen.location.city}
              </p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-blue-600">
                ₹{screen.pricing.daily.toLocaleString()}
              </div>
              <div className="text-xs text-gray-500">per day</div>
            </div>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-2 text-sm">
            <div>
              <span className="text-gray-500">Size:</span>
              <span className="ml-1 font-medium">
                {screen.specifications.size}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Traffic:</span>
              <span className="ml-1 font-medium">
                {(screen.traffic.dailyFootfall / 1000).toFixed(0)}K
              </span>
            </div>
            <div>
              <span className="text-gray-500">Rating:</span>
              <span className="ml-1 font-medium flex items-center">
                <Star size={12} className="text-yellow-400 fill-current mr-1" />
                {screen.rating}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Slots:</span>
              <span className="ml-1 font-medium">
                {screen.availability[0]?.timeSlots.length || 0}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Hero Section with Search */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="max-w-6xl mx-auto px-4">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold mb-4">
              Advertise anywhere in India
            </h1>
            <p className="text-xl text-blue-100">Find your perfect screen</p>
          </div>

          <div className="max-w-2xl mx-auto">
            <div className="flex items-center space-x-2 bg-white rounded-lg p-2">
              <div className="flex-1 relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Enter City / Pin Location"
                  className="w-full pl-10 pr-4 py-3 text-gray-900 focus:outline-none rounded-l-lg"
                />
              </div>
              <select
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="px-4 py-3 text-gray-900 focus:outline-none border-l"
              >
                <option value="">All Cities</option>
                {cities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>
              <button 
                onClick={handleSearch}
                disabled={isLoading}
                className="bg-orange-500 hover:bg-orange-600 text-white px-6 py-3 rounded-r-lg font-medium transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Searching...
                  </>
                ) : (
                  'Search'
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Filters and Results */}
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => setShowFilters(!showFilters)}
              className={`flex items-center px-4 py-2 rounded-lg border transition-colors ${
                showFilters
                  ? "bg-blue-100 text-blue-700 border-blue-200"
                  : "bg-white text-gray-600 border-gray-200"
              }`}
            >
              <Filter size={16} className="mr-2" />
              Filters
            </button>
            <span className="text-gray-600">
              {filteredScreens.length} screens found
            </span>
          </div>

          <div className="flex items-center space-x-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded ${
                viewMode === "grid"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <Grid size={20} />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded ${
                viewMode === "list"
                  ? "bg-blue-100 text-blue-600"
                  : "text-gray-400"
              }`}
            >
              <List size={20} />
            </button>
          </div>
        </div>

        {/* Advanced Filters Panel */}
        <AnimatePresence>
          {showFilters && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="bg-white rounded-lg border p-6 mb-6"
            >
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Price Range (Daily)
                  </label>
                  <div className="space-y-2">
                    <input
                      type="range"
                      min="0"
                      max="20000"
                      value={filters.priceRange.max}
                      onChange={(e) =>
                        setFilters({
                          ...filters,
                          priceRange: {
                            ...filters.priceRange,
                            max: parseInt(e.target.value),
                          },
                        })
                      }
                      className="w-full"
                    />
                    <div className="flex justify-between text-sm text-gray-600">
                      <span>₹0</span>
                      <span>₹{filters.priceRange.max.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Screen Size
                  </label>
                  <select
                    value={filters.screenSize}
                    onChange={(e) =>
                      setFilters({ ...filters, screenSize: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Size</option>
                    <option value="small">Small (up to 8x10 ft)</option>
                    <option value="medium">Medium (8x12 to 10x20 ft)</option>
                    <option value="large">Large (20+ ft)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating
                  </label>
                  <select
                    value={filters.rating}
                    onChange={(e) =>
                      setFilters({
                        ...filters,
                        rating: parseFloat(e.target.value),
                      })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="0">Any Rating</option>
                    <option value="4.0">4.0+ Stars</option>
                    <option value="4.5">4.5+ Stars</option>
                    <option value="4.8">4.8+ Stars</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Availability
                  </label>
                  <select
                    value={filters.availability}
                    onChange={(e) =>
                      setFilters({ ...filters, availability: e.target.value })
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Any Time</option>
                    <option value="today">Available Today</option>
                    <option value="weekend">Weekend Available</option>
                    <option value="peak">Peak Hours Available</option>
                  </select>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Results */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          <AnimatePresence>
            {filteredScreens.map((screen) =>
              viewMode === "grid" ? (
                <ScreenCard key={screen.id} screen={screen} />
              ) : (
                <ScreenListItem key={screen.id} screen={screen} />
              )
            )}
          </AnimatePresence>
        </div>

        {filteredScreens.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No screens found
            </h3>
            <p className="text-gray-600">
              Try adjusting your search criteria or filters
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvancedScreenSearch;
