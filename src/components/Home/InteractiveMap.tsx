import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { MapPin, Tv, Building2 } from "lucide-react";
import { renderToStaticMarkup } from "react-dom/server";

// Create custom billboard icon
const createBillboardIcon = (color = "#3b82f6") => {
  const iconHtml = renderToStaticMarkup(
    <div
      style={{
        backgroundColor: "white",
        borderRadius: "50%",
        padding: "6px",
        border: `2px solid ${color}`,
        boxShadow: "0 2px 6px rgba(0,0,0,0.3)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <img
        src="/billboard.png"
        alt="Billboard"
        style={{
          width: "24px",
          height: "24px",
          objectFit: "contain",
        }}
      />
    </div>
  );

  return L.divIcon({
    html: iconHtml,
    className: "custom-billboard-icon",
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [0, -18],
  });
};

// Get custom icon based on screen type
const getCustomIcon = (type: string) => {
  switch (type) {
    case "Billboard":
      return createBillboardIcon("#3b82f6"); // blue
    case "Transit Display":
      return createBillboardIcon("#16a34a"); // green
    case "Mall Screen":
      return createBillboardIcon("#9333ea"); // purple
    default:
      return createBillboardIcon("#6b7280"); // gray
  }
};

// Country data with coordinates
const countries = [
  { name: "India", code: "IND", lat: 22.9734, lng: 78.6569, zoom: 5 },
  { name: "Delhi", code: "DEL", lat: 28.7041, lng: 77.1025, zoom: 11 },
  { name: "Mumbai", code: "MUM", lat: 19.076, lng: 72.8777, zoom: 11 },
  { name: "Bengaluru", code: "BLR", lat: 12.9716, lng: 77.5946, zoom: 11 },
  { name: "Chennai", code: "CHE", lat: 13.0827, lng: 80.2707, zoom: 11 },
  { name: "Kolkata", code: "KOL", lat: 22.5726, lng: 88.3639, zoom: 11 },
  { name: "Hyderabad", code: "HYD", lat: 17.385, lng: 78.4867, zoom: 11 },
];

// DOOH screen locations by country
const doohScreens = {
  DEL: [
    {
      name: "Connaught Place Billboard",
      lat: 28.6315,
      lng: 77.2167,
      type: "Billboard",
      location: "Delhi",
    },
    {
      name: "Indira Gandhi Airport Display",
      lat: 28.5562,
      lng: 77.1,
      type: "Transit Display",
      location: "Delhi",
    },
    {
      name: "Select Citywalk Mall",
      lat: 28.5286,
      lng: 77.2197,
      type: "Mall Screen",
      location: "Delhi",
    },
  ],
  MUM: [
    {
      name: "Bandra Station Display",
      lat: 19.0544,
      lng: 72.8406,
      type: "Transit Display",
      location: "Mumbai",
    },
    {
      name: "Marine Drive Billboard",
      lat: 18.943,
      lng: 72.8237,
      type: "Billboard",
      location: "Mumbai",
    },
    {
      name: "Phoenix Marketcity Mall",
      lat: 19.0865,
      lng: 72.8895,
      type: "Mall Screen",
      location: "Mumbai",
    },
  ],
  BLR: [
    {
      name: "Electronic City Tech Park LED",
      lat: 12.8452,
      lng: 77.6601,
      type: "Billboard",
      location: "Bengaluru",
    },
    {
      name: "Whitefield Transit Display",
      lat: 12.9692,
      lng: 77.7498,
      type: "Transit Display",
      location: "Bengaluru",
    },
    {
      name: "Forum Mall Screen",
      lat: 12.9345,
      lng: 77.611,
      type: "Mall Screen",
      location: "Bengaluru",
    },
  ],
  CHE: [
    {
      name: "Marina Beach Billboard",
      lat: 13.0472,
      lng: 80.2824,
      type: "Billboard",
      location: "Chennai",
    },
    {
      name: "Express Avenue Mall",
      lat: 13.0594,
      lng: 80.2597,
      type: "Mall Screen",
      location: "Chennai",
    },
    {
      name: "Chennai Central Station Display",
      lat: 13.0827,
      lng: 80.2757,
      type: "Transit Display",
      location: "Chennai",
    },
  ],
  KOL: [
    {
      name: "Howrah Bridge Billboard",
      lat: 22.585,
      lng: 88.3468,
      type: "Billboard",
      location: "Kolkata",
    },
    {
      name: "Kolkata Airport Display",
      lat: 22.6547,
      lng: 88.4467,
      type: "Transit Display",
      location: "Kolkata",
    },
    {
      name: "Quest Mall Screen",
      lat: 22.539,
      lng: 88.3656,
      type: "Mall Screen",
      location: "Kolkata",
    },
  ],
  HYD: [
    {
      name: "Charminar Billboard",
      lat: 17.3616,
      lng: 78.4747,
      type: "Billboard",
      location: "Hyderabad",
    },
    {
      name: "Rajiv Gandhi Airport Display",
      lat: 17.2403,
      lng: 78.4294,
      type: "Transit Display",
      location: "Hyderabad",
    },
    {
      name: "GVK One Mall",
      lat: 17.412,
      lng: 78.4483,
      type: "Mall Screen",
      location: "Hyderabad",
    },
  ],
};

// Get icon for screen type (for popup display)
const getScreenTypeIcon = (type: string) => {
  switch (type) {
    case "Billboard":
      return <img src="/billboard.png" alt="Billboard" className="w-4 h-4" />;
    case "Transit Display":
      return <MapPin className="w-4 h-4 text-green-600" />;
    case "Mall Screen":
      return <Building2 className="w-4 h-4 text-purple-600" />;
    default:
      return <Tv className="w-4 h-4 text-gray-600" />;
  }
};

// Component to control map programmatically
type MapControllerProps = {
  selectedCountry: {
    lat: number;
    lng: number;
    zoom: number;
    name: string;
    code: string;
  };
  searchLocation: { lat: number; lng: number } | null;
};

function MapController({
  selectedCountry,
  searchLocation,
}: MapControllerProps) {
  const map = useMap();

  useEffect(() => {
    if (searchLocation) {
      map.setView([searchLocation.lat, searchLocation.lng], 13);
    } else {
      map.setView(
        [selectedCountry.lat, selectedCountry.lng],
        selectedCountry.zoom
      );
    }
  }, [map, selectedCountry, searchLocation]);

  return null;
}

// General location search using OpenStreetMap Nominatim
interface GeocodeLocationResult {
  lat: number;
  lng: number;
  place: string;
}

const geocodeLocation = async (
  query: string,
  countryCode: string
): Promise<GeocodeLocationResult> => {
  try {
    const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
      query
    )}&countrycodes=${countryCode.toLowerCase()}&limit=1`;

    const response = await fetch(url, {
      headers: {
        "User-Agent": "DOOH-Map-App/1.0", // recommended for Nominatim
      },
    });

    const data: Array<{ lat: string; lon: string; display_name: string }> =
      await response.json();
    if (data.length > 0) {
      return {
        lat: parseFloat(data[0].lat),
        lng: parseFloat(data[0].lon),
        place: data[0].display_name,
      };
    }
    throw new Error("Location not found");
  } catch (error) {
    throw new Error("Unable to find location for this query");
  }
};

// Geocoding function with fallback support
interface ZippopotamPlace {
  "place name": string;
  longitude: string;
  latitude: string;
  state: string;
}

interface ZippopotamResponse {
  places: ZippopotamPlace[];
}

interface NominatimResult {
  lat: string;
  lon: string;
  display_name: string;
}

interface GeocodePostalCodeResult {
  lat: number;
  lng: number;
  place: string;
  state?: string;
}

const geocodePostalCode = async (
  postalCode: string,
  countryCode: string
): Promise<GeocodePostalCodeResult> => {
  try {
    // First try with Zippopotam API
    const response = await fetch(
      `https://api.zippopotam.us/${countryCode.toLowerCase()}/${postalCode}`
    );

    if (response.ok) {
      const data: ZippopotamResponse = await response.json();
      return {
        lat: parseFloat(data.places[0].latitude),
        lng: parseFloat(data.places[0].longitude),
        place: data.places[0]["place name"],
        state: data.places[0]["state"],
      };
    }

    // Fallback to OpenStreetMap Nominatim
    const nominatimResponse = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&postalcode=${postalCode}&countrycodes=${countryCode.toLowerCase()}&limit=1`,
      {
        headers: {
          "User-Agent": "DOOH-Map-App/1.0",
        },
      }
    );

    if (nominatimResponse.ok) {
      const nominatimData: NominatimResult[] = await nominatimResponse.json();
      if (nominatimData.length > 0) {
        return {
          lat: parseFloat(nominatimData[0].lat),
          lng: parseFloat(nominatimData[0].lon),
          place: nominatimData[0].display_name,
        };
      }
    }

    throw new Error("Location not found");
  } catch (error) {
    throw new Error("Unable to find location for this postal code");
  }
};

export default function InteractiveMap() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentScreens, setCurrentScreens] = useState(doohScreens.DEL);
  const [postalCode, setPostalCode] = useState("");
  const [searchLocation, setSearchLocation] = useState<
    GeocodeLocationResult | GeocodePostalCodeResult | null
  >(null);
  const [isSearching, setIsSearching] = useState(false);
  const [searchError, setSearchError] = useState("");

  interface Country {
    name: string;
    code: string;
    lat: number;
    lng: number;
    zoom: number;
  }

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);

    if (country.code === "IND") {
      // Flatten all markers from every city
      const allScreens = Object.values(doohScreens).flat();
      setCurrentScreens(allScreens);
    } else {
      setCurrentScreens(
        doohScreens[country.code as keyof typeof doohScreens] || []
      );
    }

    setSearchLocation(null);
    setPostalCode("");
    setSearchError("");
  };

  const handleLocationSearch = async () => {
    if (!postalCode.trim()) {
      setSearchError("Please enter a location or postal code");
      return;
    }

    setIsSearching(true);
    setSearchError("");

    try {
      const isPostalCode = /\d/.test(postalCode.trim());
      let location;
      if (isPostalCode) {
        location = await geocodePostalCode(
          postalCode.trim(),
          selectedCountry.code
        );
      } else {
        location = await geocodeLocation(
          postalCode.trim(),
          selectedCountry.code
        );
      }

      setSearchLocation(location);
      setSearchError("");
    } catch (error) {
      setSearchError(
        typeof error === "object" && error !== null && "message" in error
          ? String((error as { message?: string }).message)
          : "An error occurred"
      );
      setSearchLocation(null);
    } finally {
      setIsSearching(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      handleLocationSearch();
    }
  };

  const clearSearch = () => {
    setPostalCode("");
    setSearchLocation(null);
    setSearchError("");
  };

  const filteredScreens = currentScreens.filter(
    (screen) =>
      screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      screen.type.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="flex flex-col lg:flex-row h-auto justify-between align-middle p-4 bg-gray-200 dark:bg-slate-900 lg:pl-[10%]">
      {/* Sidebar */}
      <div className="w-full lg:w-64 bg-white dark:bg-slate-800 shadow-md border-b lg:border-r border-gray-200 dark:border-slate-700 flex flex-col rounded-lg overflow-hidden mb-4 lg:mb-0">
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            DOOH Platform
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Digital Out-of-Home Advertising
          </p>
        </div>

        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Cities
          </label>
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const country = countries.find((c) => c.code === e.target.value);
              if (country) handleCountryChange(country);
            }}
            className="w-full px-2 py-1 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-1 focus:ring-blue-500 bg-white dark:bg-slate-700 text-sm text-gray-900 dark:text-white"
          >
            {countries.map((country) => (
              <option key={country.code} value={country.code}>
                {country.name}
              </option>
            ))}
          </select>
        </div>

        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Location
          </label>
          <div className="flex gap-2 mb-2 items-center">
            <input
              type="text"
              placeholder="Enter location"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onKeyDown={handleKeyPress}
              className="flex-1 min-w-0 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-1 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleLocationSearch}
              disabled={isSearching}
              className="w-9 h-8 flex items-center justify-center bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm transition-colors"
            >
              {isSearching ? "..." : <MapPin className="w-4 h-4" />}
            </button>
          </div>

          {searchError && (
            <p className="text-xs text-red-600 dark:text-red-400 mb-2">
              {searchError}
            </p>
          )}

          {searchLocation && (
            <div className="text-xs bg-green-50 dark:bg-green-900/20 p-2 rounded border border-green-200 dark:border-green-800">
              <p className="text-green-800 dark:text-green-200 font-medium">
                Found:
              </p>
              <p className="text-green-700 dark:text-green-300">
                {searchLocation.place}
              </p>
              {"state" in searchLocation && searchLocation.state && (
                <p className="text-green-600 dark:text-green-400">
                  {searchLocation.state}
                </p>
              )}
              <button
                onClick={clearSearch}
                className="mt-1 text-xs text-green-600 hover:text-green-800 dark:text-green-400 dark:hover:text-green-200 underline"
              >
                Clear search
              </button>
            </div>
          )}
        </div>
      </div>

      <div className="flex-1 lg:pl-4">
        <div className="h-[400px] sm:h-[500px] lg:h-[600px] w-full lg:w-[70vw] rounded-lg shadow-md overflow-hidden">
          <MapContainer
            center={[selectedCountry.lat, selectedCountry.lng]}
            zoom={selectedCountry.zoom}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}"
              subdomains={["mt0", "mt1", "mt2", "mt3"]}
              attribution="&copy; Google Maps"
            />
            <MapController
              selectedCountry={selectedCountry}
              searchLocation={searchLocation}
            />
            {/* Screen markers with custom monitor icons */}
            {filteredScreens.map((screen, idx) => (
              <Marker
                key={idx}
                position={[screen.lat, screen.lng]}
                icon={getCustomIcon(screen.type)}
              >
                <Popup>
                  <div className="p-1">
                    <div className="flex items-center gap-1 mb-1">
                      {getScreenTypeIcon(screen.type)}
                      <h3 className="font-semibold text-gray-900 text-sm">
                        {screen.name}
                      </h3>
                    </div>
                    <p className="text-xs text-gray-600 mb-1">
                      {screen.location}
                    </p>
                    <span className="inline-block px-1 py-0.5 text-[10px] rounded-full bg-blue-100 text-blue-800">
                      {screen.type}
                    </span>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      </div>
    </div>
  );
}
