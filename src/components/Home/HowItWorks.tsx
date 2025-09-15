import { useState, forwardRef } from "react";
import {
  Search,
  Calendar,
  Monitor,
  ChevronRight,
  MapPin,
  Clock,
  Zap,
} from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion"; // Import framer-motion

const HowItWorks = forwardRef<HTMLDivElement>((props, ref) => {
  const [activeStep, setActiveStep] = useState<number | null>(null);
  // The hoveredStep state is no longer needed with framer-motion
  // const [hoveredStep, setHoveredStep] = useState<number | null>(null);

  const steps = [
    {
      icon: Search,
      title: "Search",
      description: "Locate digital screens for your ads",
      detailedDescription:
        "Browse through thousands of premium digital advertising locations. Filter by demographics, foot traffic, and location type to find the perfect screens for your campaign.",
      features: [
        "Real-time availability",
        "Advanced filtering",
        "Location analytics",
      ],
      color: "from-blue-500 to-cyan-500",
    },
    {
      icon: Calendar,
      title: "Book",
      description: "Choose dates and make booking",
      detailedDescription:
        "Select your preferred time slots and duration. Our smart booking system ensures optimal pricing and availability for your advertising campaign.",
      features: [
        "Flexible scheduling",
        "Instant confirmation",
        "Competitive pricing",
      ],
      color: "from-purple-500 to-pink-500",
    },
    {
      icon: Monitor,
      title: "Display",
      description: "Your ad is shown on the screens",
      detailedDescription:
        "Watch your advertisement come to life on high-quality digital displays. Track performance with real-time analytics and engagement metrics.",
      features: [
        "HD quality display",
        "Real-time monitoring",
        "Performance analytics",
      ],
      color: "from-emerald-500 to-teal-500",
    },
  ];

  const stepIcons = [MapPin, Clock, Zap];

  // Animation variants for the container and cards
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3, // Creates the sequential pop-up effect
      },
    },
  };

  const cardVariants = {
    hidden: { y: 30, opacity: 0, scale: 0.9 },
    visible: {
      y: 0,
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 100,
        damping: 15,
      },
    },
  };

  return (
    <div
      ref={ref}
      className="py-24 bg-white dark:bg-slate-900"
      id="ads-manager"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent leading-tight">
            Ads Manager
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Get your ads on digital screens in three simple steps. Click on any
            step to learn more.
          </p>
        </div>

        <motion.div
          className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ amount: 0.2 }} // Animate each time it enters view
        >
          {steps.map((step, idx) => {
            const StepIcon = step.icon;
            const isActive = activeStep === idx;

            return (
              <motion.div
                key={idx}
                variants={cardVariants}
                whileHover={{ y: -8, scale: 1.05 }}
                animate={isActive ? { y: -16, scale: 1.1 } : { y: 0, scale: 1 }}
                transition={{ type: "spring", stiffness: 300, damping: 20 }}
                className="relative cursor-pointer"
                onClick={() => setActiveStep(activeStep === idx ? null : idx)}
              >
                {/* Connection line for desktop */}
                {idx < steps.length - 1 && (
                  <div className="hidden lg:block absolute top-1/2 -right-4 w-8 h-px bg-gradient-to-r from-gray-300 to-gray-400 dark:from-gray-600 dark:to-gray-500 z-10">
                    <ChevronRight className="absolute -top-2 -right-1 h-4 w-4 text-gray-400 dark:text-gray-500" />
                  </div>
                )}

                <div
                  className={`relative overflow-hidden rounded-2xl border-2 transition-all duration-500 ${
                    isActive
                      ? "border-transparent shadow-2xl"
                      : "border-gray-200 dark:border-slate-700 shadow-md hover:shadow-lg"
                  } bg-white dark:bg-slate-800`}
                >
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${
                      step.color
                    } opacity-0 transition-opacity duration-500 ${
                      isActive ? "opacity-10" : "hover:opacity-5"
                    }`}
                  />

                  <div className="relative p-8">
                    {/* Step number */}
                    <div className="absolute top-4 right-4">
                      <span
                        className={`inline-flex items-center justify-center w-8 h-8 rounded-full text-sm font-semibold transition-all duration-300 ${
                          isActive
                            ? "bg-gradient-to-br from-indigo-500 to-purple-600 text-white"
                            : "bg-gray-100 dark:bg-slate-700 text-gray-600 dark:text-gray-400"
                        }`}
                      >
                        {idx + 1}
                      </span>
                    </div>

                    {/* Icon with animation */}
                    <motion.div
                      className="mb-6"
                      animate={{ scale: isActive ? 1.1 : 1 }}
                      transition={{ type: "spring", stiffness: 200 }}
                    >
                      <div
                        className={`inline-flex p-4 rounded-2xl bg-gradient-to-br ${
                          step.color
                        } transition-all duration-300 ${
                          isActive ? "shadow-lg" : "shadow-md"
                        }`}
                      >
                        <StepIcon className="h-8 w-8 text-white" />
                      </div>
                    </motion.div>

                    <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
                      {step.title}
                    </h3>

                    <p className="text-gray-600 dark:text-gray-400 mb-4 leading-relaxed">
                      {step.description}
                    </p>

                    {/* Expandable content */}
                    <div
                      className={`transition-all duration-500 ease-in-out overflow-hidden ${
                        isActive ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                      }`}
                    >
                      <div className="pt-4 border-t border-gray-100 dark:border-slate-700">
                        <p className="text-gray-700 dark:text-gray-300 mb-4 text-sm leading-relaxed">
                          {step.detailedDescription}
                        </p>

                        <div className="space-y-2">
                          {step.features.map((feature, featureIdx) => {
                            const FeatureIcon = stepIcons[featureIdx];
                            return (
                              <div
                                key={featureIdx}
                                className="flex items-center text-sm text-gray-600 dark:text-gray-400"
                              >
                                <FeatureIcon className="h-4 w-4 mr-2 text-indigo-500" />
                                {feature}
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    </div>

                    {/* Click indicator */}
                    <div
                      className={`mt-4 text-xs text-center transition-all duration-300 ${
                        isActive
                          ? "text-indigo-600 dark:text-indigo-400"
                          : "text-gray-400 dark:text-gray-500"
                      }`}
                    >
                      {isActive ? "Click to collapse" : "Click to learn more"}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Progress indicator */}
        <div className="flex justify-center space-x-2">
          {steps.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setActiveStep(activeStep === idx ? null : idx)}
              className={`w-3 h-3 rounded-full transition-all duration-300 ${
                activeStep === idx
                  ? "bg-indigo-500 scale-125"
                  : "bg-gray-300 dark:bg-gray-600 hover:bg-gray-400 dark:hover:bg-gray-500"
              }`}
            />
          ))}
        </div>

        {/* Call to action */}
        <div className="text-center mt-16">
          <Link to="/auth">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors duration-300"
            >
              Get Started Today
              <ChevronRight className="pl-2 inline h-5 w-5" />
            </motion.button>
          </Link>
        </div>
      </div>
    </div>
  );
});

export default HowItWorks;
