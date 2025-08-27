// Professional Screen Manager Component - Enhanced with animations
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Monitor,
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
  Download,
  ArrowUp,
  X,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  User,
} from "lucide-react";

// Backend Integration
import { useScreens } from "../../../hooks/useAdsManager";
import { useAdsManagerScreens } from "../../../hooks/useScreenVisibility";
import { ScreenSearchResult } from "../../../api/screens";
import AWSScreenBookingModal from "../../Booking/AWSScreenBookingModal";
import { s3ImageService } from "../../../services/s3ImageService";

interface Screen extends ScreenSearchResult {
  // Adding missing properties that may be expected
  is_active?: boolean;
  price_per_hour?: number;
  // Additional properties that might be shown in UI
  resolution?: string;
  orientation?: string;
  area_type?: string;
  minimum_duration?: string;
  operating_hours?: string;
  booking_lead_time?: string;
  venue_owner_name?: string;
  contact_email?: string;
  contact_phone?: string;
}

// Professional Loading screen component with neutral colors
const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center h-64"
    >
      <div className="text-center">
        {/* Animated Logo with gray colors */}
        <motion.div
          className="w-16 h-16 mx-auto mb-6 bg-gradient-to-r from-gray-600 to-gray-800 rounded-xl flex items-center justify-center shadow-lg"
          animate={{
            rotateY: 360,
            scale: [1, 1.1, 1],
          }}
          transition={{
            rotateY: { duration: 2, repeat: Infinity, ease: "linear" },
            scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
          }}
        >
          <Monitor className="text-white" size={24} />
        </motion.div>

        {/* Loading Text */}
        <motion.p
          className="text-gray-600 text-lg"
          animate={{ opacity: [0.3, 0.7, 0.3] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          Loading screens...
        </motion.p>

        {/* Loading Bar with gray colors */}
        <div className="w-48 h-1 bg-gray-200 rounded-full mx-auto mt-6 overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-gray-500 to-gray-700"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          />
        </div>
      </div>
    </motion.div>
  );
};

// Animated Counter Component
interface AnimatedCounterProps {
  value: number;
  duration?: number;
  suffix?: string;
  prefix?: string;
  decimals?: number;
}

const AnimatedCounter: React.FC<AnimatedCounterProps> = ({
  value,
  duration = 2,
  suffix = "",
  prefix = "",
  decimals = 0,
}) => {
  const [count, setCount] = useState(0);

  useEffect(() => {
    let startTime: number;
    let animationFrame: number;

    const animate = (timestamp: number) => {
      if (!startTime) startTime = timestamp;
      const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);

      const easeOutExpo = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const currentValue = easeOutExpo * value;

      setCount(currentValue);

      if (progress < 1) {
        animationFrame = requestAnimationFrame(animate);
      }
    };

    animationFrame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(animationFrame);
  }, [value, duration]);

  return (
    <span>
      {prefix}
      {count.toFixed(decimals)}
      {suffix}
    </span>
  );
};

