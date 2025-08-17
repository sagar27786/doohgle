import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

// Location data interfaces
export interface LocationData {
  id?: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  formatted_address?: string;
  location_source?: string;
  location_type?: string;
  is_active?: boolean;
  is_primary?: boolean;
  created_at?: string;
  updated_at?: string;
  last_accessed?: string;
}

export interface NearbyLocation {
  user_id: number;
  latitude: number;
  longitude: number;
  city?: string;
  distance: number;
}

export interface LocationHistory {
  id: number;
  latitude: number;
  longitude: number;
  accuracy?: number;
  city?: string;
  state?: string;
  country?: string;
  location_source?: string;
  created_at: string;
}

export interface AddressComponents {
  house_number?: string;
  road?: string;
  neighbourhood?: string;
  suburb?: string;
  city?: string;
  district?: string;
  state?: string;
  country?: string;
  country_code?: string;
  postcode?: string;
}

export interface ReverseGeocodeResult {
  formatted_address: string;
  street_address?: string;
  city?: string;
  state?: string;
  country?: string;
  postal_code?: string;
  components: AddressComponents;
}

class LocationService {
  private getAuthHeader() {
    const token = localStorage.getItem("token");
    return token ? { Authorization: `Bearer ${token}` } : {};
  }

  // Get user's current location from database
  async getUserLocation(): Promise<{
    locations: LocationData[];
    primary: LocationData;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/current`, {
        headers: this.getAuthHeader(),
      });
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch user location"
      );
    }
  }

  // Update user location in database
  async updateUserLocation(locationData: {
    latitude: number;
    longitude: number;
    accuracy?: number;
    city?: string;
    state?: string;
    country?: string;
    formattedAddress?: string;
    locationSource?: string;
    locationType?: string;
  }): Promise<LocationData> {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/locations/update`,
        locationData,
        {
          headers: {
            ...this.getAuthHeader(),
            "Content-Type": "application/json",
          },
        }
      );
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to update location"
      );
    }
  }

  // Get nearby locations
  async getNearbyLocations(
    latitude: number,
    longitude: number,
    radius: number = 10
  ): Promise<{
    locations: NearbyLocation[];
    center: { latitude: number; longitude: number };
    radius: number;
    count: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/nearby`, {
        params: { latitude, longitude, radius },
      });
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch nearby locations"
      );
    }
  }

  // Reverse geocoding - get address from coordinates
  async reverseGeocode(
    latitude: number,
    longitude: number
  ): Promise<ReverseGeocodeResult> {
    try {
      const response = await axios.get(
        `${API_BASE_URL}/locations/reverse-geocode`,
        {
          params: { latitude, longitude },
        }
      );
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Reverse geocoding failed"
      );
    }
  }

  // Get location history
  async getLocationHistory(
    limit: number = 50,
    offset: number = 0
  ): Promise<{
    history: LocationHistory[];
    pagination: {
      total: number;
      limit: number;
      offset: number;
      has_more: boolean;
    };
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/history`, {
        params: { limit, offset },
        headers: this.getAuthHeader(),
      });
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch location history"
      );
    }
  }

  // Delete a location
  async deleteLocation(locationId: number): Promise<void> {
    try {
      await axios.delete(`${API_BASE_URL}/locations/${locationId}`, {
        headers: this.getAuthHeader(),
      });
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to delete location"
      );
    }
  }

  // Get public locations for map visualization
  async getPublicLocations(): Promise<{
    locations: Array<{
      latitude: number;
      longitude: number;
      city?: string;
      state?: string;
      country?: string;
      location_type?: string;
      user_count: number;
    }>;
    total: number;
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/public`);
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch public locations"
      );
    }
  }

  // Get location statistics
  async getLocationStats(): Promise<{
    locations: {
      total_locations: number;
      active_locations: number;
      current_locations: number;
      home_locations: number;
      work_locations: number;
      avg_accuracy: number;
    };
    history: {
      total_history_entries: number;
      unique_days: number;
      first_location: string;
      last_location: string;
    };
  }> {
    try {
      const response = await axios.get(`${API_BASE_URL}/locations/stats`, {
        headers: this.getAuthHeader(),
      });
      return (response.data as any).data;
    } catch (error: any) {
      throw new Error(
        error.response?.data?.message || "Failed to fetch location statistics"
      );
    }
  }

  // Helper method to get current location and save to database
  async getCurrentLocationAndSave(
    locationType: string = "current",
    locationSource: string = "gps"
  ): Promise<LocationData> {
    try {
      // Get current position from browser
      const position = await new Promise<GeolocationPosition>(
        (resolve, reject) => {
          navigator.geolocation.getCurrentPosition(resolve, reject, {
            enableHighAccuracy: true,
            timeout: 15000,
            maximumAge: 300000,
          });
        }
      );

      const { latitude, longitude, accuracy } = position.coords;

      // Try to get address through reverse geocoding
      let addressData: Partial<ReverseGeocodeResult> = {};
      try {
        addressData = await this.reverseGeocode(latitude, longitude);
      } catch (error) {
        console.warn(
          "Reverse geocoding failed, saving without address:",
          error
        );
      }

      // Save to database
      return await this.updateUserLocation({
        latitude,
        longitude,
        accuracy: accuracy || undefined,
        city: addressData.city,
        state: addressData.state,
        country: addressData.country || "India",
        formattedAddress: addressData.formatted_address,
        locationSource,
        locationType,
      });
    } catch (error: any) {
      if (error.code === 1) {
        // PERMISSION_DENIED
        throw new Error(
          "Location access denied. Please enable location permissions."
        );
      } else if (error.code === 2) {
        // POSITION_UNAVAILABLE
        throw new Error("Location information unavailable.");
      } else if (error.code === 3) {
        // TIMEOUT
        throw new Error("Location request timed out.");
      } else {
        throw new Error(error.message || "Failed to get current location");
      }
    }
  }

  // Format location for display
  formatLocationDisplay(location: LocationData): string {
    if (location.formatted_address) {
      return location.formatted_address;
    }

    const parts = [location.city, location.state, location.country].filter(
      Boolean
    );

    return parts.length > 0
      ? parts.join(", ")
      : `${location.latitude.toFixed(6)}, ${location.longitude.toFixed(6)}`;
  }

  // Calculate distance between two locations
  calculateDistance(
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number {
    const R = 6371; // Earth's radius in km
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  private toRadians(degrees: number): number {
    return degrees * (Math.PI / 180);
  }
}

export default new LocationService();
