import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Search, Star, MapPin } from "lucide-react";
import { getAllScreens, ScreenSearchResult } from "../../api/screens";
import { useFavorites } from "../../contexts/FavoritesContext";

// Fix leaflet icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

interface MapScreen {
  id: number;
  name: string;
  lat: number;
  lng: number;
  type: string;
  location: string;
  city: string;
}

const convertToMapScreen = (screen: ScreenSearchResult): MapScreen | null => {
  if (!screen.latitude || !screen.longitude) return null;

  return {
    id: screen.id,
    name: screen.name,
    lat: screen.latitude,
    lng: screen.longitude,
    type: screen.screen_type || "Billboard",
    location: screen.address,
    city: screen.city,
  };
};

const cities = [
  { name: "Delhi", lat: 28.6139, lng: 77.209, zoom: 11 },
  { name: "Mumbai", lat: 19.076, lng: 72.8777, zoom: 11 },
  { name: "Bengaluru", lat: 12.9716, lng: 77.5946, zoom: 11 },
];

const InteractiveMap: React.FC = () => {
  const [selectedCity, setSelectedCity] = useState("All Cities");
  const [searchTerm, setSearchTerm] = useState("");
  const [screens, setScreens] = useState<MapScreen[]>([]);
  const [loading, setLoading] = useState(true);
  const { favoriteScreenIds, toggleFavorite } = useFavorites();

  useEffect(() => {
    const loadScreens = async () => {
      try {
        setLoading(true);
        const apiScreens = await getAllScreens();
        const mapScreens = apiScreens
          .map(convertToMapScreen)
          .filter((screen): screen is MapScreen => screen !== null);

        const sorted = mapScreens.sort((a, b) => {
          const aFav = favoriteScreenIds.has(a.id);
          const bFav = favoriteScreenIds.has(b.id);
          if (aFav && !bFav) return -1;
          if (!aFav && bFav) return 1;
          return 0;
        });

        setScreens(sorted);
      } catch (error) {
        console.error("Failed to load screens:", error);
      } finally {
        setLoading(false);
      }
    };

    loadScreens();
  }, [favoriteScreenIds]);

  const filteredScreens = screens.filter((screen) => {
    const matchesSearch = screen.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const matchesCity =
      selectedCity === "All Cities" || screen.city === selectedCity;
    return matchesSearch && matchesCity;
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
          className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full"
        />
      </div>
    );
  }

  return (
    <div className="w-full h-screen bg-gray-50">
      <div className="bg-white shadow-sm border-b p-4">
        <div className="max-w-7xl mx-auto flex flex-col lg:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search screens..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div className="flex gap-2 flex-wrap">
            {["All Cities", ...cities.map((city) => city.name)].map((city) => (
              <button
                key={city}
                onClick={() => setSelectedCity(city)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                  selectedCity === city
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                {city}
              </button>
            ))}
          </div>
        </div>
      </div>

      <div className="flex h-[calc(100vh-100px)]">
        <div className="flex-1">
          <MapContainer
            center={[20.5937, 78.9629]}
            zoom={5}
            className="h-full w-full"
            zoomControl={true}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />

            {filteredScreens.map((screen) => (
              <Marker key={screen.id} position={[screen.lat, screen.lng]}>
                <Popup>
                  <div className="p-2">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold">{screen.name}</h3>
                      <button
                        onClick={() => toggleFavorite(screen.id)}
                        className={
                          favoriteScreenIds.has(screen.id)
                            ? "text-yellow-500"
                            : "text-gray-400"
                        }
                      >
                        <Star
                          className="w-4 h-4"
                          fill={
                            favoriteScreenIds.has(screen.id)
                              ? "currentColor"
                              : "none"
                          }
                        />
                      </button>
                    </div>
                    <p className="text-sm text-gray-600 mt-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {screen.location}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">
                        {screen.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {screen.city}
                      </span>
                    </div>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>

        <div className="w-80 bg-white border-l overflow-y-auto">
          <div className="p-4 border-b">
            <h2 className="text-lg font-semibold text-gray-900">
              Available Screens ({filteredScreens.length})
            </h2>
            {favoriteScreenIds.size > 0 && (
              <p className="text-sm text-gray-600 mt-1">
                ⭐ Favorites shown first
              </p>
            )}
          </div>

          <div className="divide-y">
            {filteredScreens.map((screen) => (
              <div key={screen.id} className="p-4 hover:bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-gray-900">
                        {screen.name}
                      </h3>
                      {favoriteScreenIds.has(screen.id) && (
                        <Star
                          className="w-4 h-4 text-yellow-500"
                          fill="currentColor"
                        />
                      )}
                    </div>
                    <p className="text-sm text-gray-500 mt-1">
                      <MapPin className="w-3 h-3 inline mr-1" />
                      {screen.location}
                    </p>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded">
                        {screen.type}
                      </span>
                      <span className="text-xs text-gray-500">
                        {screen.city}
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={() => toggleFavorite(screen.id)}
                    className={`p-1 rounded ${
                      favoriteScreenIds.has(screen.id)
                        ? "text-yellow-500"
                        : "text-gray-300 hover:text-yellow-400"
                    }`}
                  >
                    <Star
                      className="w-4 h-4"
                      fill={
                        favoriteScreenIds.has(screen.id)
                          ? "currentColor"
                          : "none"
                      }
                    />
                  </button>
                </div>
              </div>
            ))}

            {filteredScreens.length === 0 && (
              <div className="p-8 text-center text-gray-500">
                <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No screens found.</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default InteractiveMap;
