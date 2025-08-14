"use client";
import React, { useEffect, useState } from 'react';
import { useInView } from 'react-intersection-observer';
import Lottie from 'lottie-react';
import { BackgroundGradient } from "../ui/background-gradient";
import { PinContainer } from "../ui/3d-pin";
import { motion } from 'motion/react';

const LottieRowSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [equalizerData, setEqualizerData] = useState(null);
  const [membersData, setMembersData] = useState(null);
  const [linkData, setLinkData] = useState(null);
  const [clickedCards, setClickedCards] = useState<{[key: number]: boolean}>({});
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

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

  const handleCardClick = (cardIndex: number) => {
    setClickedCards(prev => ({...prev, [cardIndex]: !prev[cardIndex]}));
    setSelectedCard(selectedCard === cardIndex ? null : cardIndex);
  };

  const cardData = [
    {
      id: 1,
      title: "Flexible Control",
      description: "Refine your campaign's settings on the fly for enhanced impact. Real-time adjustments with precision controls.",
      icon: "⚡",
      lottieData: equalizerData,
      gradient: "bg-gradient-to-br from-purple-600 via-blue-600 to-cyan-500",
      price: "$299",
      features: ["Real-time Control", "Advanced Analytics", "Custom Settings"]
    },
    {
      id: 2,
      title: "Team Management",
      description: "User-roles enable your whole team to collaborate on the same campaign. Seamless collaboration tools.",
      icon: "👥",
      lottieData: membersData,
      gradient: "bg-gradient-to-br from-orange-500 via-red-500 to-pink-600",
      price: "$199",
      features: ["Role Management", "Team Analytics", "Collaboration Tools"]
    },
    {
      id: 3,
      title: "Share with Clients",
      description: "Generate a campaign preview link for budget approval and much more. Professional client presentations.",
      icon: "🔗",
      lottieData: linkData,
      gradient: "bg-gradient-to-br from-green-500 via-teal-500 to-blue-600",
      price: "$399",
      features: ["Preview Links", "Client Portal", "Budget Approval"]
    }
  ];

  const FloatingParticles = () => {
    const particles = Array.from({ length: 20 }, (_, i) => ({
      id: i,
      initialX: Math.random() * 100,
      initialY: Math.random() * 100,
      size: Math.random() * 6 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));

    return (
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute bg-gradient-to-r from-cyan-400 via-purple-400 to-pink-400 rounded-full opacity-20"
            style={{
              width: particle.size,
              height: particle.size,
              left: `${particle.initialX}%`,
              top: `${particle.initialY}%`,
            }}
            animate={{
              x: [0, 30, -30, 0],
              y: [0, -30, 30, 0],
              opacity: [0.1, 0.3, 0.1],
            }}
            transition={{
              duration: particle.duration,
              repeat: Infinity,
              delay: particle.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>
    );
  };

  return (
    <section ref={ref} className="py-20 bg-gradient-to-br from-white via-violet-50/30 via-blue-50/40 to-purple-50/50 min-h-screen relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(255,255,255,0.9)_0%,rgba(248,250,252,0.8)_50%,rgba(243,244,246,0.7)_100%)]"></div>
      <FloatingParticles />
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_30%,rgba(124,58,237,0.1),transparent_40%)] animate-pulse"></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_80%_70%,rgba(14,165,233,0.1),transparent_40%)] animate-pulse" style={{animationDelay: '1s'}}></div>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(236,72,153,0.05),transparent_50%)] animate-pulse" style={{animationDelay: '2s'}}></div>
      
      <motion.div
        className="absolute top-20 left-20 w-20 h-20 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full opacity-10"
        animate={{
          x: [0, 50, 0],
          y: [0, -30, 0],
          rotate: [0, 180, 360],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="absolute bottom-32 right-16 w-16 h-16 bg-gradient-to-r from-green-400 to-teal-500 rounded-lg opacity-10"
        animate={{
          x: [0, -40, 0],
          y: [0, 20, 0],
          rotate: [0, -180, -360],
        }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <motion.div 
          className="text-center mb-20"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          
        </motion.div>

        <div className={`grid grid-cols-1 md:grid-cols-3 gap-12 ${inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-10'} transition-all duration-1000`}>
          {cardData.map((card, index) => (
            <motion.div
              key={card.id}
              className="h-[40rem] w-full flex items-center justify-center"
              initial={{ opacity: 0, y: 100, rotateX: -30 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.8, delay: index * 0.3, type: "spring", stiffness: 100 }}
            >
              <PinContainer
                title={`${card.title} - ${card.price}`}
                href={`#${card.title.toLowerCase().replace(' ', '-')}`}
                containerClassName="transform hover:scale-105 transition-all duration-300"
              >
                <motion.div 
                  className="flex basis-full flex-col p-6 tracking-tight text-gray-700 sm:basis-1/2 w-[20rem] h-[20rem] cursor-pointer"
                  onClick={() => handleCardClick(index)}
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                  style={{
                    background: clickedCards[index] 
                      ? 'linear-gradient(145deg, rgba(255,255,255,0.95), rgba(248,250,252,0.9), rgba(239,246,255,0.95))'
                      : 'linear-gradient(145deg, rgba(255,255,255,0.9), rgba(249,250,251,0.85), rgba(243,244,246,0.9))',
                    boxShadow: clickedCards[index]
                      ? '0 8px 32px rgba(124,58,237,0.15), 0 0 0 1px rgba(124,58,237,0.1)'
                      : '0 4px 16px rgba(0,0,0,0.08), 0 0 0 1px rgba(0,0,0,0.05)',
                  }}
                >
                  <motion.div
                    className={`absolute -top-2 -right-2 px-3 py-1 rounded-full text-xs font-bold z-50 ${
                      clickedCards[index] 
                        ? 'bg-gradient-to-r from-green-400 to-emerald-500 text-white shadow-lg' 
                        : 'bg-gradient-to-r from-gray-200 to-gray-300 text-gray-700'
                    }`}
                    animate={{
                      scale: clickedCards[index] ? [1, 1.2, 1] : 1,
                      rotate: clickedCards[index] ? [0, 10, -10, 0] : 0,
                    }}
                    transition={{ duration: 0.5 }}
                  >
                    {clickedCards[index] ? '🎉 ACTIVE' : '⭐ CLICK ME'}
                  </motion.div>

                  <motion.div 
                    className="flex justify-center mb-4"
                    animate={{
                      y: clickedCards[index] ? [-5, 5, -5] : 0,
                      rotate: selectedCard === index ? [0, 360] : 0,
                    }}
                    transition={{ 
                      y: { duration: 2, repeat: clickedCards[index] ? Infinity : 0 },
                      rotate: { duration: 1, ease: "easeInOut" }
                    }}
                  >
                    {card.lottieData ? (
                      <div className="relative">
                        <Lottie 
                          animationData={card.lottieData} 
                          loop={true}
                          autoplay={true}
                          className="w-20 h-20 filter drop-shadow-xl"
                        />
                        {clickedCards[index] && (
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1, rotate: 360 }}
                            className="absolute -inset-3 bg-gradient-to-r from-yellow-400 via-pink-400 to-cyan-400 rounded-full blur-md opacity-30 animate-spin"
                            style={{ animationDuration: '3s' }}
                          />
                        )}
                      </div>
                    ) : (
                      <motion.div 
                        className={`w-20 h-20 ${card.gradient} rounded-2xl flex items-center justify-center shadow-xl`}
                        whileHover={{ rotate: 15, scale: 1.1 }}
                      >
                        <div className="text-white text-3xl">{card.icon}</div>
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.h3 
                    className="text-xl font-bold text-slate-800 mb-2 text-center"
                    animate={{
                      color: clickedCards[index] ? '#059669' : '#1e293b'
                    }}
                  >
                    {card.title}
                  </motion.h3>

                  <motion.div className="text-sm text-slate-600 mb-4 leading-relaxed text-center">
                    <span>{card.description.slice(0, 80)}...</span>
                    {clickedCards[index] && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        className="mt-2 space-y-1"
                      >
                        {card.features.map((feature, idx) => (
                          <motion.div
                            key={idx}
                            initial={{ x: -20, opacity: 0 }}
                            animate={{ x: 0, opacity: 1 }}
                            transition={{ delay: idx * 0.1 }}
                            className="flex items-center justify-center text-xs text-emerald-600 font-medium"
                          >
                            <span className="w-1 h-1 bg-emerald-400 rounded-full mr-2"></span>
                            {feature}
                          </motion.div>
                        ))}
                      </motion.div>
                    )}
                  </motion.div>

                  <motion.div 
                    className={`flex flex-1 w-full rounded-xl mt-4 relative overflow-hidden ${
                      clickedCards[index] 
                        ? 'bg-gradient-to-br from-emerald-400 via-cyan-400 to-blue-500'
                        : 'bg-gradient-to-br from-violet-400 via-purple-400 to-blue-400'
                    }`}
                    animate={{
                      backgroundPosition: clickedCards[index] ? ['0% 0%', '100% 100%', '0% 0%'] : '0% 0%',
                    }}
                    transition={{ duration: 3, repeat: clickedCards[index] ? Infinity : 0 }}
                    style={{ backgroundSize: '200% 200%' }}
                  >
                    {/* Price Tag */}
                    <motion.div
                      className="absolute bottom-4 right-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full shadow-lg"
                      animate={{
                        scale: clickedCards[index] ? [1, 1.1, 1] : 1,
                      }}
                      transition={{ duration: 0.5, repeat: clickedCards[index] ? Infinity : 0, repeatDelay: 1 }}
                    >
                      <span className="text-sm font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                        {card.price}
                      </span>
                    </motion.div>
                    
                    {clickedCards[index] && (
                      <motion.div
                        className="absolute inset-0 flex items-center justify-center"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ delay: 0.2 }}
                      >
                        <motion.div
                          className="text-white text-4xl"
                          animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }}
                          transition={{ duration: 0.6, repeat: Infinity, repeatDelay: 2 }}
                        >
                          🎊
                        </motion.div>
                      </motion.div>
                    )}
                  </motion.div>
                </motion.div>
              </PinContainer>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default LottieRowSection;