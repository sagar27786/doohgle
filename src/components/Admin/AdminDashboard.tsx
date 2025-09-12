import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Shield,
  Users,
  Monitor,
  DollarSign,
  Calendar,
  Activity,
  CheckCircle,
  XCircle,
  Clock,
  LogOut,
  Loader2,
  BarChart3,
  RefreshCw,
  TrendingUp,
} from "lucide-react";
import {
  adminService,
  DashboardStats,
  AdminScreen,
  AdminBookingRequest,
  RevenueAnalytics,
} from "../../services/adminService";

interface AdminDashboardProps {
  onLogout: () => void;
}

type ActiveTab = "overview" | "screens" | "bookings" | "analytics";

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [screens, setScreens] = useState<AdminScreen[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [processingBooking, setProcessingBooking] = useState<string | null>(
    null
  );

  const loadDashboardData = async () => {
    try {
      setError(null);
      const [statsData, screensData, bookingsData, revenueData] =
        await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAllScreens(),
          adminService.getAllBookingRequests(),
          adminService.getRevenueAnalytics(),
        ]);

      setDashboardStats(statsData);
      setScreens(screensData);
      setBookings(bookingsData);
      setRevenue(revenueData);
    } catch (err: any) {
      setError(err.message || "Failed to load dashboard data");
      console.error("Dashboard data loading error:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadDashboardData();
  };

  const handleLogout = () => {
    adminService.logout();
    onLogout();
  };

  // Booking management handlers
  const handleBookingSelection = (bookingId: string, selected: boolean) => {
    setSelectedBookings((prev) =>
      selected ? [...prev, bookingId] : prev.filter((id) => id !== bookingId)
    );
  };

  const handleBookingAction = async (bookingId: string, status: string) => {
    try {
      setProcessingBooking(bookingId);
      await adminService.updateBookingStatus(bookingId, status);

      // Update booking in state
      setBookings((prev) =>
        prev.map((booking) =>
          booking.id === bookingId ? { ...booking, status: status } : booking
        )
      );

      // Refresh dashboard stats
      await handleRefresh();
    } catch (error: any) {
      console.error("Error updating booking:", error);
      setError(error.message || "Failed to update booking status");
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (
      !confirm(
        "Are you sure you want to delete this booking? This action cannot be undone."
      )
    ) {
      return;
    }

    try {
      setProcessingBooking(bookingId);
      await adminService.deleteBookingRequest(bookingId);

      // Remove booking from state
      setBookings((prev) => prev.filter((booking) => booking.id !== bookingId));

      // Refresh dashboard stats
      await handleRefresh();
    } catch (error: any) {
      console.error("Error deleting booking:", error);
      setError(error.message || "Failed to delete booking");
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedBookings.length === 0) {
      alert("Please select bookings to perform bulk action");
      return;
    }

    const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);
    if (
      !confirm(
        `Are you sure you want to ${actionLabel.toLowerCase()} ${
          selectedBookings.length
        } selected bookings?`
      )
    ) {
      return;
    }

    try {
      setRefreshing(true);
      await adminService.bulkUpdateBookings(selectedBookings, action);

      // Clear selection
      setSelectedBookings([]);

      // Refresh all data
      await loadDashboardData();
    } catch (error: any) {
      console.error(`Error performing bulk ${action}:`, error);
      setError(error.message || `Failed to perform bulk ${action}`);
    } finally {
      setRefreshing(false);
    }
  };

  // Animated number counter hook
  const useAnimatedNumber = (
    end: number,
    duration: number = 2000,
    delay: number = 0
  ) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        let start = 0;
        const increment = end / (duration / 16);

        const counter = setInterval(() => {
          start += increment;
          if (start >= end) {
            setCurrent(end);
            clearInterval(counter);
          } else {
            setCurrent(Math.floor(start));
          }
        }, 16);

        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }, [end, duration, delay]);

    return current;
  };

  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "purple",
    delay = 0,
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    delay?: number;
  }) => {
    const numericValue =
      typeof value === "number"
        ? value
        : parseInt(value.toString().replace(/[^0-9]/g, "")) || 0;
    const animatedValue = useAnimatedNumber(numericValue, 2000, delay);

    const formatValue = (val: number) => {
      if (typeof value === "string" && value.includes("₹")) {
        return `₹${val.toLocaleString()}`;
      }
      return val.toLocaleString();
    };

    const colorClasses = {
      purple: {
        bg: "bg-purple-50",
        border: "border-purple-200",
        iconBg: "bg-purple-100",
        iconColor: "text-purple-600",
      },
      blue: {
        bg: "bg-blue-50",
        border: "border-blue-200",
        iconBg: "bg-blue-100",
        iconColor: "text-blue-600",
      },
      green: {
        bg: "bg-green-50",
        border: "border-green-200",
        iconBg: "bg-green-100",
        iconColor: "text-green-600",
      },
      orange: {
        bg: "bg-orange-50",
        border: "border-orange-200",
        iconBg: "bg-orange-100",
        iconColor: "text-orange-600",
      },
    };

    const currentColor =
      colorClasses[color as keyof typeof colorClasses] || colorClasses.purple;

    return (
      <motion.div
        initial={{ opacity: 0, y: 30, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{
          duration: 0.6,
          delay: delay / 1000,
          type: "spring",
          stiffness: 100,
        }}
        whileHover={{
          scale: 1.03,
          y: -4,
          transition: { duration: 0.2 },
        }}
        className={`${currentColor.bg} ${currentColor.border} border-2 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer group`}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-2">{title}</p>
            <motion.p
              className="text-3xl font-bold text-gray-900 mb-1"
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              transition={{
                delay: delay / 1000 + 0.3,
                type: "spring",
                stiffness: 200,
              }}
            >
              {typeof value === "number" || !isNaN(numericValue)
                ? formatValue(animatedValue)
                : value}
            </motion.p>
            {subtitle && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: delay / 1000 + 0.4 }}
                className="text-xs text-gray-500"
              >
                {subtitle}
              </motion.p>
            )}
          </div>
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{
              delay: delay / 1000 + 0.2,
              type: "spring",
              stiffness: 200,
            }}
            whileHover={{ rotate: 5, scale: 1.1 }}
            className={`${currentColor.iconBg} p-3 rounded-xl group-hover:shadow-md transition-all duration-300`}
          >
            <Icon className={`w-6 h-6 ${currentColor.iconColor}`} />
          </motion.div>
        </div>
        <motion.div
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ delay: delay / 1000 + 0.6, duration: 0.8 }}
          className={`h-1 ${currentColor.iconColor.replace(
            "text-",
            "bg-"
          )} rounded-full mt-4 origin-left`}
        />
      </motion.div>
    );
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-gray-700"
        >
          <Loader2 className="w-8 h-8 animate-spin text-purple-600" />
          <span className="text-xl font-medium">Loading Admin Dashboard...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-white shadow-lg border-b border-purple-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
            >
              <h1 className="text-3xl font-bold bg-gradient-to-r from-purple-600 to-purple-800 bg-clip-text text-transparent">
                Admin Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-600">
                Manage your digital advertising platform
              </p>
            </motion.div>
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="inline-flex items-center px-6 py-3 border border-transparent text-sm font-medium rounded-lg text-white bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 disabled:opacity-50 transform transition-all duration-200 hover:scale-105 shadow-lg"
              >
                <RefreshCw className={`h-4 w-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <button
                onClick={handleLogout}
                className="inline-flex items-center px-6 py-3 border border-purple-200 text-sm font-medium rounded-lg text-purple-700 bg-white hover:bg-purple-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transform transition-all duration-200 hover:scale-105 shadow-md"
              >
                <LogOut className="h-4 w-4 mr-2" />
                Logout
              </button>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b border-purple-100 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8" aria-label="Tabs">
            {[
              { id: "overview", label: "Overview", icon: Activity },
              { id: "screens", label: "Screen Management", icon: Monitor },
              { id: "bookings", label: "Booking Requests", icon: Calendar },
              { id: "analytics", label: "Revenue Analytics", icon: BarChart3 },
            ].map((tab, index) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: index * 0.1 }}
                  className={`${
                    activeTab === tab.id
                      ? 'border-purple-500 text-purple-600 bg-purple-50'
                      : 'border-transparent text-gray-500 hover:text-purple-600 hover:border-purple-300 hover:bg-purple-25'
                  } whitespace-nowrap py-4 px-4 border-b-2 font-medium text-sm flex items-center rounded-t-lg transition-all duration-200 transform hover:scale-105`}
                >
                  <Icon className="h-5 w-5 mr-2" />
                  {tab.label}
                </motion.button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 bg-red-500/10 border border-red-400/20 rounded-lg p-4 text-red-300"
          >
            <p>{error}</p>
            <button
              onClick={handleRefresh}
              className="mt-2 text-sm underline hover:no-underline"
            >
              Try again
            </button>
          </motion.div>
        )}

        {activeTab === "overview" && dashboardStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="space-y-8"
          >
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatCard
                icon={Monitor}
                title="Total Screens"
                value={dashboardStats.screens.total_screens}
                subtitle={`${dashboardStats.screens.active_screens} active`}
                color="blue"
                delay={100}
              />

              <StatCard
                icon={Calendar}
                title="Total Bookings"
                value={dashboardStats.bookingRequests.total_requests}
                subtitle={`${dashboardStats.bookingRequests.pending_requests} pending`}
                color="green"
                delay={200}
              />

              <StatCard
                icon={DollarSign}
                title="Monthly Revenue"
                value={`₹${dashboardStats.monthlyBookings
                  .reduce((sum, month) => sum + month.total_revenue, 0)
                  .toLocaleString()}`}
                subtitle="All months"
                color="purple"
                delay={300}
              />

              <StatCard
                icon={Users}
                title="Top Cities"
                value={dashboardStats.topCities.length}
                subtitle="Active locations"
                color="orange"
                delay={400}
              />
            </div>

            {/* Screen Status Overview */}
            <motion.div 
              className="bg-white rounded-xl p-6 border border-purple-100 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Screen Status Overview
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <motion.div 
                  className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 0.9 }}
                >
                  <CheckCircle className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600">Approved</p>
                    <p className="text-xl font-bold text-gray-900">
                      {dashboardStats.screens.active_screens}
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.0 }}
                >
                  <Clock className="w-6 h-6 text-yellow-600" />
                  <div>
                    <p className="text-sm text-gray-600">Pending</p>
                    <p className="text-xl font-bold text-gray-900">
                      {dashboardStats.bookingRequests.pending_requests}
                    </p>
                  </div>
                </motion.div>

                <motion.div 
                  className="flex items-center gap-3 p-4 bg-red-50 rounded-lg border border-red-200"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.1 }}
                >
                  <XCircle className="w-6 h-6 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600">Rejected</p>
                    <p className="text-xl font-bold text-gray-900">
                      {dashboardStats.bookingRequests.rejected_requests}
                    </p>
                  </div>
                </motion.div>
              </div>
            </motion.div>

            {/* Recent Activity */}
            <motion.div 
              className="bg-white rounded-xl p-6 border border-purple-100 shadow-lg"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.2 }}
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Activity
              </h3>
              <div className="space-y-3">
                <motion.div 
                  className="flex items-center justify-between py-3 px-4 bg-purple-50 rounded-lg border-l-4 border-purple-500"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.3 }}
                >
                  <span className="text-gray-700 font-medium">
                    Latest screens requiring approval
                  </span>
                  <span className="text-purple-600 font-bold text-lg">
                    {dashboardStats.bookingRequests.pending_requests}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between py-3 px-4 bg-green-50 rounded-lg border-l-4 border-green-500"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.4 }}
                >
                  <span className="text-gray-700 font-medium">Total active screens</span>
                  <span className="text-green-600 font-bold text-lg">
                    {dashboardStats.screens.active_screens}
                  </span>
                </motion.div>
                <motion.div 
                  className="flex items-center justify-between py-3 px-4 bg-blue-50 rounded-lg border-l-4 border-blue-500"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.4, delay: 1.5 }}
                >
                  <span className="text-gray-700 font-medium">Recent bookings</span>
                  <span className="text-blue-600 font-bold text-lg">
                    {dashboardStats.recentBookings.length}
                  </span>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}

        {activeTab === "screens" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg border border-purple-100">
              <div className="px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
                <h3 className="text-lg font-semibold text-purple-800">
                  Screen Management
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {screens.map((screen, index) => (
                    <motion.div
                      key={screen.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-purple-25 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div>
                        <h4 className="font-semibold text-gray-900 mb-1">
                          {screen.screen_name}
                        </h4>
                        <p className="text-sm text-purple-700 font-medium">
                          {screen.city} - {screen.location_in_venue}
                        </p>
                        <p className="text-xs text-gray-600">
                          Owner: {screen.owner_email}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span
                          className={`px-3 py-1 rounded-full text-xs font-medium border ${
                            screen.is_active
                              ? "bg-green-100 text-green-800 border-green-200"
                              : "bg-red-100 text-red-800 border-red-200"
                          }`}
                        >
                          {screen.is_active ? "Active" : "Inactive"}
                        </span>
                        <span className="text-sm text-gray-600 font-medium">
                          {screen.booking_requests_count} requests
                        </span>
                        <div className="flex gap-2">
                          <button className="px-3 py-1 text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-md transition-all duration-200 text-sm font-medium">
                            Edit
                          </button>
                          <button className="px-3 py-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded-md transition-all duration-200 text-sm font-medium">
                            Delete
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "bookings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            <div className="bg-white rounded-xl shadow-lg border border-purple-100">
              <div className="px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <h3 className="text-lg font-semibold text-purple-800">
                      Booking Requests Management
                    </h3>
                    <div className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={
                          selectedBookings.length === bookings.length &&
                          bookings.length > 0
                        }
                        onChange={(e) => {
                          if (e.target.checked) {
                            setSelectedBookings(bookings.map((b) => b.id));
                          } else {
                            setSelectedBookings([]);
                          }
                        }}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <span className="text-sm text-purple-700">
                        Select All ({selectedBookings.length}/{bookings.length})
                      </span>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleBulkAction("accept")}
                      disabled={selectedBookings.length === 0}
                      className="px-4 py-2 bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                    >
                      Bulk Accept
                    </button>
                    <button
                      onClick={() => handleBulkAction("reject")}
                      disabled={selectedBookings.length === 0}
                      className="px-4 py-2 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                    >
                      Bulk Reject
                    </button>
                    <button
                      onClick={() => handleBulkAction("cancel")}
                      disabled={selectedBookings.length === 0}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                    >
                      Bulk Cancel
                    </button>
                    <button
                      onClick={() => handleBulkAction("delete")}
                      disabled={selectedBookings.length === 0}
                      className="px-4 py-2 bg-red-800 hover:bg-red-900 disabled:bg-red-400 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                    >
                      Bulk Delete
                    </button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  {bookings.map((booking, index) => (
                    <motion.div
                      key={booking.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.4, delay: index * 0.1 }}
                      className="flex items-center justify-between p-6 bg-gradient-to-r from-white to-purple-25 rounded-xl border border-purple-200 hover:shadow-lg transition-all duration-300"
                    >
                      <div className="flex items-center gap-4">
                        <input
                          type="checkbox"
                          checked={selectedBookings.includes(booking.id)}
                          onChange={(e) =>
                            handleBookingSelection(booking.id, e.target.checked)
                          }
                          className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                        />
                        <div>
                          <h4 className="font-semibold text-gray-900 mb-1">
                            {booking.campaign_name}
                          </h4>
                          <p className="text-sm text-purple-700 font-medium">
                            Screen: {booking.screen_name}
                          </p>
                          <p className="text-xs text-gray-600">
                            {new Date(booking.start_date).toLocaleDateString()} -{" "}
                            {new Date(booking.end_date).toLocaleDateString()}
                          </p>
                          <p className="text-xs text-gray-600">
                            Advertiser: {booking.advertiser_name}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <p className="text-gray-900 font-semibold text-lg">
                            ₹{booking.total_budget.toLocaleString()}
                          </p>
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-medium border ${
                              booking.status === "accepted"
                                ? "bg-green-100 text-green-800 border-green-200"
                                : booking.status === "rejected"
                                ? "bg-red-100 text-red-800 border-red-200"
                                : booking.status === "cancelled"
                                ? "bg-yellow-100 text-yellow-800 border-yellow-200"
                                : "bg-blue-100 text-blue-800 border-blue-200"
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>

                        <div className="flex gap-2">
                          <button
                            onClick={() =>
                              handleBookingAction(booking.id, "accepted")
                            }
                            disabled={
                              booking.status === "accepted" ||
                              processingBooking === booking.id
                            }
                            className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-300 disabled:cursor-not-allowed text-white text-xs rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                          >
                            {processingBooking === booking.id
                              ? "Processing..."
                              : "Accept"}
                          </button>
                          <button
                            onClick={() =>
                              handleBookingAction(booking.id, "rejected")
                            }
                            disabled={
                              booking.status === "rejected" ||
                              processingBooking === booking.id
                            }
                            className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-300 disabled:cursor-not-allowed text-white text-xs rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                          >
                            {processingBooking === booking.id
                              ? "Processing..."
                              : "Reject"}
                          </button>
                          <button
                            onClick={() =>
                              handleBookingAction(booking.id, "cancelled")
                            }
                            disabled={
                              booking.status === "cancelled" ||
                              processingBooking === booking.id
                            }
                            className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-300 disabled:cursor-not-allowed text-white text-xs rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                          >
                            {processingBooking === booking.id
                              ? "Processing..."
                              : "Cancel"}
                          </button>
                          <button
                            onClick={() => handleDeleteBooking(booking.id)}
                            disabled={processingBooking === booking.id}
                            className="px-3 py-1 bg-red-800 hover:bg-red-900 disabled:bg-red-400 disabled:cursor-not-allowed text-white text-xs rounded-lg transition-all duration-200 transform hover:scale-105 shadow-md font-medium"
                          >
                            {processingBooking === booking.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {bookings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">
                      No booking requests found
                    </div>
                  )}
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === "analytics" && revenue && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-6"
          >
            {/* Revenue Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <StatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`₹${revenue?.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0) || 0}`}
                subtitle="All time earnings"
                color="purple"
                delay={100}
              />
              <StatCard
                icon={BarChart3}
                title="Monthly Average"
                value={`₹${Math.round((revenue?.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0) || 0) / Math.max(revenue?.monthlyRevenue?.length || 1, 1))}`}
                subtitle="Per month average"
                color="blue"
                delay={200}
              />
              <StatCard
                icon={Activity}
                title="Active Cities"
                value={revenue.cityRevenue?.length || 0}
                subtitle="Revenue generating"
                color="green"
                delay={300}
              />
            </div>

            <div className="bg-white rounded-xl shadow-lg border border-purple-100">
              <div className="px-6 py-4 border-b border-purple-100 bg-gradient-to-r from-purple-50 to-purple-100 rounded-t-xl">
                <h3 className="text-lg font-semibold text-purple-800">
                  Revenue Analytics
                </h3>
              </div>
              <div className="p-6">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  <motion.div 
                    className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-6 border border-purple-200 shadow-md hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h4 className="text-sm font-medium text-purple-700 mb-2">Total Revenue</h4>
                    <p className="text-3xl font-bold text-purple-900">
                       ₹{revenue?.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0)?.toLocaleString() || 0}
                     </p>
                    <div className="mt-2 flex items-center text-sm text-green-600">
                      <TrendingUp className="w-4 h-4 mr-1" />
                      All time earnings
                    </div>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-6 border border-blue-200 shadow-md hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.2 }}
                  >
                    <h4 className="text-sm font-medium text-blue-700 mb-2">Monthly Average</h4>
                    <p className="text-3xl font-bold text-blue-900">
                       ₹{Math.round((revenue?.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0) || 0) / Math.max(revenue?.monthlyRevenue?.length || 1, 1)).toLocaleString()}
                     </p>
                    <div className="mt-2 flex items-center text-sm text-blue-600">
                      <BarChart3 className="w-4 h-4 mr-1" />
                      Per month average
                    </div>
                  </motion.div>
                  <motion.div 
                    className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-6 border border-green-200 shadow-md hover:shadow-lg transition-all duration-300"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4, delay: 0.3 }}
                  >
                    <h4 className="text-sm font-medium text-green-700 mb-2">Active Cities</h4>
                    <p className="text-3xl font-bold text-green-900">
                      {revenue?.cityRevenue?.length || 0}
                    </p>
                    <div className="mt-2 flex items-center text-sm text-green-600">
                      <Activity className="w-4 h-4 mr-1" />
                      Revenue generating
                    </div>
                  </motion.div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="text-sm font-semibold text-purple-700 mb-4">
                      Monthly Revenue
                    </h4>
                    <div className="space-y-3">
                      {revenue?.monthlyRevenue?.map((month, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-purple-25 to-purple-50 rounded-lg border border-purple-200 hover:shadow-md transition-all duration-300"
                        >
                          <span className="text-gray-700 font-medium">
                            Month {month.month}/{month.year}
                          </span>
                          <span className="text-purple-800 font-bold text-lg">
                            ₹{month.total_revenue.toLocaleString()}
                          </span>
                        </motion.div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">
                          No monthly revenue data available
                        </div>
                      )}
                    </div>
                  </div>
                  <div>
                    <h4 className="text-sm font-semibold text-purple-700 mb-4">
                      City Performance
                    </h4>
                    <div className="space-y-3">
                      {revenue?.cityRevenue?.map((city, index) => (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.4, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-25 to-blue-50 rounded-lg border border-blue-200 hover:shadow-md transition-all duration-300"
                        >
                          <span className="text-gray-700 font-medium">{city.city}</span>
                          <span className="text-blue-800 font-bold text-lg">
                            ₹{city.total_revenue.toLocaleString()}
                          </span>
                        </motion.div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">
                          No city revenue data available
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
