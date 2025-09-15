import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Shield,
  Users,
  Monitor,
  DollarSign,
  Calendar,
  CheckCircle,
  LogOut,
  BarChart3,
  RefreshCw,
  TrendingUp,
  AlertTriangle,
  Bell,
  ArrowUp,
  ArrowDown,
  MapPin,
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

// Error Boundary Component
const ErrorBoundary: React.FC<{ 
  error: string | null; 
  onRetry: () => void; 
  children: React.ReactNode;
}> = ({ error, onRetry, children }) => {
  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50"
      >
        <div className="text-center p-8 bg-white rounded-2xl shadow-2xl border border-red-100 max-w-md mx-4">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4"
          >
            <AlertTriangle className="w-8 h-8 text-red-600" />
          </motion.div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">Failed to fetch</h3>
          <p className="text-gray-600 mb-6">{error}</p>
          <motion.button
            onClick={onRetry}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-6 py-3 rounded-xl hover:from-red-600 hover:to-orange-600 transition-all duration-300 font-semibold shadow-lg"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try Again
          </motion.button>
        </div>
      </motion.div>
    );
  }
  return <>{children}</>;
};

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("overview");
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [screens, setScreens] = useState<AdminScreen[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setError(null);
      
      // Load each API separately so one failure doesn't break everything
      try {
        const statsData = await adminService.getDashboardStats();
        setDashboardStats(statsData);
      } catch (err) {
        console.error("Failed to load dashboard stats:", err);
      }

      try {
        const screensData = await adminService.getAllScreens();
        setScreens(screensData);
      } catch (err) {
        console.error("Failed to load screens:", err);
      }

      try {
        const bookingsData = await adminService.getAllBookingRequests();
        setBookings(bookingsData);
      } catch (err) {
        console.error("Failed to load bookings:", err);
      }

      try {
        const revenueData = await adminService.getRevenueAnalytics();
        setRevenue(revenueData);
      } catch (err) {
        console.error("Failed to load revenue analytics:", err);
      }

    } catch (err: any) {
      console.error("General dashboard error:", err);
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

  const handleRetry = () => {
    setLoading(true);
    setError(null);
    loadDashboardData();
  };

  // Loading animation component
  const LoadingSpinner = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-50 flex items-center justify-center"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
          className="w-16 h-16 border-4 border-purple-200 border-t-purple-600 rounded-full mx-auto mb-4"
        />
        <motion.h3
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-xl font-semibold text-gray-700 mb-2"
        >
          Loading Admin Dashboard
        </motion.h3>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="text-gray-500"
        >
          Please wait while we fetch your data...
        </motion.p>
      </div>
    </motion.div>
  );

  // Animated counter hook
  const useAnimatedNumber = (end: number, duration: number = 2000, delay: number = 0) => {
    const [current, setCurrent] = useState(0);

    useEffect(() => {
      const timer = setTimeout(() => {
        const increment = end / (duration / 16);
        
        const counter = setInterval(() => {
          setCurrent(prev => {
            const next = prev + increment;
            if (next >= end) {
              clearInterval(counter);
              return end;
            }
            return next;
          });
        }, 16);

        return () => clearInterval(counter);
      }, delay);

      return () => clearTimeout(timer);
    }, [end, duration, delay]);

    return Math.floor(current);
  };

  // Modern Stat Card Component
  const StatCard = ({
    icon: Icon,
    title,
    value,
    subtitle,
    color = "purple",
    delay = 0,
    trend,
  }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
    delay?: number;
    trend?: { value: number; isPositive: boolean };
  }) => {
    const numericValue = typeof value === "number" ? value : parseInt(value.toString().replace(/[^0-9]/g, "")) || 0;
    const animatedValue = useAnimatedNumber(numericValue, 2000, delay);

    const colorClasses = {
      purple: "from-purple-500 to-purple-600 bg-purple-50 border-purple-200 text-purple-700",
      blue: "from-blue-500 to-blue-600 bg-blue-50 border-blue-200 text-blue-700",
      green: "from-green-500 to-green-600 bg-green-50 border-green-200 text-green-700",
      red: "from-red-500 to-red-600 bg-red-50 border-red-200 text-red-700",
      orange: "from-orange-500 to-orange-600 bg-orange-50 border-orange-200 text-orange-700",
    };

    return (
      <motion.div
        initial={{ opacity: 0, y: 20, scale: 0.9 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.6, delay: delay * 0.1 }}
        whileHover={{ scale: 1.02, y: -2 }}
        className={`bg-white rounded-2xl p-6 border-2 ${colorClasses[color as keyof typeof colorClasses].split(' ').slice(2).join(' ')} shadow-xl hover:shadow-2xl transition-all duration-300`}
      >
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl bg-gradient-to-r ${colorClasses[color as keyof typeof colorClasses].split(' ').slice(0, 2).join(' ')} shadow-lg`}>
            <Icon className="w-6 h-6 text-white" />
          </div>
          {trend && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              trend.isPositive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
              {trend.isPositive ? <ArrowUp className="w-3 h-3" /> : <ArrowDown className="w-3 h-3" />}
              <span>{Math.abs(trend.value)}%</span>
            </div>
          )}
        </div>
        <div className="space-y-1">
          <h3 className="text-sm font-medium text-gray-600">{title}</h3>
          <p className="text-3xl font-bold text-gray-900">
            {typeof value === "string" && value.includes("₹") 
              ? `₹${animatedValue.toLocaleString()}` 
              : animatedValue.toLocaleString()}
          </p>
          {subtitle && (
            <p className="text-sm text-gray-500">{subtitle}</p>
          )}
        </div>
      </motion.div>
    );
  };

  // If loading, show loading spinner
  if (loading) {
    return <LoadingSpinner />;
  }

  // Main render with error boundary
  return (
    <ErrorBoundary error={error} onRetry={handleRetry}>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50">
        {/* Header */}
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 text-white shadow-2xl"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 lg:py-8">
            <div className="flex flex-col space-y-4 sm:space-y-0 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center space-x-4">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
                  className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg"
                >
                  <Shield className="w-8 h-8 text-white" />
                </motion.div>
                <div>
                  <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold">
                    Admin Dashboard
                  </h1>
                  <p className="text-white/80 text-sm sm:text-base hidden sm:block">
                    Complete control and analytics
                  </p>
                </div>
              </div>
              
              <div className="flex items-center justify-end space-x-2 sm:space-x-3">
                <motion.button
                  onClick={handleRefresh}
                  disabled={refreshing}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors disabled:opacity-50"
                >
                  <RefreshCw className={`w-4 h-4 sm:w-5 sm:h-5 text-white ${refreshing ? 'animate-spin' : ''}`} />
                </motion.button>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="p-2 sm:p-3 bg-white/10 hover:bg-white/20 rounded-xl transition-colors"
                >
                  <Bell className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                </motion.button>
                
                <motion.button
                  onClick={handleLogout}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center space-x-1 sm:space-x-2 bg-red-500/80 hover:bg-red-600/80 text-white px-3 sm:px-4 py-2 rounded-xl transition-all shadow-lg text-sm sm:text-base"
                >
                  <LogOut className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline">Logout</span>
                </motion.button>
              </div>
            </div>
          </div>
        </motion.header>        {/* Navigation Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white/60 backdrop-blur-sm border-b border-gray-200/50 sticky top-0 z-10"
        >
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <nav className="flex space-x-1 py-3 sm:py-4 overflow-x-auto scrollbar-hide">
              {[
                { id: "overview", label: "Overview", icon: BarChart3 },
                { id: "screens", label: "Screens", icon: Monitor },
                { id: "bookings", label: "Bookings", icon: Calendar },
                { id: "analytics", label: "Analytics", icon: TrendingUp },
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 + index * 0.05 }}
                  className={`flex items-center space-x-1 sm:space-x-2 px-3 sm:px-4 py-2 sm:py-3 rounded-xl font-medium transition-all whitespace-nowrap text-sm sm:text-base ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-purple-500 to-blue-500 text-white shadow-lg"
                      : "text-gray-600 hover:text-gray-900 hover:bg-gray-100"
                  }`}
                >
                  <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                  <span className="hidden xs:inline sm:inline">{tab.label}</span>
                </motion.button>
              ))}
            </nav>
          </div>
        </motion.div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6">
          <AnimatePresence mode="wait">
            {activeTab === "overview" && dashboardStats && (
              <motion.div
                key="overview"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Stats Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                  <StatCard
                    icon={Monitor}
                    title="Total Screens"
                    value={dashboardStats.screens?.total_screens || 0}
                    subtitle="Active displays"
                    color="purple"
                    delay={1}
                    trend={{ value: 12, isPositive: true }}
                  />
                  <StatCard
                    icon={Users}
                    title="Active Screens"
                    value={dashboardStats.screens?.active_screens || 0}
                    subtitle="Currently running"
                    color="green"
                    delay={2}
                    trend={{ value: 8, isPositive: true }}
                  />
                  <StatCard
                    icon={Calendar}
                    title="Booking Requests"
                    value={dashboardStats.bookingRequests?.total_requests || 0}
                    subtitle="All time requests"
                    color="blue"
                    delay={3}
                    trend={{ value: 15, isPositive: true }}
                  />
                  <StatCard
                    icon={CheckCircle}
                    title="Pending Requests"
                    value={dashboardStats.bookingRequests?.pending_requests || 0}
                    subtitle="Awaiting approval"
                    color="orange"
                    delay={4}
                    trend={{ value: 5, isPositive: false }}
                  />
                </div>

                {/* Recent Activity */}
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between py-3 px-3 sm:px-4 bg-purple-50 rounded-lg border-l-4 border-purple-500">
                      <span className="text-gray-700 font-medium text-sm sm:text-base">Pending booking requests</span>
                      <span className="text-purple-600 font-bold text-lg">
                        {dashboardStats.bookingRequests?.pending_requests || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between py-3 px-3 sm:px-4 bg-green-50 rounded-lg border-l-4 border-green-500">
                      <span className="text-gray-700 font-medium text-sm sm:text-base">Active screens</span>
                      <span className="text-green-600 font-bold text-lg">
                        {dashboardStats.screens?.active_screens || 0}
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {activeTab === "screens" && (
              <motion.div
                key="screens"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Screen Management</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {screens.map((screen, index) => (
                      <motion.div
                        key={screen.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 space-y-3 sm:space-y-0"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">{screen.screen_name}</h4>
                          <p className="text-sm text-gray-600 truncate">{screen.city} - {screen.location_in_venue}</p>
                          <p className="text-xs text-gray-500 truncate">Owner: {screen.owner_name}</p>
                        </div>
                        <div className="flex items-center justify-between sm:justify-end gap-3 sm:gap-4 flex-shrink-0">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                              screen.is_active
                                ? "bg-green-100 text-green-800"
                                : "bg-red-100 text-red-800"
                            }`}
                          >
                            {screen.is_active ? "Active" : "Inactive"}
                          </span>
                          <span className="text-xs sm:text-sm text-gray-600 whitespace-nowrap">{screen.booking_requests_count} requests</span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {screens.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No screens found</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "bookings" && (
              <motion.div
                key="bookings"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-6"
              >
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Booking Requests</h3>
                  <div className="space-y-3 sm:space-y-4">
                    {bookings.map((booking, index) => (
                      <motion.div
                        key={booking.id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                        className="flex flex-col sm:flex-row sm:items-center sm:justify-between p-4 sm:p-6 bg-gradient-to-r from-white to-gray-50 rounded-xl border border-gray-200 hover:shadow-lg transition-all duration-300 space-y-3 sm:space-y-0"
                      >
                        <div className="flex-1 min-w-0">
                          <h4 className="font-semibold text-gray-900 mb-1 truncate">{booking.campaign_name}</h4>
                          <p className="text-sm text-gray-600 truncate">Screen: {booking.screen_name}</p>
                          <p className="text-xs text-gray-500 truncate">Advertiser: {booking.advertiser_name}</p>
                          <p className="text-sm font-medium text-purple-600 mt-1">₹{booking.total_budget.toLocaleString()}</p>
                        </div>
                        <div className="flex items-center justify-end flex-shrink-0">
                          <span
                            className={`px-2 sm:px-3 py-1 rounded-full text-xs font-medium ${
                              booking.status === 'accepted' ? 'bg-green-100 text-green-800' :
                              booking.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-red-100 text-red-800'
                            }`}
                          >
                            {booking.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                  {bookings.length === 0 && (
                    <div className="text-center py-8 text-gray-500">No booking requests found</div>
                  )}
                </div>
              </motion.div>
            )}

            {activeTab === "analytics" && revenue && (
              <motion.div
                key="analytics"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                {/* Revenue Summary */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <StatCard
                    icon={DollarSign}
                    title="Total Revenue"
                    value={revenue?.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0) || 0}
                    subtitle="All time earnings"
                    color="purple"
                    delay={1}
                    trend={{ value: 23, isPositive: true }}
                  />
                  <StatCard
                    icon={BarChart3}
                    title="Monthly Average"
                    value={Math.round((revenue?.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0) || 0) / Math.max(revenue?.monthlyRevenue?.length || 1, 1))}
                    subtitle="Per month average"
                    color="blue"
                    delay={2}
                    trend={{ value: 15, isPositive: true }}
                  />
                  <StatCard
                    icon={MapPin}
                    title="Active Cities"
                    value={revenue.cityRevenue?.length || 0}
                    subtitle="Revenue generating"
                    color="green"
                    delay={3}
                    trend={{ value: 8, isPositive: true }}
                  />
                </div>

                {/* Revenue Details */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 lg:gap-8">
                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Monthly Revenue</h3>
                    <div className="space-y-3">
                      {revenue?.monthlyRevenue?.map((month, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 sm:p-4 bg-purple-50 rounded-lg"
                        >
                          <span className="text-gray-700 text-sm sm:text-base">Month {month.month}</span>
                          <span className="font-bold text-purple-600 text-sm sm:text-base">₹{month.total_revenue.toLocaleString()}</span>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">No revenue data available</div>
                      )}
                    </div>
                  </div>

                  <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-4 sm:p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">City Performance</h3>
                    <div className="space-y-3">
                      {revenue?.cityRevenue?.map((city, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 sm:p-4 bg-blue-50 rounded-lg"
                        >
                          <span className="text-gray-700 text-sm sm:text-base truncate pr-2">{city.city}</span>
                          <span className="font-bold text-blue-600 text-sm sm:text-base whitespace-nowrap">₹{city.total_revenue.toLocaleString()}</span>
                        </div>
                      )) || (
                        <div className="text-center py-8 text-gray-500">No city data available</div>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Fallback content when no data is available */}
            {activeTab === "overview" && !dashboardStats && !loading && (
              <motion.div
                key="no-data"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.6 }}
                className="text-center py-12"
              >
                <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8">
                  <h3 className="text-xl font-semibold text-gray-900 mb-4">Welcome to Admin Dashboard</h3>
                  <p className="text-gray-600">Dashboard data will appear here once the backend service is connected.</p>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </ErrorBoundary>
  );
};

export default AdminDashboard;
