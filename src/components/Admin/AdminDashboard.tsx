import React, { useEffect, useState } from "react";import React, { useEffect, useState } from "react";import React, { useEffect, useState } from "react";import React, { useEffect, useState } from "react";

import { motion, AnimatePresence } from "framer-motion";

import {import { motion, AnimatePresence } from "framer-motion";

  Shield,

  Monitor,import {import { motion, AnimatePresence } from "framer-motion";import { motion, AnimatePresence } from "framer-motion";

  DollarSign,

  Calendar,  Shield,

  LogOut,

  BarChart3,  Monitor,import {import {

  RefreshCw,

  TrendingUp,  DollarSign,

  AlertTriangle,

  Bell,  Calendar,  Shield,  Shield,

  ArrowUp,

  ArrowDown,  LogOut,

  MapPin,

  Plus,  BarChart3,  Monitor,  Monitor,

  Eye,

  Edit,  RefreshCw,

  Settings,

  Search,  TrendingUp,  DollarSign,  DollarSign,

  Play,

  Heart,  AlertTriangle,

  Star,

  Clock,  Bell,  Calendar,  Calendar,

  Wifi,

  Activity,  ArrowUp,

  Grid3X3,

  List,  ArrowDown,  LogOut,  LogOut,

  Filter

} from "lucide-react";  MapPin,

import {

  adminService,  Plus,  BarChart3,  BarChart3,

  DashboardStats,

  AdminScreen,  Eye,

  AdminBookingRequest,

  RevenueAnalytics,  Edit,  RefreshCw,  RefreshCw,

} from "../../services/adminService";

  Settings,

interface AdminDashboardProps {

  onLogout: () => void;  Search,  TrendingUp,  TrendingUp,

}

  Play,

type ActiveTab = "dashboard" | "screens" | "bookings" | "analytics" | "settings";

type ViewMode = "grid" | "list";  Pause,  AlertTriangle,  AlertTriangle,



interface EnhancedScreen extends AdminScreen {  Maximize,

  media_url?: string;

  media_type?: 'image' | 'video';  Heart,  Bell,  Bell,

  rating?: number;

  views?: number;  Share2,

  clicks?: number;

  ctr?: number;  Download,  ArrowUp,  ArrowUp,

  price_per_day?: number;

  size_info?: string;  Upload,

}

  Grid3X3,  ArrowDown,  ArrowDown,

const ScreenCard: React.FC<{

  screen: EnhancedScreen;  List,

  index: number;

  viewMode: ViewMode;  Filter,  MapPin,  MapPin,

}> = ({ screen, index, viewMode }) => {

  const [isHovered, setIsHovered] = useState(false);  Star,

  const [isFavorite, setIsFavorite] = useState(false);

    Clock,  Plus,  Plus,

  const mediaUrl = screen.media_url || `https://picsum.photos/400/300?random=${screen.id}`;

  const hasVideo = screen.media_type === 'video' || Math.random() > 0.7;  Wifi,

  const rating = screen.rating || 4.8;

  const views = screen.views || Math.floor(Math.random() * 20000) + 5000;  Activity,  Eye,  Eye,

  const clicks = screen.clicks || Math.floor(Math.random() * 1000) + 200;

  const ctr = screen.ctr || ((clicks / views) * 100);} from "lucide-react";

  const pricePerDay = screen.price_per_day || 2500;

  const sizeInfo = screen.size_info || screen.device_type || 'Standard';import {  Edit,  Edit,

  

  if (viewMode === "list") {  adminService,

    return (

      <motion.div  DashboardStats,  Settings,  Settings,

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}  AdminScreen,

        transition={{ delay: index * 0.05 }}

        whileHover={{ scale: 1.01, x: 5 }}  AdminBookingRequest,  Search,  Search,

        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group"

      >  RevenueAnalytics,

        <div className="flex items-center justify-between">

          <div className="flex items-center space-x-6">} from "../../services/adminService";  Play,  Play,

            <div className="relative w-20 h-16 rounded-xl overflow-hidden shadow-md">

              <img 

                src={mediaUrl} 

                alt={screen.screen_name || `Screen ${screen.id}`}interface AdminDashboardProps {  Pause,  Pause,

                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"

                onError={(e) => {  onLogout: () => void;

                  const target = e.target as HTMLImageElement;

                  target.src = `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Screen+${screen.id}`;}  Maximize,  Maximize,

                }}

              />

              {hasVideo && (

                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">type ActiveTab = "dashboard" | "screens" | "bookings" | "analytics" | "settings";  Heart,  Heart,

                  <Play className="w-6 h-6 text-white" />

                </div>type ViewMode = "grid" | "list";

              )}

              <div className="absolute -top-1 -right-1">  Share2,  Share2,

                <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-red-400'} shadow-lg`} />

              </div>// Enhanced Screen interface for display

            </div>

            interface EnhancedScreen extends AdminScreen {  Download,  Download,

            <div>

              <h3 className="text-lg font-bold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</h3>  media_url?: string;

              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">

                <div className="flex items-center space-x-1">  media_type?: 'image' | 'video';  Upload,  Upload,

                  <MapPin className="w-4 h-4" />

                  <span>{screen.city || 'Unknown City'}</span>  rating?: number;

                </div>

                <span>•</span>  views?: number;  Grid3X3,  Grid3X3,

                <span>{sizeInfo}</span>

                <span>•</span>  clicks?: number;

                <div className="flex items-center space-x-1">

                  <Wifi className="w-4 h-4" />  ctr?: number;  List,  List,

                  <span>Connected</span>

                </div>  price_per_day?: number;

              </div>

            </div>  size_info?: string;  Filter,  Filter,

          </div>

          }

          <div className="flex items-center space-x-6">

            <div className="text-center">  Star,  Star,

              <p className="text-sm text-gray-500">Status</p>

              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${// Screen Card Component with Image/Video Support

                screen.is_active 

                  ? "bg-green-100 text-green-700" const ScreenCard: React.FC<{  Clock,  Clock,

                  : "bg-gray-100 text-gray-600"

              }`}>  screen: EnhancedScreen;

                {screen.is_active ? "LIVE" : "OFFLINE"}

              </span>  index: number;  Wifi,  Wifi,

            </div>

              viewMode: ViewMode;

            <div className="text-center">

              <p className="text-sm text-gray-500">Price</p>}> = ({ screen, index, viewMode }) => {  Activity,  Activity,

              <span className="text-lg font-bold text-gray-900">

                ₹{pricePerDay}/day  const [isHovered, setIsHovered] = useState(false);

              </span>

            </div>  const [isFavorite, setIsFavorite] = useState(false);} from "lucide-react";} from "lucide-react";

            

            <div className="flex items-center space-x-2">  const [isPlaying, setIsPlaying] = useState(false);

              <motion.button

                whileHover={{ scale: 1.1 }}  import {import {

                whileTap={{ scale: 0.9 }}

                className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"  // Mock enhanced data

              >

                <Eye className="w-5 h-5" />  const mediaUrl = screen.media_url || `https://picsum.photos/400/300?random=${screen.id}`;  adminService,  adminService,

              </motion.button>

              <motion.button  const hasVideo = screen.media_type === 'video' || Math.random() > 0.7;

                whileHover={{ scale: 1.1 }}

                whileTap={{ scale: 0.9 }}  const rating = screen.rating || 4.8;  DashboardStats,  DashboardStats,

                className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all"

              >  const views = screen.views || Math.floor(Math.random() * 20000) + 5000;

                <Edit className="w-5 h-5" />

              </motion.button>  const clicks = screen.clicks || Math.floor(Math.random() * 1000) + 200;  AdminScreen,  AdminScreen,

              <motion.button

                whileHover={{ scale: 1.1 }}  const ctr = screen.ctr || ((clicks / views) * 100);

                whileTap={{ scale: 0.9 }}

                className="p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"  const pricePerDay = screen.price_per_day || 2500;  AdminBookingRequest,  AdminBookingRequest,

              >

                <Settings className="w-5 h-5" />  const sizeInfo = screen.size_info || screen.device_type || 'Standard';

              </motion.button>

            </div>    RevenueAnalytics,  RevenueAnalytics,

          </div>

        </div>  if (viewMode === "list") {

      </motion.div>

    );    return (} from "../../services/adminService";} from "../../services/adminService";

  }

      <motion.div

  return (

    <motion.div        initial={{ opacity: 0, y: 20 }}

      initial={{ opacity: 0, y: 40, scale: 0.9 }}

      animate={{ opacity: 1, y: 0, scale: 1 }}        animate={{ opacity: 1, y: 0 }}

      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}

      whileHover={{ y: -10, scale: 1.03 }}        transition={{ delay: index * 0.05 }}interface AdminDashboardProps {interface AdminDashboardProps {

      onHoverStart={() => setIsHovered(true)}

      onHoverEnd={() => setIsHovered(false)}        whileHover={{ scale: 1.01, x: 5 }}

      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden group cursor-pointer relative"

    >        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group"  onLogout: () => void;  onLogout: () => void;

      <div className="relative h-56 overflow-hidden">

        <motion.img      >

          src={mediaUrl}

          alt={screen.screen_name || `Screen ${screen.id}`}        <div className="flex items-center justify-between">}}

          className="w-full h-full object-cover transition-transform duration-700"

          animate={{ scale: isHovered ? 1.1 : 1 }}          <div className="flex items-center space-x-6">

          onError={(e) => {

            const target = e.target as HTMLImageElement;            <div className="relative w-20 h-16 rounded-xl overflow-hidden shadow-md">

            target.src = `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Screen+${screen.id}`;

          }}              <img 

        />

                        src={mediaUrl} type ActiveTab = "dashboard" | "screens" | "bookings" | "analytics" | "settings";type ActiveTab = "dashboard" | "screens" | "bookings" | "analytics" | "settings";

        {hasVideo && (

          <motion.div                alt={screen.screen_name || `Screen ${screen.id}`}

            initial={{ opacity: 0 }}

            animate={{ opacity: isHovered ? 1 : 0.8 }}                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"type ViewMode = "grid" | "list";type ViewMode = "grid" | "list";

            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex items-center justify-center"

          >                onError={(e) => {

            <motion.button

              whileHover={{ scale: 1.2 }}                  const target = e.target as HTMLImageElement;

              whileTap={{ scale: 0.9 }}

              className="bg-white/20 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/30"                  target.src = `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Screen+${screen.id}`;

            >

              <Play className="w-10 h-10 text-white ml-1" />                }}// Enhanced Screen interface for display// Enhanced Screen interface for display

            </motion.button>

          </motion.div>              />

        )}

              {hasVideo && (interface EnhancedScreen extends AdminScreen {interface EnhancedScreen extends AdminScreen {

        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">

          <motion.div                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

            initial={{ opacity: 0, y: -10 }}

            animate={{ opacity: 1, y: 0 }}                  <Play className="w-6 h-6 text-white" />  media_url?: string;  media_url?: string;

            className="flex items-center space-x-2"

          >                </div>

            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${

              screen.is_active               )}  media_type?: 'image' | 'video';  media_type?: 'image' | 'video';

                ? "bg-green-500/90 text-white" 

                : "bg-gray-500/90 text-white"              <div className="absolute -top-1 -right-1">

            }`}>

              {screen.is_active ? "🔴 LIVE" : "⚫ OFFLINE"}                <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-red-400'} shadow-lg`} />  rating?: number;  rating?: number;

            </span>

                          </div>

            {screen.is_active && (

              <motion.div            </div>  views?: number;  views?: number;

                animate={{ opacity: [0.5, 1, 0.5] }}

                transition={{ duration: 2, repeat: Infinity }}            

                className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"

              >            <div>  clicks?: number;  clicks?: number;

                <div className="flex items-center space-x-1 text-white text-xs">

                  <Clock className="w-3 h-3" />              <h3 className="text-lg font-bold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</h3>

                  <span>24/7</span>

                </div>              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">  ctr?: number;  ctr?: number;

              </motion.div>

            )}                <div className="flex items-center space-x-1">

          </motion.div>

                  <MapPin className="w-4 h-4" />  price_per_day?: number;  price_per_day?: number;

          <div className="flex items-center space-x-2">

            <motion.button                  <span>{screen.city || 'Unknown City'}</span>

              whileHover={{ scale: 1.2 }}

              whileTap={{ scale: 0.9 }}                </div>  size_info?: string;  size_info?: string;

              onClick={() => setIsFavorite(!isFavorite)}

              className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30"                <span>•</span>

            >

              <Heart className={`w-5 h-5 ${isFavorite ? "text-red-400 fill-red-400" : "text-white"}`} />                <span>{sizeInfo}</span>}}

            </motion.button>

          </div>                <span>•</span>

        </div>

      </div>                <div className="flex items-center space-x-1">



      <div className="p-6">                  <Wifi className="w-4 h-4" />

        <div className="flex items-start justify-between mb-4">

          <div>                  <span>Connected</span>// Screen Card Component with Image/Video Support// Screen Card Component with Image/Video Support

            <h3 className="text-xl font-bold text-gray-900 mb-2">{screen.screen_name || `Screen ${screen.id}`}</h3>

            <div className="flex items-center space-x-4 text-sm text-gray-500">                </div>

              <div className="flex items-center space-x-1">

                <MapPin className="w-4 h-4" />              </div>const ScreenCard: React.FC<{const ScreenCard: React.FC<{

                <span>{screen.city || 'Unknown City'}</span>

              </div>            </div>

              <div className="flex items-center space-x-1">

                <Monitor className="w-4 h-4" />          </div>  screen: EnhancedScreen;  screen: EnhancedScreen;

                <span>{sizeInfo}</span>

              </div>          

            </div>

          </div>          <div className="flex items-center space-x-6">  index: number;  index: number;

          

          <div className="flex items-center space-x-1">            <div className="text-center">

            {[...Array(5)].map((_, i) => (

              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />              <p className="text-sm text-gray-500">Status</p>  viewMode: ViewMode;  viewMode: ViewMode;

            ))}

            <span className="text-sm text-gray-500 ml-2">{rating}</span>              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${

          </div>

        </div>                screen.is_active }> = ({ screen, index, viewMode }) => {}> = ({ screen, index, viewMode }) => {



        <div className="grid grid-cols-3 gap-4 mb-6">                  ? "bg-green-100 text-green-700" 

          <div className="text-center p-3 bg-blue-50 rounded-2xl">

            <p className="text-xs text-blue-600 font-semibold">VIEWS</p>                  : "bg-gray-100 text-gray-600"  const [isHovered, setIsHovered] = useState(false);  const [isHovered, setIsHovered] = useState(false);

            <p className="text-lg font-bold text-blue-700">{(views / 1000).toFixed(1)}K</p>

          </div>              }`}>

          <div className="text-center p-3 bg-green-50 rounded-2xl">

            <p className="text-xs text-green-600 font-semibold">CLICKS</p>                {screen.is_active ? "LIVE" : "OFFLINE"}  const [isFavorite, setIsFavorite] = useState(false);  const [isFavorite, setIsFavorite] = useState(false);

            <p className="text-lg font-bold text-green-700">{clicks}</p>

          </div>              </span>

          <div className="text-center p-3 bg-purple-50 rounded-2xl">

            <p className="text-xs text-purple-600 font-semibold">CTR</p>            </div>  const [isPlaying, setIsPlaying] = useState(false);  const [isPlaying, setIsPlaying] = useState(false);

            <p className="text-lg font-bold text-purple-700">{ctr.toFixed(1)}%</p>

          </div>            

        </div>

            <div className="text-center">    

        <div className="flex items-center justify-between mb-6">

          <div>              <p className="text-sm text-gray-500">Price</p>

            <p className="text-sm text-gray-500">Daily Rate</p>

            <span className="text-3xl font-black text-gray-900">              <span className="text-lg font-bold text-gray-900">  // Mock enhanced data  // Mock enhanced data

              ₹{pricePerDay}

              <span className="text-sm font-normal text-gray-500">/day</span>                ₹{pricePerDay}/day

            </span>

          </div>              </span>  const mediaUrl = screen.media_url || `https://picsum.photos/400/300?random=${screen.id}`;  const mediaUrl = screen.media_url || `https://picsum.photos/400/300?random=${screen.id}`;

          

          <div className="text-right">            </div>

            <p className="text-sm text-gray-500">Utilization</p>

            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">              const hasVideo = screen.media_type === 'video' || Math.random() > 0.7;  const hasVideo = screen.media_type === 'video' || Math.random() > 0.7;

              <motion.div

                initial={{ width: 0 }}            <div className="flex items-center space-x-2">

                animate={{ width: "78%" }}

                transition={{ duration: 1.5, delay: index * 0.1 }}              <motion.button  const rating = screen.rating || 4.8;  const rating = screen.rating || 4.8;

                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"

              />                whileHover={{ scale: 1.1 }}

            </div>

            <span className="text-xs text-gray-600 mt-1">78%</span>                whileTap={{ scale: 0.9 }}  const views = screen.views || Math.floor(Math.random() * 20000) + 5000;  const views = screen.views || Math.floor(Math.random() * 20000) + 5000;

          </div>

        </div>                className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"



        <div className="flex space-x-3">              >  const clicks = screen.clicks || Math.floor(Math.random() * 1000) + 200;  const clicks = screen.clicks || Math.floor(Math.random() * 1000) + 200;

          <motion.button

            whileHover={{ scale: 1.05 }}                <Eye className="w-5 h-5" />

            whileTap={{ scale: 0.95 }}

            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"              </motion.button>  const ctr = screen.ctr || ((clicks / views) * 100);  const ctr = screen.ctr || ((clicks / views) * 100);

          >

            📊 View Analytics              <motion.button

          </motion.button>

          <motion.button                whileHover={{ scale: 1.1 }}  const pricePerDay = screen.price_per_day || 2500;  

            whileHover={{ scale: 1.05 }}

            whileTap={{ scale: 0.95 }}                whileTap={{ scale: 0.9 }}

            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"

          >                className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all"  const sizeInfo = screen.size_info || screen.device_type || 'Standard';  if (viewMode === "list") {

            ⚙️ Manage

          </motion.button>              >

        </div>

      </div>                <Edit className="w-5 h-5" />      return (



      <motion.div              </motion.button>

        initial={{ opacity: 0 }}

        animate={{ opacity: isHovered ? 0.3 : 0 }}              <motion.button  if (viewMode === "list") {      <motion.div

        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl -z-10"

      />                whileHover={{ scale: 1.1 }}

    </motion.div>

  );                whileTap={{ scale: 0.9 }}    return (        initial={{ opacity: 0, y: 20 }}

};

                className="p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"

const DashboardWidget: React.FC<{

  icon: React.ComponentType<any>;              >      <motion.div        animate={{ opacity: 1, y: 0 }}

  title: string;

  value: string | number;                <Settings className="w-5 h-5" />

  subtitle: string;

  change: { value: number; isPositive: boolean };              </motion.button>        initial={{ opacity: 0, y: 20 }}        transition={{ delay: index * 0.05 }}

  color: string;

  delay: number;            </div>

}> = ({ icon: Icon, title, value, subtitle, change, color, delay }) => {

  const colorClasses = {          </div>        animate={{ opacity: 1, y: 0 }}        whileHover={{ scale: 1.01, x: 5 }}

    blue: { bg: "from-blue-500 to-cyan-500" },

    green: { bg: "from-green-500 to-emerald-500" },        </div>

    purple: { bg: "from-purple-500 to-pink-500" },

    orange: { bg: "from-orange-500 to-yellow-500" },      </motion.div>        transition={{ delay: index * 0.05 }}        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group"

  };

    );

  const colors = colorClasses[color as keyof typeof colorClasses];

  }        whileHover={{ scale: 1.01, x: 5 }}      >

  return (

    <motion.div

      initial={{ opacity: 0, y: 30, scale: 0.9 }}

      animate={{ opacity: 1, y: 0, scale: 1 }}  return (        className="bg-white rounded-2xl p-6 shadow-lg border border-gray-100 hover:shadow-2xl transition-all duration-300 group"        <div className="flex items-center justify-between">

      transition={{ delay, type: "spring", stiffness: 150 }}

      whileHover={{ y: -8, scale: 1.03 }}    <motion.div

      className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden group cursor-pointer"

    >      initial={{ opacity: 0, y: 40, scale: 0.9 }}      >          <div className="flex items-center space-x-6">

      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

            animate={{ opacity: 1, y: 0, scale: 1 }}

      <div className="relative z-10">

        <div className="flex items-start justify-between mb-6">      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}        <div className="flex items-center justify-between">            <div className="relative w-20 h-16 rounded-xl overflow-hidden shadow-md">

          <motion.div

            whileHover={{ rotate: 15, scale: 1.1 }}      whileHover={{ y: -10, scale: 1.03 }}

            className={`p-5 bg-gradient-to-br ${colors.bg} rounded-3xl shadow-lg`}

          >      onHoverStart={() => setIsHovered(true)}          <div className="flex items-center space-x-6">              <img 

            <Icon className="w-8 h-8 text-white" />

          </motion.div>      onHoverEnd={() => setIsHovered(false)}

          

          <motion.div      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden group cursor-pointer relative"            <div className="relative w-20 h-16 rounded-xl overflow-hidden shadow-md">                src={mediaUrl} 

            initial={{ opacity: 0, x: 20 }}

            animate={{ opacity: 1, x: 0 }}    >

            transition={{ delay: delay + 0.2 }}

            className={`flex items-center space-x-2 text-sm font-bold px-4 py-2 rounded-full ${      {/* Media Section */}              <img                 alt={screen.screen_name || `Screen ${screen.id}`}

              change.isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"

            }`}      <div className="relative h-56 overflow-hidden">

          >

            {change.isPositive ? (        <motion.img                src={mediaUrl}                 className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"

              <ArrowUp className="w-4 h-4" />

            ) : (          src={mediaUrl}

              <ArrowDown className="w-4 h-4" />

            )}          alt={screen.screen_name || `Screen ${screen.id}`}                alt={screen.screen_name || `Screen ${screen.id}`}              />

            <span>{change.value}%</span>

          </motion.div>          className="w-full h-full object-cover transition-transform duration-700"

        </div>

          animate={{ scale: isHovered ? 1.1 : 1 }}                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"              {hasVideo && (

        <div>

          <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">{title}</p>          onError={(e) => {

          <motion.p

            initial={{ opacity: 0, scale: 0.8 }}            const target = e.target as HTMLImageElement;                onError={(e) => {                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">

            animate={{ opacity: 1, scale: 1 }}

            transition={{ delay: delay + 0.3 }}            target.src = `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Screen+${screen.id}`;

            className="text-4xl font-black text-gray-900 mb-2"

          >          }}                  const target = e.target as HTMLImageElement;                  <Play className="w-6 h-6 text-white" />

            {typeof value === 'number' ? value.toLocaleString() : value}

          </motion.p>        />

          <p className="text-sm font-medium text-gray-500">{subtitle}</p>

        </div>                          target.src = `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Screen+${screen.id}`;                </div>



        <div className="mt-6">        {/* Video Controls Overlay */}

          <div className="w-full bg-gray-200 rounded-full h-2">

            <motion.div        {hasVideo && (                }}              )}

              initial={{ width: 0 }}

              animate={{ width: `${Math.min(Math.abs(change.value), 100)}%` }}          <motion.div

              transition={{ duration: 1.5, delay: delay + 0.5 }}

              className={`bg-gradient-to-r ${colors.bg} h-2 rounded-full`}            initial={{ opacity: 0 }}              />              <div className="absolute -top-1 -right-1">

            />

          </div>            animate={{ opacity: isHovered ? 1 : 0.8 }}

        </div>

      </div>            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex items-center justify-center"              {hasVideo && (                <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-red-400'} shadow-lg`} />

    </motion.div>

  );          >

};

            <motion.button                <div className="absolute inset-0 bg-black/40 flex items-center justify-center">              </div>

const LoadingSpinner: React.FC = () => (

  <motion.div              whileHover={{ scale: 1.2 }}

    initial={{ opacity: 0 }}

    animate={{ opacity: 1 }}              whileTap={{ scale: 0.9 }}                  <Play className="w-6 h-6 text-white" />            </div>

    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"

  >              onClick={() => setIsPlaying(!isPlaying)}

    <div className="text-center">

      <motion.div className="relative mb-8">              className="bg-white/20 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/30"                </div>            

        <motion.div

          className="w-24 h-24 border-4 border-blue-200 rounded-full"            >

          animate={{ rotate: 360 }}

          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}              {isPlaying ? (              )}            <div>

        />

        <motion.div                <Pause className="w-10 h-10 text-white" />

          className="absolute inset-0 w-24 h-24 border-4 border-purple-300 rounded-full border-t-purple-600"

          animate={{ rotate: -360 }}              ) : (              <div className="absolute -top-1 -right-1">              <h3 className="text-lg font-bold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</h3>

          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}

        />                <Play className="w-10 h-10 text-white ml-1" />

        

        <motion.div              )}                <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-red-400'} shadow-lg`} />              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">

          className="absolute inset-0 flex items-center justify-center"

          animate={{ scale: [1, 1.1, 1] }}            </motion.button>

          transition={{ duration: 2, repeat: Infinity }}

        >          </motion.div>              </div>                <div className="flex items-center space-x-1">

          <Shield className="w-8 h-8 text-blue-600" />

        </motion.div>        )}

      </motion.div>

                  </div>                  <MapPin className="w-4 h-4" />

      <motion.div

        initial={{ opacity: 0, y: 20 }}        {/* Top Bar with Status and Controls */}

        animate={{ opacity: 1, y: 0 }}

        transition={{ delay: 0.3 }}        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">                              <span>{screen.city || 'Unknown City'}</span>

      >

        <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Loading Dashboard</h3>          <motion.div

        <div className="flex items-center justify-center space-x-2">

          {[...Array(4)].map((_, i) => (            initial={{ opacity: 0, y: -10 }}            <div>                </div>

            <motion.div

              key={i}            animate={{ opacity: 1, y: 0 }}

              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"

              animate={{ y: [0, -15, 0] }}            className="flex items-center space-x-2"              <h3 className="text-lg font-bold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</h3>                <span>•</span>

              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}

            />          >

          ))}

        </div>            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${              <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">                <span>{screen.size_info || 'Standard'}</span>

      </motion.div>

    </div>              screen.is_active 

  </motion.div>

);                ? "bg-green-500/90 text-white"                 <div className="flex items-center space-x-1">                <span>•</span>



