import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";
import Lottie from "lottie-react";

const WorldMapVideoSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [animationData, setAnimationData] = useState(null);

  useEffect(() => {
    fetch(
      "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65649b88a87e4de2bb35f526_World%20Map.json"
    )
      .then((response) => response.json())
      .then((data) => setAnimationData(data))
      .catch((error) => console.log("Lottie animation failed to load:", error));
  }, []);

  return (
    <section ref={ref} className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div
          className={`grid grid-cols-1 lg:grid-cols-2 gap-12 items-center ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          } transition-all duration-1000`}
        >
          <div className="flex justify-center">
            {animationData ? (
              <Lottie
                animationData={animationData}
                loop={true}
                autoplay={true}
                className="w-full max-w-lg h-96"
              />
            ) : (
              <div className="w-full max-w-lg h-96 bg-gradient-to-br from-purple-100 to-blue-100 rounded-2xl flex items-center justify-center">
                <div className="text-gray-500">Loading World Map...</div>
              </div>
            )}
          </div>

          {/* Right Side - Video */}
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-black">
            <video className="w-full h-auto" autoPlay loop muted playsInline>
              <source src="" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>
      </div>
    </section>
  );
};

export default WorldMapVideoSection;
