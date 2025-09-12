import React, { useEffect, useState } from 'react';
import IndianGoogleMap from '../components/Map/IndianGoogleMap';

const MapTestPage: React.FC = () => {
  const [debugInfo, setDebugInfo] = useState<string[]>([]);

  useEffect(() => {
    console.log('🧪 MapTestPage component mounted');
    setDebugInfo(prev => [...prev, 'MapTestPage mounted at ' + new Date().toLocaleTimeString()]);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-gray-900 mb-6">
          Map Test Page
        </h1>
        
        {/* Debug Info Panel */}
        <div className="bg-blue-100 border border-blue-300 rounded-lg p-4 mb-6">
          <h2 className="text-lg font-semibold text-blue-800 mb-2">Debug Info:</h2>
          <div className="text-sm text-blue-700">
            {debugInfo.map((info, index) => (
              <div key={index}>{info}</div>
            ))}
            <div>Component Status: Active</div>
            <div>Expected: Screen markers should appear on map</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow-lg p-6">
          <IndianGoogleMap 
            showScreenLocations={true}
            height="600px"
            zoom={6}
          />
        </div>
      </div>
    </div>
  );
};

export default MapTestPage;