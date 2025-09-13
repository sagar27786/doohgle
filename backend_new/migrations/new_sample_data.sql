-- Insert sample screens data
BEGIN;

-- Insert an advertiser user if not exists
INSERT INTO users (email, password_hash, name, phone, role) 
VALUES ('advertiser1@example.com', '$2b$10$hash', 'Advertiser 1', '+919876543212', 'advertiser')
ON CONFLICT (email) DO NOTHING;

-- Get advertiser ID for bookings
DO $$
DECLARE
    advertiser_user_id INTEGER;
BEGIN
    SELECT id INTO advertiser_user_id FROM users WHERE email = 'advertiser1@example.com';
    IF advertiser_user_id IS NULL THEN
        SELECT id INTO advertiser_user_id FROM users WHERE role = 'advertiser' LIMIT 1;
    END IF;
    IF advertiser_user_id IS NULL THEN
        INSERT INTO users (email, password_hash, name, phone, role) 
        VALUES ('temp_advertiser@example.com', '$2b$10$hash', 'Temp Advertiser', '+919999999999', 'advertiser')
        RETURNING id INTO advertiser_user_id;
    END IF;
END $$;

-- Insert sample screens
INSERT INTO screens (
  user_id, screen_name, location_in_venue, city, latitude, longitude,
  screen_size_inches, resolution, orientation, device_type, device_model,
  ads_enabled, ad_frequency, viewing_distance, typical_viewer_duration,
  peak_viewing_hours, is_active
) VALUES
  (1, 'Delhi Mall Screen 1', 'Main Entrance', 'Delhi', 28.6139, 77.2090, 
   55, '1080p', 'landscape', 'smart_tv', 'Samsung QN55Q80A', true, 6, 'medium', 
   '2-3 minutes', ARRAY['09:00', '18:00', '20:00'], true),
   
  (1, 'Mumbai Billboard', 'Highway Facing', 'Mumbai', 19.0760, 72.8777,
   75, '4K', 'landscape', 'led_display', 'LG 75UP8000PUA', true, 8, 'far',
   '10-15 seconds', ARRAY['08:00', '17:00', '19:00'], true),
   
  (2, 'Bangalore Metro Display', 'Platform 2', 'Bangalore', 12.9716, 77.5946,
   42, '1080p', 'portrait', 'digital_signage', 'Dell OptiPlex 7080', true, 4,
   'close', '30-60 seconds', ARRAY['07:00', '08:00', '17:00', '18:00'], true),
   
  (2, 'Chennai Mall Screen', 'Food Court', 'Chennai', 13.0827, 80.2707,
   65, '4K', 'landscape', 'smart_tv', 'Sony X90J', true, 5, 'medium',
   '3-5 minutes', ARRAY['12:00', '19:00', '21:00'], true),
   
  (1, 'Delhi Airport Display', 'Terminal 1 Gate 5', 'Delhi', 28.5562, 77.0999,
   50, '1080p', 'landscape', 'commercial_display', 'Philips 50BDL4550D', true, 10,
   'close', '5-10 minutes', ARRAY['06:00', '10:00', '14:00', '18:00'], true),
   
  (2, 'Mumbai Metro Screen', 'Bandra Station', 'Mumbai', 19.0544, 72.8406,
   32, '720p', 'landscape', 'digital_signage', 'BenQ ST3200', true, 3,
   'close', '1-2 minutes', ARRAY['07:00', '08:00', '17:00', '18:00', '19:00'], true),
   
  (1, 'Bangalore Tech Park', 'Lobby Area', 'Bangalore', 12.9352, 77.6245,
   60, '4K', 'portrait', 'smart_tv', 'LG OLED55C1PUB', true, 4, 'medium',
   '2-3 minutes', ARRAY['09:00', '13:00', '17:00'], true),
   
  (2, 'Chennai Bus Stand', 'Main Waiting Area', 'Chennai', 13.0678, 80.2370,
   40, '1080p', 'landscape', 'commercial_display', 'Samsung PM55F-BC', true, 8,
   'medium', '5-15 minutes', ARRAY['06:00', '12:00', '18:00'], true);

