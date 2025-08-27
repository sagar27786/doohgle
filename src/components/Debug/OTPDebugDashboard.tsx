import React, { useState, useEffect } from 'react';
import { Mail, Phone, Clock, CheckCircle, XCircle, RefreshCw } from 'lucide-react';

interface OTPRecord {
  id: string;
  email?: string;
  phone?: string;
  otp: string;
  type: 'login' | 'signup' | 'password_reset';
  status: 'pending' | 'verified' | 'expired';
  createdAt: string;
  expiresAt: string;
  attempts: number;
}

const OTPDebugDashboard: React.FC = () => {
  const [otpRecords, setOtpRecords] = useState<OTPRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'pending' | 'verified' | 'expired'>('all');

  // Mock data for demonstration - in production, this would come from API
  useEffect(() => {
    const mockData: OTPRecord[] = [
      {
        id: '1',
        email: 'user@example.com',
        otp: '123456',
        type: 'login',
        status: 'pending',
        createdAt: new Date().toISOString(),
        expiresAt: new Date(Date.now() + 10 * 60 * 1000).toISOString(),
        attempts: 0
      },
      {
        id: '2',
        phone: '+91-9876543210',
        otp: '789012',
        type: 'signup',
        status: 'verified',
        createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() + 5 * 60 * 1000).toISOString(),
        attempts: 1
      },
      {
        id: '3',
        email: 'admin@doohgle.com',
        otp: '345678',
        type: 'password_reset',
        status: 'expired',
        createdAt: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        expiresAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        attempts: 3
      }
    ];
    
    setTimeout(() => {
      setOtpRecords(mockData);
      setIsLoading(false);
    }, 1000);
  }, []);

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending':
        return <Clock className="w-4 h-4 text-yellow-500" />;
      case 'verified':
        return <CheckCircle className="w-4 h-4 text-green-500" />;
      case 'expired':
        return <XCircle className="w-4 h-4 text-red-500" />;
      default:
        return <Clock className="w-4 h-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
      case 'verified':
        return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
      case 'expired':
        return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'login':
        return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
      case 'signup':
        return 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400';
      case 'password_reset':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400';
    }
  };

  const formatTime = (timestamp: string) => {
    return new Date(timestamp).toLocaleString();
  };

  const isExpired = (expiresAt: string) => {
    return new Date(expiresAt) < new Date();
  };

  const getTimeRemaining = (expiresAt: string) => {
    const remaining = new Date(expiresAt).getTime() - new Date().getTime();
    if (remaining <= 0) return 'Expired';
    
    const minutes = Math.floor(remaining / 60000);
    const seconds = Math.floor((remaining % 60000) / 1000);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const filteredRecords = otpRecords.filter(record => {
    if (filter === 'all') return true;
    return record.status === filter;
  });

  const refreshData = () => {
    setIsLoading(true);
    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
    }, 1000);
  };

  return (
    <div className="p-6 bg-white dark:bg-slate-900 rounded-xl shadow-lg">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
            OTP Debug Dashboard
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Monitor and debug OTP verification system
          </p>
        </div>
        <button
          onClick={refreshData}
          disabled={isLoading}
          className="flex items-center gap-2 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors disabled:opacity-50"
        >
          <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter Tabs */}
      <div className="flex gap-2 mb-6">
        {['all', 'pending', 'verified', 'expired'].map(status => (
          <button
            key={status}
            onClick={() => setFilter(status as any)}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              filter === status
                ? 'bg-indigo-600 text-white'
                : 'bg-gray-100 text-gray-600 dark:bg-slate-800 dark:text-gray-400 hover:bg-gray-200 dark:hover:bg-slate-700'
            }`}
          >
            {status.charAt(0).toUpperCase() + status.slice(1)}
          </button>
        ))}
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
        {[
          { label: 'Total OTPs', value: otpRecords.length, color: 'blue' },
          { label: 'Pending', value: otpRecords.filter(r => r.status === 'pending').length, color: 'yellow' },
          { label: 'Verified', value: otpRecords.filter(r => r.status === 'verified').length, color: 'green' },
          { label: 'Expired', value: otpRecords.filter(r => r.status === 'expired').length, color: 'red' },
        ].map((stat, index) => (
          <div key={index} className="bg-gray-50 dark:bg-slate-800 p-4 rounded-lg">
            <p className="text-sm text-gray-600 dark:text-gray-400">{stat.label}</p>
            <p className={`text-2xl font-bold text-${stat.color}-600 dark:text-${stat.color}-400`}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      {/* OTP Records Table */}
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Contact
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                OTP Code
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Type
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Status
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Time Remaining
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Attempts
              </th>
              <th className="text-left py-3 px-4 font-semibold text-gray-900 dark:text-white">
                Created
              </th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={7} className="text-center py-8">
                  <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                  <p className="text-gray-500 dark:text-gray-400">Loading OTP records...</p>
                </td>
              </tr>
            ) : filteredRecords.length === 0 ? (
              <tr>
                <td colSpan={7} className="text-center py-8 text-gray-500 dark:text-gray-400">
                  No OTP records found
                </td>
              </tr>
            ) : (
              filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-gray-100 dark:border-slate-800 hover:bg-gray-50 dark:hover:bg-slate-800/50">
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {record.email ? (
                        <>
                          <Mail className="w-4 h-4 text-blue-500" />
                          <span className="font-mono text-sm">{record.email}</span>
                        </>
                      ) : (
                        <>
                          <Phone className="w-4 h-4 text-green-500" />
                          <span className="font-mono text-sm">{record.phone}</span>
                        </>
                      )}
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <code className="bg-gray-100 dark:bg-slate-800 px-3 py-1 rounded text-lg font-mono font-bold text-indigo-600 dark:text-indigo-400">
                      {record.otp}
                    </code>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(record.type)}`}>
                      {record.type.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      {getStatusIcon(record.status)}
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(record.status)}`}>
                        {record.status}
                      </span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`font-mono ${isExpired(record.expiresAt) ? 'text-red-500' : 'text-gray-900 dark:text-white'}`}>
                      {getTimeRemaining(record.expiresAt)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <span className="font-semibold">{record.attempts}/3</span>
                  </td>
                  <td className="py-3 px-4 text-sm text-gray-500 dark:text-gray-400">
                    {formatTime(record.createdAt)}
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default OTPDebugDashboard;
