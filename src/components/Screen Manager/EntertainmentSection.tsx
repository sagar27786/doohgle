import React from 'react';

const EntertainmentSection = () => {
  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className="space-y-6">
            <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 leading-tight">
              Next level entertainment
            </h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              Dimitri Gärtner, our founder, unveils the distinctive qualities of the 
              FRAMEN platform. We've crafted a Netflix-style solution tailored for 
              businesses to enhance communication with their guests.
            </p>
          </div>

          <div className="relative">
            <div className="relative overflow-hidden rounded-2xl shadow-2xl">
              <iframe
                width="100%"
                height="400"
                src="https://www.youtube.com/embed/Eh7aewx-cHo?autoplay=1&mute=1&loop=1&playlist=Eh7aewx-cHo&controls=1"
                title="Get to know FRAMEN"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                className="w-full"
              ></iframe>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default EntertainmentSection;