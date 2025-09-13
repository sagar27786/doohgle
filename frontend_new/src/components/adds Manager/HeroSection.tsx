import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import { Play, Target, BarChart3, Users } from 'lucide-react';

const HeroSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="pt-20 pb-20 bg-gradient-to-br from-indigo-900 via-purple-900 to-pink-800 min-h-screen flex items-center relative overflow-hidden">
      <div className="absolute inset-0 bg-black/20"></div>
      <div className="absolute top-0 left-0 w-full h-full">
        <div className="absolute top-20 left-10 w-72 h-72 bg-purple-500/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-pink-500/10 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-3xl"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`transition-all duration-1000 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-10'}`}>
            <div className="inline-flex items-center px-4 py-2 bg-white/10 backdrop-blur-md rounded-full mb-6">
              <Target className="w-4 h-4 text-white mr-2" />
              <span className="text-white text-sm font-medium">Advanced Targeting</span>
            </div>
            
            <h1 className="text-5xl md:text-6xl lg:text-7xl font-bold text-white mb-6 leading-tight">
              The Future of
              <span className="block bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                Ad Management
              </span>
            </h1>
            
            <p className="text-xl text-gray-300 leading-relaxed mb-8 max-w-2xl">
              Revolutionize your digital advertising with AI-powered targeting, real-time analytics, and seamless campaign management. Reach your perfect audience at the perfect moment.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <button className="inline-flex items-center px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 text-white font-semibold rounded-xl hover:from-purple-700 hover:to-pink-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-1">
                <Play className="w-5 h-5 mr-2" />
                Start Campaign
              </button>
              <button className="inline-flex items-center px-8 py-4 bg-white/10 backdrop-blur-md text-white font-semibold rounded-xl hover:bg-white/20 transition-all duration-300 border border-white/20">
                Watch Demo
              </button>
            </div>
            
            <div className="grid grid-cols-3 gap-8">
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">10M+</div>
                <div className="text-sm text-gray-400">Daily Impressions</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">500+</div>
                <div className="text-sm text-gray-400">Active Campaigns</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold text-white mb-2">99.9%</div>
                <div className="text-sm text-gray-400">Uptime</div>
              </div>
            </div>
          </div>
          
          <div className={`transition-all duration-1000 delay-300 ${inView ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-10'}`}>
            <div className="relative">
              <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-white font-semibold">Campaign Overview</h3>
                  <div className="flex space-x-2">
                    <div className="w-3 h-3 bg-green-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
                    <div className="w-3 h-3 bg-red-400 rounded-full"></div>
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <BarChart3 className="w-5 h-5 text-purple-400 mr-3" />
                      <span className="text-white">Campaign Performance</span>
                    </div>
                    <span className="text-green-400 font-semibold">+23.5%</span>
                  </div>
                  
                  <div className="flex items-center justify-between p-4 bg-white/5 rounded-lg">
                    <div className="flex items-center">
                      <Users className="w-5 h-5 text-blue-400 mr-3" />
                      <span className="text-white">Audience Reach</span>
                    </div>
                    <span className="text-green-400 font-semibold">2.1M</span>
                  </div>
                  
                  <div className="h-32 bg-white/5 rounded-lg p-4">
                    <div className="flex items-end h-full space-x-2">
                      {[...Array(8)].map((_, i) => (
                        <div
                          key={i}
                          className="bg-gradient-to-t from-purple-500 to-pink-500 rounded-t flex-1 transition-all duration-1000 ease-out"
                          style={{
                            height: inView ? `${Math.random() * 80 + 20}%` : '0%',
                            transitionDelay: `${i * 200}ms`
                          }}
                        ></div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="absolute -top-4 -right-4 w-24 h-24 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl flex items-center justify-center rotate-12 shadow-lg">
                <Target className="w-8 h-8 text-white" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
