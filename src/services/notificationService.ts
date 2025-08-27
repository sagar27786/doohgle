// Notification Service for Booking Requests
interface BookingRequest {
  id: string;
  screenName: string;
  requesterName: string;
  amount: number;
  duration: string;
  status: "pending" | "accepted" | "rejected";
  timestamp: Date;
}

interface PaymentNotification {
  id: string;
  type: "payment_required";
  bookingId: string;
  amount: number;
  screenName: string;
  timestamp: Date;
}

class NotificationService {
  private static instance: NotificationService;
  private bookingRequests: BookingRequest[] = [];
  private paymentNotifications: PaymentNotification[] = [];
  private listeners: (() => void)[] = [];

  static getInstance(): NotificationService {
    if (!NotificationService.instance) {
      NotificationService.instance = new NotificationService();
    }
    return NotificationService.instance;
  }

  // Add a new booking request
  addBookingRequest(
    request: Omit<BookingRequest, "id" | "status" | "timestamp">
  ) {
    const newRequest: BookingRequest = {
      ...request,
      id: Date.now().toString(),
      status: "pending",
      timestamp: new Date(),
    };

    this.bookingRequests.push(newRequest);
    this.notifyListeners();

    return newRequest.id;
  }

  // Screen manager actions
  acceptBookingRequest(requestId: string) {
    const request = this.bookingRequests.find((r) => r.id === requestId);
    if (request && request.status === "pending") {
      request.status = "accepted";

      // Create payment notification
      const paymentNotification: PaymentNotification = {
        id: Date.now().toString(),
        type: "payment_required",
        bookingId: requestId,
        amount: request.amount,
        screenName: request.screenName,
        timestamp: new Date(),
      };

      this.paymentNotifications.push(paymentNotification);

      // Remove the accepted request after a short delay to show feedback
      setTimeout(() => {
        this.bookingRequests = this.bookingRequests.filter(
          (r) => r.id !== requestId
        );
        this.notifyListeners();
      }, 1500);

      this.notifyListeners();

      console.log("Booking request accepted:", requestId);
      console.log("Payment notification created:", paymentNotification);
    }
  }

  rejectBookingRequest(requestId: string) {
    const request = this.bookingRequests.find((r) => r.id === requestId);
    if (request && request.status === "pending") {
      request.status = "rejected";

      // Remove the rejected request after a short delay to show feedback
      setTimeout(() => {
        this.bookingRequests = this.bookingRequests.filter(
          (r) => r.id !== requestId
        );
        this.notifyListeners();
      }, 1500);

      this.notifyListeners();

      console.log("Booking request rejected:", requestId);
    }
  }

  // Get booking requests (for screen manager) - include all to show status changes
  getPendingBookingRequests(): BookingRequest[] {
    return this.bookingRequests; // Return all requests to show status updates
  }

  // Get payment notifications (for ads manager/buyer)
  getPaymentNotifications(): PaymentNotification[] {
    return this.paymentNotifications.filter(
      (n) => n.type === "payment_required"
    );
  }

  // Remove payment notification after payment
  markPaymentComplete(notificationId: string) {
    this.paymentNotifications = this.paymentNotifications.filter(
      (n) => n.id !== notificationId
    );
    // Trigger screen refresh for campaign workflow
    this.notifyListeners();
    console.log(
      "Payment completed, triggering screen refresh:",
      notificationId
    );
  }

  // Subscribe to notifications
  subscribe(callback: () => void) {
    this.listeners.push(callback);
    return () => {
      this.listeners = this.listeners.filter((l) => l !== callback);
    };
  }

  private notifyListeners() {
    this.listeners.forEach((callback) => callback());
  }

  // Debug method - add test booking requests
  addTestBookingRequest() {
    const testRequest = {
      screenName: `Test Screen ${Date.now()}`,
      requesterName: "Test Ads Manager",
      amount: 5000,
      duration: "7 days",
    };

    return this.addBookingRequest(testRequest);
  }
}

export default NotificationService;
export type { BookingRequest, PaymentNotification };
