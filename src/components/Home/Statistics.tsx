import React, { useState, useEffect, useRef } from "react";

const Statistics = () => {
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
      suffix: "",
    },
  ];

  const animateCounter = (finalValue, index, duration = 2000) => {
    const startTime = Date.now();
    const startValue = 0;
    const updateCounter = () => {
      const currentTime = Date.now();
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeOutCubic = 1 - Math.pow(1 - progress, 3);

      let currentValue;
      if (finalValue % 1 !== 0) {
        // Check if it's a float
        currentValue = startValue + (finalValue - startValue) * easeOutCubic;
        currentValue = Math.round(currentValue * 10) / 10; // Round to one decimal place
      } else {
        currentValue = Math.floor(
          startValue + (finalValue - startValue) * easeOutCubic
        );
      }

      setCounters((prev) => {
        const newCounters = [...prev];
        newCounters[index] = currentValue;
        return newCounters;
      });

      if (progress < 1) {
        requestAnimationFrame(updateCounter);
      } else {
        setCounters((prev) => {
          const newCounters = [...prev];
          newCounters[index] = finalValue; // Ensure final value is exact
          return newCounters;
        });
      }
    };
    requestAnimationFrame(updateCounter);
  };

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
  }, [isVisible]);

  const formatDisplayNumber = (counter, index) => {
    const stat = stats[index];
    switch (index) {
      case 0:
        return `${Math.floor(counter)}`;
      case 1:
        return `${Math.floor(counter)}${stat.suffix}`;
      case 2:
        return counter >= 24 ? "24/7" : `${Math.floor(counter)}/7`;
      case 3:
        return `${counter}`;
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
          @keyframes subtle-pulse {
            0%, 100% { opacity: 0.5; }
            50% { opacity: 0.7; }
          }
        `}
      </style>

      <div
        ref={sectionRef}
        className="relative bg-slate-950 text-white py-16 sm:py-24 overflow-hidden"
      >
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-[-200px] w-[500px] h-[500px] bg-purple-600/20 rounded-full blur-3xl animate-[subtle-pulse_8s_ease-in-out_infinite]"></div>
          <div className="absolute bottom-1/4 right-[-200px] w-[500px] h-[500px] bg-blue-600/20 rounded-full blur-3xl animate-[subtle-pulse_8s_ease-in-out_infinite_2s]"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12 md:mb-16">
            <div className="inline-flex items-center px-4 py-2 bg-slate-800 rounded-full text-sm font-medium text-purple-300 mb-6 border border-slate-700">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2.5"></span>
              Proven Results
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold leading-tight md:leading-snug">
              Numbers That
              <span className="block bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent pt-1">
                Speak Volumes
              </span>
            </h2>
            <p className="text-base sm:text-lg text-slate-400 max-w-3xl mx-auto mt-4 leading-relaxed">
              Our track record speaks for itself. See why thousands of customers
              trust us with their success.
            </p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
            {stats.map((stat, index) => (
              <div
                key={index}
                className={`p-6 md:p-8 rounded-2xl 
                           bg-slate-900/50 backdrop-blur-sm
                           border border-slate-800
                           shadow-lg shadow-black/20
                           transform transition-all duration-300 hover:scale-105 hover:border-slate-700
                           ${
                             isVisible
                               ? "translate-y-0 opacity-100 animate-fade-in-scale"
                               : "translate-y-12 opacity-0"
                           }`}
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                <div
                  className={`text-4xl md:text-5xl font-semibold bg-gradient-to-r ${stat.color} bg-clip-text text-transparent text-center mb-2`}
                >
                  {formatDisplayNumber(counters[index], index)}
                </div>
                <div className="text-slate-400 text-sm md:text-base font-medium text-center">
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
