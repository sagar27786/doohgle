import React from 'react';

const Footer = () => {
  const footerLinks = {
    'FRAMEN': [
      'About us',
      'Career',
      'News & Blog',
      'Contact'
    ],
    'Products': [
      'Ads Manager',
      'Screen Manager',
      'Creator',
      'Dashboard',
      'Hardware'
    ],
    'Resources': [
      'Agency Program',
      'Developers / API',
      'Screen Locations',
      'Success Stories',
      'Become a Publisher'
    ],
    'Support': [
      'Help Center',
      'Data & Privacy',
      'Terms & Conditions',
      'Imprint'
    ]
  };

  return (
    <footer className="bg-white border-t border-gray-200 py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Logo and company info */}
          <div className="lg:col-span-1">
            <div className="text-2xl font-bold text-gray-900 mb-4">
              <span className="text-gray-600">◊</span> FRAMEN
            </div>
            <p className="text-sm text-gray-600 mb-4">
              Part of Axel Springer SE
            </p>
            <p className="text-sm font-semibold text-gray-900">
              axel springer.
            </p>
            
            <div className="flex space-x-3 mt-6">
              <div className="w-8 h-8 bg-indigo-600 rounded flex items-center justify-center">
                <span className="text-white text-sm">📱</span>
              </div>
              <div className="w-8 h-8 bg-gray-600 rounded flex items-center justify-center">
                <span className="text-white text-sm">📧</span>
              </div>
              <div className="w-8 h-8 bg-green-500 rounded flex items-center justify-center">
                <span className="text-white text-sm">💬</span>
              </div>
              <div className="w-8 h-8 bg-gray-800 rounded flex items-center justify-center">
                <span className="text-white text-sm">🔔</span>
              </div>
            </div>
          </div>

          {/* Footer links */}
          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h3 className="font-semibold text-gray-900 mb-4">{category}</h3>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link}>
                    <a href="#" className="text-gray-600 hover:text-gray-900 text-sm">
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="border-t border-gray-200 mt-12 pt-8">
          <p className="text-sm text-gray-500">
            © Copyright 2023 - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;