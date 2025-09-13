import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Plus,
  Upload,
  BarChart3,
  Users,
  Monitor,
  Calendar,
  DollarSign,
  TrendingUp,
  Eye,
  Settings,
  Bell,
  Filter,
  MoreVertical,
  Edit,
  Trash2,
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  Download,
  MapPin,
} from "lucide-react";

// Enhanced Dashboard Component matching the provided image
const EnhancedVenueDashboard: React.FC = () => {
  const [selectedTimeRange, setSelectedTimeRange] = useState("month");

  // Sample data
  const dashboardData = {
    occupancyRate: 75,
    totalEarnings: {
      thisMonth: 425000,
      lifetime: 3250000,
    },
    activeScreens: 12,
    screenManagement: [
      {
        id: 1,
        name: "Times Square LED North",
        location: "Andheri West, Mumbai",
        size: "10x20 ft",
        resolution: "1920x1080",
        status: "active",
        occupancy: 89,
        earnings: 45000,
        bookings: 24,
      },
      {
        id: 2,
        name: "CP Metro Digital East",
        location: "Connaught Place, Delhi",
        size: "8x12 ft",
        resolution: "1920x1080",
        status: "active",
        occupancy: 76,
        earnings: 38000,
        bookings: 18,
      },
      {
        id: 3,
        name: "Electronic City Hub",
        location: "Electronic City, Bangalore",
        size: "12x8 ft",
        resolution: "1280x720",
        status: "maintenance",
        occupancy: 0,
        earnings: 0,
        bookings: 0,
      },
    ],
    adSchedule: {
      today: [
        {
          time: "06:00-08:00",
          campaign: "Morning Coffee Brand",
          status: "completed",
          views: 4180,
          apc: 49,
        },
        {
          time: "08:00-12:00",
          campaign: "Tech Product Launch",
          status: "active",
          views: 8750,
          apc: 72,
        },
        {
          time: "12:00-14:00",
          campaign: "Food Delivery App",
          status: "scheduled",
          views: 0,
          apc: 0,
        },
        {
          time: "14:00-18:00",
          campaign: "Fashion Summer Sale",
          status: "scheduled",
          views: 0,
          apc: 0,
        },
        {
          time: "18:00-22:00",
          campaign: "Movie Promotion",
          status: "scheduled",
          views: 0,
          apc: 0,
        },
      ],
    },
    earningsPayouts: {
      monthly: [
        { month: "Jan", amount: 380000, status: "paid" },
        { month: "Feb", amount: 420000, status: "paid" },
        { month: "Mar", amount: 390000, status: "paid" },
        { month: "Apr", amount: 425000, status: "pending" },
      ],
      recent: [
        {
          date: "2025-08-12",
          amount: 15000,
          campaign: "Tech Launch",
          status: "paid",
        },
        {
          date: "2025-08-11",
          amount: 12500,
          campaign: "Fashion Brand",
          status: "paid",
        },
        {
          date: "2025-08-10",
          amount: 18000,
          campaign: "Food Delivery",
          status: "pending",
        },
      ],
    },
    reportsAnalytics: {
      totalViews: 12500000,
      uniqueViewers: 8900000,
      peakHours: ["08:00-10:00", "18:00-21:00"],
      topPerformingAds: ["Tech Products", "Food & Beverage", "Fashion"],
    },
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play size={14} className="text-green-600" />;
      case "completed":
        return <CheckCircle size={14} className="text-blue-600" />;
      case "scheduled":
        return <Clock size={14} className="text-orange-600" />;
      case "maintenance":
        return <AlertCircle size={14} className="text-red-600" />;
      default:
        return <Clock size={14} />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-700";
      case "completed":
        return "bg-blue-100 text-blue-700";
      case "scheduled":
        return "bg-orange-100 text-orange-700";
      case "maintenance":
        return "bg-red-100 text-red-700";
      case "paid":
        return "bg-green-100 text-green-700";
      case "pending":
        return "bg-yellow-100 text-yellow-700";
      default:
        return "bg-gray-100 text-gray-700";
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Venue Dashboard
              </h1>
              <p className="text-gray-600">
                Manage your digital screens and track performance
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center">
                <Plus size={16} className="mr-2" />
                Add New Screen
              </button>
              <button className="p-2 text-gray-400 hover:text-gray-600 relative">
                <Bell size={20} />
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                  3
                </span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Dashboard Overview - Main Stats */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-8">
          {/* Occupancy Rate */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="text-center">
              <div className="relative w-24 h-24 mx-auto mb-4">
                <svg className="w-24 h-24 transform -rotate-90">
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    className="text-gray-200"
                  />
                  <circle
                    cx="48"
                    cy="48"
                    r="40"
                    stroke="currentColor"
                    strokeWidth="8"
                    fill="transparent"
                    strokeDasharray={`${2 * Math.PI * 40}`}
                    strokeDashoffset={`${
                      2 * Math.PI * 40 * (1 - dashboardData.occupancyRate / 100)
                    }`}
                    className="text-green-500"
                    strokeLinecap="round"
                  />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-2xl font-bold text-gray-900">
                    {dashboardData.occupancyRate}%
                  </span>
                </div>
              </div>
              <h3 className="font-semibold text-gray-900 mb-1">
                OCCUPANCY RATE
              </h3>
              <div className="flex justify-center space-x-4 text-sm">
                <div>
                  <span className="text-gray-500">Booked</span>
                  <div className="w-4 h-2 bg-green-500 rounded mx-auto mt-1"></div>
                </div>
                <div>
                  <span className="text-gray-500">Available</span>
                  <div className="w-4 h-2 bg-gray-200 rounded mx-auto mt-1"></div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Total Earnings */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  TOTAL EARNINGS
                </h3>
              </div>
              <DollarSign className="text-green-600" size={20} />
            </div>
            <div className="space-y-2">
              <div>
                <div className="text-2xl font-bold text-gray-900">
                  ₹{(dashboardData.totalEarnings.thisMonth / 1000).toFixed(0)}K
                </div>
                <div className="text-sm text-gray-500">This Month</div>
              </div>
              <div>
                <div className="text-lg font-semibold text-gray-700">
                  ₹{(dashboardData.totalEarnings.lifetime / 100000).toFixed(1)}L
                </div>
                <div className="text-sm text-gray-500">Lifetime</div>
              </div>
            </div>
          </motion.div>

          {/* Active Screens */}
          <motion.div
            className="bg-white p-6 rounded-lg shadow-sm border"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-start justify-between mb-4">
              <div>
                <h3 className="font-semibold text-gray-900 mb-1">
                  ACTIVE SCREENS
                </h3>
              </div>
              <Monitor className="text-blue-600" size={20} />
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {dashboardData.activeScreens}
              </div>
              <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700 transition-colors">
                Add New Screen
              </button>
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div
            className="bg-gradient-to-br from-purple-500 to-blue-600 p-6 rounded-lg text-white"
            whileHover={{ y: -2 }}
          >
            <h3 className="font-semibold mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded text-sm transition-colors">
                <Upload size={14} className="inline mr-2" />
                Upload Content
              </button>
              <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded text-sm transition-colors">
                <BarChart3 size={14} className="inline mr-2" />
                View Analytics
              </button>
              <button className="w-full bg-white bg-opacity-20 hover:bg-opacity-30 text-white px-3 py-2 rounded text-sm transition-colors">
                <Download size={14} className="inline mr-2" />
                Download Reports
              </button>
            </div>
          </motion.div>
        </div>

        {/* Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Screen Management */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Screen Management
                </h3>
                <button className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-blue-700">
                  Add New Screen
                </button>
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Screen Name
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Location
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Size
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Resolution
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {dashboardData.screenManagement.map((screen) => (
                    <tr key={screen.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4">
                        <div className="font-medium text-gray-900">
                          {screen.name}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: SCR-{screen.id.toString().padStart(3, "0")}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {screen.location}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {screen.size}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="text-sm text-gray-900">
                          {screen.resolution}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <span
                          className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                            screen.status
                          )}`}
                        >
                          {getStatusIcon(screen.status)}
                          <span className="ml-1 capitalize">
                            {screen.status}
                          </span>
                        </span>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-800">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-800">
                            <Trash2 size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-800">
                            <MoreVertical size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Right Column - Ad Schedule & Stats */}
          <div className="space-y-6">
            {/* Today's Ad Schedule */}
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold text-gray-900">Ad Schedule</h3>
                  <div className="flex items-center space-x-2">
                    <Filter size={16} className="text-gray-400" />
                    <select className="text-sm border-0 focus:ring-0">
                      <option>Filter by screen</option>
                    </select>
                  </div>
                </div>
              </div>
              <div className="p-4">
                {/* Calendar Header */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="text-center text-xs font-medium text-gray-500 p-1"
                      >
                        {day}
                      </div>
                    )
                  )}
                </div>

                {/* Schedule Bars */}
                <div className="space-y-2 mb-4">
                  {[1, 2, 3, 4].map((week) => (
                    <div key={week} className="grid grid-cols-7 gap-1">
                      {Array.from({ length: 7 }, (_, day) => (
                        <div
                          key={day}
                          className="h-6 bg-gray-200 rounded"
                          style={{
                            background:
                              Math.random() > 0.3
                                ? `linear-gradient(to right, #3b82f6 ${
                                    Math.random() * 100
                                  }%, #e5e7eb ${Math.random() * 100}%)`
                                : "#e5e7eb",
                          }}
                        />
                      ))}
                    </div>
                  ))}
                </div>

                {/* Screen Views */}
                <div className="space-y-2">
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">Screen 4180</span>
                    <span className="text-sm text-gray-600">Views: 55</span>
                  </div>
                  <div className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm font-medium">APC</span>
                    <span className="text-sm text-gray-600">49</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Performance Overview */}
            <div className="bg-white rounded-lg shadow-sm border p-4">
              <h3 className="font-semibold text-gray-900 mb-4">
                Performance Overview
              </h3>
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Total Views Today
                  </span>
                  <span className="font-medium">12,930</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">Revenue Today</span>
                  <span className="font-medium text-green-600">₹18,500</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Active Campaigns
                  </span>
                  <span className="font-medium">8</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-600">
                    Screen Utilization
                  </span>
                  <span className="font-medium">83%</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section - Earnings & Payouts */}
        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Earnings & Payouts */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold text-gray-900">
                  Earnings & Payouts
                </h3>
                <button className="bg-green-600 text-white px-4 py-2 rounded-lg text-sm hover:bg-green-700">
                  Request Payout
                </button>
              </div>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Monthly Earnings
                  </h4>
                  <div className="h-32 bg-gray-50 rounded flex items-end justify-between px-2 py-2">
                    {dashboardData.earningsPayouts.monthly.map(
                      (month, index) => (
                        <div
                          key={month.month}
                          className="bg-green-500 rounded-t w-8 flex items-center justify-center text-white text-xs"
                          style={{
                            height: `${(month.amount / 500000) * 100}%`,
                          }}
                        >
                          {month.month}
                        </div>
                      )
                    )}
                  </div>
                </div>

                <div>
                  <h4 className="font-medium text-gray-900 mb-3">
                    Recent Transactions
                  </h4>
                  <div className="space-y-2">
                    {dashboardData.earningsPayouts.recent.map(
                      (transaction, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 border rounded"
                        >
                          <div>
                            <div className="text-sm font-medium">
                              {transaction.campaign}
                            </div>
                            <div className="text-xs text-gray-500">
                              {transaction.date}
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium">
                              ₹{transaction.amount.toLocaleString()}
                            </div>
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${getStatusColor(
                                transaction.status
                              )}`}
                            >
                              {transaction.status}
                            </span>
                          </div>
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Reports & Analytics */}
          <div className="bg-white rounded-lg shadow-sm border">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold text-gray-900">
                Reports & Analytics
              </h3>
            </div>
            <div className="p-6">
              <div className="grid grid-cols-2 gap-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">
                    {(
                      dashboardData.reportsAnalytics.totalViews / 1000000
                    ).toFixed(1)}
                    M
                  </div>
                  <div className="text-sm text-gray-600">Total Views</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {(
                      dashboardData.reportsAnalytics.uniqueViewers / 1000000
                    ).toFixed(1)}
                    M
                  </div>
                  <div className="text-sm text-gray-600">Unique Viewers</div>
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">Peak Hours</h4>
                <div className="flex space-x-2">
                  {dashboardData.reportsAnalytics.peakHours.map(
                    (hour, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-blue-100 text-blue-700 rounded-full text-sm"
                      >
                        {hour}
                      </span>
                    )
                  )}
                </div>
              </div>

              <div className="mt-6">
                <h4 className="font-medium text-gray-900 mb-3">
                  Top Performing Categories
                </h4>
                <div className="space-y-2">
                  {dashboardData.reportsAnalytics.topPerformingAds.map(
                    (category, index) => (
                      <div
                        key={index}
                        className="flex items-center justify-between"
                      >
                        <span className="text-sm">{category}</span>
                        <div className="w-20 bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-500 h-2 rounded-full"
                            style={{ width: `${100 - index * 20}%` }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedVenueDashboard;
