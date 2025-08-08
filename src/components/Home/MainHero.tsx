import { ChevronDown } from "lucide-react";

const MainHero = () => {
  const handleScrollDown = () => {
    window.scrollTo({
      top: window.innerHeight,
      behavior: "smooth",
    });
  };

  return (
    <>
      <style>
        {`
          @keyframes fadeIn {
            from { opacity: 0; transform: translateY(20px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in {
            animation: fadeIn 0.8s ease-out forwards;
          }
          @keyframes bounce-down {
            0%, 20%, 50%, 80%, 100% {
              transform: translateY(0);
            }
            40% {
              transform: translateY(-10px);
            }
            60% {
              transform: translateY(-5px);
            }
          }
          .animate-bounce-down {
            animation: bounce-down 2s ease-in-out infinite;
          }
        `}
      </style>

      <div className="relative overflow-hidden bg-slate-50 dark:bg-slate-950 h-screen flex flex-col justify-center">
        <div className="absolute top-0 left-0 -translate-x-1/2 -translate-y-1/2">
          <div className="w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] rounded-full bg-purple-500/5 dark:bg-purple-500/10 blur-3xl"></div>
        </div>
        <div className="absolute bottom-0 right-0 translate-x-1/2 translate-y-1/2">
          <div className="w-[400px] h-[400px] lg:w-[600px] lg:h-[600px] rounded-full bg-indigo-500/5 dark:bg-indigo-500/10 blur-3xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center animate-fade-in">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white mb-6">
            <span className="block">Digital Out of Home Advertising</span>
          </h1>

          <p className="text-lg md:text-xl text-slate-600 dark:text-slate-400 max-w-3xl mx-auto leading-relaxed mb-8">
            Combine the power of Digital Out of Home with the precision of
            programmatic.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center ">
            <button className="group relative inline-flex items-center justify-center px-8 py-3 rounded-lg text-lg font-semibold text-white bg-indigo-600 hover:bg-indigo-700 transition-all duration-300 shadow-lg hover:shadow-indigo-500/40 transform hover:-translate-y-1">
              <span className="absolute inset-0 bg-gradient-to-t from-indigo-700 to-indigo-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg"></span>
              <span className="relative">Start your Campaign</span>
            </button>
            <button className="px-8 py-3 rounded-lg text-lg font-semibold text-slate-700 dark:text-slate-300 bg-white/60 dark:bg-slate-800/60 border border-slate-300 dark:border-slate-700 hover:border-slate-400 dark:hover:border-slate-500 hover:bg-white dark:hover:bg-slate-800 transition-all duration-300 shadow-sm transform hover:-translate-y-1">
              Get our Digital Signage
            </button>
          </div>
        </div>

        {/* Scroll Down Button */}
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2">
          <button
            onClick={handleScrollDown}
            className="p-2 rounded-full text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-white hover:bg-slate-200/50 dark:hover:bg-slate-800/50 transition-all duration-300 animate-bounce-down"
            aria-label="Scroll to next section"
          >
            <ChevronDown className="h-8 w-8" />
          </button>
        </div>
      </div>
    </>
  );
};

export default MainHero;
