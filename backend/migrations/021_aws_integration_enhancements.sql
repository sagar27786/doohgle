-- Migration: Add AWS integration fields and payment table
-- Date: 2025-01-26

-- Add image_urls field to screens table for multiple S3 images
ALTER TABLE screens ADD COLUMN IF NOT EXISTS image_urls TEXT;
ALTER TABLE screens ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT NOW();

-- Add urgency field to bookings if it doesn't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS urgency VARCHAR(10) DEFAULT 'medium';

-- Create payments table if it doesn't exist
CREATE TABLE IF NOT EXISTS payments (
    id SERIAL PRIMARY KEY,
    booking_id INTEGER REFERENCES bookings(id) ON DELETE CASCADE,
    amount DECIMAL(10, 2) NOT NULL,
    payment_method VARCHAR(50) NOT NULL,
    status VARCHAR(20) DEFAULT 'pending',
    transaction_id VARCHAR(255) UNIQUE,
    payment_gateway VARCHAR(50) DEFAULT 'aws',
    created_at TIMESTAMP DEFAULT NOW(),
    updated_at TIMESTAMP DEFAULT NOW()
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_payments_booking_id ON payments(booking_id);
CREATE INDEX IF NOT EXISTS idx_payments_transaction_id ON payments(transaction_id);

-- Update function for updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add triggers for updated_at
DROP TRIGGER IF EXISTS update_screens_updated_at ON screens;
CREATE TRIGGER update_screens_updated_at
    BEFORE UPDATE ON screens
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_payments_updated_at ON payments;
CREATE TRIGGER update_payments_updated_at
    BEFORE UPDATE ON payments
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Sample S3 image URLs for existing screens
UPDATE screens 
SET 
    image_urls = '["https://doohgle.s3.ap-southeast-2.amazonaws.com/screens/sample1.jpg", "https://doohgle.s3.ap-southeast-2.amazonaws.com/screens/sample2.jpg"]',
    image_url = 'https://doohgle.s3.ap-southeast-2.amazonaws.com/screens/sample1.jpg'
WHERE image_url IS NULL OR image_url = '' OR image_url LIKE '%unsplash%' OR image_url LIKE '%placeholder%';
