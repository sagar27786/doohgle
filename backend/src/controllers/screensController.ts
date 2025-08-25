import { Request, Response } from "express";
import { pool } from "../db";
import { AuthUser } from "../middleware/auth";

export async function createScreen(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const {
    screen_name,
    location_in_venue,
    city,
    latitude,
    longitude,
    screen_size_inches,
    resolution,
    orientation,
    device_type,
    device_model,
    ads_enabled,
    ad_frequency,
    viewing_distance,
    typical_viewer_duration,
    peak_viewing_hours,
    day_photo_url,
    night_photo_url,
    video_url,
  } = req.body || {};

  if (!screen_name || !location_in_venue) {
    return res
      .status(400)
      .json({ message: "screen_name and location_in_venue are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO screens
       (user_id, screen_name, location_in_venue, city, latitude, longitude, screen_size_inches, resolution, 
        orientation, device_type, device_model, ads_enabled, ad_frequency, viewing_distance, 
        typical_viewer_duration, peak_viewing_hours, day_photo_url, night_photo_url, video_url)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::text[], $17, $18, $19)
       RETURNING *`,
      [
        userId,
        screen_name,
        location_in_venue,
        city || null,
        latitude ? Number(latitude) : null,
        longitude ? Number(longitude) : null,
        screen_size_inches ?? null,
        resolution ?? null,
        orientation ?? "landscape",
        device_type ?? "smart_tv",
        device_model ?? null,
        !!ads_enabled,
        Number(ad_frequency) || 0,
        viewing_distance ?? "close",
        typical_viewer_duration ?? null,
        Array.isArray(peak_viewing_hours) ? peak_viewing_hours.map(String) : [],
        day_photo_url || null,
        night_photo_url || null,
        video_url || null,
      ]
    );

    return res.status(201).json({
      message: "Screen registered successfully",
      screen: result.rows[0],
    });
  } catch (err) {
    console.error("createScreen error:", err);
    return res.status(500).json({ message: "Server error" });
  }
}

export async function getMyScreens(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  try {
    const result = await pool.query(
      "SELECT * FROM screens WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    return res.json({ screens: result.rows });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}

// ==================== ADS MANAGER FUNCTIONS (EXTENDING EXISTING) ====================

// Get all screens for ads manager with filters
export async function getAllScreens(req: Request, res: Response) {
  try {
    const { city, state, screen_type, min_footfall, max_budget } = req.query;

    let query = `
      SELECT
        id,
        screen_name as name,
        NULL::text as description,
        NULL::text as screen_type,
        location_in_venue as location_name,
        NULL::text as address,
        city,
        NULL::text as state,
        NULL::text as pincode,
        latitude,
        longitude,
        screen_size_inches as screen_size_width,
        NULL::int as screen_size_height,
        NULL::int as resolution_width,
        NULL::int as resolution_height,
        NULL::int as daily_footfall,
        NULL::int as vehicle_count,
        peak_viewing_hours as peak_hours,
        NULL::text as demographics,
        NULL::numeric as cost_per_10_seconds,
        NULL::text as image_url,
        NULL::text as video_url,
        is_active
      FROM screens
      WHERE is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND LOWER(city) LIKE LOWER($${paramIndex})`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (state) {
      query += ` AND LOWER(state) LIKE LOWER($${paramIndex})`;
      params.push(`%${state}%`);
      paramIndex++;
    }

    if (screen_type) {
      query += ` AND screen_type = $${paramIndex}`;
      params.push(screen_type);
      paramIndex++;
    }

    if (min_footfall) {
      query += ` AND daily_footfall >= $${paramIndex}`;
      params.push(min_footfall);
      paramIndex++;
    }

    if (max_budget) {
      query += ` AND cost_per_10_seconds <= $${paramIndex}`;
      params.push(parseFloat(max_budget as string) / 8640); // Convert daily budget to 10-second cost
      paramIndex++;
    }

    query += " ORDER BY daily_footfall DESC, created_at DESC";

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
      total: result.rows.length,
      filters: { city, state, screen_type, min_footfall, max_budget },
    });
  } catch (error) {
    console.error("Error fetching screens:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch screens",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Search screens for ads manager
export async function searchScreens(req: Request, res: Response) {
  try {
    const { city } = req.query;

    let query = `
      SELECT 
        id,
        latitude,
        longitude,
        screen_name as name,
        location_in_venue as location_name,
        city,
        screen_size_inches,
        resolution,
        orientation,
        device_type,
        device_model,
        ads_enabled,
        ad_frequency,
        viewing_distance,
        typical_viewer_duration,
        peak_viewing_hours as peak_hours,
        created_at,
        updated_at
      FROM screens 
      WHERE 1=1
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND LOWER(city) LIKE LOWER($${paramIndex})`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    query += " ORDER BY created_at DESC LIMIT 50";

    const result = await pool.query(query, params);

    res.json({
      success: true,
      data: result.rows,
    });
  } catch (error) {
    console.error("Error searching screens:", error);
    res.status(500).json({
      success: false,
      message: "Failed to search screens",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Get screen by ID for ads manager
export async function getScreenById(req: Request, res: Response) {
  try {
    const { id } = req.params;

    // First get the screen details
    const screenQuery = `
      SELECT 
        s.*,
        p.hourly_rate,
        p.daily_rate,
        p.weekly_rate,
        (
          SELECT json_agg(
            jsonb_build_object(
              'asset_type', sa.asset_type,
              'url', sa.url,
              'created_at', sa.created_at
            )
          )
          FROM screen_assets sa
          WHERE sa.screen_id = s.id
        ) as assets,
        (
          SELECT json_agg(
            jsonb_build_object(
              'date', sa.date,
              'is_available', sa.is_available
            )
          )
          FROM screen_availability sa
          WHERE sa.screen_id = s.id
            AND sa.date >= CURRENT_DATE
            AND sa.date <= CURRENT_DATE + INTERVAL '30 days'
        ) as availability
      FROM screens s
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      WHERE s.id = $1 AND s.is_active = true
    `;

    const result = await pool.query(screenQuery, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Screen not found",
      });
      return;
    }

    // Format the response to match the frontend expectations
    const screen = result.rows[0];
    const response = {
      ...screen,
      pricing: {
        hourly: screen.hourly_rate || 0,
        daily: screen.daily_rate || 0,
        weekly: screen.weekly_rate || 0,
      },
      // Add any other necessary transformations here
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching screen:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch screen",
      error: error instanceof Error ? error.message : "Unknown error",
    });
  }
}

// Get screen types for filtering
export async function getScreenTypes(req: Request, res: Response) {
  try {
    const screenTypes = [
      {
        value: "LED_billboard",
        label: "LED Billboard",
        description: "Large outdoor LED displays",
      },
      {
        value: "mall_screen",
        label: "Mall Screen",
        description: "Indoor mall displays",
      },
      {
        value: "metro_display",
        label: "Metro Display",
        description: "Transit station displays",
      },
      {
        value: "bus_stop",
        label: "Bus Stop",
        description: "Bus stop displays",
      },
      {
        value: "digital_hoarding",
        label: "Digital Hoarding",
        description: "Highway digital boards",
      },
      {
        value: "airport_display",
        label: "Airport Display",
        description: "Airport terminal screens",
      },
    ];

    res.json({
      success: true,
      data: screenTypes,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Failed to fetch screen types",
    });
  }
}

// Get popular cities
export async function getPopularCities(req: Request, res: Response) {
  try {
    const query = `
      SELECT 
        city,
        state,
        COUNT(*) as screen_count,
        AVG(cost_per_10_seconds * 8640) as avg_daily_price
      FROM screens 
      WHERE is_active = true
      GROUP BY city, state
      ORDER BY screen_count DESC
      LIMIT 10
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        name: row.city,
        state: row.state,
        count: parseInt(row.screen_count),
        avgPrice: Math.round(parseFloat(row.avg_daily_price) || 0),
      })),
    });
  } catch (error) {
    console.error("Error fetching popular cities:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch popular cities",
    });
  }
}

