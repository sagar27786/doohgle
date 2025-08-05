import React from 'react';
import { useInView } from 'react-intersection-observer';
import { TrendingUp, Users, Link, BarChart3 } from 'lucide-react';

const MetricCard: React.FC<{ 
  title: string; 
  value: string; 
  subtitle?: string;
  icon: React.ReactNode;
  color: string;
}> = ({ title, value, subtitle, icon, color }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'}`}>
      <div className={`w-16 h-16 ${color} rounded-xl flex items-center justify-center mb-6`}>
        {icon}
      </div>
      <h3 className="text-2xl font-bold text-gray-900 mb-2">{title}</h3>
      <div className="text-4xl font-bold text-gray-900 mb-2">{value}</div>
      {subtitle && <p className="text-gray-600">{subtitle}</p>}
    </div>
  );
};

const ChartCard: React.FC<{ title: string; description: string }> = ({ title, description }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={`bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
      <h3 className="text-2xl font-bold text-gray-900 mb-4">{title}</h3>
      <p className="text-gray-600 mb-6">{description}</p>
      
      {/* Simulated chart */}
      <div className="relative h-48 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6">
        <div className="flex items-end h-full space-x-2">
          {[...Array(12)].map((_, i) => (
            <div
              key={i}
              className="bg-gradient-to-t from-purple-600 to-purple-500 rounded-t flex-1 transition-all duration-1000 ease-out"
              style={{
                height: inView ? `${Math.random() * 80 + 20}%` : '0%',
                transitionDelay: `${i * 100}ms`
              }}
            ></div>
          ))}
        </div>
        
        {/* Chart metrics overlay */}
        <div className="absolute top-4 left-4 text-sm text-gray-600">
          <div className="flex space-x-6">
            <div>
              <span className="block text-xs">Impressions</span>
              <span className="font-bold text-gray-900">403,328</span>
            </div>
            <div>
              <span className="block text-xs">Share of Voice</span>
              <span className="font-bold text-gray-900">2.10%</span>
            </div>
            <div>
              <span className="block text-xs">Screens</span>
              <span className="font-bold text-gray-900">516</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardSection: React.FC = () => {
  return (
    <section className="py-20 bg-gradient-to-br from-slate-50 to-gray-100 relative overflow-hidden">
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_1px_1px,rgb(148,163,184)_1px,transparent_0)] bg-[length:20px_20px]"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6">
            <BarChart3 className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Real-time Analytics</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Campaign <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Performance</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get comprehensive insights and analytics to optimize your advertising campaigns with AI-powered recommendations
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-16">
          <MetricCard
            title="Campaign Performance"
            value="5,343,332"
            subtitle="Estimated impressions"
            icon={<TrendingUp className="text-white" size={24} />}
            color="bg-gradient-to-br from-green-500 to-blue-500"
          />
          <MetricCard
            title="Flexible Control"
            value="Real-time"
            subtitle="Campaign adjustments"
            icon={<BarChart3 className="text-white" size={24} />}
            color="bg-gradient-to-br from-purple-500 to-pink-500"
          />
          <MetricCard
            title="Team Management"
            value="24/7"
            subtitle="Collaborative access"
            icon={<Users className="text-white" size={24} />}
            color="bg-gradient-to-br from-orange-500 to-red-500"
          />
          <MetricCard
            title="Share with clients"
            value="Instant"
            subtitle="Campaign previews"
            icon={<Link className="text-white" size={24} />}
            color="bg-gradient-to-br from-purple-500 to-blue-500"
          />
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <ChartCard
            title="Reliable Forecast"
            description="Customize campaign parameters and receive a reliable forecast to fine-tune your strategy, ensuring your efforts align with desired outcomes"
          />
          <ChartCard
            title="Performance Analytics"
            description="Track real-time campaign performance with detailed metrics and insights to maximize your advertising ROI"
          />
        </div>
      </div>
    </section>
  );
};

export default DashboardSection;