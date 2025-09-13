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

// Enhanced location details interface for comprehensive information
export interface LocationDetails {
  coordinates: {
    lat: number;
    lng: number;
  };
  formattedAddress: string;
  addressComponents: {
    streetNumber?: string;
    route?: string;
    locality?: string;
    subLocality?: string;
    administrativeAreaLevel1?: string; // State
    administrativeAreaLevel2?: string; // District
    country?: string;
    postalCode?: string;
  };
  placeInfo: {
    placeId?: string;
    name?: string;
    types?: string[];
    businessStatus?: string;
    rating?: number;
    userRatingsTotal?: number;
  };
  locationContext: {
    nearestCity?: IndianCity;
    distanceFromNearestCity?: number;
    timezone?: string;
    region?: string;
    climate?: string;
  };
  mapDisplay: {
    zoom: number;
    mapType: string;
    showTraffic: boolean;
    showTransit: boolean;
  };
}

// Interface for search suggestions with enhanced details
export interface LocationSuggestion {
  placeId: string;
  description: string;
  mainText: string;
  secondaryText: string;
  types: string[];
  coordinates?: {
    lat: number;
    lng: number;
  };
}

// Google Maps API configuration
const GOOGLE_MAPS_API_KEY = "AIzaSyC4iDxiFxsSsVvJ0R-WEFwCwCMQ5ow0ZZ8";

class GoogleMapService {
  private static instance: GoogleMapService;
  private isLoaded: boolean = false;
  private loadingPromise: Promise<void> | null = null;

  private constructor() {}

