import React, { useState } from "react";
import CampaignCreationWorkflow from "../components/Campaign/CampaignCreationWorkflow";
import VenueCampaignRequests from "../components/VenueDashboard/VenueCampaignRequests";
import AdvertiserCampaignRequests from "../components/Campaign/AdvertiserCampaignRequests";
import NotificationCenter from "../components/Common/NotificationCenter";

const CampaignRequestDemo: React.FC = () => {
  const [currentView, setCurrentView] = useState<
    "create" | "venue" | "advertiser" | "notifications"
  >("create");

  const renderCurrentView = () => {
    switch (currentView) {
      case "create":
        return <CampaignCreationWorkflow />;
      case "venue":
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <VenueCampaignRequests />
          </div>
        );
      case "advertiser":
        return (
          <div className="max-w-7xl mx-auto px-4 py-8">
            <AdvertiserCampaignRequests />
          </div>
        );
      case "notifications":
        return (
          <div className="max-w-7xl mx-auto px-4 py-8 flex justify-center">
            <NotificationCenter />
          </div>
        );
      default:
        return <CampaignCreationWorkflow />;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-8 py-4">
            <h1 className="text-xl font-bold text-gray-900">
              Campaign Request System Demo
            </h1>
            <nav className="flex gap-4">
              <button
                onClick={() => setCurrentView("create")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "create"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Create Campaign
              </button>
              <button
                onClick={() => setCurrentView("advertiser")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "advertiser"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                My Requests (Advertiser)
              </button>
              <button
                onClick={() => setCurrentView("venue")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "venue"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Incoming Requests (Venue Owner)
              </button>
              <button
                onClick={() => setCurrentView("notifications")}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  currentView === "notifications"
                    ? "bg-blue-600 text-white"
                    : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                }`}
              >
                Notifications
              </button>
            </nav>
          </div>
        </div>
      </div>

      {/* Current View */}
      {renderCurrentView()}
    </div>
  );
};

export default CampaignRequestDemo;
