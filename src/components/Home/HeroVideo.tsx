import React from "react";

const HeroVideo = () => {
  return (
    <div className="relative w-full h-screen overflow-hidden bg-white dark:bg-slate-900">
      <video
        className="absolute top-1/2 left-1/2 w-full h-full min-w-full min-h-full object-cover transform -translate-x-1/2 -translate-y-1/2 dark:brightness-90"
        src="/video.mp4"
        autoPlay
        loop
        muted
        playsInline
        controls={false}
        poster="https://placehold.co/1920x1080/1a202c/4a5568?text=Loading+Video..."
      >
        Your browser does not support the video tag.
      </video>
    </div>
  );
};

export default HeroVideo;
