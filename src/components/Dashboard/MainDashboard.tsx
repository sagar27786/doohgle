import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  BarChart3, 
  MapPin, 
  Target, 
  TrendingUp,
  Activity,
  DollarSign,
  Monitor,
  Calendar,
  BugPlay,
  Eye,
  EyeOff
} from 'lucide-react';
import OTPDebugDashboard from '../Debug/OTPDebugDashboard';
import { authService } from '../../services/authService';

interface DashboardStats {
  totalCampaigns: number;
  activeScreens: number;
  revenue: number;
  impressions: number;
}

const MainDashboard: React.FC = () => {
  const [user] = useState(authService.getCurrentUser());
  const [showOTPDebug, setShowOTPDebug] = useState(false);
  const [stats, setStats] = useState<DashboardStats>({
    totalCampaigns: 0,
    activeScreens: 0,
    revenue: 0,
    impressions: 0
  });

  useEffect(() => {
    // Mock data for demonstration
    setStats({
      totalCampaigns: 12,
      activeScreens: 45,
      revenue: 15420,
      impressions: 125000
    });
  }, []);

  const isVenueOwner = user?.role === 'venue_owner';

  const quickActions = isVenueOwner ? [
    {
      title: 'Manage Screens',
      description: 'Add and configure your digital screens',
      icon: <Monitor className="w-6 h-6" />,
      link: '/venue-dashboard',
      color: 'bg-blue-500'
    },
    {
      title: 'View Bookings',
      description: 'Check incoming booking requests',
      icon: <Calendar className="w-6 h-6" />,
      link: '/venue-dashboard',
      color: 'bg-green-500'
    },
    {
      title: 'Analytics',
      description: 'Track your screen performance',
      icon: <BarChart3 className="w-6 h-6" />,
      link: '/venue-dashboard',
      color: 'bg-purple-500'
    },
    {
      title: 'Earnings',
      description: 'Monitor your revenue streams',
      icon: <DollarSign className="w-6 h-6" />,
      link: '/venue-dashboard',
      color: 'bg-yellow-500'
    }
  ] : [
    {
      title: 'Create Campaign',
      description: 'Launch a new advertising campaign',
      icon: <Target className="w-6 h-6" />,
      link: '/products/ads-manager/campaigns/create',
      color: 'bg-blue-500'
    },
    {
      title: 'Ads Manager',
      description: 'Manage your advertising campaigns',
      icon: <BarChart3 className="w-6 h-6" />,
      link: '/products/ads-manager/dashboard',
      color: 'bg-green-500'
    },
    {
      title: 'Find Screens',
      description: 'Discover available digital screens',
      icon: <MapPin className="w-6 h-6" />,
      link: '/map',
      color: 'bg-purple-500'
    },
    {
      title: 'Analytics',
      description: 'Track campaign performance',
      icon: <TrendingUp className="w-6 h-6" />,
      link: '/products/ads-manager/dashboard',
      color: 'bg-yellow-500'
    }
  ];

  const statCards = isVenueOwner ? [
    {
      title: 'Active Screens',
      value: stats.activeScreens.toString(),
      icon: <Monitor className="w-8 h-8" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Bookings',
      value: '8',
      icon: <Calendar className="w-8 h-8" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'Impressions',
      value: `${(stats.impressions / 1000).toFixed(0)}k`,
      icon: <Activity className="w-8 h-8" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    }
  ] : [
    {
      title: 'Campaigns',
      value: stats.totalCampaigns.toString(),
      icon: <Target className="w-8 h-8" />,
      color: 'text-blue-600 dark:text-blue-400',
      bgColor: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Ad Spend',
      value: `$${stats.revenue.toLocaleString()}`,
      icon: <DollarSign className="w-8 h-8" />,
      color: 'text-green-600 dark:text-green-400',
      bgColor: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'Impressions',
      value: `${(stats.impressions / 1000).toFixed(0)}k`,
      icon: <Activity className="w-8 h-8" />,
      color: 'text-purple-600 dark:text-purple-400',
      bgColor: 'bg-purple-100 dark:bg-purple-900/20'
    },
    {
      title: 'CTR',
      value: '2.4%',
      icon: <TrendingUp className="w-8 h-8" />,
      color: 'text-yellow-600 dark:text-yellow-400',
      bgColor: 'bg-yellow-100 dark:bg-yellow-900/20'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                Welcome back, {user?.name || 'User'}!
              </h1>
              <p className="text-gray-600 dark:text-gray-400">
                {isVenueOwner 
                  ? 'Manage your digital screens and track performance' 
                  : 'Monitor your advertising campaigns and performance'
                }
              </p>
            </div>
            
            {/* Debug Toggle for Admins */}
            <div className="flex gap-2">
              <button
                onClick={() => setShowOTPDebug(!showOTPDebug)}
                className="flex items-center gap-2 px-4 py-2 bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 rounded-lg hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors"
                title="Toggle OTP Debug Panel"
              >
                {showOTPDebug ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                <BugPlay className="w-4 h-4" />
                Debug
              </button>
            </div>
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          {statCards.map((stat, index) => (
            <div
              key={index}
              className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600 dark:text-gray-400 mb-1">
                    {stat.title}
                  </p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">
                    {stat.value}
                  </p>
                </div>
                <div className={`p-3 rounded-full ${stat.bgColor}`}>
                  <div className={stat.color}>{stat.icon}</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* OTP Debug Dashboard - Collapsible */}
        {showOTPDebug && (
          <div className="mb-8 animate-slideInUp">
            <OTPDebugDashboard />
          </div>
        )}

        {/* Quick Actions */}
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            Quick Actions
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickActions.map((action, index) => (
              <Link
                key={index}
                to={action.link}
                className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6 hover:shadow-md hover:scale-105 transition-all duration-200 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`p-3 rounded-lg ${action.color} text-white group-hover:scale-110 transition-transform`}>
                    {action.icon}
                  </div>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                  {action.title}
                </h3>
                <p className="text-gray-600 dark:text-gray-400 text-sm">
                  {action.description}
                </p>
              </Link>
            ))}
          </div>
        </div>

        {/* Recent Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Recent Campaigns/Bookings */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <Activity className="w-5 h-5" />
              {isVenueOwner ? 'Recent Bookings' : 'Recent Campaigns'}
            </h3>
            <div className="space-y-4">
              {[1, 2, 3].map((item) => (
                <div key={item} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">
                      {isVenueOwner ? `Booking Request #${item}` : `Campaign ${item}`}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      {isVenueOwner ? 'Pending approval' : 'Active'}
                    </p>
                  </div>
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    isVenueOwner 
                      ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' 
                      : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                  }`}>
                    {isVenueOwner ? 'Pending' : 'Active'}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Overview */}
          <div className="bg-white dark:bg-slate-800 rounded-xl shadow-sm border border-gray-200 dark:border-slate-700 p-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Performance Overview
            </h3>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">This Week</span>
                <span className="text-sm font-medium text-green-600 dark:text-green-400">+12%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-green-500 h-2 rounded-full" style={{ width: '68%' }}></div>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-600 dark:text-gray-400">This Month</span>
                <span className="text-sm font-medium text-blue-600 dark:text-blue-400">+8%</span>
              </div>
              <div className="w-full bg-gray-200 dark:bg-slate-700 rounded-full h-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '54%' }}></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes slideInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out; }
      `}</style>
    </div>
  );
};

export default MainDashboard;
