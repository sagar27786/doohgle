import { Request, Response } from "express";
import { pool } from "../db";
import { AuthUser } from "../middleware/auth";

interface BookingRequest {
  screen_id: number;
  start_date: string;
  end_date: string;
  campaign_id?: number;
  total_amount: number;
  booking_hours: number[];
  content_url?: string;
  notes?: string;
}

interface ScreenAvailability {
  screen_id: number;
  available: boolean;
  conflicting_bookings: any[];
  available_slots: any[];
}

// Check screen availability for given time slots
export async function checkScreenAvailability(req: Request, res: Response) {
  try {
    const { screen_id, start_date, end_date, booking_hours } = req.query;

    if (!screen_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "screen_id, start_date, and end_date are required",
      });
    }

    const client = await pool.connect();
    
    try {
      // Check if screen exists and is active
      const screenCheck = await client.query(
        "SELECT id, is_active, screen_name FROM screens WHERE id = $1",
        [screen_id]
      );

      if (screenCheck.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: "Screen not found",
        });
      }

      if (!screenCheck.rows[0].is_active) {
        return res.status(400).json({
          success: false,
          message: "Screen is not active for bookings",
        });
      }

      // Check for conflicting bookings
      const conflictQuery = `
        SELECT 
          b.*,
          c.name as campaign_name,
          u.email as advertiser_email
        FROM bookings b
        LEFT JOIN campaigns c ON b.campaign_id = c.id
        LEFT JOIN users u ON b.advertiser_id = u.id
        WHERE b.screen_id = $1
          AND b.status IN ('pending', 'confirmed', 'active')
          AND (
            (b.start_date <= $2 AND b.end_date >= $2)
            OR (b.start_date <= $3 AND b.end_date >= $3)
            OR (b.start_date >= $2 AND b.end_date <= $3)
          )
        ORDER BY b.start_date
      `;

      const conflictResult = await client.query(conflictQuery, [
        screen_id,
        start_date,
        end_date,
      ]);

      // Calculate available time slots
      const availableSlots = calculateAvailableSlots(
        start_date as string,
        end_date as string,
        conflictResult.rows,
        booking_hours as string
      );

      const availability: ScreenAvailability = {
        screen_id: parseInt(screen_id as string),
        available: conflictResult.rows.length === 0 || availableSlots.length > 0,
        conflicting_bookings: conflictResult.rows,
        available_slots: availableSlots,
      };

      res.json({
        success: true,
        data: availability,
        screen_info: screenCheck.rows[0],
      });
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error checking screen availability:", error);
    res.status(500).json({
      success: false,
      message: "Failed to check screen availability",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Create a new booking with proper synchronization
export async function createBooking(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const {
      screen_id,
      start_date,
      end_date,
      campaign_id,
      total_amount,
      booking_hours,
      content_url,
      notes,
    }: BookingRequest = req.body;

    // Validation
    if (!screen_id || !start_date || !end_date || !total_amount) {
      return res.status(400).json({
        success: false,
        message: "screen_id, start_date, end_date, and total_amount are required",
      });
    }

    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");

      // Double-check availability with row-level locking
      const lockQuery = `
        SELECT id, is_active, screen_name, user_id as owner_id
        FROM screens 
        WHERE id = $1 
        FOR UPDATE
      `;
      
      const screenResult = await client.query(lockQuery, [screen_id]);
      
      if (screenResult.rows.length === 0) {
        throw new Error("Screen not found");
      }

      const screen = screenResult.rows[0];
      
      if (!screen.is_active) {
        throw new Error("Screen is not active for bookings");
      }

      // Check for conflicts again with lock
      const conflictCheck = await client.query(
        `
        SELECT COUNT(*) as conflict_count
        FROM bookings 
        WHERE screen_id = $1
          AND status IN ('pending', 'confirmed', 'active')
          AND (
            (start_date <= $2 AND end_date >= $2)
            OR (start_date <= $3 AND end_date >= $3)
            OR (start_date >= $2 AND end_date <= $3)
          )
        `,
        [screen_id, start_date, end_date]
      );

      if (parseInt(conflictCheck.rows[0].conflict_count) > 0) {
        throw new Error("Time slot is no longer available");
      }

      // Create booking
      const bookingQuery = `
        INSERT INTO bookings (
          screen_id, 
          advertiser_id, 
          campaign_id,
          start_date, 
          end_date,
          total_amount,
          booking_hours,
          content_url,
          notes,
          status,
          created_at
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
        RETURNING *
      `;

      const bookingResult = await client.query(bookingQuery, [
        screen_id,
        userId,
        campaign_id || null,
        start_date,
        end_date,
        total_amount,
        JSON.stringify(booking_hours || []),
        content_url || null,
        notes || null,
        "pending", // Default status
        new Date(),
      ]);

      const booking = bookingResult.rows[0];

      // Update campaign if provided
      if (campaign_id) {
        await client.query(
          `
          UPDATE campaigns 
          SET spent_amount = spent_amount + $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $2 AND user_id = $3
          `,
          [total_amount, campaign_id, userId]
        );
      }

      // Log booking activity
      await client.query(
        `
        INSERT INTO booking_logs (
          booking_id,
          action,
          details,
          created_by,
          created_at
        ) VALUES ($1, $2, $3, $4, $5)
        `,
        [
          booking.id,
          "created",
          JSON.stringify({
            screen_name: screen.screen_name,
            owner_id: screen.owner_id,
            amount: total_amount,
          }),
          userId,
          new Date(),
        ]
      );

      await client.query("COMMIT");

      // Fetch complete booking data
      const completeBooking = await getCompleteBookingData(booking.id);

      res.status(201).json({
        success: true,
        message: "Booking created successfully",
        data: completeBooking,
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error creating booking:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to create booking",
    });
  }
}

// Get user's bookings (advertiser view)
export async function getMyBookings(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { status, limit = 50, offset = 0 } = req.query;

    let query = `
      SELECT 
        b.*,
        s.screen_name,
        s.location_name,
        s.city,
        s.state,
        s.screen_type,
        c.name as campaign_name,
        u.email as owner_email,
        (
          SELECT COUNT(*) 
          FROM proof_of_play pp 
          WHERE pp.booking_id = b.id
        ) as proof_count
      FROM bookings b
      JOIN screens s ON b.screen_id = s.id
      LEFT JOIN campaigns c ON b.campaign_id = c.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE b.advertiser_id = $1
    `;

    const params: any[] = [userId];
    let paramIndex = 2;

    if (status && status !== "all") {
      query += ` AND b.status = $${paramIndex}`;
      params.push(status);
      paramIndex++;
    }

    query += ` ORDER BY b.created_at DESC LIMIT $${paramIndex} OFFSET $${paramIndex + 1}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    // Get total count
    let countQuery = `
      SELECT COUNT(*) as total
      FROM bookings b
      WHERE b.advertiser_id = $1
    `;
    const countParams: (number | string)[] = [userId];

    if (status && status !== "all") {
      countQuery += " AND b.status = $2";
      countParams.push(status as string);
    }

    const countResult = await pool.query(countQuery, countParams);

    res.json({
      success: true,
      data: result.rows,
      pagination: {
        total: parseInt(countResult.rows[0].total),
        limit: parseInt(limit as string),
        offset: parseInt(offset as string),
      },
    });
  } catch (error) {
    console.error("Error fetching bookings:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch bookings",
    });
  }
}

// Cancel booking (advertiser)
export async function cancelBooking(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Authentication required",
      });
    }

    const { booking_id } = req.params;
    const { reason } = req.body;

    const client = await pool.connect();
    
    try {
      await client.query("BEGIN");

      // Check if booking belongs to user and can be cancelled
      const bookingCheck = await client.query(
        `
        SELECT b.*, s.screen_name
        FROM bookings b
        JOIN screens s ON b.screen_id = s.id
        WHERE b.id = $1 AND b.advertiser_id = $2
        `,
        [booking_id, userId]
      );

      if (bookingCheck.rows.length === 0) {
        throw new Error("Booking not found or unauthorized");
      }

      const booking = bookingCheck.rows[0];

      if (!["pending", "confirmed"].includes(booking.status)) {
        throw new Error("Booking cannot be cancelled in current status");
      }

      // Update booking status
      await client.query(
        `
        UPDATE bookings 
        SET status = 'cancelled',
            cancellation_reason = $1,
            cancelled_at = CURRENT_TIMESTAMP
        WHERE id = $2
        `,
        [reason || "Cancelled by advertiser", booking_id]
      );

      // Refund to campaign if applicable
      if (booking.campaign_id) {
        await client.query(
          `
          UPDATE campaigns 
          SET spent_amount = spent_amount - $1,
              updated_at = CURRENT_TIMESTAMP
          WHERE id = $2
          `,
          [booking.total_amount, booking.campaign_id]
        );
      }

      // Log cancellation
      await client.query(
        `
        INSERT INTO booking_logs (
          booking_id,
          action,
          details,
          created_by,
          created_at
        ) VALUES ($1, $2, $3, $4, $5)
        `,
        [
          booking.id,
          "cancelled",
          JSON.stringify({
            reason: reason || "Cancelled by advertiser",
            refund_amount: booking.total_amount,
          }),
          userId,
          new Date(),
        ]
      );

      await client.query("COMMIT");

      res.json({
        success: true,
        message: "Booking cancelled successfully",
      });
    } catch (error) {
      await client.query("ROLLBACK");
      throw error;
    } finally {
      client.release();
    }
  } catch (error) {
    console.error("Error cancelling booking:", error);
    res.status(500).json({
      success: false,
      message: error instanceof Error ? error.message : "Failed to cancel booking",
    });
  }
}

// Utility functions
function calculateAvailableSlots(
  startDate: string,
  endDate: string,
  conflictingBookings: any[],
  requestedHours?: string
): any[] {
  // Implementation for calculating available time slots
  // This would involve complex date/time calculations
  const availableSlots: any[] = [];
  
  // Simplified logic - in production, this would be more sophisticated
  if (conflictingBookings.length === 0) {
    availableSlots.push({
      start: startDate,
      end: endDate,
      available_hours: requestedHours ? JSON.parse(requestedHours) : [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22],
    });
  }

  return availableSlots;
}

async function getCompleteBookingData(bookingId: number): Promise<any> {
  const query = `
    SELECT 
      b.*,
      s.screen_name,
      s.location_name,
      s.city,
      s.state,
      s.screen_type,
      c.name as campaign_name,
      u.email as owner_email,
      (
        SELECT json_agg(
          json_build_object(
            'id', pp.id,
            'url', pp.url,
            'type', pp.type,
            'captured_at', pp.captured_at
          )
        )
        FROM proof_of_play pp 
        WHERE pp.booking_id = b.id
      ) as proof_of_play
    FROM bookings b
    JOIN screens s ON b.screen_id = s.id
    LEFT JOIN campaigns c ON b.campaign_id = c.id
    LEFT JOIN users u ON s.user_id = u.id
    WHERE b.id = $1
  `;

  const result = await pool.query(query, [bookingId]);
  return result.rows[0] || null;
}

// ===== New Booking Request System =====

export async function sendBookingRequest(req: Request, res: Response) {
  try {
    const {
      campaign_name,
      advertiser_id,
      advertiser_name,
      screen_id,
      screen_name,
      screen_owner_id,
      start_date,
      end_date,
      start_time,
      end_time,
      daily_budget,
      total_budget,
      message
    } = req.body;

    // Validate required fields
    if (!campaign_name || !screen_id || !start_date || !end_date) {
      return res.status(400).json({
        success: false,
        message: "campaign_name, screen_id, start_date, and end_date are required"
      });
    }

    const client = await pool.connect();
    
    try {
      // Insert booking request
      const insertQuery = `
        INSERT INTO booking_requests (
          campaign_name, advertiser_id, advertiser_name, screen_id, screen_name,
          screen_owner_id, start_date, end_date, start_time, end_time,
          daily_budget, total_budget, message, status
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, 'pending')
        RETURNING id, created_at
      `;

      const result = await client.query(insertQuery, [
        campaign_name, advertiser_id, advertiser_name, screen_id, screen_name,
        screen_owner_id, start_date, end_date, start_time, end_time,
        daily_budget, total_budget, message
      ]);

      res.json({
        success: true,
        data: {
          id: result.rows[0].id,
          status: 'pending',
          created_at: result.rows[0].created_at
        }
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error sending booking request:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export async function getMyBookingRequests(req: Request, res: Response) {
  try {
    const { advertiser_id } = req.query;

    if (!advertiser_id) {
      return res.status(400).json({
        success: false,
        message: "advertiser_id is required"
      });
    }

    const client = await pool.connect();
    
    try {
      // Simplified query first to test basic functionality
      const query = `
        SELECT 
          br.id,
          br.campaign_name,
          br.screen_id,
          br.screen_name,
          br.start_date,
          br.end_date,
          br.daily_budget,
          br.total_budget,
          br.status,
          br.message,
          br.created_at,
          br.updated_at
        FROM booking_requests br
        WHERE br.advertiser_id = $1
        ORDER BY br.created_at DESC
      `;

      const result = await client.query(query, [advertiser_id]);

      res.json({
        success: true,
        data: result.rows
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching booking requests:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

export async function getAvailableCities(req: Request, res: Response) {
  try {
    const client = await pool.connect();
    
    try {
      const query = `
        SELECT 
          city,
          'India' as state,
          COUNT(*) as screen_count
        FROM screens 
        WHERE is_active = true AND city IS NOT NULL
        GROUP BY city
        HAVING COUNT(*) > 0
        ORDER BY screen_count DESC, city ASC
      `;

      const result = await client.query(query);

      res.json({
        success: true,
        data: result.rows
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching available cities:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}
