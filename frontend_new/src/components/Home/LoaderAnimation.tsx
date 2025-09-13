import React, { useState, useEffect } from "react";
import { Monitor, Tv, Building2, MapPin, Zap, Target } from "lucide-react";

// Since we don't have Framer Motion, we'll create smooth CSS-based animations
// that replicate the feel of Framer Motion

interface LoaderAnimationProps {
  onComplete?: () => void;
}

const LoaderAnimation: React.FC<LoaderAnimationProps> = ({
  onComplete = () => {},
}) => {
  const [currentIcon, setCurrentIcon] = useState(0);
  const [isVisible, setIsVisible] = useState(true);
  const [animationPhase, setAnimationPhase] = useState("entering");
  const [showBrand, setShowBrand] = useState(false);
  const [iconKey, setIconKey] = useState(0); // Force re-render for smooth transitions

  const marketingIcons = [
    {
      Icon: Monitor,
      label: "Digital Displays",
      color: "from-blue-500 to-cyan-500",
    },
    { Icon: Tv, label: "LED Screens", color: "from-purple-500 to-pink-500" },
    {
      Icon: Building2,
      label: "Prime Locations",
      color: "from-emerald-500 to-teal-500",
    },
    {
      Icon: Target,
      label: "Targeted Reach",
      color: "from-orange-500 to-red-500",
    },
  ];

  useEffect(() => {
    const iconInterval = setInterval(() => {
      setCurrentIcon((prev) => {
        if (prev < marketingIcons.length - 1) {
          setIconKey((k) => k + 1); // Trigger re-render for smooth transition
          return prev + 1;
        } else {
          clearInterval(iconInterval);
          // Show brand name after icons
          setTimeout(() => {
            setShowBrand(true);
            // Start exit animation after showing brand
            setTimeout(() => {
              setAnimationPhase("exiting");
              setTimeout(() => {
                setIsVisible(false);
                onComplete();
              }, 1000);
            }, 2000);
          }, 600);
          return prev;
        }
      });
    }, 800);

    return () => clearInterval(iconInterval);
  }, [onComplete]);

  if (!isVisible) return null;

  const CurrentIconComponent = marketingIcons[currentIcon]?.Icon;
  const currentGradient = marketingIcons[currentIcon]?.color;

  return (
    <div
      className={`fixed inset-0 z-50 bg-black flex items-center justify-center transition-all duration-1000 ease-out ${
        animationPhase === "exiting"
          ? "opacity-0 scale-110"
          : "opacity-100 scale-100"
      }`}
    >
      <div className="text-center relative">
        {!showBrand ? (
          <>
            {/* Animated Background Glow */}
            <div className="absolute inset-0 flex items-center justify-center">
              <div
                className={`w-48 h-48 bg-gradient-to-r ${currentGradient} rounded-full opacity-20 blur-3xl animate-pulse transition-all duration-800`}
                key={`glow-${iconKey}`}
              />
            </div>

            {/* Main Icon Container */}
            <div className="relative mb-12">
              <div className="relative">
                {/* Icon Background Circle */}
                <div
                  className={`w-32 h-32 mx-auto bg-gradient-to-br ${currentGradient} rounded-full shadow-2xl transition-all duration-800 ease-out transform hover:scale-105`}
                  key={`bg-${iconKey}`}
                  style={{
                    boxShadow: `0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 60px rgba(59, 130, 246, 0.3)`,
                  }}
                >
                  <div className="w-full h-full flex items-center justify-center">
                    {CurrentIconComponent && (
                      <CurrentIconComponent
                        size={48}
                        className="text-white transition-all duration-800 ease-out"
                        key={`icon-${iconKey}`}
                        style={{
                          animation: "iconFadeIn 0.8s ease-out",
                        }}
                      />
                    )}
                  </div>
                </div>

                {/* Animated Ring */}
                <div
                  className="absolute inset-0 w-32 h-32 mx-auto border-2 border-white/20 rounded-full"
                  style={{
                    animation: "ringPulse 2s ease-in-out infinite",
                  }}
                />
              </div>
            </div>

            {/* Icon Label */}
            <div className="mb-8">
              <h2
                className="text-3xl md:text-4xl font-light text-white tracking-wide transition-all duration-800 ease-out"
                key={`label-${iconKey}`}
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  animation: "textFadeIn 0.8s ease-out 0.2s both",
                }}
              >
                {marketingIcons[currentIcon]?.label}
              </h2>
            </div>
          </>
        ) : (
          /* Brand Reveal */
          <div className="text-center px-8">
            <div className="relative mb-12 py-8">
              {/* Background Glow for Brand */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-96 h-40 bg-gradient-to-r from-blue-500/20 via-purple-500/20 to-cyan-500/20 rounded-full blur-3xl" />
              </div>

              <h1
                className="relative text-6xl md:text-8xl font-thin text-white tracking-tight transition-all duration-1000 ease-out pb-4"
                style={{
                  fontFamily:
                    '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                  background:
                    "linear-gradient(135deg, #ffffff 0%, #a1a1aa 50%, #ffffff 100%)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                  backgroundClip: "text",
                  animation: "brandFadeIn 1s ease-out both",
                  lineHeight: "1.1",
                }}
              >
                Doohgle Media
              </h1>
            </div>

            <p
              className="text-white/70 text-xl md:text-2xl font-light tracking-wide"
              style={{
                fontFamily:
                  '-apple-system, BlinkMacSystemFont, "SF Pro Display", system-ui, sans-serif',
                animation: "textFadeIn 1s ease-out 0.3s both",
              }}
            >
              Digital Out-of-Home Marketing
            </p>
          </div>
        )}
      </div>

      <style>{`
        @keyframes iconFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.5) rotate(-10deg);
          }
          100% {
            opacity: 1;
            transform: scale(1) rotate(0deg);
          }
        }

        @keyframes textFadeIn {
          0% {
            opacity: 0;
            transform: translateY(20px);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }

        @keyframes brandFadeIn {
          0% {
            opacity: 0;
            transform: scale(0.8) translateY(30px);
            filter: blur(10px);
          }
          100% {
            opacity: 1;
            transform: scale(1) translateY(0);
            filter: blur(0px);
          }
        }

        @keyframes ringPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.5;
          }
          50% {
            transform: scale(1.1);
            opacity: 0.2;
          }
        }
      `}</style>
    </div>
  );
};

export default LoaderAnimation;
