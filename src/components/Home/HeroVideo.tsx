import React from "react";

const HeroVideo = () => {
  return (
    <div className="relative w-full h-auto sm:h-screen overflow-hidden bg-white dark:bg-slate-900">
      <video
        className="w-full h-auto sm:absolute sm:top-1/2 sm:left-1/2 sm:w-full sm:h-full sm:min-w-full sm:min-h-full sm:object-cover sm:transform sm:-translate-x-1/2 sm:-translate-y-1/2 dark:brightness-90"
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
    </div>
  );
};

export default HeroVideo;
