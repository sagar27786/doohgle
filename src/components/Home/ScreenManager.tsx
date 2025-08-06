import React from "react";
import { ChevronRight, Monitor, Users, Settings } from "lucide-react";

const ScreenManager = () => {
  const [currentImageIndex, setCurrentImageIndex] = React.useState(0);

  const images = [
    "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/64be5c829ad0a3df643deab8_Gym_carousel_002.jpg",
    "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/64be5c83a1f629e06a22578f_Gym_carousel_007.jpg",
    "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/656f37b2dbd4bbff668b6df8_Screen-in-Coworking-Space.jpg",
  ];

  const features = [
    {
      icon: Monitor,
      title: "Manage Your Content",
      description:
        "Upload, schedule, and control your digital content across all screens in real-time.",
      imageIndex: 0,
    },
    {
      icon: Users,
      title: "Track Performance",
      description:
        "Monitor engagement metrics and audience analytics to optimize your campaigns.",
      imageIndex: 1,
    },
    {
      icon: Settings,
      title: "Customize Layouts",
      description:
        "Design and implement custom layouts that match your brand and messaging.",
      imageIndex: 2,
    },
  ];

  interface Feature {
    icon: React.ElementType;
    title: string;
    description: string;
    imageIndex: number;
  }

  const handleFeatureClick = (imageIndex: number): void => {
    setCurrentImageIndex(imageIndex);
  };

  return (
    <div className="bg-white dark:bg-slate-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            Screen Manager
          </h2>
          <p className="text-xl text-gray-600 dark:text-slate-300 max-w-3xl mx-auto">
            Take control of your digital displays with our comprehensive screen
            management platform
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-4">
            {features.map((feature, index) => (
              <div
                key={index}
                className={`group rounded-xl cursor-pointer transition-all duration-300 ${
                  currentImageIndex === feature.imageIndex
                    ? "ring-2 ring-purple-400 dark:ring-purple-500/80 bg-purple-50 dark:bg-slate-800"
                    : "hover:bg-gray-50 dark:hover:bg-slate-800/50"
                }`}
                onClick={() => handleFeatureClick(feature.imageIndex)}
              >
                <div className="flex items-start space-x-4 p-6">
                  <div className="flex-shrink-0">
                    <div className="w-12 h-12 bg-purple-100 dark:bg-slate-700 rounded-lg flex items-center justify-center group-hover:bg-purple-200 dark:group-hover:bg-slate-600 transition-colors duration-300">
                      <feature.icon className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                    </div>
                  </div>

                  <div className="flex-1">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors duration-300">
                      {feature.title}
                    </h3>
                    <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
                      {feature.description}
                    </p>
                  </div>

                  <div className="flex-shrink-0 self-center">
                    <ChevronRight className="h-5 w-5 text-gray-400 dark:text-slate-500 group-hover:text-purple-600 dark:group-hover:text-purple-400 group-hover:translate-x-1 transition-all duration-300" />
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="relative">
            <div className="relative rounded-xl overflow-hidden shadow-2xl border-4 border-purple-200 dark:border-purple-500/30 min-h-[26rem]">
              {images.map((src, index) => (
                <img
                  key={src}
                  src={src}
                  alt={`Screen Manager Feature ${index + 1}`}
                  className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-700 ease-in-out dark:brightness-90 ${
                    currentImageIndex === index ? "opacity-100" : "opacity-0"
                  }`}
                />
              ))}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent">
                <div className="absolute bottom-6 left-6 right-6">
                  <h3 className="text-white text-2xl font-bold mb-2">
                    Become a Screen Manager
                  </h3>
                  <p className="text-white/90 text-sm">
                    Take control of your digital displays and maximize your
                    content's impact
                  </p>
                </div>
              </div>
            </div>

            <div className="flex justify-center mt-6 space-x-2">
              {images.map((_, index) => (
                <button
                  key={index}
                  onClick={() => handleFeatureClick(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    currentImageIndex === index
                      ? "bg-purple-600 scale-125"
                      : "bg-gray-300 dark:bg-slate-600 hover:bg-gray-400 dark:hover:bg-slate-500"
                  }`}
                  aria-label={`Go to image ${index + 1}`}
                />
              ))}
            </div>
          </div>
        </div>

        <div className="text-center mt-16">
          <button className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-medium hover:bg-purple-700 transition-colors duration-300 transform hover:scale-105">
            Start Managing Your Screens
          </button>
        </div>
      </div>
    </div>
  );
};

export default ScreenManager;
