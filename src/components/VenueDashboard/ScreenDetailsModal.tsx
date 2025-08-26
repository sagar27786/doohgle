import React from 'react';

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

const ScreenDetailsModal: React.FC<ScreenDetailsModalProps> = ({ screen, onClose }) => {
  if (!screen) {
    return null;
  }

  // Ensure assets is an array, even if it's missing from the screen prop.
  const assets = screen.assets || [];

  const dayPhoto = assets.find(
    asset => asset.asset_type === 'photo_day'
  );
  const nightPhoto = assets.find(
    asset => asset.asset_type === 'photo_night'
  );
  const video = assets.find(asset => asset.asset_type === 'video');

  // FALLBACK TO URLS ON THE SCREEN ROW IF ASSETS ARE NOT PRESENT
  const dayPhotoUrl = dayPhoto?.url || screen.day_photo_url || '';
  const nightPhotoUrl = nightPhoto?.url || screen.night_photo_url || '';
  const videoUrl = video?.url || screen.video_url || '';

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-3xl max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center border-b pb-3">
          <h2 className="text-2xl font-bold">{screen.screen_name}</h2>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-800">
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path></svg>
          </button>
        </div>
        <div className="mt-4">
            <p className="text-lg text-gray-600">{screen.location_in_venue}</p>
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
                    <div>
                      <h4 className="font-semibold">Day Photo</h4>
                      <img src={dayPhotoUrl} alt="Daytime view of the screen" className="mt-1 rounded-md shadow-md" />
                    </div>
                  )}
                  {nightPhotoUrl && (
                    <div>
                      <h4 className="font-semibold">Night Photo</h4>
                      <img src={nightPhotoUrl} alt="Nighttime view of the screen" className="mt-1 rounded-md shadow-md" />
                    </div>
                  )}
                  {videoUrl && (
                    <div>
                      <h4 className="font-semibold">Video</h4>
                      <video src={videoUrl} controls className="mt-1 rounded-md shadow-md w-full" />
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