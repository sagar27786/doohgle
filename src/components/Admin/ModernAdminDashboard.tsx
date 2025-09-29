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
  Plus,
  Eye,
  Edit,
  Settings,
  Search,
  Play,
  Pause,
  Maximize,
  Heart,
  Share2,
  Download,
  Upload,
  Grid3X3,
  List,
  Filter,
  Star,
  Clock,
  Wifi,
  Activity,
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

type ActiveTab = "dashboard" | "screens" | "bookings" | "analytics" | "settings";
type ViewMode = "grid" | "list";

// Enhanced Screen interface for display
interface EnhancedScreen extends AdminScreen {
  media_url?: string;
  media_type?: 'image' | 'video';
  rating?: number;
  views?: number;
  clicks?: number;
  ctr?: number;
}

// Screen Card Component with Image/Video Support
const ScreenCard: React.FC<{
  screen: EnhancedScreen;
  index: number;
  viewMode: ViewMode;
}> = ({ screen, index, viewMode }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [isFavorite, setIsFavorite] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  
  // Mock enhanced data
  const mediaUrl = screen.media_url || `https://picsum.photos/400/300?random=${screen.id}`;
  const hasVideo = screen.media_type === 'video' || Math.random() > 0.7;
  const rating = screen.rating || 4.8;
  const views = screen.views || Math.floor(Math.random() * 20000) + 5000;
  const clicks = screen.clicks || Math.floor(Math.random() * 1000) + 200;
  const ctr = screen.ctr || ((clicks / views) * 100);
  
  if (viewMode === "list") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: index * 0.05 }}
        whileHover={{ scale: 1.01, x: 5 }}
        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group"
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-6">
            <div className="relative w-20 h-16 rounded-xl overflow-hidden shadow-md">
              <img 
                src={mediaUrl} 
                alt={screen.screen_name || `Screen ${screen.id}`}
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"
              />
              {hasVideo && (
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                  <Play className="w-6 h-6 text-white" />
                </div>
              )}
              <div className="absolute -top-1 -right-1">
                <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-red-400'} shadow-lg`} />
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-bold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</h3>
              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                <div className="flex items-center space-x-1">
                  <MapPin className="w-4 h-4" />
                  <span>{screen.city || 'Unknown City'}</span>
                </div>
                <span>•</span>
                <span>{screen.size_info || 'Standard'}</span>
                <span>•</span>
                <div className="flex items-center space-x-1">
                  <Wifi className="w-4 h-4" />
                  <span>Connected</span>
                </div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-6">
            <div className="text-center">
              <p className="text-sm text-gray-500">Status</p>
              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                screen.is_active 
                  ? "bg-green-100 text-green-700" 
                  : "bg-gray-100 text-gray-600"
              }`}>
                {screen.is_active ? "LIVE" : "OFFLINE"}
              </span>
            </div>
            
            <div className="text-center">
              <p className="text-sm text-gray-500">Price</p>
              <span className="text-lg font-bold text-gray-900">
                ₹{screen.price_per_day || 0}/day
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"
              >
                <Eye className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all"
              >
                <Edit className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                className="p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"
              >
                <Settings className="w-5 h-5" />
              </motion.button>
            </div>
          </div>
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 40, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}
      whileHover={{ y: -10, scale: 1.03 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden group cursor-pointer relative"
    >
      {/* Media Section */}
      <div className="relative h-56 overflow-hidden">
        <motion.img
          src={mediaUrl}
          alt={screen.screen_name || `Screen ${screen.id}`}
          className="w-full h-full object-cover transition-transform duration-700"
          animate={{ scale: isHovered ? 1.1 : 1 }}
        />
        
        {/* Video Controls Overlay */}
        {hasVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex items-center justify-center"
          >
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsPlaying(!isPlaying)}
              className="bg-white/20 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/30"
            >
              {isPlaying ? (
                <Pause className="w-10 h-10 text-white" />
              ) : (
                <Play className="w-10 h-10 text-white ml-1" />
              )}
            </motion.button>
          </motion.div>
        )}

        {/* Top Bar with Status and Controls */}
        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center space-x-2"
          >
            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${
              screen.is_active 
                ? "bg-green-500/90 text-white" 
                : "bg-gray-500/90 text-white"
            }`}>
              {screen.is_active ? "🔴 LIVE" : "⚫ OFFLINE"}
            </span>
            
            {screen.is_active && (
              <motion.div
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"
              >
                <div className="flex items-center space-x-1 text-white text-xs">
                  <Clock className="w-3 h-3" />
                  <span>24/7</span>
                </div>
              </motion.div>
            )}
          </motion.div>

          <div className="flex items-center space-x-2">
            <motion.button
              whileHover={{ scale: 1.2 }}
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsFavorite(!isFavorite)}
              className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30"
            >
              <Heart className={`w-5 h-5 ${isFavorite ? "text-red-400 fill-red-400" : "text-white"}`} />
            </motion.button>
          </div>
        </div>

        {/* Action Buttons on Hover */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}
          className="absolute bottom-4 right-4 flex space-x-2"
        >
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"
          >
            <Maximize className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"
          >
            <Share2 className="w-5 h-5" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"
          >
            <Download className="w-5 h-5" />
          </motion.button>
        </motion.div>

        {/* Performance Indicator */}
        <div className="absolute bottom-4 left-4">
          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">
            <div className="flex items-center space-x-2 text-white text-sm">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
              <span>High Performance</span>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-xl font-bold text-gray-900 mb-2">{screen.screen_name || `Screen ${screen.id}`}</h3>
            <div className="flex items-center space-x-4 text-sm text-gray-500">
              <div className="flex items-center space-x-1">
                <MapPin className="w-4 h-4" />
                <span>{screen.city || 'Unknown City'}</span>
              </div>
              <div className="flex items-center space-x-1">
                <Monitor className="w-4 h-4" />
                <span>{screen.size_info || 'Standard'}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center space-x-1">
            {[...Array(5)].map((_, i) => (
              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />
            ))}
            <span className="text-sm text-gray-500 ml-2">{rating}</span>
          </div>
        </div>

        {/* Stats Row */}
        <div className="grid grid-cols-3 gap-4 mb-6">
          <div className="text-center p-3 bg-blue-50 rounded-2xl">
            <p className="text-xs text-blue-600 font-semibold">VIEWS</p>
            <p className="text-lg font-bold text-blue-700">{(views / 1000).toFixed(1)}K</p>
          </div>
          <div className="text-center p-3 bg-green-50 rounded-2xl">
            <p className="text-xs text-green-600 font-semibold">CLICKS</p>
            <p className="text-lg font-bold text-green-700">{clicks}</p>
          </div>
          <div className="text-center p-3 bg-purple-50 rounded-2xl">
            <p className="text-xs text-purple-600 font-semibold">CTR</p>
            <p className="text-lg font-bold text-purple-700">{ctr.toFixed(1)}%</p>
          </div>
        </div>

        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-sm text-gray-500">Daily Rate</p>
            <span className="text-3xl font-black text-gray-900">
              ₹{screen.price_per_day || 0}
              <span className="text-sm font-normal text-gray-500">/day</span>
            </span>
          </div>
          
          <div className="text-right">
            <p className="text-sm text-gray-500">Utilization</p>
            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: "78%" }}
                transition={{ duration: 1.5, delay: index * 0.1 }}
                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
              />
            </div>
            <span className="text-xs text-gray-600 mt-1">78%</span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex space-x-3">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"
          >
            📊 View Analytics
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"
          >
            ⚙️ Manage
          </motion.button>
        </div>
      </div>

      {/* Glow Effect */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 0.3 : 0 }}
        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl -z-10"
      />
    </motion.div>
  );
};

