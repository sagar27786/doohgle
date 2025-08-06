import React from "react";
import { Menu, X, ChevronDown, Monitor, Target } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = React.useState(false);
  const [isProductsOpen, setIsProductsOpen] = React.useState(false);

  return (
    <header className="bg-white shadow-sm border-b border-gray-100 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <Link to="/" className="text-2xl font-bold text-gray-900">
                <span className="text-gray-600">◊</span> FRAMEN
              </Link>
            </div>
          </div>

          <nav className="hidden md:flex space-x-8">
            <div className="relative group">
              <button
                className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                onMouseEnter={() => setIsProductsOpen(true)}
                onMouseLeave={() => setIsProductsOpen(false)}
              >
                Products
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>

              {isProductsOpen && (
                <div
                  className="absolute top-full left-0 mt-2 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                  onMouseEnter={() => setIsProductsOpen(true)}
                  onMouseLeave={() => setIsProductsOpen(false)}
                >
                  <div className="p-4">
                    <div className="space-y-3">
                      <Link
                        to="/products/screen-manager"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProductsOpen(false)}
                      >
                        <div className="bg-blue-100 p-2 rounded-lg mr-3">
                          <Monitor className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Screen Manager
                          </div>
                          <div className="text-sm text-gray-600">
                            Manage and monetize your screens
                          </div>
                        </div>
                      </Link>
                      <Link
                        to="/products/ads-manager"
                        className="flex items-center p-3 rounded-lg hover:bg-gray-50 transition-colors"
                        onClick={() => setIsProductsOpen(false)}
                      >
                        <div className="bg-purple-100 p-2 rounded-lg mr-3">
                          <Target className="h-5 w-5 text-purple-600" />
                        </div>
                        <div>
                          <div className="font-semibold text-gray-900">
                            Ads Manager
                          </div>
                          <div className="text-sm text-gray-600">
                            Create and manage targeted ad campaigns
                          </div>
                        </div>
                      </Link>
                    </div>
                  </div>
                </div>
              )}
            </div>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Solutions
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Pricing
            </Link>
            <div className="relative group">
              <button className="flex items-center text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium">
                Resources
                <ChevronDown className="ml-1 h-4 w-4" />
              </button>
            </div>
          </nav>

          <div className="hidden md:flex items-center space-x-4">
            <Link
              to="/"
              className="text-gray-700 hover:text-gray-900 px-3 py-2 text-sm font-medium"
            >
              Contact
            </Link>
            <button
              onClick={() => navigate("/auth/login")}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
            >
              Login / Sign up
            </button>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="text-gray-700 hover:text-gray-900 p-2"
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
          <div className="md:hidden border-t border-gray-200">
            <div className="px-2 pt-2 pb-3 space-y-1">
              <div className="space-y-2">
                <button
                  onClick={() => setIsProductsOpen(!isProductsOpen)}
                  className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
                >
                  Products
                  <ChevronDown
                    className={`h-4 w-4 transition-transform ${
                      isProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProductsOpen && (
                  <div className="pl-4 space-y-2">
                    <Link
                      to="/products/screen-manager"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Monitor className="h-4 w-4 mr-2 text-blue-600" />
                      Screen Manager
                    </Link>
                    <Link
                      to="/products/ads-manager"
                      className="flex items-center px-3 py-2 text-sm text-gray-600 hover:text-gray-900"
                      onClick={() => setIsMenuOpen(false)}
                    >
                      <Target className="h-4 w-4 mr-2 text-purple-600" />
                      Ads Manager
                    </Link>
                  </div>
                )}
              </div>
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Solutions
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Pricing
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Resources
              </Link>
              <Link
                to="/"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900"
              >
                Contact
              </Link>
              <button className="w-full text-left bg-indigo-600 text-white px-3 py-2 rounded-md text-base font-medium hover:bg-indigo-700 transition-colors">
                Login / Sign up
              </button>
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
