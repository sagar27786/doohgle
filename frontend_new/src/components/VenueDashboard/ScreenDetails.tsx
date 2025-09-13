import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { screensService } from '../../services/screensService';

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

const ScreenDetails = () => {
  const { id } = useParams<{ id: string }>();
  const [screen, setScreen] = useState<Screen | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchScreenDetails = async () => {
      if (!id) return;
      try {
        const response = await screensService.getScreenById(id);
        setScreen(response.screen);
      } catch (err: any) {
        setError(err.message || 'An error occurred while fetching screen details.');
      } finally {
        setLoading(false);
      }
    };

    fetchScreenDetails();
  }, [id]);

  if (loading) {
    return <div>Loading screen details...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  if (!screen) {
    return <div>Screen not found.</div>;
  }

  const dayPhoto = screen.assets.find(asset => asset.asset_type === 'photo_day');
  const nightPhoto = screen.assets.find(asset => asset.asset_type === 'photo_night');
  const video = screen.assets.find(asset => asset.asset_type === 'video');

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold">{screen.screen_name}</h1>
      <p className="text-lg text-gray-600">{screen.location_in_venue}</p>
      <div className="mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <h2 className="text-xl font-semibold">Details</h2>
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
          <h2 className="text-xl font-semibold">Media</h2>
          <div className="mt-2 space-y-4">
            {dayPhoto && (
              <div>
                <h3 className="font-semibold">Day Photo</h3>
                <img src={dayPhoto.url} alt="Daytime view of the screen" className="mt-1 rounded-md shadow-md" />
              </div>
            )}
            {nightPhoto && (
              <div>
                <h3 className="font-semibold">Night Photo</h3>
                <img src={nightPhoto.url} alt="Nighttime view of the screen" className="mt-1 rounded-md shadow-md" />
              </div>
            )}
            {video && (
              <div>
                <h3 className="font-semibold">Video</h3>
                <video src={video.url} controls className="mt-1 rounded-md shadow-md" />
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScreenDetails;