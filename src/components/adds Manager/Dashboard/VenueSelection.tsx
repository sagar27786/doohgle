import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VenueSelectionProps {
  onBack?: () => void;
}

const VenueSelection: React.FC<VenueSelectionProps> = ({ onBack }) => {
  const [selectedCountry, setSelectedCountry] = useState('Germany');
  const [selectedVenues, setSelectedVenues] = useState<string[]>(['Fueling Stations', 'Grocery', 'Mall', 'Gyms']);
  const [includeLocation, setIncludeLocation] = useState('Include');
  const [showCalendar, setShowCalendar] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [currentStep, setCurrentStep] = useState<'venues' | 'calendar' | 'hours'>('venues');

  const venues = [
    { name: 'Fueling Stations', image: '/api/placeholder/200/150', selected: true },
    { name: 'Grocery', image: '/api/placeholder/200/150', selected: true },
    { name: 'Mall', image: '/api/placeholder/200/150', selected: true },
    { name: 'Gyms', image: '/api/placeholder/200/150', selected: true },
  ];

  const toggleVenue = (venueName: string) => {
    setSelectedVenues(prev => 
      prev.includes(venueName) 
        ? prev.filter(v => v !== venueName)
        : [...prev, venueName]
    );
  };

  const handleProceedToCalendar = () => {
    setCurrentStep('calendar');
    setShowCalendar(true);
  };

  const handleDateSelect = (date: Date) => {
    setSelectedDate(date);
    setCurrentStep('hours');
  };

  const handleHourToggle = (hour: number) => {
    setSelectedHours(prev => 
      prev.includes(hour) ? prev.filter(h => h !== hour) : [...prev, hour]
    );
  };

  const generateCalendarDays = () => {
    const today = new Date();
    const currentMonth = today.getMonth();
    const currentYear = today.getFullYear();
    const firstDay = new Date(currentYear, currentMonth, 1);
    const lastDay = new Date(currentYear, currentMonth + 1, 0);
    const startDate = new Date(firstDay);
    startDate.setDate(startDate.getDate() - firstDay.getDay());
    
    const days = [];
    const current = new Date(startDate);
    
    for (let i = 0; i < 42; i++) {
      days.push(new Date(current));
      current.setDate(current.getDate() + 1);
    }
    
    return days;
  };

  const formatSelectedHours = () => {
    if (selectedHours.length === 0) return '';
    const sorted = [...selectedHours].sort((a, b) => a - b);
    if (sorted.length === 1) return `${sorted[0].toString().padStart(2, '0')}:00`;
    return `${sorted[0].toString().padStart(2, '0')}:00 - ${sorted[sorted.length - 1].toString().padStart(2, '0')}:00`;
  };

  return (
    <div className="min-h-screen bg-gray-50">
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
        <div className="w-80 bg-white border-r border-gray-200 h-screen">
          <div className="p-6">
            <motion.button
              onClick={onBack}
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-6"
              whileHover={{ x: -4 }}
              transition={{ type: 'spring', stiffness: 400 }}
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
              </svg>
              <span>Back</span>
            </motion.button>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-gray-400">Off</span>
                  <div className="relative w-12 h-6 bg-gray-300 rounded-full">
                    <div className="absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow-md" />
                  </div>
                </div>
              </div>

              <div className="mb-4">
                <div className="text-sm text-gray-600 mb-2">Campaign setup is on 66%</div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    className="bg-gradient-to-r from-purple-600 to-blue-600 h-2 rounded-full"
                    initial={{ width: 0 }}
                    animate={{ width: '66%' }}
                    transition={{ duration: 1.5, ease: 'easeOut' }}
                  />
                </div>
              </div>
            </div>

            <div className="mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-700">Campaign Guide</span>
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </div>

              <motion.div
                className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <div className="flex items-start space-x-3">
                  <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                    <svg className="w-3 h-3 text-white" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div>
                    <h4 className="text-sm font-medium text-red-800 mb-1">Payment method missing</h4>
                    <p className="text-sm text-red-700">Please provide a payment method in order to start your campaign.</p>
                  </div>
                </div>
              </motion.div>
            </div>

            <div className="bg-gray-50 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
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

        <div className="flex-1">
          <div className="bg-white border-b border-gray-200 px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h1 className="text-xl font-semibold text-gray-900">Financial Advice Campaign</h1>
                <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </div>
              <div className="flex items-center space-x-4">
                <motion.button
                  className="flex items-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                  <span>Switch to Wizard</span>
                </motion.button>
              </div>
            </div>
          </div>

          <div className="flex">
            <div className="flex-1 p-6">
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Target Country *</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                      <div className="w-6 h-4 bg-red-500 mr-2"></div>
                    </div>
                    <select 
                      value={selectedCountry}
                      onChange={(e) => setSelectedCountry(e.target.value)}
                      className="w-full pl-12 pr-10 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    >
                      <option value="Germany">Germany</option>
                      <option value="UK">United Kingdom</option>
                      <option value="France">France</option>
                    </select>
                    <svg className="absolute right-3 top-2.5 w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>
              </div>

              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">Geotargeting</h3>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-4">
                    <motion.button 
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3M3 17V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                      </svg>
                      <span>Import ZIP codes</span>
                    </motion.button>
                    <motion.button 
                      className="flex items-center space-x-2 px-3 py-1.5 text-sm text-blue-600 hover:text-blue-700 border border-blue-200 rounded-lg"
                      whileHover={{ scale: 1.02 }}
                    >
                      <span className="w-4 h-4 rounded bg-blue-600 text-white text-xs flex items-center justify-center">○</span>
                      <span>open map</span>
                    </motion.button>
                  </div>
                </div>

                <div className="flex items-center space-x-2 mb-4">
                  <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                    <circle cx="10" cy="10" r="3" />
                  </svg>
                  <span className="text-sm text-gray-600">Include</span>
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                  
                  <div className="flex-1 relative ml-4">
                    <svg className="absolute left-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Location"
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                    />
                    <svg className="absolute right-3 top-2.5 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                </div>

                <div className="text-xs text-gray-500 flex items-center justify-end">
                  <span>powered by</span>
                  <span className="text-blue-500 font-semibold ml-1">Google</span>
                </div>
              </div>

              {/* Venue Types */}
              <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center space-x-2">
                    <h3 className="text-lg font-medium text-gray-900">Venue Types</h3>
                    <svg className="w-4 h-4 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-500">8/8</span>
                    <motion.button
                      className="text-sm text-blue-600 hover:text-blue-700"
                      whileHover={{ scale: 1.05 }}
                    >
                      Select
                    </motion.button>
                  </div>
                </div>

                  <div className="grid grid-cols-4 gap-4">
                  {venues.map((venue, index) => (
                    <motion.div
                      key={venue.name}
                      onClick={() => toggleVenue(venue.name)}
                      className={`relative rounded-lg overflow-hidden border-2 cursor-pointer ${
                        selectedVenues.includes(venue.name) ? 'border-blue-500 shadow-lg' : 'border-gray-200'
                      }`}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="aspect-[4/3] bg-gray-100">
                        <img 
                          src={venue.image} 
                          alt={venue.name}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div className="p-3">
                        <h4 className="font-medium text-gray-900">{venue.name}</h4>
                        {selectedVenues.includes(venue.name) && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            className="absolute top-2 right-2 w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center"
                          >
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          </motion.div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Proceed Button */}
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <motion.button
                    onClick={handleProceedToCalendar}
                    disabled={selectedVenues.length === 0}
                    className="w-full flex items-center justify-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-lg font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
                    whileHover={{ scale: selectedVenues.length > 0 ? 1.02 : 1 }}
                    whileTap={{ scale: selectedVenues.length > 0 ? 0.98 : 1 }}
                  >
                    <span>Continue to Schedule</span>
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </motion.button>
                </div>
              </div>

              {/* Calendar Modal */}
              <AnimatePresence>
                {showCalendar && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
                    onClick={() => {
                      setShowCalendar(false);
                      setCurrentStep('venues');
                    }}
                  >
                    <motion.div
                      initial={{ scale: 0.9, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      exit={{ scale: 0.9, opacity: 0 }}
                      className="bg-white rounded-2xl p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <div className="flex items-center justify-between mb-6">
                        <h3 className="text-xl font-bold text-gray-900">
                          {currentStep === 'calendar' ? 'Select Campaign Date' : 'Select Time Slots'}
                        </h3>
                        <button 
                          onClick={() => {
                            setShowCalendar(false);
                            setCurrentStep('venues');
                          }}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>

                      {currentStep === 'calendar' && (
                        <div>
                          <div className="bg-gradient-to-br from-purple-50 to-blue-50 rounded-xl p-6 mb-6">
                            <h4 className="text-lg font-semibold text-gray-900 mb-4">
                              {new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                            </h4>
                            
                            {/* Day headers */}
                            <div className="grid grid-cols-7 gap-2 mb-2">
                              {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                <div key={day} className="text-center text-sm font-medium text-gray-600 py-2">
                                  {day}
                                </div>
                              ))}
                            </div>
                            
                            {/* Calendar grid */}
                            <div className="grid grid-cols-7 gap-2">
                              {generateCalendarDays().map((date, index) => {
                                const isCurrentMonth = date.getMonth() === new Date().getMonth();
                                const isPast = date < new Date().setHours(0, 0, 0, 0);
                                const isSelected = selectedDate?.toDateString() === date.toDateString();
                                const isToday = date.toDateString() === new Date().toDateString();
                                
                                return (
                                  <motion.button
                                    key={index}
                                    onClick={() => {
                                      if (isCurrentMonth && !isPast) {
                                        handleDateSelect(date);
                                      }
                                    }}
                                    disabled={!isCurrentMonth || isPast}
                                    className={`aspect-square p-2 text-sm rounded-lg transition-all ${
                                      isSelected
                                        ? 'bg-purple-600 text-white shadow-lg'
                                        : isToday && !isPast
                                        ? 'bg-purple-100 text-purple-700 font-semibold'
                                        : isCurrentMonth && !isPast
                                        ? 'hover:bg-purple-50 text-gray-900'
                                        : 'text-gray-300 cursor-not-allowed'
                                    }`}
                                    whileHover={isCurrentMonth && !isPast ? { scale: 1.05 } : {}}
                                    whileTap={isCurrentMonth && !isPast ? { scale: 0.95 } : {}}
                                  >
                                    {date.getDate()}
                                  </motion.button>
                                );
                              })}
                            </div>
                          </div>
                        </div>
                      )}

                      {currentStep === 'hours' && selectedDate && (
                        <div>
                          <div className="bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl p-6 mb-6">
                            <div className="text-center mb-6">
                              <h4 className="text-lg font-semibold text-gray-900">
                                {selectedDate.toLocaleDateString('en-US', { 
                                  weekday: 'long', 
                                  year: 'numeric', 
                                  month: 'long', 
                                  day: 'numeric' 
                                })}
                              </h4>
                              <p className="text-purple-600 font-medium">Select your preferred time slots</p>
                            </div>
                            
                            {/* Quick selection buttons */}
                            <div className="flex flex-wrap gap-2 mb-6 justify-center">
                              <button
                                onClick={() => setSelectedHours([9,10,11,12,13,14,15,16,17])}
                                className="px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                              >
                                Business Hours
                              </button>
                              <button
                                onClick={() => setSelectedHours([18,19,20,21,22])}
                                className="px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                              >
                                Evening
                              </button>
                              <button
                                onClick={() => setSelectedHours(Array.from({length: 24}, (_, i) => i))}
                                className="px-4 py-2 bg-white text-purple-600 border border-purple-200 rounded-lg hover:bg-purple-50 transition-colors text-sm font-medium"
                              >
                                All Day
                              </button>
                              <button
                                onClick={() => setSelectedHours([])}
                                className="px-4 py-2 bg-white text-gray-600 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors text-sm font-medium"
                              >
                                Clear
                              </button>
                            </div>
                            
                            {/* Hour grid */}
                            <div className="grid grid-cols-6 gap-3">
                              {Array.from({ length: 24 }, (_, i) => (
                                <motion.button
                                  key={i}
                                  onClick={() => handleHourToggle(i)}
                                  className={`aspect-square rounded-lg text-sm font-semibold transition-all ${
                                    selectedHours.includes(i)
                                      ? 'bg-purple-600 text-white shadow-lg'
                                      : 'bg-white text-gray-700 border border-gray-200 hover:bg-purple-50 hover:border-purple-200'
                                  }`}
                                  whileHover={{ scale: 1.05 }}
                                  whileTap={{ scale: 0.95 }}
                                >
                                  {i.toString().padStart(2, '0')}:00
                                </motion.button>
                              ))}
                            </div>
                            
                            {selectedHours.length > 0 && (
                              <motion.div
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="mt-6 p-4 bg-white rounded-lg border border-purple-200"
                              >
                                <div className="flex items-center space-x-3">
                                  <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                  </svg>
                                  <div>
                                    <div className="font-medium text-gray-900">Selected Time Slots</div>
                                    <div className="text-purple-600 font-semibold">
                                      {formatSelectedHours()} ({selectedHours.length} hour{selectedHours.length !== 1 ? 's' : ''})
                                    </div>
                                  </div>
                                </div>
                              </motion.div>
                            )}
                          </div>
                          
                          <div className="flex space-x-3">
                            <button
                              onClick={() => setCurrentStep('calendar')}
                              className="flex-1 px-4 py-3 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium"
                            >
                              ← Back to Calendar
                            </button>
                            <button
                              onClick={() => {
                                if (selectedHours.length > 0) {
                                  setShowCalendar(false);
                                  // Here you can proceed to next step or save the schedule
                                  console.log('Schedule saved:', {
                                    date: selectedDate,
                                    hours: selectedHours,
                                    venues: selectedVenues
                                  });
                                }
                              }}
                              disabled={selectedHours.length === 0}
                              className="flex-1 px-4 py-3 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed font-medium"
                            >
                              Confirm Schedule
                            </button>
                          </div>
                        </div>
                      )}
                    </motion.div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="w-80 border-l border-gray-200 bg-white">
              <div className="p-6">
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-medium text-gray-900">Campaign Performance</h3>
                    <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                    </svg>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                        </svg>
                        <span className="text-sm text-gray-600">CPM</span>
                      </div>
                      <span className="text-sm font-medium text-gray-900">€13.74</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                        <span className="text-sm text-gray-600">Impressions</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">53,821,405</div>
                        <div className="text-xs text-gray-500">up to</div>
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                        </svg>
                        <span className="text-sm text-gray-600">Screens</span>
                      </div>
                      <div className="text-right">
                        <div className="text-sm font-medium text-gray-900">14,085</div>
                        <div className="text-xs text-gray-500">up to</div>
                      </div>
                    </div>
                  </div>
                </div>

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
                    This targeting requires this budget to achieve an optimal performance: €344,000 - €739,000
                  </p>
                </div>

                <div className="space-y-3">
                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                    </svg>
                    <span>Forecast Report</span>
                  </motion.button>
                  
                  <motion.button
                    className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm text-gray-600 hover:text-gray-900 border border-gray-200 rounded-lg"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a.997.997 0 01-.707.293H7a4 4 0 01-4-4V7a4 4 0 014-4z" />
                    </svg>
                    <span>Redeem Voucher</span>
                  </motion.button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VenueSelection;
