-- Create OTP table
 
/*

✅ GET  /api/health                     - Health check
✅ GET  /api/screens                    - All screens
✅ GET  /api/screens/:id                - Screen details  
✅ GET  /api/campaigns/screens/search   - Search screens with filters
✅ GET  /api/campaigns/cities           - Cities list
✅ GET  /api/campaigns/filters          - Filter options
✅ POST /api/campaigns/estimate-budget  - Budget estimation
✅ POST /api/campaigns                  - Create campaign
✅ GET  /api/campaigns                  - User campaigns
✅ PUT  /api/campaigns/:id/status       - Update campaign status
✅ GET  /api/campaigns/:id/tracking     - Real-time tracking
✅ GET  /api/campaigns/:id/analytics    - Analytics dashboard
✅ GET  /api/campaigns/:id/proof-of-play - Proof of play
✅ POST /api/campaigns/:id/payment      - Process payment
✅ DELETE /api/campaigns/:id            - Delete campaign

*/



CREATE TABLE IF NOT EXISTS otps (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) NOT NULL,
  otp VARCHAR(6) NOT NULL,
  expires_at TIMESTAMP NOT NULL,
  is_used BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);



-- Add index for faster lookups
CREATE INDEX IF NOT EXISTS idx_otp_email ON otps(email);
CREATE INDEX IF NOT EXISTS idx_otp_expires ON otps(expires_at);
