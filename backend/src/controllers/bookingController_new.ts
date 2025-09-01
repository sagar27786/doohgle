import { Request, Response } from "express";
import { pool } from "../db";
import { AuthUser } from "../middleware/auth";
import {
  awsNotificationService,
  BookingNotificationData,
} from "../services/awsNotificationService";

interface BookingRequest extends Request {
  body: {
    screenId: number;
    customerName: string;
    customerEmail: string;
    customerPhone: string;
    companyName?: string;
    startDate: string;
    endDate: string;
    urgency: "low" | "medium" | "high";
    message?: string;
    screen_id: number;
    start_date: string;
    end_date: string;
    campaign_id?: number;
    total_amount: number;
    booking_hours: number[];
    content_url?: string;
    notes?: string;
  };
}

interface ScreenAvailability {
  screen_id: number;
  available: boolean;
  conflicting_bookings: any[];
  available_slots: any[];
}

// Create new booking request with enhanced location-wide notifications
export async function createBooking(req: BookingRequest, res: Response) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const {
      screenId,
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      startDate,
      endDate,
      urgency,
      message,
    } = req.body;

    // Get screen details
    const screenQuery = `
      SELECT s.*, u.email as owner_email, u.phone as owner_phone, u.name as owner_name
      FROM screens s
      JOIN users u ON s.owner_id = u.id
      WHERE s.id = $1
    `;
    const screenResult = await client.query(screenQuery, [screenId]);

    if (screenResult.rows.length === 0) {
      return res.status(404).json({ error: "Screen not found" });
    }

    const screen = screenResult.rows[0];

    // Get all screen owners in the same city for location-wide notifications
    const locationOwnersQuery = `
      SELECT DISTINCT u.id, u.name, u.email, u.phone, s.city
      FROM screens s
      JOIN users u ON s.owner_id = u.id
      WHERE LOWER(s.city) = LOWER($1) AND s.ads_enabled = true AND s.is_active = true
    `;
    const locationOwnersResult = await client.query(locationOwnersQuery, [
      screen.city,
    ]);
    const locationOwners = locationOwnersResult.rows;

    console.log(
      `📍 Found ${locationOwners.length} screen owners in ${screen.city} for booking notification`
    );

    // Calculate total cost
    const days = Math.ceil(
      (new Date(endDate).getTime() - new Date(startDate).getTime()) /
        (1000 * 60 * 60 * 24)
    );
    const totalCost = 500 * days; // Default pricing

    // Create booking record
    const bookingQuery = `
      INSERT INTO bookings (
        screen_id, customer_name, customer_email, customer_phone, company_name,
        start_date, end_date, total_amount, urgency, notes, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending', NOW())
      RETURNING id
    `;

    const bookingResult = await client.query(bookingQuery, [
      screenId,
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      startDate,
      endDate,
      totalCost,
      urgency,
      message,
    ]);

    const bookingId = bookingResult.rows[0].id;

    // Create booking requests for all screen owners in the location
    for (const owner of locationOwners) {
      const bookingRequestQuery = `
        INSERT INTO booking_requests (
          booking_id, screen_owner_id, customer_name, customer_email, 
          customer_phone, company_name, start_date, end_date, 
          total_amount, urgency, message, location, status, created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'pending', NOW())
      `;

      await client.query(bookingRequestQuery, [
        bookingId,
        owner.id,
        customerName,
        customerEmail,
        customerPhone,
        companyName,
        startDate,
        endDate,
        totalCost,
        urgency,
        message,
        screen.city,
      ]);

      console.log(
        `📨 Created booking request for owner ${owner.name} (${owner.email})`
      );
    }

    await client.query("COMMIT");

    // Send notifications to all location owners
    const notificationPromises = locationOwners.map(async (owner) => {
      const notificationData: BookingNotificationData = {
        bookingId: bookingId.toString(),
        screenName: `${screen.city} Location Request`,
        customerName,
        customerEmail,
        customerPhone,
        startDate,
        endDate,
        totalCost,
        urgency,
        ownerEmail: owner.email,
        ownerPhone: owner.phone,
      };

      return awsNotificationService.sendBookingNotification(notificationData);
    });

    const notificationResults = await Promise.allSettled(notificationPromises);
    const successfulNotifications = notificationResults.filter(
      (result) => result.status === "fulfilled"
    ).length;

    console.log(
      `📧 Sent ${successfulNotifications}/${locationOwners.length} booking notifications successfully`
    );

    res.json({
      success: true,
      bookingId,
      totalCost,
      location: screen.city,
      notifiedOwners: locationOwners.length,
      successfulNotifications,
      message: `Booking request created successfully. ${successfulNotifications} screen owners in ${screen.city} have been notified.`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating booking:", error);
    res.status(500).json({ error: "Failed to create booking request" });
  } finally {
    client.release();
  }
}

