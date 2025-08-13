import {
  ArrowUp,
  ArrowDown,
  CornerDownLeft,
  Command,
  MoveRight,
} from "lucide-react";
import React, { useEffect, useState, useRef } from "react";
import { Link } from "react-router-dom";
import HeroVideo from "./HeroVideo";

const FloatingKey = ({
  icon: Icon,
  className,
  ariaLabel,
  offsetY = 0,
}: {
  icon: React.ElementType;
  className: string;
  ariaLabel: string;
  offsetY?: number;
}) => (
  // Floating Key Component
  <div
    aria-hidden="true"
    className={`
    absolute hidden lg:flex items-center justify-center w-16 h-16 rounded-2xl 
    bg-[#EBF0F5] text-slate-500 shadow-[7px_7px_15px_#bec4c9,_-7px_-7px_15px_#ffffff]
    dark:bg-slate-800 dark:text-slate-400 dark:shadow-[7px_7px_15px_#1c1e22,_-7px_-7px_15px_#3a3e46]
    transition-transform duration-500
    hover:shadow-[0_0_20px_rgba(59,130,246,0.8)] dark:hover:shadow-[0_0_20px_rgba(168,85,247,0.8)]
    ${className}
    group
  `}
    style={{ transform: `translateY(${offsetY}px)` }}
  >
    <Icon
      className="w-8 h-8 transition-all duration-300
      group-hover:text-blue-500 group-hover:animate-glowPulse
      dark:group-hover:text-purple-400 dark:group-hover:animate-glowPulseDark"
    />
  </div>
);

const MainHero = () => {
  const [scrollY, setScrollY] = useState(0);
  const [searchExpanded, setSearchExpanded] = useState(false);
  const [visible, setVisible] = useState(true);
  const nextSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleScroll = () => {
      const y = window.scrollY;
      setScrollY(y);
      setSearchExpanded(y > 20);

      // Check if we've reached the next section
      if (nextSectionRef.current) {
        const nextTop = nextSectionRef.current.offsetTop;
        setVisible(y + 200 < nextTop); // hides ~200px before section
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  const keyOffset = scrollY * 0.3;

  return (
    <>
      <main
        className="relative flex items-center justify-center min-h-screen overflow-hidden 
  bg-gradient-to-b from-gray-200 via-gray-300 to-blue-50
  dark:bg-gradient-to-b dark:from-slate-950 dark:to-slate-900 
  p-4 transition-colors duration-300"
      >
        <FloatingKey
          icon={ArrowUp}
          className="top-[25%] left-[10%]"
          ariaLabel="Up arrow key"
          offsetY={keyOffset}
        />
        <FloatingKey
          icon={CornerDownLeft}
          className="top-[30%] right-[12%]"
          ariaLabel="Enter key"
          offsetY={keyOffset * 1.2}
        />
        <FloatingKey
          icon={Command}
          className="bottom-[25%] right-[20%]"
          ariaLabel="Command key"
          offsetY={keyOffset * 0.8}
        />
        <div onClick={handleScrollDown}>
          <FloatingKey
            icon={ArrowDown}
            className="bottom-[15%] left-[20%]"
            ariaLabel="Down arrow key"
            offsetY={keyOffset}
          />
        </div>

        {/* Main content */}
        <div className="relative z-10 text-center max-w-4xl mx-auto">
          <h1
            className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tighter mb-5
    bg-gradient-to-r from-blue-500 via-gray-400 to-blue-700
    bg-clip-text text-transparent
    dark:from-purple-500 dark:to-pink-500"
          >
            Digital Out of Home Advertising in India
          </h1>

          <p className="max-w-3xl mx-auto text-lg md:text-xl text-slate-600 dark:text-slate-400 leading-relaxed mb-10">
            Advertise anywhere in India - Find your perfect screen
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/auth"
              className="group relative inline-flex items-center justify-center h-14 w-full sm:w-auto px-8 text-lg font-semibold text-white bg-slate-800 dark:text-slate-900 dark:bg-slate-100 rounded-xl shadow-md hover:bg-slate-900 dark:hover:bg-white transition-all duration-300 transform hover:-translate-y-1"
            >
              <span>Start your Campaign</span>
              <MoveRight className="w-5 h-5 ml-2 transform transition-transform duration-300 group-hover:translate-x-1" />
            </Link>

            <Link
              to="/auth"
              className="h-14 w-full sm:w-auto px-8 text-lg font-semibold text-slate-800 bg-slate-200 dark:text-slate-200 dark:bg-slate-700 rounded-xl shadow-md hover:bg-slate-300 dark:hover:bg-slate-600 transition-all duration-300 flex items-center justify-center"
            >
              Get our Digital Signage
            </Link>
          </div>

          {/* AI Assistant Search Box */}
          <div
            className={`flex items-center justify-center transition-opacity duration-500 ${
              visible ? "opacity-100" : "opacity-0 pointer-events-none"
            }`}
            style={{
              position: "fixed",
              top: `${150 + scrollY * 0.2}px`,
              left: "50%",
              transform: "translateX(-50%)",
              zIndex: 50,
            }}
          >
            <div
              className={`flex items-center justify-between px-6 py-4 shadow-lg transition-all duration-500 ease-out
              ${searchExpanded ? "w-[600px] h-20" : "w-[300px] h-16"} 
              bg-white dark:bg-slate-800 rounded-xl border border-slate-200 dark:border-slate-700
              hover:shadow-xl cursor-text`}
            >
              <div className="flex items-center">
                <span className="mr-4 text-slate-400 dark:text-slate-500">
                  ✨
                </span>
                <span className="text-slate-600 dark:text-slate-300 text-base md:text-lg">
                  {searchExpanded ? "Keep Scrolling" : "Sign Up. It's free. :)"}
                </span>
              </div>

              {searchExpanded && (
                <button className="ml-4 p-2 rounded-lg bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 transition">
                  💬
                </button>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Next section for disappearing trigger */}
      <div ref={nextSectionRef}>
        <HeroVideo />
      </div>
    </>
  );
};

export default MainHero;
