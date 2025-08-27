import React, { useState, useEffect } from "react";
import {
  campaignRequestService,
  type CampaignRequest,
} from "../../services/campaignRequestService";

const MyCampaignRequests: React.FC = () => {
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const response = await campaignRequestService.getMyRequests();

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
        <h2 className="text-2xl font-bold text-gray-900">
          My Campaign Requests
        </h2>
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
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"
            />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">
            No campaign requests
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Get started by creating your first campaign request.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <div
              key={request.id}
              className="bg-white border border-gray-200 rounded-lg p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {request.campaign_name}
                  </h3>
                  <p className="text-sm text-gray-600">{request.screen_name}</p>
                  <p className="text-xs text-gray-500">
                    {request.screen_location}, {request.screen_city}
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
                <p className="text-sm text-gray-600 mb-4">
                  {request.campaign_description}
                </p>
              )}

              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                <div>
                  <p className="text-xs text-gray-500">Start Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(request.start_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">End Date</p>
                  <p className="text-sm font-medium">
                    {formatDate(request.end_date)}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Budget</p>
                  <p className="text-sm font-medium">
                    {campaignRequestService.formatBudget(
                      request.budget_offered
                    )}
                  </p>
                </div>
                <div>
                  <p className="text-xs text-gray-500">Duration</p>
                  <p className="text-sm font-medium">
                    {campaignRequestService.calculateDuration(
                      request.start_date,
                      request.end_date
                    )}
                  </p>
                </div>
              </div>

              {request.requested_hours &&
                request.requested_hours.length > 0 && (
                  <div className="mb-4">
                    <p className="text-xs text-gray-500 mb-1">
                      Requested Time Slots
                    </p>
                    <p className="text-sm">
                      {campaignRequestService.formatRequestedHours(
                        request.requested_hours
                      )}
                    </p>
                  </div>
                )}

              {request.target_audience && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Target Audience</p>
                  <p className="text-sm">{request.target_audience}</p>
                </div>
              )}

              {request.notes && (
                <div className="mb-4">
                  <p className="text-xs text-gray-500 mb-1">Notes</p>
                  <p className="text-sm">{request.notes}</p>
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
                  Created on {formatDate(request.created_at)}
                  {request.venue_owner_name && (
                    <span className="ml-2">
                      • Venue: {request.venue_owner_name}
                    </span>
                  )}
                </div>

                {request.status === "pending" && (
                  <div className="flex space-x-2">
                    <button className="text-xs text-blue-600 hover:text-blue-800 font-medium">
                      View Details
                    </button>
                    <button className="text-xs text-gray-600 hover:text-gray-800 font-medium">
                      Cancel
                    </button>
                  </div>
                )}

                {request.status === "approved" && (
                  <div className="text-xs text-green-600 font-medium">
                    ✓ Campaign Approved
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyCampaignRequests;
