import React from 'react';
import { Monitor, Edit3, Eye, Trash2, MapPin, Wifi, WifiOff } from 'lucide-react';

interface MovingScreenCardProps {
  screen: any;
  onEdit?: (screen: any) => void;
  onDelete?: (screen: any) => void;
  onView?: (screen: any) => void;
  onClick?: (screen: any) => void;
  showActions?: boolean;
}

const MovingScreenCard: React.FC<MovingScreenCardProps> = ({ 
  screen, 
  onEdit, 
  onDelete, 
  onView,
  onClick,
  showActions = true 
}) => {
  const handleCardClick = () => {
    if (onClick) {
      onClick(screen);
    }
  };

  return (
    <div className="moving-parent" onClick={handleCardClick}>
      <div className="moving-card">
        {/* Glass layer */}
        <div className="moving-glass"></div>
        
        {/* Moving Logo circles */}
        <div className="moving-logo">
          <span className="circle circle1"></span>
          <span className="circle circle2"></span>
          <span className="circle circle3"></span>
          <span className="circle circle4"></span>
          <div className="circle circle5">
            <Monitor className="w-5 h-5 text-white" />
          </div>
        </div>

        {/* Content */}
        <div className="moving-content">
          <span className="title">{screen.screen_name || screen.name}</span>
          <span className="text">
            <MapPin className="w-3 h-3 inline mr-1" />
            {screen.city}
          </span>
          <div className="text text-xs mt-2">
            Device: {screen.device_type || screen.screen_type}
          </div>
          <div className="text text-xs">
            Location: {screen.location_in_venue || screen.address}
          </div>
          {screen.owner_name && (
            <div className="text text-xs">
              Owner: {screen.owner_name}
            </div>
          )}
          {screen.booking_requests_count && (
            <div className="text text-xs">
              Bookings: {screen.booking_requests_count}
            </div>
          )}
          {screen.daily_footfall && (
            <div className="text text-xs">
              Views: {(screen.daily_footfall / 1000).toFixed(1)}K/day
            </div>
          )}
        </div>

        {/* Bottom actions */}
        <div className="moving-bottom">
          <div className="view-more">
            <div className="text-xs text-white">
              {screen.is_active !== undefined ? (
                screen.is_active ? (
                  <span className="flex items-center">
                    <Wifi className="w-3 h-3 mr-1" />
                    Active
                  </span>
                ) : (
                  <span className="flex items-center">
                    <WifiOff className="w-3 h-3 mr-1" />
                    Inactive
                  </span>
                )
              ) : (
                <span>Available</span>
              )}
            </div>
          </div>
          
          {showActions && (
            <div className="social-buttons-container">
              {onView && (
                <button
                  className="social-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onView(screen);
                  }}
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  className="social-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onEdit(screen);
                  }}
                  title="Edit Screen"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  className="social-button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onDelete(screen);
                  }}
                  title="Delete Screen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default MovingScreenCard;