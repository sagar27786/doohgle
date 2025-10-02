import React, { createContext, useEffect, useState, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import { FavoritesProvider } from "./contexts/FavoritesContext";
import Header from "./components/Home/Header";
import MainHero from "./components/Home/MainHero";
import CompanyLogos from "./components/Home/CompanyLogos";
import Statistics from "./components/Home/Statistics";
import DOOHSection from "./components/Home/DOOHSection";
import InteractiveMap from "./components/Home/InteractiveMap";
import GlobalFeed from "./components/Home/GlobalFeed";
import WhyFramen from "./components/Home/WhyFramen";
import SuccessStories from "./components/Home/SuccessStories";
import ContentCreator from "./components/Home/ContentCreator";
import FAQ from "./components/Home/FAQ";
import Contact from "./components/Home/Contact";
import DOOHChatbot from "./components/Home/DOOHChatbot";
import Footer from "./components/Home/Footer";

// Auth components
import LoginSignup from "./components/Auth/LoginSignup";
import Login from "./components/Auth/Login";

import Signup from "./components/Auth/Signup";
import RoleSelect from "./components/Auth/RoleSelect";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import VenueDashboard from "./components/VenueDashboard/VenueDashboard";

// Ads Manager page components
import Page3DStandUp from "./components/adds Manager/Page3DStandUp";
import ChartsSection from "./components/adds Manager/ChartsSection";
import WorldMapSection from "./components/adds Manager/WorldMapSection";
import LottieRowSection from "./components/adds Manager/LottieRowSection";
import VisibilitySection from "./components/adds Manager/VisibilitySection";
import YouTubeSection from "./components/adds Manager/YouTubeSection";
import AdsManagerFooter from "./components/adds Manager/Footer";

// Integrated Ads Manager Dashboard
import IntegratedAdsManager from "./components/adds Manager/Dashboard/IntegratedAdsManager";

// Admin Components
import AdminApp from "./components/Admin/AdminApp";
import LoaderAnimation from "./components/Home/LoaderAnimation";
import ContactPage from "./components/Home/ContactPage";
import AboutUs from "./components/Home/AboutUs";

// ThemeProvider for dark mode
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType>({
  theme: "dark",
  toggleTheme: () => {},
});
export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "dark"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme) => (prevTheme === "light" ? "dark" : "light"));
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Home page component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-gray-200">
      <MainHero />
      <DOOHChatbot />
      <CompanyLogos />
      <Statistics />
      <DOOHSection />
      <InteractiveMap />
      <GlobalFeed />
      <WhyFramen />
      <SuccessStories />
      <ContentCreator />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

// Ads Manager page component - Marketing Landing
const AdsManagerPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Page3DStandUp />
      <VisibilitySection />
      <WorldMapSection />
      <YouTubeSection />
      <ChartsSection />
      <LottieRowSection />
      <AdsManagerFooter />
    </div>
  );
};

// Ads Manager Dashboard - Full Backend Integration
const AdsManagerDashboard = () => {
  return <IntegratedAdsManager />;
};

function AppContent() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  const hideHeaderRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/select-role",
    "/venue-dashboard",
    "/products/ads-manager",
    "/products/ads-manager/dashboard",
    "/admin",
  ];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);

  const handleLoadingComplete = () => {
    setIsLoading(false);
  };
  return (
    <>
      {isLoading && <LoaderAnimation onComplete={handleLoadingComplete} />}
      <div
        className={`min-h-screen bg-white transition-opacity duration-500 ${
          isLoading ? "opacity-0" : "opacity-100"
        }`}
      >
        {shouldShowHeader && <Header />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/about-us" element={<AboutUs />} />
          <Route path="/contact" element={<ContactPage />} />"
          {/* Ads Manager Routes */}
          {/* <Route path="/products/ads-manager" element={<AdsManagerPage />} /> */}
          <Route
            path="/products/ads-manager/dashboard"
            element={<AdsManagerDashboard />}
          />
          {/* Auth Routes */}
          <Route
            path="/auth"
            element={<Login onSwitch={() => navigate("/auth/signup")} />}
          />
          <Route
            path="/auth/signup"
            element={<Signup onSwitch={() => navigate("/auth")} />}
          />
          <Route path="/auth/login" element={<LoginSignup />} />
          {/* Role Selection - Protected but accessible to all authenticated users */}
          <Route
            element={
              <ProtectedRoute
                allowedRoles={["venue_owner", "advertiser", ""]}
              />
            }
          >
            <Route path="/auth/select-role" element={<RoleSelect />} />
          </Route>
          {/* Protected Venue Owner Routes */}
          <Route element={<ProtectedRoute allowedRoles={["venue_owner"]} />}>
            <Route path="/venue-dashboard" element={<VenueDashboard />} />
          </Route>
          {/* Admin Route */}
          <Route path="/admin" element={<AdminApp />} />
          {/* Protected Advertiser Routes */}
          <Route element={<ProtectedRoute allowedRoles={["advertiser"]} />}>
            <Route path="/products/ads-manager" element={<AdsManagerPage />} />
            <Route
              path="/products/ads-manager/dashboard"
              element={<AdsManagerDashboard />}
            />
          </Route>
        </Routes>
      </div>
    </>
  );
}

function App() {
  return (
    <ThemeProvider>
      <FavoritesProvider>
        <AppContent />
      </FavoritesProvider>
    </ThemeProvider>
  );
}

export default App;
