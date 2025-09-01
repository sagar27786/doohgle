import React, { useState, useEffect, useRef, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  MapPin,
  Satellite,
  Map as MapIcon,
  Navigation,
  Search,
  Filter,
  Eye,
  EyeOff,
  Maximize2,
  Minimize2,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  BarChart3,
  Users,
  TrendingUp,
  Settings,
  Layers,
  Target,
  Monitor,
  Zap,
  DollarSign
} from 'lucide-react';
import GoogleMapService from '../../services/googleMapService';
import { screensService } from '../../services/screensService';
import { ScreenSearchResult } from '../../api/screens';
import { createScreenMarkerDataURL } from './ScreenMarkerIcon';

interface EnhancedMapDashboardProps {
  className?: string;
  height?: string;
  showControls?: boolean;
  onScreenSelect?: (screen: ScreenSearchResult) => void;
}

interface MapFilter {
  id: string;
  label: string;
  active: boolean;
  color: string;
  icon: React.ComponentType<any>;
}

interface ScreenMarker extends ScreenSearchResult {
  status: 'active' | 'inactive' | 'maintenance';
  performance: {
    impressions: number;
    revenue: number;
    uptime: number;
  };
}

const EnhancedMapDashboard: React.FC<EnhancedMapDashboardProps> = ({
  className = '',
  height = '600px',
  showControls = true,
  onScreenSelect
}) => {
  console.log('🗺️ EnhancedMapDashboard: Component rendering with height:', height);
  
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);
  const infoWindowRef = useRef<any>(null);
  
  // State management
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [mapType, setMapType] = useState<'roadmap' | 'satellite'>('roadmap');
  const [screens, setScreens] = useState<ScreenMarker[]>([]);
  const [filteredScreens, setFilteredScreens] = useState<ScreenMarker[]>([]);
  const [selectedScreen, setSelectedScreen] = useState<ScreenMarker | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showFilters, setShowFilters] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Map filters
  const [mapFilters, setMapFilters] = useState<MapFilter[]>([
    {
      id: 'active',
      label: 'Active Screens',
      active: true,
      color: '#10B981',
      icon: CheckCircle
    },
    {
      id: 'inactive',
      label: 'Inactive Screens',
      active: true,
      color: '#EF4444',
      icon: AlertCircle
    },
    {
      id: 'maintenance',
      label: 'Under Maintenance',
      active: true,
      color: '#F59E0B',
      icon: Clock
    },
    {
      id: 'high-performance',
      label: 'High Performance',
      active: false,
      color: '#8B5CF6',
      icon: TrendingUp
    }
  ]);

  const mapService = GoogleMapService.getInstance();

  // Initialize Google Maps
  const initializeMap = useCallback(async () => {
    console.log('🗺️ EnhancedMapDashboard: Initializing map...');
    console.log('🗺️ EnhancedMapDashboard: Map ref current:', mapRef.current);
    console.log('🗺️ EnhancedMapDashboard: Google Maps available:', !!(window as any).google?.maps);
    
    if (!mapRef.current) {
      console.log('🗺️ EnhancedMapDashboard: Map ref not available');
      return;
    }

    try {
      setIsLoading(true);
      console.log('🗺️ EnhancedMapDashboard: Loading Google Maps API...');
      await mapService.loadGoogleMapsAPI();
      console.log('🗺️ EnhancedMapDashboard: Google Maps API loaded successfully');
      console.log('🗺️ EnhancedMapDashboard: Google Maps object:', (window as any).google?.maps);
      
      const mapOptions = {
        zoom: 5,
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        mapTypeId: mapType,
        styles: getMapStyles(),
        disableDefaultUI: false,
        zoomControl: true,
        mapTypeControl: false,
        scaleControl: true,
        streetViewControl: false,
        rotateControl: false,
        fullscreenControl: false
      };

      console.log('🗺️ EnhancedMapDashboard: Creating map instance with options:', mapOptions);
      mapInstance.current = new (window as any).google.maps.Map(
        mapRef.current,
        mapOptions
      );
      console.log('🗺️ EnhancedMapDashboard: Map instance created successfully:', mapInstance.current);

      // Add map type change listener
      mapInstance.current.addListener('maptypeid_changed', () => {
        const newMapType = mapInstance.current.getMapTypeId();
        setMapType(newMapType);
      });

      console.log('🗺️ EnhancedMapDashboard: Map initialization complete');
      setIsLoading(false);
    } catch (err) {
        console.error('🗺️ EnhancedMapDashboard: Error initializing map:', err);
        console.error('🗺️ EnhancedMapDashboard: Error stack:', err instanceof Error ? err.stack : 'No stack trace');
        setError('Failed to load map');
        setIsLoading(false);
      }
  }, [mapType]);

  // Load screen data
  const loadScreens = useCallback(async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Get all screens from API
      const allScreens = await screensService.getAllScreens();
      console.log('Loaded screens:', allScreens);
      
      // Transform to include status and performance data
      const screensData = (allScreens || []).map(screen => ({
        ...screen,
        status: (screen.is_active ? 'active' : 'inactive') as 'active' | 'inactive' | 'maintenance',
        performance: {
          impressions: Math.floor(Math.random() * 200000),
          revenue: Math.floor(Math.random() * 100000),
          uptime: Math.floor(Math.random() * 20) + 80
        }
      })) as ScreenMarker[];
      
      setScreens(screensData);
      setFilteredScreens(screensData);
    } catch (err) {
      console.error('Error loading screens:', err);
      setError('Failed to load screen data');
      // Set empty array on error
      setScreens([]);
      setFilteredScreens([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Create custom screen markers
  const createScreenMarkers = useCallback(() => {
    console.log('🎯 createScreenMarkers called:', {
      mapExists: !!mapInstance.current,
      screenCount: filteredScreens.length,
      googleMapsLoaded: !!(window as any).google?.maps
    });
    
    if (!mapInstance.current || !filteredScreens.length) {
      console.log('❌ Cannot create markers:', {
        mapExists: !!mapInstance.current,
        screenCount: filteredScreens.length
      });
      return;
    }

    if (!(window as any).google?.maps) {
      console.log('❌ Google Maps API not loaded');
      return;
    }

    // Clear existing markers
    markersRef.current.forEach(marker => marker.setMap(null));
    markersRef.current = [];
    console.log('🧹 Cleared existing markers');

    filteredScreens.forEach((screen, index) => {
      if (!screen.latitude || !screen.longitude) {
        console.log(`⚠️ Screen ${screen.name} missing coordinates`);
        return;
      }

      const position = {
        lat: typeof screen.latitude === 'string' ? parseFloat(screen.latitude) : screen.latitude,
        lng: typeof screen.longitude === 'string' ? parseFloat(screen.longitude) : screen.longitude
      };

      console.log(`📍 Creating marker ${index + 1}/${filteredScreens.length}:`, {
        name: screen.name,
        position,
        status: screen.status
      });

      // Create custom marker icon based on status
      const markerIcon = {
        url: createScreenMarkerDataURL(screen.status || 'active', 32),
        scaledSize: new (window as any).google.maps.Size(32, 32),
        anchor: new (window as any).google.maps.Point(16, 16)
      };

      console.log('🎨 Marker icon URL:', markerIcon.url.substring(0, 100) + '...');

      const marker = new (window as any).google.maps.Marker({
        position,
        map: mapInstance.current,
        icon: markerIcon,
        title: screen.name,
        animation: (window as any).google.maps.Animation.DROP
      });

      console.log('✅ Marker created successfully for:', screen.name);

      // Add click listener
      marker.addListener('click', () => {
        console.log('🖱️ Marker clicked:', screen.name);
        setSelectedScreen(screen);
        onScreenSelect?.(screen);
        showInfoWindow(marker, screen);
      });

      markersRef.current.push(marker);
    });
    
    console.log(`🎯 Total markers created: ${markersRef.current.length}`);
  }, [filteredScreens, onScreenSelect]);

  // Show info window for selected screen
  const showInfoWindow = (marker: any, screen: ScreenMarker) => {
    if (infoWindowRef.current) {
      infoWindowRef.current.close();
    }

    const content = `
      <div class="p-4 max-w-sm">
        <div class="flex items-center gap-2 mb-2">
          <div class="w-3 h-3 rounded-full" style="background-color: ${getStatusColor(screen.status)}"></div>
          <h3 class="font-semibold text-gray-900">${screen.name}</h3>
        </div>
        <p class="text-sm text-gray-600 mb-2">${screen.address}</p>
        <div class="grid grid-cols-2 gap-2 text-xs">
          <div>
            <span class="text-gray-500">Daily Footfall:</span>
            <div class="font-medium">${screen.daily_footfall?.toLocaleString() || 'N/A'}</div>
          </div>
          <div>
            <span class="text-gray-500">Revenue:</span>
            <div class="font-medium text-green-600">₹${screen.performance.revenue.toLocaleString()}</div>
          </div>
          <div>
            <span class="text-gray-500">Impressions:</span>
            <div class="font-medium">${screen.performance.impressions.toLocaleString()}</div>
          </div>
          <div>
            <span class="text-gray-500">Uptime:</span>
            <div class="font-medium">${screen.performance.uptime}%</div>
          </div>
        </div>
      </div>
    `;

    infoWindowRef.current = new (window as any).google.maps.InfoWindow({
      content
    });

    infoWindowRef.current.open(mapInstance.current, marker);
  };

  // Get status color
  const getStatusColor = (status: string): string => {
    switch (status) {
      case 'active': return '#10B981';
      case 'inactive': return '#EF4444';
      case 'maintenance': return '#F59E0B';
      default: return '#6B7280';
    }
  };

  // Get map styles
  const getMapStyles = () => {
    if (mapType === 'satellite') return [];
    
    return [
      {
        featureType: 'poi',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      },
      {
        featureType: 'transit',
        elementType: 'labels',
        stylers: [{ visibility: 'off' }]
      }
    ];
  };

  // Toggle map type
  const toggleMapType = () => {
    const newMapType = mapType === 'roadmap' ? 'satellite' : 'roadmap';
    setMapType(newMapType);
    if (mapInstance.current) {
      mapInstance.current.setMapTypeId(newMapType);
    }
  };

  // Filter screens based on active filters
  const applyFilters = useCallback(() => {
    let filtered = screens;

    // Apply status filters
    const activeStatusFilters = mapFilters
      .filter(f => f.active && ['active', 'inactive', 'maintenance'].includes(f.id))
      .map(f => f.id);
    
    if (activeStatusFilters.length > 0) {
      filtered = filtered.filter(screen => activeStatusFilters.includes(screen.status));
    }

    // Apply performance filter
    if (mapFilters.find(f => f.id === 'high-performance' && f.active)) {
      filtered = filtered.filter(screen => screen.performance.uptime > 95);
    }

    // Apply search filter
    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(screen => 
        screen.name.toLowerCase().includes(query) ||
        screen.city.toLowerCase().includes(query) ||
        screen.state.toLowerCase().includes(query)
      );
    }

    setFilteredScreens(filtered);
  }, [screens, mapFilters, searchQuery]);

  // Toggle filter
  const toggleFilter = (filterId: string) => {
    setMapFilters(prev => prev.map(filter => 
      filter.id === filterId 
        ? { ...filter, active: !filter.active }
        : filter
    ));
  };

  // Effects
  useEffect(() => {
    console.log('🗺️ EnhancedMapDashboard: Component mounted');
    console.log('🗺️ EnhancedMapDashboard: Current props:', { height });
    initializeMap();
  }, [initializeMap]);

  useEffect(() => {
    loadScreens();
  }, [loadScreens]);

  useEffect(() => {
    applyFilters();
  }, [applyFilters]);

  useEffect(() => {
    createScreenMarkers();
  }, [createScreenMarkers]);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <p className="text-red-700 font-medium">Failed to load map</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`} style={{ height }}>
      {/* Debug indicator */}
      <div className="absolute top-0 left-0 right-0 bg-yellow-100 border-b px-4 py-2 text-sm text-yellow-800 z-30">
        🗺️ Map Component Loaded - Screens: {filteredScreens.length} | Map Loaded: {mapInstance.current ? 'Yes' : 'No'}
      </div>
      {/* Map Controls */}
      {showControls && (
        <div className="absolute top-16 left-4 z-10 space-y-2">
          {/* Search */}
          <div className="bg-white rounded-lg shadow-md p-2">
            <div className="flex items-center gap-2">
              <Search className="w-4 h-4 text-gray-400" />
              <input
                type="text"
                placeholder="Search screens..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="border-none outline-none text-sm w-48"
              />
            </div>
          </div>

          {/* Map Type Toggle */}
          <button
            onClick={toggleMapType}
            className="bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 transition-colors"
            title={`Switch to ${mapType === 'roadmap' ? 'satellite' : 'normal'} view`}
          >
            {mapType === 'roadmap' ? (
              <Satellite className="w-5 h-5 text-gray-600" />
            ) : (
              <MapIcon className="w-5 h-5 text-gray-600" />
            )}
          </button>

          {/* Filters Toggle */}
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`bg-white rounded-lg shadow-md p-2 hover:bg-gray-50 transition-colors ${
              showFilters ? 'bg-blue-50 text-blue-600' : 'text-gray-600'
            }`}
          >
            <Filter className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filters Panel */}
      <AnimatePresence>
        {showFilters && (
          <motion.div
            initial={{ opacity: 0, x: -300 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -300 }}
            className="absolute top-16 left-20 z-10 bg-white rounded-lg shadow-lg p-4 w-64"
          >
            <h3 className="font-semibold text-gray-900 mb-3">Map Filters</h3>
            <div className="space-y-2">
              {mapFilters.map(filter => {
                const IconComponent = filter.icon;
                return (
                  <label key={filter.id} className="flex items-center gap-3 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={filter.active}
                      onChange={() => toggleFilter(filter.id)}
                      className="rounded border-gray-300"
                    />
                    <IconComponent 
                      className="w-4 h-4" 
                      style={{ color: filter.color }}
                    />
                    <span className="text-sm text-gray-700">{filter.label}</span>
                  </label>
                );
              })}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Map Stats */}
      {showControls && (
        <div className="absolute top-16 right-4 z-10">
          <div className="bg-white rounded-lg shadow-md p-3">
            <div className="text-xs text-gray-500 mb-1">Screens Visible</div>
            <div className="text-lg font-semibold text-gray-900">{filteredScreens.length}</div>
          </div>
        </div>
      )}

      {/* Loading Overlay */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600 text-sm">Loading map...</p>
          </div>
        </div>
      )}

      {/* Map Container */}
      <div ref={mapRef} className="w-full h-full" style={{ paddingTop: '48px' }} />

      {/* Legend */}
      {showControls && (
        <div className="absolute bottom-4 left-4 z-10 bg-white rounded-lg shadow-md p-3">
          <h4 className="text-xs font-semibold text-gray-700 mb-2">Screen Status</h4>
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-green-500"></div>
              <span className="text-xs text-gray-600">Active</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-red-500"></div>
              <span className="text-xs text-gray-600">Inactive</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
              <span className="text-xs text-gray-600">Maintenance</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default EnhancedMapDashboard;