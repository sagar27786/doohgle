import React, { useState, useRef } from 'react';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { Monitor, Globe, BookOpen, Users, ChevronDown, Plus } from 'lucide-react';
import { useOutsideClick } from '../../../hooks/useOutsideClick';
import { ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const BecomeExpert: React.FC = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [expandedCard, setExpandedCard] = useState<number | null>(null);
  const [activeCard, setActiveCard] = useState<number | null>(null);
  const expandedRef = useRef<HTMLDivElement>(null);

  useOutsideClick(expandedRef, () => {
    if (expandedCard !== null) {
      setExpandedCard(null);
      setActiveCard(null);
    }
  });

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.1,
      },
    },
  };

  const cardVariants = {
    hidden: { 
      opacity: 0, 
      y: 50,
      scale: 0.9,
      rotateY: -15,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      rotateY: 0,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
        duration: 0.8,
      },
    },
  };

  const morphingShapeVariants = {
    initial: {
      scale: 0,
      rotate: -180,
      opacity: 0,
    },
    animate: {
      scale: [0, 1.2, 1],
      rotate: [180, 0, 360, 0],
      opacity: [0, 0.8, 1],
      transition: {
        duration: 2,
        ease: "easeInOut",
        times: [0, 0.6, 1],
      },
    },
  };

  const floatingVariants = {
    animate: {
      y: [-10, 10, -10],
      rotate: [0, 5, -5, 0],
      transition: {
        duration: 4,
        repeat: Infinity,
        ease: "easeInOut",
      },
    },
  };

  const expertCards = [
    {
      title: "Monetize your screens",
      description: "When you join our platform, you're getting more than just the ability to manage your ads.",
      expandedContent: "Our comprehensive monetization platform offers advanced analytics, real-time reporting, and AI-powered optimization tools. Track your revenue streams, understand audience engagement, and maximize your screen's earning potential with our suite of professional tools.",
      features: ["Real-time Analytics", "Revenue Optimization", "Audience Insights", "Performance Tracking"],
      buttonText: "Learn more",
      icon: Monitor,
      gradient: "from-green-500 to-blue-500",
      bgColor: "bg-gradient-to-br from-green-50 to-blue-50",
      morphColor: "#10B981",
    },
    {
      title: "Become a publisher",
      description: "With FRAMEN's network, you can share your captivating content with audiences across the globe.",
      expandedContent: "Join our global network of publishers and reach millions of viewers worldwide. Our platform provides powerful content management tools, automated scheduling, and seamless integration with major advertising networks.",
      features: ["Global Network Access", "Content Management", "Automated Scheduling", "Multi-platform Integration"],
      buttonText: "Sign up",
      icon: Globe,
      gradient: "from-blue-500 to-purple-500",
      bgColor: "bg-gradient-to-br from-blue-50 to-purple-50",
      morphColor: "#3B82F6",
    },
    {
      title: "FRAMEN Product deep dive",
      description: "In-depth information around our products and API.",
      expandedContent: "Explore our comprehensive documentation, API references, and developer resources. Get detailed insights into our product architecture, integration guides, and best practices for maximizing your implementation.",
      features: ["API Documentation", "Integration Guides", "Code Examples", "Developer Support"],
      buttonText: "Helpdesk Center",
      icon: BookOpen,
      gradient: "from-purple-500 to-pink-500",
      bgColor: "bg-gradient-to-br from-purple-50 to-pink-50",
      morphColor: "#8B5CF6",
    },
    {
      title: "Content Creator Program",
      description: "Extend your reach and gain new audiences within minutes.",
      expandedContent: "Our creator program provides tools and resources to help you build engaging content, grow your audience, and monetize your creativity. Access exclusive features, get priority support, and connect with brands looking for quality content.",
      features: ["Content Tools", "Audience Growth", "Brand Partnerships", "Creator Support"],
      buttonText: "Learn more",
      icon: Users,
      gradient: "from-pink-500 to-red-500",
      bgColor: "bg-gradient-to-br from-pink-50 to-red-50",
      morphColor: "#EC4899",
    },
  ];

  const handleCardClick = (index: number) => {
    if (expandedCard === index) {
      setExpandedCard(null);
      setActiveCard(null);
    } else {
      setExpandedCard(index);
      setActiveCard(index);
    }
  };

  const handleButtonClick = (buttonText: string, cardIndex: number) => {
    const card = expertCards[cardIndex];
    const formType = buttonText.toLowerCase().includes('learn') ? 'learn-more' :
                    buttonText.toLowerCase().includes('help') ? 'helpdesk' :
                    buttonText.toLowerCase().includes('sign') ? 'publisher' :
                    'content-creator';
    
    // Navigate to form page with card context
    window.open(`/form/${formType}?card=${encodeURIComponent(card.title)}`, '_blank');
  };

  return (
    <section className="py-24 bg-gradient-to-b from-gray-50 via-white to-blue-50/30 relative overflow-hidden">
      {/* Background Decorative Elements */}
      <div className="absolute inset-0">
        <motion.div
          className="absolute top-20 left-10 w-32 h-32 bg-blue-200/20 rounded-full blur-xl"
          animate={{
            x: [0, 100, 0],
            y: [0, -50, 0],
            scale: [1, 1.2, 1],
          }}
          transition={{
            duration: 8,
            repeat: Infinity,
            ease: "easeInOut",
          }}
        />
        <motion.div
          className="absolute top-40 right-20 w-24 h-24 bg-purple-200/20 rounded-full blur-xl"
          animate={{
            x: [0, -80, 0],
            y: [0, 60, 0],
            scale: [1, 0.8, 1],
          }}
          transition={{
            duration: 6,
            repeat: Infinity,
            ease: "easeInOut",
            delay: 2,
          }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <motion.div
          ref={ref}
          className="text-center mb-16"
          initial={{ opacity: 0, y: 30 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.8 }}
        >
          <motion.div
            className="inline-block mb-6"
            variants={morphingShapeVariants}
            initial="initial"
            animate={isInView ? "animate" : "initial"}
          >
            <div className="w-16 h-1 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full" />
          </motion.div>
          
          <motion.h2 
            className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1, delay: 0.2 }}
          >
            Become
            <br />
            <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 bg-clip-text text-transparent">
              an Expert
            </span>
          </motion.h2>
        </motion.div>

        {/* Cards Grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 relative"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {expertCards.map((card, index) => {
            const IconComponent = card.icon;
            const isExpanded = expandedCard === index;
            const isDimmed = expandedCard !== null && expandedCard !== index;
            
            return (
              <motion.div
                key={index}
                variants={cardVariants}
                whileHover={!isExpanded ? {
                  y: -10,
                  scale: 1.02,
                  transition: { duration: 0.3 }
                } : {}}
                className={cn(
                  card.bgColor,
                  "p-8 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-500 relative overflow-hidden group cursor-pointer",
                  isDimmed && "pointer-events-none"
                )}
                animate={{
                  opacity: isDimmed ? 0.3 : 1,
                  scale: isDimmed ? 0.95 : 1,
                  filter: isDimmed ? "blur(2px)" : "blur(0px)",
                }}
                transition={{ duration: 0.5, ease: "easeInOut" }}
                onClick={() => handleCardClick(index)}
              >
                {/* Morphing Background Shape */}
                <motion.div
                  className="absolute -top-10 -right-10 w-24 h-24 opacity-10"
                  style={{ backgroundColor: card.morphColor }}
                  variants={floatingVariants}
                  animate="animate"
                  initial={{
                    borderRadius: "50%",
                  }}
                  whileHover={{
                    borderRadius: ["50%", "0%", "50%"],
                    scale: [1, 1.3, 1],
                    transition: { duration: 1 }
                  }}
                />

                {/* Icon with Morphing Animation */}
                <motion.div
                  className={`w-16 h-16 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mb-6 relative z-10`}
                  variants={morphingShapeVariants}
                  initial="initial"
                  animate={isInView ? "animate" : "initial"}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{
                    rotate: [0, -10, 10, 0],
                    scale: [1, 1.1, 1],
                    transition: { duration: 0.5 }
                  }}
                >
                  <IconComponent className="text-white" size={28} />
                </motion.div>

                {/* Content */}
                <motion.h3 
                  className="text-xl font-bold text-gray-900 mb-4"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.3, duration: 0.6 }}
                >
                  {card.title}
                </motion.h3>
                
                <motion.p 
                  className="text-gray-600 mb-6 leading-relaxed"
                  initial={{ opacity: 0, x: -20 }}
                  animate={isInView ? { opacity: 1, x: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.4, duration: 0.6 }}
                >
                  {card.description}
                </motion.p>

                {/* Button */}
                <motion.button
                  className="w-full py-3 px-6 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300 group-hover:shadow-md"
                  initial={{ opacity: 0, y: 20 }}
                  animate={isInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 + 0.5, duration: 0.6 }}
                  whileHover={{
                    scale: 1.02,
                    transition: { duration: 0.2 }
                  }}
                  whileTap={{
                    scale: 0.98,
                    transition: { duration: 0.1 }
                  }}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleButtonClick(card.buttonText, index);
                  }}
                >
                  <motion.span
                    className="inline-block"
                    whileHover={{
                      x: [0, 3, 0],
                      transition: { duration: 0.3 }
                    }}
                  >
                    {card.buttonText}
                  </motion.span>
                </motion.button>

                {/* Hover Glow Effect */}
                <motion.div
                  className={`absolute inset-0 bg-gradient-to-r ${card.gradient} opacity-0 group-hover:opacity-5 rounded-3xl transition-opacity duration-500`}
                />
              </motion.div>
            );
          })}
        </motion.div>

        {/* Zoom-in Modal */}
        <AnimatePresence>
          {expandedCard !== null && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Backdrop */}
              <motion.div
                className="absolute inset-0 bg-black/50 backdrop-blur-sm"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => handleCardClick(expandedCard)}
              />
              
              {/* Modal Card */}
              <motion.div
                ref={expandedRef}
                className={cn(
                  expertCards[expandedCard].bgColor,
                  "relative z-10 max-w-2xl w-full max-h-[80vh] overflow-y-auto p-8 rounded-3xl shadow-2xl"
                )}
                initial={{ 
                  scale: 0.8, 
                  opacity: 0,
                  y: 50
                }}
                animate={{ 
                  scale: 1, 
                  opacity: 1,
                  y: 0
                }}
                exit={{ 
                  scale: 0.8, 
                  opacity: 0,
                  y: 50
                }}
                transition={{ 
                  duration: 0.4, 
                  ease: "easeOut",
                  type: "spring",
                  stiffness: 300,
                  damping: 25
                }}
              >
                {(() => {
                  const card = expertCards[expandedCard];
                  const IconComponent = card.icon;
                  
                  return (
                    <>
                      {/* Close Button */}
                      <button
                        className="absolute top-6 right-6 w-10 h-10 bg-white/80 hover:bg-white rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all duration-300 z-20"
                        onClick={() => handleCardClick(expandedCard)}
                      >
                        <motion.div
                          whileHover={{ rotate: 90 }}
                          transition={{ duration: 0.2 }}
                        >
                          <Plus size={20} className="text-gray-600 rotate-45" />
                        </motion.div>
                      </button>

                      {/* Morphing Background Shape */}
                      <motion.div
                        className="absolute -top-10 -right-10 w-32 h-32 opacity-10"
                        style={{ backgroundColor: card.morphColor }}
                        variants={floatingVariants}
                        animate="animate"
                        initial={{
                          borderRadius: "50%",
                        }}
                      />

                      {/* Icon */}
                      <motion.div
                        className={`w-20 h-20 bg-gradient-to-r ${card.gradient} rounded-2xl flex items-center justify-center mb-6`}
                        initial={{ scale: 0, rotate: -180 }}
                        animate={{ scale: 1, rotate: 0 }}
                        transition={{ delay: 0.2, duration: 0.5 }}
                      >
                        <IconComponent className="text-white" size={32} />
                      </motion.div>

                      {/* Title */}
                      <motion.h3 
                        className="text-3xl font-bold text-gray-900 mb-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.3, duration: 0.5 }}
                      >
                        {card.title}
                      </motion.h3>
                      
                      {/* Description */}
                      <motion.p 
                        className="text-gray-600 mb-6 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.5 }}
                      >
                        {card.description}
                      </motion.p>

                      {/* Expanded Content */}
                      <motion.p 
                        className="text-gray-700 mb-6 leading-relaxed"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.5, duration: 0.5 }}
                      >
                        {card.expandedContent}
                      </motion.p>

                      {/* Features List */}
                      <motion.div 
                        className="mb-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.6, duration: 0.5 }}
                      >
                        <h4 className="font-semibold text-gray-900 mb-4 text-lg">Key Features:</h4>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                          {card.features.map((feature, featureIndex) => (
                            <motion.div
                              key={featureIndex}
                              className="flex items-center space-x-3 text-gray-600"
                              initial={{ opacity: 0, x: -10 }}
                              animate={{ opacity: 1, x: 0 }}
                              transition={{ delay: 0.7 + featureIndex * 0.1, duration: 0.3 }}
                            >
                              <div className={`w-3 h-3 rounded-full bg-gradient-to-r ${card.gradient}`} />
                              <span>{feature}</span>
                            </motion.div>
                          ))}
                        </div>
                      </motion.div>

                      {/* Action Buttons */}
                      <motion.div 
                        className="flex flex-col sm:flex-row gap-4"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.8, duration: 0.5 }}
                      >
                        <motion.button
                          className={`flex-1 py-4 px-8 bg-gradient-to-r ${card.gradient} text-white font-semibold rounded-xl hover:shadow-lg transition-all duration-300`}
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleButtonClick(card.buttonText, expandedCard);
                          }}
                        >
                          {card.buttonText}
                        </motion.button>
                        <motion.button
                          className="flex-1 py-4 px-8 bg-white text-gray-700 font-semibold rounded-xl hover:bg-gray-50 transition-all duration-300 border border-gray-200 hover:border-gray-300"
                          whileHover={{ scale: 1.02, y: -2 }}
                          whileTap={{ scale: 0.98 }}
                          onClick={(e) => {
                            e.stopPropagation();
                            handleButtonClick("Learn More", expandedCard);
                          }}
                        >
                          Learn More
                        </motion.button>
                      </motion.div>
                    </>
                  );
                })()}
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Bottom Decorative Elements */}
        <motion.div 
          className="flex justify-center mt-16"
          initial={{ opacity: 0, scale: 0 }}
          animate={isInView ? { opacity: 1, scale: 1 } : {}}
          transition={{ delay: 1, duration: 0.8 }}
        >
          <motion.div
            className="flex space-x-2"
            animate={{
              scale: [1, 1.05, 1],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            {[...Array(3)].map((_, i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-gradient-to-r from-blue-400 to-purple-400 rounded-full"
                animate={{
                  opacity: [0.3, 1, 0.3],
                  scale: [1, 1.2, 1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
};

export default BecomeExpert;
