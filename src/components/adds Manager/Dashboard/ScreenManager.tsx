import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor, Wifi, WifiOff, Power, PowerOff, Settings, MapPin,
  MoreVertical, Play, Pause, Edit, Trash2, Plus, Search, Filter,
  Activity, AlertTriangle, CheckCircle, Clock, Zap, BarChart3,
  Download, Share, RefreshCw, Globe, Signal, HardDrive, Cpu
} from 'lucide-react';

interface Screen {
  id: string;
  name: string;
  location: {
    address: string;
    city: string;
    coordinates: { lat: number; lng: number };
  };
  status: 'online' | 'offline' | 'maintenance' | 'error';
  resolution: string;
  size: string;
  orientation: 'landscape' | 'portrait';
  connectivity: {
    strength: number;
    type: 'wifi' | 'ethernet' | '4g' | '5g';
  };
  hardware: {
    cpu: number;
    memory: number;
    storage: number;
    temperature: number;
  };
  currentAd: {
    campaignId?: string;
    campaignName?: string;
    creative?: string;
    startTime?: string;
    endTime?: string;
  };
  performance: {
    uptime: number;
    avgPlayTime: number;
    impressions: number;
    lastUpdate: string;
  };
  schedule: Array<{
    id: string;
    campaignName: string;
    startTime: string;
    endTime: string;
    status: 'active' | 'scheduled' | 'completed';
  }>;
}

