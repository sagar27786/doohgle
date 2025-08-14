import React, { useState, useEffect } from 'react';
import { useInView } from 'react-intersection-observer';
import { 
  BarChart3, TrendingUp, Users, Target, Play, Pause, 
  Calendar, DollarSign, Eye, MousePointer, Heart,
  ArrowUpRight, ArrowDownRight, RefreshCw, Settings,
  Bell, Search, Filter, Download, Plus, Edit3,
  ChevronDown, ChevronRight, Sparkles, Zap
} from 'lucide-react';

const DashboardNav: React.FC<{ activeTab: string; setActiveTab: (tab: string) => void }> = ({ activeTab, setActiveTab }) => {
  const navItems = [
    { id: 'overview', label: 'Overview', icon: BarChart3 },
    { id: 'campaigns', label: 'Campaigns', icon: Target },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'audience', label: 'Audience', icon: Users },
    { id: 'billing', label: 'Billing', icon: DollarSign },
  ];

  return (
    <div className="bg-white/80 backdrop-blur-md border-b border-gray-100 sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-8">
            {navItems.map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center space-x-2 px-4 py-2 rounded-xl transition-all duration-300 ${
                    activeTab === item.id
                      ? 'bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-lg transform scale-105'
                      : 'text-gray-600 hover:text-blue-600 hover:bg-blue-50'
                  }`}
                >
                  <Icon size={18} />
                  <span className="font-medium">{item.label}</span>
                </button>
              );
            })}
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="relative">
              <input
                type="text"
                placeholder="Search campaigns..."
                className="pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
              />
              <Search className="absolute left-3 top-2.5 text-gray-400" size={16} />
            </div>
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
              <Bell size={20} />
            </button>
            <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-xl transition-all duration-300">
              <Settings size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

const MetricCard: React.FC<{
  title: string;
  value: string;
  change: string;
  isPositive: boolean;
  icon: React.ElementType;
  color: string;
  delay?: number;
}> = ({ title, value, change, isPositive, icon: Icon, color, delay = 0 }) => {
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    if (inView) {
      const numericValue = parseInt(value.replace(/[^0-9]/g, ''));
      let start = 0;
      const duration = 2000;
      const increment = numericValue / (duration / 16);
      
      const timer = setInterval(() => {
        start += increment;
        if (start >= numericValue) {
          setAnimatedValue(numericValue);
          clearInterval(timer);
        } else {
          setAnimatedValue(Math.floor(start));
        }
      }, 16);

      return () => clearInterval(timer);
    }
  }, [inView, value]);

  return (
    <div
      ref={ref}
      className={`bg-gradient-to-br from-white to-gray-50 rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-2 ${
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
      }`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      <div className="flex items-center justify-between mb-4">
        <div className={`p-3 rounded-xl ${color}`}>
          <Icon className="text-white" size={24} />
        </div>
        <div className={`flex items-center space-x-1 text-sm ${isPositive ? 'text-green-600' : 'text-red-600'}`}>
          {isPositive ? <ArrowUpRight size={16} /> : <ArrowDownRight size={16} />}
          <span className="font-semibold">{change}</span>
        </div>
      </div>
      
      <div className="space-y-2">
        <h3 className="text-gray-600 text-sm font-medium">{title}</h3>
        <div className="text-3xl font-bold text-gray-900">
          {title.includes('Revenue') || title.includes('Cost') ? '$' : ''}
          {inView ? animatedValue.toLocaleString() : '0'}
          {title.includes('Rate') ? '%' : ''}
        </div>
      </div>
    </div>
  );
};

// Campaign Card Component
const CampaignCard: React.FC<{
  name: string;
  status: 'active' | 'paused' | 'completed';
  budget: string;
  spent: string;
  impressions: string;
  clicks: string;
  ctr: string;
  onToggle: () => void;
}> = ({ name, status, budget, spent, impressions, clicks, ctr, onToggle }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [ref, inView] = useInView({ threshold: 0.1, triggerOnce: true });

  const statusColors = {
    active: 'bg-green-100 text-green-800',
    paused: 'bg-yellow-100 text-yellow-800',
    completed: 'bg-gray-100 text-gray-800',
  };

  return (
    <div
      ref={ref}
      className={`bg-white rounded-2xl p-6 shadow-lg hover:shadow-xl transition-all duration-500 transform hover:-translate-y-1 ${
        inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'
      }`}
    >
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
            <Target className="text-white" size={20} />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{name}</h3>
            <span className={`px-2 py-1 text-xs font-medium rounded-full ${statusColors[status]}`}>
              {status.charAt(0).toUpperCase() + status.slice(1)}
            </span>
          </div>
        </div>
        
        <div className="flex items-center space-x-2">
          <button
            onClick={onToggle}
            className={`p-2 rounded-lg transition-all duration-300 ${
              status === 'active' 
                ? 'bg-red-100 text-red-600 hover:bg-red-200' 
                : 'bg-green-100 text-green-600 hover:bg-green-200'
            }`}
          >
            {status === 'active' ? <Pause size={16} /> : <Play size={16} />}
          </button>
          <button className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300">
            <Edit3 size={16} />
          </button>
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="p-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
          >
            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4 mb-4">
        <div className="text-center p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
          <div className="text-sm text-gray-600">Budget</div>
          <div className="text-lg font-bold text-gray-900">{budget}</div>
        </div>
        <div className="text-center p-3 bg-gradient-to-r from-green-50 to-blue-50 rounded-lg">
          <div className="text-sm text-gray-600">Spent</div>
          <div className="text-lg font-bold text-gray-900">{spent}</div>
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 pt-4 space-y-3 animate-slide-down">
          <div className="grid grid-cols-3 gap-4">
            <div className="text-center">
              <div className="text-xs text-gray-500">Impressions</div>
              <div className="font-semibold text-gray-900">{impressions}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">Clicks</div>
              <div className="font-semibold text-gray-900">{clicks}</div>
            </div>
            <div className="text-center">
              <div className="text-xs text-gray-500">CTR</div>
              <div className="font-semibold text-gray-900">{ctr}</div>
            </div>
          </div>
          
          <div className="flex space-x-2">
            <button className="flex-1 py-2 px-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white rounded-lg hover:from-blue-600 hover:to-purple-600 transition-all duration-300 font-medium">
              View Details
            </button>
            <button className="flex-1 py-2 px-4 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-all duration-300 font-medium">
              Duplicate
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

// Main Dashboard Component
const AdvertiserDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(false);
  
  // Mock campaign data
  const [campaigns, setCampaigns] = useState([
    {
      id: 1,
      name: 'Summer Sale Campaign',
      status: 'active' as const,
      budget: '$5,000',
      spent: '$3,240',
      impressions: '2.4M',
      clicks: '12.3K',
      ctr: '0.51%',
    },
    {
      id: 2,
      name: 'Brand Awareness Q4',
      status: 'paused' as const,
      budget: '$8,000',
      spent: '$4,560',
      impressions: '3.2M',
      clicks: '8.7K',
      ctr: '0.27%',
    },
    {
      id: 3,
      name: 'Product Launch',
      status: 'completed' as const,
      budget: '$12,000',
      spent: '$11,890',
      impressions: '5.1M',
      clicks: '28.4K',
      ctr: '0.56%',
    },
  ]);

  const handleCampaignToggle = (id: number) => {
    setCampaigns(prev => prev.map(campaign => 
      campaign.id === id 
        ? { ...campaign, status: campaign.status === 'active' ? 'paused' : 'active' }
        : campaign
    ));
  };

  const handleRefresh = () => {
    setIsLoading(true);
    setTimeout(() => setIsLoading(false), 1500);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-500 text-white py-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute top-0 left-0 w-full h-full">
          <div className="absolute top-20 left-10 w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse"></div>
          <div className="absolute bottom-20 right-10 w-96 h-96 bg-white/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        </div>
        
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="text-center">
            <div className="inline-flex items-center px-4 py-2 bg-white/20 backdrop-blur-md rounded-full mb-6">
              <Sparkles className="w-4 h-4 mr-2" />
              <span className="text-sm font-medium">Advanced Analytics Dashboard</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              Welcome Back, <span className="bg-gradient-to-r from-yellow-300 to-orange-300 bg-clip-text text-transparent">Sarah!</span>
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto mb-8">
              Your campaigns are performing exceptionally well. Here's your personalized dashboard with real-time insights and AI-powered recommendations.
            </p>
            
            <div className="flex items-center justify-center space-x-4">
              <button
                onClick={handleRefresh}
                className="inline-flex items-center px-6 py-3 bg-white/20 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/30 transition-all duration-300 transform hover:scale-105"
              >
                <RefreshCw className={`w-4 h-4 mr-2 ${isLoading ? 'animate-spin' : ''}`} />
                Refresh Data
              </button>
              <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-yellow-400 to-orange-400 text-gray-900 font-semibold rounded-xl hover:from-yellow-500 hover:to-orange-500 transition-all duration-300 transform hover:scale-105 shadow-lg">
                <Plus className="w-4 h-4 mr-2" />
                Create Campaign
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <DashboardNav activeTab={activeTab} setActiveTab={setActiveTab} />

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'overview' && (
          <div className="space-y-8">
            {/* Key Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <MetricCard
                title="Total Revenue"
                value="127500"
                change="+23.5%"
                isPositive={true}
                icon={DollarSign}
                color="bg-gradient-to-r from-green-500 to-blue-500"
                delay={0}
              />
              <MetricCard
                title="Impressions"
                value="10750000"
                change="+18.2%"
                isPositive={true}
                icon={Eye}
                color="bg-gradient-to-r from-blue-500 to-purple-500"
                delay={200}
              />
              <MetricCard
                title="Click Rate"
                value="4"
                change="+12.1%"
                isPositive={true}
                icon={MousePointer}
                color="bg-gradient-to-r from-purple-500 to-pink-500"
                delay={400}
              />
              <MetricCard
                title="Conversion Rate"
                value="12"
                change="+8.7%"
                isPositive={true}
                icon={Heart}
                color="bg-gradient-to-r from-pink-500 to-red-500"
                delay={600}
              />
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-2xl p-6 shadow-lg">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Quick Actions</h2>
                <Zap className="text-yellow-500" size={24} />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <button className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl hover:from-blue-100 hover:to-purple-100 transition-all duration-300 transform hover:scale-105">
                  <Target className="text-blue-600 mb-2" size={24} />
                  <div className="font-semibold text-gray-900">Create Campaign</div>
                  <div className="text-sm text-gray-600">Launch a new advertising campaign</div>
                </button>
                
                <button className="p-4 bg-gradient-to-r from-green-50 to-blue-50 rounded-xl hover:from-green-100 hover:to-blue-100 transition-all duration-300 transform hover:scale-105">
                  <BarChart3 className="text-green-600 mb-2" size={24} />
                  <div className="font-semibold text-gray-900">View Analytics</div>
                  <div className="text-sm text-gray-600">Deep dive into performance data</div>
                </button>
                
                <button className="p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl hover:from-purple-100 hover:to-pink-100 transition-all duration-300 transform hover:scale-105">
                  <Download className="text-purple-600 mb-2" size={24} />
                  <div className="font-semibold text-gray-900">Export Report</div>
                  <div className="text-sm text-gray-600">Download detailed performance report</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'campaigns' && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-gray-900">Your Campaigns</h2>
              <div className="flex items-center space-x-4">
                <button className="inline-flex items-center px-4 py-2 text-gray-600 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300">
                  <Filter size={16} className="mr-2" />
                  Filter
                </button>
                <button className="inline-flex items-center px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105">
                  <Plus size={16} className="mr-2" />
                  New Campaign
                </button>
              </div>
            </div>
            
            <div className="grid gap-6">
              {campaigns.map((campaign, index) => (
                <CampaignCard
                  key={campaign.id}
                  {...campaign}
                  onToggle={() => handleCampaignToggle(campaign.id)}
                />
              ))}
            </div>
          </div>
        )}

        {/* Placeholder for other tabs */}
        {['analytics', 'audience', 'billing'].includes(activeTab) && (
          <div className="text-center py-16">
            <div className="w-32 h-32 mx-auto mb-6 bg-gradient-to-r from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
              <Target className="text-blue-600" size={48} />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              {activeTab.charAt(0).toUpperCase() + activeTab.slice(1)} Coming Soon
            </h2>
            <p className="text-gray-600 max-w-md mx-auto">
              We're working hard to bring you amazing {activeTab} features. Stay tuned for updates!
            </p>
            <button className="mt-6 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-500 text-white font-semibold rounded-xl hover:from-blue-600 hover:to-purple-600 transition-all duration-300">
              Get Notified
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdvertiserDashboard;