// Get all booking requests for a screen owner (Screen Manager)
export async function getOwnerBookingRequests(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      SELECT 
        br.*,
        COUNT(*) OVER() as total_requests,
        CASE 
          WHEN br.status = 'pending' AND br.created_at < (CURRENT_TIMESTAMP - INTERVAL '7 days') 
          THEN true 
          ELSE false 
        END as is_expired
      FROM booking_requests br
      WHERE br.screen_owner_id = $1
      ORDER BY 
        CASE WHEN br.status = 'pending' THEN 1 ELSE 2 END,
        br.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      requests: result.rows,
      total: result.rows.length > 0 ? result.rows[0].total_requests : 0,
    });
  } catch (error) {
    console.error("Error fetching booking requests:", error);
    res.status(500).json({ error: "Failed to fetch booking requests" });
  }
}

// Process booking request approval/rejection (Screen Manager)
export async function processBookingApproval(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { requestId } = req.params;
    const { approved, ownerMessage } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ error: "Unauthorized" });
    }

    const newStatus = approved ? "accepted" : "rejected";

    // Get booking request details
    const requestQuery = `
      SELECT br.*
      FROM booking_requests br
      WHERE br.id = $1 AND br.screen_owner_id = $2
    `;
    const requestResult = await client.query(requestQuery, [requestId, userId]);

    if (requestResult.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Booking request not found or unauthorized" });
    }

    const bookingRequest = requestResult.rows[0];

    // Update the booking request status
    const updateQuery = `
      UPDATE booking_requests 
      SET status = $1, updated_at = CURRENT_TIMESTAMP 
      WHERE id = $2 AND screen_owner_id = $3
      RETURNING *
    `;
    await client.query(updateQuery, [newStatus, requestId, userId]);

    // If approved, create a booking entry
    if (approved) {
      // Find an available screen from this owner in the location
      const availableScreenQuery = `
        SELECT id, screen_name FROM screens 
        WHERE user_id = $1 AND LOWER(city) = LOWER($2) AND ads_enabled = true AND is_active = true
        LIMIT 1
      `;
      const screenResult = await client.query(availableScreenQuery, [
        userId,
        bookingRequest.location,
      ]);

      if (screenResult.rows.length > 0) {
        const selectedScreen = screenResult.rows[0];

        // Create new booking
        const createBookingQuery = `
          INSERT INTO bookings (
            screen_id, customer_name, customer_email, customer_phone, 
            company_name, start_date, end_date, total_amount, 
            urgency, notes, status, created_at
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'approved', NOW())
          RETURNING id
        `;
        await client.query(createBookingQuery, [
          selectedScreen.id,
          bookingRequest.customer_name,
          bookingRequest.customer_email,
          bookingRequest.customer_phone,
          bookingRequest.company_name,
          bookingRequest.start_date,
          bookingRequest.end_date,
          bookingRequest.total_amount,
          bookingRequest.urgency,
          ownerMessage || "Booking approved",
        ]);

        console.log(
          `✅ Booking approved: Screen ${selectedScreen.screen_name} assigned to ${bookingRequest.customer_name}`
        );
      }
    }

    // Create notification for ads manager about the booking status update
    const notificationQuery = `
      INSERT INTO notifications (user_id, type, title, message, data, created_at)
      SELECT 
        u.id,
        $1,
        $2,
        $3,
        $4,
        CURRENT_TIMESTAMP
      FROM users u, screens s
      WHERE s.owner_id = u.id AND LOWER(s.city) = LOWER($5)
      GROUP BY u.id
    `;

    const notificationTitle = approved
      ? `Booking Approved in ${bookingRequest.location}`
      : `Booking Declined in ${bookingRequest.location}`;

    const notificationMessage = approved
      ? `Great news! A screen owner in ${bookingRequest.location} has accepted a booking request.`
      : `A booking request in ${bookingRequest.location} was declined by a screen owner.`;

    const notificationData = {
      booking_request_id: requestId,
      location: bookingRequest.location,
      customer_name: bookingRequest.customer_name,
      status: newStatus,
      screen_owner_id: userId,
    };

    await client.query(notificationQuery, [
      approved ? "booking_approved" : "booking_rejected",
      notificationTitle,
      notificationMessage,
      JSON.stringify(notificationData),
      bookingRequest.location,
    ]);

    await client.query("COMMIT");

    console.log(
      `📧 Notification sent to ads managers about booking ${newStatus} in ${bookingRequest.location}`
    );

    res.json({
      success: true,
      status: newStatus,
      message: `Booking request ${newStatus} successfully. Ads managers have been notified.`,
      bookingRequest: {
        id: requestId,
        location: bookingRequest.location,
        customer_name: bookingRequest.customer_name,
        status: newStatus,
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error processing booking approval:", error);
    res.status(500).json({ error: "Failed to process booking request" });
  } finally {
    client.release();
  }
}

// Get notifications for ads manager
export async function getAdsManagerNotifications(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      SELECT 
        n.*,
        COUNT(*) OVER() as total_notifications,
        COUNT(*) FILTER (WHERE n.read = false) OVER() as unread_count
      FROM notifications n
      WHERE n.user_id = $1 AND n.type IN ('booking_approved', 'booking_rejected')
      ORDER BY n.created_at DESC
      LIMIT 50
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      notifications: result.rows,
      total: result.rows.length > 0 ? result.rows[0].total_notifications : 0,
      unread: result.rows.length > 0 ? result.rows[0].unread_count : 0,
    });
  } catch (error) {
    console.error("Error fetching ads manager notifications:", error);
    res.status(500).json({ error: "Failed to fetch notifications" });
  }
}

