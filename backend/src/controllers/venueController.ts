import { Request, Response, NextFunction } from "express";
import { pool } from "../db";
import { AuthUser } from "../middleware/auth";

// Middleware to check if the user is a venue owner
export const isVenueOwner = (
  req: Request & { user?: AuthUser },
  res: Response,
  next: NextFunction
) => {
  if (req.user?.roles?.includes("venue_owner")) {
    return next();
  } else {
    return res
      .status(403)
      .json({ message: "Forbidden: Venue owner access required" });
  }
};

// Add assets (photos/videos) to a screen
export async function addScreenAsset(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const { screen_id, asset_type, url } = req.body;
  if (!screen_id || !asset_type || !url) {
    return res
      .status(400)
      .json({ message: "screen_id, asset_type, and url are required" });
  }

  try {
    // Verify the user owns the screen
    const screenCheck = await pool.query(
      "SELECT user_id FROM screens WHERE id = $1",
      [screen_id]
    );
    if (
      screenCheck.rowCount === 0 ||
      screenCheck.rows[0].user_id !== req.user?.id
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this screen" });
    }

    const result = await pool.query(
      "INSERT INTO screen_assets (screen_id, asset_type, url) VALUES ($1, $2, $3) RETURNING *",
      [screen_id, asset_type, url]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

// Set pricing for a screen
export async function setScreenPricing(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const { screen_id, hourly_rate, daily_rate, weekly_rate } = req.body;
  if (!screen_id) {
    return res.status(400).json({ message: "screen_id is required" });
  }

  try {
    const screenCheck = await pool.query(
      "SELECT user_id FROM screens WHERE id = $1",
      [screen_id]
    );
    if (
      screenCheck.rowCount === 0 ||
      screenCheck.rows[0].user_id !== req.user?.id
    ) {
      return res
        .status(403)
        .json({ message: "Forbidden: You do not own this screen" });
    }

    const result = await pool.query(
      "INSERT INTO screen_pricing (screen_id, hourly_rate, daily_rate, weekly_rate) VALUES ($1, $2, $3, $4) ON CONFLICT (screen_id) DO UPDATE SET hourly_rate = EXCLUDED.hourly_rate, daily_rate = EXCLUDED.daily_rate, weekly_rate = EXCLUDED.weekly_rate RETURNING *",
      [screen_id, hourly_rate, daily_rate, weekly_rate]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

// Get booking requests for all screens owned by the venue owner
export async function getVenueBookingRequests(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const result = await pool.query(
      `
            SELECT 
                br.id,
                br.campaign_name,
                br.advertiser_id,
                br.advertiser_name,
                br.screen_id,
                br.screen_name,
                br.start_date,
                br.end_date,
                br.start_time,
                br.end_time,
                br.daily_budget,
                br.total_budget,
                br.message,
                br.status,
                br.created_at,
                br.updated_at,
                s.screen_name as current_screen_name,
                s.location_in_venue as location,
                s.city
            FROM booking_requests br 
            JOIN screens s ON br.screen_id = s.id 
            WHERE s.user_id = $1 
            ORDER BY br.created_at DESC
        `,
      [req.user?.id]
    );

    res.status(200).json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error fetching venue booking requests:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

// Get bookings for all screens owned by the venue owner
export async function getVenueBookings(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const result = await pool.query(
      "SELECT b.*, s.screen_name FROM bookings b JOIN screens s ON b.screen_id = s.id WHERE s.user_id = $1 ORDER BY b.created_at DESC",
      [req.user?.id]
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

// Update the status of a booking request (accept/reject)
export async function updateBookingRequestStatus(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const { request_id, status } = req.body;
  if (!request_id || !status || !["accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      message:
        "request_id and a valid status (accepted, rejected) are required",
    });
  }

  try {
    // Check if the venue owner owns the screen for this booking request
    const requestCheck = await pool.query(
      "SELECT br.*, s.user_id FROM booking_requests br JOIN screens s ON br.screen_id = s.id WHERE br.id = $1",
      [request_id]
    );

    if (
      requestCheck.rowCount === 0 ||
      requestCheck.rows[0].user_id !== req.user?.id
    ) {
      return res.status(403).json({
        message:
          "Forbidden: You do not own the screen for this booking request",
      });
    }

    const result = await pool.query(
      "UPDATE booking_requests SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE id = $2 RETURNING *",
      [status, request_id]
    );

    res.status(200).json({
      success: true,
      data: result.rows[0],
    });
  } catch (error) {
    console.error("Error updating booking request status:", error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

// Update the status of a booking (accept/reject)
export async function updateBookingStatus(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const { booking_id, status } = req.body;
  if (!booking_id || !status || !["accepted", "rejected"].includes(status)) {
    return res.status(400).json({
      message:
        "booking_id and a valid status (accepted, rejected) are required",
    });
  }

  try {
    const bookingCheck = await pool.query(
      "SELECT s.user_id FROM bookings b JOIN screens s ON b.screen_id = s.id WHERE b.id = $1",
      [booking_id]
    );

    if (
      bookingCheck.rowCount === 0 ||
      bookingCheck.rows[0].user_id !== req.user?.id
    ) {
      return res.status(403).json({
        message: "Forbidden: You do not own the screen for this booking",
      });
    }

    const result = await pool.query(
      "UPDATE bookings SET status = $1 WHERE id = $2 RETURNING *",
      [status, booking_id]
    );
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}

// Add proof of play for a booking
export async function addProofOfPlay(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const { booking_id, url, type, captured_at } = req.body;
  if (!booking_id || !url || !type || !captured_at) {
    return res
      .status(400)
      .json({ message: "booking_id, url, type, and captured_at are required" });
  }

  try {
    const bookingCheck = await pool.query(
      "SELECT s.user_id FROM bookings b JOIN screens s ON b.screen_id = s.id WHERE b.id = $1",
      [booking_id]
    );

    if (
      bookingCheck.rowCount === 0 ||
      bookingCheck.rows[0].user_id !== req.user?.id
    ) {
      return res.status(403).json({
        message: "Forbidden: You do not own the screen for this booking",
      });
    }

    const result = await pool.query(
      "INSERT INTO proof_of_play (booking_id, url, type, captured_at) VALUES ($1, $2, $3, $4) RETURNING *",
      [booking_id, url, type, captured_at]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    if (error instanceof Error) {
      res
        .status(500)
        .json({ message: "Internal server error", error: error.message });
    } else {
      res.status(500).json({ message: "An unknown error occurred" });
    }
  }
}
