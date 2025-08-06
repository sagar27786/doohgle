import React from "react";

const CompanyLogos = () => {
  const companies = [
    {
      name: "AMD",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e458c70e8d765dc3ec_Client-AMD.png",
    },
    {
      name: "Bosch",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba707a7773be8149f6a1b_Client-Bosch.png",
    },
    {
      name: "Uber",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba707b8baa404a8907797_Client-Uber.png",
    },
    {
      name: "eBay",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba7076e3994a2509f8bd6_Client-ebay.png",
    },
    {
      name: "Lufthansa",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654ba7076a090db4dcc19910_Client-lufthansa.png",
    },
    {
      name: "Porsche",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4517c29fc66589736_Client-Porsche.png",
    },
    {
      name: "Personio",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4c81aee2b62b83ea6_Client-Personio.png",
    },
    {
      name: "Vodafone",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4b3664fdd17b98ef3_Client-Vodafone.png",
    },
    {
      name: "Sixt",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4f5b551303452e5e4_Client-Sixt.png",
    },
    {
      name: "RedBull",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4d9d0bc4af3378617_Client-RedBull.png",
    },
    {
      name: "Tommy Hilfiger",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4d8236631fc81cd7e_Client-Tommy-Hilfiger.png",
    },
    {
      name: "Babbel",
      logo: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a11e4f74e6a1c57ff7388_Client-Babbel.png",
    },
  ];

  const tripleCompanies = [...companies, ...companies, ...companies];

  return (
    <>
      <style>
        {`
          @keyframes seamlessMarquee {
            0% { transform: translateX(0); }
            100% { transform: translateX(calc(-100% / 3)); }
          }
          .animate-seamless-marquee {
            animation: seamlessMarquee 25s linear infinite;
          }
          @keyframes fadeInUp {
            from { opacity: 0; transform: translateY(30px); }
            to { opacity: 1; transform: translateY(0); }
          }
          .animate-fade-in-up {
            animation: fadeInUp 0.8s ease-out forwards;
          }
          .animate-fade-in-up-delayed {
            animation: fadeInUp 0.8s ease-out 0.2s forwards;
            opacity: 0;
          }
          @keyframes pulse {
            0%, 100% { opacity: 0.6; }
            50% { opacity: 0.8; }
          }
          .animate-pulse-subtle {
            animation: pulse 3s ease-in-out infinite;
          }
        `}
      </style>

      <div className="relative bg-white dark:bg-slate-900 py-20 sm:py-28 overflow-hidden">
        <div className="absolute top-1/2 -left-[400px] -translate-y-1/2 animate-pulse-subtle">
          <div className="w-[600px] h-[600px] rounded-full bg-gradient-to-r from-purple-500/10 to-blue-500/10 dark:from-purple-500/20 dark:to-blue-500/20 blur-3xl"></div>
        </div>
        <div
          className="absolute top-1/4 -right-[300px] animate-pulse-subtle"
          style={{ animationDelay: "1.5s" }}
        >
          <div className="w-[400px] h-[400px] rounded-full bg-gradient-to-l from-pink-500/8 to-purple-500/8 dark:from-pink-500/15 dark:to-purple-500/15 blur-2xl"></div>
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center animate-fade-in-up">
            <div className="inline-flex items-center px-4 py-2 bg-purple-100 dark:bg-purple-900/30 rounded-full text-sm font-medium text-purple-700 dark:text-purple-300 mb-6">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-2 animate-pulse"></span>
              Trusted Worldwide
            </div>
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-bold bg-gradient-to-r from-slate-900 via-purple-800 to-slate-900 dark:from-white dark:via-purple-200 dark:to-white bg-clip-text text-transparent leading-tight">
              Industry Leaders
              <span className="block text-2xl md:text-3xl lg:text-4xl mt-2 font-normal text-slate-600 dark:text-slate-400">
                Choose Our Platform
              </span>
            </h2>
          </div>

          <div className="text-center animate-fade-in-up-delayed">
            <p className="mt-6 text-lg md:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
              Join thousands of innovative companies that trust our platform to
              reach millions of customers worldwide.
            </p>
          </div>

          <div className="relative mt-20">
            <div className="overflow-hidden">
              <div className="flex flex-nowrap items-center gap-x-16 md:gap-x-20 lg:gap-x-24 animate-seamless-marquee will-change-transform">
                {tripleCompanies.map((company, index) => (
                  <div
                    key={`${company.name}-${index}`}
                    className="flex-shrink-0 group"
                  >
                    <img
                      src={company.logo}
                      alt={`${company.name} logo`}
                      className="h-12 md:h-16 lg:h-20 w-auto object-contain transition-all duration-500 ease-out group-hover:scale-110 filter grayscale opacity-60 group-hover:filter-none group-hover:opacity-100 dark:invert dark:brightness-100 dark:opacity-70 dark:group-hover:opacity-100"
                      onError={(e) => {
                        e.currentTarget.src = `https://placehold.co/160x64/e2e8f0/64748b?text=${encodeURIComponent(
                          company.name
                        )}`;
                      }}
                      loading="lazy"
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-white to-transparent dark:from-slate-900 pointer-events-none"></div>
            <div className="absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-white to-transparent dark:from-slate-900 pointer-events-none"></div>
          </div>

          <div className="text-center mt-16 animate-fade-in-up-delayed">
            <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
              And hundreds more companies worldwide
            </p>
          </div>
        </div>
      </div>
    </>
  );
};

export default CompanyLogos;
