import React from "react";

const DOOHSection = () => {
  return (
    // Set the background for both light and dark modes
    <div className="bg-white dark:bg-slate-900 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          {/* Image Section */}
          <div className="lg:w-1/2">
            <img
              src="https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Gym with exercise bikes"
              // Added dark mode brightness filter
              className="w-full h-96 object-cover rounded-lg dark:brightness-90"
            />
          </div>

          {/* Text Content Section */}
          <div className="lg:w-1/2 space-y-6">
            <div className="space-y-2">
              {/* Adjusted text colors for dark mode */}
              <h3 className="text-lg font-semibold text-indigo-600 dark:text-indigo-400">
                DOOH
              </h3>
              <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
                Advertise where attention is real
              </h2>
            </div>

            <p className="text-gray-600 dark:text-slate-300 leading-relaxed">
              We turn physical spaces into intelligent media channels. Our
              FRAMEN technology gives brands access to qualified audiences
              across coworking spaces, gyms, retail and more. With programmatic
              booking, contextual targeting and live performance tracking, your
              message meets the right people, exactly when it matters. On the
              Ads Manager, you can book your campaigns across diverse venues.
            </p>

            {/* Updated button styles for dark mode */}
            <button className="border border-gray-300 dark:border-slate-600 text-gray-700 dark:text-slate-200 px-6 py-2.5 rounded-md font-medium hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors">
              Find out more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DOOHSection;
