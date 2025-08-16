import React, { useState } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import VenueSelectionModal from "../VenueSelectionModal";
import CreativesManager from "../CreativesManager";

interface CampaignDashboardProps {
  onBack?: () => void;
}

const CampaignDashboard: React.FC<CampaignDashboardProps> = ({ onBack }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState("overview");
  const [isStatusOn, setIsStatusOn] = useState(false);
  const [isVenueModalOpen, setIsVenueModalOpen] = useState(false);
  const [isCreativesModalOpen, setIsCreativesModalOpen] = useState(false);
  const [isScheduleModalOpen, setIsScheduleModalOpen] = useState(false);
  const [selectedVenues, setSelectedVenues] = useState<string[]>([
    "Retail",
    "Health & Beauty",
  ]);
  const [selectedCreatives, setSelectedCreatives] = useState<any[]>([]);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);

  const tabVariants = {
    active: { backgroundColor: "#8B5CF6", color: "#FFFFFF" },
    inactive: { backgroundColor: "#F3F4F6", color: "#6B7280" },
  };

  const handleBack = () => {
    if (onBack) {
      onBack();
    } else {
      navigate("/products/ads-manager");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">F</span>
              </div>
              <span className="font-semibold text-gray-900">FRAMEN</span>
            </div>
            <span className="text-gray-500">Ads Manager</span>
          </div>
          <div className="flex items-center space-x-4">
            <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
              <span className="text-gray-600 font-medium">h</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex">
        {/* Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 h-screen">
          <div className="p-6">
            {/* Back Button */}
            <motion.button
              onClick={handleBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
              whileHover={{ x: -4 }}
              transition={{ type: "spring", stiffness: 400 }}
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 19l-7-7 7-7"
                />
              </svg>
              <span>Back</span>
            </motion.button>

            {/* Campaign Status */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center space-x-2">
                  <span
                    className={`text-sm ${
                      isStatusOn ? "text-green-600" : "text-gray-400"
                    }`}
                  >
                    {isStatusOn ? "On" : "Off"}
                  </span>
                  <motion.button
                    onClick={() => setIsStatusOn(!isStatusOn)}
                    className={`relative w-12 h-6 rounded-full transition-colors duration-300 ${
                      isStatusOn ? "bg-green-500" : "bg-gray-300"
                    }`}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute top-0.5 w-5 h-5 bg-white rounded-full shadow-md"
                      animate={{ x: isStatusOn ? 24 : 2 }}
                      transition={{
                        type: "spring",
                        stiffness: 500,
                        damping: 30,
                      }}
                    />
                  </motion.button>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">
                  Campaign setup is on 66%
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: "66%" }}
                    transition={{ duration: 1.5, ease: "easeOut" }}
                  />
                </div>
              </div>
            </div>

            {/* Campaign Guide */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">
                  Campaign Guide
                </span>
                <svg
                  className="w-4 h-4 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 9l-7 7-7-7"
                  />
                </svg>
              </div>

              {/* Error Alert */}
              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg
                      className="w-3 h-3 text-white"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 mb-1">
                      Creatives missing
                    </h4>
                    <p className="text-sm text-red-700">
                      Please provide creatives. A campaign cannot start without
                      creatives.
                    </p>
                  </div>
                </div>
              </motion.div>
            </div>

            {/* Finance Advisor */}
            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    className="w-4 h-4 text-white"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900">Finance Advisor</h4>
                  <p className="text-sm text-gray-600">Business</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {/* Campaign Header */}
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">
                  Financial Advice Campaign
                </h1>
                <svg
                  className="w-5 h-5 text-gray-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                  />
                </svg>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg
                    className="w-4 h-4"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 5l7 7-7 7"
                    />
                  </svg>
                  <span>Switch to Wizard</span>
                </motion.button>
              </div>
            </div>
          </div>

          {/* Content Area */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {/* Venue Selection Card */}
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => navigate("/products/ads-manager/venues")}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center text-purple-600">
                    <span className="text-sm font-medium">4 Selected</span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Select Venues
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Choose where your ads will be displayed
                </p>
                <div className="flex flex-wrap gap-2">
                  {selectedVenues.map((venue, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full"
                    >
                      {venue}
                    </span>
                  ))}
                </div>
              </motion.div>

              {/* Calendar Scheduling Card */}
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsScheduleModalOpen(true)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-green-500 to-teal-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center text-green-600">
                    <span className="text-sm font-medium">
                      {selectedDates.length > 0
                        ? `${selectedDates.length} Days`
                        : "Not Set"}
                    </span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Schedule Campaign
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Set dates and time slots for your campaign
                </p>
                {selectedDates.length > 0 ? (
                  <div className="space-y-2">
                    <div className="text-sm text-gray-700">
                      Start: {selectedDates[0].toLocaleDateString()}
                    </div>
                    {selectedDates.length > 1 && (
                      <div className="text-sm text-gray-700">
                        End:{" "}
                        {selectedDates[
                          selectedDates.length - 1
                        ].toLocaleDateString()}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-sm text-gray-500">
                    Click to set schedule
                  </div>
                )}
              </motion.div>

              {/* Creatives Management Card */}
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 cursor-pointer hover:shadow-md transition-all duration-300"
                whileHover={{ y: -4, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsCreativesModalOpen(true)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-12 h-12 bg-gradient-to-br from-orange-500 to-pink-600 rounded-2xl flex items-center justify-center">
                    <svg
                      className="w-6 h-6 text-white"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center text-orange-600">
                    <span className="text-sm font-medium">
                      {selectedCreatives.length} Assets
                    </span>
                    <svg
                      className="w-4 h-4 ml-2"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">
                  Upload Creatives
                </h3>
                <p className="text-gray-600 text-sm mb-4">
                  Add images and videos for your campaign
                </p>
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-100 rounded border-2 border-dashed border-gray-300 flex items-center justify-center">
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 4v16m8-8H4"
                      />
                    </svg>
                  </div>
                  <span className="text-sm text-gray-500">
                    Upload images or videos
                  </span>
                </div>
              </motion.div>
            </div>

            {/* Campaign Progress */}
            <motion.div
              className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">
                  Campaign Setup Progress
                </h3>
                <span className="text-2xl font-bold text-purple-600">66%</span>
              </div>
              <div className="w-full bg-white rounded-full h-3 mb-4">
                <motion.div
                  className="bg-gradient-to-r from-purple-600 to-blue-600 h-3 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: "66%" }}
                  transition={{ duration: 1.5, ease: "easeOut" }}
                />
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedVenues.length > 0 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {selectedVenues.length > 0 ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-white text-xs">1</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Venues Selected
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedDates.length > 0 ? "bg-green-500" : "bg-gray-300"
                    }`}
                  >
                    {selectedDates.length > 0 ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-white text-xs">2</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Schedule Set
                  </span>
                </div>
                <div className="flex items-center space-x-3">
                  <div
                    className={`w-6 h-6 rounded-full flex items-center justify-center ${
                      selectedCreatives.length > 0
                        ? "bg-green-500"
                        : "bg-red-500"
                    }`}
                  >
                    {selectedCreatives.length > 0 ? (
                      <svg
                        className="w-4 h-4 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    ) : (
                      <span className="text-white text-xs">!</span>
                    )}
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    Creatives Added
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Campaign Actions
                </h3>
                <div className="space-y-3">
                  <motion.button
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-green-50 to-emerald-50 hover:from-green-100 hover:to-emerald-100 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M14.828 14.828a4 4 0 01-5.656 0M9 10h1m4 0h1m-6 4h8m-12 5h16a1 1 0 001-1V6a1 1 0 00-1-1H5a1 1 0 00-1 1v12a1 1 0 001 1z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          Preview Campaign
                        </div>
                        <div className="text-sm text-gray-500">
                          See how your ads will look
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>

                  <motion.button
                    className="w-full flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-indigo-50 hover:from-blue-100 hover:to-indigo-100 rounded-lg transition-all duration-200"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                        <svg
                          className="w-4 h-4 text-white"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <div className="text-left">
                        <div className="font-medium text-gray-900">
                          Generate Report
                        </div>
                        <div className="text-sm text-gray-500">
                          Get performance insights
                        </div>
                      </div>
                    </div>
                    <svg
                      className="w-5 h-5 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </motion.button>
                </div>
              </motion.div>

              <motion.div
                className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Campaign Stats
                </h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Estimated Reach</span>
                    <span className="font-semibold text-gray-900">2.4M+</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Budget Remaining</span>
                    <span className="font-semibold text-green-600">€8,760</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Days Remaining</span>
                    <span className="font-semibold text-orange-600">
                      12 days
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Active Screens</span>
                    <span className="font-semibold text-blue-600">156</span>
                  </div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Inline Calendar Scheduling Modal */}
          {isScheduleModalOpen && (
            <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-white rounded-2xl p-6 max-w-md w-full"
              >
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-900">
                    Schedule Campaign
                  </h3>
                  <button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <svg
                      className="w-6 h-6"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  </button>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Start Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    End Date
                  </label>
                  <input
                    type="date"
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Slots
                  </label>
                  <div className="grid grid-cols-4 gap-2">
                    {Array.from({ length: 24 }, (_, i) => (
                      <button
                        key={i}
                        className="p-2 text-xs rounded-lg border border-gray-300 hover:bg-purple-50 hover:border-purple-300 transition-colors"
                      >
                        {i.toString().padStart(2, "0")}:00
                      </button>
                    ))}
                  </div>
                </div>

                <div className="flex space-x-3">
                  <button
                    onClick={() => setIsScheduleModalOpen(false)}
                    className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={() => {
                      setIsScheduleModalOpen(false);
                      // Add selected dates logic here
                    }}
                    className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700"
                  >
                    Save Schedule
                  </button>
                </div>
              </motion.div>
            </div>
          )}
          <div className="flex">
            {/* Main Form Area */}
            <div className="flex-1 p-6">
              {/* Location Settings */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center space-x-2 mb-4">
                  <svg
                    className="w-5 h-5 text-green-500"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                  <span className="text-sm text-gray-600">Include</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 9l-7 7-7-7"
                    />
                  </svg>
                  <div className="flex items-center space-x-2 ml-4">
                    <svg
                      className="w-4 h-4 text-blue-500"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <rect x="3" y="4" width="14" height="12" rx="2" />
                    </svg>
                    <span className="text-sm text-gray-700">
                      Mitte, Berlin, Germany
                    </span>
                  </div>
                  <span className="text-sm text-gray-500 ml-auto">0m</span>
                  <svg
                    className="w-4 h-4 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              </div>

              {/* Venue Types */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Venue Types
                    </h3>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">2/8</span>
                    <motion.button
                      onClick={() => setIsVenueModalOpen(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      Select
                    </motion.button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  {[
                    {
                      name: "Coworking Spaces",
                      image:
                        "https://www.google.com/imgres?q=rooms%20scenes&imgurl=https%3A%2F%2Fi.pinimg.com%2F736x%2F97%2F84%2F82%2F9784824d05fbe0582c59f248ad8d0add.jpg&imgrefurl=https%3A%2F%2Fin.pinterest.com%2Fpin%2Fenvironments-cartoon-scenes-on-behance--166492517454800103%2F&docid=3CJ_V7eDYtJ3JM&tbnid=1mtHQ7h9xtHuhM&vet=12ahUKEwif9IP2pf2OAxUQTmwGHfdDJJcQM3oECHwQAA..i&w=600&h=336&hcb=2&ved=2ahUKEwif9IP2pf2OAxUQTmwGHfdDJJcQM3oECHwQAA",
                      selected: true,
                    },
                    {
                      name: "Hotels",
                      image:
                        "https://www.google.com/imgres?q=rooms%20scenes&imgurl=https%3A%2F%2Fwww.shutterstock.com%2Fimage-illustration%2Fmodern-luxury-beautiful-mock-scene-260nw-1782304442.jpg&imgrefurl=https%3A%2F%2Fwww.shutterstock.com%2Fsearch%2Froom-scene&docid=Fj2CZu3y8pOKOM&tbnid=XvmVIDqb9HoEOM&vet=12ahUKEwif9IP2pf2OAxUQTmwGHfdDJJcQM3oECHMQAA..i&w=462&h=280&hcb=2&ved=2ahUKEwif9IP2pf2OAxUQTmwGHfdDJJcQM3oECHMQAA",
                      selected: true,
                    },
                  ].map((venue, index) => (
                    <motion.div
                      key={venue.name}
                      className={`relative rounded-lg overflow-hidden border-2 cursor-pointer ${
                        venue.selected
                          ? "border-blue-500 shadow-lg"
                          : "border-gray-200"
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-video bg-gray-200 relative">
                        <img
                          src={venue.image}
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                        {venue.selected && (
                          <div className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center">
                            <svg
                              className="w-4 h-4 text-white"
                              fill="currentColor"
                              viewBox="0 0 20 20"
                            >
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900">
                          {venue.name}
                        </h4>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Creatives Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">
                      Creatives
                    </h3>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">
                      {selectedCreatives.length}/3
                    </span>
                    <motion.button
                      onClick={() => setIsCreativesModalOpen(true)}
                      className="text-sm text-blue-600 hover:text-blue-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      Select
                    </motion.button>
                  </div>
                </div>

                {selectedCreatives.length === 0 ? (
                  <div className="p-8 text-center border-2 border-dashed border-gray-300 rounded-lg">
                    <svg
                      className="w-12 h-12 mx-auto text-gray-400 mb-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={1}
                        d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <p className="text-gray-600">
                      You have no creatives selected. Please upload your content
                      to get started.
                    </p>
                    <motion.button
                      onClick={() => setIsCreativesModalOpen(true)}
                      className="mt-4 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      Upload Creatives
                    </motion.button>
                  </div>
                ) : (
                  <div className="grid grid-cols-3 gap-4">
                    {selectedCreatives.slice(0, 3).map((creative, index) => (
                      <div
                        key={creative.id}
                        className="relative rounded-lg overflow-hidden border border-gray-200"
                      >
                        <div
                          className={`${
                            creative.type === "landscape"
                              ? "aspect-video"
                              : "aspect-[3/4]"
                          } bg-gray-100`}
                        >
                          <img
                            src={creative.image}
                            alt={creative.name}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="p-2">
                          <p className="text-xs font-medium text-gray-900 truncate">
                            {creative.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {creative.type}
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              {/* Timing Section */}
              <div className="bg-white rounded-lg border border-gray-200 p-6">
                <h3 className="text-lg font-medium text-gray-900 mb-6">
                  Timing
                </h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Start date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value="Feb 01, 2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                      <svg
                        className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      End date
                    </label>
                    <div className="relative">
                      <input
                        type="text"
                        value="Feb 02, 2024"
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                        readOnly
                      />
                      <svg
                        className="absolute right-3 top-2.5 w-5 h-5 text-gray-400"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right Sidebar */}
            <div className="w-80 border-l border-gray-200 bg-white">
              <div className="p-6">
                {/* Campaign Performance */}
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">
                      Campaign Performance
                    </h3>
                    <svg
                      className="w-4 h-4 text-gray-400"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M19 9l-7 7-7-7"
                      />
                    </svg>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">CPM</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        €13.33
                      </span>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">
                          Impressions
                        </span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          768,732
                        </div>
                        <div className="text-xs text-gray-500">up to</div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg
                          className="w-4 h-4 text-gray-400"
                          fill="none"
                          stroke="currentColor"
                          viewBox="0 0 24 24"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                          />
                        </svg>
                        <span className="text-sm text-gray-600">Screens</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">
                          99
                        </div>
                        <div className="text-xs text-gray-500">up to</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Budget */}
                <div className="mb-6">
                  <h3 className="font-medium text-gray-900 mb-4">Budget</h3>
                  <div className="relative">
                    <input
                      type="text"
                      value="EUR 10"
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-2">
                    This targeting requires this budget to achieve an optimal
                    performance: €4,760 - €10,200
                  </p>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"
                      />
                    </svg>
                    <span>Forecast Report</span>
                  </motion.button>

                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg
                      className="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-.707.293H7a4 4 0 01-4-4V7a4 4 0 014-4z"
                      />
                    </svg>
                    <span>Redeem Voucher</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <VenueSelectionModal
        isOpen={isVenueModalOpen}
        onClose={() => setIsVenueModalOpen(false)}
        onSave={(venues) => setSelectedVenues(venues)}
      />

      <CreativesManager
        isOpen={isCreativesModalOpen}
        onClose={() => setIsCreativesModalOpen(false)}
        onSave={(creatives) => setSelectedCreatives(creatives)}
      />
    </div>
  );
};

export default CampaignDashboard;
