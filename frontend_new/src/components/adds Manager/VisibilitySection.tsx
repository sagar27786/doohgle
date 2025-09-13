import React from 'react';
import { useInView } from 'react-intersection-observer';

const VisibilitySection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Visibility Where It Matters
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience the power of strategic digital out-of-home advertising with precise venue targeting
          </p>
        </div>
        
        <div className={`transition-all duration-1000 ${inView ? 'opacity-100 scale-100' : 'opacity-0 scale-95'}`}>
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
              <video
                className="w-full h-auto"
                autoPlay
                loop
                muted
                playsInline
              >
                <source src="https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/656f31d1abaf9511e8a633ec_Framen-Venues.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VisibilitySection;