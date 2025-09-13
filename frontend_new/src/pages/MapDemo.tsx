import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Navigation,
  Globe,
  Search,
  Home,
  ArrowLeft,
  ExternalLink,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import IndianGoogleMap from "../components/Map/IndianGoogleMap";
import GoogleMapService from "../services/googleMapService";
import MapBreadcrumb from "../components/Navigation/MapBreadcrumb";

const MapDemo: React.FC = () => {
  const navigate = useNavigate();
  const [selectedLocation, setSelectedLocation] = useState<{
    lat: number;
    lng: number;
    address?: string;
  } | null>(null);
  const [searchResults, setSearchResults] = useState<any[]>([]);

  const mapService = GoogleMapService.getInstance();
  const indianCities = mapService.getIndianCities();

  const handleLocationSelect = (lat: number, lng: number, address?: string) => {
    setSelectedLocation({ lat, lng, address });
  };

  const handleCityClick = (city: any) => {
    setSelectedLocation({
      lat: city.coordinates.lat,
      lng: city.coordinates.lng,
      address: `${city.name}, ${city.state}`,
    });
  };

  const searchCities = (query: string) => {
    const results = mapService.searchCities(query);
    setSearchResults(results.slice(0, 5)); // Show top 5 results
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-8">
      {/* Breadcrumb Navigation */}
      <MapBreadcrumb />

      {/* Navigation Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6"
      >
        <div className="flex items-center justify-between bg-white rounded-xl shadow-lg p-4 border border-gray-200">
          <div className="flex items-center gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/")}
              className="flex items-center gap-2 px-4 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate("/map-dashboard")}
              className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              <Home className="w-4 h-4" />
              Dashboard
            </motion.button>
          </div>

          <div className="flex items-center gap-2">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => window.open("/map-dashboard", "_blank")}
              className="flex items-center gap-2 px-3 py-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              Open in Dashboard
            </motion.button>
          </div>
        </div>
      </motion.div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-8"
        >
          <h1 className="text-4xl font-bold text-gray-900 mb-4 flex items-center justify-center gap-3">
            <Globe className="w-10 h-10 text-blue-600" />
            Indian Digital Billboard Map
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Explore digital screen locations across India with real-time data
            and Google Maps integration
          </p>
        </motion.div>

        {/* Map Container */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1 space-y-6">
            {/* Search */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <Search className="w-5 h-5" />
                Search Cities
              </h3>
              <input
                type="text"
                placeholder="Search Indian cities..."
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                onChange={(e) => searchCities(e.target.value)}
              />
              {searchResults.length > 0 && (
                <div className="mt-3 space-y-2">
                  {searchResults.map((city) => (
                    <button
                      key={city.name}
                      onClick={() => handleCityClick(city)}
                      className="w-full text-left p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <div className="font-medium text-gray-800">
                        {city.name}
                      </div>
                      <div className="text-sm text-gray-600">
                        {city.state} • {city.region}
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </motion.div>

            {/* Popular Cities */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="bg-white rounded-lg shadow-lg p-6"
            >
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Popular Cities
              </h3>
              <div className="space-y-2">
                {indianCities.slice(0, 8).map((city) => (
                  <button
                    key={city.name}
                    onClick={() => handleCityClick(city)}
                    className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-colors border border-gray-200"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-800">
                          {city.name}
                        </div>
                        <div className="text-sm text-gray-600">
                          {city.state}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-xs text-gray-500">
                          {city.region}
                        </div>
                        <div className="text-xs text-blue-600">
                          {(city.population / 1000000).toFixed(1)}M
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </motion.div>

            {/* Selected Location */}
            {selectedLocation && (
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="bg-green-50 border border-green-200 rounded-lg p-4"
              >
                <h4 className="font-semibold text-green-800 mb-2 flex items-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Selected Location
                </h4>
                <div className="text-sm text-green-700">
                  <p>
                    <strong>Latitude:</strong> {selectedLocation.lat.toFixed(6)}
                  </p>
                  <p>
                    <strong>Longitude:</strong>{" "}
                    {selectedLocation.lng.toFixed(6)}
                  </p>
                  {selectedLocation.address && (
                    <p>
                      <strong>Address:</strong> {selectedLocation.address}
                    </p>
                  )}
                </div>
              </motion.div>
            )}
          </div>

          {/* Map */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2 }}
            className="lg:col-span-2"
          >
            <div className="bg-white rounded-lg shadow-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Digital Screen Locations Map
                </h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Navigation className="w-4 h-4" />
                  Click anywhere to select location
                </div>
              </div>

              <IndianGoogleMap
                onLocationSelect={handleLocationSelect}
                showScreenLocations={true}
                height="600px"
                center={
                  selectedLocation
                    ? {
                        lat: selectedLocation.lat,
                        lng: selectedLocation.lng,
                      }
                    : undefined
                }
                zoom={selectedLocation ? 10 : 5}
              />
            </div>
          </motion.div>
        </div>

        {/* Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="mt-8 grid grid-cols-1 md:grid-cols-4 gap-6"
        >
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-blue-600 mb-2">
              {indianCities.length}
            </div>
            <div className="text-gray-600">Cities Covered</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-green-600 mb-2">1000+</div>
            <div className="text-gray-600">Active Screens</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-purple-600 mb-2">28</div>
            <div className="text-gray-600">States & UTs</div>
          </div>
          <div className="bg-white rounded-lg shadow-lg p-6 text-center">
            <div className="text-3xl font-bold text-orange-600 mb-2">5</div>
            <div className="text-gray-600">Geographic Regions</div>
          </div>
        </motion.div>

        {/* Features */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="mt-8 bg-white rounded-lg shadow-lg p-8"
        >
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Map Features
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="w-6 h-6 text-blue-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">
                Real-time Locations
              </h4>
              <p className="text-gray-600 text-sm">
                Accurate coordinates for all digital screens across India
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-6 h-6 text-green-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Smart Search</h4>
              <p className="text-gray-600 text-sm">
                Search by city names, states, or geographic regions
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="w-6 h-6 text-purple-600" />
              </div>
              <h4 className="font-semibold text-gray-800 mb-2">Google Maps</h4>
              <p className="text-gray-600 text-sm">
                Powered by Google Maps API for accurate location data
              </p>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default MapDemo;
