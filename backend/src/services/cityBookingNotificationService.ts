// Enhanced Booking Notification Service
// Handles city-based notifications and booking workflow

import { pool } from "../db";

interface BookingNotificationData {
  booking_id: number;
  screen_id: number;
  screen_name: string;
  screen_city: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name?: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  urgency: "low" | "medium" | "high";
  message?: string;
  location_name: string;
}

interface VenueOwnerNotification {
  owner_id: number;
  owner_name: string;
  owner_email: string;
  owner_phone?: string;
  screens_in_city: number;
}

export class CityBookingNotificationService {
  /**
   * Notify all venue owners in a specific city about a new booking request
   */
  static async notifyVenueOwnersInCity(
    city: string,
    bookingData: BookingNotificationData
  ): Promise<void> {
    const client = await pool.connect();

    try {
      console.log(`📢 BOOKING NOTIFICATION: Notifying venue owners in ${city}`);

      // Get all venue owners who have screens in the specified city
      const venueOwnersQuery = `
        SELECT DISTINCT 
          u.id as owner_id,
          u.name as owner_name,
          u.email as owner_email,
          u.phone as owner_phone,
          COUNT(s.id) as screens_in_city
        FROM users u
        JOIN screens s ON s.user_id = u.id
        WHERE LOWER(COALESCE(s.city, '')) = LOWER($1)
          AND s.is_active = true
          AND s.ads_enabled = true
          AND u.role = 'venue_owner'
        GROUP BY u.id, u.name, u.email, u.phone
      `;

      const venueOwnersResult = await client.query(venueOwnersQuery, [city]);
      const venueOwners: VenueOwnerNotification[] = venueOwnersResult.rows;

      console.log(`🎯 Found ${venueOwners.length} venue owners in ${city}`);

      if (venueOwners.length === 0) {
        console.log(`⚠️ No venue owners found in ${city}`);
        return;
      }

      // Create notifications for each venue owner
      for (const owner of venueOwners) {
        await this.createVenueOwnerNotification(owner, bookingData);
      }

      // Log the notification activity
      await this.logBookingNotificationActivity(
        bookingData.booking_id,
        city,
        venueOwners.length
      );

    } catch (error) {
      console.error("Error notifying venue owners:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Create a notification record for a venue owner
   */
  private static async createVenueOwnerNotification(
    owner: VenueOwnerNotification,
    bookingData: BookingNotificationData
  ): Promise<void> {
    const client = await pool.connect();

    try {
      // Create notification in database
      const notificationQuery = `
        INSERT INTO booking_notifications (
          recipient_id,
          booking_id,
          notification_type,
          title,
          message,
          data,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, 'unread', NOW())
        RETURNING id
      `;

      const title = `New Booking Request in ${bookingData.screen_city}`;
      const message = `${bookingData.customer_name} from ${bookingData.company_name || 'Customer'} wants to book a screen in ${bookingData.screen_city} from ${bookingData.start_date} to ${bookingData.end_date}. Budget: $${bookingData.total_amount}`;
      
      const notificationData = {
        booking_id: bookingData.booking_id,
        screen_city: bookingData.screen_city,
        customer_name: bookingData.customer_name,
        company_name: bookingData.company_name,
        urgency: bookingData.urgency,
        owner_screens_count: owner.screens_in_city
      };

      const result = await client.query(notificationQuery, [
        owner.owner_id,
        bookingData.booking_id,
        'booking_request',
        title,
        message,
        JSON.stringify(notificationData),
      ]);

      console.log(`✅ Notification created for ${owner.owner_name} (${owner.owner_email}) - ID: ${result.rows[0].id}`);

    } catch (error) {
      console.error(`Failed to create notification for owner ${owner.owner_id}:`, error);
    } finally {
      client.release();
    }
  }

  /**
   * Handle booking acceptance and notify ads manager
   */
  static async handleBookingAcceptance(
    booking_id: number,
    accepting_owner_id: number,
    screen_id: number
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query("BEGIN");

      console.log(`✅ BOOKING ACCEPTED: Booking ${booking_id} accepted by owner ${accepting_owner_id}`);

      // Update booking status
      await client.query(
        `UPDATE bookings SET 
         status = 'accepted', 
         accepted_by = $1, 
         accepted_at = NOW(), 
         assigned_screen_id = $2,
         updated_at = NOW()
         WHERE id = $3`,
        [accepting_owner_id, screen_id, booking_id]
      );

      // Get booking and screen details
      const bookingDetailsQuery = `
        SELECT 
          b.*,
          s.screen_name,
          s.location_in_venue,
          s.city,
          u_owner.name as owner_name,
          u_owner.email as owner_email
        FROM bookings b
        JOIN screens s ON s.id = $1
        JOIN users u_owner ON u_owner.id = $2
        WHERE b.id = $3
      `;

      const bookingResult = await client.query(bookingDetailsQuery, [
        screen_id,
        accepting_owner_id,
        booking_id
      ]);

      if (bookingResult.rows.length === 0) {
        throw new Error("Booking details not found");
      }

      const booking = bookingResult.rows[0];

      // Notify ads manager about the accepted booking
      await this.notifyAdsManagerAboutAcceptance(booking, screen_id);

      // Mark other notifications as resolved
      await client.query(
        `UPDATE booking_notifications 
         SET status = 'resolved', updated_at = NOW()
         WHERE booking_id = $1 AND recipient_id != $2`,
        [booking_id, accepting_owner_id]
      );

      await client.query("COMMIT");

      console.log(`🎉 Booking workflow completed for booking ${booking_id}`);

    } catch (error) {
      await client.query("ROLLBACK");
      console.error("Error handling booking acceptance:", error);
      throw error;
    } finally {
      client.release();
    }
  }

  /**
   * Notify ads manager about booking acceptance
   */
  private static async notifyAdsManagerAboutAcceptance(
    booking: any,
    screen_id: number
  ): Promise<void> {
    const client = await pool.connect();

    try {
      // Get all ads manager users (or you can specify specific users)
      const adsManagersQuery = `
        SELECT id, name, email 
        FROM users 
        WHERE role = 'admin' OR role = 'ads_manager'
      `;

      const adsManagersResult = await client.query(adsManagersQuery);
      const adsManagers = adsManagersResult.rows;

      console.log(`📱 Notifying ${adsManagers.length} ads managers about booking acceptance`);

      // Create notifications for ads managers
      for (const manager of adsManagers) {
        const title = `Booking Accepted - ${booking.screen_name}`;
        const message = `Screen "${booking.screen_name}" in ${booking.city} has been accepted for booking by ${booking.owner_name}. Customer: ${booking.customer_name}, Duration: ${booking.start_date} to ${booking.end_date}`;
        
        const notificationData = {
          booking_id: booking.id,
          screen_id: screen_id,
          screen_name: booking.screen_name,
          city: booking.city,
          owner_name: booking.owner_name,
          customer_name: booking.customer_name,
          accepted_at: new Date().toISOString()
        };

        await client.query(
          `INSERT INTO booking_notifications (
            recipient_id,
            booking_id,
            notification_type,
            title,
            message,
            data,
            status,
            created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, 'unread', NOW())`,
          [
            manager.id,
            booking.id,
            'booking_accepted',
            title,
            message,
            JSON.stringify(notificationData)
          ]
        );

        console.log(`✅ Ads manager notification sent to ${manager.name} (${manager.email})`);
      }

    } catch (error) {
      console.error("Error notifying ads managers:", error);
    } finally {
      client.release();
    }
  }

  /**
   * Log booking notification activity for analytics
   */
  private static async logBookingNotificationActivity(
    booking_id: number,
    city: string,
    notified_owners: number
  ): Promise<void> {
    const client = await pool.connect();

    try {
      await client.query(
        `INSERT INTO booking_notification_logs (
          booking_id,
          city,
          notified_owners,
          activity_type,
          created_at
        ) VALUES ($1, $2, $3, 'city_notification', NOW())`,
        [booking_id, city, notified_owners]
      );

      console.log(`📊 Logged notification activity for booking ${booking_id} in ${city}`);

    } catch (error) {
      console.error("Error logging notification activity:", error);
    } finally {
      client.release();
    }
  }

  /**
   * Get booking requests for a venue owner
   */
  static async getBookingRequestsForOwner(owner_id: number): Promise<any[]> {
    const client = await pool.connect();

    try {
      const query = `
        SELECT 
          bn.*,
          b.customer_name,
          b.customer_email,
          b.company_name,
          b.start_date,
          b.end_date,
          b.total_amount,
          b.urgency,
          b.status as booking_status
        FROM booking_notifications bn
        JOIN bookings b ON bn.booking_id = b.id
        WHERE bn.recipient_id = $1 
          AND bn.notification_type = 'booking_request'
          AND bn.status = 'unread'
          AND b.status = 'pending'
        ORDER BY bn.created_at DESC
      `;

      const result = await client.query(query, [owner_id]);
      return result.rows;

    } catch (error) {
      console.error("Error getting booking requests for owner:", error);
      return [];
    } finally {
      client.release();
    }
  }

  /**
   * Get notifications for ads manager
   */
  static async getAdsManagerNotifications(manager_id: number): Promise<any[]> {
    const client = await pool.connect();

    try {
      const query = `
        SELECT 
          bn.*,
          b.customer_name,
          b.company_name,
          b.start_date,
          b.end_date,
          b.total_amount
        FROM booking_notifications bn
        JOIN bookings b ON bn.booking_id = b.id
        WHERE bn.recipient_id = $1 
          AND bn.notification_type = 'booking_accepted'
          AND bn.status = 'unread'
        ORDER BY bn.created_at DESC
      `;

      const result = await client.query(query, [manager_id]);
      return result.rows;

    } catch (error) {
      console.error("Error getting ads manager notifications:", error);
      return [];
    } finally {
      client.release();
    }
  }
}
