import React from 'react';

const Contact = () => {
  const teamMembers = [
    {
      name: 'Sarah Johnson',
      image: 'https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Mike Chen',
      image: 'https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    },
    {
      name: 'Alex Rivera',
      image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 mb-4">
          Get in touch
        </h2>
        
        <p className="text-gray-600 mb-12">
          Our sales team will gladly assist you with campaign planning
        </p>

        <div className="flex justify-center mb-12">
          <div className="flex -space-x-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full border-4 border-white object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors">
            Contact Sales
          </button>
          <button className="border border-gray-300 text-gray-700 px-8 py-3 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Go to Help Center
          </button>
        </div>
      </div>
    </div>
  );
};

export default Contact;