-- Insert screen pricing (get actual screen IDs after insertion)
INSERT INTO screen_pricing (screen_id, hourly_rate, daily_rate, weekly_rate, currency)
SELECT 
  id,
  CASE 
    WHEN screen_name LIKE '%Mall%' THEN 125.00
    WHEN screen_name LIKE '%Billboard%' THEN 208.33
    WHEN screen_name LIKE '%Metro%' THEN 83.33
    WHEN screen_name LIKE '%Airport%' THEN 150.00
    ELSE 100.00
  END as hourly_rate,
  CASE 
    WHEN screen_name LIKE '%Mall%' THEN 3000.00
    WHEN screen_name LIKE '%Billboard%' THEN 5000.00
    WHEN screen_name LIKE '%Metro%' THEN 2000.00
    WHEN screen_name LIKE '%Airport%' THEN 3600.00
    ELSE 2400.00
  END as daily_rate,
  CASE 
    WHEN screen_name LIKE '%Mall%' THEN 19500.00
    WHEN screen_name LIKE '%Billboard%' THEN 32500.00
    WHEN screen_name LIKE '%Metro%' THEN 13000.00
    WHEN screen_name LIKE '%Airport%' THEN 23400.00
    ELSE 15600.00
  END as weekly_rate,
  'INR' as currency
FROM screens;

-- Insert sample screen assets (photos/videos) using actual screen IDs
INSERT INTO screen_assets (screen_id, asset_type, url)
SELECT 
  id,
  'photo_day',
  CASE 
    WHEN id % 8 = 1 THEN 'https://images.unsplash.com/photo-1560472354-b33ff0c44a43?w=800'
    WHEN id % 8 = 2 THEN 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=800'
    WHEN id % 8 = 3 THEN 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=800'
    WHEN id % 8 = 4 THEN 'https://images.unsplash.com/photo-1555636222-cae831e670b3?w=800'
    WHEN id % 8 = 5 THEN 'https://images.unsplash.com/photo-1540979388789-6cee28a1cdc9?w=800'
    WHEN id % 8 = 6 THEN 'https://images.unsplash.com/photo-1494515843206-f3117d3f51b7?w=800'
    WHEN id % 8 = 7 THEN 'https://images.unsplash.com/photo-1497366216548-37526070297c?w=800'
    ELSE 'https://images.unsplash.com/photo-1517154421773-0529f29ea451?w=800'
  END
FROM screens;

-- Insert screen availability for next 30 days
INSERT INTO screen_availability (screen_id, date, is_available)
SELECT 
  s.id,
  (CURRENT_DATE + generate_series(0, 29))::date,
  CASE WHEN random() < 0.8 THEN true ELSE false END  -- 80% availability
FROM screens s;

-- Insert some sample bookings using actual IDs
INSERT INTO bookings (screen_id, advertiser_id, start_ts, end_ts, status, notes)
SELECT 
  s.id,
  u.id,
  CURRENT_TIMESTAMP + INTERVAL '1 day' * (s.id % 3),
  CURRENT_TIMESTAMP + INTERVAL '1 day' * (s.id % 3) + INTERVAL '6 hours',
  CASE WHEN s.id % 2 = 0 THEN 'accepted'::booking_status ELSE 'pending'::booking_status END,
  'Sample campaign for ' || s.screen_name
FROM screens s
CROSS JOIN (SELECT id FROM users WHERE email LIKE '%advertiser%' OR role = 'advertiser' LIMIT 1) u
LIMIT 3;

-- Insert earnings for completed bookings using actual IDs
INSERT INTO earnings (screen_owner_id, booking_id, screen_id, amount, status, period_start, period_end)
SELECT 
  s.user_id,
  b.id,
  b.screen_id,
  (EXTRACT(EPOCH FROM (b.end_ts - b.start_ts)) / 3600 * 100)::DECIMAL(10,2), -- $100 per hour
  'processed',
  b.start_ts,
  b.end_ts
FROM bookings b
JOIN screens s ON b.screen_id = s.id
WHERE b.status = 'accepted';

COMMIT;
