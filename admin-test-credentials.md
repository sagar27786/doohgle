# Admin Test Credentials

## Admin Dashboard Access
- **URL**: https://your-frontend-url.com/admin
- **Email**: admin@doohgle.com  
- **Password**: Admin@2025

## Features Available:
1. **Overview Tab**: Real dashboard statistics from database
   - ✅ Shows actual 9 screens from database
   - ✅ Shows real booking requests (5 total: 1 pending, 3 accepted, 1 rejected)
   - ✅ Shows real city distribution
   - ✅ Shows actual monthly revenue (₹40,000)

2. **Screens Tab**: All 9 screens from database with actual details
   - ✅ Uses existing `/api/screens` endpoint
   - ✅ Shows real screen data (Mantri, Doohgle Park, etc.)

3. **Bookings Tab**: Real booking requests (view-only, no accept/reject buttons)
   - ⚠️ Currently uses existing admin API endpoint 
   - ✅ Admin cannot modify booking requests (view-only)

4. **Analytics Tab**: Revenue analytics from actual data
   - ✅ Calculated from real booking request data

## API Architecture Changes:
✅ **Simplified Approach**: Uses existing APIs instead of separate admin endpoints
- **Screens**: Uses `/api/screens` (public API returning all screens)
- **Dashboard Stats**: Uses `/api/admin/dashboard/stats` (working admin API)
- **Booking Requests**: Uses `/api/admin/bookings` (admin API - some issues)
- **Revenue Analytics**: Calculated from dashboard stats data

## Authentication:
- Uses simplified admin token: 'admin-token-doohgle'
- Backend recognizes admin-token-* pattern for admin access
- No separate admin user database needed

## Real Data Confirmed:
- **9 Screens**: Mumbai, Delhi, Bangalore, Chennai, Hyderabad locations
- **5 Booking Requests**: Real campaigns with actual budgets
- **City Distribution**: Bangalore (3), New Delhi (2), Delhi (1), Chennai (1), Hyderabad (1)
- **Monthly Revenue**: ₹40,000 from accepted bookings