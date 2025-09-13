import React, { useState, useEffect, useRef } from "react";

const Statistics = () => {
  // State and data remain the same
  const [isVisible, setIsVisible] = useState(false);
  const [counters, setCounters] = useState([0, 0, 0, 0]);
  const sectionRef = useRef(null);

  const stats = [
    {
      number: 18000,
      label: "Satisfied Customers",
      color: "from-blue-500 to-cyan-400",
      suffix: "",
    },
    {
      number: 99,
      label: "Success Rate",
      color: "from-emerald-500 to-green-400",
      suffix: "%",
    },
    {
      number: 24,
      label: "Support Available",
      color: "from-purple-500 to-indigo-400",
      suffix: "/7",
    },
    {
      number: 4.9,
      label: "Average Rating",
      color: "from-amber-500 to-yellow-400",
      suffix: "★",
    },
  ];

  // All hooks and helper functions remain the same
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !isVisible) {
          setIsVisible(true);
          stats.forEach((stat, index) => {
            setTimeout(() => {
              animateCounter(stat.number, index, 2500);
            }, index * 200);
          });
        }
      },
      { threshold: 0.2 }
    );

    const currentRef = sectionRef.current;
    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [isVisible, stats]);

  // TypeScript interface can be removed if you are in a .jsx file
  interface AnimateCounterFn {
    (finalValue: number, index: number, duration?: number): void;
  }

  const animateCounter: AnimateCounterFn = (
    finalValue,
    index,
    duration = 2000
  ) => {
    // ... animation logic remains the same
    const startTime = Date.now();
    const startValue = 0;
    const updateCounter = (): void => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);
      const currentValue = Math.floor(
        startValue + (finalValue - startValue) * easeOutCubic
      );
      setCounters((prev: number[]) => {
        const newCounters = [...prev];
        newCounters[index] = currentValue;
        return newCounters;
      });
      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      }
    };
    requestAnimationFrame(updateCounter);
  };

  // TypeScript interface can be removed if you are in a .jsx file
  interface Stat {
    number: number;
    label: string;
    color: string;
    suffix: string;
  }

  const formatDisplayNumber = (counter: number, index: number): string => {
    // ... formatting logic remains the same
    const stat: Stat = stats[index];
    switch (index) {
      case 0:
        return `>${counter.toLocaleString()}`;
      case 1:
        return `${counter}${stat.suffix}`;
      case 2:
        return counter === 24 ? "24/7" : `${counter}/7`;
      case 3:
        return `${counter}${stat.suffix}`;
      default:
        return counter.toString();
    }
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeInScale {
            from { opacity: 0; transform: translateY(40px) scale(0.95); }
            to { opacity: 1; transform: translateY(0) scale(1); }
          }
          .animate-fade-in-scale {
            animation: fadeInScale 0.8s ease-out forwards;
          }
        `}
      </style>

      {/* Main container with unified static background */}
      <div
        ref={sectionRef}
        className="relative bg-white dark:bg-slate-900 py-10 sm:py-14 overflow-hidden"
      >
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header Section remains the same */}
          <div className="text-center mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-blue-100 dark:bg-blue-900/30 rounded-full text-sm font-medium text-blue-700 dark:text-blue-300 mb-6 border border-blue-200 dark:border-blue-800">
              <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full mr-2"></span>
              Proven Results
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 dark:text-white leading-tight md:leading-[1.2] lg:leading-[1.25] mb-4">
              Numbers That
              <span className="block text-purple-700 bg-clip-text dark:text-purple-300 pt-1">
                Speak Volumes
              </span>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed">
              Our track record speaks for itself. See why thousands of customers
              trust us with their success.
            </p>
          </div>

          {/* Statistics Grid remains the same */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-8 rounded-2xl 
                            bg-white dark:bg-slate-800/50 
                            border border-slate-200 dark:border-slate-700/80
                            shadow-lg dark:shadow-2xl
                            transform transition-all duration-700 
                            ${
                              isVisible
                                ? "translate-y-0 opacity-100 animate-fade-in-scale"
                                : "translate-y-12 opacity-0"
                            }`}
                style={{
                  animationDelay: `${index * 0.15}s`,
                }}
              >
                <div
                  className={`text-3xl md:text-4xl lg:text-5xl font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent text-center mb-3`}
                >
                  {formatDisplayNumber(counters[index], index)}
                </div>
                <div className="text-slate-500 dark:text-slate-400 text-sm md:text-base font-medium text-center leading-relaxed">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

export default Statistics;
