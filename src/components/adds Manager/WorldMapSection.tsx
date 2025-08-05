import React, { useEffect, useState, useCallback } from "react";
import { useInView } from "react-intersection-observer";
import Lottie from "lottie-react";

type LottieData = any | null;

const LOTTIE_URL =
  "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/65649b88a87e4de2bb35f526_World%20Map.json";

const VIDEO_SRC =
  "https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/65649cfbf8fe2b7c3057f66c_Framen-Ads-Manager-Scheduling.mp4";

const WorldMapSection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.12,
    triggerOnce: true,
  });

  const [animationData, setAnimationData] = useState<LottieData>(null);
  const [loadingLottie, setLoadingLottie] = useState(true);
  const [errorLottie, setErrorLottie] = useState<string | null>(null);

  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let cancelled = false;
    setLoadingLottie(true);
    fetch(LOTTIE_URL)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch lottie JSON");
        return res.json();
      })
      .then((data) => {
        if (!cancelled) {
          setAnimationData(data);
          setErrorLottie(null);
        }
      })
      .catch((err) => {
        if (!cancelled) setErrorLottie(String(err));
      })
      .finally(() => {
        if (!cancelled) setLoadingLottie(false);
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const handleScroll = useCallback(() => {
    const scrollY = window.scrollY || window.pageYOffset;
    const winH = window.innerHeight || 800;
    const maxScroll = winH * 0.6; 
    const pct = Math.min(Math.max(scrollY / maxScroll, 0), 1);
    setProgress(pct);
  }, []);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const rotationX = 25 - progress * 25; // 25 -> 0

  const progressPercent = Math.round(progress * 100);

  return (
    <section
      ref={ref}
      className="py-16 bg-white overflow-hidden"
      aria-label="Global map and scheduling video section"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className={`text-center mb-12 transition-all duration-700 ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"}`}>
          <h2 className="text-3xl md:text-4xl font-semibold text-gray-900">Global Reach</h2>
          <p className="mt-3 text-gray-600 max-w-2xl mx-auto">
            Connect with audiences worldwide through our network. Watch scheduling in action and see content locations animate on the map.
          </p>
        </div>

        <div className="fixed top-5 right-5 z-50">
          <div className="w-12 h-12 rounded-full bg-white/70 backdrop-blur border border-gray-200 flex items-center justify-center text-sm font-medium text-gray-800 shadow">
            {progressPercent}%
          </div>
        </div>

        <div className={`grid grid-cols-1 lg:grid-cols-2 gap-10 items-center ${inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"} transition-all duration-700`}>
          <div className="flex items-center justify-center">
            <div
              className="w-full max-w-3xl"
              style={{
                transform: `perspective(1200px) rotateX(${rotationX}deg)`,
                transformStyle: "preserve-3d",
                transition: "transform 200ms linear",
              }}
            >
              {loadingLottie ? (
                <div className="w-full h-80 md:h-96 bg-gradient-to-br from-purple-50 to-blue-50 rounded-2xl flex items-center justify-center">
                  <span className="text-gray-400">Loading animation…</span>
                </div>
              ) : errorLottie ? (
                <div className="w-full h-80 md:h-96 bg-red-50 rounded-2xl flex items-center justify-center text-red-600">
                  Failed to load animation
                </div>
              ) : animationData ? (
                <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white">
                  <Lottie
                    animationData={animationData}
                    loop
                    autoplay
                    className="w-full h-80 md:h-96 object-contain"
                    style={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </div>
              ) : (
                <div className="w-full h-80 md:h-96 bg-gray-100 rounded-2xl" />
              )}
            </div>
          </div>

          <div className="flex items-center justify-center">
            <div
              className="w-full max-w-3xl rounded-2xl overflow-hidden shadow-2xl bg-black"
              style={{
                transform: `perspective(1200px) rotateX(${rotationX * 0.18}deg)`,
                transition: "transform 200ms linear",
              }}
            >
              <video
                className="w-full h-80 md:h-96 object-cover"
                autoPlay
                loop
                muted
                playsInline
                preload="metadata"
              >
                <source src={VIDEO_SRC} type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>
        </div>
        <div className={`mt-10 text-center max-w-3xl mx-auto text-gray-600 transition-opacity duration-700 ${inView ? "opacity-100" : "opacity-0"}`}>
          <p>
            The map animates based on scroll — start near 25° tilt and smoothly rotate to flat as you scroll down. Video previews play automatically to show scheduling flows.
          </p>
        </div>
      </div>
    </section>
  );
};



export default WorldMapSection;