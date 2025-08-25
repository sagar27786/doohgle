# Testing Notification Accept/Reject Functionality

## 🚀 Quick Test Instructions

### Method 1: Using Browser Console (Fastest)

1. Open your app at `http://localhost:5175`
2. Open browser console (F12)
3. Create a test booking request:
   ```javascript
   window.testNotifications.addTestBooking();
   ```
4. Check the notification bell icon in the header (should show a red count badge)
5. Click the notification bell to open the dropdown
6. You should see a test booking request
7. Click "Accept" or "Reject" buttons
8. Watch console for debug logs showing the request status change

### Method 2: Through Campaign Workflow

1. Navigate to Campaign Management page
2. Click "Create Campaign" button
3. Select some screens in the workflow
4. Click "Next" to proceed (this triggers booking requests)
5. Check notification bell for new requests
6. Test accept/reject functionality

## 🔍 What to Look For

### Console Debug Logs:

- `"Sending booking request to screen manager: [object]"`
- `"Screen manager notifications updated: [array]"`
- `"Accepting booking request: [id]"`
- `"Booking request accepted: [id]"`
- `"Payment notification created: [object]"`

### UI Changes:

- ✅ Red notification count badge appears on bell icon
- ✅ Dropdown shows booking requests when bell is clicked
- ✅ Accept/Reject buttons are clickable
- ✅ Status changes from pending to accepted/rejected
- ✅ Status badge appears next to accepted/rejected requests
- ✅ Buttons disappear for non-pending requests
- ✅ Notification count updates when status changes

### User Type Testing:

- **Screen Managers** (venue_owner role): See booking requests with accept/reject buttons
- **Ads Managers** (advertiser role): See payment notifications for accepted requests

## 🐛 Troubleshooting

If accept/reject is not working:

1. Check browser console for errors
2. Verify notification service is loaded:
   ```javascript
   window.testNotifications.getRequests();
   ```
3. Check if user type is correctly detected
4. Make sure NotificationBar is receiving updates

## 🧪 Console Commands for Testing

```javascript
// Add a test booking request
const bookingId = window.testNotifications.addTestBooking();

// Accept a booking request
window.testNotifications.acceptBooking(bookingId);

// Reject a booking request
window.testNotifications.rejectBooking(bookingId);

// View all current requests
window.testNotifications.getRequests();
```

## ✨ Expected Flow

1. **Create Request** → Bell icon shows count (1)
2. **Click Bell** → Dropdown opens with request
3. **Click Accept** → Status changes to "Accepted", payment notification created
4. **After 1.5s** → Request removed from list, count decreases
5. **Switch to ads_manager** → Payment notification appears

## 🎯 Key Fixes Applied

- ✅ Fixed `getPendingBookingRequests()` to return all requests
- ✅ Added status display in notification UI
- ✅ Added proper state management for accept/reject
- ✅ Added debug logging for troubleshooting
- ✅ Fixed notification count to only count pending requests
- ✅ Added auto-removal of processed requests after feedback delay
- ✅ Added proper error checking and status validation

The system should now work properly with visual feedback for all actions!
