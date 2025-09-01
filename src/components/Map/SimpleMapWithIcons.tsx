import React, { useState, useEffect, useRef } from 'react';
import GoogleMapService from '../../services/googleMapService';
import { createScreenMarkerDataURL } from './ScreenMarkerIcon';

interface SimpleMapWithIconsProps {
  className?: string;
  height?: string;
}

const SimpleMapWithIcons: React.FC<SimpleMapWithIconsProps> = ({
  className = '',
  height = '600px'
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Hardcoded test data with proper coordinates
  const testScreens = [
    {
      id: 1,
      name: 'Test Screen Delhi',
      latitude: 28.4949,
      longitude: 77.0864,
      status: 'active' as const
    },
    {
      id: 2,
      name: 'Test Screen Mumbai',
      latitude: 19.0544,
      longitude: 72.8293,
      status: 'inactive' as const
    },
    {
      id: 3,
      name: 'Test Screen Bangalore',
      latitude: 12.9716,
      longitude: 77.5946,
      status: 'maintenance' as const
    }
  ];

  const initializeMap = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      console.log('🗺️ SimpleMapWithIcons: Starting map initialization');
      
      if (!mapRef.current) {
        throw new Error('Map container not found');
      }

      // Initialize Google Maps
      const googleMapService = GoogleMapService.getInstance();
      await googleMapService.loadGoogleMapsAPI();
      console.log('🗺️ SimpleMapWithIcons: Google Maps service initialized');

      // Create map instance
      const mapOptions = {
        center: { lat: 20.5937, lng: 78.9629 }, // Center of India
        zoom: 5,
        mapTypeId: 'roadmap'
      };

      mapInstance.current = new (window as any).google.maps.Map(
        mapRef.current,
        mapOptions
      );
      
      console.log('🗺️ SimpleMapWithIcons: Map instance created');
      
      // Add test markers
      addTestMarkers();
      
      setIsLoading(false);
    } catch (err) {
      console.error('🗺️ SimpleMapWithIcons: Error initializing map:', err);
      setError('Failed to load map');
      setIsLoading(false);
    }
  };

  const addTestMarkers = () => {
    if (!mapInstance.current) {
      console.log('❌ No map instance for markers');
      return;
    }

    console.log('🎯 Adding test markers:', testScreens.length);

    testScreens.forEach((screen, index) => {
      console.log(`📍 Creating marker ${index + 1}:`, {
        name: screen.name,
        lat: screen.latitude,
        lng: screen.longitude,
        status: screen.status
      });

      const position = {
        lat: screen.latitude,
        lng: screen.longitude
      };

      // Create custom TV icon
      const markerIcon = {
        url: createScreenMarkerDataURL(screen.status, 40),
        scaledSize: new (window as any).google.maps.Size(40, 40),
        anchor: new (window as any).google.maps.Point(20, 20)
      };

      console.log('🎨 Marker icon created for:', screen.name);

      const marker = new (window as any).google.maps.Marker({
        position,
        map: mapInstance.current,
        icon: markerIcon,
        title: screen.name,
        animation: (window as any).google.maps.Animation.DROP
      });

      console.log('✅ Marker added to map:', screen.name);

      // Add click listener
      marker.addListener('click', () => {
        console.log('🖱️ Marker clicked:', screen.name);
        alert(`Clicked: ${screen.name} (${screen.status})`);
      });
    });

    console.log('🎯 All test markers added successfully!');
  };

  useEffect(() => {
    initializeMap();
  }, []);

  if (error) {
    return (
      <div className={`flex items-center justify-center bg-red-50 border border-red-200 rounded-lg ${className}`} style={{ height }}>
        <div className="text-center">
          <p className="text-red-700 font-medium">Failed to load map</p>
          <p className="text-red-600 text-sm mt-1">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`relative bg-white rounded-lg shadow-lg overflow-hidden ${className}`} style={{ height }}>
      {/* Debug indicator */}
      <div className="absolute top-0 left-0 right-0 bg-green-100 border-b px-4 py-2 text-sm text-green-800 z-30">
        🗺️ Simple Map with TV Icons - Test Screens: {testScreens.length} | Map: {mapInstance.current ? 'Loaded' : 'Loading...'}
      </div>
      
      {/* Loading indicator */}
      {isLoading && (
        <div className="absolute inset-0 bg-white bg-opacity-75 flex items-center justify-center z-20">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading map...</p>
          </div>
        </div>
      )}
      
      {/* Map container */}
      <div ref={mapRef} className="w-full h-full" />
    </div>
  );
};

export default SimpleMapWithIcons;