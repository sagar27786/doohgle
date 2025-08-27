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
  } = req.body || {};

  if (!screen_name || !location_in_venue) {
    return res
      .status(400)
      .json({ message: "screen_name and location_in_venue are required." });
  }

  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    // Create the screen - ALWAYS set is_active=true for new screens
    const result = await client.query(
      `INSERT INTO screens
       (user_id, screen_name, location_in_venue, city, latitude, longitude, screen_size_inches, resolution, 
        orientation, device_type, device_model, ads_enabled, ad_frequency, viewing_distance, 
        typical_viewer_duration, peak_viewing_hours, is_active)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16::text[], true)
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
      ]
    );

    const newScreen = result.rows[0];

    // Add default pricing if ads_enabled is true
    if (ads_enabled) {
      const defaultPricing = {
        hourly_rate: 500, // ₹500 per hour default
        daily_rate: 3000, // ₹3000 per day default
        weekly_rate: 18000, // ₹18000 per week default
        currency: "INR",
      };

      await client.query(
        `INSERT INTO screen_pricing (screen_id, hourly_rate, daily_rate, weekly_rate, currency)
         VALUES ($1, $2, $3, $4, $5)`,
        [
          newScreen.id,
          defaultPricing.hourly_rate,
          defaultPricing.daily_rate,
          defaultPricing.weekly_rate,
          defaultPricing.currency,
        ]
      );

      console.log(
        `✅ Screen "${screen_name}" created and made available for ads with default pricing`
      );
    } else {
      console.log(`📺 Screen "${screen_name}" created (ads disabled)`);
    }

    // Add to screen availability for the next 90 days (all available by default)
    const availabilityInserts = [];
    const startDate = new Date();
    for (let i = 0; i < 90; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      availabilityInserts.push([
        newScreen.id,
        date.toISOString().split("T")[0],
        true,
      ]);
    }

    if (availabilityInserts.length > 0) {
      const values = availabilityInserts
        .map((_, i) => `($${i * 3 + 1}, $${i * 3 + 2}, $${i * 3 + 3})`)
        .join(", ");

      await client.query(
        `INSERT INTO screen_availability (screen_id, date, is_available) 
         VALUES ${values} 
         ON CONFLICT (screen_id, date) DO NOTHING`,
        availabilityInserts.flat()
      );
    }

    await client.query("COMMIT");

    // Log screen creation for ads manager visibility
    console.log(`🚀 NEW SCREEN AVAILABLE FOR ADVERTISERS:`);
    console.log(`   📺 Name: ${screen_name}`);
    console.log(
      `   📍 Location: ${location_in_venue}, ${city || "Unknown City"}`
    );
    console.log(`   🎯 Ads Enabled: ${ads_enabled ? "YES" : "NO"}`);
    console.log(`   🆔 Screen ID: ${newScreen.id}`);
    console.log(`   👤 Owner ID: ${userId}`);

    return res.status(201).json({
      message:
        "Screen registered successfully and is now available for advertisers",
      screen: {
        ...newScreen,
        ads_enabled: !!ads_enabled,
        is_active: true,
      },
    });
  } catch (err) {
    await client.query("ROLLBACK");
    console.error("createScreen error:", err);
    return res.status(500).json({ message: "Server error" });
  } finally {
    client.release();
  }
}

export async function getMyScreens(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id || 1; // Temporarily default to user 1 for testing
  
  try {
    const result = await pool.query(
      "SELECT * FROM screens WHERE user_id = $1 ORDER BY created_at DESC",
      [userId]
    );
    console.log(`📱 Returning ${result.rows.length} screens for user ${userId}`);
    return res.json({ screens: result.rows });
  } catch (err) {
    console.error('Error fetching my screens:', err);
    return res.status(500).json({ message: "Server error", error: err });
  }
}

// ==================== ADS MANAGER FUNCTIONS (EXTENDING EXISTING) ====================

// Get all screens for ads manager with filters
export async function getAllScreens(req: Request, res: Response) {
  try {
    const {
      city,
      state,
      screen_type,
      min_footfall,
      max_budget,
      limit = "20",
    } = req.query;

    let query = `
      SELECT
        s.id,
        s.screen_name as name,
        'Premium advertising display' as description,
        s.device_type as screen_type,
        s.location_in_venue as location_name,
        CONCAT(s.location_in_venue, ', ', COALESCE(s.city, 'Unknown City')) as address,
        COALESCE(s.city, 'Unknown City') as city,
        'India' as state,
        '000000' as pincode,
        s.latitude,
        s.longitude,
        s.screen_size_inches as screen_size_width,
        s.screen_size_inches as screen_size_height,
        CASE WHEN s.resolution = '1080p' THEN 1920 WHEN s.resolution = '4K' THEN 3840 ELSE 1280 END as resolution_width,
        CASE WHEN s.resolution = '1080p' THEN 1080 WHEN s.resolution = '4K' THEN 2160 ELSE 720 END as resolution_height,
        (5000 + (RANDOM() * 20000))::INT as daily_footfall,
        (2000 + (RANDOM() * 8000))::INT as vehicle_count,
        s.peak_viewing_hours as peak_hours,
        'Mixed demographics' as demographics,
        COALESCE(p.hourly_rate / 1, 50) as cost_per_10_seconds,
        (
          SELECT sa.url 
          FROM screen_assets sa 
          WHERE sa.screen_id = s.id AND sa.asset_type = 'photo_day' 
          LIMIT 1
        ) as image_url,
        s.image_urls,
        null as video_url,
        s.is_active,
        s.ads_enabled,
        COALESCE(p.hourly_rate, 500) as hourly_rate,
        COALESCE(p.daily_rate, 3000) as daily_rate,
        COALESCE(p.weekly_rate, 18000) as weekly_rate,
        u.name as owner_name,
        s.created_at,
        s.resolution,
        s.orientation,
        s.viewing_distance,
        s.ad_frequency
      FROM screens s
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true AND s.ads_enabled = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND LOWER(COALESCE(s.city, '')) LIKE LOWER($${paramIndex})`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (screen_type) {
      query += ` AND LOWER(s.device_type) LIKE LOWER($${paramIndex})`;
      params.push(`%${screen_type}%`);
      paramIndex++;
    }

    if (max_budget) {
      query += ` AND COALESCE(p.daily_rate, 3000) <= $${paramIndex}`;
      params.push(parseFloat(max_budget as string));
      paramIndex++;
    }

    query += ` ORDER BY 
      CASE 
        WHEN s.city IS NOT NULL AND s.city != '' THEN 1 
        ELSE 2 
      END,
      s.city, 
      COALESCE(p.daily_rate, 3000) DESC, 
      s.created_at DESC 
      LIMIT $${paramIndex}`;
    params.push(parseInt(limit as string));

    console.log(`🔍 Searching screens for ads manager:`, {
      city,
      screen_type,
      max_budget,
      limit,
    });

    const result = await pool.query(query, params);

    console.log(
      `✅ Found ${result.rows.length} available screens for advertising`
    );

    // Format results to include pricing information
    const formattedResults = result.rows.map((row) => ({
      ...row,
      pricing: {
        hourly: row.hourly_rate || 500,
        daily: row.daily_rate || 3000,
        weekly: row.weekly_rate || 18000,
        cost_per_10_seconds: Math.ceil((row.hourly_rate || 500) / 360), // Convert hourly to 10-second slots
      },
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: result.rows.length,
      filters: { city, state, screen_type, min_footfall, max_budget },
      message: `Found ${result.rows.length} screens available for advertising`,
    });
  } catch (error) {
    console.error("Error fetching screens for ads manager:", error);
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
    const { city, location, screen_type, min_size, max_price } = req.query;

    let query = `
      SELECT
        s.id,
        s.screen_name as name,
        'Premium advertising display' as description,
        s.device_type as screen_type,
        s.location_in_venue as location_name,
        CONCAT(s.location_in_venue, ', ', COALESCE(s.city, 'Unknown City')) as address,
        COALESCE(s.city, 'Unknown City') as city,
        'India' as state,
        '000000' as pincode,
        s.latitude,
        s.longitude,
        s.screen_size_inches as screen_size_width,
        s.screen_size_inches as screen_size_height,
        CASE WHEN s.resolution = '1080p' THEN 1920 WHEN s.resolution = '4K' THEN 3840 ELSE 1280 END as resolution_width,
        CASE WHEN s.resolution = '1080p' THEN 1080 WHEN s.resolution = '4K' THEN 2160 ELSE 720 END as resolution_height,
        (5000 + (RANDOM() * 20000))::INT as daily_footfall,
        (2000 + (RANDOM() * 8000))::INT as vehicle_count,
        s.peak_viewing_hours as peak_hours,
        'Mixed demographics' as demographics,
        COALESCE(p.hourly_rate / 1, 50) as cost_per_10_seconds,
        (
          SELECT sa.url 
          FROM screen_assets sa 
          WHERE sa.screen_id = s.id AND sa.asset_type = 'photo_day' 
          LIMIT 1
        ) as image_url,
        s.image_urls,
        null as video_url,
        s.is_active,
        s.ads_enabled,
        COALESCE(p.hourly_rate, 500) as hourly_rate,
        COALESCE(p.daily_rate, 3000) as daily_rate,
        COALESCE(p.weekly_rate, 18000) as weekly_rate,
        u.name as owner_name,
        s.created_at,
        s.resolution,
        s.orientation,
        s.viewing_distance,
        s.ad_frequency
      FROM screens s
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE s.is_active = true AND s.ads_enabled = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND (
        LOWER(COALESCE(s.city, '')) LIKE LOWER($${paramIndex}) OR 
        LOWER(s.location_in_venue) LIKE LOWER($${paramIndex})
      )`;
      params.push(`%${city}%`);
      paramIndex++;
    }

    if (location) {
      query += ` AND LOWER(s.location_in_venue) LIKE LOWER($${paramIndex})`;
      params.push(`%${location}%`);
      paramIndex++;
    }

    if (screen_type) {
      query += ` AND LOWER(s.device_type) LIKE LOWER($${paramIndex})`;
      params.push(`%${screen_type}%`);
      paramIndex++;
    }

    if (min_size) {
      query += ` AND COALESCE(s.screen_size_inches, 0) >= $${paramIndex}`;
      params.push(parseFloat(min_size as string));
      paramIndex++;
    }

    if (max_price) {
      query += ` AND COALESCE(p.daily_rate, 3000) <= $${paramIndex}`;
      params.push(parseFloat(max_price as string));
      paramIndex++;
    }

    query += ` ORDER BY 
      CASE 
        WHEN s.city IS NOT NULL AND s.city != '' THEN 1 
        ELSE 2 
      END,
      s.city, 
      COALESCE(p.daily_rate, 3000) DESC, 
      s.created_at DESC 
      LIMIT 50`;

    console.log(`🔍 Searching screens with filters:`, {
      city,
      location,
      screen_type,
      min_size,
      max_price,
    });

    const result = await pool.query(query, params);

    console.log(
      `✅ Found ${result.rows.length} screens matching search criteria`
    );

    // Format results to include pricing information
    const formattedResults = result.rows.map((row) => ({
      ...row,
      pricing: {
        hourly: row.hourly_rate || 500,
        daily: row.daily_rate || 3000,
        weekly: row.weekly_rate || 18000,
        cost_per_10_seconds: Math.ceil((row.hourly_rate || 500) / 360),
      },
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: result.rows.length,
      filters: { city, location, screen_type, min_size, max_price },
      message: `Found ${result.rows.length} screens matching your search`,
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
        s.id,
        s.screen_name as name,
        s.location_in_venue as location_name,
        s.city,
        s.latitude,
        s.longitude,
        s.screen_size_inches,
        s.resolution,
        s.orientation,
        s.device_type,
        s.device_model,
        s.ads_enabled,
        s.ad_frequency,
        s.viewing_distance,
        s.typical_viewer_duration,
        s.peak_viewing_hours as peak_hours,
        s.is_active,
        s.created_at,
        s.updated_at,
        p.hourly_rate,
        p.daily_rate,
        p.weekly_rate,
        (
          SELECT sa.url 
          FROM screen_assets sa 
          WHERE sa.screen_id = s.id AND sa.asset_type = 'photo_day' 
          LIMIT 1
        ) as image_url
      FROM screens s
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      WHERE s.id = $1 AND s.is_active = true AND s.ads_enabled = true
    `;

    const result = await pool.query(query, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Screen not found or not available for advertising",
      });
    }

    const screen = result.rows[0];
    const response = {
      ...screen,
      pricing: {
        hourly: screen.hourly_rate || 500,
        daily: screen.daily_rate || 3000,
        weekly: screen.weekly_rate || 18000,
      },
    };

    res.json({
      success: true,
      data: response,
    });
  } catch (error) {
    console.error("Error fetching screen by ID:", error);
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
        s.city,
        'India' as state,
        COUNT(*) as screen_count,
        ROUND(AVG(COALESCE(p.daily_rate, 3000))) as avg_daily_price
      FROM screens s
      LEFT JOIN screen_pricing p ON s.id = p.screen_id
      WHERE s.is_active = true AND s.city IS NOT NULL
      GROUP BY s.city
      ORDER BY screen_count DESC, avg_daily_price ASC
      LIMIT 10
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: result.rows.map((row) => ({
        name: row.city,
        state: row.state,
        count: parseInt(row.screen_count),
        avgPrice: parseInt(row.avg_daily_price) || 3000,
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
