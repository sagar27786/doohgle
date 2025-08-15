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
import ScreenManager from "./components/Home/ScreenManager";
import FAQ from "./components/Home/FAQ";
import Contact from "./components/Home/Contact";
import Footer from "./components/Home/Footer";

// Screen Manager page components
import ScreenManagerDashboard from "./components/Screen Manager/ScreenManagerDashboard";

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
  return <ScreenManagerDashboard />;
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
          <Route path="/products/screen-manager" element={<ScreenManagerPage />} />
          <Route path="/ScreenManagerDashboard" element={<ScreenManagerDashboard />} />
          <Route path="/products/ads-manager" element={<AdsManagerPage />} />
          {/* Auth Routes */}
          <Route path="/auth" element={<Login onSwitch={() => navigate("/auth/signup")} />} />
          <Route path="/auth/signup" element={<Signup onSwitch={() => navigate("/auth")} />} />
          <Route path="/auth/login" element={<LoginSignup />} />
          <Route path="/auth/select-role" element={<RoleSelect />} />
          
          {/* Protected Venue Owner Routes */}
          <Route element={<ProtectedRoute allowedRoles={['venue_owner']} />}>
            <Route path="/venue-dashboard" element={<VenueDashboard />} />
          </Route>

          {/* Protected Advertiser Routes */}
          <Route element={<ProtectedRoute allowedRoles={['advertiser']} />}>
            <Route path="/ScreenManagerDashboard" element={<ScreenManagerDashboard />} />
            <Route path="/products/ads-manager" element={<AdsManagerPage />} />
          </Route>
        </Routes>
      </div>
    </ThemeProvider>
  );
}

export default App;
