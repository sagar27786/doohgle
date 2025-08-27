import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Navigation,
  Search,
  Filter,
  Grid3X3,
  List,
  MapPin,
  Layers,
  Settings,
  ChevronLeft,
  ChevronRight,
  Home,
  BarChart3,
  Zap,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

interface MapNavigationProps {
  currentView?: "map" | "dashboard" | "analytics" | "settings";
  onViewChange?: (view: string) => void;
  showSidebar?: boolean;
  onToggleSidebar?: () => void;
}

const MapNavigation: React.FC<MapNavigationProps> = ({
  currentView = "map",
  onViewChange,
  showSidebar = true,
  onToggleSidebar,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState(currentView);

  const navigationItems = [
    {
      id: "dashboard",
      label: "Dashboard",
      icon: Home,
      path: "/map-dashboard",
      color: "blue",
    },
    {
      id: "map",
      label: "Interactive Map",
      icon: Map,
      path: "/map",
      color: "green",
    },
    {
      id: "analytics",
      label: "Analytics",
      icon: BarChart3,
      path: "/map-analytics",
      color: "purple",
    },
    {
      id: "locations",
      label: "Locations",
      icon: MapPin,
      path: "/map-locations",
      color: "orange",
    },
  ];

  const mapTools = [
    {
      id: "search",
      label: "Search",
      icon: Search,
      shortcut: "Ctrl+K",
    },
    {
      id: "filter",
      label: "Filter",
      icon: Filter,
      shortcut: "F",
    },
    {
      id: "layers",
      label: "Layers",
      icon: Layers,
      shortcut: "L",
    },
    {
      id: "grid",
      label: "Grid View",
      icon: Grid3X3,
      shortcut: "G",
    },
    {
      id: "list",
      label: "List View",
      icon: List,
      shortcut: "V",
    },
  ];

  const handleNavigation = (item: any) => {
    setActiveTab(item.id);
    onViewChange?.(item.id);
    navigate(item.path);
  };

  return (
    <motion.div
      initial={{ x: showSidebar ? 0 : -280 }}
      animate={{ x: showSidebar ? 0 : -280 }}
      transition={{ type: "spring", stiffness: 300, damping: 30 }}
      className="fixed left-0 top-0 h-full w-80 bg-white shadow-2xl border-r border-gray-200 z-50 overflow-hidden"
    >
      {/* Header */}
      <div className="h-16 bg-gradient-to-r from-blue-600 to-purple-600 flex items-center justify-between px-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center gap-3"
        >
          <div className="p-2 bg-white/20 rounded-lg">
            <Navigation className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-white font-bold text-lg">Map Navigation</h1>
            <p className="text-blue-100 text-xs">Indian Digital Maps</p>
          </div>
        </motion.div>

        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={onToggleSidebar}
          className="p-2 hover:bg-white/20 rounded-lg transition-colors"
        >
          {showSidebar ? (
            <ChevronLeft className="w-5 h-5 text-white" />
          ) : (
            <ChevronRight className="w-5 h-5 text-white" />
          )}
        </motion.button>
      </div>

      {/* Main Navigation */}
      <div className="p-6 space-y-6">
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Main Navigation
          </h3>
          <div className="space-y-2">
            {navigationItems.map((item, index) => {
              const IconComponent = item.icon;
              const isActive = activeTab === item.id;

              return (
                <motion.button
                  key={item.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavigation(item)}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group ${
                    isActive
                      ? `bg-${item.color}-50 border-2 border-${item.color}-200 text-${item.color}-700`
                      : "hover:bg-gray-50 text-gray-600 hover:text-gray-900"
                  }`}
                >
                  <div
                    className={`p-2 rounded-lg transition-all duration-200 ${
                      isActive
                        ? `bg-${item.color}-100 text-${item.color}-600`
                        : "bg-gray-100 text-gray-500 group-hover:bg-gray-200"
                    }`}
                  >
                    <IconComponent className="w-4 h-4" />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-sm">{item.label}</div>
                  </div>
                  {isActive && (
                    <motion.div
                      layoutId="activeIndicator"
                      className={`w-2 h-2 rounded-full bg-${item.color}-500`}
                    />
                  )}
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Map Tools */}
        <div>
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-4">
            Map Tools
          </h3>
          <div className="space-y-2">
            {mapTools.map((tool, index) => {
              const IconComponent = tool.icon;

              return (
                <motion.button
                  key={tool.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: (navigationItems.length + index) * 0.1 }}
                  className="w-full flex items-center gap-3 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all duration-200 group"
                >
                  <div className="p-1.5 rounded-md bg-gray-100 text-gray-500 group-hover:bg-gray-200 transition-all">
                    <IconComponent className="w-3.5 h-3.5" />
                  </div>
                  <span className="text-sm font-medium flex-1 text-left">
                    {tool.label}
                  </span>
                  <span className="text-xs text-gray-400 px-2 py-1 bg-gray-100 rounded">
                    {tool.shortcut}
                  </span>
                </motion.button>
              );
            })}
          </div>
        </div>

        {/* Quick Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
          className="bg-gradient-to-br from-green-50 to-blue-50 rounded-xl p-4 border border-green-100"
        >
          <div className="flex items-center gap-2 mb-3">
            <Zap className="w-4 h-4 text-green-600" />
            <h4 className="font-semibold text-gray-900 text-sm">Quick Stats</h4>
          </div>
          <div className="space-y-2">
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Active Screens</span>
              <span className="text-xs font-bold text-green-600">2,847</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Cities Covered</span>
              <span className="text-xs font-bold text-blue-600">28</span>
            </div>
            <div className="flex justify-between">
              <span className="text-xs text-gray-600">Live Campaigns</span>
              <span className="text-xs font-bold text-purple-600">156</span>
            </div>
          </div>
        </motion.div>

        {/* Settings */}
        <motion.button
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.0 }}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gray-50 text-gray-600 hover:text-gray-900 transition-all duration-200 group border border-gray-200"
        >
          <div className="p-2 rounded-lg bg-gray-100 text-gray-500 group-hover:bg-gray-200 transition-all">
            <Settings className="w-4 h-4" />
          </div>
          <span className="font-medium text-sm">Settings</span>
        </motion.button>
      </div>

      {/* Toggle Button for Mobile */}
      <AnimatePresence>
        {!showSidebar && (
          <motion.button
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 290 }}
            exit={{ opacity: 0, x: -100 }}
            onClick={onToggleSidebar}
            className="fixed top-4 left-4 p-3 bg-white shadow-lg rounded-xl border border-gray-200 hover:shadow-xl transition-all duration-200 z-60"
          >
            <ChevronRight className="w-5 h-5 text-gray-600" />
          </motion.button>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MapNavigation;
