import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import {
  Clock,
  MapPin,
  User,
  Calendar,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Eye,
} from "lucide-react";
import {
  campaignRequestService,
  CampaignRequest,
} from "../../services/campaignRequestService";

interface AdvertiserCampaignRequestsProps {
  className?: string;
}

const AdvertiserCampaignRequests: React.FC<AdvertiserCampaignRequestsProps> = ({
  className = "",
}) => {
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadRequests();
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await campaignRequestService.getMyRequests();

      if (result.success && result.data) {
        setRequests(result.data);
      } else {
        setError("Failed to load requests");
      }
    } catch (err) {
      setError("Network error occurred");
      console.error("Error loading requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      case "cancelled":
        return "bg-gray-100 text-gray-800 border-gray-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />;
      case "approved":
        return <CheckCircle className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      case "cancelled":
        return <AlertCircle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return start === end ? start : `${start} - ${end}`;
  };

  const formatTimeSlots = (hours: number[]) => {
    if (!hours || hours.length === 0) return "All day";

    const sortedHours = [...hours].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sortedHours[0];
    let end = start;

    for (let i = 1; i < sortedHours.length; i++) {
      if (sortedHours[i] === end + 1) {
        end = sortedHours[i];
      } else {
        ranges.push(
          start === end ? `${start}:00` : `${start}:00-${end + 1}:00`
        );
        start = sortedHours[i];
        end = start;
      }
    }
    ranges.push(start === end ? `${start}:00` : `${start}:00-${end + 1}:00`);

    return ranges.join(", ");
  };

  if (loading) {
    return (
      <div className={`flex items-center justify-center py-12 ${className}`}>
        <Loader2 className="w-8 h-8 animate-spin" />
        <span className="ml-2">Loading campaign requests...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-red-50 border-l-4 border-red-500 p-4 ${className}`}>
        <div className="flex">
          <AlertCircle className="h-5 w-5 text-red-500" />
          <div className="ml-3">
            <p className="text-sm text-red-700">{error}</p>
            <button
              onClick={loadRequests}
              className="mt-2 text-sm text-red-600 hover:text-red-800 underline"
            >
              Try again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-6 ${className}`}>
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            My Campaign Requests
          </h2>
          <p className="text-gray-600 mt-1">
            Track the status of your campaign requests to venue owners
          </p>
        </div>
        <button
          onClick={loadRequests}
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          <RefreshCw className="w-4 h-4" />
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No campaign requests
          </h3>
          <p className="text-gray-500">
            Create a campaign to send requests to venue owners.
          </p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-white rounded-lg shadow-md border overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">
                      {request.campaign_name}
                    </h3>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500 mb-3">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{request.venue_owner_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.screen_location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-4 h-4" />
                        <span>
                          {formatDateRange(
                            request.start_date,
                            request.end_date
                          )}
                        </span>
                      </div>
                    </div>

                    {/* Status Badge */}
                    <div
                      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-sm font-medium border ${getStatusColor(
                        request.status
                      )}`}
                    >
                      {getStatusIcon(request.status)}
                      <span className="capitalize">{request.status}</span>
                    </div>
                  </div>

                  <div className="text-right ml-4">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{request.budget_offered.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Budget offered</div>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Screen</div>
                    <div className="font-medium">{request.screen_name}</div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium">
                      {campaignRequestService.calculateDuration(
                        request.start_date,
                        request.end_date
                      )}
                    </div>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-sm text-gray-600">Requested Hours</div>
                    <div className="font-medium">
                      {formatTimeSlots(request.requested_hours)}
                    </div>
                  </div>
                </div>

                {/* Description */}
                {request.campaign_description && (
                  <div className="mb-4 p-3 bg-blue-50 rounded-lg">
                    <div className="text-sm text-gray-600 mb-1">
                      Description
                    </div>
                    <div className="text-sm text-gray-800">
                      {request.campaign_description}
                    </div>
                  </div>
                )}

                {/* Rejection Reason */}
                {request.status === "rejected" && request.rejection_reason && (
                  <div className="mb-4 p-3 bg-red-50 rounded-lg border-l-4 border-red-200">
                    <div className="text-sm text-red-800 font-medium mb-1">
                      Rejection Reason
                    </div>
                    <div className="text-sm text-red-700">
                      {request.rejection_reason}
                    </div>
                  </div>
                )}

                {/* Status-specific information */}
                {request.status === "pending" && (
                  <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-yellow-800">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Awaiting venue owner response
                      </span>
                    </div>
                    <p className="text-sm text-yellow-700 mt-1">
                      Your request has been sent to {request.venue_owner_name}.
                      You'll be notified when they respond.
                    </p>
                  </div>
                )}

                {request.status === "approved" && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center gap-2 text-green-800">
                      <CheckCircle className="w-4 h-4" />
                      <span className="text-sm font-medium">
                        Campaign request approved!
                      </span>
                    </div>
                    <p className="text-sm text-green-700 mt-1">
                      Great! Your campaign has been approved and will go live as
                      scheduled.
                    </p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors">
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>

                  {request.status === "pending" && (
                    <button className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors">
                      Cancel Request
                    </button>
                  )}

                  {request.status === "approved" && (
                    <button className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
                      View Campaign
                    </button>
                  )}

                  {request.status === "rejected" && (
                    <button className="border border-blue-600 text-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors">
                      Create New Request
                    </button>
                  )}
                </div>

                {/* Timestamps */}
                <div className="flex justify-between items-center pt-3 border-t text-xs text-gray-500 mt-4">
                  <span>
                    Created: {new Date(request.created_at).toLocaleString()}
                  </span>
                  {request.status !== "pending" && (
                    <span>
                      Updated: {new Date(request.updated_at).toLocaleString()}
                    </span>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdvertiserCampaignRequests;
