import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Upload,
  Calendar,
  Clock,
  DollarSign,
  CreditCard,
  Smartphone,
  Monitor,
  MapPin,
  Users,
  Play,
  Image as ImageIcon,
  FileText,
  AlertCircle,
  CheckCircle,
  X,
} from "lucide-react";

interface SelectedScreen {
  id: number;
  name: string;
  location: string;
  pricing: { hourly: number; daily: number; weekly: number };
  size: string;
  traffic: number;
}

interface TimeSlot {
  date: string;
  startTime: string;
  endTime: string;
  price: number;
}

interface Creative {
  id: string;
  type: "video" | "image" | "html5";
  file: File | null;
  preview: string;
  duration?: number;
  isValid: boolean;
}

interface CampaignData {
  screens: SelectedScreen[];
  timeSlots: TimeSlot[];
  creatives: Creative[];
  budget: {
    total: number;
    breakdown: { screenId: number; amount: number }[];
  };
}

const CampaignCreationWorkflow: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(1);
  const [campaignData, setCampaignData] = useState<CampaignData>({
    screens: [],
    timeSlots: [],
    creatives: [],
    budget: { total: 0, breakdown: [] },
  });

  const [selectedScreens, setSelectedScreens] = useState<SelectedScreen[]>([]);
  const [selectedDates, setSelectedDates] = useState<string[]>([]);
  const [uploadedCreatives, setUploadedCreatives] = useState<Creative[]>([]);

  // Sample screens data
  const availableScreens: SelectedScreen[] = [
    {
      id: 1,
      name: "Times Square Mall LED",
      location: "Andheri West, Mumbai",
      pricing: { hourly: 500, daily: 8000, weekly: 45000 },
      size: "10x20 ft",
      traffic: 25000,
    },
    {
      id: 2,
      name: "CP Metro Station Digital",
      location: "Connaught Place, Delhi",
      pricing: { hourly: 750, daily: 12000, weekly: 65000 },
      size: "8x12 ft",
      traffic: 45000,
    },
    {
      id: 3,
      name: "Electronic City Tech Hub",
      location: "Electronic City, Bangalore",
      pricing: { hourly: 400, daily: 6000, weekly: 35000 },
      size: "12x8 ft",
      traffic: 18000,
    },
  ];

  const steps = [
    {
      number: 1,
      title: "Select Screens",
      description: "Choose your advertising screens",
    },
    {
      number: 2,
      title: "Schedule",
      description: "Select dates and time slots",
    },
    {
      number: 3,
      title: "Upload Creatives",
      description: "Add your advertising content",
    },
    {
      number: 4,
      title: "Budget & Payment",
      description: "Review costs and pay",
    },
    {
      number: 5,
      title: "Confirmation",
      description: "Campaign setup complete",
    },
  ];

  // Step 1: Screen Selection
  const ScreenSelectionStep = () => (
    <div className="space-y-6">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Select Advertising Screens
        </h2>
        <p className="text-gray-600">
          Choose one or multiple screens for your campaign
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {availableScreens.map((screen) => {
          const isSelected = selectedScreens.some((s) => s.id === screen.id);
          return (
            <motion.div
              key={screen.id}
              className={`border-2 rounded-lg p-4 cursor-pointer transition-all ${
                isSelected
                  ? "border-blue-500 bg-blue-50"
                  : "border-gray-200 hover:border-gray-300"
              }`}
              whileHover={{ scale: 1.02 }}
              onClick={() => {
                if (isSelected) {
                  setSelectedScreens(
                    selectedScreens.filter((s) => s.id !== screen.id)
                  );
                } else {
                  setSelectedScreens([...selectedScreens, screen]);
                }
              }}
            >
              {isSelected && (
                <div className="flex justify-end mb-2">
                  <div className="bg-blue-500 text-white rounded-full p-1">
                    <Check size={16} />
                  </div>
                </div>
              )}

              <div className="aspect-video bg-gray-200 rounded mb-4 flex items-center justify-center">
                <Monitor size={32} className="text-gray-400" />
              </div>

              <h3 className="font-semibold text-gray-900 mb-2">
                {screen.name}
              </h3>
              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <MapPin size={14} className="mr-1" />
                  {screen.location}
                </div>
                <div className="flex items-center">
                  <Monitor size={14} className="mr-1" />
                  {screen.size}
                </div>
                <div className="flex items-center">
                  <Users size={14} className="mr-1" />
                  {screen.traffic.toLocaleString()} daily footfall
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-gray-500">Daily Rate</span>
                  <span className="font-bold text-blue-600">
                    ₹{screen.pricing.daily.toLocaleString()}
                  </span>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 mb-2">
          Selected Screens ({selectedScreens.length})
        </h4>
        {selectedScreens.length > 0 ? (
          <div className="space-y-2">
            {selectedScreens.map((screen) => (
              <div
                key={screen.id}
                className="flex items-center justify-between bg-white rounded p-2"
              >
                <span className="text-sm font-medium">{screen.name}</span>
                <span className="text-sm text-blue-600">
                  ₹{screen.pricing.daily.toLocaleString()}/day
                </span>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-blue-700 text-sm">No screens selected yet</p>
        )}
      </div>
    </div>
  );

  // Step 2: Date and Time Selection
  const ScheduleSelectionStep = () => {
    const today = new Date();
    const next30Days = Array.from({ length: 30 }, (_, i) => {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      return date.toISOString().split("T")[0];
    });

    const timeSlots = [
      { label: "Morning (6 AM - 12 PM)", value: "06:00-12:00", price: 1.0 },
      { label: "Afternoon (12 PM - 6 PM)", value: "12:00-18:00", price: 1.2 },
      { label: "Evening (6 PM - 10 PM)", value: "18:00-22:00", price: 1.5 },
      { label: "Night (10 PM - 6 AM)", value: "22:00-06:00", price: 0.8 },
      { label: "Full Day (6 AM - 10 PM)", value: "06:00-22:00", price: 2.5 },
    ];

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Select Schedule
          </h2>
          <p className="text-gray-600">
            Choose your campaign dates and time slots
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Date Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Dates</h3>
            <div className="border rounded-lg p-4 max-h-64 overflow-y-auto">
              <div className="grid grid-cols-7 gap-1 mb-4">
                {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                  (day) => (
                    <div
                      key={day}
                      className="text-center text-sm font-medium text-gray-500 p-2"
                    >
                      {day}
                    </div>
                  )
                )}
              </div>
              <div className="grid grid-cols-7 gap-1">
                {next30Days.map((date) => {
                  const dateObj = new Date(date);
                  const isSelected = selectedDates.includes(date);
                  return (
                    <button
                      key={date}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedDates(
                            selectedDates.filter((d) => d !== date)
                          );
                        } else {
                          setSelectedDates([...selectedDates, date]);
                        }
                      }}
                      className={`p-2 text-sm rounded transition-colors ${
                        isSelected
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      {dateObj.getDate()}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Time Slot Selection */}
          <div>
            <h3 className="text-lg font-semibold mb-4">Select Time Slots</h3>
            <div className="space-y-3">
              {timeSlots.map((slot) => (
                <div
                  key={slot.value}
                  className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer"
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium">{slot.label}</div>
                      <div className="text-sm text-gray-500">
                        Multiplier: {slot.price}x base rate
                      </div>
                    </div>
                    <div className="text-right">
                      <input
                        type="checkbox"
                        className="w-4 h-4 text-blue-600"
                      />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="bg-green-50 border border-green-200 rounded-lg p-4">
          <h4 className="font-medium text-green-900 mb-2">Selected Schedule</h4>
          <div className="text-sm text-green-700">
            <p>Dates: {selectedDates.length} days selected</p>
            <p>Estimated duration: {selectedDates.length} days</p>
          </div>
        </div>
      </div>
    );
  };

  // Step 3: Creative Upload
  const CreativeUploadStep = () => {
    const handleFileUpload = (
      type: "video" | "image" | "html5",
      file: File
    ) => {
      const creative: Creative = {
        id: Date.now().toString(),
        type,
        file,
        preview: URL.createObjectURL(file),
        isValid: validateCreative(type, file),
      };
      setUploadedCreatives([...uploadedCreatives, creative]);
    };

    const validateCreative = (type: string, file: File): boolean => {
      if (type === "video") {
        return file.type.includes("video") && file.size <= 100 * 1024 * 1024; // 100MB
      }
      if (type === "image") {
        return file.type.includes("image") && file.size <= 10 * 1024 * 1024; // 10MB
      }
      return true;
    };

    const removeCreative = (id: string) => {
      setUploadedCreatives(uploadedCreatives.filter((c) => c.id !== id));
    };

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Upload Creatives
          </h2>
          <p className="text-gray-600">Add your advertising content</p>
        </div>

        {/* Upload Options */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Video Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <Play size={32} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium mb-2">Video Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              MP4, up to 30 seconds, max 100MB
            </p>
            <input
              type="file"
              accept="video/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileUpload("video", e.target.files[0])
              }
              className="hidden"
              id="video-upload"
            />
            <label
              htmlFor="video-upload"
              className="bg-blue-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-blue-700 transition-colors"
            >
              Upload Video
            </label>
          </div>

          {/* Image Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <ImageIcon size={32} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium mb-2">Image Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              JPG/PNG, 1920x1080px recommended
            </p>
            <input
              type="file"
              accept="image/*"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileUpload("image", e.target.files[0])
              }
              className="hidden"
              id="image-upload"
            />
            <label
              htmlFor="image-upload"
              className="bg-green-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-green-700 transition-colors"
            >
              Upload Image
            </label>
          </div>

          {/* HTML5 Upload */}
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
            <FileText size={32} className="mx-auto text-gray-400 mb-4" />
            <h3 className="font-medium mb-2">Interactive Content</h3>
            <p className="text-sm text-gray-600 mb-4">
              HTML5 creative for interactive displays
            </p>
            <input
              type="file"
              accept=".html,.zip"
              onChange={(e) =>
                e.target.files?.[0] &&
                handleFileUpload("html5", e.target.files[0])
              }
              className="hidden"
              id="html5-upload"
            />
            <label
              htmlFor="html5-upload"
              className="bg-purple-600 text-white px-4 py-2 rounded-lg cursor-pointer hover:bg-purple-700 transition-colors"
            >
              Upload HTML5
            </label>
          </div>
        </div>

        {/* Uploaded Files */}
        {uploadedCreatives.length > 0 && (
          <div>
            <h3 className="text-lg font-semibold mb-4">Uploaded Creatives</h3>
            <div className="space-y-3">
              {uploadedCreatives.map((creative) => (
                <div
                  key={creative.id}
                  className="flex items-center justify-between bg-white border rounded-lg p-4"
                >
                  <div className="flex items-center space-x-4">
                    {creative.type === "image" && (
                      <img
                        src={creative.preview}
                        alt="Preview"
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    {creative.type === "video" && (
                      <video
                        src={creative.preview}
                        className="w-16 h-16 object-cover rounded"
                      />
                    )}
                    {creative.type === "html5" && (
                      <div className="w-16 h-16 bg-purple-100 rounded flex items-center justify-center">
                        <FileText size={24} className="text-purple-600" />
                      </div>
                    )}
                    <div>
                      <p className="font-medium">{creative.file?.name}</p>
                      <p className="text-sm text-gray-600 capitalize">
                        {creative.type} •{" "}
                        {(creative.file?.size || 0 / 1024 / 1024).toFixed(1)}MB
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {creative.isValid ? (
                      <CheckCircle size={20} className="text-green-500" />
                    ) : (
                      <AlertCircle size={20} className="text-red-500" />
                    )}
                    <button
                      onClick={() => removeCreative(creative.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X size={20} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    );
  };

  // Step 4: Budget Estimator & Payment
  const BudgetPaymentStep = () => {
    const calculateBudget = () => {
      const totalDays = selectedDates.length;
      const totalScreens = selectedScreens.length;
      const baseAmount = selectedScreens.reduce(
        (sum, screen) => sum + screen.pricing.daily,
        0
      );
      return baseAmount * totalDays;
    };

    const totalBudget = calculateBudget();

    return (
      <div className="space-y-6">
        <div className="text-center mb-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            Budget Estimator & Payment
          </h2>
          <p className="text-gray-600">
            Review your campaign costs and complete payment
          </p>
        </div>

        {/* Budget Breakdown */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Campaign Summary</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center py-2 border-b">
              <span>Selected Screens:</span>
              <span className="font-medium">
                {selectedScreens.length} screens
              </span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Campaign Duration:</span>
              <span className="font-medium">{selectedDates.length} days</span>
            </div>
            <div className="flex justify-between items-center py-2 border-b">
              <span>Uploaded Creatives:</span>
              <span className="font-medium">
                {uploadedCreatives.length} files
              </span>
            </div>
            <div className="flex justify-between items-center py-3 text-lg font-bold text-blue-600 bg-blue-50 px-4 rounded">
              <span>Total Amount:</span>
              <span>₹{totalBudget.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Payment Methods */}
        <div className="bg-white border rounded-lg p-6">
          <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex items-center space-x-3">
              <Smartphone size={24} className="text-blue-600" />
              <div>
                <div className="font-medium">UPI Payment</div>
                <div className="text-sm text-gray-600">
                  PhonePe, GPay, Paytm
                </div>
              </div>
            </div>
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex items-center space-x-3">
              <CreditCard size={24} className="text-green-600" />
              <div>
                <div className="font-medium">Net Banking</div>
                <div className="text-sm text-gray-600">All major banks</div>
              </div>
            </div>
            <div className="border rounded-lg p-4 cursor-pointer hover:bg-gray-50 flex items-center space-x-3">
              <CreditCard size={24} className="text-purple-600" />
              <div>
                <div className="font-medium">Credit/Debit Card</div>
                <div className="text-sm text-gray-600">
                  Visa, Mastercard, RuPay
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Payment Button */}
        <div className="text-center">
          <button className="bg-green-600 text-white px-8 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors">
            Pay ₹{totalBudget.toLocaleString()} & Launch Campaign
          </button>
        </div>
      </div>
    );
  };

  // Step 5: Confirmation
  const ConfirmationStep = () => (
    <div className="text-center space-y-6">
      <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto">
        <CheckCircle size={32} className="text-green-600" />
      </div>
      <div>
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          Campaign Created Successfully!
        </h2>
        <p className="text-gray-600">
          Your campaign has been submitted and will go live as scheduled.
        </p>
      </div>
      <div className="bg-gray-50 rounded-lg p-6 text-left max-w-md mx-auto">
        <h3 className="font-semibold mb-4">Campaign Details:</h3>
        <div className="space-y-2 text-sm">
          <div className="flex justify-between">
            <span>Campaign ID:</span>
            <span className="font-medium">
              #CAM{Date.now().toString().slice(-6)}
            </span>
          </div>
          <div className="flex justify-between">
            <span>Screens:</span>
            <span className="font-medium">{selectedScreens.length}</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="font-medium">{selectedDates.length} days</span>
          </div>
          <div className="flex justify-between">
            <span>Total Paid:</span>
            <span className="font-medium text-green-600">
              ₹{calculateBudget().toLocaleString()}
            </span>
          </div>
        </div>
      </div>
      <div className="space-x-4">
        <button className="bg-blue-600 text-white px-6 py-2 rounded-lg">
          View Campaign Dashboard
        </button>
        <button className="border border-gray-300 text-gray-700 px-6 py-2 rounded-lg">
          Create Another Campaign
        </button>
      </div>
    </div>
  );

  const calculateBudget = () => {
    const totalDays = selectedDates.length;
    const baseAmount = selectedScreens.reduce(
      (sum, screen) => sum + screen.pricing.daily,
      0
    );
    return baseAmount * totalDays;
  };

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return selectedScreens.length > 0;
      case 2:
        return selectedDates.length > 0;
      case 3:
        return (
          uploadedCreatives.length > 0 &&
          uploadedCreatives.every((c) => c.isValid)
        );
      case 4:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            {steps.map((step, index) => (
              <div key={step.number} className="flex items-center">
                <div
                  className={`flex items-center justify-center w-10 h-10 rounded-full font-medium text-sm ${
                    step.number <= currentStep
                      ? "bg-blue-600 text-white"
                      : "bg-gray-200 text-gray-600"
                  }`}
                >
                  {step.number < currentStep ? (
                    <Check size={16} />
                  ) : (
                    step.number
                  )}
                </div>
                <div className="ml-3 hidden md:block">
                  <div className="font-medium text-sm">{step.title}</div>
                  <div className="text-xs text-gray-600">
                    {step.description}
                  </div>
                </div>
                {index < steps.length - 1 && (
                  <div
                    className={`hidden md:block w-12 h-0.5 ml-4 ${
                      step.number < currentStep ? "bg-blue-600" : "bg-gray-200"
                    }`}
                  />
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Step Content */}
        <div className="bg-white rounded-lg shadow-sm border p-8 mb-8">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
            >
              {currentStep === 1 && <ScreenSelectionStep />}
              {currentStep === 2 && <ScheduleSelectionStep />}
              {currentStep === 3 && <CreativeUploadStep />}
              {currentStep === 4 && <BudgetPaymentStep />}
              {currentStep === 5 && <ConfirmationStep />}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Navigation Buttons */}
        {currentStep < 5 && (
          <div className="flex items-center justify-between">
            <button
              onClick={() => setCurrentStep(Math.max(1, currentStep - 1))}
              disabled={currentStep === 1}
              className="flex items-center px-6 py-2 border border-gray-300 rounded-lg text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              <ArrowLeft size={16} className="mr-2" />
              Previous
            </button>

            <button
              onClick={() => setCurrentStep(Math.min(5, currentStep + 1))}
              disabled={!canProceed()}
              className="flex items-center px-6 py-2 bg-blue-600 text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed hover:bg-blue-700"
            >
              Next
              <ArrowRight size={16} className="ml-2" />
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default CampaignCreationWorkflow;
