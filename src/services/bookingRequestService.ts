// Booking Requests Service for Screen Manager
// Handles fetching and managing booking requests for venue owners

interface BookingRequest {
  id: string;
  booking_id: number;
  title: string;
  message: string;
  customer_name: string;
  customer_email: string;
  company_name?: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  urgency: "low" | "medium" | "high";
  booking_status: "pending" | "accepted" | "rejected";
  created_at: string;
  data: any;
}

interface AcceptBookingParams {
  bookingId: number;
  screenId: number;
}

export class BookingRequestService {
  private static readonly API_BASE = "http://localhost:4000/api";

  /**
   * Get booking requests for the current venue owner
   */
  static async getBookingRequests(): Promise<BookingRequest[]> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      const response = await fetch(`${this.API_BASE}/bookings/requests`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();

      if (result.success) {
        console.log(`📬 Fetched ${result.count} booking requests`);
        return result.requests || [];
      } else {
        throw new Error(result.message || "Failed to fetch booking requests");
      }
    } catch (error) {
      console.error("Error fetching booking requests:", error);
      throw error;
    }
  }

  /**
   * Accept a booking request
   */
  static async acceptBookingRequest(params: AcceptBookingParams): Promise<any> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      console.log(
        `✅ Accepting booking ${params.bookingId} with screen ${params.screenId}`
      );

      const response = await fetch(
        `${this.API_BASE}/bookings/${params.bookingId}/accept`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            screenId: params.screenId,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success) {
        console.log(`🎉 Booking ${params.bookingId} accepted successfully`);
        return result;
      } else {
        throw new Error(result.error || "Failed to accept booking");
      }
    } catch (error) {
      console.error("Error accepting booking:", error);
      throw error;
    }
  }

  /**
   * Reject a booking request
   */
  static async rejectBookingRequest(
    bookingId: number,
    reason?: string
  ): Promise<any> {
    try {
      const token = localStorage.getItem("authToken");
      if (!token) {
        throw new Error("Authentication required");
      }

      console.log(`❌ Rejecting booking ${bookingId}`);

      const response = await fetch(
        `${this.API_BASE}/bookings/${bookingId}/reject`,
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            reason: reason || "No reason provided",
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const result = await response.json();

      if (result.success) {
        console.log(`🚫 Booking ${bookingId} rejected successfully`);
        return result;
      } else {
        throw new Error(result.error || "Failed to reject booking");
      }
    } catch (error) {
      console.error("Error rejecting booking:", error);
      throw error;
    }
  }

  /**
   * Get urgency color for UI display
   */
  static getUrgencyColor(urgency: string): string {
    switch (urgency) {
      case "high":
        return "text-red-600 bg-red-50 border-red-200";
      case "medium":
        return "text-yellow-600 bg-yellow-50 border-yellow-200";
      case "low":
        return "text-green-600 bg-green-50 border-green-200";
      default:
        return "text-gray-600 bg-gray-50 border-gray-200";
    }
  }

  /**
   * Format currency for display
   */
  static formatCurrency(amount: number): string {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  }

  /**
   * Format date for display
   */
  static formatDate(dateString: string): string {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  }

  /**
   * Calculate booking duration in days
   */
  static calculateDuration(startDate: string, endDate: string): number {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  }
}

export type { BookingRequest, AcceptBookingParams };