  static getInstance(): GoogleMapService {
    if (!GoogleMapService.instance) {
      GoogleMapService.instance = new GoogleMapService();
    }
    return GoogleMapService.instance;
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

  getIndiaCenter(): { lat: number; lng: number } {
    return { lat: 20.5937, lng: 78.9629 }; // Geographic center of India
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

  // Enhanced method to get comprehensive location details
  async getLocationDetails(input: string): Promise<LocationDetails | null> {
    if (!this.isGoogleMapsLoaded()) {
      await this.loadGoogleMapsAPI();
    }

    try {
      // First try to geocode the input
      const geocodingResult = await this.geocodeAddress(input);
      if (!geocodingResult) return null;

      const { lat, lng } = geocodingResult;

      // Get detailed place information using Places API
      const placeDetails = await this.getPlaceDetails(input);

      // Get reverse geocoding for address components
      const addressInfo = await this.getReverseGeocodeDetails(lat, lng);

      // Find nearest Indian city
      const nearestCity = this.findNearestIndianCity(lat, lng);
      const distanceToNearestCity = nearestCity
        ? this.calculateDistance(
            lat,
            lng,
            nearestCity.coordinates.lat,
            nearestCity.coordinates.lng
          )
        : undefined;

      // Determine region and context
      const region = this.determineRegionFromCoordinates(lat, lng);
      const climate = this.getClimateInfo(region);

      const locationDetails: LocationDetails = {
        coordinates: { lat, lng },
        formattedAddress:
          addressInfo.formattedAddress ||
          `${lat.toFixed(6)}, ${lng.toFixed(6)}`,
        addressComponents: addressInfo.addressComponents || {},
        placeInfo: placeDetails || {},
        locationContext: {
          nearestCity: nearestCity || undefined,
          distanceFromNearestCity: distanceToNearestCity,
          timezone: "Asia/Kolkata", // Default for India
          region,
          climate,
        },
        mapDisplay: {
          zoom: this.getOptimalZoom(placeDetails?.types || []),
          mapType: "roadmap",
          showTraffic: true,
          showTransit: true,
        },
      };

      return locationDetails;
    } catch (error) {
      console.error("Error getting location details:", error);
      return null;
    }
  }

  // Get location suggestions with enhanced details
  async getLocationSuggestions(query: string): Promise<LocationSuggestion[]> {
    if (!this.isGoogleMapsLoaded()) {
      await this.loadGoogleMapsAPI();
    }

    return new Promise((resolve) => {
      const service = new (
        window as any
      ).google.maps.places.AutocompleteService();

      service.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "IN" },
          types: ["geocode", "establishment"],
          fields: ["place_id", "description", "structured_formatting", "types"],
        },
        (predictions: any[], status: string) => {
          if (
            status ===
              (window as any).google.maps.places.PlacesServiceStatus.OK &&
            predictions
          ) {
            const suggestions: LocationSuggestion[] = predictions.map(
              (prediction) => ({
                placeId: prediction.place_id,
                description: prediction.description,
                mainText: prediction.structured_formatting.main_text,
                secondaryText:
                  prediction.structured_formatting.secondary_text || "",
                types: prediction.types || [],
              })
            );
            resolve(suggestions);
          } else {
            resolve([]);
          }
        }
      );
    });
  }

  // Get detailed place information
  private async getPlaceDetails(query: string): Promise<any> {
    return new Promise((resolve) => {
      const service = new (window as any).google.maps.places.PlacesService(
        document.createElement("div")
      );

      // First get place predictions
      const autocompleteService = new (
        window as any
      ).google.maps.places.AutocompleteService();

      autocompleteService.getPlacePredictions(
        {
          input: query,
          componentRestrictions: { country: "IN" },
        },
        (predictions: any[], status: string) => {
          if (
            status ===
              (window as any).google.maps.places.PlacesServiceStatus.OK &&
            predictions?.length > 0
          ) {
            const placeId = predictions[0].place_id;

            service.getDetails(
              {
                placeId: placeId,
                fields: [
                  "place_id",
                  "name",
                  "types",
                  "business_status",
                  "rating",
                  "user_ratings_total",
                ],
              },
              (place: any, detailsStatus: string) => {
                if (
                  detailsStatus ===
                  (window as any).google.maps.places.PlacesServiceStatus.OK
                ) {
                  resolve({
                    placeId: place.place_id,
                    name: place.name,
                    types: place.types,
                    businessStatus: place.business_status,
                    rating: place.rating,
                    userRatingsTotal: place.user_ratings_total,
                  });
                } else {
                  resolve({});
                }
              }
            );
          } else {
            resolve({});
          }
        }
      );
    });
  }

  // Enhanced reverse geocoding with detailed address components
  // Public method for reverse geocoding with detailed address information
  async getReverseGeocodeDetails(lat: number, lng: number): Promise<any> {
    return new Promise((resolve) => {
      const geocoder = new (window as any).google.maps.Geocoder();

      geocoder.geocode(
        { location: { lat, lng } },
        (results: any[], status: string) => {
          if (status === "OK" && results?.length > 0) {
            const result = results[0];
            const addressComponents: any = {};

            result.address_components?.forEach((component: any) => {
              const types = component.types;
              if (types.includes("street_number")) {
                addressComponents.streetNumber = component.long_name;
              }
              if (types.includes("route")) {
                addressComponents.route = component.long_name;
              }
              if (types.includes("locality")) {
                addressComponents.locality = component.long_name;
              }
              if (types.includes("sublocality")) {
                addressComponents.subLocality = component.long_name;
              }
              if (types.includes("administrative_area_level_1")) {
                addressComponents.administrativeAreaLevel1 =
                  component.long_name;
              }
              if (types.includes("administrative_area_level_2")) {
                addressComponents.administrativeAreaLevel2 =
                  component.long_name;
              }
              if (types.includes("country")) {
                addressComponents.country = component.long_name;
              }
              if (types.includes("postal_code")) {
                addressComponents.postalCode = component.long_name;
              }
            });

            resolve({
              formattedAddress: result.formatted_address,
              addressComponents,
            });
          } else {
            resolve({});
          }
        }
      );
    });
  }

  // Find the nearest Indian city to given coordinates
  private findNearestIndianCity(lat: number, lng: number): IndianCity | null {
    let nearestCity: IndianCity | null = null;
    let minDistance = Infinity;

    this.indianCities.forEach((city) => {
      const distance = this.calculateDistance(
        lat,
        lng,
        city.coordinates.lat,
        city.coordinates.lng
      );
      if (distance < minDistance) {
        minDistance = distance;
        nearestCity = city;
      }
    });

    return nearestCity;
  }

  // Determine region from coordinates
  private determineRegionFromCoordinates(lat: number, lng: number): string {
    // North India
    if (lat > 26 && lng > 74 && lng < 85) return "North";
    // South India
    if (lat < 20 && lng > 74 && lng < 85) return "South";
    // East India
    if (lat > 20 && lng > 85) return "East";
    // West India
    if (lng < 76) return "West";
    // Central India
    return "Central";
  }

  // Get climate information based on region
  private getClimateInfo(region: string): string {
    const climateMap: { [key: string]: string } = {
      North: "Continental climate with hot summers and cold winters",
      South: "Tropical climate with high temperatures and monsoon rains",
      East: "Humid subtropical climate with heavy monsoons",
      West: "Arid to semi-arid climate with hot, dry summers",
      Central: "Tropical climate with distinct wet and dry seasons",
    };
    return climateMap[region] || "Varied climate conditions";
  }

  // Get optimal zoom level based on location type
  private getOptimalZoom(types: string[]): number {
    // Country level
    if (types.includes("country")) return 5;
    // State/Province level
    if (types.includes("administrative_area_level_1")) return 7;
    // City level
    if (
      types.includes("locality") ||
      types.includes("administrative_area_level_2")
    )
      return 11;
    // Neighborhood level
    if (types.includes("sublocality") || types.includes("neighborhood"))
      return 14;
    // Street level
    if (types.includes("route") || types.includes("street_address")) return 16;
    // Establishment level
    if (types.includes("establishment") || types.includes("point_of_interest"))
      return 18;

    // Default zoom for general searches
    return 13;
  }

  // Enhanced search with location context
  async searchLocationsWithContext(query: string): Promise<LocationDetails[]> {
    const suggestions = await this.getLocationSuggestions(query);
    const results: LocationDetails[] = [];

    for (const suggestion of suggestions.slice(0, 5)) {
      // Limit to 5 results
      const details = await this.getLocationDetails(suggestion.description);
      if (details) {
        results.push(details);
      }
    }

    return results;
  }

  // Get location info for map display
  getMapDisplayConfig(locationDetails: LocationDetails): any {
    return {
      center: locationDetails.coordinates,
      zoom: locationDetails.mapDisplay.zoom,
      mapTypeId: locationDetails.mapDisplay.mapType,
      options: {
        styles: this.getIndianMapStyles(),
        disableDefaultUI: false,
        zoomControl: true,
        streetViewControl: true,
        fullscreenControl: true,
        mapTypeControl: true,
      },
      layers: {
        traffic: locationDetails.mapDisplay.showTraffic,
        transit: locationDetails.mapDisplay.showTransit,
      },
    };
  }

  // Custom map styles for Indian context
  private getIndianMapStyles(): any[] {
    return [
      {
        featureType: "water",
        elementType: "geometry",
        stylers: [{ color: "#a2daf2" }],
      },
      {
        featureType: "landscape.man_made",
        elementType: "geometry",
        stylers: [{ color: "#f7f1df" }],
      },
      {
        featureType: "landscape.natural",
        elementType: "geometry",
        stylers: [{ color: "#d0e3b4" }],
      },
    ];
  }
}

export default GoogleMapService;