// Dashboard analytics endpoints for ads manager
export async function getDashboardStats(
  req: Request & { user?: AuthUser },
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get campaign statistics
    const campaignStatsQuery = `
      SELECT
        COUNT(*) as total_campaigns,
        COUNT(CASE WHEN status = 'active' THEN 1 END) as active_campaigns,
        COUNT(CASE WHEN status = 'completed' THEN 1 END) as completed_campaigns,
        COALESCE(SUM(total_budget), 0) as total_budget,
        COALESCE(SUM(spent_amount), 0) as total_spent
      FROM campaigns
      WHERE user_id = $1
    `;

    const campaignStats = await pool.query(campaignStatsQuery, [userId]);

    // Get impression statistics
    const analyticsQuery = `
      SELECT
        COALESCE(SUM(ca.impressions), 0) as total_impressions,
        COALESCE(SUM(ca.plays), 0) as total_plays,
        COUNT(DISTINCT ca.screen_id) as screens_used
      FROM campaign_analytics ca
      JOIN campaigns c ON ca.campaign_id = c.id
      WHERE c.user_id = $1
    `;

    const analyticsStats = await pool.query(analyticsQuery, [userId]);

    // Get recent performance
    const recentPerformanceQuery = `
      SELECT
        c.name as campaign_name,
        c.id as campaign_id,
        SUM(ca.impressions) as impressions,
        SUM(ca.plays) as plays,
        c.spent_amount,
        c.total_budget
      FROM campaigns c
      LEFT JOIN campaign_analytics ca ON c.id = ca.campaign_id
      WHERE c.user_id = $1
        AND c.status = 'active'
        AND ca.date >= CURRENT_DATE - INTERVAL '7 days'
      GROUP BY c.id, c.name, c.spent_amount, c.total_budget
      ORDER BY impressions DESC
      LIMIT 5
    `;

    const recentPerformance = await pool.query(recentPerformanceQuery, [
      userId,
    ]);

    res.json({
      success: true,
      data: {
        overview: {
          ...campaignStats.rows[0],
          ...analyticsStats.rows[0],
        },
        recent_performance: recentPerformance.rows,
      },
    });
  } catch (error) {
    console.error("Error fetching dashboard stats:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch dashboard statistics",
    });
  }
}
