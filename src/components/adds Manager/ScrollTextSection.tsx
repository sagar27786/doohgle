import React, { useEffect, useState } from 'react';

const ScrollTextSection: React.FC = () => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftTextOffset = Math.min(scrollY * 0.8, 600);
  const rightTextOffset = Math.min(scrollY * 0.8, 600);

  return (
    <section className="py-40 bg-gradient-to-r from-purple-900 via-blue-900 to-purple-900 overflow-hidden relative min-h-screen flex items-center">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative w-full">
        <div 
          className="text-[12vw] md:text-[15vw] lg:text-[18vw] font-bold text-white/15 whitespace-nowrap select-none absolute top-0 left-0 transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(${-800 + leftTextOffset}px)`,
            lineHeight: '0.8'
          }}
        >
          Explore Highlight
        </div>
        
        {/* Right moving text - moves left */}
        <div 
          className="text-[12vw] md:text-[15vw] lg:text-[18vw] font-bold text-white/15 whitespace-nowrap select-none absolute top-20 right-0 transition-transform duration-300 ease-out"
          style={{ 
            transform: `translateX(${800 - rightTextOffset}px)`,
            lineHeight: '0.8'
          }}
        >
          Precision Targeting
        </div>
        
        {/* Center content */}
        <div className="relative z-10 flex items-center justify-center min-h-[60vh]">
          <div className="text-center text-white max-w-4xl mx-auto px-4">
            <h2 className="text-5xl md:text-7xl lg:text-8xl font-bold mb-8 bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">
              Explore Highlight
            </h2>
            <p className="text-xl md:text-2xl opacity-90 max-w-2xl mx-auto">
              Discover the power of precision advertising with our advanced targeting capabilities
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default ScrollTextSection;