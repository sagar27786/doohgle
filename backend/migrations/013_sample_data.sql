-- Quick Sample Data for Complete Ads Manager

-- Update existing screens with enhanced data
UPDATE screens SET 
    city = CASE 
        WHEN id = 1 THEN 'Delhi'
        WHEN id = 2 THEN 'Mumbai' 
        WHEN id = 3 THEN 'Bangalore'
        WHEN id = 4 THEN 'Chennai'
        ELSE 'Delhi'
    END,
    latitude = CASE 
        WHEN id = 1 THEN 28.6139
        WHEN id = 2 THEN 19.0760
        WHEN id = 3 THEN 12.9716
        WHEN id = 4 THEN 13.0827
        ELSE 28.6139
    END,
    longitude = CASE 
        WHEN id = 1 THEN 77.2090
        WHEN id = 2 THEN 72.8777
        WHEN id = 3 THEN 77.5946
        WHEN id = 4 THEN 80.2707
        ELSE 77.2090
    END,
    width_ft = 20,
    height_ft = 10,
    resolution = '1080p',
    price_per_day = 3000 + (RANDOM() * 2000)::INTEGER,
    price_per_hour = (price_per_day / 24.0)::DECIMAL(10,2),
    price_per_week = (price_per_day * 6.5)::DECIMAL(10,2),
    traffic_estimate = 10000 + (RANDOM() * 50000)::INTEGER,
    daily_footfall = 5000 + (RANDOM() * 20000)::INTEGER,
    vehicle_count = 2000 + (RANDOM() * 8000)::INTEGER,
    is_active = true
WHERE id <= 10;

-- Insert screen media
INSERT INTO screen_media (screen_id, url, type, is_primary) VALUES
(1, 'https://example.com/screen1.jpg', 'image', true),
(1, 'https://example.com/screen1.mp4', 'video', false),
(2, 'https://example.com/screen2.jpg', 'image', true),
(2, 'https://example.com/screen2.mp4', 'video', false),
(3, 'https://example.com/screen3.jpg', 'image', true),
(4, 'https://example.com/screen4.jpg', 'image', true),
(5, 'https://example.com/screen5.jpg', 'image', true)
ON CONFLICT DO NOTHING;

-- Insert screen availability (next 30 days)
INSERT INTO screen_availability (screen_id, date, time_slot, is_available)
SELECT 
    s.id,
    d.date,
    ts.slot,
    CASE WHEN RANDOM() < 0.8 THEN true ELSE false END
FROM screens s
CROSS JOIN generate_series(CURRENT_DATE, CURRENT_DATE + 30, '1 day'::interval) d(date)
CROSS JOIN (VALUES 
    ('09:00-10:00'),('10:00-11:00'),('11:00-12:00'),('12:00-13:00'),
    ('13:00-14:00'),('14:00-15:00'),('15:00-16:00'),('16:00-17:00'),
    ('17:00-18:00'),('18:00-19:00'),('19:00-20:00'),('20:00-21:00')
) ts(slot)
WHERE s.id <= 5
ON CONFLICT DO NOTHING;

-- Update campaigns with budget
UPDATE campaigns SET 
    budget = 50000 + (RANDOM() * 100000)::INTEGER,
    target_audience = 'Young professionals, age 25-40',
    status = CASE 
        WHEN RANDOM() < 0.5 THEN 'active'
        ELSE 'completed'
    END
WHERE id <= 5;

-- Insert sample creatives
INSERT INTO creatives (campaign_id, file_url, file_type, file_size, duration, resolution) VALUES
(1, 'https://example.com/creative1.mp4', 'video', 2048000, 30, '1920x1080'),
(1, 'https://example.com/creative1.jpg', 'image', 512000, 15, '1920x1080'),
(2, 'https://example.com/creative2.mp4', 'video', 3072000, 25, '1920x1080')
ON CONFLICT DO NOTHING;

-- Insert sample payments
INSERT INTO payments (campaign_id, user_id, amount, payment_method, transaction_id, status) VALUES
(1, 1, 45000, 'upi', 'TXN123456', 'completed'),
(2, 1, 62000, 'card', 'TXN123457', 'completed')
ON CONFLICT DO NOTHING;

-- Insert analytics data
INSERT INTO analytics (screen_id, campaign_id, date, impressions, clicks, plays, cost)
SELECT 
    cs.screen_id,
    cs.campaign_id,
    d.date,
    (500 + RANDOM() * 2000)::INTEGER,
    (25 + RANDOM() * 100)::INTEGER,
    (400 + RANDOM() * 1500)::INTEGER,
    (100 + RANDOM() * 300)::DECIMAL(10,2)
FROM campaign_screens cs
CROSS JOIN generate_series(CURRENT_DATE - 30, CURRENT_DATE, '1 day'::interval) d(date)
WHERE cs.campaign_id <= 2
ON CONFLICT DO NOTHING;

-- Insert proof of play
INSERT INTO proof_of_play (screen_id, campaign_id, creative_id, play_time, proof_url, proof_type, duration)
SELECT 
    cs.screen_id,
    cs.campaign_id,
    cr.id,
    NOW() - (RANDOM() * interval '7 days'),
    'https://example.com/proof/' || cs.screen_id || '_' || cs.campaign_id || '.jpg',
    'photo',
    (20 + RANDOM() * 40)::INTEGER
FROM campaign_screens cs
JOIN creatives cr ON cs.campaign_id = cr.campaign_id
WHERE cs.campaign_id <= 2 AND RANDOM() < 0.3;
