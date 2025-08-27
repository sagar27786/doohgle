-- Migration: Enhanced Booking Notification System
-- Creates tables for city-based booking notifications and workflow

-- Create booking notifications table
CREATE TABLE IF NOT EXISTS booking_notifications (
    id SERIAL PRIMARY KEY,
    recipient_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
    notification_type VARCHAR(50) NOT NULL, -- 'booking_request', 'booking_accepted', 'booking_rejected'
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSONB, -- Additional notification data
    status VARCHAR(20) DEFAULT 'unread', -- 'unread', 'read', 'resolved'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Add indexes for efficient queries
CREATE INDEX IF NOT EXISTS idx_booking_notifications_recipient ON booking_notifications(recipient_id);
CREATE INDEX IF NOT EXISTS idx_booking_notifications_booking ON booking_notifications(booking_id);
CREATE INDEX IF NOT EXISTS idx_booking_notifications_type ON booking_notifications(notification_type);
CREATE INDEX IF NOT EXISTS idx_booking_notifications_status ON booking_notifications(status);
CREATE INDEX IF NOT EXISTS idx_booking_notifications_created ON booking_notifications(created_at);

-- Add missing columns to bookings table for enhanced workflow
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS accepted_by INTEGER REFERENCES users(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS accepted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS assigned_screen_id INTEGER REFERENCES screens(id);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP;

-- Add missing columns if they don't exist
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_name VARCHAR(255);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_email VARCHAR(255);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS customer_phone VARCHAR(20);
ALTER TABLE bookings ADD COLUMN IF NOT EXISTS company_name VARCHAR(255);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to bookings table
DROP TRIGGER IF EXISTS update_bookings_updated_at ON bookings;
CREATE TRIGGER update_bookings_updated_at
    BEFORE UPDATE ON bookings
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Apply trigger to booking_notifications table  
DROP TRIGGER IF EXISTS update_booking_notifications_updated_at ON booking_notifications;
CREATE TRIGGER update_booking_notifications_updated_at
    BEFORE UPDATE ON booking_notifications
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Sample data for testing (optional)
-- Insert sample notification types if needed
INSERT INTO booking_notifications (recipient_id, booking_id, notification_type, title, message, data, status) 
VALUES (1, 1, 'booking_request', 'Test Notification', 'This is a test booking notification', '{}', 'unread')
ON CONFLICT DO NOTHING;

-- Add comments for documentation
COMMENT ON TABLE booking_notifications IS 'Stores notifications for booking requests and workflow updates';
COMMENT ON COLUMN booking_notifications.notification_type IS 'Type of notification: booking_request, booking_accepted, booking_rejected';
COMMENT ON COLUMN booking_notifications.data IS 'Additional JSON data specific to the notification type';
COMMENT ON COLUMN booking_notifications.status IS 'Notification status: unread, read, resolved';

COMMENT ON COLUMN bookings.accepted_by IS 'User ID of the venue owner who accepted the booking';
COMMENT ON COLUMN bookings.accepted_at IS 'Timestamp when the booking was accepted';
COMMENT ON COLUMN bookings.assigned_screen_id IS 'Screen ID assigned to this booking after acceptance';