// Dashboard Stats Widget
const DashboardWidget: React.FC<{
  icon: React.ComponentType<any>;
  title: string;
  value: string | number;
  subtitle: string;
  change: { value: number; isPositive: boolean };
  color: string;
  delay: number;
}> = ({ icon: Icon, title, value, subtitle, change, color, delay }) => {
  const colorClasses = {
    blue: {
      bg: "from-blue-500 to-cyan-500",
      text: "text-blue-700",
      light: "bg-blue-50"
    },
    green: {
      bg: "from-green-500 to-emerald-500", 
      text: "text-green-700",
      light: "bg-green-50"
    },
    purple: {
      bg: "from-purple-500 to-pink-500",
      text: "text-purple-700", 
      light: "bg-purple-50"
    },
    orange: {
      bg: "from-orange-500 to-yellow-500",
      text: "text-orange-700",
      light: "bg-orange-50"
    },
  };

  const colors = colorClasses[color as keyof typeof colorClasses];

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      transition={{ delay, type: "spring", stiffness: 150 }}
      whileHover={{ y: -8, scale: 1.03 }}
      className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden group cursor-pointer"
    >
      {/* Background Gradient */}
      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />
      
      {/* Decorative Elements */}
      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full" />
      <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-gradient-to-tr from-gray-100/50 to-gray-50/30 rounded-full" />
      
      <div className="relative z-10">
        <div className="flex items-start justify-between mb-6">
          <motion.div
            whileHover={{ rotate: 15, scale: 1.1 }}
            className={`p-5 bg-gradient-to-br ${colors.bg} rounded-3xl shadow-lg`}
          >
            <Icon className="w-8 h-8 text-white" />
          </motion.div>
          
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: delay + 0.2 }}
            className={`flex items-center space-x-2 text-sm font-bold px-4 py-2 rounded-full ${
              change.isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"
            }`}
          >
            {change.isPositive ? (
              <ArrowUp className="w-4 h-4" />
            ) : (
              <ArrowDown className="w-4 h-4" />
            )}
            <span>{change.value}%</span>
          </motion.div>
        </div>

        <div>
          <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">{title}</p>
          <motion.p
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: delay + 0.3 }}
            className="text-4xl font-black text-gray-900 mb-2"
          >
            {typeof value === 'number' ? value.toLocaleString() : value}
          </motion.p>
          <p className="text-sm font-medium text-gray-500">{subtitle}</p>
        </div>

        {/* Mini Progress Bar */}
        <div className="mt-6">
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${Math.min(Math.abs(change.value), 100)}%` }}
              transition={{ duration: 1.5, delay: delay + 0.5 }}
              className={`bg-gradient-to-r ${colors.bg} h-2 rounded-full`}
            />
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Loading Component
const LoadingSpinner: React.FC = () => (
  <motion.div
    initial={{ opacity: 0 }}
    animate={{ opacity: 1 }}
    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"
  >
    <div className="text-center">
      <motion.div className="relative mb-8">
        {/* Multiple rotating rings */}
        <motion.div
          className="w-24 h-24 border-4 border-blue-200 rounded-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-0 w-24 h-24 border-4 border-purple-300 rounded-full border-t-purple-600"
          animate={{ rotate: -360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
        />
        <motion.div
          className="absolute inset-2 w-20 h-20 border-4 border-pink-300 rounded-full border-r-pink-600"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        
        {/* Center Logo */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          animate={{ scale: [1, 1.1, 1] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Shield className="w-8 h-8 text-blue-600" />
        </motion.div>
      </motion.div>
      
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Loading Dashboard</h3>
        <div className="flex items-center justify-center space-x-2">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"
              animate={{ y: [0, -15, 0] }}
              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}
            />
          ))}
        </div>
      </motion.div>
    </div>
  </motion.div>
);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);
  const [screens, setScreens] = useState<AdminScreen[]>([]);
  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);
  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const fetchDashboardData = async () => {
    try {
      setError(null);
      const [statsData, screensData, bookingsData, revenueData] = await Promise.all([
        adminService.getDashboardStats(),
        adminService.getScreens(),
        adminService.getBookingRequests(),
        adminService.getRevenueAnalytics(),
      ]);

      setDashboardStats(statsData);
      setScreens(screensData);
      setBookings(bookingsData);
      setRevenue(revenueData);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load dashboard data. Please try again.");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    await fetchDashboardData();
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"
      >
        <motion.div
          className="text-center p-10 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md mx-4"
          whileHover={{ scale: 1.02 }}
        >
          <motion.div
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"
          >
            <AlertTriangle className="w-10 h-10 text-red-600" />
          </motion.div>
          
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            🚨 Something went wrong
          </h3>
          
          <p className="text-gray-600 mb-8">{error}</p>
          
          <motion.button
            onClick={() => {
              setError(null);
              setLoading(true);
              fetchDashboardData();
            }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"
          >
            🔄 Try Again
          </motion.button>
        </motion.div>
      </motion.div>
    );
  }

  const filteredScreens = screens.filter(screen =>
    (screen.screen_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (screen.city || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
      {/* Modern Header */}
      <motion.header
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
        className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-xl"
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-24">
            {/* Logo Section */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
            >
              <motion.div
                className="p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl"
                whileHover={{ 
                  scale: 1.1, 
                  rotate: 360,
                  boxShadow: "0 25px 50px rgba(0,0,0,0.25)"
                }}
                transition={{ duration: 0.6 }}
              >
                <Shield className="w-10 h-10 text-white" />
              </motion.div>
              <div>
                <motion.h1 
                  className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.4 }}
                >
                  Admin Dashboard
                </motion.h1>
                <motion.p 
                  className="text-sm font-semibold text-gray-600"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  🎯 Digital Signage Control Center
                </motion.p>
              </div>
            </motion.div>

            {/* Search Bar */}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="hidden md:flex items-center space-x-4"
            >
              <div className="relative">
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search screens, locations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-12 pr-6 py-3 w-80 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
                />
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div 
              className="flex items-center space-x-4"
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
            >
              <motion.button
                onClick={handleRefresh}
                disabled={refreshing}
                whileHover={{ scale: 1.1, rotate: 180 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-lg"
              >
                <RefreshCw className={`w-6 h-6 ${refreshing ? "animate-spin" : ""}`} />
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.95 }}
                className="p-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all relative shadow-lg"
              >
                <Bell className="w-6 h-6" />
                <motion.div
                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <span className="text-xs text-white font-bold">3</span>
                </motion.div>
              </motion.button>

              <motion.button
                onClick={onLogout}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"
              >
                <LogOut className="w-5 h-5" />
                <span>Logout</span>
              </motion.button>
            </div>
          </div>

          {/* Navigation Tabs */}
          <motion.div 
            className="border-t border-gray-200/50 -mb-px"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
          >
            <nav className="flex space-x-2 py-6 overflow-x-auto">
              {[
                { id: "dashboard", label: "🏠 Dashboard", icon: BarChart3, color: "blue" },
                { id: "screens", label: "📺 Screens", icon: Monitor, color: "green" },
                { id: "bookings", label: "📅 Bookings", icon: Calendar, color: "purple" },
                { id: "analytics", label: "📊 Analytics", icon: TrendingUp, color: "orange" },
                { id: "settings", label: "⚙️ Settings", icon: Settings, color: "gray" },
              ].map((tab, index) => (
                <motion.button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as ActiveTab)}
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 + index * 0.1 }}
                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all text-sm relative overflow-hidden min-w-max ${
                    activeTab === tab.id
                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl"
                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70 shadow-lg"
                  }`}
                >
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent"
                      initial={{ x: "-100%" }}
                      animate={{ x: "100%" }}
                      transition={{ duration: 2, repeat: Infinity }}
                    />
                  )}
                  
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                  
                  {activeTab === tab.id && (
                    <motion.div
                      className="absolute bottom-0 left-0 right-0 h-1 bg-white rounded-t-full"
                      layoutId="activeTab"
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </motion.div>
        </div>
      </motion.header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <AnimatePresence mode="wait">
          {/* Dashboard Tab */}
          {activeTab === "dashboard" && (
            <motion.div
              key="dashboard"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Hero Stats */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">
                  📊 Dashboard Overview
                </h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
                  <DashboardWidget
                    icon={Monitor}
                    title="Total Screens"
                    value={dashboardStats?.screens?.total_screens || 0}
                    subtitle="Digital displays active"
                    color="blue"
                    delay={0.1}
                    change={{ value: 12, isPositive: true }}
                  />
                  <DashboardWidget
                    icon={Activity}
                    title="Active Now"
                    value={dashboardStats?.screens?.active_screens || 0}
                    subtitle="Currently broadcasting"
                    color="green"
                    delay={0.2}
                    change={{ value: 8, isPositive: true }}
                  />
                  <DashboardWidget
                    icon={Calendar}
                    title="Bookings"
                    value={dashboardStats?.bookingRequests?.total_requests || 0}
                    subtitle="Campaign requests"
                    color="purple"
                    delay={0.3}
                    change={{ value: 3, isPositive: false }}
                  />
                  <DashboardWidget
                    icon={DollarSign}
                    title="Revenue"
                    value={`₹${(revenue?.totalRevenue || 0).toLocaleString()}`}
                    subtitle="Monthly earnings"
                    color="orange"
                    delay={0.4}
                    change={{ value: 24, isPositive: true }}
                  />
                </div>
              </motion.div>

              {/* Quick Actions & Recent Activity */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Quick Actions */}
                <motion.div
                  initial={{ opacity: 0, x: -40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    ⚡ Quick Actions
                  </h3>
                  <div className="grid grid-cols-2 gap-4">
                    {[
                      { icon: Plus, label: "Add Screen", color: "from-blue-500 to-cyan-500" },
                      { icon: Upload, label: "Upload Media", color: "from-green-500 to-emerald-500" },
                      { icon: Settings, label: "Settings", color: "from-purple-500 to-pink-500" },
                      { icon: BarChart3, label: "Reports", color: "from-orange-500 to-yellow-500" },
                    ].map((action, index) => (
                      <motion.button
                        key={action.label}
                        whileHover={{ scale: 1.05, y: -5 }}
                        whileTap={{ scale: 0.95 }}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.7 + index * 0.1 }}
                        className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center`}
                      >
                        <action.icon className="w-8 h-8 mx-auto mb-2" />
                        <span className="font-semibold">{action.label}</span>
                      </motion.button>
                    ))}
                  </div>
                </motion.div>

                {/* Recent Activity */}
                <motion.div
                  initial={{ opacity: 0, x: 40 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 }}
                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"
                >
                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                    🔥 Recent Activity
                  </h3>
                  <div className="space-y-4">
                    {screens.slice(0, 4).map((screen, index) => (
                      <motion.div
                        key={screen.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.8 + index * 0.1 }}
                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"
                      >
                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                          <Monitor className="w-6 h-6 text-white" />
                        </div>
                        <div className="flex-1">
                          <p className="font-semibold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</p>
                          <p className="text-sm text-gray-500">{screen.city || 'Unknown City'} • Just now</p>
                        </div>
                        <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
              </div>
            </motion.div>
          )}

          {/* Screens Tab */}
          {activeTab === "screens" && (
            <motion.div
              key="screens"
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Header */}
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-4xl font-black text-gray-900 mb-2">
                    📺 Screen Management
                  </h2>
                  <p className="text-lg text-gray-600">Manage your digital displays with style</p>
                </div>
                
                <div className="flex items-center space-x-4">
                  {/* View Mode Toggle */}
                  <div className="flex bg-white rounded-2xl shadow-lg border border-gray-200 p-2">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("grid")}
                      className={`p-3 rounded-xl transition-all ${
                        viewMode === "grid" 
                          ? "bg-blue-500 text-white shadow-lg" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <Grid3X3 className="w-5 h-5" />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => setViewMode("list")}
                      className={`p-3 rounded-xl transition-all ${
                        viewMode === "list" 
                          ? "bg-blue-500 text-white shadow-lg" 
                          : "text-gray-600 hover:bg-gray-100"
                      }`}
                    >
                      <List className="w-5 h-5" />
                    </motion.button>
                  </div>

                  {/* Filter & Sort */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                  >
                    <Filter className="w-5 h-5" />
                    <span>Filter</span>
                  </motion.button>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"
                  >
                    <Plus className="w-6 h-6" />
                    <span>Add New Screen</span>
                  </motion.button>
                </div>
              </div>

              {/* Screens Grid/List */}
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className={`${
                  viewMode === "grid" 
                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 
                    : "space-y-4"
                }`}
              >
                {filteredScreens.map((screen, index) => (
                  <ScreenCard
                    key={screen.id}
                    screen={screen as EnhancedScreen}
                    index={index}
                    viewMode={viewMode}
                  />
                ))}
              </motion.div>

              {filteredScreens.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-16"
                >
                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Monitor className="w-16 h-16 text-gray-400" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No screens found</h3>
                  <p className="text-gray-500 mb-8">Try adjusting your search or add a new screen</p>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"
                  >
                    Add Your First Screen
                  </motion.button>
                </motion.div>
              )}
            </motion.div>
          )}

          {/* Other tabs with placeholder content */}
          {(activeTab === "bookings" || activeTab === "analytics" || activeTab === "settings") && (
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              <div className="text-center py-16">
                <h2 className="text-4xl font-black text-gray-900 mb-4">
                  {activeTab === "bookings" && "📅 Booking Management"}
                  {activeTab === "analytics" && "📊 Analytics Dashboard"}
                  {activeTab === "settings" && "⚙️ Settings"}
                </h2>
                <p className="text-xl text-gray-600">Coming soon with amazing features!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;