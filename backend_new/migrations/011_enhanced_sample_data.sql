-- Enhanced Sample Data for Complete Ads Manager Testing

-- Insert enhanced screen data
UPDATE screens SET 
    traffic_estimate = 50000 + (RANDOM() * 50000)::INTEGER,
    footfall_daily = 10000 + (RANDOM() * 20000)::INTEGER,
    vehicle_count_daily = 5000 + (RANDOM() * 15000)::INTEGER,
    resolution = CASE 
        WHEN RANDOM() < 0.3 THEN '720p'
        WHEN RANDOM() < 0.7 THEN '1080p'
        ELSE '4K'
    END,
    price_per_hour = price_per_day / 24.0
WHERE id IN (SELECT id FROM screens LIMIT 5);

-- Insert screen media files
INSERT INTO screen_media (screen_id, media_url, media_type, is_primary) VALUES
(1, 'https://example.com/screen1-main.jpg', 'image', true),
(1, 'https://example.com/screen1-video.mp4', 'video', false),
(1, 'https://example.com/screen1-angle2.jpg', 'image', false),
(2, 'https://example.com/screen2-main.jpg', 'image', true),
(2, 'https://example.com/screen2-video.mp4', 'video', false),
(3, 'https://example.com/screen3-main.jpg', 'image', true),
(3, 'https://example.com/screen3-video.mp4', 'video', false),
(4, 'https://example.com/screen4-main.jpg', 'image', true),
(5, 'https://example.com/screen5-main.jpg', 'image', true);

-- Insert screen availability for next 30 days
INSERT INTO screen_availability (screen_id, date, time_slot, is_available)
SELECT 
    s.id as screen_id,
    d.date,
    ts.time_slot,
    CASE 
        WHEN RANDOM() < 0.8 THEN true  -- 80% availability
        ELSE false
    END as is_available
FROM screens s
CROSS JOIN (
    SELECT generate_series(CURRENT_DATE, CURRENT_DATE + INTERVAL '30 days', '1 day')::date as date
) d
CROSS JOIN (
    VALUES 
        ('09:00-10:00'), ('10:00-11:00'), ('11:00-12:00'), ('12:00-13:00'),
        ('13:00-14:00'), ('14:00-15:00'), ('15:00-16:00'), ('16:00-17:00'),
        ('17:00-18:00'), ('18:00-19:00'), ('19:00-20:00'), ('20:00-21:00')
) ts(time_slot)
WHERE s.id <= 5
ON CONFLICT (screen_id, date, time_slot) DO NOTHING;

-- Insert sample creatives for campaigns
INSERT INTO creatives (campaign_id, file_url, file_type, file_size, duration, resolution) VALUES
(1, 'https://example.com/creative1-video.mp4', 'video', 2048000, 30, '1920x1080'),
(1, 'https://example.com/creative1-image.jpg', 'image', 512000, 10, '1920x1080'),
(2, 'https://example.com/creative2-video.mp4', 'video', 3072000, 45, '1920x1080'),
(2, 'https://example.com/creative2-html5.zip', 'html5', 1024000, 30, '1920x1080'),
(3, 'https://example.com/creative3-video.mp4', 'video', 2560000, 30, '1920x1080');

-- Insert sample payments
INSERT INTO payments (campaign_id, user_id, amount, payment_method, transaction_id, status) VALUES
(1, 1, 15000.00, 'upi', 'TXN_1692090001_abc123', 'completed'),
(2, 1, 25000.00, 'card', 'TXN_1692090002_def456', 'completed'),
(3, 2, 18000.00, 'netbanking', 'TXN_1692090003_ghi789', 'completed');

-- Insert comprehensive analytics data for last 30 days
INSERT INTO analytics (screen_id, campaign_id, date, impressions, clicks, views, unique_views, cost)
SELECT 
    cs.screen_id,
    cs.campaign_id,
    d.date,
    (1000 + RANDOM() * 5000)::INTEGER as impressions,
    (50 + RANDOM() * 200)::INTEGER as clicks,
    (800 + RANDOM() * 4000)::INTEGER as views,
    (600 + RANDOM() * 3000)::INTEGER as unique_views,
    (50 + RANDOM() * 500)::DECIMAL(10,2) as cost
FROM campaign_screens cs
CROSS JOIN (
    SELECT generate_series(CURRENT_DATE - INTERVAL '30 days', CURRENT_DATE, '1 day')::date as date
) d
WHERE cs.campaign_id <= 3
ON CONFLICT (screen_id, campaign_id, date) DO NOTHING;

-- Insert proof of play data
INSERT INTO proof_of_play (screen_id, campaign_id, creative_id, timestamp, proof_type, proof_url, play_duration, metadata)
SELECT 
    cs.screen_id,
    cs.campaign_id,
    cr.id as creative_id,
    ts.timestamp,
    CASE WHEN RANDOM() < 0.7 THEN 'photo' ELSE 'video' END as proof_type,
    'https://example.com/proof/' || cs.screen_id || '_' || ts.timestamp::date || '.jpg' as proof_url,
    (20 + RANDOM() * 40)::INTEGER as play_duration,
    jsonb_build_object(
        'weather', CASE WHEN RANDOM() < 0.3 THEN 'sunny' WHEN RANDOM() < 0.6 THEN 'cloudy' ELSE 'rainy' END,
        'temperature', (15 + RANDOM() * 25)::INTEGER,
        'gps_lat', 28.6139 + (RANDOM() - 0.5) * 0.1,
        'gps_lng', 77.2090 + (RANDOM() - 0.5) * 0.1
    ) as metadata
FROM campaign_screens cs
JOIN creatives cr ON cs.campaign_id = cr.campaign_id
CROSS JOIN (
    SELECT generate_series(
        CURRENT_DATE - INTERVAL '7 days',
        CURRENT_DATE,
        '2 hours'::interval
    ) as timestamp
) ts
WHERE cs.campaign_id <= 3 AND RANDOM() < 0.3; -- 30% chance of proof entry

-- Insert campaign budgets
INSERT INTO campaign_budgets (campaign_id, allocated_budget, spent_budget, daily_budget_limit, currency)
SELECT 
    c.id,
    c.budget as allocated_budget,
    (c.budget * (0.3 + RANDOM() * 0.4))::DECIMAL(15,2) as spent_budget, -- 30-70% spent
    (c.budget / 30.0)::DECIMAL(10,2) as daily_budget_limit, -- Assuming 30-day campaign
    'INR'
FROM campaigns c
WHERE c.id <= 3;

-- Insert performance metrics for detailed hourly analytics
INSERT INTO performance_metrics (campaign_id, screen_id, date, hour, impressions, engagements, conversions, cost_per_impression)
SELECT 
    cs.campaign_id,
    cs.screen_id,
    d.date,
    h.hour,
    (50 + RANDOM() * 500)::INTEGER as impressions,
    (5 + RANDOM() * 50)::INTEGER as engagements,
    (1 + RANDOM() * 10)::INTEGER as conversions,
    (0.01 + RANDOM() * 0.1)::DECIMAL(8,4) as cost_per_impression
FROM campaign_screens cs
CROSS JOIN (
    SELECT generate_series(CURRENT_DATE - INTERVAL '7 days', CURRENT_DATE, '1 day')::date as date
) d
CROSS JOIN (
    SELECT generate_series(9, 21) as hour -- 9 AM to 9 PM
) h
WHERE cs.campaign_id <= 3 AND RANDOM() < 0.8 -- 80% chance of data
ON CONFLICT (campaign_id, screen_id, date, hour) DO NOTHING;
