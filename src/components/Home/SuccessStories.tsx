import React from "react";
import { ExternalLink, TrendingUp, Users, Monitor } from "lucide-react";

const SuccessStories = () => {
  const stories = [
    {
      id: 1,
      company: "Stepstone",
      media:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654b643e9b492cb0ee379a04_stepstone-campaign-transcode.mp4",
      mediaType: "video",
      bannerText: {
        // main: "Satzpause?",
        // sub: "Nutz die Zeit und finde deinen neuen Job mit dem richtigen Gehalt",
      },
      description:
        "Across Germany, FRAMEN strategically deploys Stepstone's campaigns within premium coworking hubs, effectively reaching the target demographic actively contemplating career shifts and organizational seeking talents and new joiners.",
      metrics: {
        impressions: "1.7M",
        locations: "291",
        screens: "551",
      },
      color: "blue",
    },
    {
      id: 2,
      company: "Vodafone",
      media:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654b5ff02025359b0100c85e_vodafon-campaign-media.jpg",
      mediaType: "image",
      bannerText: {
        // main: "vodafone business",
        // sub: "Together we can",
      },
      description:
        "Leveraging FRAMEN's dynamic reach, Vodafone elevates brand presence among young professionals in prime locations. The campaign delivers impressive early exposure averaging eight hours and engaging with tech-conscious consumers.",
      metrics: {
        impressions: "17.8M",
        locations: "9.6K",
        screens: "12.8K",
      },
      color: "red",
    },
    {
      id: 3,
      company: "Pro Columbia",
      media:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a4177b81e77be0ad9e874_video-d9cc690c-bb9a-4700-b3fc-796c709055a8-transcode.mp4",
      mediaType: "video",
      bannerText: {
        // main: "WESTERN COLOMBIAN ANDES",
        // sub: "MOUNTAINS OF COFFEE AND FLOWERS",
      },
      description:
        "PROCOLUMBIA, in partnership with FRAMEN, extends its campaign beyond social channels to strategic DOOH placements. Through digital out of home we can target the customers precisely.",
      metrics: {
        impressions: "5.9M",
        locations: "577",
        screens: "1,406",
      },
      color: "purple",
    },
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Success Stories
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="group animate-slide-in-left h-full"
              style={{ animationDelay: `${index * 0.3}s` }}
            >
              <div className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-105 h-full flex flex-col">
                {/* Banner Section */}
                <div className="h-48 relative overflow-hidden flex-shrink-0">
                  {story.mediaType === "video" ? (
                    <video
                      className="w-full h-full object-cover"
                      autoPlay
                      muted
                      loop
                      playsInline
                    >
                      <source src={story.media} type="video/mp4" />
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={story.media}
                      alt={story.company}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Banner Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent">
                    <div className="absolute bottom-4 left-4 right-4">
                      <h3 className="text-2xl font-bold text-white mb-1">
                      </h3>
                      <p className="text-white text-sm opacity-90">
                      </p>
                    </div>
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  {/* Company Name */}
                  <h3 className="text-2xl font-bold text-gray-900 mb-4">
                    {story.company}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed mb-6 flex-1">
                    {story.description}
                  </p>

                  {/* Metrics */}
                  <div className="space-y-3 mb-6">
                    <div
                      className="flex items-center justify-between animate-slide-in-right"
                      style={{ animationDelay: "0.3s" }}
                    >
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-600">
                          Impressions
                        </span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {story.metrics.impressions}
                      </span>
                    </div>

                    <div
                      className="flex items-center justify-between animate-slide-in-right"
                      style={{ animationDelay: "0.4s" }}
                    >
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Locations</span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {story.metrics.locations}
                      </span>
                    </div>

                    <div
                      className="flex items-center justify-between animate-slide-in-right"
                      style={{ animationDelay: "0.5s" }}
                    >
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4 text-purple-600" />
                        <span className="text-sm text-gray-600">Screens</span>
                      </div>
                      <span className="font-bold text-purple-600">
                        {story.metrics.screens}
                      </span>
                    </div>
                  </div>

                  {/* Button */}
                  <button className="w-full bg-white border border-gray-300 hover:bg-gray-50 text-gray-700 py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-md animate-bounce-subtle mt-auto">
                    <span>Check campaign</span>
                    <ExternalLink className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-300" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style
        dangerouslySetInnerHTML={{
          __html: `
            @keyframes slide-in-left {
              from {
                opacity: 0;
                transform: translateX(-50px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes slide-in-right {
              from {
                opacity: 0;
                transform: translateX(-20px);
              }
              to {
                opacity: 1;
                transform: translateX(0);
              }
            }
            
            @keyframes bounce-subtle {
              0%, 100% {
                transform: translateY(0);
              }
              50% {
                transform: translateY(-2px);
              }
            }
            
            .animate-slide-in-left {
              animation: slide-in-left 0.8s ease-out forwards;
              opacity: 0;
            }
            
            .animate-slide-in-right {
              animation: slide-in-right 0.5s ease-out forwards;
              opacity: 0;
            }
            
            .animate-bounce-subtle {
              animation: bounce-subtle 2s ease-in-out infinite;
            }
          `,
        }}
      />
    </div>
  );
};

export default SuccessStories;
