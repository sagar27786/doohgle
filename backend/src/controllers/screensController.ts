import { Request, Response } from "express";
import { pool } from "../db";
import { AuthUser } from "../middleware/auth";
import { generatePresignedUrl } from "../config/s3Config";

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
      `SELECT s.*
       FROM screens s
       WHERE s.user_id = $1
       ORDER BY s.created_at DESC`,
      [userId]
    );

    const screensWithAssets = await Promise.all(
      result.rows.map(async (row) => {
        const assets = await buildAssetsFromScreenRow(row);
        return { ...row, assets };
      })
    );

    return res.json({ screens: screensWithAssets });
  } catch (err) {
    return res.status(500).json({ message: "Server error", error: err });
  }
}

// ==================== ADS MANAGER FUNCTIONS (EXTENDING EXISTING) ====================

// Get all screens for ads manager with filters
export async function getAllScreens(
  req: Request & { user?: AuthUser }, 
  res: Response
) {
  try {
    const {
      city,
      state,
      screen_type,
      min_footfall,
      max_budget,
      limit = "20",
    } = req.query;

    const userId = req.user?.id; // Optional user context for favorites

    let query = `
      SELECT
        s.id,
        s.user_id,
        s.screen_name as name,
        'Premium advertising display' as description,
        'LED Billboard' as screen_type,
        s.location_in_venue as location_name,
        CONCAT(s.location_in_venue, ', ', s.city) as address,
        s.city,
        'India' as state,
        '000000' as pincode,
        s.latitude,
        s.longitude,
        s.screen_size_inches as screen_size_width,
        s.screen_size_inches as screen_size_height,
        CASE WHEN s.resolution = '1920x1080' THEN 1920 WHEN s.resolution = '4K' THEN 3840 ELSE 1280 END as resolution_width,
        CASE WHEN s.resolution = '1920x1080' THEN 1080 WHEN s.resolution = '4K' THEN 2160 ELSE 720 END as resolution_height,
        10000 as daily_footfall,
        5000 as vehicle_count,
        s.peak_viewing_hours as peak_hours,
        'Mixed demographics' as demographics,
        25.00 as cost_per_10_seconds,
        s.day_photo_url as image_url,
        s.video_url,
        s.is_active,
        500.00 as hourly_rate,
        4000.00 as daily_rate,
        25000.00 as weekly_rate,
        s.day_photo_url,
        s.night_photo_url,
        CASE WHEN fs.id IS NOT NULL THEN true ELSE false END as is_favorite
      FROM screens s
      LEFT JOIN favorite_screens fs ON s.id = fs.screen_id AND fs.user_id = $1
      WHERE s.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    // Always add userId as first parameter (null if not logged in)
    params.push(userId || null);

    if (city) {
      query += ` AND LOWER(s.city) LIKE LOWER($${++paramIndex})`;
      params.push(`%${city}%`);
    }

    if (screen_type) {
      query += ` AND LOWER(s.device_type) LIKE LOWER($${++paramIndex})`;
      params.push(`%${screen_type}%`);
    }

    if (max_budget) {
      query += ` AND 4000.00 <= $${++paramIndex}`;
      params.push(parseFloat(max_budget as string));
    }

    query += ` ORDER BY ${userId ? 'is_favorite DESC,' : ''} s.city, s.screen_size_inches DESC, s.created_at DESC LIMIT $${++paramIndex}`;
    params.push(parseInt(limit as string));

    const result = await pool.query(query, params);

    // Process URLs for each screen and format results
    const formattedResults = await Promise.all(
      result.rows.map(async (row) => ({
        ...row,
        day_photo_url: await getRenderableUrl(row.day_photo_url),
        night_photo_url: await getRenderableUrl(row.night_photo_url),
        image_url: await getRenderableUrl(row.day_photo_url), // fallback
        video_url: await getRenderableUrl(row.video_url),
        pricing: {
          hourly: row.hourly_rate || 0,
          daily: row.daily_rate || 0,
          weekly: row.weekly_rate || 0,
          cost_per_10_seconds: row.cost_per_10_seconds || 50,
        },
      }))
    );

    res.json({
      success: true,
      data: formattedResults,
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
    const { city, location, screen_type, min_size, max_price } = req.query;

    let query = `
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
      WHERE s.is_active = true
    `;

    const params: any[] = [];
    let paramIndex = 1;

    if (city) {
      query += ` AND LOWER(s.city) LIKE LOWER($${paramIndex})`;
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
      query += ` AND s.screen_size_inches >= $${paramIndex}`;
      params.push(parseInt(min_size as string));
      paramIndex++;
    }

    if (max_price) {
      query += ` AND p.daily_rate <= $${paramIndex}`;
      params.push(parseFloat(max_price as string));
      paramIndex++;
    }

    query += " ORDER BY s.city, s.created_at DESC LIMIT 50";

    const result = await pool.query(query, params);

    // Format the response to include pricing and other details
    const formattedResults = result.rows.map((row) => ({
      id: row.id,
      name: row.name,
      location_name: row.location_name,
      city: row.city,
      latitude: row.latitude,
      longitude: row.longitude,
      screen_size_inches: row.screen_size_inches,
      resolution: row.resolution,
      orientation: row.orientation,
      device_type: row.device_type,
      device_model: row.device_model,
      ads_enabled: row.ads_enabled,
      ad_frequency: row.ad_frequency,
      viewing_distance: row.viewing_distance,
      typical_viewer_duration: row.typical_viewer_duration,
      peak_hours: row.peak_hours,
      is_active: row.is_active,
      image_url: row.image_url,
      pricing: {
        hourly: row.hourly_rate || 0,
        daily: row.daily_rate || 0,
        weekly: row.weekly_rate || 0,
      },
    }));

    res.json({
      success: true,
      data: formattedResults,
      total: result.rows.length,
      filters: { city, location, screen_type, min_size, max_price },
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

    const screenQuery = `
      SELECT 
        s.*,
        p.hourly_rate,
        p.daily_rate,
        p.weekly_rate,
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

    const screen = result.rows[0];
    const assets = await buildAssetsFromScreenRow(screen);

    const response = {
      ...screen,
      assets,
      pricing: {
        hourly: screen.hourly_rate || 0,
        daily: screen.daily_rate || 0,
        weekly: screen.weekly_rate || 0,
      },
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

// Helper: check if a string is an HTTP(S) URL
function isHttpUrl(value?: string | null): boolean {
  if (!value) return false;
  return /^https?:\/\//i.test(value);
}

// Helper: try to extract S3 object key from a known S3 URL
function extractS3KeyFromUrl(url: string): string | null {
  try {
    const u = new URL(url);
    const host = u.host.toLowerCase();

    if (!host.includes("amazonaws.com")) {
      // Not an S3 URL (could be CDN or public URL) -> we won't try to presign
      return null;
    }

    // Path always starts with "/"
    const pathname = decodeURIComponent(u.pathname.replace(/^\/+/, ""));

    // Handle path-style: https://s3.amazonaws.com/bucket/key or https://s3.<region>.amazonaws.com/bucket/key
    if (host === "s3.amazonaws.com" || host.startsWith("s3.")) {
      const segments = pathname.split("/");
      if (segments.length >= 2) {
        // first segment is bucket, rest is key
        return segments.slice(1).join("/");
      }
      return null;
    }

    // Handle virtual-hosted-style: https://bucket.s3.amazonaws.com/key or https://bucket.s3.<region>.amazonaws.com/key
    // In this case, pathname is the key
    return pathname || null;
  } catch {
    return null;
  }
}

// Given a DB field (which can be a key or URL), return a presigned URL if private, or the original if already public
async function getRenderableUrl(
  urlOrKey?: string | null
): Promise<string | null> {
  if (!urlOrKey) return null;

  // If it's a URL, return as-is for now (temporary fix for S3 permissions)
  if (isHttpUrl(urlOrKey)) {
    return urlOrKey;
  }

  // For S3 keys, construct public URL instead of presigned (temporary fix)
  const bucketName = process.env.S3_BUCKET_NAME || "doohgle";
  const region = process.env.AWS_REGION || "ap-southeast-2";
  return `https://${bucketName}.s3.${region}.amazonaws.com/${urlOrKey}`;
}

// Build assets array from the three columns in the screens table
async function buildAssetsFromScreenRow(screen: any) {
  const assets: {
    asset_type: "photo_day" | "photo_night" | "video";
    url: string;
  }[] = [];

  const dayUrl = await getRenderableUrl(screen.day_photo_url);
  if (dayUrl) assets.push({ asset_type: "photo_day", url: dayUrl });

  const nightUrl = await getRenderableUrl(screen.night_photo_url);
  if (nightUrl) assets.push({ asset_type: "photo_night", url: nightUrl });

  const videoUrl = await getRenderableUrl(screen.video_url);
  if (videoUrl) assets.push({ asset_type: "video", url: videoUrl });

  return assets;
}

// ==================== FAVORITE SCREENS FUNCTIONALITY ====================

/**
 * Toggle favorite status of a screen for the current user
 */
export async function toggleFavoriteScreen(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { screenId } = req.params;
  
  if (!screenId) {
    return res.status(400).json({ message: "Screen ID is required" });
  }

  try {
    // Check if screen exists
    const screenCheck = await pool.query("SELECT id FROM screens WHERE id = $1", [screenId]);
    if (screenCheck.rows.length === 0) {
      return res.status(404).json({ message: "Screen not found" });
    }

    // Check if already favorited
    const existingFavorite = await pool.query(
      "SELECT id FROM favorite_screens WHERE user_id = $1 AND screen_id = $2",
      [userId, screenId]
    );

    if (existingFavorite.rows.length > 0) {
      // Remove from favorites
      await pool.query(
        "DELETE FROM favorite_screens WHERE user_id = $1 AND screen_id = $2",
        [userId, screenId]
      );
      return res.status(200).json({ 
        message: "Screen removed from favorites", 
        is_favorite: false 
      });
    } else {
      // Add to favorites
      await pool.query(
        "INSERT INTO favorite_screens (user_id, screen_id) VALUES ($1, $2)",
        [userId, screenId]
      );
      return res.status(200).json({ 
        message: "Screen added to favorites", 
        is_favorite: true 
      });
    }
  } catch (error) {
    console.error("Error toggling favorite screen:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Get all favorite screens for the current user
 */
export async function getUserFavoriteScreens(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  try {
    const result = await pool.query(`
      SELECT 
        s.*,
        fs.created_at as favorited_at,
        true as is_favorite
      FROM screens s
      INNER JOIN favorite_screens fs ON s.id = fs.screen_id
      WHERE fs.user_id = $1
      ORDER BY fs.created_at DESC
    `, [userId]);

    // Process URLs for each screen
    const screensWithUrls = await Promise.all(
      result.rows.map(async (screen) => ({
        ...screen,
        day_photo_url: await getRenderableUrl(screen.day_photo_url),
        night_photo_url: await getRenderableUrl(screen.night_photo_url),
        video_url: await getRenderableUrl(screen.video_url)
      }))
    );

    return res.status(200).json({
      success: true,
      favorites: screensWithUrls,
      count: screensWithUrls.length
    });
  } catch (error) {
    console.error("Error fetching favorite screens:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

/**
 * Check if screens are favorited by the current user
 */
export async function checkFavoriteStatus(
  req: Request & { user?: AuthUser },
  res: Response
) {
  const userId = req.user?.id;
  if (!userId) {
    return res.status(401).json({ message: "Unauthorized" });
  }

  const { screenIds } = req.body;
  
  if (!screenIds || !Array.isArray(screenIds)) {
    return res.status(400).json({ message: "Screen IDs array is required" });
  }

  try {
    const result = await pool.query(`
      SELECT screen_id, true as is_favorite
      FROM favorite_screens 
      WHERE user_id = $1 AND screen_id = ANY($2)
    `, [userId, screenIds]);

    const favoriteMap: { [key: string]: boolean } = {};
    screenIds.forEach(id => favoriteMap[id] = false);
    result.rows.forEach(row => favoriteMap[row.screen_id] = true);

    return res.status(200).json({
      success: true,
      favorites: favoriteMap
    });
  } catch (error) {
    console.error("Error checking favorite status:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
