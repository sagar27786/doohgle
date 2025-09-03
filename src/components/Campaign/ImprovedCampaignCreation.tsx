import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
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
  ArrowRight,
  Users,
  Zap,
  Play,
  Star,
  Eye,
  Film,
  Image as ImageIcon
} from 'lucide-react';
import ScreenDetailsModal from '../VenueDashboard/ScreenDetailsModal';

interface Screen {
  id: number;
  user_id?: number;
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
  hourly_rate: number;
  daily_rate: number;
  weekly_rate: number;
  currency: string;
  device_type: string;
  day_photo_url?: string;
  night_photo_url?: string;
  video_url?: string;
}

interface TimeSlot {
  id: string;
  start_time: string;
  end_time: string;
  price: number;
  available: boolean;
}

const steps = [
    { id: 1, name: 'Choose Screens' },
    { id: 2, name: 'Choose Time' },
    { id: 3, name: 'Upload Creative' },
    { id: 4, name: 'Confirm & Book' },
  ];

const ImprovedCampaignCreation: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [allScreens, setAllScreens] = useState<Screen[]>([]);
  const [availableCities, setAvailableCities] = useState<string[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('all');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedScreens, setSelectedScreens] = useState<Screen[]>([]);
  const [campaignName, setCampaignName] = useState('');
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null);
  const [selectedScreenForModal, setSelectedScreenForModal] = useState<Screen | null>(null);
  const [creativeFiles, setCreativeFiles] = useState<File[]>([]);
  const [creativeUrls, setCreativeUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  
  // Time slots
  const timeSlots: TimeSlot[] = [
    { id: '1', start_time: '08:00', end_time: '11:00', price: 800, available: true },
    { id: '2', start_time: '11:00', end_time: '14:00', price: 1200, available: true },
    { id: '3', start_time: '14:00', end_time: '17:00', price: 1500, available: true },
    { id: '4', start_time: '17:00', end_time: '20:00', price: 2000, available: false },
    { id: '5', start_time: '20:00', end_time: '23:00', price: 1800, available: true },
  ];

  // Direct API call to get all screens
  const fetchScreens = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching all screens from API...');
      
      const response = await fetch('http://localhost:4000/api/screens');
      console.log('API Response status:', response.status, response.ok);
      
      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }
      
      const result = await response.json();
      console.log("screens which I got from db are:");
      console.log(result);
      console.log('Raw API result:', result);
      
      if (!result.success) {
        throw new Error('API returned success: false');
      }
      
      // Get all active screens
      const activeScreens = result.data.filter((screen: any) => screen.is_active === true);
      
      console.log(`Found ${activeScreens.length} active screens:`, activeScreens);
      
      if (activeScreens.length === 0) {
        setError('No active screens found');
        return;
      }
      
      // Transform data for UI
      const transformedScreens: Screen[] = activeScreens.map((screen: any) => ({
        id: screen.id,
        user_id: screen.user_id,
        name: screen.name,
        city: screen.city,
        location_name: screen.location_name || 'Indoor',
        address: screen.address || `${screen.location_name}, ${screen.city}`,
        daily_footfall: screen.daily_footfall || 10000,
        cost_per_10_seconds: screen.cost_per_10_seconds || '50',
        resolution_width: screen.width_px || 1280,
        resolution_height: screen.height_px || 720,
        screen_type: screen.screen_type || 'smart_tv',
        is_active: screen.is_active,
        hourly_rate: screen.hourly_rate || 0,
        daily_rate: screen.daily_rate || 0,
        weekly_rate: screen.weekly_rate || 0,
        currency: screen.currency || '₹',
        device_type: screen.device_type || 'N/A',
        day_photo_url: screen.day_photo_url, // API now uses day_photo_url
        night_photo_url: screen.night_photo_url,
        video_url: screen.video_url,
      }));
      console.log("transformed screens are:");
      console.log(transformedScreens);
      
      setAllScreens(transformedScreens);
      
      // Get unique cities
      const cities = [...new Set(transformedScreens.map(s => s.city))].sort();
      setAvailableCities(cities);
      
      // Filter screens based on selected city
      filterScreensByCity(transformedScreens, selectedCity);
      
      console.log('Transformed screens:', transformedScreens);
      console.log('Available cities:', cities);
      
    } catch (err: any) {
      console.error('Error fetching screens:', err);
      setError(err.message || 'Failed to fetch screens');
    } finally {
      setLoading(false);
    }
  };

  // Filter screens by city
  const filterScreensByCity = (allScreensData: Screen[], city: string) => {
    if (city === 'all') {
      setScreens(allScreensData);
    } else {
      const filtered = allScreensData.filter(s => s.city.toLowerCase() === city.toLowerCase());
      setScreens(filtered);
    }
  };

  // Handle city filter change
  const handleCityChange = (city: string) => {
    setSelectedCity(city);
    filterScreensByCity(allScreens, city);
  };

  useEffect(() => {
    fetchScreens();
  }, []);

  // Filter screens when city selection changes
  useEffect(() => {
    if (allScreens.length > 0) {
      filterScreensByCity(allScreens, selectedCity);
    }
  }, [selectedCity, allScreens]);

  const handleScreenSelect = (screen: Screen) => {
    setSelectedScreens(prevSelected => {
      if (prevSelected.find(s => s.id === screen.id)) {
        return prevSelected.filter(s => s.id !== screen.id);
      } else {
        return [...prevSelected, screen];
      }
    });
  };

  const handleNextStep = () => {
    if (currentStep === 1 && selectedScreens.length > 0) {
      setCurrentStep(2);
      setError(null);
    } else if (currentStep === 2 && selectedSlot) {
      setCurrentStep(3);
      setError(null);
    } else if (currentStep === 3 && creativeUrls.length > 0) { // Check for creativeUrl instead of creativeFile
      setCurrentStep(4);
      setError(null);
    } else {
      let errorMessage = 'Please make a selection to proceed.';
      if (currentStep === 3 && creativeUrls.length === 0) {
        errorMessage = 'Please upload your creative to proceed.';
      }
      setError(errorMessage);
    }
  };

  const handleViewDetails = (e: React.MouseEvent, screen: Screen) => {
    e.stopPropagation();
    setSelectedScreenForModal(screen);
  };

  const handleTimeSlotSelect = (slot: TimeSlot) => {
    if (!slot.available) return;
    setSelectedSlot(slot);
    setCurrentStep(3);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setCreativeFiles(Array.from(e.target.files));
    }
  };

  const renderCreativePreviews = () => {
    return creativeFiles.map((file, index) => {
      const url = URL.createObjectURL(file);
      return (
        <div key={index} className="relative w-full h-48 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
          {file.type.startsWith('image/') ? (
            <img src={url} alt={`preview ${index}`} className="h-full w-full object-contain" />
          ) : (
            <video src={url} className="h-full w-full object-contain" controls />
          )}
        </div>
      );
    });
  };

  const handleFileUpload = async () => {
    if (creativeFiles.length === 0) return;

    setUploading(true);
    const uploadPromises = creativeFiles.map(file => {
      const formData = new FormData();
      formData.append('file', file);

      return fetch('http://localhost:4000/api/upload/single', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`,
        },
        body: formData,
      });
    });

    try {
      const responses = await Promise.all(uploadPromises);
      const results = await Promise.all(responses.map(res => res.json()));
      setCreativeUrls(results.map(res => res.url));
    } catch (error) {
      setError('Failed to upload files.');
      console.error(error);
    } finally {
      setUploading(false);
    }
  };


  const handleBookingSubmit = async () => {
    if (selectedScreens.length === 0 || !selectedSlot || !campaignName) {
      setError('Please fill in all required fields');
      return;
    }

    try {
      setLoading(true);

      const bookingPromises = selectedScreens.map(screen => {
        const bookingData = {
          campaign_name: campaignName,
          advertiser_id: 'ads-manager-001', // Hardcoded for now
          screen_id: screen.id,
          screen_name: screen.name,
          screen_owner_id: screen.user_id, // Using user_id from Screen interface as owner_id
          start_date: '2024-08-01', // Hardcoded for now
          end_date: '2024-08-07', // Hardcoded for now
          start_time: selectedSlot.start_time,
          end_time: selectedSlot.end_time,
          daily_budget: screen.daily_rate,
          total_budget: screen.daily_rate * 7, // Example calculation
          message: 'New campaign booking request',
          creative_url: creativeUrls,
          creative_type: creativeFiles.map(f => f.type),
        };

        return fetch('http://localhost:4000/api/bookings/request', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token') || 'demo-token'}`,
          },
          body: JSON.stringify(bookingData),
        });
      });

      const responses = await Promise.all(bookingPromises);

      responses.forEach(response => {
        console.log('Booking API response:', response.status, response.ok);
      });

      // Show success message
      alert(`✅ Booking Requests Sent Successfully for ${selectedScreens.length} screens!

Campaign: ${campaignName}
Time: ${selectedSlot.start_time} - ${selectedSlot.end_time}
Total Cost per screen: ₹${selectedSlot.price}

The venue owners will receive your requests and respond shortly.`);

      // Reset form
      setCampaignName('');
      setSelectedScreens([]);
      setSelectedSlot(null);
      setCurrentStep(1);

    } catch (error) {
      console.error('Booking error:', error);
      setError('Failed to send booking requests. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const getScreenTypeIcon = (type: string) => {
    switch (type) {
      case 'smart_tv': return <Monitor className="h-5 w-5" />;
      case 'led_panel': return <Zap className="h-5 w-5" />;
      case 'media_player': return <Play className="h-5 w-5" />;
      default: return <Monitor className="h-5 w-5" />;
    }
  };

  const getScreenTypeColor = (type: string) => {
    switch (type) {
      case 'smart_tv': return 'bg-blue-500';
      case 'led_panel': return 'bg-yellow-500';
      case 'media_player': return 'bg-purple-500';
      default: return 'bg-gray-500';
    }
  };

  if (loading && currentStep === 1) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center">
              <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
              <h2 className="text-xl font-semibold text-gray-900 mb-2">Loading Available Screens</h2>
              <p className="text-gray-600">Fetching the latest screen data from our network...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">Create Campaign</h1>
          <p className="text-lg text-gray-600">Launch your advertising campaign in 3 simple steps</p>
          
          {/* Progress Steps */}
          <div className="flex justify-center mt-6 mb-8">
            {steps.map((step, index) => (
              <div key={step.id} className="flex items-center">
                <div className={`w-10 h-10 rounded-full flex items-center justify-center font-semibold ${
                  currentStep >= step.id 
                    ? 'bg-blue-600 text-white' 
                    : 'bg-gray-300 text-gray-600'
                }`}>
                  {step.id}
                </div>
                <span className={`ml-2 font-medium ${
                  currentStep >= step.id ? 'text-blue-600' : 'text-gray-500'
                }`}>
                  {step.name}
                </span>
                {index < steps.length - 1 && <ArrowRight className="ml-4 h-5 w-5 text-gray-400" />}
              </div>
            ))}
          </div>
        </div>
        
        {/* Error Display */}
        {error && (
          <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-lg">
            <div className="flex items-center">
              <AlertCircle className="h-6 w-6 text-red-500 mr-3" />
              <div>
                <h3 className="text-lg font-semibold text-red-800">Error</h3>
                <p className="text-red-700">{error}</p>
                <button 
                  onClick={fetchScreens}
                  className="mt-2 bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
                >
                  Retry
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
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                Choose Your Screen ({screens.length} Available)
              </h2>
              
              {/* City Filter */}
              <div className="flex items-center space-x-4">
                <label className="text-sm font-medium text-gray-700">Filter by City:</label>
                <select
                  value={selectedCity}
                  onChange={(e) => handleCityChange(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="all">All Cities ({allScreens.length})</option>
                  {availableCities.map((city) => (
                    <option key={city} value={city}>
                      {city.charAt(0).toUpperCase() + city.slice(1)} ({allScreens.filter(s => s.city.toLowerCase() === city.toLowerCase()).length})
                    </option>
                  ))}
                </select>
                <button
                    onClick={handleNextStep}
                    disabled={selectedScreens.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-6 py-2 rounded-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
                >
                    Next
                    <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
            
            {screens.length === 0 ? (
              <div className="text-center py-12">
                <Monitor className="h-24 w-24 text-gray-300 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-700 mb-2">No Screens Available</h3>
                <p className="text-gray-600 mb-4">We couldn't find any active screens in Bangalore.</p>
                <button 
                  onClick={fetchScreens}
                  className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Refresh Screens
                </button>
              </div>
            ) : (
              <div className="max-h-[70vh] overflow-y-auto pr-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {screens.map((screen) => {
                    const isSelected = selectedScreens.find(s => s.id === screen.id);
                    return (
                      <motion.div
                        key={screen.id}
                        whileHover={{ scale: 1.02, y: -5 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => handleScreenSelect(screen)}
                        className={`relative bg-white border-2 rounded-xl p-6 cursor-pointer hover:border-blue-500 hover:shadow-lg transition-all duration-300 flex flex-col ${isSelected ? 'border-blue-600' : 'border-gray-200'}`}
                      >
                        {isSelected && (
                          <div className="absolute top-4 right-4 bg-blue-600 text-white rounded-full p-1">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                        {/* Screen Header */}
                        <div className="flex items-center justify-between mb-4">
                          <div className={`p-3 rounded-lg ${getScreenTypeColor(screen.screen_type)} text-white`}>
                            {getScreenTypeIcon(screen.screen_type)}
                        </div>
                        <div className="flex items-center space-x-2">
                          <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                            {screen.city.charAt(0).toUpperCase() + screen.city.slice(1)}
                          </span>
                          <span className="bg-green-100 text-green-800 px-2 py-1 rounded-full text-xs font-semibold">
                            Active
                          </span>
                        </div>
                      </div>
                      
                      {/* Screen Info */}
                      <div className="flex-grow">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">{screen.name}</h3>
                        <p className="text-gray-600 mb-4 flex items-center">
                          <MapPin className="h-4 w-4 mr-1" />
                          {screen.address}
                        </p>
                        
                        {/* Screen Stats */}
                        <div className="grid grid-cols-2 gap-4 mb-4">
                          {/* <div className="text-center">
                            <Eye className="h-4 w-4 text-blue-600 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Daily Views</p>
                            <p className="font-semibold text-gray-900">
                              {(screen.daily_footfall / 1000).toFixed(1)}K
                            </p>
                          </div> */}
                          <div className="text-center">
                            <Monitor className="h-4 w-4 text-green-600 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Dimensions</p>
                            <p className="font-semibold text-gray-900">
                              {screen.resolution_width}x{screen.resolution_height}
                            </p>
                          </div>
                          <div className="text-center">
                            <Zap className="h-4 w-4 text-purple-600 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Device</p>
                            <p className="font-semibold text-gray-900">{screen.device_type}</p>
                          </div>
                          
                          <div className="text-center">
                            <DollarSign className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Hourly Rate</p>
                            <p className="font-semibold text-gray-900">
                              {screen.currency}{screen.hourly_rate}
                            </p>
                          </div>
                          <div className="text-center">
                            <DollarSign className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Daily Rate</p>
                            <p className="font-semibold text-gray-900">
                              {screen.currency}{screen.daily_rate}
                            </p>
                          </div>
                          <div className="text-center">
                            <DollarSign className="h-4 w-4 text-yellow-600 mx-auto mb-1" />
                            <p className="text-sm text-gray-500">Weekly Rate</p>
                            <p className="font-semibold text-gray-900">
                              {screen.currency}{screen.weekly_rate}
                            </p>
                          </div>
                        </div>
                      </div>
                      
                      {/* Actions */}
                      <div className="mt-auto">
                        <button
                          onClick={(e) => handleViewDetails(e, screen)}
                          className="w-full bg-blue-100 text-blue-800 py-2 rounded-lg hover:bg-blue-200 transition-colors font-semibold"
                        >
                          View Details
                        </button>
                      </div>
                    </motion.div>
                  );
                })}
                </div>
              </div>
            )}
             <div className="mt-8 flex justify-end">
                <button
                    onClick={handleNextStep}
                    disabled={selectedScreens.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
                >
                    Next: Choose Time Slot
                    <ArrowRight className="h-5 w-5 ml-2" />
                </button>
            </div>
          </motion.div>
        )}

        {/* Step 2: Time Slot Selection */}
        {currentStep === 2 && selectedScreens.length > 0 && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-2xl shadow-xl p-8"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-gray-900">Choose Time Slot</h2>
              <button
                onClick={goBack}
                className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
              >
                <ArrowLeft className="h-5 w-5 mr-1" />
                Back
              </button>
            </div>

            {/* Selected Screen Info */}
            <div className="bg-blue-50 rounded-xl p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Selected Screens ({selectedScreens.length})
              </h3>
              <div className="flex flex-wrap gap-2">
                {selectedScreens.map(screen => (
                  <span key={screen.id} className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs font-semibold">
                    {screen.name}
                  </span>
                ))}
              </div>
            </div>

            {/* Time Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {renderCreativePreviews()}
            </div>
         

            {/* Time Slots */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {timeSlots.map((slot) => (
                <motion.div
                  key={slot.id}
                  whileHover={slot.available ? { scale: 1.02 } : {}}
                  whileTap={slot.available ? { scale: 0.98 } : {}}
                  onClick={() => slot.available && handleTimeSlotSelect(slot)}
                  className={`border-2 rounded-xl p-6 transition-all duration-300 ${
                    slot.available 
                      ? 'border-gray-200 hover-border-green-500 cursor-pointer bg-white' 
                      : 'border-red-200 bg-red-50 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <Clock className={`h-6 w-6 ${slot.available ? 'text-green-600' : 'text-red-500'}`} />
                    <span className={`px-3 py-1 rounded-full text-xs font-semibold ${
                      slot.available 
                        ? 'bg-green-100 text-green-800' 
                        : 'bg-red-100 text-red-800'
                    }`}>
                      {slot.available ? 'Available' : 'Booked'}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-gray-900 mb-2">
                    {slot.start_time} - {slot.end_time}
                  </h4>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">3 hours</span>
                    <div className="text-right">
                      <p className="text-2xl font-bold text-green-600">₹{slot.price}</p>
                      <p className="text-xs text-gray-500">Total cost</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {/* Step 3: Upload Creative */}
        {currentStep === 3 && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 3: Upload Your Creative</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
                <div className="space-y-4">
                  <p className="text-gray-600">
                    Upload the image or video you want to display on the screens. 
                    Please ensure it meets the resolution requirements of your selected screens.
                  </p>
                  <div className="p-4 border-2 border-dashed border-gray-300 rounded-lg text-center">
                    <input type="file" id="creative-upload" className="hidden" onChange={handleFileChange} accept="image/*,video/*" multiple />
                    <label htmlFor="creative-upload" className="cursor-pointer text-blue-600 font-semibold">
                      {creativeFiles.length > 0 ? `${creativeFiles.length} files selected` : 'Select files'}
                    </label>
                    <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF, MP4 up to 10MB</p>
                  </div>
                  <button 
                    onClick={handleFileUpload} 
                    disabled={creativeFiles.length === 0 || uploading}
                    className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-400 flex items-center justify-center"
                  >
                    {uploading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <ImageIcon className="h-5 w-5 mr-2" />} 
                    {uploading ? 'Uploading...' : 'Upload Creative'}
                  </button>
                </div>
                <div className="p-4 bg-gray-100 rounded-lg">
                  <h3 className="font-semibold text-lg mb-2">Preview</h3>
                  {creativeFiles.length > 0 ? (
                    <div className="grid grid-cols-2 gap-2">
                      {renderCreativePreviews()}
                    </div>
                  ) : (
                    <div className="w-full h-48 bg-gray-200 rounded-md flex items-center justify-center">
                      <p className="text-gray-500">Your creative will be shown here</p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-8 flex justify-between items-center">
                <button
                    onClick={goBack}
                    className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                >
                    <ArrowLeft className="h-5 w-5 mr-1" />
                    Back
                </button>
                <button
                    onClick={handleNextStep}
                    disabled={creativeUrls.length === 0}
                    className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-blue-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
                >
                    Next: Confirm & Book
                    <ArrowRight className="h-5 w-5 ml-2" />
                </button>
              </div>
            </div>
          </motion.div>
        )}

        {/* Step 4: Confirmation */}
        {currentStep === 4 && (
          <motion.div initial={{ opacity: 0, x: 50 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -50 }}>
            <div className="bg-white rounded-2xl shadow-xl p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Step 4: Confirm & Book</h2>
              <div className="space-y-6">
                <div>
                  <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 mb-1">Campaign Name</label>
                  <input
                    type="text"
                    id="campaignName"
                    value={campaignName}
                    onChange={(e) => setCampaignName(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg"
                    placeholder="e.g., Summer Sale Campaign"
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Selected Screens ({selectedScreens.length})</h3>
                    <ul className="space-y-2">
                      {selectedScreens.map(s => <li key={s.id} className="text-sm">- {s.name}</li>)}
                    </ul>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Time Slot</h3>
                    <p>{selectedSlot?.start_time} - {selectedSlot?.end_time}</p>
                    <p className="font-bold">Price: ₹{selectedSlot?.price}</p>
                  </div>
                  <div className="p-4 bg-gray-50 rounded-lg">
                    <h3 className="font-semibold text-lg mb-2">Your Creative</h3>
                    {creativeUrls.length > 0 && (
                      creativeFiles[0]?.type.startsWith('video') ? (
                        <video src={creativeUrls[0]} controls className="w-full rounded-md" />
                      ) : (
                        <img src={creativeUrls[0]} alt="Creative" className="w-full rounded-md" />
                      )
                    )}
                  </div>
                </div>
                <div className="mt-8 flex justify-end items-center">
                    <button
                        onClick={goBack}
                        className="flex items-center text-gray-600 hover:text-gray-800 transition-colors"
                    >
                        <ArrowLeft className="h-5 w-5 mr-1" />
                        Back
                    </button>
                    <button
                        onClick={handleBookingSubmit}
                        disabled={loading || !campaignName}
                        className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-8 py-4 rounded-xl text-lg font-semibold hover:from-green-600 hover:to-teal-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center"
                    >
                        {loading ? <Loader2 className="animate-spin h-5 w-5 mr-2" /> : <CheckCircle className="h-5 w-5 mr-2" />}
                        Confirm & Book
                    </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      {selectedScreenForModal && (
        <ScreenDetailsModal
          screen={{
            id: selectedScreenForModal.id,
            screen_name: selectedScreenForModal.name,
            location_in_venue: selectedScreenForModal.location_name,
            screen_size_inches: null, // Not available in the campaign screen data
            resolution: `${selectedScreenForModal.resolution_width}x${selectedScreenForModal.resolution_height}`,
            orientation: 'landscape', // Assuming landscape, not available in data
            device_type: selectedScreenForModal.device_type as 'smart_tv' | 'media_player' | 'custom',
            device_model: 'N/A', // Not available
            ads_enabled: selectedScreenForModal.is_active,
            ad_frequency: 15, // Default value
            viewing_distance: 'medium', // Default value
            typical_viewer_duration: '15s', // Default value
            peak_viewing_hours: [], // Not available
            assets: [], // Not available
            created_at: '', // Not available
            updated_at: '', // Not available
            user_id: selectedScreenForModal.user_id || 0,
            day_photo_url: selectedScreenForModal.day_photo_url,
            night_photo_url: selectedScreenForModal.night_photo_url,
            video_url: selectedScreenForModal.video_url,
          }}
          onClose={() => setSelectedScreenForModal(null)}
        />
      )}
    </div>
  );
};

export default ImprovedCampaignCreation;
