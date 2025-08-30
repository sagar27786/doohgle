import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  RefreshCw
} from 'lucide-react';
import { adminService, DashboardStats, AdminScreen, AdminBookingRequest, RevenueAnalytics } from '../../services/adminService';

interface AdminDashboardProps {
  onLogout: () => void;
}

type ActiveTab = 'overview' | 'screens' | 'bookings' | 'analytics';

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('overview');
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [screens, setScreens] = useState<AdminScreen[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [selectedBookings, setSelectedBookings] = useState<string[]>([]);
  const [processingBooking, setProcessingBooking] = useState<string | null>(null);

  const loadDashboardData = async () => {
    try {
      setError(null);
      const [statsData, screensData, bookingsData, revenueData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getAllScreens(),
        adminService.getAllBookingRequests(),
        adminService.getRevenueAnalytics()
      ]);

      setDashboardStats(statsData);
      setScreens(screensData);
      setBookings(bookingsData);
      setRevenue(revenueData);
    } catch (err: any) {
      setError(err.message || 'Failed to load dashboard data');
      console.error('Dashboard data loading error:', err);
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
    setSelectedBookings(prev => 
      selected 
        ? [...prev, bookingId]
        : prev.filter(id => id !== bookingId)
    );
  };

  const handleBookingAction = async (bookingId: string, status: string) => {
    try {
      setProcessingBooking(bookingId);
      await adminService.updateBookingStatus(bookingId, status);
      
      // Update booking in state
      setBookings(prev => prev.map(booking => 
        booking.id === bookingId 
          ? { ...booking, status: status }
          : booking
      ));
      
      // Refresh dashboard stats
      await handleRefresh();
    } catch (error: any) {
      console.error('Error updating booking:', error);
      setError(error.message || 'Failed to update booking status');
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleDeleteBooking = async (bookingId: string) => {
    if (!confirm('Are you sure you want to delete this booking? This action cannot be undone.')) {
      return;
    }

    try {
      setProcessingBooking(bookingId);
      await adminService.deleteBookingRequest(bookingId);
      
      // Remove booking from state
      setBookings(prev => prev.filter(booking => booking.id !== bookingId));
      
      // Refresh dashboard stats
      await handleRefresh();
    } catch (error: any) {
      console.error('Error deleting booking:', error);
      setError(error.message || 'Failed to delete booking');
    } finally {
      setProcessingBooking(null);
    }
  };

  const handleBulkAction = async (action: string) => {
    if (selectedBookings.length === 0) {
      alert('Please select bookings to perform bulk action');
      return;
    }

    const actionLabel = action.charAt(0).toUpperCase() + action.slice(1);
    if (!confirm(`Are you sure you want to ${actionLabel.toLowerCase()} ${selectedBookings.length} selected bookings?`)) {
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

  const StatCard = ({ icon: Icon, title, value, subtitle, color = "purple" }: {
    icon: any;
    title: string;
    value: string | number;
    subtitle?: string;
    color?: string;
  }) => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ scale: 1.02 }}
      className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20"
    >
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-gray-300 mb-1">{title}</p>
          <p className="text-2xl font-bold text-white mb-1">{value}</p>
          {subtitle && <p className="text-xs text-gray-400">{subtitle}</p>}
        </div>
        <div className={`p-3 rounded-lg bg-${color}-500/20`}>
          <Icon className={`w-6 h-6 text-${color}-400`} />
        </div>
      </div>
    </motion.div>
  );

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3 text-white"
        >
          <Loader2 className="w-8 h-8 animate-spin" />
          <span className="text-xl">Loading Admin Dashboard...</span>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
      {/* Header */}
      <div className="bg-black/20 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <Shield className="w-8 h-8 text-purple-400" />
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
            </div>
            
            <div className="flex items-center gap-4">
              <button
                onClick={handleRefresh}
                disabled={refreshing}
                className="p-2 text-gray-300 hover:text-white transition-colors disabled:opacity-50"
              >
                <RefreshCw className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
              </button>
              
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 px-4 py-2 bg-red-600/20 hover:bg-red-600/30 text-red-300 rounded-lg transition-colors"
              >
                <LogOut className="w-4 h-4" />
                <span>Logout</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-black/10 backdrop-blur-lg border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            {[
              { id: 'overview', label: 'Overview', icon: Activity },
              { id: 'screens', label: 'Screen Management', icon: Monitor },
              { id: 'bookings', label: 'Booking Requests', icon: Calendar },
              { id: 'analytics', label: 'Revenue Analytics', icon: BarChart3 },
            ].map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  className={`flex items-center gap-2 px-4 py-4 border-b-2 transition-colors ${
                    activeTab === tab.id
                      ? 'border-purple-400 text-purple-300'
                      : 'border-transparent text-gray-400 hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="font-medium">{tab.label}</span>
                </button>
              );
            })}
          </div>
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

        {activeTab === 'overview' && dashboardStats && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
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
              />
              
              <StatCard
                icon={Calendar}
                title="Total Bookings"
                value={dashboardStats.bookingRequests.total_requests}
                subtitle={`${dashboardStats.bookingRequests.pending_requests} pending`}
                color="green"
              />
              
              <StatCard
                icon={DollarSign}
                title="Monthly Revenue"
                value={`₹${dashboardStats.monthlyBookings.reduce((sum, month) => sum + month.total_revenue, 0).toLocaleString()}`}
                subtitle="All months"
                color="purple"
              />
              
              <StatCard
                icon={Users}
                title="Top Cities"
                value={dashboardStats.topCities.length}
                subtitle="Active locations"
                color="orange"
              />
            </div>

            {/* Screen Status Overview */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Screen Status Overview</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center gap-3 p-4 bg-green-500/10 rounded-lg">
                  <CheckCircle className="w-6 h-6 text-green-400" />
                  <div>
                    <p className="text-sm text-gray-300">Approved</p>
                    <p className="text-xl font-bold text-white">{dashboardStats.screens.active_screens}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-yellow-500/10 rounded-lg">
                  <Clock className="w-6 h-6 text-yellow-400" />
                  <div>
                    <p className="text-sm text-gray-300">Pending</p>
                    <p className="text-xl font-bold text-white">{dashboardStats.bookingRequests.pending_requests}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3 p-4 bg-red-500/10 rounded-lg">
                  <XCircle className="w-6 h-6 text-red-400" />
                  <div>
                    <p className="text-sm text-gray-300">Rejected</p>
                    <p className="text-xl font-bold text-white">{dashboardStats.bookingRequests.rejected_requests}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity */}
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Latest screens requiring approval</span>
                  <span className="text-purple-400 font-medium">{dashboardStats.bookingRequests.pending_requests}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b border-white/10">
                  <span className="text-gray-300">Total active screens</span>
                  <span className="text-green-400 font-medium">{dashboardStats.screens.active_screens}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-gray-300">Recent bookings</span>
                  <span className="text-blue-400 font-medium">{dashboardStats.recentBookings.length}</span>
                </div>
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'screens' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Screen Management</h3>
              <div className="space-y-4">
                {screens.map((screen) => (
                  <div key={screen.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div>
                      <h4 className="font-medium text-white">{screen.screen_name}</h4>
                      <p className="text-sm text-gray-300">{screen.city} - {screen.location_in_venue}</p>
                      <p className="text-xs text-gray-400">Owner: {screen.owner_email}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        screen.is_active 
                          ? 'bg-green-500/20 text-green-300' 
                          : 'bg-red-500/20 text-red-300'
                      }`}>
                        {screen.is_active ? 'Active' : 'Inactive'}
                      </span>
                      <span className="text-xs text-gray-400">{screen.booking_requests_count} requests</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'bookings' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-4">
                  <h3 className="text-lg font-semibold text-white">Booking Requests Management</h3>
                  <div className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={selectedBookings.length === bookings.length && bookings.length > 0}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setSelectedBookings(bookings.map(b => b.id));
                        } else {
                          setSelectedBookings([]);
                        }
                      }}
                      className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                    />
                    <span className="text-sm text-gray-300">
                      Select All ({selectedBookings.length}/{bookings.length})
                    </span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => handleBulkAction('accept')}
                    disabled={selectedBookings.length === 0}
                    className="px-3 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  >
                    Bulk Accept
                  </button>
                  <button
                    onClick={() => handleBulkAction('reject')}
                    disabled={selectedBookings.length === 0}
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  >
                    Bulk Reject
                  </button>
                  <button
                    onClick={() => handleBulkAction('cancel')}
                    disabled={selectedBookings.length === 0}
                    className="px-3 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  >
                    Bulk Cancel
                  </button>
                  <button
                    onClick={() => handleBulkAction('delete')}
                    disabled={selectedBookings.length === 0}
                    className="px-3 py-1 bg-red-800 hover:bg-red-900 disabled:bg-red-900 disabled:cursor-not-allowed text-white text-sm rounded-lg transition-colors"
                  >
                    Bulk Delete
                  </button>
                </div>
              </div>
              
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking.id} className="flex items-center justify-between p-4 bg-white/5 rounded-lg border border-white/10">
                    <div className="flex items-center gap-4">
                      <input
                        type="checkbox"
                        checked={selectedBookings.includes(booking.id)}
                        onChange={(e) => handleBookingSelection(booking.id, e.target.checked)}
                        className="w-4 h-4 text-purple-600 bg-gray-100 border-gray-300 rounded focus:ring-purple-500"
                      />
                      <div>
                        <h4 className="font-medium text-white">{booking.campaign_name}</h4>
                        <p className="text-sm text-gray-300">Screen: {booking.screen_name}</p>
                        <p className="text-xs text-gray-400">
                          {new Date(booking.start_date).toLocaleDateString()} - {new Date(booking.end_date).toLocaleDateString()}
                        </p>
                        <p className="text-xs text-gray-400">Advertiser: {booking.advertiser_name}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <p className="text-white font-medium">₹{booking.total_budget.toLocaleString()}</p>
                        <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                          booking.status === 'accepted' 
                            ? 'bg-green-500/20 text-green-300' 
                            : booking.status === 'rejected'
                            ? 'bg-red-500/20 text-red-300'
                            : booking.status === 'cancelled'
                            ? 'bg-yellow-500/20 text-yellow-300'
                            : 'bg-blue-500/20 text-blue-300'
                        }`}>
                          {booking.status}
                        </span>
                      </div>
                      
                      <div className="flex gap-1">
                        <button
                          onClick={() => handleBookingAction(booking.id, 'accepted')}
                          disabled={booking.status === 'accepted' || processingBooking === booking.id}
                          className="px-2 py-1 bg-green-600 hover:bg-green-700 disabled:bg-green-800 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                        >
                          {processingBooking === booking.id ? 'Processing...' : 'Accept'}
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'rejected')}
                          disabled={booking.status === 'rejected' || processingBooking === booking.id}
                          className="px-2 py-1 bg-red-600 hover:bg-red-700 disabled:bg-red-800 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                        >
                          {processingBooking === booking.id ? 'Processing...' : 'Reject'}
                        </button>
                        <button
                          onClick={() => handleBookingAction(booking.id, 'cancelled')}
                          disabled={booking.status === 'cancelled' || processingBooking === booking.id}
                          className="px-2 py-1 bg-yellow-600 hover:bg-yellow-700 disabled:bg-yellow-800 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                        >
                          {processingBooking === booking.id ? 'Processing...' : 'Cancel'}
                        </button>
                        <button
                          onClick={() => handleDeleteBooking(booking.id)}
                          disabled={processingBooking === booking.id}
                          className="px-2 py-1 bg-red-800 hover:bg-red-900 disabled:bg-red-900 disabled:cursor-not-allowed text-white text-xs rounded transition-colors"
                        >
                          {processingBooking === booking.id ? 'Deleting...' : 'Delete'}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {bookings.length === 0 && (
                  <div className="text-center py-8 text-gray-400">
                    No booking requests found
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}

        {activeTab === 'analytics' && revenue && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            <div className="bg-white/10 backdrop-blur-lg rounded-xl p-6 border border-white/20">
              <h3 className="text-lg font-semibold text-white mb-4">Revenue Analytics</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">Monthly Revenue</h4>
                  <div className="space-y-2">
                    {revenue.monthlyRevenue.map((month, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">Month {month.month}/{month.year}</span>
                        <span className="text-white font-medium">₹{month.total_revenue.toLocaleString()}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-medium text-gray-300 mb-3">City Performance</h4>
                  <div className="space-y-2">
                    {revenue.cityRevenue.map((city, index) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-white/5 rounded-lg">
                        <span className="text-gray-300">{city.city}</span>
                        <span className="text-white font-medium">₹{city.total_revenue.toLocaleString()}</span>
                      </div>
                    ))}
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
