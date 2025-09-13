import React, { useEffect, useState } from 'react';

interface AnimationState {
  rotationX: number;
  scale: number;
  brightness: number;
  contrast: number;
  shadowOpacity: number;
  shadowScale: number;
  shadowBlur: number;
  translateY: number;
}

const Page3DStandUp: React.FC = () => {
  const [animationState, setAnimationState] = useState<AnimationState>({
    rotationX: 90,
    scale: 0.3,
    brightness: 0.4,
    contrast: 1.3,
    shadowOpacity: 0.2,
    shadowScale: 0.8,
    shadowBlur: 20,
    translateY: 10
  });

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY || window.pageYOffset;
      const windowHeight = window.innerHeight || 800;

      const maxScroll = windowHeight * 0.25; 
      const scrollPercent = Math.min(Math.max(scrollY / maxScroll, 0), 1);
      const progress = scrollPercent;
      const translateY = (1 - progress) * 10; 

      setAnimationState({
        rotationX: 120 - progress * 120, 
        scale: 0.3 + progress * 0.85, 
        brightness: 0.4 + progress * 0.6, 
        contrast: 1.3 - progress * 0.3, 
        shadowOpacity: 0.2 + progress * 0.6,
        shadowScale: 0.8 + progress * 0.2,
        shadowBlur: 20 - progress * 15,
        translateY
      });
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  const progressPercent = Math.round(((90 - animationState.rotationX) / 90) * 100);

  return (
    <div
      className="min-h-[150vh] bg-white overflow-x-hidden font-sans"
      style={{ perspective: '1000px' }}
    >
      <div className="fixed top-5 right-5 z-50">
        <div className="w-12 h-12 rounded-full bg-white/80 backdrop-blur border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-800 shadow">
          {progressPercent}%
        </div>
      </div>

      <div
        className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-10"
        style={{ perspective: '1200px', perspectiveOrigin: 'center center', overflow: 'visible' }}
        aria-hidden={false}
      >
        <div
          className="relative transition-transform duration-150 ease-out"
          style={{
            transform: `rotateX(${animationState.rotationX}deg)`,
            transformStyle: 'preserve-3d',
            willChange: 'transform'
          }}
        >
          <div
            className="relative w-[60vw] h-[70vh] overflow-visible"
            style={{
              filter: `brightness(${animationState.brightness}) contrast(${animationState.contrast})`,
              transform: `translateY(${animationState.translateY}vh) scale(${animationState.scale})`,
              transformOrigin: 'center center'
            }}
          >
            <img
              src="https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/656f3ddf76fe644f3a4e6568_Dashboard-Mobile.jpg"
              alt="Dashboard Mobile Interface"
              className="w-full h-full object-contain rounded-3xl"
              style={{
                boxShadow: `
                  0 0 0 1px rgba(0,0,0,0.06),
                  0 30px 80px rgba(0,0,0,0.25),
                  0 60px 140px rgba(0,0,0,0.12)
                `,
                backfaceVisibility: 'hidden',
                willChange: 'transform, filter'
              }}
            />
          </div>

          <div
            className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-[750px] h-15 rounded-full transition-all duration-300 ease-out -z-10"
            style={{
              background: 'radial-gradient(ellipse, rgba(0,0,0,0.3) 0%, transparent 70%)',
              opacity: animationState.shadowOpacity,
              transform: `translateX(-50%) scale(${animationState.shadowScale})`,
              filter: `blur(${animationState.shadowBlur / 10}px)`
            }}
            aria-hidden
          />
        </div>
      </div>

    </div>
  );
};

export default Page3DStandUp;
