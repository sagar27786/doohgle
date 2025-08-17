import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { motion } from 'framer-motion';
import { MapPin, Users, Navigation, Crosshair, Search } from 'lucide-react';
import LocationService, { LocationData, NearbyLocation } from '../../services/locationService';
import GeolocationService from '../../services/geolocationService';

// Fix for default markers in Leaflet
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
  iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
  shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

interface IndianMapProps {
  showUserLocation?: boolean;
  showNearbyUsers?: boolean;
  onLocationSelect?: (lat: number, lng: number) => void;
  height?: string;
  className?: string;
}

const IndianMap: React.FC<IndianMapProps> = ({
  showUserLocation = true,
  showNearbyUsers = false,
  onLocationSelect,
  height = '600px',
  className = ''
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<L.Map | null>(null);
  const userMarker = useRef<L.Marker | null>(null);
  const nearbyMarkers = useRef<L.Marker[]>([]);
  
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userLocation, setUserLocation] = useState<LocationData | null>(null);
  const [nearbyLocations, setNearbyLocations] = useState<NearbyLocation[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapReady, setMapReady] = useState(false);

  const geolocationService = GeolocationService.getInstance();

  // Initialize map
  useEffect(() => {
    if (!mapRef.current || mapInstance.current) return;

    // Create map centered on India
    const map = L.map(mapRef.current).setView([20.5937, 78.9629], 5);

    // Add OpenStreetMap tile layer
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors',
      maxZoom: 18,
      minZoom: 4,
    }).addTo(map);

    // Add satellite view option
    const satellite = L.tileLayer('https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}', {
      attribution: 'Esri, DigitalGlobe, GeoEye, Earthstar Geographics, CNES/Airbus DS, USDA, USGS, AeroGRID, IGN, and the GIS User Community',
      maxZoom: 18,
    });

    // Add layer control
    const baseLayers = {
      'Street Map': L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'),
      'Satellite': satellite
    };

    L.control.layers(baseLayers).addTo(map);

    // Add click handler for location selection
    if (onLocationSelect) {
      map.on('click', (e) => {
        const { lat, lng } = e.latlng;
        onLocationSelect(lat, lng);
      });
    }

    mapInstance.current = map;
    setMapReady(true);

    return () => {
      if (mapInstance.current) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [onLocationSelect]);

  // Load user location
  const loadUserLocation = async () => {
    if (!mapInstance.current) return;
    
    setIsLoading(true);
    setError(null);

    try {
      const locationData = await LocationService.getUserLocation();
      const primaryLocation = locationData.primary;
      
      if (primaryLocation) {
        setUserLocation(primaryLocation);
        
        // Add/update user marker
        if (userMarker.current) {
          mapInstance.current.removeLayer(userMarker.current);
        }

        // Custom user location icon
        const userIcon = L.divIcon({
          html: `
            <div style="
              width: 20px; 
              height: 20px; 
              background: #3B82F6; 
              border: 3px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          className: 'user-location-marker',
          iconSize: [20, 20],
          iconAnchor: [10, 10]
        });

        userMarker.current = L.marker(
          [primaryLocation.latitude, primaryLocation.longitude],
          { icon: userIcon }
        )
        .addTo(mapInstance.current)
        .bindPopup(`
          <div class="p-2">
            <h4 class="font-semibold text-blue-600">Your Location</h4>
            <p class="text-sm text-gray-600">${LocationService.formatLocationDisplay(primaryLocation)}</p>
            <p class="text-xs text-gray-500 mt-1">
              Accuracy: ${geolocationService.getAccuracyDescription(primaryLocation.accuracy || 0)}
            </p>
          </div>
        `);

        // Center map on user location
        mapInstance.current.setView([primaryLocation.latitude, primaryLocation.longitude], 12);
      }
    } catch (err: any) {
      console.error('Error loading user location:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Load nearby locations
  const loadNearbyLocations = async () => {
    if (!userLocation || !mapInstance.current) return;

    try {
      const nearby = await LocationService.getNearbyLocations(
        userLocation.latitude,
        userLocation.longitude,
        50 // 50km radius
      );
      
      setNearbyLocations(nearby.locations);

      // Clear existing nearby markers
      nearbyMarkers.current.forEach(marker => {
        mapInstance.current?.removeLayer(marker);
      });
      nearbyMarkers.current = [];

      // Add nearby user markers
      nearby.locations.forEach((location) => {
        const nearbyIcon = L.divIcon({
          html: `
            <div style="
              width: 16px; 
              height: 16px; 
              background: #10B981; 
              border: 2px solid white; 
              border-radius: 50%; 
              box-shadow: 0 1px 3px rgba(0,0,0,0.3);
            "></div>
          `,
          className: 'nearby-user-marker',
          iconSize: [16, 16],
          iconAnchor: [8, 8]
        });

        const marker = L.marker([location.latitude, location.longitude], { icon: nearbyIcon })
          .addTo(mapInstance.current!)
          .bindPopup(`
            <div class="p-2">
              <h4 class="font-semibold text-green-600">User Location</h4>
              <p class="text-sm text-gray-600">${location.city || 'Unknown City'}</p>
              <p class="text-xs text-gray-500">
                Distance: ${location.distance.toFixed(1)} km
              </p>
            </div>
          `);

        nearbyMarkers.current.push(marker);
      });

    } catch (err) {
      console.error('Error loading nearby locations:', err);
    }
  };

  // Get current location from browser
  const getCurrentLocation = async () => {
    setIsLoading(true);
    setError(null);

    try {
      await LocationService.getCurrentLocationAndSave();
      await loadUserLocation();
    } catch (err: any) {
      console.error('Error getting current location:', err);
      setError(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Search for a location
  const searchLocation = async () => {
    if (!searchQuery.trim() || !mapInstance.current) return;

    setIsLoading(true);
    try {
      // Use Nominatim for geocoding
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}&limit=1&countrycodes=IN`
      );
      const results = await response.json();

      if (results && results.length > 0) {
        const result = results[0];
        const lat = parseFloat(result.lat);
        const lon = parseFloat(result.lon);

        mapInstance.current.setView([lat, lon], 12);
        
        // Add temporary search marker
        const searchIcon = L.divIcon({
          html: `
            <div style="
              width: 24px; 
              height: 24px; 
              background: #EF4444; 
              border: 3px solid white; 
              border-radius: 50%; 
              box-shadow: 0 2px 4px rgba(0,0,0,0.3);
            "></div>
          `,
          className: 'search-result-marker',
          iconSize: [24, 24],
          iconAnchor: [12, 12]
        });

        const searchMarker = L.marker([lat, lon], { icon: searchIcon })
          .addTo(mapInstance.current)
          .bindPopup(`
            <div class="p-2">
              <h4 class="font-semibold text-red-600">Search Result</h4>
              <p class="text-sm text-gray-600">${result.display_name}</p>
            </div>
          `)
          .openPopup();

        // Remove search marker after 5 seconds
        setTimeout(() => {
          mapInstance.current?.removeLayer(searchMarker);
        }, 5000);

        if (onLocationSelect) {
          onLocationSelect(lat, lon);
        }
      } else {
        setError('Location not found in India');
      }
    } catch (err) {
      setError('Search failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Load user location on component mount
  useEffect(() => {
    if (mapReady && showUserLocation) {
      loadUserLocation();
    }
  }, [mapReady, showUserLocation]);

  // Load nearby locations when user location changes
  useEffect(() => {
    if (showNearbyUsers && userLocation) {
      loadNearbyLocations();
    }
  }, [showNearbyUsers, userLocation]);

  return (
    <div className={`relative ${className}`}>
      {/* Map Container */}
      <div
        ref={mapRef}
        style={{ height }}
        className="w-full rounded-lg overflow-hidden border border-gray-200"
      />

      {/* Controls Overlay */}
      <div className="absolute top-4 left-4 right-4 z-[1000] flex items-start justify-between">
        {/* Search Bar */}
        <motion.div
          className="bg-white rounded-lg shadow-lg p-2 flex items-center space-x-2 max-w-xs"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Search className="w-4 h-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search locations in India..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && searchLocation()}
            className="flex-1 text-sm outline-none"
            disabled={isLoading}
          />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex space-x-2">
          {showUserLocation && (
            <motion.button
              onClick={getCurrentLocation}
              disabled={isLoading}
              className="bg-blue-600 text-white p-2 rounded-lg shadow-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Get Current Location"
            >
              {isLoading ? (
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                <Crosshair className="w-4 h-4" />
              )}
            </motion.button>
          )}

          {userLocation && (
            <motion.button
              onClick={() => mapInstance.current?.setView([userLocation.latitude, userLocation.longitude], 12)}
              className="bg-green-600 text-white p-2 rounded-lg shadow-lg hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              title="Center on User Location"
            >
              <Navigation className="w-4 h-4" />
            </motion.button>
          )}
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          className="absolute bottom-4 left-4 right-4 z-[1000] bg-red-50 border border-red-200 rounded-lg p-3 text-red-700"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <p className="text-sm font-medium">{error}</p>
          <button
            onClick={() => setError(null)}
            className="text-xs text-red-600 hover:text-red-800 mt-1"
          >
            Dismiss
          </button>
        </motion.div>
      )}

      {/* Location Info Panel */}
      {userLocation && (
        <motion.div
          className="absolute bottom-4 right-4 z-[1000] bg-white rounded-lg shadow-lg p-4 max-w-sm"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
        >
          <div className="flex items-start space-x-3">
            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
              <MapPin className="w-4 h-4 text-blue-600" />
            </div>
            <div className="flex-1 min-w-0">
              <h4 className="font-medium text-gray-900 truncate">
                Your Location
              </h4>
              <p className="text-sm text-gray-600 truncate">
                {LocationService.formatLocationDisplay(userLocation)}
              </p>
              <div className="flex items-center space-x-4 mt-2 text-xs text-gray-500">
                <span>
                  Accuracy: {geolocationService.getAccuracyDescription(userLocation.accuracy || 0)}
                </span>
                {showNearbyUsers && nearbyLocations.length > 0 && (
                  <span className="flex items-center space-x-1">
                    <Users className="w-3 h-3" />
                    <span>{nearbyLocations.length} nearby</span>
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 z-[1001] bg-black bg-opacity-20 flex items-center justify-center rounded-lg">
          <div className="bg-white rounded-lg p-4 shadow-lg flex items-center space-x-3">
            <div className="w-6 h-6 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
            <span className="text-gray-700">Loading location...</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default IndianMap;
