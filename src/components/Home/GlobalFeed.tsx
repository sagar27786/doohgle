import React from "react";
import { ChevronLeft, ChevronRight, Play, Pause } from "lucide-react";

const GlobalFeed = () => {
  const [currentSlide, setCurrentSlide] = React.useState(0);
  const [isPlaying, setIsPlaying] = React.useState(true);

  const slides = [
    {
      type: "video",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a28bc22684b3fd98e582c_personio_portrait-transcode.mp4",
      poster:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a28bc22684b3fd98e582c_personio_portrait-poster-00001.jpg",
      title: "Personio Campaign",
      isLandscape: false,
    },
    {
      type: "page",
      src: "https://lite.framen.com/player/3f1dd3fe-0bf8-4959-9f71-d1dc71cf0658",
      title: "Interactive Campaign",
      isLandscape: false,
    },
    {
      type: "video",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a291e87bb9967188832ed_RedBull-transcode.mp4",
      poster:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a291e87bb9967188832ed_RedBull-poster-00001.jpg",
      title: "RedBull Campaign",
      isLandscape: false,
    },
    {
      type: "video",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a29b63d917530a1e74e7a_babbel_landscape-transcode.mp4",
      poster:
        "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a29b63d917530a1e74e7a_babbel_landscape-poster-00001.jpg",
      title: "Babbel Campaign",
      isLandscape: true,
    },
    {
      type: "image",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a2cb0df1bc6f6716425a5_tomford_portrait-poster-00001.jpg",
      title: "Tom Ford Campaign",
      isLandscape: false,
    },
    {
      type: "image",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654a2cd4c3c00e32446fd1b1_seiko_portrait-poster-00001.jpg",
      title: "Seiko Campaign",
      isLandscape: false,
    },
    {
      type: "page",
      src: "https://lite.framen.com/player/147646c6-c74f-48a8-93ce-7acbd5fa3654",
      title: "Interactive Campaign 2",
      isLandscape: false,
    },
    {
      type: "page",
      src: "https://lite.framen.com/player/7e6e3482-8a1c-4934-a862-5b1de553ccf3",
      title: "Interactive Campaign 3",
      isLandscape: false,
    },
    {
      type: "page",
      src: "https://lite.framen.com/player/61c4dc9e-6f4d-447e-9546-8939641dbf31",
      title: "Interactive Campaign 4",
      isLandscape: false,
    },
    {
      type: "image",
      src: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/654b7ab9ee48cc7bc4f7c8ca_BDX_landscape-poster-00001.jpg",
      title: "BDX Campaign",
      isLandscape: true,
    },
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % Math.max(1, slides.length - 3));
  };

  const prevSlide = () => {
    setCurrentSlide(
      (prev) =>
        (prev - 1 + Math.max(1, slides.length - 3)) %
        Math.max(1, slides.length - 3)
    );
  };

  // Auto-advance slides
  React.useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      nextSlide();
    }, 5000);

    return () => clearInterval(interval);
  }, [isPlaying, currentSlide]);

  return (
    <div className="bg-gray-50 py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Global Feed</h2>
          <p className="text-xl text-gray-600">
            Discover campaigns from around the world
          </p>
        </div>

        <div className="relative">
          {/* Navigation Arrows */}
          <button
            onClick={prevSlide}
            className="absolute left-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronLeft className="h-6 w-6 text-purple-600" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-4 top-1/2 transform -translate-y-1/2 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            <ChevronRight className="h-6 w-6 text-purple-600" />
          </button>

          {/* Play/Pause Button */}
          <button
            onClick={() => setIsPlaying(!isPlaying)}
            className="absolute top-4 right-4 z-10 bg-white rounded-full p-3 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-110"
          >
            {isPlaying ? (
              <Pause className="h-5 w-5 text-purple-600" />
            ) : (
              <Play className="h-5 w-5 text-purple-600" />
            )}
          </button>

          {/* Main Content - Multiple Items Carousel */}
          <div className="overflow-hidden">
            <div
              className="flex transition-transform duration-500 ease-in-out gap-6"
              style={{ transform: `translateX(-${currentSlide * 25}%)` }}
            >
              {slides.map((slide, index) => (
                <div
                  key={index}
                  className={`flex-shrink-0 transition-all duration-300 hover:scale-105 ${
                    slide.isLandscape ? "w-1/2" : "w-1/4"
                  }`}
                >
                  <div className="bg-white rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300">
                    <div className="relative h-96">
                      {slide.type === "video" && (
                        <video
                          className="w-full h-full object-cover"
                          autoPlay
                          muted
                          loop
                          playsInline
                          poster={slide.poster}
                        >
                          <source src={slide.src} type="video/mp4" />
                          Your browser does not support the video tag.
                        </video>
                      )}

                      {slide.type === "page" && (
                        <iframe
                          src={slide.src}
                          className="w-full h-full"
                          title={slide.title}
                          frameBorder="0"
                          allowFullScreen
                        />
                      )}

                      {slide.type === "image" && (
                        <img
                          src={slide.src}
                          alt={slide.title}
                          className="w-full h-full object-cover"
                        />
                      )}

                      {/* Overlay with title */}
                      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
                        <h3 className="text-white text-sm font-semibold">
                          {slide.title}
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
            {Array.from({ length: Math.max(1, slides.length - 3) }).map(
              (_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentSlide(index)}
                  className={`w-3 h-3 rounded-full transition-all duration-300 ${
                    index === currentSlide
                      ? "bg-purple-600 scale-125"
                      : "bg-gray-300 hover:bg-gray-400"
                  }`}
                />
              )
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default GlobalFeed;
