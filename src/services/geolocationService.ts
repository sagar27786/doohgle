// Geolocation service for handling user location
class GeolocationService {
  private static instance: GeolocationService;
  private watchId: number | null = null;
  private currentPosition: GeolocationPosition | null = null;

  static getInstance(): GeolocationService {
    if (!GeolocationService.instance) {
      GeolocationService.instance = new GeolocationService();
    }
    return GeolocationService.instance;
  }

  // Check if geolocation is supported
  isSupported(): boolean {
    return 'geolocation' in navigator;
  }

  // Get current position once
  async getCurrentPosition(options?: PositionOptions): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if (!this.isSupported()) {
        reject(new Error('Geolocation is not supported by this browser'));
        return;
      }

      const defaultOptions: PositionOptions = {
        enableHighAccuracy: true,
        timeout: 15000,
        maximumAge: 300000, // 5 minutes
        ...options
      };

      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.currentPosition = position;
          resolve(position);
        },
        (error) => {
          let errorMessage = 'Unknown location error';
          
          switch (error.code) {
            case error.PERMISSION_DENIED:
              errorMessage = 'Location access denied by user';
              break;
            case error.POSITION_UNAVAILABLE:
              errorMessage = 'Location information unavailable';
              break;
            case error.TIMEOUT:
              errorMessage = 'Location request timed out';
              break;
          }
          
          reject(new Error(errorMessage));
        },
        defaultOptions
      );
    });
  }

  // Watch position changes
  watchPosition(
    onSuccess: (position: GeolocationPosition) => void,
    onError: (error: GeolocationPositionError) => void,
    options?: PositionOptions
  ): number {
    if (!this.isSupported()) {
      throw new Error('Geolocation is not supported');
    }

    const defaultOptions: PositionOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 60000, // 1 minute
      ...options
    };

    this.watchId = navigator.geolocation.watchPosition(
      (position) => {
        this.currentPosition = position;
        onSuccess(position);
      },
      onError,
      defaultOptions
    );

    return this.watchId;
  }

  // Stop watching position
  clearWatch(): void {
    if (this.watchId !== null) {
      navigator.geolocation.clearWatch(this.watchId);
      this.watchId = null;
    }
  }

  // Get cached position
  getCachedPosition(): GeolocationPosition | null {
    return this.currentPosition;
  }

  // Calculate distance between two points using Haversine formula
  calculateDistance(
    lat1: number, 
    lon1: number, 
    lat2: number, 
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);
    
    const a = 
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) * Math.cos(this.toRadians(lat2)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in kilometers
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Format coordinates for display
  formatCoordinates(lat: number, lon: number, precision: number = 6): string {
    return `${lat.toFixed(precision)}°, ${lon.toFixed(precision)}°`;
  }

  // Get location accuracy description
  getAccuracyDescription(accuracy: number): string {
    if (accuracy <= 5) return 'Very High';
    if (accuracy <= 10) return 'High';
    if (accuracy <= 50) return 'Medium';
    if (accuracy <= 100) return 'Low';
    return 'Very Low';
  }
}

export default GeolocationService;
