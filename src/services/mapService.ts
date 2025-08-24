// Indian City interface
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

const GOOGLE_MAPS_API_KEY = "AIzaSyC4iDxiFxsSsVvJ0R-WEFwCwCMQ5ow0ZZ8";

// MapService class for Google Maps integration with Indian locations
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
    lng: number;
  }
  type: string;
  status: "active" | "inactive" | "maintenance";
}

class MapService {
  private static instance: MapService;
  private googleMapsApiKey = "AIzaSyC4iDxiFxsSsVvJ0R-WEFwCwCMQ5ow0ZZ8";

  // Major Indian cities with coordinates
  private indianCities: IndianCity[] = [
    {
      name: "New Delhi",
      state: "Delhi",
      coordinates: { lat: 28.6139, lng: 77.209 },
      population: 32900000,
      region: "North",
    },
    {
      name: "Mumbai",
      state: "Maharashtra",
      coordinates: { lat: 19.076, lng: 72.8777 },
      population: 20700000,
      region: "West",
    },
    {
      name: "Bengaluru",
      state: "Karnataka",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      population: 13200000,
      region: "South",
    },
    {
      name: "Chennai",
      state: "Tamil Nadu",
      coordinates: { lat: 13.0827, lng: 80.2707 },
      population: 11700000,
      region: "South",
    },
    {
      name: "Kolkata",
      state: "West Bengal",
      coordinates: { lat: 22.5726, lng: 88.3639 },
      population: 15100000,
      region: "East",
    },
    {
      name: "Hyderabad",
      state: "Telangana",
      coordinates: { lat: 17.385, lng: 78.4867 },
      population: 10500000,
      region: "South",
    },
    {
      name: "Pune",
      state: "Maharashtra",
      coordinates: { lat: 18.5204, lng: 73.8567 },
      population: 7400000,
      region: "West",
    },
    {
      name: "Ahmedabad",
      state: "Gujarat",
      coordinates: { lat: 23.0225, lng: 72.5714 },
      population: 8400000,
      region: "West",
    },
    {
      name: "Surat",
      state: "Gujarat",
      coordinates: { lat: 21.1702, lng: 72.8311 },
      population: 6600000,
      region: "West",
    },
    {
      name: "Jaipur",
      state: "Rajasthan",
      coordinates: { lat: 26.9124, lng: 75.7873 },
      population: 4200000,
      region: "North",
    },
    {
      name: "Lucknow",
      state: "Uttar Pradesh",
      coordinates: { lat: 26.8467, lng: 80.9462 },
      population: 3600000,
      region: "North",
    },
    {
      name: "Kanpur",
      state: "Uttar Pradesh",
      coordinates: { lat: 26.4499, lng: 80.3319 },
      population: 3200000,
      region: "North",
    },
    {
      name: "Nagpur",
      state: "Maharashtra",
      coordinates: { lat: 21.1458, lng: 79.0882 },
      population: 2800000,
      region: "Central",
    },
    {
      name: "Indore",
      state: "Madhya Pradesh",
      coordinates: { lat: 22.7196, lng: 75.8577 },
      population: 2700000,
      region: "Central",
    },
    {
      name: "Thane",
      state: "Maharashtra",
      coordinates: { lat: 19.2183, lng: 72.9781 },
      population: 2600000,
      region: "West",
    },
    {
      name: "Bhopal",
      state: "Madhya Pradesh",
      coordinates: { lat: 23.2599, lng: 77.4126 },
      population: 2400000,
      region: "Central",
    },
    {
      name: "Visakhapatnam",
      state: "Andhra Pradesh",
      coordinates: { lat: 17.6868, lng: 83.2185 },
      population: 2200000,
      region: "South",
    },
    {
      name: "Patna",
      state: "Bihar",
      coordinates: { lat: 25.5941, lng: 85.1376 },
      population: 2000000,
      region: "East",
    },
    {
      name: "Vadodara",
      state: "Gujarat",
      coordinates: { lat: 22.3072, lng: 73.1812 },
      population: 1900000,
      region: "West",
    },
  ];

