import React, { useEffect, useRef } from 'react';

const SimpleMapTest: React.FC = () => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    console.log('🗺️ SimpleMapTest: Component mounted');
    console.log('🗺️ SimpleMapTest: Google Maps available:', !!(window as any).google?.maps);
    
    if (mapRef.current && (window as any).google?.maps) {
      console.log('🗺️ SimpleMapTest: Creating simple map...');
      
      const map = new (window as any).google.maps.Map(mapRef.current, {
        zoom: 5,
        center: { lat: 20.5937, lng: 78.9629 },
        mapTypeId: 'roadmap'
      });
      
      console.log('🗺️ SimpleMapTest: Map created successfully:', map);
      
      // Add a simple marker
      const marker = new (window as any).google.maps.Marker({
        position: { lat: 28.6139, lng: 77.209 },
        map: map,
        title: 'Test Marker - Delhi'
      });
      
      console.log('🗺️ SimpleMapTest: Marker created:', marker);
    } else {
      console.log('🗺️ SimpleMapTest: Google Maps not available or mapRef not ready');
    }
  }, []);

  return (
    <div className="w-full h-96 bg-gray-100 border rounded-lg">
      <div className="p-4 bg-blue-100 border-b">
        <h3 className="text-lg font-semibold">Simple Map Test</h3>
        <p className="text-sm text-gray-600">Testing Google Maps API integration</p>
      </div>
      <div ref={mapRef} className="w-full h-80" />
    </div>
  );
};

export default SimpleMapTest;