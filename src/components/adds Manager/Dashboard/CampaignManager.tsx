import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Plus, Search, Filter, MoreVertical, Play, Pause, Edit,
  Trash2, Calendar, DollarSign, Target, Users, Eye, BarChart3,
  TrendingUp, TrendingDown, Settings, Download, Share, Copy,
  MapPin, Clock, Zap, Award, Star, AlertCircle
} from 'lucide-react';

interface Campaign {
  id: string;
  name: string;
  status: 'active' | 'paused' | 'ended' | 'scheduled';
  budget: number;
  spent: number;
  impressions: number;
  clicks: number;
  ctr: number;
  conversions: number;
  startDate: string;
  endDate: string;
  targeting: {
    locations: string[];
    demographics: string[];
    interests: string[];
  };
  creatives: number;
  screens: number[];
  performance: {
    trend: 'up' | 'down' | 'stable';
    change: number;
  };
}

const CampaignManager: React.FC = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [selectedCampaigns, setSelectedCampaigns] = useState<string[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showBulkActions, setShowBulkActions] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [sortBy, setSortBy] = useState<'name' | 'budget' | 'performance' | 'date'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  // Mock data
  useEffect(() => {
    const loadCampaigns = async () => {
      setIsLoading(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      setCampaigns([
        {
          id: '1',
          name: 'Summer Sale Campaign',
          status: 'active',
          budget: 50000,
          spent: 32500,
          impressions: 2500000,
          clicks: 12500,
          ctr: 0.5,
          conversions: 875,
          startDate: '2024-06-01',
          endDate: '2024-08-31',
          targeting: {
            locations: ['New York', 'Los Angeles', 'Chicago'],
            demographics: ['18-35', 'Urban'],
            interests: ['Fashion', 'Shopping', 'Lifestyle']
          },
          creatives: 15,
          screens: [1, 2, 3, 4, 5],
          performance: { trend: 'up', change: 12.5 }
        },
        {
          id: '2',
          name: 'Brand Awareness Q3',
          status: 'active',
          budget: 75000,
          spent: 28900,
          impressions: 3200000,
          clicks: 9600,
          ctr: 0.3,
          conversions: 480,
          startDate: '2024-07-01',
          endDate: '2024-09-30',
          targeting: {
            locations: ['San Francisco', 'Seattle', 'Portland'],
            demographics: ['25-45', 'Professional'],
            interests: ['Technology', 'Business', 'Innovation']
          },
          creatives: 8,
          screens: [6, 7, 8, 9],
          performance: { trend: 'up', change: 8.3 }
        },
        {
          id: '3',
          name: 'Holiday Special Promo',
          status: 'scheduled',
          budget: 100000,
          spent: 0,
          impressions: 0,
          clicks: 0,
          ctr: 0,
          conversions: 0,
          startDate: '2024-11-15',
          endDate: '2024-12-31',
          targeting: {
            locations: ['Nationwide'],
            demographics: ['All Adults'],
            interests: ['Shopping', 'Gifts', 'Family']
          },
          creatives: 20,
          screens: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
          performance: { trend: 'stable', change: 0 }
        },
        {
          id: '4',
          name: 'Product Launch',
          status: 'paused',
          budget: 40000,
          spent: 15200,
          impressions: 1200000,
          clicks: 4800,
          ctr: 0.4,
          conversions: 192,
          startDate: '2024-05-01',
          endDate: '2024-07-31',
          targeting: {
            locations: ['Miami', 'Tampa', 'Orlando'],
            demographics: ['18-40', 'Tech-savvy'],
            interests: ['Electronics', 'Innovation', 'Gadgets']
          },
          creatives: 12,
          screens: [11, 12, 13],
          performance: { trend: 'down', change: -5.2 }
        },
        {
          id: '5',
          name: 'Local Market Test',
          status: 'ended',
          budget: 25000,
          spent: 24890,
          impressions: 950000,
          clicks: 3800,
          ctr: 0.4,
          conversions: 190,
          startDate: '2024-03-01',
          endDate: '2024-05-31',
          targeting: {
            locations: ['Denver', 'Boulder'],
            demographics: ['22-35', 'Active'],
            interests: ['Outdoor', 'Sports', 'Health']
          },
          creatives: 6,
          screens: [14, 15],
          performance: { trend: 'stable', change: 2.1 }
        }
      ]);
      
      setIsLoading(false);
    };

    loadCampaigns();
  }, []);

  // Filter and sort campaigns
  const filteredCampaigns = campaigns
    .filter(campaign => {
      const matchesSearch = campaign.name.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesStatus = selectedStatus === 'all' || campaign.status === selectedStatus;
      return matchesSearch && matchesStatus;
    })
    .sort((a, b) => {
      let comparison = 0;
      
      switch (sortBy) {
        case 'name':
          comparison = a.name.localeCompare(b.name);
          break;
        case 'budget':
          comparison = a.budget - b.budget;
          break;
        case 'performance':
          comparison = a.performance.change - b.performance.change;
          break;
        case 'date':
          comparison = new Date(a.startDate).getTime() - new Date(b.startDate).getTime();
          break;
      }
      
      return sortOrder === 'asc' ? comparison : -comparison;
    });

  const handleCampaignSelect = (campaignId: string) => {
    setSelectedCampaigns(prev => 
      prev.includes(campaignId)
        ? prev.filter(id => id !== campaignId)
        : [...prev, campaignId]
    );
  };

  const handleSelectAll = () => {
    if (selectedCampaigns.length === filteredCampaigns.length) {
      setSelectedCampaigns([]);
    } else {
      setSelectedCampaigns(filteredCampaigns.map(c => c.id));
    }
  };

  const getStatusColor = (status: Campaign['status']) => {
    switch (status) {
      case 'active': return 'text-green-600 bg-green-100';
      case 'paused': return 'text-yellow-600 bg-yellow-100';
      case 'ended': return 'text-gray-600 bg-gray-100';
      case 'scheduled': return 'text-blue-600 bg-blue-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  const formatNumber = (num: number) => {
    if (num >= 1000000) {
      return `${(num / 1000000).toFixed(1)}M`;
    } else if (num >= 1000) {
      return `${(num / 1000).toFixed(1)}K`;
    }
    return num.toString();
  };

  // Campaign Card Component
  const CampaignCard: React.FC<{ campaign: Campaign; index: number }> = ({ campaign, index }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [showActions, setShowActions] = useState(false);

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
      >
        {/* Selection Checkbox */}
        <div className="flex items-start justify-between mb-4">
          <motion.div
            className="flex items-center space-x-3"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.1 + 0.2 }}
          >
            <input
              type="checkbox"
              checked={selectedCampaigns.includes(campaign.id)}
              onChange={() => handleCampaignSelect(campaign.id)}
              className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
            />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">{campaign.name}</h3>
              <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(campaign.status)}`}>
                {campaign.status}
              </span>
            </div>
          </motion.div>

          <div className="flex items-center space-x-2">
            {/* Performance Indicator */}
            <motion.div
              className="flex items-center space-x-1"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: index * 0.1 + 0.4, type: "spring" }}
            >
              {campaign.performance.trend === 'up' ? (
                <TrendingUp size={16} className="text-green-500" />
              ) : campaign.performance.trend === 'down' ? (
                <TrendingDown size={16} className="text-red-500" />
              ) : (
                <BarChart3 size={16} className="text-gray-500" />
              )}
              <span className={`text-sm font-medium ${
                campaign.performance.trend === 'up' ? 'text-green-600' :
                campaign.performance.trend === 'down' ? 'text-red-600' :
                'text-gray-600'
              }`}>
                {campaign.performance.change > 0 ? '+' : ''}{campaign.performance.change}%
              </span>
            </motion.div>

            {/* Actions Menu */}
            <div className="relative">
              <motion.button
                className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setShowActions(!showActions)}
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
                  >
                    <div className="py-2">
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Edit size={14} />
                        <span>Edit Campaign</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Copy size={14} />
                        <span>Duplicate</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Share size={14} />
                        <span>Share</span>
                      </button>
                      <button className="w-full px-4 py-2 text-left text-sm text-gray-700 hover:bg-gray-50 flex items-center space-x-2">
                        <Download size={14} />
                        <span>Export Data</span>
                      </button>
                      <div className="border-t border-gray-100 my-1" />
                      <button className="w-full px-4 py-2 text-left text-sm text-red-600 hover:bg-red-50 flex items-center space-x-2">
                        <Trash2 size={14} />
                        <span>Delete</span>
                      </button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>

        {/* Campaign Stats Grid */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-gradient-to-br from-purple-50 to-purple-100 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <DollarSign size={16} className="text-purple-600" />
              <span className="text-xs font-medium text-purple-600">Budget</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{formatCurrency(campaign.budget)}</p>
            <p className="text-xs text-gray-500">Spent: {formatCurrency(campaign.spent)}</p>
          </div>

          <div className="bg-gradient-to-br from-blue-50 to-blue-100 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Eye size={16} className="text-blue-600" />
              <span className="text-xs font-medium text-blue-600">Impressions</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{formatNumber(campaign.impressions)}</p>
            <p className="text-xs text-gray-500">CTR: {campaign.ctr}%</p>
          </div>

          <div className="bg-gradient-to-br from-green-50 to-green-100 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Target size={16} className="text-green-600" />
              <span className="text-xs font-medium text-green-600">Conversions</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{formatNumber(campaign.conversions)}</p>
            <p className="text-xs text-gray-500">Rate: {((campaign.conversions / campaign.clicks) * 100).toFixed(1)}%</p>
          </div>

          <div className="bg-gradient-to-br from-orange-50 to-orange-100 rounded-xl p-3">
            <div className="flex items-center space-x-2 mb-1">
              <Users size={16} className="text-orange-600" />
              <span className="text-xs font-medium text-orange-600">Screens</span>
            </div>
            <p className="text-sm font-bold text-gray-900">{campaign.screens.length}</p>
            <p className="text-xs text-gray-500">{campaign.creatives} creatives</p>
          </div>
        </div>

        {/* Campaign Timeline */}
        <div className="mb-4">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span>Campaign Timeline</span>
            <span>{new Date(campaign.startDate).toLocaleDateString()} - {new Date(campaign.endDate).toLocaleDateString()}</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <motion.div
              className="h-2 bg-gradient-to-r from-purple-500 to-blue-500 rounded-full"
              initial={{ width: 0 }}
              animate={{ width: `${(campaign.spent / campaign.budget) * 100}%` }}
              transition={{ delay: index * 0.1 + 0.6, duration: 0.8 }}
            />
          </div>
        </div>

        {/* Targeting Info */}
        <motion.div
          className="space-y-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: index * 0.1 + 0.8 }}
        >
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <MapPin size={14} />
            <span>{campaign.targeting.locations.slice(0, 2).join(', ')}</span>
            {campaign.targeting.locations.length > 2 && (
              <span className="text-xs bg-gray-100 px-2 py-1 rounded">
                +{campaign.targeting.locations.length - 2} more
              </span>
            )}
          </div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          className="flex items-center justify-between mt-6 pt-4 border-t border-gray-100"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.1 + 1 }}
        >
          <div className="flex items-center space-x-2">
            {campaign.status === 'active' ? (
              <motion.button
                className="flex items-center space-x-2 px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Pause size={14} />
                <span>Pause</span>
              </motion.button>
            ) : campaign.status === 'paused' ? (
              <motion.button
                className="flex items-center space-x-2 px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Play size={14} />
                <span>Resume</span>
              </motion.button>
            ) : null}

            <motion.button
              className="flex items-center space-x-2 px-3 py-1.5 bg-blue-100 text-blue-700 rounded-lg hover:bg-blue-200 transition-colors text-sm font-medium"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              <BarChart3 size={14} />
              <span>Analytics</span>
            </motion.button>
          </div>

          <motion.button
            className="flex items-center space-x-2 px-3 py-1.5 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <Settings size={14} />
            <span>Manage</span>
          </motion.button>
        </motion.div>

        {/* Glow Effect */}
        <motion.div
          className="absolute inset-0 rounded-2xl pointer-events-none"
          style={{
            boxShadow: isHovered 
              ? '0 0 30px rgba(139, 92, 246, 0.3), 0 0 60px rgba(139, 92, 246, 0.1)' 
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
              Campaign Manager
            </motion.h1>
            <motion.p
              className="text-gray-600 mt-2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
            >
              Create, manage, and optimize your advertising campaigns
            </motion.p>
          </div>

          <motion.button
            className="flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05, rotateY: 5 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.6 }}
          >
            <Plus size={20} />
            <span className="font-semibold">Create Campaign</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Filters and Search */}
      <motion.div
        className="bg-white rounded-2xl p-6 shadow-lg mb-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0">
          {/* Search */}
          <div className="relative flex-1 lg:max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search campaigns..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500 bg-gray-50 focus:bg-white transition-all"
            />
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="paused">Paused</option>
              <option value="scheduled">Scheduled</option>
              <option value="ended">Ended</option>
            </select>

            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="px-4 py-3 bg-gray-50 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
            >
              <option value="name">Sort by Name</option>
              <option value="budget">Sort by Budget</option>
              <option value="performance">Sort by Performance</option>
              <option value="date">Sort by Date</option>
            </select>

            <motion.button
              className="p-3 bg-gray-50 border border-gray-300 rounded-xl hover:bg-gray-100 transition-colors"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
            >
              <Filter size={18} />
            </motion.button>
          </div>
        </div>

        {/* Bulk Actions */}
        <AnimatePresence>
          {selectedCampaigns.length > 0 && (
            <motion.div
              className="mt-4 p-4 bg-purple-50 rounded-xl border border-purple-200"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              <div className="flex items-center justify-between">
                <p className="text-purple-700 font-medium">
                  {selectedCampaigns.length} campaign{selectedCampaigns.length > 1 ? 's' : ''} selected
                </p>
                
                <div className="flex items-center space-x-2">
                  <motion.button
                    className="px-3 py-1.5 bg-green-100 text-green-700 rounded-lg hover:bg-green-200 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Start All
                  </motion.button>
                  <motion.button
                    className="px-3 py-1.5 bg-yellow-100 text-yellow-700 rounded-lg hover:bg-yellow-200 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Pause All
                  </motion.button>
                  <motion.button
                    className="px-3 py-1.5 bg-red-100 text-red-700 rounded-lg hover:bg-red-200 transition-colors text-sm font-medium"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    Delete All
                  </motion.button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Select All */}
        <div className="mt-4 flex items-center space-x-2">
          <input
            type="checkbox"
            checked={selectedCampaigns.length === filteredCampaigns.length && filteredCampaigns.length > 0}
            onChange={handleSelectAll}
            className="w-5 h-5 text-purple-600 border-gray-300 rounded focus:ring-purple-500"
          />
          <span className="text-sm text-gray-600">Select all campaigns</span>
        </div>
      </motion.div>

      {/* Campaign Cards */}
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
                  <div className="h-4 bg-gray-200 rounded mb-2"></div>
                  <div className="h-2 bg-gray-200 rounded mb-4"></div>
                  <div className="flex space-x-2">
                    <div className="h-8 bg-gray-200 rounded w-20"></div>
                    <div className="h-8 bg-gray-200 rounded w-24"></div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-8">
            {filteredCampaigns.map((campaign, index) => (
              <CampaignCard key={campaign.id} campaign={campaign} index={index} />
            ))}
          </div>
        )}
      </AnimatePresence>

      {/* Empty State */}
      {!isLoading && filteredCampaigns.length === 0 && (
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
            <Target size={32} className="text-purple-600" />
          </motion.div>
          <h3 className="text-2xl font-bold text-gray-900 mb-2">No campaigns found</h3>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            {searchQuery || selectedStatus !== 'all' 
              ? "Try adjusting your search or filters to find campaigns."
              : "Get started by creating your first advertising campaign."
            }
          </p>
          <motion.button
            className="px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg hover:shadow-xl"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setShowCreateModal(true)}
          >
            Create Your First Campaign
          </motion.button>
        </motion.div>
      )}

      {/* Create Campaign Modal */}
      <AnimatePresence>
        {showCreateModal && (
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
              <h3 className="text-2xl font-bold text-gray-900 mb-6">Create New Campaign</h3>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Campaign Name</label>
                  <input
                    type="text"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="Enter campaign name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Budget</label>
                  <input
                    type="number"
                    className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    placeholder="0"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                    <input
                      type="date"
                      className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                    />
                  </div>
                </div>
              </div>
              
              <div className="flex space-x-3 mt-8">
                <motion.button
                  className="flex-1 px-4 py-3 bg-gray-100 text-gray-700 rounded-xl hover:bg-gray-200 transition-colors font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                >
                  Cancel
                </motion.button>
                <motion.button
                  className="flex-1 px-4 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white rounded-xl hover:from-purple-700 hover:to-blue-700 transition-all shadow-lg font-medium"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setShowCreateModal(false)}
                >
                  Create Campaign
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default CampaignManager;
