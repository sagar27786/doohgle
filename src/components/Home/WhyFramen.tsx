import React from "react";
import { Target, Settings, DollarSign, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const WhyFramen = () => {
  const [hoveredFeature, setHoveredFeature] = React.useState<number | null>(
    null
  );

  const features = [
    {
      icon: Target,
      title: "Target Ideal Customers",
      description:
        "Boost your brand reach in over 20,000 prime locations, engaging with a 200M+ audience in coworking spaces, luxury hotels, gyms, and more.",
    },
    {
      icon: Settings,
      title: "Agile Campaign Management",
      description:
        "Easily adjust your campaigns on-the-fly to adapt to market changes and maximize impact.",
    },
    {
      icon: DollarSign,
      title: "Cost-Efficient Advertising",
      description:
        "Start from just $10. Get significant results without large budgets or long-term contracts.",
    },
    {
      icon: Zap,
      title: "Rapid Campaign Setup",
      description:
        "Sign up free and launch your campaign instantly with our team ready to assist.",
    },
  ];

  return (
    <section className="relative py-20 overflow-hidden bg-gradient-to-br from-indigo-600 via-indigo-700 to-indigo-900">
      {/* Background overlay */}
      <div
        className="absolute inset-0 opacity-15"
        style={{
          backgroundImage: `url('https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=2074&q=80')`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      {/* Content */}
      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-14">
          <h2 className="text-4xl font-bold text-white tracking-tight">
            Why DOOHGLE?
          </h2>
          <Link
            to="/auth"
            className="mt-4 sm:mt-0 inline-block px-6 py-2.5 rounded-lg font-medium text-indigo-600 bg-white shadow hover:shadow-lg hover:bg-gray-50 transition"
          >
            Sign up for free
          </Link>
        </div>

        {/* Features */}
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group flex flex-col items-start space-y-4 transition-transform transform hover:scale-[1.04] cursor-pointer"
              onMouseEnter={() => setHoveredFeature(index)}
              onMouseLeave={() => setHoveredFeature(null)}
            >
              {/* Icon */}
              <div
                className={`w-14 h-14 flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm transition-all duration-300
                ${
                  hoveredFeature === index
                    ? "shadow-[0_0_15px_rgba(255,255,255,0.6)] scale-110"
                    : ""
                }`}
              >
                <feature.icon className="h-7 w-7 text-white transition-colors duration-300" />
              </div>

              {/* Title */}
              <h3
                className={`text-lg font-semibold text-white transition-colors duration-300
                ${hoveredFeature === index ? "text-yellow-200" : ""}`}
              >
                {feature.title}
              </h3>

              {/* Description */}
              <p className="text-indigo-100 leading-relaxed text-sm">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default WhyFramen;
