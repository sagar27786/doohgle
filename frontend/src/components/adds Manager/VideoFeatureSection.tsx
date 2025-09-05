import React from 'react';
import { useInView } from 'react-intersection-observer';

interface VideoFeatureSectionProps {
  title: string;
  description?: string;
  videoUrl: string;
  className?: string;
}

const VideoFeatureSection: React.FC<VideoFeatureSectionProps> = ({ 
  title, 
  description, 
  videoUrl, 
  className = "py-20 bg-white"
}) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <section ref={ref} className={className}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {title}
          </h2>
          {description && (
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              {description}
            </p>
          )}
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
                <source src={videoUrl} type="video/mp4" />
                <source src={videoUrl.replace('.mp4', '.webm')} type="video/webm" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default VideoFeatureSection;