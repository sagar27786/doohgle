import React from "react";
import { motion } from "framer-motion";
import { ChevronRight, Home, Map } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface BreadcrumbItem {
  label: string;
  path: string;
  icon?: any;
}

const MapBreadcrumb: React.FC = () => {
  const location = useLocation();

  const getBreadcrumbItems = (): BreadcrumbItem[] => {
    const path = location.pathname;

    switch (path) {
      case "/map":
        return [
          { label: "Home", path: "/", icon: Home },
          { label: "Interactive Map", path: "/map", icon: Map },
        ];
      case "/map-dashboard":
        return [
          { label: "Home", path: "/", icon: Home },
          { label: "Maps", path: "/map" },
          { label: "Dashboard", path: "/map-dashboard" },
        ];
      case "/map-analytics":
        return [
          { label: "Home", path: "/", icon: Home },
          { label: "Maps", path: "/map" },
          { label: "Analytics", path: "/map-analytics" },
        ];
      case "/map-locations":
        return [
          { label: "Home", path: "/", icon: Home },
          { label: "Maps", path: "/map" },
          { label: "Locations", path: "/map-locations" },
        ];
      default:
        return [{ label: "Home", path: "/", icon: Home }];
    }
  };

  const breadcrumbItems = getBreadcrumbItems();

  if (breadcrumbItems.length <= 1) return null;

  return (
    <motion.nav
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white/80 backdrop-blur-sm border-b border-gray-200 px-4 py-2"
    >
      <div className="max-w-7xl mx-auto">
        <ol className="flex items-center space-x-2 text-sm">
          {breadcrumbItems.map((item, index) => {
            const isLast = index === breadcrumbItems.length - 1;
            const IconComponent = item.icon;

            return (
              <li key={item.path} className="flex items-center">
                {index > 0 && (
                  <ChevronRight className="w-4 h-4 text-gray-400 mx-2" />
                )}

                {isLast ? (
                  <motion.span
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="flex items-center gap-1 text-gray-900 font-medium"
                  >
                    {IconComponent && <IconComponent className="w-4 h-4" />}
                    {item.label}
                  </motion.span>
                ) : (
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Link
                      to={item.path}
                      className="flex items-center gap-1 text-gray-600 hover:text-gray-900 transition-colors"
                    >
                      {IconComponent && <IconComponent className="w-4 h-4" />}
                      {item.label}
                    </Link>
                  </motion.div>
                )}
              </li>
            );
          })}
        </ol>
      </div>
    </motion.nav>
  );
};

export default MapBreadcrumb;
