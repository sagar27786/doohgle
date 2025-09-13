-- Create comprehensive Indian location data and update existing screens
-- Migration: 020_add_indian_locations.sql

BEGIN;

-- First, update existing screens with proper Indian coordinates if they don't have them
UPDATE screens 
SET 
  latitude = CASE 
    WHEN city ILIKE '%delhi%' THEN 28.6139
    WHEN city ILIKE '%mumbai%' THEN 19.0760
    WHEN city ILIKE '%bangalore%' OR city ILIKE '%bengaluru%' THEN 12.9716
    WHEN city ILIKE '%chennai%' THEN 13.0827
    WHEN city ILIKE '%kolkata%' THEN 22.5726
    WHEN city ILIKE '%hyderabad%' THEN 17.3850
    WHEN city ILIKE '%pune%' THEN 18.5204
    WHEN city ILIKE '%ahmedabad%' THEN 23.0225
    WHEN city ILIKE '%jaipur%' THEN 26.9124
    WHEN city ILIKE '%lucknow%' THEN 26.8467
    ELSE latitude
  END,
  longitude = CASE 
    WHEN city ILIKE '%delhi%' THEN 77.2090
    WHEN city ILIKE '%mumbai%' THEN 72.8777
    WHEN city ILIKE '%bangalore%' OR city ILIKE '%bengaluru%' THEN 77.5946
    WHEN city ILIKE '%chennai%' THEN 80.2707
    WHEN city ILIKE '%kolkata%' THEN 88.3639
    WHEN city ILIKE '%hyderabad%' THEN 78.4867
    WHEN city ILIKE '%pune%' THEN 73.8567
    WHEN city ILIKE '%ahmedabad%' THEN 72.5714
    WHEN city ILIKE '%jaipur%' THEN 75.7873
    WHEN city ILIKE '%lucknow%' THEN 80.9462
    ELSE longitude
  END
WHERE city IS NOT NULL AND (latitude IS NULL OR longitude IS NULL);

