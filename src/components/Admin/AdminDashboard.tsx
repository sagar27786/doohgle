import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
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
  BarChart3,
  RefreshCw,
  TrendingUp,
  TrendingDown,
  Zap,
  Bell,
  Download,
  Target,
  Plus,
  PieChart,
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
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [screens, setScreens] = useState<AdminScreen[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const [statsData, screensData, bookingsData, revenueData] = await Promise.all([
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

  // Enhanced Stat Card Component
  const EnhancedStatCard: React.FC<{
    icon: React.ElementType;
    title: string;
    value: string | number;
    subtitle: string;
    gradient: string;
    iconBg: string;
    change?: number;
    delay?: number;
  }> = ({ icon: Icon, title, value, subtitle, gradient, iconBg, change, delay = 0 }) => (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ 
        duration: 0.6, 
        delay: delay * 0.1,
        type: "spring",
        stiffness: 100 
      }}
      whileHover={{ 
        scale: 1.05, 
        y: -8,
        transition: { duration: 0.2 }
      }}
      className={`relative overflow-hidden rounded-2xl bg-gradient-to-br ${gradient} p-6 shadow-lg hover:shadow-2xl transition-all duration-300 border border-white/20 backdrop-blur-sm`}
    >
      <div className="relative z-10">
        <div className="flex items-center justify-between mb-4">
          <div className={`p-3 rounded-xl ${iconBg} backdrop-blur-sm`}>
            <Icon className="h-6 w-6 text-white" />
          </div>
          {change !== undefined && (
            <div className={`flex items-center space-x-1 px-2 py-1 rounded-full text-xs font-medium ${
              change >= 0 ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'
            }`}>
              {change >= 0 ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
              <span>{Math.abs(change)}%</span>
            </div>
          )}
        </div>
        
        <h3 className="text-sm font-medium text-white/80 mb-1">{title}</h3>
        <div className="text-2xl font-bold text-white mb-1">{value}</div>
        <p className="text-xs text-white/60">{subtitle}</p>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center space-y-4"
        >
          <div className="relative">
            <div className="w-16 h-16 border-4 border-purple-300 border-t-purple-600 rounded-full animate-spin"></div>
            <div className="absolute inset-2 w-12 h-12 border-4 border-transparent border-t-purple-400 rounded-full animate-spin animate-reverse"></div>
          </div>
          <div className="text-center">
            <h3 className="text-xl font-semibold text-white mb-2">Loading Admin Dashboard</h3>
            <p className="text-purple-300">Fetching latest data...</p>
          </div>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-black/20 backdrop-blur-lg border-b border-white/10"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <motion.div
                whileHover={{ rotate: 360 }}
                transition={{ duration: 0.5 }}
                className="p-2 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl"
              >
                <Shield className="h-8 w-8 text-white" />
              </motion.div>
              <div>
                <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
                  Admin Dashboard
                </h1>
                <p className="text-sm text-white/60">Manage your digital advertising platform</p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm"
              >
                <RefreshCw className={`h-5 w-5 ${refreshing ? 'animate-spin' : ''}`} />
              </motion.button>
              
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="p-2 bg-white/10 hover:bg-white/20 rounded-lg text-white transition-colors backdrop-blur-sm"
              >
                <Bell className="h-5 w-5" />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
                className="flex items-center space-x-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors backdrop-blur-sm border border-red-500/30"
              >
                <LogOut className="h-4 w-4" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>

          <nav className="flex space-x-1 pb-4">
            {[
              { id: "overview", label: "Overview", icon: BarChart3 },
              { id: "screens", label: "Screen Management", icon: Monitor },
              { id: "bookings", label: "Booking Requests", icon: Calendar },
              { id: "analytics", label: "Revenue Analytics", icon: PieChart },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all ${
                    activeTab === tab.id
                      ? "bg-white/20 text-white border border-white/30 shadow-lg"
                      : "text-white/70 hover:text-white hover:bg-white/10"
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </nav>
        </div>
      </motion.header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -20, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.95 }}
              className="mb-6 bg-red-500/10 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm"
            >
              <div className="flex items-center space-x-3">
                <XCircle className="h-5 w-5 text-red-400" />
                <div>
                  <p className="text-red-300 font-medium">Failed to fetch data</p>
                  <p className="text-red-400/80 text-sm">{error}</p>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleRefresh}
                className="mt-3 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg text-sm transition-colors"
              >
                Try again
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {activeTab === "overview" && dashboardStats && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="space-y-8"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <EnhancedStatCard
                icon={Monitor}
                title="Total Screens"
                value={dashboardStats.screens.total_screens}
                subtitle={`${dashboardStats.screens.active_screens} active`}
                gradient="from-blue-600 to-blue-800"
                iconBg="bg-blue-500/30"
                change={12.5}
                delay={1}
              />
              
              <EnhancedStatCard
                icon={Calendar}
                title="Booking Requests"
                value={dashboardStats.bookingRequests.total_requests}
                subtitle={`${dashboardStats.bookingRequests.pending_requests} pending`}
                gradient="from-green-600 to-green-800"
                iconBg="bg-green-500/30"
                change={8.3}
                delay={2}
              />
              
              <EnhancedStatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`₹${dashboardStats.monthlyBookings.reduce((sum, month) => sum + month.total_revenue, 0).toLocaleString()}`}
                subtitle="All time earnings"
                gradient="from-purple-600 to-purple-800"
                iconBg="bg-purple-500/30"
                change={15.7}
                delay={3}
              />
              
              <EnhancedStatCard
                icon={Users}
                title="Active Cities"
                value={dashboardStats.topCities.length}
                subtitle="Serving locations"
                gradient="from-orange-600 to-orange-800"
                iconBg="bg-orange-500/30"
                change={-2.1}
                delay={4}
              />
            </div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Zap className="h-5 w-5 mr-2 text-yellow-400" />
                Quick Actions
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {[
                  { icon: Plus, label: "Add Screen", color: "blue" },
                  { icon: CheckCircle, label: "Approve Bookings", color: "green" },
                  { icon: BarChart3, label: "View Analytics", color: "purple" },
                  { icon: Download, label: "Export Data", color: "orange" },
                ].map((action, index) => (
                  <motion.button
                    key={action.label}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + index * 0.1 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="p-4 rounded-xl bg-blue-500/20 hover:bg-blue-500/30 text-blue-300 transition-all border border-blue-500/30"
                  >
                    <action.icon className="h-6 w-6 mx-auto mb-2" />
                    <span className="text-sm font-medium">{action.label}</span>
                  </motion.button>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.7 }}
              className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20"
            >
              <h3 className="text-xl font-semibold text-white mb-4 flex items-center">
                <Activity className="h-5 w-5 mr-2 text-green-400" />
                Recent Activity
              </h3>
              <div className="space-y-3">
                {dashboardStats.recentBookings.slice(0, 5).map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.8 + index * 0.1 }}
                    className="flex items-center space-x-4 p-3 bg-white/5 rounded-lg"
                  >
                    <div className={`p-2 rounded-lg ${
                      booking.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                      booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                      'bg-red-500/20 text-red-300'
                    }`}>
                      {booking.status === 'accepted' ? <CheckCircle className="h-4 w-4" /> :
                       booking.status === 'pending' ? <Clock className="h-4 w-4" /> :
                       <XCircle className="h-4 w-4" />}
                    </div>
                    <div className="flex-1">
                      <p className="text-white font-medium">{booking.campaign_name}</p>
                      <p className="text-white/60 text-sm">{booking.advertiser_name} • {booking.screen_name}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">₹{booking.total_budget.toLocaleString()}</p>
                      <p className="text-white/60 text-sm">{new Date(booking.created_at).toLocaleDateString()}</p>
                    </div>
                  </motion.div>
                ))}
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
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Screen Management</h3>
              <div className="space-y-4">
                {screens.map((screen, index) => (
                  <motion.div
                    key={screen.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${screen.is_active ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
                        <Monitor className="h-5 w-5" />
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{screen.screen_name}</h4>
                        <p className="text-white/60 text-sm">{screen.city} • {screen.location_in_venue}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        screen.is_active 
                          ? 'bg-green-500/20 text-green-300 border border-green-500/30'
                          : 'bg-red-500/20 text-red-300 border border-red-500/30'
                      }`}>
                        {screen.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                  </motion.div>
                ))}
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
            <div className="bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20">
              <h3 className="text-xl font-semibold text-white mb-4">Booking Requests</h3>
              <div className="space-y-4">
                {bookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-white/5 rounded-lg"
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`p-2 rounded-lg ${
                        booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300' :
                        booking.status === 'accepted' ? 'bg-green-500/20 text-green-300' :
                        'bg-red-500/20 text-red-300'
                      }`}>
                        {booking.status === 'pending' ? <Clock className="h-5 w-5" /> :
                         booking.status === 'accepted' ? <CheckCircle className="h-5 w-5" /> :
                         <XCircle className="h-5 w-5" />}
                      </div>
                      <div>
                        <h4 className="text-white font-medium">{booking.campaign_name}</h4>
                        <p className="text-white/60 text-sm">{booking.advertiser_name} • {booking.screen_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <span className="text-white font-medium">₹{booking.total_budget.toLocaleString()}</span>
                      <span className={`px-3 py-1 rounded-full text-xs font-medium border ${
                        booking.status === 'pending' ? 'bg-yellow-500/20 text-yellow-300 border-yellow-500/30' :
                        booking.status === 'accepted' ? 'bg-green-500/20 text-green-300 border-green-500/30' :
                        'bg-red-500/20 text-red-300 border-red-500/30'
                      }`}>
                        {booking.status.charAt(0).toUpperCase() + booking.status.slice(1)}
                      </span>
                    </div>
                  </motion.div>
                ))}
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
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <EnhancedStatCard
                icon={DollarSign}
                title="Total Revenue"
                value={`₹${revenue.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0)?.toLocaleString() || 0}`}
                subtitle="All time earnings"
                gradient="from-purple-600 to-purple-800"
                iconBg="bg-purple-500/30"
                change={15.7}
              />
              
              <EnhancedStatCard
                icon={TrendingUp}
                title="Monthly Average"
                value={`₹${Math.round((revenue.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0) || 0) / Math.max(revenue.monthlyRevenue?.length || 1, 1)).toLocaleString()}`}
                subtitle="Average per month"
                gradient="from-blue-600 to-blue-800"
                iconBg="bg-blue-500/30"
                change={8.3}
              />
              
              <EnhancedStatCard
                icon={Target}
                title="Best Month"
                value={`₹${Math.max(...(revenue.monthlyRevenue?.map(m => m.total_revenue) || [0])).toLocaleString()}`}
                subtitle="Highest earnings"
                gradient="from-green-600 to-green-800"
                iconBg="bg-green-500/30"
                change={22.4}
              />
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
};

export default AdminDashboard;
