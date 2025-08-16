-- Enhanced Tables for Complete Ads Manager Features

-- 1. Add columns to screens table for enhanced search and filtering
ALTER TABLE screens ADD COLUMN IF NOT EXISTS traffic_estimate INTEGER DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS footfall_daily INTEGER DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS vehicle_count_daily INTEGER DEFAULT 0;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS resolution VARCHAR(20) DEFAULT '1080p';
ALTER TABLE screens ADD COLUMN IF NOT EXISTS price_per_hour DECIMAL(10,2) DEFAULT 0;

-- 2. Create screen_media table for photos and videos
CREATE TABLE IF NOT EXISTS screen_media (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    media_url VARCHAR(500) NOT NULL,
    media_type VARCHAR(20) NOT NULL CHECK (media_type IN ('image', 'video')),
    is_primary BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Create screen_availability table for time slot management
CREATE TABLE IF NOT EXISTS screen_availability (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    time_slot VARCHAR(20) NOT NULL, -- Format: "09:00-10:00"
    is_available BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(screen_id, date, time_slot)
);

-- 4. Enhance campaigns table
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS target_audience TEXT;
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS creative_urls TEXT[]; -- Array of creative URLs
ALTER TABLE campaigns ADD COLUMN IF NOT EXISTS budget DECIMAL(15,2) DEFAULT 0;

-- 5. Create creatives table for campaign assets
CREATE TABLE IF NOT EXISTS creatives (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    file_url VARCHAR(500) NOT NULL,
    file_type VARCHAR(20) NOT NULL CHECK (file_type IN ('video', 'image', 'html5')),
    file_size INTEGER, -- Size in bytes
    duration INTEGER DEFAULT 30, -- Duration in seconds
    resolution VARCHAR(20) DEFAULT '1920x1080',
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Enhance campaign_screens table with time slots
ALTER TABLE campaign_screens ADD COLUMN IF NOT EXISTS time_slots TEXT[]; -- Array of time slots
ALTER TABLE campaign_screens ADD COLUMN IF NOT EXISTS cost_per_slot DECIMAL(10,2) DEFAULT 0;

-- 7. Create payments table for transaction management
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    amount DECIMAL(15,2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL, -- 'upi', 'netbanking', 'card'
    transaction_id VARCHAR(100) UNIQUE,
    payment_gateway_response TEXT, -- JSON response from payment gateway
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'completed', 'failed', 'refunded')),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create analytics table for detailed tracking
CREATE TABLE IF NOT EXISTS analytics (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    impressions INTEGER DEFAULT 0,
    clicks INTEGER DEFAULT 0,
    views INTEGER DEFAULT 0,
    unique_views INTEGER DEFAULT 0,
    play_duration INTEGER DEFAULT 0, -- Total play time in seconds
    cost DECIMAL(10,2) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(screen_id, campaign_id, date)
);

-- 9. Create proof_of_play table for verification
CREATE TABLE IF NOT EXISTS proof_of_play (
    id SERIAL PRIMARY KEY,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    creative_id INTEGER REFERENCES creatives(id) ON DELETE CASCADE,
    timestamp TIMESTAMP NOT NULL,
    proof_type VARCHAR(20) CHECK (proof_type IN ('photo', 'video')),
    proof_url VARCHAR(500),
    play_duration INTEGER DEFAULT 0, -- Actual play duration in seconds
    metadata JSONB, -- Additional metadata like GPS coordinates, weather, etc.
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create campaign_budgets table for budget tracking
CREATE TABLE IF NOT EXISTS campaign_budgets (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    allocated_budget DECIMAL(15,2) NOT NULL,
    spent_budget DECIMAL(15,2) DEFAULT 0,
    remaining_budget DECIMAL(15,2) GENERATED ALWAYS AS (allocated_budget - spent_budget) STORED,
    daily_budget_limit DECIMAL(10,2),
    currency VARCHAR(3) DEFAULT 'INR',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create performance_metrics table for advanced analytics
CREATE TABLE IF NOT EXISTS performance_metrics (
    id SERIAL PRIMARY KEY,
    campaign_id INTEGER REFERENCES campaigns(id) ON DELETE CASCADE,
    screen_id INTEGER REFERENCES screens(id) ON DELETE CASCADE,
    date DATE NOT NULL,
    hour INTEGER CHECK (hour >= 0 AND hour <= 23),
    impressions INTEGER DEFAULT 0,
    engagements INTEGER DEFAULT 0,
    conversions INTEGER DEFAULT 0,
    cost_per_impression DECIMAL(8,4) DEFAULT 0,
    cost_per_engagement DECIMAL(8,4) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE(campaign_id, screen_id, date, hour)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_screen_availability_date ON screen_availability(screen_id, date);
CREATE INDEX IF NOT EXISTS idx_analytics_campaign_date ON analytics(campaign_id, date);
CREATE INDEX IF NOT EXISTS idx_proof_of_play_campaign ON proof_of_play(campaign_id, timestamp);
CREATE INDEX IF NOT EXISTS idx_performance_metrics_campaign ON performance_metrics(campaign_id, date);
CREATE INDEX IF NOT EXISTS idx_screens_location ON screens(city, location);
CREATE INDEX IF NOT EXISTS idx_screens_price ON screens(price_per_day);
CREATE INDEX IF NOT EXISTS idx_campaigns_user_status ON campaigns(user_id, status);
