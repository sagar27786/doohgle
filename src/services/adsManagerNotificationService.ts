// Ads Manager Notification Service
// Handles notifications for ads managers about booking acceptances

interface AdsManagerNotification {
  id: string;
  booking_id: number;
  title: string;
  message: string;
  data: {
    booking_id: number;
    screen_id: number;
    screen_name: string;
    city: string;
    owner_name: string;
    customer_name: string;
    accepted_at: string;
  };
  created_at: string;
  status: "unread" | "read";
}

export class AdsManagerNotificationService {
  private static readonly API_BASE = "http://localhost:4000/api";

  /**
   * Get notifications for ads manager
   */
  static async getNotifications(): Promise<AdsManagerNotification[]> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${this.API_BASE}/bookings/ads-manager/notifications`,
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log(`🔔 Fetched ${result.count} ads manager notifications`);
        return result.notifications || [];
      } else {
        throw new Error(result.message || "Failed to fetch notifications");
      }
    } catch (error) {
      console.error("Error fetching ads manager notifications:", error);
      throw error;
    }
  }

  /**
   * Mark a notification as read
   */
  static async markAsRead(notificationId: string): Promise<void> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(
        `${this.API_BASE}/notifications/${notificationId}/read`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      console.log(`✅ Notification ${notificationId} marked as read`);
    } catch (error) {
      console.error("Error marking notification as read:", error);
      throw error;
    }
  }

  /**
   * Format notification date for display
   */
  static formatDate(dateString: string): string {
    const now = new Date();
    const notificationDate = new Date(dateString);
    const diffInSeconds = Math.floor(
      (now.getTime() - notificationDate.getTime()) / 1000
    );

    if (diffInSeconds < 60) {
      return "Just now";
    } else if (diffInSeconds < 3600) {
      const minutes = Math.floor(diffInSeconds / 60);
      return `${minutes} minute${minutes !== 1 ? "s" : ""} ago`;
    } else if (diffInSeconds < 86400) {
      const hours = Math.floor(diffInSeconds / 3600);
      return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
    } else {
      const days = Math.floor(diffInSeconds / 86400);
      return `${days} day${days !== 1 ? "s" : ""} ago`;
    }
  }

  /**
   * Get notification type icon
   */
  static getNotificationIcon(data: any): string {
    switch (data.notification_type) {
      case "booking_accepted":
        return "✅";
      case "booking_rejected":
        return "❌";
      case "screen_updated":
        return "📺";
      default:
        return "📢";
    }
  }
}

export type { AdsManagerNotification };
