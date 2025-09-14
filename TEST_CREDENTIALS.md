# Doohgle Test Credentials

## 🔐 Authentication System

The Doohgle platform supports two types of users:
- **Advertisers**: Create and manage ad campaigns
- **Venue Owners**: Manage screens and bookings

## 🧪 Test Credentials (Development/Demo)

### For Demo/Testing Purposes

The backend has temporary authentication tokens for testing. You can use these directly in localStorage:

### Venue Owner Accounts

#### Venue Owner 1
- **User ID**: 1
- **Email**: venue1@test.com
- **Role**: venue_owner
- **Auth Token**: `temp-venue-owner-token-user-1`

#### Venue Owner 3
- **User ID**: 3
- **Email**: venue3@test.com
- **Role**: venue_owner
- **Auth Token**: `temp-venue-owner-token-user-3`

#### Venue Owner 4
- **User ID**: 4
- **Email**: venue4@test.com
- **Role**: venue_owner
- **Auth Token**: `temp-venue-owner-token-user-4`

### Admin Account
- **Email**: admin@doohgle.com
- **Auth Token**: `admin-token-` (any string after this prefix)

## 🚀 How to Use Test Credentials

### Browser localStorage (Quick Testing)

1. Open your browser's Developer Tools (F12)
2. Go to Console tab
3. Set the auth token:
   ```javascript
   localStorage.setItem('token', 'temp-venue-owner-token-user-1');
   ```
4. Refresh the page
5. Navigate to `/venue-dashboard` to test venue owner features

## 📱 Testing Different Features

### For Venue Dashboard Testing:
```javascript
// Set venue owner token
localStorage.setItem('token', 'temp-venue-owner-token-user-1');
// Navigate to: /venue-dashboard
```

### For Ads Manager Testing:
```javascript
// Set advertiser token (use regular signup for now)
localStorage.setItem('token', 'your-advertiser-token');
// Navigate to: /ads-manager
```

### For Admin Features:
```javascript
// Set admin token
localStorage.setItem('token', 'admin-token-test');
// Navigate to: /admin
```

## 🔧 Backend API Endpoints

All API calls go to: `https://doohgle-backend.onrender.com/api`

### Key Endpoints:
- **Health Check**: `GET /health`
- **Screens**: `GET /screens/mine` (venue owners)
- **Bookings**: `GET /venue/bookings` (venue owners)
- **Auth**: `POST /auth/login`, `POST /auth/register`

## 🐛 Troubleshooting

### Venue Dashboard Shows "Failed to fetch"
1. Check if backend is deployed and running
2. Verify API URLs are pointing to production backend
3. Ensure authentication token is set correctly
4. Check browser console for detailed error messages

### Authentication Issues
1. Clear localStorage: `localStorage.clear()`
2. Set test token: `localStorage.setItem('token', 'temp-venue-owner-token-user-1')`
3. Refresh page

## 📝 Notes

- Test tokens are only for development/demo purposes
- Production should use proper JWT tokens from login
- Venue owners can only see their own screens and bookings
- Admin tokens have elevated privileges
- Backend deployment auto-updates when code is pushed to GitHub

---

**Last Updated**: September 2025
**Environment**: Production Ready