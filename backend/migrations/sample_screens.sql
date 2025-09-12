-- Sample screen data for testing the map
INSERT INTO users (email, password_hash, name, phone, role) VALUES 
('venue1@test.com', '$2b$10$sample_hash', 'Test Venue Owner', '+919876543210', 'venue_owner')
ON CONFLICT (email) DO NOTHING;

-- Get the user ID (this would be dynamic in real implementation)
WITH venue_user AS (
  SELECT id FROM users WHERE email = 'venue1@test.com' LIMIT 1
)
INSERT INTO screens (
  user_id, 
  screen_name, 
  location_in_venue, 
  city, 
  latitude, 
  longitude, 
  screen_size_inches,
  resolution,
  is_active,
  ads_enabled,
  hourly_rate
) 
SELECT 
  u.id,
  'Mumbai Central Mall Screen',
  'Main Entrance, Central Mall, Andheri West',
  'Mumbai',
  19.1197,
  72.8464,
  55,
  '1920x1080',
  true,
  true,
  500.00
FROM venue_user u
UNION ALL
SELECT 
  u.id,
  'Delhi CP Metro Screen',
  'Platform 1, Connaught Place Metro Station',
  'New Delhi',
  28.6315,
  77.2167,
  42,
  '1366x768',
  true,
  true,
  750.00
FROM venue_user u
UNION ALL
SELECT 
  u.id,
  'Bangalore IT Park Display',
  'Lobby Area, Electronic City',
  'Bangalore',
  12.8456,
  77.6603,
  65,
  '2560x1440',
  true,
  true,
  600.00
FROM venue_user u
UNION ALL
SELECT 
  u.id,
  'Chennai Express Highway Board',
  'GST Road, Guindy - Roadside Billboard',
  'Chennai',
  12.9121,
  80.2347,
  75,
  '1920x1080',
  true,
  true,
  1200.00
FROM venue_user u
UNION ALL
SELECT 
  u.id,
  'Hyderabad Tech Hub Screen',
  'Reception, HITEC City',
  'Hyderabad',
  17.4435,
  78.3772,
  49,
  '1680x1050',
  true,
  true,
  450.00
FROM venue_user u;
