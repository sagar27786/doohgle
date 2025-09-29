import React from 'react';
import { Heart, MapPin, Eye } from 'lucide-react';
import { motion } from 'framer-motion';



interface AnimatedCampaignScreenCardProps {
  screen: any;
  index: number;
  onSelect: (screen: any) => void;
  onFavoriteToggle: (screenId: number, e: React.MouseEvent) => void;
  getScreenTypeIcon: (type: string) => React.ReactNode;
}

const AnimatedCampaignScreenCard: React.FC<AnimatedCampaignScreenCardProps> = ({ 
  screen, 
  index,
  onSelect,
  onFavoriteToggle,
  getScreenTypeIcon
}) => {
  return (
    <div className="screen-card-parent">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.1, duration: 0.3 }}
        whileHover={{ scale: 1.02, y: -5 }}
        whileTap={{ scale: 0.98 }}
        onClick={() => onSelect(screen)}
        className="screen-card active cursor-pointer"
      >
        {/* Glass layer */}
        <div className="screen-card-glass"></div>
        
        {/* Favorite badge */}
        {screen.is_favorite && (
          <div className="absolute top-4 left-4 bg-red-500 text-white px-2 py-1 rounded-full text-xs font-bold z-10">
            ⭐ Favorite
          </div>
        )}

        {/* Logo circles with screen type */}
        <div className="screen-card-logo">
          <span className="circle circle1"></span>
          <span className="circle circle2"></span>
          <span className="circle circle3"></span>
          <div className="circle circle4">
            {getScreenTypeIcon(screen.screen_type)}
          </div>
        </div>

        {/* Content */}
        <div className="screen-card-content">
          <span className="title">{screen.name}</span>
          <span className="subtitle">
            <MapPin className="w-3 h-3 inline mr-1" />
            {screen.address}
          </span>
          <span className="info">City: {screen.city}</span>
          <span className="info">
            <Eye className="w-3 h-3 inline mr-1" />
            {(screen.daily_footfall / 1000).toFixed(1)}K daily views
          </span>
          <span className="info">Resolution: {screen.resolution_width}x{screen.resolution_height}</span>
        </div>

        {/* Bottom actions and pricing */}
        <div className="screen-card-bottom">
          <div className="flex items-center justify-between w-full">
            <div className="text-sm">
              <div className="font-bold text-blue-600">
                ₹{screen.pricing?.hourly || 180}/hr
              </div>
              <div className="text-xs text-gray-600">
                ₹{screen.pricing?.daily || 1800}/day
              </div>
            </div>
            <motion.button
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => onFavoriteToggle(screen.id, e)}
              className={`p-2 rounded-full transition-all duration-200 ${
                screen.is_favorite 
                  ? 'bg-red-500 text-white shadow-lg' 
                  : 'bg-white/90 text-gray-600 hover:bg-red-50 hover:text-red-500'
              }`}
            >
              <Heart 
                className="w-4 h-4" 
                fill={screen.is_favorite ? '#ffffff' : 'none'}
                stroke={screen.is_favorite ? '#ffffff' : 'currentColor'}
              />
            </motion.button>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default AnimatedCampaignScreenCard;