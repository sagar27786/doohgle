import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  User,
  Calendar,
  Send,
  CheckCircle,
  CreditCard,
  Loader2,
  Mail,
  Phone,
  Bell,
  QrCode,
  Shield,
  FileText,
  Check,
  ChevronRight,
} from "lucide-react";

interface Screen {
  id: number;
  screen_name: string;
  location_name: string;
  city: string;
  state: string;
  hourly_rate?: number;
  daily_footfall: number;
  image_urls?: string;
}

interface AWSScreenBookingModalProps {
  screen: Screen | null;
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (booking: any) => void;
}

const AWSScreenBookingModal: React.FC<AWSScreenBookingModalProps> = ({
  screen,
  isOpen,
  onClose,
  onBookingSuccess,
}) => {
  const [currentStep, setCurrentStep] = useState<
    "details" | "confirmation" | "notification" | "payment"
  >("details");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionError, setSubmissionError] = useState<string | null>(null);
  const [bookingId, setBookingId] = useState<string | null>(null);
  const [notificationStatus, setNotificationStatus] = useState<
    "sending" | "sent" | "delivered" | "read" | null
  >(null);
  const [paymentStatus, setPaymentStatus] = useState<
    "pending" | "processing" | "completed" | "failed" | null
  >(null);

  const [formData, setFormData] = useState({
    customerName: "",
    customerEmail: "",
    customerPhone: "",
    companyName: "",
    startDate: "",
    endDate: "",
    urgency: "medium" as "low" | "medium" | "high",
    specialRequests: "",
  });

  const resetModal = () => {
    setCurrentStep("details");
    setIsSubmitting(false);
    setSubmissionError(null);
    setBookingId(null);
    setNotificationStatus(null);
    setPaymentStatus(null);
    setFormData({
      customerName: "",
      customerEmail: "",
      customerPhone: "",
      companyName: "",
      startDate: "",
      endDate: "",
      urgency: "medium",
      specialRequests: "",
    });
  };

  useEffect(() => {
    if (!isOpen) {
      setTimeout(resetModal, 300); // Reset after animation
    }
  }, [isOpen]);

  const calculateCost = () => {
    if (!formData.startDate || !formData.endDate || !screen) return 0;
    const startDate = new Date(formData.startDate);
    const endDate = new Date(formData.endDate);
    const days = Math.ceil(
      (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24)
    );
    const dailyRate = (screen.hourly_rate || 100) * 24;
    return dailyRate * days;
  };

  const handleSubmitBooking = async () => {
    if (!screen) return;

    setIsSubmitting(true);
    setSubmissionError(null);

    try {
      const response = await fetch(
        "http://localhost:4000/api/aws-bookings/book-screen",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            screenId: screen.id,
            customerName: formData.customerName,
            customerEmail: formData.customerEmail,
            customerPhone: formData.customerPhone,
            companyName: formData.companyName,
            startDate: formData.startDate,
            endDate: formData.endDate,
            urgency: formData.urgency,
            message: formData.specialRequests,
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setBookingId(result.bookingId);
        setCurrentStep("confirmation");
      } else {
        throw new Error(result.error || "Booking submission failed");
      }
    } catch (error) {
      console.error("Booking submission error:", error);
      setSubmissionError(
        error instanceof Error ? error.message : "Failed to submit booking"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleConfirmBooking = () => {
    setCurrentStep("notification");
    setNotificationStatus("sending");

    // Simulate notification progress
    setTimeout(() => setNotificationStatus("sent"), 1000);
    setTimeout(() => setNotificationStatus("delivered"), 2000);
    setTimeout(() => {
      setNotificationStatus("read");
      // Auto advance to payment after owner reads notification
      setTimeout(() => setCurrentStep("payment"), 2000);
    }, 3000);
  };

  const handlePayment = async (method: "upi" | "card" | "netbanking") => {
    if (!bookingId) return;

    setIsSubmitting(true);
    setPaymentStatus("processing");

    try {
      const response = await fetch(
        `http://localhost:4000/api/aws-bookings/payment/${bookingId}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            paymentMethod: method,
            paymentDetails: {
              amount: calculateCost(),
              currency: "INR",
            },
          }),
        }
      );

      const result = await response.json();

      if (result.success) {
        setPaymentStatus("completed");
        if (onBookingSuccess) {
          onBookingSuccess(result.data);
        }
        setTimeout(() => {
          onClose();
        }, 3000);
      } else {
        setPaymentStatus("failed");
        throw new Error(result.error || "Payment failed");
      }
    } catch (error) {
      console.error("Payment error:", error);
      setPaymentStatus("failed");
      setSubmissionError(
        error instanceof Error ? error.message : "Payment processing failed"
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!screen) return null;

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold">
                    Book Screen: {screen.screen_name}
                  </h2>
                  <p className="text-blue-100 mt-1">
                    {screen.location_name}, {screen.city}
                  </p>
                </div>
                <button
                  onClick={onClose}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center mt-6 space-x-4">
                {[
                  { key: "details", label: "Details", icon: FileText },
                  { key: "confirmation", label: "Confirm", icon: Check },
                  { key: "notification", label: "Notify", icon: Bell },
                  { key: "payment", label: "Payment", icon: CreditCard },
                ].map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.key;
                  const isCompleted =
                    [
                      "details",
                      "confirmation",
                      "notification",
                      "payment",
                    ].indexOf(currentStep) > index;

                  return (
                    <div key={step.key} className="flex items-center">
                      <div
                        className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                          isActive
                            ? "bg-white text-blue-600 border-white"
                            : isCompleted
                            ? "bg-green-500 text-white border-green-500"
                            : "bg-transparent text-white border-white border-opacity-50"
                        }`}
                      >
                        {isCompleted ? (
                          <Check size={20} />
                        ) : (
                          <StepIcon size={20} />
                        )}
                      </div>
                      <span
                        className={`ml-2 text-sm ${
                          isActive
                            ? "text-white font-semibold"
                            : "text-blue-100"
                        }`}
                      >
                        {step.label}
                      </span>
                      {index < 3 && (
                        <ChevronRight
                          size={16}
                          className="mx-2 text-blue-200"
                        />
                      )}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 overflow-y-auto max-h-96">
              {/* Step 1: Details */}
              {currentStep === "details" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Full Name *
                      </label>
                      <input
                        type="text"
                        value={formData.customerName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customerName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Enter your full name"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Email *
                      </label>
                      <input
                        type="email"
                        value={formData.customerEmail}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customerEmail: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="your@email.com"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Phone *
                      </label>
                      <input
                        type="tel"
                        value={formData.customerPhone}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            customerPhone: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="+91-9876543210"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Company
                      </label>
                      <input
                        type="text"
                        value={formData.companyName}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            companyName: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        placeholder="Company name (optional)"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Start Date *
                      </label>
                      <input
                        type="date"
                        value={formData.startDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            startDate: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={new Date().toISOString().split("T")[0]}
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        End Date *
                      </label>
                      <input
                        type="date"
                        value={formData.endDate}
                        onChange={(e) =>
                          setFormData((prev) => ({
                            ...prev,
                            endDate: e.target.value,
                          }))
                        }
                        className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        min={
                          formData.startDate ||
                          new Date().toISOString().split("T")[0]
                        }
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Urgency Level
                    </label>
                    <select
                      value={formData.urgency}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          urgency: e.target.value as "low" | "medium" | "high",
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="low">Low (2-3 days response)</option>
                      <option value="medium">Medium (24 hours response)</option>
                      <option value="high">High (Same day response)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Special Requests
                    </label>
                    <textarea
                      value={formData.specialRequests}
                      onChange={(e) =>
                        setFormData((prev) => ({
                          ...prev,
                          specialRequests: e.target.value,
                        }))
                      }
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 h-24"
                      placeholder="Any special requirements or notes..."
                    />
                  </div>

                  {calculateCost() > 0 && (
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="text-center">
                        <p className="text-sm text-gray-600">Estimated Cost</p>
                        <p className="text-2xl font-bold text-green-600">
                          ₹{calculateCost().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  )}

                  {submissionError && (
                    <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                      <p className="text-red-700 text-center">
                        {submissionError}
                      </p>
                    </div>
                  )}

                  <div className="flex space-x-4">
                    <button
                      onClick={() => onClose()}
                      className="flex-1 bg-gray-200 text-gray-700 py-3 px-6 rounded-lg hover:bg-gray-300 transition-colors font-semibold"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitBooking}
                      disabled={
                        isSubmitting ||
                        !formData.customerName ||
                        !formData.customerEmail ||
                        !formData.customerPhone ||
                        !formData.startDate ||
                        !formData.endDate
                      }
                      className="flex-1 bg-blue-600 text-white py-3 px-6 rounded-lg hover:bg-blue-700 transition-colors font-semibold disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
                    >
                      {isSubmitting ? (
                        <Loader2 size={20} className="animate-spin mr-2" />
                      ) : (
                        <Send size={20} className="mr-2" />
                      )}
                      Submit Request
                    </button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Confirmation */}
              {currentStep === "confirmation" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center"
                >
                  <CheckCircle size={64} className="mx-auto text-green-600" />
                  <h3 className="text-xl font-semibold">
                    Booking Request Submitted!
                  </h3>
                  <div className="bg-gray-50 rounded-lg p-4 text-left">
                    <h4 className="font-semibold mb-2">Booking Details:</h4>
                    <p>
                      <strong>Screen:</strong> {screen.screen_name}
                    </p>
                    <p>
                      <strong>Location:</strong> {screen.location_name},{" "}
                      {screen.city}
                    </p>
                    <p>
                      <strong>Customer:</strong> {formData.customerName}
                    </p>
                    <p>
                      <strong>Duration:</strong> {formData.startDate} to{" "}
                      {formData.endDate}
                    </p>
                    <p>
                      <strong>Estimated Cost:</strong> ₹
                      {calculateCost().toLocaleString()}
                    </p>
                    {bookingId && (
                      <p>
                        <strong>Booking ID:</strong> {bookingId}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={handleConfirmBooking}
                    className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors font-semibold"
                  >
                    Proceed to Notification
                  </button>
                </motion.div>
              )}

              {/* Step 3: Notification Status */}
              {currentStep === "notification" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center"
                >
                  <motion.div
                    animate={{
                      rotate: notificationStatus === "read" ? 0 : 360,
                    }}
                    transition={{
                      duration: 1,
                      repeat: notificationStatus === "read" ? 0 : Infinity,
                      ease: "linear",
                    }}
                  >
                    <Bell
                      size={48}
                      className={`mx-auto mb-4 ${
                        notificationStatus === "read"
                          ? "text-green-600"
                          : "text-yellow-600"
                      }`}
                    />
                  </motion.div>

                  <h3 className="text-xl font-semibold">
                    {notificationStatus === "sending"
                      ? "Sending notification to owner..."
                      : notificationStatus === "sent"
                      ? "Notification sent!"
                      : notificationStatus === "delivered"
                      ? "Owner received notification!"
                      : notificationStatus === "read"
                      ? "Owner is reviewing your request!"
                      : "Notifying Screen Owner..."}
                  </h3>

                  <div className="bg-blue-50 rounded-lg p-6">
                    <div className="flex items-center justify-center mb-4">
                      <Mail size={24} className="text-blue-600 mr-2" />
                      <span className="font-medium">
                        Email notification sent
                      </span>
                    </div>
                    <div className="flex items-center justify-center">
                      <Phone size={24} className="text-green-600 mr-2" />
                      <span className="font-medium">SMS notification sent</span>
                    </div>
                  </div>

                  <p className="text-gray-600">
                    Expected response time:{" "}
                    {formData.urgency === "high"
                      ? "Within 2 hours"
                      : formData.urgency === "medium"
                      ? "Within 24 hours"
                      : "Within 2-3 business days"}
                  </p>
                </motion.div>
              )}

              {/* Step 4: Payment */}
              {currentStep === "payment" && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {paymentStatus === "completed" ? (
                    <div className="text-center space-y-4">
                      <CheckCircle
                        size={64}
                        className="mx-auto text-green-600"
                      />
                      <h3 className="text-xl font-semibold text-green-600">
                        Payment Successful!
                      </h3>
                      <p>
                        Your booking has been confirmed. You will receive a
                        confirmation email shortly.
                      </p>
                      <div className="bg-green-50 rounded-lg p-4">
                        <p>
                          <strong>Booking ID:</strong> {bookingId}
                        </p>
                        <p>
                          <strong>Amount Paid:</strong> ₹
                          {calculateCost().toLocaleString()}
                        </p>
                      </div>
                    </div>
                  ) : paymentStatus === "failed" ? (
                    <div className="text-center space-y-4">
                      <X size={64} className="mx-auto text-red-600" />
                      <h3 className="text-xl font-semibold text-red-600">
                        Payment Failed
                      </h3>
                      <p>
                        There was an issue processing your payment. Please try
                        again.
                      </p>
                      {submissionError && (
                        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                          <p className="text-red-700">{submissionError}</p>
                        </div>
                      )}
                      <button
                        onClick={() => setPaymentStatus(null)}
                        className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                      >
                        Try Again
                      </button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="text-center bg-green-50 rounded-lg p-6">
                        <Shield
                          size={48}
                          className="mx-auto text-green-600 mb-4"
                        />
                        <h3 className="text-xl font-semibold mb-2">
                          Secure Payment
                        </h3>
                        <div className="text-2xl font-bold text-green-600 mb-2">
                          ₹{calculateCost().toLocaleString()}
                        </div>
                        <p className="text-sm text-gray-600">
                          Booking ID: {bookingId}
                        </p>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <button
                          onClick={() => handlePayment("upi")}
                          disabled={isSubmitting}
                          className="bg-white border-2 border-gray-200 hover:border-purple-500 rounded-xl p-6 text-center transition-all hover:shadow-lg disabled:opacity-50"
                        >
                          <QrCode
                            size={32}
                            className="mx-auto text-purple-600 mb-3"
                          />
                          <h5 className="font-semibold mb-2">UPI Payment</h5>
                          <p className="text-sm text-gray-600">
                            Pay using UPI apps
                          </p>
                        </button>

                        <button
                          onClick={() => handlePayment("card")}
                          disabled={isSubmitting}
                          className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 text-center transition-all hover:shadow-lg disabled:opacity-50"
                        >
                          <CreditCard
                            size={32}
                            className="mx-auto text-blue-600 mb-3"
                          />
                          <h5 className="font-semibold mb-2">Card Payment</h5>
                          <p className="text-sm text-gray-600">
                            Debit or Credit Card
                          </p>
                        </button>

                        <button
                          onClick={() => handlePayment("netbanking")}
                          disabled={isSubmitting}
                          className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-6 text-center transition-all hover:shadow-lg disabled:opacity-50"
                        >
                          <User
                            size={32}
                            className="mx-auto text-green-600 mb-3"
                          />
                          <h5 className="font-semibold mb-2">Net Banking</h5>
                          <p className="text-sm text-gray-600">
                            Direct bank transfer
                          </p>
                        </button>
                      </div>

                      {isSubmitting && (
                        <div className="bg-blue-50 rounded-lg p-4 text-center">
                          <Loader2
                            size={24}
                            className="animate-spin mx-auto text-blue-600 mb-2"
                          />
                          <p className="text-blue-700 font-medium">
                            Processing Payment...
                          </p>
                        </div>
                      )}
                    </div>
                  )}
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default AWSScreenBookingModal;
