import { Request, Response } from "express";
import { pool } from "../db";

interface AuthRequest extends Request {
  user?: { id: number; email: string; role: string };
}
import { AuthUser } from "../middleware/auth";

export const createScreen = async (req: AuthRequest, res: Response) => {
  const userId = req.user?.id;
  if (!userId) return res.status(401).json({ message: "Unauthorized" });

  const {
    screen_name,
    location_in_venue,
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
  } = req.body || {};

  if (!screen_name || !location_in_venue) {
    return res
      .status(400)
      .json({ message: "screen_name and location_in_venue are required." });
  }

  try {
    const result = await pool.query(
      `INSERT INTO screens
       (owner_id, name, description, screen_type, location_name, address, city, state, pincode,
        latitude, longitude, screen_size_width, screen_size_height, resolution_width, resolution_height,
        daily_footfall, vehicle_count, peak_hours, demographics, cost_per_10_seconds, is_active)
       VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11,$12,$13,$14,$15,$16,$17,$18,$19,$20,$21)
       RETURNING *`,
      [
        userId,
        screen_name, // name
        screen_name + " - " + location_in_venue, // description
        device_type || "smart_tv", // screen_type
        location_in_venue, // location_name
        "", // address
        "", // city
        "", // state
        "", // pincode
        0, // latitude
        0, // longitude
        screen_size_inches || 20, // screen_size_width
        Math.round((screen_size_inches || 20) * 0.6), // screen_size_height
        1920, // resolution_width
        1080, // resolution_height
        1000, // daily_footfall
        500, // vehicle_count
        (peak_viewing_hours || []).join(", "), // peak_hours
        typical_viewer_duration || "", // demographics
        1.0, // cost_per_10_seconds
        true, // is_active
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
};

export const getMyScreens = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const result = await pool.query(
      "SELECT * FROM screens WHERE owner_id = $1 ORDER BY created_at DESC",
      [userId]
    );

    return res.json({ screens: result.rows });
  } catch (err) {
    console.error("getMyScreens error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};

// ==================== ADS MANAGER FUNCTIONS (EXTENDING EXISTING) ====================

// Get all screens for ads manager with filters
export async function getAllScreens(req: Request, res: Response) {
  try {
    const { city, state, screen_type, min_footfall, max_budget } = req.query;

    let query = `
      SELECT 
        s.id, 
        s.name, 
        s.description,
        s.screen_type,
        s.location_name,
        s.address,
        s.city,
        s.state,
        s.pincode,
        s.latitude,
        s.longitude,
        s.screen_size_width,
        s.screen_size_height,
        s.resolution_width,
        s.resolution_height,
        s.daily_footfall,
        s.vehicle_count,
        s.peak_hours,
        s.demographics,
        s.cost_per_10_seconds,
        s.image_url,
        s.video_url,
        s.is_active,
        true as ads_enabled,
        'landscape' as orientation,
        s.screen_type as device_type,
        null as device_model,
        s.price_per_hour as hourly_rate,
        s.price_per_day as daily_rate,
        s.price_per_week as weekly_rate,
        s.currency
      FROM screens s
      WHERE s.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // For now, we'll skip complex filtering since the screen fields are different
    // Users can filter by screen name or location
    if (city) {
      query += ` AND (LOWER(s.screen_name) LIKE LOWER($${paramIndex}) OR LOWER(s.location_in_venue) LIKE LOWER($${paramIndex}))`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (screen_type) {
      query += ` AND s.device_type = $${paramIndex}`;
      params.push(screen_type);
      paramIndex++;
    }

    query += " ORDER BY s.created_at DESC";

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
    const { city, state, screen_type, min_footfall, max_budget } = req.query;

    let query = `
      SELECT 
        s.id, 
        s.screen_name as name, 
        COALESCE(s.screen_name || ' - ' || s.location_in_venue, s.screen_name) as description,
        s.device_type as screen_type,
        s.location_in_venue as location_name,
        COALESCE('', '') as address,
        COALESCE('', '') as city,
        COALESCE('', '') as state,
        COALESCE('', '') as pincode,
        0 as latitude,
        0 as longitude,
        s.screen_size_inches as screen_size_width,
        s.screen_size_inches as screen_size_height,
        COALESCE(s.width_px, 1920) as resolution_width,
        COALESCE(s.height_px, 1080) as resolution_height,
        0 as daily_footfall,
        0 as vehicle_count,
        array_to_string(s.peak_viewing_hours, ', ') as peak_hours,
        s.typical_viewer_duration as demographics,
        0.5 as cost_per_10_seconds,
        '' as image_url,
        '' as video_url
      FROM screens s
      WHERE s.is_active = true AND s.ads_enabled = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND (LOWER(s.screen_name) LIKE LOWER($${paramIndex}) OR LOWER(s.location_in_venue) LIKE LOWER($${paramIndex}))`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (screen_type) {
      query += ` AND s.device_type = $${paramIndex}`;
      params.push(screen_type);
      paramIndex++;
    }

    query += " ORDER BY s.created_at DESC LIMIT 50";

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

    const query = `
      SELECT 
        s.*,
        json_agg(
          DISTINCT jsonb_build_object(
            'date', sa.date,
            'start_time', sa.start_time,
            'end_time', sa.end_time,
            'is_available', sa.is_available
          )
        ) as availability
      FROM screens s
      LEFT JOIN screen_availability sa ON s.id = sa.screen_id 
        AND sa.date >= CURRENT_DATE 
        AND sa.date <= CURRENT_DATE + INTERVAL '30 days'
      WHERE s.id = $1 AND s.is_active = true
      GROUP BY s.id
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      res.status(404).json({
        success: false,
        message: "Screen not found",
      });
      return;
    }

    res.json({
      success: true,
      data: result.rows[0],
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

// Dashboard analytics endpoints for screen manager
export async function getScreenManagerDashboard(
  req: AuthRequest,
  res: Response
) {
  try {
    const userId = req.user?.id;
    if (!userId) {
      return res.status(401).json({ success: false, message: "Unauthorized" });
    }

    // Get screen owner statistics using correct column names
    const screenOverviewQuery = `
      SELECT
        COUNT(*) as total_screens,
        COUNT(CASE WHEN is_active = true THEN 1 END) as active_screens,
        0 as total_impressions,
        0 as total_bookings,
        0 as total_revenue,
        0 as avg_utilization
      FROM screens 
      WHERE owner_id = $1
    `;

    const overviewResult = await pool.query(screenOverviewQuery, [userId]);

    // For now, provide mock data for recent bookings since we don't have a bookings table
    const mockRecentBookings = [
      {
        id: 1,
        screen_name: "Main Lobby Display",
        campaign_name: "Brand Campaign #1",
        start_date: "2024-12-01",
        end_date: "2024-12-07",
        amount: 5000,
        status: "confirmed",
      },
      {
        id: 2,
        screen_name: "Reception Screen",
        campaign_name: "Product Launch",
        start_date: "2024-11-20",
        end_date: "2024-11-30",
        amount: 3500,
        status: "completed",
      },
    ];

    // Mock monthly revenue data
    const mockMonthlyRevenue = [
      { month: "Oct", revenue: 12000, bookings: 3 },
      { month: "Nov", revenue: 15000, bookings: 5 },
      { month: "Dec", revenue: 18000, bookings: 7 },
      { month: "Jan", revenue: 14000, bookings: 4 },
    ];

    // Get actual screen performance data using correct column names
    const screenPerformanceQuery = `
      SELECT
        s.id,
        s.name as screen_name,
        s.location,
        0 as total_impressions,
        0 as total_bookings,
        0 as revenue_earned,
        0 as utilization_rate,
        CASE WHEN s.is_active THEN 'active' ELSE 'inactive' END as status,
        s.created_at::text as last_booking_date
      FROM screens s
      WHERE s.owner_id = $1
      ORDER BY s.created_at DESC
    `;

    const screenPerformance = await pool.query(screenPerformanceQuery, [
      userId,
    ]);

    res.json({
      success: true,
      data: {
        overview: overviewResult.rows[0] || {
          total_screens: 0,
          active_screens: 0,
          total_bookings: 0,
          total_revenue: 0,
          total_impressions: 0,
          avg_utilization: 0,
        },
        recent_bookings: mockRecentBookings,
        screen_performance: screenPerformance.rows || [],
        monthly_revenue: mockMonthlyRevenue,
      },
    });
  } catch (error) {
    console.error("Error fetching screen manager dashboard:", error);
    res.status(500).json({
      success: false,
      message: "Failed to fetch screen manager dashboard",
    });
  }
}

// Dashboard analytics endpoints for ads manager
export async function getDashboardStats(req: AuthRequest, res: Response) {
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
