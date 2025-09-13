import React, { useEffect, useState } from "react";
import { useInView } from "react-intersection-observer";

const DashboardClaritySection: React.FC = () => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  const [currentImage, setCurrentImage] = useState(0);

  const dashboardImages = [
    "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/656f3ddf76fe644f3a4e6568_Dashboard-Mobile.jpg",
    "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565f2414a1e73c4c3e4e518_Campaigns-1.svg",
    "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565f241eefd78d937ded7de_Campaigns-2.svg",
    "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/6565f24173ec3aa70ecd7292_Campaigns-3.svg",
  ];

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentImage((prev) => (prev + 1) % dashboardImages.length);
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <section ref={ref} className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Dashboard Clarity
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Experience crystal-clear campaign management with our intuitive
            dashboard interface
          </p>
        </div>

        <div
          className={`transition-all duration-1000 ${
            inView ? "opacity-100 scale-100" : "opacity-0 scale-95"
          }`}
        >
          <div className="relative max-w-5xl mx-auto">
            <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-8">
              <img
                src={dashboardImages[currentImage]}
                alt={`Dashboard View ${currentImage + 1}`}
                className="w-full h-auto transition-opacity duration-500"
              />

              {/* Progress indicators */}
              <div className="flex justify-center mt-6 space-x-2">
                {dashboardImages.map((_, index) => (
                  <div
                    key={index}
                    className={`w-3 h-3 rounded-full transition-colors duration-300 ${
                      index === currentImage ? "bg-purple-600" : "bg-gray-300"
                    }`}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DashboardClaritySection;
