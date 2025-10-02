import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Monitor,
  MapPin,
  Eye,
  Smartphone,
  Tv,
  Settings,
  ChevronLeft,
  ChevronRight,
  Clock,
  Calendar,
  DollarSign,
  Users,
  ExternalLink,
} from "lucide-react";

interface Screen {
  id: string | number;
  name: string;
  location: string;
  city?: string;
  price_per_day?: number;
  daily_rate?: number;
  hourly_rate?: number;
  weekly_rate?: number;
  type?: string;
  status?: string;
  media_urls?: string[];
  image_url?: string;
  day_photo_url?: string;
  night_photo_url?: string;
  video_url?: string;
  features?: string[];
  rating?: number;
  views_per_day?: number;
  isFavorite?: boolean;
  screen_size_width?: number;
  screen_size_height?: number;
  resolution_width?: number;
  resolution_height?: number;
  orientation?: string;
  device_type?: string;
  device_model?: string;
  viewing_distance?: string;
  typical_viewer_duration?: string;
  peak_hours?: string[];
  daily_footfall?: number;
  latitude?: number;
  longitude?: number;
  pricing?: {
    hourly?: string;
    daily?: string;
    weekly?: string;
    currency?: string;
    cost_per_10_seconds?: string;
  };
}

interface ScreenDetailModalProps {
  screen: Screen;
  isOpen: boolean;
  onClose: () => void;
}

