import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import CampaignDashboard from './CampaignDashboard';
import CalendarScheduling from './CalendarScheduling';
import VenueSelection from './VenueSelection';
import CreativesSelection from './CreativesSelection';

type ViewType = 'dashboard' | 'campaigns' | 'reports' | 'gallery' | 'account' | 'calendar' | 'venues' | 'creatives';

interface AdsManagerMainProps {
  initialView?: ViewType;
}

const AdsManagerMain: React.FC<AdsManagerMainProps> = ({ initialView = 'dashboard' }) => {
  const [currentView, setCurrentView] = useState<ViewType>(initialView);
  const [isCalendarOpen, setIsCalendarOpen] = useState(false);
  const [activeMenuItem, setActiveMenuItem] = useState('dashboard');
  const [isAccountMenuOpen, setIsAccountMenuOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [selectedHours, setSelectedHours] = useState<number[]>([]);
  const [showDateTimePicker, setShowDateTimePicker] = useState(false);

  const handleGetStarted = () => {
    setCurrentView('campaigns');
  };

  const handleBackToMain = () => {
    setCurrentView('dashboard');
  };

  const handleViewChange = (view: ViewType) => {
    if (view === 'calendar') {
      setIsCalendarOpen(true);
    } else {
      setCurrentView(view);
      setActiveMenuItem(view);
    }
  };

  const handleScheduleClick = () => {
    setShowDateTimePicker(true);
  };

  const handleDateTimeConfirm = (date: Date, hours: number[]) => {
    setSelectedDate(date);
    setSelectedHours(hours);
    setShowDateTimePicker(false);
    // You can add logic here to save the schedule or navigate to next step
  };

  const pageTransition = {
    initial: { opacity: 0, x: 300 },
    animate: { opacity: 1, x: 0 },
    exit: { opacity: 0, x: -300 },
    transition: { duration: 0.3, ease: 'easeInOut' }
  };

  // Main Dashboard Overview with proper metrics and navigation
  const DashboardView = () => {
    return (
      <div className="p-8 bg-gray-50 min-h-screen space-y-8">
        {/* Welcome Section */}
        <motion.div 
          className="bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 rounded-2xl p-8 text-white"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Welcome back, John! 👋</h1>
              <p className="text-purple-100 text-lg">Here's what's happening with your campaigns today.</p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold">€24,590</div>
              <div className="text-purple-100">Total Revenue This Month</div>
            </div>
          </div>
        </motion.div>

        {/* KPI Overview Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[
            { title: 'Active Campaigns', value: '12', change: '+3', changeType: 'positive', icon: '📊' },
            { title: 'Total Impressions', value: '2.4M', change: '+12.5%', changeType: 'positive', icon: '👁️' },
            { title: 'Avg. CTR', value: '3.8%', change: '+0.3%', changeType: 'positive', icon: '🎯' },
            { title: 'Active Screens', value: '156', change: '+8', changeType: 'positive', icon: '📺' }
          ].map((kpi, index) => (
            <motion.div
              key={kpi.title}
              className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              whileHover={{ y: -4 }}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="text-2xl">{kpi.icon}</div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  kpi.changeType === 'positive' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {kpi.change}
                </span>
              </div>
              <div className="text-2xl font-bold text-gray-900 mb-1">{kpi.value}</div>
              <div className="text-sm text-gray-600">{kpi.title}</div>
            </motion.div>
          ))}
        </div>

        {/* Quick Actions Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Recent Campaigns */}
          <motion.div 
            className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-gray-900">Recent Campaigns</h2>
              <motion.button 
                onClick={() => setCurrentView('campaigns')}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                whileHover={{ scale: 1.05 }}
              >
                View All →
              </motion.button>
            </div>
            <div className="space-y-4">
              {[
                { name: 'Summer Sale 2024', status: 'Active', impressions: '45.2K', budget: '€2,400', performance: 85 },
                { name: 'Product Launch', status: 'Scheduled', impressions: '0', budget: '€5,200', performance: 0 },
                { name: 'Holiday Campaign', status: 'Active', impressions: '123.8K', budget: '€8,900', performance: 92 },
                { name: 'Brand Awareness', status: 'Paused', impressions: '78.1K', budget: '€3,600', performance: 67 }
              ].map((campaign, index) => (
                <motion.div 
                  key={campaign.name}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors cursor-pointer"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.6 + index * 0.1 }}
                  whileHover={{ x: 4 }}
                  onClick={() => setCurrentView('campaigns')}
                >
                  <div className="flex-1">
                    <div className="font-medium text-gray-900">{campaign.name}</div>
                    <div className="text-sm text-gray-500 flex items-center space-x-4 mt-1">
                      <span className={`px-2 py-1 rounded text-xs ${
                        campaign.status === 'Active' ? 'bg-green-100 text-green-700' :
                        campaign.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-gray-200 text-gray-600'
                      }`}>
                        {campaign.status}
                      </span>
                      <span>{campaign.impressions} impressions</span>
                      <span>{campaign.budget}</span>
                    </div>
                  </div>
                  {campaign.status === 'Active' && (
                    <div className="text-right">
                      <div className="text-sm font-medium text-gray-900">{campaign.performance}%</div>
                      <div className="w-16 bg-gray-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-purple-600 h-2 rounded-full transition-all duration-500" 
                          style={{ width: `${campaign.performance}%` }}
                        />
                      </div>
                    </div>
                  )}
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* Quick Actions */}
          <motion.div 
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Quick Actions</h2>
            <div className="space-y-4">
              {[
                { name: 'Create Campaign', icon: '➕', action: () => setCurrentView('campaigns'), color: 'purple' },
                { name: 'Upload Creative', icon: '🎨', action: () => setCurrentView('gallery'), color: 'blue' },
                { name: 'View Reports', icon: '📊', action: () => setCurrentView('reports'), color: 'green' },
                { name: 'Schedule Campaign', icon: '📅', action: () => handleScheduleClick(), color: 'orange' },
                { name: 'Manage Venues', icon: '🏢', action: () => setCurrentView('venues'), color: 'indigo' }
              ].map((action, index) => (
                <motion.button
                  key={action.name}
                  onClick={action.action}
                  className={`w-full flex items-center p-4 rounded-lg border border-gray-200 hover:border-${action.color}-300 hover:bg-${action.color}-50 transition-all duration-200 text-left group`}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.7 + index * 0.1 }}
                  whileHover={{ scale: 1.02, x: 4 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="text-2xl mr-3 group-hover:scale-110 transition-transform">{action.icon}</div>
                  <div className="font-medium text-gray-900">{action.name}</div>
                  <div className="ml-auto text-gray-400 group-hover:text-gray-600">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </div>
                </motion.button>
              ))}
            </div>
          </motion.div>
        </div>

        {/* Performance Charts Row */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Monthly Performance Chart */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Campaign Performance (Last 6 Months)</h3>
            <div className="space-y-3">
              {campaignData.slice(1, 7).map((month, index) => (
                <div key={month.name} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600 font-medium">{month.name}</div>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-purple-500 to-blue-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(month.impressions / 5000) * 100}%` }}
                      transition={{ duration: 1.2, delay: 0.9 + index * 0.1 }}
                    />
                  </div>
                  <div className="w-20 text-sm text-gray-700 text-right font-medium">{month.impressions.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Top Venues */}
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-800">Top Performing Venues</h3>
              <motion.button 
                onClick={() => setCurrentView('venues')}
                className="text-purple-600 hover:text-purple-700 font-medium text-sm"
                whileHover={{ scale: 1.05 }}
              >
                Manage →
              </motion.button>
            </div>
            <div className="space-y-3">
              {topVenuesData.map((venue, index) => (
                <div key={venue.name} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600 font-medium">{venue.name}</div>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-teal-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${venue.value}%` }}
                      transition={{ duration: 1.2, delay: 1.0 + index * 0.1 }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-700 text-right font-medium">{venue.value}%</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </div>
    );
  };

  const campaignData = [
    { name: 'Jan', impressions: 4000, clicks: 2400, ctr: 2.4 },
    { name: 'Feb', impressions: 3000, clicks: 1398, ctr: 2.1 },
    { name: 'Mar', impressions: 2000, clicks: 9800, ctr: 4.9 },
    { name: 'Apr', impressions: 2780, clicks: 3908, ctr: 3.4 },
    { name: 'May', impressions: 1890, clicks: 4800, ctr: 5.2 },
    { name: 'Jun', impressions: 2390, clicks: 3800, ctr: 3.8 },
    { name: 'Jul', impressions: 3490, clicks: 4300, ctr: 3.1 },
  ];

  const revenueData = [
    { name: 'Jan', revenue: 5000 },
    { name: 'Feb', revenue: 7000 },
    { name: 'Mar', revenue: 8500 },
    { name: 'Apr', revenue: 9800 },
    { name: 'May', revenue: 10200 },
    { name: 'Jun', revenue: 13500 },
    { name: 'Jul', revenue: 15000 },
  ];

  const topVenuesData = [
    { name: 'Hotels', value: 35 },
    { name: 'Retail', value: 25 },
    { name: 'Transport', value: 20 },
    { name: 'Office', value: 15 },
    { name: 'Healthcare', value: 5 },
  ];

  const ReportsView = () => {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Analytics & Reports</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Impressions</p>
                <p className="text-2xl font-bold text-gray-900">2.4M</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  ↑ 12.5% <span className="text-gray-500 ml-1">vs last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Click Rate</p>
                <p className="text-2xl font-bold text-gray-900">3.8%</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  ↑ 0.3% <span className="text-gray-500 ml-1">vs last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 15l-2 5L9 9l11 4-5 2zm0 0l5 5M7.188 2.239l.777 2.897M5.136 7.965l-2.898-.777M13.95 4.05l-2.122 2.122m-5.657 5.656l-2.12 2.122" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Campaigns</p>
                <p className="text-2xl font-bold text-gray-900">24</p>
                <p className="text-xs text-blue-600 flex items-center mt-1">
                  ↑ 4 <span className="text-gray-500 ml-1">new this week</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100"
            whileHover={{ scale: 1.02 }}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-2xl font-bold text-gray-900">€85.4K</p>
                <p className="text-xs text-green-600 flex items-center mt-1">
                  ↑ €12.3K <span className="text-gray-500 ml-1">vs last month</span>
                </p>
              </div>
              <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1" />
                </svg>
              </div>
            </div>
          </motion.div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Monthly Performance</h3>
            <div className="space-y-4">
              {campaignData.map((month, index) => (
                <div key={month.name} className="flex items-center">
                  <div className="w-12 text-sm text-gray-600">{month.name}</div>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-2 relative overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-blue-500 to-purple-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${(month.impressions / 5000) * 100}%` }}
                      transition={{ duration: 1, delay: 0.6 + index * 0.1 }}
                    />
                  </div>
                  <div className="w-16 text-sm text-gray-700 text-right">{month.impressions.toLocaleString()}</div>
                </div>
              ))}
            </div>
          </motion.div>
          
          <motion.div 
            className="bg-white p-6 rounded-xl shadow-sm"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-4">Venue Performance</h3>
            <div className="space-y-4">
              {topVenuesData.map((venue, index) => (
                <div key={venue.name} className="flex items-center">
                  <div className="w-20 text-sm text-gray-600">{venue.name}</div>
                  <div className="flex-1 mx-4 bg-gray-200 rounded-full h-3 relative overflow-hidden">
                    <motion.div 
                      className="bg-gradient-to-r from-green-500 to-teal-600 h-full rounded-full"
                      initial={{ width: 0 }}
                      animate={{ width: `${venue.value}%` }}
                      transition={{ duration: 1, delay: 0.7 + index * 0.1 }}
                    />
                  </div>
                  <div className="w-12 text-sm text-gray-700 text-right">{venue.value}%</div>
                </div>
              ))}
            </div>
          </motion.div>
        </div>
        
        <motion.div 
          className="bg-white rounded-xl shadow-sm overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="px-6 py-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-800">Campaign Reports</h3>
          </div>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Campaign</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Impressions</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">CTR</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Budget</th>
                  <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {[
                  { id: 1, name: 'Summer Sale', status: 'Active', impressions: '245,678', ctr: '3.2%', budget: '€4,500' },
                  { id: 2, name: 'Product Launch', status: 'Scheduled', impressions: '0', ctr: '-', budget: '€7,800' },
                  { id: 3, name: 'Holiday Special', status: 'Completed', impressions: '893,245', ctr: '4.1%', budget: '€12,300' },
                  { id: 4, name: 'Brand Awareness', status: 'Active', impressions: '125,432', ctr: '2.8%', budget: '€3,200' },
                ].map((campaign, index) => (
                  <motion.tr 
                    key={campaign.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{campaign.name}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                        campaign.status === 'Active' ? 'bg-green-100 text-green-800' : 
                        campaign.status === 'Scheduled' ? 'bg-yellow-100 text-yellow-800' : 
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {campaign.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.impressions}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.ctr}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{campaign.budget}</td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 space-x-3">
                      <motion.button 
                        className="text-indigo-600 hover:text-indigo-900"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        View
                      </motion.button>
                      <motion.button 
                        className="text-indigo-600 hover:text-indigo-900"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        Export
                      </motion.button>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      </div>
    );
  };

  const GalleryView = () => {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-gray-900">Creative Gallery</h1>
          <button className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">
            Upload New
          </button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[
            { id: 1, name: 'Summer Campaign', type: 'Video', preview: 'https://images.unsplash.com/photo-1522542550221-31fd19575a2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
            { id: 2, name: 'Product Showcase', type: 'Image', preview: 'https://images.unsplash.com/photo-1552664730-d307ca884978?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
            { id: 3, name: 'Brand Story', type: 'Video', preview: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
            { id: 4, name: 'Holiday Special', type: 'Image', preview: 'https://images.unsplash.com/photo-1530023367847-a683933f4172?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
            { id: 5, name: 'New Collection', type: 'Image', preview: 'https://images.unsplash.com/photo-1555421689-3f034debb7a6?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
            { id: 6, name: 'Customer Testimonial', type: 'Video', preview: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=60' },
          ].map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="aspect-video bg-gray-200 relative">
                <img src={item.preview} alt={item.name} className="w-full h-full object-cover" />
                {item.type === 'Video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30">
                    <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                      <svg className="w-5 h-5 text-gray-900" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM9.555 7.168A1 1 0 008 8v4a1 1 0 001.555.832l3-2a1 1 0 000-1.664l-3-2z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                )}
              </div>
              <div className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="text-lg font-medium text-gray-900">{item.name}</h3>
                  <span className="text-xs font-medium text-gray-500 px-2 py-1 bg-gray-100 rounded-full">{item.type}</span>
                </div>
                <div className="flex justify-between items-center mt-4">
                  <button className="text-sm text-purple-600 hover:text-purple-800">Edit</button>
                  <div className="flex space-x-2">
                    <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
                      </svg>
                    </button>
                    <button className="p-1.5 bg-gray-100 rounded-full hover:bg-gray-200">
                      <svg className="w-4 h-4 text-gray-600" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clipRule="evenodd" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Account Settings Component
  const AccountView = () => {
    return (
      <div className="p-6 bg-gray-50 min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Account Settings</h1>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Profile Information</h2>
            <p className="text-sm text-gray-500 mt-1">Update your account profile information and email address.</p>
          </div>
          
          <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input type="text" id="name" defaultValue="John Doe" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input type="email" id="email" defaultValue="john.doe@example.com" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            
            <div>
              <label htmlFor="company" className="block text-sm font-medium text-gray-700 mb-1">Company</label>
              <input type="text" id="company" defaultValue="Acme Inc" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
            
            <div>
              <label htmlFor="role" className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <input type="text" id="role" defaultValue="Marketing Manager" className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
            </div>
          </div>
          
          <div className="px-6 py-3 bg-gray-50 text-right">
            <button type="button" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors">Save</button>
          </div>
        </div>
        
        <div className="mt-6 bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-medium text-gray-900">Billing Information</h2>
            <p className="text-sm text-gray-500 mt-1">Update your billing information and payment method.</p>
          </div>
          
          <div className="p-6">
            <h3 className="text-md font-medium text-gray-900 mb-4">Payment Method</h3>
            
            <div className="flex items-center p-4 border border-gray-200 rounded-lg mb-4">
              <div className="flex-shrink-0 mr-4">
                <svg className="w-8 h-8 text-blue-600" viewBox="0 0 48 48" fill="none">
                  <rect width="48" height="48" rx="6" fill="#E6F0FF" />
                  <path d="M32 20H16V28H32V20Z" fill="#2563EB" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-medium text-gray-900">Visa ending in 4242</p>
                <p className="text-xs text-gray-500">Expires 12/2025</p>
              </div>
              <button className="ml-auto text-sm text-purple-600 hover:text-purple-800">Edit</button>
            </div>
            
            <button className="text-sm text-purple-600 hover:text-purple-800 flex items-center">
              <svg className="w-4 h-4 mr-1" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
              Add payment method
            </button>
          </div>
          
          <div className="p-6 border-t border-gray-200">
            <h3 className="text-md font-medium text-gray-900 mb-4">Billing History</h3>
            
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead>
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amount</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Receipt</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {[
                    { id: 1, date: 'Jul 16, 2023', description: 'Monthly subscription', amount: '€49.99', status: 'Paid' },
                    { id: 2, date: 'Jun 16, 2023', description: 'Monthly subscription', amount: '€49.99', status: 'Paid' },
                    { id: 3, date: 'May 16, 2023', description: 'Monthly subscription', amount: '€49.99', status: 'Paid' },
                  ].map((item) => (
                    <tr key={item.id}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.date}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">{item.description}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{item.amount}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <span className="px-2 inline-flex text-xs leading-5 font-semibold rounded-full bg-green-100 text-green-800">
                          {item.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <a href="#" className="text-purple-600 hover:text-purple-800">Download</a>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    );
  };

  // Main Layout with Sidebar
  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-64 bg-white border-r border-gray-200 flex flex-col shadow-sm">
        {/* Logo */}
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-purple-600 to-blue-600 rounded-xl flex items-center justify-center shadow-md">
              <span className="text-white font-bold text-lg">F</span>
            </div>
            <div>
              <div className="font-bold text-gray-900 text-lg">FRAMEN</div>
              <div className="text-xs text-gray-500">Ads Manager</div>
            </div>
          </div>
        </div>
        
        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-2">
          <motion.button
            onClick={() => handleViewChange('dashboard')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              currentView === 'dashboard' 
                ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            whileHover={{ x: 2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className={`w-5 h-5 ${currentView === 'dashboard' ? 'text-purple-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span>Dashboard</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleViewChange('campaigns')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              currentView === 'campaigns' 
                ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            whileHover={{ x: 2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className={`w-5 h-5 ${currentView === 'campaigns' ? 'text-purple-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
            </svg>
            <span>Campaigns</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleViewChange('reports')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              currentView === 'reports' 
                ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            whileHover={{ x: 2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className={`w-5 h-5 ${currentView === 'reports' ? 'text-purple-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <span>Reports</span>
          </motion.button>
          
          <motion.button
            onClick={() => handleViewChange('gallery')}
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
              currentView === 'gallery' 
                ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
            }`}
            whileHover={{ x: 2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className={`w-5 h-5 ${currentView === 'gallery' ? 'text-purple-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <span>Gallery</span>
          </motion.button>
          
          <div className="mt-4 pt-4 border-t border-gray-200">
            <div className="text-xs font-medium text-gray-500 uppercase tracking-wider mb-3 px-4">Account</div>
            <motion.div className="relative">
              <motion.button
                onClick={() => setIsAccountMenuOpen(!isAccountMenuOpen)}
                className={`w-full flex items-center justify-between px-4 py-3 rounded-xl transition-all duration-200 font-medium ${
                  currentView === 'account' || isAccountMenuOpen
                    ? 'bg-purple-100 text-purple-700 shadow-sm border border-purple-200' 
                    : 'text-gray-600 hover:bg-gray-100 hover:text-gray-900'
                }`}
                whileHover={{ x: 2, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <div className="flex items-center space-x-3">
                  <svg className={`w-5 h-5 ${currentView === 'account' || isAccountMenuOpen ? 'text-purple-600' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                  <span>Account</span>
                </div>
                <svg className={`w-4 h-4 transition-transform duration-200 ${isAccountMenuOpen ? 'transform rotate-180' : ''} ${currentView === 'account' || isAccountMenuOpen ? 'text-purple-600' : 'text-gray-400'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
              </motion.button>
            
              <AnimatePresence>
                {isAccountMenuOpen && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    exit={{ opacity: 0, height: 0 }}
                    className="overflow-hidden mt-2"
                  >
                    <div className="space-y-1 pl-2">
                      <motion.button 
                        onClick={() => { handleViewChange('account'); setIsAccountMenuOpen(false); }}
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
                        whileHover={{ x: 2 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        <span>My Settings</span>
                      </motion.button>
                      <motion.button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
                        whileHover={{ x: 2 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                        </svg>
                        <span>Billing</span>
                      </motion.button>
                      <motion.button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
                        whileHover={{ x: 2 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                        </svg>
                        <span>Members</span>
                      </motion.button>
                      <motion.button 
                        className="w-full text-left px-4 py-2 text-sm text-gray-600 hover:text-purple-700 hover:bg-purple-50 rounded-lg transition-colors flex items-center space-x-2"
                        whileHover={{ x: 2 }}
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                        </svg>
                        <span>Organizations</span>
                      </motion.button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </div>
        </nav>
        
        {/* Feedback & Support */}
        <div className="p-4 border-t border-gray-200 mt-auto">
          <motion.button
            className="w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium text-purple-600 hover:text-purple-800 hover:bg-purple-50 rounded-xl border border-purple-200 transition-all duration-200"
            whileHover={{ x: 2, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
            </svg>
            <span>Help & Support</span>
          </motion.button>
        </div>
      </div>
      
      {/* Main Content Area */}
      <div className="flex-1 overflow-auto">
        {/* Header */}
        <header className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-semibold text-gray-900">
                {currentView === 'dashboard' && 'Dashboard'}
                {currentView === 'campaigns' && 'Campaign Manager'}
                {currentView === 'reports' && 'Analytics & Reports'}
                {currentView === 'gallery' && 'Creative Gallery'}
                {currentView === 'account' && 'Account Settings'}
                {currentView === 'venues' && 'Venue Selection'}
                {currentView === 'creatives' && 'Creative Assets'}
                {currentView === 'calendar' && 'Calendar Scheduling'}
              </h1>
            </div>
            
            <div className="flex items-center space-x-4">
              <button className="p-2 text-gray-400 hover:text-gray-500 rounded-full hover:bg-gray-100">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                </svg>
              </button>
              
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-purple-800 font-medium">JD</span>
              </div>
            </div>
          </div>
        </header>
        
        {/* Main Content */}
        <AnimatePresence mode="wait">
          {currentView === 'dashboard' && (
            <motion.div key="dashboard" {...pageTransition}>
              <DashboardView />
            </motion.div>
          )}

          {currentView === 'campaigns' && (
            <motion.div key="campaigns" {...pageTransition}>
              <CampaignDashboard onBack={handleBackToMain} />
            </motion.div>
          )}

          {currentView === 'venues' && (
            <motion.div key="venues" {...pageTransition}>
              <VenueSelection onBack={handleBackToMain} />
            </motion.div>
          )}

          {currentView === 'creatives' && (
            <motion.div key="creatives" {...pageTransition}>
              <CreativesSelection onBack={handleBackToMain} />
            </motion.div>
          )}
          
          {currentView === 'reports' && (
            <motion.div key="reports" {...pageTransition}>
              <ReportsView />
            </motion.div>
          )}
          
          {currentView === 'gallery' && (
            <motion.div key="gallery" {...pageTransition}>
              <GalleryView />
            </motion.div>
          )}
          
          {currentView === 'account' && (
            <motion.div key="account" {...pageTransition}>
              <AccountView />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Calendar Modal */}
        <CalendarScheduling 
          isOpen={isCalendarOpen} 
          onClose={() => setIsCalendarOpen(false)} 
        />

        {/* Inline Date Time Picker for Venue/Campaign */}
        {showDateTimePicker && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 max-w-md w-full">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900">Select Date & Time</h3>
                <button 
                  onClick={() => setShowDateTimePicker(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
              
              {/* Inline Calendar */}
              <div className="mb-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
                <input 
                  type="date" 
                  min={new Date().toISOString().split('T')[0]}
                  onChange={(e) => setSelectedDate(e.target.value ? new Date(e.target.value) : null)}
                  className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                />
              </div>
              
              {/* Time Selection */}
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Slots</label>
                <div className="grid grid-cols-4 gap-2">
                  {Array.from({ length: 24 }, (_, i) => (
                    <button
                      key={i}
                      onClick={() => {
                        setSelectedHours(prev => 
                          prev.includes(i) ? prev.filter(h => h !== i) : [...prev, i]
                        );
                      }}
                      className={`p-2 text-xs rounded-lg border transition-colors ${
                        selectedHours.includes(i)
                          ? 'bg-purple-600 text-white border-purple-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-purple-50'
                      }`}
                    >
                      {i.toString().padStart(2, '0')}:00
                    </button>
                  ))}
                </div>
              </div>
              
              <div className="flex space-x-3">
                <button 
                  onClick={() => setShowDateTimePicker(false)}
                  className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button 
                  onClick={() => {
                    if (selectedDate && selectedHours.length > 0) {
                      handleDateTimeConfirm(selectedDate, selectedHours);
                    }
                  }}
                  disabled={!selectedDate || selectedHours.length === 0}
                  className="flex-1 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Confirm
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdsManagerMain;
