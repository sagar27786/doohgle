// Screen Visibility Service - Ensures screens are visible to advertisers
import { ScreenSearchResult } from "../api/screens";
import { searchScreensByCity, getMyScreens } from "../api/screens";
import GoogleMapService from "./googleMapService";

class ScreenVisibilityService {
  private static instance: ScreenVisibilityService;
  private screenCache: Map<string, ScreenSearchResult[]> = new Map();
  private userScreensCache: ScreenSearchResult[] = [];
  private listeners: ((screens: ScreenSearchResult[]) => void)[] = [];
  private lastRefresh: number = 0;
  private lastUserScreensRefresh: number = 0;
  private readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

  static getInstance(): ScreenVisibilityService {
    if (!ScreenVisibilityService.instance) {
      ScreenVisibilityService.instance = new ScreenVisibilityService();
    }
    return ScreenVisibilityService.instance;
  }

  // Subscribe to screen updates
  subscribe(callback: (screens: ScreenSearchResult[]) => void): () => void {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((cb) => cb !== callback);
    };
  }

  // Notify all listeners of screen updates
  private notifyListeners(screens: ScreenSearchResult[]) {
    this.listeners.forEach((callback) => {
      try {
        callback(screens);
      } catch (error) {
        console.error("Error in screen visibility listener:", error);
      }
    });
  }

  // Get screens with smart caching and refresh
  async getScreensForCity(
    city: string,
    forceRefresh: boolean = false
  ): Promise<ScreenSearchResult[]> {
    const cacheKey = city.toLowerCase().trim();
    const now = Date.now();
    const cached = this.screenCache.get(cacheKey);

    // Return cached data if valid and not forcing refresh
    if (
      !forceRefresh &&
      cached &&
      now - this.lastRefresh < this.CACHE_DURATION
    ) {
      console.log(`📺 Returning ${cached.length} cached screens for ${city}`);
      return cached;
    }

    try {
      console.log(`🔄 Refreshing screen data for ${city}...`);
      const screens = await searchScreensByCity(city);

      // Cache the results
      this.screenCache.set(cacheKey, screens);
      this.lastRefresh = now;

      console.log(`✅ Found ${screens.length} available screens in ${city}`);

      // Log screen details for visibility confirmation
      screens.forEach((screen) => {
        console.log(
          `   📺 ${screen.name} - ${screen.location_name} (ID: ${screen.id})`
        );
      });

      // Notify all components of the update
      this.notifyListeners(screens);

      return screens;
    } catch (error) {
      console.error(`❌ Failed to fetch screens for ${city}:`, error);

      // Return cached data if available, even if stale
      if (cached) {
        console.log(`🔄 Using stale cache for ${city} due to error`);
        return cached;
      }

      throw error;
    }
  }

  // Get user's own screens (from Screen Manager)
  async getUserScreens(
    forceRefresh: boolean = false
  ): Promise<ScreenSearchResult[]> {
    const now = Date.now();

    // Return cached data if valid and not forcing refresh
    if (
      !forceRefresh &&
      this.userScreensCache.length > 0 &&
      now - this.lastUserScreensRefresh < this.CACHE_DURATION
    ) {
      console.log(
        `👤 Returning ${this.userScreensCache.length} cached user screens`
      );
      return this.userScreensCache;
    }

    try {
      console.log(`🔄 Refreshing user's own screens...`);
      console.log(`🔍 Auth token exists:`, !!localStorage.getItem("authToken"));
      const { ok, data } = await getMyScreens();

      console.log(`🔍 getMyScreens response:`, {
        ok,
        dataExists: !!data,
        screenCount: data?.screens?.length || 0,
      });

      if (ok && data?.screens) {
        // Transform user screens to match ScreenSearchResult format with geocoding
        const userScreens: ScreenSearchResult[] = [];
        const mapService = GoogleMapService.getInstance();
        
        for (const screen of data.screens) {
          let lat = screen.latitude;
          let lng = screen.longitude;
          
          // If coordinates are missing, try to geocode from address
          const fullAddress = `${screen.location_in_venue}, ${screen.city || "Unknown City"}`;
          if ((!lat || !lng || lat === 0 || lng === 0) && fullAddress) {
            console.log(`Geocoding user screen address: ${fullAddress}`);
            try {
              const coords = await mapService.geocodeAddress(fullAddress);
              if (coords) {
                lat = coords.lat;
                lng = coords.lng;
                console.log(`Geocoded user screen coordinates: ${lat}, ${lng}`);
              }
            } catch (geocodeError) {
              console.warn(`Failed to geocode user screen:`, geocodeError);
            }
          }
          
          userScreens.push({
            id: screen.id,
            name: screen.screen_name,
            description: "Your own screen available for advertising",
            screen_type: screen.device_type || "smart_tv",
            location_name: screen.location_in_venue,
            address: fullAddress,
            city: screen.city || "Unknown City",
            state: "India",
            pincode: screen.pincode || "000000",
            latitude: lat,
            longitude: lng,
            screen_size_width: screen.screen_size_inches || 55,
            screen_size_height: screen.screen_size_inches || 55,
            resolution_width: screen.resolution_width || 1920,
            resolution_height: screen.resolution_height || 1080,
            daily_footfall: screen.daily_footfall || screen.estimated_daily_viewers || 1000,
            vehicle_count: screen.vehicle_count || Math.floor((screen.daily_footfall || 1000) * 0.4),
            peak_hours: screen.peak_viewing_hours || [
              "09:00",
              "17:00",
              "19:00",
            ],
            demographics: screen.target_demographics || "Mixed demographics",
            cost_per_10_seconds: screen.cost_per_slot || screen.hourly_rate ? Math.floor((screen.hourly_rate || 100) / 360) : 50,
            // Use same image logic as Screen Manager
            image_url: (() => {
              // Check if we have uploaded images in image_urls (same logic as Screen Manager)
              if (screen.image_urls) {
                try {
                  const urls = JSON.parse(screen.image_urls);
                  if (Array.isArray(urls) && urls.length > 0) {
                    // Use first uploaded image
                    const imageUrl = urls[0];
                    // Convert relative paths to full URLs
                    if (imageUrl.startsWith("/api/")) {
                      return `http://localhost:4001${imageUrl}`;
                    }
                    return imageUrl;
                  }
                } catch (e) {
                  console.warn(
                    "Failed to parse image_urls:",
                    e,
                    screen.image_urls
                  );
                }
              }
              // Use only user-uploaded images, no fallback to random images
              return screen.day_photo_url || null;
            })(),
            video_url: screen.promotional_video_url || null,
          });
        }

        this.userScreensCache = userScreens;
        this.lastUserScreensRefresh = now;

        console.log(`✅ Found ${userScreens.length} user screens`);

        // Log user screen details with image info
        userScreens.forEach((screen) => {
          console.log(
            `   👤 ${screen.name} - ${screen.location_name} (Your Screen)`,
            `Image: ${screen.image_url ? "HAS IMAGE" : "NO IMAGE"}`
          );
        });

        return userScreens;
      } else {
        console.log(`ℹ️ No user screens found or user not authenticated`);
        return [];
      }
    } catch (error) {
      console.error(`❌ Failed to fetch user screens:`, error);

      // Return cached data if available, even if stale
      if (this.userScreensCache.length > 0) {
        console.log(`🔄 Using stale user screen cache due to error`);
        return this.userScreensCache;
      }

      // Return empty array if no cache and error occurred
      return [];
    }
  }

  // Get all screens across multiple cities + user's own screens
  async getAllScreens(
    cities: string[] = ["Mumbai", "Delhi", "Bangalore", "Chennai", "Pune"]
  ): Promise<ScreenSearchResult[]> {
    const allScreens: ScreenSearchResult[] = [];

    console.log(
      `🌍 Fetching screens from ${cities.length} cities + user screens:`,
      cities
    );

    // 1. Get user's own screens first (from Screen Manager)
    try {
      const userScreens = await this.getUserScreens();
      if (userScreens.length > 0) {
        allScreens.push(...userScreens);
        console.log(
          `👤 Added ${userScreens.length} user screens to ads manager`
        );
      }
    } catch (error) {
      console.warn(
        `⚠️ Failed to load user screens, continuing with public screens...`
      );
    }

    // 2. Get public screens from all cities
    for (const city of cities) {
      try {
        const cityScreens = await this.getScreensForCity(city);
        allScreens.push(...cityScreens);
      } catch (error) {
        console.warn(`⚠️ Failed to load screens for ${city}, continuing...`);
      }
    }

    console.log(
      `🎯 Total screens available for advertising: ${allScreens.length}`
    );

    // Remove duplicates by ID (in case user's screen is also in public results)
    const uniqueScreens = allScreens.filter(
      (screen, index, array) =>
        array.findIndex((s) => s.id === screen.id) === index
    );

    if (uniqueScreens.length !== allScreens.length) {
      console.log(
        `🔧 Removed ${
          allScreens.length - uniqueScreens.length
        } duplicate screens`
      );
    }

    // Notify all components of the combined screen update
    this.notifyListeners(uniqueScreens);

    return uniqueScreens;
  }

  // Refresh when new screen is created via Screen Manager
  async refreshAfterScreenCreation() {
    console.log(`🆕 New screen created - refreshing ads manager visibility`);

    // Force refresh user screens
    await this.getUserScreens(true);

    // Force refresh all screens to update ads manager
    const allScreens = await this.getAllScreens();

    console.log(
      `📺 Ads manager updated with ${allScreens.length} total screens`
    );

    return allScreens;
  }

  // Simulate new screen registration (for development/testing)
  async simulateNewScreen(city: string) {
    console.log(`🆕 Simulating new screen registration in ${city}`);

    // Force refresh to pick up new screens
    const screens = await this.getScreensForCity(city, true);

    console.log(`📺 Updated screen count for ${city}: ${screens.length}`);

    return screens;
  }

  // Start auto-refresh service
  startAutoRefresh(intervalMinutes: number = 10) {
    const interval = intervalMinutes * 60 * 1000;

    console.log(
      `🔄 Starting auto-refresh service (every ${intervalMinutes} minutes)`
    );

    setInterval(async () => {
      try {
        // Refresh all cached cities
        const cities = Array.from(this.screenCache.keys());

        if (cities.length > 0) {
          console.log(
            `🔄 Auto-refreshing screens for ${cities.length} cities...`
          );

          for (const city of cities) {
            await this.getScreensForCity(city, true);
          }

          console.log(`✅ Auto-refresh completed for all cities`);
        }
      } catch (error) {
        console.error("❌ Error during auto-refresh:", error);
      }
    }, interval);
  }

  // Clear cache
  clearCache() {
    console.log("🧹 Clearing screen cache...");
    this.screenCache.clear();
    this.lastRefresh = 0;
  }

  // Get cache status
  getCacheStatus() {
    const cacheSize = this.screenCache.size;
    const cacheAge = Date.now() - this.lastRefresh;
    const cacheAgeMinutes = Math.round(cacheAge / 60000);

    return {
      cities: Array.from(this.screenCache.keys()),
      totalCities: cacheSize,
      lastRefreshMinutes: cacheAgeMinutes,
      isStale: cacheAge > this.CACHE_DURATION,
    };
  }

  // Debug: Log all available screens
  async debugLogAllScreens() {
    console.log("🔍 DEBUG: Logging all available screens...");

    try {
      const screens = await this.getAllScreens();

      console.log(`📊 SCREEN AVAILABILITY REPORT:`);
      console.log(`   Total Screens: ${screens.length}`);

      const byCity = screens.reduce((acc, screen) => {
        const city = screen.city || "Unknown";
        acc[city] = (acc[city] || 0) + 1;
        return acc;
      }, {} as Record<string, number>);

      console.log(`   Cities:`, byCity);

      // Show sample screens
      const sampleScreens = screens.slice(0, 5);
      console.log(
        `   Sample Screens:`,
        sampleScreens.map((s) => ({
          id: s.id,
          name: s.name,
          city: s.city,
          location: s.location_name,
        }))
      );
    } catch (error) {
      console.error("❌ Debug failed:", error);
    }
  }
}

export default ScreenVisibilityService;
