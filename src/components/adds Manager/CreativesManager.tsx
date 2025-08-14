import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface Creative {
  id: string;
  name: string;
  type: 'landscape' | 'portrait';
  format: string;
  duration: string;
  created: string;
  image: string;
  qrCode?: boolean;
  qrUrl?: string;
  position?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right';
  scale?: number;
}

interface CreativesManagerProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (creatives: Creative[]) => void;
}

const CreativesManager: React.FC<CreativesManagerProps> = ({ isOpen, onClose, onSave }) => {
  const [activeTab, setActiveTab] = useState<'gallery' | 'upload'>('gallery');
  const [selectedCreatives, setSelectedCreatives] = useState<string[]>(['clang_horizontal', 'qonto_portrait', 'amex_portrait']);
  const [editingCreative, setEditingCreative] = useState<Creative | null>(null);

  const sampleCreatives: Creative[] = [
    {
      id: 'clang_horizontal',
      name: 'clang_horizontal',
      type: 'landscape',
      format: 'video/mp4',
      duration: '10s',
      created: 'Dec 06, 2023, 03:05:07 PM',
      image: 'https://i.pinimg.com/736x/97/84/82/9784824d05fbe0582c59f248ad8d0add.jpg',
      qrCode: true,
      qrUrl: 'lp.bank.com',
      position: 'bottom-left',
      scale: 0.8
    },
    {
      id: 'qonto_portrait',
      name: 'qonto_portrait',
      type: 'portrait',
      format: 'video/mp4',
      duration: '10s',
      created: 'Dec 06, 2023, 03:05:05 PM',
      image: 'https://www.shutterstock.com/image-illustration/modern-luxury-beautiful-mock-scene-260nw-1782304442.jpg',
      qrCode: false
    },
    {
      id: 'amex_portrait',
      name: 'amex_portrait',
      type: 'portrait',
      format: 'video/mp4',
      duration: '10s',
      created: 'Dec 06, 2023, 03:05:01 PM',
      image: 'https://sketchup.cgtips.org/wp-content/uploads/2020/09/3692-Interior-Bedroom-Scene-Sketchup-Model-by-VuVanLuong-1.jpg',
      qrCode: false
    }
  ];

  const toggleCreativeSelection = (id: string) => {
    setSelectedCreatives(prev => 
      prev.includes(id) 
        ? prev.filter(cid => cid !== id)
        : [...prev, id]
    );
  };

  const openEditor = (creative: Creative) => {
    setEditingCreative(creative);
  };

  const closeEditor = () => {
    setEditingCreative(null);
  };

  const handleSave = () => {
    const selectedCreativeObjects = sampleCreatives.filter(c => selectedCreatives.includes(c.id));
    onSave(selectedCreativeObjects);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <motion.div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      >
        <motion.div
          className="bg-white rounded-2xl shadow-2xl max-w-7xl w-full max-h-[90vh] overflow-hidden"
          initial={{ opacity: 0, scale: 0.9, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.9, y: 20 }}
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <h2 className="text-2xl font-semibold text-gray-900">Creatives</h2>
                <div className="flex bg-gray-100 rounded-lg p-1">
                  <button
                    onClick={() => setActiveTab('gallery')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'gallery'
                        ? 'bg-white shadow-sm text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Gallery
                  </button>
                  <button
                    onClick={() => setActiveTab('upload')}
                    className={`px-4 py-2 rounded-md text-sm font-medium transition-all ${
                      activeTab === 'upload'
                        ? 'bg-white shadow-sm text-purple-600'
                        : 'text-gray-500 hover:text-gray-700'
                    }`}
                  >
                    Upload
                  </button>
                </div>
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
          </div>

          {/* Content */}
          <div className="overflow-y-auto max-h-[calc(90vh-200px)]">
            {activeTab === 'gallery' && (
              <div className="p-6">
                {/* Alert */}
                <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg flex items-start space-x-3">
                  <svg className="w-5 h-5 text-orange-500 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
                  </svg>
                  <div className="text-sm text-orange-800">
                    All selected creatives will be optimized to fit our content restrictions. You can check optimized creatives later in the preview dialog.
                  </div>
                </div>

                {/* Controls */}
                <div className="mb-6 flex items-center justify-between">
                  <div className="relative">
                    <svg className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                    <input
                      type="text"
                      placeholder="Search"
                      className="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div className="flex items-center space-x-4">
                    <span className="text-sm text-gray-600">{selectedCreatives.length} of {sampleCreatives.length} selected</span>
                    <select className="border border-gray-300 rounded-lg px-3 py-2 text-sm">
                      <option>Created at</option>
                      <option>Name</option>
                      <option>Type</option>
                    </select>
                    <div className="flex border border-gray-300 rounded-lg overflow-hidden">
                      <button className="p-2 bg-gray-50 hover:bg-gray-100">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                        </svg>
                      </button>
                      <button className="p-2 bg-purple-600 text-white">
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                          <path d="M5 3a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2V5a2 2 0 00-2-2H5zM5 11a2 2 0 00-2 2v2a2 2 0 002 2h2a2 2 0 002-2v-2a2 2 0 00-2-2H5zM11 5a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V5zM11 13a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Gallery Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sampleCreatives.map((creative, index) => (
                    <motion.div
                      key={creative.id}
                      className={`relative rounded-xl overflow-hidden border-2 cursor-pointer transition-all duration-300 ${
                        selectedCreatives.includes(creative.id)
                          ? 'border-purple-500 shadow-lg ring-4 ring-purple-100'
                          : 'border-gray-200 hover:border-gray-300'
                      }`}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      {/* Selection checkbox */}
                      <div className="absolute top-3 left-3 z-10">
                        <motion.div
                          className={`w-6 h-6 rounded border-2 flex items-center justify-center cursor-pointer ${
                            selectedCreatives.includes(creative.id)
                              ? 'bg-purple-600 border-purple-600'
                              : 'bg-white border-gray-300'
                          }`}
                          onClick={() => toggleCreativeSelection(creative.id)}
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                        >
                          {selectedCreatives.includes(creative.id) && (
                            <svg className="w-4 h-4 text-white" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                          )}
                        </motion.div>
                      </div>

                      {/* Status badges */}
                      <div className="absolute top-3 right-3 z-10 flex items-center space-x-2">
                        <div className="flex items-center space-x-1 bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-xs">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                          </svg>
                          <span>Not in use</span>
                        </div>
                      </div>

                      {/* Image */}
                      <div className={`${creative.type === 'landscape' ? 'aspect-video' : 'aspect-[3/4]'} relative overflow-hidden bg-gray-100`}>
                        <img
                          src={creative.image}
                          alt={creative.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.src = '/api/placeholder/400/225';
                          }}
                        />
                      </div>

                      {/* Info */}
                      <div className="p-4">
                        <h3 className="font-semibold text-gray-900 mb-2">{creative.name}</h3>
                        <div className="flex items-center space-x-4 text-sm text-gray-600">
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path d="M2 6a2 2 0 012-2h6l2 2h6a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            </svg>
                            <span>{creative.format}</span>
                          </div>
                          <div className="flex items-center space-x-1">
                            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                            </svg>
                            <span>{creative.duration}</span>
                          </div>
                        </div>
                        <div className="flex items-center space-x-1 text-xs text-gray-500 mt-2">
                          <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                            <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                          </svg>
                          <span>{creative.created}</span>
                        </div>
                        <motion.button
                          onClick={() => openEditor(creative)}
                          className="mt-3 w-full bg-gray-50 hover:bg-gray-100 text-gray-700 py-2 rounded-lg text-sm font-medium transition-colors"
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                        >
                          Edit Creative
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'upload' && (
              <div className="p-6">
                <div className="border-2 border-dashed border-gray-300 rounded-xl p-12 text-center">
                  <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                  </svg>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload your creatives</h3>
                  <p className="text-gray-600 mb-6">Drag and drop files here, or click to browse</p>
                  <motion.button
                    className="bg-purple-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Choose Files
                  </motion.button>
                </div>
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 bg-gray-50 flex items-center justify-between">
            <div className="text-sm text-gray-600">
              {selectedCreatives.length} creative{selectedCreatives.length !== 1 ? 's' : ''} selected
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

      {/* Creative Editor Modal */}
      {editingCreative && (
        <CreativeEditor creative={editingCreative} onClose={closeEditor} />
      )}
    </AnimatePresence>
  );
};

// Creative Editor Component
const CreativeEditor: React.FC<{ creative: Creative; onClose: () => void }> = ({ creative, onClose }) => {
  const [qrEnabled, setQrEnabled] = useState(creative.qrCode || false);
  const [qrUrl, setQrUrl] = useState(creative.qrUrl || '');
  const [position, setPosition] = useState(creative.position || 'bottom-left');
  const [scale, setScale] = useState(creative.scale || 1);

  return (
    <motion.div
      className="fixed inset-0 bg-black/70 backdrop-blur-sm z-60 flex items-center justify-center p-4"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-2xl shadow-2xl max-w-6xl w-full max-h-[90vh] overflow-hidden"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.9 }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-200 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Landscape items</h2>
            <div className="flex items-center space-x-2 mt-1 text-sm text-orange-600">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <span>Removing all previous creatives, might result in a pause of delivery for a period of time.</span>
            </div>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
            <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div className="flex">
          {/* Left Panel - Creative Info */}
          <div className="w-1/3 p-6 border-r border-gray-200">
            <div className="flex items-center space-x-3 mb-6">
              <div className="w-12 h-8 rounded overflow-hidden">
                <img src={creative.image} alt={creative.name} className="w-full h-full object-cover" />
              </div>
              <div>
                <h3 className="font-medium text-gray-900">{creative.name}</h3>
                <div className="flex items-center space-x-4 text-sm text-gray-500">
                  <span className="bg-green-100 text-green-800 px-2 py-0.5 rounded">Optimized</span>
                  <span>{creative.format}</span>
                  <span>{creative.duration}</span>
                  <span>FullHD</span>
                </div>
              </div>
              <button className="ml-auto p-1 hover:bg-gray-100 rounded">
                <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">QR Code URL</label>
                <div className="flex space-x-2">
                  <span className="text-sm text-gray-500 py-2">https://</span>
                  <input
                    type="text"
                    value={qrUrl}
                    onChange={(e) => setQrUrl(e.target.value)}
                    placeholder="example.com"
                    className="flex-1 border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Position</label>
                <select
                  value={position}
                  onChange={(e) => setPosition(e.target.value as any)}
                  className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                >
                  <option value="bottom-left">Bottom-left</option>
                  <option value="bottom-right">Bottom-right</option>
                  <option value="top-left">Top-left</option>
                  <option value="top-right">Top-right</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Scale</label>
                <div className="flex items-center space-x-3">
                  <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.1"
                    value={scale}
                    onChange={(e) => setScale(parseFloat(e.target.value))}
                    className="flex-1"
                  />
                  <span className="text-sm text-gray-600 w-12">{scale}x</span>
                </div>
              </div>

              <motion.button
                className="w-full bg-purple-600 text-white py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Apply to all
              </motion.button>
            </div>
          </div>

          {/* Right Panel - Preview */}
          <div className="flex-1 p-6 bg-gray-50 flex items-center justify-center">
            <div className="relative">
              <img
                src={creative.image}
                alt={creative.name}
                className="max-w-full max-h-96 rounded-lg shadow-lg"
              />
              {qrEnabled && qrUrl && (
                <div
                  className={`absolute w-16 h-16 bg-white rounded p-2 shadow-lg ${
                    position === 'bottom-left' ? 'bottom-4 left-4' :
                    position === 'bottom-right' ? 'bottom-4 right-4' :
                    position === 'top-left' ? 'top-4 left-4' :
                    'top-4 right-4'
                  }`}
                  style={{ transform: `scale(${scale})` }}
                >
                  <div className="w-full h-full bg-gray-900 rounded flex items-center justify-center text-white text-xs">
                    QR
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-200 flex justify-end">
          <motion.button
            className="bg-purple-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-purple-700 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onClose}
          >
            Save
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CreativesManager;
