export interface BookingRequest {
  id: string;
  advertiserId: number;
  advertiserName: string;
  screenId: number;
  screenName: string;
  location: string;
  venueOwnerId: number;
  venueOwnerName: string;
  campaignName: string;
  campaignBudget: number;
  startDate: string;
  endDate: string;
  status: 'pending' | 'accepted' | 'rejected';
  createdAt: string;
  screenDetails?: {
    size: string;
    resolution: string;
    type: string;
    latitude?: number;
    longitude?: number;
  };
}

export interface BookingNotification {
  id: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected';
  message: string;
  data: BookingRequest;
  read: boolean;
  createdAt: string;
}

class BookingNotificationService {
  private static instance: BookingNotificationService;
  private subscribers: Set<(notifications: BookingNotification[]) => void> = new Set();
  private notifications: BookingNotification[] = [];

  static getInstance(): BookingNotificationService {
    if (!BookingNotificationService.instance) {
      BookingNotificationService.instance = new BookingNotificationService();
    }
    return BookingNotificationService.instance;
  }

  // Subscribe to notification updates
  subscribe(callback: (notifications: BookingNotification[]) => void): () => void {
    this.subscribers.add(callback);
    callback(this.notifications); // Send current notifications immediately
    
    return () => {
      this.subscribers.delete(callback);
    };
  }

  // Notify all subscribers
  private notifySubscribers(): void {
    this.subscribers.forEach(callback => callback(this.notifications));
  }