const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {                : "bg-gray-500/90 text-white"

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  const [viewMode, setViewMode] = useState<ViewMode>("grid");            }`}>                  <MapPin className="w-4 h-4" />                <div className="flex items-center space-x-1">

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

  const [screens, setScreens] = useState<AdminScreen[]>([]);              {screen.is_active ? "🔴 LIVE" : "⚫ OFFLINE"}

  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);

  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);            </span>                  <span>{screen.city || 'Unknown City'}</span>                  <Wifi className="w-4 h-4" />

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState<string | null>(null);            

  const [refreshing, setRefreshing] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");            {screen.is_active && (                </div>                  <span>Connected</span>



  const fetchDashboardData = async () => {              <motion.div

    try {

      setError(null);                animate={{ opacity: [0.5, 1, 0.5] }}                <span>•</span>                </div>

      const [statsData, screensData, bookingsData, revenueData] = await Promise.all([

        adminService.getDashboardStats(),                transition={{ duration: 2, repeat: Infinity }}

        adminService.getAllScreens(),

        adminService.getAllBookingRequests(),                className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"                <span>{sizeInfo}</span>              </div>

        adminService.getRevenueAnalytics(),

      ]);              >



      setDashboardStats(statsData);                <div className="flex items-center space-x-1 text-white text-xs">                <span>•</span>            </div>

      setScreens(screensData);

      setBookings(bookingsData);                  <Clock className="w-3 h-3" />

      setRevenue(revenueData);

    } catch (err) {                  <span>24/7</span>                <div className="flex items-center space-x-1">          </div>

      console.error("Failed to fetch dashboard data:", err);

      setError("Failed to load dashboard data. Please try again.");                </div>

    } finally {

      setLoading(false);              </motion.div>                  <Wifi className="w-4 h-4" />          

      setRefreshing(false);

    }            )}

  };

          </motion.div>                  <span>Connected</span>          <div className="flex items-center space-x-6">

  useEffect(() => {

    fetchDashboardData();

  }, []);

          <div className="flex items-center space-x-2">                </div>            <div className="text-center">

  const handleRefresh = async () => {

    setRefreshing(true);            <motion.button

    await fetchDashboardData();

  };              whileHover={{ scale: 1.2 }}              </div>              <p className="text-sm text-gray-500">Status</p>



  if (loading) {              whileTap={{ scale: 0.9 }}

    return <LoadingSpinner />;

  }              onClick={() => setIsFavorite(!isFavorite)}            </div>              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${



  if (error) {              className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30"

    return (

      <motion.div            >          </div>                screen.is_active 

        initial={{ opacity: 0, scale: 0.9 }}

        animate={{ opacity: 1, scale: 1 }}              <Heart className={`w-5 h-5 ${isFavorite ? "text-red-400 fill-red-400" : "text-white"}`} />

        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"

      >            </motion.button>                            ? "bg-green-100 text-green-700" 

        <motion.div

          className="text-center p-10 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md mx-4"          </div>

          whileHover={{ scale: 1.02 }}

        >        </div>          <div className="flex items-center space-x-6">                  : "bg-gray-100 text-gray-600"

          <motion.div

            initial={{ scale: 0, rotate: -180 }}

            animate={{ scale: 1, rotate: 0 }}

            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}        {/* Action Buttons on Hover */}            <div className="text-center">              }`}>

            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"

          >        <motion.div

            <AlertTriangle className="w-10 h-10 text-red-600" />

          </motion.div>          initial={{ opacity: 0, y: 20 }}              <p className="text-sm text-gray-500">Status</p>                {screen.is_active ? "LIVE" : "OFFLINE"}

          

          <h3 className="text-2xl font-bold text-gray-900 mb-4">          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}

            🚨 Something went wrong

          </h3>          className="absolute bottom-4 right-4 flex space-x-2"              <span className={`px-3 py-1 rounded-full text-sm font-semibold ${              </span>

          

          <p className="text-gray-600 mb-8">{error}</p>        >

          

          <motion.button          <motion.button                screen.is_active             </div>

            onClick={() => {

              setError(null);            whileHover={{ scale: 1.1 }}

              setLoading(true);

              fetchDashboardData();            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"                  ? "bg-green-100 text-green-700"             

            }}

            whileHover={{ scale: 1.05 }}          >

            whileTap={{ scale: 0.95 }}

            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"            <Maximize className="w-5 h-5" />                  : "bg-gray-100 text-gray-600"            <div className="text-center">

          >

            🔄 Try Again          </motion.button>

          </motion.button>

        </motion.div>          <motion.button              }`}>              <p className="text-sm text-gray-500">Price</p>

      </motion.div>

    );            whileHover={{ scale: 1.1 }}

  }

            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"                {screen.is_active ? "LIVE" : "OFFLINE"}              <span className="text-lg font-bold text-gray-900">

  const filteredScreens = screens.filter(screen =>

    (screen.screen_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||          >

    (screen.city || '').toLowerCase().includes(searchQuery.toLowerCase())

  );            <Share2 className="w-5 h-5" />              </span>                ₹{screen.price_per_day || 0}/day



  return (          </motion.button>

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">

      <motion.header          <motion.button            </div>              </span>

        initial={{ opacity: 0, y: -50 }}

        animate={{ opacity: 1, y: 0 }}            whileHover={{ scale: 1.1 }}

        transition={{ duration: 0.8, type: "spring" }}

        className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-xl"            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"                        </div>

      >

        <div className="max-w-7xl mx-auto px-6">          >

          <div className="flex items-center justify-between h-24">

            <motion.div             <Download className="w-5 h-5" />            <div className="text-center">            

              className="flex items-center space-x-4"

              initial={{ opacity: 0, x: -30 }}          </motion.button>

              animate={{ opacity: 1, x: 0 }}

              transition={{ delay: 0.2 }}        </motion.div>              <p className="text-sm text-gray-500">Price</p>            <div className="flex items-center space-x-2">

            >

              <motion.div

                className="p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl"

                whileHover={{         {/* Performance Indicator */}              <span className="text-lg font-bold text-gray-900">              <motion.button

                  scale: 1.1, 

                  rotate: 360,        <div className="absolute bottom-4 left-4">

                  boxShadow: "0 25px 50px rgba(0,0,0,0.25)"

                }}          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">                ₹{pricePerDay}/day                whileHover={{ scale: 1.1 }}

                transition={{ duration: 0.6 }}

              >            <div className="flex items-center space-x-2 text-white text-sm">

                <Shield className="w-10 h-10 text-white" />

              </motion.div>              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />              </span>                whileTap={{ scale: 0.9 }}

              <div>

                <motion.h1               <span>High Performance</span>

                  className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"

                  initial={{ opacity: 0 }}            </div>            </div>                className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"

                  animate={{ opacity: 1 }}

                  transition={{ delay: 0.4 }}          </div>

                >

                  Admin Dashboard        </div>                          >

                </motion.h1>

                <motion.p       </div>

                  className="text-sm font-semibold text-gray-600"

                  initial={{ opacity: 0 }}            <div className="flex items-center space-x-2">                <Eye className="w-5 h-5" />

                  animate={{ opacity: 1 }}

                  transition={{ delay: 0.5 }}      {/* Content Section */}

                >

                  🎯 Digital Signage Control Center      <div className="p-6">              <motion.button              </motion.button>

                </motion.p>

              </div>        <div className="flex items-start justify-between mb-4">

            </motion.div>

          <div>                whileHover={{ scale: 1.1 }}              <motion.button

            <motion.div

              initial={{ opacity: 0, y: -20 }}            <h3 className="text-xl font-bold text-gray-900 mb-2">{screen.screen_name || `Screen ${screen.id}`}</h3>

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.3 }}            <div className="flex items-center space-x-4 text-sm text-gray-500">                whileTap={{ scale: 0.9 }}                whileHover={{ scale: 1.1 }}

              className="hidden md:flex items-center space-x-4"

            >              <div className="flex items-center space-x-1">

              <div className="relative">

                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />                <MapPin className="w-4 h-4" />                className="p-3 text-blue-600 hover:bg-blue-50 rounded-xl transition-all"                whileTap={{ scale: 0.9 }}

                <input

                  type="text"                <span>{screen.city || 'Unknown City'}</span>

                  placeholder="Search screens, locations..."

                  value={searchQuery}              </div>              >                className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all"

                  onChange={(e) => setSearchQuery(e.target.value)}

                  className="pl-12 pr-6 py-3 w-80 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"              <div className="flex items-center space-x-1">

                />

              </div>                <Monitor className="w-4 h-4" />                <Eye className="w-5 h-5" />              >

            </motion.div>

                <span>{sizeInfo}</span>

            <motion.div 

              className="flex items-center space-x-4"              </div>              </motion.button>                <Edit className="w-5 h-5" />

              initial={{ opacity: 0, x: 30 }}

              animate={{ opacity: 1, x: 0 }}            </div>

              transition={{ delay: 0.3 }}

            >          </div>              <motion.button              </motion.button>

              <motion.button

                onClick={handleRefresh}          

                disabled={refreshing}

                whileHover={{ scale: 1.1, rotate: 180 }}          <div className="flex items-center space-x-1">                whileHover={{ scale: 1.1 }}              <motion.button

                whileTap={{ scale: 0.95 }}

                className="p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-lg"            {[...Array(5)].map((_, i) => (

              >

                <RefreshCw className={`w-6 h-6 ${refreshing ? "animate-spin" : ""}`} />              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />                whileTap={{ scale: 0.9 }}                whileHover={{ scale: 1.1 }}

              </motion.button>

            ))}

              <motion.button

                whileHover={{ scale: 1.1 }}            <span className="text-sm text-gray-500 ml-2">{rating}</span>                className="p-3 text-green-600 hover:bg-green-50 rounded-xl transition-all"                whileTap={{ scale: 0.9 }}

                whileTap={{ scale: 0.95 }}

                className="p-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all relative shadow-lg"          </div>

              >

                <Bell className="w-6 h-6" />        </div>              >                className="p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"

                <motion.div

                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"

                  animate={{ scale: [1, 1.2, 1] }}

                  transition={{ duration: 2, repeat: Infinity }}        {/* Stats Row */}                <Edit className="w-5 h-5" />              >

                >

                  <span className="text-xs text-white font-bold">3</span>        <div className="grid grid-cols-3 gap-4 mb-6">

                </motion.div>

              </motion.button>          <div className="text-center p-3 bg-blue-50 rounded-2xl">              </motion.button>                <Settings className="w-5 h-5" />



              <motion.button            <p className="text-xs text-blue-600 font-semibold">VIEWS</p>

                onClick={onLogout}

                whileHover={{ scale: 1.05 }}            <p className="text-lg font-bold text-blue-700">{(views / 1000).toFixed(1)}K</p>              <motion.button              </motion.button>

                whileTap={{ scale: 0.95 }}

                className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"          </div>

              >

                <LogOut className="w-5 h-5" />          <div className="text-center p-3 bg-green-50 rounded-2xl">                whileHover={{ scale: 1.1 }}            </div>

                <span>Logout</span>

              </motion.button>            <p className="text-xs text-green-600 font-semibold">CLICKS</p>

            </div>

          </div>            <p className="text-lg font-bold text-green-700">{clicks}</p>                whileTap={{ scale: 0.9 }}          </div>



          <motion.div           </div>

            className="border-t border-gray-200/50 -mb-px"

            initial={{ opacity: 0, y: 20 }}          <div className="text-center p-3 bg-purple-50 rounded-2xl">                className="p-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-all"        </div>

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: 0.4 }}            <p className="text-xs text-purple-600 font-semibold">CTR</p>

          >

            <nav className="flex space-x-2 py-6 overflow-x-auto">            <p className="text-lg font-bold text-purple-700">{ctr.toFixed(1)}%</p>              >      </motion.div>

              {[

                { id: "dashboard", label: "🏠 Dashboard", icon: BarChart3 },          </div>

                { id: "screens", label: "📺 Screens", icon: Monitor },

                { id: "bookings", label: "📅 Bookings", icon: Calendar },        </div>                <Settings className="w-5 h-5" />    );

                { id: "analytics", label: "📊 Analytics", icon: TrendingUp },

                { id: "settings", label: "⚙️ Settings", icon: Settings },

              ].map((tab, index) => (

                <motion.button        <div className="flex items-center justify-between mb-6">              </motion.button>  }

                  key={tab.id}

                  onClick={() => setActiveTab(tab.id as ActiveTab)}          <div>

                  whileHover={{ scale: 1.05, y: -2 }}

                  whileTap={{ scale: 0.95 }}            <p className="text-sm text-gray-500">Daily Rate</p>            </div>

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}            <span className="text-3xl font-black text-gray-900">

                  transition={{ delay: 0.5 + index * 0.1 }}

                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all text-sm relative overflow-hidden min-w-max ${              ₹{pricePerDay}          </div>  return (

                    activeTab === tab.id

                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl"              <span className="text-sm font-normal text-gray-500">/day</span>

                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70 shadow-lg"

                  }`}            </span>        </div>    <motion.div

                >

                  <tab.icon className="w-5 h-5" />          </div>

                  <span>{tab.label}</span>

                </motion.button>                </motion.div>      initial={{ opacity: 0, y: 40, scale: 0.9 }}

              ))}

            </nav>          <div className="text-right">

          </motion.div>

        </div>            <p className="text-sm text-gray-500">Utilization</p>    );      animate={{ opacity: 1, y: 0, scale: 1 }}

      </motion.header>

            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">

      <div className="max-w-7xl mx-auto px-6 py-8">

        <AnimatePresence mode="wait">              <motion.div  }      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}

          {activeTab === "dashboard" && (

            <motion.div                initial={{ width: 0 }}

              key="dashboard"

              initial={{ opacity: 0, y: 40 }}                animate={{ width: "78%" }}      whileHover={{ y: -10, scale: 1.03 }}

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0, y: -40 }}                transition={{ duration: 1.5, delay: index * 0.1 }}

              transition={{ duration: 0.6 }}

              className="space-y-8"                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"  return (      onHoverStart={() => setIsHovered(true)}

            >

              <motion.div              />

                initial={{ opacity: 0, y: 30 }}

                animate={{ opacity: 1, y: 0 }}            </div>    <motion.div      onHoverEnd={() => setIsHovered(false)}

                transition={{ delay: 0.2 }}

              >            <span className="text-xs text-gray-600 mt-1">78%</span>

                <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">

                  📊 Dashboard Overview          </div>      initial={{ opacity: 0, y: 40, scale: 0.9 }}      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden group cursor-pointer relative"

                </h2>

                        </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                  <DashboardWidget      animate={{ opacity: 1, y: 0, scale: 1 }}    >

                    icon={Monitor}

                    title="Total Screens"        {/* Action Buttons */}

                    value={dashboardStats?.screens?.total_screens || 0}

                    subtitle="Digital displays active"        <div className="flex space-x-3">      transition={{ delay: index * 0.1, type: "spring", stiffness: 100 }}      {/* Media Section */}

                    color="blue"

                    delay={0.1}          <motion.button

                    change={{ value: 12, isPositive: true }}

                  />            whileHover={{ scale: 1.05 }}      whileHover={{ y: -10, scale: 1.03 }}      <div className="relative h-56 overflow-hidden">

                  <DashboardWidget

                    icon={Activity}            whileTap={{ scale: 0.95 }}

                    title="Active Now"

                    value={dashboardStats?.screens?.active_screens || 0}            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"      onHoverStart={() => setIsHovered(true)}        <motion.img

                    subtitle="Currently broadcasting"

                    color="green"          >

                    delay={0.2}

                    change={{ value: 8, isPositive: true }}            📊 View Analytics      onHoverEnd={() => setIsHovered(false)}          src={mediaUrl}

                  />

                  <DashboardWidget          </motion.button>

                    icon={Calendar}

                    title="Bookings"          <motion.button      className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden group cursor-pointer relative"          alt={screen.screen_name || `Screen ${screen.id}`}

                    value={dashboardStats?.bookingRequests?.total_requests || 0}

                    subtitle="Campaign requests"            whileHover={{ scale: 1.05 }}

                    color="purple"

                    delay={0.3}            whileTap={{ scale: 0.95 }}    >          className="w-full h-full object-cover transition-transform duration-700"

                    change={{ value: 3, isPositive: false }}

                  />            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"

                  <DashboardWidget

                    icon={DollarSign}          >      {/* Media Section */}          animate={{ scale: isHovered ? 1.1 : 1 }}

                    title="Revenue"

                    value={`₹${(revenue?.totalRevenue || 0).toLocaleString()}`}            ⚙️ Manage

                    subtitle="Monthly earnings"

                    color="orange"          </motion.button>      <div className="relative h-56 overflow-hidden">        />

                    delay={0.4}

                    change={{ value: 24, isPositive: true }}        </div>

                  />

                </div>      </div>        <motion.img        

              </motion.div>



              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                <motion.div      {/* Glow Effect */}          src={mediaUrl}        {/* Video Controls Overlay */}

                  initial={{ opacity: 0, x: -40 }}

                  animate={{ opacity: 1, x: 0 }}      <motion.div

                  transition={{ delay: 0.6 }}

                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"        initial={{ opacity: 0 }}          alt={screen.screen_name || `Screen ${screen.id}`}        {hasVideo && (

                >

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">        animate={{ opacity: isHovered ? 0.3 : 0 }}

                    ⚡ Quick Actions

                  </h3>        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl -z-10"          className="w-full h-full object-cover transition-transform duration-700"          <motion.div

                  <div className="grid grid-cols-2 gap-4">

                    {[      />

                      { icon: Plus, label: "Add Screen", color: "from-blue-500 to-cyan-500" },

                      { icon: Settings, label: "Settings", color: "from-purple-500 to-pink-500" },    </motion.div>          animate={{ scale: isHovered ? 1.1 : 1 }}            initial={{ opacity: 0 }}

                      { icon: BarChart3, label: "Reports", color: "from-orange-500 to-yellow-500" },

                      { icon: Monitor, label: "Manage", color: "from-green-500 to-emerald-500" },  );

                    ].map((action, index) => (

                      <motion.button};          onError={(e) => {            animate={{ opacity: isHovered ? 1 : 0.8 }}

                        key={action.label}

                        whileHover={{ scale: 1.05, y: -5 }}

                        whileTap={{ scale: 0.95 }}

                        initial={{ opacity: 0, y: 20 }}// Dashboard Stats Widget            const target = e.target as HTMLImageElement;            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex items-center justify-center"

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ delay: 0.7 + index * 0.1 }}const DashboardWidget: React.FC<{

                        className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center`}

                      >  icon: React.ComponentType<any>;            target.src = `https://via.placeholder.com/400x300/e5e7eb/9ca3af?text=Screen+${screen.id}`;          >

                        <action.icon className="w-8 h-8 mx-auto mb-2" />

                        <span className="font-semibold">{action.label}</span>  title: string;

                      </motion.button>

                    ))}  value: string | number;          }}            <motion.button

                  </div>

                </motion.div>  subtitle: string;



                <motion.div  change: { value: number; isPositive: boolean };        />              whileHover={{ scale: 1.2 }}

                  initial={{ opacity: 0, x: 40 }}

                  animate={{ opacity: 1, x: 0 }}  color: string;

                  transition={{ delay: 0.6 }}

                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"  delay: number;                      whileTap={{ scale: 0.9 }}

                >

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">}> = ({ icon: Icon, title, value, subtitle, change, color, delay }) => {

                    🔥 Recent Activity

                  </h3>  const colorClasses = {        {/* Video Controls Overlay */}              onClick={() => setIsPlaying(!isPlaying)}

                  <div className="space-y-4">

                    {screens.slice(0, 4).map((screen, index) => (    blue: {

                      <motion.div

                        key={screen.id}      bg: "from-blue-500 to-cyan-500",        {hasVideo && (              className="bg-white/20 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/30"

                        initial={{ opacity: 0, x: 20 }}

                        animate={{ opacity: 1, x: 0 }}    },

                        transition={{ delay: 0.8 + index * 0.1 }}

                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"    green: {          <motion.div            >

                      >

                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">      bg: "from-green-500 to-emerald-500", 

                          <Monitor className="w-6 h-6 text-white" />

                        </div>    },            initial={{ opacity: 0 }}              {isPlaying ? (

                        <div className="flex-1">

                          <p className="font-semibold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</p>    purple: {

                          <p className="text-sm text-gray-500">{screen.city || 'Unknown City'} • Just now</p>

                        </div>      bg: "from-purple-500 to-pink-500",            animate={{ opacity: isHovered ? 1 : 0.8 }}                <Pause className="w-10 h-10 text-white" />

                        <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />

                      </motion.div>    },

                    ))}

                  </div>    orange: {            className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-black/30 flex items-center justify-center"              ) : (

                </motion.div>

              </div>      bg: "from-orange-500 to-yellow-500",

            </motion.div>

          )}    },          >                <Play className="w-10 h-10 text-white ml-1" />



          {activeTab === "screens" && (  };

            <motion.div

              key="screens"            <motion.button              )}

              initial={{ opacity: 0, y: 40 }}

              animate={{ opacity: 1, y: 0 }}  const colors = colorClasses[color as keyof typeof colorClasses];

              exit={{ opacity: 0, y: -40 }}

              transition={{ duration: 0.6 }}              whileHover={{ scale: 1.2 }}            </motion.button>

              className="space-y-8"

            >  return (

              <div className="flex items-center justify-between">

                <div>    <motion.div              whileTap={{ scale: 0.9 }}          </motion.div>

                  <h2 className="text-4xl font-black text-gray-900 mb-2">

                    📺 Screen Management      initial={{ opacity: 0, y: 30, scale: 0.9 }}

                  </h2>

                  <p className="text-lg text-gray-600">Manage your digital displays with style</p>      animate={{ opacity: 1, y: 0, scale: 1 }}              onClick={() => setIsPlaying(!isPlaying)}        )}

                </div>

                      transition={{ delay, type: "spring", stiffness: 150 }}

                <div className="flex items-center space-x-4">

                  <div className="flex bg-white rounded-2xl shadow-lg border border-gray-200 p-2">      whileHover={{ y: -8, scale: 1.03 }}              className="bg-white/20 backdrop-blur-md rounded-full p-6 shadow-2xl border border-white/30"

                    <motion.button

                      whileHover={{ scale: 1.05 }}      className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden group cursor-pointer"

                      whileTap={{ scale: 0.95 }}

                      onClick={() => setViewMode("grid")}    >            >        {/* Top Bar with Status and Controls */}

                      className={`p-3 rounded-xl transition-all ${

                        viewMode === "grid"       <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                          ? "bg-blue-500 text-white shadow-lg" 

                          : "text-gray-600 hover:bg-gray-100"                    {isPlaying ? (        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">

                      }`}

                    >      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full" />

                      <Grid3X3 className="w-5 h-5" />

                    </motion.button>      <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-gradient-to-tr from-gray-100/50 to-gray-50/30 rounded-full" />                <Pause className="w-10 h-10 text-white" />          <motion.div

                    <motion.button

                      whileHover={{ scale: 1.05 }}      

                      whileTap={{ scale: 0.95 }}

                      onClick={() => setViewMode("list")}      <div className="relative z-10">              ) : (            initial={{ opacity: 0, y: -10 }}

                      className={`p-3 rounded-xl transition-all ${

                        viewMode === "list"         <div className="flex items-start justify-between mb-6">

                          ? "bg-blue-500 text-white shadow-lg" 

                          : "text-gray-600 hover:bg-gray-100"          <motion.div                <Play className="w-10 h-10 text-white ml-1" />            animate={{ opacity: 1, y: 0 }}

                      }`}

                    >            whileHover={{ rotate: 15, scale: 1.1 }}

                      <List className="w-5 h-5" />

                    </motion.button>            className={`p-5 bg-gradient-to-br ${colors.bg} rounded-3xl shadow-lg`}              )}            className="flex items-center space-x-2"

                  </div>

          >

                  <motion.button

                    whileHover={{ scale: 1.05 }}            <Icon className="w-8 h-8 text-white" />            </motion.button>          >

                    whileTap={{ scale: 0.95 }}

                    className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50"          </motion.div>

                  >

                    <Filter className="w-5 h-5" />                    </motion.div>            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${

                    <span>Filter</span>

                  </motion.button>          <motion.div



                  <motion.button            initial={{ opacity: 0, x: 20 }}        )}              screen.is_active 

                    whileHover={{ scale: 1.05 }}

                    whileTap={{ scale: 0.95 }}            animate={{ opacity: 1, x: 0 }}

                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"

                  >            transition={{ delay: delay + 0.2 }}                ? "bg-green-500/90 text-white" 

                    <Plus className="w-6 h-6" />

                    <span>Add New Screen</span>            className={`flex items-center space-x-2 text-sm font-bold px-4 py-2 rounded-full ${

                  </motion.button>

                </div>              change.isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"        {/* Top Bar with Status and Controls */}                : "bg-gray-500/90 text-white"

              </div>

            }`}

              <motion.div

                initial={{ opacity: 0, y: 30 }}          >        <div className="absolute top-4 left-4 right-4 flex items-center justify-between">            }`}>

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.2 }}            {change.isPositive ? (

                className={`${

                  viewMode === "grid"               <ArrowUp className="w-4 h-4" />          <motion.div              {screen.is_active ? "🔴 LIVE" : "⚫ OFFLINE"}

                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 

                    : "space-y-4"            ) : (

                }`}

              >              <ArrowDown className="w-4 h-4" />            initial={{ opacity: 0, y: -10 }}            </span>

                {filteredScreens.map((screen, index) => (

                  <ScreenCard            )}

                    key={screen.id}

                    screen={screen as EnhancedScreen}            <span>{change.value}%</span>            animate={{ opacity: 1, y: 0 }}            

                    index={index}

                    viewMode={viewMode}          </motion.div>

                  />

                ))}        </div>            className="flex items-center space-x-2"            {screen.is_active && (

              </motion.div>



              {filteredScreens.length === 0 && (

                <motion.div        <div>          >              <motion.div

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}          <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">{title}</p>

                  className="text-center py-16"

                >          <motion.p            <span className={`px-3 py-1 rounded-full text-xs font-bold shadow-lg backdrop-blur-sm ${                animate={{ opacity: [0.5, 1, 0.5] }}

                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">

                    <Monitor className="w-16 h-16 text-gray-400" />            initial={{ opacity: 0, scale: 0.8 }}

                  </div>

                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No screens found</h3>            animate={{ opacity: 1, scale: 1 }}              screen.is_active                 transition={{ duration: 2, repeat: Infinity }}

                  <p className="text-gray-500 mb-8">Try adjusting your search or add a new screen</p>

                  <motion.button            transition={{ delay: delay + 0.3 }}

                    whileHover={{ scale: 1.05 }}

                    whileTap={{ scale: 0.95 }}            className="text-4xl font-black text-gray-900 mb-2"                ? "bg-green-500/90 text-white"                 className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"

                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"

                  >          >

                    Add Your First Screen

                  </motion.button>            {typeof value === 'number' ? value.toLocaleString() : value}                : "bg-gray-500/90 text-white"              >

                </motion.div>

              )}          </motion.p>

            </motion.div>

          )}          <p className="text-sm font-medium text-gray-500">{subtitle}</p>            }`}>                <div className="flex items-center space-x-1 text-white text-xs">



          {(activeTab === "bookings" || activeTab === "analytics" || activeTab === "settings") && (        </div>

            <motion.div

              key={activeTab}              {screen.is_active ? "🔴 LIVE" : "⚫ OFFLINE"}                  <Clock className="w-3 h-3" />

              initial={{ opacity: 0, y: 40 }}

              animate={{ opacity: 1, y: 0 }}        <div className="mt-6">

              exit={{ opacity: 0, y: -40 }}

              transition={{ duration: 0.6 }}          <div className="w-full bg-gray-200 rounded-full h-2">            </span>                  <span>24/7</span>

              className="space-y-8"

            >            <motion.div

              <div className="text-center py-16">

                <h2 className="text-4xl font-black text-gray-900 mb-4">              initial={{ width: 0 }}                            </div>

                  {activeTab === "bookings" && "📅 Booking Management"}

                  {activeTab === "analytics" && "📊 Analytics Dashboard"}              animate={{ width: `${Math.min(Math.abs(change.value), 100)}%` }}

                  {activeTab === "settings" && "⚙️ Settings"}

                </h2>              transition={{ duration: 1.5, delay: delay + 0.5 }}            {screen.is_active && (              </motion.div>

                <p className="text-xl text-gray-600">Coming soon with amazing features!</p>

              </div>              className={`bg-gradient-to-r ${colors.bg} h-2 rounded-full`}

            </motion.div>

          )}            />              <motion.div            )}

        </AnimatePresence>

      </div>          </div>

    </div>

  );        </div>                animate={{ opacity: [0.5, 1, 0.5] }}          </motion.div>

};

      </div>

export default AdminDashboard;
    </motion.div>                transition={{ duration: 2, repeat: Infinity }}

  );

};                className="bg-white/20 backdrop-blur-sm px-2 py-1 rounded-full"          <div className="flex items-center space-x-2">



// Loading Component              >            <motion.button

const LoadingSpinner: React.FC = () => (

  <motion.div                <div className="flex items-center space-x-1 text-white text-xs">              whileHover={{ scale: 1.2 }}

    initial={{ opacity: 0 }}

    animate={{ opacity: 1 }}                  <Clock className="w-3 h-3" />              whileTap={{ scale: 0.9 }}

    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"

  >                  <span>24/7</span>              onClick={() => setIsFavorite(!isFavorite)}

    <div className="text-center">

      <motion.div className="relative mb-8">                </div>              className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30"

        <motion.div

          className="w-24 h-24 border-4 border-blue-200 rounded-full"              </motion.div>            >

          animate={{ rotate: 360 }}

          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}            )}              <Heart className={`w-5 h-5 ${isFavorite ? "text-red-400 fill-red-400" : "text-white"}`} />

        />

        <motion.div          </motion.div>            </motion.button>

          className="absolute inset-0 w-24 h-24 border-4 border-purple-300 rounded-full border-t-purple-600"

          animate={{ rotate: -360 }}          </div>

          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}

        />          <div className="flex items-center space-x-2">        </div>

        <motion.div

          className="absolute inset-2 w-20 h-20 border-4 border-pink-300 rounded-full border-r-pink-600"            <motion.button

          animate={{ rotate: 360 }}

          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}              whileHover={{ scale: 1.2 }}        {/* Action Buttons on Hover */}

        />

                      whileTap={{ scale: 0.9 }}        <motion.div

        <motion.div

          className="absolute inset-0 flex items-center justify-center"              onClick={() => setIsFavorite(!isFavorite)}          initial={{ opacity: 0, y: 20 }}

          animate={{ scale: [1, 1.1, 1] }}

          transition={{ duration: 2, repeat: Infinity }}              className="p-2 bg-white/20 backdrop-blur-sm rounded-full shadow-lg border border-white/30"          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}

        >

          <Shield className="w-8 h-8 text-blue-600" />            >          className="absolute bottom-4 right-4 flex space-x-2"

        </motion.div>

      </motion.div>              <Heart className={`w-5 h-5 ${isFavorite ? "text-red-400 fill-red-400" : "text-white"}`} />        >

      

      <motion.div            </motion.button>          <motion.button

        initial={{ opacity: 0, y: 20 }}

        animate={{ opacity: 1, y: 0 }}          </div>            whileHover={{ scale: 1.1 }}

        transition={{ delay: 0.3 }}

      >        </div>            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"

        <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Loading Dashboard</h3>

        <div className="flex items-center justify-center space-x-2">          >

          {[...Array(4)].map((_, i) => (

            <motion.div        {/* Action Buttons on Hover */}            <Maximize className="w-5 h-5" />

              key={i}

              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"        <motion.div          </motion.button>

              animate={{ y: [0, -15, 0] }}

              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}          initial={{ opacity: 0, y: 20 }}          <motion.button

            />

          ))}          animate={{ opacity: isHovered ? 1 : 0, y: isHovered ? 0 : 20 }}            whileHover={{ scale: 1.1 }}

        </div>

      </motion.div>          className="absolute bottom-4 right-4 flex space-x-2"            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"

    </div>

  </motion.div>        >          >

);

          <motion.button            <Share2 className="w-5 h-5" />

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");            whileHover={{ scale: 1.1 }}          </motion.button>

  const [viewMode, setViewMode] = useState<ViewMode>("grid");

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"          <motion.button

  const [screens, setScreens] = useState<AdminScreen[]>([]);

  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);          >            whileHover={{ scale: 1.1 }}

  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);

  const [loading, setLoading] = useState(true);            <Maximize className="w-5 h-5" />            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"

  const [error, setError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);          </motion.button>          >

  const [searchQuery, setSearchQuery] = useState("");

          <motion.button            <Download className="w-5 h-5" />

  const fetchDashboardData = async () => {

    try {            whileHover={{ scale: 1.1 }}          </motion.button>

      setError(null);

      const [statsData, screensData, bookingsData, revenueData] = await Promise.all([            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"        </motion.div>

        adminService.getDashboardStats(),

        adminService.getAllScreens(),          >

        adminService.getAllBookingRequests(),

        adminService.getRevenueAnalytics(),            <Share2 className="w-5 h-5" />        {/* Performance Indicator */}

      ]);

          </motion.button>        <div className="absolute bottom-4 left-4">

      setDashboardStats(statsData);

      setScreens(screensData);          <motion.button          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">

      setBookings(bookingsData);

      setRevenue(revenueData);            whileHover={{ scale: 1.1 }}            <div className="flex items-center space-x-2 text-white text-sm">

    } catch (err) {

      console.error("Failed to fetch dashboard data:", err);            className="p-3 bg-white/20 backdrop-blur-sm rounded-full shadow-lg text-white border border-white/30"              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />

      setError("Failed to load dashboard data. Please try again.");

    } finally {          >              <span>High Performance</span>

      setLoading(false);

      setRefreshing(false);            <Download className="w-5 h-5" />            </div>

    }

  };          </motion.button>          </div>



  useEffect(() => {        </motion.div>        </div>

    fetchDashboardData();

  }, []);      </div>



  const handleRefresh = async () => {        {/* Performance Indicator */}

    setRefreshing(true);

    await fetchDashboardData();        <div className="absolute bottom-4 left-4">      {/* Content Section */}

  };

          <div className="bg-white/20 backdrop-blur-sm rounded-full px-3 py-1 border border-white/30">      <div className="p-6">

  if (loading) {

    return <LoadingSpinner />;            <div className="flex items-center space-x-2 text-white text-sm">        <div className="flex items-start justify-between mb-4">

  }

              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />          <div>

  if (error) {

    return (              <span>High Performance</span>            <h3 className="text-xl font-bold text-gray-900 mb-2">{screen.screen_name || `Screen ${screen.id}`}</h3>

      <motion.div

        initial={{ opacity: 0, scale: 0.9 }}            </div>            <div className="flex items-center space-x-4 text-sm text-gray-500">

        animate={{ opacity: 1, scale: 1 }}

        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"          </div>              <div className="flex items-center space-x-1">

      >

        <motion.div        </div>                <MapPin className="w-4 h-4" />

          className="text-center p-10 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md mx-4"

          whileHover={{ scale: 1.02 }}      </div>                <span>{screen.city || 'Unknown City'}</span>

        >

          <motion.div              </div>

            initial={{ scale: 0, rotate: -180 }}

            animate={{ scale: 1, rotate: 0 }}      {/* Content Section */}              <div className="flex items-center space-x-1">

            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}

            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"      <div className="p-6">                <Monitor className="w-4 h-4" />

          >

            <AlertTriangle className="w-10 h-10 text-red-600" />        <div className="flex items-start justify-between mb-4">                <span>{screen.size_info || 'Standard'}</span>

          </motion.div>

                    <div>              </div>

          <h3 className="text-2xl font-bold text-gray-900 mb-4">

            🚨 Something went wrong            <h3 className="text-xl font-bold text-gray-900 mb-2">{screen.screen_name || `Screen ${screen.id}`}</h3>            </div>

          </h3>

                      <div className="flex items-center space-x-4 text-sm text-gray-500">          </div>

          <p className="text-gray-600 mb-8">{error}</p>

                        <div className="flex items-center space-x-1">          

          <motion.button

            onClick={() => {                <MapPin className="w-4 h-4" />          <div className="flex items-center space-x-1">

              setError(null);

              setLoading(true);                <span>{screen.city || 'Unknown City'}</span>            {[...Array(5)].map((_, i) => (

              fetchDashboardData();

            }}              </div>              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />

            whileHover={{ scale: 1.05 }}

            whileTap={{ scale: 0.95 }}              <div className="flex items-center space-x-1">            ))}

            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"

          >                <Monitor className="w-4 h-4" />            <span className="text-sm text-gray-500 ml-2">{rating}</span>

            🔄 Try Again

          </motion.button>                <span>{sizeInfo}</span>          </div>

        </motion.div>

      </motion.div>              </div>        </div>

    );

  }            </div>



  const filteredScreens = screens.filter(screen =>          </div>        {/* Stats Row */}

    (screen.screen_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||

    (screen.city || '').toLowerCase().includes(searchQuery.toLowerCase())                  <div className="grid grid-cols-3 gap-4 mb-6">

  );

          <div className="flex items-center space-x-1">          <div className="text-center p-3 bg-blue-50 rounded-2xl">

  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">            {[...Array(5)].map((_, i) => (            <p className="text-xs text-blue-600 font-semibold">VIEWS</p>

      {/* Modern Header */}

      <motion.header              <Star key={i} className={`w-4 h-4 ${i < Math.floor(rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}`} />            <p className="text-lg font-bold text-blue-700">{(views / 1000).toFixed(1)}K</p>

        initial={{ opacity: 0, y: -50 }}

        animate={{ opacity: 1, y: 0 }}            ))}          </div>

        transition={{ duration: 0.8, type: "spring" }}

        className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-xl"            <span className="text-sm text-gray-500 ml-2">{rating}</span>          <div className="text-center p-3 bg-green-50 rounded-2xl">

      >

        <div className="max-w-7xl mx-auto px-6">          </div>            <p className="text-xs text-green-600 font-semibold">CLICKS</p>

          <div className="flex items-center justify-between h-24">

            {/* Logo Section */}        </div>            <p className="text-lg font-bold text-green-700">{clicks}</p>

            <motion.div 

              className="flex items-center space-x-4"          </div>

              initial={{ opacity: 0, x: -30 }}

              animate={{ opacity: 1, x: 0 }}        {/* Stats Row */}          <div className="text-center p-3 bg-purple-50 rounded-2xl">

              transition={{ delay: 0.2 }}

            >        <div className="grid grid-cols-3 gap-4 mb-6">            <p className="text-xs text-purple-600 font-semibold">CTR</p>

              <motion.div

                className="p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl"          <div className="text-center p-3 bg-blue-50 rounded-2xl">            <p className="text-lg font-bold text-purple-700">{ctr.toFixed(1)}%</p>

                whileHover={{ 

                  scale: 1.1,             <p className="text-xs text-blue-600 font-semibold">VIEWS</p>          </div>

                  rotate: 360,

                  boxShadow: "0 25px 50px rgba(0,0,0,0.25)"            <p className="text-lg font-bold text-blue-700">{(views / 1000).toFixed(1)}K</p>        </div>

                }}

                transition={{ duration: 0.6 }}          </div>

              >

                <Shield className="w-10 h-10 text-white" />          <div className="text-center p-3 bg-green-50 rounded-2xl">        <div className="flex items-center justify-between mb-6">

              </motion.div>

              <div>            <p className="text-xs text-green-600 font-semibold">CLICKS</p>          <div>

                <motion.h1 

                  className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"            <p className="text-lg font-bold text-green-700">{clicks}</p>            <p className="text-sm text-gray-500">Daily Rate</p>

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}          </div>            <span className="text-3xl font-black text-gray-900">

                  transition={{ delay: 0.4 }}

                >          <div className="text-center p-3 bg-purple-50 rounded-2xl">              ₹{screen.price_per_day || 0}

                  Admin Dashboard

                </motion.h1>            <p className="text-xs text-purple-600 font-semibold">CTR</p>              <span className="text-sm font-normal text-gray-500">/day</span>

                <motion.p 

                  className="text-sm font-semibold text-gray-600"            <p className="text-lg font-bold text-purple-700">{ctr.toFixed(1)}%</p>            </span>

                  initial={{ opacity: 0 }}

                  animate={{ opacity: 1 }}          </div>          </div>

                  transition={{ delay: 0.5 }}

                >        </div>          

                  🎯 Digital Signage Control Center

                </motion.p>          <div className="text-right">

              </div>

            </motion.div>        <div className="flex items-center justify-between mb-6">            <p className="text-sm text-gray-500">Utilization</p>



            {/* Search Bar */}          <div>            <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">

            <motion.div

              initial={{ opacity: 0, y: -20 }}            <p className="text-sm text-gray-500">Daily Rate</p>              <motion.div

              animate={{ opacity: 1, y: 0 }}

              transition={{ delay: 0.3 }}            <span className="text-3xl font-black text-gray-900">                initial={{ width: 0 }}

              className="hidden md:flex items-center space-x-4"

            >              ₹{pricePerDay}                animate={{ width: "78%" }}

              <div className="relative">

                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />              <span className="text-sm font-normal text-gray-500">/day</span>                transition={{ duration: 1.5, delay: index * 0.1 }}

                <input

                  type="text"            </span>                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"

                  placeholder="Search screens, locations..."

                  value={searchQuery}          </div>              />

                  onChange={(e) => setSearchQuery(e.target.value)}

                  className="pl-12 pr-6 py-3 w-80 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"                      </div>

                />

              </div>          <div className="text-right">            <span className="text-xs text-gray-600 mt-1">78%</span>

            </motion.div>

            <p className="text-sm text-gray-500">Utilization</p>          </div>

            {/* Action Buttons */}

            <motion.div             <div className="w-16 h-2 bg-gray-200 rounded-full mt-1">        </div>

              className="flex items-center space-x-4"

              initial={{ opacity: 0, x: 30 }}              <motion.div

              animate={{ opacity: 1, x: 0 }}

              transition={{ delay: 0.3 }}                initial={{ width: 0 }}        {/* Action Buttons */}

            >

              <motion.button                animate={{ width: "78%" }}        <div className="flex space-x-3">

                onClick={handleRefresh}

                disabled={refreshing}                transition={{ duration: 1.5, delay: index * 0.1 }}          <motion.button

                whileHover={{ scale: 1.1, rotate: 180 }}

                whileTap={{ scale: 0.95 }}                className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"            whileHover={{ scale: 1.05 }}

                className="p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-lg"

              >              />            whileTap={{ scale: 0.95 }}

                <RefreshCw className={`w-6 h-6 ${refreshing ? "animate-spin" : ""}`} />

              </motion.button>            </div>            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"



              <motion.button            <span className="text-xs text-gray-600 mt-1">78%</span>          >

                whileHover={{ scale: 1.1 }}

                whileTap={{ scale: 0.95 }}          </div>            📊 View Analytics

                className="p-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all relative shadow-lg"

              >        </div>          </motion.button>

                <Bell className="w-6 h-6" />

                <motion.div          <motion.button

                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"

                  animate={{ scale: [1, 1.2, 1] }}        {/* Action Buttons */}            whileHover={{ scale: 1.05 }}

                  transition={{ duration: 2, repeat: Infinity }}

                >        <div className="flex space-x-3">            whileTap={{ scale: 0.95 }}

                  <span className="text-xs text-white font-bold">3</span>

                </motion.div>          <motion.button            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"

              </motion.button>

            whileHover={{ scale: 1.05 }}          >

              <motion.button

                onClick={onLogout}            whileTap={{ scale: 0.95 }}            ⚙️ Manage

                whileHover={{ scale: 1.05 }}

                whileTap={{ scale: 0.95 }}            className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"          </motion.button>

                className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"

              >          >        </div>

                <LogOut className="w-5 h-5" />

                <span>Logout</span>            📊 View Analytics      </div>

              </motion.button>

            </div>          </motion.button>

          </div>

          <motion.button      {/* Glow Effect */}

          {/* Navigation Tabs */}

          <motion.div             whileHover={{ scale: 1.05 }}      <motion.div

            className="border-t border-gray-200/50 -mb-px"

            initial={{ opacity: 0, y: 20 }}            whileTap={{ scale: 0.95 }}        initial={{ opacity: 0 }}

            animate={{ opacity: 1, y: 0 }}

            transition={{ delay: 0.4 }}            className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 text-white py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all text-center"        animate={{ opacity: isHovered ? 0.3 : 0 }}

          >

            <nav className="flex space-x-2 py-6 overflow-x-auto">          >        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl -z-10"

              {[

                { id: "dashboard", label: "🏠 Dashboard", icon: BarChart3 },            ⚙️ Manage      />

                { id: "screens", label: "📺 Screens", icon: Monitor },

                { id: "bookings", label: "📅 Bookings", icon: Calendar },          </motion.button>    </motion.div>

                { id: "analytics", label: "📊 Analytics", icon: TrendingUp },

                { id: "settings", label: "⚙️ Settings", icon: Settings },        </div>  );

              ].map((tab, index) => (

                <motion.button      </div>};

                  key={tab.id}

                  onClick={() => setActiveTab(tab.id as ActiveTab)}

                  whileHover={{ scale: 1.05, y: -2 }}

                  whileTap={{ scale: 0.95 }}      {/* Glow Effect */}// Dashboard Stats Widget

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}      <motion.divconst DashboardWidget: React.FC<{

                  transition={{ delay: 0.5 + index * 0.1 }}

                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all text-sm relative overflow-hidden min-w-max ${        initial={{ opacity: 0 }}  icon: React.ComponentType<any>;

                    activeTab === tab.id

                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl"        animate={{ opacity: isHovered ? 0.3 : 0 }}  title: string;

                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70 shadow-lg"

                  }`}        className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 rounded-3xl blur-xl -z-10"  value: string | number;

                >

                  <tab.icon className="w-5 h-5" />      />  subtitle: string;

                  <span>{tab.label}</span>

                </motion.button>    </motion.div>  change: { value: number; isPositive: boolean };

              ))}

            </nav>  );  color: string;

          </motion.div>

        </div>};  delay: number;

      </motion.header>

}> = ({ icon: Icon, title, value, subtitle, change, color, delay }) => {

      {/* Main Content */}

      <div className="max-w-7xl mx-auto px-6 py-8">// Dashboard Stats Widget  const colorClasses = {

        <AnimatePresence mode="wait">

          {/* Dashboard Tab */}const DashboardWidget: React.FC<{    blue: {

          {activeTab === "dashboard" && (

            <motion.div  icon: React.ComponentType<any>;      bg: "from-blue-500 to-cyan-500",

              key="dashboard"

              initial={{ opacity: 0, y: 40 }}  title: string;      text: "text-blue-700",

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0, y: -40 }}  value: string | number;      light: "bg-blue-50"

              transition={{ duration: 0.6 }}

              className="space-y-8"  subtitle: string;    },

            >

              <motion.div  change: { value: number; isPositive: boolean };    green: {

                initial={{ opacity: 0, y: 30 }}

                animate={{ opacity: 1, y: 0 }}  color: string;      bg: "from-green-500 to-emerald-500", 

                transition={{ delay: 0.2 }}

              >  delay: number;      text: "text-green-700",

                <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">

                  📊 Dashboard Overview}> = ({ icon: Icon, title, value, subtitle, change, color, delay }) => {      light: "bg-green-50"

                </h2>

                  const colorClasses = {    },

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

                  <DashboardWidget    blue: {    purple: {

                    icon={Monitor}

                    title="Total Screens"      bg: "from-blue-500 to-cyan-500",      bg: "from-purple-500 to-pink-500",

                    value={dashboardStats?.screens?.total_screens || 0}

                    subtitle="Digital displays active"      text: "text-blue-700",      text: "text-purple-700", 

                    color="blue"

                    delay={0.1}      light: "bg-blue-50"      light: "bg-purple-50"

                    change={{ value: 12, isPositive: true }}

                  />    },    },

                  <DashboardWidget

                    icon={Activity}    green: {    orange: {

                    title="Active Now"

                    value={dashboardStats?.screens?.active_screens || 0}      bg: "from-green-500 to-emerald-500",       bg: "from-orange-500 to-yellow-500",

                    subtitle="Currently broadcasting"

                    color="green"      text: "text-green-700",      text: "text-orange-700",

                    delay={0.2}

                    change={{ value: 8, isPositive: true }}      light: "bg-green-50"      light: "bg-orange-50"

                  />

                  <DashboardWidget    },    },

                    icon={Calendar}

                    title="Bookings"    purple: {  };

                    value={dashboardStats?.bookingRequests?.total_requests || 0}

                    subtitle="Campaign requests"      bg: "from-purple-500 to-pink-500",

                    color="purple"

                    delay={0.3}      text: "text-purple-700",   const colors = colorClasses[color as keyof typeof colorClasses];

                    change={{ value: 3, isPositive: false }}

                  />      light: "bg-purple-50"

                  <DashboardWidget

                    icon={DollarSign}    },  return (

                    title="Revenue"

                    value={`₹${(revenue?.totalRevenue || 0).toLocaleString()}`}    orange: {    <motion.div

                    subtitle="Monthly earnings"

                    color="orange"      bg: "from-orange-500 to-yellow-500",      initial={{ opacity: 0, y: 30, scale: 0.9 }}

                    delay={0.4}

                    change={{ value: 24, isPositive: true }}      text: "text-orange-700",      animate={{ opacity: 1, y: 0, scale: 1 }}

                  />

                </div>      light: "bg-orange-50"      transition={{ delay, type: "spring", stiffness: 150 }}

              </motion.div>

    },      whileHover={{ y: -8, scale: 1.03 }}

              {/* Quick Actions & Recent Activity */}

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">  };      className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden group cursor-pointer"

                {/* Quick Actions */}

                <motion.div    >

                  initial={{ opacity: 0, x: -40 }}

                  animate={{ opacity: 1, x: 0 }}  const colors = colorClasses[color as keyof typeof colorClasses];      {/* Background Gradient */}

                  transition={{ delay: 0.6 }}

                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />

                >

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">  return (      

                    ⚡ Quick Actions

                  </h3>    <motion.div      {/* Decorative Elements */}

                  <div className="grid grid-cols-2 gap-4">

                    {[      initial={{ opacity: 0, y: 30, scale: 0.9 }}      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full" />

                      { icon: Plus, label: "Add Screen", color: "from-blue-500 to-cyan-500" },

                      { icon: Upload, label: "Upload Media", color: "from-green-500 to-emerald-500" },      animate={{ opacity: 1, y: 0, scale: 1 }}      <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-gradient-to-tr from-gray-100/50 to-gray-50/30 rounded-full" />

                      { icon: Settings, label: "Settings", color: "from-purple-500 to-pink-500" },

                      { icon: BarChart3, label: "Reports", color: "from-orange-500 to-yellow-500" },      transition={{ delay, type: "spring", stiffness: 150 }}      

                    ].map((action, index) => (

                      <motion.button      whileHover={{ y: -8, scale: 1.03 }}      <div className="relative z-10">

                        key={action.label}

                        whileHover={{ scale: 1.05, y: -5 }}      className="bg-white rounded-3xl p-8 shadow-2xl border border-gray-100 relative overflow-hidden group cursor-pointer"        <div className="flex items-start justify-between mb-6">

                        whileTap={{ scale: 0.95 }}

                        initial={{ opacity: 0, y: 20 }}    >          <motion.div

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ delay: 0.7 + index * 0.1 }}      {/* Background Gradient */}            whileHover={{ rotate: 15, scale: 1.1 }}

                        className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center`}

                      >      <div className={`absolute inset-0 bg-gradient-to-br ${colors.bg} opacity-5 group-hover:opacity-10 transition-opacity duration-300`} />            className={`p-5 bg-gradient-to-br ${colors.bg} rounded-3xl shadow-lg`}

                        <action.icon className="w-8 h-8 mx-auto mb-2" />

                        <span className="font-semibold">{action.label}</span>                >

                      </motion.button>

                    ))}      {/* Decorative Elements */}            <Icon className="w-8 h-8 text-white" />

                  </div>

                </motion.div>      <div className="absolute -top-10 -right-10 w-20 h-20 bg-gradient-to-br from-white/20 to-white/10 rounded-full" />          </motion.div>



                {/* Recent Activity */}      <div className="absolute -bottom-5 -left-5 w-15 h-15 bg-gradient-to-tr from-gray-100/50 to-gray-50/30 rounded-full" />          

                <motion.div

                  initial={{ opacity: 0, x: 40 }}                <motion.div

                  animate={{ opacity: 1, x: 0 }}

                  transition={{ delay: 0.6 }}      <div className="relative z-10">            initial={{ opacity: 0, x: 20 }}

                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"

                >        <div className="flex items-start justify-between mb-6">            animate={{ opacity: 1, x: 0 }}

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">

                    🔥 Recent Activity          <motion.div            transition={{ delay: delay + 0.2 }}

                  </h3>

                  <div className="space-y-4">            whileHover={{ rotate: 15, scale: 1.1 }}            className={`flex items-center space-x-2 text-sm font-bold px-4 py-2 rounded-full ${

                    {screens.slice(0, 4).map((screen, index) => (

                      <motion.div            className={`p-5 bg-gradient-to-br ${colors.bg} rounded-3xl shadow-lg`}              change.isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"

                        key={screen.id}

                        initial={{ opacity: 0, x: 20 }}          >            }`}

                        animate={{ opacity: 1, x: 0 }}

                        transition={{ delay: 0.8 + index * 0.1 }}            <Icon className="w-8 h-8 text-white" />          >

                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"

                      >          </motion.div>            {change.isPositive ? (

                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">

                          <Monitor className="w-6 h-6 text-white" />                        <ArrowUp className="w-4 h-4" />

                        </div>

                        <div className="flex-1">          <motion.div            ) : (

                          <p className="font-semibold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</p>

                          <p className="text-sm text-gray-500">{screen.city || 'Unknown City'} • Just now</p>            initial={{ opacity: 0, x: 20 }}              <ArrowDown className="w-4 h-4" />

                        </div>

                        <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />            animate={{ opacity: 1, x: 0 }}            )}

                      </motion.div>

                    ))}            transition={{ delay: delay + 0.2 }}            <span>{change.value}%</span>

                  </div>

                </motion.div>            className={`flex items-center space-x-2 text-sm font-bold px-4 py-2 rounded-full ${          </motion.div>

              </div>

            </motion.div>              change.isPositive ? "text-green-700 bg-green-100" : "text-red-700 bg-red-100"        </div>

          )}

            }`}

          {/* Screens Tab */}

          {activeTab === "screens" && (          >        <div>

            <motion.div

              key="screens"            {change.isPositive ? (          <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">{title}</p>

              initial={{ opacity: 0, y: 40 }}

              animate={{ opacity: 1, y: 0 }}              <ArrowUp className="w-4 h-4" />          <motion.p

              exit={{ opacity: 0, y: -40 }}

              transition={{ duration: 0.6 }}            ) : (            initial={{ opacity: 0, scale: 0.8 }}

              className="space-y-8"

            >              <ArrowDown className="w-4 h-4" />            animate={{ opacity: 1, scale: 1 }}

              {/* Header */}

              <div className="flex items-center justify-between">            )}            transition={{ delay: delay + 0.3 }}

                <div>

                  <h2 className="text-4xl font-black text-gray-900 mb-2">            <span>{change.value}%</span>            className="text-4xl font-black text-gray-900 mb-2"

                    📺 Screen Management

                  </h2>          </motion.div>          >

                  <p className="text-lg text-gray-600">Manage your digital displays with style</p>

                </div>        </div>            {typeof value === 'number' ? value.toLocaleString() : value}

                

                <div className="flex items-center space-x-4">          </motion.p>

                  {/* View Mode Toggle */}

                  <div className="flex bg-white rounded-2xl shadow-lg border border-gray-200 p-2">        <div>          <p className="text-sm font-medium text-gray-500">{subtitle}</p>

                    <motion.button

                      whileHover={{ scale: 1.05 }}          <p className="text-sm font-bold text-gray-600 mb-2 uppercase tracking-wider">{title}</p>        </div>

                      whileTap={{ scale: 0.95 }}

                      onClick={() => setViewMode("grid")}          <motion.p

                      className={`p-3 rounded-xl transition-all ${

                        viewMode === "grid"             initial={{ opacity: 0, scale: 0.8 }}        {/* Mini Progress Bar */}

                          ? "bg-blue-500 text-white shadow-lg" 

                          : "text-gray-600 hover:bg-gray-100"            animate={{ opacity: 1, scale: 1 }}        <div className="mt-6">

                      }`}

                    >            transition={{ delay: delay + 0.3 }}          <div className="w-full bg-gray-200 rounded-full h-2">

                      <Grid3X3 className="w-5 h-5" />

                    </motion.button>            className="text-4xl font-black text-gray-900 mb-2"            <motion.div

                    <motion.button

                      whileHover={{ scale: 1.05 }}          >              initial={{ width: 0 }}

                      whileTap={{ scale: 0.95 }}

                      onClick={() => setViewMode("list")}            {typeof value === 'number' ? value.toLocaleString() : value}              animate={{ width: `${Math.min(Math.abs(change.value), 100)}%` }}

                      className={`p-3 rounded-xl transition-all ${

                        viewMode === "list"           </motion.p>              transition={{ duration: 1.5, delay: delay + 0.5 }}

                          ? "bg-blue-500 text-white shadow-lg" 

                          : "text-gray-600 hover:bg-gray-100"          <p className="text-sm font-medium text-gray-500">{subtitle}</p>              className={`bg-gradient-to-r ${colors.bg} h-2 rounded-full`}

                      }`}

                    >        </div>            />

                      <List className="w-5 h-5" />

                    </motion.button>          </div>

                  </div>

        {/* Mini Progress Bar */}        </div>

                  {/* Filter & Sort */}

                  <motion.button        <div className="mt-6">      </div>

                    whileHover={{ scale: 1.05 }}

                    whileTap={{ scale: 0.95 }}          <div className="w-full bg-gray-200 rounded-full h-2">    </motion.div>

                    className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50"

                  >            <motion.div  );

                    <Filter className="w-5 h-5" />

                    <span>Filter</span>              initial={{ width: 0 }}};

                  </motion.button>

              animate={{ width: `${Math.min(Math.abs(change.value), 100)}%` }}

                  <motion.button

                    whileHover={{ scale: 1.05 }}              transition={{ duration: 1.5, delay: delay + 0.5 }}// Loading Component

                    whileTap={{ scale: 0.95 }}

                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"              className={`bg-gradient-to-r ${colors.bg} h-2 rounded-full`}const LoadingSpinner: React.FC = () => (

                  >

                    <Plus className="w-6 h-6" />            />  <motion.div

                    <span>Add New Screen</span>

                  </motion.button>          </div>    initial={{ opacity: 0 }}

                </div>

              </div>        </div>    animate={{ opacity: 1 }}



              {/* Screens Grid/List */}      </div>    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"

              <motion.div

                initial={{ opacity: 0, y: 30 }}    </motion.div>  >

                animate={{ opacity: 1, y: 0 }}

                transition={{ delay: 0.2 }}  );    <div className="text-center">

                className={`${

                  viewMode === "grid" };      <motion.div className="relative mb-8">

                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 

                    : "space-y-4"        <motion.div

                }`}

              >// Loading Component          className="w-24 h-24 border-4 border-blue-200 rounded-full"

                {filteredScreens.map((screen, index) => (

                  <ScreenCardconst LoadingSpinner: React.FC = () => (          animate={{ rotate: 360 }}

                    key={screen.id}

                    screen={screen as EnhancedScreen}  <motion.div          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}

                    index={index}

                    viewMode={viewMode}    initial={{ opacity: 0 }}        />

                  />

                ))}    animate={{ opacity: 1 }}        <motion.div

              </motion.div>

    className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50"          className="absolute inset-0 w-24 h-24 border-4 border-purple-300 rounded-full border-t-purple-600"

              {filteredScreens.length === 0 && (

                <motion.div  >          animate={{ rotate: -360 }}

                  initial={{ opacity: 0, y: 20 }}

                  animate={{ opacity: 1, y: 0 }}    <div className="text-center">          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}

                  className="text-center py-16"

                >      <motion.div className="relative mb-8">        />

                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">

                    <Monitor className="w-16 h-16 text-gray-400" />        <motion.div        <motion.div

                  </div>

                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No screens found</h3>          className="w-24 h-24 border-4 border-blue-200 rounded-full"          className="absolute inset-2 w-20 h-20 border-4 border-pink-300 rounded-full border-r-pink-600"

                  <p className="text-gray-500 mb-8">Try adjusting your search or add a new screen</p>

                  <motion.button          animate={{ rotate: 360 }}          animate={{ rotate: 360 }}

                    whileHover={{ scale: 1.05 }}

                    whileTap={{ scale: 0.95 }}          transition={{ duration: 2, repeat: Infinity, ease: "linear" }}          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}

                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"

                  >        />        />

                    Add Your First Screen

                  </motion.button>        <motion.div        

                </motion.div>

              )}          className="absolute inset-0 w-24 h-24 border-4 border-purple-300 rounded-full border-t-purple-600"        <motion.div

            </motion.div>

          )}          animate={{ rotate: -360 }}          className="absolute inset-0 flex items-center justify-center"



          {/* Other tabs with placeholder content */}          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}          animate={{ scale: [1, 1.1, 1] }}

          {(activeTab === "bookings" || activeTab === "analytics" || activeTab === "settings") && (

            <motion.div        />          transition={{ duration: 2, repeat: Infinity }}

              key={activeTab}

              initial={{ opacity: 0, y: 40 }}        <motion.div        >

              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0, y: -40 }}          className="absolute inset-2 w-20 h-20 border-4 border-pink-300 rounded-full border-r-pink-600"          <Shield className="w-8 h-8 text-blue-600" />

              transition={{ duration: 0.6 }}

              className="space-y-8"          animate={{ rotate: 360 }}        </motion.div>

            >

              <div className="text-center py-16">          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}      </motion.div>

                <h2 className="text-4xl font-black text-gray-900 mb-4">

                  {activeTab === "bookings" && "📅 Booking Management"}        />      

                  {activeTab === "analytics" && "📊 Analytics Dashboard"}

                  {activeTab === "settings" && "⚙️ Settings"}              <motion.div

                </h2>

                <p className="text-xl text-gray-600">Coming soon with amazing features!</p>        <motion.div        initial={{ opacity: 0, y: 20 }}

              </div>

            </motion.div>          className="absolute inset-0 flex items-center justify-center"        animate={{ opacity: 1, y: 0 }}

          )}

        </AnimatePresence>          animate={{ scale: [1, 1.1, 1] }}        transition={{ delay: 0.3 }}

      </div>

    </div>          transition={{ duration: 2, repeat: Infinity }}      >

  );

};        >        <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Loading Dashboard</h3>



export default AdminDashboard;          <Shield className="w-8 h-8 text-blue-600" />        <div className="flex items-center justify-center space-x-2">

        </motion.div>          {[...Array(4)].map((_, i) => (

      </motion.div>            <motion.div

                    key={i}

      <motion.div              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"

        initial={{ opacity: 0, y: 20 }}              animate={{ y: [0, -15, 0] }}

        animate={{ opacity: 1, y: 0 }}              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}

        transition={{ delay: 0.3 }}            />

      >          ))}

        <h3 className="text-2xl font-bold text-gray-800 mb-4">🚀 Loading Dashboard</h3>        </div>

        <div className="flex items-center justify-center space-x-2">      </motion.div>

          {[...Array(4)].map((_, i) => (    </div>

            <motion.div  </motion.div>

              key={i});

              className="w-3 h-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full"

              animate={{ y: [0, -15, 0] }}const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {

              transition={{ duration: 0.8, repeat: Infinity, delay: i * 0.2 }}  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

            />  const [viewMode, setViewMode] = useState<ViewMode>("grid");

          ))}  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);

        </div>  const [screens, setScreens] = useState<AdminScreen[]>([]);

      </motion.div>  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);

    </div>  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);

  </motion.div>  const [loading, setLoading] = useState(true);

);  const [error, setError] = useState<string | null>(null);

  const [refreshing, setRefreshing] = useState(false);

const AdminDashboard: React.FC<AdminDashboardProps> = ({ onLogout }) => {  const [searchQuery, setSearchQuery] = useState("");

  const [activeTab, setActiveTab] = useState<ActiveTab>("dashboard");

  const [viewMode, setViewMode] = useState<ViewMode>("grid");  const fetchDashboardData = async () => {

  const [dashboardStats, setDashboardStats] = useState<DashboardStats | null>(null);    try {

  const [screens, setScreens] = useState<AdminScreen[]>([]);      setError(null);

  const [bookings, setBookings] = useState<AdminBookingRequest[]>([]);      const [statsData, screensData, bookingsData, revenueData] = await Promise.all([

  const [revenue, setRevenue] = useState<RevenueAnalytics | null>(null);        adminService.getDashboardStats(),

  const [loading, setLoading] = useState(true);        adminService.getScreens(),

  const [error, setError] = useState<string | null>(null);        adminService.getBookingRequests(),

  const [refreshing, setRefreshing] = useState(false);        adminService.getRevenueAnalytics(),

  const [searchQuery, setSearchQuery] = useState("");      ]);



  const fetchDashboardData = async () => {      setDashboardStats(statsData);

    try {      setScreens(screensData);

      setError(null);      setBookings(bookingsData);

      const [statsData, screensData, bookingsData, revenueData] = await Promise.all([      setRevenue(revenueData);

        adminService.getDashboardStats(),    } catch (err) {

        adminService.getAllScreens(),      console.error("Failed to fetch dashboard data:", err);

        adminService.getAllBookingRequests(),      setError("Failed to load dashboard data. Please try again.");

        adminService.getRevenueAnalytics(),    } finally {

      ]);      setLoading(false);

      setRefreshing(false);

      setDashboardStats(statsData);    }

      setScreens(screensData);  };

      setBookings(bookingsData);

      setRevenue(revenueData);  useEffect(() => {

    } catch (err) {    fetchDashboardData();

      console.error("Failed to fetch dashboard data:", err);  }, []);

      setError("Failed to load dashboard data. Please try again.");

    } finally {  const handleRefresh = async () => {

      setLoading(false);    setRefreshing(true);

      setRefreshing(false);    await fetchDashboardData();

    }  };

  };

  if (loading) {

  useEffect(() => {    return <LoadingSpinner />;

    fetchDashboardData();  }

  }, []);

  if (error) {

  const handleRefresh = async () => {    return (

    setRefreshing(true);      <motion.div

    await fetchDashboardData();        initial={{ opacity: 0, scale: 0.9 }}

  };        animate={{ opacity: 1, scale: 1 }}

        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"

  if (loading) {      >

    return <LoadingSpinner />;        <motion.div

  }          className="text-center p-10 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md mx-4"

          whileHover={{ scale: 1.02 }}

  if (error) {        >

    return (          <motion.div

      <motion.div            initial={{ scale: 0, rotate: -180 }}

        initial={{ opacity: 0, scale: 0.9 }}            animate={{ scale: 1, rotate: 0 }}

        animate={{ opacity: 1, scale: 1 }}            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}

        className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50"            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"

      >          >

        <motion.div            <AlertTriangle className="w-10 h-10 text-red-600" />

          className="text-center p-10 bg-white rounded-3xl shadow-2xl border border-red-100 max-w-md mx-4"          </motion.div>

          whileHover={{ scale: 1.02 }}          

        >          <h3 className="text-2xl font-bold text-gray-900 mb-4">

          <motion.div            🚨 Something went wrong

            initial={{ scale: 0, rotate: -180 }}          </h3>

            animate={{ scale: 1, rotate: 0 }}          

            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}          <p className="text-gray-600 mb-8">{error}</p>

            className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6"          

          >          <motion.button

            <AlertTriangle className="w-10 h-10 text-red-600" />            onClick={() => {

          </motion.div>              setError(null);

                        setLoading(true);

          <h3 className="text-2xl font-bold text-gray-900 mb-4">              fetchDashboardData();

            🚨 Something went wrong            }}

          </h3>            whileHover={{ scale: 1.05 }}

                      whileTap={{ scale: 0.95 }}

          <p className="text-gray-600 mb-8">{error}</p>            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"

                    >

          <motion.button            🔄 Try Again

            onClick={() => {          </motion.button>

              setError(null);        </motion.div>

              setLoading(true);      </motion.div>

              fetchDashboardData();    );

            }}  }

            whileHover={{ scale: 1.05 }}

            whileTap={{ scale: 0.95 }}  const filteredScreens = screens.filter(screen =>

            className="bg-gradient-to-r from-red-500 to-orange-500 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-xl transition-all"    (screen.screen_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||

          >    (screen.city || '').toLowerCase().includes(searchQuery.toLowerCase())

            🔄 Try Again  );

          </motion.button>

        </motion.div>  return (

      </motion.div>    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">

    );      {/* Modern Header */}

  }      <motion.header

        initial={{ opacity: 0, y: -50 }}

  const filteredScreens = screens.filter(screen =>        animate={{ opacity: 1, y: 0 }}

    (screen.screen_name || '').toLowerCase().includes(searchQuery.toLowerCase()) ||        transition={{ duration: 0.8, type: "spring" }}

    (screen.city || '').toLowerCase().includes(searchQuery.toLowerCase())        className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-xl"

  );      >

        <div className="max-w-7xl mx-auto px-6">

  return (          <div className="flex items-center justify-between h-24">

    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">            {/* Logo Section */}

      {/* Modern Header */}            <motion.div 

      <motion.header              className="flex items-center space-x-4"

        initial={{ opacity: 0, y: -50 }}              initial={{ opacity: 0, x: -30 }}

        animate={{ opacity: 1, y: 0 }}              animate={{ opacity: 1, x: 0 }}

        transition={{ duration: 0.8, type: "spring" }}              transition={{ delay: 0.2 }}

        className="sticky top-0 z-50 backdrop-blur-xl bg-white/90 border-b border-white/20 shadow-xl"            >

      >              <motion.div

        <div className="max-w-7xl mx-auto px-6">                className="p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl"

          <div className="flex items-center justify-between h-24">                whileHover={{ 

            {/* Logo Section */}                  scale: 1.1, 

            <motion.div                   rotate: 360,

              className="flex items-center space-x-4"                  boxShadow: "0 25px 50px rgba(0,0,0,0.25)"

              initial={{ opacity: 0, x: -30 }}                }}

              animate={{ opacity: 1, x: 0 }}                transition={{ duration: 0.6 }}

              transition={{ delay: 0.2 }}              >

            >                <Shield className="w-10 h-10 text-white" />

              <motion.div              </motion.div>

                className="p-4 bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 rounded-3xl shadow-2xl"              <div>

                whileHover={{                 <motion.h1 

                  scale: 1.1,                   className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"

                  rotate: 360,                  initial={{ opacity: 0 }}

                  boxShadow: "0 25px 50px rgba(0,0,0,0.25)"                  animate={{ opacity: 1 }}

                }}                  transition={{ delay: 0.4 }}

                transition={{ duration: 0.6 }}                >

              >                  Admin Dashboard

                <Shield className="w-10 h-10 text-white" />                </motion.h1>

              </motion.div>                <motion.p 

              <div>                  className="text-sm font-semibold text-gray-600"

                <motion.h1                   initial={{ opacity: 0 }}

                  className="text-3xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent"                  animate={{ opacity: 1 }}

                  initial={{ opacity: 0 }}                  transition={{ delay: 0.5 }}

                  animate={{ opacity: 1 }}                >

                  transition={{ delay: 0.4 }}                  🎯 Digital Signage Control Center

                >                </motion.p>

                  Admin Dashboard              </div>

                </motion.h1>            </motion.div>

                <motion.p 

                  className="text-sm font-semibold text-gray-600"            {/* Search Bar */}

                  initial={{ opacity: 0 }}            <motion.div

                  animate={{ opacity: 1 }}              initial={{ opacity: 0, y: -20 }}

                  transition={{ delay: 0.5 }}              animate={{ opacity: 1, y: 0 }}

                >              transition={{ delay: 0.3 }}

                  🎯 Digital Signage Control Center              className="hidden md:flex items-center space-x-4"

                </motion.p>            >

              </div>              <div className="relative">

            </motion.div>                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input

            {/* Search Bar */}                  type="text"

            <motion.div                  placeholder="Search screens, locations..."

              initial={{ opacity: 0, y: -20 }}                  value={searchQuery}

              animate={{ opacity: 1, y: 0 }}                  onChange={(e) => setSearchQuery(e.target.value)}

              transition={{ delay: 0.3 }}                  className="pl-12 pr-6 py-3 w-80 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"

              className="hidden md:flex items-center space-x-4"                />

            >              </div>

              <div className="relative">            </motion.div>

                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />

                <input            {/* Action Buttons */}

                  type="text"            <motion.div 

                  placeholder="Search screens, locations..."              className="flex items-center space-x-4"

                  value={searchQuery}              initial={{ opacity: 0, x: 30 }}

                  onChange={(e) => setSearchQuery(e.target.value)}              animate={{ opacity: 1, x: 0 }}

                  className="pl-12 pr-6 py-3 w-80 bg-white/80 backdrop-blur-sm rounded-2xl border border-gray-200 shadow-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"              transition={{ delay: 0.3 }}

                />            >

              </div>              <motion.button

            </motion.div>                onClick={handleRefresh}

                disabled={refreshing}

            {/* Action Buttons */}                whileHover={{ scale: 1.1, rotate: 180 }}

            <motion.div                 whileTap={{ scale: 0.95 }}

              className="flex items-center space-x-4"                className="p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-lg"

              initial={{ opacity: 0, x: 30 }}              >

              animate={{ opacity: 1, x: 0 }}                <RefreshCw className={`w-6 h-6 ${refreshing ? "animate-spin" : ""}`} />

              transition={{ delay: 0.3 }}              </motion.button>

            >

              <motion.button              <motion.button

                onClick={handleRefresh}                whileHover={{ scale: 1.1 }}

                disabled={refreshing}                whileTap={{ scale: 0.95 }}

                whileHover={{ scale: 1.1, rotate: 180 }}                className="p-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all relative shadow-lg"

                whileTap={{ scale: 0.95 }}              >

                className="p-4 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-2xl transition-all shadow-lg"                <Bell className="w-6 h-6" />

              >                <motion.div

                <RefreshCw className={`w-6 h-6 ${refreshing ? "animate-spin" : ""}`} />                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"

              </motion.button>                  animate={{ scale: [1, 1.2, 1] }}

                  transition={{ duration: 2, repeat: Infinity }}

              <motion.button                >

                whileHover={{ scale: 1.1 }}                  <span className="text-xs text-white font-bold">3</span>

                whileTap={{ scale: 0.95 }}                </motion.div>

                className="p-4 text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-2xl transition-all relative shadow-lg"              </motion.button>

              >

                <Bell className="w-6 h-6" />              <motion.button

                <motion.div                onClick={onLogout}

                  className="absolute -top-1 -right-1 w-4 h-4 bg-red-500 rounded-full flex items-center justify-center"                whileHover={{ scale: 1.05 }}

                  animate={{ scale: [1, 1.2, 1] }}                whileTap={{ scale: 0.95 }}

                  transition={{ duration: 2, repeat: Infinity }}                className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"

                >              >

                  <span className="text-xs text-white font-bold">3</span>                <LogOut className="w-5 h-5" />

                </motion.div>                <span>Logout</span>

              </motion.button>              </motion.button>

            </div>

              <motion.button          </div>

                onClick={onLogout}

                whileHover={{ scale: 1.05 }}          {/* Navigation Tabs */}

                whileTap={{ scale: 0.95 }}          <motion.div 

                className="flex items-center space-x-3 bg-gradient-to-r from-red-500 to-pink-600 text-white px-6 py-3 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"            className="border-t border-gray-200/50 -mb-px"

              >            initial={{ opacity: 0, y: 20 }}

                <LogOut className="w-5 h-5" />            animate={{ opacity: 1, y: 0 }}

                <span>Logout</span>            transition={{ delay: 0.4 }}

              </motion.button>          >

            </div>            <nav className="flex space-x-2 py-6 overflow-x-auto">

          </div>              {[

                { id: "dashboard", label: "🏠 Dashboard", icon: BarChart3 },

          {/* Navigation Tabs */}                { id: "screens", label: "📺 Screens", icon: Monitor },

          <motion.div                 { id: "bookings", label: "📅 Bookings", icon: Calendar },

            className="border-t border-gray-200/50 -mb-px"                { id: "analytics", label: "📊 Analytics", icon: TrendingUp },

            initial={{ opacity: 0, y: 20 }}                { id: "settings", label: "⚙️ Settings", icon: Settings },

            animate={{ opacity: 1, y: 0 }}              ].map((tab, index) => (

            transition={{ delay: 0.4 }}                <motion.button

          >                  key={tab.id}

            <nav className="flex space-x-2 py-6 overflow-x-auto">                  onClick={() => setActiveTab(tab.id as ActiveTab)}

              {[                  whileHover={{ scale: 1.05, y: -2 }}

                { id: "dashboard", label: "🏠 Dashboard", icon: BarChart3 },                  whileTap={{ scale: 0.95 }}

                { id: "screens", label: "📺 Screens", icon: Monitor },                  initial={{ opacity: 0, y: 20 }}

                { id: "bookings", label: "📅 Bookings", icon: Calendar },                  animate={{ opacity: 1, y: 0 }}

                { id: "analytics", label: "📊 Analytics", icon: TrendingUp },                  transition={{ delay: 0.5 + index * 0.1 }}

                { id: "settings", label: "⚙️ Settings", icon: Settings },                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all text-sm relative overflow-hidden min-w-max ${

              ].map((tab, index) => (                    activeTab === tab.id

                <motion.button                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl"

                  key={tab.id}                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70 shadow-lg"

                  onClick={() => setActiveTab(tab.id as ActiveTab)}                  }`}

                  whileHover={{ scale: 1.05, y: -2 }}                >

                  whileTap={{ scale: 0.95 }}                  <tab.icon className="w-5 h-5" />

                  initial={{ opacity: 0, y: 20 }}                  <span>{tab.label}</span>

                  animate={{ opacity: 1, y: 0 }}                </motion.button>

                  transition={{ delay: 0.5 + index * 0.1 }}              ))}

                  className={`flex items-center space-x-3 px-8 py-4 rounded-2xl font-bold transition-all text-sm relative overflow-hidden min-w-max ${            </nav>

                    activeTab === tab.id          </motion.div>

                      ? "bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-2xl"        </div>

                      : "text-gray-600 hover:text-gray-900 hover:bg-white/70 shadow-lg"      </motion.header>

                  }`}

                >      {/* Main Content */}

                  <tab.icon className="w-5 h-5" />      <div className="max-w-7xl mx-auto px-6 py-8">

                  <span>{tab.label}</span>        <AnimatePresence mode="wait">

                </motion.button>          {/* Dashboard Tab */}

              ))}          {activeTab === "dashboard" && (

            </nav>            <motion.div

          </motion.div>              key="dashboard"

        </div>              initial={{ opacity: 0, y: 40 }}

      </motion.header>              animate={{ opacity: 1, y: 0 }}

              exit={{ opacity: 0, y: -40 }}

      {/* Main Content */}              transition={{ duration: 0.6 }}

      <div className="max-w-7xl mx-auto px-6 py-8">              className="space-y-8"

        <AnimatePresence mode="wait">            >

          {/* Dashboard Tab */}              <motion.div

          {activeTab === "dashboard" && (                initial={{ opacity: 0, y: 30 }}

            <motion.div                animate={{ opacity: 1, y: 0 }}

              key="dashboard"                transition={{ delay: 0.2 }}

              initial={{ opacity: 0, y: 40 }}              >

              animate={{ opacity: 1, y: 0 }}                <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">

              exit={{ opacity: 0, y: -40 }}                  📊 Dashboard Overview

              transition={{ duration: 0.6 }}                </h2>

              className="space-y-8"                

            >                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">

              <motion.div                  <DashboardWidget

                initial={{ opacity: 0, y: 30 }}                    icon={Monitor}

                animate={{ opacity: 1, y: 0 }}                    title="Total Screens"

                transition={{ delay: 0.2 }}                    value={dashboardStats?.screens?.total_screens || 0}

              >                    subtitle="Digital displays active"

                <h2 className="text-4xl font-black text-gray-900 mb-8 text-center">                    color="blue"

                  📊 Dashboard Overview                    delay={0.1}

                </h2>                    change={{ value: 12, isPositive: true }}

                                  />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">                  <DashboardWidget

                  <DashboardWidget                    icon={Activity}

                    icon={Monitor}                    title="Active Now"

                    title="Total Screens"                    value={dashboardStats?.screens?.active_screens || 0}

                    value={dashboardStats?.screens?.total_screens || 0}                    subtitle="Currently broadcasting"

                    subtitle="Digital displays active"                    color="green"

                    color="blue"                    delay={0.2}

                    delay={0.1}                    change={{ value: 8, isPositive: true }}

                    change={{ value: 12, isPositive: true }}                  />

                  />                  <DashboardWidget

                  <DashboardWidget                    icon={Calendar}

                    icon={Activity}                    title="Bookings"

                    title="Active Now"                    value={dashboardStats?.bookingRequests?.total_requests || 0}

                    value={dashboardStats?.screens?.active_screens || 0}                    subtitle="Campaign requests"

                    subtitle="Currently broadcasting"                    color="purple"

                    color="green"                    delay={0.3}

                    delay={0.2}                    change={{ value: 3, isPositive: false }}

                    change={{ value: 8, isPositive: true }}                  />

                  />                  <DashboardWidget

                  <DashboardWidget                    icon={DollarSign}

                    icon={Calendar}                    title="Revenue"

                    title="Bookings"                    value={`₹${(revenue?.totalRevenue || 0).toLocaleString()}`}

                    value={dashboardStats?.bookingRequests?.total_requests || 0}                    subtitle="Monthly earnings"

                    subtitle="Campaign requests"                    color="orange"

                    color="purple"                    delay={0.4}

                    delay={0.3}                    change={{ value: 24, isPositive: true }}

                    change={{ value: 3, isPositive: false }}                  />

                  />                </div>

                  <DashboardWidget              </motion.div>

                    icon={DollarSign}

                    title="Revenue"              {/* Quick Actions & Recent Activity */}

                    value={`₹${(revenue?.totalRevenue || 0).toLocaleString()}`}              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">

                    subtitle="Monthly earnings"                {/* Quick Actions */}

                    color="orange"                <motion.div

                    delay={0.4}                  initial={{ opacity: 0, x: -40 }}

                    change={{ value: 24, isPositive: true }}                  animate={{ opacity: 1, x: 0 }}

                  />                  transition={{ delay: 0.6 }}

                </div>                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"

              </motion.div>                >

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">

              {/* Quick Actions & Recent Activity */}                    ⚡ Quick Actions

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">                  </h3>

                {/* Quick Actions */}                  <div className="grid grid-cols-2 gap-4">

                <motion.div                    {[

                  initial={{ opacity: 0, x: -40 }}                      { icon: Plus, label: "Add Screen", color: "from-blue-500 to-cyan-500" },

                  animate={{ opacity: 1, x: 0 }}                      { icon: Upload, label: "Upload Media", color: "from-green-500 to-emerald-500" },

                  transition={{ delay: 0.6 }}                      { icon: Settings, label: "Settings", color: "from-purple-500 to-pink-500" },

                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"                      { icon: BarChart3, label: "Reports", color: "from-orange-500 to-yellow-500" },

                >                    ].map((action, index) => (

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">                      <motion.button

                    ⚡ Quick Actions                        key={action.label}

                  </h3>                        whileHover={{ scale: 1.05, y: -5 }}

                  <div className="grid grid-cols-2 gap-4">                        whileTap={{ scale: 0.95 }}

                    {[                        initial={{ opacity: 0, y: 20 }}

                      { icon: Plus, label: "Add Screen", color: "from-blue-500 to-cyan-500" },                        animate={{ opacity: 1, y: 0 }}

                      { icon: Upload, label: "Upload Media", color: "from-green-500 to-emerald-500" },                        transition={{ delay: 0.7 + index * 0.1 }}

                      { icon: Settings, label: "Settings", color: "from-purple-500 to-pink-500" },                        className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center`}

                      { icon: BarChart3, label: "Reports", color: "from-orange-500 to-yellow-500" },                      >

                    ].map((action, index) => (                        <action.icon className="w-8 h-8 mx-auto mb-2" />

                      <motion.button                        <span className="font-semibold">{action.label}</span>

                        key={action.label}                      </motion.button>

                        whileHover={{ scale: 1.05, y: -5 }}                    ))}

                        whileTap={{ scale: 0.95 }}                  </div>

                        initial={{ opacity: 0, y: 20 }}                </motion.div>

                        animate={{ opacity: 1, y: 0 }}

                        transition={{ delay: 0.7 + index * 0.1 }}                {/* Recent Activity */}

                        className={`p-6 bg-gradient-to-br ${action.color} text-white rounded-2xl shadow-lg hover:shadow-2xl transition-all text-center`}                <motion.div

                      >                  initial={{ opacity: 0, x: 40 }}

                        <action.icon className="w-8 h-8 mx-auto mb-2" />                  animate={{ opacity: 1, x: 0 }}

                        <span className="font-semibold">{action.label}</span>                  transition={{ delay: 0.6 }}

                      </motion.button>                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"

                    ))}                >

                  </div>                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">

                </motion.div>                    🔥 Recent Activity

                  </h3>

                {/* Recent Activity */}                  <div className="space-y-4">

                <motion.div                    {screens.slice(0, 4).map((screen, index) => (

                  initial={{ opacity: 0, x: 40 }}                      <motion.div

                  animate={{ opacity: 1, x: 0 }}                        key={screen.id}

                  transition={{ delay: 0.6 }}                        initial={{ opacity: 0, x: 20 }}

                  className="bg-white rounded-3xl shadow-2xl border border-gray-100 p-8"                        animate={{ opacity: 1, x: 0 }}

                >                        transition={{ delay: 0.8 + index * 0.1 }}

                  <h3 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"

                    🔥 Recent Activity                      >

                  </h3>                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">

                  <div className="space-y-4">                          <Monitor className="w-6 h-6 text-white" />

                    {screens.slice(0, 4).map((screen, index) => (                        </div>

                      <motion.div                        <div className="flex-1">

                        key={screen.id}                          <p className="font-semibold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</p>

                        initial={{ opacity: 0, x: 20 }}                          <p className="text-sm text-gray-500">{screen.city || 'Unknown City'} • Just now</p>

                        animate={{ opacity: 1, x: 0 }}                        </div>

                        transition={{ delay: 0.8 + index * 0.1 }}                        <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />

                        className="flex items-center space-x-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors"                      </motion.div>

                      >                    ))}

                        <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">                  </div>

                          <Monitor className="w-6 h-6 text-white" />                </motion.div>

                        </div>              </div>

                        <div className="flex-1">            </motion.div>

                          <p className="font-semibold text-gray-900">{screen.screen_name || `Screen ${screen.id}`}</p>          )}

                          <p className="text-sm text-gray-500">{screen.city || 'Unknown City'} • Just now</p>

                        </div>          {/* Screens Tab */}

                        <div className={`w-3 h-3 rounded-full ${screen.is_active ? 'bg-green-400' : 'bg-gray-400'}`} />          {activeTab === "screens" && (

                      </motion.div>            <motion.div

                    ))}              key="screens"

                  </div>              initial={{ opacity: 0, y: 40 }}

                </motion.div>              animate={{ opacity: 1, y: 0 }}

              </div>              exit={{ opacity: 0, y: -40 }}

            </motion.div>              transition={{ duration: 0.6 }}

          )}              className="space-y-8"

            >

          {/* Screens Tab */}              {/* Header */}

          {activeTab === "screens" && (              <div className="flex items-center justify-between">

            <motion.div                <div>

              key="screens"                  <h2 className="text-4xl font-black text-gray-900 mb-2">

              initial={{ opacity: 0, y: 40 }}                    📺 Screen Management

              animate={{ opacity: 1, y: 0 }}                  </h2>

              exit={{ opacity: 0, y: -40 }}                  <p className="text-lg text-gray-600">Manage your digital displays with style</p>

              transition={{ duration: 0.6 }}                </div>

              className="space-y-8"                

            >                <div className="flex items-center space-x-4">

              {/* Header */}                  {/* View Mode Toggle */}

              <div className="flex items-center justify-between">                  <div className="flex bg-white rounded-2xl shadow-lg border border-gray-200 p-2">

                <div>                    <motion.button

                  <h2 className="text-4xl font-black text-gray-900 mb-2">                      whileHover={{ scale: 1.05 }}

                    📺 Screen Management                      whileTap={{ scale: 0.95 }}

                  </h2>                      onClick={() => setViewMode("grid")}

                  <p className="text-lg text-gray-600">Manage your digital displays with style</p>                      className={`p-3 rounded-xl transition-all ${

                </div>                        viewMode === "grid" 

                                          ? "bg-blue-500 text-white shadow-lg" 

                <div className="flex items-center space-x-4">                          : "text-gray-600 hover:bg-gray-100"

                  {/* View Mode Toggle */}                      }`}

                  <div className="flex bg-white rounded-2xl shadow-lg border border-gray-200 p-2">                    >

                    <motion.button                      <Grid3X3 className="w-5 h-5" />

                      whileHover={{ scale: 1.05 }}                    </motion.button>

                      whileTap={{ scale: 0.95 }}                    <motion.button

                      onClick={() => setViewMode("grid")}                      whileHover={{ scale: 1.05 }}

                      className={`p-3 rounded-xl transition-all ${                      whileTap={{ scale: 0.95 }}

                        viewMode === "grid"                       onClick={() => setViewMode("list")}

                          ? "bg-blue-500 text-white shadow-lg"                       className={`p-3 rounded-xl transition-all ${

                          : "text-gray-600 hover:bg-gray-100"                        viewMode === "list" 

                      }`}                          ? "bg-blue-500 text-white shadow-lg" 

                    >                          : "text-gray-600 hover:bg-gray-100"

                      <Grid3X3 className="w-5 h-5" />                      }`}

                    </motion.button>                    >

                    <motion.button                      <List className="w-5 h-5" />

                      whileHover={{ scale: 1.05 }}                    </motion.button>

                      whileTap={{ scale: 0.95 }}                  </div>

                      onClick={() => setViewMode("list")}

                      className={`p-3 rounded-xl transition-all ${                  {/* Filter & Sort */}

                        viewMode === "list"                   <motion.button

                          ? "bg-blue-500 text-white shadow-lg"                     whileHover={{ scale: 1.05 }}

                          : "text-gray-600 hover:bg-gray-100"                    whileTap={{ scale: 0.95 }}

                      }`}                    className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50"

                    >                  >

                      <List className="w-5 h-5" />                    <Filter className="w-5 h-5" />

                    </motion.button>                    <span>Filter</span>

                  </div>                  </motion.button>



                  {/* Filter & Sort */}                  <motion.button

                  <motion.button                    whileHover={{ scale: 1.05 }}

                    whileHover={{ scale: 1.05 }}                    whileTap={{ scale: 0.95 }}

                    whileTap={{ scale: 0.95 }}                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"

                    className="flex items-center space-x-2 bg-white px-6 py-3 rounded-2xl shadow-lg border border-gray-200 text-gray-700 hover:bg-gray-50"                  >

                  >                    <Plus className="w-6 h-6" />

                    <Filter className="w-5 h-5" />                    <span>Add New Screen</span>

                    <span>Filter</span>                  </motion.button>

                  </motion.button>                </div>

              </div>

                  <motion.button

                    whileHover={{ scale: 1.05 }}              {/* Screens Grid/List */}

                    whileTap={{ scale: 0.95 }}              <motion.div

                    className="flex items-center space-x-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg hover:shadow-2xl transition-all"                initial={{ opacity: 0, y: 30 }}

                  >                animate={{ opacity: 1, y: 0 }}

                    <Plus className="w-6 h-6" />                transition={{ delay: 0.2 }}

                    <span>Add New Screen</span>                className={`${

                  </motion.button>                  viewMode === "grid" 

                </div>                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8" 

              </div>                    : "space-y-4"

                }`}

              {/* Screens Grid/List */}              >

              <motion.div                {filteredScreens.map((screen, index) => (

                initial={{ opacity: 0, y: 30 }}                  <ScreenCard

                animate={{ opacity: 1, y: 0 }}                    key={screen.id}

                transition={{ delay: 0.2 }}                    screen={screen as EnhancedScreen}

                className={`${                    index={index}

                  viewMode === "grid"                     viewMode={viewMode}

                    ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"                   />

                    : "space-y-4"                ))}

                }`}              </motion.div>

              >

                {filteredScreens.map((screen, index) => (              {filteredScreens.length === 0 && (

                  <ScreenCard                <motion.div

                    key={screen.id}                  initial={{ opacity: 0, y: 20 }}

                    screen={screen as EnhancedScreen}                  animate={{ opacity: 1, y: 0 }}

                    index={index}                  className="text-center py-16"

                    viewMode={viewMode}                >

                  />                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">

                ))}                    <Monitor className="w-16 h-16 text-gray-400" />

              </motion.div>                  </div>

                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No screens found</h3>

              {filteredScreens.length === 0 && (                  <p className="text-gray-500 mb-8">Try adjusting your search or add a new screen</p>

                <motion.div                  <motion.button

                  initial={{ opacity: 0, y: 20 }}                    whileHover={{ scale: 1.05 }}

                  animate={{ opacity: 1, y: 0 }}                    whileTap={{ scale: 0.95 }}

                  className="text-center py-16"                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"

                >                  >

                  <div className="w-32 h-32 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">                    Add Your First Screen

                    <Monitor className="w-16 h-16 text-gray-400" />                  </motion.button>

                  </div>                </motion.div>

                  <h3 className="text-2xl font-bold text-gray-700 mb-2">No screens found</h3>              )}

                  <p className="text-gray-500 mb-8">Try adjusting your search or add a new screen</p>            </motion.div>

                  <motion.button          )}

                    whileHover={{ scale: 1.05 }}

                    whileTap={{ scale: 0.95 }}          {/* Other tabs with placeholder content */}

                    className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-8 py-4 rounded-2xl font-bold shadow-lg"          {(activeTab === "bookings" || activeTab === "analytics" || activeTab === "settings") && (

                  >            <motion.div

                    Add Your First Screen              key={activeTab}

                  </motion.button>              initial={{ opacity: 0, y: 40 }}

                </motion.div>              animate={{ opacity: 1, y: 0 }}

              )}              exit={{ opacity: 0, y: -40 }}

            </motion.div>              transition={{ duration: 0.6 }}

          )}              className="space-y-8"

            >

          {/* Other tabs with placeholder content */}              <div className="text-center py-16">

          {(activeTab === "bookings" || activeTab === "analytics" || activeTab === "settings") && (                <h2 className="text-4xl font-black text-gray-900 mb-4">

            <motion.div                  {activeTab === "bookings" && "📅 Booking Management"}

              key={activeTab}                  {activeTab === "analytics" && "📊 Analytics Dashboard"}

              initial={{ opacity: 0, y: 40 }}                  {activeTab === "settings" && "⚙️ Settings"}

              animate={{ opacity: 1, y: 0 }}                </h2>

              exit={{ opacity: 0, y: -40 }}                <p className="text-xl text-gray-600">Coming soon with amazing features!</p>

              transition={{ duration: 0.6 }}              </div>

              className="space-y-8"            </motion.div>

            >          )}

              <div className="text-center py-16">        </AnimatePresence>

                <h2 className="text-4xl font-black text-gray-900 mb-4">      </div>

                  {activeTab === "bookings" && "📅 Booking Management"}    </div>

                  {activeTab === "analytics" && "📊 Analytics Dashboard"}  );

                  {activeTab === "settings" && "⚙️ Settings"}};

                </h2>

                <p className="text-xl text-gray-600">Coming soon with amazing features!</p>export default AdminDashboard;
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default AdminDashboard;