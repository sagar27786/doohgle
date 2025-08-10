import React from "react";
import { Link } from "react-router-dom";

const Contact = () => {
  const teamMembers = [
    {
      name: "Sarah Johnson",
      image:
        "https://images.pexels.com/photos/733872/pexels-photo-733872.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Mike Chen",
      image:
        "https://images.pexels.com/photos/834863/pexels-photo-834863.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
    },
    {
      name: "Alex Rivera",
      image:
        "https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=150&h=150&fit=crop&crop=face",
    },
  ];

  return (
    <div className="bg-gray-200 dark:bg-slate-900 py-16 transition-colors duration-300">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
          Get in touch
        </h2>

        <p className="text-gray-600 dark:text-slate-300 mb-12">
          Our sales team will gladly assist you with campaign planning
        </p>

        <div className="flex justify-center mb-12">
          <div className="flex -space-x-4">
            {teamMembers.map((member, index) => (
              <div key={index} className="relative">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-20 h-20 rounded-full border-4 border-white dark:border-slate-900 object-cover dark:brightness-90"
                />
              </div>
            ))}
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link to="/contact">
            <div className="bg-indigo-600 text-white px-8 py-3 rounded-md font-medium hover:bg-indigo-700 transition-colors">
              Contact Sales
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Contact;
