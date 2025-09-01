import React, { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  MapPin, 
  Clock, 
  DollarSign, 
  Calendar, 
  Monitor,
  CheckCircle,
  Loader2,
  AlertCircle,
  ArrowLeft,
  ArrowRight
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';

interface Screen {
  id: number;
  name: string;
  city: string;
  location_name: string;
  address: string;
  daily_footfall: number;
  cost_per_10_seconds: string;
  resolution_width: number;
  resolution_height: number;
  screen_type: string;
  is_active: boolean;
}

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  price: number;
  available: boolean;
}

interface BookingDetails {
  screen: Screen;
  selectedDate: string;
  selectedSlot: TimeSlot;
  totalPrice: number;
}

const SimpleCampaignCreation: React.FC = () => {
  // State management
  const [screens, setScreens] = useState<Screen[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  
  // Campaign details
  const [campaignName, setCampaignName] = useState('');
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [bookingDetails, setBookingDetails] = useState<BookingDetails | null>(null);

  // Time slots for demo
  const timeSlots: TimeSlot[] = [
    { id: '1', start_time: '09:00', end_time: '12:00', price: 500, available: true },
    { id: '2', start_time: '12:00', end_time: '15:00', price: 750, available: true },
    { id: '3', start_time: '15:00', end_time: '18:00', price: 1000, available: true },
    { id: '4', start_time: '18:00', end_time: '21:00', price: 1200, available: false },
    { id: '5', start_time: '21:00', end_time: '24:00', price: 800, available: true },
  ];

  // Fetch screens on component mount
  useEffect(() => {
    const fetchScreens = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching screens for Bangalore...');
        
        const bangaloreScreens = await bookingService.getAvailableScreensByCity('Bangalore');
        console.log('Received screens:', bangaloreScreens);
        
        if (bangaloreScreens.length === 0) {
          setError('No active screens found in Bangalore. The API might be returning empty data.');
          return;
        }

        setScreens(bangaloreScreens as Screen[]);
      } catch (err) {
        console.error('Error fetching screens:', err);
        setError(`Failed to fetch screens: ${err}`);
      } finally {
        setLoading(false);
      }
    };

    fetchScreens();
  }, []);

  const handleScreenSelect = (screen: Screen) => {
    setSelectedScreen(screen);
    setCurrentStep(2);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!selectedScreen || !slot.available) return;
    
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    
    setBookingDetails({
      screen: selectedScreen,
      selectedDate: tomorrow.toISOString().split('T')[0],
      selectedSlot: slot,
      totalPrice: slot.price
    });
    setCurrentStep(3);
  };

  const handleBookingConfirm = async () => {
    if (!bookingDetails || !campaignName.trim()) {
      setError('Please enter a campaign name');
      return;
    }

    try {
      setLoading(true);
      
      console.log('Sending booking request:', {
        campaign_name: campaignName,
        screen_id: bookingDetails.screen.id,
        screen_name: bookingDetails.screen.name,
        date: bookingDetails.selectedDate,
        time_slot: `${bookingDetails.selectedSlot.start_time}-${bookingDetails.selectedSlot.end_time}`,
        price: bookingDetails.totalPrice
      });

      const result = await bookingService.sendBookingRequest({
        campaign_name: campaignName,
        advertiser_id: 'advertiser-001',
        advertiser_name: 'Demo Advertiser',
        screen_id: bookingDetails.screen.id,
        screen_name: bookingDetails.screen.name,
        screen_owner_id: `owner-${bookingDetails.screen.id}`,
        start_date: bookingDetails.selectedDate,
        end_date: bookingDetails.selectedDate,
        start_time: bookingDetails.selectedSlot.start_time,
        end_time: bookingDetails.selectedSlot.end_time,
        daily_budget: bookingDetails.totalPrice,
        total_budget: bookingDetails.totalPrice,
        message: `Booking request for ${campaignName} campaign`
      });

      console.log('Booking request sent:', result);
      
      // Show success message
      alert(`Booking request sent successfully! Request ID: ${result.id}\n\nThe venue owner will receive this request in their dashboard.`);
      
      // Reset form
      setCampaignName('');
      setSelectedScreen(null);
      setBookingDetails(null);
      setCurrentStep(1);
      
    } catch (error) {
      console.error('Error sending booking request:', error);
      setError('Failed to send booking request. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      if (currentStep === 2) {
        setSelectedScreen(null);
      } else if (currentStep === 3) {
        setBookingDetails(null);
      }
    }
  };

  // Loading state
  if (loading && currentStep === 1) {
    return (
      <div className="min-h-screen bg-gray-50 p-8">
        <div className="max-w-6xl mx-auto">
          <h1 className="text-3xl font-bold text-gray-900 mb-8">Campaign Creation</h1>
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
            <span className="ml-2 text-gray-600">Loading screens...</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Campaign Creation</h1>
          <div className="flex items-center space-x-4">
            {[1, 2, 3].map((step) => (
              <div key={step} className="flex items-center">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                  currentStep >= step ? 'bg-blue-600 text-white' : 'bg-gray-300 text-gray-600'
                }`}>
                  {step}
                </div>
                <span className={`ml-2 ${
                  currentStep >= step ? 'text-blue-600 font-medium' : 'text-gray-500'
                }`}>
                  {step === 1 ? 'Select Screen' : step === 2 ? 'Choose Time Slot' : 'Confirm Booking'}
                </span>
                {step < 3 && <ArrowRight className="ml-4 h-4 w-4 text-gray-400" />}
              </div>
            ))}
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="flex">
              <AlertCircle className="h-5 w-5 text-red-500 mt-0.5" />
              <div className="ml-3">
                <p className="text-red-800">{error}</p>
                <button 
                  onClick={() => window.location.reload()} 
                  className="mt-2 text-red-600 hover:text-red-800 underline text-sm"
                >
                  Refresh Page
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Step 1: Screen Selection */}
        {currentStep === 1 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <h2 className="text-xl font-semibold text-gray-900">Select a Screen in Bangalore</h2>
            
            {screens.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600 text-lg">No screens available</p>
                <p className="text-gray-500 text-sm mt-2">
                  API returned {screens.length} screens. Check console for details.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {screens.map((screen) => (
                  <motion.div
                    key={screen.id}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleScreenSelect(screen)}
                    className="bg-white rounded-lg shadow-md p-6 border border-gray-200 hover:border-blue-500 cursor-pointer transition-all"
                  >
                    <div className="flex items-start justify-between mb-4">
                      <div className="bg-blue-100 rounded-lg p-3">
                        <Monitor className="h-6 w-6 text-blue-600" />
                      </div>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        screen.is_active 
                          ? 'bg-green-100 text-green-800' 
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {screen.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{screen.name}</h3>
                    
                    <div className="space-y-2 text-sm text-gray-600 mb-4">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span>{screen.address || screen.location_name}</span>
                      </div>
                      <div className="flex items-center">
                        <Monitor className="h-4 w-4 mr-2" />
                        <span>{screen.resolution_width}×{screen.resolution_height}</span>
                      </div>
                      <div className="flex items-center">
                        <DollarSign className="h-4 w-4 mr-2" />
                        <span>₹{screen.cost_per_10_seconds}/10sec</span>
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t border-gray-200">
                      <div className="flex justify-between items-center text-sm">
                        <span className="text-gray-500">Daily Footfall:</span>
                        <span className="font-medium text-gray-900">
                          {screen.daily_footfall?.toLocaleString()} people
                        </span>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        )}

        {/* Step 2: Time Slot Selection */}
        {currentStep === 2 && selectedScreen && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">
                Choose Time Slot for {selectedScreen.name}
              </h2>
              <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h3 className="text-lg font-medium text-gray-900 mb-2">Selected Screen</h3>
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <span>📍 {selectedScreen.address}</span>
                <span>👥 {selectedScreen.daily_footfall?.toLocaleString()} daily footfall</span>
                <span>📺 {selectedScreen.resolution_width}×{selectedScreen.resolution_height}</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeSlots.map((slot) => (
                <motion.div
                  key={slot.id}
                  whileHover={{ scale: slot.available ? 1.02 : 1 }}
                  whileTap={{ scale: slot.available ? 0.98 : 1 }}
                  onClick={() => slot.available && handleTimeSlotSelect(slot)}
                  className={`border rounded-lg p-4 transition-all ${
                    slot.available 
                      ? 'border-gray-200 hover:border-blue-500 bg-white cursor-pointer' 
                      : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <Clock className="h-5 w-5 text-gray-600" />
                    <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                      slot.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {slot.available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  
                  <div className="text-lg font-semibold text-gray-900 mb-1">
                    {slot.start_time} - {slot.end_time}
                  </div>
                  
                  <div className="flex items-center text-green-600 font-medium">
                    <DollarSign className="h-4 w-4" />
                    <span>₹{slot.price}</span>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Booking Confirmation */}
        {currentStep === 3 && bookingDetails && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-6"
          >
            <div className="flex items-center justify-between">
              <h2 className="text-xl font-semibold text-gray-900">Confirm Booking</h2>
              <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-gray-800"
              >
                <ArrowLeft className="h-4 w-4 mr-1" />
                Back
              </button>
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h3 className="text-lg font-medium text-gray-900 mb-4">Booking Summary</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Screen Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Name:</strong> {bookingDetails.screen.name}</p>
                    <p><strong>Location:</strong> {bookingDetails.screen.address}</p>
                    <p><strong>Type:</strong> {bookingDetails.screen.screen_type}</p>
                    <p><strong>Resolution:</strong> {bookingDetails.screen.resolution_width}×{bookingDetails.screen.resolution_height}</p>
                  </div>
                </div>
                
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">Booking Details</h4>
                  <div className="space-y-1 text-sm text-gray-600">
                    <p><strong>Date:</strong> {new Date(bookingDetails.selectedDate).toLocaleDateString()}</p>
                    <p><strong>Time:</strong> {bookingDetails.selectedSlot.start_time} - {bookingDetails.selectedSlot.end_time}</p>
                    <p><strong>Duration:</strong> 3 hours</p>
                    <p className="text-lg font-semibold text-green-600 mt-2">
                      <strong>Total: ₹{bookingDetails.totalPrice}</strong>
                    </p>
                  </div>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Campaign Name *
                </label>
                <input
                  type="text"
                  value={campaignName}
                  onChange={(e) => setCampaignName(e.target.value)}
                  placeholder="Enter campaign name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  required
                />
              </div>

              <div className="flex justify-end pt-4">
                <button
                  onClick={handleBookingConfirm}
                  disabled={!campaignName.trim() || loading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
                >
                  {loading ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Sending Request...
                    </>
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Send Booking Request
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default SimpleCampaignCreation;
