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
  Zap,
  TrendingUp,
  Star,
  Navigation,
  Sparkles,
} from "lucide-react";

interface Screen {
  id: string | number;
  name: string;
  location: string;
  city?: string;
  price_per_day?: number;
  daily_rate?: number | string;
  hourly_rate?: number | string;
  weekly_rate?: number | string;
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
  latitude?: number | string;
  longitude?: number | string;
  pricing?: {
    hourly?: string | number;
    daily?: string | number;
    weekly?: string | number;
    currency?: string;
    cost_per_10_seconds?: string | number;
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
  const [hoveredPricing, setHoveredPricing] = useState<string | null>(null);

  if (!isOpen) return null;

  // Prepare media array
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

  // Helper functions to parse pricing
  const parsePrice = (value: string | number | undefined): number => {
    if (!value) return 0;
    const parsed = typeof value === "string" ? parseFloat(value) : value;
    return isNaN(parsed) ? 0 : parsed;
  };

  const formatPrice = (value: string | number | undefined): string => {
    const price = parsePrice(value);
    if (price === 0) return "0";
    return price.toLocaleString("en-IN");
  };

  // Get pricing values with fallbacks
  const hourlyRate = parsePrice(screen.pricing?.hourly || screen.hourly_rate);
  const dailyRate = parsePrice(screen.pricing?.daily || screen.daily_rate);
  const weeklyRate = parsePrice(screen.pricing?.weekly || screen.weekly_rate);

  const hasPricing = hourlyRate > 0 || dailyRate > 0 || weeklyRate > 0;

  // Parse coordinates
  const lat =
    typeof screen.latitude === "string"
      ? parseFloat(screen.latitude)
      : screen.latitude;
  const lng =
    typeof screen.longitude === "string"
      ? parseFloat(screen.longitude)
      : screen.longitude;
  const hasCoordinates = lat && lng && lat !== 0 && lng !== 0;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9, y: 50 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 50 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
        className="bg-gradient-to-br from-white via-gray-50 to-blue-50 rounded-3xl max-w-4xl w-full max-h-[95vh] overflow-y-auto shadow-2xl border border-gray-200"
      >
        {/* Header with Gradient */}
        <div className="sticky top-0 bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 rounded-t-3xl p-6 flex items-center justify-between shadow-lg z-10">
          <div className="flex-1">
            <h2 className="text-3xl font-bold text-white flex items-center gap-2">
              <Sparkles className="w-8 h-8" />
              {screen.name}
            </h2>
            <div className="flex items-center space-x-2 text-white/90 mt-2">
              <MapPin className="w-5 h-5" />
              <span className="text-sm font-medium">
                {screen.location}, {screen.city}
              </span>
            </div>
          </div>
          <motion.button
            onClick={onClose}
            whileHover={{ scale: 1.1, rotate: 90 }}
            whileTap={{ scale: 0.9 }}
            className="p-3 rounded-full text-white hover:bg-white/20 transition-all backdrop-blur-sm"
          >
            <X className="w-7 h-7" />
          </motion.button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Media Carousel with 3D Animations */}
          {mediaItems.length > 0 && (
            <div className="relative aspect-video rounded-2xl overflow-hidden bg-gradient-to-br from-gray-900 to-indigo-900 shadow-2xl ring-4 ring-indigo-500/20">
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
                      alt={mediaItems[currentMediaIndex].label}
                      className="w-full h-full object-cover"
                    />
                  )}
                </motion.div>
              </AnimatePresence>

              {/* Navigation Arrows */}
              {mediaItems.length > 1 && (
                <>
                  <motion.button
                    onClick={prevMedia}
                    whileHover={{ scale: 1.1, x: -5 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-all"
                  >
                    <ChevronLeft className="w-6 h-6 text-gray-900" />
                  </motion.button>
                  <motion.button
                    onClick={nextMedia}
                    whileHover={{ scale: 1.1, x: 5 }}
                    whileTap={{ scale: 0.9 }}
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full bg-white/90 backdrop-blur-sm shadow-xl hover:bg-white transition-all"
                  >
                    <ChevronRight className="w-6 h-6 text-gray-900" />
                  </motion.button>

                  {/* Media Label */}
                  <div className="absolute top-4 left-4 bg-black/60 backdrop-blur-md px-4 py-2 rounded-full text-white text-sm font-semibold shadow-lg">
                    {mediaItems[currentMediaIndex].label}
                  </div>

                  {/* Media Dots */}
                  <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
                    {mediaItems.map((_, index) => (
                      <motion.button
                        key={index}
                        onClick={() => setCurrentMediaIndex(index)}
                        whileHover={{ scale: 1.2 }}
                        className={`h-2 rounded-full transition-all ${
                          index === currentMediaIndex
                            ? "bg-white w-8 shadow-lg"
                            : "bg-white/50 w-2 hover:bg-white/75"
                        }`}
                      />
                    ))}
                  </div>
                </>
              )}
            </div>
          )}

