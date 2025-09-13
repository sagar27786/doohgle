import React from 'react';
import { useInView } from 'react-intersection-observer';

const ChartsSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Performance Analytics
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Get comprehensive insights with our advanced reporting and performance measurement tools
          </p>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-12 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
          
          {/* Reporting Chart */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Reliable Forecast</h3>
            <p className="text-gray-600 mb-8">
              Customize campaign parameters and receive a reliable forecast to fine-tune your strategy, ensuring your efforts align with desired outcomes
            </p>
            <div className="flex justify-center">
              <img 
                src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565b6a3d6674d8f0c45d4a4_Reporting-Chart.svg" 
                alt="Reporting Chart"
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>

          {/* Performance Meter */}
          <div className="bg-white rounded-2xl p-8 shadow-lg hover:shadow-xl transition-all duration-300">
            <h3 className="text-2xl font-bold text-gray-900 mb-6">Campaign Performance</h3>
            <p className="text-gray-600 mb-8">
              Get an indication for optimal settings to ensure your campaign reaches its target with real-time performance metrics
            </p>
            <div className="flex justify-center">
              <img 
                src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565b604a850dda1e280bf55_Performance-Meter.svg" 
                alt="Performance Meter"
                className="w-full max-w-md h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ChartsSection;