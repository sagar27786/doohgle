-- FIXED Sample Data for ALL Features

-- Update screens with enhanced data for SEARCH FUNCTIONALITY
UPDATE screens SET 
    city = CASE 
        WHEN id % 4 = 1 THEN 'Delhi'
        WHEN id % 4 = 2 THEN 'Mumbai' 
        WHEN id % 4 = 3 THEN 'Bangalore'
        ELSE 'Chennai'
    END,
    latitude = CASE 
        WHEN id % 4 = 1 THEN 28.6139 + (RANDOM() - 0.5) * 0.1
        WHEN id % 4 = 2 THEN 19.0760 + (RANDOM() - 0.5) * 0.1
        WHEN id % 4 = 3 THEN 12.9716 + (RANDOM() - 0.5) * 0.1
        ELSE 13.0827 + (RANDOM() - 0.5) * 0.1
    END,
    longitude = CASE 
        WHEN id % 4 = 1 THEN 77.2090 + (RANDOM() - 0.5) * 0.1
        WHEN id % 4 = 2 THEN 72.8777 + (RANDOM() - 0.5) * 0.1
        WHEN id % 4 = 3 THEN 77.5946 + (RANDOM() - 0.5) * 0.1
        ELSE 80.2707 + (RANDOM() - 0.5) * 0.1
    END,
    screen_type = CASE 
        WHEN id % 3 = 1 THEN 'LED Billboard'
        WHEN id % 3 = 2 THEN 'Mall Screen'
        ELSE 'Metro Display'
    END,
    width_ft = 15 + (RANDOM() * 10)::INTEGER,
    height_ft = 8 + (RANDOM() * 7)::INTEGER,
    resolution = CASE 
        WHEN RANDOM() < 0.3 THEN '720p'
        WHEN RANDOM() < 0.7 THEN '1080p'
        ELSE '4K'
    END,
    price_per_day = 2000 + (RANDOM() * 6000)::INTEGER,
    price_per_hour = ((2000 + (RANDOM() * 6000)::INTEGER) / 24.0)::DECIMAL(10,2),
    price_per_week = ((2000 + (RANDOM() * 6000)::INTEGER) * 6.5)::DECIMAL(10,2),
    traffic_estimate = 5000 + (RANDOM() * 45000)::INTEGER,
    daily_footfall = 3000 + (RANDOM() * 22000)::INTEGER,
    vehicle_count = 1000 + (RANDOM() * 9000)::INTEGER,
    is_active = true,
    location_name = CASE 
        WHEN id % 4 = 1 THEN 'Connaught Place'
        WHEN id % 4 = 2 THEN 'Bandra West'
        WHEN id % 4 = 3 THEN 'MG Road'
        ELSE 'T Nagar'
    END,
    address = CASE 
        WHEN id % 4 = 1 THEN 'Near Metro Station, Connaught Place, Delhi'
        WHEN id % 4 = 2 THEN 'Linking Road, Bandra West, Mumbai'
        WHEN id % 4 = 3 THEN 'MG Road Metro Station, Bangalore'
        ELSE 'T Nagar Bus Stand, Chennai'
    END
WHERE id <= 20;

-- Insert screen media (PHOTOS & VIDEOS)
INSERT INTO screen_media (screen_id, file_url, media_type, is_primary) VALUES
(1, 'https://example.com/screens/delhi_cp_1_main.jpg', 'image', true),
(1, 'https://example.com/screens/delhi_cp_1_video.mp4', 'video', false),
(1, 'https://example.com/screens/delhi_cp_1_angle2.jpg', 'image', false),
(2, 'https://example.com/screens/mumbai_bandra_1_main.jpg', 'image', true),
(2, 'https://example.com/screens/mumbai_bandra_1_video.mp4', 'video', false),
(3, 'https://example.com/screens/bangalore_mg_1_main.jpg', 'image', true),
(3, 'https://example.com/screens/bangalore_mg_1_video.mp4', 'video', false),
(4, 'https://example.com/screens/chennai_tnagar_1_main.jpg', 'image', true),
(5, 'https://example.com/screens/delhi_cp_2_main.jpg', 'image', true)
ON CONFLICT DO NOTHING;

-- Insert comprehensive screen availability (TIME SLOTS)
INSERT INTO screen_availability (screen_id, date, time_slot, is_available, price_override)
SELECT 
    s.id,
    d.date,
    ts.slot,
    CASE WHEN RANDOM() < 0.75 THEN true ELSE false END,
    CASE WHEN RANDOM() < 0.2 THEN s.price_per_hour * 1.5 ELSE NULL END
FROM screens s
CROSS JOIN generate_series(CURRENT_DATE, CURRENT_DATE + 45, '1 day'::interval) d(date)
CROSS JOIN (VALUES 
    ('06:00-07:00'),('07:00-08:00'),('08:00-09:00'),('09:00-10:00'),
    ('10:00-11:00'),('11:00-12:00'),('12:00-13:00'),('13:00-14:00'),
    ('14:00-15:00'),('15:00-16:00'),('16:00-17:00'),('17:00-18:00'),
    ('18:00-19:00'),('19:00-20:00'),('20:00-21:00'),('21:00-22:00')
) ts(slot)
WHERE s.id <= 10
ON CONFLICT DO NOTHING;