  static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  // Load Google Maps API
  async loadGoogleMapsAPI(): Promise<void> {
    if ((window as any).google && (window as any).google.maps) {
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places&language=en&region=IN`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API"));
      };

      document.head.appendChild(script);
    });
  }

  // Get all Indian cities
  getIndianCities(): IndianCity[] {
    return this.indianCities;
  }

  // Get cities by region
  getCitiesByRegion(region: string): IndianCity[] {
    return this.indianCities.filter((city) => city.region === region);
  }

  // Search cities by name
  searchCities(query: string): IndianCity[] {
    const lowercaseQuery = query.toLowerCase();
    return this.indianCities.filter(
      (city) =>
        city.name.toLowerCase().includes(lowercaseQuery) ||
        city.state.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get city by name
  getCityByName(name: string): IndianCity | undefined {
    return this.indianCities.find(
      (city) => city.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Geocode address using Google Maps API
  async geocodeAddress(
    address: string
  ): Promise<{ lat: number; lng: number } | null> {
    try {
      await this.loadGoogleMapsAPI();

      const geocoder = new (window as any).google.maps.Geocoder();

      return new Promise((resolve) => {
        geocoder.geocode(
          {
            address: address,
            region: "IN",
            componentRestrictions: { country: "IN" },
          },
          (results: any, status: any) => {
            if (status === "OK" && results && results[0]) {
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
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  }

  // Reverse geocode coordinates to address
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    try {
      await this.loadGoogleMapsAPI();

      const geocoder = new (window as any).google.maps.Geocoder();

      return new Promise((resolve) => {
        geocoder.geocode(
          { location: { lat, lng } },
          (results: any, status: any) => {
            if (status === "OK" && results && results[0]) {
              resolve(results[0].formatted_address);
            } else {
              resolve(null);
            }
          }
        );
      });
    } catch (error) {
      console.error("Reverse geocoding error:", error);
      return null;
    }
  }

  // Calculate distance between two points (Haversine formula)
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
    return R * c;
  }

  // Convert degrees to radians
  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get India center point
  getIndiaCenter(): { lat: number; lng: number } {
    return { lat: 20.5937, lng: 78.9629 };
  }

  // Get bounds for India
  getIndiaBounds(): {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  } {
    return {
      northeast: { lat: 35.5137, lng: 97.3953 },
      southwest: { lat: 6.4627, lng: 68.1097 },
    };
  }

  // Format Indian address for display
  formatIndianAddress(address: string): string {
    const parts = address.split(",").map((part) => part.trim());
    const filteredParts = parts.filter(
      (part) => !part.toLowerCase().includes("india") && part.length > 0
    );
    return filteredParts.slice(-3).join(", ");
  }

  // Get API key
  getApiKey(): string {
    return this.googleMapsApiKey;
  }

  // Create Google Map instance
  async createMap(
    container: HTMLElement,
    options: {
      center?: { lat: number; lng: number };
      zoom?: number;
      mapTypeId?: string;
    } = {}
  ): Promise<any> {
    await this.loadGoogleMapsAPI();

    const defaultOptions = {
      center: this.getIndiaCenter(),
      zoom: 5,
      mapTypeId: "roadmap",
      ...options,
    };

    return new (window as any).google.maps.Map(container, defaultOptions);
  }

  // Add marker to map
  addMarker(
    map: any,
    position: { lat: number; lng: number },
    options: {
      title?: string;
      icon?: string;
      clickable?: boolean;
    } = {}
  ): any {
    const markerOptions = {
      position,
      map,
      ...options,
    };

    return new (window as any).google.maps.Marker(markerOptions);
  }

  // Major Indian cities with coordinates
  private indianCities: IndianCity[] = [
    {
      name: "New Delhi",
      state: "Delhi",
      coordinates: { lat: 28.6139, lng: 77.209 },
      population: 32900000,
      region: "North",
    },
    {
      name: "Mumbai",
      state: "Maharashtra",
      coordinates: { lat: 19.076, lng: 72.8777 },
      population: 20700000,
      region: "West",
    },
    {
      name: "Bengaluru",
      state: "Karnataka",
      coordinates: { lat: 12.9716, lng: 77.5946 },
      population: 13200000,
      region: "South",
    },
    {
      name: "Chennai",
      state: "Tamil Nadu",
      coordinates: { lat: 13.0827, lng: 80.2707 },
      population: 11700000,
      region: "South",
    },
    {
      name: "Kolkata",
      state: "West Bengal",
      coordinates: { lat: 22.5726, lng: 88.3639 },
      population: 15100000,
      region: "East",
    },
    {
      name: "Hyderabad",
      state: "Telangana",
      coordinates: { lat: 17.385, lng: 78.4867 },
      population: 10500000,
      region: "South",
    },
    {
      name: "Pune",
      state: "Maharashtra",
      coordinates: { lat: 18.5204, lng: 73.8567 },
      population: 7400000,
      region: "West",
    },
    {
      name: "Ahmedabad",
      state: "Gujarat",
      coordinates: { lat: 23.0225, lng: 72.5714 },
      population: 8400000,
      region: "West",
    },
    {
      name: "Surat",
      state: "Gujarat",
      coordinates: { lat: 21.1702, lng: 72.8311 },
      population: 6600000,
      region: "West",
    },
    {
      name: "Jaipur",
      state: "Rajasthan",
      coordinates: { lat: 26.9124, lng: 75.7873 },
      population: 4200000,
      region: "North",
    },
    {
      name: "Lucknow",
      state: "Uttar Pradesh",
      coordinates: { lat: 26.8467, lng: 80.9462 },
      population: 3600000,
      region: "North",
    },
    {
      name: "Kanpur",
      state: "Uttar Pradesh",
      coordinates: { lat: 26.4499, lng: 80.3319 },
      population: 3200000,
      region: "North",
    },
    {
      name: "Nagpur",
      state: "Maharashtra",
      coordinates: { lat: 21.1458, lng: 79.0882 },
      population: 2800000,
      region: "Central",
    },
    {
      name: "Indore",
      state: "Madhya Pradesh",
      coordinates: { lat: 22.7196, lng: 75.8577 },
      population: 2700000,
      region: "Central",
    },
    {
      name: "Thane",
      state: "Maharashtra",
      coordinates: { lat: 19.2183, lng: 72.9781 },
      population: 2600000,
      region: "West",
    },
    {
      name: "Bhopal",
      state: "Madhya Pradesh",
      coordinates: { lat: 23.2599, lng: 77.4126 },
      population: 2400000,
      region: "Central",
    },
    {
      name: "Visakhapatnam",
      state: "Andhra Pradesh",
      coordinates: { lat: 17.6868, lng: 83.2185 },
      population: 2200000,
      region: "South",
    },
    {
      name: "Pimpri-Chinchwad",
      state: "Maharashtra",
      coordinates: { lat: 18.6298, lng: 73.7997 },
      population: 2100000,
      region: "West",
    },
    {
      name: "Patna",
      state: "Bihar",
      coordinates: { lat: 25.5941, lng: 85.1376 },
      population: 2000000,
      region: "East",
    },
    {
      name: "Vadodara",
      state: "Gujarat",
      coordinates: { lat: 22.3072, lng: 73.1812 },
      population: 1900000,
      region: "West",
    },
  ];

  static getInstance(): MapService {
    if (!MapService.instance) {
      MapService.instance = new MapService();
    }
    return MapService.instance;
  }

  // Initialize Google Maps
  async initializeGoogleMaps(): Promise<void> {
    if (typeof google !== "undefined" && google.maps) {
      this.geocoder = new google.maps.Geocoder();
      return Promise.resolve();
    }

    return new Promise((resolve, reject) => {
      const script = document.createElement("script");
      script.src = `https://maps.googleapis.com/maps/api/js?key=${this.googleMapsApiKey}&libraries=places&language=en&region=IN`;
      script.async = true;
      script.defer = true;

      script.onload = () => {
        this.geocoder = new google.maps.Geocoder();
        resolve();
      };

      script.onerror = () => {
        reject(new Error("Failed to load Google Maps API"));
      };

      document.head.appendChild(script);
    });
  }

  // Get all Indian cities
  getIndianCities(): IndianCity[] {
    return this.indianCities;
  }

  // Get cities by region
  getCitiesByRegion(region: string): IndianCity[] {
    return this.indianCities.filter((city) => city.region === region);
  }

  // Search cities by name
  searchCities(query: string): IndianCity[] {
    const lowercaseQuery = query.toLowerCase();
    return this.indianCities.filter(
      (city) =>
        city.name.toLowerCase().includes(lowercaseQuery) ||
        city.state.toLowerCase().includes(lowercaseQuery)
    );
  }

  // Get city by name
  getCityByName(name: string): IndianCity | undefined {
    return this.indianCities.find(
      (city) => city.name.toLowerCase() === name.toLowerCase()
    );
  }

  // Geocode address to coordinates
  async geocodeAddress(
    address: string
  ): Promise<{ lat: number; lng: number } | null> {
    if (!this.geocoder) {
      await this.initializeGoogleMaps();
    }

    return new Promise((resolve) => {
      if (!this.geocoder) {
        resolve(null);
        return;
      }

      this.geocoder.geocode(
        {
          address: address,
          region: "IN", // Bias towards India
          componentRestrictions: { country: "IN" },
        },
        (results, status) => {
          if (status === "OK" && results && results[0]) {
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

  // Reverse geocode coordinates to address
  async reverseGeocode(lat: number, lng: number): Promise<string | null> {
    if (!this.geocoder) {
      await this.initializeGoogleMaps();
    }

    return new Promise((resolve) => {
      if (!this.geocoder) {
        resolve(null);
        return;
      }

      this.geocoder.geocode({ location: { lat, lng } }, (results, status) => {
        if (status === "OK" && results && results[0]) {
          resolve(results[0].formatted_address);
        } else {
          resolve(null);
        }
      });
    });
  }

  // Get nearby places
  async getNearbyPlaces(
    lat: number,
    lng: number,
    type: string = "establishment",
    radius: number = 1000
  ): Promise<any[]> {
    if (!this.placesService) {
      await this.initializeGoogleMaps();
      // Create a temporary map element for PlacesService
      const tempDiv = document.createElement("div");
      const tempMap = new google.maps.Map(tempDiv);
      this.placesService = new google.maps.places.PlacesService(tempMap);
    }

    return new Promise((resolve) => {
      if (!this.placesService) {
        resolve([]);
        return;
      }

      const request = {
        location: new google.maps.LatLng(lat, lng),
        radius: radius,
        type: type,
      };

      this.placesService.nearbySearch(request, (results, status) => {
        if (status === google.maps.places.PlacesServiceStatus.OK && results) {
          resolve(results);
        } else {
          resolve([]);
        }
      });
    });
  }

  // Calculate distance between two points (Haversine formula)
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
    return R * c;
  }

  // Convert degrees to radians
  private degreesToRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }

  // Get India bounds for map fitting
  getIndiaBounds(): google.maps.LatLngBounds {
    // India's approximate bounds
    return new google.maps.LatLngBounds(
      new google.maps.LatLng(6.4627, 68.1097), // Southwest
      new google.maps.LatLng(35.5137, 97.3953) // Northeast
    );
  }

  // Create custom marker icon
  createCustomMarker(
    color: string = "#FF0000",
    size: number = 32
  ): google.maps.Icon {
    return {
      url: `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(`
        <svg width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5c-1.38 0-2.5-1.12-2.5-2.5s1.12-2.5 2.5-2.5 2.5 1.12 2.5 2.5-1.12 2.5-2.5 2.5z" fill="${color}"/>
        </svg>
      `)}`,
      scaledSize: new google.maps.Size(size, size),
      anchor: new google.maps.Point(size / 2, size),
    };
  }

  // Format Indian address for display
  formatIndianAddress(address: string): string {
    // Remove unnecessary parts and format for Indian context
    const parts = address.split(",").map((part) => part.trim());

    // Keep only relevant parts (remove country, etc.)
    const filteredParts = parts.filter(
      (part) => !part.toLowerCase().includes("india") && part.length > 0
    );

    return filteredParts.slice(-3).join(", "); // Keep last 3 parts
  }

  // Get API key (for components that need it)
  getApiKey(): string {
    return this.googleMapsApiKey;
  }
}

export default MapService;
