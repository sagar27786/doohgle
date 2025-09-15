import { useState, useEffect } from "react";
import { screensService } from "../../services/screensService";
import ScreenDetailsModal from "./ScreenDetailsModal";

interface ScreenAsset {
  asset_type: "photo_day" | "photo_night" | "video";
  url: string;
}

interface Screen {
  id: number;
  screen_name: string;
  location_in_venue: string;
  screen_size_inches: number | null;
  resolution: string | null;
  orientation: "landscape" | "portrait";
  device_type: "smart_tv" | "media_player" | "custom";
  device_model: string | null;
  ads_enabled: boolean;
  ad_frequency: number;
  viewing_distance: "close" | "medium" | "far";
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
        setError(err.message || "An error occurred while fetching screens.");
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);

  const handleScreenClick = (screen: Screen) => {
    setSelectedScreen(screen);
  };

  const handleCloseModal = () => {
    setSelectedScreen(null);
  };

  if (loading) {
    return <div className="text-gray-600 text-sm">Loading screens...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error: {error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900">
        Your Screens
      </h2>

      {screens.length === 0 ? (
        <p className="text-gray-500 text-sm mt-2">
          You have not registered any screens yet.
        </p>
      ) : (
        <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {screens.map((screen) => (
            <li
              key={screen.id}
              className="p-4 border border-gray-200 rounded-xl cursor-pointer hover:bg-gray-50 transition-colors shadow-sm hover:shadow-md"
              onClick={() => handleScreenClick(screen)}
            >
              <p className="font-medium text-gray-900 truncate">
                {screen.screen_name}
              </p>
              <p className="text-sm text-gray-500">
                {screen.location_in_venue}
              </p>
            </li>
          ))}
        </ul>
      )}
      <ScreenDetailsModal screen={selectedScreen} onClose={handleCloseModal} />
    </div>
  );
}

export default ScreenList;