// Mark notification as read
export async function markNotificationAsRead(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  const { notificationId } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      UPDATE notifications 
      SET read = true 
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [notificationId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: "Notification not found" });
    }

    res.json({
      success: true,
      notification: result.rows[0],
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ error: "Failed to mark notification as read" });
  }
}

// Legacy functions to maintain compatibility

// For compatibility with existing booking modal
export async function createBookingWithAuth(
  req: Request & { user?: AuthUser },
  res: Response
) {
  // This can redirect to the new createBooking function
  return createBooking(req as BookingRequest, res);
}

// Check screen availability for given time slots
export async function checkScreenAvailability(req: Request, res: Response) {
  try {
    const { screen_ids, start_date, end_date } = req.query;

    if (!screen_ids || !start_date || !end_date) {
      return res.status(400).json({
        error: "Missing required parameters: screen_ids, start_date, end_date",
      });
    }

    const screenIdsArray = Array.isArray(screen_ids)
      ? screen_ids
      : [screen_ids];
    const availability: ScreenAvailability[] = [];

    for (const screen_id of screenIdsArray) {
      // Check for conflicting bookings
      const conflictQuery = `
        SELECT * FROM bookings 
        WHERE screen_id = $1 
        AND status = 'approved'
        AND (
          (start_date <= $2 AND end_date >= $2) OR
          (start_date <= $3 AND end_date >= $3) OR
          (start_date >= $2 AND end_date <= $3)
        )
      `;

      const conflictResult = await pool.query(conflictQuery, [
        screen_id,
        start_date,
        end_date,
      ]);

      availability.push({
        screen_id: Number(screen_id),
        available: conflictResult.rows.length === 0,
        conflicting_bookings: conflictResult.rows,
        available_slots: [],
      });
    }

    res.json({
      success: true,
      availability,
      checked_period: { start_date, end_date },
    });
  } catch (error) {
    console.error("Error checking availability:", error);
    res.status(500).json({ error: "Failed to check screen availability" });
  }
}

// Get user's bookings
export async function getMyBookings(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      SELECT 
        b.*,
        s.screen_name,
        s.city,
        s.location_in_venue
      FROM bookings b
      JOIN screens s ON b.screen_id = s.id
      WHERE b.customer_name = (SELECT name FROM users WHERE id = $1)
      OR b.customer_email = (SELECT email FROM users WHERE id = $1)
      ORDER BY b.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      bookings: result.rows,
    });
  } catch (error) {
    console.error("Error fetching user bookings:", error);
    res.status(500).json({ error: "Failed to fetch bookings" });
  }
}

// Cancel a booking
export async function cancelBooking(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  const { booking_id } = req.params;

  if (!userId) {
    return res.status(401).json({ error: "Unauthorized" });
  }

  try {
    const query = `
      UPDATE bookings 
      SET status = 'cancelled' 
      WHERE id = $1 AND (
        customer_name = (SELECT name FROM users WHERE id = $2)
        OR customer_email = (SELECT email FROM users WHERE id = $2)
      )
      RETURNING *
    `;

    const result = await pool.query(query, [booking_id, userId]);

    if (result.rows.length === 0) {
      return res
        .status(404)
        .json({ error: "Booking not found or unauthorized" });
    }

    res.json({
      success: true,
      booking: result.rows[0],
      message: "Booking cancelled successfully",
    });
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({ error: "Failed to cancel booking" });
  }
}
