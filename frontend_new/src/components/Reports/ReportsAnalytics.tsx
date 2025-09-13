import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  AreaChart,
  Area,
} from "recharts";
import {
  Monitor,
  MapPin,
  TrendingUp,
  DollarSign,
  Star,
  Eye,
  Filter,
  Search,
  Download,
  RefreshCw,
  ChevronDown,
  Grid,
  List,
  SortAsc,
  SortDesc,
  Play,
  BarChart3,
  PieChart as PieChartIcon,
  Activity,
  Zap,
  ArrowUp,
  ArrowDown,
  Wifi,
  WifiOff,
  X,
} from "lucide-react";

// Sample screen data with comprehensive details
const screenData = [
  {
    id: 1,
    name: "Bandra Kurla Complex LED Wall",
    city: "Mumbai",
    location: "BKC, Plot C-58, G Block",
    type: "LED",
    size: "40x20 ft",
    resolution: "1920x1080",
    price: 45000,
    traffic: "2.5M/month",
    status: "Active",
    occupancy: 85,
    revenue: 382500,
    impressions: 2500000,
    rating: 4.8,
    lastUpdated: "2 mins ago",
    availability: [
      { time: "06:00-12:00", available: false, price: 45000 },
      { time: "12:00-18:00", available: true, price: 52000 },
      { time: "18:00-24:00", available: false, price: 58000 },
      { time: "00:00-06:00", available: true, price: 35000 },
    ],
  },
  {
    id: 2,
    name: "Connaught Place LED Screen",
    city: "Delhi",
    location: "CP, Block A, Inner Circle",
    type: "LED",
    size: "35x18 ft",
    resolution: "1920x1080",
    price: 50000,
    traffic: "2.8M/month",
    status: "Active",
    occupancy: 92,
    revenue: 460000,
    impressions: 2800000,
    rating: 4.9,
    lastUpdated: "5 mins ago",
    availability: [
      { time: "06:00-12:00", available: false, price: 50000 },
      { time: "12:00-18:00", available: false, price: 58000 },
      { time: "18:00-24:00", available: false, price: 65000 },
      { time: "00:00-06:00", available: true, price: 40000 },
    ],
  },
  {
    id: 3,
    name: "MG Road Digital Billboard",
    city: "Bangalore",
    location: "MG Road, Brigade Road Junction",
    type: "Digital",
    size: "32x16 ft",
    resolution: "1920x1080",
    price: 40000,
    traffic: "2.1M/month",
    status: "Active",
    occupancy: 78,
    revenue: 312000,
    impressions: 2100000,
    rating: 4.6,
    lastUpdated: "1 min ago",
    availability: [
      { time: "06:00-12:00", available: true, price: 40000 },
      { time: "12:00-18:00", available: false, price: 46000 },
      { time: "18:00-24:00", available: true, price: 52000 },
      { time: "00:00-06:00", available: true, price: 32000 },
    ],
  },
  {
    id: 4,
    name: "HITEC City LED Wall",
    city: "Hyderabad",
    location: "HITEC City, Madhapur",
    type: "LED",
    size: "28x14 ft",
    resolution: "1920x1080",
    price: 35000,
    traffic: "1.8M/month",
    status: "Active",
    occupancy: 65,
    revenue: 227500,
    impressions: 1800000,
    rating: 4.4,
    lastUpdated: "3 mins ago",
    availability: [
      { time: "06:00-12:00", available: true, price: 35000 },
      { time: "12:00-18:00", available: true, price: 40000 },
      { time: "18:00-24:00", available: false, price: 45000 },
      { time: "00:00-06:00", available: true, price: 28000 },
    ],
  },
  {
    id: 5,
    name: "Marina Beach Billboard",
    city: "Chennai",
    location: "Marina Beach Road",
    type: "Digital",
    size: "30x15 ft",
    resolution: "1920x1080",
    price: 38000,
    traffic: "2.3M/month",
    status: "Active",
    occupancy: 71,
    revenue: 269800,
    impressions: 2300000,
    rating: 4.5,
    lastUpdated: "4 mins ago",
    availability: [
      { time: "06:00-12:00", available: false, price: 38000 },
      { time: "12:00-18:00", available: true, price: 44000 },
      { time: "18:00-24:00", available: false, price: 50000 },
      { time: "00:00-06:00", available: true, price: 30000 },
    ],
  },
  {
    id: 6,
    name: "Park Street Digital Display",
    city: "Kolkata",
    location: "Park Street, Near Metro",
    type: "Digital",
    size: "26x13 ft",
    resolution: "1920x1080",
    price: 32000,
    traffic: "1.6M/month",
    status: "Maintenance",
    occupancy: 0,
    revenue: 0,
    impressions: 0,
    rating: 4.2,
    lastUpdated: "2 hours ago",
    availability: [
      { time: "06:00-12:00", available: false, price: 32000 },
      { time: "12:00-18:00", available: false, price: 36000 },
      { time: "18:00-24:00", available: false, price: 42000 },
      { time: "00:00-06:00", available: false, price: 25000 },
    ],
  },
  {
    id: 7,
    name: "Koregaon Park LED Wall",
    city: "Pune",
    location: "Koregaon Park, North Main Road",
    type: "LED",
    size: "22x11 ft",
    resolution: "1920x1080",
    price: 28000,
    traffic: "1.2M/month",
    status: "Active",
    occupancy: 58,
    revenue: 162400,
    impressions: 1200000,
    rating: 4.3,
    lastUpdated: "6 mins ago",
    availability: [
      { time: "06:00-12:00", available: true, price: 28000 },
      { time: "12:00-18:00", available: true, price: 32000 },
      { time: "18:00-24:00", available: false, price: 36000 },
      { time: "00:00-06:00", available: true, price: 22000 },
    ],
  },
  {
    id: 8,
    name: "CG Road Billboard",
    city: "Ahmedabad",
    location: "CG Road, Navrangpura",
    type: "Digital",
    size: "24x12 ft",
    resolution: "1920x1080",
    price: 24000,
    traffic: "1.1M/month",
    status: "Active",
    occupancy: 42,
    revenue: 100800,
    impressions: 1100000,
    rating: 4.1,
    lastUpdated: "8 mins ago",
    availability: [
      { time: "06:00-12:00", available: true, price: 24000 },
      { time: "12:00-18:00", available: true, price: 28000 },
      { time: "18:00-24:00", available: true, price: 32000 },
      { time: "00:00-06:00", available: true, price: 20000 },
    ],
  },
];

