import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle, XCircle, Clock, Loader2 } from "lucide-react";
import {
  campaignRequestService,
  type CampaignRequest,
} from "../../services/campaignRequestService";

const IncomingCampaignRequests: React.FC = () => {
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [processingRequest, setProcessingRequest] = useState<number | null>(
    null
  );
  const [rejectingRequest, setRejectingRequest] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await campaignRequestService.getIncomingRequests();

      if (response.success) {
        setRequests(response.data);
      } else {
        setError("Failed to load requests");
      }
    } catch (err: any) {
      setError(err.message || "Failed to load requests");
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    if (processingRequest) return;

    setProcessingRequest(requestId);
    try {
      const response = await campaignRequestService.approveRequest(requestId);

      if (response.success) {
        // Update the request status locally
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId ? { ...req, status: "approved" as const } : req
          )
        );
      } else {
        setError("Failed to approve request");
      }
    } catch (err: any) {
      setError(err.message || "Failed to approve request");
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async (requestId: number) => {
    if (processingRequest) return;

    setProcessingRequest(requestId);
    try {
      const response = await campaignRequestService.rejectRequest(
        requestId,
        rejectionReason
      );

      if (response.success) {
        // Update the request status locally
        setRequests((prev) =>
          prev.map((req) =>
            req.id === requestId
              ? {
                  ...req,
                  status: "rejected" as const,
                  rejection_reason: rejectionReason,
                }
              : req
          )
        );
        setRejectingRequest(null);
        setRejectionReason("");
      } else {
        setError("Failed to reject request");
      }
    } catch (err: any) {
      setError(err.message || "Failed to reject request");
    } finally {
      setProcessingRequest(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800";
      case "rejected":
        return "bg-red-100 text-red-800";
      case "cancelled":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-yellow-100 text-yellow-800";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-IN", {
      day: "2-digit",
      month: "short",
      year: "numeric",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">{error}</p>
        <button
          onClick={loadRequests}
          className="mt-2 text-red-800 hover:text-red-900 underline"
        >
          Try again
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Campaign Requests</h2>
        <div className="flex items-center space-x-4">
          <div className="text-sm text-gray-600">
            Pending: {requests.filter((r) => r.status === "pending").length}
          </div>
          <button
            onClick={loadRequests}
            className="text-blue-600 hover:text-blue-800 flex items-center space-x-1"
          >
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12">
          <svg
            className="mx-auto h-12 w-12 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2M4 13h2m13-8l-2-2M9 5l-2 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No campaign requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Campaign requests from advertisers will appear here.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          <AnimatePresence>
            {requests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {request.campaign_name}
                    </h3>
                    <p className="text-sm text-gray-600">
                      By {request.advertiser_name || request.advertiser_email}
                    </p>
                    <p className="text-xs text-gray-500">
                      For: {request.screen_name}
                    </p>
                  </div>
                  <span
                    className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(
                      request.status
                    )}`}
                  >
                    {request.status.charAt(0).toUpperCase() +
                      request.status.slice(1)}
                  </span>
                </div>

                {request.campaign_description && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <p className="text-sm text-gray-700">
                      {request.campaign_description}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-xs text-gray-500">Campaign Period</p>
                    <p className="text-sm font-medium">
                      {formatDate(request.start_date)} -{" "}
                      {formatDate(request.end_date)}
                    </p>
                    <p className="text-xs text-gray-500">
                      {campaignRequestService.calculateDuration(
                        request.start_date,
                        request.end_date
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Budget Offered</p>
                    <p className="text-sm font-medium text-green-600">
                      {campaignRequestService.formatBudget(
                        request.budget_offered
                      )}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Time Slots</p>
                    <p className="text-sm font-medium">
                      {request.requested_hours &&
                      request.requested_hours.length > 0
                        ? campaignRequestService.formatRequestedHours(
                            request.requested_hours
                          )
                        : "All day"}
                    </p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-500">Target Audience</p>
                    <p className="text-sm font-medium">
                      {request.target_audience || "General"}
                    </p>
                  </div>
                </div>

                {request.notes && (
                  <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                    <p className="text-xs text-blue-600 font-medium mb-1">
                      Additional Notes
                    </p>
                    <p className="text-sm text-blue-700">{request.notes}</p>
                  </div>
                )}

                {request.rejection_reason && (
                  <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg">
                    <p className="text-xs text-red-600 font-medium mb-1">
                      Rejection Reason
                    </p>
                    <p className="text-sm text-red-700">
                      {request.rejection_reason}
                    </p>
                  </div>
                )}

                <div className="flex justify-between items-center pt-4 border-t border-gray-200">
                  <div className="text-xs text-gray-500">
                    Requested on {formatDate(request.created_at)}
                  </div>

                  {request.status === "pending" && (
                    <div className="flex space-x-2">
                      {rejectingRequest === request.id ? (
                        <div className="flex items-center space-x-2">
                          <input
                            type="text"
                            placeholder="Rejection reason..."
                            value={rejectionReason}
                            onChange={(e) => setRejectionReason(e.target.value)}
                            className="px-2 py-1 text-xs border border-gray-300 rounded"
                          />
                          <button
                            onClick={() => handleReject(request.id)}
                            disabled={processingRequest === request.id}
                            className="px-3 py-1 text-xs bg-red-600 text-white rounded hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                          >
                            {processingRequest === request.id ? (
                              <>
                                <Loader2 className="w-3 h-3 animate-spin" />
                                Rejecting...
                              </>
                            ) : (
                              "Confirm"
                            )}
                          </button>
                          <button
                            onClick={() => {
                              setRejectingRequest(null);
                              setRejectionReason("");
                            }}
                            className="px-3 py-1 text-xs border border-gray-300 rounded hover:bg-gray-50"
                          >
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <>
                          <button
                            onClick={() => handleApprove(request.id)}
                            disabled={processingRequest === request.id}
                            className="px-4 py-2 text-sm bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center gap-2"
                          >
                            {processingRequest === request.id ? (
                              <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                Approving...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="w-4 h-4" />
                                Approve
                              </>
                            )}
                          </button>
                          <button
                            onClick={() => setRejectingRequest(request.id)}
                            className="px-4 py-2 text-sm border border-gray-300 text-gray-700 rounded-md hover:bg-gray-50 flex items-center gap-2"
                          >
                            <XCircle className="w-4 h-4" />
                            Reject
                          </button>
                        </>
                      )}
                    </div>
                  )}

                  {request.status === "approved" && (
                    <div className="text-sm text-green-600 font-medium flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M5 13l4 4L19 7"
                        />
                      </svg>
                      Approved
                    </div>
                  )}

                  {request.status === "rejected" && (
                    <div className="text-sm text-red-600 font-medium flex items-center">
                      <svg
                        className="w-4 h-4 mr-1"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M6 18L18 6M6 6l12 12"
                        />
                      </svg>
                      Rejected
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
};

export default IncomingCampaignRequests;
