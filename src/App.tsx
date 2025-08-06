import React, { createContext, useEffect, useState, useContext } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Header from "./components/Home/Header";
import HeroCarousel from "./components/Home/HeroCarousel";
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
import TestimonialCarousel from "./components/Screen Manager/TestimonialCarousel";

// Ads Manager page components
import AdsManagerHeader from "./components/adds Manager/Header";
import AddsManagerNavigation from "./components/adds Manager/AddsManagerNavigation";
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

// Theme types
type Theme = 'light' | 'dark';
interface ThemeContextType {
  theme: Theme;
  toggleTheme: () => void;
}

// ThemeProvider for dark mode
const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useTheme = (): ThemeContextType => {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return context;
};

interface ThemeProviderProps {
  children: React.ReactNode;
}

const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<Theme>(
    () => (localStorage.getItem("theme") as Theme) || "light"
  );

  useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    root.classList.add(theme);
    localStorage.setItem("theme", theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme((prevTheme: Theme) => (prevTheme === "light" ? "dark" : "light"));
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
    <div className="min-h-screen bg-white">
      {/* <HeroCarousel />  */}
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
    <div className="min-h-screen bg-white">
      <ScreenManagerHeader />
      <ScreenManagerHero />
      <FeaturesSection />
      <MonetizeSection />
      <TestimonialCarousel />
      <DeviceSection />
      <EntertainmentSection />
      <CompanyAnimation />
      <PricingSection />
      <ResourcesSection />
      <ScreenManagerFooter />
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
  return (
    <Router>
      <ThemeProvider>
        <div className="min-h-screen bg-white">
          <Header />
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route
              path="/products/screen-manager"
              element={<ScreenManagerPage />}
            />
            <Route path="/products/ads-manager" element={<AdsManagerPage />} />
          </Routes>
        </div>
      </ThemeProvider>
    </Router>
  );
}

export default App;
