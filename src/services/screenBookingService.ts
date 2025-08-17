// Screen Booking Service Integration
import axios from "axios";

const API_BASE_URL = "http://localhost:4000/api";

export interface Screen {
  id: number;
  name: string;
  location_name: string;
  city: string;
  state: string;
  screen_type: string;
  cost_per_10_seconds: number;
  daily_footfall: number;
  is_active: boolean;
}

export interface BookingRequest {
  screen_id: number;
  start_date: string;
  end_date: string;
  campaign_id?: number;
  total_amount: number;
  booking_hours: number[];
  content_url?: string;
  notes?: string;
}

export interface Booking {
  id: number;
  screen_id: number;
  advertiser_id: number;
  campaign_id?: number;
  start_date: string;
  end_date: string;
  total_amount: number;
  status: "pending" | "confirmed" | "active" | "completed" | "cancelled";
  booking_hours: number[];
  content_url?: string;
  notes?: string;
  created_at: string;
  screen_name?: string;
  location_name?: string;
  city?: string;
  state?: string;
}

class ScreenBookingService {
  private getAuthHeaders() {
    const token = localStorage.getItem("token");
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    };
  }

  // Check if a screen is available for booking
  async checkAvailability(
    screenId: number,
    startDate: string,
    endDate: string,
    bookingHours?: number[]
  ) {
    try {
      const params = new URLSearchParams({
        screen_id: screenId.toString(),
        start_date: startDate,
        end_date: endDate,
      });

      if (bookingHours) {
        params.append("booking_hours", JSON.stringify(bookingHours));
      }

      const response = await axios.get(
        `${API_BASE_URL}/bookings/availability?${params}`
      );
      return response.data;
    } catch (error) {
      console.error("Error checking availability:", error);
      throw error;
    }
  }

  // Create a new booking
  async createBooking(bookingData: BookingRequest) {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/bookings`,
        bookingData,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error creating booking:", error);
      throw error;
    }
  }

  // Get user's bookings
  async getMyBookings(status?: string, limit = 50, offset = 0) {
    try {
      const params = new URLSearchParams({
        limit: limit.toString(),
        offset: offset.toString(),
      });

      if (status && status !== "all") {
        params.append("status", status);
      }

      const response = await axios.get(
        `${API_BASE_URL}/bookings/my-bookings?${params}`,
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error fetching bookings:", error);
      throw error;
    }
  }

  // Cancel a booking
  async cancelBooking(bookingId: number, reason?: string) {
    try {
      const response = await axios.patch(
        `${API_BASE_URL}/bookings/${bookingId}/cancel`,
        { reason },
        { headers: this.getAuthHeaders() }
      );
      return response.data;
    } catch (error) {
      console.error("Error cancelling booking:", error);
      throw error;
    }
  }

  // Get screens with availability info
  async getAvailableScreens(
    city?: string,
    startDate?: string,
    endDate?: string
  ) {
    try {
      const params = new URLSearchParams();
      if (city) params.append("city", city);
      if (startDate) params.append("start_date", startDate);
      if (endDate) params.append("end_date", endDate);

      const response = await axios.get(`${API_BASE_URL}/screens?${params}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching available screens:", error);
      throw error;
    }
  }

  // Calculate booking cost
  calculateBookingCost(
    screen: Screen,
    startDate: string,
    endDate: string,
    selectedHours: number[]
  ): number {
    if (!startDate || !endDate || selectedHours.length === 0) return 0;

    const start = new Date(startDate);
    const end = new Date(endDate);
    const daysDiff =
      Math.ceil((end.getTime() - start.getTime()) / (1000 * 60 * 60 * 24)) + 1;

    // Cost calculation: hours per day * days * cost per 10 seconds * 360 (10-second slots per hour)
    const totalAmount =
      selectedHours.length * daysDiff * screen.cost_per_10_seconds * 360;

    return Math.round(totalAmount * 100) / 100;
  }

  // Format currency for display
  formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  }

  // Validate booking data
  validateBookingData(bookingData: BookingRequest): {
    isValid: boolean;
    errors: string[];
  } {
    const errors: string[] = [];

    if (!bookingData.screen_id) {
      errors.push("Screen ID is required");
    }

    if (!bookingData.start_date) {
      errors.push("Start date is required");
    }

    if (!bookingData.end_date) {
      errors.push("End date is required");
    }

    if (bookingData.start_date && bookingData.end_date) {
      const startDate = new Date(bookingData.start_date);
      const endDate = new Date(bookingData.end_date);
      const today = new Date();
      today.setHours(0, 0, 0, 0);

      if (startDate < today) {
        errors.push("Start date cannot be in the past");
      }

      if (endDate < startDate) {
        errors.push("End date cannot be before start date");
      }
    }

    if (!bookingData.booking_hours || bookingData.booking_hours.length === 0) {
      errors.push("At least one time slot must be selected");
    }

    if (!bookingData.total_amount || bookingData.total_amount <= 0) {
      errors.push("Total amount must be greater than 0");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // Get booking status color
  getStatusColor(status: string): string {
    switch (status) {
      case "pending":
        return "text-yellow-600 bg-yellow-100 border-yellow-200";
      case "confirmed":
        return "text-blue-600 bg-blue-100 border-blue-200";
      case "active":
        return "text-green-600 bg-green-100 border-green-200";
      case "completed":
        return "text-gray-600 bg-gray-100 border-gray-200";
      case "cancelled":
        return "text-red-600 bg-red-100 border-red-200";
      default:
        return "text-gray-600 bg-gray-100 border-gray-200";
    }
  }

  // Get time slots for display
  getTimeSlots() {
    return [
      { hour: 6, label: "6:00 AM" },
      { hour: 7, label: "7:00 AM" },
      { hour: 8, label: "8:00 AM" },
      { hour: 9, label: "9:00 AM" },
      { hour: 10, label: "10:00 AM" },
      { hour: 11, label: "11:00 AM" },
      { hour: 12, label: "12:00 PM" },
      { hour: 13, label: "1:00 PM" },
      { hour: 14, label: "2:00 PM" },
      { hour: 15, label: "3:00 PM" },
      { hour: 16, label: "4:00 PM" },
      { hour: 17, label: "5:00 PM" },
      { hour: 18, label: "6:00 PM" },
      { hour: 19, label: "7:00 PM" },
      { hour: 20, label: "8:00 PM" },
      { hour: 21, label: "9:00 PM" },
      { hour: 22, label: "10:00 PM" },
    ];
  }
}

export const screenBookingService = new ScreenBookingService();
