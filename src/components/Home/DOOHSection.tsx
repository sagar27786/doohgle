import React from 'react';

const DOOHSection = () => {
  return (
    <div className="bg-white py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="lg:w-1/2">
            <img
              src="https://images.pexels.com/photos/1552103/pexels-photo-1552103.jpeg?auto=compress&cs=tinysrgb&w=600"
              alt="Gym with exercise bikes"
              className="w-full h-96 object-cover rounded-lg"
            />
          </div>
          
          <div className="lg:w-1/2 space-y-6">
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-indigo-600">DOOH</h3>
              <h2 className="text-3xl font-bold text-gray-900">
                Advertise where attention is real
              </h2>
            </div>
            
            <p className="text-gray-600 leading-relaxed">
              We turn physical spaces into intelligent media channels. Our FRAMEN technology gives brands access to qualified audiences across coworking spaces, gyms, retail and more. With programmatic booking, contextual targeting and live performance tracking, your message meets the right people, exactly when it matters. On the Ads Manager, you can book your campaigns across diverse venues.
            </p>
            
            <button className="border border-gray-300 text-gray-700 px-6 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors">
              Find out more
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DOOHSection;