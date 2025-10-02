import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  MapPin,
  DollarSign,
  Eye,
  CheckCircle,
  XCircle,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search,
  Star,
  TrendingUp,
  Activity,
  Grid,
  List,
  Flag,
} from "lucide-react";
import { bookingService, CampaignBooking } from "../../services/bookingService";
import ComplaintForm, { ComplaintData } from "../Booking/ComplaintForm";

const MyBookings: React.FC = () => {
  const [bookings, setBookings] = useState<CampaignBooking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [complaintFormOpen, setComplaintFormOpen] = useState(false);
  const [selectedBookingForComplaint, setSelectedBookingForComplaint] =
    useState<CampaignBooking | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      setError(null);
      // Use advertiser ID 1 for demo - in real app this would come from auth
      const data = await bookingService.getMyBookingRequests("1");
      setBookings(data);
      console.log("Fetched booking requests:", data);
    } catch (err: any) {
      console.error("Error fetching bookings:", err);
      setError(err.message || "Failed to fetch bookings");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case "accepted":
      case "active":
        return "text-green-600 bg-green-100";
      case "rejected":
        return "text-red-600 bg-red-100";
      case "pending":
        return "text-yellow-600 bg-yellow-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
      case "active":
        return <CheckCircle size={16} />;
      case "rejected":
        return <XCircle size={16} />;
      case "pending":
        return <AlertCircle size={16} />;
      case "completed":
        return <CheckCircle size={16} />;
      default:
        return <AlertCircle size={16} />;
    }
  };

  const handleComplaintSubmit = async (complaintData: ComplaintData) => {
    try {
      // Submit complaint to backend
      console.log("Submitting complaint:", complaintData);
      // You can add API call here
      // await bookingService.submitComplaint(complaintData);

      setComplaintFormOpen(false);
      setSelectedBookingForComplaint(null);

      // Show success message or refresh data
      fetchBookings();
    } catch (error) {
      console.error("Error submitting complaint:", error);
    }
  };

  const openComplaintForm = (booking: CampaignBooking) => {
    setSelectedBookingForComplaint(booking);
    setComplaintFormOpen(true);
  };

  const filteredBookings = bookings.filter((booking) => {
    const matchesStatus =
      selectedStatus === "all" || booking.status === selectedStatus;
    const matchesSearch = booking.campaign_name
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    return matchesStatus && matchesSearch;
  });

  if (loading) {
    return (
      <motion.div
        className="flex items-center justify-center h-64"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="text-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          >
            <Loader2 className="w-12 h-12 text-blue-600 mx-auto mb-4" />
          </motion.div>
          <motion.span
            className="text-lg font-medium text-gray-600"
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            Loading your bookings...
          </motion.span>
        </div>
      </motion.div>
    );
  }

  if (error) {
    return (
      <motion.div
        className="text-center p-8"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="bg-red-50 border border-red-200 rounded-2xl p-6 max-w-md mx-auto">
          <XCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-red-900 mb-2">
            Error Loading Bookings
          </h3>
          <p className="text-red-700 mb-4">{error}</p>
          <motion.button
            onClick={fetchBookings}
            className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="space-y-6 p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      {/* Enhanced Header Section */}
      {/* Header Section with Better Mobile Layout */}
      <motion.div
        className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-6 shadow-sm border border-gray-100 mb-6"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
      >
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between space-y-4 lg:space-y-0">
            <div className="space-y-2">
              <motion.h1
                className="text-3xl lg:text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                My Bookings
              </motion.h1>
              <motion.p
                className="text-gray-600 text-base lg:text-lg"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                Track your campaign booking requests and their status
              </motion.p>
            </div>
          </div>

          {/* Stats Cards - Full Width on Mobile */}
          <motion.div
            className="w-full"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <motion.div
                className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Star className="w-6 h-6 text-yellow-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.length}
                </div>
                <div className="text-xs text-gray-500">Total</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <Activity className="w-6 h-6 text-green-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === "active").length}
                </div>
                <div className="text-xs text-gray-500">Active</div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl p-4 text-center shadow-sm border border-gray-100"
                whileHover={{ scale: 1.05, y: -2 }}
                transition={{ duration: 0.2 }}
              >
                <TrendingUp className="w-6 h-6 text-blue-500 mx-auto mb-1" />
                <div className="text-2xl font-bold text-gray-900">
                  {bookings.filter((b) => b.status === "draft").length}
                </div>
                <div className="text-xs text-gray-500">Draft</div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Enhanced Controls Section with Better Mobile Layout */}
      <motion.div
        className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm border border-gray-100"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <div className="flex flex-col space-y-4 lg:space-y-0 lg:flex-row lg:items-center lg:justify-between">
          {/* Search Bar */}
          <motion.div
            className="relative flex-1 max-w-full lg:max-w-md"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 hover:bg-white transition-colors"
            />
          </motion.div>

          {/* Filter and View Controls */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4">
            {/* Status Filter */}
            <motion.div
              className="flex-1 sm:flex-none"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="w-full sm:w-auto px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 cursor-pointer hover:border-gray-300 transition-colors appearance-none"
                style={{
                  backgroundColor: "white",
                  color: "#111827",
                }}
              >
                <option value="all">All Status</option>
                <option value="draft">Draft</option>
                <option value="active">Active</option>
                <option value="paused">Paused</option>
                <option value="completed">Completed</option>
              </select>
            </motion.div>

            {/* View Mode Toggle */}
            <motion.div
              className="flex bg-gray-100 rounded-xl p-1 w-full sm:w-auto"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <button
                onClick={() => setViewMode("grid")}
                className={`flex-1 sm:flex-none p-2 rounded-lg transition-colors ${
                  viewMode === "grid"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <Grid className="w-5 h-5 mx-auto" />
              </button>
              <button
                onClick={() => setViewMode("list")}
                className={`flex-1 sm:flex-none p-2 rounded-lg transition-colors ${
                  viewMode === "list"
                    ? "bg-white text-blue-600 shadow-sm"
                    : "text-gray-500 hover:text-gray-700"
                }`}
              >
                <List className="w-5 h-5 mx-auto" />
              </button>
            </motion.div>

            {/* Refresh Button */}
            <motion.button
              onClick={fetchBookings}
              className="flex items-center justify-center space-x-2 px-4 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition-colors shadow-sm w-full sm:w-auto"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              <RefreshCw className="w-5 h-5" />
              <span>Refresh</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Bookings Grid/List */}
      <AnimatePresence mode="wait">
        {filteredBookings.length === 0 ? (
          <motion.div
            key="empty"
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
          >
            <div className="bg-gray-50 rounded-2xl p-8 max-w-md mx-auto">
              <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                No Bookings Found
              </h3>
              <p className="text-gray-600 mb-6">
                {selectedStatus === "all"
                  ? "You haven't made any booking requests yet."
                  : `No ${selectedStatus} bookings found.`}
              </p>
              <motion.button
                onClick={() => {
                  setSelectedStatus("all");
                  setSearchQuery("");
                }}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Clear Filters
              </motion.button>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="bookings"
            className={
              viewMode === "grid"
                ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
                : "space-y-4"
            }
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            {filteredBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                className={`bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow ${
                  viewMode === "list" ? "flex items-center p-6" : "p-6"
                }`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                whileHover={{ y: -2 }}
              >
                {viewMode === "grid" ? (
                  <div className="space-y-4">
                    {/* Campaign Header */}
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900 mb-1">
                          {booking.campaign_name}
                        </h3>
                        <div className="flex items-center space-x-2">
                          <span
                            className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                              booking.status
                            )}`}
                          >
                            {getStatusIcon(booking.status)}
                            <span className="capitalize">{booking.status}</span>
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Campaign Details */}
                    <div className="space-y-3">
                      <div className="flex items-center space-x-2 text-gray-600">
                        <DollarSign className="w-4 h-4" />
                        <span className="text-sm">
                          Budget: ₹{booking.total_budget?.toLocaleString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <Calendar className="w-4 h-4" />
                        <span className="text-sm">
                          {booking.screens.length} Screen
                          {booking.screens.length !== 1 ? "s" : ""} Booked
                        </span>
                      </div>

                      <div className="flex items-center space-x-2 text-gray-600">
                        <MapPin className="w-4 h-4" />
                        <span className="text-sm">
                          {booking.screens
                            .map((s) => s.city)
                            .filter((v, i, a) => a.indexOf(v) === i)
                            .join(", ")}
                        </span>
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Created:{" "}
                        {new Date(booking.created_at).toLocaleDateString()}
                      </span>
                      <div className="flex items-center space-x-2">
                        {/* Show complaint button only for confirmed/active bookings */}
                        {(booking.status === "active" ||
                          booking.status === "completed") && (
                          <motion.button
                            onClick={() => openComplaintForm(booking)}
                            className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Flag className="w-4 h-4" />
                            <span className="text-sm">Report</span>
                          </motion.button>
                        )}
                        <motion.button
                          className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex items-center justify-between flex-1">
                    <div className="flex items-center space-x-4">
                      <div>
                        <h3 className="font-semibold text-lg text-gray-900">
                          {booking.campaign_name}
                        </h3>
                        <p className="text-gray-600">
                          {booking.screens.length} screen
                          {booking.screens.length !== 1 ? "s" : ""} •{" "}
                          {booking.screens
                            .map((s) => s.city)
                            .filter((v, i, a) => a.indexOf(v) === i)
                            .join(", ")}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center space-x-6">
                      <div className="text-right">
                        <p className="font-semibold text-gray-900">
                          ₹{booking.total_budget?.toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">Total Budget</p>
                      </div>

                      <div className="text-right">
                        <p className="text-sm text-gray-900">
                          {new Date(booking.created_at).toLocaleDateString()}
                        </p>
                        <p className="text-sm text-gray-500">Created</p>
                      </div>

                      <span
                        className={`inline-flex items-center space-x-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(
                          booking.status
                        )}`}
                      >
                        {getStatusIcon(booking.status)}
                        <span className="capitalize">{booking.status}</span>
                      </span>

                      <div className="flex items-center space-x-2">
                        {/* Show complaint button only for confirmed/active bookings */}
                        {(booking.status === "active" ||
                          booking.status === "completed") && (
                          <motion.button
                            onClick={() => openComplaintForm(booking)}
                            className="flex items-center space-x-1 px-3 py-1 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                          >
                            <Flag className="w-4 h-4" />
                            <span className="text-sm">Report</span>
                          </motion.button>
                        )}
                        <motion.button
                          className="flex items-center space-x-1 px-3 py-1 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                        >
                          <Eye className="w-4 h-4" />
                          <span className="text-sm">View</span>
                        </motion.button>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Complaint Form Modal */}
      {selectedBookingForComplaint && (
        <ComplaintForm
          isOpen={complaintFormOpen}
          onClose={() => {
            setComplaintFormOpen(false);
            setSelectedBookingForComplaint(null);
          }}
          booking={{
            id: selectedBookingForComplaint.id.toString(),
            campaign_name: selectedBookingForComplaint.campaign_name,
            screens: selectedBookingForComplaint.screens.map((screen) => ({
              id: screen.id,
              name: screen.name,
              city: screen.city,
            })),
            status: selectedBookingForComplaint.status,
          }}
          onSubmit={handleComplaintSubmit}
        />
      )}
    </motion.div>
  );
};

export default MyBookings;
