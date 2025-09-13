import React, { useEffect, useState } from 'react';
import { bookingService } from '../../services/bookingService';

interface Screen {
  id: number;
  name: string;
  city: string;
  location_name: string;
  address: string;
  daily_footfall: number;
  cost_per_10_seconds: string;
  is_active: boolean;
}

const SimpleScreensTest: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('SimpleScreensTest: Fetching screens...');
        
        const bangaloreScreens = await bookingService.getAvailableScreensByCity('Bangalore');
        console.log('SimpleScreensTest: Received screens:', bangaloreScreens);
        
        setScreens(bangaloreScreens as unknown as Screen[]);
      } catch (err) {
        console.error('SimpleScreensTest: Error:', err);
        setError(`Error fetching screens: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);

  if (loading) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Simple Screens Test</h2>
        <div className="flex items-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Loading screens...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <h2 className="text-2xl font-bold mb-4">Simple Screens Test</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Simple Screens Test</h2>
      <p className="mb-4">Found {screens.length} screens in Bangalore:</p>
      
      {screens.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          No screens found in Bangalore.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {screens.map((screen) => (
            <div key={screen.id} className="bg-white rounded-lg shadow-md p-6 border">
              <h3 className="text-lg font-semibold mb-2">{screen.name}</h3>
              <p className="text-sm text-gray-600 mb-1">ID: {screen.id}</p>
              <p className="text-sm text-gray-600 mb-1">City: {screen.city}</p>
              <p className="text-sm text-gray-600 mb-1">Location: {screen.address || screen.location_name}</p>
              <p className="text-sm text-gray-600 mb-1">Daily Footfall: {screen.daily_footfall}</p>
              <p className="text-sm text-gray-600 mb-1">Cost per 10s: ₹{screen.cost_per_10_seconds}</p>
              <p className="text-sm text-gray-600">Active: {screen.is_active ? 'Yes' : 'No'}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SimpleScreensTest;
