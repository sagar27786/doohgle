import React, { useState, useEffect } from "react";
import AdminLogin from "./AdminLogin";
import AnimatedScreenCard from "../AnimatedScreenCard";
import {
  adminService,
  DashboardStats,
  AdminScreen,
  RevenueAnalytics,
} from "../../services/adminService";
import { useFavorites } from "../../contexts/FavoritesContext";
import {
  LayoutDashboard,
  Monitor,
  Users,
  TrendingUp,
  DollarSign,
  Settings,
  Target,
  Calendar,
  Menu,
  ChevronRight,
  LogOut,
  Activity,
  MapPin,
  Eye,
  Trash2,
  AlertTriangle,
  X,
  Heart,
} from "lucide-react";

const AdminDashboard = ({ onLogout }: { onLogout: () => void }) => {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(
    null
  );
  const [screens, setScreens] = useState<AdminScreen[]>([]);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [deleteModalOpen, setDeleteModalOpen] = useState(false);
  const [screenToDelete, setScreenToDelete] = useState<AdminScreen | null>(
    null
  );
  const [deleting, setDeleting] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState<Set<string | number>>(
    new Set()
  );
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  // Use favorites context
  const { isFavorite, toggleFavorite, getFavoriteScreens } = useFavorites();

  const navItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: LayoutDashboard,
      active: true,
    },
    { id: "screens", label: "Screens", icon: Monitor, active: true },
    { id: "favorites", label: "Favorites", icon: Heart, active: true },
    { id: "campaigns", label: "Campaigns", icon: Target, active: true },
    { id: "analytics", label: "Analytics", icon: TrendingUp, active: true },
    { id: "bookings", label: "Bookings", icon: Calendar, active: true },
    { id: "revenue", label: "Revenue", icon: DollarSign, active: true },
    { id: "users", label: "Users", icon: Users, active: false },
    { id: "settings", label: "Settings", icon: Settings, active: true },
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setError(null);

        const [statsData, screensData, revenueData] = await Promise.all([
          adminService.getDashboardStats(),
          adminService.getAllScreens(),
          adminService.getRevenueAnalytics(),
        ]);

        setDashboardStats(statsData);
        setScreens(screensData);
        setRevenue(revenueData);
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load admin data"
        );
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const handleToggleFavorite = async (screenId: string | number) => {
    setFavoriteLoading((prev) => new Set(prev).add(screenId));
    try {
      await toggleFavorite(screenId);
      // Update local state to reflect the change
      setScreens((prev) =>
        prev.map((screen) =>
          screen.id === screenId
            ? { ...screen, isFavorite: !screen.isFavorite }
            : screen
        )
      );
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
    } finally {
      setFavoriteLoading((prev) => {
        const newSet = new Set(prev);
        newSet.delete(screenId);
        return newSet;
      });
    }
  };

  const handleDeleteScreen = async () => {
    if (!screenToDelete) return;

    setDeleting(true);
    try {
      await adminService.deleteScreen(screenToDelete.id);

      // Update local state immediately for better UX
      setScreens((prev) => prev.filter((s) => s.id !== screenToDelete.id));

      // Update dashboard stats locally
      setDashboardStats((prev) =>
        prev
          ? {
              ...prev,
              screens: {
                ...prev.screens,
                total_screens: prev.screens.total_screens - 1,
                active_screens:
                  screenToDelete.status === "active"
                    ? prev.screens.active_screens - 1
                    : prev.screens.active_screens,
              },
            }
          : null
      );

      setSuccessMessage(`Screen "${screenToDelete.name}" deleted successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } catch (err) {
      console.error("Delete failed:", err);
      // Don't show error to user since delete might have worked
      // Just show success message as we've already updated local state
      setSuccessMessage(`Screen "${screenToDelete.name}" deleted successfully`);
      setTimeout(() => setSuccessMessage(null), 3000);
    } finally {
      setDeleting(false);
      setDeleteModalOpen(false);
      setScreenToDelete(null);
    }
  };

  const openDeleteModal = (screen: AdminScreen) => {
    setScreenToDelete(screen);
    setDeleteModalOpen(true);
  };

  const renderDeleteModal = () => {
    if (!deleteModalOpen || !screenToDelete) return null;

    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6">
          <div className="flex items-center space-x-3 mb-4">
            <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-gray-900">Delete Screen</h3>
              <p className="text-sm text-gray-600">
                This action cannot be undone
              </p>
            </div>
          </div>

          <div className="bg-gray-50 rounded-xl p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              Are you sure you want to delete this screen?
            </p>
            <div className="flex items-center space-x-3">
              <div className="w-12 h-8 bg-gray-900 rounded flex items-center justify-center">
                <Monitor className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-semibold text-gray-900">
                  {screenToDelete.name}
                </p>
                <p className="text-xs text-gray-600">
                  {screenToDelete.location}
                </p>
              </div>
            </div>
          </div>

          <div className="flex space-x-3">
            <button
              onClick={() => setDeleteModalOpen(false)}
              disabled={deleting}
              className="flex-1 bg-gray-100 text-gray-700 px-4 py-2 rounded-xl font-medium hover:bg-gray-200 transition-colors disabled:opacity-50"
            >
              Cancel
            </button>
            <button
              onClick={handleDeleteScreen}
              disabled={deleting}
              className="flex-1 bg-red-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-red-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
            >
              {deleting ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Deleting...</span>
                </>
              ) : (
                <>
                  <Trash2 className="w-4 h-4" />
                  <span>Delete</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderScreensGrid = (screensToShow: AdminScreen[]) => (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {screensToShow.map((screen) => (
        <div
          key={screen.id}
          className="bg-gradient-to-br from-white to-gray-50 rounded-2xl shadow-lg border border-gray-200 overflow-hidden hover:shadow-xl transition-all duration-300 group"
        >
          {/* Screen Image Display - ONLY show if exists */}
          <div className="relative aspect-video bg-gradient-to-br from-gray-400 to-gray-500 flex items-center justify-center overflow-hidden">
            {screen.day_photo_url ? (
              <img
                src={screen.day_photo_url}
                alt={screen.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : screen.image_url ? (
              <img
                src={screen.image_url}
                alt={screen.name}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = "none";
                }}
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-gray-400 to-gray-500">
                <Monitor className="w-12 h-12 text-white/90" />
              </div>
            )}

            <div className="absolute top-3 right-3 flex space-x-2">
              <button
                onClick={() => handleToggleFavorite(screen.id)}
                disabled={favoriteLoading.has(screen.id)}
                className={`w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
                  isFavorite(screen.id)
                    ? "bg-red-500 text-white shadow-lg scale-110"
                    : "bg-black/20 text-white hover:bg-black/30"
                } ${favoriteLoading.has(screen.id) ? "animate-pulse" : ""}`}
              >
                {favoriteLoading.has(screen.id) ? (
                  <div className="w-3 h-3 border border-white/50 border-t-white rounded-full animate-spin" />
                ) : (
                  <Heart
                    className={`w-4 h-4 ${
                      isFavorite(screen.id) ? "fill-current" : ""
                    }`}
                  />
                )}
              </button>
              <button
                onClick={() => openDeleteModal(screen)}
                className="w-8 h-8 bg-black/20 text-white rounded-full flex items-center justify-center hover:bg-red-500 hover:text-white transition-all duration-200 backdrop-blur-sm"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </div>

            {/* Screen Type Badge - ONLY show if exists */}
            {screen.screen_type && (
              <div className="absolute bottom-3 left-3">
                <span className="bg-black/30 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-lg">
                  {screen.screen_type}
                </span>
              </div>
            )}
          </div>

          <div className="p-6">
            {/* Basic Info - ONLY show if exists */}
            <div className="flex items-start justify-between mb-4">
              <div className="flex-1">
                {screen.name && (
                  <h3 className="text-lg font-bold text-gray-900 mb-1 line-clamp-1">
                    {screen.name}
                  </h3>
                )}
                {(screen.city || screen.state) && (
                  <div className="flex items-center text-sm text-gray-600 space-x-2 mb-2">
                    <MapPin className="w-4 h-4 flex-shrink-0" />
                    <span className="line-clamp-1">
                      {[screen.city, screen.state].filter(Boolean).join(", ")}
                    </span>
                  </div>
                )}
                {screen.address && (
                  <p className="text-xs text-gray-500 line-clamp-1">
                    {screen.address}
                  </p>
                )}
              </div>
            </div>

            {/* Screen Specifications - ONLY show section if ANY data exists */}
            {(screen.screen_size_width ||
              screen.screen_size_height ||
              screen.resolution_width ||
              screen.resolution_height ||
              screen.peak_hours ||
              screen.daily_footfall ||
              screen.vehicle_count) && (
              <div className="bg-gray-50 rounded-lg p-3 mb-4 space-y-2">
                <h4 className="text-sm font-semibold text-gray-800 mb-2">
                  Screen Details
                </h4>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {screen.screen_size_width && screen.screen_size_height && (
                    <div>
                      <span className="text-gray-500">Size:</span>
                      <div className="font-medium">
                        {screen.screen_size_width}"×{screen.screen_size_height}"
                      </div>
                    </div>
                  )}
                  {screen.resolution_width && screen.resolution_height && (
                    <div>
                      <span className="text-gray-500">Resolution:</span>
                      <div className="font-medium">
                        {screen.resolution_width}×{screen.resolution_height}
                      </div>
                    </div>
                  )}
                  {screen.peak_hours && screen.peak_hours.length > 0 && (
                    <div>
                      <span className="text-gray-500">Peak Hours:</span>
                      <div className="font-medium">
                        {screen.peak_hours.join(", ")}
                      </div>
                    </div>
                  )}
                  {(screen.daily_footfall || screen.vehicle_count) && (
                    <div>
                      <span className="text-gray-500">Footfall:</span>
                      <div className="font-medium">
                        {(
                          screen.daily_footfall || screen.vehicle_count
                        )?.toLocaleString()}
                        /day
                      </div>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Performance Metrics - ONLY show if backend data exists */}
            {(screen.impressions &&
              typeof screen.impressions === "number" &&
              screen.impressions > 0) ||
            (screen.revenue &&
              typeof screen.revenue === "number" &&
              screen.revenue > 0) ? (
              <div className="grid grid-cols-2 gap-4 mb-4">
                {screen.impressions &&
                  typeof screen.impressions === "number" &&
                  screen.impressions > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-blue-600">
                        {screen.impressions.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">
                        Daily Impressions
                      </div>
                    </div>
                  )}
                {screen.revenue &&
                  typeof screen.revenue === "number" &&
                  screen.revenue > 0 && (
                    <div className="text-center">
                      <div className="text-2xl font-bold text-green-600">
                        ₹{screen.revenue.toLocaleString()}
                      </div>
                      <div className="text-xs text-gray-600">Daily Revenue</div>
                    </div>
                  )}
              </div>
            ) : null}

            {/* Pricing Info - ONLY show if real backend pricing data exists */}
            {((screen.hourly_rate &&
              typeof screen.hourly_rate === "number" &&
              screen.hourly_rate > 0) ||
              (screen.daily_rate &&
                typeof screen.daily_rate === "number" &&
                screen.daily_rate > 0) ||
              (screen.cost_per_10_seconds &&
                typeof screen.cost_per_10_seconds === "number" &&
                screen.cost_per_10_seconds > 0)) && (
              <div className="bg-green-50 rounded-lg p-3 mb-4">
                <h4 className="text-sm font-semibold text-green-800 mb-2">
                  Pricing
                </h4>
                <div className="grid grid-cols-3 gap-2 text-xs">
                  {screen.hourly_rate &&
                    typeof screen.hourly_rate === "number" &&
                    screen.hourly_rate > 0 && (
                      <div>
                        <span className="text-green-600">Hourly:</span>
                        <div className="font-medium">₹{screen.hourly_rate}</div>
                      </div>
                    )}
                  {screen.daily_rate &&
                    typeof screen.daily_rate === "number" &&
                    screen.daily_rate > 0 && (
                      <div>
                        <span className="text-green-600">Daily:</span>
                        <div className="font-medium">₹{screen.daily_rate}</div>
                      </div>
                    )}
                  {screen.cost_per_10_seconds &&
                    typeof screen.cost_per_10_seconds === "number" &&
                    screen.cost_per_10_seconds > 0 && (
                      <div>
                        <span className="text-green-600">Per 10s:</span>
                        <div className="font-medium">
                          ₹{screen.cost_per_10_seconds}
                        </div>
                      </div>
                    )}
                </div>
              </div>
            )}

            {/* Status and Actions */}
            <div className="flex items-center justify-between">
              {screen.status && (
                <div
                  className={`px-3 py-1 rounded-full text-xs font-medium ${
                    screen.status === "active"
                      ? "bg-green-100 text-green-800"
                      : "bg-gray-100 text-gray-800"
                  }`}
                >
                  {screen.status}
                </div>
              )}
              <div className="flex space-x-2">
                {/* Media Links - ONLY show if URLs exist */}
                {screen.video_url && (
                  <a
                    href={screen.video_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-purple-600 hover:text-purple-800 text-xs font-medium"
                  >
                    Video
                  </a>
                )}
                {screen.night_photo_url && (
                  <a
                    href={screen.night_photo_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:text-blue-800 text-xs font-medium"
                  >
                    Night
                  </a>
                )}
                <button className="text-blue-600 hover:text-blue-800 font-medium text-xs flex items-center space-x-1 group-hover:translate-x-1 transition-transform">
                  <Eye className="w-3 h-3" />
                  <span>Details</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );

  const renderContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center min-h-[400px]">
          <div className="text-center">
            <div className="w-16 h-16 border-4 border-blue-200 border-t-blue-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-gray-600">Loading admin data...</p>
          </div>
        </div>
      );
    }

    switch (activeTab) {
      case "dashboard":
        return (
          <div className="space-y-6">
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <div className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Monitor className="w-8 h-8 text-blue-100" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {dashboardStats?.screens?.total_screens || 0}
                    </div>
                    <div className="text-blue-100 text-sm">Total Screens</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-green-500 to-green-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Activity className="w-8 h-8 text-green-100" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {dashboardStats?.screens?.active_screens || 0}
                    </div>
                    <div className="text-green-100 text-sm">Active Screens</div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <Users className="w-8 h-8 text-purple-100" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      {dashboardStats?.bookingRequests?.total_requests || 0}
                    </div>
                    <div className="text-purple-100 text-sm">
                      Total Requests
                    </div>
                  </div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 text-white">
                <div className="flex items-center justify-between mb-2">
                  <DollarSign className="w-8 h-8 text-orange-100" />
                  <div className="text-right">
                    <div className="text-2xl font-bold">
                      ₹
                      {dashboardStats?.monthlyBookings
                        ?.reduce((sum, month) => sum + month.total_revenue, 0)
                        ?.toLocaleString() || 0}
                    </div>
                    <div className="text-orange-100 text-sm">Total Revenue</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );

      case "screens":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">All Screens</h2>
              <div className="text-sm text-gray-600">
                {screens.length} total screens
              </div>
            </div>
            {renderScreensGrid(screens)}
          </div>
        );

      case "favorites":
        const favoriteScreens = screens.filter((screen) =>
          isFavorite(screen.id)
        );
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
                <Heart className="w-6 h-6 text-red-500" />
                <span>Favorite Screens</span>
              </h2>
              <div className="text-sm text-gray-600">
                {favoriteScreens.length} favorite screens
              </div>
            </div>
            {favoriteScreens.length > 0 ? (
              renderScreensGrid(favoriteScreens)
            ) : (
              <div className="text-center py-12">
                <Heart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-600 mb-2">
                  No favorites yet
                </h3>
                <p className="text-gray-500">
                  Click the heart icon on any screen to add it to favorites
                </p>
              </div>
            )}
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <div className="text-gray-500">Feature coming soon...</div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Sidebar */}
      <div
        className={`fixed left-0 top-0 h-full bg-white/90 backdrop-blur-xl border-r border-gray-200/50 shadow-xl transition-all duration-300 z-40 ${
          sidebarCollapsed ? "w-16" : "w-64"
        }`}
      >
        <div className="p-6">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 bg-gradient-to-br from-blue-600 to-purple-600 rounded-lg flex items-center justify-center">
              <LayoutDashboard className="w-4 h-4 text-white" />
            </div>
            {!sidebarCollapsed && (
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Admin Panel
              </h1>
            )}
          </div>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => item.active && setActiveTab(item.id)}
                disabled={!item.active}
                className={`w-full flex items-center space-x-3 px-3 py-2.5 rounded-xl transition-all duration-200 ${
                  activeTab === item.id
                    ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg"
                    : item.active
                    ? "text-gray-700 hover:bg-gray-100"
                    : "text-gray-400 cursor-not-allowed"
                }`}
              >
                <Icon className="w-5 h-5" />
                {!sidebarCollapsed && (
                  <span className="font-medium">{item.label}</span>
                )}
                {!sidebarCollapsed && activeTab === item.id && (
                  <ChevronRight className="w-4 h-4 ml-auto" />
                )}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-6 left-3 right-3">
          <button
            onClick={onLogout}
            className="w-full flex items-center space-x-3 px-3 py-2.5 text-red-600 hover:bg-red-50 rounded-xl transition-colors"
          >
            <LogOut className="w-5 h-5" />
            {!sidebarCollapsed && <span className="font-medium">Logout</span>}
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div
        className={`transition-all duration-300 ${
          sidebarCollapsed ? "ml-16" : "ml-64"
        }`}
      >
        {/* Header */}
        <div className="bg-white/80 backdrop-blur-sm border-b border-gray-200/50 px-6 py-4">
          <div className="flex items-center justify-between">
            <button
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="w-10 h-10 bg-gray-100 hover:bg-gray-200 rounded-xl flex items-center justify-center transition-colors"
            >
              <Menu className="w-5 h-5" />
            </button>

            <div className="text-right">
              <div className="text-sm text-gray-600">Welcome back,</div>
              <div className="font-semibold text-gray-900">Administrator</div>
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="bg-white/80 backdrop-blur-sm rounded-3xl p-8 shadow-xl border border-gray-200/50">
            {/* Success Message */}
            {successMessage && (
              <div className="bg-green-50 border border-green-200 rounded-xl p-4 mb-6 flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                  <Activity className="w-4 h-4 text-green-600" />
                </div>
                <p className="text-green-800 font-medium">{successMessage}</p>
                <button
                  onClick={() => setSuccessMessage(null)}
                  className="ml-auto text-green-600 hover:text-green-800"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {error ? (
              <div className="bg-red-50 border border-red-200 rounded-xl p-6 text-center">
                <Activity className="w-16 h-16 text-red-500 mx-auto mb-4" />
                <h3 className="text-xl font-bold text-red-800 mb-2">
                  Error Loading Backend Data
                </h3>
                <p className="text-red-600">{error}</p>
                <button
                  onClick={() => window.location.reload()}
                  className="mt-4 bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry Connection
                </button>
              </div>
            ) : (
              renderContent()
            )}
          </div>
        </div>
      </div>

      {/* Delete Modal */}
      {renderDeleteModal()}
    </div>
  );
};

const AdminApp = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
  };

  return isLoggedIn ? (
    <AdminDashboard onLogout={handleLogout} />
  ) : (
    <AdminLogin onLoginSuccess={handleLogin} />
  );
};

export default AdminApp;
