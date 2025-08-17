import React from 'react';
import { TrendingUp, Users, DollarSign, Eye } from 'lucide-react';

interface AnalyticsData {
  title: string;
  value: string;
  change: string;
  changeType: 'positive' | 'negative';
  icon: React.ReactNode;
}

const AnalyticsDashboard: React.FC = () => {
  const analyticsData: AnalyticsData[] = [
    {
      title: 'Total Revenue',
      value: '$12,450',
      change: '+12.5%',
      changeType: 'positive',
      icon: <DollarSign className="h-6 w-6" />
    },
    {
      title: 'Active Screens',
      value: '24',
      change: '+3.2%',
      changeType: 'positive',
      icon: <Eye className="h-6 w-6" />
    },
    {
      title: 'Total Bookings',
      value: '156',
      change: '+8.1%',
      changeType: 'positive',
      icon: <Users className="h-6 w-6" />
    },
    {
      title: 'Growth Rate',
      value: '23.4%',
      change: '+5.2%',
      changeType: 'positive',
      icon: <TrendingUp className="h-6 w-6" />
    }
  ];

  return (
    <div className="p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Analytics Dashboard</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {analyticsData.map((item, index) => (
          <div key={index} className="bg-gray-50 p-4 rounded-lg border">
            <div className="flex items-center justify-between">
              <div className="text-gray-600">{item.icon}</div>
              <div className={`text-sm font-semibold ${
                item.changeType === 'positive' ? 'text-green-600' : 'text-red-600'
              }`}>
                {item.change}
              </div>
            </div>
            
            <div className="mt-4">
              <h3 className="text-lg font-semibold text-gray-800">{item.value}</h3>
              <p className="text-sm text-gray-600">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">Recent Activity</h3>
        <div className="space-y-3">
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-700">New booking for Screen #12 - $450</span>
            <span className="text-xs text-gray-500 ml-auto">2 hours ago</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-700">Screen #8 maintenance completed</span>
            <span className="text-xs text-gray-500 ml-auto">4 hours ago</span>
          </div>
          <div className="flex items-center p-3 bg-gray-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full mr-3"></div>
            <span className="text-sm text-gray-700">Payment received from Client ABC</span>
            <span className="text-xs text-gray-500 ml-auto">6 hours ago</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;
