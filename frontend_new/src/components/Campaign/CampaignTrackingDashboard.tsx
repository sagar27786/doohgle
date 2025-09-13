import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  Download,
  Eye,
  Monitor,
  Calendar,
  DollarSign,
  Play,
  Pause,
  BarChart3,
  TrendingUp,
  MapPin,
  Users,
  Camera,
  FileText,
  CheckCircle,
  Clock,
  AlertCircle,
} from "lucide-react";

interface CampaignData {
  id: string;
  name: string;
  status: "active" | "paused" | "completed" | "scheduled";
  screens: {
    id: number;
    name: string;
    location: string;
    status: "active" | "offline";
    impressions: number;
    playCount: number;
  }[];
  schedule: {
    startDate: string;
    endDate: string;
    totalDays: number;
    completedDays: number;
  };
  budget: {
    total: number;
    spent: number;
    remaining: number;
  };
  performance: {
    totalImpressions: number;
    totalPlayCount: number;
    estimatedReach: number;
    cpm: number;
  };
  proofOfPlay: {
    photos: string[];
    videos: string[];
    reports: string[];
  };
}

const CampaignTrackingDashboard: React.FC = () => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>("1");

  // Sample campaign data
  const campaigns: CampaignData[] = [
    {
      id: "1",
      name: "Summer Fashion Collection 2025",
      status: "active",
      screens: [
        {
          id: 1,
          name: "Times Square Mall LED",
          location: "Andheri West, Mumbai",
          status: "active",
          impressions: 125000,
          playCount: 2840,
        },
        {
          id: 2,
          name: "CP Metro Station Digital",
          location: "Connaught Place, Delhi",
          status: "active",
          impressions: 89000,
          playCount: 1956,
        },
      ],
      schedule: {
        startDate: "2025-08-10",
        endDate: "2025-08-25",
        totalDays: 15,
        completedDays: 5,
      },
      budget: {
        total: 150000,
        spent: 50000,
        remaining: 100000,
      },
      performance: {
        totalImpressions: 214000,
        totalPlayCount: 4796,
        estimatedReach: 180000,
        cpm: 234,
      },
      proofOfPlay: {
        photos: [
          "/api/placeholder/300/200",
          "/api/placeholder/300/200",
          "/api/placeholder/300/200",
        ],
        videos: ["/api/placeholder/400/300", "/api/placeholder/400/300"],
        reports: ["Daily_Report_Aug_15.pdf", "Weekly_Summary_Aug_Week2.pdf"],
      },
    },
  ];

  const currentCampaign =
    campaigns.find((c) => c.id === selectedCampaign) || campaigns[0];

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "text-green-600 bg-green-100";
      case "paused":
        return "text-yellow-600 bg-yellow-100";
      case "completed":
        return "text-blue-600 bg-blue-100";
      case "scheduled":
        return "text-purple-600 bg-purple-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <Play size={14} />;
      case "paused":
        return <Pause size={14} />;
      case "completed":
        return <CheckCircle size={14} />;
      case "scheduled":
        return <Clock size={14} />;
      default:
        return <AlertCircle size={14} />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">
              Campaign Dashboard
            </h1>
            <p className="text-gray-600">
              Track your campaign performance and analytics
            </p>
          </div>
          <div className="flex items-center space-x-4">
            <select
              value={selectedCampaign}
              onChange={(e) => setSelectedCampaign(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {campaigns.map((campaign) => (
                <option key={campaign.id} value={campaign.id}>
                  {campaign.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Campaign Overview */}
        <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-xl font-semibold text-gray-900">
                {currentCampaign.name}
              </h2>
              <div className="flex items-center mt-2">
                <span
                  className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(
                    currentCampaign.status
                  )}`}
                >
                  {getStatusIcon(currentCampaign.status)}
                  <span className="ml-1 capitalize">
                    {currentCampaign.status}
                  </span>
                </span>
                <span className="ml-4 text-sm text-gray-600">
                  Day {currentCampaign.schedule.completedDays} of{" "}
                  {currentCampaign.schedule.totalDays}
                </span>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">
                <Pause size={16} className="mr-2 inline" />
                Pause
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
                <Download size={16} className="mr-2 inline" />
                Download Report
              </button>
            </div>
          </div>

          {/* Key Metrics */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <motion.div
              className="bg-blue-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-blue-600">
                    Total Impressions
                  </p>
                  <p className="text-2xl font-bold text-blue-900">
                    {currentCampaign.performance.totalImpressions.toLocaleString()}
                  </p>
                </div>
                <Eye className="text-blue-600" size={24} />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">↗ +12.5%</span>
                <span className="text-sm text-blue-700 ml-1">vs yesterday</span>
              </div>
            </motion.div>

            <motion.div
              className="bg-green-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-green-600">
                    Play Count
                  </p>
                  <p className="text-2xl font-bold text-green-900">
                    {currentCampaign.performance.totalPlayCount.toLocaleString()}
                  </p>
                </div>
                <Play className="text-green-600" size={24} />
              </div>
              <div className="mt-2">
                <span className="text-sm text-green-600">↗ +8.3%</span>
                <span className="text-sm text-green-700 ml-1">
                  vs yesterday
                </span>
              </div>
            </motion.div>

            <motion.div
              className="bg-purple-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-purple-600">
                    Total Spend
                  </p>
                  <p className="text-2xl font-bold text-purple-900">
                    ₹{currentCampaign.budget.spent.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="text-purple-600" size={24} />
              </div>
              <div className="mt-2">
                <span className="text-sm text-purple-600">
                  ₹{currentCampaign.budget.remaining.toLocaleString()} remaining
                </span>
              </div>
            </motion.div>

            <motion.div
              className="bg-orange-50 p-4 rounded-lg"
              whileHover={{ scale: 1.02 }}
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-orange-600">
                    Estimated Reach
                  </p>
                  <p className="text-2xl font-bold text-orange-900">
                    {(
                      currentCampaign.performance.estimatedReach / 1000
                    ).toFixed(0)}
                    K
                  </p>
                </div>
                <Users className="text-orange-600" size={24} />
              </div>
              <div className="mt-2">
                <span className="text-sm text-orange-600">
                  CPM: ₹{currentCampaign.performance.cpm}
                </span>
              </div>
            </motion.div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Screens Performance */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border">
              <div className="p-6 border-b">
                <h3 className="text-lg font-semibold text-gray-900">
                  Screens Performance
                </h3>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  {currentCampaign.screens.map((screen) => (
                    <div
                      key={screen.id}
                      className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                    >
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex items-center space-x-3">
                          <div
                            className={`w-3 h-3 rounded-full ${
                              screen.status === "active"
                                ? "bg-green-500"
                                : "bg-red-500"
                            }`}
                          ></div>
                          <div>
                            <h4 className="font-medium text-gray-900">
                              {screen.name}
                            </h4>
                            <p className="text-sm text-gray-600 flex items-center">
                              <MapPin size={12} className="mr-1" />
                              {screen.location}
                            </p>
                          </div>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded-full ${
                            screen.status === "active"
                              ? "bg-green-100 text-green-700"
                              : "bg-red-100 text-red-700"
                          }`}
                        >
                          {screen.status}
                        </span>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <div className="text-sm text-gray-600">
                            Impressions
                          </div>
                          <div className="text-lg font-semibold text-blue-600">
                            {screen.impressions.toLocaleString()}
                          </div>
                        </div>
                        <div>
                          <div className="text-sm text-gray-600">
                            Play Count
                          </div>
                          <div className="text-lg font-semibold text-green-600">
                            {screen.playCount.toLocaleString()}
                          </div>
                        </div>
                      </div>

                      {/* Performance Bar */}
                      <div className="mt-3">
                        <div className="flex items-center justify-between text-xs text-gray-600 mb-1">
                          <span>Performance</span>
                          <span>
                            {Math.round(
                              (screen.impressions /
                                currentCampaign.performance.totalImpressions) *
                                100
                            )}
                            %
                          </span>
                        </div>
                        <div className="w-full bg-gray-200 rounded-full h-2">
                          <div
                            className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                            style={{
                              width: `${
                                (screen.impressions /
                                  currentCampaign.performance
                                    .totalImpressions) *
                                100
                              }%`,
                            }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Campaign Schedule & Budget */}
          <div className="space-y-6">
            {/* Schedule Progress */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Campaign Progress
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Days Completed</span>
                    <span className="font-medium">
                      {currentCampaign.schedule.completedDays}/
                      {currentCampaign.schedule.totalDays}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (currentCampaign.schedule.completedDays /
                            currentCampaign.schedule.totalDays) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <div className="text-gray-600">Start Date</div>
                    <div className="font-medium">
                      {new Date(
                        currentCampaign.schedule.startDate
                      ).toLocaleDateString()}
                    </div>
                  </div>
                  <div>
                    <div className="text-gray-600">End Date</div>
                    <div className="font-medium">
                      {new Date(
                        currentCampaign.schedule.endDate
                      ).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Budget Tracking */}
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Budget Tracking
              </h3>
              <div className="space-y-4">
                <div>
                  <div className="flex items-center justify-between text-sm mb-2">
                    <span className="text-gray-600">Budget Used</span>
                    <span className="font-medium">
                      ₹{currentCampaign.budget.spent.toLocaleString()}/₹
                      {currentCampaign.budget.total.toLocaleString()}
                    </span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-3">
                    <div
                      className="bg-green-600 h-3 rounded-full transition-all duration-500"
                      style={{
                        width: `${
                          (currentCampaign.budget.spent /
                            currentCampaign.budget.total) *
                          100
                        }%`,
                      }}
                    ></div>
                  </div>
                </div>

                <div className="text-sm text-gray-600">
                  <div className="flex justify-between mb-1">
                    <span>Remaining:</span>
                    <span className="font-medium text-green-600">
                      ₹{currentCampaign.budget.remaining.toLocaleString()}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Daily Average:</span>
                    <span className="font-medium">
                      ₹
                      {Math.round(
                        currentCampaign.budget.spent /
                          currentCampaign.schedule.completedDays
                      ).toLocaleString()}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Proof of Play */}
        <div className="mt-8 bg-white rounded-lg shadow-sm border">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold text-gray-900">
              Proof of Play
            </h3>
            <p className="text-gray-600 text-sm">
              Download verification photos, videos, and reports
            </p>
          </div>
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* Photos */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Camera size={16} className="mr-2" />
                  Photos ({currentCampaign.proofOfPlay.photos.length})
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  {currentCampaign.proofOfPlay.photos
                    .slice(0, 4)
                    .map((photo, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                      >
                        <img
                          src={photo}
                          alt={`Proof ${index + 1}`}
                          className="w-full h-20 object-cover rounded border"
                        />
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <Download size={16} className="text-white" />
                        </div>
                      </div>
                    ))}
                </div>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Download All Photos
                </button>
              </div>

              {/* Videos */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <Play size={16} className="mr-2" />
                  Videos ({currentCampaign.proofOfPlay.videos.length})
                </h4>
                <div className="space-y-2">
                  {currentCampaign.proofOfPlay.videos
                    .slice(0, 2)
                    .map((video, index) => (
                      <div
                        key={index}
                        className="relative group cursor-pointer"
                      >
                        <div className="w-full h-16 bg-gray-200 rounded border flex items-center justify-center">
                          <Play size={20} className="text-gray-400" />
                        </div>
                        <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity rounded flex items-center justify-center">
                          <Download size={16} className="text-white" />
                        </div>
                      </div>
                    ))}
                </div>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Download All Videos
                </button>
              </div>

              {/* Reports */}
              <div>
                <h4 className="font-medium text-gray-900 mb-3 flex items-center">
                  <FileText size={16} className="mr-2" />
                  Reports ({currentCampaign.proofOfPlay.reports.length})
                </h4>
                <div className="space-y-2">
                  {currentCampaign.proofOfPlay.reports.map((report, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-2 border rounded hover:bg-gray-50 cursor-pointer"
                    >
                      <div className="flex items-center">
                        <FileText size={14} className="text-gray-400 mr-2" />
                        <span className="text-sm">{report}</span>
                      </div>
                      <Download size={14} className="text-gray-400" />
                    </div>
                  ))}
                </div>
                <button className="mt-2 text-sm text-blue-600 hover:text-blue-700">
                  Generate New Report
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CampaignTrackingDashboard;
