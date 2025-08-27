import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  CheckCircle, 
  XCircle, 
  Clock, 
  Loader2, 
  Calendar,
  DollarSign,
  MapPin,
  Users,
  AlertCircle,
  MessageSquare,
  Tag
} from "lucide-react";

interface CampaignRequest {
  id: number;
  advertiser_id: number;
  venue_owner_id: number;
  screen_id: number;
  screen_name: string;
  screen_location: string;
  screen_city: string;
  campaign_name: string;
  campaign_description: string;
  start_date: string;
  end_date: string;
  requested_hours: number[];
  budget_offered: number;
  creative_assets: any[];
  target_audience: string;
  notes: string;
  status: "pending" | "approved" | "rejected" | "cancelled";
  created_at: string;
  updated_at: string;
  advertiser_name?: string;
  advertiser_email?: string;
  venue_owner_name?: string;
  venue_owner_email?: string;
  rejection_reason?: string;
}

const EnhancedIncomingCampaignRequests: React.FC = () => {
  const [requests, setRequests] = useState<CampaignRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>("");
  const [processingRequest, setProcessingRequest] = useState<number | null>(null);
  const [rejectingRequest, setRejectingRequest] = useState<number | null>(null);
  const [rejectionReason, setRejectionReason] = useState("");
  const [filter, setFilter] = useState<"all" | "pending" | "approved" | "rejected">("pending");

  // Mock data for demonstration - this would come from API in production
  useEffect(() => {
    const mockRequests: CampaignRequest[] = [
      {
        id: 1,
        advertiser_id: 1,
        venue_owner_id: 1,
        screen_id: 1,
        screen_name: "Mall Central Display",
        screen_location: "Main Entrance, City Mall",
        screen_city: "Mumbai",
        campaign_name: "Summer Fashion Campaign",
        campaign_description: "Promote our new summer collection with vibrant visuals and catchy slogans targeting young fashion enthusiasts.",
        start_date: "2024-12-01",
        end_date: "2024-12-31",
        requested_hours: [9, 10, 11, 18, 19, 20],
        budget_offered: 25000,
        creative_assets: [],
        target_audience: "Young adults aged 18-35, fashion conscious",
        notes: "Looking for high-visibility locations with good foot traffic during peak hours",
        status: "pending",
        created_at: "2024-11-20T10:30:00Z",
        updated_at: "2024-11-20T10:30:00Z",
        advertiser_name: "Fashion Forward Co.",
        advertiser_email: "campaigns@fashionforward.com"
      },
      {
        id: 2,
        advertiser_id: 2,
        venue_owner_id: 1,
        screen_id: 2,
        screen_name: "Business District LED",
        screen_location: "Corporate Plaza, BKC",
        screen_city: "Mumbai",
        campaign_name: "Tech Product Launch",
        campaign_description: "Launch campaign for our innovative new smartphone with cutting-edge AI features.",
        start_date: "2024-12-15",
        end_date: "2025-01-15",
        requested_hours: [8, 9, 17, 18, 19, 20, 21],
        budget_offered: 45000,
        creative_assets: [],
        target_audience: "Tech enthusiasts, professionals aged 25-45",
        notes: "Need screens in business districts and tech hubs for maximum professional audience reach",
        status: "pending",
        created_at: "2024-11-19T14:15:00Z",
        updated_at: "2024-11-19T14:15:00Z",
        advertiser_name: "TechGiant Corp",
        advertiser_email: "marketing@techgiant.com"
      },
      {
        id: 3,
        advertiser_id: 3,
        venue_owner_id: 1,
        screen_id: 3,
        screen_name: "Shopping Center Screen",
        screen_location: "Food Court Area, Phoenix Mall",
        screen_city: "Mumbai",
        campaign_name: "Holiday Sale Promotion",
        campaign_description: "End of year mega sale with up to 70% discounts on electronics and home appliances.",
        start_date: "2024-12-20",
        end_date: "2024-12-31",
        requested_hours: [10, 11, 12, 16, 17, 18, 19, 20],
        budget_offered: 30000,
        creative_assets: [],
        target_audience: "Shoppers, families, deal seekers",
        notes: "High foot traffic areas, shopping centers preferred for holiday campaign",
        status: "approved",
        created_at: "2024-11-18T09:45:00Z",
        updated_at: "2024-11-21T16:20:00Z",
        advertiser_name: "ElectroDeals Ltd",
        advertiser_email: "promotions@electrodeals.com"
      },
      {
        id: 4,
        advertiser_id: 4,
        venue_owner_id: 1,
        screen_id: 4,
        screen_name: "Transit Hub Display",
        screen_location: "Metro Station Entrance",
        screen_city: "Mumbai",
        campaign_name: "Restaurant Grand Opening",
        campaign_description: "Grand opening of our new fine dining restaurant with special launch offers.",
        start_date: "2024-12-10",
        end_date: "2024-12-20",
        requested_hours: [17, 18, 19, 20, 21],
        budget_offered: 15000,
        creative_assets: [],
        target_audience: "Food enthusiasts, local residents",
        notes: "Need screens near our location in downtown area for local awareness",
        status: "rejected",
        created_at: "2024-11-17T11:30:00Z",
        updated_at: "2024-11-20T13:45:00Z",
        advertiser_name: "Gourmet Bistro",
        advertiser_email: "events@gourmetbistro.com",
        rejection_reason: "Budget too low for prime time slots"
      },
      {
        id: 5,
        advertiser_id: 5,
        venue_owner_id: 1,
        screen_id: 5,
        screen_name: "University Area Screen",
        screen_location: "Campus Plaza",
        screen_city: "Mumbai",
        campaign_name: "Fitness Center Membership Drive",
        campaign_description: "New Year fitness resolutions campaign for gym memberships and wellness programs.",
        start_date: "2025-01-01",
        end_date: "2025-01-31",
        requested_hours: [6, 7, 8, 17, 18, 19],
        budget_offered: 20000,
        creative_assets: [],
        target_audience: "Health conscious individuals, New Year resolution makers",
        notes: "Target areas with young professionals and students for fitness motivation",
        status: "pending",
        created_at: "2024-11-21T08:15:00Z",
        updated_at: "2024-11-21T08:15:00Z",
        advertiser_name: "FitLife Wellness",
        advertiser_email: "campaigns@fitlifewellness.com"
      }
    ];

    // Simulate loading
    setTimeout(() => {
      setRequests(mockRequests);
      setLoading(false);
    }, 1500);
  }, []);

  const handleApprove = async (requestId: number) => {
    if (processingRequest) return;

    setProcessingRequest(requestId);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setRequests((prev) =>
        prev.map((req) =>
          req.id === requestId ? { ...req, status: "approved" as const } : req
        )
      );
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
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
    } catch (err: any) {
      setError(err.message || "Failed to reject request");
    } finally {
      setProcessingRequest(null);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400";
      case "approved":
        return "bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400";
      case "rejected":
        return "bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400";
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
      default:
        return <AlertCircle className="w-4 h-4" />;
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-IN', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  const formatHours = (hours: number[]) => {
    return hours.map(h => `${h}:00`).join(', ');
  };

  const filteredRequests = requests.filter(request => {
    if (filter === "all") return true;
    return request.status === filter;
  });

  const getFilterCount = (status: string) => {
    if (status === "all") return requests.length;
    return requests.filter(req => req.status === status).length;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-12">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4 text-indigo-600" />
          <p className="text-gray-600 dark:text-gray-400">Loading campaign requests...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            Campaign Requests
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Manage incoming advertising campaign requests from brands and advertisers
          </p>
        </div>
      </div>

      {/* Filters */}
      <div className="flex gap-2 flex-wrap">
        {[
          { key: "all", label: "All Requests" },
          { key: "pending", label: "Pending" },
          { key: "approved", label: "Approved" },
          { key: "rejected", label: "Rejected" }
        ].map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors flex items-center gap-2 ${
              filter === key
                ? 'bg-indigo-600 text-white'
                : 'bg-white dark:bg-slate-800 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-slate-700 border border-gray-200 dark:border-slate-700'
            }`}
          >
            {label}
            <span className={`text-xs px-2 py-1 rounded-full ${
              filter === key 
                ? 'bg-white/20 text-white' 
                : 'bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400'
            }`}>
              {getFilterCount(key)}
            </span>
          </button>
        ))}
      </div>

      {/* Error Message */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-5 h-5 text-red-600 dark:text-red-400" />
            <p className="text-red-800 dark:text-red-200">{error}</p>
          </div>
        </motion.div>
      )}

      {/* Campaign Requests Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AnimatePresence mode="popLayout">
          {filteredRequests.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="col-span-full text-center py-12"
            >
              <div className="bg-gray-50 dark:bg-slate-800 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-4">
                <MessageSquare className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                No {filter !== "all" ? filter : ""} campaign requests
              </h3>
              <p className="text-gray-600 dark:text-gray-400">
                {filter === "pending" 
                  ? "All caught up! No pending requests to review."
                  : `No ${filter} campaign requests found.`
                }
              </p>
            </motion.div>
          ) : (
            filteredRequests.map((request) => (
              <motion.div
                key={request.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 overflow-hidden hover:shadow-md transition-shadow"
              >
                {/* Header */}
                <div className="p-6 pb-4">
                  <div className="flex justify-between items-start mb-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {request.campaign_name}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400 flex items-center gap-1">
                        <Tag className="w-4 h-4" />
                        {request.advertiser_name}
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`px-3 py-1 text-xs font-medium rounded-full flex items-center gap-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        {request.status.charAt(0).toUpperCase() + request.status.slice(1)}
                      </span>
                    </div>
                  </div>

                  <p className="text-gray-700 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                    {request.campaign_description}
                  </p>

                  {/* Key Details */}
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-semibold text-green-600">
                        {formatCurrency(request.budget_offered)}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                      <Calendar className="w-4 h-4" />
                      <span>{formatDate(request.start_date)} - {formatDate(request.end_date)}</span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <MapPin className="w-4 h-4" />
                    <span>{request.screen_name} • {request.screen_location}</span>
                  </div>

                  <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 mb-4">
                    <Users className="w-4 h-4" />
                    <span>{request.target_audience}</span>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700 rounded-lg p-3 mb-4">
                    <p className="text-xs text-gray-600 dark:text-gray-400 mb-1">Requested Hours:</p>
                    <p className="text-sm font-medium text-gray-900 dark:text-white">
                      {formatHours(request.requested_hours)}
                    </p>
                  </div>

                  {request.notes && (
                    <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-3 mb-4">
                      <p className="text-xs text-blue-600 dark:text-blue-400 mb-1">Additional Notes:</p>
                      <p className="text-sm text-blue-800 dark:text-blue-300">
                        {request.notes}
                      </p>
                    </div>
                  )}

                  {request.status === "rejected" && request.rejection_reason && (
                    <div className="bg-red-50 dark:bg-red-900/20 rounded-lg p-3 mb-4">
                      <p className="text-xs text-red-600 dark:text-red-400 mb-1">Rejection Reason:</p>
                      <p className="text-sm text-red-800 dark:text-red-300">
                        {request.rejection_reason}
                      </p>
                    </div>
                  )}
                </div>

                {/* Actions */}
                {request.status === "pending" && (
                  <div className="px-6 pb-6">
                    <div className="flex gap-3">
                      <button
                        onClick={() => handleApprove(request.id)}
                        disabled={processingRequest === request.id}
                        className="flex-1 bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        {processingRequest === request.id ? (
                          <Loader2 className="w-5 h-5 animate-spin" />
                        ) : (
                          <>
                            <CheckCircle className="w-5 h-5" />
                            Approve
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => setRejectingRequest(request.id)}
                        disabled={processingRequest === request.id}
                        className="flex-1 bg-red-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                      >
                        <XCircle className="w-5 h-5" />
                        Reject
                      </button>
                    </div>
                  </div>
                )}
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>

      {/* Rejection Modal */}
      <AnimatePresence>
        {rejectingRequest && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            onClick={() => setRejectingRequest(null)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-xl max-w-md w-full p-6"
              onClick={(e) => e.stopPropagation()}
            >
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
                Reject Campaign Request
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                Please provide a reason for rejecting this campaign request:
              </p>
              <textarea
                value={rejectionReason}
                onChange={(e) => setRejectionReason(e.target.value)}
                placeholder="e.g., Budget too low, Content doesn't align with our values..."
                className="w-full p-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent bg-white dark:bg-slate-700 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 resize-none"
                rows={4}
              />
              <div className="flex gap-3 mt-4">
                <button
                  onClick={() => setRejectingRequest(null)}
                  className="flex-1 bg-gray-100 dark:bg-slate-700 text-gray-700 dark:text-gray-300 py-2 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-600 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleReject(rejectingRequest)}
                  disabled={!rejectionReason.trim() || processingRequest === rejectingRequest}
                  className="flex-1 bg-red-600 text-white py-2 px-4 rounded-lg font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 dark:focus:ring-offset-slate-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
                >
                  {processingRequest === rejectingRequest ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <>
                      <XCircle className="w-4 h-4" />
                      Reject Request
                    </>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default EnhancedIncomingCampaignRequests;
