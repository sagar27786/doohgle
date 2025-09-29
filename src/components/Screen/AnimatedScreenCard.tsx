import React from 'react';
import { Monitor, Edit3, Eye, Trash2, MapPin, Wifi, WifiOff } from 'lucide-react';
import { AdminScreen } from '../../services/adminService';

interface AnimatedScreenCardProps {
  screen: AdminScreen;
  onEdit?: (screen: AdminScreen) => void;
  onDelete?: (screen: AdminScreen) => void;
  onView?: (screen: AdminScreen) => void;
  showActions?: boolean;
}

const AnimatedScreenCard: React.FC<AnimatedScreenCardProps> = ({ 
  screen, 
  onEdit, 
  onDelete, 
  onView, 
  showActions = true 
}) => {
  return (
    <div className="screen-card-parent">
      <div className={`screen-card ${screen.is_active ? 'active' : 'inactive'}`}>
        {/* Glass layer */}
        <div className="screen-card-glass"></div>
        
        {/* Status badge */}
        <div className={`screen-card-status ${screen.is_active ? 'active' : 'inactive'}`}>
          {screen.is_active ? (
            <>
              <Wifi className="w-3 h-3 inline mr-1" />
              Active
            </>
          ) : (
            <>
              <WifiOff className="w-3 h-3 inline mr-1" />
              Inactive
            </>
          )}
        </div>

        {/* Logo circles */}
        <div className="screen-card-logo">
          <span className="circle circle1"></span>
          <span className="circle circle2"></span>
          <span className="circle circle3"></span>
          <div className="circle circle4">
            <Monitor className="w-4 h-4 text-gray-700" />
          </div>
        </div>

        {/* Content */}
        <div className="screen-card-content">
          <span className="title">{screen.screen_name}</span>
          <span className="subtitle">
            <MapPin className="w-3 h-3 inline mr-1" />
            {screen.city}
          </span>
          <span className="info">Device: {screen.device_type}</span>
          <span className="info">Location: {screen.location_in_venue}</span>
          <span className="info">Owner: {screen.owner_name}</span>
          <span className="info">Bookings: {screen.booking_requests_count}</span>
        </div>

        {/* Bottom actions */}
        {showActions && (
          <div className="screen-card-bottom">
            <div className="screen-card-actions">
              {onView && (
                <button
                  className="screen-card-action-btn view"
                  onClick={() => onView(screen)}
                  title="View Details"
                >
                  <Eye className="w-4 h-4" />
                </button>
              )}
              {onEdit && (
                <button
                  className="screen-card-action-btn edit"
                  onClick={() => onEdit(screen)}
                  title="Edit Screen"
                >
                  <Edit3 className="w-4 h-4" />
                </button>
              )}
              {onDelete && (
                <button
                  className="screen-card-action-btn delete"
                  onClick={() => onDelete(screen)}
                  title="Delete Screen"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnimatedScreenCard;