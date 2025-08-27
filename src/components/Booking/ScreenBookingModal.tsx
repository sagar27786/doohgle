import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  Clock,
  DollarSign,
  MapPin,
  Monitor,
  X,
  CheckCircle,
  AlertCircle,
  Loader2,
  CreditCard,
  Users,
  Check,
  ChevronRight,
} from "lucide-react";

interface Screen {
  id: number;
  name: string;
  city: string;
  location_name: string;
  cost_per_10_seconds: number;
  daily_footfall: number;
  is_active: boolean;
  demographics: string;
  peak_hours: string;
}

interface Screen {
  id: number;
  name: string;
  location_name: string;
  city: string;
  state: string;
  screen_type: string;
  cost_per_10_seconds: number;
  daily_footfall: number;
  screen_size_width?: number;
  screen_size_height?: number;
}

interface BookingData {
  screen_id: number;
  start_date: string;
  end_date: string;
  campaign_id?: number;
  total_amount: number;
  booking_hours: number[];
  content_url?: string;
  notes?: string;
}

interface ScreenBookingModalProps {
  screen?: Screen | null;
  screens?: Screen[];
  isOpen: boolean;
  onClose: () => void;
  onBookingSuccess?: (booking: any) => void;
  onBookingRequest?: (screenId: number, bookingData: any) => void;
}

const ScreenBookingModal: React.FC<ScreenBookingModalProps> = ({
  screen,
  screens,
  isOpen,
  onClose,
  onBookingSuccess,
  onBookingRequest,
}) => {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [availability, setAvailability] = useState<any>(null);
  const [bookingData, setBookingData] = useState<BookingData>({
    screen_id: 0,
    start_date: "",
    end_date: "",
    total_amount: 0,
    booking_hours: [],
  });
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [errors, setErrors] = useState<any>({});

  // Time slots (24-hour format)
  const timeSlots = [
    { hour: 6, label: "6:00 AM" },
    { hour: 7, label: "7:00 AM" },
    { hour: 8, label: "8:00 AM" },
    { hour: 9, label: "9:00 AM" },
    { hour: 10, label: "10:00 AM" },
    { hour: 11, label: "11:00 AM" },
    { hour: 12, label: "12:00 PM" },
    { hour: 13, label: "1:00 PM" },
    { hour: 14, label: "2:00 PM" },
    { hour: 15, label: "3:00 PM" },
    { hour: 16, label: "4:00 PM" },
    { hour: 17, label: "5:00 PM" },
    { hour: 18, label: "6:00 PM" },
    { hour: 19, label: "7:00 PM" },
    { hour: 20, label: "8:00 PM" },
    { hour: 21, label: "9:00 PM" },
    { hour: 22, label: "10:00 PM" },
  ];

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen && screen) {
      setBookingData((prev) => ({
        ...prev,
        screen_id: screen.id,
      }));
      setStep(1);
      setErrors({});
      setAvailability(null);
      setSelectedHours([]);
    }
  }, [isOpen, screen]);

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat("en-IN", {
      style: "currency",
      currency: "INR",
    }).format(amount);
  };

  if (!isOpen || !screen) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 backdrop-blur-sm"
        onClick={(e) => e.target === e.currentTarget && onClose()}
      >
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="glass-card w-full max-w-4xl max-h-[90vh] overflow-y-auto mx-4"
        >
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200/20">
            <div>
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                Book Screen: {screen.name}
              </h2>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                <MapPin className="inline w-4 h-4 mr-1" />
                {screen.location_name}, {screen.city}, {screen.state}
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>

          {/* Screen Info */}
          <div className="p-6">
            <div className="modern-card">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="flex items-center space-x-3">
                  <Monitor className="w-5 h-5 text-blue-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Screen Type
                    </p>
                    <p className="font-medium">{screen.screen_type}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <DollarSign className="w-5 h-5 text-green-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Rate per Hour
                    </p>
                    <p className="font-medium">
                      {formatCurrency(screen.cost_per_10_seconds * 360)}
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="w-5 h-5 text-red-600" />
                  <div>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Daily Footfall
                    </p>
                    <p className="font-medium">
                      {screen.daily_footfall.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
            </div>

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              onClose();
              resetModal();
            }
          }}
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl"
          >
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-6">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold flex items-center">
                    <Monitor className="mr-3" size={28} />
                    Book Screen: {screen.name}
                  </h2>
                  <div className="flex items-center mt-2 text-blue-100">
                    <MapPin size={16} className="mr-1" />
                    <span>{screen.location_name}, {screen.city}</span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    onClose();
                    resetModal();
                  }}
                  className="p-2 hover:bg-white hover:bg-opacity-20 rounded-lg transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              {/* Progress Steps */}
              <div className="flex items-center mt-6 space-x-4">
                {[
                  { key: 'details', label: 'Booking Details', icon: FileText },
                  { key: 'confirmation', label: 'Confirmation', icon: Check },
                  { key: 'notification', label: 'Owner Notification', icon: Bell },
                  { key: 'payment', label: 'Payment', icon: CreditCard },
                ].map((step, index) => {
                  const StepIcon = step.icon;
                  const isActive = currentStep === step.key;
                  const isCompleted = ['details', 'confirmation', 'notification', 'payment'].indexOf(currentStep) > index;
                  
                  return (
                    <div key={step.key} className="flex items-center">
                      <div className={`flex items-center justify-center w-10 h-10 rounded-full border-2 transition-colors ${
                        isActive ? 'bg-white text-blue-600 border-white' :
                        isCompleted ? 'bg-green-500 text-white border-green-500' :
                        'bg-transparent text-white border-white border-opacity-50'
                      }`}>
                        {isCompleted ? <Check size={20} /> : <StepIcon size={20} />}
                      </div>
                      <span className={`ml-2 text-sm ${isActive ? 'text-white font-semibold' : 'text-blue-100'}`}>
                        {step.label}
                      </span>
                      {index < 3 && <ChevronRight size={16} className="mx-2 text-blue-200" />}
                    </div>
                  );
                })}
              </div>
            </div>

            <div className="p-6 overflow-y-auto" style={{ maxHeight: 'calc(90vh - 200px)' }}>
              
              {/* Step 1: Booking Details */}
              {currentStep === 'details' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  {/* Customer Information */}
                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <User className="mr-2 text-blue-600" size={20} />
                      Customer Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Full Name *</label>
                        <input
                          type="text"
                          value={bookingData.customer_name}
                          onChange={(e) => setBookingData(prev => ({ ...prev, customer_name: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Enter your full name"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Email Address *</label>
                        <input
                          type="email"
                          value={bookingData.customer_email}
                          onChange={(e) => setBookingData(prev => ({ ...prev, customer_email: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="your@email.com"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number *</label>
                        <input
                          type="tel"
                          value={bookingData.customer_phone}
                          onChange={(e) => setBookingData(prev => ({ ...prev, customer_phone: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+91-9876543210"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Urgency Level</label>
                        <select
                          value={bookingData.urgency_level}
                          onChange={(e) => setBookingData(prev => ({ ...prev, urgency_level: e.target.value as any }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        >
                          <option value="normal">Normal (2-3 days response)</option>
                          <option value="urgent">Urgent (24 hours response)</option>
                          <option value="emergency">Emergency (Same day response)</option>
                        </select>
                      </div>
                    </div>
                  </div>

                  {/* Campaign Information */}
                  <div className="bg-purple-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Zap className="mr-2 text-purple-600" size={20} />
                      Campaign Information
                    </h3>
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Title *</label>
                        <input
                          type="text"
                          value={bookingData.campaign_title}
                          onChange={(e) => setBookingData(prev => ({ ...prev, campaign_title: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                          placeholder="e.g., Summer Sale 2025"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Description</label>
                        <textarea
                          value={bookingData.campaign_description}
                          onChange={(e) => setBookingData(prev => ({ ...prev, campaign_description: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500 h-24 resize-none"
                          placeholder="Brief description of your advertisement campaign..."
                        />
                      </div>
                    </div>
                  </div>

                  {/* Schedule & Duration */}
                  <div className="bg-green-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Calendar className="mr-2 text-green-600" size={20} />
                      Schedule & Duration
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date *</label>
                        <input
                          type="date"
                          value={bookingData.start_date}
                          onChange={(e) => setBookingData(prev => ({ ...prev, start_date: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min={new Date().toISOString().split('T')[0]}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date *</label>
                        <input
                          type="date"
                          value={bookingData.end_date}
                          onChange={(e) => setBookingData(prev => ({ ...prev, end_date: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min={bookingData.start_date}
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Time *</label>
                        <input
                          type="time"
                          value={bookingData.start_time}
                          onChange={(e) => setBookingData(prev => ({ ...prev, start_time: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          required
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Time *</label>
                        <input
                          type="time"
                          value={bookingData.end_time}
                          onChange={(e) => setBookingData(prev => ({ ...prev, end_time: e.target.value }))}
                          className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500"
                          min={bookingData.start_time}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  {/* Message to Owner */}
                  <div className="bg-orange-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <Mail className="mr-2 text-orange-600" size={20} />
                      Message to Screen Owner (Optional)
                    </h3>
                    <textarea
                      value={bookingData.message_to_owner}
                      onChange={(e) => setBookingData(prev => ({ ...prev, message_to_owner: e.target.value }))}
                      className="w-full px-4 py-3 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-orange-500 h-32 resize-none"
                      placeholder="Any special requirements, questions, or additional information for the screen owner..."
                    />
                  </div>

                  {/* Cost Summary */}
                  <div className="bg-blue-50 rounded-xl p-6 border border-blue-200">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
                      <DollarSign className="mr-2 text-blue-600" size={20} />
                      Cost Estimate
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-blue-600">₹{(screen.cost_per_10_seconds || 15) * 360}</div>
                        <div className="text-sm text-gray-600">Per Hour</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-green-600">{bookingData.total_slots}</div>
                        <div className="text-sm text-gray-600">Total Slots</div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-purple-600">{Math.ceil((new Date(bookingData.end_date).getTime() - new Date(bookingData.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1}</div>
                        <div className="text-sm text-gray-600">Days</div>
                      </div>
                      <div className="text-center">
                        <div className="text-3xl font-bold text-red-600">₹{bookingData.estimated_cost.toLocaleString()}</div>
                        <div className="text-sm text-gray-600">Total Estimate</div>
                      </div>
                    </div>
                    <div className="mt-4 p-3 bg-white rounded-lg">
                      <p className="text-sm text-gray-600">
                        <strong>Note:</strong> This is an estimated cost. Final pricing may vary based on owner's terms and conditions. 
                        Additional charges may apply for premium time slots or special requirements.
                      </p>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <motion.button
                      className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 text-white py-4 px-6 rounded-xl hover:from-blue-700 hover:to-purple-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep('confirmation')}
                      disabled={!bookingData.customer_name || !bookingData.customer_email || !bookingData.campaign_title}
                    >
                      <ChevronRight size={20} />
                      <span>Review Booking</span>
                    </motion.button>
                    <motion.button
                      className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => {
                        onClose();
                        resetModal();
                      }}
                    >
                      Cancel
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 2: Confirmation */}
              {currentStep === 'confirmation' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200">
                    <h3 className="text-xl font-semibold text-gray-800 mb-6 flex items-center">
                      <CheckCircle className="mr-2 text-green-600" size={24} />
                      Booking Summary - Please Confirm
                    </h3>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {/* Screen Details */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Monitor className="mr-2" size={16} />
                          Screen Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-gray-600">Name:</span> <span className="font-medium">{screen.name}</span></div>
                          <div><span className="text-gray-600">Location:</span> <span className="font-medium">{screen.location_name}</span></div>
                          <div><span className="text-gray-600">City:</span> <span className="font-medium">{screen.city}</span></div>
                          <div><span className="text-gray-600">Size:</span> <span className="font-medium">{screen.screen_size_width}×{screen.screen_size_height}"</span></div>
                        </div>
                      </div>

                      {/* Customer Info */}
                      <div className="bg-white rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <User className="mr-2" size={16} />
                          Customer Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-gray-600">Name:</span> <span className="font-medium">{bookingData.customer_name}</span></div>
                          <div><span className="text-gray-600">Email:</span> <span className="font-medium">{bookingData.customer_email}</span></div>
                          <div><span className="text-gray-600">Phone:</span> <span className="font-medium">{bookingData.customer_phone}</span></div>
                          <div><span className="text-gray-600">Priority:</span> <span className="font-medium capitalize">{bookingData.urgency_level}</span></div>
                        </div>
                      </div>

                      {/* Campaign Info */}
                      <div className="bg-white rounded-lg p-4 md:col-span-2">
                        <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                          <Zap className="mr-2" size={16} />
                          Campaign Details
                        </h4>
                        <div className="space-y-2 text-sm">
                          <div><span className="text-gray-600">Title:</span> <span className="font-medium">{bookingData.campaign_title}</span></div>
                          {bookingData.campaign_description && (
                            <div><span className="text-gray-600">Description:</span> <span className="font-medium">{bookingData.campaign_description}</span></div>
                          )}
                          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div><span className="text-gray-600">Start Date:</span> <span className="font-medium">{bookingData.start_date}</span></div>
                            <div><span className="text-gray-600">End Date:</span> <span className="font-medium">{bookingData.end_date}</span></div>
                            <div><span className="text-gray-600">Start Time:</span> <span className="font-medium">{bookingData.start_time}</span></div>
                            <div><span className="text-gray-600">End Time:</span> <span className="font-medium">{bookingData.end_time}</span></div>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Cost Breakdown */}
                    <div className="mt-6 bg-blue-50 rounded-lg p-4">
                      <h4 className="font-semibold text-gray-800 mb-3 flex items-center">
                        <DollarSign className="mr-2 text-blue-600" size={16} />
                        Cost Breakdown
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                        <div>
                          <div className="text-lg font-bold text-blue-600">₹{(screen.cost_per_10_seconds || 15) * 360}</div>
                          <div className="text-xs text-gray-600">Per Hour Rate</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-green-600">{bookingData.total_slots}</div>
                          <div className="text-xs text-gray-600">Total Hours</div>
                        </div>
                        <div>
                          <div className="text-lg font-bold text-purple-600">{Math.ceil((new Date(bookingData.end_date).getTime() - new Date(bookingData.start_date).getTime()) / (1000 * 60 * 60 * 24)) + 1}</div>
                          <div className="text-xs text-gray-600">Total Days</div>
                        </div>
                        <div>
                          <div className="text-xl font-bold text-red-600">₹{bookingData.estimated_cost.toLocaleString()}</div>
                          <div className="text-xs text-gray-600">Total Amount</div>
                        </div>
                      </div>
                    </div>

                    {bookingData.message_to_owner && (
                      <div className="mt-4 bg-orange-50 rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2 flex items-center">
                          <Mail className="mr-2 text-orange-600" size={16} />
                          Message to Owner
                        </h4>
                        <p className="text-sm text-gray-700 italic">"{bookingData.message_to_owner}"</p>
                      </div>
                    )}
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row space-y-3 sm:space-y-0 sm:space-x-4">
                    <motion.button
                      className="flex-1 bg-gradient-to-r from-green-600 to-blue-600 text-white py-4 px-6 rounded-xl hover:from-green-700 hover:to-blue-700 transition-all duration-200 shadow-lg hover:shadow-xl font-semibold flex items-center justify-center space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleSubmitBooking}
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
                      <span>Send Booking Request</span>
                    </motion.button>
                    <motion.button
                      className="flex-1 bg-gray-200 text-gray-700 py-4 px-6 rounded-xl hover:bg-gray-300 transition-colors font-semibold"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={() => setCurrentStep('details')}
                    >
                      Back to Edit
                    </motion.button>
                  </div>
                </motion.div>
              )}

              {/* Step 3: Notification Status */}
              {currentStep === 'notification' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6 text-center"
                >
                  <div className="bg-yellow-50 rounded-xl p-8 border border-yellow-200">
                    <motion.div
                      animate={{ rotate: notificationSent ? 0 : 360 }}
                      transition={{ duration: 1, repeat: notificationSent ? 0 : Infinity, ease: "linear" }}
                    >
                      <Bell size={48} className={`mx-auto mb-4 ${notificationSent ? 'text-green-600' : 'text-yellow-600'}`} />
                    </motion.div>
                    
                    <h3 className="text-xl font-semibold text-gray-800 mb-4">
                      {bookingStatus === null ? 'Notifying Screen Owner...' :
                       bookingStatus === 'approved' ? '🎉 Booking Request Approved!' :
                       '❌ Booking Request Declined'}
                    </h3>

                    {bookingStatus === null && (
                      <div className="space-y-3">
                        <p className="text-gray-600">
                          We're sending your booking request to the screen owner:
                        </p>
                        <div className="bg-white rounded-lg p-4 max-w-md mx-auto">
                          <div className="grid grid-cols-1 gap-2 text-sm">
                            <div className="flex items-center justify-center">
                              <Mail size={16} className="mr-2 text-blue-600" />
                              <span>{screen.contact_email || screen.venue_owner_name || 'owner@example.com'}</span>
                            </div>
                            <div className="flex items-center justify-center">
                              <Phone size={16} className="mr-2 text-green-600" />
                              <span>{screen.contact_phone || '+91-9876543210'}</span>
                            </div>
                            <div className="flex items-center justify-center mt-2">
                              <User size={16} className="mr-2 text-purple-600" />
                              <span>{screen.venue_owner_name || 'Screen Owner'}</span>
                            </div>
                          </div>
                        </div>
                        <p className="text-sm text-gray-500">
                          Expected response time: {bookingData.urgency_level === 'emergency' ? 'Within 2 hours' :
                                                 bookingData.urgency_level === 'urgent' ? 'Within 24 hours' :
                                                 'Within 2-3 business days'}
                        </p>
                      </div>
                    )}

                    {bookingStatus === 'approved' && (
                      <div className="space-y-3">
                        <div className="bg-green-100 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-green-800 font-medium">
                            Great news! The screen owner has approved your booking request.
                          </p>
                          <p className="text-green-700 text-sm mt-2">
                            Booking ID: <span className="font-mono bg-green-200 px-2 py-1 rounded">{bookingId}</span>
                          </p>
                        </div>
                        <p className="text-gray-600">
                          Please proceed to payment to confirm your booking.
                        </p>
                      </div>
                    )}

                    {bookingStatus === 'rejected' && (
                      <div className="space-y-3">
                        <div className="bg-red-100 rounded-lg p-4 max-w-md mx-auto">
                          <p className="text-red-800 font-medium">
                            Unfortunately, the screen owner couldn't approve your booking request at this time.
                          </p>
                          <p className="text-red-700 text-sm mt-2">
                            This might be due to scheduling conflicts or other commitments.
                          </p>
                        </div>
                        <p className="text-gray-600">
                          You can try booking different dates or contact the owner directly.
                        </p>
                        <div className="flex space-x-4 justify-center mt-4">
                          <motion.button
                            className="bg-blue-600 text-white py-2 px-6 rounded-lg hover:bg-blue-700 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => setCurrentStep('details')}
                          >
                            Try Different Dates
                          </motion.button>
                          <motion.button
                            className="bg-gray-200 text-gray-700 py-2 px-6 rounded-lg hover:bg-gray-300 transition-colors"
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={() => {
                              onClose();
                              resetModal();
                            }}
                          >
                            Close
                          </motion.button>
                        </div>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}

              {/* Step 4: Payment */}
              {currentStep === 'payment' && bookingStatus === 'approved' && (
                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="space-y-6"
                >
                  <div className="bg-green-50 rounded-xl p-6 border border-green-200 text-center">
                    <Shield size={48} className="mx-auto text-green-600 mb-4" />
                    <h3 className="text-xl font-semibold text-gray-800 mb-2">
                      Secure Payment Processing
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Complete your payment to confirm the booking
                    </p>
                    
                    <div className="bg-white rounded-lg p-4 max-w-md mx-auto mb-6">
                      <div className="text-2xl font-bold text-green-600 mb-2">
                        ₹{bookingData.estimated_cost.toLocaleString()}
                      </div>
                      <div className="text-sm text-gray-600">
                        Booking ID: <span className="font-mono bg-gray-100 px-2 py-1 rounded">{bookingId}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Methods */}
                  <div className="space-y-4">
                    <h4 className="text-lg font-semibold text-gray-800 text-center">Choose Payment Method</h4>
                    
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      {/* UPI Payment */}
                      <motion.button
                        className="bg-white border-2 border-gray-200 hover:border-purple-500 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePayment('upi')}
                        disabled={isSubmitting}
                      >
                        <QrCode size={32} className="mx-auto text-purple-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h5 className="font-semibold text-gray-800 mb-2">UPI Payment</h5>
                        <p className="text-sm text-gray-600">Pay using Google Pay, PhonePe, Paytm, or any UPI app</p>
                      </motion.button>

                      {/* Card Payment */}
                      <motion.button
                        className="bg-white border-2 border-gray-200 hover:border-blue-500 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePayment('card')}
                        disabled={isSubmitting}
                      >
                        <CreditCard size={32} className="mx-auto text-blue-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h5 className="font-semibold text-gray-800 mb-2">Card Payment</h5>
                        <p className="text-sm text-gray-600">Pay securely with your debit or credit card</p>
                      </motion.button>

                      {/* Net Banking */}
                      <motion.button
                        className="bg-white border-2 border-gray-200 hover:border-green-500 rounded-xl p-6 text-center transition-all duration-200 hover:shadow-lg group disabled:opacity-50 disabled:cursor-not-allowed"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handlePayment('netbanking')}
                        disabled={isSubmitting}
                      >
                        <Banknote size={32} className="mx-auto text-green-600 mb-3 group-hover:scale-110 transition-transform" />
                        <h5 className="font-semibold text-gray-800 mb-2">Net Banking</h5>
                        <p className="text-sm text-gray-600">Pay directly from your bank account</p>
                      </motion.button>
                    </div>

                    {isSubmitting && (
                      <div className="bg-blue-50 rounded-lg p-4 text-center">
                        <Loader2 size={24} className="animate-spin mx-auto text-blue-600 mb-2" />
                        <p className="text-blue-700 font-medium">Processing Payment...</p>
                        <p className="text-blue-600 text-sm">Please don't close this window</p>
                      </div>
                    )}
                  </div>

                  {/* Security Note */}
                  <div className="bg-gray-50 rounded-lg p-4 text-center">
                    <div className="flex items-center justify-center space-x-2 text-sm text-gray-600">
                      <Shield size={16} />
                      <span>Your payment is secured with 256-bit SSL encryption</span>
                    </div>
                  </div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default ScreenBookingModal;
