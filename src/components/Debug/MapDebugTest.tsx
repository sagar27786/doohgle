import React, { useEffect } from 'react';

const MapDebugTest: React.FC = () => {
  useEffect(() => {
    console.log('🔥 MapDebugTest: Component mounted and running!');
    console.log('🔥 MapDebugTest: Google Maps available:', !!(window as any).google?.maps);
    console.log('🔥 MapDebugTest: Current URL:', window.location.href);
    
    // Log every 2 seconds to make sure we can see it
    const interval = setInterval(() => {
      console.log('🔥 MapDebugTest: Still running...', new Date().toLocaleTimeString());
    }, 2000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="p-4 bg-red-100 border border-red-400 rounded">
      <h2 className="text-xl font-bold text-red-800">🔥 DEBUG TEST COMPONENT</h2>
      <p className="text-red-700">If you can see this, the component is rendering!</p>
      <p className="text-red-700">Check the browser console for debug logs.</p>
      <p className="text-red-700">Google Maps Available: {(window as any).google?.maps ? 'YES' : 'NO'}</p>
    </div>
  );
};

export default MapDebugTest;