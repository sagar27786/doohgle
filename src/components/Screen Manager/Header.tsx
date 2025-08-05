import React, { useState } from "react";
import { Menu, X, Monitor, ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-4">
            <button
              onClick={() => navigate("/")}
              className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </button>
            <div className="flex items-center space-x-2">
              <Monitor className="h-8 w-8 text-purple-600" />
              <span className="text-xl font-bold text-gray-900">FRAMEN</span>
            </div>
          </div>

          <nav className="hidden md:flex items-center space-x-8">
            <a
              href="#products"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Products
            </a>
            <a
              href="#solutions"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Solutions
            </a>
            <a
              href="#pricing"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#resources"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Resources
            </a>
            <a
              href="#contact"
              className="text-gray-700 hover:text-purple-600 transition-colors"
            >
              Contact
            </a>
            <button className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Login / Sign up
            </button>
          </nav>

          <button
            className="md:hidden p-2"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? (
              <X className="h-6 w-6" />
            ) : (
              <Menu className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden bg-white border-t border-gray-200">
          <div className="px-4 py-2 space-y-2">
            <button
              onClick={() => navigate("/")}
              className="flex items-center w-full py-2 text-gray-700"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </button>
            <a href="#products" className="block py-2 text-gray-700">
              Products
            </a>
            <a href="#solutions" className="block py-2 text-gray-700">
              Solutions
            </a>
            <a href="#pricing" className="block py-2 text-gray-700">
              Pricing
            </a>
            <a href="#resources" className="block py-2 text-gray-700">
              Resources
            </a>
            <a href="#contact" className="block py-2 text-gray-700">
              Contact
            </a>
            <button className="w-full bg-purple-600 text-white px-4 py-2 rounded-lg mt-4">
              Login / Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
