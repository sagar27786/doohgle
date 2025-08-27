// Backend Ads Manager Notification Service
// Service to handle notification operations for ads managers

import { pool } from "../db";

export interface AdsManagerNotification {
  id: string;
  type: "booking_accepted" | "screen_updated" | "content_approved";
  title: string;
  message: string;
  status: "unread" | "read";
  created_at: string;
  updated_at: string;
  data: any; // JSON data with additional context
}

export class AdsManagerNotificationService {
  /**
   * Create a new notification for ads manager
   */
  static async createNotification(
    type: string,
    title: string,
    message: string,
    data: any = {}
  ): Promise<string> {
    try {
      const query = `
        INSERT INTO booking_notifications (type, title, message, status, data, created_at, updated_at)
        VALUES ($1, $2, $3, 'unread', $4, NOW(), NOW())
        RETURNING id
      `;

      const result = await pool.query(query, [
        type,
        title,
        message,
        JSON.stringify(data),
      ]);

      const notificationId = result.rows[0].id;
      console.log(`📱 Created ads manager notification: ${notificationId}`);

      return notificationId;
    } catch (error) {
      console.error("Error creating ads manager notification:", error);
      throw new Error("Failed to create notification");
    }
  }

  /**
   * Get all notifications for ads manager
   */
  static async getNotifications(): Promise<AdsManagerNotification[]> {
    try {
      const query = `
        SELECT 
          id,
          type,
          title,
          message,
          status,
          data,
          created_at,
          updated_at
        FROM booking_notifications
        WHERE type IN ('booking_accepted', 'screen_updated', 'content_approved')
        ORDER BY created_at DESC
        LIMIT 50
      `;

      const result = await pool.query(query);

      return result.rows.map((row) => ({
        ...row,
        data: typeof row.data === "string" ? JSON.parse(row.data) : row.data,
      }));
    } catch (error) {
      console.error("Error fetching ads manager notifications:", error);
      throw new Error("Failed to fetch notifications");
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const query = `
        UPDATE booking_notifications
        SET status = 'read', updated_at = NOW()
        WHERE id = $1
      `;

      await pool.query(query, [notificationId]);

      console.log(`✅ Notification ${notificationId} marked as read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw new Error("Failed to mark notification as read");
    }
  }

  /**
   * Get unread notification count
   */
  static async getUnreadCount(): Promise<number> {
    try {
      const query = `
        SELECT COUNT(*) as count
        FROM booking_notifications
        WHERE type IN ('booking_accepted', 'screen_updated', 'content_approved')
        AND status = 'unread'
      `;

      const result = await pool.query(query);
      return parseInt(result.rows[0].count);
    } catch (error) {
      console.error("Error getting unread count:", error);
      return 0;
    }
  }

  /**
   * Create booking accepted notification
   */
  static async notifyBookingAccepted(bookingData: {
    booking_id: number;
    screen_name: string;
    customer_name: string;
    owner_name: string;
    city: string;
    start_date: string;
    end_date: string;
    total_amount: number;
  }): Promise<string> {
    const title = `Booking Accepted - ${bookingData.screen_name}`;
    const message = `${bookingData.owner_name} accepted booking from ${bookingData.customer_name} in ${bookingData.city}`;

    return this.createNotification("booking_accepted", title, message, {
      booking_id: bookingData.booking_id,
      screen_name: bookingData.screen_name,
      customer_name: bookingData.customer_name,
      owner_name: bookingData.owner_name,
      city: bookingData.city,
      start_date: bookingData.start_date,
      end_date: bookingData.end_date,
      total_amount: bookingData.total_amount,
    });
  }

  /**
   * Delete old notifications (cleanup)
   */
  static async cleanupOldNotifications(daysOld: number = 30): Promise<void> {
    try {
      const query = `
        DELETE FROM booking_notifications
        WHERE created_at < NOW() - INTERVAL '${daysOld} days'
      `;

      const result = await pool.query(query);
      console.log(`🗑️ Cleaned up ${result.rowCount} old notifications`);
    } catch (error) {
      console.error("Error cleaning up old notifications:", error);
    }
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  }
}

export default AdsManagerNotificationService;