          {/* DAZZLING PRICING SECTION - Only show if pricing exists */}
          {hasPricing && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-emerald-400 via-teal-500 to-cyan-500 rounded-2xl blur-xl opacity-30 animate-pulse"></div>
              <div className="relative bg-gradient-to-br from-emerald-50 via-teal-50 to-cyan-50 rounded-2xl p-8 border-2 border-emerald-200 shadow-2xl overflow-hidden">
                {/* Animated Background Pattern */}
                <div className="absolute inset-0 opacity-10">
                  <div className="absolute top-0 left-0 w-40 h-40 bg-emerald-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob"></div>
                  <div className="absolute top-0 right-0 w-40 h-40 bg-teal-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-2000"></div>
                  <div className="absolute bottom-0 left-1/2 w-40 h-40 bg-cyan-500 rounded-full mix-blend-multiply filter blur-3xl animate-blob animation-delay-4000"></div>
                </div>

                <div className="relative z-10">
                  <div className="flex items-center justify-between mb-6">
                    <h4 className="font-black text-3xl bg-gradient-to-r from-emerald-600 via-teal-600 to-cyan-600 bg-clip-text text-transparent flex items-center gap-3">
                      <Zap className="w-8 h-8 text-emerald-600 animate-pulse" />
                      Premium Pricing
                    </h4>
                    <div className="flex items-center gap-2 bg-white/80 backdrop-blur-sm px-4 py-2 rounded-full shadow-lg">
                      <Star className="w-5 h-5 text-yellow-500 fill-yellow-500" />
                      <span className="text-sm font-bold text-gray-700">
                        Best Value
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Hourly Rate */}
                    {hourlyRate > 0 && (
                      <motion.div
                        onHoverStart={() => setHoveredPricing("hourly")}
                        onHoverEnd={() => setHoveredPricing(null)}
                        whileHover={{
                          scale: 1.08,
                          y: -10,
                          rotateY: 5,
                          boxShadow:
                            "0 25px 50px -12px rgba(16, 185, 129, 0.5)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-emerald-400 to-teal-500 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
                        <div className="relative bg-white rounded-xl p-6 shadow-xl border-2 border-emerald-300 overflow-hidden">
                          <div className="absolute top-0 right-0 w-24 h-24 bg-emerald-100 rounded-full -mr-12 -mt-12 opacity-50"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <Clock className="w-8 h-8 text-emerald-600" />
                              {hoveredPricing === "hourly" && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="bg-emerald-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                                >
                                  FAST
                                </motion.div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 font-semibold mb-2">
                              Hourly Rate
                            </div>
                            <div className="text-4xl font-black text-emerald-600 mb-1">
                              ₹{formatPrice(hourlyRate)}
                            </div>
                            <div className="text-xs text-emerald-600 font-medium">
                              per hour
                            </div>
                            <div className="mt-4 pt-4 border-t border-emerald-100">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <TrendingUp className="w-4 h-4 text-emerald-500" />
                                <span>Perfect for short campaigns</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Daily Rate - Featured */}
                    {dailyRate > 0 && (
                      <motion.div
                        onHoverStart={() => setHoveredPricing("daily")}
                        onHoverEnd={() => setHoveredPricing(null)}
                        whileHover={{
                          scale: 1.12,
                          y: -15,
                          rotateY: 5,
                          boxShadow:
                            "0 30px 60px -15px rgba(20, 184, 166, 0.6)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl blur-lg group-hover:blur-xl transition-all"></div>
                        <div className="relative bg-white rounded-xl p-6 shadow-2xl border-4 border-teal-400 overflow-hidden">
                          <div className="absolute top-0 left-0 bg-gradient-to-br from-teal-400 to-cyan-400 text-white px-3 py-1 text-xs font-bold rounded-br-xl">
                            POPULAR
                          </div>
                          <div className="absolute top-0 right-0 w-32 h-32 bg-teal-100 rounded-full -mr-16 -mt-16 opacity-50"></div>
                          <div className="relative z-10 pt-4">
                            <div className="flex items-center justify-between mb-3">
                              <Calendar className="w-10 h-10 text-teal-600" />
                              {hoveredPricing === "daily" && (
                                <motion.div
                                  initial={{ scale: 0, rotate: -180 }}
                                  animate={{ scale: 1, rotate: 0 }}
                                  className="bg-teal-500 text-white px-3 py-1 rounded-full text-xs font-bold"
                                >
                                  BEST DEAL
                                </motion.div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 font-semibold mb-2">
                              Daily Rate
                            </div>
                            <div className="text-5xl font-black bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent mb-1">
                              ₹{formatPrice(dailyRate)}
                            </div>
                            <div className="text-xs text-teal-600 font-bold">
                              per day ⭐
                            </div>
                            <div className="mt-4 pt-4 border-t border-teal-100">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <Sparkles className="w-4 h-4 text-teal-500" />
                                <span>Most popular choice</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}

                    {/* Weekly Rate */}
                    {weeklyRate > 0 && (
                      <motion.div
                        onHoverStart={() => setHoveredPricing("weekly")}
                        onHoverEnd={() => setHoveredPricing(null)}
                        whileHover={{
                          scale: 1.08,
                          y: -10,
                          rotateY: -5,
                          boxShadow: "0 25px 50px -12px rgba(6, 182, 212, 0.5)",
                        }}
                        whileTap={{ scale: 0.98 }}
                        className="relative group cursor-pointer"
                      >
                        <div className="absolute inset-0 bg-gradient-to-br from-cyan-400 to-blue-500 rounded-xl blur-md group-hover:blur-lg transition-all"></div>
                        <div className="relative bg-white rounded-xl p-6 shadow-xl border-2 border-cyan-300 overflow-hidden">
                          <div className="absolute bottom-0 left-0 w-24 h-24 bg-cyan-100 rounded-full -ml-12 -mb-12 opacity-50"></div>
                          <div className="relative z-10">
                            <div className="flex items-center justify-between mb-3">
                              <Calendar className="w-8 h-8 text-cyan-600" />
                              {hoveredPricing === "weekly" && (
                                <motion.div
                                  initial={{ scale: 0 }}
                                  animate={{ scale: 1 }}
                                  className="bg-cyan-500 text-white px-2 py-1 rounded-full text-xs font-bold"
                                >
                                  SAVE
                                </motion.div>
                              )}
                            </div>
                            <div className="text-sm text-gray-600 font-semibold mb-2">
                              Weekly Rate
                            </div>
                            <div className="text-4xl font-black text-cyan-600 mb-1">
                              ₹{formatPrice(weeklyRate)}
                            </div>
                            <div className="text-xs text-cyan-600 font-medium">
                              per week
                            </div>
                            <div className="mt-4 pt-4 border-t border-cyan-100">
                              <div className="flex items-center gap-2 text-xs text-gray-600">
                                <TrendingUp className="w-4 h-4 text-cyan-500" />
                                <span>Best value for extended reach</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Map Section */}
          {hasCoordinates && (
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="relative"
            >
              <h4 className="font-bold text-2xl text-gray-900 mb-4 flex items-center gap-3">
                <Navigation className="w-7 h-7 text-blue-600" />
                Location
              </h4>
              <div className="relative h-80 rounded-2xl overflow-hidden shadow-2xl border-4 border-blue-200 ring-4 ring-blue-100">
                <iframe
                  src={`https://www.google.com/maps?q=${lat},${lng}&output=embed&z=15`}
                  className="w-full h-full"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Screen Location Map"
                />
                <div className="absolute top-4 left-4 bg-white/95 backdrop-blur-sm px-5 py-3 rounded-xl shadow-xl border border-gray-200">
                  <div className="flex items-center space-x-3">
                    <MapPin className="w-5 h-5 text-red-500" />
                    <div>
                      <div className="text-sm font-bold text-gray-900">
                        {screen.location}, {screen.city}
                      </div>
                      <div className="text-xs text-gray-600">
                        {lat?.toFixed(4)}, {lng?.toFixed(4)}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          )}

          {/* Technical Details */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                <Settings className="w-6 h-6 text-indigo-600" />
                <span>Technical Specs</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Size:</span>
                  <span className="font-bold text-gray-900">
                    {screen.screen_size_width && screen.screen_size_height
                      ? `${screen.screen_size_width}x${screen.screen_size_height}"`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Resolution:</span>
                  <span className="font-bold text-gray-900">
                    {screen.resolution_width && screen.resolution_height
                      ? `${screen.resolution_width}x${screen.resolution_height}`
                      : "N/A"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">
                    Orientation:
                  </span>
                  <span className="font-bold text-gray-900 capitalize">
                    {screen.orientation || "Landscape"}
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.5 }}
              className="bg-white rounded-2xl p-6 shadow-lg border border-gray-200"
            >
              <h3 className="text-xl font-bold text-gray-900 flex items-center gap-3 mb-4">
                <Eye className="w-6 h-6 text-purple-600" />
                <span>Viewing Info</span>
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Distance:</span>
                  <span className="font-bold text-gray-900 capitalize">
                    {screen.viewing_distance || "Close"}
                  </span>
                </div>
                <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
                  <span className="text-gray-600 font-medium">Duration:</span>
                  <span className="font-bold text-gray-900">
                    {screen.typical_viewer_duration || "N/A"}
                  </span>
                </div>
                {screen.daily_footfall && (
                  <div className="flex justify-between items-center p-3 bg-purple-50 rounded-lg">
                    <span className="text-purple-600 font-medium">
                      Daily Footfall:
                    </span>
                    <span className="font-bold text-purple-900">
                      {screen.daily_footfall.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>

      {/* Add animation styles */}
      <style>{`
        @keyframes blob {
          0% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
          100% { transform: translate(0px, 0px) scale(1); }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
};

export default ScreenDetailModal;
