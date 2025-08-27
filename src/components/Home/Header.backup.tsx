import React, { useState, useEffect, useRef } from "react";
import {
  Menu,
  X,
  ChevronDown,
  Monitor,
  Target,
  Sun,
  Moon,
  Map,
  Navigation2,
  LogOut,
  User,
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../App"; // Assuming ThemeProvider is in App.jsx
import { authService } from "../../services/authService";
import BookingNotificationCenter from "../Notifications/BookingNotificationCenter";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [isAuthenticated, setIsAuthenticated] = useState(authService.isAuthenticated());
  const [currentUser, setCurrentUser] = useState(authService.getCurrentUser());

  const { theme, toggleTheme } = useTheme() as {
    theme: string;
    toggleTheme: () => void;
  };

  const productsMenuRef = useRef(null);
  const userMenuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProductsMenu = () => setIsProductsOpen(!isProductsOpen);
  const toggleUserMenu = () => setIsUserMenuOpen(!isUserMenuOpen);

  const handleLogout = () => {
    authService.logout();
    setIsAuthenticated(false);
    setCurrentUser(null);
    setIsUserMenuOpen(false);
    navigate('/');
  };

  // Update auth state when it changes
  useEffect(() => {
    const checkAuth = () => {
      setIsAuthenticated(authService.isAuthenticated());
      setCurrentUser(authService.getCurrentUser());
    };

    window.addEventListener('storage', checkAuth);
    return () => window.removeEventListener('storage', checkAuth);
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productsMenuRef.current &&
        event.target instanceof Node &&
        !(productsMenuRef.current as HTMLElement).contains(event.target)
      ) {
        setIsProductsOpen(false);
      }
      
      if (
        userMenuRef.current &&
        event.target instanceof Node &&
        !(userMenuRef.current as HTMLElement).contains(event.target)
      ) {
        setIsUserMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Scroll effect to hide/show navbar
  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const screenHeight = window.innerHeight;

      // If scrolled down more than screen height, hide navbar
      if (currentScrollY > screenHeight && currentScrollY > lastScrollY) {
        setIsVisible(false);
      }
      // If scrolling up or at top, show navbar
      else if (currentScrollY < lastScrollY || currentScrollY < 100) {
        setIsVisible(true);
      }

      setLastScrollY(currentScrollY);
    };

    // Throttle scroll events for better performance
    let timeoutId: ReturnType<typeof setTimeout> | null = null;
    const throttledHandleScroll = () => {
      if (timeoutId === null) {
        timeoutId = setTimeout(() => {
          handleScroll();
          timeoutId = null;
        }, 10);
      }
    };

    window.addEventListener("scroll", throttledHandleScroll);
    return () => window.removeEventListener("scroll", throttledHandleScroll);
  }, [lastScrollY]);

  interface NavLinkProps {
    to: string;
    children: React.ReactNode;
  }

  const NavLink = ({ to, children }: NavLinkProps) => (
    <Link
      to={to}
      className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-base font-medium transition-colors"
    >
      {children}
    </Link>
  );

  interface ProductLinkProps {
    to: string;
    icon: React.ReactNode;
    title: string;
    subtitle: string;
  }

  const ProductLink = ({ to, icon, title, subtitle }: ProductLinkProps) => (
    <Link
      to={to}
      className="flex items-center p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
      onClick={() => {
        setIsProductsOpen(false);
        setIsMenuOpen(false);
      }}
    >
      <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
        {icon}
      </div>
      <div className="ml-4">
        <p className="font-semibold text-gray-900 dark:text-white">{title}</p>
        <p className="text-sm text-gray-500 dark:text-gray-400">{subtitle}</p>
      </div>
    </Link>
  );

  return (
    <header
      className={`bg-white/80 dark:bg-slate-950 backdrop-blur-sm sticky top-0 z-50 border-b border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
        isVisible ? "translate-y-0" : "-translate-y-full"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0">
            <Link
              to="/"
              className="text-2xl font-bold text-gray-900 dark:text-white"
            >
              <span className="text-indigo-600">◊</span> DOOHGLE
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
            {/* Only show Products menu if authenticated */}
            {isAuthenticated && (
              <div className="relative" ref={productsMenuRef}>
                <button
                  onClick={toggleProductsMenu}
                  className="flex items-center text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 text-base font-medium transition-colors"
                >
                  Products
                  <ChevronDown
                    className={`ml-1 h-5 w-5 transition-transform duration-200 ${
                      isProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProductsOpen && (
                  <div className="absolute top-full left-0 mt-3 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-down">
                    <div className="p-4 space-y-2">
                      <ProductLink
                        to="/products/ads-manager"
                        icon={<Target className="h-6 w-6 text-purple-500" />}
                        title="Ads Manager"
                        subtitle="Create targeted ad campaigns"
                      />
                      <ProductLink
                        to="/products/ads-manager/dashboard"
                        icon={<Monitor className="h-6 w-6 text-green-500" />}
                        title="Campaign Dashboard"
                        subtitle="Manage campaigns & screens"
                      />
                      <ProductLink
                        to="/map"
                        icon={<Map className="h-6 w-6 text-blue-600" />}
                        title="Interactive Map"
                        subtitle="Explore Indian digital billboard locations"
                      />
                      <ProductLink
                        to="/map-dashboard"
                        icon={<Navigation2 className="h-6 w-6 text-purple-600" />}
                        title="Maps Dashboard"
                        subtitle="Real-time analytics with Indian maps"
                      />
                    </div>
                  </div>
                )}
              </div>
            )}
            <NavLink to="/solutions">Solutions</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/resources">Resources</NavLink>
          </nav>

          {/* Right side buttons & Toggles */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/contact">Contact</NavLink>
              
              {/* Authentication Section */}
              {!isAuthenticated ? (
                <button
                  onClick={() => navigate("/auth")}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-md text-sm font-medium hover:bg-indigo-700 transition-colors"
                >
                  Login / Sign up
                </button>
              ) : (
                <div className="flex items-center space-x-3">
                  {/* Booking Notifications */}
                  <BookingNotificationCenter />
                  
                  {/* User Menu */}
                  <div className="relative" ref={userMenuRef}>
                    <button
                      onClick={toggleUserMenu}
                      className="flex items-center space-x-2 text-gray-700 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 px-3 py-2 rounded-lg transition-colors"
                    >
                      <User className="h-5 w-5" />
                      <span className="text-sm font-medium">
                        {currentUser?.name || 'User'}
                      </span>
                      <ChevronDown className="h-4 w-4" />
                    </button>
                    
                    {isUserMenuOpen && (
                      <div className="absolute right-0 top-full mt-2 w-48 bg-white dark:bg-slate-800 rounded-lg shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden">
                        <div className="py-1">
                          <div className="px-4 py-2 text-xs text-gray-500 dark:text-gray-400 border-b border-slate-200 dark:border-slate-700">
                            {currentUser?.role === 'venue_owner' ? 'Venue Owner' : 'Advertiser'}
                          </div>
                          <Link
                            to={currentUser?.role === 'venue_owner' ? '/venue-dashboard' : '/products/ads-manager/dashboard'}
                            className="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-slate-700"
                            onClick={() => setIsUserMenuOpen(false)}
                          >
                            Dashboard
                          </Link>
                          <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-slate-700 flex items-center space-x-2"
                          >
                            <LogOut className="h-4 w-4" />
                            <span>Logout</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
                </div>
              )}
            </div>
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-gray-600 dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-4"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="h-6 w-6" />
              ) : (
                <Sun className="h-6 w-6" />
              )}
            </button>
            {/* Mobile Menu Button */}
            <div className="md:hidden ml-2">
              <button
                onClick={toggleMenu}
                className="p-2 rounded-md text-gray-700 dark:text-gray-300"
              >
                {isMenuOpen ? (
                  <X className="h-7 w-7" />
                ) : (
                  <Menu className="h-7 w-7" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t border-slate-200 dark:border-slate-800">
          <div className="px-2 pt-2 pb-3 space-y-1">
            <button
              onClick={toggleProductsMenu}
              className="flex items-center justify-between w-full px-3 py-3 text-base font-medium text-gray-800 dark:text-gray-200 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Products
              <ChevronDown
                className={`h-5 w-5 transition-transform ${
                  isProductsOpen ? "rotate-180" : ""
                }`}
              />
            </button>
            {isProductsOpen && (
              <div className="pl-4 space-y-1 border-l-2 border-slate-200 dark:border-slate-700 ml-3">
                <ProductLink
                  to="/products/screen-manager"
                  icon={<Monitor className="h-5 w-5 text-blue-500" />}
                  title="Screen Manager"
                  subtitle="Manage your screens"
                />
                <ProductLink
                  to="/products/ads-manager"
                  icon={<Target className="h-5 w-5 text-purple-500" />}
                  title="Ads Manager"
                  subtitle="Create ad campaigns"
                />
                <ProductLink
                  to="/products/ads-manager/dashboard"
                  icon={<Monitor className="h-5 w-5 text-green-500" />}
                  title="Campaign Dashboard"
                  subtitle="Manage campaigns"
                />
              </div>
            )}
            <Link
              to="/solutions"
              onClick={toggleMenu}
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Solutions
            </Link>
            <Link
              to="/pricing"
              onClick={toggleMenu}
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Pricing
            </Link>
            <Link
              to="/resources"
              onClick={toggleMenu}
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Resources
            </Link>
            <Link
              to="/contact"
              onClick={toggleMenu}
              className="block px-3 py-3 rounded-md text-base font-medium text-gray-700 dark:text-gray-300 hover:bg-slate-100 dark:hover:bg-slate-800"
            >
              Contact
            </Link>
            <Link
              to="/login"
              onClick={toggleMenu}
              className="block w-full text-center bg-indigo-600 text-white px-3 py-3 mt-2 rounded-md text-base font-medium hover:bg-indigo-700"
            >
              Login / Sign up
            </Link>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
