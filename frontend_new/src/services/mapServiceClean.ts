// Google Maps Service for Indian locations
export interface IndianCity {
  name: string;
  state: string;
  coordinates: {
    lat: number;
    lng: number;
  };
  region: string;
  population: number;
}

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = "AIzaSyC4iDxiFxsSsVvJ0R-WEFwCwCMQ5ow0ZZ8";

class MapService {
  private static instance: MapService;
  private isLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  async loadGoogleMapsAPI(): Promise<void> {
    if (this.isLoaded) {
      return Promise.resolve();
    }

    if (this.loadingPromise) {
      return this.loadingPromise;
    }

    this.loadingPromise = new Promise((resolve, reject) => {
      if (
        typeof (window as any).google !== "undefined" &&
        (window as any).google.maps
      ) {
        this.isLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places&region=IN`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.isLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API"));
      };

      document.head.appendChild(script);
    });

    return this.loadingPromise;
  }

  isGoogleMapsLoaded(): boolean {
    return (
      this.isLoaded &&
      typeof (window as any).google !== "undefined" &&
      (window as any).google.maps
    );
  }

  getIndianCities(): IndianCity[] {
    return this.indianCities;
  }

  getCitiesByRegion(region: string): IndianCity[] {
    return this.indianCities.filter(
      (city) => city.region.toLowerCase() === region.toLowerCase()
    );
  }

  searchCities(query: string): IndianCity[] {
    const lowerQuery = query.toLowerCase();
    return this.indianCities.filter(
      (city) =>
        city.name.toLowerCase().includes(lowerQuery) ||
        city.state.toLowerCase().includes(lowerQuery)
    );
  }

  getCityByName(name: string): IndianCity | undefined {
    return this.indianCities.find(
      (city) => city.name.toLowerCase() === name.toLowerCase()
    );
  }

  async geocodeAddress(
    address: string
  ): Promise<{ lat: number; lng: number } | null> {
    if (!this.isGoogleMapsLoaded()) {
      await this.loadGoogleMapsAPI();
    }

    return new Promise((resolve) => {
      const geocoder = new (window as any).google.maps.Geocoder();

      geocoder.geocode(
        {
          address: address,
          region: "IN",
          componentRestrictions: { country: "IN" },
        },
        (results: any[], status: string) => {
          if (status === "OK" && results && results.length > 0) {
            const location = results[0].geometry.location;
            resolve({
              lat: location.lat(),
              lng: location.lng(),
            });
          } else {
            resolve(null);
          }
        }
      );
    });
  }

  calculateDistance(
    lat1: number,
    lng1: number,
    lat2: number,
    lng2: number
  ): number {
    const R = 6371; // Earth's radius in kilometers
    const dLat = this.degreesToRadians(lat2 - lat1);
    const dLng = this.degreesToRadians(lng2 - lng1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.degreesToRadians(lat1)) *
        Math.cos(this.degreesToRadians(lat2)) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    const distance = R * c;

    return Math.round(distance * 100) / 100;
  }

  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  getApiKey(): string {
    return GOOGLE_MAPS_API_KEY;
  }

  private indianCities: IndianCity[] = [
    {
      name: "New Delhi",
      state: "Delhi",
      coordinates: { lat: 28.6139, lng: 77.209 },
      region: "North",
      population: 32900000,
    },
    {
      name: "Mumbai",
      state: "Maharashtra",
      coordinates: { lat: 19.076, lng: 72.8777 },
      region: "West",
      population: 20700000,
    },
    {
      name: "Kolkata",
      state: "West Bengal",
      coordinates: { lat: 22.5726, lng: 88.3639 },
      region: "East",
      population: 14850000,
    },
    {
      name: "Chennai",
      state: "Tamil Nadu",
      coordinates: { lat: 13.0827, lng: 80.2707 },
      region: "South",
      population: 11500000,
    },
    {
      name: "Bangalore",
      state: "Karnataka",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      region: "South",
      population: 13600000,
    },
    {
      name: "Hyderabad",
      state: "Telangana",
      coordinates: { lat: 17.385, lng: 78.4867 },
      region: "South",
      population: 10500000,
    },
  ];
}

export default MapService;
