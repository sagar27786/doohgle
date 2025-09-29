import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Monitor, DollarSign, Clock, Trash2, Heart } from 'lucide-react';
import { cn } from '../utils/cn';

interface Screen {
  screen_id: number;
  screen_name: string;
  screen_type: string;
  location: string;
  city: string;
  state: string;
  price_per_slot: number;
  availability_status: string;
  media_url?: string;
  latitude?: number;
  longitude?: number;
  is_favorite?: boolean;
}

interface ScreenCardProps {
  screen: Screen;
  onToggleFavorite?: (screenId: number) => void;
  onDelete?: (screenId: number) => void;
  showActions?: boolean;
  className?: string;
}

const ScreenCard: React.FC<ScreenCardProps> = ({
  screen,
  onToggleFavorite,
  onDelete,
  showActions = true,
  className
}) => {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      whileHover={{ 
        y: -5, 
        transition: { duration: 0.2 }
      }}
      className={cn(
        "group relative overflow-hidden rounded-xl bg-gradient-to-br from-white/10 to-white/5 backdrop-blur-md",
        "border border-white/20 hover:border-white/30 transition-all duration-300",
        "shadow-lg hover:shadow-2xl hover:shadow-purple-500/20",
        className
      )}
    >
      {/* Background Gradient Overlay */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
      
      {/* Image Section */}
      <div className="relative h-48 overflow-hidden">
        {screen.media_url ? (
          <img
            src={screen.media_url}
            alt={screen.screen_name}
            className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-gray-700 to-gray-900 flex items-center justify-center">
            <Monitor className="w-16 h-16 text-gray-400" />
          </div>
        )}
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <span className={cn(
            "px-2 py-1 rounded-full text-xs font-medium backdrop-blur-sm",
            screen.availability_status === 'available' 
              ? "bg-green-500/80 text-white" 
              : "bg-red-500/80 text-white"
          )}>
            {screen.availability_status}
          </span>
        </div>

        {/* Action Buttons */}
        {showActions && (
          <div className="absolute top-3 right-3 flex gap-2">
            {onToggleFavorite && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onToggleFavorite(screen.screen_id);
                }}
                className={cn(
                  "p-2 rounded-full backdrop-blur-sm transition-all duration-200",
                  screen.is_favorite 
                    ? "bg-red-500/80 text-white shadow-lg shadow-red-500/30" 
                    : "bg-white/20 text-white hover:bg-white/30"
                )}
              >
                <Heart className={cn(
                  "w-4 h-4 transition-all duration-200",
                  screen.is_favorite ? "fill-current" : ""
                )} />
              </motion.button>
            )}
            
            {onDelete && (
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={(e) => {
                  e.stopPropagation();
                  onDelete(screen.screen_id);
                }}
                className="p-2 rounded-full bg-red-500/80 text-white backdrop-blur-sm hover:bg-red-600/80 transition-all duration-200 shadow-lg shadow-red-500/30"
              >
                <Trash2 className="w-4 h-4" />
              </motion.button>
            )}
          </div>
        )}
      </div>

      {/* Content Section */}
      <div className="p-6 space-y-4">
        {/* Title */}
        <div>
          <h3 className="text-xl font-bold text-white mb-1 group-hover:text-blue-300 transition-colors duration-200">
            {screen.screen_name}
          </h3>
          <p className="text-gray-400 text-sm capitalize">
            {screen.screen_type}
          </p>
        </div>

        {/* Location */}
        <div className="flex items-center gap-2 text-gray-300">
          <MapPin className="w-4 h-4 text-blue-400" />
          <span className="text-sm">
            {screen.location}, {screen.city}, {screen.state}
          </span>
        </div>

        {/* Price */}
        <div className="flex items-center gap-2">
          <DollarSign className="w-4 h-4 text-green-400" />
          <span className="text-lg font-semibold text-green-400">
            ₹{screen.price_per_slot}
          </span>
          <span className="text-gray-400 text-sm">per slot</span>
        </div>

        {/* Additional Info */}
        <div className="flex items-center justify-between pt-2 border-t border-white/10">
          <div className="flex items-center gap-2 text-gray-400 text-sm">
            <Clock className="w-4 h-4" />
            <span>ID: {screen.screen_id}</span>
          </div>
          
          {screen.latitude && screen.longitude && (
            <div className="text-xs text-gray-500">
              {screen.latitude.toFixed(4)}, {screen.longitude.toFixed(4)}
            </div>
          )}
        </div>
      </div>

      {/* Hover Effect Border */}
      <div className="absolute inset-0 rounded-xl border-2 border-transparent group-hover:border-gradient-to-r group-hover:from-blue-500/50 group-hover:to-purple-500/50 transition-all duration-300 pointer-events-none" />
    </motion.div>
  );
};

export default ScreenCard;