import React, { useState, useEffect } from 'react';
import { Bell, X, Check, XIcon, MapPin, Calendar, DollarSign, Monitor, User } from 'lucide-react';
import BookingNotificationService, { BookingNotification } from '../../services/bookingNotificationService';
import { authService } from '../../services/authService';

const BookingNotificationCenter: React.FC = () => {
  const [notifications, setNotifications] = useState<BookingNotification[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    const service = BookingNotificationService.getInstance();
    service.init();

    const unsubscribe = service.subscribe(() => {
      if (currentUser) {
        const userType = currentUser.role === 'venue_owner' ? 'venue_owner' : 'advertiser';
        const filteredNotifications = service.getNotificationsForUser(userType, currentUser.id);
        setNotifications(filteredNotifications);
      }
    });

    return unsubscribe;
  }, [currentUser]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAsRead = (notificationId: string) => {
    const service = BookingNotificationService.getInstance();
    service.markAsRead(notificationId);
  };

  const handleAcceptRequest = async (requestId: string) => {
    setLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      const service = BookingNotificationService.getInstance();
      await service.acceptBookingRequest(requestId);
    } catch (error) {
      console.error('Failed to accept booking request:', error);
    } finally {
      setLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const handleRejectRequest = async (requestId: string) => {
    setLoading(prev => ({ ...prev, [requestId]: true }));
    try {
      const service = BookingNotificationService.getInstance();
      await service.rejectBookingRequest(requestId);
    } catch (error) {
      console.error('Failed to reject booking request:', error);
    } finally {
      setLoading(prev => ({ ...prev, [requestId]: false }));
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'booking_request':
        return <Bell className="h-5 w-5 text-blue-500" />;
      case 'booking_accepted':
        return <Check className="h-5 w-5 text-green-500" />;
      case 'booking_rejected':
        return <XIcon className="h-5 w-5 text-red-500" />;
      default:
        return <Bell className="h-5 w-5 text-gray-500" />;
    }
  };

  const BookingRequestCard: React.FC<{ notification: BookingNotification }> = ({ notification }) => {
    const { data: booking } = notification;
    const isVenueOwner = currentUser?.role === 'venue_owner';
    const isPending = booking.status === 'pending';
    const isLoading = loading[booking.id];

    return (
      <div className={`p-4 border-l-4 ${
        notification.read 
          ? 'border-gray-300 bg-gray-50 dark:bg-gray-800' 
          : 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
      } rounded-r-lg`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              {getNotificationIcon(notification.type)}
              <h4 className="font-semibold text-gray-900 dark:text-white">
                {notification.type === 'booking_request' && 'New Booking Request'}
                {notification.type === 'booking_accepted' && 'Booking Accepted'}
                {notification.type === 'booking_rejected' && 'Booking Rejected'}
              </h4>
              <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300' :
                booking.status === 'accepted' ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300' :
                'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300'
              }`}>
                {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
              </span>
            </div>

            <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
              {notification.message}
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <User className="h-4 w-4" />
                <span>{booking.campaignName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Monitor className="h-4 w-4" />
                <span>{booking.screenName}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{booking.location}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <DollarSign className="h-4 w-4" />
                <span>₹{booking.campaignBudget.toLocaleString()}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                <Calendar className="h-4 w-4" />
                <span>{new Date(booking.startDate).toLocaleDateString()} - {new Date(booking.endDate).toLocaleDateString()}</span>
              </div>
            </div>

            {booking.screenDetails && (
              <div className="bg-white dark:bg-gray-700 rounded-lg p-3 mb-3">
                <h5 className="font-medium text-gray-900 dark:text-white mb-2">Screen Details</h5>
                <div className="grid grid-cols-2 gap-2 text-sm text-gray-600 dark:text-gray-300">
                  <div>Size: {booking.screenDetails.size}</div>
                  <div>Resolution: {booking.screenDetails.resolution}</div>
                  <div>Type: {booking.screenDetails.type}</div>
                  {booking.screenDetails.latitude && booking.screenDetails.longitude && (
                    <div>
                      Location: {booking.screenDetails.latitude.toFixed(4)}, {booking.screenDetails.longitude.toFixed(4)}
                    </div>
                  )}
                </div>
              </div>
            )}

            {isVenueOwner && isPending && (
              <div className="flex gap-2">
                <button
                  onClick={() => handleAcceptRequest(booking.id)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Accept'}
                </button>
                <button
                  onClick={() => handleRejectRequest(booking.id)}
                  disabled={isLoading}
                  className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 disabled:opacity-50 text-white rounded-lg font-medium transition-colors"
                >
                  {isLoading ? 'Processing...' : 'Reject'}
                </button>
              </div>
            )}
          </div>

          <div className="flex flex-col items-end gap-2">
            <span className="text-xs text-gray-500 dark:text-gray-400">
              {formatDate(notification.createdAt)}
            </span>
            {!notification.read && (
              <button
                onClick={() => handleMarkAsRead(notification.id)}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Mark as read
              </button>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
      >
        <Bell className="h-6 w-6" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Panel */}
      {isOpen && (
        <div className="absolute right-0 top-full mt-2 w-96 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-gray-200 dark:border-gray-700 z-50 max-h-96 overflow-hidden">
          <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="font-semibold text-gray-900 dark:text-white">
              Notifications {unreadCount > 0 && `(${unreadCount})`}
            </h3>
            <button
              onClick={() => setIsOpen(false)}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <div className="max-h-80 overflow-y-auto">
            {notifications.length === 0 ? (
              <div className="p-8 text-center">
                <Bell className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500 dark:text-gray-400">No notifications yet</p>
              </div>
            ) : (
              <div className="divide-y divide-gray-200 dark:divide-gray-700">
                {notifications.map((notification) => (
                  <BookingRequestCard key={notification.id} notification={notification} />
                ))}
              </div>
            )}
          </div>

          {notifications.length > 0 && (
            <div className="p-3 border-t border-gray-200 dark:border-gray-700">
              <button
                onClick={() => {
                  const service = BookingNotificationService.getInstance();
                  service.clearAllNotifications();
                }}
                className="w-full text-center text-sm text-red-600 dark:text-red-400 hover:text-red-700 font-medium"
              >
                Clear All Notifications
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default BookingNotificationCenter;
