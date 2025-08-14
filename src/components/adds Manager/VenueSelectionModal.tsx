import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface VenueSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (venues: string[]) => void;
}

const VenueSelectionModal: React.FC<VenueSelectionModalProps> = ({ isOpen, onClose, onSave }) => {
  const [selectedVenues, setSelectedVenues] = useState<string[]>(['Retail', 'Health & Beauty', 'Point of Care', 'Office Buildings', 'Leisure']);

  const venues = [
    { 
      name: 'Retail', 
      count: '3/3',
      image: 'https://i.pinimg.com/736x/97/84/82/9784824d05fbe0582c59f248ad8d0add.jpg',
      description: 'These dynamic screens are strategically placed in key locations throughout shopping centers, malls, and retail districts.'
    },
    { 
      name: 'Health & Beauty', 
      count: '1/1',
      image: 'https://www.shutterstock.com/image-illustration/modern-luxury-beautiful-mock-scene-260nw-1782304442.jpg',
      description: 'Perfect for healthcare facilities and beauty salons with targeted messaging.'
    },
    { 
      name: 'Point of Care', 
      count: '1/1',
      image: 'https://sketchup.cgtips.org/wp-content/uploads/2020/09/3692-Interior-Bedroom-Scene-Sketchup-Model-by-VuVanLuong-1.jpg',
      description: 'Strategic placement in medical facilities and care centers.'
    },
    { 
      name: 'Office Buildings', 
      count: '1/1',
      image: 'https://media.istockphoto.com/id/1210328194/photo/ocean-sunset-view-from-bedroom-balcony-for-travel-concept.jpg?s=612x612&w=0&k=20&c=UU944NTbhzZ209d2Qm7sDrMtkBHqmBNo7sOlrqdsKdc=',
      description: 'High-impact displays in corporate environments and business districts.'
    },
    { 
      name: 'Leisure', 
      count: '2/2',
      image: 'https://www.anytimefitness.co.in/wp-content/uploads/2025/01/WhatsApp-Image-2025-01-24-at-10.07.38-AM-1024x682.jpeg',
      description: 'Entertainment venues, gyms, and recreational facilities.'
    },
    { 
      name: 'Transport Hubs', 
      count: '1/2',
      image: 'https://st.depositphotos.com/1082418/1388/i/450/depositphotos_13880102-stock-photo-interior-design-scene-with-a.jpg',
      description: 'Airports, train stations, and major transportation centers.'
    },
    { 
      name: 'Education', 
      count: '0/1',
      image: 'https://i.pinimg.com/736x/97/84/82/9784824d05fbe0582c59f248ad8d0add.jpg',
      description: 'Universities, colleges, and educational institutions.'
    },
    { 
      name: 'Hospitality', 
      count: '1/3',
      image: 'https://www.shutterstock.com/image-illustration/modern-luxury-beautiful-mock-scene-260nw-1782304442.jpg',
      description: 'Hotels, restaurants, and hospitality venues.'
    }
  ];

  const toggleVenue = (venueName: string) => {
    setSelectedVenues(prev => 
      prev.includes(venueName) 
        ? prev.filter(v => v !== venueName)
        : [...prev, venueName]
    );
  };

  const handleSave = () => {
    onSave(selectedVenues);
    onClose();
  };

  const backdropVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 }
  };

  const modalVariants = {
    hidden: { 
      opacity: 0, 
      scale: 0.8,
      y: 50
    },
    visible: { 
      opacity: 1, 
      scale: 1,
      y: 0,
      transition: {
        type: 'spring',
        stiffness: 300,
        damping: 30
      }
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        variants={backdropVariants}
        initial="hidden"
        animate="visible"
        exit="hidden"
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
          variants={modalVariants}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200 flex items-center justify-between">
            <div>
              <h2 className="text-2xl font-semibold text-gray-900">Venue Types</h2>
              <p className="text-sm text-gray-500 mt-1">Select venue types that are most suited for your campaign. By default all available venue types are targeted.</p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Search and Controls */}
          <div className="p-6 border-b border-gray-100">
            <div className="flex items-center justify-between">
              <div className="relative flex-1 max-w-md">
                <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                <input
                  type="text"
                  placeholder="Search"
                  className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-600">{selectedVenues.length} of {venues.length} selected</span>
                <motion.button
                  onClick={() => setSelectedVenues([])}
                  className="text-sm text-purple-600 hover:text-purple-700 font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Unselect all
                </motion.button>
              </div>
            </div>
          </div>

          {/* Venue Grid */}
          <div className="p-6 overflow-y-auto max-h-[60vh]">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {venues.map((venue, index) => (
                <motion.div
                  key={venue.name}
                  className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                    selectedVenues.includes(venue.name) 
                      ? 'border-purple-500 shadow-lg ring-4 ring-purple-100' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => toggleVenue(venue.name)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                >
                  <div className="aspect-video relative overflow-hidden bg-gray-100">
                    <img
                      src={venue.image}
                      alt={venue.name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '/api/placeholder/400/225';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Selection Indicator */}
                    {selectedVenues.includes(venue.name) && (
                      <motion.div
                        className="absolute top-3 right-3 w-8 h-8 bg-purple-500 rounded-full flex items-center justify-center"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'spring', stiffness: 400 }}
                      >
                        <svg className="w-5 h-5 text-white" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                        </svg>
                      </motion.div>
                    )}

                    {/* Count Badge */}
                    <div className="absolute top-3 left-3 bg-white/90 backdrop-blur-sm rounded-full px-2 py-1">
                      <span className="text-xs font-medium text-gray-700">{venue.count}</span>
                    </div>
                  </div>

                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 mb-2">{venue.name}</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">{venue.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 flex items-center justify-between bg-gray-50">
            <div className="flex items-center space-x-2 text-sm text-gray-600">
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span>Select venues that best match your target audience</span>
            </div>
            <div className="flex space-x-3">
              <motion.button
                onClick={onClose}
                className="px-6 py-2 text-gray-600 hover:text-gray-800 font-medium transition-colors"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                Cancel
              </motion.button>
              <motion.button
                onClick={handleSave}
                className="px-6 py-2 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-medium rounded-lg hover:shadow-lg transition-all duration-300"
                whileHover={{ scale: 1.05, boxShadow: '0 10px 25px rgba(147, 51, 234, 0.3)' }}
                whileTap={{ scale: 0.95 }}
              >
                Save
              </motion.button>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default VenueSelectionModal;
