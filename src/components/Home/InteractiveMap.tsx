import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, MapPin, Monitor, Tv, Building2 } from "lucide-react";

// Fix default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
});

// Country data with coordinates
const countries = [
  { name: "India", code: "IN", lat: 20.5937, lng: 78.9629, zoom: 5 },
  { name: "United States", code: "US", lat: 39.8283, lng: -98.5795, zoom: 4 },
  { name: "United Kingdom", code: "UK", lat: 55.3781, lng: -3.436, zoom: 6 },
  { name: "Germany", code: "DE", lat: 51.1657, lng: 10.4515, zoom: 6 },
  { name: "Japan", code: "JP", lat: 36.2048, lng: 138.2529, zoom: 6 },
  { name: "Australia", code: "AU", lat: -25.2744, lng: 133.7751, zoom: 4 },
  { name: "France", code: "FR", lat: 46.2276, lng: 2.2137, zoom: 6 },
  { name: "Canada", code: "CA", lat: 56.1304, lng: -106.3468, zoom: 4 },
  { name: "Brazil", code: "BR", lat: -14.235, lng: -51.9253, zoom: 4 },
  { name: "China", code: "CN", lat: 35.8617, lng: 104.1954, zoom: 4 },
];

// DOOH screen locations by country
const doohScreens = {
  IN: [
    {
      name: "Connaught Place Billboard",
      lat: 28.6315,
      lng: 77.2167,
      type: "Billboard",
      location: "Delhi",
    },
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
      name: "Outer Ring Road Billboard",
      lat: 12.9295,
      lng: 77.6428,
      type: "Billboard",
      location: "Bengaluru",
    },
    {
      name: "Bellandur Junction Billboard",
      lat: 12.9358,
      lng: 77.6916,
      type: "Billboard",
      location: "Bengaluru",
    },
    {
      name: "Mumbai Airport Display",
      lat: 19.0896,
      lng: 72.8656,
      type: "Transit Display",
      location: "Mumbai",
    },
    {
      name: "Phoenix Mall Screen",
      lat: 12.9279,
      lng: 77.6271,
      type: "Mall Screen",
      location: "Bengaluru",
    },
    {
      name: "Marina Beach Billboard",
      lat: 13.0472,
      lng: 80.2824,
      type: "Billboard",
      location: "Chennai",
    },
    {
      name: "Bandra Station Display",
      lat: 19.0544,
      lng: 72.8406,
      type: "Transit Display",
      location: "Mumbai",
    },
    {
      name: "Express Avenue Mall",
      lat: 13.0594,
      lng: 80.2597,
      type: "Mall Screen",
      location: "Chennai",
    },
  ],
  US: [
    {
      name: "Times Square Billboard",
      lat: 40.758,
      lng: -73.9855,
      type: "Billboard",
      location: "New York",
    },
    {
      name: "LAX Airport Display",
      lat: 33.9425,
      lng: -118.4081,
      type: "Transit Display",
      location: "Los Angeles",
    },
    {
      name: "Beverly Center Mall",
      lat: 34.0759,
      lng: -118.3779,
      type: "Mall Screen",
      location: "Los Angeles",
    },
    {
      name: "Union Station Display",
      lat: 41.8787,
      lng: -87.6394,
      type: "Transit Display",
      location: "Chicago",
    },
    {
      name: "Sunset Boulevard Billboard",
      lat: 34.0983,
      lng: -118.3267,
      type: "Billboard",
      location: "Los Angeles",
    },
  ],
  UK: [
    {
      name: "Piccadilly Circus Billboard",
      lat: 51.51,
      lng: -0.1347,
      type: "Billboard",
      location: "London",
    },
    {
      name: "Heathrow Airport Display",
      lat: 51.47,
      lng: -0.4543,
      type: "Transit Display",
      location: "London",
    },
    {
      name: "Westfield Shopping Centre",
      lat: 51.5074,
      lng: -0.2208,
      type: "Mall Screen",
      location: "London",
    },
    {
      name: "King's Cross Station",
      lat: 51.5308,
      lng: -0.1238,
      type: "Transit Display",
      location: "London",
    },
  ],
  DE: [
    {
      name: "Potsdamer Platz Billboard",
      lat: 52.5096,
      lng: 13.3762,
      type: "Billboard",
      location: "Berlin",
    },
    {
      name: "Frankfurt Airport Display",
      lat: 50.0379,
      lng: 8.5622,
      type: "Transit Display",
      location: "Frankfurt",
    },
    {
      name: "Europa Center Mall",
      lat: 52.5058,
      lng: 13.3359,
      type: "Mall Screen",
      location: "Berlin",
    },
  ],
  JP: [
    {
      name: "Shibuya Crossing Billboard",
      lat: 35.6598,
      lng: 139.7006,
      type: "Billboard",
      location: "Tokyo",
    },
    {
      name: "Narita Airport Display",
      lat: 35.772,
      lng: 140.3929,
      type: "Transit Display",
      location: "Tokyo",
    },
    {
      name: "Ginza Mall Screen",
      lat: 35.6762,
      lng: 139.7603,
      type: "Mall Screen",
      location: "Tokyo",
    },
    {
      name: "Osaka Station Display",
      lat: 34.7024,
      lng: 135.4959,
      type: "Transit Display",
      location: "Osaka",
    },
  ],
  AU: [
    {
      name: "Federation Square Billboard",
      lat: -37.8176,
      lng: 144.9685,
      type: "Billboard",
      location: "Melbourne",
    },
    {
      name: "Sydney Airport Display",
      lat: -33.9399,
      lng: 151.1753,
      type: "Transit Display",
      location: "Sydney",
    },
    {
      name: "Queen Victoria Building",
      lat: -33.8717,
      lng: 151.2062,
      type: "Mall Screen",
      location: "Sydney",
    },
  ],
  FR: [
    {
      name: "Champs-Élysées Billboard",
      lat: 48.8698,
      lng: 2.3081,
      type: "Billboard",
      location: "Paris",
    },
    {
      name: "Charles de Gaulle Airport",
      lat: 49.0097,
      lng: 2.5479,
      type: "Transit Display",
      location: "Paris",
    },
    {
      name: "Galeries Lafayette Mall",
      lat: 48.8738,
      lng: 2.332,
      type: "Mall Screen",
      location: "Paris",
    },
  ],
  CA: [
    {
      name: "CN Tower Billboard",
      lat: 43.6426,
      lng: -79.3871,
      type: "Billboard",
      location: "Toronto",
    },
    {
      name: "Pearson Airport Display",
      lat: 43.6777,
      lng: -79.6248,
      type: "Transit Display",
      location: "Toronto",
    },
    {
      name: "Eaton Centre Mall",
      lat: 43.6544,
      lng: -79.3807,
      type: "Mall Screen",
      location: "Toronto",
    },
  ],
  BR: [
    {
      name: "Paulista Avenue Billboard",
      lat: -23.5618,
      lng: -46.6565,
      type: "Billboard",
      location: "São Paulo",
    },
    {
      name: "GRU Airport Display",
      lat: -23.4356,
      lng: -46.4731,
      type: "Transit Display",
      location: "São Paulo",
    },
    {
      name: "Shopping Iguatemi",
      lat: -23.5515,
      lng: -46.6753,
      type: "Mall Screen",
      location: "São Paulo",
    },
  ],
  CN: [
    {
      name: "Bund Billboard",
      lat: 31.2397,
      lng: 121.499,
      type: "Billboard",
      location: "Shanghai",
    },
    {
      name: "Beijing Capital Airport",
      lat: 40.0801,
      lng: 116.5846,
      type: "Transit Display",
      location: "Beijing",
    },
    {
      name: "IFC Mall Screen",
      lat: 31.2352,
      lng: 121.5062,
      type: "Mall Screen",
      location: "Shanghai",
    },
  ],
};

