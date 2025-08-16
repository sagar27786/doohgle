-- Complete Ads Manager Database Schema - ALL FEATURES

-- 1. Enhance screens table for search and filtering
ALTER TABLE screens ADD COLUMN IF NOT EXISTS city VARCHAR(100);
ALTER TABLE screens ADD COLUMN IF NOT EXISTS latitude DECIMAL(10, 8);
ALTER TABLE screens ADD COLUMN IF NOT EXISTS longitude DECIMAL(11, 8);
ALTER TABLE screens ADD COLUMN IF NOT EXISTS width_ft DECIMAL(8,2);
ALTER TABLE screens ADD COLUMN IF NOT EXISTS height_ft DECIMAL(8,2);
ALTER TABLE screens ADD COLUMN IF NOT EXISTS resolution VARCHAR(20) DEFAULT '1080p';
ALTER TABLE screens ADD COLUMN IF NOT EXISTS price_per_day DECIMAL(10,2) DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS price_per_hour DECIMAL(10,2) DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS price_per_week DECIMAL(10,2) DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS traffic_estimate INTEGER DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS daily_footfall INTEGER DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS vehicle_count INTEGER DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS is_active BOOLEAN DEFAULT true;

-- 2. Screen media for photos/videos
CREATE TABLE IF NOT EXISTS screen_media (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    url VARCHAR(500) NOT NULL,
    type VARCHAR(20) NOT NULL CHECK (type IN ('image', 'video')),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Screen availability for time slots
CREATE TABLE IF NOT EXISTS screen_availability (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL,
    is_available BOOLEAN DEFAULT true,
    price_override DECIMAL(10,2),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(screen_id, date, time_slot)
);

-- 4. Enhanced campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS budget DECIMAL(15,2) DEFAULT 0;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'active', 'paused', 'completed', 'cancelled'));

-- 5. Campaign screens with time slots
ALTER TABLE campaign_screens ADD COLUMN IF NOT EXISTS time_slots TEXT[];
ALTER TABLE campaign_screens ADD COLUMN IF NOT EXISTS cost_per_slot DECIMAL(10,2) DEFAULT 0;

-- 6. Creatives table for campaign assets
CREATE TABLE IF NOT EXISTS creatives (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('video', 'image', 'html5')),
    file_size INTEGER,
    duration INTEGER DEFAULT 30,
    resolution VARCHAR(20) DEFAULT '1920x1080',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Payments table
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    transaction_id VARCHAR(100) UNIQUE,
    gateway_response TEXT,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Analytics for tracking
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    plays INTEGER DEFAULT 0,
    cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 9. Proof of play
CREATE TABLE IF NOT EXISTS proof_of_play (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    creative_id INTEGER REFERENCES creatives(id) ON DELETE CASCADE,
    play_time TIMESTAMP NOT NULL,
    proof_url VARCHAR(500),
    proof_type VARCHAR(20) CHECK (proof_type IN ('photo', 'video')),
    duration INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_screens_city ON screens(city);
CREATE INDEX IF NOT EXISTS idx_screens_location ON screens(location_name);
CREATE INDEX IF NOT EXISTS idx_screens_price ON screens(price_per_day);
CREATE INDEX IF NOT EXISTS idx_screen_availability_date ON screen_availability(screen_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_campaign ON analytics(campaign_id, date);
CREATE INDEX IF NOT EXISTS idx_proof_of_play_campaign ON proof_of_play(campaign_id, play_time);
