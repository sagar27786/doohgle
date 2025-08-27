import { useState, useEffect } from 'react';
import { screensService } from '../../services/screensService';
import ScreenDetailsModal from './ScreenDetailsModal';

interface ScreenAsset {
  asset_type: 'photo_day' | 'photo_night' | 'video';
  url: string;
}

interface Screen {
  id: number;
  screen_name: string;
  location_in_venue: string;
  screen_size_inches: number | null;
  resolution: string | null;
  orientation: 'landscape' | 'portrait';
  device_type: 'smart_tv' | 'media_player' | 'custom';
  device_model: string | null;
  ads_enabled: boolean;
  ad_frequency: number;
  viewing_distance: 'close' | 'medium' | 'far';
  typical_viewer_duration: string | null;
  peak_viewing_hours: string[];
  assets: ScreenAsset[];
  created_at: string;
  updated_at: string;
  user_id: number;
}

function ScreenList() {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const response = await screensService.getMyScreens();
        setScreens(response.screens || []);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching screens.');
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);

  const handleScreenClick = (screen: Screen) => {
    console.log("Screen clicked:", screen);
    setSelectedScreen(screen);
  };

  const handleCloseModal = () => {
    setSelectedScreen(null);
  };

  if (loading) {
    return <div>Loading screens...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Your Screens</h2>
      {screens.length === 0 ? (
        <p>You have not registered any screens yet.</p>
      ) : (
        <ul className="mt-4 space-y-2">
          {screens.map((screen) => (
            <li
              key={screen.id}
              className="p-4 border border-gray-200 dark:border-gray-700 rounded-md cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
              onClick={() => handleScreenClick(screen)}
            >
              <p className="font-bold">{screen.screen_name}</p>
              <p>{screen.location_in_venue}</p>
            </li>
          ))}
        </ul>
      )}
      <ScreenDetailsModal screen={selectedScreen} onClose={handleCloseModal} />
    </div>
  );
};

export default ScreenList;
