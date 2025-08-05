import React, { useState } from 'react';
import { Check, ChevronDown } from 'lucide-react';

const PricingSection = () => {
  const [commitment, setCommitment] = useState('24 months');
  const [currency, setCurrency] = useState('EUR');
  const [expandedFeatures, setExpandedFeatures] = useState<{[key: string]: boolean}>({});

  const toggleFeatures = (plan: string) => {
    setExpandedFeatures(prev => ({
      ...prev,
      [plan]: !prev[plan]
    }));
  };

  const plans = [
    {
      name: 'FREE',
      price: '€0',
      period: 'per TV / mo',
      description: 'Monetise your screens at no costs today!',
      commitment: 'Month to month, no strings attached.',
      features: [
        'Basic Signage Features',
        'Free Content',
        'Exclusive ad revenue',
        'Ad revenue estimation',
        'Smart TV App',
        'TV Box'
      ],
      buttonText: 'Sign up now',
      buttonStyle: 'border-2 border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600',
      popular: false
    },
    {
      name: 'PREMIUM',
      price: '€5',
      period: 'per TV / mo',
      description: 'More control and premium features with zero risk thanks to 100% CASH BACK ON 24M PREMIUM*',
      commitment: 'with a minimum commitment of 24 months',
      features: [
        'Premium Signage Features',
        'Free Content',
        'Exclusive ad revenue',
        'Ad revenue estimation',
        'Smart TV App',
        'TV Box'
      ],
      buttonText: 'Contact Now',
      buttonStyle: 'bg-white text-purple-600 hover:bg-gray-50',
      popular: true
    },
    {
      name: 'AD-API',
      price: '€0',
      period: 'integration tech fee',
      description: 'Easily connect your preferred CMS.',
      commitment: 'with a minimum commitment of 30 months',
      features: [
        'No Signage Features',
        'Free Content',
        'Exclusive ad revenue',
        'Ad revenue estimation',
        'Smart TV App',
        'Custom API Connection'
      ],
      buttonText: 'Apply Now',
      buttonStyle: 'border-2 border-gray-300 text-gray-700 hover:border-purple-600 hover:text-purple-600',
      popular: false
    }
  ];

  return (
    <section id="pricing" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-xl text-gray-600">Start monetizing your screens today</p>
        </div>

        <div className="flex justify-center mb-8">
          <div className="flex items-center space-x-4 bg-white rounded-lg p-1 shadow-md">
            <span className="text-sm text-gray-600">Commitment of:</span>
            {['12 months', '24 months', '36 months'].map((period) => (
              <button
                key={period}
                onClick={() => setCommitment(period)}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  commitment === period
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {period}
              </button>
            ))}
          </div>
        </div>

        <div className="flex justify-center mb-12">
          <div className="flex bg-white rounded-lg p-1 shadow-md">
            {['EUR', 'GBP', 'USD'].map((curr) => (
              <button
                key={curr}
                onClick={() => setCurrency(curr)}
                className={`px-3 py-1 rounded-md text-sm font-medium transition-colors ${
                  currency === curr
                    ? 'bg-purple-600 text-white'
                    : 'text-gray-600 hover:text-purple-600'
                }`}
              >
                {curr}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
          {plans.map((plan, index) => (
            <div
              key={plan.name}
              className={`bg-white rounded-2xl shadow-xl overflow-hidden relative ${
                plan.popular ? 'ring-4 ring-purple-600 transform scale-105' : ''
              }`}
            >
              {plan.popular && (
                <div className="absolute top-0 left-0 right-0 bg-purple-600 text-white text-center py-2 text-sm font-semibold">
                  Most Popular
                </div>
              )}
              
              <div className={`p-8 ${plan.popular ? 'pt-16 bg-purple-600 text-white' : ''}`}>
                <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                <p className={`text-sm mb-6 ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>
                  {plan.description}
                </p>
                
                <div className="mb-6">
                  <div className="flex items-baseline">
                    <span className="text-5xl font-bold">{plan.price}</span>
                    <span className={`ml-2 text-sm ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>
                      {plan.period}
                    </span>
                  </div>
                  <p className={`text-sm mt-2 ${plan.popular ? 'text-purple-100' : 'text-gray-600'}`}>
                    {plan.commitment}
                  </p>
                </div>

                <button className={`w-full py-3 px-6 rounded-lg font-semibold transition-all duration-300 transform hover:scale-105 ${plan.buttonStyle}`}>
                  {plan.buttonText}
                </button>
              </div>

              <div className="p-8 pt-0">
                <button
                  onClick={() => toggleFeatures(plan.name)}
                  className="flex items-center justify-between w-full text-left font-semibold text-gray-900 mb-4"
                >
                  <span>{plan.name} Features</span>
                  <ChevronDown className={`h-5 w-5 transition-transform ${expandedFeatures[plan.name] ? 'rotate-180' : ''}`} />
                </button>
                
                {expandedFeatures[plan.name] && (
                  <ul className="space-y-3">
                    {plan.features.map((feature, featureIndex) => (
                      <li key={featureIndex} className="flex items-center text-gray-600">
                        <Check className="h-5 w-5 text-green-500 mr-3 flex-shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-12">
          <button className="text-purple-600 hover:text-purple-700 font-semibold">
            Compare Plans
          </button>
        </div>

        <div className="mt-16 bg-white rounded-2xl p-8 shadow-lg">
          <h3 className="text-2xl font-bold text-gray-900 mb-4">The custom touch: Full DOOH-Platform</h3>
          <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center">
            <p className="text-gray-600 lg:max-w-2xl mb-4 lg:mb-0">
              You are looking for a customised solution to white label integrate our full stack platform into your environment?
            </p>
            <button className="bg-purple-600 text-white px-6 py-3 rounded-lg hover:bg-purple-700 transition-colors font-semibold">
              Inquire Now
            </button>
          </div>
          <p className="text-sm text-gray-500 mt-4">* current daily pricing as of July 30th, 2024</p>
        </div>
      </div>
    </section>
  );
};

export default PricingSection;