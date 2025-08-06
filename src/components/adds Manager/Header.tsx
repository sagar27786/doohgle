import React from "react";
import { Menu, X, Target } from "lucide-react";
import { Link } from "react-router-dom";

const Header: React.FC = () => {
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/95 backdrop-blur-md border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                <span className="text-gray-600">◊</span> FRAMEN
              </Link>
            </div>
            <div className="ml-6 flex items-center">
              <Target className="h-5 w-5 text-purple-600 mr-2" />
              <span className="text-lg font-semibold text-purple-600">
                Ads Manager
              </span>
            </div>
          </div>

          <nav className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              <Link
                to="/products/screen-manager"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Screen Manager
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Solutions
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Pricing
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Resources
              </Link>
              <Link
                to="/"
                className="text-gray-700 hover:text-purple-600 transition-colors"
              >
                Contact
              </Link>
            </div>
          </nav>

          <div className="hidden md:block">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition-colors">
              Login / Sign up
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {isMenuOpen && (
        <div className="md:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-white border-t">
            <Link
              to="/products/screen-manager"
              className="text-gray-700 hover:text-purple-600 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Screen Manager
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Solutions
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Resources
            </Link>
            <Link
              to="/"
              className="text-gray-700 hover:text-purple-600 block px-3 py-2"
              onClick={() => setIsMenuOpen(false)}
            >
              Contact
            </Link>
            <button className="w-full bg-purple-600 text-white px-3 py-2 rounded-lg hover:bg-purple-700 transition-colors mt-2">
              Login / Sign up
            </button>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