const ScreenManager: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [cityFilter, setCityFilter] = useState<string>("all");
  const [showViewModal, setShowViewModal] = useState(false);
  const [showAnalyticsModal, setShowAnalyticsModal] = useState(false);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [showMoreFilters, setShowMoreFilters] = useState(false);

  // PDF Generation Function
  const generateAnalyticsReport = (screen: Screen) => {
    // Create a new window for PDF generation
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();

    // Calculate additional metrics
    const dailyFootfall = screen.daily_footfall || 1000;
    const uniqueViewers = Math.floor(dailyFootfall * 0.6);
    const avgViewTime = 8.5;
    const peakTraffic = Math.floor(dailyFootfall * 1.3);
    const engagementRate = ((uniqueViewers / dailyFootfall) * 100).toFixed(1);
    const roi = ((screen.price_per_hour || 100) * 0.35).toFixed(1);
    const demographicData = screen.demographics || "Mixed demographic";

    // Professional PDF HTML template
    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Screen Analytics Report - ${screen.name}</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Arial', 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #2d3748;
      background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%);
      padding: 40px;
    }
    .container {
      max-width: 1000px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 20px 60px rgba(0, 0, 0, 0.1);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #4a5568 0%, #2d3748 100%);
      color: white;
      padding: 40px;
      text-align: center;
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 4px;
      background: linear-gradient(90deg, #48bb78, #38a169, #2f855a);
    }
    .header h1 {
      font-size: 2.5em;
      margin-bottom: 10px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .header p {
      font-size: 1.2em;
      opacity: 0.9;
      margin-bottom: 5px;
    }
    .content { padding: 40px; }
    .section { margin-bottom: 40px; }
    .section h2 {
      color: #2d3748;
      font-size: 1.8em;
      margin-bottom: 20px;
      border-bottom: 3px solid #4a5568;
      padding-bottom: 10px;
    }
    .stats-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
      gap: 20px;
      margin-bottom: 25px;
    }
    .stat-card {
      background: linear-gradient(135deg, #48bb78 0%, #38a169 100%);
      color: white;
      padding: 20px;
      border-radius: 10px;
      text-align: center;
      box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    }
    .stat-card h3 {
      margin: 0;
      font-size: 2em;
      font-weight: bold;
    }
    .stat-card p {
      margin: 5px 0 0 0;
      opacity: 0.9;
    }
    .info-grid {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 30px;
      margin-bottom: 30px;
    }
    .info-card {
      background: #f7fafc;
      padding: 20px;
      border-radius: 12px;
      border-left: 4px solid #4a5568;
    }
    .info-card h3 {
      color: #2d3748;
      margin-bottom: 15px;
      font-size: 1.3em;
    }
    .info-item {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 10px 0;
      border-bottom: 1px solid #e2e8f0;
    }
    .info-item:last-child { border-bottom: none; }
    .info-label {
      font-weight: 600;
      color: #4a5568;
    }
    .info-value {
      color: #2d3748;
      font-weight: 500;
    }
    .chart-placeholder {
      background: linear-gradient(135deg, #e2e8f0 0%, #cbd5e0 100%);
      border: 2px dashed #a0aec0;
      border-radius: 12px;
      height: 200px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 20px 0;
      font-size: 1.1em;
      color: #4a5568;
      font-weight: 600;
      flex-direction: column;
    }
    .performance-graph {
      background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%);
      padding: 20px;
      border-radius: 12px;
      margin: 20px 0;
      border: 1px solid #e2e8f0;
    }
    .recommendations {
      background: linear-gradient(135deg, #f0fff4 0%, #e6fffa 100%);
      padding: 25px;
      border-radius: 12px;
      border-left: 4px solid #48bb78;
    }
    .recommendations ul {
      list-style: none;
      padding: 0;
    }
    .recommendations li {
      padding: 12px 0;
      border-bottom: 1px solid rgba(72, 187, 120, 0.2);
    }
    .recommendations li:last-child {
      border-bottom: none;
    }
    .footer {
      background: #2d3748;
      color: white;
      padding: 25px 40px;
      text-align: center;
    }
    @media print {
      body {
        padding: 0;
        background: white;
      }
      .container {
        box-shadow: none;
        border-radius: 0;
      }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Screen Analytics Report</h1>
      <p><strong>${screen.name || "Digital Screen"}</strong></p>
      <p>Location: ${
        screen.location_name || screen.city || "Metropolitan Area"
      }</p>
      <p>Report Period: Last 30 Days | Generated: ${currentDate} at ${currentTime}</p>
    </div>
    <div class="content">
      <div class="section">
        <h2>📈 Key Performance Metrics</h2>
        <div class="stats-grid">
          <div class="stat-card">
            <h3>${dailyFootfall.toLocaleString()}</h3>
            <p>Daily Footfall</p>
          </div>
          <div class="stat-card">
            <h3>${uniqueViewers.toLocaleString()}</h3>
            <p>Unique Viewers</p>
          </div>
          <div class="stat-card">
            <h3>${avgViewTime}s</h3>
            <p>Avg. View Time</p>
          </div>
          <div class="stat-card">
            <h3>${engagementRate}%</h3>
            <p>Engagement Rate</p>
          </div>
        </div>
      </div>
      <div class="section">
        <h2>🖥️ Screen Information</h2>
        <div class="info-grid">
          <div class="info-card">
            <h3>Technical Specifications</h3>
            <div class="info-item">
              <span class="info-label">Screen Name:</span>
              <span class="info-value">${screen.name}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Location:</span>
              <span class="info-value">${
                screen.location_name || screen.city
              }</span>
            </div>
            <div class="info-item">
              <span class="info-label">Size:</span>
              <span class="info-value">${screen.screen_size_width}x${
      screen.screen_size_height
    } inches</span>
            </div>
            <div class="info-item">
              <span class="info-label">Status:</span>
              <span class="info-value">${
                screen.is_active ? "Active" : "Inactive"
              }</span>
            </div>
          </div>
          <div class="info-card">
            <h3>Performance Analytics</h3>
            <div class="info-item">
              <span class="info-label">Daily Footfall:</span>
              <span class="info-value">${dailyFootfall.toLocaleString()}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Peak Traffic:</span>
              <span class="info-value">${peakTraffic.toLocaleString()}</span>
            </div>
            <div class="info-item">
              <span class="info-label">Demographics:</span>
              <span class="info-value">${demographicData}</span>
            </div>
            <div class="info-item">
              <span class="info-label">ROI:</span>
              <span class="info-value">${roi}%</span>
            </div>
          </div>
        </div>
      </div>
      <div class="section">
        <h2>📊 Performance Analysis</h2>
        <div class="performance-graph">
          <div class="chart-placeholder">
            <div>📈 Daily Performance Trends</div>
            <small>Peak Hours: ${
              screen.peak_hours || "6PM-10PM"
            } | Avg. Engagement: ${engagementRate}%</small>
          </div>
        </div>
        <div class="performance-graph">
          <div class="chart-placeholder">
            <div>👥 Audience Demographics</div>
            <small>Primary: ${demographicData} | View Duration: ${avgViewTime}s average</small>
          </div>
        </div>
      </div>
      <div class="section">
        <h2>💡 Strategic Recommendations</h2>
        <div class="recommendations">
          <h3 style="margin-top: 0; color: #2d3748;">Optimization Strategies:</h3>
          <ul>
            <li><strong>Peak Hour Optimization:</strong> Schedule premium content during ${
              screen.peak_hours || "6PM-10PM"
            } for maximum engagement and higher rates</li>
            <li><strong>Demographic Targeting:</strong> Tailor campaigns to ${
              screen.demographics || "general audience"
            } demographics for better conversion</li>
            <li><strong>Location Advantage:</strong> Leverage the prime location in ${
              screen.city || "metropolitan area"
            } for premium pricing</li>
            <li><strong>Duration Strategy:</strong> Recommend 15-30 second slots for optimal attention retention based on ${avgViewTime}s average view time</li>
            <li><strong>Seasonal Campaigns:</strong> Plan campaigns around local events and seasonal trends in the area</li>
            <li><strong>ROI Enhancement:</strong> Current ${roi}% ROI indicates strong performance - consider expanding campaign duration</li>
          </ul>
        </div>
      </div>
    </div>
    <div class="footer">
      <p><strong>© 2025 Doohgle Analytics</strong> - Professional Digital Screen Management Platform</p>
      <p style="margin-top: 10px; font-size: 0.9em;">Report generated on ${currentDate} at ${currentTime} | Contact: analytics@doohgle.com</p>
    </div>
  </div>
</body>
</html>`;

    // Write content to print window and trigger print
    printWindow.document.write(htmlContent);
    printWindow.document.close();

    // Auto-print after content loads
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  // Enhanced screen visibility service with auto-refresh
  const { screens, loading, error, refresh, debugLogAllScreens } =
    useAdsManagerScreens();

  useEffect(() => {
    // Initial load and debug log
    debugLogAllScreens();
  }, [debugLogAllScreens]);

  // Debug: Log all screens being rendered
  useEffect(() => {
    if (screens && screens.length > 0) {
      console.log(`🎯 ADS MANAGER: Rendering ${screens.length} screens`);
      screens.slice(0, 3).forEach((screen, index) => {
        console.log(`   Screen ${index + 1}: ${screen.name}`, {
          id: screen.id,
          image_urls: screen.image_urls,
          image_url: screen.image_url,
          hasImageUrls: !!screen.image_urls,
          hasImageUrl: !!screen.image_url,
        });
      });
    }
  }, [screens]);

  const filteredScreens =
    screens?.filter((screen) => {
      const matchesSearch =
        screen.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.location_name
          ?.toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        screen.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesStatus =
        statusFilter === "all" || (statusFilter === "active" ? true : true); // All screens from visibility service are active for ads

      const matchesCity =
        cityFilter === "all" ||
        screen.city?.toLowerCase().includes(cityFilter.toLowerCase());

      return matchesSearch && matchesStatus && matchesCity;
    }) || [];

  // Get unique cities for filter
  const uniqueCities = [
    ...new Set(screens?.map((screen) => screen.city).filter(Boolean)),
  ];

  // Calculate summary stats
  const totalScreens = screens?.length || 0;
  const activeScreens = screens?.length || 0; // All screens from visibility service are available for ads
  const totalRevenue =
    screens?.reduce((sum, screen) => {
      const hourlyRate = screen.cost_per_10_seconds
        ? screen.cost_per_10_seconds * 360
        : 500; // Convert per 10s to hourly or default
      const hoursPerDay = 12; // Assume 12 hours active per day
      return sum + hourlyRate * hoursPerDay * 30; // 30 days
    }, 0) || 0;

  const totalFootfall =
    screens?.reduce((sum, screen) => sum + (screen.daily_footfall || 0), 0) ||
    0;

  if (loading) {
    return (
      <div className="p-8">
        <LoadingScreen />
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
        >
          <AlertCircle className="mx-auto text-red-500 mb-4" size={48} />
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Failed to Load Screens
          </h3>
          <p className="text-red-600 mb-4">{error}</p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={refresh}
            className="bg-red-500 text-white px-6 py-2 rounded-lg hover:bg-red-600 transition-colors flex items-center mx-auto space-x-2"
          >
            <RefreshCw size={18} />
            <span>Retry</span>
          </motion.button>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-8 bg-gray-50 min-h-screen">
      {/* Header Section */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-8"
      >
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-800 mb-2 flex items-center">
              <Monitor className="mr-3 text-blue-600" size={32} />
              Screen Manager
              <motion.div
                className="ml-3 bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                {totalScreens} Screens
              </motion.div>
            </h1>
            <p className="text-gray-600">
              Manage and monitor all your digital advertising screens
            </p>
          </div>

          {/* Action buttons with enhanced visibility features */}
          <div className="flex flex-col sm:flex-row gap-3 mt-4 md:mt-0">
            <motion.button
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                debugLogAllScreens();
                console.log(
                  "📊 Debug: Logged all available screens to console"
                );
              }}
            >
              <Eye size={18} />
              <span>Debug Visibility</span>
            </motion.button>

            <motion.button
              className="flex items-center space-x-2 bg-blue-600 text-white px-4 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => {
                refresh();
                console.log(
                  "🔄 Screens refreshed - ensuring all venue listings are visible!"
                );
              }}
            >
              <RefreshCw size={18} />
              <span>Refresh Screens</span>
            </motion.button>

            <motion.button
              className="flex items-center space-x-2 bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowBookingModal(true)}
            >
              <Plus size={18} />
              <span>Book Screen</span>
            </motion.button>
          </div>
        </div>

        {/* Screen Visibility Status Banner */}
        {!loading && screens && screens.length > 0 && (
          <motion.div
            className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="flex items-center space-x-3">
              <CheckCircle className="text-green-600" size={20} />
              <div>
                <p className="text-green-800 font-medium">
                  ✅ Screen Visibility Enabled
                </p>
                <p className="text-green-600 text-sm">
                  {screens.length} screens are now visible to advertisers and
                  ready for bookings. All venue listings automatically appear in
                  the ads manager.
                </p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Error Banner */}
        {error && (
          <motion.div
            className="bg-red-50 border border-red-200 rounded-lg p-4 mb-6"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="flex items-center space-x-3">
              <AlertCircle className="text-red-600" size={20} />
              <div>
                <p className="text-red-800 font-medium">Connection Issue</p>
                <p className="text-red-600 text-sm">{error}</p>
              </div>
            </div>
          </motion.div>
        )}

        {/* Animated Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Total Screens
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={totalScreens} />
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-lg">
                <Monitor className="text-blue-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">12%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Active Screens
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={activeScreens} />
                </p>
              </div>
              <div className="p-3 bg-green-100 rounded-lg">
                <CheckCircle className="text-green-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span className="text-gray-600">
                  {Math.round((activeScreens / totalScreens) * 100) || 0}%
                  uptime
                </span>
              </div>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Monthly Revenue
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  ₹<AnimatedCounter value={totalRevenue} decimals={0} />
                </p>
              </div>
              <div className="p-3 bg-yellow-100 rounded-lg">
                <DollarSign className="text-yellow-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">8%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 hover:shadow-xl transition-shadow"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
            whileHover={{ y: -5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600 mb-1">
                  Daily Footfall
                </p>
                <p className="text-2xl font-bold text-gray-900">
                  <AnimatedCounter value={totalFootfall} />
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-lg">
                <Users className="text-purple-600" size={24} />
              </div>
            </div>
            <div className="flex items-center mt-4 text-sm">
              <ArrowUp className="text-green-500 mr-1" size={16} />
              <span className="text-green-500 font-medium">15%</span>
              <span className="text-gray-600 ml-1">vs last month</span>
            </div>
          </motion.div>
        </div>

        {/* Search and Filter Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
        >
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search Bar */}
            <div className="flex-1">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={20}
                />
                <input
                  type="text"
                  placeholder="Search screens by name, location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
            </div>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
              <option value="maintenance">Maintenance</option>
            </select>

            {/* City Filter */}
            <select
              value={cityFilter}
              onChange={(e) => setCityFilter(e.target.value)}
              className="px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="all">All Cities</option>
              {uniqueCities.map((city) => (
                <option key={city} value={city}>
                  {city}
                </option>
              ))}
            </select>

            <motion.button
              className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200 shadow-sm"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowMoreFilters(!showMoreFilters)}
            >
              <Filter size={18} />
              <span>More Filters</span>
            </motion.button>
          </div>

          {/* More Filters Panel */}
          <AnimatePresence>
            {showMoreFilters && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 p-4 bg-white rounded-lg border border-gray-200 shadow-sm"
              >
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Size Range
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="all">All Sizes</option>
                      <option value="small">Small (20-40 inches)</option>
                      <option value="medium">Medium (40-60 inches)</option>
                      <option value="large">Large (60+ inches)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Price Range
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="all">All Prices</option>
                      <option value="budget">Budget (₹0-50)</option>
                      <option value="mid">Mid-range (₹50-100)</option>
                      <option value="premium">Premium (₹100+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Footfall Range
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="all">All Traffic</option>
                      <option value="low">Low (0-500)</option>
                      <option value="medium">Medium (500-1500)</option>
                      <option value="high">High (1500+)</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Screen Type
                    </label>
                    <select className="w-full px-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                      <option value="all">All Types</option>
                      <option value="led">LED</option>
                      <option value="lcd">LCD</option>
                      <option value="digital">Digital Billboard</option>
                    </select>
                  </div>
                </div>
                <div className="flex justify-end space-x-3 mt-4">
                  <motion.button
                    className="px-4 py-2 text-gray-600 hover:text-gray-800 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => setShowMoreFilters(false)}
                  >
                    Cancel
                  </motion.button>
                  <motion.button
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Apply Filters
                  </motion.button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Results count */}
          <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
            <span>
              Showing {filteredScreens.length} of {totalScreens} screens
            </span>
            <span>Updated {new Date().toLocaleTimeString()}</span>
          </div>
        </motion.div>
      </motion.div>

      {/* Screens Grid */}
      <AnimatePresence mode="popLayout">
        <motion.div
          className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6"
          layout
        >
          {filteredScreens.map((screenResult, index) => {
            const screen = screenResult as Screen; // Cast to our enhanced interface
            return (
              <motion.div
                key={screen.id}
                layout
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                transition={{
                  delay: index * 0.1,
                  type: "spring",
                  stiffness: 100,
                }}
                whileHover={{ y: -5, scale: 1.02 }}
                className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden hover:shadow-2xl transition-all duration-300"
              >
                {/* Screen Header */}
                <div className="relative">
                  <div className="h-48 bg-gradient-to-br from-gray-100 to-gray-200 flex items-center justify-center overflow-hidden">
                    {(() => {
                      // Helper function to get the primary image URL (same logic as Screen Manager)
                      const getPrimaryImageUrl = (
                        screen: any
                      ): string | null => {
                        // Debug logging to see what data we're getting
                        console.log(
                          `🔍 ADS MANAGER - Screen ${screen.id} (${screen.name}):`,
                          {
                            image_urls: screen.image_urls,
                            image_url: screen.image_url,
                            type_image_urls: typeof screen.image_urls,
                            type_image_url: typeof screen.image_url,
                          }
                        );

                        // Check if we have uploaded images in image_urls
                        if (screen.image_urls) {
                          try {
                            const urls = JSON.parse(screen.image_urls);
                            if (Array.isArray(urls) && urls.length > 0) {
                              // Use first uploaded image
                              const imageUrl = urls[0];
                              // Convert relative paths to full URLs
                              if (imageUrl.startsWith("/api/")) {
                                const fullUrl = `http://localhost:4000${imageUrl}`;
                                console.log(
                                  `✅ ADS MANAGER - Using uploaded image for screen ${screen.id}: ${fullUrl}`
                                );
                                return fullUrl;
                              }
                              console.log(
                                `✅ ADS MANAGER - Using external image for screen ${screen.id}: ${imageUrl}`
                              );
                              return imageUrl;
                            }
                          } catch (e) {
                            console.warn(
                              "Failed to parse image_urls:",
                              e,
                              screen.image_urls
                            );
                          }
                        }

                        // Check if we have a primary image_url
                        if (screen.image_url) {
                          // Convert relative paths to full URLs
                          if (screen.image_url.startsWith("/api/")) {
                            const fullUrl = `http://localhost:4000${screen.image_url}`;
                            console.log(
                              `✅ ADS MANAGER - Using image_url for screen ${screen.id}: ${fullUrl}`
                            );
                            return fullUrl;
                          }
                          console.log(
                            `✅ ADS MANAGER - Using external image_url for screen ${screen.id}: ${screen.image_url}`
                          );
                          return screen.image_url;
                        }

                        console.log(
                          `⚠️ ADS MANAGER - No image found for screen ${screen.id}, showing monitor icon`
                        );
                        return null; // No image available
                      };

                      const imageUrl = getPrimaryImageUrl(screen);

                      // Show image if available, otherwise show monitor icon
                      if (imageUrl) {
                        return (
                          <img
                            src={imageUrl}
                            alt={screen.name || "Screen"}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                              // Replace image with monitor icon on error
                              const parentDiv = e.currentTarget.parentElement;
                              if (parentDiv) {
                                parentDiv.innerHTML =
                                  '<div class="flex items-center justify-center w-full h-full"><svg class="text-gray-400" width="64" height="64" fill="none" stroke="currentColor" viewBox="0 0 24 24"><rect x="2" y="3" width="20" height="14" rx="2" ry="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg></div>';
                              }
                            }}
                          />
                        );
                      } else {
                        // Show monitor icon when no image is available
                        return (
                          <div className="flex items-center justify-center w-full h-full">
                            <Monitor className="text-gray-400" size={64} />
                          </div>
                        );
                      }
                    })()}
                  </div>

                  {/* Status Badge */}
                  <div className="absolute top-4 right-4">
                    <motion.div
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      className={`px-3 py-1 rounded-full text-xs font-semibold ${
                        true // All screens from visibility service are active
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      Available for Ads
                    </motion.div>
                  </div>

                  {/* Screen Size Badge */}
                  <div className="absolute top-4 left-4">
                    <div className="bg-black bg-opacity-70 text-white px-2 py-1 rounded text-xs">
                      {screen.screen_size_width}x{screen.screen_size_height}"
                    </div>
                  </div>
                </div>

                {/* Screen Details */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex-1">
                      <h3 className="text-xl font-bold text-gray-900 mb-2">
                        {screen.name}
                      </h3>
                      <div className="flex items-center text-gray-600 text-sm mb-3">
                        <MapPin className="mr-1" size={14} />
                        <span className="font-medium">
                          {screen.location_name ||
                            screen.address ||
                            screen.city ||
                            "Location not specified"}
                        </span>
                      </div>
                      {screen.description && (
                        <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                          {screen.description}
                        </p>
                      )}
                      <div className="flex items-center space-x-3 text-xs">
                        <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                          {screen.screen_type || "Digital Display"}
                        </span>
                        <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full">
                          Prime Location
                        </span>
                        {screen.peak_hours && (
                          <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded-full">
                            Peak: {screen.peak_hours}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Comprehensive Screen Information */}
                  <div className="space-y-4 mb-6">
                    {/* Technical Specifications */}
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Monitor className="mr-2" size={16} />
                        Technical Specs
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Size:</span>
                          <span className="ml-2 font-medium">
                            {screen.screen_size_width || "N/A"}×
                            {screen.screen_size_height || "N/A"}"
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Type:</span>
                          <span className="ml-2 font-medium">
                            {screen.screen_type || "LED Display"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Resolution:</span>
                          <span className="ml-2 font-medium">
                            {screen.resolution || "1920×1080 HD"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Orientation:</span>
                          <span className="ml-2 font-medium">
                            {screen.orientation || "Landscape"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Location & Audience */}
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <Users className="mr-2" size={16} />
                        Audience & Traffic
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Daily Footfall:</span>
                          <span className="ml-2 font-bold text-blue-600">
                            {(screen.daily_footfall || 0).toLocaleString()}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Demographics:</span>
                          <span className="ml-2 font-medium">
                            {screen.demographics || "Mixed Audience"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Peak Hours:</span>
                          <span className="ml-2 font-medium">
                            {screen.peak_hours || "6PM-10PM"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Area Type:</span>
                          <span className="ml-2 font-medium">
                            {screen.area_type || "Commercial"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Pricing & Availability */}
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <DollarSign className="mr-2" size={16} />
                        Pricing & Terms
                      </h4>
                      <div className="grid grid-cols-2 gap-3 text-sm">
                        <div>
                          <span className="text-gray-600">Cost per 10s:</span>
                          <span className="ml-2 font-bold text-green-600">
                            ₹{screen.cost_per_10_seconds || 15}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Hourly Rate:</span>
                          <span className="ml-2 font-bold text-green-600">
                            ₹
                            {screen.cost_per_10_seconds
                              ? screen.cost_per_10_seconds * 360
                              : 540}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Min Duration:</span>
                          <span className="ml-2 font-medium">
                            {screen.minimum_duration || "30 seconds"}
                          </span>
                        </div>
                        <div>
                          <span className="text-gray-600">Availability:</span>
                          <span className="ml-2 font-medium text-green-600">
                            {screen.operating_hours || "24/7"}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Contact & Owner Info */}
                    {(screen.venue_owner_name ||
                      screen.contact_email ||
                      screen.contact_phone) && (
                      <div className="bg-purple-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <User className="mr-2" size={16} />
                          Contact Information
                        </h4>
                        <div className="grid grid-cols-1 gap-2 text-sm">
                          {screen.venue_owner_name && (
                            <div>
                              <span className="text-gray-600">Owner:</span>
                              <span className="ml-2 font-medium">
                                {screen.venue_owner_name}
                              </span>
                            </div>
                          )}
                          {screen.contact_email && (
                            <div>
                              <span className="text-gray-600">Email:</span>
                              <span className="ml-2 font-medium">
                                {screen.contact_email}
                              </span>
                            </div>
                          )}
                          {screen.contact_phone && (
                            <div>
                              <span className="text-gray-600">Phone:</span>
                              <span className="ml-2 font-medium">
                                {screen.contact_phone}
                              </span>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Performance Metrics */}
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <TrendingUp className="mr-2" size={16} />
                        Performance Metrics
                      </h4>
                      <div className="grid grid-cols-3 gap-3 text-sm">
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {Math.floor(Math.random() * 30) + 85}%
                          </div>
                          <div className="text-gray-600">Visibility Rate</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {Math.floor(Math.random() * 3) + 7}.
                            {Math.floor(Math.random() * 9)}s
                          </div>
                          <div className="text-gray-600">Avg View Time</div>
                        </div>
                        <div className="text-center">
                          <div className="text-lg font-bold text-yellow-600">
                            {Math.floor(Math.random() * 50) + 120}%
                          </div>
                          <div className="text-gray-600">ROI Potential</div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Enhanced Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <motion.button
                      className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-blue-600 to-blue-700 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedScreen(screen);
                        setShowViewModal(true);
                      }}
                    >
                      <Eye size={20} />
                      <span className="font-semibold">View Full Details</span>
                    </motion.button>

                    <motion.button
                      className="flex-1 flex items-center justify-center space-x-3 bg-gradient-to-r from-green-600 to-green-700 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-green-800 transition-all duration-200 shadow-lg hover:shadow-xl transform hover:-translate-y-1"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedScreen(screen);
                        setShowAnalyticsModal(true);
                      }}
                    >
                      <BarChart3 size={20} />
                      <span className="font-semibold">
                        Performance Analytics
                      </span>
                    </motion.button>
                  </div>

                  {/* Quick Action Secondary Buttons */}
                  <div className="flex space-x-2 pt-2 border-t border-gray-100">
                    <motion.button
                      className="flex-1 flex items-center justify-center space-x-2 bg-purple-100 text-purple-700 py-2 px-4 rounded-lg hover:bg-purple-200 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        setSelectedScreen(screen);
                        setShowBookingModal(true);
                      }}
                    >
                      <Plus size={16} />
                      <span>Book Now</span>
                    </motion.button>

                    <motion.button
                      className="flex-1 flex items-center justify-center space-x-2 bg-orange-100 text-orange-700 py-2 px-4 rounded-lg hover:bg-orange-200 transition-colors text-sm font-medium"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        navigator.clipboard.writeText(
                          `${screen.name} - ${
                            screen.location_name || screen.city
                          } - ₹${
                            screen.cost_per_10_seconds
                              ? screen.cost_per_10_seconds * 360
                              : 540
                          }/hr`
                        );
                      }}
                    >
                      <Download size={16} />
                      <span>Share Details</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </AnimatePresence>

      {/* Empty State */}
      {filteredScreens.length === 0 && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16"
        >
          <Monitor className="mx-auto text-gray-300 mb-4" size={64} />
          <h3 className="text-xl font-semibold text-gray-600 mb-2">
            No screens found
          </h3>
          <p className="text-gray-500 mb-6">
            Try adjusting your search or filter criteria
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCityFilter("all");
            }}
            className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Clear Filters
          </motion.button>
        </motion.div>
      )}

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalyticsModal && selectedScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowAnalyticsModal(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <BarChart3 className="mr-3 text-blue-600" />
                  Analytics Dashboard
                </h2>
                <div className="flex space-x-2">
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => generateAnalyticsReport(selectedScreen)}
                    className="flex items-center space-x-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors"
                  >
                    <Download size={16} />
                    <span>Download Report</span>
                  </motion.button>

                  <button
                    onClick={() => setShowAnalyticsModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    <X size={20} className="text-gray-500" />
                  </button>
                </div>
              </div>

              {/* Analytics Content */}
              <div className="space-y-6">
                <div className="bg-gray-50 rounded-xl p-4">
                  <h3 className="text-lg font-semibold mb-4">
                    Screen: {selectedScreen.name}
                  </h3>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white rounded-lg p-4 text-center">
                      <Users className="mx-auto text-blue-500 mb-2" />
                      <p className="text-sm text-gray-600">Daily Footfall</p>
                      <p className="text-xl font-bold">
                        {(
                          selectedScreen.daily_footfall || 1000
                        ).toLocaleString()}
                      </p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <TrendingUp className="mx-auto text-green-500 mb-2" />
                      <p className="text-sm text-gray-600">Engagement</p>
                      <p className="text-xl font-bold">87.2%</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <Clock className="mx-auto text-orange-500 mb-2" />
                      <p className="text-sm text-gray-600">Avg. View Time</p>
                      <p className="text-xl font-bold">8.5s</p>
                    </div>
                    <div className="bg-white rounded-lg p-4 text-center">
                      <DollarSign className="mx-auto text-purple-500 mb-2" />
                      <p className="text-sm text-gray-600">ROI</p>
                      <p className="text-xl font-bold">145%</p>
                    </div>
                  </div>
                </div>

                <div className="bg-gray-50 rounded-xl p-4">
                  <h4 className="text-lg font-semibold mb-4">
                    Performance Charts
                  </h4>
                  <div className="bg-white rounded-lg p-6 border-2 border-dashed border-gray-300 text-center">
                    <BarChart3
                      size={48}
                      className="mx-auto text-gray-400 mb-4"
                    />
                    <p className="text-gray-600">
                      Interactive charts would be displayed here
                    </p>
                    <p className="text-sm text-gray-500 mt-2">
                      Peak Hours: {selectedScreen.peak_hours || "6PM-10PM"}
                    </p>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* View Details Modal */}
      <AnimatePresence>
        {showViewModal && selectedScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={(e) => {
              if (e.target === e.currentTarget) {
                setShowViewModal(false);
              }
            }}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="bg-white rounded-2xl p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900 flex items-center">
                  <Eye className="mr-3 text-blue-600" />
                  Screen Details
                </h2>
                <button
                  onClick={() => setShowViewModal(false)}
                  className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                >
                  <X size={20} className="text-gray-500" />
                </button>
              </div>

              {/* Screen Details Content */}
              <div className="space-y-6">
                {/* Header Info */}
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-xl p-6 border border-blue-100">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    {selectedScreen.name}
                  </h3>
                  <div className="flex items-center text-gray-600 mb-4">
                    <MapPin className="mr-2" size={16} />
                    <span className="text-lg">
                      {selectedScreen.location_name ||
                        selectedScreen.address ||
                        selectedScreen.city}
                    </span>
                  </div>
                  {selectedScreen.description && (
                    <p className="text-gray-700 bg-white bg-opacity-60 p-3 rounded-lg">
                      {selectedScreen.description}
                    </p>
                  )}
                </div>

                {/* Comprehensive Details Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Technical Specifications */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Monitor className="mr-2 text-blue-600" size={20} />
                      Technical Specifications
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Screen Size:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.screen_size_width}×
                          {selectedScreen.screen_size_height}"
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Display Type:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.screen_type || "LED Display"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Resolution:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.resolution || "1920×1080 HD"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Orientation:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.orientation || "Landscape"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Status:</span>
                        <span
                          className={`font-semibold px-2 py-1 rounded-full text-xs ${
                            selectedScreen.is_active
                              ? "bg-green-100 text-green-800"
                              : "bg-red-100 text-red-800"
                          }`}
                        >
                          {selectedScreen.is_active ? "Active" : "Inactive"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Audience & Traffic Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Users className="mr-2 text-green-600" size={20} />
                      Audience & Traffic
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Daily Footfall:</span>
                        <span className="font-bold text-green-600 text-lg">
                          {(
                            selectedScreen.daily_footfall || 1000
                          ).toLocaleString()}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Demographics:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.demographics || "Mixed Audience"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Peak Hours:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.peak_hours || "6PM-10PM"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Area Type:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.area_type || "Commercial"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Visibility Score:</span>
                        <span className="font-bold text-blue-600">
                          {Math.floor(Math.random() * 30) + 85}%
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Pricing & Terms */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="mr-2 text-purple-600" size={20} />
                      Pricing & Terms
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Cost per 10 seconds:
                        </span>
                        <span className="font-bold text-purple-600 text-lg">
                          ₹{selectedScreen.cost_per_10_seconds || 15}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Hourly Rate:</span>
                        <span className="font-bold text-purple-600 text-lg">
                          ₹
                          {selectedScreen.cost_per_10_seconds
                            ? selectedScreen.cost_per_10_seconds * 360
                            : 540}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Minimum Duration:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.minimum_duration || "30 seconds"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Operating Hours:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.operating_hours || "6AM-11PM"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">
                          Booking Lead Time:
                        </span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.booking_lead_time || "24 hours"}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contact & Owner Information */}
                  <div className="bg-white border border-gray-200 rounded-xl p-5">
                    <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="mr-2 text-orange-600" size={20} />
                      Contact Information
                    </h4>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Owner Name:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.venue_owner_name || "Venue Owner"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Email:</span>
                        <span className="font-semibold text-gray-900 text-sm">
                          {selectedScreen.contact_email || "contact@venue.com"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Contact Phone:</span>
                        <span className="font-semibold text-gray-900">
                          {selectedScreen.contact_phone || "+91-XXX-XXX-XXXX"}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Response Time:</span>
                        <span className="font-semibold text-green-600">
                          Usually within 2 hours
                        </span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Performance Metrics */}
                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-xl p-6 border border-yellow-200">
                  <h4 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                    <TrendingUp className="mr-2 text-yellow-600" size={20} />
                    Performance Metrics & Analytics
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="text-center bg-white bg-opacity-60 rounded-lg p-4">
                      <div className="text-2xl font-bold text-blue-600">
                        {Math.floor(Math.random() * 3) + 7}.
                        {Math.floor(Math.random() * 9)}s
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Avg View Time
                      </div>
                    </div>
                    <div className="text-center bg-white bg-opacity-60 rounded-lg p-4">
                      <div className="text-2xl font-bold text-green-600">
                        {Math.floor(Math.random() * 20) + 75}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Engagement Rate
                      </div>
                    </div>
                    <div className="text-center bg-white bg-opacity-60 rounded-lg p-4">
                      <div className="text-2xl font-bold text-purple-600">
                        {Math.floor(Math.random() * 50) + 120}%
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        ROI Potential
                      </div>
                    </div>
                    <div className="text-center bg-white bg-opacity-60 rounded-lg p-4">
                      <div className="text-2xl font-bold text-orange-600">
                        {Math.floor(Math.random() * 5) + 4}.
                        {Math.floor(Math.random() * 9)}★
                      </div>
                      <div className="text-sm text-gray-600 mt-1">
                        Screen Rating
                      </div>
                    </div>
                  </div>
                  <div className="mt-4 p-3 bg-white bg-opacity-60 rounded-lg">
                    <p className="text-sm text-gray-700">
                      <strong>Analytics Insight:</strong> This screen shows
                      excellent performance with high engagement rates during
                      peak hours {selectedScreen.peak_hours || "6PM-10PM"}. Best
                      suited for{" "}
                      {selectedScreen.demographics || "general audience"}{" "}
                      targeting campaigns.
                    </p>
                  </div>
                </div>

                <div className="flex space-x-4">
                  <motion.button
                    className="flex-1 bg-blue-600 text-white py-3 rounded-lg hover:bg-blue-700 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowViewModal(false);
                      setShowBookingModal(true);
                    }}
                  >
                    Book This Screen
                  </motion.button>
                  <motion.button
                    className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg hover:bg-gray-300 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setShowViewModal(false);
                      setShowAnalyticsModal(true);
                    }}
                  >
                    View Analytics
                  </motion.button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Booking Modal */}
      <AnimatePresence>
        {showBookingModal && (
          <AWSScreenBookingModal
            isOpen={showBookingModal}
            onClose={() => {
              setShowBookingModal(false);
              setSelectedScreen(null);
            }}
            screen={
              selectedScreen
                ? {
                    id: selectedScreen.id,
                    screen_name:
                      selectedScreen.name ||
                      selectedScreen.location_name ||
                      "Unknown Screen",
                    location_name:
                      selectedScreen.location_name ||
                      selectedScreen.name ||
                      "Unknown Location",
                    city: selectedScreen.city || "Unknown City",
                    state: selectedScreen.state || "Unknown State",
                    hourly_rate:
                      selectedScreen.price_per_hour ||
                      (selectedScreen.cost_per_10_seconds
                        ? selectedScreen.cost_per_10_seconds * 360
                        : 100),
                    daily_footfall: selectedScreen.daily_footfall || 0,
                    image_urls: selectedScreen.image_url,
                  }
                : null
            }
            onBookingSuccess={(booking) => {
              console.log("Booking successful:", booking);
              setShowBookingModal(false);
              setSelectedScreen(null);
              // Refresh screens data or show success message
            }}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScreenManager;
