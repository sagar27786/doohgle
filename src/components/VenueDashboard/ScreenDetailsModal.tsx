import React , {useState} from 'react';


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
  // Added: fallbacks from screens table
  day_photo_url?: string | null;
  night_photo_url?: string | null;
  video_url?: string | null;
}

interface ScreenDetailsModalProps {
  screen: Screen | null;
  onClose: () => void;
}

// Inside component: ScreenDetailsModal
const ScreenDetailsModal: React.FC<ScreenDetailsModalProps> = ({ screen, onClose }) => {
  if (!screen) {
    return null;
  }

  // Ensure assets is an array, even if it's missing from the screen prop.
  const assets = screen.assets || [];

  const dayPhotoUrl = screen.day_photo_url || assets.find(asset => asset.asset_type === 'photo_day')?.url || '';
  const nightPhotoUrl = screen.night_photo_url || assets.find(asset => asset.asset_type === 'photo_night')?.url || '';
  const videoUrl = screen.video_url || assets.find(asset => asset.asset_type === 'video')?.url || '';

  // Add local UI state for media toggles
  const [showDay, setShowDay] = useState(false);
  const [showNight, setShowNight] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex justify-center items-center z-50"
      role="dialog"
      aria-modal="true"
    >
      <div className="bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 rounded-xl shadow-2xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto border border-gray-200 dark:border-gray-700 transition-colors">
        <div className="flex justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
          <h2 className="text-2xl font-bold">{screen.screen_name}</h2>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-gray-500 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 hover:bg-gray-100/60 dark:hover:bg-gray-700/60 transition-colors"
            aria-label="Close details"
          >
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
              aria-hidden="true"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
            </svg>
          </button>
        </div>

        <div className="mt-4">
          <p className="text-lg text-gray-600 dark:text-gray-300">{screen.location_in_venue}</p>
          <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h3 className="text-xl font-semibold">Details</h3>
              <ul className="mt-2 space-y-2">
                <li><strong>Size:</strong> {screen.screen_size_inches} inches</li>
                <li><strong>Resolution:</strong> {screen.resolution}</li>
                <li><strong>Orientation:</strong> {screen.orientation}</li>
                <li><strong>Device:</strong> {screen.device_type} ({screen.device_model})</li>
                <li><strong>Viewing Distance:</strong> {screen.viewing_distance}</li>
                <li><strong>Typical Viewer Duration:</strong> {screen.typical_viewer_duration}</li>
                <li><strong>Peak Hours:</strong> {screen.peak_viewing_hours.join(', ')}</li>
              </ul>
            </div>

            <div>
              <h3 className="text-xl font-semibold">Media</h3>
              <div className="mt-2 space-y-4">
                {dayPhotoUrl && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Day Photo</h4>
                      <button
                        type="button"
                        onClick={() => setShowDay(v => !v)}
                        className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                      >
                        {showDay ? 'Hide Day Photo' : 'Show Day Photo'}
                      </button>
                    </div>
                    {showDay && (
                      <img
                        src={dayPhotoUrl}
                        alt="Daytime view of the screen"
                        className="mt-3 rounded-md shadow-md border border-gray-200 dark:border-gray-700"
                      />
                    )}
                  </div>
                )}

                {nightPhotoUrl && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Night Photo</h4>
                      <button
                        type="button"
                        onClick={() => setShowNight(v => !v)}
                        className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                      >
                        {showNight ? 'Hide Night Photo' : 'Show Night Photo'}
                      </button>
                    </div>
                    {showNight && (
                      <img
                        src={nightPhotoUrl}
                        alt="Nighttime view of the screen"
                        className="mt-3 rounded-md shadow-md border border-gray-200 dark:border-gray-700"
                      />
                    )}
                  </div>
                )}

                {videoUrl && (
                  <div className="rounded-lg border border-gray-200 dark:border-gray-700 p-3">
                    <div className="flex items-center justify-between">
                      <h4 className="font-semibold">Video</h4>
                      <button
                        type="button"
                        onClick={() => setShowVideo(v => !v)}
                        className="px-3 py-1.5 rounded-md text-sm bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 transition-colors"
                      >
                        {showVideo ? 'Hide Video' : 'Show Video'}
                      </button>
                    </div>
                    {showVideo && (
                      <video
                        src={videoUrl}
                        controls
                        className="mt-3 rounded-md shadow-md w-full border border-gray-200 dark:border-gray-700 bg-black"
                      />
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetailsModal;