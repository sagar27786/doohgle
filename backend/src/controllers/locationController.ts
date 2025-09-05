import { Request, Response } from 'express';
import { Pool } from 'pg';
const { Pool: PgPool } = require('pg');

const pool = new PgPool({
  user: process.env.DB_USER || 'postgres',
  host: process.env.DB_HOST || 'localhost',
  database: process.env.DB_NAME || 'ads_manager_db',
  password: process.env.DB_PASSWORD || 'password',
  port: process.env.DB_PORT || 5432,
});

// Interface for location data
interface LocationData {
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  state?: string;
  country?: string;
  formattedAddress?: string;
  locationSource?: string;
  locationType?: string;
}

interface LocationRequest extends Request {
  user?: { id: number };
  body: LocationData;
}

// Get user's current location
export const getUserLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const query = `
      SELECT 
        id,
        latitude,
        longitude,
        accuracy,
        street_address,
        city,
        state,
        country,
        postal_code,
        formatted_address,
        location_source,
        location_type,
        is_active,
        is_primary,
        created_at,
        last_accessed
      FROM user_locations 
      WHERE user_id = $1 AND is_active = TRUE
      ORDER BY 
        CASE WHEN is_primary THEN 0 ELSE 1 END,
        created_at DESC
    `;

    const result = await pool.query(query, [userId]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'No location found for user'
      });
    }

    // Update last accessed timestamp for primary location
    if (result.rows[0].is_primary) {
      await pool.query(
        'UPDATE user_locations SET last_accessed = CURRENT_TIMESTAMP WHERE id = $1',
        [result.rows[0].id]
      );
    }

    res.json({
      success: true,
      data: {
        locations: result.rows,
        primary: result.rows.find((loc: any) => loc.is_primary) || result.rows[0]
      }
    });

  } catch (error) {
    console.error('Error fetching user location:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
};

// Update or create user location
export const updateUserLocation = async (req: LocationRequest, res: Response) => {
  try {
    const userId = req.user?.id;
    
    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const {
      latitude,
      longitude,
      accuracy,
      city,
      state,
      country = 'India',
      formattedAddress,
      locationSource = 'gps',
      locationType = 'current'
    } = req.body;

    // Validate coordinates
    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    if (latitude < -90 || latitude > 90 || longitude < -180 || longitude > 180) {
      return res.status(400).json({
        success: false,
        message: 'Invalid coordinates'
      });
    }

    const client = await pool.connect();
    
    try {
      await client.query('BEGIN');

      // Check if location already exists for this user
      const existingQuery = `
        SELECT id FROM user_locations 
        WHERE user_id = $1 AND location_type = $2 AND is_active = TRUE
      `;
      
      const existingResult = await client.query(existingQuery, [userId, locationType]);
      
      let locationId;
      
      if (existingResult.rows.length > 0) {
        // Update existing location
        const updateQuery = `
          UPDATE user_locations SET
            latitude = $1,
            longitude = $2,
            accuracy = $3,
            city = $4,
            state = $5,
            country = $6,
            formatted_address = $7,
            location_source = $8,
            updated_at = CURRENT_TIMESTAMP,
            last_accessed = CURRENT_TIMESTAMP
          WHERE id = $9
          RETURNING *
        `;
        
        const updateResult = await client.query(updateQuery, [
          latitude, longitude, accuracy, city, state, country,
          formattedAddress, locationSource, existingResult.rows[0].id
        ]);
        
        locationId = updateResult.rows[0].id;
      } else {
        // Create new location
        const insertQuery = `
          INSERT INTO user_locations (
            user_id, latitude, longitude, accuracy, city, state, 
            country, formatted_address, location_source, location_type,
            is_primary
          ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)
          RETURNING *
        `;
        
        // Set as primary if it's the first location or if it's current type
        const isPrimary = locationType === 'current';
        
        const insertResult = await client.query(insertQuery, [
          userId, latitude, longitude, accuracy, city, state,
          country, formattedAddress, locationSource, locationType, isPrimary
        ]);
        
        locationId = insertResult.rows[0].id;
        
        // If this is set as primary, unset other primary locations
        if (isPrimary) {
          await client.query(
            'UPDATE user_locations SET is_primary = FALSE WHERE user_id = $1 AND id != $2',
            [userId, locationId]
          );
        }
      }

      // Add to location history
      const historyQuery = `
        INSERT INTO location_history (
          user_id, latitude, longitude, accuracy, city, state, 
          country, location_source, session_id, ip_address
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10)
      `;
      
      await client.query(historyQuery, [
        userId, latitude, longitude, accuracy, city, state,
        country, locationSource, (req as any).sessionID || null,
        req.ip || (req.connection as any)?.remoteAddress
      ]);

      await client.query('COMMIT');

      // Fetch the updated location
      const finalQuery = `
        SELECT * FROM user_locations WHERE id = $1
      `;
      const finalResult = await client.query(finalQuery, [locationId]);

      res.json({
        success: true,
        message: 'Location updated successfully',
        data: finalResult.rows[0]
      });

    } catch (error) {
      await client.query('ROLLBACK');
      throw error;
    } finally {
      client.release();
    }

  } catch (error) {
    console.error('Error updating user location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update location'
    });
  }
};

