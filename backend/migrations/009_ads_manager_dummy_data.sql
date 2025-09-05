-- Insert dummy data for ads manager features

-- Update existing screens with ads manager data
UPDATE screens SET 
    cost_per_10_seconds = 15.00,
    peak_hours = '08:00-11:00,17:00-21:00',
    demographics = 'Young professionals, shoppers'
WHERE name LIKE '%Bandra%' OR name LIKE '%bandra%';

-- Insert additional screens for ads manager demo
INSERT INTO screens (
    owner_id, name, description, screen_type, location_name, address,
    city, state, pincode, latitude, longitude, screen_size_width,
    screen_size_height, resolution_width, resolution_height, daily_footfall,
    vehicle_count, peak_hours, demographics, cost_per_10_seconds, image_url
) VALUES
(2, 'Bandra LED Billboard - Main', 'Prime location LED billboard at Bandra West main road', 'LED_billboard', 'Bandra West', 'Linking Road, Bandra West, Mumbai', 'Mumbai', 'Maharashtra', '400050', 19.05440, 72.82930, 20, 10, 1920, 1080, 50000, 15000, '08:00-11:00,17:00-21:00', 'Young professionals, shoppers', 15.00, 'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=800'),

(2, 'Bandra Mall Screen', 'Digital screen inside Palladium Mall food court', 'mall_screen', 'Palladium Mall', 'High Street Phoenix, Lower Parel, Mumbai', 'Mumbai', 'Maharashtra', '400013', 19.01310, 72.82560, 15, 8, 1920, 1080, 75000, 5000, '12:00-15:00,19:00-22:00', 'Families, young adults', 12.00, 'https://images.unsplash.com/photo-1441986300917-64674bd600d8?w=800'),

