import { useState, useEffect } from 'react';
import { screensService } from '../../services/screensService';

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
  created_at: string;
  updated_at: string;
  user_id: number;
}

const ScreenList = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

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
            <li key={screen.id} className="p-4 border rounded-md">
              <p className="font-bold">{screen.screen_name}</p>
              <p>{screen.location_in_venue}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ScreenList;
