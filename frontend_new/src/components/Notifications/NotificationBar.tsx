import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Bell, Check, X, CreditCard, AlertCircle } from "lucide-react";
import NotificationService, {
  BookingRequest,
  PaymentNotification,
} from "../../services/notificationService";

interface NotificationBarProps {
  userType: "screen_manager" | "ads_manager";
}

const NotificationBar: React.FC<NotificationBarProps> = ({ userType }) => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [paymentNotifications, setPaymentNotifications] = useState<
    PaymentNotification[]
  >([]);
  const [showNotifications, setShowNotifications] = useState(false);

  // Test function to add sample data
  const addTestData = () => {
    const notificationService = NotificationService.getInstance();
    if (userType === "screen_manager") {
      notificationService.addTestBookingRequest();
      console.log("Added test booking request");
    } else {
      // Add test payment notification for ads manager
      const testPayment = {
        id: Date.now().toString(),
        type: "payment_required" as const,
        bookingId: "test-booking-" + Date.now(),
        amount: 7500,
        screenName: "Test Screen Downtown",
        timestamp: new Date(),
      };
      notificationService["paymentNotifications"].push(testPayment);
      notificationService["notifyListeners"]();
      console.log("Added test payment notification");
    }
  };

  useEffect(() => {
    const notificationService = NotificationService.getInstance();

    const updateNotifications = () => {
      if (userType === "screen_manager") {
        const requests = notificationService.getPendingBookingRequests();
        console.log("Screen manager notifications updated:", requests);
        setBookingRequests(requests);
      } else {
        const payments = notificationService.getPaymentNotifications();
        console.log("Ads manager notifications updated:", payments);
        setPaymentNotifications(payments);
      }
    };

    // Initial load
    updateNotifications();

    // Subscribe to changes
    const unsubscribe = notificationService.subscribe(updateNotifications);

    return unsubscribe;
  }, [userType]);

  const handleAcceptBooking = (requestId: string) => {
    console.log("Accepting booking request:", requestId);
    const notificationService = NotificationService.getInstance();
    notificationService.acceptBookingRequest(requestId);
    console.log("Accept booking request called");
  };

  const handleRejectBooking = (requestId: string) => {
    console.log("Rejecting booking request:", requestId);
    const notificationService = NotificationService.getInstance();
    notificationService.rejectBookingRequest(requestId);
    console.log("Reject booking request called");
  };

  const handlePayment = (notificationId: string, amount: number) => {
    // Simulate payment processing
    alert(`Processing payment of ₹${amount.toLocaleString()}...`);

    setTimeout(() => {
      const notificationService = NotificationService.getInstance();
      notificationService.markPaymentComplete(notificationId);
      alert("Payment successful!");
    }, 2000);
  };

  const totalNotifications =
    userType === "screen_manager"
      ? bookingRequests.filter((r) => r.status === "pending").length
      : paymentNotifications.length;

  return (
    <div className="relative">
      {/* Development Test Button */}
      {process.env.NODE_ENV === "development" && (
        <button
          onClick={addTestData}
          className="mr-2 px-2 py-1 bg-blue-500 text-white text-xs rounded hover:bg-blue-600"
          title="Add test notification"
        >
          Test
        </button>
      )}

      {/* Notification Bell */}
      <motion.button
        className="relative p-2 text-gray-600 hover:text-gray-800 hover:bg-gray-100 rounded-full transition-colors"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => setShowNotifications(!showNotifications)}
      >
        <Bell size={24} />
        {totalNotifications > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-medium"
          >
            {totalNotifications}
          </motion.span>
        )}
      </motion.button>

      {/* Notifications Dropdown */}
      <AnimatePresence>
        {showNotifications && (
          <motion.div
            initial={{ opacity: 0, y: -10, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -10, scale: 0.95 }}
            className="absolute right-0 top-full mt-2 w-80 bg-white rounded-lg shadow-xl border border-gray-200 z-50"
          >
            <div className="p-4 border-b border-gray-100">
              <h3 className="font-semibold text-gray-900">
                {userType === "screen_manager"
                  ? "Booking Requests"
                  : "Payment Notifications"}
              </h3>
            </div>

            <div className="max-h-96 overflow-y-auto">
              {userType === "screen_manager" ? (
                // Screen Manager Notifications
                <>
                  {bookingRequests.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No pending booking requests
                    </div>
                  ) : (
                    bookingRequests.map((request) => (
                      <motion.div
                        key={request.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-medium text-gray-900">
                                New booking request for {request.screenName}
                              </p>
                              {request.status !== "pending" && (
                                <span
                                  className={`px-2 py-1 rounded text-xs font-medium ${
                                    request.status === "accepted"
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {request.status.charAt(0).toUpperCase() +
                                    request.status.slice(1)}
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mt-1">
                              By: {request.requesterName}
                            </p>
                            <p className="text-sm text-gray-600">
                              Amount: ₹{request.amount.toLocaleString()} •{" "}
                              {request.duration}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {request.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        {request.status === "pending" && (
                          <div className="flex space-x-2 mt-3">
                            <motion.button
                              className="flex items-center space-x-1 bg-green-600 text-white px-3 py-1 rounded text-sm hover:bg-green-700 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleAcceptBooking(request.id)}
                            >
                              <Check size={14} />
                              <span>Accept</span>
                            </motion.button>
                            <motion.button
                              className="flex items-center space-x-1 bg-red-600 text-white px-3 py-1 rounded text-sm hover:bg-red-700 transition-colors"
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRejectBooking(request.id)}
                            >
                              <X size={14} />
                              <span>Reject</span>
                            </motion.button>
                          </div>
                        )}
                      </motion.div>
                    ))
                  )}
                </>
              ) : (
                // Ads Manager Notifications (Payment Required)
                <>
                  {paymentNotifications.length === 0 ? (
                    <div className="p-4 text-center text-gray-500">
                      No pending payments
                    </div>
                  ) : (
                    paymentNotifications.map((notification) => (
                      <motion.div
                        key={notification.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="p-4 border-b border-gray-100 hover:bg-gray-50"
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <CreditCard className="text-blue-600" size={16} />
                              <p className="font-medium text-gray-900">
                                Payment Required
                              </p>
                            </div>
                            <p className="text-sm text-gray-600">
                              Your booking for {notification.screenName} has
                              been approved!
                            </p>
                            <p className="text-sm font-medium text-green-600 mt-1">
                              Amount: ₹{notification.amount.toLocaleString()}
                            </p>
                            <p className="text-xs text-gray-400 mt-1">
                              {notification.timestamp.toLocaleTimeString()}
                            </p>
                          </div>
                        </div>
                        <motion.button
                          className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-2 rounded mt-3 hover:bg-blue-700 transition-colors w-full justify-center"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={() =>
                            handlePayment(notification.id, notification.amount)
                          }
                        >
                          <CreditCard size={16} />
                          <span>Pay Now</span>
                        </motion.button>
                      </motion.div>
                    ))
                  )}
                </>
              )}
            </div>

            {totalNotifications > 0 && (
              <div className="p-3 border-t border-gray-100 text-center">
                <button
                  className="text-sm text-blue-600 hover:text-blue-800 transition-colors"
                  onClick={() => setShowNotifications(false)}
                >
                  Close
                </button>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default NotificationBar;
