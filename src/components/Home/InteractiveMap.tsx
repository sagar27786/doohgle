import React, { useState, useEffect } from "react";
import {
  Search,
  MapPin,
  Globe,
  Info,
  ChevronDown,
  ChevronUp,
  Calendar,
  Clock,
  Eye,
  BarChart3,
  RotateCcw,
  Play,
  Pause,
  ArrowLeft,
  ArrowRight,
  ZoomIn,
  ZoomOut,
} from "lucide-react";
import IndianGoogleMap from "../Map/IndianGoogleMap";
import GoogleMapService from "../../services/googleMapService";

interface Country {
  name: string;
  code: string;
  flag: string;
  center: [number, number];
  zoom: number;
}

interface VenueType {
  id: string;
  name: string;
  image: string;
  checked: boolean;
  description: string;
  audiences: string[];
}

interface Creative {
  id: string;
  name: string;
  image: string;
  type: "portrait" | "landscape";
  checked: boolean;
}

// Updated with India as primary country
const countries: Country[] = [
  {
    name: "India",
    code: "IN",
    flag: "��",
    center: [20.5937, 78.9629],
    zoom: 5,
  },
  {
    name: "United States",
    code: "US",
    flag: "��",
    center: [39.8283, -98.5795],
    zoom: 4,
  },
  {
    name: "United Kingdom",
    code: "GB",
    flag: "��",
    center: [55.3781, -3.436],
    zoom: 6,
  },
];

const venueTypes: VenueType[] = [
  {
    id: "health-beauty",
    name: "Health & Beauty",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=400&h=300&fit=crop",
    checked: true,
    description:
      "Screens in salons, spas, and beauty clinics reaching beauty-conscious audiences.",
    audiences: ["Gen Z", "Millennials", "Health & Fitness Enthusiasts"],
  },
  {
    id: "gyms",
    name: "Gyms",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=300&fit=crop",
    checked: true,
    description:
      "Screens of varying sizes are displayed in gyms, for example at reception, in the changing rooms, in front of machines, by workout benches and weights.",
    audiences: [
      "Gen Z",
      "Business People",
      "Health & Fitness Enthusiasts",
      "Millennials",
    ],
  },
  {
    id: "office-buildings",
    name: "Office Buildings",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=400&h=300&fit=crop",
    checked: true,
    description:
      "Professional environments with high-value business audiences and decision makers.",
    audiences: ["Business People", "Millennials"],
  },
];

const creatives: Creative[] = [
  {
    id: "transferwise_portrait",
    name: "transferwise_portrait",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=300&h=400&fit=crop",
    type: "portrait",
    checked: false,
  },
  {
    id: "transferwise_landscape",
    name: "transferwise_landscape",
    image:
      "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=600&h=300&fit=crop",
    type: "landscape",
    checked: false,
  },
  {
    id: "tomford_portrait",
    name: "tomford_portrait",
    image:
      "https://images.unsplash.com/photo-1497366216548-37526070297c?w=300&h=400&fit=crop",
    type: "portrait",
    checked: false,
  },
  {
    id: "tomford_landscape",
    name: "tomford_landscape",
    image:
      "https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=600&h=300&fit=crop",
    type: "landscape",
    checked: false,
  },
];

