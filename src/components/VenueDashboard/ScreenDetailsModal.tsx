import React, { useState } from "react";
import { createPortal } from "react-dom";

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
  day_photo_url?: string | null;
  night_photo_url?: string | null;
  video_url?: string | null;
}

interface ScreenDetailsModalProps {
  screen: Screen | null;
  onClose: () => void;
}

const ScreenDetailsModal: React.FC<ScreenDetailsModalProps> = ({
  screen,
  onClose,
}) => {
  if (!screen) return null;

  const assets = screen.assets || [];
  const dayPhoto = assets.find((a) => a.asset_type === "photo_day");
  const nightPhoto = assets.find((a) => a.asset_type === "photo_night");
  const video = assets.find((a) => a.asset_type === "video");

  const dayPhotoUrl = dayPhoto?.url || screen.day_photo_url || "";
  const nightPhotoUrl = nightPhoto?.url || screen.night_photo_url || "";
  const videoUrl = video?.url || screen.video_url || "";

  const [showDay, setShowDay] = useState(false);
  const [showNight, setShowNight] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

  // Prevent click inside modal from closing it
  const handleModalClick = (e: React.MouseEvent) => e.stopPropagation();

  return createPortal(
    <div
      className="fixed inset-0 z-[9999] bg-black/40 backdrop-blur-md flex justify-center items-start pt-4 sm:pt-8 md:pt-12 lg:pt-16 p-2 sm:p-4 md:p-6 lg:p-8 animate-in fade-in-0 duration-200 overflow-y-auto"
      onClick={onClose} // click outside closes modal
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div
        className="bg-white rounded-xl sm:rounded-2xl shadow-2xl w-full max-w-xs sm:max-w-lg md:max-w-2xl lg:max-w-4xl xl:max-w-5xl min-h-fit mb-4 sm:mb-8 p-4 sm:p-6 md:p-8 border border-gray-200/50 animate-in zoom-in-95 slide-in-from-bottom-4 duration-200 ease-out"
        onClick={handleModalClick} // stop propagation
      >
        {/* Header */}
        <div className="flex justify-between items-start mb-4 sm:mb-6">
          <h2
            id="modal-title"
            className="text-lg sm:text-xl md:text-2xl font-bold text-gray-900 pr-4 leading-tight"
          >
            {screen.screen_name}
          </h2>
          <button
            onClick={onClose}
            className="flex-shrink-0 p-1.5 sm:p-2 rounded-full text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-gray-300"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>
        </div>

        {/* Location */}
        <p className="text-sm sm:text-base text-gray-600 mb-4 sm:mb-6 break-words">
          {screen.location_in_venue}
        </p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 lg:gap-8">
          {/* Details */}
          <div className="space-y-2 sm:space-y-3">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Details
            </h3>
            <ul className="space-y-1.5 sm:space-y-2 text-sm sm:text-base text-gray-700">
              <li className="break-words">
                <strong className="text-gray-900">Size:</strong>{" "}
                {screen.screen_size_inches || "N/A"} inches
              </li>
              <li className="break-words">
                <strong className="text-gray-900">Resolution:</strong>{" "}
                {screen.resolution || "N/A"}
              </li>
              <li className="break-words">
                <strong className="text-gray-900">Orientation:</strong>{" "}
                {screen.orientation}
              </li>
              <li className="break-words">
                <strong className="text-gray-900">Device:</strong>{" "}
                {screen.device_type} ({screen.device_model || "N/A"})
              </li>
              <li className="break-words">
                <strong className="text-gray-900">Viewing Distance:</strong>{" "}
                {screen.viewing_distance}
              </li>
              <li className="break-words">
                <strong className="text-gray-900">
                  Typical Viewer Duration:
                </strong>{" "}
                {screen.typical_viewer_duration || "N/A"}
              </li>
              <li className="break-words">
                <strong className="text-gray-900">Peak Hours:</strong>{" "}
                {screen.peak_viewing_hours.join(", ") || "N/A"}
              </li>
            </ul>
          </div>

          {/* Media */}
          <div className="space-y-3 sm:space-y-4">
            <h3 className="text-lg sm:text-xl font-semibold text-gray-800">
              Media
            </h3>

            {/* Day Photo */}
            {dayPhotoUrl && (
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm sm:text-base font-medium text-gray-800">
                    Day Photo
                  </h4>
                  <button
                    onClick={() => setShowDay((v) => !v)}
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {showDay ? "Hide" : "Show"}
                  </button>
                </div>
                {showDay && (
                  <div className="mt-2 sm:mt-3 animate-in slide-in-from-top-2 duration-200 ease-out">
                    <img
                      src={dayPhotoUrl}
                      alt="Daytime screen"
                      className="rounded-md sm:rounded-lg w-full object-cover max-h-64 sm:max-h-80 shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Night Photo */}
            {nightPhotoUrl && (
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm sm:text-base font-medium text-gray-800">
                    Night Photo
                  </h4>
                  <button
                    onClick={() => setShowNight((v) => !v)}
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {showNight ? "Hide" : "Show"}
                  </button>
                </div>
                {showNight && (
                  <div className="mt-2 sm:mt-3 animate-in slide-in-from-top-2 duration-200 ease-out">
                    <img
                      src={nightPhotoUrl}
                      alt="Nighttime screen"
                      className="rounded-md sm:rounded-lg w-full object-cover max-h-64 sm:max-h-80 shadow-sm"
                    />
                  </div>
                )}
              </div>
            )}

            {/* Video */}
            {videoUrl && (
              <div className="bg-gray-50/80 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
                <div className="flex justify-between items-center">
                  <h4 className="text-sm sm:text-base font-medium text-gray-800">
                    Video
                  </h4>
                  <button
                    onClick={() => setShowVideo((v) => !v)}
                    className="text-xs sm:text-sm font-medium text-blue-600 hover:text-blue-800 transition-colors px-2 py-1 rounded hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-300"
                  >
                    {showVideo ? "Hide" : "Show"}
                  </button>
                </div>
                {showVideo && (
                  <div className="mt-2 sm:mt-3 animate-in slide-in-from-top-2 duration-200 ease-out">
                    <video
                      src={videoUrl}
                      controls
                      className="rounded-md sm:rounded-lg w-full shadow-md border border-gray-200 bg-black max-h-64 sm:max-h-80"
                    />
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ScreenDetailsModal;
