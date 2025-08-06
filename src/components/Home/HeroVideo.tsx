import React from "react";

const HeroVideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-slate-900">
      <video
        className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2 dark:brightness-90"
        src="https://d3kdzyvtj6vooy.cloudfront.net/video-92c97d73-127c-4776-b727-0ae6e14d6301"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        poster="https://placehold.co/1920x1080/1a202c/4a5568?text=Loading+Video..."
      >
        Your browser does not support the video tag.
      </video>
      <div className="absolute inset-0 bg-black/30"></div>

      {/* Centered Content Overlay */}
      <div className="relative z-10 flex flex-col items-center justify-center h-full text-white text-center px-4">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight drop-shadow-lg">
          Dynamic Visual Experiences
        </h1>
        <p className="mt-4 text-lg md:text-xl max-w-2xl drop-shadow-md">
          Engage your audience with high-impact, full-screen video backgrounds
          that work seamlessly on any device.
        </p>
      </div>
    </div>
  );
};

export default HeroVideo;
