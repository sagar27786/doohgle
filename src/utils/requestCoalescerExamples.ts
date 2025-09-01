/**
 * Request Coalescer Usage Examples
 * 
 * This file demonstrates various ways to use the request coalescer
 * for different scenarios in the application.
 */

import { coalesceRequest, createCoalescer, useRequestCoalescer } from './requestCoalescer';
import { adminService } from '../services/adminService';
import { screensService } from '../services/screensService';
import { campaignService } from '../services/campaignService';

// Example 1: Basic API call coalescing
export const fetchDashboardStatsCoalesced = async () => {
  return coalesceRequest(
    'dashboard-stats',
    () => adminService.getDashboardStats(),
    { ttl: 60000 } // Cache for 1 minute
  );
};

// Example 2: Screen data with location-based key
export const fetchScreensByLocationCoalesced = async (lat: number, lng: number, radius: number) => {
  const key = `screens-${lat.toFixed(4)}-${lng.toFixed(4)}-${radius}`;
  return coalesceRequest(
    key,
    () => screensService.getMyScreens(), // Using existing method
    { ttl: 30000, retryOnFailure: true, maxRetries: 2 }
  );
};

// Example 3: Campaign data with user-specific key
export const fetchUserCampaignsCoalesced = async (userId: number) => {
  return coalesceRequest(
    `user-campaigns-${userId}`,
    () => campaignService.getCampaigns(),
    { ttl: 45000 }
  );
};

// Example 4: Heavy computation coalescing
export const calculateRevenueAnalyticsCoalesced = async (startDate: string, endDate: string) => {
  const key = `revenue-analytics-${startDate}-${endDate}`;
  return coalesceRequest(
    key,
    () => adminService.getRevenueAnalytics(),
    { ttl: 120000, maxSubscribers: 50 } // 2 minutes cache, max 50 subscribers
  );
};

// Example 5: Image/Media loading coalescing
export const loadImageCoalesced = async (imageUrl: string) => {
  return coalesceRequest(
    `image-${imageUrl}`,
    () => new Promise<HTMLImageElement>((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = reject;
      img.src = imageUrl;
    }),
    { ttl: 300000 } // 5 minutes cache for images
  );
};

// Example 6: Search results coalescing
export const searchScreensCoalesced = async (query: string, filters: any) => {
  const key = `search-${query}-${JSON.stringify(filters)}`;
  return coalesceRequest(
    key,
    () => screensService.getMyScreens(), // Using existing method
    { ttl: 15000 } // 15 seconds cache for search results
  );
};

// Example 7: Custom coalescer for specific use case
const mapDataCoalescer = createCoalescer({
  ttl: 60000, // 1 minute
  maxSubscribers: 200, // High limit for map data
  retryOnFailure: true,
  maxRetries: 3,
  retryDelay: 2000
});

export const fetchMapDataCoalesced = async (bounds: any) => {
  const key = `map-data-${bounds.north}-${bounds.south}-${bounds.east}-${bounds.west}`;
  return mapDataCoalescer.coalesce(
    key,
    () => screensService.getMyScreens() // Using existing method
  );
};

// Example 8: React Hook usage
export const useCoalescedData = () => {
  const coalescer = useRequestCoalescer();
  
  const fetchData = async (key: string, requestFn: () => Promise<any>) => {
    try {
      return await coalescer.coalesce(key, requestFn);
    } catch (error) {
      console.error(`Coalesced request failed for key: ${key}`, error);
      throw error;
    }
  };
  
  const cancelRequest = (key: string) => {
    return coalescer.cancel(key);
  };
  
  const getRequestStats = () => {
    return coalescer.getStats();
  };
  
  return {
    fetchData,
    cancelRequest,
    getRequestStats,
    isPending: coalescer.isPending
  };
};

// Example 9: Batch operations coalescing
export const batchUpdateScreensCoalesced = async (screenIds: number[], updates: any) => {
  const key = `batch-update-${screenIds.sort().join(',')}-${JSON.stringify(updates)}`;
  return coalesceRequest(
    key,
    () => screensService.getMyScreens(), // Using existing method as placeholder
    { ttl: 5000, retryOnFailure: true } // Short cache for updates
  );
};

// Example 10: File upload coalescing (prevent duplicate uploads)
export const uploadFileCoalesced = async (file: File, path: string) => {
  // Use file content hash as key to prevent duplicate uploads
  const fileHash = await calculateFileHash(file);
  const key = `upload-${fileHash}-${path}`;
  
  return coalesceRequest(
    key,
    () => uploadFile(file, path),
    { ttl: 10000, maxSubscribers: 10 }
  );
};

// Helper function for file hashing
const calculateFileHash = async (file: File): Promise<string> => {
  const buffer = await file.arrayBuffer();
  const hashBuffer = await crypto.subtle.digest('SHA-256', buffer);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
};

// Mock upload function
const uploadFile = async (file: File, path: string): Promise<string> => {
  // Implementation would go here
  return `uploaded-${file.name}-to-${path}`;
};

// Example 11: WebSocket data coalescing
export const subscribeToRealtimeDataCoalesced = async (channel: string) => {
  return coalesceRequest(
    `websocket-${channel}`,
    () => new Promise((resolve, reject) => {
      const ws = new WebSocket(`ws://localhost:4001/ws/${channel}`);
      ws.onopen = () => resolve(ws);
      ws.onerror = reject;
    }),
    { ttl: 300000 } // 5 minutes for WebSocket connections
  );
};

// Example 12: Geolocation coalescing
export const getCurrentLocationCoalesced = async () => {
  return coalesceRequest(
    'current-location',
    () => new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      });
    }),
    { ttl: 60000 } // 1 minute cache for location
  );
};

// Example 13: Complex data aggregation
export const getScreenAnalyticsCoalesced = async (screenId: number, timeRange: string) => {
  const key = `screen-analytics-${screenId}-${timeRange}`;
  return coalesceRequest(
    key,
    async () => {
      // Simulate complex data aggregation
      const [screens, dashboardStats] = await Promise.all([
        screensService.getMyScreens(),
        adminService.getDashboardStats()
      ]);
      
      return {
        screens,
        dashboardStats,
        aggregatedAt: new Date().toISOString()
      };
    },
    { ttl: 180000, retryOnFailure: true } // 3 minutes cache
  );
};

// Example 14: Error handling and fallback
export const fetchDataWithFallbackCoalesced = async (primaryKey: string, fallbackKey: string) => {
  try {
    return await coalesceRequest(
      primaryKey,
      () => adminService.getDashboardStats(),
      { ttl: 30000, retryOnFailure: true, maxRetries: 2 }
    );
  } catch (error) {
    console.warn('Primary data fetch failed, trying fallback:', error);
    return coalesceRequest(
      fallbackKey,
      () => adminService.getRevenueAnalytics(),
      { ttl: 60000 }
    );
  }
};

// Example 15: Cleanup utility for component unmount
export const cleanupCoalescedRequests = (keys: string[]) => {
  const coalescer = useRequestCoalescer();
  keys.forEach(key => coalescer.cancel(key));
};