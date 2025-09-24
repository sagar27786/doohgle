import { Link } from "react-router-dom";
import HeroVideo from "./HeroVideo";

const MainHero = () => {
  return (
    <>
      <main className="relative flex items-center justify-center min-h-screen overflow-hidden p-2 sm:p-4 bg-black">
        {/* Background Video */}
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src="/background.mp4" type="video/mp4" />
        </video>

        {/* Overlay */}
        <div className="absolute inset-0 bg-black bg-opacity-70 z-0 dark:bg-opacity-70 backdrop-blur-none" />

        {/* Main Content */}
        <div className="relative z-10 text-center max-w-6xl mx-auto text-white dark:text-slate-200 px-2 sm:px-4">
          {/* Main Headlines - Responsive font sizing */}
          <h1 className="font-bebas font-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] tracking-tight mb-3 sm:mb-4 lg:mb-5 whitespace-nowrap">
            Connect{" "}
            <span className="purple-gray-gradient">Digital Screens</span>
          </h1>

          <h1 className="font-bebas font-bold text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-[5rem] tracking-tight mb-4 sm:mb-5 lg:mb-5 whitespace-nowrap">
            With <span className="purple-gray-gradient"> Perfect Ads</span>
          </h1>

          <div className="backdrop-blur-sm bg-black/10 rounded-xl p-2">
            {/* Description paragraphs - Responsive text sizing */}
            <p className="max-w-4xl mx-auto text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-[1.4rem] leading-relaxed mb-1 sm:mb-2 text-gray-300 px-2">
              <span className="purple-gray-gradient">
                The largest marketplace{" "}
              </span>
              for digital out-of-home advertising.
            </p>

            <p className="max-w-3xl mx-auto text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-[1.4rem] leading-relaxed mb-1 sm:mb-2 text-gray-300 px-2">
              List your screens,{" "}
              <span className="purple-gray-gradient">elevate your income.</span>
            </p>

            <p className="max-w-3xl mx-auto text-base xs:text-lg sm:text-xl md:text-xl lg:text-2xl xl:text-[1.4rem] leading-relaxed mb-3 sm:mb-4 text-gray-300 px-2">
              Book{" "}
              <span className="purple-gray-gradient">Premium location</span> for
              your ad and maximize your reach{" "}
              <span className="inline-flex whitespace-nowrap">
                with&nbsp;
                <span className="purple-gray-gradient">
                  AI&nbsp;driven&nbsp;insights.
                </span>
              </span>
            </p>
          </div>
          {/* Buttons - Responsive sizing and stacking */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 px-4">
            <Link
              to="/auth"
              className="group relative h-12 sm:h-14 w-full max-w-xs sm:w-64 text-base sm:text-lg font-semibold text-white bg-slate-800 dark:text-white dark:bg-slate-800 rounded-xl shadow-md transition-all duration-500 flex items-center justify-center hover:bg- hover:text-gray-100 dark:hover:text-white hover:shadow-2xl hover:shadow-blue-500/25 transform hover:-rotate-1 hover:scale-105"
            >
              <span className="text-center px-2">
                List your Screen for Free
              </span>
            </Link>

            <Link
              to="/auth"
              className="group relative h-12 sm:h-14 w-full max-w-xs sm:w-64 text-base sm:text-lg font-semibold text-slate-800 bg-slate-200 rounded-xl shadow-md transition-all duration-500 flex items-center justify-center hover:bg-gradient-to-r hover:from-indigo-500 hover:to-purple-600 hover:text-white hover:shadow-2xl hover:shadow-purple-500/25 transform hover:-rotate-1 hover:scale-105"
            >
              <span className="text-center px-2">Book Screen</span>
            </Link>
          </div>
        </div>
      </main>

      <div>
        <HeroVideo />
      </div>
    </>
  );
};

export default MainHero;
