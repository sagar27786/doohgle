// Professional Screen Manager Component - Enhanced with animations
import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Filter,
  MapPin,
  Monitor,
  Settings,
  Eye,
  BarChart3,
  AlertCircle,
  CheckCircle,
  RefreshCw,
  Plus,
  Download,
  Upload,
  Zap,
  Activity,
  Globe,
  ArrowUp,
  ArrowDown,
  Target,
  X,
  TrendingUp,
  Users,
  Clock,
  DollarSign,
  Calendar,
  MapIcon,
} from "lucide-react";

// Backend Integration
import { useScreens } from "../../../hooks/useAdsManager";
import { Screen as BackendScreen } from "../../../services/adsManagerService";
import ScreenBookingModal from "../../Booking/ScreenBookingModal";

interface Screen extends BackendScreen {
  // Frontend-specific fields can be added here
}

// Professional Loading screen component
const LoadingScreen: React.FC = () => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="flex items-center justify-center h-64"
    >
      <div className="text-center">
        {/* Animated Logo */}
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

        {/* Loading Bar */}
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
  const [bookingRequests, setBookingRequests] = useState<any[]>([]);

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
    const costPer10Sec = screen.cost_per_10_seconds || 2.50;
    const engagementRate = 87.2;
    const roi = 145;
    
    const reportHtml = `
      <!DOCTYPE html>
      <html>
      <head>
        <title>Screen Analytics Report - ${screen.name}</title>
        <meta charset="UTF-8">
        <style>
          @page {
            margin: 0.5in;
            size: A4;
          }
          
          body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            margin: 0;
            padding: 0;
            background: white;
            color: #333;
            line-height: 1.6;
          }
          
          .container {
            max-width: 100%;
            margin: 0 auto;
            background: white;
          }
          
          .header {
            background: linear-gradient(135deg, #2d3748 0%, #4a5568 100%);
            color: white;
            padding: 40px 30px;
            text-align: center;
            margin-bottom: 30px;
          }
          
          .header h1 {
            margin: 0 0 10px 0;
            font-size: 2.8em;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.3);
          }
          
          .header .subtitle {
            font-size: 1.2em;
            opacity: 0.9;
            margin-bottom: 15px;
          }
          
          .header .meta {
            font-size: 0.95em;
            opacity: 0.8;
            display: flex;
            justify-content: center;
            gap: 30px;
            flex-wrap: wrap;
          }
          
          .content {
            padding: 0 30px 30px;
          }
          
          .section {
            margin-bottom: 35px;
            page-break-inside: avoid;
          }
          
          .section h2 {
            color: #2d3748;
            border-bottom: 3px solid #38a169;
            padding-bottom: 12px;
            margin-bottom: 25px;
            font-size: 1.5em;
            font-weight: 600;
            display: flex;
            align-items: center;
            gap: 10px;
          }
          
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
          }
          
          .stat-card {
            background: linear-gradient(135deg, #38a169 0%, #48bb78 100%);
            color: white;
            padding: 25px 20px;
            border-radius: 12px;
            text-align: center;
            box-shadow: 0 8px 25px rgba(56, 161, 105, 0.15);
            position: relative;
            overflow: hidden;
          }
          
          .stat-card::before {
            content: '';
            position: absolute;
            top: 0;
            right: 0;
            width: 60px;
            height: 60px;
            background: rgba(255, 255, 255, 0.1);
            border-radius: 50%;
            transform: translate(20px, -20px);
          }
          
          .stat-card h3 {
            margin: 0 0 8px 0;
            font-size: 2.2em;
            font-weight: 700;
            text-shadow: 0 2px 4px rgba(0,0,0,0.2);
          }
          
          .stat-card p {
            margin: 0;
            font-size: 0.95em;
            opacity: 0.95;
            font-weight: 500;
          }
          
          .info-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
            gap: 18px;
          }
          
          .info-item {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            border-left: 5px solid #38a169;
            box-shadow: 0 2px 8px rgba(0,0,0,0.05);
          }
          
          .info-item strong {
            color: #2d3748;
            font-weight: 600;
          }
          
          .chart-container {
            background: #f8fafc;
            border-radius: 12px;
            padding: 25px;
            margin: 20px 0;
            text-align: center;
            border: 1px solid #e2e8f0;
          }
          
          .progress-bar {
            background: #e2e8f0;
            height: 12px;
            border-radius: 6px;
            overflow: hidden;
            margin: 10px 0;
          }
          
          .progress-fill {
            height: 100%;
            background: linear-gradient(90deg, #38a169 0%, #48bb78 100%);
            border-radius: 6px;
            transition: width 0.3s ease;
          }
          
          .metrics-row {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin: 20px 0;
          }
          
          .metric-item {
            text-align: center;
            padding: 15px;
            background: white;
            border-radius: 8px;
            border: 1px solid #e2e8f0;
          }
          
          .metric-value {
            font-size: 1.5em;
            font-weight: 700;
            color: #38a169;
            margin-bottom: 5px;
          }
          
          .metric-label {
            font-size: 0.85em;
            color: #64748b;
            text-transform: uppercase;
            letter-spacing: 0.5px;
          }
          
          .recommendations {
            background: linear-gradient(135deg, #f0fff4 0%, #c6f6d5 100%);
            border: 1px solid #9ae6b4;
            border-radius: 12px;
            padding: 25px;
          }
          
          .recommendations ul {
            margin: 15px 0;
            padding-left: 25px;
          }
          
          .recommendations li {
            margin-bottom: 12px;
            line-height: 1.6;
            color: #2d3748;
          }
          
          .footer {
            background: #f8fafc;
            padding: 25px;
            text-align: center;
            border-top: 2px solid #e2e8f0;
            margin-top: 40px;
          }
          
          .footer p {
            margin: 0;
            color: #64748b;
            font-weight: 500;
          }
          
          .duration-info {
            background: linear-gradient(135deg, #bee3f8 0%, #90cdf4 100%);
            border-radius: 10px;
            padding: 20px;
            margin: 20px 0;
            text-align: center;
          }
          
          .duration-info h3 {
            margin: 0 0 15px 0;
            color: #1a202c;
            font-size: 1.3em;
          }
          
          @media print {
            body { 
              background: white; 
              -webkit-print-color-adjust: exact;
              color-adjust: exact;
            }
            .container { 
              box-shadow: none; 
              max-width: 100%;
            }
            .section {
              page-break-inside: avoid;
            }
          }
        </style>
      </head>
      <body>
        <div class="container">
          <div class="header">
            <h1>${screen.name}</h1>
            <div class="subtitle">Comprehensive Analytics Report</div>
            <div class="meta">
              <span>📅 ${currentDate}</span>
              <span>🕐 ${currentTime}</span>
              <span>📍 ${screen.city || 'Metropolitan Area'}</span>
            </div>
          </div>
          
          <div class="content">
            <!-- Duration & Booking Information -->
            <div class="section">
              <h2>⏱️ Duration & Availability</h2>
              <div class="duration-info">
                <h3>Screen Operating Hours</h3>
                <div class="metrics-row">
                  <div class="metric-item">
                    <div class="metric-value">24/7</div>
                    <div class="metric-label">Availability</div>
                  </div>
                  <div class="metric-item">
                    <div class="metric-value">${screen.peak_hours || '6PM-10PM'}</div>
                    <div class="metric-label">Peak Hours</div>
                  </div>
                  <div class="metric-item">
                    <div class="metric-value">10s</div>
                    <div class="metric-label">Min Duration</div>
                  </div>
                  <div class="metric-item">
                    <div class="metric-value">$${costPer10Sec}</div>
                    <div class="metric-label">Cost/10sec</div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Key Performance Metrics -->
            <div class="section">
              <h2>📊 Key Performance Metrics</h2>
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
              
              <!-- Performance Charts -->
              <div class="chart-container">
                <h3 style="margin-top: 0; color: #2d3748;">📈 Performance Trends</h3>
                <div style="text-align: left;">
                  <div style="margin-bottom: 15px;">
                    <span style="font-weight: 600;">Daily Growth: +12.5%</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 85%;"></div>
                    </div>
                  </div>
                  <div style="margin-bottom: 15px;">
                    <span style="font-weight: 600;">Weekly Growth: +8.3%</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 70%;"></div>
                    </div>
                  </div>
                  <div style="margin-bottom: 15px;">
                    <span style="font-weight: 600;">ROI: ${roi}%</span>
                    <div class="progress-bar">
                      <div class="progress-fill" style="width: 95%;"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <!-- Location & Technical Details -->
            <div class="section">
              <h2>📍 Location & Technical Specifications</h2>
              <div class="info-grid">
                <div class="info-item">
                  <strong>Location:</strong> ${screen.location_name || 'Premium Location'}
                </div>
                <div class="info-item">
                  <strong>Address:</strong> ${screen.address || 'Prime Commercial Area'}
                </div>
                <div class="info-item">
                  <strong>City:</strong> ${screen.city || 'Metropolitan Area'}
                </div>
                <div class="info-item">
                  <strong>Resolution:</strong> ${screen.resolution_width || 1920}x${screen.resolution_height || 1080}
                </div>
                <div class="info-item">
                  <strong>Screen Type:</strong> ${screen.screen_type?.replace('_', ' ') || 'Premium LED Display'}
                </div>
                <div class="info-item">
                  <strong>Screen Size:</strong> ${screen.screen_size_width || 120}" x ${screen.screen_size_height || 80}"
                </div>
                <div class="info-item">
                  <strong>Demographics:</strong> ${screen.demographics || 'General audience (18-65)'}
                </div>
                <div class="info-item">
                  <strong>Visibility:</strong> High-traffic commercial zone
                </div>
              </div>
            </div>

            <!-- Analytics Insights -->
            <div class="section">
              <h2>📈 Detailed Analytics & Insights</h2>
              <div class="metrics-row">
                <div class="metric-item">
                  <div class="metric-value">68%</div>
                  <div class="metric-label">Prime Time Views</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">34%</div>
                  <div class="metric-label">Repeat Viewers</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">2.3x</div>
                  <div class="metric-label">Peak vs Off-Peak</div>
                </div>
                <div class="metric-item">
                  <div class="metric-value">92%</div>
                  <div class="metric-label">Uptime Reliability</div>
                </div>
              </div>
              
              <div class="chart-container">
                <h3 style="margin-top: 0; color: #2d3748;">📊 Hourly Traffic Distribution</h3>
                <div style="display: flex; justify-content: space-between; align-items: end; height: 100px; padding: 20px; background: white; border-radius: 8px; margin: 15px 0;">
                  <div style="width: 15px; height: 30%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 25%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 40%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 60%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 80%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 100%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 90%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 70%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 45%; background: #38a169; border-radius: 2px;"></div>
                  <div style="width: 15px; height: 35%; background: #38a169; border-radius: 2px;"></div>
                </div>
                <div style="display: flex; justify-content: space-between; font-size: 0.8em; color: #64748b;">
                  <span>6AM</span><span>9AM</span><span>12PM</span><span>3PM</span><span>6PM</span><span>9PM</span><span>12AM</span><span>3AM</span><span>6AM</span>
                </div>
              </div>
            </div>

            <!-- Recommendations -->
            <div class="section">
              <h2>💡 Strategic Recommendations</h2>
              <div class="recommendations">
                <h3 style="margin-top: 0; color: #2d3748;">Optimization Strategies:</h3>
                <ul>
                  <li><strong>Peak Hour Optimization:</strong> Schedule premium content during ${screen.peak_hours || '6PM-10PM'} for maximum engagement and higher rates</li>
                  <li><strong>Demographic Targeting:</strong> Tailor campaigns to ${screen.demographics || 'general audience'} demographics for better conversion</li>
                  <li><strong>Location Advantage:</strong> Leverage the prime location in ${screen.city || 'metropolitan area'} for premium pricing</li>
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
      </html>
    `;
            border-bottom: 3px solid #667eea;
            padding-bottom: 10px;
            margin-bottom: 20px;
            font-size: 1.4em;
          }
          .stats-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 25px;
          }
          .stat-card {
            background: linear-gradient(135deg, #f093fb 0%, #f5576c 100%);
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
            grid-template-columns: repeat(2, 1fr);
            gap: 15px;
          }
          .info-item {
            background: #f8f9fa;
            padding: 15px;
            border-radius: 8px;
            border-left: 4px solid #667eea;
          }
          .info-item strong {
            color: #667eea;
          }
          .footer {
            background: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-top: 1px solid #eee;
          }
          @media print {
            body { background: white; -webkit-print-color-adjust: exact; color-adjust: exact; }
            .container { box-shadow: none; max-width: 100%; }
            .section { page-break-inside: avoid; }
          }
        </style>
      </head>
      </html>`;

    printWindow.document.write(reportHtml);
    printWindow.document.close();
    
    // Auto-print after content loads
    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 500);
    };
  };

  const { screens, loading, error, refetch } = useScreens();

  useEffect(() => {
    refetch();
  }, [refetch]);

  const filteredScreens =
    screens?.filter((screen: Screen) => {
      const matchesSearch =
        screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.location_name?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus =
        statusFilter === "all" ||
        screen.is_active === (statusFilter === "active");
      const matchesCity = cityFilter === "all" || screen.city === cityFilter;
      return matchesSearch && matchesStatus && matchesCity;
    }) || [];

  // Get unique cities for filter
  const uniqueCities = screens
    ? [...new Set(screens.map((screen: Screen) => screen.city).filter(Boolean))]
    : [];

  // Calculate stats
  const totalScreens = screens?.length || 0;
  const activeScreens = screens?.filter((s) => s.is_active).length || 0;
  const offlineScreens = totalScreens - activeScreens;
  const utilizationRate =
    totalScreens > 0 ? (activeScreens / totalScreens) * 100 : 0;

  // Handle booking request
  const handleBookingRequest = (screenId: number, bookingData: any) => {
    // Store the booking request (in real app, this would be sent to backend)
    const newRequest = {
      id: Date.now(),
      ...bookingData,
      status: "pending",
      timestamp: new Date().toISOString(),
    };

    setBookingRequests((prev) => [...prev, newRequest]);

    // Show success notification (you can implement toast notifications)
    console.log("Booking request submitted:", newRequest);

    // In a real app, you would send this to the backend API
    // Example: await submitBookingRequest(newRequest);
  };

  const getStatusIcon = (isActive: boolean) => {
    return isActive ? (
      <CheckCircle size={16} className="text-green-500" />
    ) : (
      <AlertCircle size={16} className="text-red-500" />
    );
  };

  const getStatusColor = (isActive: boolean) => {
    return isActive
      ? "bg-green-100 text-green-800 border-green-200"
      : "bg-red-100 text-red-800 border-red-200";
  };

  const getStatusText = (isActive: boolean) => {
    return isActive ? "online" : "offline";
  };

  if (loading) {
    return <LoadingScreen />;
  }

  if (error) {
    return (
      <motion.div
        className="bg-red-50 border border-red-200 rounded-xl p-6 shadow-lg"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <div className="flex items-center space-x-3 mb-4">
          <AlertCircle className="text-red-600" size={24} />
          <h3 className="text-lg font-semibold text-red-800">
            Error Loading Screens
          </h3>
        </div>
        <p className="text-red-600 mb-4">{error}</p>
        <motion.button
          onClick={() => refetch()}
          className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 font-medium"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          Retry Loading
        </motion.button>
      </motion.div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="container mx-auto px-6 py-8">
        {/* Professional Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="mb-8"
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-4xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent mb-2">
                Screen Manager
              </h1>
              <p className="text-gray-600 text-lg">
                Monitor and manage your digital screens in real-time
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <motion.button
                onClick={() => refetch()}
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg hover:from-blue-700 hover:to-purple-700 transition-all font-semibold shadow-lg"
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.95 }}
              >
                <RefreshCw size={20} />
                <span>Refresh</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 bg-white text-gray-700 px-4 py-3 rounded-lg hover:bg-gray-50 transition-colors border border-gray-200"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowBookingModal(true)}
              >
                <Plus size={18} />
                <span>Book Screen</span>
              </motion.button>
            </div>
          </div>

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
                  <p className="text-sm font-medium text-gray-600">
                    Total Screens
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={totalScreens} />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-blue-100 to-cyan-100 rounded-lg">
                  <Monitor className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">12.5%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
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
                  <p className="text-sm font-medium text-gray-600">
                    Active Screens
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={activeScreens} />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-green-100 to-emerald-100 rounded-lg">
                  <Activity className="text-green-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">8.2%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
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
                  <p className="text-sm font-medium text-gray-600">
                    Offline Screens
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter value={offlineScreens} />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-red-100 to-pink-100 rounded-lg">
                  <AlertCircle className="text-red-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowDown className="text-red-600 mr-1" size={16} />
                <span className="text-red-600 font-medium">3.1%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
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
                  <p className="text-sm font-medium text-gray-600">
                    Utilization Rate
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    <AnimatedCounter
                      value={utilizationRate}
                      decimals={1}
                      suffix="%"
                    />
                  </p>
                </div>
                <div className="p-3 bg-gradient-to-r from-purple-100 to-violet-100 rounded-lg">
                  <Target className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">5.7%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Professional Search and Filters */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6"
        >
          <div className="flex flex-col lg:flex-row lg:items-center justify-between space-y-4 lg:space-y-0 lg:space-x-4">
            <div className="flex items-center space-x-4 flex-1">
              <div className="relative flex-1 max-w-md">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search screens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
            </div>

            <div className="flex items-center space-x-3">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="inactive">Offline</option>
              </select>

              <select
                value={cityFilter}
                onChange={(e) => setCityFilter(e.target.value)}
                className="border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="all">All Cities</option>
                {uniqueCities.map((city) => (
                  <option key={city} value={city}>
                    {city}
                  </option>
                ))}
              </select>

              <motion.button
                className="p-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Filter size={18} />
              </motion.button>
            </div>
          </div>
        </motion.div>

        {/* Professional Screen Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {filteredScreens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 + 0.1 * index }}
              className="bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all overflow-hidden group"
              whileHover={{ y: -5, scale: 1.02 }}
            >
              {/* Screen Header */}
              <div className="p-6 border-b border-gray-100">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <h3 className="font-bold text-lg text-gray-900 mb-1 group-hover:text-blue-600 transition-colors">
                      {screen.name}
                    </h3>
                    <p className="text-gray-600 text-sm">
                      {screen.location_name || "Unknown Location"}
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <div
                      className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                        screen.is_active
                      )}`}
                    >
                      <div className="flex items-center space-x-1">
                        {getStatusIcon(screen.is_active)}
                        <span>{getStatusText(screen.is_active)}</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Location */}
                {screen.city && (
                  <div className="flex items-center text-sm text-gray-600 mb-4">
                    <MapPin className="mr-2" size={16} />
                    <span>{screen.city}</span>
                  </div>
                )}

                {/* Screen Details */}
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Size:</span>
                    <span className="font-medium text-gray-900">
                      {screen.screen_size_width}"×{screen.screen_size_height}"
                    </span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Resolution:</span>
                    <span className="font-medium text-gray-900">
                      {screen.resolution_width}x{screen.resolution_height}
                    </span>
                  </div>
                </div>
              </div>

              {/* Screen Actions */}
              <div className="p-6">
                <div className="flex space-x-2">
                  <motion.button
                    className="flex-1 flex items-center justify-center space-x-2 bg-blue-100 text-blue-700 py-2 px-3 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedScreen(screen);
                      setShowViewModal(true);
                    }}
                  >
                    <Eye size={16} />
                    <span>View</span>
                  </motion.button>
                  <motion.button
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Settings size={16} />
                  </motion.button>
                  <motion.button
                    className="px-3 py-2 border border-gray-300 rounded-lg hover:bg-purple-50 transition-colors"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => {
                      setSelectedScreen(screen);
                      setShowAnalyticsModal(true);
                    }}
                  >
                    <BarChart3 size={16} />
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Empty State */}
        {filteredScreens.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="text-center py-16"
          >
            <div className="w-24 h-24 mx-auto mb-6 bg-gradient-to-r from-gray-100 to-gray-200 rounded-full flex items-center justify-center">
              <Monitor className="text-gray-500" size={32} />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No screens found
            </h3>
            <p className="text-gray-600 mb-6">
              {searchTerm || statusFilter !== "all" || cityFilter !== "all"
                ? "Try adjusting your search criteria or filters."
                : "Get started by adding your first screen."}
            </p>
            <motion.button
              className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-6 py-3 rounded-lg font-semibold shadow-lg"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
            >
              <Plus className="inline mr-2" size={20} />
              Add Screen
            </motion.button>
          </motion.div>
        )}
      </div>

      {/* View Modal */}
      <AnimatePresence>
        {showViewModal && selectedScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowViewModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    {selectedScreen.name}
                  </h2>
                  <motion.button
                    onClick={() => setShowViewModal(false)}
                    className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                  >
                    <X size={20} />
                  </motion.button>
                </div>
              </div>

              <div className="p-6">
                {/* Screen Details Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4 border border-blue-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-blue-700">
                        Location
                      </span>
                      <MapPin className="text-blue-600" size={16} />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedScreen.location_name || "Unknown Location"}
                    </p>
                    <p className="text-sm text-gray-600">
                      {selectedScreen.city}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.2 }}
                    className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg p-4 border border-green-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-green-700">
                        Status
                      </span>
                      <Activity className="text-green-600" size={16} />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      {selectedScreen.is_active ? "Online" : "Offline"}
                    </p>
                    <p className="text-sm text-green-600">
                      {selectedScreen.is_active
                        ? "Actively displaying content"
                        : "Currently offline"}
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                    className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-purple-700">
                        Daily Footfall
                      </span>
                      <Users className="text-purple-600" size={16} />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      <AnimatedCounter
                        value={selectedScreen.daily_footfall || 0}
                      />
                    </p>
                    <p className="text-sm text-gray-600">People per day</p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 }}
                    className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-100"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-yellow-700">
                        Cost per 10 sec
                      </span>
                      <DollarSign className="text-yellow-600" size={16} />
                    </div>
                    <p className="text-lg font-semibold text-gray-900">
                      ${selectedScreen.cost_per_10_seconds || 0}
                    </p>
                    <p className="text-sm text-gray-600">
                      Advertisement pricing
                    </p>
                  </motion.div>
                </div>

                {/* Additional Details */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-lg p-4"
                >
                  <h3 className="font-semibold text-gray-900 mb-3">
                    Technical Specifications
                  </h3>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                      <span className="text-gray-600">Screen Type:</span>
                      <span className="ml-2 font-medium text-gray-900 capitalize">
                        {selectedScreen.screen_type?.replace("_", " ") ||
                          "Standard"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Resolution:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedScreen.resolution_width}x
                        {selectedScreen.resolution_height}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Demographics:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedScreen.demographics || "General audience"}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-600">Peak Hours:</span>
                      <span className="ml-2 font-medium text-gray-900">
                        {selectedScreen.peak_hours || "Not specified"}
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Analytics Modal */}
      <AnimatePresence>
        {showAnalyticsModal && selectedScreen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowAnalyticsModal(false)}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white rounded-xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
            >
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-2xl font-bold bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
                    Analytics - {selectedScreen.name}
                  </h2>
                  <div className="flex items-center space-x-3">
                    <motion.button
                      onClick={() => generateAnalyticsReport(selectedScreen)}
                      className="flex items-center space-x-2 bg-gradient-to-r from-green-500 to-green-600 text-white px-4 py-2 rounded-lg hover:from-green-600 hover:to-green-700 transition-all font-medium shadow-lg"
                      whileHover={{ scale: 1.05, y: -2 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      <Download size={18} />
                      <span>Download Report</span>
                    </motion.button>
                    <motion.button
                      onClick={() => setShowAnalyticsModal(false)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <X size={20} />
                    </motion.button>
                  </div>
                </div>
              </div>

              <div className="p-6">
                {/* Animated Stats Cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.1, type: "spring", stiffness: 100 }}
                    className="bg-gradient-to-br from-gray-600 to-gray-700 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                        <TrendingUp size={24} />
                      </div>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{
                          duration: 20,
                          repeat: Infinity,
                          ease: "linear",
                        }}
                        className="w-2 h-2 bg-white rounded-full opacity-60"
                      />
                    </div>
                    <h3 className="text-sm font-medium opacity-90">
                      Impressions Today
                    </h3>
                    <p className="text-2xl font-bold">
                      <AnimatedCounter
                        value={Math.floor(
                          (selectedScreen.daily_footfall || 1000) * 0.8
                        )}
                      />
                    </p>
                    <p className="text-xs opacity-70 flex items-center mt-2">
                      <ArrowUp size={12} className="mr-1" />
                      +12% from yesterday
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.2, type: "spring", stiffness: 100 }}
                    className="bg-gradient-to-br from-teal-500 to-teal-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                        <Users size={24} />
                      </div>
                      <motion.div
                        animate={{ scale: [1, 1.2, 1] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-white rounded-full opacity-60"
                      />
                    </div>
                    <h3 className="text-sm font-medium opacity-90">
                      Unique Viewers
                    </h3>
                    <p className="text-2xl font-bold">
                      <AnimatedCounter
                        value={Math.floor(
                          (selectedScreen.daily_footfall || 1000) * 0.6
                        )}
                      />
                    </p>
                    <p className="text-xs opacity-70 flex items-center mt-2">
                      <ArrowUp size={12} className="mr-1" />
                      +8% from yesterday
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.3, type: "spring", stiffness: 100 }}
                    className="bg-gradient-to-br from-emerald-500 to-emerald-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                        <Clock size={24} />
                      </div>
                      <motion.div
                        animate={{ rotate: [0, 180, 360] }}
                        transition={{ duration: 3, repeat: Infinity }}
                        className="w-2 h-2 bg-white rounded-full opacity-60"
                      />
                    </div>
                    <h3 className="text-sm font-medium opacity-90">
                      Avg. View Time
                    </h3>
                    <p className="text-2xl font-bold">
                      <AnimatedCounter value={8.5} decimals={1} suffix="s" />
                    </p>
                    <p className="text-xs opacity-70 flex items-center mt-2">
                      <ArrowUp size={12} className="mr-1" />
                      +0.5s from yesterday
                    </p>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.4, type: "spring", stiffness: 100 }}
                    className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-xl p-6 text-white shadow-lg hover:shadow-xl transition-shadow"
                    whileHover={{ y: -5, scale: 1.02 }}
                  >
                    <div className="flex items-center justify-between mb-4">
                      <div className="p-3 bg-white bg-opacity-20 rounded-lg">
                        <DollarSign size={24} />
                      </div>
                      <motion.div
                        animate={{ y: [-2, 2, -2] }}
                        transition={{ duration: 2, repeat: Infinity }}
                        className="w-2 h-2 bg-white rounded-full opacity-60"
                      />
                    </div>
                    <h3 className="text-sm font-medium opacity-90">
                      Revenue Today
                    </h3>
                    <p className="text-2xl font-bold">
                      $
                      <AnimatedCounter
                        value={Math.floor(
                          (selectedScreen.cost_per_10_seconds || 10) * 45
                        )}
                      />
                    </p>
                    <p className="text-xs opacity-70 flex items-center mt-2">
                      <ArrowUp size={12} className="mr-1" />
                      +$15 from yesterday
                    </p>
                  </motion.div>
                </div>

                {/* Performance Chart Placeholder */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.5 }}
                  className="bg-gray-50 rounded-lg p-6"
                >
                  <h3 className="font-semibold text-gray-900 mb-4">
                    Performance Overview
                  </h3>
                  <div className="h-64 flex items-center justify-center border-2 border-dashed border-gray-300 rounded-lg">
                    <div className="text-center">
                      <BarChart3 className="w-12 h-12 mx-auto text-gray-400 mb-2" />
                      <p className="text-gray-600">
                        Performance chart would be displayed here
                      </p>
                      <p className="text-sm text-gray-500">
                        Chart integration in progress
                      </p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Screen Booking Modal */}
      <ScreenBookingModal
        isOpen={showBookingModal}
        onClose={() => setShowBookingModal(false)}
        screens={screens || []}
        onBookingRequest={handleBookingRequest}
      />
    </div>
  );
};

export default ScreenManager;