(2, 'Andheri Metro Station Screen', 'Digital display at Andheri Metro Station platform', 'metro_display', 'Andheri West', 'Andheri Metro Station, Western Line', 'Mumbai', 'Maharashtra', '400058', 19.11970, 72.84640, 12, 6, 1366, 768, 100000, 8000, '07:00-10:00,17:00-20:00', 'Commuters, office workers', 8.00, 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800'),

(2, 'Connaught Place LED Wall', 'Large LED wall at Central Park, Connaught Place', 'LED_billboard', 'Connaught Place', 'Central Park, Connaught Place, New Delhi', 'Delhi', 'Delhi', '110001', 28.63040, 77.21770, 25, 12, 1920, 1080, 120000, 25000, '09:00-12:00,18:00-22:00', 'Tourists, shoppers, professionals', 25.00, 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df?w=800'),

(2, 'Cyber City Digital Hoarding', 'Premium digital hoarding in Gurgaon Cyber City', 'digital_hoarding', 'Cyber City', 'DLF Cyber City, Phase 2, Gurgaon', 'Gurgaon', 'Haryana', '122002', 28.49490, 77.08640, 18, 10, 1920, 1080, 80000, 20000, '08:00-11:00,17:00-20:00', 'IT professionals, corporate employees', 20.00, 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800'),

(2, 'Bangalore Airport Screen', 'Digital screen at Kempegowda International Airport', 'airport_display', 'Kempegowda Airport', 'Terminal 1, Departure Gate Area', 'Bangalore', 'Karnataka', '560300', 13.19890, 77.70610, 10, 6, 1920, 1080, 60000, 2000, '06:00-10:00,14:00-18:00', 'Travelers, business professionals', 30.00, 'https://images.unsplash.com/photo-1436491865332-7a61a109cc05?w=800')
ON CONFLICT DO NOTHING;

-- Insert screen availability for next 30 days
INSERT INTO screen_availability (screen_id, date, start_time, end_time, is_available)
SELECT
    s.id,
    CURRENT_DATE + INTERVAL '1 day' * generate_series(0, 29) as date,
    '00:00:00'::time,
    '23:59:59'::time,
    true
FROM screens s
WHERE s.id > 0
ON CONFLICT (screen_id, date, start_time, end_time) DO NOTHING;

-- Insert dummy campaigns
INSERT INTO campaigns (
    user_id, name, description, start_date, end_date,
    status, total_budget, spent_amount, payment_status
) VALUES
(1, 'Summer Fashion Campaign', 'Promote summer collection across premium locations',
 CURRENT_DATE - INTERVAL '5 days', CURRENT_DATE + INTERVAL '10 days',
 'active', 45000.00, 28000.00, 'paid'),

(1, 'Tech Product Launch', 'Launch campaign for new smartphone in metro cities',
 CURRENT_DATE + INTERVAL '2 days', CURRENT_DATE + INTERVAL '15 days',
 'draft', 75000.00, 0.00, 'pending')
ON CONFLICT DO NOTHING;

-- Link campaigns with screens
INSERT INTO campaign_screens (campaign_id, screen_id, cost_per_slot, total_slots)
SELECT 
    c.id as campaign_id,
    s.id as screen_id,
    s.cost_per_10_seconds as cost_per_slot,
    CASE 
        WHEN c.id = 1 THEN 1000
        ELSE 800
    END as total_slots
FROM campaigns c
CROSS JOIN screens s
WHERE c.name IN ('Summer Fashion Campaign', 'Tech Product Launch')
AND s.city IN ('Mumbai', 'Delhi')
LIMIT 6
ON CONFLICT (campaign_id, screen_id) DO NOTHING;

-- Insert dummy creatives
INSERT INTO creatives (campaign_id, name, file_type, file_url, duration, width, height, is_approved)
SELECT 
    c.id,
    CASE 
        WHEN c.name = 'Summer Fashion Campaign' THEN 'Summer Collection Video'
        ELSE 'Tech Product Video'
    END as name,
    'video' as file_type,
    '/uploads/creatives/' || 
    CASE 
        WHEN c.name = 'Summer Fashion Campaign' THEN 'summer-video.mp4'
        ELSE 'tech-video.mp4'
    END as file_url,
    30 as duration,
    1920 as width,
    1080 as height,
    true as is_approved
FROM campaigns c
WHERE c.name IN ('Summer Fashion Campaign', 'Tech Product Launch')
ON CONFLICT DO NOTHING;

-- Insert campaign analytics for active campaigns
INSERT INTO campaign_analytics (campaign_id, screen_id, date, impressions, plays, unique_views)
SELECT
    cs.campaign_id,
    cs.screen_id,
    CURRENT_DATE - INTERVAL '1 day' * generate_series(0, 4) as date,
    FLOOR(RANDOM() * 5000 + 1000)::integer as impressions,
    FLOOR(RANDOM() * 100 + 50)::integer as plays,
    FLOOR(RANDOM() * 800 + 200)::integer as unique_views
FROM campaign_screens cs
JOIN campaigns c ON cs.campaign_id = c.id
WHERE c.status = 'active'
ON CONFLICT (campaign_id, screen_id, date) DO NOTHING;

-- Insert proof of play records for active campaigns
INSERT INTO proof_of_play (campaign_id, screen_id, creative_id, play_time, duration, proof_image_url)
SELECT
    cs.campaign_id,
    cs.screen_id,
    cr.id as creative_id,
    CURRENT_TIMESTAMP - INTERVAL '1 hour' * generate_series(1, 12) as play_time,
    30 as duration,
    '/uploads/proof/proof-' || cs.screen_id || '-' || generate_series(1, 12) || '.jpg'
FROM campaign_screens cs
JOIN campaigns c ON cs.campaign_id = c.id
JOIN creatives cr ON cr.campaign_id = c.id
WHERE c.status = 'active'
LIMIT 50;

-- Add wallet balance to existing users for demo
UPDATE users SET wallet_balance = 50000.00 WHERE wallet_balance IS NULL OR wallet_balance = 0;
