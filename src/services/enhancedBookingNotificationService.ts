import api from './api';

export interface BookingNotification {
  id: string;
  type: 'booking_request' | 'booking_accepted' | 'booking_rejected' | 'payment_required' | 'payment_complete';
  title: string;
  message: string;
  screenName: string;
  ownerName?: string;
  customerName?: string;
  amount?: number;
  status: 'pending' | 'read' | 'action_required';
  timestamp: string;
  relatedId?: string;
  bookingId?: string;
  urgency?: 'low' | 'medium' | 'high';
}

export interface PaymentOption {
  id: string;
  name: string;
  type: 'upi' | 'card' | 'netbanking' | 'wallet';
  description: string;
  icon: string;
  processingFee?: number;
}

export class EnhancedBookingNotificationService {
  private static readonly API_BASE = 'http://localhost:4000/api';

  /**
   * Get all notifications for the current user
   */
  static async getNotifications(params?: {
    limit?: number;
    offset?: number;
    unread_only?: boolean;
    type?: string;
  }): Promise<{
    success: boolean;
    data: BookingNotification[];
    unread_count: number;
  }> {
    try {
      const response = await api.get('/campaign-requests/notifications', {
        params
      });
      
      const formattedNotifications: BookingNotification[] = (response.data as any).data.map((notification: any) => ({
        id: notification.id,
        type: notification.type,
        title: notification.title,
        message: notification.message,
        screenName: notification.screen_name || 'Unknown Screen',
        ownerName: notification.owner_name,
        customerName: notification.customer_name,
        amount: notification.amount,
        status: notification.is_read ? 'read' : 'pending',
        timestamp: notification.created_at,
        relatedId: notification.related_id,
        bookingId: notification.booking_id,
        urgency: notification.urgency || 'medium'
      }));

      return {
        success: true,
        data: formattedNotifications,
        unread_count: (response.data as any).unread_count
      };
    } catch (error) {
      console.error('Error fetching notifications:', error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  static async markNotificationAsRead(notificationId: string): Promise<boolean> {
    try {
      await api.patch(`/campaign-requests/notifications/${notificationId}/read`);
      return true;
    } catch (error) {
      console.error('Error marking notification as read:', error);
      return false;
    }
  }

  /**
   * Get available payment options
   */
  static getPaymentOptions(): PaymentOption[] {
    return [
      {
        id: 'upi',
        name: 'UPI Payment',
        type: 'upi',
        description: 'Pay using UPI apps like Google Pay, PhonePe, Paytm',
        icon: '📱',
        processingFee: 0
      },
      {
        id: 'card',
        name: 'Credit/Debit Card',
        type: 'card',
        description: 'Pay securely with your credit or debit card',
        icon: '💳',
        processingFee: 0.02 // 2%
      },
      {
        id: 'netbanking',
        name: 'Net Banking',
        type: 'netbanking',
        description: 'Pay directly from your bank account',
        icon: '🏦',
        processingFee: 0
      },
      {
        id: 'wallet',
        name: 'Digital Wallet',
        type: 'wallet',
        description: 'Pay using Paytm, Amazon Pay, or other wallets',
        icon: '👛',
        processingFee: 0.01 // 1%
      }
    ];
  }

  /**
   * Process payment for a booking
   */
  static async processPayment(
    bookingId: string, 
    amount: number, 
    paymentMethod: string,
    paymentDetails?: any
  ): Promise<{
    success: boolean;
    transactionId?: string;
    message: string;
  }> {
    try {
      // Simulate payment processing
      const response = await api.post('/payments/process', {
        booking_id: bookingId,
        amount: amount,
        payment_method: paymentMethod,
        payment_details: paymentDetails
      });

      if ((response.data as any).success) {
        // Create a payment completion notification
        await this.createNotification({
          type: 'payment_complete',
          title: 'Payment Successful',
          message: `Payment of $${amount} has been processed successfully for booking #${bookingId}`,
          relatedId: bookingId
        });

        return {
          success: true,
          transactionId: (response.data as any).transaction_id,
          message: 'Payment processed successfully'
        };
      } else {
        throw new Error((response.data as any).message || 'Payment failed');
      }
    } catch (error) {
      console.error('Payment processing error:', error);
      return {
        success: false,
        message: error instanceof Error ? error.message : 'Payment processing failed'
      };
    }
  }

  /**
   * Create a new notification (internal use)
   */
  private static async createNotification(notification: {
    type: string;
    title: string;
    message: string;
    relatedId?: string;
    userId?: string;
  }): Promise<void> {
    try {
      await api.post('/notifications', notification);
    } catch (error) {
      console.error('Error creating notification:', error);
    }
  }

  /**
   * Get booking requests for screen owner
   */
  static async getBookingRequestsForOwner(): Promise<{
    success: boolean;
    requests: any[];
    count: number;
  }> {
    try {
      const response = await api.get('/bookings/requests');
      return response.data as { success: boolean; requests: any[]; count: number; };
    } catch (error) {
      console.error('Error fetching booking requests:', error);
      throw error;
    }
  }

  /**
   * Accept a booking request
   */
  static async acceptBookingRequest(bookingId: number, screenId: number): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await api.post(`/bookings/${bookingId}/accept`, {
        screenId: screenId
      });
      return response.data as { success: boolean; message: string; };
    } catch (error) {
      console.error('Error accepting booking:', error);
      throw error;
    }
  }

  /**
   * Reject a booking request
   */
  static async rejectBookingRequest(bookingId: number, reason?: string): Promise<{
    success: boolean;
    message: string;
  }> {
    try {
      const response = await api.post(`/bookings/${bookingId}/reject`, {
        rejection_reason: reason
      });
      return response.data as { success: boolean; message: string; };
    } catch (error) {
      console.error('Error rejecting booking:', error);
      throw error;
    }
  }

  /**
   * Get notification statistics
   */
  static async getNotificationStats(): Promise<{
    total: number;
    unread: number;
    by_type: Record<string, number>;
  }> {
    try {
      const notifications = await this.getNotifications();
      const total = notifications.data.length;
      const unread = notifications.unread_count;
      const by_type = notifications.data.reduce((acc, notification) => {
        acc[notification.type] = (acc[notification.type] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      return { total, unread, by_type };
    } catch (error) {
      console.error('Error getting notification stats:', error);
      return { total: 0, unread: 0, by_type: {} };
    }
  }

  /**
   * Subscribe to real-time notifications (using WebSocket or Server-Sent Events)
   */
  static subscribeToNotifications(callback: (notification: BookingNotification) => void): () => void {
    // This would typically use WebSocket or SSE
    // For now, we'll use polling as a fallback
    const interval = setInterval(async () => {
      try {
        const result = await this.getNotifications({ unread_only: true, limit: 10 });
        if (result.data.length > 0) {
          result.data.forEach(callback);
        }
      } catch (error) {
        console.error('Error polling notifications:', error);
      }
    }, 30000); // Poll every 30 seconds

    return () => clearInterval(interval);
  }
}

export default EnhancedBookingNotificationService;
