// Booking Requests Component for Screen Manager
// Shows booking requests that venue owners can accept or reject

import React, { useState, useEffect } from "react";
import {
  Clock,
  MapPin,
  DollarSign,
  Calendar,
  User,
  Building2,
  Check,
  X,
  AlertCircle,
  Monitor,
  RefreshCw,
  Mail,
  Phone,
} from "lucide-react";
import {
  BookingRequestService,
  BookingRequest,
} from "../../services/bookingRequestService";
import { getMyScreens } from "../../api/screens";

interface Screen {
  id: number;
  screen_name: string;
  location_in_venue: string;
  city: string;
  is_active: boolean;
  ads_enabled: boolean;
}

const BookingRequestsTab: React.FC = () => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [userScreens, setUserScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [processingBookings, setProcessingBookings] = useState<Set<number>>(
    new Set()
  );
  const [error, setError] = useState<string | null>(null);
  const [selectedScreens, setSelectedScreens] = useState<{
    [bookingId: number]: number;
  }>({});

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError(null);

    try {
      // Load booking requests and user screens in parallel
      const [requests, screensResponse] = await Promise.all([
        BookingRequestService.getBookingRequests(),
        getMyScreens(),
      ]);

      setBookingRequests(requests);

      if (screensResponse.ok && screensResponse.data?.screens) {
        // Filter only active screens that allow ads
        const activeScreens = screensResponse.data.screens.filter(
          (screen: Screen) => screen.is_active && screen.ads_enabled
        );
        setUserScreens(activeScreens);
      }

      console.log(
        `📬 Loaded ${requests.length} booking requests and ${userScreens.length} active screens`
      );
    } catch (err) {
      console.error("Error loading booking data:", err);
      setError(
        err instanceof Error ? err.message : "Failed to load booking data"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleAcceptBooking = async (bookingId: number) => {
    const selectedScreenId = selectedScreens[bookingId];

    if (!selectedScreenId) {
      alert("Please select a screen to assign to this booking");
      return;
    }

    setProcessingBookings((prev) => new Set(prev).add(bookingId));

    try {
      await BookingRequestService.acceptBookingRequest({
        bookingId,
        screenId: selectedScreenId,
      });

      // Remove the accepted booking from the list
      setBookingRequests((prev) =>
        prev.filter((req) => req.booking_id !== bookingId)
      );

      // Show success message
      alert("Booking accepted successfully! Ads Manager has been notified.");
    } catch (err) {
      console.error("Error accepting booking:", err);
      alert(err instanceof Error ? err.message : "Failed to accept booking");
    } finally {
      setProcessingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const handleRejectBooking = async (bookingId: number) => {
    const reason = prompt(
      "Please provide a reason for rejecting this booking (optional):"
    );

    setProcessingBookings((prev) => new Set(prev).add(bookingId));

    try {
      await BookingRequestService.rejectBookingRequest(
        bookingId,
        reason || undefined
      );

      // Remove the rejected booking from the list
      setBookingRequests((prev) =>
        prev.filter((req) => req.booking_id !== bookingId)
      );

      alert("Booking rejected successfully.");
    } catch (err) {
      console.error("Error rejecting booking:", err);
      alert(err instanceof Error ? err.message : "Failed to reject booking");
    } finally {
      setProcessingBookings((prev) => {
        const newSet = new Set(prev);
        newSet.delete(bookingId);
        return newSet;
      });
    }
  };

  const handleScreenSelection = (bookingId: number, screenId: number) => {
    setSelectedScreens((prev) => ({
      ...prev,
      [bookingId]: screenId,
    }));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="flex items-center space-x-2">
          <RefreshCw className="animate-spin h-5 w-5 text-blue-500" />
          <span className="text-gray-600">Loading booking requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-4">
        <div className="flex items-center space-x-2">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <span className="text-red-700">{error}</span>
        </div>
        <button
          onClick={loadData}
          className="mt-2 text-red-600 hover:text-red-800 underline"
        >
          Try Again
        </button>
      </div>
    );
  }

  if (bookingRequests.length === 0) {
    return (
      <div className="text-center py-12">
        <Calendar className="mx-auto h-12 w-12 text-gray-400 mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No Booking Requests
        </h3>
        <p className="text-gray-500 mb-4">
          You currently have no pending booking requests for your screens.
        </p>
        <button
          onClick={loadData}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Booking Requests</h2>
          <p className="text-gray-600">
            {bookingRequests.length} pending request
            {bookingRequests.length !== 1 ? "s" : ""} for your screens
          </p>
        </div>
        <button
          onClick={loadData}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {/* Booking Requests List */}
      <div className="space-y-4">
        {bookingRequests.map((request) => {
          const isProcessing = processingBookings.has(request.booking_id);
          const duration = BookingRequestService.calculateDuration(
            request.start_date,
            request.end_date
          );

          return (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
            >
              {/* Request Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex-1">
                  <div className="flex items-center space-x-2 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.customer_name}
                    </h3>
                    {request.company_name && (
                      <>
                        <span className="text-gray-400">from</span>
                        <span className="text-blue-600 font-medium">
                          {request.company_name}
                        </span>
                      </>
                    )}
                  </div>
                  <div
                    className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${BookingRequestService.getUrgencyColor(
                      request.urgency
                    )}`}
                  >
                    <AlertCircle className="h-3 w-3 mr-1" />
                    {request.urgency.toUpperCase()} PRIORITY
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-green-600">
                    {BookingRequestService.formatCurrency(request.total_amount)}
                  </div>
                  <div className="text-sm text-gray-500">
                    {duration} day{duration !== 1 ? "s" : ""}
                  </div>
                </div>
              </div>

              {/* Request Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span className="text-sm">
                      {BookingRequestService.formatDate(request.start_date)} -{" "}
                      {BookingRequestService.formatDate(request.end_date)}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Mail className="h-4 w-4" />
                    <span className="text-sm">{request.customer_email}</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2 text-gray-600">
                    <Clock className="h-4 w-4" />
                    <span className="text-sm">
                      Requested{" "}
                      {new Date(request.created_at).toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-2 text-gray-600">
                    <DollarSign className="h-4 w-4" />
                    <span className="text-sm">
                      {BookingRequestService.formatCurrency(
                        request.total_amount / duration
                      )}
                      /day
                    </span>
                  </div>
                </div>
              </div>

              {/* Message */}
              {request.message && (
                <div className="bg-gray-50 rounded-lg p-3 mb-4">
                  <p className="text-sm text-gray-700 italic">
                    "{request.message}"
                  </p>
                </div>
              )}

              {/* Screen Selection */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Screen to Assign:
                </label>
                <select
                  value={selectedScreens[request.booking_id] || ""}
                  onChange={(e) =>
                    handleScreenSelection(
                      request.booking_id,
                      parseInt(e.target.value)
                    )
                  }
                  className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  disabled={isProcessing}
                >
                  <option value="">Choose a screen...</option>
                  {userScreens.map((screen) => (
                    <option key={screen.id} value={screen.id}>
                      {screen.screen_name} - {screen.location_in_venue} (
                      {screen.city})
                    </option>
                  ))}
                </select>
                {userScreens.length === 0 && (
                  <p className="text-sm text-red-600 mt-1">
                    You have no active screens available for ads. Please
                    activate screens in your Screen Manager.
                  </p>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex items-center space-x-3">
                <button
                  onClick={() => handleAcceptBooking(request.booking_id)}
                  disabled={
                    isProcessing ||
                    !selectedScreens[request.booking_id] ||
                    userScreens.length === 0
                  }
                  className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {isProcessing ? (
                    <RefreshCw className="animate-spin h-4 w-4 mr-2" />
                  ) : (
                    <Check className="h-4 w-4 mr-2" />
                  )}
                  Accept Booking
                </button>

                <button
                  onClick={() => handleRejectBooking(request.booking_id)}
                  disabled={isProcessing}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <X className="h-4 w-4 mr-2" />
                  Reject
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default BookingRequestsTab;