  // Create a booking request (called by advertiser)
  async createBookingRequest(request: Omit<BookingRequest, 'id' | 'status' | 'createdAt'>): Promise<string> {
    const bookingRequest: BookingRequest = {
      ...request,
      id: `booking_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      status: 'pending',
      createdAt: new Date().toISOString(),
    };

    // Create notification for venue owner
    const notification: BookingNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'booking_request',
      message: `New booking request from ${request.advertiserName} for ${request.screenName} at ${request.location}`,
      data: bookingRequest,
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(notification);
    this.notifySubscribers();

    // Store in localStorage for persistence
    this.persistNotifications();

    // Send to backend API
    try {
      // Here you would make an API call to store the booking request in the database
      await this.sendBookingRequestToAPI(bookingRequest);
    } catch (error) {
      console.error('Failed to send booking request to API:', error);
    }

    return bookingRequest.id;
  }

  // Accept a booking request (called by venue owner)
  async acceptBookingRequest(requestId: string): Promise<void> {
    const notification = this.notifications.find(n => n.data.id === requestId);
    if (!notification) return;

    // Update the booking request status
    notification.data.status = 'accepted';

    // Create notification for advertiser
    const acceptedNotification: BookingNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'booking_accepted',
      message: `Your booking request for ${notification.data.screenName} has been accepted by ${notification.data.venueOwnerName}`,
      data: notification.data,
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(acceptedNotification);
    this.notifySubscribers();
    this.persistNotifications();

    // Send to backend API
    try {
      await this.updateBookingRequestStatusAPI(requestId, 'accepted');
    } catch (error) {
      console.error('Failed to update booking request status:', error);
    }
  }

  // Reject a booking request (called by venue owner)
  async rejectBookingRequest(requestId: string, reason?: string): Promise<void> {
    const notification = this.notifications.find(n => n.data.id === requestId);
    if (!notification) return;

    // Update the booking request status
    notification.data.status = 'rejected';

    // Create notification for advertiser
    const rejectedNotification: BookingNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      type: 'booking_rejected',
      message: `Your booking request for ${notification.data.screenName} has been rejected by ${notification.data.venueOwnerName}${reason ? `: ${reason}` : ''}`,
      data: notification.data,
      read: false,
      createdAt: new Date().toISOString(),
    };

    this.notifications.unshift(rejectedNotification);
    this.notifySubscribers();
    this.persistNotifications();

    // Send to backend API
    try {
      await this.updateBookingRequestStatusAPI(requestId, 'rejected');
    } catch (error) {
      console.error('Failed to update booking request status:', error);
    }
  }

  // Mark notification as read
  markAsRead(notificationId: string): void {
    const notification = this.notifications.find(n => n.id === notificationId);
    if (notification) {
      notification.read = true;
      this.notifySubscribers();
      this.persistNotifications();
    }
  }

  // Get all notifications
  getAllNotifications(): BookingNotification[] {
    return this.notifications;
  }

  // Get unread notifications
  getUnreadNotifications(): BookingNotification[] {
    return this.notifications.filter(n => !n.read);
  }

  // Get notifications for specific user type
  getNotificationsForUser(userType: 'advertiser' | 'venue_owner', userId: number): BookingNotification[] {
    return this.notifications.filter(notification => {
      if (userType === 'advertiser') {
        return notification.data.advertiserId === userId;
      } else {
        return notification.data.venueOwnerId === userId;
      }
    });
  }

  // Get pending booking requests for venue owner
  getPendingBookingRequestsForVenueOwner(venueOwnerId: number): BookingRequest[] {
    return this.notifications
      .filter(n => 
        n.type === 'booking_request' && 
        n.data.status === 'pending' && 
        n.data.venueOwnerId === venueOwnerId
      )
      .map(n => n.data);
  }

  // Clear all notifications
  clearAllNotifications(): void {
    this.notifications = [];
    this.notifySubscribers();
    this.persistNotifications();
  }

  // Persist notifications to localStorage
  private persistNotifications(): void {
    try {
      localStorage.setItem('booking_notifications', JSON.stringify(this.notifications));
    } catch (error) {
      console.error('Failed to persist notifications:', error);
    }
  }

  // Load notifications from localStorage
  loadPersistedNotifications(): void {
    try {
      const stored = localStorage.getItem('booking_notifications');
      if (stored) {
        this.notifications = JSON.parse(stored);
        this.notifySubscribers();
      }
    } catch (error) {
      console.error('Failed to load persisted notifications:', error);
    }
  }

  // API Methods (you'll need to implement these based on your backend)
  private async sendBookingRequestToAPI(request: BookingRequest): Promise<void> {
    const API_URL = 'http://localhost:4000/api';
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_URL}/campaign-requests/requests`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify({
        screen_id: request.screenId,
        campaign_name: request.campaignName,
        budget: request.campaignBudget,
        start_date: request.startDate,
        end_date: request.endDate,
        message: `Booking request for ${request.screenName} at ${request.location}`,
      }),
    });

    if (!response.ok) {
      throw new Error('Failed to create booking request');
    }
  }

  private async updateBookingRequestStatusAPI(requestId: string, status: 'accepted' | 'rejected'): Promise<void> {
    const API_URL = 'http://localhost:4000/api';
    const token = localStorage.getItem('token');
    
    // Find the notification to get the actual campaign request ID
    const notification = this.notifications.find(n => n.data.id === requestId);
    if (!notification) return;

    const endpoint = status === 'accepted' ? 'approve' : 'reject';
    const response = await fetch(`${API_URL}/campaign-requests/requests/${requestId}/${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to ${status} booking request`);
    }
  }

  // Initialize the service
  init(): void {
    this.loadPersistedNotifications();
    
    // Set up periodic sync with backend if needed
    setInterval(() => {
      this.syncWithBackend();
    }, 30000); // Sync every 30 seconds
  }

  // Sync notifications with backend
  private async syncWithBackend(): Promise<void> {
    try {
      const API_URL = 'http://localhost:4000/api';
      const token = localStorage.getItem('token');
      
      const response = await fetch(`${API_URL}/campaign-requests/notifications`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const backendNotifications = await response.json();
        // Merge with local notifications (implement merge logic as needed)
      }
    } catch (error) {
      console.error('Failed to sync with backend:', error);
    }
  }
}

export default BookingNotificationService;