-- Create a table for Indian cities reference data
CREATE TABLE IF NOT EXISTS indian_cities (
  id SERIAL PRIMARY KEY,
  name VARCHAR(100) NOT NULL,
  state VARCHAR(100) NOT NULL,
  region VARCHAR(50) NOT NULL, -- North, South, East, West, Central, Northeast
  latitude DECIMAL(10, 8) NOT NULL,
  longitude DECIMAL(11, 8) NOT NULL,
  population INTEGER,
  is_metro BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Insert major Indian cities data
INSERT INTO indian_cities (name, state, region, latitude, longitude, population, is_metro) VALUES
-- Metro Cities (Tier 1)
('New Delhi', 'Delhi', 'North', 28.6139, 77.2090, 32900000, TRUE),
('Mumbai', 'Maharashtra', 'West', 19.0760, 72.8777, 20700000, TRUE),
('Bengaluru', 'Karnataka', 'South', 12.9716, 77.5946, 13200000, TRUE),
('Chennai', 'Tamil Nadu', 'South', 13.0827, 80.2707, 11700000, TRUE),
('Kolkata', 'West Bengal', 'East', 22.5726, 88.3639, 15100000, TRUE),
('Hyderabad', 'Telangana', 'South', 17.3850, 78.4867, 10500000, TRUE),

-- Tier 1 Cities
('Pune', 'Maharashtra', 'West', 18.5204, 73.8567, 7400000, FALSE),
('Ahmedabad', 'Gujarat', 'West', 23.0225, 72.5714, 8400000, FALSE),
('Surat', 'Gujarat', 'West', 21.1702, 72.8311, 6600000, FALSE),
('Jaipur', 'Rajasthan', 'North', 26.9124, 75.7873, 4200000, FALSE),

-- Tier 2 Cities
('Lucknow', 'Uttar Pradesh', 'North', 26.8467, 80.9462, 3600000, FALSE),
('Kanpur', 'Uttar Pradesh', 'North', 26.4499, 80.3319, 3200000, FALSE),
('Nagpur', 'Maharashtra', 'Central', 21.1458, 79.0882, 2800000, FALSE),
('Indore', 'Madhya Pradesh', 'Central', 22.7196, 75.8577, 2700000, FALSE),
('Thane', 'Maharashtra', 'West', 19.2183, 72.9781, 2600000, FALSE),
('Bhopal', 'Madhya Pradesh', 'Central', 23.2599, 77.4126, 2400000, FALSE),
('Visakhapatnam', 'Andhra Pradesh', 'South', 17.6868, 83.2185, 2200000, FALSE),
('Pimpri-Chinchwad', 'Maharashtra', 'West', 18.6298, 73.7997, 2100000, FALSE),
('Patna', 'Bihar', 'East', 25.5941, 85.1376, 2000000, FALSE),
('Vadodara', 'Gujarat', 'West', 22.3072, 73.1812, 1900000, FALSE),
('Ghaziabad', 'Uttar Pradesh', 'North', 28.6692, 77.4538, 1800000, FALSE),
('Ludhiana', 'Punjab', 'North', 30.9000, 75.8573, 1700000, FALSE),
('Agra', 'Uttar Pradesh', 'North', 27.1767, 78.0081, 1600000, FALSE),
('Nashik', 'Maharashtra', 'West', 19.9975, 73.7898, 1500000, FALSE),
('Faridabad', 'Haryana', 'North', 28.4089, 77.3178, 1400000, FALSE),
('Meerut', 'Uttar Pradesh', 'North', 28.9845, 77.7064, 1400000, FALSE),
('Rajkot', 'Gujarat', 'West', 22.3039, 70.8022, 1300000, FALSE),
('Kalyan-Dombivali', 'Maharashtra', 'West', 19.2403, 73.1305, 1300000, FALSE),
('Vasai-Virar', 'Maharashtra', 'West', 19.4914, 72.8054, 1200000, FALSE),
('Varanasi', 'Uttar Pradesh', 'North', 25.3176, 82.9739, 1200000, FALSE),
('Srinagar', 'Jammu and Kashmir', 'North', 34.0837, 74.7973, 1200000, FALSE),
('Aurangabad', 'Maharashtra', 'Central', 19.8762, 75.3433, 1200000, FALSE),
('Dhanbad', 'Jharkhand', 'East', 23.7957, 86.4304, 1200000, FALSE),
('Amritsar', 'Punjab', 'North', 31.6340, 74.8723, 1100000, FALSE),
('Navi Mumbai', 'Maharashtra', 'West', 19.0330, 73.0297, 1100000, FALSE),
('Allahabad', 'Uttar Pradesh', 'North', 25.4358, 81.8463, 1100000, FALSE),
('Ranchi', 'Jharkhand', 'East', 23.3441, 85.3096, 1100000, FALSE),
('Howrah', 'West Bengal', 'East', 22.5958, 88.2636, 1100000, FALSE),
('Coimbatore', 'Tamil Nadu', 'South', 11.0168, 76.9558, 1100000, FALSE),
('Jabalpur', 'Madhya Pradesh', 'Central', 23.1815, 79.9864, 1000000, FALSE),
('Gwalior', 'Madhya Pradesh', 'Central', 26.2183, 78.1828, 1000000, FALSE),
('Vijayawada', 'Andhra Pradesh', 'South', 16.5062, 80.6480, 1000000, FALSE),
('Jodhpur', 'Rajasthan', 'North', 26.2389, 73.0243, 1000000, FALSE),
('Madurai', 'Tamil Nadu', 'South', 9.9252, 78.1198, 1000000, FALSE),
('Raipur', 'Chhattisgarh', 'Central', 21.2514, 81.6296, 1000000, FALSE),
('Kota', 'Rajasthan', 'North', 25.2138, 75.8648, 1000000, FALSE),

-- Important Tier 3 Cities
('Chandigarh', 'Chandigarh', 'North', 30.7333, 76.7794, 900000, FALSE),
('Guwahati', 'Assam', 'Northeast', 26.1445, 91.7362, 900000, FALSE),
('Solapur', 'Maharashtra', 'West', 17.6599, 75.9064, 900000, FALSE),
('Hubli-Dharwad', 'Karnataka', 'South', 15.3647, 75.1240, 900000, FALSE),
('Mysore', 'Karnataka', 'South', 12.2958, 76.6394, 900000, FALSE),
('Tiruchirappalli', 'Tamil Nadu', 'South', 10.7905, 78.7047, 900000, FALSE),
('Salem', 'Tamil Nadu', 'South', 11.6643, 78.1460, 900000, FALSE),
('Mira-Bhayandar', 'Maharashtra', 'West', 19.2952, 72.8544, 800000, FALSE),
('Warangal', 'Telangana', 'South', 17.9689, 79.5941, 800000, FALSE),
('Thiruvananthapuram', 'Kerala', 'South', 8.5241, 76.9366, 800000, FALSE),
('Guntur', 'Andhra Pradesh', 'South', 16.3067, 80.4365, 800000, FALSE),
('Bhiwandi', 'Maharashtra', 'West', 19.3000, 73.0500, 800000, FALSE),
('Saharanpur', 'Uttar Pradesh', 'North', 29.9680, 77.5552, 800000, FALSE),
('Gorakhpur', 'Uttar Pradesh', 'North', 26.7606, 83.3732, 800000, FALSE),
('Bikaner', 'Rajasthan', 'North', 28.0229, 73.3119, 700000, FALSE),
('Amravati', 'Maharashtra', 'Central', 20.9374, 77.7796, 700000, FALSE),
('Noida', 'Uttar Pradesh', 'North', 28.5355, 77.3910, 700000, FALSE),
('Jamshedpur', 'Jharkhand', 'East', 22.8046, 86.2029, 700000, FALSE),
('Bhilai Nagar', 'Chhattisgarh', 'Central', 21.1938, 81.3509, 700000, FALSE),
('Cuttack', 'Odisha', 'East', 20.4625, 85.8828, 700000, FALSE),
('Firozabad', 'Uttar Pradesh', 'North', 27.1592, 78.3957, 700000, FALSE),
('Kochi', 'Kerala', 'South', 9.9312, 76.2673, 700000, FALSE),
('Bhavnagar', 'Gujarat', 'West', 21.7645, 72.1519, 600000, FALSE),
('Dehradun', 'Uttarakhand', 'North', 30.3165, 78.0322, 600000, FALSE),
('Durgapur', 'West Bengal', 'East', 23.4800, 87.3200, 600000, FALSE),
('Asansol', 'West Bengal', 'East', 23.6839, 86.9523, 600000, FALSE),
('Nanded', 'Maharashtra', 'Central', 19.1383, 77.3210, 600000, FALSE),
('Kolhapur', 'Maharashtra', 'West', 16.7050, 74.2433, 600000, FALSE),
('Ajmer', 'Rajasthan', 'North', 26.4499, 74.6399, 600000, FALSE),
('Akola', 'Maharashtra', 'Central', 20.7002, 77.0082, 500000, FALSE),
('Gulbarga', 'Karnataka', 'South', 17.3297, 76.8343, 500000, FALSE),
('Jamnagar', 'Gujarat', 'West', 22.4697, 70.0507, 500000, FALSE),
('Ujjain', 'Madhya Pradesh', 'Central', 23.1765, 75.7885, 500000, FALSE),
('Loni', 'Uttar Pradesh', 'North', 28.7500, 77.2833, 500000, FALSE),
('Siliguri', 'West Bengal', 'East', 26.7271, 88.3953, 500000, FALSE),
('Jhansi', 'Uttar Pradesh', 'North', 25.4484, 78.5685, 500000, FALSE),
('Ulhasnagar', 'Maharashtra', 'West', 19.2183, 73.1378, 500000, FALSE),
('Jammu', 'Jammu and Kashmir', 'North', 32.7266, 74.8570, 500000, FALSE),
('Sangli-Miraj & Kupwad', 'Maharashtra', 'West', 16.8524, 74.5815, 500000, FALSE),
('Mangalore', 'Karnataka', 'South', 12.9141, 74.8560, 500000, FALSE),
('Erode', 'Tamil Nadu', 'South', 11.3410, 77.7172, 500000, FALSE),
('Belgaum', 'Karnataka', 'South', 15.8497, 74.4977, 500000, FALSE),
('Ambattur', 'Tamil Nadu', 'South', 13.1143, 80.1548, 500000, FALSE),
('Tirunelveli', 'Tamil Nadu', 'South', 8.7139, 77.7567, 500000, FALSE),
('Malegaon', 'Maharashtra', 'West', 20.5579, 74.5287, 500000, FALSE),
('Gaya', 'Bihar', 'East', 24.7914, 85.0002, 400000, FALSE);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_indian_cities_name ON indian_cities(name);
CREATE INDEX IF NOT EXISTS idx_indian_cities_state ON indian_cities(state);
CREATE INDEX IF NOT EXISTS idx_indian_cities_region ON indian_cities(region);
CREATE INDEX IF NOT EXISTS idx_indian_cities_metro ON indian_cities(is_metro);
CREATE INDEX IF NOT EXISTS idx_indian_cities_population ON indian_cities(population DESC);

-- Create a view for easy screen location queries
CREATE OR REPLACE VIEW indian_screen_locations AS
SELECT 
  s.id,
  s.screen_name,
  s.location_in_venue,
  s.city,
  s.latitude,
  s.longitude,
  ic.state,
  ic.region,
  ic.is_metro,
  s.ads_enabled,
  s.is_active,
  u.name as owner_name,
  u.email as owner_email
FROM screens s
LEFT JOIN indian_cities ic ON LOWER(s.city) = LOWER(ic.name)
LEFT JOIN users u ON s.user_id = u.id
WHERE s.latitude IS NOT NULL AND s.longitude IS NOT NULL;

-- Update existing sample data with better Indian locations if needed
DO $$
BEGIN
  -- Add more sample screens if there are very few
  IF (SELECT COUNT(*) FROM screens) < 10 THEN
    INSERT INTO screens (
      user_id, screen_name, location_in_venue, city, latitude, longitude,
      screen_size_inches, resolution, orientation, device_type, device_model,
      ads_enabled, ad_frequency, viewing_distance, typical_viewer_duration,
      peak_viewing_hours, is_active
    ) VALUES
      (1, 'Connaught Place Digital Display', 'Main Circle', 'New Delhi', 28.6315, 77.2167, 
       65, '4K', 'landscape', 'led_display', 'Samsung QM65R', true, 8, 'far',
       '15-30 seconds', ARRAY['09:00', '12:00', '18:00', '21:00'], true),
       
      (1, 'Gateway of India Screen', 'Tourist Area', 'Mumbai', 18.9220, 72.8347,
       55, '1080p', 'landscape', 'smart_tv', 'LG 55UN7300PTC', true, 6, 'medium',
       '1-2 minutes', ARRAY['10:00', '14:00', '17:00', '20:00'], true),
       
      (2, 'Brigade Road Mall', 'Main Entrance', 'Bengaluru', 12.9716, 77.6197,
       48, '1080p', 'portrait', 'digital_signage', 'BenQ IL430', true, 5,
       'close', '2-3 minutes', ARRAY['11:00', '15:00', '19:00'], true),
       
      (2, 'Marina Beach Promenade', 'Beach Front', 'Chennai', 13.0475, 80.2824,
       60, '4K', 'landscape', 'outdoor_led', 'Absen A2731', true, 10, 'far',
       '5-10 seconds', ARRAY['06:00', '17:00', '19:00', '21:00'], true),
       
      (1, 'Park Street Metro Station', 'Platform Area', 'Kolkata', 22.5533, 88.3627,
       42, '1080p', 'landscape', 'commercial_display', 'Samsung QB43R', true, 4,
       'close', '30-60 seconds', ARRAY['07:00', '08:00', '17:00', '18:00'], true);
  END IF;
END $$;

COMMIT;

-- Display summary
DO $$
BEGIN
  RAISE NOTICE 'Indian Cities Migration Complete:';
  RAISE NOTICE '- Added % cities to indian_cities table', (SELECT COUNT(*) FROM indian_cities);
  RAISE NOTICE '- Updated % screens with coordinates', (SELECT COUNT(*) FROM screens WHERE latitude IS NOT NULL AND longitude IS NOT NULL);
  RAISE NOTICE '- Created indian_screen_locations view';
END $$;
