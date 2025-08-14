import React from 'react';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

const Page3DStandUp: React.FC = () => {
  const navigate = useNavigate();
  // Animation variants for floating squares
  const squareVariants = {
    animate: {
      y: [0, -20, 0],
      x: [0, 10, -10, 0],
      rotate: [0, 180, 360],
      scale: [1, 1.1, 1],
      opacity: [0.7, 1, 0.7],
    },
  };

  // Generate random positions for squares
  const squares = Array.from({ length: 12 }, (_, i) => ({
    id: i,
    size: Math.random() * 40 + 20, // 20-60px
    initialX: Math.random() * 100, // 0-100%
    initialY: Math.random() * 100, // 0-100%
    duration: Math.random() * 3 + 2, // 2-5s
    delay: Math.random() * 2,
  }));

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-blue-50 to-indigo-100 relative overflow-hidden flex items-center justify-center">
      {/* Floating Squares Background */}
      <div className="absolute inset-0">
        {squares.map((square) => (
          <motion.div
            key={square.id}
            className="absolute rounded-lg bg-gradient-to-br from-purple-400/20 to-blue-500/20 backdrop-blur-sm border border-white/20 shadow-lg"
            style={{
              width: square.size,
              height: square.size,
              left: `${square.initialX}%`,
              top: `${square.initialY}%`,
            }}
            variants={squareVariants}
            animate="animate"
            transition={{
              duration: square.duration,
              repeat: Infinity,
              repeatType: "reverse",
              delay: square.delay,
              ease: "easeInOut",
            }}
          />
        ))}
      </div>

      {/* Main Content */}
      <div className="relative z-10 text-center px-8 max-w-4xl mx-auto">
        {/* Animated Title */}
        <motion.div
          initial={{ opacity: 0, y: -50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-8"
        >
          <h1 className="text-6xl md:text-8xl font-bold bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 bg-clip-text text-transparent mb-4">
            Add Screen
          </h1>
          <h2 className="text-4xl md:text-6xl font-light bg-gradient-to-r from-gray-700 to-gray-900 bg-clip-text text-transparent">
            Manager
          </h2>
        </motion.div>

        {/* Animated Description */}
        <motion.p
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
          className="text-xl md:text-2xl text-gray-600 mb-12 leading-relaxed"
        >
          Manage your digital displays with ease and creativity
        </motion.p>

        {/* Floating Central Square with Plus Icon */}
        <motion.div
          className="relative mx-auto mb-12"
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1, delay: 0.6, type: "spring", stiffness: 200 }}
        >
          <motion.div
            className="w-32 h-32 md:w-40 md:h-40 bg-gradient-to-br from-purple-500 to-blue-600 rounded-2xl shadow-2xl flex items-center justify-center mx-auto border-4 border-white/20 backdrop-blur-sm"
            whileHover={{ scale: 1.1, rotate: 5 }}
            whileTap={{ scale: 0.95 }}
            animate={{
              y: [0, -10, 0],
            }}
            transition={{
              y: {
                duration: 3,
                repeat: Infinity,
                ease: "easeInOut",
              },
            }}
          >
            <svg
              className="w-16 h-16 md:w-20 md:h-20 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 4v16m8-8H4"
              />
            </svg>
          </motion.div>
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.9, ease: "easeOut" }}
          className="flex flex-col sm:flex-row gap-4 justify-center items-center"
        >
          <motion.button
            onClick={() => navigate('/products/ads-manager/dashboard')}
            whileHover={{ scale: 1.05, boxShadow: "0 10px 30px rgba(147, 51, 234, 0.3)" }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-white/20"
          >
            Get Started
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-8 py-4 bg-white/80 backdrop-blur-sm text-gray-700 font-semibold rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200"
          >
            Learn More
          </motion.button>
        </motion.div>
      </div>

      {/* Additional Decorative Elements */}
      <motion.div
        className="absolute top-10 left-10 w-4 h-4 bg-purple-400 rounded-full"
        animate={{
          scale: [1, 1.5, 1],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      <motion.div
        className="absolute bottom-10 right-10 w-6 h-6 bg-blue-400 rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.4, 0.8, 0.4],
        }}
        transition={{
          duration: 3,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
      />
    </div>
  );
};

export default Page3DStandUp;
