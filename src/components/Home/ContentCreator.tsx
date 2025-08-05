import React from "react";

const ContentCreator = () => {
  const [hoveredImage, setHoveredImage] = React.useState<number | null>(null);

  const creatorImages = [
    {
      id: 1,
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aabb7631dc3b9ae10be_Vanlife.png",
      position: { top: "10%", left: "10%" },
      delay: 0,
    },
    {
      id: 2,
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaa2db46f3bba5916d6_Nathaline%20Aron%20Adventure%20%26%20Luxury%20Travel%20Voyagefox.png",
      position: { top: "25%", left: "8%" },
      delay: 0.2,
    },
    {
      id: 3,
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaa8a8d201d8955e51b_Fravely.png",
      position: { bottom: "30%", left: "12%" },
      delay: 0.4,
    },
    {
      id: 4,
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaaeb884e2adfbafb83_Bewerbungsqueen.png",
      position: { top: "15%", right: "12%" },
      delay: 0.6,
    },
    {
      id: 5,
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/660575a397d8cda071e2a43b_Sarah%20Emmerich.png",
      position: { top: "40%", right: "8%" },
      delay: 0.8,
    },
    {
      id: 6,
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaaf5a50f0f9bb4982b_Toan%20Nguyen.png",
      position: { bottom: "20%", right: "15%" },
      delay: 1.0,
    },
    {
      id: 7,
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aa998ddfd72fbb36508_Fabian%20Tausch%20Unicorn%20Bakery.png",
      position: { bottom: "10%", left: "70%" },
      delay: 1.2,
    },
    {
      id: 8,
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/66057aaab7631dc3b9ae103e_Laura%20Lewandowski.png",
      position: { bottom: "5%", left: "35%" },
      delay: 1.4,
    },
  ];

  return (
    <div className="relative bg-gradient-to-br from-purple-600 via-purple-700 to-indigo-800 py-24 overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute top-32 right-20 w-16 h-16 bg-white bg-opacity-5 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-32 w-24 h-24 bg-white bg-opacity-10 rounded-full animate-pulse"></div>
        <div className="absolute bottom-32 right-10 w-12 h-12 bg-white bg-opacity-5 rounded-full animate-bounce"></div>
      </div>

      {creatorImages.map((item) => (
        <div
          key={item.id}
          className="absolute animate-float"
          style={{
            ...item.position,
            animationDelay: `${item.delay}s`,
          }}
          onMouseEnter={() => setHoveredImage(item.id)}
          onMouseLeave={() => setHoveredImage(null)}
        >
          <div
            className={`
            w-20 h-20 bg-white rounded-full 
            flex items-center justify-center cursor-pointer
            transition-all duration-300 hover:scale-125 hover:shadow-2xl
            overflow-hidden border-2 border-white/20
            ${hoveredImage === item.id ? "shadow-2xl scale-110" : "shadow-lg"}
          `}
          >
            <img
              src={item.src}
              className="w-full h-full object-cover rounded-full"
            />
          </div>
        </div>
      ))}
      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <div className="space-y-8">
          <div className="space-y-4">
            <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
              Are you a content creator?
            </h2>
            <p className="text-xl text-purple-100 max-w-2xl mx-auto leading-relaxed">
              Expand your audience and be the first to monetize your content
              with our Digital out of Home platform.
            </p>
          </div>

          <div className="pt-8">
            <button className="group relative inline-flex items-center justify-center px-8 py-4 text-lg font-medium text-purple-600 bg-white rounded-full hover:bg-gray-50 transition-all duration-300 transform hover:scale-105 hover:shadow-2xl">
              <span className="relative z-10">Learn more</span>
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
            </button>
          </div>
        </div>
      </div>
      <style
        dangerouslySetInnerHTML={{
          __html: `
          @keyframes float {
            0%, 100% {
              transform: translateY(0px) rotate(0deg);
            }
            25% {
              transform: translateY(-10px) rotate(2deg);
            }
            50% {
              transform: translateY(-5px) rotate(-1deg);
            }
            75% {
              transform: translateY(-15px) rotate(1deg);
            }
          }
          
          .animate-float {
            animation: float 6s ease-in-out infinite;
          }
        `,
        }}
      />
    </div>
  );
};

export default ContentCreator;