const InteractiveMap = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]); // Default to India
  const [searchQuery, setSearchQuery] = useState("");
  const [venueTypesState, setVenueTypesState] = useState(venueTypes);
  const [selectedVenue, setSelectedVenue] = useState(venueTypes[1]);
  const [startDate, setStartDate] = useState("2025-08-05");
  const [endDate, setEndDate] = useState("2025-09-01");
  const [timezone, setTimezone] = useState("Use screen's time zone");
  const [creativesState, setCreativesState] = useState(creatives);
  const [showVenuePreset, setShowVenuePreset] = useState(false);
  const [showTimezone, setShowTimezone] = useState(false);
  const [mapCenter, setMapCenter] = useState<
    { lat: number; lng: number } | undefined
  >();

  const mapService = GoogleMapService.getInstance();

  // Update map center when country changes
  useEffect(() => {
    if (selectedCountry.code === "IN") {
      setMapCenter(mapService.getIndiaCenter());
    } else {
      setMapCenter({
        lat: selectedCountry.center[0],
        lng: selectedCountry.center[1],
      });
    }
  }, [selectedCountry, mapService]);

  const handleVenueToggle = (id: string) => {
    setVenueTypesState((prev) =>
      prev.map((venue) =>
        venue.id === id ? { ...venue, checked: !venue.checked } : venue
      )
    );
  };

  const handleCreativeToggle = (id: string) => {
    setCreativesState((prev) =>
      prev.map((creative) =>
        creative.id === id
          ? { ...creative, checked: !creative.checked }
          : creative
      )
    );
  };

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    console.log("Selected location:", { lat, lng, address });
    // Handle location selection logic here
  };

  const renderStep1 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Target country
          </label>
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white appearance-none cursor-pointer hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/50 transition-all duration-300"
              value={selectedCountry.code}
              onChange={(e) => {
                const country = countries.find(
                  (c) => c.code === e.target.value
                );
                if (country) setSelectedCountry(country);
              }}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search Indian cities, states (e.g., Mumbai, Delhi, Tamil Nadu)"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
        <div className="text-sm text-gray-500 dark:text-slate-400">
          powered by Google Maps
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-5 h-5 rounded-full bg-gray-800 dark:bg-slate-600 flex items-center justify-center">
              <span className="text-white text-xs font-bold">2</span>
            </div>
            <span className="text-sm text-gray-700 dark:text-slate-300">
              Targeted country-wide
            </span>
          </div>
          <p className="text-sm text-gray-600 dark:text-slate-400">
            Currently you are targeting all available screens in the country.
            Add locations to specify your targeting.
          </p>
        </div>
      </div>
      <div className="lg:col-span-2">
        <div className="relative rounded-lg overflow-hidden h-96 border border-gray-200 dark:border-slate-700">
          <IndianGoogleMap
            onLocationSelect={handleLocationSelect}
            showScreenLocations={true}
            height="384px"
            zoom={selectedCountry.code === "IN" ? 5 : selectedCountry.zoom}
            center={mapCenter}
          />
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      {/* Left Column: Venue List */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md dark:bg-slate-700 dark:border-slate-600 dark:text-white dark:placeholder-slate-400 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-all duration-300"
          />
        </div>

        <div className="flex items-center space-x-2 px-1">
          <input
            type="checkbox"
            id="unselect-all"
            className="rounded accent-purple-600 dark:accent-purple-500 bg-gray-100 dark:bg-slate-600 border-gray-300 dark:border-slate-500"
          />
          <label
            htmlFor="unselect-all"
            className="text-sm text-gray-700 dark:text-slate-300"
          >
            Unselect all
          </label>
        </div>

        <div className="space-y-2">
          {venueTypesState.map((venue) => (
            <div
              key={venue.id}
              className={`flex items-center space-x-3 p-3 rounded-lg cursor-pointer transition-colors duration-200 ${
                selectedVenue.id === venue.id
                  ? "bg-purple-50 dark:bg-slate-700"
                  : "hover:bg-gray-100 dark:hover:bg-slate-700/50"
              }`}
              onClick={() => setSelectedVenue(venue)}
            >
              <input
                type="checkbox"
                checked={venue.checked}
                onChange={() => handleVenueToggle(venue.id)}
                onClick={(e) => e.stopPropagation()} // Prevent row selection when clicking checkbox
                className="rounded accent-purple-600 dark:accent-purple-500 bg-gray-100 dark:bg-slate-600 border-gray-300 dark:border-slate-500 flex-shrink-0"
              />
              <img
                src={venue.image}
                alt={venue.name}
                className="w-12 h-12 rounded object-cover dark:brightness-90"
              />
              <span className="text-sm font-medium text-gray-700 dark:text-slate-200">
                {venue.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Middle Column: Venue Presets */}
      <div className="space-y-4">
        <div className="relative">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Venue preset
          </label>
          <button
            className="w-full mt-2 p-3 border border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 dark:text-white text-left flex items-center justify-between hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/50 transition-all duration-300"
            onClick={() => setShowVenuePreset(!showVenuePreset)}
          >
            <span>Custom</span>
            {showVenuePreset ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-slate-400" />
            )}
          </button>

          {showVenuePreset && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-md shadow-lg">
              {[
                "Custom",
                "Millennials",
                "Tech-savvy",
                "Health & Fitness Enthusiasts",
                "Gen Z",
                "Business People",
              ].map((preset) => (
                <button
                  key={preset}
                  className="w-full px-4 py-2 text-left text-gray-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 flex items-center space-x-3 transition-colors duration-200"
                >
                  <div
                    className={`w-3.5 h-3.5 rounded-full flex-shrink-0 ${
                      preset === "Custom"
                        ? "bg-purple-600"
                        : "border-2 border-gray-300 dark:border-slate-500"
                    }`}
                  ></div>
                  <span>{preset}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Right Column: Venue Details */}
      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden h-48 border border-gray-200 dark:border-slate-700">
          <img
            src={selectedVenue.image}
            alt={selectedVenue.name}
            className="w-full h-full object-cover dark:brightness-90"
          />
          <div className="absolute bottom-2 right-2 flex space-x-1">
            <button className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button className="p-1.5 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
            {selectedVenue.name}
          </h3>
          <p className="text-sm text-gray-600 dark:text-slate-300 mb-3">
            {selectedVenue.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedVenue.audiences.map((audience) => (
              <span
                key={audience}
                className="inline-flex items-center space-x-1.5 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-slate-200 text-xs font-medium px-2 py-1 rounded"
              >
                <Info className="h-3.5 w-3.5" />
                <span>{audience}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* Left Column: Date Selection */}
      <div className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            Start date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-red-400 dark:border-red-500/80 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 dark:[color-scheme:dark]"
            />
          </div>
          <p className="text-sm text-red-600 dark:text-red-400">
            Start date must be equal or later than today
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700 dark:text-slate-300">
            End date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-slate-600 bg-white dark:bg-slate-700 text-gray-900 dark:text-white rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-all duration-300 dark:[color-scheme:dark]"
            />
          </div>
        </div>
      </div>

      {/* Right Column: Scheduling */}
      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            Scheduling
          </h3>
          <Info className="h-4 w-4 text-gray-400 dark:text-slate-500" />
        </div>

        <div className="relative">
          <Clock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400 dark:text-slate-500 pointer-events-none" />
          <button
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-white dark:bg-slate-700 dark:border-slate-600 text-gray-900 dark:text-white text-left flex items-center justify-between hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 dark:focus:ring-purple-500/50 transition-all duration-300"
            onClick={() => setShowTimezone(!showTimezone)}
          >
            <span>{timezone}</span>
            {showTimezone ? (
              <ChevronUp className="h-5 w-5 text-gray-500 dark:text-slate-400" />
            ) : (
              <ChevronDown className="h-5 w-5 text-gray-500 dark:text-slate-400" />
            )}
          </button>

          {showTimezone && (
            <div className="absolute z-10 w-full mt-1 bg-white dark:bg-slate-900 border border-gray-200 dark:border-slate-600 rounded-md shadow-lg max-h-48 overflow-y-auto">
              {[
                "Use screen's time zone",
                "+01:00",
                "Africa, Casablanca",
                "Africa, El Aaiun",
                "Africa, Lagos",
                "Africa, Ndjamena",
              ].map((tz) => (
                <button
                  key={tz}
                  className="w-full px-4 py-2 text-left text-gray-800 dark:text-slate-200 hover:bg-purple-50 dark:hover:bg-slate-800 transition-colors duration-200"
                  onClick={() => {
                    setTimezone(tz);
                    setShowTimezone(false);
                  }}
                >
                  {tz}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );

  const renderStep4 = () => (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
          Creatives
        </h3>
        <div className="flex space-x-1">
          <button className="p-2 rounded-md text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700">
            <div className="w-5 h-5 border-2 border-current"></div>
          </button>
          <button className="p-2 rounded-md text-gray-500 dark:text-slate-400 hover:bg-gray-100 dark:hover:bg-slate-700">
            <div className="w-5 h-5 grid grid-cols-2 gap-0.5">
              <div className="bg-current"></div>
              <div className="bg-current"></div>
              <div className="bg-current"></div>
              <div className="bg-current"></div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
        {creativesState.map((creative) => (
          <div key={creative.id} className="relative group">
            <div
              className={`relative rounded-lg overflow-hidden border-2 transition-all duration-300 ${
                creative.checked
                  ? "border-purple-500"
                  : "border-gray-200 dark:border-slate-700 group-hover:border-purple-400"
              }`}
            >
              <img
                src={creative.image}
                alt={creative.name}
                className={`w-full object-cover dark:brightness-90 ${
                  creative.type === "portrait" ? "h-48" : "h-24"
                }`}
              />
              <input
                type="checkbox"
                checked={creative.checked}
                onChange={() => handleCreativeToggle(creative.id)}
                className="absolute top-2 right-2 w-5 h-5 accent-purple-600 dark:accent-purple-500 bg-white/50 dark:bg-slate-800/50 rounded"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700 dark:text-slate-300 truncate">
                {creative.name}
              </p>
              <p className="text-xs text-gray-500 dark:text-slate-400">Video</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="bg-green-50 dark:bg-green-900/30 border border-green-200 dark:border-green-500/30 rounded-lg p-4">
        <div className="flex items-center space-x-3">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0">
            <span className="text-white text-base font-bold">✓</span>
          </div>
          <span className="text-green-800 dark:text-green-200 font-medium">
            All done. Set a budget and launch your campaign!
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              <span className="text-sm text-gray-600 dark:text-slate-300">
                Estimated impressions
              </span>
            </div>
            <Info className="h-4 w-4 text-gray-400 dark:text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              <span className="text-sm text-gray-600 dark:text-slate-300">
                CPM (Cost Per Mille)
              </span>
            </div>
            <Info className="h-4 w-4 text-gray-400 dark:text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">
            EUR 0.00
          </p>
        </div>

        <div className="bg-white dark:bg-slate-800/50 rounded-lg p-4 border border-gray-200 dark:border-slate-700">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-gray-600 dark:text-slate-400" />
              <span className="text-sm text-gray-600 dark:text-slate-300">
                Spots (up to)
              </span>
            </div>
            <Info className="h-4 w-4 text-gray-400 dark:text-slate-500" />
          </div>
          <p className="text-2xl font-bold text-gray-900 dark:text-white">0</p>
        </div>
      </div>

      <div className="bg-white dark:bg-slate-900/50 rounded-lg border border-gray-200 dark:border-slate-700 overflow-hidden">
        <div className="relative h-64">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop"
            alt="Campaign Preview"
            className="w-full h-full object-cover dark:brightness-90"
          />
          <div className="absolute bottom-4 right-4 flex space-x-1">
            <button className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <ArrowLeft className="h-4 w-4" />
            </button>
            <button className="p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors">
              <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return renderStep1();
      case 2:
        return renderStep2();
      case 3:
        return renderStep3();
      case 4:
        return renderStep4();
      case 5:
        return renderStep5();
      default:
        return renderStep1();
    }
  };

  return (
    <div className="bg-gray-50 dark:bg-slate-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white dark:bg-slate-800 border border-gray-200 dark:border-slate-700 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {currentStep}/5{" "}
                {currentStep === 1
                  ? "Geotargeting"
                  : currentStep === 2
                  ? "Venue Types"
                  : currentStep === 3
                  ? "Timing"
                  : currentStep === 4
                  ? "Creatives"
                  : "Review your campaign"}
              </span>
              <Info className="h-4 w-4 text-gray-400 dark:text-slate-500" />
            </div>
          </div>

          <div className="w-full h-1 bg-gray-200 dark:bg-slate-700 rounded-full mb-6">
            <div
              className="h-1 bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${currentStep * 20}%` }}
            ></div>
          </div>

          {currentStep === 1 && (
            <div className="w-full h-1 bg-gray-200 rounded-full mb-6">
              <div
                className="h-1 bg-green-500 rounded-full"
                style={{ width: "20%" }}
              ></div>
            </div>
          )}

          {renderStepContent()}

          <div className="flex justify-between mt-8">
            <button
              className={`px-4 py-2 text-purple-600 hover:text-purple-700 transition-colors duration-300 ${
                currentStep === 1 ? "invisible" : ""
              }`}
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
            >
              Back
            </button>

            <div className="flex space-x-4">
              {currentStep === 4 && (
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 transition-colors duration-300">
                  Preview Campaign
                </button>
              )}
              <button
                className={`px-6 py-2 rounded-md font-medium transition-all duration-300 ${
                  currentStep === 5
                    ? "bg-purple-600 text-white hover:bg-purple-700"
                    : "bg-purple-600 text-white hover:bg-purple-700"
                }`}
                onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              >
                {currentStep === 5 ? "Launch Campaign" : "Next"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
