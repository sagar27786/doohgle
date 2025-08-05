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
import L from "leaflet";

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

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

const countries: Country[] = [
  {
    name: "Belgium",
    code: "BE",
    flag: "🇧🇪",
    center: [50.8503, 4.3517],
    zoom: 8,
  },
  {
    name: "Netherlands",
    code: "NL",
    flag: "🇳🇱",
    center: [52.3676, 4.9041],
    zoom: 8,
  },
  {
    name: "Germany",
    code: "DE",
    flag: "🇩🇪",
    center: [51.1657, 10.4515],
    zoom: 6,
  },
  {
    name: "France",
    code: "FR",
    flag: "🇫🇷",
    center: [46.2276, 2.2137],
    zoom: 6,
  },
  {
    name: "Luxembourg",
    code: "LU",
    flag: "🇱🇺",
    center: [49.8153, 6.1296],
    zoom: 10,
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
  const [selectedCountry, setSelectedCountry] = useState<Country>(countries[0]);
  const [searchQuery, setSearchQuery] = useState("");
  const [venueTypesState, setVenueTypesState] = useState(venueTypes);
  const [selectedVenue, setSelectedVenue] = useState(venueTypes[1]);
  const [startDate, setStartDate] = useState("2025-02-08");
  const [endDate, setEndDate] = useState("2025-01-09");
  const [timezone, setTimezone] = useState("Use screen's time zone");
  const [creativesState, setCreativesState] = useState(creatives);
  const [showVenuePreset, setShowVenuePreset] = useState(false);
  const [showTimezone, setShowTimezone] = useState(false);
  const [map, setMap] = useState<L.Map | null>(null);
  const [mapContainer, setMapContainer] = useState<HTMLDivElement | null>(null);

  // Initialize map when component mounts
  useEffect(() => {
    if (mapContainer && !map) {
      const newMap = L.map(mapContainer).setView(
        selectedCountry.center,
        selectedCountry.zoom
      );

      // Add OpenStreetMap tiles
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: "©OpenStreetMap contributors",
        maxZoom: 18,
      }).addTo(newMap);

      // Add custom markers for Belgium
      if (selectedCountry.code === "BE") {
        // Brussels
        const brusselsMarker = L.marker([50.8503, 4.3517])
          .addTo(newMap)
          .bindPopup("Brussels - 2 screens");

        // Antwerp
        const antwerpMarker = L.marker([51.2194, 4.4025])
          .addTo(newMap)
          .bindPopup("Antwerp - 3 screens");

        // Ghent
        const ghentMarker = L.marker([51.05, 3.73])
          .addTo(newMap)
          .bindPopup("Ghent - 1 screen");
      }

      setMap(newMap);
    }

    return () => {
      if (map) {
        map.remove();
        setMap(null);
      }
    };
  }, [mapContainer, selectedCountry]);

  // Update map when country changes
  useEffect(() => {
    if (map) {
      map.setView(selectedCountry.center, selectedCountry.zoom);
      map.eachLayer((layer: L.Layer) => {
        if (layer instanceof L.Marker) {
          map.removeLayer(layer);
        }
      });

      // Add markers for the selected country
      if (selectedCountry.code === "BE") {
        L.marker([50.8503, 4.3517])
          .addTo(map)
          .bindPopup("Brussels - 2 screens");
        L.marker([51.2194, 4.4025]).addTo(map).bindPopup("Antwerp - 3 screens");
        L.marker([51.05, 3.73]).addTo(map).bindPopup("Ghent - 1 screen");
      } else if (selectedCountry.code === "NL") {
        L.marker([52.3676, 4.9041])
          .addTo(map)
          .bindPopup("Amsterdam - 4 screens");
        L.marker([52.0907, 5.1214]).addTo(map).bindPopup("Utrecht - 2 screens");
      } else if (selectedCountry.code === "DE") {
        L.marker([52.52, 13.405]).addTo(map).bindPopup("Berlin - 5 screens");
        L.marker([50.9375, 6.9603]).addTo(map).bindPopup("Cologne - 3 screens");
      }
    }
  }, [selectedCountry, map]);

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

  const handleZoomIn = () => {
    if (map) {
      map.zoomIn();
    }
  };

  const handleZoomOut = () => {
    if (map) {
      map.zoomOut();
    }
  };

  const renderStep1 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Target country
          </label>
          <div className="relative">
            <select
              className="w-full p-3 border border-gray-300 rounded-md bg-white appearance-none cursor-pointer hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
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
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search for city, district or zip code"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-all duration-300"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="text-sm text-gray-500">powered by Google</div>

        <div className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 rounded-full bg-gray-800 flex items-center justify-center">
              <span className="text-white text-xs">2</span>
            </div>
            <span className="text-sm text-gray-700">Targeted country-wide</span>
          </div>

          <p className="text-sm text-gray-600">
            Currently you are targeting all available screens in the country.
            Add locations to specify your targeting.
          </p>
        </div>
      </div>

      <div className="lg:col-span-2">
        <div className="relative rounded-lg overflow-hidden h-96 border border-gray-200">
          <div
            ref={setMapContainer}
            className="w-full h-full"
            style={{ zIndex: 1 }}
          />

          {/* Custom zoom controls */}
          <div className="absolute top-4 right-4 space-y-2 z-10">
            <button
              onClick={handleZoomIn}
              className="bg-white rounded shadow-lg p-2 hover:shadow-xl transition-shadow duration-300"
            >
              <ZoomIn className="h-5 w-5 text-gray-600" />
            </button>
            <button
              onClick={handleZoomOut}
              className="bg-white rounded shadow-lg p-2 hover:shadow-xl transition-shadow duration-300"
            >
              <ZoomOut className="h-5 w-5 text-gray-600" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep2 = () => (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search"
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 hover:border-purple-300 transition-all duration-300"
          />
        </div>

        <div className="flex items-center space-x-2">
          <input type="checkbox" id="unselect-all" className="rounded" />
          <label htmlFor="unselect-all" className="text-sm text-gray-700">
            Unselect all
          </label>
        </div>

        <div className="space-y-2">
          {venueTypesState.map((venue) => (
            <div
              key={venue.id}
              className="flex items-center space-x-3 p-3 rounded-lg hover:bg-gray-50 cursor-pointer"
              onClick={() => setSelectedVenue(venue)}
            >
              <input
                type="checkbox"
                checked={venue.checked}
                onChange={() => handleVenueToggle(venue.id)}
                className="rounded"
              />
              <img
                src={venue.image}
                alt={venue.name}
                className="w-12 h-12 rounded object-cover"
              />
              <span className="text-sm font-medium text-gray-700">
                {venue.name}
              </span>
            </div>
          ))}
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative">
          <label className="text-sm font-medium text-gray-700">
            Venue preset
          </label>
          <button
            className="w-full p-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            onClick={() => setShowVenuePreset(!showVenuePreset)}
          >
            <span>Custom</span>
            {showVenuePreset ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {showVenuePreset && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg">
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
                  className="w-full px-4 py-2 text-left hover:bg-purple-50 flex items-center space-x-2 transition-colors duration-200"
                >
                  <div
                    className={`w-3 h-3 rounded-full ${
                      preset === "Custom"
                        ? "bg-purple-600"
                        : "border border-gray-300"
                    }`}
                  ></div>
                  <span>{preset}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="space-y-4">
        <div className="relative rounded-lg overflow-hidden h-48">
          <img
            src={selectedVenue.image}
            alt={selectedVenue.name}
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">
            &lt; 2/2 &gt;
          </div>
        </div>

        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {selectedVenue.name}
          </h3>
          <p className="text-sm text-gray-600 mb-3">
            {selectedVenue.description}
          </p>

          <div className="flex flex-wrap gap-2">
            {selectedVenue.audiences.map((audience) => (
              <span
                key={audience}
                className="inline-flex items-center space-x-1 bg-gray-100 text-gray-700 text-xs px-2 py-1 rounded"
              >
                <Info className="h-3 w-3" />
                <span>{audience}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">
            Start date
          </label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-red-300 rounded-md focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300"
            />
          </div>
          <p className="text-sm text-red-600">
            Start date must be equal or later than today
          </p>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium text-gray-700">End date</label>
          <div className="relative">
            <Calendar className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="date"
              value={endDate}
              onChange={(e) => setEndDate(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-300"
            />
          </div>
        </div>
      </div>

      <div className="space-y-4">
        <div className="flex items-center space-x-2">
          <h3 className="text-lg font-semibold text-gray-900">Scheduling</h3>
          <Info className="h-4 w-4 text-gray-400" />
        </div>

        <div className="relative">
          <Clock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <button
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-md bg-white text-left flex items-center justify-between hover:border-purple-300 focus:border-purple-500 focus:ring-2 focus:ring-purple-200 transition-all duration-300"
            onClick={() => setShowTimezone(!showTimezone)}
          >
            <span>{timezone}</span>
            {showTimezone ? (
              <ChevronUp className="h-5 w-5" />
            ) : (
              <ChevronDown className="h-5 w-5" />
            )}
          </button>

          {showTimezone && (
            <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-48 overflow-y-auto">
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
                  className="w-full px-4 py-2 text-left hover:bg-purple-50 transition-colors duration-200"
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
        <h3 className="text-lg font-semibold text-gray-900">Creatives</h3>
        <div className="flex space-x-2">
          <button className="p-2 rounded hover:bg-gray-100">
            <div className="w-4 h-4 border-2 border-gray-300"></div>
          </button>
          <button className="p-2 rounded hover:bg-gray-100">
            <div className="w-4 h-4 grid grid-cols-2 gap-0.5">
              <div className="bg-gray-300"></div>
              <div className="bg-gray-300"></div>
              <div className="bg-gray-300"></div>
              <div className="bg-gray-300"></div>
            </div>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {creativesState.map((creative) => (
          <div key={creative.id} className="relative">
            <div className="relative rounded-lg overflow-hidden border border-gray-200 hover:border-purple-300 transition-all duration-300">
              <img
                src={creative.image}
                alt={creative.name}
                className={`w-full object-cover ${
                  creative.type === "portrait" ? "h-48" : "h-24"
                }`}
              />
              <input
                type="checkbox"
                checked={creative.checked}
                onChange={() => handleCreativeToggle(creative.id)}
                className="absolute top-2 right-2 w-4 h-4"
              />
            </div>
            <div className="mt-2">
              <p className="text-sm font-medium text-gray-700">
                {creative.name}
              </p>
              <p className="text-xs text-gray-500">Video</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderStep5 = () => (
    <div className="space-y-6">
      <div className="bg-green-100 border border-green-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm">✓</span>
          </div>
          <span className="text-green-800 font-medium">
            All done. Set a budget and launch your campaign!
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <Eye className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                Estimated impressions
              </span>
            </div>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <BarChart3 className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">
                CPM (Cost Per Mille)
              </span>
            </div>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">EUR 0.00</p>
        </div>

        <div className="bg-white rounded-lg p-4 border border-gray-200">
          <div className="flex items-center justify-between mb-2">
            <div className="flex items-center space-x-2">
              <RotateCcw className="h-5 w-5 text-gray-600" />
              <span className="text-sm text-gray-600">Spots (up to)</span>
            </div>
            <Info className="h-4 w-4 text-gray-400" />
          </div>
          <p className="text-2xl font-bold text-gray-900">0</p>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="relative h-64">
          <img
            src="https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop"
            alt="Campaign Preview"
            className="w-full h-full object-cover"
          />
          <div className="absolute bottom-4 left-4 bg-black/50 text-white text-sm px-2 py-1 rounded">
            &lt; 1/4 &gt;
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
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow duration-300">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center space-x-3">
              <span className="text-lg font-semibold text-gray-900">
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
              <Info className="h-4 w-4 text-gray-400" />
            </div>
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
