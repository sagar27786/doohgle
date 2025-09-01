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
} from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTheme } from "../../contexts/ThemeContext";

const Header = () => {
  const navigate = useNavigate();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProductsOpen, setIsProductsOpen] = useState(false);
  const [isMobileProductsOpen, setIsMobileProductsOpen] = useState(false);
  const [isVisible, setIsVisible] = useState(true);

  const { theme, toggleTheme } = useTheme() as {
    theme: string;
    toggleTheme: () => void;
  };

  const productsMenuRef = useRef(null);

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);
  const toggleProductsMenu = () => setIsProductsOpen(!isProductsOpen);
  const toggleMobileProductsMenu = () =>
    setIsMobileProductsOpen(!isMobileProductsOpen);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        productsMenuRef.current &&
        event.target instanceof Node &&
        !(productsMenuRef.current as HTMLElement).contains(event.target)
      ) {
        setIsProductsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close mobile menu when screen size changes
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) {
        setIsMenuOpen(false);
        setIsMobileProductsOpen(false);
      }
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  interface NavLinkProps {
    to: string;
    children: React.ReactNode;
    onClick?: () => void;
  }

  const NavLink = ({ to, children, onClick }: NavLinkProps) => (
    <Link
      to={to}
      className="text-gray-600 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors"
      onClick={onClick}
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
        setIsMobileProductsOpen(false);
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

  const MobileNavLink = ({ to, children }: NavLinkProps) => (
    <Link
      to={to}
      className="block px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
      onClick={() => setIsMenuOpen(false)}
    >
      {children}
    </Link>
  );

  return (
    <>
      <header
        className={`bg-[#babcce] dark:bg-slate-950 backdrop-blur-sm sticky top-0 z-[9999] border-b border-slate-200 dark:border-slate-800 transform transition-transform duration-300 ease-in-out ${
          isVisible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="flex items-center h-20 mx-[5%] lg:mx-[10%]">
          {/* Left side: Logo + Nav */}
          <div className="flex items-center space-x-6">
            <Link
              to="/"
              className="text-xl lg:text-2xl font-bold text-gray-900 dark:text-white whitespace-nowrap"
            >
              {/* <span className="text-purple-600">{logo}</span> */}
              DOOHGLE MEDIA
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center space-x-2">
              <div className="relative" ref={productsMenuRef}>
                <button
                  onClick={toggleProductsMenu}
                  className="flex items-center text-black dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 px-3 py-2 text-base font-medium transition-colors"
                >
                  Products
                  <ChevronDown
                    className={`ml-1 h-5 w-5 transition-transform duration-200 ${
                      isProductsOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
                {isProductsOpen && (
                  <div className="absolute top-full left-0 mt-3 w-96 bg-white dark:bg-slate-800 rounded-xl shadow-lg border border-slate-200 dark:border-slate-700 overflow-hidden animate-fade-in-down z-50">
                    <div className="p-4 space-y-2">
                      <button
                        onClick={() => {
                          const el = document.getElementById("screen-manager");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                          setIsProductsOpen(false);
                          setIsMenuOpen(false);
                          setIsMobileProductsOpen(false);
                        }}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                          <Monitor className="h-6 w-6 text-blue-500" />
                        </div>
                        <div className="ml-4 text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Screen Manager
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Manage and monetize your screens
                          </p>
                        </div>
                      </button>

                      <button
                        onClick={() => {
                          const el = document.getElementById("ads-manager");
                          if (el) {
                            el.scrollIntoView({ behavior: "smooth" });
                          }
                          setIsProductsOpen(false);
                          setIsMenuOpen(false);
                          setIsMobileProductsOpen(false);
                        }}
                        className="flex items-center w-full p-3 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors"
                      >
                        <div className="flex-shrink-0 w-10 h-10 flex items-center justify-center bg-white dark:bg-slate-800/50 rounded-lg shadow-sm border border-slate-200 dark:border-slate-700">
                          <Target className="h-6 w-6 text-purple-500" />
                        </div>
                        <div className="ml-4 text-left">
                          <p className="font-semibold text-gray-900 dark:text-white">
                            Ads Manager
                          </p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            Create targeted ad campaigns
                          </p>
                        </div>
                      </button>
                    </div>
                  </div>
                )}
              </div>
              <NavLink to="/about-us">About Us</NavLink>
            </nav>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-2">
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
                      to="/products/screen-manager"
                      icon={<Monitor className="h-6 w-6 text-blue-500" />}
                      title="Screen Manager"
                      subtitle="Manage and monetize your screens"
                    />
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
            <NavLink to="/solutions">Solutions</NavLink>
            <NavLink to="/pricing">Pricing</NavLink>
            <NavLink to="/resources">Resources</NavLink>
          </nav>

          {/* Right side buttons & Toggles */}
          <div className="flex items-center">
            <div className="hidden md:flex items-center space-x-4">
              <NavLink to="/contact">Contact</NavLink>
              <button
                onClick={() => navigate("/auth")}
                className="btn-damn btn-outline"
              >
                <span className="relative z-10 flex items-center space-x-2">
                  <span className="purple-gray-gradient">Login / Sign up</span>
                </span>
              </button>
            </div>

            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-full text-black dark:text-gray-300 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors ml-4"
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
                className="p-2 rounded-md text-black dark:text-gray-300"
                aria-label="Toggle mobile menu"
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
      </header>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 shadow-lg relative z-[9998]">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {/* Mobile Products Dropdown */}
            <div>
              <button
                onClick={toggleMobileProductsMenu}
                className="flex items-center justify-between w-full px-3 py-2 text-base font-medium text-gray-700 dark:text-gray-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
              >
                Products
                <ChevronDown
                  className={`h-5 w-5 transition-transform duration-200 ${
                    isMobileProductsOpen ? "rotate-180" : ""
                  }`}
                />
              </button>
              {isMobileProductsOpen && (
                <div className="pl-4 space-y-1">
                  <button
                    onClick={() => {
                      const el = document.getElementById("screen-manager");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                      setIsMenuOpen(false);
                      setIsMobileProductsOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Monitor className="h-5 w-5 text-blue-500 mr-3" />
                    <div>
                      <div className="font-medium">Screen Manager</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Manage and monetize your screens
                      </div>
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      const el = document.getElementById("ads-manager");
                      if (el) {
                        el.scrollIntoView({ behavior: "smooth" });
                      }
                      setIsMenuOpen(false);
                      setIsMobileProductsOpen(false);
                    }}
                    className="flex items-center w-full px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors"
                  >
                    <Target className="h-5 w-5 text-purple-500 mr-3" />
                    <div className="text-left">
                      <div className="font-medium">Ads Manager</div>
                      <div className="text-xs text-gray-500 dark:text-gray-500">
                        Create targeted ad campaigns
                      </div>
                    </div>
                  </button>
                </div>
              )}
            </div>

            <MobileNavLink to="/about-us">About Us</MobileNavLink>
            <MobileNavLink to="/contact">Contact</MobileNavLink>

            {/* Mobile Auth Button */}
            <div className="px-3 py-2">
              <button
                onClick={() => {
                  navigate("/auth");
                  setIsMenuOpen(false);
                }}
                className="
                  w-full relative px-4 py-2 rounded-md text-sm font-medium transition-colors shadow-sm
                  bg-white text-gray-900
                  dark:bg-gray-800 dark:text-white dark:hover:bg-gray-700
                "
              >
                <span className="relative z-10 flex items-center justify-center space-x-2">
                  <span className="text-lg"></span>
                  <span className="purple-gray-gradient">Login / Sign up</span>
                </span>
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