// Get nearby users/locations
export const getNearbyLocations = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { latitude, longitude, radius = 10 } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);
    const rad = parseFloat(radius as string);

    if (isNaN(lat) || isNaN(lon) || isNaN(rad)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid numeric values'
      });
    }

    const query = `
      SELECT * FROM find_nearby_locations($1, $2, $3)
      WHERE user_id != $4 OR $4 IS NULL
    `;

    const result = await pool.query(query, [lat, lon, rad, userId || null]);

    res.json({
      success: true,
      data: {
        locations: result.rows,
        center: { latitude: lat, longitude: lon },
        radius: rad,
        count: result.rows.length
      }
    });

  } catch (error) {
    console.error('Error finding nearby locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to find nearby locations'
    });
  }
};

// Reverse geocoding - get address from coordinates
export const reverseGeocode = async (req: Request, res: Response) => {
  try {
    const { latitude, longitude } = req.query;

    if (!latitude || !longitude) {
      return res.status(400).json({
        success: false,
        message: 'Latitude and longitude are required'
      });
    }

    const lat = parseFloat(latitude as string);
    const lon = parseFloat(longitude as string);

    // Using Nominatim (OpenStreetMap) for reverse geocoding
    const nominatimUrl = `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lon}&addressdetails=1`;
    
    const response = await fetch(nominatimUrl, {
      headers: {
        'User-Agent': 'DOOH-Platform/1.0'
      }
    });

    if (!response.ok) {
      throw new Error('Geocoding service unavailable');
    }

    const data = await response.json();

    if (!data || data.error) {
      return res.status(404).json({
        success: false,
        message: 'Address not found for these coordinates'
      });
    }

    const address = data.address || {};
    const formattedResult = {
      formatted_address: data.display_name || '',
      street_address: `${address.house_number || ''} ${address.road || ''}`.trim(),
      city: address.city || address.town || address.village || address.suburb || '',
      state: address.state || address.province || '',
      country: address.country || '',
      postal_code: address.postcode || '',
      components: {
        house_number: address.house_number || '',
        road: address.road || '',
        neighbourhood: address.neighbourhood || '',
        suburb: address.suburb || '',
        city: address.city || address.town || address.village || '',
        district: address.district || '',
        state: address.state || address.province || '',
        country: address.country || '',
        country_code: address.country_code || '',
        postcode: address.postcode || ''
      }
    };

    res.json({
      success: true,
      data: formattedResult
    });

  } catch (error) {
    console.error('Error in reverse geocoding:', error);
    res.status(500).json({
      success: false,
      message: 'Reverse geocoding failed'
    });
  }
};

// Get location history
export const getLocationHistory = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { limit = 50, offset = 0 } = req.query;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const query = `
      SELECT 
        id,
        latitude,
        longitude,
        accuracy,
        city,
        state,
        country,
        location_source,
        created_at
      FROM location_history 
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT $2 OFFSET $3
    `;

    const countQuery = `
      SELECT COUNT(*) as total 
      FROM location_history 
      WHERE user_id = $1
    `;

    const [result, countResult] = await Promise.all([
      pool.query(query, [userId, limit, offset]),
      pool.query(countQuery, [userId])
    ]);

    res.json({
      success: true,
      data: {
        history: result.rows,
        pagination: {
          total: parseInt(countResult.rows[0].total),
          limit: parseInt(limit as string),
          offset: parseInt(offset as string),
          has_more: parseInt(offset as string) + parseInt(limit as string) < parseInt(countResult.rows[0].total)
        }
      }
    });

  } catch (error) {
    console.error('Error fetching location history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location history'
    });
  }
};

// Delete user location
export const deleteUserLocation = async (req: Request, res: Response) => {
  try {
    const userId = (req as any).user?.id;
    const { locationId } = req.params;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    const query = `
      UPDATE user_locations 
      SET is_active = FALSE, updated_at = CURRENT_TIMESTAMP
      WHERE id = $1 AND user_id = $2
      RETURNING *
    `;

    const result = await pool.query(query, [locationId, userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Location not found'
      });
    }

    res.json({
      success: true,
      message: 'Location deleted successfully',
      data: result.rows[0]
    });

  } catch (error) {
    console.error('Error deleting location:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete location'
    });
  }
};
