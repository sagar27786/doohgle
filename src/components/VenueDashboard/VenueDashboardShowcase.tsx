import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Monitor,
  TrendingUp,
  Users,
  Star,
  ArrowRight,
  Calendar,
  DollarSign,
  Eye,
  BarChart3,
  Zap
} from 'lucide-react';

interface VenueDashboardShowcaseProps {
  onNavigateToRequests: () => void;
}

const VenueDashboardShowcase: React.FC<VenueDashboardShowcaseProps> = ({ onNavigateToRequests }) => {
  const [activeFeature, setActiveFeature] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);
    const interval = setInterval(() => {
      setActiveFeature(prev => (prev + 1) % 3);
    }, 4000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: Monitor,
      title: "Smart Screen Management",
      description: "Monitor all your digital screens with real-time performance analytics",
      color: "from-purple-600 to-indigo-600"
    },
    {
      icon: TrendingUp,
      title: "Revenue Analytics",
      description: "Track earnings, bookings, and performance metrics in one dashboard",
      color: "from-green-600 to-teal-600"
    },
    {
      icon: Users,
      title: "Campaign Requests",
      description: "Manage incoming advertising requests from brands and advertisers",
      color: "from-blue-600 to-purple-600"
    }
  ];

  const stats = [
    { label: "Active Screens", value: "12", icon: Monitor, color: "text-purple-600" },
    { label: "Monthly Revenue", value: "₹1.2M", icon: DollarSign, color: "text-green-600" },
    { label: "Campaign Requests", value: "847", icon: Calendar, color: "text-blue-600" },
    { label: "Success Rate", value: "96%", icon: Star, color: "text-yellow-600" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="absolute inset-0">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob"></div>
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000"></div>
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: isVisible ? 1 : 0, y: isVisible ? 0 : 30 }}
            transition={{ duration: 0.8 }}
            className="text-center"
          >
            <motion.div
              className="inline-flex items-center px-4 py-2 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-full border border-purple-200 dark:border-purple-800 mb-8"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.6 }}
            >
              <Zap className="w-4 h-4 text-purple-600 dark:text-purple-400 mr-2" />
              <span className="text-sm font-medium text-purple-600 dark:text-purple-400">
                Professional Venue Management
              </span>
            </motion.div>

            <h1 className="text-4xl md:text-6xl font-bold mb-8 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent">
              Enhanced Venue
              <br />
              Dashboard Experience
            </h1>

            <p className="text-xl text-gray-600 dark:text-gray-300 mb-12 max-w-3xl mx-auto leading-relaxed">
              Manage your digital screens, track revenue, and handle campaign requests 
              with our professional-grade venue management system
            </p>

            <motion.div
              className="flex flex-col sm:flex-row gap-4 justify-center items-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
            >
              <button
                onClick={onNavigateToRequests}
                className="group bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-8 py-4 rounded-xl font-semibold hover:from-purple-700 hover:to-indigo-700 transition-all duration-300 transform hover:scale-105 hover:shadow-xl flex items-center gap-2"
              >
                <Eye className="w-5 h-5" />
                View Campaign Requests
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
              
              <button className="px-8 py-4 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm border border-gray-200 dark:border-slate-700 rounded-xl font-semibold text-gray-700 dark:text-gray-300 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 hover:shadow-lg">
                <BarChart3 className="w-5 h-5 inline mr-2" />
                View Analytics
              </button>
            </motion.div>
          </motion.div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <motion.div
          className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4, duration: 0.8 }}
        >
          {stats.map((stat, index) => (
            <motion.div
              key={index}
              className="bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-gray-200 dark:border-slate-700 hover:shadow-xl transition-all duration-300"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.6 + index * 0.1, duration: 0.5 }}
              whileHover={{ y: -5, scale: 1.02 }}
            >
              <div className="flex items-center justify-between mb-4">
                <stat.icon className={`w-8 h-8 ${stat.color}`} />
                <motion.div
                  className="text-2xl font-bold text-gray-900 dark:text-white"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ delay: 0.8 + index * 0.1, type: "spring", stiffness: 200 }}
                >
                  {stat.value}
                </motion.div>
              </div>
              <p className="text-gray-600 dark:text-gray-400 font-medium">{stat.label}</p>
            </motion.div>
          ))}
        </motion.div>

        {/* Features Section */}
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.8, duration: 0.8 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-6">
                Professional Features
              </h2>
              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                Everything you need to manage your digital advertising screens 
                and maximize revenue potential.
              </p>
            </div>

            <div className="space-y-6">
              {features.map((feature, index) => (
                <motion.div
                  key={index}
                  className={`p-6 rounded-xl border transition-all duration-300 cursor-pointer ${
                    activeFeature === index
                      ? 'bg-white dark:bg-slate-800 border-purple-200 dark:border-purple-700 shadow-lg'
                      : 'bg-white/50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 hover:bg-white dark:hover:bg-slate-800'
                  }`}
                  onClick={() => setActiveFeature(index)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-start gap-4">
                    <motion.div
                      className={`p-3 rounded-lg bg-gradient-to-r ${feature.color}`}
                      animate={{ scale: activeFeature === index ? 1.1 : 1 }}
                      transition={{ duration: 0.3 }}
                    >
                      <feature.icon className="w-6 h-6 text-white" />
                    </motion.div>
                    <div>
                      <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600 dark:text-gray-300">
                        {feature.description}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 1, duration: 0.8 }}
            className="relative"
          >
            <div className="bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-gray-200 dark:border-slate-700 overflow-hidden">
              <div className="bg-gradient-to-r from-purple-600 to-indigo-600 p-4">
                <div className="flex items-center gap-2">
                  <div className="flex gap-2">
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                    <div className="w-3 h-3 rounded-full bg-white/30"></div>
                  </div>
                  <div className="flex-1 text-center">
                    <span className="text-white text-sm font-medium">Venue Dashboard</span>
                  </div>
                </div>
              </div>
              
              <div className="p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeFeature}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.4 }}
                    className="space-y-4"
                  >
                    {activeFeature === 0 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Active Screens</h4>
                          <span className="text-2xl font-bold text-purple-600">12</span>
                        </div>
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <div className="flex items-center gap-3">
                              <div className="w-2 h-2 rounded-full bg-green-500"></div>
                              <span className="text-sm text-gray-700 dark:text-gray-300">Screen {i}</span>
                            </div>
                            <span className="text-sm font-medium text-gray-900 dark:text-white">85%</span>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    {activeFeature === 1 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Monthly Revenue</h4>
                          <span className="text-2xl font-bold text-green-600">₹1.2M</span>
                        </div>
                        <div className="h-32 bg-gradient-to-r from-green-100 to-blue-100 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg flex items-end justify-center p-4">
                          {[40, 65, 80, 55, 90, 75, 85].map((height, i) => (
                            <motion.div
                              key={i}
                              className="bg-gradient-to-t from-green-500 to-blue-500 rounded-sm mx-1"
                              style={{ width: '12px', height: `${height}%` }}
                              initial={{ height: 0 }}
                              animate={{ height: `${height}%` }}
                              transition={{ delay: i * 0.1, duration: 0.5 }}
                            />
                          ))}
                        </div>
                      </div>
                    )}
                    
                    {activeFeature === 2 && (
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <h4 className="font-semibold text-gray-900 dark:text-white">Campaign Requests</h4>
                          <span className="text-2xl font-bold text-blue-600">5</span>
                        </div>
                        {[
                          { name: "Fashion Campaign", budget: "₹25K", status: "pending" },
                          { name: "Tech Launch", budget: "₹45K", status: "approved" },
                          { name: "Holiday Sale", budget: "₹30K", status: "pending" }
                        ].map((request, i) => (
                          <div key={i} className="flex items-center justify-between p-3 bg-gray-50 dark:bg-slate-700 rounded-lg">
                            <div>
                              <p className="text-sm font-medium text-gray-900 dark:text-white">{request.name}</p>
                              <p className="text-xs text-gray-600 dark:text-gray-400">{request.budget}</p>
                            </div>
                            <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                              request.status === 'approved' 
                                ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'
                                : 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400'
                            }`}>
                              {request.status}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <style>{`
        @keyframes blob {
          0%, 100% { transform: translate(0px, 0px) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </div>
  );
};

export default VenueDashboardShowcase;
