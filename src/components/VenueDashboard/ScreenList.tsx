import { useState, useEffect } from 'react';
import { screensService } from '../../services/screensService';

interface Screen {
  id: string;
  screen_name: string;
  location_in_venue: string;
  // Add other screen properties as needed
}

const ScreenList = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScreens = async () => {
      try {
        const data = await screensService.getMyScreens();
        setScreens(data);
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
