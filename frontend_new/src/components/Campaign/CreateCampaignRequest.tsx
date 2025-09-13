import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Loader2,
  Send,
  CheckCircle,
  X,
  Clock,
  Plane,
  Sparkles,
} from "lucide-react";
import {
  campaignRequestService,
  type CampaignRequestData,
} from "../../services/campaignRequestService";

interface CreateCampaignRequestProps {
  screenId: number;
  screenName: string;
  screenLocation: string;
  onRequestCreated: () => void;
  onClose: () => void;
}

const CreateCampaignRequest: React.FC<CreateCampaignRequestProps> = ({
  screenId,
  screenName,
  screenLocation,
  onRequestCreated,
  onClose,
}) => {
  const [formData, setFormData] = useState<CampaignRequestData>({
    screen_id: screenId,
    campaign_name: "",
    campaign_description: "",
    start_date: "",
    end_date: "",
    requested_hours: [],
    budget_offered: 0,
    creative_assets: [],
    target_audience: "",
    notes: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [error, setError] = useState<string>("");
  const [selectedHours, setSelectedHours] = useState<number[]>([]);

  const handleInputChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "budget_offered" ? parseFloat(value) || 0 : value,
    }));
  };

  const handleHourToggle = (hour: number) => {
    const newHours = selectedHours.includes(hour)
      ? selectedHours.filter((h) => h !== hour)
      : [...selectedHours, hour];

    setSelectedHours(newHours);
    setFormData((prev) => ({
      ...prev,
      requested_hours: newHours,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      if (!formData.campaign_name.trim()) {
        throw new Error("Campaign name is required");
      }
      if (!formData.start_date || !formData.end_date) {
        throw new Error("Start and end dates are required");
      }
      if (formData.budget_offered <= 0) {
        throw new Error("Budget must be greater than 0");
      }

      const response = await campaignRequestService.createRequest(formData);

      if (response.success) {
        setShowSuccess(true);

        // Show success animation for 2 seconds before closing
        setTimeout(() => {
          onRequestCreated();
          onClose();
        }, 2000);
      } else {
        setError("Failed to create campaign request");
      }
    } catch (err: any) {
      setError(err.message || "Failed to create campaign request");
    } finally {
      if (!showSuccess) {
        setIsSubmitting(false);
      }
    }
  };

  const generateHourButtons = () => {
    const hours = [];
    for (let i = 0; i < 24; i++) {
      hours.push(
        <button
          key={i}
          type="button"
          className={`px-3 py-1 text-sm rounded-md border ${
            selectedHours.includes(i)
              ? "bg-blue-500 text-white border-blue-500"
              : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
          }`}
          onClick={() => handleHourToggle(i)}
        >
          {i.toString().padStart(2, "0")}:00
        </button>
      );
    }
    return hours;
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-screen overflow-y-auto relative">
        {/* Loading Overlay */}
        <AnimatePresence>
          {isSubmitting && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-white bg-opacity-95 flex items-center justify-center z-10 rounded-lg"
            >
              <div className="text-center">
                <motion.div
                  animate={{
                    rotate: 360,
                    scale: [1, 1.1, 1],
                  }}
                  transition={{
                    rotate: { duration: 2, repeat: Infinity, ease: "linear" },
                    scale: { duration: 1, repeat: Infinity },
                  }}
                  className="relative mb-4"
                >
                  <Plane className="w-12 h-12 text-blue-600 mx-auto" />
                  <motion.div
                    animate={{ x: [0, 20, 0], y: [0, -10, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="absolute -top-2 -right-2"
                  >
                    <Sparkles className="w-4 h-4 text-yellow-400" />
                  </motion.div>
                </motion.div>
                <motion.p
                  animate={{ opacity: [1, 0.6, 1] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                  className="text-lg font-semibold text-gray-700"
                >
                  Sending your campaign request...
                </motion.p>
                <p className="text-sm text-gray-500 mt-2">
                  This may take a few seconds
                </p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Success Overlay */}
        <AnimatePresence>
          {showSuccess && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              className="absolute inset-0 bg-green-50 bg-opacity-95 flex items-center justify-center z-10 rounded-lg"
            >
              <div className="text-center">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", duration: 0.6 }}
                >
                  <CheckCircle className="w-16 h-16 text-green-600 mx-auto mb-4" />
                </motion.div>
                <motion.h3
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-2xl font-bold text-green-700 mb-2"
                >
                  Request Sent Successfully!
                </motion.h3>
                <motion.p
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-green-600"
                >
                  The venue owner will review your campaign request
                </motion.p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900">
              Create Campaign Request
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 p-1"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="font-semibold text-gray-900">Selected Screen</h3>
            <p className="text-gray-600">{screenName}</p>
            <p className="text-sm text-gray-500">{screenLocation}</p>
          </div>

          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-lg">
              <p className="text-red-600">{error}</p>
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-6">
              <div>
                <label
                  htmlFor="campaign_name"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Campaign Name *
                </label>
                <input
                  type="text"
                  id="campaign_name"
                  name="campaign_name"
                  value={formData.campaign_name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="campaign_description"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Campaign Description
                </label>
                <textarea
                  id="campaign_description"
                  name="campaign_description"
                  value={formData.campaign_description}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label
                    htmlFor="start_date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    Start Date *
                  </label>
                  <input
                    type="date"
                    id="start_date"
                    name="start_date"
                    value={formData.start_date}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split("T")[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>

                <div>
                  <label
                    htmlFor="end_date"
                    className="block text-sm font-medium text-gray-700 mb-1"
                  >
                    End Date *
                  </label>
                  <input
                    type="date"
                    id="end_date"
                    name="end_date"
                    value={formData.end_date}
                    onChange={handleInputChange}
                    min={
                      formData.start_date ||
                      new Date().toISOString().split("T")[0]
                    }
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Preferred Time Slots (Optional)
                </label>
                <p className="text-xs text-gray-500 mb-3">
                  Select hours when you want your ads to display. Leave empty
                  for all-day display.
                </p>
                <div className="grid grid-cols-8 gap-2">
                  {generateHourButtons()}
                </div>
              </div>

              <div>
                <label
                  htmlFor="budget_offered"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Budget Offered (₹) *
                </label>
                <input
                  type="number"
                  id="budget_offered"
                  name="budget_offered"
                  value={formData.budget_offered}
                  onChange={handleInputChange}
                  min="1"
                  step="100"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>

              <div>
                <label
                  htmlFor="target_audience"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Target Audience
                </label>
                <input
                  type="text"
                  id="target_audience"
                  name="target_audience"
                  value={formData.target_audience}
                  onChange={handleInputChange}
                  placeholder="e.g., Young professionals, Families, College students"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label
                  htmlFor="notes"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Additional Notes
                </label>
                <textarea
                  id="notes"
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Any specific requirements or additional information..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-500"
                disabled={isSubmitting}
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 flex items-center gap-2"
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Send className="w-4 h-4" />
                    Send Request
                  </>
                )}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignRequest;
