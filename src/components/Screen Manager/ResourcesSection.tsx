import React, { useState, useEffect } from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const ResourcesSection = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);

  const videoPlayers = [
    {
      id: "8b7a685b-acab-412d-abad-8bcd661c0411",
      url: "https://lite.framen.com/player/8b7a685b-acab-412d-abad-8bcd661c0411",
      title: "Digital Signage Demo 1",
      aspect: "landscape",
    },
    {
      id: "0124d742-6d79-4781-b724-9a572ea2c449",
      url: "https://lite.framen.com/player/0124d742-6d79-4781-b724-9a572ea2c449",
      title: "Interactive Display 2",
      aspect: "portrait",
    },
    {
      id: "3f1dd3fe-0bf8-4959-9f71-d1dc71cf0658",
      url: "https://lite.framen.com/player/3f1dd3fe-0bf8-4959-9f71-d1dc71cf0658",
      title: "Content Management 3",
      aspect: "landscape",
    },
    {
      id: "8a73f368-0d95-4509-8111-ec00b4f24c8d",
      url: "https://lite.framen.com/player/8a73f368-0d95-4509-8111-ec00b4f24c8d",
      title: "Screen Solutions 4",
      aspect: "portrait",
    },
    {
      id: "61c4dc9e-6f4d-447e-9546-8939641dbf31",
      url: "https://lite.framen.com/player/61c4dc9e-6f4d-447e-9546-8939641dbf31",
      title: "Digital Experience 5",
      aspect: "landscape",
    },
    {
      id: "82d6dcc3-6c7f-4d94-94fc-5a67abd88f41",
      url: "https://lite.framen.com/player/82d6dcc3-6c7f-4d94-94fc-5a67abd88f41",
      title: "Media Player 6",
      aspect: "portrait",
    },
    {
      id: "a3e7f630-8705-4499-9144-f1338b08665d",
      url: "https://lite.framen.com/player/a3e7f630-8705-4499-9144-f1338b08665d",
      title: "Platform Demo 7",
      aspect: "landscape",
    },
  ];

  const nextSlide = () => {
    setCurrentSlide(
      (prev) => (prev + 1) % Math.max(1, videoPlayers.length - 3)
    );
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, videoPlayers.length - 3)) %
        Math.max(1, videoPlayers.length - 3)
    );
  };

  // Auto-advance slides with play/pause control
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  return (
    <section id="resources" className="py-20 bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold mb-4">
            Better customer experience
          </h2>
          <p className="text-xl text-gray-300 max-w-3xl mx-auto">
            By integrating your displays, you can tap into an additional revenue
            stream that also elevates the customer experience. Tailored content
            not only captivates your audience but may also increase the duration
            of their stay and foster repeat visits.
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-white" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-white" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-10 bg-white bg-opacity-20 hover:bg-opacity-30 rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-white" />
            ) : (
              <Play className="h-5 w-5 text-white" />
            )}
          </button>

          {/* Main Content - Multiple Items Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentSlide * 25}%)` }}
            >
              {videoPlayers.map((player, index) => (
                <div
                  key={player.id}
                  className={`flex-shrink-0 transition-all duration-300 hover:scale-105 ${
                    player.aspect === "landscape" ? "w-1/2" : "w-1/4"
                  }`}
                >
                  <div className="bg-gray-800 rounded-xl overflow-hidden shadow-2xl hover:shadow-3xl transition-all duration-300 group">
                    <div className="relative h-96">
                      <iframe
                        src={player.url}
                        title={player.title}
                        className="w-full h-full object-cover"
                        frameBorder="0"
                        allow="autoplay; fullscreen"
                        allowFullScreen
                        loading="lazy"
                      />

                      {/* Overlay with title and play button */}
                      <div className="absolute inset-0 bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                        <Play className="h-12 w-12 text-white" />
                      </div>

                      {/* Title overlay at bottom */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white text-sm font-semibold">
                          {player.title}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center mt-8 space-x-2">
            {Array.from({ length: Math.max(1, videoPlayers.length - 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-purple-600 scale-125"
                      : "bg-gray-600 hover:bg-gray-500"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default ResourcesSection;
