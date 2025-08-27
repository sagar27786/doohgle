import { Router } from "express";
import { Request, Response } from "express";
import { pool } from "../db";
import {
  awsNotificationService,
  BookingNotificationData,
} from "../services/awsNotificationService";

const router = Router();

// Create new booking request with notification
router.post("/book-screen", async (req: Request, res: Response) => {
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
      urgency = "medium",
      message,
    } = req.body;

    // Validate required fields
    if (
      !screenId ||
      !customerName ||
      !customerEmail ||
      !customerPhone ||
      !startDate ||
      !endDate
    ) {
      return res.status(400).json({
        success: false,
        error: "Missing required fields",
      });
    }

    // Get screen details with owner information
    const screenQuery = `
      SELECT s.*, u.email as owner_email, u.phone as owner_phone, u.name as owner_name
      FROM screens s
      JOIN users u ON s.user_id = u.id
      WHERE s.id = $1 AND s.is_active = true
    `;
    const screenResult = await client.query(screenQuery, [screenId]);

    if (screenResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Screen not found or not active",
      });
    }

    const screen = screenResult.rows[0];

    // Calculate total cost
    const startDateObj = new Date(startDate);
    const endDateObj = new Date(endDate);
    const days = Math.ceil(
      (endDateObj.getTime() - startDateObj.getTime()) / (1000 * 60 * 60 * 24)
    );
    const totalCost = (screen.hourly_rate || 100) * 24 * days; // Default rate if not set

    // Create booking record
    const bookingQuery = `
      INSERT INTO bookings (
        screen_id, advertiser_id, start_date, end_date, total_amount, 
        notes, status, created_at
      ) VALUES ($1, $2, $3, $4, $5, $6, 'pending', NOW())
      RETURNING id
    `;

    // Create a temporary advertiser record or use existing user system
    const tempAdvertiserQuery = `
      INSERT INTO users (name, email, phone, role, created_at) 
      VALUES ($1, $2, $3, 'customer', NOW()) 
      ON CONFLICT (email) DO UPDATE SET 
        name = EXCLUDED.name, 
        phone = EXCLUDED.phone,
        updated_at = NOW()
      RETURNING id
    `;

    const advertiserResult = await client.query(tempAdvertiserQuery, [
      customerName,
      customerEmail,
      customerPhone,
    ]);
    const advertiserId = advertiserResult.rows[0].id;

    const bookingNotes = JSON.stringify({
      customerName,
      customerEmail,
      customerPhone,
      companyName,
      urgency,
      message,
    });

    const bookingResult = await client.query(bookingQuery, [
      screenId,
      advertiserId,
      startDate,
      endDate,
      totalCost,
      bookingNotes,
    ]);

    const bookingId = bookingResult.rows[0].id;

    await client.query("COMMIT");

    // Send notification to screen owner
    const notificationData: BookingNotificationData = {
      bookingId: bookingId.toString(),
      screenName: screen.screen_name || screen.location_name,
      customerName,
      customerEmail,
      customerPhone,
      startDate,
      endDate,
      totalCost,
      urgency,
      ownerEmail: screen.owner_email,
      ownerPhone: screen.owner_phone,
    };

    const notificationResult =
      await awsNotificationService.sendBookingNotification(notificationData);

    res.json({
      success: true,
      bookingId,
      totalCost,
      screenName: screen.screen_name || screen.location_name,
      notificationSent: notificationResult,
      message: "Booking request created successfully. Owner has been notified.",
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to create booking request",
    });
  } finally {
    client.release();
  }
});

