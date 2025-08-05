import React from "react";

const MainHero = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-gray-900 mb-6">
          Digital Out of Home Advertising in +32 Countries
        </h1>

        <p className="text-xl text-gray-600 mb-8 max-w-4xl mx-auto leading-relaxed">
          Combine the power of Digital Out of Home with the precision of
          programmatic. Reach millions weekly across high-impact venues -
          retail, fitness, business and beyond.
        </p>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-indigo-700 transition-colors">
            Start your Campaign
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md text-lg font-medium hover:bg-gray-50 transition-colors">
            Get our Digital Signage
          </button>
        </div>

        {/* Video Preview */}
        <div className="max-w-6xl mx-auto pt-12">
          <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-purple-200">
            <video
              className="w-full h-[500px] md:h-[650px] lg:h-[750px] object-cover"
              autoPlay
              muted
              loop
              playsInline
              style={{
                border: "2px solid #e9d5ff",
                borderRadius: "12px",
              }}
            >
              <source
                src="https://d3kdzyvtj6vooy.cloudfront.net/video-92c97d73-127c-4776-b727-0ae6e14d6301"
                type="video/mp4"
              />
              Your browser does not support the video tag.
            </video>

            <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent pointer-events-none"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MainHero;
