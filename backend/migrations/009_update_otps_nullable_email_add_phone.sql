-- 009_update_otps_nullable_email_add_phone.sql
-- Make email nullable and add phone column to otps for SMS OTP support

ALTER TABLE IF EXISTS otps
  DROP COLUMN IF EXISTS email;

ALTER TABLE IF EXISTS otps
  ADD COLUMN IF NOT EXISTS email VARCHAR(255);

ALTER TABLE IF EXISTS otps
  ADD COLUMN IF NOT EXISTS phone VARCHAR(20);

CREATE INDEX IF NOT EXISTS idx_otp_phone ON otps(phone);
