import React from 'react';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';

interface ChartData {
  month: string;
  revenue: number;
  bookings: number;
  screens: number;
}

const data: ChartData[] = [
  { month: 'Jan', revenue: 4000, bookings: 24, screens: 12 },
  { month: 'Feb', revenue: 3000, bookings: 18, screens: 14 },
  { month: 'Mar', revenue: 5000, bookings: 32, screens: 16 },
  { month: 'Apr', revenue: 4500, bookings: 28, screens: 18 },
  { month: 'May', revenue: 6000, bookings: 38, screens: 20 },
  { month: 'Jun', revenue: 5500, bookings: 35, screens: 22 },
];

export const RevenueChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Revenue Overview</h3>
      <ResponsiveContainer width="100%" height={300}>
        <AreaChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Area type="monotone" dataKey="revenue" stroke="#3B82F6" fill="#3B82F6" fillOpacity={0.3} />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export const BookingsChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Bookings Trend</h3>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Line type="monotone" dataKey="bookings" stroke="#10B981" strokeWidth={3} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export const ScreenUtilizationChart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Screen Utilization</h3>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="month" />
          <YAxis />
          <Tooltip />
          <Bar dataKey="screens" fill="#F59E0B" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
