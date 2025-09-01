import React from 'react';
import { Monitor, AlertCircle, CheckCircle, Clock, Zap } from 'lucide-react';

interface ScreenMarkerIconProps {
  status: 'active' | 'inactive' | 'maintenance';
  size?: number;
  showPulse?: boolean;
}

const ScreenMarkerIcon: React.FC<ScreenMarkerIconProps> = ({
  status,
  size = 24,
  showPulse = false
}) => {
  const getStatusConfig = () => {
    switch (status) {
      case 'active':
        return {
          bgColor: '#10B981',
          iconColor: '#ffffff',
          Icon: CheckCircle,
          pulseColor: 'rgba(16, 185, 129, 0.4)'
        };
      case 'inactive':
        return {
          bgColor: '#EF4444',
          iconColor: '#ffffff',
          Icon: AlertCircle,
          pulseColor: 'rgba(239, 68, 68, 0.4)'
        };
      case 'maintenance':
        return {
          bgColor: '#F59E0B',
          iconColor: '#ffffff',
          Icon: Clock,
          pulseColor: 'rgba(245, 158, 11, 0.4)'
        };
      default:
        return {
          bgColor: '#6B7280',
          iconColor: '#ffffff',
          Icon: Monitor,
          pulseColor: 'rgba(107, 114, 128, 0.4)'
        };
    }
  };

  const config = getStatusConfig();
  const { bgColor, iconColor, Icon, pulseColor } = config;

  return (
    <div className="relative flex items-center justify-center">
      {/* Pulse animation for active screens */}
      {showPulse && status === 'active' && (
        <div
          className="absolute rounded-full animate-ping"
          style={{
            width: size + 8,
            height: size + 8,
            backgroundColor: pulseColor
          }}
        />
      )}
      
      {/* Main marker */}
      <div
        className="relative flex items-center justify-center rounded-full shadow-lg border-2 border-white"
        style={{
          width: size,
          height: size,
          backgroundColor: bgColor
        }}
      >
        <Icon
          size={size * 0.5}
          color={iconColor}
          className="drop-shadow-sm"
        />
        
        {/* Status indicator dot */}
        <div
          className="absolute -top-1 -right-1 rounded-full border border-white"
          style={{
            width: size * 0.25,
            height: size * 0.25,
            backgroundColor: status === 'active' ? '#10B981' : status === 'maintenance' ? '#F59E0B' : '#EF4444'
          }}
        />
      </div>
    </div>
  );
};

export default ScreenMarkerIcon;

// SVG version for Google Maps custom markers
export const createScreenMarkerSVG = (status: 'active' | 'inactive' | 'maintenance', size: number = 32) => {
  const getStatusConfig = () => {
    // All screens use TV/monitor icon, only color changes based on status
    const tvIconPath = 'M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z';
    
    switch (status) {
      case 'active':
        return { bgColor: '#10B981', iconPath: tvIconPath };
      case 'inactive':
        return { bgColor: '#EF4444', iconPath: tvIconPath };
      case 'maintenance':
        return { bgColor: '#F59E0B', iconPath: tvIconPath };
      default:
        return { bgColor: '#6B7280', iconPath: tvIconPath };
    }
  };

  const { bgColor, iconPath } = getStatusConfig();

  return `
    <svg width="${size}" height="${size}" viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg">
      <defs>
        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="2" stdDeviation="2" flood-color="rgba(0,0,0,0.3)"/>
        </filter>
      </defs>
      
      <!-- Main circle -->
      <circle 
        cx="${size/2}" 
        cy="${size/2}" 
        r="${size/2 - 2}" 
        fill="${bgColor}" 
        stroke="white" 
        stroke-width="2"
        filter="url(#shadow)"
      />
      
      <!-- Icon -->
      <g transform="translate(${size/4}, ${size/4}) scale(${size/32})">
        <path 
          d="${iconPath}" 
          fill="none" 
          stroke="white" 
          stroke-width="2" 
          stroke-linecap="round" 
          stroke-linejoin="round"
        />
      </g>
      
      <!-- Status dot -->
      <circle 
        cx="${size - 6}" 
        cy="6" 
        r="4" 
        fill="${bgColor}" 
        stroke="white" 
        stroke-width="1"
      />
    </svg>
  `;
};

// Create data URL for Google Maps marker
export const createScreenMarkerDataURL = (status: 'active' | 'inactive' | 'maintenance', size: number = 32) => {
  const svg = createScreenMarkerSVG(status, size);
  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
};