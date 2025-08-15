-- 010_add_password_hash_to_users.sql
-- Ensure users table has password_hash column. If a legacy `password` column exists, rename it.

DO $$
BEGIN
  -- If password_hash already exists, do nothing
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'users' AND column_name = 'password_hash'
  ) THEN

    -- If a legacy 'password' column exists, rename it to 'password_hash'
    IF EXISTS (
      SELECT 1 FROM information_schema.columns
      WHERE table_name = 'users' AND column_name = 'password'
    ) THEN
      ALTER TABLE users RENAME COLUMN password TO password_hash;
    ELSE
      -- Otherwise add the new column
      ALTER TABLE users ADD COLUMN IF NOT EXISTS password_hash VARCHAR(255);
    END IF;
  END IF;
END$$;

-- Optionally make password_hash NOT NULL if you are sure all rows have values.
-- ALTER TABLE users ALTER COLUMN password_hash SET NOT NULL;
