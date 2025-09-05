import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';

const LottieRowSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [equalizerData, setEqualizerData] = useState(null);
  const [membersData, setMembersData] = useState(null);
  const [linkData, setLinkData] = useState(null);

  useEffect(() => {
    fetch('https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565af8d8ca69397a4d7084c_Equalizer%20Control.json')
      .then(response => response.json())
      .then(data => setEqualizerData(data))
      .catch(error => console.log('Equalizer animation failed to load:', error));

    fetch('https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565b0f48333ee8d17d5288c_Community%20Members.json')
      .then(response => response.json())
      .then(data => setMembersData(data))
      .catch(error => console.log('Members animation failed to load:', error));

    fetch('https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565b197cc5fea2adaf285f4_Link.json')
      .then(response => response.json())
      .then(data => setLinkData(data))
      .catch(error => console.log('Link animation failed to load:', error));
  }, []);

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Advanced Controls
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Powerful tools for flexible control, team management, and seamless sharing
          </p>
        </div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-8 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
          
          <div className="bg-gray-900 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-6">
              {equalizerData ? (
                <Lottie 
                  animationData={equalizerData} 
                  loop={true}
                  autoplay={true}
                  className="w-24 h-24"
                />
              ) : (
                <div className="w-24 h-24 bg-purple-600 rounded-xl flex items-center justify-center">
                  <div className="text-white text-2xl">⚡</div>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Flexible Control</h3>
            <p className="text-gray-300">
              Refine your campaign's settings on the fly for enhanced impact
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-6">
              {membersData ? (
                <Lottie 
                  animationData={membersData} 
                  loop={true}
                  autoplay={true}
                  className="w-24 h-24"
                />
              ) : (
                <div className="w-24 h-24 bg-orange-600 rounded-xl flex items-center justify-center">
                  <div className="text-white text-2xl">👥</div>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Team Management</h3>
            <p className="text-gray-300">
              User-roles enable your whole team to collaborate on the same campaign
            </p>
          </div>

          <div className="bg-gray-900 rounded-2xl p-8 text-center hover:scale-105 transition-transform duration-300">
            <div className="flex justify-center mb-6">
              {linkData ? (
                <Lottie 
                  animationData={linkData} 
                  loop={true}
                  autoplay={true}
                  className="w-24 h-24"
                />
              ) : (
                <div className="w-24 h-24 bg-purple-600 rounded-xl flex items-center justify-center">
                  <div className="text-white text-2xl">🔗</div>
                </div>
              )}
            </div>
            <h3 className="text-2xl font-bold text-white mb-4">Share with clients</h3>
            <p className="text-gray-300">
              Generate a campaign preview link for budget approval and much more
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LottieRowSection;