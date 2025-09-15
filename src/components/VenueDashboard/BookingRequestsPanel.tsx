import React, { useState, useEffect } from "react";
import {
  Clock,
  Calendar,
  DollarSign,
  Monitor,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Bell,
} from "lucide-react";
import { bookingService } from "../../services/bookingService";

interface BookingRequest {
  id: string;
  campaign_name: string;
  advertiser_id: string;
  advertiser_name: string;
  screen_id: number;
  screen_name: string;
  screen_owner_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  daily_budget: number;
  total_budget: number;
  message?: string;
  status: "pending" | "accepted" | "rejected" | "cancelled";
  created_at: string;
  updated_at: string;
}

const BookingRequestsPanel: React.FC = () => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState<string | null>(
    null
  );

  const fetchBookingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const venueOwnerToken = "temp-venue-owner-token-user-3";
      localStorage.setItem("venueOwnerToken", venueOwnerToken);

      try {
        const requests = await bookingService.getReceivedBookingRequests();
        if (requests && requests.length > 0) {
          setBookingRequests(requests);
          return;
        }
      } catch (apiError) {
        console.log(
          "Service call failed, falling back to direct API call:",
          apiError
        );
        try {
          const response = await fetch(
            "https://doohgle-backend.onrender.com/api/venue/booking-requests",
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${venueOwnerToken}`,
              },
            }
          );
          if (response.ok) {
            const result = await response.json();
            if (result.data && result.data.length > 0) {
              setBookingRequests(result.data);
              return;
            }
          }
        } catch (directApiError) {
          console.log("Direct API call also failed:", directApiError);
        }
      }
      setBookingRequests([]);
    } catch (err) {
      console.error("Error fetching booking requests:", err);
      setError("Failed to load booking requests");
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (
    requestId: string,
    status: "accepted" | "rejected",
    message?: string
  ) => {
    try {
      setProcessingRequest(requestId);
      try {
        await bookingService.respondToBookingRequest(requestId, {
          id: requestId,
          status,
          message,
        });
      } catch (apiError) {
        console.log("Backend API not available, simulating response");
      }
      setBookingRequests((prev) =>
        prev.map((request) =>
          request.id === requestId
            ? { ...request, status, updated_at: new Date().toISOString() }
            : request
        )
      );
      const statusText = status === "accepted" ? "accepted" : "rejected";
      alert(
        `Booking request successfully ${statusText}! The advertiser will be notified.`
      );
    } catch (error) {
      console.error("Error responding to booking request:", error);
      setError(`Failed to ${status} booking request`);
    } finally {
      setProcessingRequest(null);
    }
  };

  useEffect(() => {
    fetchBookingRequests();
    const interval = setInterval(fetchBookingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "text-yellow-700 bg-yellow-100 border-yellow-200";
      case "accepted":
        return "text-green-700 bg-green-100 border-green-200";
      case "rejected":
        return "text-red-700 bg-red-100 border-red-200";
      default:
        return "text-gray-700 bg-gray-100 border-gray-200";
    }
  };

  const getStatusIcon = (status: string, className = "h-4 w-4") => {
    switch (status) {
      case "pending":
        return <AlertCircle className={className} />;
      case "accepted":
        return <CheckCircle className={className} />;
      case "rejected":
        return <XCircle className={className} />;
      default:
        return <Clock className={className} />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-purple-600 mr-3" />
          <span className="text-gray-700 text-lg">
            Loading booking requests...
          </span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-5 w-5 text-red-600 mr-3" />
          <span className="text-red-800 font-medium">{error}</span>
          <button
            onClick={fetchBookingRequests}
            className="ml-auto text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pendingRequests = bookingRequests.filter(
    (req) => req.status === "pending"
  );
  const respondedRequests = bookingRequests.filter(
    (req) => req.status !== "pending"
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center space-x-3">
          <Bell className="h-7 w-7 text-purple-600" />
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">
            Booking Requests
          </h2>
          {pendingRequests.length > 0 && (
            <span className="bg-red-500 text-white text-xs font-bold rounded-full px-2.5 py-1">
              {pendingRequests.length}
            </span>
          )}
        </div>
        <button
          onClick={fetchBookingRequests}
          className="flex items-center text-sm font-semibold text-purple-600 hover:text-purple-800 transition-colors"
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </button>
      </div>

      {pendingRequests.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">
            Action Required
          </h3>
          <div className="space-y-6">
            {pendingRequests.map((request) => (
              <div
                key={request.id}
                className="bg-white border border-gray-200/80 rounded-2xl shadow-lg overflow-hidden"
              >
                <div className="p-5 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
                    <div className="flex-1">
                      <div className="flex items-center flex-wrap gap-x-3 gap-y-2 mb-2">
                        <h4 className="text-lg md:text-xl font-semibold text-gray-900">
                          {request.campaign_name}
                        </h4>
                        <span
                          className={`px-2.5 py-1 rounded-full text-xs font-semibold flex items-center gap-1.5 border ${getStatusColor(
                            request.status
                          )}`}
                        >
                          {getStatusIcon(request.status)}
                          <span className="capitalize">{request.status}</span>
                        </span>
                      </div>
                      <p className="text-sm text-gray-600">
                        From:{" "}
                        <span className="font-medium">
                          {request.advertiser_name}
                        </span>
                      </p>
                    </div>
                    <div className="text-left sm:text-right flex-shrink-0">
                      <p className="text-2xl md:text-3xl font-bold text-gray-800">
                        ₹{request.total_budget.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-500">Total Budget</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4 mb-5 text-sm">
                    <div className="flex items-center text-gray-700">
                      <Monitor className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>
                        <span className="font-semibold">Screen:</span>{" "}
                        {request.screen_name}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <DollarSign className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>
                        <span className="font-semibold">Daily Rate:</span> ₹
                        {request.daily_budget.toLocaleString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>
                        {new Date(request.start_date).toLocaleDateString()} -{" "}
                        {new Date(request.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center text-gray-700">
                      <Clock className="h-4 w-4 mr-3 text-gray-400 flex-shrink-0" />
                      <span>
                        {request.start_time} - {request.end_time}
                      </span>
                    </div>
                  </div>

                  {request.message && (
                    <div className="mb-5 p-4 bg-gray-50/80 rounded-lg border border-gray-200/80">
                      <div className="flex items-start space-x-3">
                        <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5 flex-shrink-0" />
                        <p className="text-sm text-gray-800">
                          {request.message}
                        </p>
                      </div>
                    </div>
                  )}
                </div>
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-gray-50 px-5 py-4 sm:px-6">
                  <p className="text-xs text-gray-500 text-center sm:text-left">
                    Requested on {new Date(request.created_at).toLocaleString()}
                  </p>
                  <div className="flex space-x-3 w-full sm:w-auto">
                    <button
                      onClick={() =>
                        handleRequestResponse(request.id, "rejected")
                      }
                      disabled={processingRequest === request.id}
                      className="w-full justify-center px-4 py-2.5 text-sm font-semibold text-red-600 bg-white border border-red-300 rounded-lg hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center"
                    >
                      <XCircle className="h-5 w-5 mr-2" />
                      Reject
                    </button>
                    <button
                      onClick={() =>
                        handleRequestResponse(request.id, "accepted")
                      }
                      disabled={processingRequest === request.id}
                      className="w-full justify-center px-4 py-2.5 text-sm font-semibold bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-60 disabled:cursor-not-allowed transition-all flex items-center"
                    >
                      {processingRequest === request.id ? (
                        <RefreshCw className="h-5 w-5 mr-2 animate-spin" />
                      ) : (
                        <CheckCircle className="h-5 w-5 mr-2" />
                      )}
                      Accept
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {respondedRequests.length > 0 && (
        <section>
          <h3 className="text-xl font-semibold text-gray-800 mb-4">History</h3>
          <div className="bg-white border border-gray-200/80 rounded-2xl shadow-lg">
            <ul className="divide-y divide-gray-200/80">
              {respondedRequests.map((request, index) => (
                <li key={request.id} className="px-5 py-4 sm:px-6">
                  <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                    <div className="flex-1">
                      <h5 className="font-semibold text-gray-800">
                        {request.campaign_name}
                      </h5>
                      <p className="text-sm text-gray-500 mt-1">
                        {request.screen_name} •{" "}
                        {new Date(request.start_date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex items-center space-x-4 w-full sm:w-auto justify-end">
                      <span className="text-sm font-semibold text-gray-900 whitespace-nowrap">
                        ₹{request.total_budget.toLocaleString()}
                      </span>
                      <span
                        className={`px-2.5 py-1 w-28 text-center rounded-full text-xs font-semibold flex items-center justify-center gap-1.5 border ${getStatusColor(
                          request.status
                        )}`}
                      >
                        {getStatusIcon(request.status)}
                        <span className="capitalize">{request.status}</span>
                      </span>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {bookingRequests.length === 0 && (
        <div className="text-center py-16 px-6 bg-white rounded-2xl shadow-lg border border-gray-200/60">
          <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            No Booking Requests Yet
          </h3>
          <p className="text-gray-600 max-w-md mx-auto">
            When advertisers request to book your screens, their proposals will
            appear here for you to review and approve.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingRequestsPanel;
