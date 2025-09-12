import React, { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  MapPin,
  Search,
  Navigation,
  Crosshair,
  Info,
  Star,
  Thermometer,
  Users,
  MapIcon,
} from "lucide-react";
import GoogleMapService, {
  LocationDetails,
  LocationSuggestion,
} from "../../services/googleMapService";
import { screensService } from "../../services/screensService";
import { ScreenSearchResult } from "../../api/screens";

interface IndianGoogleMapProps {
  onLocationSelect?: (lat: number, lng: number, address?: string) => void;
  showScreenLocations?: boolean;
  height?: string;
  zoom?: number;
  center?: { lat: number; lng: number };
}

interface ScreenMarker {
  id: number;
  name: string;
  position: { lat: number; lng: number };
  city: string;
  status: "active" | "inactive" | "maintenance";
}

const IndianGoogleMap: React.FC<IndianGoogleMapProps> = ({
  onLocationSelect,
  showScreenLocations = true,
  height = "500px",
  zoom = 5,
  center,
}) => {
  console.log('🚀 IndianGoogleMap component rendered with props:', { showScreenLocations, height, zoom, center });
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);

  // Enhanced location features state
  const [locationDetails, setLocationDetails] =
    useState<LocationDetails | null>(null);
  const [suggestions, setSuggestions] = useState<LocationSuggestion[]>([]);
  const [showLocationPanel, setShowLocationPanel] = useState(false);
  const [isLoadingLocation, setIsLoadingLocation] = useState(false);

  const mapService = GoogleMapService.getInstance();
  const [screenLocations, setScreenLocations] = useState<ScreenMarker[]>([]);
  const [filteredScreens, setFilteredScreens] = useState<ScreenMarker[]>([]);
  const [screensLoading, setScreensLoading] = useState(false);
  const [showScreenSuggestions, setShowScreenSuggestions] = useState(false);

  // Load screens from backend (kept for reference but replaced by inline function)
  const loadScreens = async () => {
    try {
      setScreensLoading(true);
      const screens = await screensService.getAllScreens();
      
      const transformedScreens: ScreenMarker[] = screens
        .filter(screen => screen.latitude && screen.longitude)
        .map((screen: ScreenSearchResult) => {
          const lat = parseFloat(screen.latitude!.toString());
          const lng = parseFloat(screen.longitude!.toString());
          return {
             id: screen.id,
             name: screen.name,
             position: { lat, lng },
             city: screen.city,
             status: (screen.is_active ? "active" : "inactive") as "active" | "inactive" | "maintenance"
           };
        })
        .filter(screen => !isNaN(screen.position.lat) && !isNaN(screen.position.lng));
      
      setScreenLocations(transformedScreens);
    } catch (error) {
      console.error('Failed to load screens:', error);
    } finally {
      setScreensLoading(false);
    }
  };

  // Load screens on component mount
  useEffect(() => {
    const loadScreensWithTest = async () => {
      try {
        console.log('🔄 Starting to load screens...');
        setScreensLoading(true);
        
        // Add test data first to verify markers work
        const testScreens: ScreenMarker[] = [
          {
            id: 999,
            name: "Test Screen Delhi",
            position: { lat: 28.6139, lng: 77.2090 },
            city: "Delhi",
            status: "active"
          },
          {
            id: 998,
            name: "Test Screen Mumbai",
            position: { lat: 19.0760, lng: 72.8777 },
            city: "Mumbai",
            status: "active"
          }
        ];
        console.log('📍 Test screens prepared:', testScreens.length);
        
        try {
          const screens = await screensService.getAllScreens();
          
          const transformedScreens: ScreenMarker[] = screens
            .filter(screen => screen.latitude && screen.longitude)
            .map((screen: ScreenSearchResult) => {
              const lat = parseFloat(screen.latitude!.toString());
              const lng = parseFloat(screen.longitude!.toString());
              return {
                 id: screen.id,
                 name: screen.name,
                 position: { lat, lng },
                 city: screen.city,
                 status: (screen.is_active ? "active" : "inactive") as "active" | "inactive" | "maintenance"
               };
            })
            .filter(screen => !isNaN(screen.position.lat) && !isNaN(screen.position.lng));
          
          // Combine test screens with real screens
          setScreenLocations([...testScreens, ...transformedScreens]);
        } catch (apiError) {
          console.error('Failed to load screens from API:', apiError);
          // If API fails, at least show test screens
          setScreenLocations(testScreens);
        }
      } catch (error) {
        console.error('Failed to load screens:', error);
      } finally {
        setScreensLoading(false);
      }
    };

    loadScreensWithTest();
  }, []);

  // Add screen markers when screen data is loaded
  useEffect(() => {
    if (mapInstance.current && screenLocations.length > 0 && showScreenLocations && (window as any).google?.maps) {
      // Clear existing screen markers
      markersRef.current.forEach((marker) => marker.setMap(null));
      markersRef.current = [];
      
      // Add new screen markers
      addScreenMarkers(mapInstance.current);
      
      // Show marker count indicator
      const markerCountDiv = document.createElement('div');
      markerCountDiv.innerHTML = `📍 ${screenLocations.length} screen markers added`;
      markerCountDiv.style.cssText = 'position: fixed; top: 10px; left: 10px; background: blue; color: white; padding: 8px; border-radius: 4px; z-index: 9999; font-size: 12px;';
      document.body.appendChild(markerCountDiv);
      setTimeout(() => {
        if (document.body.contains(markerCountDiv)) {
          document.body.removeChild(markerCountDiv);
        }
      }, 3000);
    }
  }, [screenLocations, showScreenLocations]);

  // Initialize Google Map
  useEffect(() => {
    const initializeMap = async () => {
      console.log('🗺️ Starting map initialization...');
      if (!mapRef.current) {
        console.log('❌ Map ref not available');
        return;
      }

      try {
        console.log('⏳ Loading Google Maps API...');
        setIsLoading(true);
        const mapService = GoogleMapService.getInstance();
        await mapService.loadGoogleMapsAPI();
        console.log('✅ Google Maps API loaded successfully');

        const mapCenter = center || mapService.getIndiaCenter();
        console.log('🎯 Map center:', mapCenter);

        // Create map
        console.log('🏗️ Creating Google Map instance...');
        const map = new (window as any).google.maps.Map(mapRef.current, {
          center: mapCenter,
          zoom: zoom,
          mapTypeId: "roadmap",
          styles: [
            {
              featureType: "all",
              elementType: "geometry.fill",
              stylers: [{ color: "#f5f5f5" }],
            },
            {
              featureType: "water",
              elementType: "geometry",
              stylers: [{ color: "#c9c9c9" }],
            },
          ],
        });

        mapInstance.current = map;
        console.log('✅ Map instance created and stored');

        // Add enhanced click listener for location details
        map.addListener("click", async (event: any) => {
          const lat = event.latLng.lat();
          const lng = event.latLng.lng();

          if (onLocationSelect) {
            onLocationSelect(lat, lng);
          }

          try {
            setIsLoadingLocation(true);
            // Get location details for clicked position
            const details = await mapService.getReverseGeocodeDetails(lat, lng);
            if (details) {
              setLocationDetails(details);
              setShowLocationPanel(true);
            }
          } catch (error) {
            console.error("Error getting location details for click:", error);
          } finally {
            setIsLoadingLocation(false);
          }
        });

        // Add screen markers if data is already loaded
        if (screenLocations.length > 0 && showScreenLocations) {
          console.log('📍 Adding screen markers to map, count:', screenLocations.length);
          addScreenMarkers(map);
        } else {
          console.log('⚠️ No screen markers to add:', { screenCount: screenLocations.length, showScreens: showScreenLocations });
        }

        setError(null);
        setIsLoading(false);
      } catch (err) {
        console.error("Error initializing map:", err);
        setError("Failed to load map. Please check your internet connection.");
        setIsLoading(false);
      }
    };

    initializeMap();

    return () => {
      // Cleanup
      if (mapInstance.current) {
        markersRef.current.forEach((marker) => marker.setMap(null));
        markersRef.current = [];
      }
    };
  }, [center, zoom, onLocationSelect, showScreenLocations]);

  // Add screen markers to the map
  const addScreenMarkers = (map: any) => {
    console.log('🎯 addScreenMarkers called with:', { mapExists: !!map, screenCount: screenLocations.length });
    if (!(window as any).google?.maps) {
      console.log('❌ Google Maps API not available');
      return;
    }
    console.log('✅ Google Maps API available, adding markers...');
    
    screenLocations.forEach((screen, index) => {
      console.log(`📍 Adding marker ${index + 1}/${screenLocations.length}:`, screen.name, screen.position);
      const markerColor =
        screen.status === "active"
          ? "#22c55e"
          : screen.status === "inactive"
          ? "#ef4444"
          : "#f59e0b";

      const marker = new (window as any).google.maps.Marker({
        position: screen.position,
        map: map,
        title: `${screen.name} - ${screen.city}`,
        icon: {
          url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
            <svg width="24" height="16" viewBox="0 0 24 16" xmlns="http://www.w3.org/2000/svg">
              <rect x="0" y="0" width="24" height="16" fill="${markerColor}" stroke="white" stroke-width="2" rx="2"/>
              <text x="12" y="10" text-anchor="middle" fill="white" font-size="8" font-family="Arial">TV</text>
            </svg>
          `)}`,
          scaledSize: new (window as any).google.maps.Size(24, 16),
          anchor: new (window as any).google.maps.Point(12, 8),
        },
      });

      const infoWindow = new (window as any).google.maps.InfoWindow({
        content: `
          <div style="padding: 10px; min-width: 200px;">
            <h4 style="margin: 0 0 8px 0; color: #1f2937;">${screen.name}</h4>
            <p style="margin: 0 0 4px 0; color: #6b7280;">📍 ${screen.city}</p>
            <p style="margin: 0; color: #6b7280;">
              Status: <span style="color: ${markerColor}; font-weight: 600;">
                ${
                  screen.status.charAt(0).toUpperCase() + screen.status.slice(1)
                }
              </span>
            </p>
          </div>
        `,
      });

      marker.addListener("click", () => {
        infoWindow.open(map, marker);
      });

      markersRef.current.push(marker);
    });
  };

  // Get user's current location
  const getCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const userPos = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };

          setUserLocation(userPos);

          if (mapInstance.current) {
            mapInstance.current.setCenter(userPos);
            mapInstance.current.setZoom(12);

            // Add user location marker
            new (window as any).google.maps.Marker({
              position: userPos,
              map: mapInstance.current,
              title: "Your Location",
              icon: {
                path: (window as any).google.maps.SymbolPath.CIRCLE,
                fillColor: "#3b82f6",
                fillOpacity: 1,
                scale: 10,
                strokeColor: "#ffffff",
                strokeWeight: 3,
              },
            });
          }
        },
        (error) => {
          console.error("Error getting location:", error);
        }
      );
    }
  };

  // Search screens based on query
  const searchScreens = (query: string) => {
    if (query.length < 2) {
      setFilteredScreens([]);
      setShowScreenSuggestions(false);
      return;
    }

    const filtered = screenLocations.filter(screen => 
      screen.name.toLowerCase().includes(query.toLowerCase()) ||
      screen.city.toLowerCase().includes(query.toLowerCase())
    );
    
    setFilteredScreens(filtered.slice(0, 5)); // Limit to 5 suggestions
    setShowScreenSuggestions(filtered.length > 0);
  };

  // Handle screen selection from search
  const selectScreen = (screen: ScreenMarker) => {
    if (mapInstance.current) {
      mapInstance.current.setCenter(screen.position);
      mapInstance.current.setZoom(15);
      
      // Find and trigger click on the screen marker
      const marker = markersRef.current.find(m => 
        m.getTitle() === `${screen.name} - ${screen.city}`
      );
      if (marker) {
        new (window as any).google.maps.event.trigger(marker, 'click');
      }
    }
    
    setSearchQuery('');
    setSuggestions([]);
    setFilteredScreens([]);
    setShowScreenSuggestions(false);
  };

  // Get location suggestions as user types
  const getSuggestionsAsUserTypes = async (query: string) => {
    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    // Also search screens
    searchScreens(query);

    try {
      const suggestions = await mapService.getLocationSuggestions(query);
      setSuggestions(suggestions.slice(0, 5)); // Limit to 5 suggestions
    } catch (error) {
      console.error("Error getting suggestions:", error);
    }
  };

  // Enhanced search for location with detailed information
  const searchLocation = async () => {
    if (!searchQuery.trim()) return;

    try {
      setIsLoadingLocation(true);

      // Get location suggestions first
      const suggestions = await mapService.getLocationSuggestions(searchQuery);
      setSuggestions(suggestions);

      if (suggestions.length > 0) {
        const firstSuggestion = suggestions[0];

        // Get detailed location information
        const details = await mapService.getLocationDetails(
          firstSuggestion.placeId
        );

        if (details) {
          setLocationDetails(details);
          setShowLocationPanel(true);

          if (mapInstance.current) {
            // Center and zoom based on location details
            mapInstance.current.setCenter({
              lat: details.coordinates.lat,
              lng: details.coordinates.lng,
            });
            mapInstance.current.setZoom(details.mapDisplay.zoom);

            // Add enhanced marker with location info
            const marker = new (window as any).google.maps.Marker({
              position: {
                lat: details.coordinates.lat,
                lng: details.coordinates.lng,
              },
              map: mapInstance.current,
              title: details.placeInfo.name || searchQuery,
              icon: {
                path: (window as any).google.maps.SymbolPath
                  .FORWARD_CLOSED_ARROW,
                fillColor: "#ef4444",
                fillOpacity: 1,
                scale: 8,
                strokeColor: "#ffffff",
                strokeWeight: 2,
              },
            });

            // Add info window with location details
            const infoWindow = new (window as any).google.maps.InfoWindow({
              content: `
                <div class="p-3 max-w-sm">
                  <h3 class="font-bold text-lg mb-2">${
                    details.placeInfo.name || "Location"
                  }</h3>
                  <p class="text-sm text-gray-600 mb-2">${
                    details.formattedAddress
                  }</p>
                  ${
                    details.locationContext.nearestCity
                      ? `<p class="text-xs text-blue-600">Near: ${details.locationContext.nearestCity.name}, ${details.locationContext.nearestCity.state}</p>`
                      : ""
                  }
                  ${
                    details.locationContext.climate
                      ? `<p class="text-xs text-green-600">Climate: ${details.locationContext.climate}</p>`
                      : ""
                  }
                  <p class="text-xs text-gray-500 mt-2">Type: ${
                    details.placeInfo.types?.join(", ") || "Location"
                  }</p>
                </div>
              `,
            });

            marker.addListener("click", () => {
              infoWindow.open(mapInstance.current, marker);
            });

            // Auto-open info window
            setTimeout(() => infoWindow.open(mapInstance.current, marker), 500);
          }

          // Call location select callback if provided
          if (onLocationSelect) {
            onLocationSelect(
              details.coordinates.lat,
              details.coordinates.lng,
              details.formattedAddress
            );
          }
        }
      }
    } catch (error) {
      console.error("Enhanced search error:", error);
      setError("Failed to search location. Please try again.");
    } finally {
      setIsLoadingLocation(false);
    }
  };

  if (error) {
    return (
      <div
        className="w-full bg-red-50 border border-red-200 rounded-lg p-8 text-center"
        style={{ height }}
      >
        <div className="text-red-600 mb-4">
          <MapPin className="w-12 h-12 mx-auto mb-2" />
          <p className="font-semibold">Map Error</p>
          <p className="text-sm">{error}</p>
        </div>
        <button
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition-colors"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="relative w-full rounded-lg overflow-hidden border border-gray-200">
      {/* Enhanced Search Bar with Suggestions */}
      <div className="absolute top-4 left-4 right-4 z-10 flex gap-2">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex-1 relative"
        >
          <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
          <motion.input
            whileFocus={{ scale: 1.02 }}
            type="text"
            value={searchQuery}
            onChange={(e) => {
              const value = e.target.value;
              setSearchQuery(value);
              getSuggestionsAsUserTypes(value);
            }}
            onKeyPress={(e) => e.key === "Enter" && searchLocation()}
            onFocus={() => {
              if (searchQuery.length >= 3) {
                getSuggestionsAsUserTypes(searchQuery);
              }
            }}
            onBlur={() => {
              // Clear suggestions after a delay to allow clicks on suggestions
              setTimeout(() => {
                setSuggestions([]);
                setFilteredScreens([]);
                setShowScreenSuggestions(false);
              }, 200);
            }}
            placeholder="Search cities, landmarks, or screens..."
            className="w-full pl-10 pr-4 py-2 bg-white rounded-lg shadow-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
          />

          {/* Search Suggestions Dropdown */}
          {(suggestions.length > 0 || showScreenSuggestions) && searchQuery.length > 2 && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="absolute top-full mt-1 w-full bg-white rounded-lg shadow-lg border border-gray-200 max-h-64 overflow-y-auto z-20"
            >
              {/* Screen Suggestions */}
              {showScreenSuggestions && filteredScreens.length > 0 && (
                <>
                  <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                    📺 Screens
                  </div>
                  {filteredScreens.map((screen, index) => (
                    <motion.div
                      key={`screen-${screen.id}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      onClick={() => selectScreen(screen)}
                      className="p-3 hover:bg-blue-50 cursor-pointer border-b border-gray-100 transition-colors"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <div className="font-medium text-sm text-gray-900">
                            {screen.name}
                          </div>
                          <div className="text-xs text-gray-600">
                            📍 {screen.city}
                          </div>
                        </div>
                        <div className={`w-2 h-2 rounded-full ${
                          screen.status === 'active' ? 'bg-green-500' : 
                          screen.status === 'inactive' ? 'bg-red-500' : 'bg-yellow-500'
                        }`}></div>
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
              
              {/* Location Suggestions */}
              {suggestions.length > 0 && (
                <>
                  {showScreenSuggestions && filteredScreens.length > 0 && (
                    <div className="px-3 py-2 bg-gray-50 border-b border-gray-200 text-xs font-semibold text-gray-700 uppercase tracking-wide">
                      📍 Locations
                    </div>
                  )}
                  {suggestions.map((suggestion, index) => (
                    <motion.div
                      key={`location-${index}`}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: (filteredScreens.length + index) * 0.05 }}
                      onClick={() => {
                        setSearchQuery(suggestion.description);
                        setSuggestions([]);
                        setFilteredScreens([]);
                        setShowScreenSuggestions(false);
                        searchLocation();
                      }}
                      className="p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0 transition-colors"
                    >
                      <div className="font-medium text-sm text-gray-900">
                        {suggestion.mainText}
                      </div>
                      <div className="text-xs text-gray-600">
                        {suggestion.secondaryText}
                      </div>
                    </motion.div>
                  ))}
                </>
              )}
            </motion.div>
          )}
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={searchLocation}
          disabled={isLoadingLocation}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoadingLocation ? (
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
              className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
            />
          ) : (
            "Search"
          )}
        </motion.button>
      </div>

      {/* Location Button */}
      <div className="absolute top-4 right-4 z-10">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={getCurrentLocation}
          className="p-2 bg-white rounded-lg shadow-lg hover:bg-gray-50 transition-colors"
          title="Get Current Location"
        >
          <Crosshair className="w-5 h-5 text-gray-600" />
        </motion.button>
      </div>

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-gray-100 flex items-center justify-center z-20">
          <div className="text-center">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4"
            />
            <p className="text-gray-600">Loading Indian Map...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} style={{ height, width: "100%" }} />

      {/* Legend */}
      {showScreenLocations && !isLoading && (
        <div className="absolute bottom-4 left-4 bg-white rounded-lg shadow-lg p-3 z-10">
          <h4 className="font-semibold text-sm text-gray-800 mb-2">
            Screen Status
          </h4>
          <div className="space-y-1 text-xs">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span>Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span>Inactive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span>Maintenance</span>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Location Details Panel */}
      <AnimatePresence>
        {showLocationPanel && locationDetails && (
          <motion.div
            initial={{ x: 400, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: 400, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute top-20 right-4 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-20 max-h-96 overflow-y-auto"
          >
            <div className="p-4">
              {/* Header */}
              <div className="flex justify-between items-start mb-3">
                <div>
                  <h3 className="font-bold text-lg text-gray-900">
                    {locationDetails.placeInfo.name || "Location Details"}
                  </h3>
                  <p className="text-sm text-gray-600 mt-1">
                    {locationDetails.formattedAddress}
                  </p>
                </div>
                <button
                  onClick={() => setShowLocationPanel(false)}
                  className="p-1 hover:bg-gray-100 rounded-full transition-colors"
                >
                  ✕
                </button>
              </div>

              {/* Coordinates */}
              <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Navigation className="w-4 h-4 text-blue-600" />
                  <span className="text-sm font-medium text-blue-900">
                    Coordinates
                  </span>
                </div>
                <div className="text-xs text-blue-800 space-y-1">
                  <div>Lat: {locationDetails.coordinates.lat.toFixed(6)}</div>
                  <div>Lng: {locationDetails.coordinates.lng.toFixed(6)}</div>
                </div>
              </div>

              {/* Location Context */}
              {locationDetails.locationContext.nearestCity && (
                <div className="mb-4 p-3 bg-green-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <MapIcon className="w-4 h-4 text-green-600" />
                    <span className="text-sm font-medium text-green-900">
                      Nearest City
                    </span>
                  </div>
                  <div className="text-xs text-green-800 space-y-1">
                    <div className="font-medium">
                      {locationDetails.locationContext.nearestCity.name}
                    </div>
                    <div>
                      {locationDetails.locationContext.nearestCity.state}
                    </div>
                    <div>
                      Region:{" "}
                      {locationDetails.locationContext.nearestCity.region}
                    </div>
                    {locationDetails.locationContext
                      .distanceFromNearestCity && (
                      <div>
                        Distance:{" "}
                        {locationDetails.locationContext.distanceFromNearestCity.toFixed(
                          1
                        )}{" "}
                        km
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* Climate Info */}
              {locationDetails.locationContext.climate && (
                <div className="mb-4 p-3 bg-orange-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Thermometer className="w-4 h-4 text-orange-600" />
                    <span className="text-sm font-medium text-orange-900">
                      Climate
                    </span>
                  </div>
                  <div className="text-xs text-orange-800">
                    {locationDetails.locationContext.climate}
                  </div>
                </div>
              )}

              {/* Place Info */}
              <div className="mb-4 p-3 bg-purple-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Info className="w-4 h-4 text-purple-600" />
                  <span className="text-sm font-medium text-purple-900">
                    Place Information
                  </span>
                </div>
                <div className="text-xs text-purple-800 space-y-1">
                  {locationDetails.placeInfo.types && (
                    <div>
                      <span className="font-medium">Type:</span>{" "}
                      {locationDetails.placeInfo.types.join(", ")}
                    </div>
                  )}
                  {locationDetails.placeInfo.rating && (
                    <div className="flex items-center gap-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{locationDetails.placeInfo.rating}</span>
                      {locationDetails.placeInfo.userRatingsTotal && (
                        <span className="text-gray-600">
                          ({locationDetails.placeInfo.userRatingsTotal} reviews)
                        </span>
                      )}
                    </div>
                  )}
                  {locationDetails.placeInfo.businessStatus && (
                    <div>
                      <span className="font-medium">Status:</span>{" "}
                      {locationDetails.placeInfo.businessStatus}
                    </div>
                  )}
                </div>
              </div>

              {/* Address Components */}
              <div className="p-3 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="w-4 h-4 text-gray-600" />
                  <span className="text-sm font-medium text-gray-900">
                    Address Details
                  </span>
                </div>
                <div className="text-xs text-gray-800 space-y-1">
                  {locationDetails.addressComponents.locality && (
                    <div>
                      <span className="font-medium">City:</span>{" "}
                      {locationDetails.addressComponents.locality}
                    </div>
                  )}
                  {locationDetails.addressComponents
                    .administrativeAreaLevel2 && (
                    <div>
                      <span className="font-medium">District:</span>{" "}
                      {
                        locationDetails.addressComponents
                          .administrativeAreaLevel2
                      }
                    </div>
                  )}
                  {locationDetails.addressComponents
                    .administrativeAreaLevel1 && (
                    <div>
                      <span className="font-medium">State:</span>{" "}
                      {
                        locationDetails.addressComponents
                          .administrativeAreaLevel1
                      }
                    </div>
                  )}
                  {locationDetails.addressComponents.postalCode && (
                    <div>
                      <span className="font-medium">PIN:</span>{" "}
                      {locationDetails.addressComponents.postalCode}
                    </div>
                  )}
                </div>
              </div>

              {/* Loading indicator for location details */}
              {isLoadingLocation && (
                <div className="absolute inset-0 bg-white bg-opacity-90 flex items-center justify-center rounded-lg">
                  <div className="flex items-center gap-2 text-gray-600">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        ease: "linear",
                      }}
                      className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full"
                    />
                    Loading details...
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default IndianGoogleMap;
