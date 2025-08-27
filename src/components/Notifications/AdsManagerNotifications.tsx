import React, { useState, useEffect } from 'react';
import { Bell, CheckCircle, XCircle, MapPin, User, Calendar, DollarSign, Eye, EyeOff } from 'lucide-react';

interface AdsManagerNotification {
  id: number;
  type: 'booking_approved' | 'booking_rejected';
  title: string;
  message: string;
  data: {
    booking_request_id: number;
    location: string;
    customer_name: string;
    status: string;
    screen_owner_id: number;
  };
  read: boolean;
  created_at: string;
}

interface NotificationsResponse {
  success: boolean;
  notifications: AdsManagerNotification[];
  total: number;
  unread: number;
}

const AdsManagerNotifications: React.FC = () => {
  const [notifications, setNotifications] = useState<AdsManagerNotification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isExpanded, setIsExpanded] = useState(false);

  const fetchNotifications = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/bookings/notifications', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch notifications');
      }

      const data: NotificationsResponse = await response.json();
      setNotifications(data.notifications || []);
      setUnreadCount(data.unread || 0);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      const token = localStorage.getItem('token');
      await fetch(`http://localhost:4000/api/bookings/notifications/${notificationId}/read`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      // Update local state
      setNotifications(prev => 
        prev.map(n => n.id === notificationId ? { ...n, read: true } : n)
      );
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  useEffect(() => {
    fetchNotifications();
    // Refresh notifications every 30 seconds
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_approved':
        return <CheckCircle className="text-green-500" size={20} />;
      case 'booking_rejected':
        return <XCircle className="text-red-500" size={20} />;
      default:
        return <Bell className="text-blue-500" size={20} />;
    }
  };

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="text-red-600 text-sm">Error loading notifications: {error}</div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200">
      {/* Notification Header */}
      <div 
        className="flex items-center justify-between p-4 cursor-pointer hover:bg-gray-50"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center gap-3">
          <Bell size={20} className="text-gray-600" />
          <h3 className="text-lg font-medium text-gray-900">Booking Notifications</h3>
          {unreadCount > 0 && (
            <span className="bg-red-500 text-white text-xs px-2 py-1 rounded-full">
              {unreadCount}
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-500">
            {notifications.length} notifications
          </span>
          {isExpanded ? <EyeOff size={16} /> : <Eye size={16} />}
        </div>
      </div>

      {/* Notification Content */}
      {isExpanded && (
        <div className="border-t border-gray-200">
          {loading ? (
            <div className="p-4 text-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-600 mx-auto"></div>
            </div>
          ) : notifications.length === 0 ? (
            <div className="p-6 text-center text-gray-500">
              <Bell size={24} className="mx-auto mb-2 text-gray-400" />
              <div>No booking notifications yet</div>
              <div className="text-sm">Screen owners will notify you about bookings here</div>
            </div>
          ) : (
            <div className="max-h-96 overflow-y-auto">
              {notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-gray-100 last:border-b-0 transition-colors ${
                    !notification.read ? 'bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => !notification.read && markAsRead(notification.id)}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {getNotificationIcon(notification.type)}
                    </div>
                    
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <h4 className={`text-sm font-medium ${!notification.read ? 'text-gray-900' : 'text-gray-700'}`}>
                          {notification.title}
                        </h4>
                        <span className="text-xs text-gray-500">
                          {new Date(notification.created_at).toLocaleDateString()}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 mt-1">
                        {notification.message}
                      </p>
                      
                      {notification.data && (
                        <div className="mt-2 space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <MapPin size={12} />
                            <span>{notification.data.location}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-500">
                            <User size={12} />
                            <span>Customer: {notification.data.customer_name}</span>
                          </div>
                        </div>
                      )}
                      
                      {!notification.read && (
                        <div className="mt-2">
                          <button
                            onClick={(e) => {
                              e.stopPropagation();
                              markAsRead(notification.id);
                            }}
                            className="text-xs text-blue-600 hover:text-blue-700"
                          >
                            Mark as read
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
          
          {notifications.length > 0 && (
            <div className="p-3 bg-gray-50 text-center">
              <button
                onClick={fetchNotifications}
                className="text-sm text-blue-600 hover:text-blue-700"
              >
                Refresh notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AdsManagerNotifications;
