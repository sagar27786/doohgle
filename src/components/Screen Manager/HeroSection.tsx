import React from 'react';

const HeroSection = () => {
  return (
    <section className="pt-24 pb-16 bg-gradient-to-br from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-8">
            <div className="space-y-4">
              <h1 className="text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Connect. Entertain.{' '}
                <span className="text-purple-600">Earn.</span>
              </h1>
              <p className="text-xl text-gray-600 leading-relaxed max-w-2xl">
                The all-in-one Screen Manager is here to integrate your displays and screens into a revenue-generating network with tailored content that adds value to your audience.
              </p>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-purple-600 text-white px-8 py-4 rounded-lg text-lg font-semibold hover:bg-purple-700 transition-all duration-300 transform hover:scale-105 shadow-lg">
                Get Started Free
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-lg text-lg font-semibold hover:border-purple-600 hover:text-purple-600 transition-all duration-300">
                Watch Demo
              </button>
            </div>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl bg-gray-900">
              <video
                autoPlay
                loop
                muted
                playsInline
                className="w-full h-auto min-h-[400px] object-cover"
              >
                <source src="https://s3.amazonaws.com/webflow-prod-assets/6364e4e0baec60a3a1eff938/656f31d1abaf9511e8a633ec_Framen-Venues.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;