const ScreenDetailModal: React.FC<ScreenDetailModalProps> = ({
  screen,
  isOpen,
  onClose,
}) => {
  const [currentMediaIndex, setCurrentMediaIndex] = useState(0);

  if (!isOpen) return null;

  // Prepare media array with day photo, night photo, and video
  const mediaItems = [
    screen.day_photo_url && {
      type: "image",
      url: screen.day_photo_url,
      label: "Day View",
    },
    screen.night_photo_url && {
      type: "image",
      url: screen.night_photo_url,
      label: "Night View",
    },
    screen.video_url && {
      type: "video",
      url: screen.video_url,
      label: "Video",
    },
    screen.image_url &&
      !screen.day_photo_url && {
        type: "image",
        url: screen.image_url,
        label: "Screen View",
      },
  ].filter(Boolean) as Array<{ type: string; url: string; label: string }>;

  const nextMedia = () => {
    setCurrentMediaIndex((prev) => (prev + 1) % mediaItems.length);
  };

  const prevMedia = () => {
    setCurrentMediaIndex(
      (prev) => (prev - 1 + mediaItems.length) % mediaItems.length
    );
  };

  // Format screen details with real data
  const formatSize = () => {
    if (screen.screen_size_width && screen.screen_size_height) {
      return `${screen.screen_size_width}x${screen.screen_size_height} inches`;
    }
    return "N/A inches";
  };

  const formatResolution = () => {
    if (screen.resolution_width && screen.resolution_height) {
      return `${screen.resolution_width}x${screen.resolution_height}`;
    }
    return "N/A";
  };

  const formatOrientation = () => {
    return screen.orientation || "landscape";
  };

  const formatDevice = () => {
    const deviceType = screen.device_type || "smart_tv";
    const deviceModel = screen.device_model || "N/A";
    return `${deviceType} (${deviceModel})`;
  };

  const formatViewingDistance = () => {
    return screen.viewing_distance || "close";
  };

  const formatViewerDuration = () => {
    return screen.typical_viewer_duration || "N/A";
  };

  const formatPeakHours = () => {
    if (screen.peak_hours && screen.peak_hours.length > 0) {
      return screen.peak_hours.join(", ");
    }
    return "09:00-17:00";
  };

  const getDeviceIcon = () => {
    const deviceType = screen.device_type?.toLowerCase() || "smart_tv";
    switch (deviceType) {
      case "smartphone":
      case "mobile":
        return <Smartphone className="w-5 h-5 text-blue-500" />;
      case "smart_tv":
      case "tv":
      case "display":
        return <Tv className="w-5 h-5 text-blue-500" />;
      case "media_player":
      case "custom":
        return <Monitor className="w-5 h-5 text-blue-500" />;
      default:
        return <Monitor className="w-5 h-5 text-blue-500" />;
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
      >
        {/* Header */}
        <div className="sticky top-0 bg-white rounded-t-2xl border-b border-gray-200 p-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{screen.name}</h2>
            <div className="flex items-center space-x-2 text-gray-600 mt-1">
              <MapPin className="w-4 h-4" />
              <span className="text-sm">
                {screen.location}, {screen.city}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Media Carousel with 3D Animations */}
          {mediaItems.length > 0 && (
            <div className="relative aspect-video rounded-xl overflow-hidden bg-gradient-to-br from-gray-900 to-gray-800 shadow-2xl">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentMediaIndex}
                  initial={{ opacity: 0, rotateY: 90, scale: 0.8 }}
                  animate={{ opacity: 1, rotateY: 0, scale: 1 }}
                  exit={{ opacity: 0, rotateY: -90, scale: 0.8 }}
                  transition={{ duration: 0.6, type: "spring" }}
                  className="w-full h-full"
                  style={{
                    transformStyle: "preserve-3d",
                    perspective: "1000px",
                  }}
                >
                  {mediaItems[currentMediaIndex].type === "video" ? (
                    <video
                      src={mediaItems[currentMediaIndex].url}
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    />
                  ) : (
                    <img
                      src={mediaItems[currentMediaIndex].url}
                      alt={screen.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = "/billboard.png";
                      }}
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Media Label */}
              <div className="absolute top-4 left-4 bg-black/70 backdrop-blur-sm px-4 py-2 rounded-lg">
                <div className="flex items-center space-x-2">
                  <Clock className="w-4 h-4 text-white" />
                  <span className="text-white text-sm font-medium">
                    {mediaItems[currentMediaIndex].label}
                  </span>
                </div>
              </div>

              {/* Navigation Buttons */}
              {mediaItems.length > 1 && (
                <>
                  <motion.button
                    onClick={prevMedia}
                    className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                  </motion.button>
                  <motion.button
                    onClick={nextMedia}
                    className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white p-3 rounded-full shadow-lg transition-all"
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                  </motion.button>

                  {/* Dots Indicator */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {mediaItems.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        className={`w-2 h-2 rounded-full transition-all ${
                          index === currentMediaIndex
                            ? "bg-white w-8"
                            : "bg-white/50 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* Map Section */}
          {screen.latitude && screen.longitude && (
            <div className="relative h-64 rounded-xl overflow-hidden bg-gray-100 shadow-lg border-2 border-gray-200">
              <iframe
                src={`https://www.google.com/maps?q=${screen.latitude},${screen.longitude}&output=embed&z=15`}
                className="w-full h-full"
                style={{ border: 0 }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Screen Location Map"
              />
              <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-4 py-2 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-red-500" />
                  <span className="text-sm font-semibold text-gray-900">
                    {screen.location}, {screen.city}
                  </span>
                </div>
              </div>
            </div>
          )}

          {/* Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Technical Specifications */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Settings className="w-5 h-5 text-blue-500" />
                <span>Technical Details</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Size:</span>
                  <span className="font-medium text-gray-900">
                    {formatSize()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Resolution:</span>
                  <span className="font-medium text-gray-900">
                    {formatResolution()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Orientation:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formatOrientation()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Device:</span>
                  <span className="font-medium text-gray-900 flex items-center space-x-1">
                    {getDeviceIcon()}
                    <span>{formatDevice()}</span>
                  </span>
                </div>
              </div>
            </div>

            {/* Viewing Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 flex items-center space-x-2">
                <Eye className="w-5 h-5 text-green-500" />
                <span>Viewing Details</span>
              </h3>

              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Viewing Distance:</span>
                  <span className="font-medium text-gray-900 capitalize">
                    {formatViewingDistance()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">
                    Typical Viewer Duration:
                  </span>
                  <span className="font-medium text-gray-900">
                    {formatViewerDuration()}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Peak Hours:</span>
                  <span className="font-medium text-gray-900">
                    {formatPeakHours()}
                  </span>
                </div>
                {screen.daily_footfall && (
                  <div className="flex justify-between">
                    <span className="text-gray-600">Daily Footfall:</span>
                    <span className="font-medium text-gray-900">
                      {screen.daily_footfall.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing - Real Backend Data - Only show if at least one rate exists and is non-zero */}
          {(() => {
            const hasHourly =
              (screen.pricing?.hourly &&
                parseFloat(String(screen.pricing.hourly)) > 0) ||
              (screen.hourly_rate && Number(screen.hourly_rate) > 0);
            const hasDaily =
              (screen.pricing?.daily &&
                parseFloat(String(screen.pricing.daily)) > 0) ||
              (screen.daily_rate && Number(screen.daily_rate) > 0);
            const hasWeekly =
              (screen.pricing?.weekly &&
                parseFloat(String(screen.pricing.weekly)) > 0) ||
              (screen.weekly_rate && Number(screen.weekly_rate) > 0);
            return hasHourly || hasDaily || hasWeekly;
          })() && (
            <div className="bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 rounded-xl p-6 border-2 border-green-200 shadow-lg">
              <h4 className="font-bold text-lg text-green-900 mb-4">
                Pricing Details
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Hourly Rate */}
                {(() => {
                  const hourlyValue = screen.pricing?.hourly
                    ? parseFloat(String(screen.pricing.hourly))
                    : screen.hourly_rate
                    ? Number(screen.hourly_rate)
                    : 0;
                  return hourlyValue > 0;
                })() && (
                  <motion.div
                    className="bg-white rounded-lg p-4 shadow-md border border-green-100"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      Hourly Rate
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {screen.pricing?.currency || "₹"}
                      {screen.pricing?.hourly
                        ? parseFloat(screen.pricing.hourly).toLocaleString()
                        : typeof screen.hourly_rate === "number"
                        ? screen.hourly_rate.toLocaleString()
                        : parseFloat(
                            String(screen.hourly_rate)
                          ).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per hour</div>
                  </motion.div>
                )}

                {/* Daily Rate */}
                {(() => {
                  const dailyValue = screen.pricing?.daily
                    ? parseFloat(String(screen.pricing.daily))
                    : screen.daily_rate
                    ? Number(screen.daily_rate)
                    : 0;
                  return dailyValue > 0;
                })() && (
                  <motion.div
                    className="bg-white rounded-lg p-4 shadow-md border-2 border-green-500"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-sm text-gray-600 mb-1">Daily Rate</div>
                    <div className="text-2xl font-bold text-green-600">
                      {screen.pricing?.currency || "₹"}
                      {screen.pricing?.daily
                        ? parseFloat(screen.pricing.daily).toLocaleString()
                        : typeof screen.daily_rate === "number"
                        ? screen.daily_rate.toLocaleString()
                        : parseFloat(
                            String(screen.daily_rate)
                          ).toLocaleString()}
                    </div>
                    <div className="text-xs text-green-600 mt-1 font-semibold">
                      per day ⭐
                    </div>
                  </motion.div>
                )}

                {/* Weekly Rate */}
                {(() => {
                  const weeklyValue = screen.pricing?.weekly
                    ? parseFloat(String(screen.pricing.weekly))
                    : screen.weekly_rate
                    ? Number(screen.weekly_rate)
                    : 0;
                  return weeklyValue > 0;
                })() && (
                  <motion.div
                    className="bg-white rounded-lg p-4 shadow-md border border-green-100"
                    whileHover={{ scale: 1.05, y: -5 }}
                    transition={{ type: "spring", stiffness: 300 }}
                  >
                    <div className="text-sm text-gray-600 mb-1">
                      Weekly Rate
                    </div>
                    <div className="text-2xl font-bold text-green-600">
                      {screen.pricing?.currency || "₹"}
                      {screen.pricing?.weekly
                        ? parseFloat(screen.pricing.weekly).toLocaleString()
                        : typeof screen.weekly_rate === "number"
                        ? screen.weekly_rate.toLocaleString()
                        : parseFloat(
                            String(screen.weekly_rate)
                          ).toLocaleString()}
                    </div>
                    <div className="text-xs text-gray-500 mt-1">per week</div>
                  </motion.div>
                )}
              </div>
              <p className="text-sm text-green-700 mt-4 text-center font-medium">
                Competitive rates for premium visibility
              </p>
            </div>
          )}

          {/* Features */}
          {screen.features && screen.features.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-lg font-semibold text-gray-900">Features</h3>
              <div className="flex flex-wrap gap-2">
                {screen.features.map((feature, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-medium"
                  >
                    {feature}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gray-50 rounded-b-2xl px-6 py-4 flex justify-end space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
          >
            Close
          </button>
          <button className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium">
            Book Now
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default ScreenDetailModal;
