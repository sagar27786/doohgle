import { Request, Response } from "express";
import { pool } from "../db";
import { AuthUser } from "../middleware/auth";

interface CampaignRequestData {
  screen_id: number;
  campaign_name: string;
  campaign_description?: string;
  start_date: string;
  end_date: string;
  requested_hours?: number[];
  budget_offered: number;
  creative_assets?: any[];
  target_audience?: string;
  notes?: string;
}

interface CampaignRequestResponse {
  id: number;
  advertiser_id: number;
  venue_owner_id: number;
  screen_id: number;
  screen_name: string;
  screen_location: string;
  campaign_name: string;
  campaign_description: string;
  start_date: string;
  end_date: string;
  requested_hours: number[];
  budget_offered: number;
  creative_assets: any[];
  target_audience: string;
  notes: string;
  status: string;
  created_at: string;
  updated_at: string;
  advertiser_name: string;
  advertiser_email: string;
  venue_owner_name: string;
  venue_owner_email: string;
}

// Create a new campaign request (Advertiser)
export async function createCampaignRequest(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const client = await pool.connect();

  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: "Unauthorized",
      });
    }

    const {
      screen_id,
      campaign_name,
      campaign_description,
      start_date,
      end_date,
      requested_hours = [],
      budget_offered,
      creative_assets = [],
      target_audience,
      notes,
    }: CampaignRequestData = req.body;

    // Validate required fields
    if (
      !screen_id ||
      !campaign_name ||
      !start_date ||
      !end_date ||
      !budget_offered
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Missing required fields: screen_id, campaign_name, start_date, end_date, budget_offered",
      });
    }

    // Get screen details and venue owner
    const screenQuery = `
      SELECT s.*, u.id as venue_owner_id, u.name as venue_owner_name, u.email as venue_owner_email
      FROM screens s
      JOIN users u ON s.owner_id = u.id
      WHERE s.id = $1 AND s.is_active = true
    `;

    const screenResult = await client.query(screenQuery, [screen_id]);

    if (screenResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Screen not found or not active",
      });
    }

    const screen = screenResult.rows[0];

    // Check if dates are valid
    const startDate = new Date(start_date);
    const endDate = new Date(end_date);
    const now = new Date();

    if (startDate < now) {
      return res.status(400).json({
        success: false,
        message: "Start date cannot be in the past",
      });
    }

    if (endDate <= startDate) {
      return res.status(400).json({
        success: false,
        message: "End date must be after start date",
      });
    }

    // Create campaign request
    const insertQuery = `
      INSERT INTO campaign_requests (
        advertiser_id, venue_owner_id, screen_id, campaign_name, campaign_description,
        start_date, end_date, requested_hours, budget_offered, creative_assets,
        target_audience, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)
      RETURNING *
    `;

    const insertResult = await client.query(insertQuery, [
      userId,
      screen.venue_owner_id,
      screen_id,
      campaign_name,
      campaign_description || "",
      start_date,
      end_date,
      requested_hours,
      budget_offered,
      JSON.stringify(creative_assets),
      target_audience || "",
      notes || "",
    ]);

    const campaignRequest = insertResult.rows[0];

    // Create notification for venue owner
    await client.query(
      `
      INSERT INTO notifications (user_id, type, title, message, related_id)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [
        screen.venue_owner_id,
        "campaign_request",
        "New Campaign Request",
        `An advertiser has requested to advertise on your screen "${screen.screen_name}". Budget offered: $${budget_offered}`,
        campaignRequest.id,
      ]
    );

    res.status(201).json({
      success: true,
      message: "Campaign request created successfully",
      data: {
        ...campaignRequest,
        screen_name: screen.screen_name,
        screen_location: screen.location_in_venue,
        venue_owner_name: screen.venue_owner_name,
        venue_owner_email: screen.venue_owner_email,
      },
    });
  } catch (error) {
    console.error("Error creating campaign request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  } finally {
    client.release();
  }
}

// Get campaign requests for advertiser (their sent requests)
export async function getMyRequests(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const query = `
      SELECT 
        cr.*,
        s.screen_name,
        s.location_in_venue as screen_location,
        s.city as screen_city,
        u.name as venue_owner_name,
        u.email as venue_owner_email
      FROM campaign_requests cr
      JOIN screens s ON cr.screen_id = s.id
      JOIN users u ON cr.venue_owner_id = u.id
      WHERE cr.advertiser_id = $1
      ORDER BY cr.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        ...row,
        creative_assets:
          typeof row.creative_assets === "string"
            ? JSON.parse(row.creative_assets)
            : row.creative_assets,
      })),
    });
  } catch (error) {
    console.error("Error fetching campaign requests:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get campaign requests for venue owner (requests to approve/reject)
export async function getIncomingRequests(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const query = `
      SELECT 
        cr.*,
        s.screen_name,
        s.location_in_venue as screen_location,
        s.city as screen_city,
        u.name as advertiser_name,
        u.email as advertiser_email
      FROM campaign_requests cr
      JOIN screens s ON cr.screen_id = s.id
      JOIN users u ON cr.advertiser_id = u.id
      WHERE cr.venue_owner_id = $1
      ORDER BY cr.created_at DESC
    `;

    const result = await pool.query(query, [userId]);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        ...row,
        creative_assets:
          typeof row.creative_assets === "string"
            ? JSON.parse(row.creative_assets)
            : row.creative_assets,
      })),
    });
  } catch (error) {
    console.error("Error fetching incoming requests:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Approve campaign request (Venue Owner)
export async function approveCampaignRequest(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const userId = req.user?.id;
    const requestId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get campaign request details
    const requestQuery = `
      SELECT cr.*, s.screen_name, u.name as advertiser_name, u.email as advertiser_email
      FROM campaign_requests cr
      JOIN screens s ON cr.screen_id = s.id
      JOIN users u ON cr.advertiser_id = u.id
      WHERE cr.id = $1 AND cr.venue_owner_id = $2 AND cr.status = 'pending'
    `;

    const requestResult = await client.query(requestQuery, [requestId, userId]);

    if (requestResult.rows.length === 0) {
      await client.query("ROLLBACK");
      return res.status(404).json({
        success: false,
        message: "Campaign request not found or already processed",
      });
    }

    const campaignRequest = requestResult.rows[0];

    // Update request status
    await client.query(
      `
      UPDATE campaign_requests 
      SET status = 'approved', approved_at = CURRENT_TIMESTAMP, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [requestId]
    );

    // Create campaign
    const campaignInsert = await client.query(
      `
      INSERT INTO campaigns (
        advertiser_id, campaign_request_id, name, description, 
        start_date, end_date, budget, target_audience, status
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING *
    `,
      [
        campaignRequest.advertiser_id,
        requestId,
        campaignRequest.campaign_name,
        campaignRequest.campaign_description,
        campaignRequest.start_date,
        campaignRequest.end_date,
        campaignRequest.budget_offered,
        campaignRequest.target_audience,
        "active",
      ]
    );

    const campaign = campaignInsert.rows[0];

    // Link campaign to screen
    await client.query(
      `
      INSERT INTO campaign_screens (campaign_id, screen_id, campaign_request_id, allocated_budget, scheduled_hours)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [
        campaign.id,
        campaignRequest.screen_id,
        requestId,
        campaignRequest.budget_offered,
        campaignRequest.requested_hours,
      ]
    );

    // Create booking
    await client.query(
      `
      INSERT INTO bookings (
        screen_id, advertiser_id, campaign_id, campaign_request_id,
        start_ts, end_ts, status, notes
      ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
    `,
      [
        campaignRequest.screen_id,
        campaignRequest.advertiser_id,
        campaign.id,
        requestId,
        campaignRequest.start_date,
        campaignRequest.end_date,
        "accepted",
        `Campaign: ${campaignRequest.campaign_name}`,
      ]
    );

    // Create notification for advertiser
    await client.query(
      `
      INSERT INTO notifications (user_id, type, title, message, related_id)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [
        campaignRequest.advertiser_id,
        "request_approved",
        "Campaign Request Approved!",
        `Your campaign request for "${campaignRequest.screen_name}" has been approved! Your campaign "${campaignRequest.campaign_name}" is now active.`,
        requestId,
      ]
    );

    await client.query("COMMIT");

    res.json({
      success: true,
      message: "Campaign request approved successfully",
      data: {
        campaign_request_id: requestId,
        campaign_id: campaign.id,
        status: "approved",
      },
    });
  } catch (error) {
    await client.query("ROLLBACK");
    console.error("Error approving campaign request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
}

// Reject campaign request (Venue Owner)
export async function rejectCampaignRequest(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const client = await pool.connect();

  try {
    const userId = req.user?.id;
    const requestId = req.params.id;
    const { rejection_reason } = req.body;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get campaign request details
    const requestQuery = `
      SELECT cr.*, s.screen_name, u.name as advertiser_name
      FROM campaign_requests cr
      JOIN screens s ON cr.screen_id = s.id
      JOIN users u ON cr.advertiser_id = u.id
      WHERE cr.id = $1 AND cr.venue_owner_id = $2 AND cr.status = 'pending'
    `;

    const requestResult = await client.query(requestQuery, [requestId, userId]);

    if (requestResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaign request not found or already processed",
      });
    }

    const campaignRequest = requestResult.rows[0];

    // Update request status
    await client.query(
      `
      UPDATE campaign_requests 
      SET status = 'rejected', rejected_at = CURRENT_TIMESTAMP, rejection_reason = $2, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1
    `,
      [requestId, rejection_reason || "No reason provided"]
    );

    // Create notification for advertiser
    await client.query(
      `
      INSERT INTO notifications (user_id, type, title, message, related_id)
      VALUES ($1, $2, $3, $4, $5)
    `,
      [
        campaignRequest.advertiser_id,
        "request_rejected",
        "Campaign Request Rejected",
        `Your campaign request for "${
          campaignRequest.screen_name
        }" has been rejected. Reason: ${
          rejection_reason || "No reason provided"
        }`,
        requestId,
      ]
    );

    res.json({
      success: true,
      message: "Campaign request rejected",
      data: {
        campaign_request_id: requestId,
        status: "rejected",
        rejection_reason,
      },
    });
  } catch (error) {
    console.error("Error rejecting campaign request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  } finally {
    client.release();
  }
}

// Get notifications for user
export async function getNotifications(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const { limit = 20, offset = 0, unread_only = false } = req.query;

    let query = `
      SELECT * FROM notifications 
      WHERE user_id = $1
    `;

    const params = [userId];
    let paramCount = 1;

    if (unread_only === "true") {
      query += ` AND is_read = false`;
    }

    query += ` ORDER BY created_at DESC LIMIT $${++paramCount} OFFSET $${++paramCount}`;
    params.push(parseInt(limit as string), parseInt(offset as string));

    const result = await pool.query(query, params);

    // Get unread count
    const unreadResult = await pool.query(
      "SELECT COUNT(*) as unread_count FROM notifications WHERE user_id = $1 AND is_read = false",
      [userId]
    );

    res.json({
      success: true,
      data: result.rows,
      unread_count: parseInt(unreadResult.rows[0].unread_count),
    });
  } catch (error) {
    console.error("Error fetching notifications:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Mark notification as read
export async function markNotificationRead(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    const notificationId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    await pool.query(
      `
      UPDATE notifications 
      SET is_read = true 
      WHERE id = $1 AND user_id = $2
    `,
      [notificationId, userId]
    );

    res.json({
      success: true,
      message: "Notification marked as read",
    });
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}

// Get campaign request details
export async function getCampaignRequest(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    const requestId = req.params.id;

    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    const query = `
      SELECT 
        cr.*,
        s.screen_name,
        s.location_in_venue as screen_location,
        s.city as screen_city,
        s.latitude,
        s.longitude,
        advertiser.name as advertiser_name,
        advertiser.email as advertiser_email,
        venue_owner.name as venue_owner_name,
        venue_owner.email as venue_owner_email
      FROM campaign_requests cr
      JOIN screens s ON cr.screen_id = s.id
      JOIN users advertiser ON cr.advertiser_id = advertiser.id
      JOIN users venue_owner ON cr.venue_owner_id = venue_owner.id
      WHERE cr.id = $1 AND (cr.advertiser_id = $2 OR cr.venue_owner_id = $2)
    `;

    const result = await pool.query(query, [requestId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Campaign request not found",
      });
    }

    const data = result.rows[0];

    res.json({
      success: true,
      data: {
        ...data,
        creative_assets:
          typeof data.creative_assets === "string"
            ? JSON.parse(data.creative_assets)
            : data.creative_assets,
      },
    });
  } catch (error) {
    console.error("Error fetching campaign request:", error);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
}
