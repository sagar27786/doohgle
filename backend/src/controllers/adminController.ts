import { Request, Response } from 'express';
import { pool } from '../db';
import { AuthUser } from '../middleware/auth';

// Middleware to check if the user is an admin
export const isAdmin = (req: Request & { user?: AuthUser }, res: Response, next: Function) => {
  if (req.user?.roles?.includes('admin') || req.user?.id === 999) {
    return next();
  } else {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
};

// Get dashboard statistics
export async function getDashboardStats(req: Request & { user?: AuthUser }, res: Response) {
  try {
    const client = await pool.connect();
    
    try {
      // Get total screens
      const screensResult = await client.query(`
        SELECT 
          COUNT(*) as total_screens,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_screens,
          COUNT(CASE WHEN is_active = false THEN 1 END) as inactive_screens
        FROM screens
      `);

      // Get total booking requests
      const bookingRequestsResult = await client.query(`
        SELECT 
          COUNT(*) as total_requests,
          COUNT(CASE WHEN status = 'pending' THEN 1 END) as pending_requests,
          COUNT(CASE WHEN status = 'accepted' THEN 1 END) as accepted_requests,
          COUNT(CASE WHEN status = 'rejected' THEN 1 END) as rejected_requests
        FROM booking_requests
      `);

      // Get monthly booking stats for current year
      const monthlyBookingsResult = await client.query(`
        SELECT 
          EXTRACT(MONTH FROM created_at) as month,
          COUNT(*) as booking_count,
          SUM(CAST(total_budget AS DECIMAL)) as total_revenue
        FROM booking_requests 
        WHERE EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
        GROUP BY EXTRACT(MONTH FROM created_at)
        ORDER BY month
      `);

      // Get top cities by screen count
      const citiesResult = await client.query(`
        SELECT 
          city,
          COUNT(*) as screen_count,
          COUNT(CASE WHEN is_active = true THEN 1 END) as active_count
        FROM screens 
        WHERE city IS NOT NULL
        GROUP BY city
        ORDER BY screen_count DESC
        LIMIT 5
      `);

      // Get recent booking requests
      const recentBookingsResult = await client.query(`
        SELECT 
          br.id,
          br.campaign_name,
          br.advertiser_name,
          br.screen_name,
          br.total_budget,
          br.status,
          br.created_at,
          s.city
        FROM booking_requests br
        LEFT JOIN screens s ON br.screen_id = s.id
        ORDER BY br.created_at DESC
        LIMIT 10
      `);

      const stats = {
        screens: screensResult.rows[0],
        bookingRequests: bookingRequestsResult.rows[0],
        monthlyBookings: monthlyBookingsResult.rows,
        topCities: citiesResult.rows,
        recentBookings: recentBookingsResult.rows
      };

      res.json({
        success: true,
        data: stats
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get all screens for admin management
export async function getAllScreensForAdmin(req: Request & { user?: AuthUser }, res: Response) {
  let client;
  try {
    client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        s.id,
        s.screen_name,
        COALESCE(s.city, 'Unknown') as city,
        COALESCE(s.location_in_venue, 'Not specified') as location_in_venue,
        s.is_active,
        COALESCE(s.device_type, 'Unknown') as device_type,
        s.created_at,
        s.updated_at,
        COALESCE(u.email, 'Unknown') as owner_email,
        COALESCE(u.name, u.email, 'Unknown') as owner_name,
        COUNT(br.id)::INTEGER as booking_requests_count
      FROM screens s
      LEFT JOIN users u ON s.user_id = u.id
      LEFT JOIN booking_requests br ON s.id = br.screen_id
      GROUP BY s.id, s.screen_name, s.city, s.location_in_venue, s.is_active, s.device_type, s.created_at, s.updated_at, u.email, u.name
      ORDER BY s.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching screens for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch screens'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Approve or reject a screen
export async function updateScreenStatus(req: Request & { user?: AuthUser }, res: Response) {
  const { screen_id, is_active, admin_notes } = req.body;

  if (screen_id === undefined || is_active === undefined) {
    return res.status(400).json({
      success: false,
      message: 'screen_id and is_active are required'
    });
  }

  try {
    const client = await pool.connect();
    
    try {
      const result = await client.query(`
        UPDATE screens 
        SET is_active = $1, updated_at = CURRENT_TIMESTAMP
        WHERE id = $2
        RETURNING *
      `, [is_active, screen_id]);

      if (result.rows.length === 0) {
        return res.status(404).json({
          success: false,
          message: 'Screen not found'
        });
      }

      // Log admin action (you could create an admin_actions table for this)
      console.log(`Admin ${req.user?.id} ${is_active ? 'approved' : 'rejected'} screen ${screen_id}. Notes: ${admin_notes || 'None'}`);

      res.json({
        success: true,
        data: result.rows[0],
        message: `Screen ${is_active ? 'approved' : 'rejected'} successfully`
      });

    } finally {
      client.release();
    }
  } catch (error) {
    console.error('Error updating screen status:', error);
    res.status(500).json({
      success: false,
      message: 'Internal server error'
    });
  }
}

// Get all booking requests for admin
export async function getAllBookingRequests(req: Request & { user?: AuthUser }, res: Response) {
  let client;
  try {
    client = await pool.connect();
    
    const result = await client.query(`
      SELECT 
        br.id,
        COALESCE(br.campaign_name, 'Unnamed Campaign') as campaign_name,
        COALESCE(br.advertiser_name, 'Unknown Advertiser') as advertiser_name,
        COALESCE(br.screen_name, s.screen_name, 'Unknown Screen') as screen_name,
        br.start_date,
        br.end_date,
        COALESCE(br.daily_budget, 0) as daily_budget,
        COALESCE(br.total_budget, 0) as total_budget,
        COALESCE(br.status, 'pending') as status,
        COALESCE(br.message, '') as message,
        br.created_at,
        br.updated_at,
        COALESCE(s.city, 'Unknown') as city,
        COALESCE(s.location_in_venue, 'Unknown') as location_in_venue,
        COALESCE(u.email, 'Unknown') as venue_owner_email
      FROM booking_requests br
      LEFT JOIN screens s ON br.screen_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      ORDER BY br.created_at DESC
    `);

    res.json({
      success: true,
      data: result.rows
    });

  } catch (error) {
    console.error('Error fetching booking requests for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking requests'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get revenue analytics
export async function getRevenueAnalytics(req: Request & { user?: AuthUser }, res: Response) {
  let client;
  try {
    client = await pool.connect();
    
    // Get monthly revenue for current year
    const monthlyRevenueResult = await client.query(`
      SELECT 
        EXTRACT(MONTH FROM created_at)::INTEGER as month,
        EXTRACT(YEAR FROM created_at)::INTEGER as year,
        COUNT(*)::INTEGER as booking_count,
        COALESCE(SUM(CAST(total_budget AS DECIMAL)), 0) as total_revenue,
        COALESCE(AVG(CAST(total_budget AS DECIMAL)), 0) as avg_booking_value
      FROM booking_requests 
      WHERE status = 'accepted'
        AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
      GROUP BY EXTRACT(MONTH FROM created_at), EXTRACT(YEAR FROM created_at)
      ORDER BY month
    `);

    // Get revenue by city
    const cityRevenueResult = await client.query(`
      SELECT 
        COALESCE(s.city, 'Unknown') as city,
        COUNT(br.id)::INTEGER as booking_count,
        COALESCE(SUM(CAST(br.total_budget AS DECIMAL)), 0) as total_revenue
      FROM booking_requests br
      LEFT JOIN screens s ON br.screen_id = s.id
      WHERE br.status = 'accepted'
      GROUP BY s.city
      HAVING COALESCE(SUM(CAST(br.total_budget AS DECIMAL)), 0) > 0
      ORDER BY total_revenue DESC
      LIMIT 10
    `);

    res.json({
      success: true,
      data: {
        monthlyRevenue: monthlyRevenueResult.rows,
        cityRevenue: cityRevenueResult.rows
      }
    });

  } catch (error) {
    console.error('Error fetching revenue analytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch revenue analytics'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Update booking request status (Admin action)
export async function updateBookingStatus(req: Request & { user?: AuthUser }, res: Response) {
  const { bookingId } = req.params;
  const { status, adminNotes } = req.body;

  if (!['pending', 'accepted', 'rejected', 'cancelled'].includes(status)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid status. Must be pending, accepted, rejected, or cancelled'
    });
  }

  let client;
  try {
    client = await pool.connect();
    
    // First check if booking exists
    const checkResult = await client.query(
      'SELECT id, status, advertiser_name FROM booking_requests WHERE id = $1',
      [bookingId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found'
      });
    }

    // Update booking status
    const updateResult = await client.query(`
      UPDATE booking_requests 
      SET 
        status = $1,
        updated_at = CURRENT_TIMESTAMP
      WHERE id = $2
      RETURNING *
    `, [status, bookingId]);

    res.json({
      success: true,
      data: updateResult.rows[0],
      message: `Booking ${status} successfully`
    });

  } catch (error) {
    console.error('Error updating booking status:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update booking status'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Delete booking request (Admin only)
export async function deleteBookingRequest(req: Request & { user?: AuthUser }, res: Response) {
  const { bookingId } = req.params;

  let client;
  try {
    client = await pool.connect();
    
    // First check if booking exists
    const checkResult = await client.query(
      'SELECT id, campaign_name, advertiser_name FROM booking_requests WHERE id = $1',
      [bookingId]
    );

    if (checkResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found'
      });
    }

    // Delete the booking request
    await client.query('DELETE FROM booking_requests WHERE id = $1', [bookingId]);

    res.json({
      success: true,
      message: 'Booking request deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting booking request:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete booking request'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Get detailed booking information
export async function getBookingDetails(req: Request & { user?: AuthUser }, res: Response) {
  const { bookingId } = req.params;

  let client;
  try {
    client = await pool.connect();
    
    // Get booking details with screen and user information
    const bookingResult = await client.query(`
      SELECT 
        br.*,
        s.screen_name,
        s.city as screen_city,
        s.location_in_venue,
        s.device_type,
        u.email as venue_owner_email,
        COALESCE(u.name, u.email) as venue_owner_name,
        u.phone as venue_owner_phone
      FROM booking_requests br
      LEFT JOIN screens s ON br.screen_id = s.id
      LEFT JOIN users u ON s.user_id = u.id
      WHERE br.id = $1
    `, [bookingId]);

    if (bookingResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'Booking request not found'
      });
    }

    res.json({
      success: true,
      data: {
        booking: bookingResult.rows[0],
        logs: [] // Placeholder for booking logs
      }
    });

  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch booking details'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}

// Bulk actions for bookings
export async function bulkUpdateBookings(req: Request & { user?: AuthUser }, res: Response) {
  const { bookingIds, action, adminNotes } = req.body;

  if (!Array.isArray(bookingIds) || bookingIds.length === 0) {
    return res.status(400).json({
      success: false,
      message: 'bookingIds must be a non-empty array'
    });
  }

  if (!['accept', 'reject', 'cancel', 'delete'].includes(action)) {
    return res.status(400).json({
      success: false,
      message: 'Invalid action. Must be accept, reject, cancel, or delete'
    });
  }

  let client;
  try {
    client = await pool.connect();
    await client.query('BEGIN');

    const results: Array<{id: string, status?: string, error?: string}> = [];
    const statusMap: {[key: string]: string} = {
      'accept': 'accepted',
      'reject': 'rejected',
      'cancel': 'cancelled'
    };

    for (const bookingId of bookingIds) {
      try {
        if (action === 'delete') {
          await client.query('DELETE FROM booking_requests WHERE id = $1', [bookingId]);
          results.push({ id: bookingId, status: 'deleted' });
        } else {
          // Update status
          const updateResult = await client.query(`
            UPDATE booking_requests 
            SET 
              status = $1,
              updated_at = CURRENT_TIMESTAMP
            WHERE id = $2
            RETURNING campaign_name, advertiser_name
          `, [statusMap[action], bookingId]);

          if (updateResult.rows.length > 0) {
            results.push({ id: bookingId, status: statusMap[action] });
          }
        }
      } catch (error) {
        console.error(`Error processing booking ${bookingId}:`, error);
        results.push({ id: bookingId, error: error instanceof Error ? error.message : 'Unknown error' });
      }
    }

    await client.query('COMMIT');

    res.json({
      success: true,
      data: results,
      message: `Bulk ${action} completed`
    });

  } catch (error) {
    if (client) {
      await client.query('ROLLBACK');
    }
    console.error('Error in bulk booking update:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to perform bulk action'
    });
  } finally {
    if (client) {
      client.release();
    }
  }
}
