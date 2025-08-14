-- Add phone column to otps table to support SMS OTP
ALTER TABLE IF EXISTS otps
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

-- Optional: add an index for phone lookups
CREATE INDEX IF NOT EXISTS idx_otp_phone ON otps(phone);
