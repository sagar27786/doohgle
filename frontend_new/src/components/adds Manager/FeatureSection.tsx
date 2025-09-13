import React from 'react';
import { useInView } from 'react-intersection-observer';
import { MapPin, Clock, Target, Zap } from 'lucide-react';

interface FeatureProps {
  title: string;
  description: string;
  imageSrc: string;
  icon: React.ReactNode;
  stats: { label: string; value: string }[];
  reverse?: boolean;
}

const FeatureCard: React.FC<FeatureProps> = ({ title, description, imageSrc, icon, stats, reverse = false }) => {
  const [ref, inView] = useInView({
    threshold: 0.1,
    triggerOnce: true,
  });

  return (
    <div ref={ref} className={`flex flex-col ${reverse ? 'lg:flex-row-reverse' : 'lg:flex-row'} items-center gap-16 mb-24`}>
      <div className={`flex-1 ${inView ? 'opacity-100 translate-x-0' : `opacity-0 ${reverse ? 'translate-x-10' : '-translate-x-10'}`} transition-all duration-1000`}>
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-purple-500 to-pink-500 rounded-2xl mb-6">
          {icon}
        </div>
        
        <h3 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6 leading-tight">
          {title}
        </h3>
        
        <p className="text-xl text-gray-600 leading-relaxed mb-8">
          {description}
        </p>
        
        {/* Stats */}
        <div className="grid grid-cols-2 gap-6">
          {stats.map((stat, index) => (
            <div key={index} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm">
              <div className="text-2xl font-bold text-gray-900 mb-1">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
      
      <div className={`flex-1 ${inView ? 'opacity-100 translate-x-0' : `opacity-0 ${reverse ? '-translate-x-10' : 'translate-x-10'}`} transition-all duration-1000 delay-300`}>
        <div className="relative group">
          <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl blur-xl opacity-20 group-hover:opacity-30 transition-opacity duration-300"></div>
          <div className="relative rounded-2xl overflow-hidden shadow-2xl bg-white p-2">
            <img
              src={imageSrc}
              alt={title}
              className="w-full h-80 object-cover rounded-xl"
            />
            <div className="absolute inset-2 bg-gradient-to-br from-purple-500/10 to-pink-500/10 rounded-xl"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

const FeatureSection: React.FC = () => {
  const features = [
    {
      title: "Precision Geotargeting",
      description: "Select your ad locations from specific venues to entire cities or countries for targeted audience engagement with advanced location intelligence.",
      imageSrc: "https://cdn.prod.website-files.com/6364e4e0baec60a3a1eff938/656f3ddf76fe644f3a4e6568_Dashboard-Mobile.jpg",
      icon: <MapPin className="w-8 h-8 text-white" />,
      stats: [
        { label: "Location Accuracy", value: "99.9%" },
        { label: "Coverage Areas", value: "150+" }
      ]
    },
    {
      title: "Smart Scheduling",
      description: "Precisely plan and schedule your ads with AI-powered timing optimization, allocating impressions more efficiently and reducing waste coverage.",
      imageSrc: "https://images.pexels.com/photos/1181244/pexels-photo-1181244.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1",
      icon: <Clock className="w-8 h-8 text-white" />,
      stats: [
        { label: "Time Optimization", value: "85%" },
        { label: "Waste Reduction", value: "60%" }
      ],
      reverse: true
    }
  ];

  return (
    <section className="py-32 bg-gradient-to-br from-gray-50 to-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-purple-100 rounded-full blur-3xl opacity-30"></div>
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-pink-100 rounded-full blur-3xl opacity-30"></div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <div className="inline-flex items-center px-4 py-2 bg-purple-100 text-purple-700 rounded-full mb-6">
            <Target className="w-4 h-4 mr-2" />
            <span className="text-sm font-medium">Advanced Features</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Powerful Tools for <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">Better Results</span>
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Leverage cutting-edge technology to create, manage, and optimize your advertising campaigns like never before.
          </p>
        </div>
        
        {features.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </section>
  );
};

export default FeatureSection;