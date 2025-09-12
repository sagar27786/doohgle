const express = require('express');
const cors = require('cors');
const app = express();

app.use(cors());
app.use(express.json());

// Mock screens data
const mockScreens = [
  {
    id: 1,
    name: "Mall Center Screen",
    screen_name: "Mall Center Screen",
    location: "Food Court Area",
    location_in_venue: "Food Court Area",
    city: "Mumbai",
    latitude: 19.0760,
    longitude: 72.8777,
    screen_size_inches: 55,
    resolution: "1920x1080",
    orientation: "landscape",
    device_type: "smart_tv",
    ads_enabled: true,
    is_active: true,
    image_url: "/assets/screen1.png",
    created_at: new Date().toISOString()
  },
  {
    id: 2,
    name: "Metro Station Display",
    screen_name: "Metro Station Display",
    location: "Platform 1",
    location_in_venue: "Platform 1",
    city: "Delhi",
    latitude: 28.7041,
    longitude: 77.1025,
    screen_size_inches: 42,
    resolution: "1366x768",
    orientation: "landscape",
    device_type: "smart_tv",
    ads_enabled: true,
    is_active: true,
    image_url: "/assets/screen2.png",
    created_at: new Date().toISOString()
  },
  {
    id: 3,
    name: "Shopping Complex LED",
    screen_name: "Shopping Complex LED",
    location: "Main Entrance",
    location_in_venue: "Main Entrance",
    city: "Bangalore",
    latitude: 12.9716,
    longitude: 77.5946,
    screen_size_inches: 65,
    resolution: "1920x1080",
    orientation: "landscape",
    device_type: "smart_tv",
    ads_enabled: true,
    is_active: true,
    image_url: "/assets/screen3.png",
    created_at: new Date().toISOString()
  }
];

// Mock campaigns data with realistic spending
const mockCampaigns = [
  {
    id: 1,
    name: "Summer Fashion Collection",
    description: "Trendy fashion campaign for summer season",
    brand: "Trendy Styles",
    status: "active",
    budget: 50000.00,
    spent: 32000.00, // 64% of budget spent
    impressions: 1200000,
    clicks: 15400,
    ctr: 1.28,
    start_date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 20 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 2,
    name: "Tech Product Launch",
    description: "New product launch campaign",
    brand: "InnovateTech",
    status: "active",
    budget: 75000.00,
    spent: 28000.00, // 37% of budget spent
    impressions: 950000,
    clicks: 12800,
    ctr: 1.35,
    start_date: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 40 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString()
  },
  {
    id: 3,
    name: "Restaurant Chain Promo",
    description: "Food promotion campaign",
    brand: "Foodie Delights",
    status: "paused",
    budget: 30000.00,
    spent: 18000.00, // 60% of budget spent
    impressions: 780000,
    clicks: 9600,
    ctr: 1.23,
    start_date: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
    end_date: new Date(Date.now() + 15 * 24 * 60 * 60 * 1000).toISOString(),
    created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString()
  }
];

// Health check
app.get('/api/health', (req, res) => {
  res.json({
    status: "OK",
    timestamp: new Date().toISOString(),
    services: {
      auth: "active",
      screens: "active",
      campaigns: "active",
      venue: "active"
    }
  });
});

// Screens API
app.get('/api/screens', (req, res) => {
  console.log('📺 Screens API called');
  res.json({
    success: true,
    data: mockScreens,
    pagination: {
      page: 1,
      limit: 20,
      total: mockScreens.length,
      pages: 1
    }
  });
});

// Campaigns API
app.get('/api/campaigns', (req, res) => {
  console.log('🎯 Campaigns API called');
  res.json({
    success: true,
    campaigns: mockCampaigns,
    pagination: {
      page: 1,
      limit: 10,
      total: mockCampaigns.length
    }
  });
});

const PORT = 4001;
app.listen(PORT, () => {
  console.log(`🚀 Mock server running on port ${PORT}`);
  console.log(`📺 Screens: http://localhost:${PORT}/api/screens`);
  console.log(`🎯 Campaigns: http://localhost:${PORT}/api/campaigns`);
  console.log(`❤️ Health: http://localhost:${PORT}/api/health`);
});
