import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Map,
  Navigation2,
  BarChart3,
  MapPin,
  X,
  Globe,
  Zap,
} from "lucide-react";
import { useNavigate, useLocation } from "react-router-dom";

interface QuickNavOption {
  id: string;
  label: string;
  path: string;
  icon: any;
  color: string;
  description: string;
}

const MapQuickNav: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);

  const navOptions: QuickNavOption[] = [
    {
      id: "interactive-map",
      label: "Interactive Map",
      path: "/map",
      icon: Map,
      color: "blue",
      description: "Explore locations",
    },
    {
      id: "map-dashboard",
      label: "Maps Dashboard",
      path: "/map-dashboard",
      icon: Navigation2,
      color: "purple",
      description: "Analytics & insights",
    },
    {
      id: "analytics",
      label: "Map Analytics",
      path: "/map-analytics",
      icon: BarChart3,
      color: "green",
      description: "Performance data",
    },
    {
      id: "locations",
      label: "All Locations",
      path: "/map-locations",
      icon: MapPin,
      color: "orange",
      description: "Browse all screens",
    },
  ];

  const isMapPage = location.pathname.includes("/map");

  // Don't show on map pages to avoid clutter
  if (isMapPage) return null;

  const handleNavigation = (option: QuickNavOption) => {
    navigate(option.path);
    setIsOpen(false);
  };

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            className="absolute bottom-16 right-0 space-y-3"
          >
            {navOptions.map((option, index) => {
              const IconComponent = option.icon;
              return (
                <motion.button
                  key={option.id}
                  initial={{ opacity: 0, x: 20, y: 20 }}
                  animate={{ opacity: 1, x: 0, y: 0 }}
                  exit={{ opacity: 0, x: 20, y: 20 }}
                  transition={{ delay: index * 0.1 }}
                  onClick={() => handleNavigation(option)}
                  className={`flex items-center gap-3 bg-white hover:bg-gray-50 rounded-xl shadow-lg border border-gray-200 p-4 min-w-64 group hover:shadow-xl transition-all duration-200`}
                >
                  <div
                    className={`p-2 bg-${option.color}-100 rounded-lg group-hover:bg-${option.color}-200 transition-colors`}
                  >
                    <IconComponent
                      className={`w-5 h-5 text-${option.color}-600`}
                    />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="font-medium text-gray-900 text-sm">
                      {option.label}
                    </div>
                    <div className="text-xs text-gray-500">
                      {option.description}
                    </div>
                  </div>
                </motion.button>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main FAB Button */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsOpen(!isOpen)}
        className={`w-14 h-14 rounded-full shadow-lg flex items-center justify-center transition-all duration-300 ${
          isOpen
            ? "bg-red-500 hover:bg-red-600"
            : "bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
        }`}
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ opacity: 0, rotate: -90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: 90 }}
            >
              <X className="w-6 h-6 text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="open"
              initial={{ opacity: 0, rotate: 90 }}
              animate={{ opacity: 1, rotate: 0 }}
              exit={{ opacity: 0, rotate: -90 }}
              className="relative"
            >
              <Globe className="w-6 h-6 text-white" />
              <motion.div
                animate={{ scale: [1, 1.2, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full flex items-center justify-center"
              >
                <Zap className="w-2 h-2 text-yellow-700" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Tooltip for closed state */}
      <AnimatePresence>
        {!isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, x: 20 }}
            animate={{ opacity: 1, scale: 1, x: 0 }}
            exit={{ opacity: 0, scale: 0.8, x: 20 }}
            className="absolute bottom-4 right-16 bg-gray-900 text-white text-xs px-3 py-2 rounded-lg shadow-lg pointer-events-none"
            style={{ whiteSpace: "nowrap" }}
          >
            Quick Maps Navigation
            <div className="absolute right-0 top-1/2 transform translate-x-1 -translate-y-1/2 w-0 h-0 border-l-4 border-l-gray-900 border-y-4 border-y-transparent"></div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MapQuickNav;
