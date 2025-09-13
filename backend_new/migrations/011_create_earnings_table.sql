-- Add earnings table for tracking screen owner payments
BEGIN;

-- Create earnings table
CREATE TABLE IF NOT EXISTS earnings (
  id SERIAL PRIMARY KEY,
  screen_owner_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  booking_id INTEGER NOT NULL REFERENCES bookings(id) ON DELETE CASCADE,
  screen_id INTEGER NOT NULL REFERENCES screens(id) ON DELETE CASCADE,
  amount NUMERIC(10, 2) NOT NULL,
  currency VARCHAR(10) DEFAULT 'INR',
  status VARCHAR(20) DEFAULT 'pending', -- pending, processed, paid, cancelled
  payment_method VARCHAR(50), -- bank_transfer, upi, etc.
  payment_reference TEXT,
  period_start TIMESTAMP WITH TIME ZONE NOT NULL,
  period_end TIMESTAMP WITH TIME ZONE NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  paid_at TIMESTAMP WITH TIME ZONE
);

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_earnings_screen_owner_id ON earnings(screen_owner_id);
CREATE INDEX IF NOT EXISTS idx_earnings_booking_id ON earnings(booking_id);
CREATE INDEX IF NOT EXISTS idx_earnings_status ON earnings(status);
CREATE INDEX IF NOT EXISTS idx_earnings_created_at ON earnings(created_at);

-- Add trigger for updated_at
DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_trigger WHERE tgname = 'set_updated_at_earnings') THEN
    CREATE TRIGGER set_updated_at_earnings
    BEFORE UPDATE ON earnings
    FOR EACH ROW EXECUTE PROCEDURE set_updated_at_column();
  END IF;
END$$;

COMMIT;
