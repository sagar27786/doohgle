const { Client } = require('pg');
require('dotenv').config({ path: '../.env' });

async function createBasicTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
    ssl: { rejectUnauthorized: false }
  });

  try {
    console.log('🔗 Connecting to database...');
    await client.connect();
    console.log('✅ Connected successfully');

    // Create users table
    await client.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE,
        phone VARCHAR(20),
        password_hash VARCHAR(255),
        role VARCHAR(50) DEFAULT 'user',
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Users table created');

    // Create screens table
    await client.query(`
      CREATE TABLE IF NOT EXISTS screens (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        screen_name TEXT NOT NULL,
        location_in_venue TEXT NOT NULL,
        city TEXT,
        latitude DECIMAL(10, 8),
        longitude DECIMAL(11, 8),
        screen_size_inches INTEGER,
        resolution TEXT,
        orientation VARCHAR(20) DEFAULT 'landscape',
        device_type VARCHAR(50) DEFAULT 'smart_tv',
        device_model TEXT,
        width_px INTEGER,
        height_px INTEGER,
        ads_enabled BOOLEAN DEFAULT FALSE,
        ad_frequency INTEGER DEFAULT 0,
        viewing_distance VARCHAR(20) DEFAULT 'close',
        typical_viewer_duration TEXT,
        peak_viewing_hours TEXT[] DEFAULT '{}',
        is_active BOOLEAN DEFAULT TRUE,
        image_url TEXT,
        video_url TEXT,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Screens table created');

    // Create campaigns table
    await client.query(`
      CREATE TABLE IF NOT EXISTS campaigns (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        status VARCHAR(20) DEFAULT 'draft',
        budget DECIMAL(10, 2),
        start_date TIMESTAMP WITH TIME ZONE,
        end_date TIMESTAMP WITH TIME ZONE,
        created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log('✅ Campaigns table created');

    // Insert sample user
    await client.query(`
      INSERT INTO users (name, email, phone, role) 
      VALUES ('Admin User', 'admin@doohgle.com', '+91 9876543210', 'admin')
      ON CONFLICT (email) DO NOTHING;
    `);
    console.log('✅ Sample user created');

    // Insert sample screens
    await client.query(`
      INSERT INTO screens (user_id, screen_name, location_in_venue, city, latitude, longitude, screen_size_inches, resolution, ads_enabled, is_active, image_url) 
      VALUES 
        (1, 'Mall Center Screen', 'Food Court Area', 'Mumbai', 19.0760, 72.8777, 55, '1920x1080', true, true, '/assets/screen1.png'),
        (1, 'Metro Station Display', 'Platform 1', 'Delhi', 28.7041, 77.1025, 42, '1366x768', true, true, '/assets/screen2.png'),
        (1, 'Shopping Complex LED', 'Main Entrance', 'Bangalore', 12.9716, 77.5946, 65, '1920x1080', true, true, '/assets/screen3.png')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Sample screens created');

    // Insert sample campaigns
    await client.query(`
      INSERT INTO campaigns (user_id, name, description, status, budget, start_date, end_date) 
      VALUES 
        (1, 'Summer Fashion Collection', 'Trendy fashion campaign for summer season', 'active', 5000.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '30 days'),
        (1, 'Tech Product Launch', 'New product launch campaign', 'active', 7500.00, CURRENT_TIMESTAMP, CURRENT_TIMESTAMP + INTERVAL '45 days'),
        (1, 'Restaurant Chain Promo', 'Food promotion campaign', 'paused', 3000.00, CURRENT_TIMESTAMP - INTERVAL '5 days', CURRENT_TIMESTAMP + INTERVAL '25 days')
      ON CONFLICT DO NOTHING;
    `);
    console.log('✅ Sample campaigns created');

    await client.end();
    console.log('✅ Database setup completed successfully');

  } catch (err) {
    console.error('❌ Database setup failed:', err.message);
    process.exit(1);
  }
}

createBasicTables();
