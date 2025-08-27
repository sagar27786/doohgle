import React, { useState, useEffect } from 'react';
import { X, MapPin, Calendar, DollarSign, Monitor, User, Clock, Send, Bell } from 'lucide-react';
import { authService } from '../../services/authService';
import BookingNotificationService from '../../services/bookingNotificationService';

interface Screen {
  id: number;
  name: string;
  location: string;
  city: string;
  venue_owner_id: number;
  venue_owner_name?: string;
  size?: string;
  resolution?: string;
  device_type?: string;
  latitude?: number;
  longitude?: number;
  price_per_day?: number;
}

interface EnhancedScreenBookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  screen: Screen | null;
}

const EnhancedScreenBookingModal: React.FC<EnhancedScreenBookingModalProps> = ({
  isOpen,
  onClose,
  screen
}) => {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [venueOwners, setVenueOwners] = useState<Array<{ id: number, name: string }>>([]);
  
  const [formData, setFormData] = useState({
    campaignName: '',
    budget: 0,
    startDate: '',
    endDate: '',
    message: '',
  });

  const currentUser = authService.getCurrentUser();

  useEffect(() => {
    if (isOpen && screen) {
      // Reset form
      setFormData({
        campaignName: '',
        budget: screen.price_per_day ? screen.price_per_day * 7 : 10000, // Default to weekly rate
        startDate: new Date().toISOString().split('T')[0],
        endDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0], // 1 week later
        message: `Hi! I'd like to book your screen "${screen.name}" for my advertising campaign.`,
      });
      setMessage('');
      setIsError(false);
      
      // Fetch venue owners for this location (mock implementation)
      fetchVenueOwnersForLocation(screen.city);
    }
  }, [isOpen, screen]);

  const fetchVenueOwnersForLocation = async (location: string) => {
    try {
      // This would normally call your API to get venue owners for the location
      // For now, using mock data
      const mockVenueOwners = [
        { id: screen?.venue_owner_id || 1, name: screen?.venue_owner_name || 'Venue Owner' }
      ];
      setVenueOwners(mockVenueOwners);
    } catch (error) {
      console.error('Failed to fetch venue owners:', error);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.name]: e.target.value
    }));
  };

  const calculateDays = () => {
    if (!formData.startDate || !formData.endDate) return 0;
    const start = new Date(formData.startDate);
    const end = new Date(formData.endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!screen || !currentUser) return;

    setLoading(true);
    setMessage('');
    setIsError(false);

    try {
      // Validation
      if (!formData.campaignName.trim()) {
        throw new Error('Please enter a campaign name');
      }
      if (!formData.startDate || !formData.endDate) {
        throw new Error('Please select start and end dates');
      }
      if (new Date(formData.startDate) >= new Date(formData.endDate)) {
        throw new Error('End date must be after start date');
      }
      if (formData.budget <= 0) {
        throw new Error('Please enter a valid budget');
      }

      // Create booking request for all venue owners at this location
      const bookingService = BookingNotificationService.getInstance();
      
      for (const venueOwner of venueOwners) {
        await bookingService.createBookingRequest({
          advertiserId: currentUser.id,
          advertiserName: currentUser.name || 'Advertiser',
          screenId: screen.id,
          screenName: screen.name,
          location: `${screen.location}, ${screen.city}`,
          venueOwnerId: venueOwner.id,
          venueOwnerName: venueOwner.name,
          campaignName: formData.campaignName,
          campaignBudget: formData.budget,
          startDate: formData.startDate,
          endDate: formData.endDate,
          screenDetails: {
            size: screen.size || 'Standard',
            resolution: screen.resolution || '1920x1080',
            type: screen.device_type || 'LED Display',
            latitude: screen.latitude,
            longitude: screen.longitude,
          },
        });
      }

      setMessage(`Booking request sent successfully to ${venueOwners.length} venue owner(s) at this location!`);
      setIsError(false);
      
      setTimeout(() => {
        onClose();
      }, 2000);
      
    } catch (error: any) {
      setMessage(error.message || 'Failed to send booking request');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen || !screen) return null;

  const days = calculateDays();
  const totalCost = screen.price_per_day ? screen.price_per_day * days : formData.budget;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
              <Bell className="h-6 w-6 text-indigo-600" />
              Book Screen for Campaign
            </h2>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm border ${
                isError
                  ? 'bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800'
                  : 'bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800'
              }`}
            >
              {message}
            </div>
          )}

          {/* Screen Details */}
          <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3 flex items-center gap-2">
              <Monitor className="h-5 w-5" />
              Screen Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <Monitor className="h-4 w-4" />
                <span>{screen.name}</span>
              </div>
              <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                <MapPin className="h-4 w-4" />
                <span>{screen.location}, {screen.city}</span>
              </div>
              {screen.size && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>Size: {screen.size}</span>
                </div>
              )}
              {screen.resolution && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>Resolution: {screen.resolution}</span>
                </div>
              )}
              {screen.device_type && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <span>Type: {screen.device_type}</span>
                </div>
              )}
              {screen.price_per_day && (
                <div className="flex items-center gap-2 text-gray-700 dark:text-gray-300">
                  <DollarSign className="h-4 w-4" />
                  <span>₹{screen.price_per_day}/day</span>
                </div>
              )}
            </div>
            
            {venueOwners.length > 0 && (
              <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-600">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                  Your request will be sent to:
                </p>
                <div className="flex flex-wrap gap-2">
                  {venueOwners.map((owner) => (
                    <span
                      key={owner.id}
                      className="inline-flex items-center gap-1 px-2 py-1 bg-indigo-100 dark:bg-indigo-900/30 text-indigo-700 dark:text-indigo-300 rounded-full text-xs"
                    >
                      <User className="h-3 w-3" />
                      {owner.name}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Booking Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="campaignName" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Campaign Name *
              </label>
              <input
                id="campaignName"
                name="campaignName"
                type="text"
                required
                value={formData.campaignName}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Enter your campaign name"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="startDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Start Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="startDate"
                    name="startDate"
                    type="date"
                    required
                    value={formData.startDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>

              <div>
                <label htmlFor="endDate" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  End Date *
                </label>
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <input
                    id="endDate"
                    name="endDate"
                    type="date"
                    required
                    value={formData.endDate}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  />
                </div>
              </div>
            </div>

            <div>
              <label htmlFor="budget" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Budget (₹) *
              </label>
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                <input
                  id="budget"
                  name="budget"
                  type="number"
                  required
                  min="1"
                  value={formData.budget}
                  onChange={handleInputChange}
                  className="w-full pl-10 pr-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                  placeholder="Enter your budget"
                />
              </div>
              {days > 0 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                  <Clock className="h-3 w-3 inline mr-1" />
                  {days} day{days !== 1 ? 's' : ''} • 
                  {screen.price_per_day && (
                    <span> Suggested: ₹{totalCost.toLocaleString()}</span>
                  )}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="message" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Message to Venue Owners
              </label>
              <textarea
                id="message"
                name="message"
                rows={3}
                value={formData.message}
                onChange={handleInputChange}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                placeholder="Add a personal message (optional)"
              />
            </div>

            <div className="flex space-x-3 pt-4">
              <button
                type="button"
                onClick={onClose}
                className="flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="flex-1 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors flex items-center justify-center gap-2"
              >
                {loading ? (
                  'Sending...'
                ) : (
                  <>
                    <Send className="h-4 w-4" />
                    Send Booking Request
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

export default EnhancedScreenBookingModal;
