import React from "react";
import { Target, Settings, DollarSign, Zap } from "lucide-react";

const WhyFramen = () => {
  const [hoveredFeature, setHoveredFeature] = React.useState<number | null>(
    null
  );

  const features = [
    {
      icon: Target,
      title: "Target Ideal Customers",
      description:
        "Boost your brand reach in over 20,000 prime locations, engaging with a 200 million-strong audience in places like coworking spaces, luxury hotels, gyms, and more.",
    },
    {
      icon: Settings,
      title: "Agile Campaign Management",
      description:
        "Quickly adjust your campaigns as needed without extensive planning. Adapt on-the-fly to improve results effectively.",
    },
    {
      icon: DollarSign,
      title: "Cost-Efficient Advertising",
      description:
        "Start advertising with as little as $10/£10. Enjoy significant impact without large budget, and the freedom of no binding contracts.",
    },
    {
      icon: Zap,
      title: "Rapid Campaign Setup",
      description:
        "Sign up at no cost and launch your campaign almost instantly. Our Sales team is ready to help with any assistance you may require.",
    },
  ];

  return (
    <div className="bg-indigo-600 py-16 relative overflow-hidden">
      {/* Background Image */}
      <div
        className="absolute inset-0 opacity-10"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2074&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-start mb-12">
          <h2 className="text-4xl font-bold text-white">Why FRAMEN?</h2>
          <button className="bg-white text-indigo-600 px-6 py-2.5 rounded-md font-medium hover:bg-gray-50 transition-colors">
            Sign up for free
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div
              key={index}
              className="space-y-4 transform transition-all duration-300 hover:scale-105 cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              <div
                className={`w-12 h-12 bg-white bg-opacity-20 rounded-lg flex items-center justify-center transition-all duration-300 ${
                  hoveredFeature === index ? "bg-opacity-30 scale-110" : ""
                }`}
              >
                <feature.icon className="h-6 w-6 text-white" />
              </div>

              <h3
                className={`text-xl font-semibold text-white transition-all duration-300 ${
                  hoveredFeature === index ? "text-yellow-200" : ""
                }`}
              >
                {feature.title}
              </h3>

              <p
                className={`text-indigo-100 leading-relaxed transition-all duration-300 ${
                  hoveredFeature === index ? "text-white" : ""
                }`}
              >
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default WhyFramen;
