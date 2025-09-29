import React, { useState, useEffect } from 'react';
import AdminLogin from './AdminLogin';
import AnimatedScreenCard from '../AnimatedScreenCard';
import { 
  adminService, 
  DashboardStats, 
  AdminScreen, 
  RevenueAnalytics 
} from '../../services/adminService';
import {
  LayoutDashboard,
  Monitor,
  Target,
  TrendingUp,
  Calendar,
  DollarSign,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
  Activity,
  MapPin,
  Eye,
  Trash2,
  AlertTriangle,
  X
} from 'lucide-react';

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [screens, setScreens] = useState<AdminScreen[]>([]);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState<AdminScreen | null>(null);
  const [deleting, setDeleting] = useState(false);

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard, active: true },
    { id: 'screens', label: 'Screens', icon: Monitor, active: true },
    { id: 'campaigns', label: 'Campaigns', icon: Target, active: true },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp, active: true },
    { id: 'bookings', label: 'Bookings', icon: Calendar, active: true },
    { id: 'revenue', label: 'Revenue', icon: DollarSign, active: true },
    { id: 'users', label: 'Users', icon: Users, active: false },
    { id: 'settings', label: 'Settings', icon: Settings, active: true }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [statsData, screensData, revenueData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAllScreens(),
          adminService.getRevenueAnalytics()
        ]);

        setDashboardStats(statsData);
        setScreens(screensData);
        setRevenue(revenueData);
      } catch (err) {
        console.error('Failed to fetch dashboard data:', err);
        setError('Failed to load dashboard data from backend');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleDeleteScreen = async (screenId: number) => {
    try {
      setDeleting(true);
      setError(null);
      
      // Call the backend to delete the screen
      await adminService.deleteScreen(screenId);
      
      // Update local state by removing the deleted screen
      setScreens(prevScreens => prevScreens.filter(screen => screen.id !== screenId));
      
      // Close the modal
      setDeleteModalOpen(false);
      setScreenToDelete(null);
      
      // Refresh dashboard stats
      const updatedStats = await adminService.getDashboardStats();
      setDashboardStats(updatedStats);
      
    } catch (err) {
      console.error('Failed to delete screen:', err);
      setError('Failed to delete screen. Please try again.');
    } finally {
      setDeleting(false);
    }
  };

  const openDeleteModal = (screen: AdminScreen) => {
    setScreenToDelete(screen);
    setDeleteModalOpen(true);
  };

  const closeDeleteModal = () => {
    setDeleteModalOpen(false);
    setScreenToDelete(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="flex flex-col items-center space-y-4">
          <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin"></div>
          <p className="text-gray-600 font-medium">Loading Real Backend Data...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 flex">
      <div className={`${sidebarCollapsed ? 'w-20' : 'w-64'} bg-white/95 backdrop-blur-xl shadow-2xl border-r border-gray-200/50 transition-all duration-500 ease-in-out flex flex-col relative overflow-hidden`}>
        {/* Animated background gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 to-purple-50/30 animate-pulse"></div>
        
        <div className="relative p-6 border-b border-gray-200/30 backdrop-blur-sm">
          <div className="flex items-center justify-between">
            {!sidebarCollapsed && (
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-2xl flex items-center justify-center shadow-lg animate-gradient-x">
                  <span className="text-white font-bold text-xl drop-shadow-lg">D</span>
                </div>
                <div>
                  <h1 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">Doohgle</h1>
                  <p className="text-xs text-gray-500 font-medium">✨ Admin Dashboard</p>
                </div>
              </div>
            )}
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="p-3 rounded-xl hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 transition-all duration-300 transform hover:scale-105 backdrop-blur-sm border border-gray-200/30"
            >
              {sidebarCollapsed ? (
                <ChevronRight className="w-5 h-5 text-gray-600" />
              ) : (
                <ChevronLeft className="w-5 h-5 text-gray-600" />
              )}
            </button>
          </div>
        </div>

        <nav className="relative flex-1 p-4 space-y-3">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                disabled={!item.active}
                className={`group relative w-full flex items-center space-x-4 px-4 py-4 rounded-2xl transition-all duration-300 transform hover:scale-105 ${
                  activeTab === item.id
                    ? 'bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-xl shadow-purple-500/30 border border-white/20'
                    : item.active
                    ? 'text-gray-700 hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 hover:shadow-lg border border-transparent hover:border-purple-200/30'
                    : 'text-gray-400 cursor-not-allowed opacity-60'
                }`}
              >
                <div className={`p-2 rounded-xl transition-all duration-300 ${
                  activeTab === item.id 
                    ? 'bg-white/20 shadow-lg' 
                    : 'group-hover:bg-white/50'
                }`}>
                  <IconComponent className={`w-5 h-5 transition-all duration-300 ${
                    activeTab === item.id ? 'text-white drop-shadow-sm' : 'group-hover:text-purple-600'
                  }`} />
                </div>
                {!sidebarCollapsed && (
                  <span className={`font-semibold transition-all duration-300 ${
                    activeTab === item.id ? 'text-white drop-shadow-sm' : ''
                  }`}>{item.label}</span>
                )}
                {!item.active && !sidebarCollapsed && (
                  <span className="ml-auto text-xs bg-gradient-to-r from-orange-400 to-pink-400 text-white px-3 py-1 rounded-full font-medium animate-pulse shadow-sm">
                    Soon
                  </span>
                )}
                {activeTab === item.id && (
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-pink-500/20 rounded-2xl blur-xl -z-10 animate-pulse"></div>
                )}
              </button>
            );
          })}
        </nav>

        <div className="relative p-4 border-t border-gray-200/30 backdrop-blur-sm">
          <button
            onClick={onLogout}
            className="group relative w-full flex items-center space-x-4 px-4 py-4 rounded-2xl text-red-600 hover:text-white hover:bg-gradient-to-r hover:from-red-500 hover:to-pink-500 transition-all duration-300 transform hover:scale-105 hover:shadow-xl hover:shadow-red-500/30 border border-transparent hover:border-red-200/30"
          >
            <div className="p-2 rounded-xl group-hover:bg-white/20 transition-all duration-300">
              <LogOut className="w-5 h-5 drop-shadow-sm" />
            </div>
            {!sidebarCollapsed && (
              <span className="font-semibold drop-shadow-sm">Logout</span>
            )}
          </button>
        </div>
      </div>

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Enhanced Header with Glass Morphism Effect */}
        <header className="relative bg-white/80 backdrop-blur-xl shadow-lg border-b border-gray-200/30 px-8 py-6">
          {/* Animated background gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50/40 via-purple-50/40 to-pink-50/40 animate-gradient-x"></div>
          
          <div className="relative flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-600 to-purple-600 bg-clip-text text-transparent flex items-center space-x-3">
                {(() => {
                  const IconComponent = navItems.find(item => item.id === activeTab)?.icon;
                  return (
                    <>
                      {IconComponent && (
                        <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                          <IconComponent className="w-8 h-8 text-white drop-shadow-sm" />
                        </div>
                      )}
                      <span className="drop-shadow-sm">
                        {activeTab === 'dashboard' ? 'Dashboard Overview' : 
                         activeTab === 'screens' ? 'Screen Management' :
                         activeTab === 'revenue' ? 'Revenue Analytics' :
                         `${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Management`}
                      </span>
                    </>
                  );
                })()}
              </h2>
              <p className="text-gray-600 font-medium flex items-center space-x-2">
                {error ? (
                  <span className="text-red-500 flex items-center space-x-2">
                    <Activity className="w-4 h-4 animate-spin" />
                    <span>Error loading data</span>
                  </span>
                ) : (
                  <span className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span>Real-time dashboard with live backend data</span>
                  </span>
                )}
              </p>
            </div>
            
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl px-4 py-3 shadow-lg border border-green-200/50">
                <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                <span className="text-sm font-semibold text-green-700">Live Backend</span>
              </div>
              <button 
                onClick={() => window.location.reload()}
                className="group p-3 rounded-2xl bg-gradient-to-r from-blue-500 to-purple-600 text-white hover:from-blue-600 hover:to-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl"
              >
                <Activity className="w-5 h-5 group-hover:animate-spin transition-transform" />
              </button>
            </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-6">
          {error ? (
            <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
              <Activity className="w-16 h-16 text-red-500 mx-auto mb-4" />
              <h3 className="text-xl font-bold text-red-800 mb-2">Error Loading Backend Data</h3>
              <p className="text-red-600">{error}</p>
              <button 
                onClick={() => window.location.reload()}
                className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
              >
                Retry Connection
              </button>
            </div>
          ) : (
            <>
              {activeTab === 'dashboard' && dashboardStats && (
                <div className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center">
                          <Monitor className="w-6 h-6 text-blue-600" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Screens</p>
                          <p className="text-3xl font-bold text-gray-900">{dashboardStats.screens.total_screens}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium">Backend Data</span>
                        <span className="text-gray-500">{dashboardStats.screens.active_screens} online</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-green-100 rounded-xl flex items-center justify-center">
                          <Calendar className="w-6 h-6 text-green-600" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Bookings</p>
                          <p className="text-3xl font-bold text-gray-900">{dashboardStats.bookingRequests.total_requests}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-yellow-600 font-medium">
                          {dashboardStats.bookingRequests.pending_requests} Pending
                        </span>
                        <span className="text-gray-500">{dashboardStats.bookingRequests.accepted_requests} approved</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center">
                          <DollarSign className="w-6 h-6 text-purple-600" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Total Revenue</p>
                          <p className="text-3xl font-bold text-gray-900">
                            ₹{revenue?.monthlyRevenue?.reduce((sum, month) => sum + month.total_revenue, 0)?.toLocaleString() || '0'}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-green-600 font-medium">Backend Data</span>
                        <span className="text-gray-500">Real-time</span>
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200 hover:shadow-lg transition-shadow">
                      <div className="flex items-center justify-between mb-4">
                        <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center">
                          <MapPin className="w-6 h-6 text-orange-600" />
                        </div>
                        <div className="text-right">
                          <p className="text-sm text-gray-500">Cities</p>
                          <p className="text-3xl font-bold text-gray-900">{dashboardStats.topCities.length}</p>
                        </div>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-blue-600 font-medium">
                          {dashboardStats.topCities[0]?.city || 'No Data'}
                        </span>
                        <span className="text-gray-500">Top city</span>
                      </div>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-2 mb-4">
                        <Activity className="w-5 h-5 text-orange-500" />
                        <h3 className="text-lg font-bold text-gray-900">Recent Bookings (Backend)</h3>
                      </div>
                      <div className="space-y-3">
                        {dashboardStats.recentBookings.slice(0, 5).map((booking) => (
                          <div key={booking.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-500 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">{booking.campaign_name.charAt(0)}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{booking.campaign_name}</p>
                                <p className="text-sm text-gray-500">{booking.advertiser_name} • {booking.city}</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-green-600">₹{booking.total_budget.toLocaleString()}</p>
                              <p className="text-xs text-gray-500">{booking.status}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center space-x-2 mb-4">
                        <MapPin className="w-5 h-5 text-blue-500" />
                        <h3 className="text-lg font-bold text-gray-900">Top Cities (Backend)</h3>
                      </div>
                      <div className="space-y-3">
                        {dashboardStats.topCities.slice(0, 5).map((city, index) => (
                          <div key={city.city} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                            <div className="flex items-center space-x-3">
                              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                                <span className="text-blue-600 font-bold">#{index + 1}</span>
                              </div>
                              <div>
                                <p className="font-medium text-gray-900">{city.city}</p>
                                <p className="text-sm text-gray-500">{city.screen_count} screens</p>
                              </div>
                            </div>
                            <div className="text-right">
                              <p className="font-bold text-blue-600">{city.screen_count}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Enhanced Screens Content */}
              {activeTab === 'screens' && (
                <div className="space-y-8">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="p-3 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-2xl shadow-lg">
                        <Monitor className="w-8 h-8 text-white drop-shadow-sm" />
                      </div>
                      <div>
                        <h3 className="text-2xl font-bold bg-gradient-to-r from-gray-900 to-blue-600 bg-clip-text text-transparent">
                          All Screens ({screens.length})
                        </h3>
                        <p className="text-gray-600 font-medium">Real-time screen data from backend</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-2xl px-4 py-3 shadow-lg border border-green-200/50">
                      <div className="w-3 h-3 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full animate-pulse shadow-sm"></div>
                      <span className="text-sm font-semibold text-green-700">Live Backend</span>
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {screens.map((screen) => (
                      <div key={screen.id} className="relative">
                        <AnimatedScreenCard
                          screen={{
                            id: screen.id,
                            name: screen.screen_name,
                            location: screen.location_in_venue,
                            city: screen.city,
                            price_per_day: 2500, // Default price, you can get this from backend
                            type: screen.device_type,
                            status: screen.is_active ? 'available' : 'unavailable',
                            features: ['Digital Display', 'HD Quality', '24/7 Support'],
                            rating: 4.5,
                            views_per_day: Math.floor(Math.random() * 10000) + 5000,
                            isFavorite: false
                          }}
                          onFavorite={(screenId) => {
                            console.log('Favorited screen:', screenId);
                            // Add favorite functionality here
                          }}
                          onView={(screenData) => {
                            console.log('View screen details:', screenData);
                            // Add view details functionality here
                          }}
                        />
                        
                        {/* Delete button overlay */}
                        <button
                          onClick={() => openDeleteModal(screen)}
                          className="absolute top-4 right-16 p-2 rounded-xl text-red-500 hover:bg-red-50 hover:text-red-700 transition-all duration-200 opacity-0 group-hover:opacity-100 transform translate-x-2 group-hover:translate-x-0 shadow-lg hover:shadow-xl z-10 bg-white/90 backdrop-blur-sm"
                          title="Delete Screen"
                        >
                          <Trash2 className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  {screens.length === 0 && !loading && (
                    <div className="text-center py-16">
                      <div className="w-24 h-24 bg-gradient-to-br from-gray-200 to-gray-300 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <Monitor className="w-12 h-12 text-gray-500" />
                      </div>
                      <h3 className="text-xl font-bold text-gray-700 mb-3">No Screens Found</h3>
                      <p className="text-gray-500 max-w-md mx-auto">No screens are currently available in the backend database. Check your backend connection or add screens to get started.</p>
                    </div>
                  )}
                </div>
              )}

              {/* Delete Confirmation Modal */}
              {deleteModalOpen && screenToDelete && (
                <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fadeIn">
                  <div className="bg-white/95 backdrop-blur-sm rounded-3xl max-w-md w-full p-8 shadow-2xl transform transition-all duration-300 border border-gray-200/50">
                    <div className="flex items-start space-x-4 mb-6">
                      <div className="w-14 h-14 bg-gradient-to-br from-red-100 to-red-200 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg">
                        <AlertTriangle className="w-8 h-8 text-red-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="text-xl font-bold text-gray-900 mb-1">Delete Screen</h3>
                        <p className="text-sm text-gray-600 font-medium">This action cannot be undone and will permanently remove the screen from the system.</p>
                      </div>
                      <button
                        onClick={closeDeleteModal}
                        className="p-2 rounded-xl text-gray-400 hover:text-gray-600 hover:bg-gray-100 transition-colors duration-200"
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                    
                    <div className="mb-8">
                      <p className="text-gray-700 font-medium mb-4">
                        Are you sure you want to delete this screen?
                      </p>
                      <div className="bg-gradient-to-r from-gray-50 to-red-50/30 rounded-2xl p-4 border border-red-100/50">
                        <div className="flex items-start space-x-3 mb-3">
                          <Monitor className="w-5 h-5 text-gray-600 mt-0.5 flex-shrink-0" />
                          <div className="flex-1">
                            <span className="font-bold text-gray-900 block">{screenToDelete.screen_name}</span>
                            <span className="text-sm text-gray-600">ID: {screenToDelete.id}</span>
                          </div>
                        </div>
                        <div className="text-sm text-gray-600 space-y-2 ml-8">
                          <div className="flex items-center space-x-2">
                            <MapPin className="w-3 h-3 text-gray-500" />
                            <span>{screenToDelete.city} - {screenToDelete.location_in_venue}</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Users className="w-3 h-3 text-gray-500" />
                            <span>{screenToDelete.owner_name} ({screenToDelete.owner_email})</span>
                          </div>
                          <div className="flex items-center space-x-2">
                            <Activity className="w-3 h-3 text-gray-500" />
                            <span>{screenToDelete.booking_requests_count} booking requests will be affected</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex space-x-4">
                      <button
                        onClick={closeDeleteModal}
                        disabled={deleting}
                        className="flex-1 px-6 py-3 border border-gray-300 rounded-2xl text-gray-700 font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={() => handleDeleteScreen(screenToDelete.id)}
                        disabled={deleting}
                        className="flex-1 px-6 py-3 bg-gradient-to-r from-red-600 to-red-700 text-white font-semibold rounded-2xl hover:from-red-700 hover:to-red-800 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl"
                      >
                        {deleting ? (
                          <>
                            <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                            <span>Deleting...</span>
                          </>
                        ) : (
                          <>
                            <Trash2 className="w-4 h-4" />
                            <span>Delete Screen</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {activeTab === 'revenue' && revenue && (
                <div className="space-y-6">
                  <div className="flex items-center space-x-2">
                    <DollarSign className="w-6 h-6 text-green-600" />
                    <h3 className="text-xl font-bold text-gray-900">Revenue Analytics - Backend Data</h3>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <TrendingUp className="w-5 h-5 text-green-500" />
                      <h4 className="text-lg font-bold text-gray-900">Monthly Revenue Trends</h4>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                      {revenue.monthlyRevenue.slice(-6).map((month) => (
                        <div key={month.month} className="text-center p-4 bg-gray-50 rounded-xl">
                          <p className="text-sm text-gray-500 mb-1">{month.month}</p>
                          <p className="text-xl font-bold text-green-600">₹{month.total_revenue.toLocaleString()}</p>
                          <p className="text-xs text-gray-400">{month.booking_count} bookings</p>
                        </div>
                      ))}
                    </div>
                  </div>
                  
                  <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-200">
                    <div className="flex items-center space-x-2 mb-4">
                      <Eye className="w-5 h-5 text-blue-500" />
                      <h4 className="text-lg font-bold text-gray-900">Top Performing Cities</h4>
                    </div>
                    <div className="space-y-3">
                      {revenue.cityRevenue.slice(0, 5).map((city, index) => (
                        <div key={city.city} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                          <div className="flex items-center space-x-3">
                            <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                              <span className="text-blue-600 font-bold">#{index + 1}</span>
                            </div>
                            <div>
                              <p className="font-medium text-gray-900">{city.city}</p>
                              <p className="text-sm text-gray-500">{city.booking_count} bookings</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="font-bold text-green-600">₹{city.total_revenue.toLocaleString()}</p>
                            <p className="text-xs text-gray-500">{city.booking_count} bookings</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {['campaigns', 'bookings', 'users', 'settings'].includes(activeTab) && (
                <div className="text-center py-12">
                  <div className="text-6xl mb-4 flex justify-center">
                    {(() => {
                      const IconComponent = navItems.find(item => item.id === activeTab)?.icon;
                      return IconComponent ? <IconComponent className="w-16 h-16 text-gray-400" /> : null;
                    })()}
                  </div>
                  <h3 className="text-xl font-bold text-gray-700 mb-2">
                    {navItems.find(item => item.id === activeTab)?.label} Module
                  </h3>
                  <p className="text-gray-500 mb-6">This section is coming soon with advanced features</p>
                  <button className="bg-blue-600 text-white px-6 py-3 rounded-xl hover:bg-blue-700 transition-colors font-medium flex items-center space-x-2 mx-auto">
                    <Activity className="w-4 h-4" />
                    <span>Coming Soon</span>
                  </button>
                </div>
              )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

const AdminApp: React.FC = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      setIsAuthenticated(true);
    }
    setLoading(false);
  }, []);

  const handleLoginSuccess = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  return (
    <>
      {isAuthenticated ? (
        <AdminDashboard onLogout={handleLogout} />
      ) : (
        <AdminLogin onLoginSuccess={handleLoginSuccess} />
      )}
    </>
  );
};

export default AdminApp;
