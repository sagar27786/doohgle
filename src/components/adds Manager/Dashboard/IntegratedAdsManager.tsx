// Complete Integrated Ads Manager Dashboard - Frontend + Backend
import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart3,
  TrendingUp,
  Users,
  MapPin,
  Calendar,
  Settings,
  Bell,
  Search,
  Plus,
  Eye,
  Filter,
  Monitor,
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

// Professional Dashboard Component
import ProfessionalDashboard from "./ProfessionalDashboard";

// Existing Components
import CampaignManager from "./CampaignManager";
import ScreenManager from "./ScreenManager";

// New Enhanced Components
import CampaignManagement from "../../Campaign/CampaignManagement";
import ReportsAnalytics from "../../Reports/ReportsAnalytics";
import ProfessionalVenueDashboard from "../../VenueDashboard/ProfessionalVenueDashboard";
import MyCampaignRequests from "../../Campaign/MyCampaignRequests";
import NotificationPanel from "../../Campaign/NotificationPanel";

// AWS Enhanced Components removed
// LocationManager import removed

type ViewType =
  | "dashboard"
  | "campaigns"
  | "campaignManagement"
  | "campaignRequests"
  | "screens"
  | "reports"
  | "settings"
  | "venueDashboard";

const IntegratedAdsManager: React.FC = () => {
  const [currentView, setCurrentView] = useState<ViewType>("dashboard");
  const [showNotifications, setShowNotifications] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);
  // showLocationManager removed
  const [selectedFilters, setSelectedFilters] = useState({
    location: "",
    campaign_type: "",
    status: "",
    date_range: "7d",
  });

  const navItems = [
    { id: "dashboard", label: "Dashboard", icon: BarChart3 },
    { id: "venueDashboard", label: "Venue Dashboard", icon: Calendar },
    { id: "campaignManagement", label: "Campaign Management", icon: Target },
    { id: "campaignRequests", label: "My Campaign Requests", icon: Bell },
    { id: "campaigns", label: "Campaigns", icon: TrendingUp },
    { id: "screens", label: "Screens", icon: Monitor },
    { id: "reports", label: "Reports & Analytics", icon: FileText },
    { id: "settings", label: "Settings", icon: Settings },
  ];

  const renderCurrentView = () => {
    switch (currentView) {
      case "dashboard":
        return <ProfessionalDashboard />;
      case "venueDashboard":
        return <ProfessionalVenueDashboard />;
      // AWS tabs removed
      case "campaignManagement":
        return <CampaignManagement />;
      case "campaignRequests":
        return <MyCampaignRequests />;
      case "campaigns":
        return <CampaignManager />;
      case "screens":
        return <ScreenManager />;
      case "reports":
        return <ReportsAnalytics />;
      case "settings":
        return <SettingsView />;
      default:
        return <ProfessionalDashboard />;
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
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg border-r">
        <div className="p-6 border-b">
          <h2 className="text-xl font-bold text-gray-900">Ads Manager</h2>
          <p className="text-sm text-gray-600">Complete DOOH Platform</p>
        </div>

        <nav className="mt-6">
          {navItems.map((item) => (
            <button
              key={item.id}
              onClick={() => setCurrentView(item.id as ViewType)}
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
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <div className="bg-white border-b px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 capitalize">
                {currentView.replace(/([A-Z])/g, " $1").trim()}
              </h1>
              <p className="text-gray-600">
                {currentView === "dashboard" &&
                  "Overview of your campaigns and screens"}
                {currentView === "venueDashboard" &&
                  "Complete venue management dashboard"}
                {currentView === "campaignManagement" &&
                  "Create and manage advertising campaigns"}
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

            {/* NotificationBar for Ads Managers */}
            <div className="flex items-center">
              <NotificationBar userType="ads_manager" />
            </div>
          </div>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-auto">
          <div className="p-6">{renderCurrentView()}</div>
        </div>
      </div>
    </div>
  );
};

export default IntegratedAdsManager;
