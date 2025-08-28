import React, { createContext, useEffect, useState, useContext } from "react";
import { Routes, Route, useLocation, useNavigate } from "react-router-dom";
import Header from "./components/Home/Header";
import HeroVideo from "./components/Home/HeroVideo";
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

// ThemeProvider for dark mode
interface ThemeContextType {
  theme: string;
  toggleTheme: () => void;
}
const ThemeContext = createContext<ThemeContextType>({
  theme: "light",
  toggleTheme: () => {},
});

export const useTheme = () => useContext(ThemeContext);

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme") || "light";
    setTheme(savedTheme);
    document.documentElement.setAttribute("data-theme", savedTheme);
  }, []);

  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

// Home page component
const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      <MainHero />
      <HeroVideo />
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

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeaderRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/select-role",
    "/venue-dashboard",
    "/products/ads-manager",
    "/products/ads-manager/dashboard",
  ];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white">
        {shouldShowHeader && <Header />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />

          {/* Ads Manager Routes */}
          <Route path="/products/ads-manager" element={<AdsManagerPage />} />
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
          <Route element={<ProtectedRoute allowedRoles={['venue_owner', 'advertiser', '']} />}>
            <Route path="/auth/select-role" element={<RoleSelect />} />
          </Route>
          
          {/* Protected Venue Owner Routes */}
          <Route element={<ProtectedRoute allowedRoles={["venue_owner"]} />}>
            <Route path="/venue-dashboard" element={<VenueDashboard />} />
          </Route>

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
    </ThemeProvider>
  );
}

export default App;