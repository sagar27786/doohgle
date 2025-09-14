// Complete Integrated Ads Manager Dashboard - Frontend + Backend
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  Users,
  MapPin,
  Calendar,
  Settings,
  Search,
  Plus,
  Eye,
  Filter,
  FileText,
  Target,
  Cloud,
  Activity,
  DollarSign,
  CheckCircle,
  XCircle,
  Clock,
  PlayCircle,
  PauseCircle,
  StopCircle,
  ArrowUpRight,
  ArrowDownRight,
  TrendingDown,
  Zap,
  Star,
  Award,
  RefreshCw,
  MoreHorizontal,
} from "lucide-react";

// Notification components
import NotificationBar from "../../../components/Notifications/NotificationBar";

// Chart imports
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  LineChart,
  Line,
} from "recharts";

// Backend Integration Components removed (AWS)

// Existing Components

// New Enhanced Components
import CampaignManagement from "../../Campaign/CampaignManagement";
import ReportsAnalytics from "../../Reports/ReportsAnalytics";
import EnhancedMapDashboard from "../../Map/EnhancedMapDashboard";
import MyBookings from "../../Campaign/MyBookings";

// AWS Enhanced Components removed
// LocationManager import removed

type ViewType =
  | "dashboard"
  | "campaigns"
  | "campaignManagement"
  | "campaignRequests"
  | "myBookings"
  | "screens"
  | "maps"
  | "reports"
  | "settings";

const IntegratedAdsManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "maps", label: "Maps", icon: MapPin },
    { id: "campaignManagement", label: "Screen Management", icon: Target },
    { id: "myBookings", label: "My Bookings", icon: Calendar },
    { id: "reports", label: "Reports & Analytics", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <CampaignManagement />;
      case "maps":
        return <EnhancedMapDashboard height="calc(100vh - 200px)" />;
      case "campaignManagement":
        return <CampaignManagement />;
      case "myBookings":
        return <MyBookings />;
      case "reports":
        return <ReportsAnalytics />;
      case "settings":
        return <SettingsView />;
      default:
        return <CampaignManagement />;
    }
  };

  // Settings View Component
  const SettingsView: React.FC = () => {
    return (
      <div className="space-y-6">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <h3 className="text-lg font-semibold mb-4">Platform Settings</h3>
          <p className="text-gray-600">
            Configuration options and platform settings will be available here.
          </p>
        </div>
      </div>
    );
  };

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Mobile Sidebar Overlay */}
      <div 
        className={`fixed inset-0 z-40 lg:hidden ${sidebarOpen ? 'block' : 'hidden'}`}
        onClick={() => setSidebarOpen(false)}
      >
        <div className="absolute inset-0 bg-black opacity-50"></div>
      </div>

      {/* Sidebar */}
      <div className={`
        ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'} 
        lg:translate-x-0 fixed lg:static inset-y-0 left-0 z-50 w-64 
        bg-white shadow-lg border-r transition-transform duration-300 ease-in-out
      `}>
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Ads Manager</h2>
          <p className="text-sm text-gray-600">Complete DOOH Platform</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setCurrentView(item.id as ViewType);
                setSidebarOpen(false); // Close sidebar on mobile after selection
              }}
              className={`w-full flex items-center space-x-3 px-6 py-3 text-left hover:bg-blue-50 transition-colors ${
                currentView === item.id
                  ? "bg-blue-50 border-r-2 border-blue-500 text-blue-700"
                  : "text-gray-700 hover:text-blue-700"
              }`}
            >
              <item.icon size={20} />
              <span className="font-medium">{item.label}</span>
            </button>
          ))}
        </nav>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden lg:ml-0">
        {/* Header */}
        <div className="bg-white border-b px-4 lg:px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {/* Mobile Menu Button */}
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
              >
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                </svg>
              </button>
              
              <div>
                <h1 className="text-xl lg:text-2xl font-bold text-gray-900 capitalize">
                  {currentView.replace(/([A-Z])/g, " $1").trim()}
                </h1>
                <p className="text-gray-600 text-sm lg:text-base hidden sm:block">
                  {currentView === "dashboard" &&
                    "Overview of your campaigns and screens"}
                  {currentView === "maps" &&
                    "View all registered screens on the map"}
                  {currentView === "campaignManagement" &&
                    "Create and manage advertising campaigns"}
                  {currentView === "myBookings" &&
                    "Track your campaign booking requests and their status"}
                  {currentView === "campaignRequests" &&
                    "Track your campaign booking requests"}
                  {currentView === "campaigns" &&
                    "Manage your advertising campaigns"}
                  {currentView === "screens" && "Monitor your digital screens"}
                  {currentView === "reports" &&
                    "Analytics and performance reports"}
                  {currentView === "settings" && "Platform configuration"}
                </p>
              </div>
            </div>

            {/* NotificationBar for Ads Managers */}
            <div className="flex items-center">
              <NotificationBar userType="ads_manager" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-4 lg:p-6">{renderCurrentView()}</div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedAdsManager;
