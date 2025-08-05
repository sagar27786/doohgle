import React from 'react';
import { ChevronDown, ChevronRight } from 'lucide-react';

const FAQ = () => {
  const [openFAQ, setOpenFAQ] = React.useState(0);

  const faqs = [
    {
      question: 'Is FRAMEN\'s Software for free?',
      answer: 'Yes! Our software is available without fee. Create your account and login to your dashboard. Once you start an Ad Campaign, enter your payment options for the ad spend. Screen Managers equally can use our software for free with the option to upgrade to our Premium plan for additional features.'
    },
    {
      question: 'How much does a campaign cost?',
      answer: 'Campaign costs vary based on location, duration, and audience reach. Contact our sales team for detailed pricing.'
    },
    {
      question: 'What target audiences can be found where?',
      answer: 'Our network spans across various venue types including gyms, coworking spaces, retail locations, and more.'
    },
    {
      question: 'Where are the screens?',
      answer: 'Our screens are located in high-traffic venues across 32+ countries worldwide.'
    },
    {
      question: 'What is different to traditional DOOH?',
      answer: 'Unlike traditional DOOH, FRAMEN offers programmatic booking, real-time optimization, and detailed analytics.'
    }
  ];

  return (
    <div className="bg-white py-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h2 className="text-4xl font-bold text-gray-900 text-center mb-12">
          Do you have questions?
        </h2>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border border-gray-200 rounded-lg">
              <button
                className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                onClick={() => setOpenFAQ(openFAQ === index ? -1 : index)}
              >
                <div className="flex items-center space-x-4">
                  <div className="w-8 h-8 bg-gray-100 rounded-lg flex items-center justify-center">
                    <span className="text-gray-600 text-sm">?</span>
                  </div>
                  <span className="font-medium text-gray-900">{faq.question}</span>
                </div>
                {openFAQ === index ? (
                  <ChevronDown className="h-5 w-5 text-gray-400" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-gray-400" />
                )}
              </button>
              
              {openFAQ === index && (
                <div className="px-6 pb-4">
                  <div className="ml-12 text-gray-600">
                    {faq.answer}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FAQ;