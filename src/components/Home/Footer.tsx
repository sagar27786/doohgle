import React from "react";

const Footer = () => {
  const footerLinks = {
    DOOGLE: ["About us", "Career", "News & Blog", "Contact"],
    Products: [
      "Ads Manager",
      "Screen Manager",
      "Creator",
      "Dashboard",
      "Hardware",
    ],
    Resources: [
      "Agency Program",
      "Developers / API",
      "Screen Locations",
      "Success Stories",
      "Become a Publisher",
    ],
    Support: ["Help Center", "Data & Privacy", "Terms & Conditions", "Imprint"],
  };

  return (
    <footer className="bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-700 py-16 transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          {/* Logo and company info section */}
          <div className="lg:col-span-4 text-center lg:text-left">
            <div className="text-2xl font-bold text-gray-900 dark:text-white mb-4 inline-block lg:block">
              <span className="text-gray-600 dark:text-slate-400">◊</span>{" "}
              DOOHGLE
            </div>
            <p className="text-sm text-gray-600 dark:text-slate-400 mb-4">
              Part of Axel Springer SE
            </p>
            <p className="text-sm font-semibold text-gray-900 dark:text-white">
              axel springer.
            </p>

            {/* Social media icons */}
            <div className="flex space-x-3 mt-6 justify-center lg:justify-start">
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

          {/* Footer links container */}
          <div className="lg:col-span-8 grid grid-cols-2 md:grid-cols-4 gap-8">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category} className="text-center sm:text-left">
                <h3 className="font-semibold text-gray-900 dark:text-white mb-4">
                  {category}
                </h3>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link}>
                      <a
                        href="#"
                        className="text-gray-600 dark:text-slate-300 hover:text-gray-900 dark:hover:text-white text-sm transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        {/* Copyright section */}
        <div className="border-t border-gray-200 dark:border-slate-700 mt-12 pt-8 text-center lg:text-left">
          <p className="text-sm text-gray-500 dark:text-slate-400">
            © Copyright 2025 - All rights reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
