import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Bell,
  Check,
  CheckCircle,
  XCircle,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { campaignRequestService, Notification } from '../../services/campaignRequestService';

interface NotificationCenterProps {
  className?: string;
}

const NotificationCenter: React.FC<NotificationCenterProps> = ({ className = "" }) => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [markingAsRead, setMarkingAsRead] = useState<Set<number>>(new Set());

  useEffect(() => {
    loadNotifications();
    
    // Poll for notifications every 30 seconds
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    try {
      setError(null);
      const result = await campaignRequestService.getNotifications();
      
      if (result.success && result.data) {
        setNotifications(result.data);
      } else {
        setError('Failed to load notifications');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error loading notifications:', err);
    } finally {
      setLoading(false);
    }
  };

  const markAsRead = async (notificationId: number) => {
    try {
      setMarkingAsRead(prev => new Set(prev).add(notificationId));
      const result = await campaignRequestService.markNotificationRead(notificationId);
      
      if (result.success) {
        setNotifications(prev => 
          prev.map(n => n.id === notificationId ? { ...n, is_read: true } : n)
        );
      }
    } catch (err) {
      console.error('Error marking notification as read:', err);
    } finally {
      setMarkingAsRead(prev => {
        const newSet = new Set(prev);
        newSet.delete(notificationId);
        return newSet;
      });
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'campaign_request':
        return <Bell className="w-5 h-5 text-blue-600" />;
      case 'request_approved':
        return <CheckCircle className="w-5 h-5 text-green-600" />;
      case 'request_rejected':
        return <XCircle className="w-5 h-5 text-red-600" />;
      case 'payment_required':
        return <AlertTriangle className="w-5 h-5 text-yellow-600" />;
      default:
        return <Bell className="w-5 h-5 text-gray-600" />;
    }
  };

  const getNotificationColor = (type: string) => {
    switch (type) {
      case 'campaign_request':
        return 'border-l-blue-500 bg-blue-50';
      case 'request_approved':
        return 'border-l-green-500 bg-green-50';
      case 'request_rejected':
        return 'border-l-red-500 bg-red-50';
      case 'payment_required':
        return 'border-l-yellow-500 bg-yellow-50';
      default:
        return 'border-l-gray-500 bg-gray-50';
    }
  };

  const unreadCount = notifications.filter(n => !n.is_read).length;

  if (loading && notifications.length === 0) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading notifications...</span>
      </div>
    );
  }

  return (
    <div className={`max-w-2xl ${className}`}>
      <div className="bg-white rounded-lg shadow-lg border overflow-hidden">
        {/* Header */}
        <div className="bg-gray-50 px-6 py-4 border-b">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Bell className="w-6 h-6 text-gray-700" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
                {unreadCount > 0 && (
                  <p className="text-sm text-gray-600">
                    {unreadCount} unread notification{unreadCount !== 1 ? 's' : ''}
                  </p>
                )}
              </div>
            </div>
            <button
              onClick={loadNotifications}
              disabled={loading}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <Loader2 className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            </button>
          </div>
        </div>

        {/* Notifications List */}
        <div className="max-h-96 overflow-y-auto">
          {error && (
            <div className="p-4 border-b bg-red-50 border-l-4 border-l-red-500">
              <p className="text-red-700 text-sm">{error}</p>
              <button 
                onClick={loadNotifications}
                className="text-red-600 hover:text-red-800 text-sm underline mt-1"
              >
                Try again
              </button>
            </div>
          )}

          {notifications.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <Bell className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p>No notifications yet</p>
            </div>
          ) : (
            <AnimatePresence>
              {notifications.map((notification) => (
                <motion.div
                  key={notification.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className={`border-b border-l-4 ${getNotificationColor(notification.type)} ${
                    !notification.is_read ? 'bg-opacity-100' : 'bg-opacity-50'
                  } transition-all duration-200 hover:bg-opacity-75`}
                >
                  <div className="p-4">
                    <div className="flex items-start gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getNotificationIcon(notification.type)}
                      </div>
                      
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <h4 className={`text-sm font-medium ${
                              !notification.is_read ? 'text-gray-900' : 'text-gray-700'
                            }`}>
                              {notification.title}
                            </h4>
                            <p className={`text-sm mt-1 ${
                              !notification.is_read ? 'text-gray-700' : 'text-gray-600'
                            }`}>
                              {notification.message}
                            </p>
                          </div>
                          
                          {!notification.is_read && (
                            <div className="flex items-center gap-2 ml-4">
                              <button
                                onClick={() => markAsRead(notification.id)}
                                disabled={markingAsRead.has(notification.id)}
                                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-800 transition-colors"
                              >
                                {markingAsRead.has(notification.id) ? (
                                  <Loader2 className="w-3 h-3 animate-spin" />
                                ) : (
                                  <Check className="w-3 h-3" />
                                )}
                                Mark read
                              </button>
                            </div>
                          )}
                        </div>
                        
                        <div className="flex items-center justify-between mt-2">
                          <span className="text-xs text-gray-500">
                            {new Date(notification.created_at).toLocaleString()}
                          </span>
                          
                          {!notification.is_read && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="bg-gray-50 px-6 py-3 border-t text-center">
            <button 
              onClick={() => {
                // Mark all as read
                notifications
                  .filter(n => !n.is_read)
                  .forEach(n => markAsRead(n.id));
              }}
              className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
            >
              Mark all as read
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default NotificationCenter;