const ScreenManager: React.FC = () => {
  const [screens, setScreens] = useState<Screen[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedScreens, setSelectedScreens] = useState<string[]>([]);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedScreen, setSelectedScreen] = useState<Screen | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [realTimeUpdates, setRealTimeUpdates] = useState(true);

  // Mock data
  useEffect(() => {
    const loadScreens = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setScreens([
        {
          id: '1',
          name: 'Times Square North',
          location: {
            address: '1500 Broadway',
            city: 'New York, NY',
            coordinates: { lat: 40.7580, lng: -73.9855 }
          },
          status: 'online',
          resolution: '4K (3840x2160)',
          size: '75"',
          orientation: 'landscape',
          connectivity: {
            strength: 95,
            type: 'ethernet'
          },
          hardware: {
            cpu: 45,
            memory: 68,
            storage: 42,
            temperature: 38
          },
          currentAd: {
            campaignId: '1',
            campaignName: 'Summer Sale Campaign',
            creative: 'summer_sale_hero.mp4',
            startTime: '2024-01-15T09:00:00Z',
            endTime: '2024-01-15T18:00:00Z'
          },
          performance: {
            uptime: 99.8,
            avgPlayTime: 240,
            impressions: 45000,
            lastUpdate: '2024-01-15T14:30:00Z'
          },
          schedule: [
            {
              id: 's1',
              campaignName: 'Summer Sale Campaign',
              startTime: '09:00',
              endTime: '18:00',
              status: 'active'
            },
            {
              id: 's2',
              campaignName: 'Brand Awareness Q3',
              startTime: '18:00',
              endTime: '23:00',
              status: 'scheduled'
            }
          ]
        },
        {
          id: '2',
          name: 'Central Station Mall',
          location: {
            address: '456 Mall Drive',
            city: 'Los Angeles, CA',
            coordinates: { lat: 34.0522, lng: -118.2437 }
          },
          status: 'online',
          resolution: '1080p (1920x1080)',
          size: '55"',
          orientation: 'portrait',
          connectivity: {
            strength: 78,
            type: 'wifi'
          },
          hardware: {
            cpu: 32,
            memory: 54,
            storage: 67,
            temperature: 42
          },
          currentAd: {
            campaignId: '2',
            campaignName: 'Brand Awareness Q3',
            creative: 'brand_video_v2.mp4',
            startTime: '2024-01-15T08:00:00Z',
            endTime: '2024-01-15T20:00:00Z'
          },
          performance: {
            uptime: 97.5,
            avgPlayTime: 180,
            impressions: 28500,
            lastUpdate: '2024-01-15T14:28:00Z'
          },
          schedule: [
            {
              id: 's3',
              campaignName: 'Brand Awareness Q3',
              startTime: '08:00',
              endTime: '20:00',
              status: 'active'
            }
          ]
        },
        {
          id: '3',
          name: 'Airport Terminal B',
          location: {
            address: 'Terminal B Gate 15',
            city: 'Chicago, IL',
            coordinates: { lat: 41.8781, lng: -87.6298 }
          },
          status: 'maintenance',
          resolution: '4K (3840x2160)',
          size: '65"',
          orientation: 'landscape',
          connectivity: {
            strength: 0,
            type: 'ethernet'
          },
          hardware: {
            cpu: 0,
            memory: 0,
            storage: 78,
            temperature: 25
          },
          currentAd: {},
          performance: {
            uptime: 92.3,
            avgPlayTime: 210,
            impressions: 18200,
            lastUpdate: '2024-01-15T10:15:00Z'
          },
          schedule: []
        },
        {
          id: '4',
          name: 'Downtown Subway',
          location: {
            address: '789 Metro Station',
            city: 'San Francisco, CA',
            coordinates: { lat: 37.7749, lng: -122.4194 }
          },
          status: 'error',
          resolution: '1080p (1920x1080)',
          size: '43"',
          orientation: 'landscape',
          connectivity: {
            strength: 45,
            type: '4g'
          },
          hardware: {
            cpu: 85,
            memory: 92,
            storage: 15,
            temperature: 55
          },
          currentAd: {},
          performance: {
            uptime: 85.2,
            avgPlayTime: 120,
            impressions: 12800,
            lastUpdate: '2024-01-15T12:45:00Z'
          },
          schedule: []
        },
        {
          id: '5',
          name: 'Shopping Center Entrance',
          location: {
            address: '321 Commerce Street',
            city: 'Miami, FL',
            coordinates: { lat: 25.7617, lng: -80.1918 }
          },
          status: 'offline',
          resolution: '4K (3840x2160)',
          size: '85"',
          orientation: 'landscape',
          connectivity: {
            strength: 0,
            type: 'wifi'
          },
          hardware: {
            cpu: 0,
            memory: 0,
            storage: 58,
            temperature: 28
          },
          currentAd: {},
          performance: {
            uptime: 78.9,
            avgPlayTime: 195,
            impressions: 8900,
            lastUpdate: '2024-01-15T08:20:00Z'
          },
          schedule: []
        }
      ]);
      
      setIsLoading(false);
    };

    loadScreens();
  }, []);

  // Real-time updates simulation
  useEffect(() => {
    if (!realTimeUpdates) return;

    const interval = setInterval(() => {
      setScreens(prev => prev.map(screen => ({
        ...screen,
        hardware: {
          ...screen.hardware,
          cpu: Math.max(0, Math.min(100, screen.hardware.cpu + (Math.random() - 0.5) * 10)),
          memory: Math.max(0, Math.min(100, screen.hardware.memory + (Math.random() - 0.5) * 8)),
          temperature: Math.max(20, Math.min(60, screen.hardware.temperature + (Math.random() - 0.5) * 3))
        },
        performance: {
          ...screen.performance,
          impressions: screen.status === 'online' ? screen.performance.impressions + Math.floor(Math.random() * 5) : screen.performance.impressions,
          lastUpdate: new Date().toISOString()
        }
      })));
    }, 3000);

    return () => clearInterval(interval);
  }, [realTimeUpdates]);

  // Filter screens
  const filteredScreens = screens.filter(screen => {
    const matchesSearch = screen.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         screen.location.city.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = selectedStatus === 'all' || screen.status === selectedStatus;
    return matchesSearch && matchesStatus;
  });

  const getStatusColor = (status: Screen['status']) => {
    switch (status) {
      case 'online': return 'text-green-600 bg-green-100';
      case 'offline': return 'text-red-600 bg-red-100';
      case 'maintenance': return 'text-yellow-600 bg-yellow-100';
      case 'error': return 'text-orange-600 bg-orange-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: Screen['status']) => {
    switch (status) {
      case 'online': return CheckCircle;
      case 'offline': return PowerOff;
      case 'maintenance': return Settings;
      case 'error': return AlertTriangle;
      default: return Monitor;
    }
  };

  const getConnectivityIcon = (type: Screen['connectivity']['type']) => {
    switch (type) {
      case 'ethernet': return Globe;
      case 'wifi': return Wifi;
      case '4g':
      case '5g': return Signal;
      default: return WifiOff;
    }
  };

  // Screen Card Component
  const ScreenCard: React.FC<{ screen: Screen; index: number }> = ({ screen, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showActions, setShowActions] = useState(false);
    const StatusIcon = getStatusIcon(screen.status);
    const ConnectivityIcon = getConnectivityIcon(screen.connectivity.type);

    return (
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden cursor-pointer border border-gray-100"
        initial={{ opacity: 0, y: 50, rotateX: -15 }}
        animate={{ opacity: 1, y: 0, rotateX: 0 }}
        transition={{ 
          duration: 0.6, 
          delay: index * 0.1,
          type: "spring",
          stiffness: 300,
          damping: 20
        }}
        whileHover={{ 
          scale: 1.02,
          rotateY: 5,
          rotateX: 2,
          transition: { duration: 0.2 }
        }}
        onHoverStart={() => setIsHovered(true)}
        onHoverEnd={() => setIsHovered(false)}
        style={{ transformStyle: "preserve-3d" }}
        onClick={() => setSelectedScreen(screen)}
      >
        {/* Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <motion.div
              className="w-12 h-12 rounded-xl flex items-center justify-center"
              style={{ 
                backgroundColor: screen.status === 'online' ? '#10B98115' :
                                screen.status === 'offline' ? '#EF444415' :
                                screen.status === 'maintenance' ? '#F59E0B15' :
                                '#F97316I15'
              }}
              animate={{
                scale: isHovered ? 1.1 : 1,
                rotate: isHovered ? [0, -5, 5, 0] : 0
              }}
              transition={{ duration: 0.5 }}
            >
              <StatusIcon 
                size={24} 
                style={{ 
                  color: screen.status === 'online' ? '#10B981' :
                         screen.status === 'offline' ? '#EF4444' :
                         screen.status === 'maintenance' ? '#F59E0B' :
                         '#F97316'
                }} 
              />
            </motion.div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{screen.name}</h3>
              <div className="flex items-center space-x-2">
                <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(screen.status)}`}>
                  {screen.status}
                </span>
                <span className="text-sm text-gray-500">{screen.size} • {screen.resolution}</span>
              </div>
            </div>
          </div>

          {/* Actions Menu */}
          <div className="relative">
            <motion.button
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              onClick={(e) => {
                e.stopPropagation();
                setShowActions(!showActions);
              }}
            >
              <MoreVertical size={18} />
            </motion.button>

            <AnimatePresence>
              {showActions && (
                <motion.div
                  className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 z-20"
                  initial={{ opacity: 0, y: -10, scale: 0.95 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -10, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="py-2">
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Play size={14} />
                      <span>Start Playback</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Pause size={14} />
                      <span>Pause Playback</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <Settings size={14} />
                      <span>Screen Settings</span>
                    </button>
                    <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                      <RefreshCw size={14} />
                      <span>Restart Screen</span>
                    </button>
                    <div className="border-t border-gray-100 my-1" />
                    <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                      <Trash2 size={14} />
                      <span>Remove Screen</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Location */}
        <div className="flex items-center space-x-2 text-sm text-gray-600 mb-4">
          <MapPin size={14} />
          <span>{screen.location.address}, {screen.location.city}</span>
        </div>

        {/* Hardware Stats */}
        <div className="grid grid-cols-2 gap-4 mb-4">
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Cpu size={14} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-600">CPU</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">{screen.hardware.cpu}%</span>
              <div className="w-16 bg-blue-200 rounded-full h-1.5">
                <motion.div
                  className="h-1.5 bg-blue-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${screen.hardware.cpu}%` }}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.8 }}
                />
              </div>
            </div>
          </div>

          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <HardDrive size={14} className="text-purple-600" />
              <span className="text-xs font-medium text-purple-600">Memory</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm font-bold text-gray-900">{screen.hardware.memory}%</span>
              <div className="w-16 bg-purple-200 rounded-full h-1.5">
                <motion.div
                  className="h-1.5 bg-purple-500 rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: `${screen.hardware.memory}%` }}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.8 }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Connectivity & Temperature */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-2">
            <ConnectivityIcon size={16} className={screen.connectivity.strength > 70 ? 'text-green-500' : screen.connectivity.strength > 30 ? 'text-yellow-500' : 'text-red-500'} />
            <span className="text-sm font-medium text-gray-700">{screen.connectivity.type.toUpperCase()}</span>
            <span className="text-xs text-gray-500">{screen.connectivity.strength}%</span>
          </div>
          
          <div className="flex items-center space-x-2">
            <Zap size={16} className={screen.hardware.temperature > 50 ? 'text-red-500' : screen.hardware.temperature > 40 ? 'text-yellow-500' : 'text-green-500'} />
            <span className="text-sm font-medium text-gray-700">{screen.hardware.temperature}°C</span>
          </div>
        </div>

        {/* Current Ad */}
        {screen.currentAd.campaignName && (
          <motion.div
            className="bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl p-3 mb-4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: index * 0.1 + 0.5 }}
          >
            <div className="flex items-center space-x-2 mb-2">
              <Play size={14} className="text-green-600" />
              <span className="text-xs font-medium text-green-600">CURRENTLY PLAYING</span>
            </div>
            <p className="text-sm font-semibold text-gray-900">{screen.currentAd.campaignName}</p>
            <p className="text-xs text-gray-600">{screen.currentAd.creative}</p>
          </motion.div>
        )}

        {/* Performance Stats */}
        <div className="grid grid-cols-3 gap-3 mb-4">
          <div className="text-center">
            <p className="text-xs text-gray-500">Uptime</p>
            <p className="text-sm font-bold text-gray-900">{screen.performance.uptime}%</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Impressions</p>
            <p className="text-sm font-bold text-gray-900">{(screen.performance.impressions / 1000).toFixed(1)}K</p>
          </div>
          <div className="text-center">
            <p className="text-xs text-gray-500">Avg Play</p>
            <p className="text-sm font-bold text-gray-900">{screen.performance.avgPlayTime}s</p>
          </div>
        </div>

        {/* Last Update */}
        <div className="flex items-center justify-between text-xs text-gray-500">
          <span>Last update: {new Date(screen.performance.lastUpdate).toLocaleTimeString()}</span>
          <Clock size={12} />
        </div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: isHovered 
              ? screen.status === 'online' 
                ? '0 0 30px rgba(16, 185, 129, 0.3), 0 0 60px rgba(16, 185, 129, 0.1)'
                : screen.status === 'error'
                ? '0 0 30px rgba(239, 68, 68, 0.3), 0 0 60px rgba(239, 68, 68, 0.1)'
                : '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)'
              : 'none'
          }}
          animate={{
            opacity: isHovered ? 1 : 0
          }}
          transition={{ duration: 0.3 }}
        />
      </motion.div>
    );
  };

  // Screen Detail Modal
  const ScreenDetailModal: React.FC<{ screen: Screen }> = ({ screen }) => {
    return (
      <motion.div
        className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={() => setSelectedScreen(null)}
      >
        <motion.div
          className="bg-white rounded-2xl p-8 max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl"
          initial={{ scale: 0.9, y: 50 }}
          animate={{ scale: 1, y: 0 }}
          exit={{ scale: 0.9, y: 50 }}
          transition={{ type: "spring", stiffness: 300, damping: 25 }}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between mb-6">
            <div>
              <h2 className="text-3xl font-bold text-gray-900">{screen.name}</h2>
              <div className="flex items-center space-x-3 mt-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(screen.status)}`}>
                  {screen.status}
                </span>
                <span className="text-gray-600">{screen.location.city}</span>
              </div>
            </div>
            <button
              onClick={() => setSelectedScreen(null)}
              className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
            >
              ✕
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Hardware Stats */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Hardware Status</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-blue-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Cpu className="text-blue-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">CPU Usage</p>
                        <p className="text-sm text-gray-600">Processor load</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{screen.hardware.cpu}%</p>
                      <div className="w-24 bg-blue-200 rounded-full h-2 mt-1">
                        <motion.div
                          className="h-2 bg-blue-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${screen.hardware.cpu}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-purple-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <HardDrive className="text-purple-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">Memory Usage</p>
                        <p className="text-sm text-gray-600">RAM utilization</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{screen.hardware.memory}%</p>
                      <div className="w-24 bg-purple-200 rounded-full h-2 mt-1">
                        <motion.div
                          className="h-2 bg-purple-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${screen.hardware.memory}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <HardDrive className="text-green-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">Storage</p>
                        <p className="text-sm text-gray-600">Disk usage</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{screen.hardware.storage}%</p>
                      <div className="w-24 bg-green-200 rounded-full h-2 mt-1">
                        <motion.div
                          className="h-2 bg-green-500 rounded-full"
                          initial={{ width: 0 }}
                          animate={{ width: `${screen.hardware.storage}%` }}
                          transition={{ duration: 1 }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center justify-between p-4 bg-orange-50 rounded-xl">
                    <div className="flex items-center space-x-3">
                      <Zap className="text-orange-600" size={20} />
                      <div>
                        <p className="font-medium text-gray-900">Temperature</p>
                        <p className="text-sm text-gray-600">Device temperature</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-xl font-bold text-gray-900">{screen.hardware.temperature}°C</p>
                      <p className="text-sm text-gray-600">
                        {screen.hardware.temperature > 50 ? 'High' : 
                         screen.hardware.temperature > 40 ? 'Normal' : 'Cool'}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Schedule & Performance */}
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Today's Schedule</h3>
                {screen.schedule.length > 0 ? (
                  <div className="space-y-3">
                    {screen.schedule.map((item, index) => (
                      <motion.div
                        key={item.id}
                        className={`p-4 rounded-xl ${
                          item.status === 'active' ? 'bg-green-50 border border-green-200' :
                          item.status === 'scheduled' ? 'bg-blue-50 border border-blue-200' :
                          'bg-gray-50 border border-gray-200'
                        }`}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.1 }}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <p className="font-medium text-gray-900">{item.campaignName}</p>
                            <p className="text-sm text-gray-600">{item.startTime} - {item.endTime}</p>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs font-medium ${
                            item.status === 'active' ? 'bg-green-100 text-green-700' :
                            item.status === 'scheduled' ? 'bg-blue-100 text-blue-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {item.status}
                          </span>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Clock size={32} className="mx-auto mb-2 text-gray-400" />
                    <p>No scheduled content</p>
                  </div>
                )}
              </div>

              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Performance Metrics</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-gradient-to-br from-indigo-50 to-indigo-100 rounded-xl p-4 text-center">
                    <Activity className="text-indigo-600 mx-auto mb-2" size={24} />
                    <p className="text-2xl font-bold text-gray-900">{screen.performance.uptime}%</p>
                    <p className="text-sm text-gray-600">Uptime</p>
                  </div>
                  <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 rounded-xl p-4 text-center">
                    <BarChart3 className="text-emerald-600 mx-auto mb-2" size={24} />
                    <p className="text-2xl font-bold text-gray-900">{(screen.performance.impressions / 1000).toFixed(1)}K</p>
                    <p className="text-sm text-gray-600">Impressions</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex justify-end space-x-3 mt-8 pt-6 border-t border-gray-200">
            <motion.button
              className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setSelectedScreen(null)}
            >
              Close
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Manage Schedule
            </motion.button>
            <motion.button
              className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              Edit Settings
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    );
  };

  const stats = {
    total: screens.length,
    online: screens.filter(s => s.status === 'online').length,
    offline: screens.filter(s => s.status === 'offline').length,
    maintenance: screens.filter(s => s.status === 'maintenance').length,
    error: screens.filter(s => s.status === 'error').length
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 p-6">
      {/* Header */}
      <motion.div
        className="mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="flex items-center justify-between">
          <div>
            <motion.h1
              className="text-4xl font-bold bg-gradient-to-r from-purple-600 to-blue-600 bg-clip-text text-transparent"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              Screen Manager
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Monitor and manage your digital display network
            </motion.p>
          </div>

          <div className="flex items-center space-x-4">
            <motion.button
              className="flex items-center space-x-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setRealTimeUpdates(!realTimeUpdates)}
            >
              <Activity size={16} />
              <span>{realTimeUpdates ? 'Real-time ON' : 'Real-time OFF'}</span>
            </motion.button>

            <motion.button
              className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
              whileHover={{ scale: 1.05, rotateY: 5 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowAddModal(true)}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Plus size={20} />
              <span className="font-semibold">Add Screen</span>
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Stats Overview */}
      <motion.div
        className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        {[
          { label: 'Total Screens', value: stats.total, color: '#6B7280', icon: Monitor },
          { label: 'Online', value: stats.online, color: '#10B981', icon: CheckCircle },
          { label: 'Offline', value: stats.offline, color: '#EF4444', icon: PowerOff },
          { label: 'Maintenance', value: stats.maintenance, color: '#F59E0B', icon: Settings },
          { label: 'Error', value: stats.error, color: '#F97316', icon: AlertTriangle }
        ].map((stat, index) => (
          <motion.div
            key={stat.label}
            className="bg-white rounded-2xl p-4 shadow-lg hover:shadow-xl transition-all duration-300"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
            whileHover={{ scale: 1.02, rotateY: 5 }}
          >
            <div className="flex items-center space-x-3">
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: `${stat.color}15` }}
              >
                <stat.icon size={20} style={{ color: stat.color }} />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-sm text-gray-600">{stat.label}</p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Filters */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search screens by name or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          {/* Status Filter */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="online">Online</option>
              <option value="offline">Offline</option>
              <option value="maintenance">Maintenance</option>
              <option value="error">Error</option>
            </select>

            <motion.button
              className="p-3 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <Filter size={18} />
            </motion.button>
          </div>
        </div>
      </motion.div>

      {/* Screen Cards */}
      <AnimatePresence>
        {isLoading ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {[1, 2, 3, 4, 5, 6].map((i) => (
              <motion.div
                key={i}
                className="bg-white rounded-2xl p-6 shadow-lg"
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: i * 0.1 }}
              >
                <div className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded mb-4"></div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    <div className="h-20 bg-gray-100 rounded-xl"></div>
                    <div className="h-20 bg-gray-100 rounded-xl"></div>
                  </div>
                  <div className="h-16 bg-gray-100 rounded-xl mb-4"></div>
                  <div className="grid grid-cols-3 gap-2">
                    <div className="h-10 bg-gray-100 rounded"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                    <div className="h-10 bg-gray-100 rounded"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredScreens.map((screen, index) => (
              <ScreenCard key={screen.id} screen={screen} index={index} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isLoading && filteredScreens.length === 0 && (
        <motion.div
          className="text-center py-16"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <motion.div
            className="w-24 h-24 mx-auto mb-6 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center"
            animate={{
              rotate: [0, 5, -5, 0],
              scale: [1, 1.05, 1]
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          >
            <Monitor size={32} className="text-purple-600" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No screens found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery || selectedStatus !== 'all' 
              ? "Try adjusting your search or filters to find screens."
              : "Get started by adding your first digital display screen."
            }
          </p>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowAddModal(true)}
          >
            Add Your First Screen
          </motion.button>
        </motion.div>
      )}

      {/* Screen Detail Modal */}
      <AnimatePresence>
        {selectedScreen && (
          <ScreenDetailModal screen={selectedScreen} />
        )}
      </AnimatePresence>

      {/* Add Screen Modal */}
      <AnimatePresence>
        {showAddModal && (
          <motion.div
            className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="bg-white rounded-2xl p-8 max-w-md w-full shadow-2xl"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ type: "spring", stiffness: 300, damping: 25 }}
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Add New Screen</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Screen Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter screen name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Location</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter location address"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Size</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <option>32"</option>
                      <option>43"</option>
                      <option>55"</option>
                      <option>65"</option>
                      <option>75"</option>
                      <option>85"</option>
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Resolution</label>
                    <select className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500">
                      <option>1080p</option>
                      <option>4K</option>
                      <option>8K</option>
                    </select>
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <motion.button
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowAddModal(false)}
                >
                  Add Screen
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ScreenManager;
