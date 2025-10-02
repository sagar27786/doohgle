import React from "react";
import { motion } from "framer-motion";
import {
  MapPin,
  DollarSign,
  Eye,
  Heart,
  Wifi,
  Users,
  Star,
  Navigation,
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
  video_url?: string;
  day_photo_url?: string;
  night_photo_url?: string;
  latitude?: number;
  longitude?: number;
  features?: string[];
  rating?: number;
  views_per_day?: number;
  isFavorite?: boolean;
  pricing?: {
    hourly?: string;
    daily?: string;
    weekly?: string;
    currency?: string;
    cost_per_10_seconds?: string;
  };
  // Additional detailed properties for displaying real data
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
}

interface AnimatedScreenCardProps {
  screen: Screen;
  onFavorite?: (screenId: string | number) => void;
  onView?: (screen: Screen) => void;
  className?: string;
}

const AnimatedScreenCard: React.FC<AnimatedScreenCardProps> = ({
  screen,
  onFavorite,
  onView,
  className = "",
}) => {
  const price =
    screen.price_per_day ||
    (screen.daily_rate ? Number(screen.daily_rate) : undefined);
  const mediaUrl =
    screen.media_urls?.[0] || screen.image_url || screen.video_url;
  const isVideo =
    mediaUrl?.includes(".mp4") ||
    mediaUrl?.includes(".webm") ||
    mediaUrl?.includes("video");

  return (
    <motion.div
      className={`animated-screen-card ${className}`}
      initial={{ opacity: 0, y: 20, rotateX: -15 }}
      animate={{ opacity: 1, y: 0, rotateX: 0 }}
      whileHover={{
        y: -8,
        rotateX: 5,
        rotateY: 5,
        scale: 1.02,
        transition: { duration: 0.3, ease: "easeOut" },
      }}
      whileTap={{ scale: 0.98 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      style={{
        transformStyle: "preserve-3d",
        perspective: "1000px",
      }}
    >
      <div className="card-inner">
        {/* Media Section */}
        <div className="media-container">
          {mediaUrl ? (
            isVideo ? (
              <video
                src={mediaUrl}
                className="media-content"
                autoPlay
                muted
                loop
                playsInline
              />
            ) : (
              <img
                src={mediaUrl}
                alt={screen.name}
                className="media-content"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = "/billboard.png";
                }}
              />
            )
          ) : (
            <div className="media-placeholder">
              <div className="placeholder-icon">
                <Eye className="w-12 h-12" />
              </div>
              <p className="placeholder-text">No Media Available</p>
            </div>
          )}

          {/* Overlay with gradient */}
          <div className="media-overlay" />

          {/* Favorite Button */}
          <motion.button
            onClick={(e) => {
              e.stopPropagation();
              onFavorite?.(screen.id);
            }}
            className="favorite-button"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <Heart
              className={`w-5 h-5 ${
                screen.isFavorite ? "text-red-500 fill-current" : "text-white"
              }`}
            />
          </motion.button>

          {/* Map Button - Only show if coordinates exist */}
          {screen.latitude && screen.longitude && (
            <motion.button
              onClick={(e) => {
                e.stopPropagation();
                window.open(
                  `https://www.google.com/maps?q=${screen.latitude},${screen.longitude}`,
                  "_blank"
                );
              }}
              className="absolute bottom-3 right-3 bg-white/90 backdrop-blur-sm p-2 rounded-full shadow-lg hover:bg-white transition-all"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="View on Map"
            >
              <Navigation className="w-5 h-5 text-blue-600" />
            </motion.button>
          )}
        </div>

        {/* Content Section */}
        <div className="card-content">
          <div className="content-header">
            <h3 className="screen-title">{screen.name}</h3>
            {screen.rating && (
              <div className="rating">
                <Star className="w-4 h-4 text-yellow-400 fill-current" />
                <span>{screen.rating}</span>
              </div>
            )}
          </div>

          <div className="location-info">
            <MapPin className="w-4 h-4 text-gray-500" />
            <span className="location-text">
              {screen.city
                ? `${screen.location}, ${screen.city}`
                : screen.location}
            </span>
          </div>

          {/* Features */}
          {screen.features && screen.features.length > 0 && (
            <div className="features">
              {screen.features.slice(0, 3).map((feature, index) => (
                <span key={index} className="feature-tag">
                  {feature}
                </span>
              ))}
            </div>
          )}

          {/* Stats */}
          <div className="stats-row">
            {screen.views_per_day && (
              <div className="stat-item">
                <Users className="w-4 h-4 text-blue-500" />
                <span>{screen.views_per_day.toLocaleString()}/day</span>
              </div>
            )}
            {screen.type && (
              <div className="stat-item">
                <Wifi className="w-4 h-4 text-green-500" />
                <span>{screen.type}</span>
              </div>
            )}
          </div>

          {/* Price and Action */}
          <div className="card-footer">
            {(screen.pricing || price) && (
              <div className="price-section">
                {screen.pricing ? (
                  <div className="flex flex-col space-y-1">
                    {screen.pricing.hourly && (
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">Hourly:</span>
                        <span className="ml-1">
                          {screen.pricing.currency || "₹"}
                          {parseFloat(screen.pricing.hourly).toLocaleString()}
                        </span>
                      </div>
                    )}
                    {screen.pricing.daily && (
                      <div className="flex items-center">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        <span className="price-amount text-base font-bold">
                          {screen.pricing.currency || "₹"}
                          {parseFloat(screen.pricing.daily).toLocaleString()}
                        </span>
                        <span className="text-xs text-gray-500 ml-1">/day</span>
                      </div>
                    )}
                    {screen.pricing.weekly && (
                      <div className="flex items-center text-xs text-gray-600">
                        <span className="font-medium">Weekly:</span>
                        <span className="ml-1">
                          {screen.pricing.currency || "₹"}
                          {parseFloat(screen.pricing.weekly).toLocaleString()}
                        </span>
                      </div>
                    )}
                  </div>
                ) : price ? (
                  <div className="flex items-center">
                    <DollarSign className="w-5 h-5 text-green-600" />
                    <span className="price-amount">
                      ₹{price.toLocaleString()}
                    </span>
                    <span className="price-period ml-1">per day</span>
                  </div>
                ) : null}
              </div>
            )}

            <motion.button
              onClick={() => onView?.(screen)}
              className="view-button"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Eye className="w-4 h-4" />
              <span>View Details</span>
            </motion.button>
          </div>
        </div>

        {/* 3D Effect Elements */}
        <div className="card-glow" />
        <div className="card-shine" />
      </div>
    </motion.div>
  );
};

export default AnimatedScreenCard;