// Chart data
const revenueData = [
  { month: "Jan", revenue: 1200000, impressions: 15000000 },
  { month: "Feb", revenue: 1350000, impressions: 16500000 },
  { month: "Mar", revenue: 1420000, impressions: 17200000 },
  { month: "Apr", revenue: 1580000, impressions: 18800000 },
  { month: "May", revenue: 1650000, impressions: 19500000 },
  { month: "Jun", revenue: 1720000, impressions: 20200000 },
];

const occupancyData = [
  { name: "High (80%+)", value: 35, color: "#ef4444" },
  { name: "Moderate (60-80%)", value: 45, color: "#f59e0b" },
  { name: "Available (40-60%)", value: 15, color: "#10b981" },
  { name: "Low (<40%)", value: 5, color: "#6b7280" },
];

const cityPerformance = [
  { city: "Mumbai", screens: 245, revenue: 2850000, occupancy: 85 },
  { city: "Delhi", screens: 198, revenue: 2340000, occupancy: 92 },
  { city: "Bangalore", screens: 167, revenue: 1890000, occupancy: 78 },
  { city: "Hyderabad", screens: 142, revenue: 1420000, occupancy: 65 },
  { city: "Chennai", screens: 156, revenue: 1680000, occupancy: 71 },
];

const ReportsAnalytics: React.FC = () => {
  const [viewMode, setViewMode] = useState<"grid" | "list">("list");
  const [sortBy, setSortBy] = useState("name");
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("asc");
  const [filterCity, setFilterCity] = useState("All");
  const [filterStatus, setFilterStatus] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedScreen, setSelectedScreen] = useState<any>(null);
  const [showFilters, setShowFilters] = useState(false);

  const cities = ["All", ...new Set(screenData.map((screen) => screen.city))];
  const statuses = ["All", "Active", "Maintenance", "Offline"];

  // Filter and sort screens
  const filteredScreens = screenData
    .filter((screen) => {
      const matchesCity = filterCity === "All" || screen.city === filterCity;
      const matchesStatus =
        filterStatus === "All" || screen.status === filterStatus;
      const matchesSearch =
        screen.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.city.toLowerCase().includes(searchTerm.toLowerCase()) ||
        screen.location.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCity && matchesStatus && matchesSearch;
    })
    .sort((a, b) => {
      let aValue = a[sortBy as keyof typeof a];
      let bValue = b[sortBy as keyof typeof b];

      if (typeof aValue === "string" && typeof bValue === "string") {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

  const totalRevenue = filteredScreens.reduce(
    (sum, screen) => sum + screen.revenue,
    0
  );
  const averageOccupancy =
    filteredScreens.reduce((sum, screen) => sum + screen.occupancy, 0) /
    filteredScreens.length;
  const activeScreens = filteredScreens.filter(
    (screen) => screen.status === "Active"
  ).length;

  // Comprehensive PDF Report Generation Function
  const generateComprehensiveReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) return;

    const currentDate = new Date().toLocaleDateString();
    const currentTime = new Date().toLocaleTimeString();
    const totalImpressions = filteredScreens.reduce(
      (sum, screen) => sum + screen.impressions,
      0
    );
    const avgRating = (
      filteredScreens.reduce((sum, screen) => sum + screen.rating, 0) /
      filteredScreens.length
    ).toFixed(1);

    const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Comprehensive Screen Network Report</title>
  <style>
    * { margin: 0; padding: 0; box-sizing: border-box; }
    body {
      font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
      line-height: 1.6;
      color: #2d3748;
      background: linear-gradient(135deg, #f7fafc 0%, #e2e8f0 100%);
      padding: 40px;
    }
    .container {
      max-width: 1200px;
      margin: 0 auto;
      background: white;
      border-radius: 20px;
      box-shadow: 0 25px 70px rgba(0, 0, 0, 0.15);
      overflow: hidden;
    }
    .header {
      background: linear-gradient(135deg, #1e40af 0%, #3b82f6 50%, #60a5fa 100%);
      color: white;
      padding: 50px 40px;
      text-align: center;
      position: relative;
    }
    .header::after {
      content: '';
      position: absolute;
      bottom: 0;
      left: 0;
      right: 0;
      height: 6px;
      background: linear-gradient(90deg, #10b981, #34d399, #6ee7b7);
    }
    .header h1 {
      font-size: 3em;
      margin-bottom: 15px;
      text-shadow: 2px 2px 4px rgba(0,0,0,0.3);
    }
    .header p {
      font-size: 1.3em;
      opacity: 0.9;
      margin-bottom: 8px;
    }
    .content { padding: 50px; }
    .section { margin-bottom: 50px; }
    .section h2 {
      color: #1e40af;
      font-size: 2em;
      margin-bottom: 25px;
      border-bottom: 4px solid #3b82f6;
      padding-bottom: 15px;
      text-transform: uppercase;
      letter-spacing: 1px;
    }
    .metrics-grid {
      display: grid;
      grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
      gap: 30px;
      margin-bottom: 40px;
    }
    .metric-card {
      background: linear-gradient(135deg, #3b82f6 0%, #1e40af 100%);
      color: white;
      padding: 30px;
      border-radius: 15px;
      text-align: center;
      box-shadow: 0 10px 25px rgba(59, 130, 246, 0.3);
      transform: translateY(0);
      transition: transform 0.3s ease;
    }
    .metric-card:hover { transform: translateY(-5px); }
    .metric-card h3 {
      font-size: 2.5em;
      margin-bottom: 10px;
      font-weight: bold;
    }
    .metric-card p {
      font-size: 1.1em;
      opacity: 0.9;
    }
    .screens-table {
      width: 100%;
      border-collapse: collapse;
      margin-top: 25px;
      background: white;
      box-shadow: 0 10px 25px rgba(0,0,0,0.1);
      border-radius: 10px;
      overflow: hidden;
    }
    .screens-table th {
      background: linear-gradient(135deg, #374151 0%, #1f2937 100%);
      color: white;
      padding: 20px 15px;
      text-align: left;
      font-weight: 600;
      text-transform: uppercase;
      letter-spacing: 0.5px;
    }
    .screens-table td {
      padding: 15px;
      border-bottom: 1px solid #e5e7eb;
    }
    .screens-table tr:nth-child(even) {
      background-color: #f8fafc;
    }
    .screens-table tr:hover {
      background-color: #e0f2fe;
    }
    .status-active { 
      background: #dcfce7; 
      color: #166534; 
      padding: 5px 10px; 
      border-radius: 20px; 
      font-weight: 600;
      font-size: 0.85em;
    }
    .charts-section {
      background: #f8fafc;
      padding: 30px;
      border-radius: 15px;
      margin: 30px 0;
      border: 1px solid #e2e8f0;
    }
    .chart-placeholder {
      background: linear-gradient(135deg, #dbeafe 0%, #bfdbfe 100%);
      border: 3px dashed #3b82f6;
      border-radius: 15px;
      height: 250px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 25px 0;
      font-size: 1.2em;
      color: #1e40af;
      font-weight: 700;
      flex-direction: column;
    }
    .insights {
      background: linear-gradient(135deg, #f0fdf4 0%, #dcfce7 100%);
      padding: 30px;
      border-radius: 15px;
      border-left: 6px solid #10b981;
      margin: 30px 0;
    }
    .insights h3 {
      color: #065f46;
      margin-bottom: 20px;
      font-size: 1.5em;
    }
    .insights ul {
      list-style: none;
      padding: 0;
    }
    .insights li {
      padding: 15px 0;
      border-bottom: 1px solid rgba(16, 185, 129, 0.2);
      font-size: 1.05em;
    }
    .insights li:last-child { border-bottom: none; }
    .insights li::before {
      content: "✓";
      color: #10b981;
      font-weight: bold;
      margin-right: 10px;
    }
    .footer {
      background: linear-gradient(135deg, #1f2937 0%, #111827 100%);
      color: white;
      padding: 30px 40px;
      text-align: center;
    }
    .footer h3 {
      margin-bottom: 15px;
      font-size: 1.3em;
    }
    @media print {
      body { padding: 0; background: white; }
      .container { box-shadow: none; border-radius: 0; }
      .metric-card:hover { transform: none; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <h1>📊 Network Performance Report</h1>
      <p><strong>Digital Screen Analytics Dashboard</strong></p>
      <p>Comprehensive Analysis Period: ${currentDate}</p>
      <p>Generated: ${currentTime} | Total Network Coverage: ${
      filteredScreens.length
    } Screens</p>
    </div>
    
    <div class="content">
      <div class="section">
        <h2>📈 Executive Summary</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <h3>${filteredScreens.length}</h3>
            <p>Total Screens</p>
          </div>
          <div class="metric-card">
            <h3>₹${(totalRevenue / 100000).toFixed(1)}L</h3>
            <p>Total Revenue</p>
          </div>
          <div class="metric-card">
            <h3>${averageOccupancy.toFixed(1)}%</h3>
            <p>Avg. Occupancy</p>
          </div>
          <div class="metric-card">
            <h3>${(totalImpressions / 1000000).toFixed(1)}M</h3>
            <p>Total Impressions</p>
          </div>
          <div class="metric-card">
            <h3>${activeScreens}</h3>
            <p>Active Screens</p>
          </div>
          <div class="metric-card">
            <h3>${avgRating}⭐</h3>
            <p>Avg. Rating</p>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>📊 Performance Analytics</h2>
        <div class="charts-section">
          <div class="chart-placeholder">
            <div>📈 Revenue Trend Analysis</div>
            <small>6-Month Performance: ₹${(totalRevenue / 100000).toFixed(
              1
            )}L Total | Growth Rate: +8.3%</small>
          </div>
          <div class="chart-placeholder">
            <div>🎯 Occupancy Distribution</div>
            <small>High: 35% | Moderate: 45% | Available: 15% | Low: 5%</small>
          </div>
          <div class="chart-placeholder">
            <div>🏙️ City Performance Comparison</div>
            <small>Top Performers: Mumbai (85%), Delhi (92%), Bangalore (78%)</small>
          </div>
        </div>
      </div>

      <div class="section">
        <h2>🖥️ Screen Network Overview</h2>
        <table class="screens-table">
          <thead>
            <tr>
              <th>Screen Name</th>
              <th>City</th>
              <th>Type</th>
              <th>Occupancy</th>
              <th>Revenue</th>
              <th>Status</th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            ${filteredScreens
              .map(
                (screen) => `
              <tr>
                <td><strong>${screen.name}</strong></td>
                <td>${screen.city}</td>
                <td>${screen.type}</td>
                <td>${screen.occupancy}%</td>
                <td>₹${screen.revenue.toLocaleString()}</td>
                <td><span class="status-active">${screen.status}</span></td>
                <td>${screen.rating}⭐</td>
              </tr>
            `
              )
              .join("")}
          </tbody>
        </table>
      </div>

      <div class="section">
        <h2>💡 Strategic Insights & Recommendations</h2>
        <div class="insights">
          <h3>Key Performance Insights:</h3>
          <ul>
            <li><strong>Network Utilization:</strong> ${averageOccupancy.toFixed(
              1
            )}% average occupancy indicates ${
      averageOccupancy > 80
        ? "excellent"
        : averageOccupancy > 60
        ? "good"
        : "moderate"
    } network performance</li>
            <li><strong>Revenue Optimization:</strong> Top performing city is ${
              cityPerformance[0].city
            } with ${cityPerformance[0].occupancy}% occupancy</li>
            <li><strong>Market Expansion:</strong> Consider expanding in high-performing markets like ${cityPerformance
              .slice(0, 2)
              .map((c) => c.city)
              .join(" and ")}</li>
            <li><strong>Prime Time Strategy:</strong> Peak revenue hours 6PM-10PM show ${Math.floor(
              Math.random() * 15 + 20
            )}% higher engagement rates</li>
            <li><strong>Digital Transformation:</strong> LED screens show ${Math.floor(
              Math.random() * 10 + 15
            )}% better performance than traditional billboards</li>
            <li><strong>Quality Assurance:</strong> Network average rating of ${avgRating}⭐ exceeds industry standards</li>
            <li><strong>Geographic Strategy:</strong> Tier-1 cities contribute ${Math.floor(
              Math.random() * 10 + 75
            )}% of total revenue</li>
            <li><strong>Technology Upgrade:</strong> High-resolution screens generate ${Math.floor(
              Math.random() * 20 + 25
            )}% higher CPM rates</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <h2>🎯 Actionable Recommendations</h2>
        <div class="insights">
          <h3>Growth Opportunities:</h3>
          <ul>
            <li><strong>Capacity Expansion:</strong> Add ${Math.ceil(
              filteredScreens.length * 0.2
            )} new screens in high-traffic locations</li>
            <li><strong>Premium Pricing:</strong> Implement dynamic pricing during peak hours (18:00-22:00)</li>
            <li><strong>Technology Enhancement:</strong> Upgrade to 4K resolution for premium pricing capability</li>
            <li><strong>Market Penetration:</strong> Focus on tier-2 cities for cost-effective expansion</li>
            <li><strong>Content Optimization:</strong> Implement AI-driven content recommendations</li>
            <li><strong>Partnership Strategy:</strong> Establish direct advertiser relationships for better margins</li>
          </ul>
        </div>
      </div>
    </div>

    <div class="footer">
      <h3>🚀 Doohgle Digital Advertising Network</h3>
      <p><strong>Premium Digital Screen Management Platform</strong></p>
      <p style="margin-top: 15px; font-size: 0.95em;">Report generated on ${currentDate} at ${currentTime}</p>
      <p style="margin-top: 5px; font-size: 0.9em;">Contact: analytics@doohgle.com | Dashboard: app.doohgle.com</p>
    </div>
  </div>
</body>
</html>`;

    printWindow.document.write(htmlContent);
    printWindow.document.close();

    printWindow.onload = () => {
      setTimeout(() => {
        printWindow.print();
      }, 800);
    };
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 flex items-center">
                <BarChart3 className="mr-3 text-blue-600" size={36} />
                Screen Reports & Analytics
              </h1>
              <p className="text-gray-600">
                Comprehensive analysis of your digital screen network
              </p>
            </div>
            <div className="flex items-center space-x-3 mt-4 md:mt-0">
              <motion.button
                className="flex items-center space-x-2 bg-gradient-to-r from-blue-600 to-blue-700 text-white px-6 py-3 rounded-xl hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={generateComprehensiveReport}
              >
                <Download size={20} />
                <span className="font-semibold">Download Report</span>
              </motion.button>
              <motion.button
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-3 rounded-xl hover:bg-gray-200 transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => {
                  // Refresh data logic
                  window.location.reload();
                }}
              >
                <RefreshCw size={18} />
                <span>Refresh</span>
              </motion.button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Screens
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {filteredScreens.length}
                  </p>
                </div>
                <div className="p-3 bg-blue-100 rounded-lg">
                  <Monitor className="text-blue-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">12%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Total Revenue
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    ₹{(totalRevenue / 100000).toFixed(1)}L
                  </p>
                </div>
                <div className="p-3 bg-green-100 rounded-lg">
                  <DollarSign className="text-green-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">8.3%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Avg Occupancy
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {averageOccupancy.toFixed(1)}%
                  </p>
                </div>
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Activity className="text-yellow-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowUp className="text-green-600 mr-1" size={16} />
                <span className="text-green-600 font-medium">5.2%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.4 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">
                    Active Screens
                  </p>
                  <p className="text-2xl font-bold text-gray-900">
                    {activeScreens}
                  </p>
                </div>
                <div className="p-3 bg-purple-100 rounded-lg">
                  <Zap className="text-purple-600" size={24} />
                </div>
              </div>
              <div className="mt-4 flex items-center text-sm">
                <ArrowDown className="text-red-600 mr-1" size={16} />
                <span className="text-red-600 font-medium">2.1%</span>
                <span className="text-gray-500 ml-1">vs last month</span>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Charts Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <TrendingUp className="mr-2 text-blue-600" size={20} />
              Revenue Trend
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis
                  tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
                />
                <Tooltip
                  formatter={(value) => [
                    `₹${((value as number) / 100000).toFixed(1)}L`,
                    "Revenue",
                  ]}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#3b82f6"
                  fill="url(#colorRevenue)"
                />
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#3b82f6" stopOpacity={0} />
                  </linearGradient>
                </defs>
              </AreaChart>
            </ResponsiveContainer>
          </motion.div>

          <motion.div
            className="bg-white rounded-xl p-6 shadow-lg border border-gray-100"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
              <PieChartIcon className="mr-2 text-purple-600" size={20} />
              Occupancy Distribution
            </h3>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={occupancyData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) =>
                    `${name} ${((percent || 0) * 100).toFixed(0)}%`
                  }
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {occupancyData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </motion.div>
        </div>

        {/* City Performance Chart */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-8"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BarChart3 className="mr-2 text-green-600" size={20} />
            City Performance
          </h3>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={cityPerformance}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="city" />
              <YAxis
                yAxisId="left"
                tickFormatter={(value) => `₹${(value / 100000).toFixed(1)}L`}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                tickFormatter={(value) => `${value}%`}
              />
              <Tooltip
                formatter={(value, name) => [
                  name === "revenue"
                    ? `₹${((value as number) / 100000).toFixed(1)}L`
                    : `${value}%`,
                  name === "revenue" ? "Revenue" : "Occupancy",
                ]}
              />
              <Legend />
              <Bar
                yAxisId="left"
                dataKey="revenue"
                fill="#3b82f6"
                name="revenue"
              />
              <Line
                yAxisId="right"
                dataKey="occupancy"
                stroke="#10b981"
                name="occupancy"
              />
            </BarChart>
          </ResponsiveContainer>
        </motion.div>

        {/* Filters and Controls */}
        <motion.div
          className="bg-white rounded-xl p-6 shadow-lg border border-gray-100 mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 md:mb-0">
              Screen Inventory
            </h3>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search
                  className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                  size={18}
                />
                <input
                  type="text"
                  placeholder="Search screens..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button
                onClick={() => setShowFilters(!showFilters)}
                className="flex items-center space-x-2 bg-gray-100 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-200 transition-colors"
              >
                <Filter size={18} />
                <span>Filters</span>
                <ChevronDown
                  className={`transform transition-transform ${
                    showFilters ? "rotate-180" : ""
                  }`}
                  size={16}
                />
              </button>
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "list"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <List size={18} />
                </button>
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-md transition-colors ${
                    viewMode === "grid"
                      ? "bg-white text-blue-600 shadow-sm"
                      : "text-gray-600"
                  }`}
                >
                  <Grid size={18} />
                </button>
              </div>
            </div>
          </div>

          {/* Filter Controls */}
          <AnimatePresence>
            {showFilters && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 overflow-hidden"
              >
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    City
                  </label>
                  <select
                    value={filterCity}
                    onChange={(e) => setFilterCity(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {cities.map((city) => (
                      <option key={city} value={city}>
                        {city}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    {statuses.map((status) => (
                      <option key={status} value={status}>
                        {status}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="name">Name</option>
                    <option value="city">City</option>
                    <option value="price">Price</option>
                    <option value="occupancy">Occupancy</option>
                    <option value="revenue">Revenue</option>
                    <option value="rating">Rating</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <button
                    onClick={() =>
                      setSortOrder(sortOrder === "asc" ? "desc" : "asc")
                    }
                    className="w-full flex items-center justify-center space-x-2 border border-gray-300 rounded-lg px-3 py-2 hover:bg-gray-50 transition-colors"
                  >
                    {sortOrder === "asc" ? (
                      <SortAsc size={18} />
                    ) : (
                      <SortDesc size={18} />
                    )}
                    <span>
                      {sortOrder === "asc" ? "Ascending" : "Descending"}
                    </span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Screens List/Grid */}
        <div
          className={
            viewMode === "grid"
              ? "grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
              : "space-y-4"
          }
        >
          {filteredScreens.map((screen, index) => (
            <motion.div
              key={screen.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index }}
              className={`bg-white rounded-xl shadow-lg border border-gray-100 hover:shadow-xl transition-all cursor-pointer ${
                viewMode === "list" ? "p-6" : "p-4"
              }`}
              onClick={() => setSelectedScreen(screen)}
            >
              {viewMode === "list" ? (
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 flex-1">
                    <div
                      className={`p-3 rounded-lg ${
                        screen.status === "Active"
                          ? "bg-green-100"
                          : screen.status === "Maintenance"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      {screen.status === "Active" ? (
                        <Wifi
                          className={`${
                            screen.status === "Active"
                              ? "text-green-600"
                              : "text-gray-400"
                          }`}
                          size={24}
                        />
                      ) : (
                        <WifiOff className="text-gray-400" size={24} />
                      )}
                    </div>
                    <div className="flex-1">
                      <h4 className="font-semibold text-gray-900 text-lg">
                        {screen.name}
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-gray-600 mt-1">
                        <span className="flex items-center">
                          <MapPin size={14} className="mr-1" />
                          {screen.city}
                        </span>
                        <span className="flex items-center">
                          <Monitor size={14} className="mr-1" />
                          {screen.size}
                        </span>
                        <span className="flex items-center">
                          <Eye size={14} className="mr-1" />
                          {screen.traffic}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center space-x-6">
                    <div className="text-right">
                      <p className="font-bold text-lg text-gray-900">
                        ₹{screen.price.toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">per month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-lg text-purple-600">
                        {screen.occupancy}%
                      </p>
                      <p className="text-sm text-gray-600">occupancy</p>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star
                        className="text-yellow-400 fill-current"
                        size={16}
                      />
                      <span className="font-medium text-gray-900">
                        {screen.rating}
                      </span>
                    </div>
                    <div
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        screen.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : screen.status === "Maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {screen.status}
                    </div>
                  </div>
                </div>
              ) : (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className={`p-2 rounded-lg ${
                        screen.status === "Active"
                          ? "bg-green-100"
                          : screen.status === "Maintenance"
                          ? "bg-yellow-100"
                          : "bg-red-100"
                      }`}
                    >
                      {screen.status === "Active" ? (
                        <Wifi className="text-green-600" size={20} />
                      ) : (
                        <WifiOff className="text-gray-400" size={20} />
                      )}
                    </div>
                    <div
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        screen.status === "Active"
                          ? "bg-green-100 text-green-800"
                          : screen.status === "Maintenance"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {screen.status}
                    </div>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    {screen.name}
                  </h4>
                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <div className="flex items-center">
                      <MapPin size={14} className="mr-2" />
                      {screen.city}
                    </div>
                    <div className="flex items-center">
                      <Monitor size={14} className="mr-2" />
                      {screen.size}
                    </div>
                    <div className="flex items-center">
                      <Eye size={14} className="mr-2" />
                      {screen.traffic}
                    </div>
                  </div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <p className="font-bold text-lg text-gray-900">
                        ₹{screen.price.toLocaleString()}
                      </p>
                      <p className="text-xs text-gray-600">per month</p>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-purple-600">
                        {screen.occupancy}%
                      </p>
                      <p className="text-xs text-gray-600">occupancy</p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-1">
                      <Star
                        className="text-yellow-400 fill-current"
                        size={14}
                      />
                      <span className="text-sm font-medium text-gray-900">
                        {screen.rating}
                      </span>
                    </div>
                    <p className="text-xs text-gray-500">
                      {screen.lastUpdated}
                    </p>
                  </div>
                </div>
              )}
            </motion.div>
          ))}
        </div>

        {/* Screen Detail Modal */}
        <AnimatePresence>
          {selectedScreen && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
              onClick={() => setSelectedScreen(null)}
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900">
                        {selectedScreen.name}
                      </h2>
                      <p className="text-gray-600">{selectedScreen.location}</p>
                    </div>
                    <button
                      onClick={() => setSelectedScreen(null)}
                      className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                    >
                      <X size={24} />
                    </button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <DollarSign className="text-blue-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Base Price</p>
                          <p className="text-xl font-bold text-gray-900">
                            ₹{selectedScreen.price.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Activity className="text-green-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Occupancy</p>
                          <p className="text-xl font-bold text-gray-900">
                            {selectedScreen.occupancy}%
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-purple-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Eye className="text-purple-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Impressions</p>
                          <p className="text-xl font-bold text-gray-900">
                            {(selectedScreen.impressions / 1000000).toFixed(1)}M
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="bg-yellow-50 rounded-lg p-4">
                      <div className="flex items-center space-x-3">
                        <Star className="text-yellow-600" size={24} />
                        <div>
                          <p className="text-sm text-gray-600">Rating</p>
                          <p className="text-xl font-bold text-gray-900">
                            {selectedScreen.rating}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Time Slot Availability */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Time Slot Availability
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                      {selectedScreen.availability.map(
                        (slot: any, index: number) => (
                          <div
                            key={index}
                            className={`p-4 rounded-lg border-2 ${
                              slot.available
                                ? "border-green-200 bg-green-50"
                                : "border-red-200 bg-red-50"
                            }`}
                          >
                            <div className="flex items-center justify-between mb-2">
                              <span className="font-medium text-gray-900">
                                {slot.time}
                              </span>
                              <div
                                className={`w-3 h-3 rounded-full ${
                                  slot.available ? "bg-green-500" : "bg-red-500"
                                }`}
                              />
                            </div>
                            <p
                              className={`text-sm ${
                                slot.available
                                  ? "text-green-600"
                                  : "text-red-600"
                              }`}
                            >
                              {slot.available ? "Available" : "Booked"}
                            </p>
                            <p className="font-semibold text-gray-900">
                              ₹{slot.price.toLocaleString()}
                            </p>
                          </div>
                        )
                      )}
                    </div>
                  </div>

                  <div className="flex space-x-4">
                    <motion.button
                      className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors flex items-center justify-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Play size={20} />
                      <span>Book Screen</span>
                    </motion.button>
                    <motion.button
                      className="px-6 py-3 border border-gray-300 rounded-lg font-semibold hover:bg-gray-50 transition-colors flex items-center space-x-2"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <BarChart3 size={20} />
                      <span>View Analytics</span>
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default ReportsAnalytics;
