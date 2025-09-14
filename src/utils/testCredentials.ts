// Development helper for testing authentication
// This file provides easy access to test credentials

export const TEST_CREDENTIALS = {
  VENUE_OWNERS: {
    VENUE_1: {
      token: 'temp-venue-owner-token-user-1',
      email: 'venue1@test.com',
      id: 1,
      role: 'venue_owner'
    },
    VENUE_3: {
      token: 'temp-venue-owner-token-user-3',
      email: 'venue3@test.com',
      id: 3,
      role: 'venue_owner'
    },
    VENUE_4: {
      token: 'temp-venue-owner-token-user-4',
      email: 'venue4@test.com',
      id: 4,
      role: 'venue_owner'
    }
  },
  ADMIN: {
    token: 'admin-token-test',
    email: 'admin@doohgle.com',
    id: 999,
    role: 'admin'
  }
};

// Helper functions for quick testing
export const setTestCredentials = {
  venueOwner1: () => {
    localStorage.setItem('token', TEST_CREDENTIALS.VENUE_OWNERS.VENUE_1.token);
    localStorage.setItem('user', JSON.stringify(TEST_CREDENTIALS.VENUE_OWNERS.VENUE_1));
    console.log('✅ Venue Owner 1 credentials set');
  },
  
  venueOwner3: () => {
    localStorage.setItem('token', TEST_CREDENTIALS.VENUE_OWNERS.VENUE_3.token);
    localStorage.setItem('user', JSON.stringify(TEST_CREDENTIALS.VENUE_OWNERS.VENUE_3));
    console.log('✅ Venue Owner 3 credentials set');
  },
  
  venueOwner4: () => {
    localStorage.setItem('token', TEST_CREDENTIALS.VENUE_OWNERS.VENUE_4.token);
    localStorage.setItem('user', JSON.stringify(TEST_CREDENTIALS.VENUE_OWNERS.VENUE_4));
    console.log('✅ Venue Owner 4 credentials set');
  },
  
  admin: () => {
    localStorage.setItem('token', TEST_CREDENTIALS.ADMIN.token);
    localStorage.setItem('user', JSON.stringify(TEST_CREDENTIALS.ADMIN));
    console.log('✅ Admin credentials set');
  },
  
  clear: () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    console.log('🔄 Credentials cleared');
  }
};

// Make available globally for console testing
if (typeof window !== 'undefined') {
  (window as any).testAuth = setTestCredentials;
  console.log('🧪 Test auth helpers available at window.testAuth');
  console.log('Examples:');
  console.log('- testAuth.venueOwner1() - Set venue owner 1 credentials');
  console.log('- testAuth.admin() - Set admin credentials');
  console.log('- testAuth.clear() - Clear all credentials');
}