// Approve or decline booking (owner endpoint)
router.post("/approve/:bookingId", async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { bookingId } = req.params;
    const { approved, ownerMessage } = req.body;
    const newStatus = approved ? "confirmed" : "cancelled";

    // Get booking details with customer and screen info
    const bookingQuery = `
      SELECT b.*, s.screen_name, s.location_name, s.user_id as owner_id, 
             u.name as owner_name, u2.name as customer_name, u2.email as customer_email, 
             u2.phone as customer_phone
      FROM bookings b
      JOIN screens s ON b.screen_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN users u2 ON b.advertiser_id = u2.id
      WHERE b.id = $1
    `;
    const bookingResult = await client.query(bookingQuery, [bookingId]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    const booking = bookingResult.rows[0];

    if (booking.status !== "pending") {
      return res.status(400).json({
        success: false,
        error: "Booking has already been processed",
      });
    }

    // Update booking status
    const updateQuery = `
      UPDATE bookings 
      SET status = $1, notes = COALESCE(notes, '{}')::jsonb || $2::jsonb, updated_at = NOW()
      WHERE id = $3
    `;

    const updatedNotes = JSON.stringify({
      ownerMessage,
      processedAt: new Date().toISOString(),
      processedBy: "owner",
    });

    await client.query(updateQuery, [newStatus, updatedNotes, bookingId]);

    await client.query("COMMIT");

    // Parse existing notes to get customer info
    let customerInfo;
    try {
      customerInfo =
        typeof booking.notes === "string"
          ? JSON.parse(booking.notes)
          : booking.notes;
    } catch (e) {
      customerInfo = {};
    }

    // Send confirmation email to customer
    const notificationData: BookingNotificationData = {
      bookingId: bookingId.toString(),
      screenName: booking.screen_name || booking.location_name,
      customerName: booking.customer_name,
      customerEmail: booking.customer_email,
      customerPhone: booking.customer_phone,
      startDate: booking.start_date,
      endDate: booking.end_date,
      totalCost: booking.total_amount,
      urgency: customerInfo.urgency || "medium",
      ownerEmail: "",
    };

    await awsNotificationService.sendBookingConfirmation(
      notificationData,
      approved
    );

    res.json({
      success: true,
      bookingId,
      status: newStatus,
      message: `Booking ${newStatus} successfully. Customer has been notified.`,
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error processing booking approval:", error);
    res.status(500).json({
      success: false,
      error: "Failed to process booking approval",
    });
  } finally {
    client.release();
  }
});

// Get booking details
router.get("/:bookingId", async (req: Request, res: Response) => {
  try {
    const { bookingId } = req.params;

    const query = `
      SELECT b.*, s.screen_name, s.location_name, s.city, s.state,
             u.name as owner_name, u.email as owner_email, u.phone as owner_phone,
             u2.name as customer_name, u2.email as customer_email, u2.phone as customer_phone
      FROM bookings b
      JOIN screens s ON b.screen_id = s.id
      JOIN users u ON s.user_id = u.id
      JOIN users u2 ON b.advertiser_id = u2.id
      WHERE b.id = $1
    `;

    const result = await pool.query(query, [bookingId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found",
      });
    }

    res.json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error fetching booking:", error);
    res.status(500).json({
      success: false,
      error: "Failed to fetch booking details",
    });
  }
});

// Payment simulation endpoint
router.post("/payment/:bookingId", async (req: Request, res: Response) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { bookingId } = req.params;
    const { paymentMethod } = req.body;

    // Get booking details
    const bookingQuery = "SELECT * FROM bookings WHERE id = $1 AND status = $2";
    const bookingResult = await client.query(bookingQuery, [
      bookingId,
      "confirmed",
    ]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        error: "Booking not found or not confirmed",
      });
    }

    const booking = bookingResult.rows[0];

    // Simulate payment processing
    const paymentSuccess = Math.random() > 0.1; // 90% success rate for demo

    if (paymentSuccess) {
      // Update booking to paid status
      await client.query(
        "UPDATE bookings SET status = $1, updated_at = NOW() WHERE id = $2",
        ["active", bookingId]
      );

      // Create payment record
      const paymentQuery = `
        INSERT INTO payments (booking_id, amount, payment_method, status, transaction_id, created_at)
        VALUES ($1, $2, $3, 'completed', $4, NOW())
      `;

      await client.query(paymentQuery, [
        bookingId,
        booking.total_amount,
        paymentMethod,
        `txn_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      ]);

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Payment processed successfully",
        data: {
          bookingId,
          status: "active",
          amount: booking.total_amount,
          paymentMethod,
        },
      });
    } else {
      await client.query("ROLLBACK");

      res.status(400).json({
        success: false,
        error: "Payment processing failed. Please try again.",
      });
    }
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error processing payment:", error);
    res.status(500).json({
      success: false,
      error: "Payment processing failed",
    });
  } finally {
    client.release();
  }
});

export default router;
