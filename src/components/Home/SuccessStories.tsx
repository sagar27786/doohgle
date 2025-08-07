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
      description:
        "Across Germany, DOOGLE strategically deploys Stepstone's campaigns within premium coworking hubs, effectively reaching the target demographic actively contemplating career shifts and organizational seeking talents and new joiners.",
      metrics: {
        impressions: "1.7M",
        locations: "291",
        screens: "551",
      },
    },
    {
      id: 2,
      company: "Vodafone",
      media:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654b5ff02025359b0100c85e_vodafon-campaign-media.jpg",
      mediaType: "image",
      description:
        "Leveraging DOOGLE's dynamic reach, Vodafone elevates brand presence among young professionals in prime locations. The campaign delivers impressive early exposure averaging eight hours and engaging with tech-conscious consumers.",
      metrics: {
        impressions: "17.8M",
        locations: "9.6K",
        screens: "12.8K",
      },
    },
    {
      id: 3,
      company: "Pro Columbia",
      media:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a4177b81e77be0ad9e874_video-d9cc690c-bb9a-4700-b3fc-796c709055a8-transcode.mp4",
      mediaType: "video",
      description:
        "PROCOLUMBIA, in partnership with DOOGLE, extends its campaign beyond social channels to strategic DOOH placements. Through digital out of home we can target the customers precisely.",
      metrics: {
        impressions: "5.9M",
        locations: "577",
        screens: "1,406",
      },
    },
  ];

  return (
    <div className="bg-white dark:bg-slate-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Success Stories
          </h2>
          <div className="w-24 h-1 bg-gradient-to-r from-indigo-500 to-purple-500 mx-auto"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-16">
          {stories.map((story, index) => (
            <div
              key={story.id}
              className="group animate-slide-in-left h-full"
              style={{ animationDelay: `${index * 0.2}s` }}
            >
              <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg dark:shadow-slate-900/50 overflow-hidden hover:shadow-2xl transition-all duration-500 transform hover:-translate-y-2 hover:scale-[1.03] h-full flex flex-col border border-transparent dark:border-slate-700/50 dark:hover:border-purple-500/50">
                <div className="h-48 relative overflow-hidden flex-shrink-0">
                  {story.mediaType === "video" ? (
                    <video
                      className="w-full h-full object-cover dark:brightness-90"
                      autoPlay
                      muted
                      loop
                      playsInline
                      src={story.media}
                    >
                      Your browser does not support the video tag.
                    </video>
                  ) : (
                    <img
                      src={story.media}
                      alt={story.company}
                      className="w-full h-full object-cover dark:brightness-90"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-b from-black/50 to-transparent"></div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
                    {story.company}
                  </h3>
                  <p className="text-gray-600 dark:text-slate-300 text-sm leading-relaxed mb-6 flex-1">
                    {story.description}
                  </p>

                  <div className="space-y-3 mb-6">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <TrendingUp className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm text-gray-600 dark:text-slate-300">
                          Impressions
                        </span>
                      </div>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {story.metrics.impressions}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Users className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm text-gray-600 dark:text-slate-300">
                          Locations
                        </span>
                      </div>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {story.metrics.locations}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Monitor className="h-4 w-4 text-purple-600 dark:text-purple-400" />
                        <span className="text-sm text-gray-600 dark:text-slate-300">
                          Screens
                        </span>
                      </div>
                      <span className="font-bold text-purple-600 dark:text-purple-400">
                        {story.metrics.screens}
                      </span>
                    </div>
                  </div>

                  <button className="w-full bg-white dark:bg-slate-700 border border-gray-300 dark:border-slate-600 hover:bg-gray-50 dark:hover:bg-slate-600 text-gray-700 dark:text-slate-200 py-3 px-4 rounded-lg transition-all duration-300 flex items-center justify-center space-x-2 group-hover:shadow-md mt-auto">
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
              from { opacity: 0; transform: translateX(-50px); } 
              to { opacity: 1; transform: translateX(0); } 
            }
            .animate-slide-in-left { 
              animation: slide-in-left 0.8s ease-out forwards; 
              opacity: 0; 
            }
          `,
        }}
      />
    </div>
  );
};

export default SuccessStories;
