import React from 'react';
import { useInView } from 'react-intersection-observer';

const BillingSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Billing Overview
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Transparent and comprehensive billing management for all your campaigns
          </p>
        </div>

        <div className={`transition-all duration-1000 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-8">
              <img 
                src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/656def7870958a0691a3b550_Billing-Overview.svg"
                alt="Billing Overview"
                className="w-full h-auto"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BillingSection;