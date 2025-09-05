-- Migration: Create user locations table for geolocation storage
-- Date: August 2025
-- Description: Store user location data with coordinates, addresses, and metadata

-- Create user_locations table
CREATE TABLE IF NOT EXISTS user_locations (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    
    -- Coordinates
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2) DEFAULT NULL, -- GPS accuracy in meters
    
    -- Address components (from reverse geocoding)
    street_address TEXT,
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    postal_code VARCHAR(20),
    formatted_address TEXT,
    
    -- Location metadata
    location_source VARCHAR(50) DEFAULT 'gps', -- 'gps', 'manual', 'ip', etc.
    location_type VARCHAR(50) DEFAULT 'current', -- 'current', 'home', 'work', etc.
    is_active BOOLEAN DEFAULT TRUE,
    is_primary BOOLEAN DEFAULT FALSE,
    
    -- Timestamps
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_accessed TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    -- Add spatial index for geographic queries
    CONSTRAINT valid_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT valid_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Create spatial indexes for efficient geographic queries
CREATE INDEX IF NOT EXISTS idx_user_locations_coordinates ON user_locations (latitude, longitude);
CREATE INDEX IF NOT EXISTS idx_user_locations_user_id ON user_locations (user_id);
CREATE INDEX IF NOT EXISTS idx_user_locations_active ON user_locations (is_active) WHERE is_active = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_locations_primary ON user_locations (user_id, is_primary) WHERE is_primary = TRUE;
CREATE INDEX IF NOT EXISTS idx_user_locations_created_at ON user_locations (created_at);

-- Create location_history table for tracking location changes
CREATE TABLE IF NOT EXISTS location_history (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    latitude DECIMAL(10, 8) NOT NULL,
    longitude DECIMAL(11, 8) NOT NULL,
    accuracy DECIMAL(10, 2),
    city VARCHAR(100),
    state VARCHAR(100),
    country VARCHAR(100) DEFAULT 'India',
    location_source VARCHAR(50),
    session_id VARCHAR(255), -- Track user sessions
    ip_address INET,
    user_agent TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    
    CONSTRAINT valid_hist_latitude CHECK (latitude >= -90 AND latitude <= 90),
    CONSTRAINT valid_hist_longitude CHECK (longitude >= -180 AND longitude <= 180)
);

-- Create indexes for location history
CREATE INDEX IF NOT EXISTS idx_location_history_user_id ON location_history (user_id);
CREATE INDEX IF NOT EXISTS idx_location_history_created_at ON location_history (created_at);
CREATE INDEX IF NOT EXISTS idx_location_history_coordinates ON location_history (latitude, longitude);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_location_timestamp()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_user_locations_updated_at
    BEFORE UPDATE ON user_locations
    FOR EACH ROW
    EXECUTE FUNCTION update_location_timestamp();

-- Create function to calculate distance between two points (Haversine formula)
CREATE OR REPLACE FUNCTION calculate_distance(
    lat1 DECIMAL, lon1 DECIMAL,
    lat2 DECIMAL, lon2 DECIMAL
) RETURNS DECIMAL AS $$
DECLARE
    earth_radius CONSTANT DECIMAL := 6371; -- Earth radius in kilometers
    dlat DECIMAL;
    dlon DECIMAL;
    a DECIMAL;
    c DECIMAL;
BEGIN
    dlat := RADIANS(lat2 - lat1);
    dlon := RADIANS(lon2 - lon1);
    a := SIN(dlat/2) * SIN(dlat/2) + 
         COS(RADIANS(lat1)) * COS(RADIANS(lat2)) * 
         SIN(dlon/2) * SIN(dlon/2);
    c := 2 * ATAN2(SQRT(a), SQRT(1-a));
    RETURN earth_radius * c;
END;
$$ LANGUAGE plpgsql;

-- Create function to find nearby locations
CREATE OR REPLACE FUNCTION find_nearby_locations(
    user_lat DECIMAL,
    user_lon DECIMAL,
    radius_km DECIMAL DEFAULT 10
) RETURNS TABLE (
    user_id INTEGER,
    latitude DECIMAL,
    longitude DECIMAL,
    city VARCHAR,
    distance DECIMAL
) AS $$
BEGIN
    RETURN QUERY
    SELECT 
        ul.user_id,
        ul.latitude,
        ul.longitude,
        ul.city,
        calculate_distance(user_lat, user_lon, ul.latitude, ul.longitude) as distance
    FROM user_locations ul
    WHERE ul.is_active = TRUE
      AND calculate_distance(user_lat, user_lon, ul.latitude, ul.longitude) <= radius_km
    ORDER BY distance;
END;
$$ LANGUAGE plpgsql;

-- Insert some sample data for testing (Indian cities)
INSERT INTO user_locations (user_id, latitude, longitude, city, state, country, formatted_address, location_type) VALUES
(1, 28.6139, 77.2090, 'New Delhi', 'Delhi', 'India', 'New Delhi, Delhi, India', 'current'),
(1, 19.0760, 72.8777, 'Mumbai', 'Maharashtra', 'India', 'Mumbai, Maharashtra, India', 'work'),
(2, 12.9716, 77.5946, 'Bangalore', 'Karnataka', 'India', 'Bangalore, Karnataka, India', 'current'),
(2, 13.0827, 80.2707, 'Chennai', 'Tamil Nadu', 'India', 'Chennai, Tamil Nadu, India', 'home'),
(3, 22.5726, 88.3639, 'Kolkata', 'West Bengal', 'India', 'Kolkata, West Bengal, India', 'current'),
(3, 23.0225, 72.5714, 'Ahmedabad', 'Gujarat', 'India', 'Ahmedabad, Gujarat, India', 'work')
ON CONFLICT DO NOTHING;

-- Update primary location flags
UPDATE user_locations SET is_primary = TRUE 
WHERE id IN (
    SELECT DISTINCT ON (user_id) id 
    FROM user_locations 
    WHERE location_type = 'current' 
    ORDER BY user_id, created_at DESC
);

COMMIT;
