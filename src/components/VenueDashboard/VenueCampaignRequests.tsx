import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Clock,
  MapPin,
  User,
  DollarSign,
  Calendar,
  Eye,
  Check,
  X,
  Loader2,
  AlertCircle,
  MessageSquare,
  Image as ImageIcon,
  FileText,
} from 'lucide-react';
import { campaignRequestService, CampaignRequest } from '../../services/campaignRequestService';

interface VenueCampaignRequestsProps {
  className?: string;
}

const VenueCampaignRequests: React.FC<VenueCampaignRequestsProps> = ({ className = "" }) => {
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);
  const [selectedRequest, setSelectedRequest] = useState<CampaignRequest | null>(null);
  const [rejectionReason, setRejectionReason] = useState('');
  const [showRejectModal, setShowRejectModal] = useState(false);

  useEffect(() => {
    loadRequests();
    
    // Subscribe to updates - we'll implement this later since the service doesn't have getInstance
    // const unsubscribe = campaignRequestService.subscribe(() => {
    //   loadRequests();
    // });
    // return unsubscribe;
  }, []);

  const loadRequests = async () => {
    try {
      setLoading(true);
      const result = await campaignRequestService.getIncomingRequests();
      
      if (result.success && result.data) {
        setRequests(result.data);
      } else {
        setError('Failed to load requests');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error loading requests:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (requestId: number) => {
    try {
      setProcessingRequest(requestId);
      const result = await campaignRequestService.approveRequest(requestId);
      
      if (result.success) {
        // Remove from pending requests
        setRequests(prev => prev.filter(r => r.id !== requestId));
      } else {
        setError(result.message || 'Failed to approve request');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error approving request:', err);
    } finally {
      setProcessingRequest(null);
    }
  };

  const handleReject = async () => {
    if (!selectedRequest) return;
    
    try {
      setProcessingRequest(selectedRequest.id);
      const result = await campaignRequestService.rejectRequest(selectedRequest.id, rejectionReason);
      
      if (result.success) {
        // Remove from pending requests
        setRequests(prev => prev.filter(r => r.id !== selectedRequest.id));
        setShowRejectModal(false);
        setRejectionReason('');
        setSelectedRequest(null);
      } else {
        setError(result.message || 'Failed to reject request');
      }
    } catch (err) {
      setError('Network error occurred');
      console.error('Error rejecting request:', err);
    } finally {
      setProcessingRequest(null);
    }
  };

  const formatDateRange = (startDate: string, endDate: string) => {
    const start = new Date(startDate).toLocaleDateString();
    const end = new Date(endDate).toLocaleDateString();
    return start === end ? start : `${start} - ${end}`;
  };

  const formatHours = (hours: number[]) => {
    if (!hours || hours.length === 0) return 'All day';
    
    const sortedHours = [...hours].sort((a, b) => a - b);
    const ranges: string[] = [];
    let start = sortedHours[0];
    let end = start;

    for (let i = 1; i < sortedHours.length; i++) {
      if (sortedHours[i] === end + 1) {
        end = sortedHours[i];
      } else {
        ranges.push(start === end ? `${start}:00` : `${start}:00-${end + 1}:00`);
        start = sortedHours[i];
        end = start;
      }
    }
    ranges.push(start === end ? `${start}:00` : `${start}:00-${end + 1}:00`);

    return ranges.join(', ');
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
          <h2 className="text-2xl font-bold text-gray-900">Campaign Requests</h2>
          <p className="text-gray-600 mt-1">
            {requests.length} pending requests from advertisers
          </p>
        </div>
        <button 
          onClick={loadRequests}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh
        </button>
      </div>

      {requests.length === 0 ? (
        <div className="text-center py-12 bg-white rounded-lg shadow-sm border">
          <MessageSquare className="w-12 h-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No pending requests</h3>
          <p className="text-gray-500">New campaign requests will appear here when advertisers send them.</p>
        </div>
      ) : (
        <div className="grid gap-6">
          {requests.map((request) => (
            <motion.div
              key={request.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, x: -100 }}
              className="bg-white rounded-lg shadow-md border overflow-hidden"
            >
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-1">
                      {request.campaign_name}
                    </h3>
                    <div className="flex items-center gap-4 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <User className="w-4 h-4" />
                        <span>{request.advertiser_name}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <MapPin className="w-4 h-4" />
                        <span>{request.screen_location}</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>{new Date(request.created_at).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-green-600">
                      ₹{request.budget_offered.toLocaleString()}
                    </div>
                    <div className="text-sm text-gray-500">Budget offered</div>
                  </div>
                </div>

                {/* Campaign Details */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Calendar className="w-4 h-4 text-blue-600" />
                      <span className="font-medium">Duration</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {formatDateRange(request.start_date, request.end_date)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Clock className="w-4 h-4 text-purple-600" />
                      <span className="font-medium">Hours</span>
                    </div>
                    <p className="text-sm text-gray-700">
                      {formatHours(request.requested_hours)}
                    </p>
                  </div>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center gap-2 mb-2">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-medium">Screen</span>
                    </div>
                    <p className="text-sm text-gray-700">{request.screen_name}</p>
                  </div>
                </div>

                {/* Campaign Description */}
                {request.campaign_description && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Campaign Description</h4>
                    <p className="text-gray-700 text-sm">{request.campaign_description}</p>
                  </div>
                )}

                {/* Target Audience */}
                {request.target_audience && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Target Audience</h4>
                    <p className="text-gray-700 text-sm">{request.target_audience}</p>
                  </div>
                )}

                {/* Creative Assets */}
                {request.creative_assets && request.creative_assets.length > 0 && (
                  <div className="mb-4">
                    <h4 className="font-medium text-gray-900 mb-2">Creative Assets</h4>
                    <div className="flex gap-2">
                      {request.creative_assets.map((asset, index) => (
                        <div key={index} className="flex items-center gap-2 bg-gray-100 rounded-lg px-3 py-2">
                          {asset.type === 'image' ? (
                            <ImageIcon className="w-4 h-4 text-blue-600" />
                          ) : (
                            <FileText className="w-4 h-4 text-green-600" />
                          )}
                          <span className="text-sm">{asset.type}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {request.notes && (
                  <div className="mb-6">
                    <h4 className="font-medium text-gray-900 mb-2">Additional Notes</h4>
                    <p className="text-gray-700 text-sm bg-gray-50 rounded-lg p-3">{request.notes}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t">
                  <button
                    onClick={() => handleApprove(request.id)}
                    disabled={processingRequest === request.id}
                    className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    {processingRequest === request.id ? (
                      <Loader2 className="w-4 h-4 animate-spin" />
                    ) : (
                      <Check className="w-4 h-4" />
                    )}
                    Approve Request
                  </button>
                  <button
                    onClick={() => {
                      setSelectedRequest(request);
                      setShowRejectModal(true);
                    }}
                    disabled={processingRequest === request.id}
                    className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 transition-colors disabled:bg-gray-400 flex items-center justify-center gap-2"
                  >
                    <X className="w-4 h-4" />
                    Reject Request
                  </button>
                  <button
                    onClick={() => setSelectedRequest(request)}
                    className="bg-gray-200 text-gray-700 py-3 px-4 rounded-lg font-medium hover:bg-gray-300 transition-colors flex items-center gap-2"
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Reject Modal */}
      <AnimatePresence>
        {showRejectModal && selectedRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-lg p-6 w-full max-w-md"
            >
              <h3 className="text-lg font-semibold mb-4">Reject Campaign Request</h3>
              <p className="text-gray-600 mb-4">
                Are you sure you want to reject the campaign request for "{selectedRequest.campaign_name}"?
              </p>
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Rejection Reason (Optional)
                </label>
                <textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Let the advertiser know why you're rejecting this request..."
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  rows={3}
                />
              </div>
              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowRejectModal(false);
                    setRejectionReason('');
                    setSelectedRequest(null);
                  }}
                  className="flex-1 border border-gray-300 text-gray-700 py-2 px-4 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={handleReject}
                  disabled={processingRequest === selectedRequest.id}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg hover:bg-red-700 disabled:bg-gray-400 flex items-center justify-center gap-2"
                >
                  {processingRequest === selectedRequest.id ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : null}
                  Reject
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default VenueCampaignRequests;
