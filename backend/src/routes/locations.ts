import express from 'express';
import {
  getUserLocation,
  updateUserLocation,
  getNearbyLocations,
  reverseGeocode,
  getLocationHistory,
  deleteUserLocation
} from '../controllers/locationController';
import { authMiddleware } from '../middleware/auth';

const router = express.Router();

// Get user's current location
router.get('/current', authMiddleware, getUserLocation);

// Update user location
router.post('/update', authMiddleware, updateUserLocation);
router.put('/update', authMiddleware, updateUserLocation);

// Get nearby locations
router.get('/nearby', getNearbyLocations);

// Reverse geocoding - convert coordinates to address
router.get('/reverse-geocode', reverseGeocode);

// Get location history
router.get('/history', authMiddleware, getLocationHistory);

// Delete a location
router.delete('/:locationId', authMiddleware, deleteUserLocation);

// Public endpoint to get all active locations for map visualization
router.get('/public', async (req, res) => {
  try {
    const { Pool } = require('pg');
    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'ads_manager_db',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    });

    const query = `
      SELECT 
        ul.latitude,
        ul.longitude,
        ul.city,
        ul.state,
        ul.country,
        ul.location_type,
        COUNT(*) as user_count
      FROM user_locations ul
      WHERE ul.is_active = TRUE
      GROUP BY ul.latitude, ul.longitude, ul.city, ul.state, ul.country, ul.location_type
      ORDER BY user_count DESC
    `;

    const result = await pool.query(query);

    res.json({
      success: true,
      data: {
        locations: result.rows,
        total: result.rows.length
      }
    });

  } catch (error) {
    console.error('Error fetching public locations:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch locations'
    });
  }
});

// Get location statistics
router.get('/stats', authMiddleware, async (req, res) => {
  try {
    const userId = (req as any).user?.id;
    const { Pool } = require('pg');
    const pool = new Pool({
      user: process.env.DB_USER || 'postgres',
      host: process.env.DB_HOST || 'localhost',
      database: process.env.DB_NAME || 'ads_manager_db',
      password: process.env.DB_PASSWORD || 'password',
      port: process.env.DB_PORT || 5432,
    });

    const statsQuery = `
      SELECT 
        COUNT(*) as total_locations,
        COUNT(CASE WHEN is_active THEN 1 END) as active_locations,
        COUNT(CASE WHEN location_type = 'current' THEN 1 END) as current_locations,
        COUNT(CASE WHEN location_type = 'home' THEN 1 END) as home_locations,
        COUNT(CASE WHEN location_type = 'work' THEN 1 END) as work_locations,
        AVG(accuracy) as avg_accuracy
      FROM user_locations
      WHERE user_id = $1
    `;

    const historyStatsQuery = `
      SELECT 
        COUNT(*) as total_history_entries,
        COUNT(DISTINCT DATE(created_at)) as unique_days,
        MIN(created_at) as first_location,
        MAX(created_at) as last_location
      FROM location_history
      WHERE user_id = $1
    `;

    const [statsResult, historyResult] = await Promise.all([
      pool.query(statsQuery, [userId]),
      pool.query(historyStatsQuery, [userId])
    ]);

    res.json({
      success: true,
      data: {
        locations: statsResult.rows[0],
        history: historyResult.rows[0]
      }
    });

  } catch (error) {
    console.error('Error fetching location stats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch location statistics'
    });
  }
});

export default router;