-- Insert campaigns with BUDGET data
INSERT INTO campaigns (user_id, name, description, start_date, end_date, budget, target_audience, status) VALUES
(1, 'Summer Sale Campaign', 'Promote summer collection across Delhi & Mumbai', CURRENT_DATE + 2, CURRENT_DATE + 12, 85000, 'Young professionals, age 22-35', 'active'),
(1, 'Tech Product Launch', 'New smartphone launch campaign', CURRENT_DATE + 5, CURRENT_DATE + 20, 150000, 'Tech enthusiasts, age 25-45', 'active'),
(2, 'Food Delivery Promo', 'Lunch time delivery promotion', CURRENT_DATE + 1, CURRENT_DATE + 7, 45000, 'Office workers, age 20-40', 'active')
ON CONFLICT DO NOTHING;

-- Link campaigns to screens with TIME SLOTS
INSERT INTO campaign_screens (campaign_id, screen_id, start_date, end_date, time_slots, cost_per_slot) VALUES
(1, 1, CURRENT_DATE + 2, CURRENT_DATE + 12, ARRAY['10:00-11:00','18:00-19:00','19:00-20:00'], 200),
(1, 2, CURRENT_DATE + 2, CURRENT_DATE + 12, ARRAY['12:00-13:00','17:00-18:00','20:00-21:00'], 250),
(2, 3, CURRENT_DATE + 5, CURRENT_DATE + 20, ARRAY['09:00-10:00','18:00-19:00'], 180),
(2, 4, CURRENT_DATE + 5, CURRENT_DATE + 20, ARRAY['11:00-12:00','19:00-20:00'], 220),
(3, 1, CURRENT_DATE + 1, CURRENT_DATE + 7, ARRAY['12:00-13:00','13:00-14:00'], 200)
ON CONFLICT DO NOTHING;

-- Insert CREATIVES (Video, Image, HTML5)
INSERT INTO creatives (campaign_id, file_url, file_type, file_size, duration, resolution) VALUES
(1, 'https://example.com/campaigns/summer_sale_video.mp4', 'video', 2500000, 30, '1920x1080'),
(1, 'https://example.com/campaigns/summer_sale_banner.jpg', 'image', 800000, 15, '1920x1080'),
(1, 'https://example.com/campaigns/summer_sale_interactive.zip', 'html5', 1200000, 20, '1920x1080'),
(2, 'https://example.com/campaigns/tech_launch_video.mp4', 'video', 3200000, 25, '1920x1080'),
(2, 'https://example.com/campaigns/tech_launch_banner.jpg', 'image', 650000, 10, '1920x1080'),
(3, 'https://example.com/campaigns/food_delivery_video.mp4', 'video', 1800000, 20, '1920x1080')
ON CONFLICT DO NOTHING;

-- Insert PAYMENTS (UPI, Netbanking, Card)
INSERT INTO payments (campaign_id, user_id, amount, payment_method, transaction_id, status) VALUES
(1, 1, 85000, 'upi', 'UPI_1692123456789', 'completed'),
(2, 1, 150000, 'card', 'CARD_1692123456790', 'completed'),
(3, 2, 45000, 'netbanking', 'NB_1692123456791', 'completed')
ON CONFLICT DO NOTHING;

-- Insert ANALYTICS for tracking (Impressions, Plays, Clicks)
INSERT INTO analytics (screen_id, campaign_id, date, impressions, clicks, plays, cost)
SELECT 
    cs.screen_id,
    cs.campaign_id,
    d.date,
    (800 + RANDOM() * 3200)::INTEGER as impressions,
    (40 + RANDOM() * 160)::INTEGER as clicks,
    (600 + RANDOM() * 2400)::INTEGER as plays,
    (cs.cost_per_slot * array_length(cs.time_slots, 1))::DECIMAL(10,2) as cost
FROM campaign_screens cs
CROSS JOIN generate_series(CURRENT_DATE - 15, CURRENT_DATE, '1 day'::interval) d(date)
WHERE cs.campaign_id <= 3
ON CONFLICT DO NOTHING;

-- Insert PROOF OF PLAY (Photos/Videos)
INSERT INTO proof_of_play (screen_id, campaign_id, creative_id, play_time, proof_url, proof_type, duration)
SELECT 
    cs.screen_id,
    cs.campaign_id,
    cr.id,
    NOW() - (RANDOM() * interval '10 days'),
    'https://example.com/proof/' || cs.screen_id || '_' || cs.campaign_id || '_' || extract(epoch from NOW())::INTEGER || CASE WHEN RANDOM() < 0.5 THEN '.jpg' ELSE '.mp4' END,
    CASE WHEN RANDOM() < 0.6 THEN 'photo' ELSE 'video' END,
    (15 + RANDOM() * 30)::INTEGER
FROM campaign_screens cs
JOIN creatives cr ON cs.campaign_id = cr.campaign_id
WHERE cs.campaign_id <= 3 AND RANDOM() < 0.4
ON CONFLICT DO NOTHING;