// Get icon for screen type
const getScreenTypeIcon = (type: string) => {
  switch (type) {
    case "Billboard":
      return <Monitor className="w-4 h-4 text-blue-600" />;
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

export default function DOOHInteractiveMap() {
  const [selectedCountry, setSelectedCountry] = useState(countries[0]);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentScreens, setCurrentScreens] = useState(doohScreens.IN);
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

  interface DOOHScreen {
    name: string;
    lat: number;
    lng: number;
    type: string;
    location: string;
  }

  const handleCountryChange = (country: Country) => {
    setSelectedCountry(country);
    setCurrentScreens(doohScreens[country.code as CountryCode] || []);
    setSearchLocation(null); // Reset search location when country changes
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
      // Check if input looks like a postal code (contains numbers)
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

  interface KeyPressEvent {
    key: string;
    // Add other properties if needed
  }

  const handleKeyPress = (e: KeyPressEvent) => {
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
    <div className="flex h-auto justify-between align-middle pl-[10%] bg-gray-200 dark:bg-slate-900 p-4">
      {/* Sidebar */}
      <div className="w-64 bg-white dark:bg-slate-800 shadow-md border-r border-gray-200 dark:border-slate-700 flex flex-col rounded-lg overflow-hidden">
        {/* Header */}
        <div className="p-4 border-b border-gray-200 dark:border-slate-700">
          <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
            DOOH Platform
          </h1>
          <p className="text-xs text-gray-600 dark:text-gray-300">
            Digital Out-of-Home Advertising
          </p>
        </div>

        {/* Country Selector */}
        <div className="p-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Target Country
          </label>
          <select
            value={selectedCountry.code}
            onChange={(e) => {
              const country = countries.find((c) => c.code === e.target.value);
              if (country) {
                handleCountryChange(country);
              }
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

        {/* Location/Postal Code Search */}
        <div className="p-4 border-t border-gray-200 dark:border-slate-700">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Search Location
          </label>
          <div className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Enter location or postal code..."
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              onKeyPress={handleKeyPress}
              className="flex-1 px-2 py-1 border border-gray-300 dark:border-slate-600 rounded-md focus:ring-1 focus:ring-blue-500 text-sm bg-white dark:bg-slate-700 text-gray-900 dark:text-white"
            />
            <button
              onClick={handleLocationSearch}
              disabled={isSearching}
              className="px-3 py-1 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white rounded-md text-sm transition-colors"
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

      {/* Map Container */}
      <div className="flex-1 pl-4">
        <div className="h-[600px] w-[70vw] rounded-lg shadow-md overflow-hidden">
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
            {/* Screen markers */}
            {filteredScreens.map((screen, idx) => (
              <Marker key={idx} position={[screen.lat, screen.lng]}>
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
