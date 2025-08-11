import React, { createContext, useEffect, useState, useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
  useNavigate,
} from "react-router-dom";
import Header from "./components/Home/Header";
import HeroCarousel from "./components/Home/HeroCarousel";
import HeroVideo from "./components/Home/HeroVideo";
import Parallax from "./components/Home/Parallax";
import MainHero from "./components/Home/MainHero";
import CompanyLogos from "./components/Home/CompanyLogos";
import Statistics from "./components/Home/Statistics";
import DOOHSection from "./components/Home/DOOHSection";
import InteractiveMap from "./components/Home/InteractiveMap";
import GlobalFeed from "./components/Home/GlobalFeed";
import WhyFramen from "./components/Home/WhyFramen";
import SuccessStories from "./components/Home/SuccessStories";
import ContentCreator from "./components/Home/ContentCreator";
import ScreenManager from "./components/Home/ScreenManager";
import FAQ from "./components/Home/FAQ";
import Contact from "./components/Home/Contact";
import Footer from "./components/Home/Footer";

// Screen Manager page components
import ScreenManagerHeader from "./components/Screen Manager/Header";
import ScreenManagerHero from "./components/Screen Manager/HeroSection";
import FeaturesSection from "./components/Screen Manager/FeaturesSection";
import DeviceSection from "./components/Screen Manager/DeviceSection";
import EntertainmentSection from "./components/Screen Manager/EntertainmentSection";
import CompanyAnimation from "./components/Screen Manager/CompanyAnimation";
import PricingSection from "./components/Screen Manager/PricingSection";
import ResourcesSection from "./components/Screen Manager/ResourcesSection";
import ScreenManagerFooter from "./components/Screen Manager/Footer";
import MonetizeSection from "./components/Screen Manager/MonetizeSection";
import LoginSignup from "./components/Auth/LoginSignup";
import Login from "./components/Auth/Login";
import Signup from "./components/Auth/Signup";

// Ads Manager page components
import AdsManagerHeader from "./components/adds Manager/Header";

import Page3DStandUp from "./components/adds Manager/Page3DStandUp";
import AdsManagerHero from "./components/adds Manager/HeroSection";
import AdsManagerFeatureSection from "./components/adds Manager/FeatureSection";
import ChartsSection from "./components/adds Manager/ChartsSection";
import DashboardSection from "./components/adds Manager/DashboardSection";
import DashboardClaritySection from "./components/adds Manager/DashboardClaritySection";
import VideoSection from "./components/adds Manager/VideoSection";
import VideoFeatureSection from "./components/adds Manager/VideoFeatureSection";
import WorldMapSection from "./components/adds Manager/WorldMapSection";
import WorldMapVideoSection from "./components/adds Manager/WorldMapVideoSection";
import BillingSection from "./components/adds Manager/BillingSection";
import LottieRowSection from "./components/adds Manager/LottieRowSection";
import ScrollTextSection from "./components/adds Manager/ScrollTextSection";
import VisibilitySection from "./components/adds Manager/VisibilitySection";
import YouTubeSection from "./components/adds Manager/YouTubeSection";
import AdsManagerFooter from "./components/adds Manager/Footer";
import HowItWorks from "./components/Home/HowItWorks";
import ImageComparisonSlider from "./components/Home/ImageComparisonSlider";
import ContactPage from "./components/Home/ContactPage";

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
  const [theme, setTheme] = useState(
    () => localStorage.getItem("theme") || "light"
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
      {/* <HeroCarousel />  */}
      <MainHero />
      <ImageComparisonSlider
        beforeImage="https://images.unsplash.com/photo-1752564020971-086a96380302?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
        afterImage="https://images.unsplash.com/photo-1754404053337-7363006e4391?q=80&w=1470&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
      />
      <CompanyLogos />
      <Statistics />
      <DOOHSection />
      <InteractiveMap />
      <HowItWorks />
      <GlobalFeed />
      <WhyFramen />
      <SuccessStories />
      <ContentCreator />
      <ScreenManager />
      <FAQ />
      <Contact />
      <Footer />
    </div>
  );
};

// Screen Manager page component
const ScreenManagerPage = () => {
  return (
    <div className="h-screen bg-white">
      <ScreenManagerHero />
    </div>
  );
};

// Ads Manager page component
const AdsManagerPage = () => {
  return (
    <div className="min-h-screen bg-white">
      <Page3DStandUp />
      <VisibilitySection />
      <WorldMapSection />
      <YouTubeSection />
      {/* <AdsManagerHero /> */}
      {/* <DashboardSection /> */}
      {/* <DashboardClaritySection /> */}
      {/* <AdsManagerFeatureSection /> */}
      {/* <VideoFeatureSection title={""} videoUrl={""} /> */}
      {/* <BillingSection /> */}
      <ChartsSection />
      <LottieRowSection />
      {/* <ScrollTextSection /> */}
      {/* <VideoSection title={""} videoUrl={""} /> */}
      <AdsManagerFooter />
    </div>
  );
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();
  const hideHeaderRoutes = ["/auth/login", "/products/screen-manager"];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white">
        {shouldShowHeader && <Header />}
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products/screen-manager"
            element={<ScreenManagerPage />}
          />
          <Route path="/products/ads-manager" element={<AdsManagerPage />} />
          <Route
            path="/auth"
            element={<Login onSwitch={() => navigate("/auth/signup")} />}
          />
          <Route
            path="/auth/signup"
            element={<Signup onSwitch={() => navigate("/auth")} />}
          />
          <Route path="/contact" element={<ContactPage />} />
          <Route path="/auth/login" element={<LoginSignup />} />
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
