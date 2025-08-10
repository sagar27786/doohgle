import React from "react";
import { Link } from "react-router-dom";

const ContentCreator = () => {
  const creatorImages = [
    {
      id: 1,
      name: "Vanlife",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aabb7631dc3b9ae10be_Vanlife.png",
    },
    {
      id: 2,
      name: "Nathaline Aron",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaa2db46f3bba5916d6_Nathaline%20Aron%20Adventure%20%26%20Luxury%20Travel%20Voyagefox.png",
    },
    {
      id: 3,
      name: "Fravely",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaa8a8d201d8955e51b_Fravely.png",
    },
    {
      id: 4,
      name: "Bewerbungsqueen",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaaeb884e2adfbafb83_Bewerbungsqueen.png",
    },
    {
      id: 5,
      name: "Sarah Emmerich",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/660575a397d8cda071e2a43b_Sarah%20Emmerich.png",
    },
    {
      id: 6,
      name: "Toan Nguyen",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaaf5a50f0f9bb4982b_Toan%20Nguyen.png",
    },
  ];

  return (
    <div className="relative bg-white dark:bg-slate-900 py-24 overflow-hidden">
      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-5xl md:text-6xl font-bold text-gray-900 dark:text-white leading-tight">
            Are you a content creator?
          </h2>
          <p className="mt-4 text-xl text-gray-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed">
            Expand your audience and be the first to monetize your content with
            our Digital out of Home platform.
          </p>
        </div>

        <div className="relative h-[500px] flex items-center justify-center">
          {/* Central Phone Mockup */}
          <div className="relative z-10 w-64 h-[480px] bg-gray-800 dark:bg-black rounded-[40px] shadow-2xl border-4 border-gray-300 dark:border-gray-700 p-2">
            <div className="absolute top-4 left-1/2 -translate-x-1/2 w-20 h-5 bg-gray-800 dark:bg-black rounded-b-lg"></div>
            <div className="w-full h-full bg-black rounded-[30px] overflow-hidden">
              <img
                src="https://images.unsplash.com/photo-1509343256512-d77a5cb3791b?q=80&w=800"
                alt="Content on phone screen"
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Surrounding Creator Avatars */}
          <div className="absolute inset-0">
            <img
              src={creatorImages[0].src}
              alt={creatorImages[0].name}
              className="absolute w-20 h-20 top-[10%] left-[25%] rounded-full shadow-lg border-4 border-white dark:border-slate-800 animate-float"
              style={{ animationDelay: "0s" }}
            />
            <img
              src={creatorImages[1].src}
              alt={creatorImages[1].name}
              className="absolute w-24 h-24 top-[30%] left-[10%] rounded-full shadow-lg border-4 border-white dark:border-slate-800 animate-float"
              style={{ animationDelay: "0.5s" }}
            />
            <img
              src={creatorImages[2].src}
              alt={creatorImages[2].name}
              className="absolute w-16 h-16 bottom-[15%] left-[30%] rounded-full shadow-lg border-4 border-white dark:border-slate-800 animate-float"
              style={{ animationDelay: "1s" }}
            />
            <img
              src={creatorImages[3].src}
              alt={creatorImages[3].name}
              className="absolute w-20 h-20 top-[15%] right-[22%] rounded-full shadow-lg border-4 border-white dark:border-slate-800 animate-float"
              style={{ animationDelay: "0.2s" }}
            />
            <img
              src={creatorImages[4].src}
              alt={creatorImages[4].name}
              className="absolute w-28 h-28 bottom-[25%] right-[8%] rounded-full shadow-lg border-4 border-white dark:border-slate-800 animate-float"
              style={{ animationDelay: "0.7s" }}
            />
            <img
              src={creatorImages[5].src}
              alt={creatorImages[5].name}
              className="absolute w-16 h-16 top-[55%] right-[25%] rounded-full shadow-lg border-4 border-white dark:border-slate-800 animate-float"
              style={{ animationDelay: "1.2s" }}
            />
          </div>
        </div>

        <div className="text-center mt-16">
          <Link to="/content-creator">
            <button className=" btn min-w-fit bg-purple-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
              Learn more
            </button>
          </Link>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes float {
              0%, 100% { transform: translateY(0px); }
              50% { transform: translateY(-15px); }
            }
            .animate-float { animation: float 5s ease-in-out infinite; }
          `,
        }}
      />
    </div>
  );
};

export default ContentCreator;
