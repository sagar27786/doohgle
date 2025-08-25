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
import ProfessionalVenueDashboard from "./components/VenueDashboard/ProfessionalVenueDashboard";

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

// Campaign Components
import CampaignCreationWorkflow from "./components/Campaign/CampaignCreationWorkflow";

// Notification Components
import NotificationBar from "./components/Notifications/NotificationBar";

// Auth Service
import { authService } from "./services/authService";

// Add NotificationService to window for debugging
import NotificationService from "./services/notificationService";

// Map Components
import MapDemo from "./pages/MapDemo";
import MapDashboardPage from "./pages/MapDashboardPage";
import MapQuickNav from "./components/Navigation/MapQuickNav";

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

// Ads Manager page component - Marketing Landing
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

// Ads Manager Dashboard - Full Backend Integration
const AdsManagerDashboard = () => {
  return <IntegratedAdsManager />;
};

function App() {
  const location = useLocation();
  const navigate = useNavigate();

  // Add debug functionality for testing notifications
  useEffect(() => {
    // Add to window for console debugging
    (window as any).testNotifications = {
      addTestBooking: () => {
        const service = NotificationService.getInstance();
        const id = service.addTestBookingRequest();
        console.log("Test booking request created with ID:", id);
        return id;
      },
      acceptBooking: (id: string) => {
        const service = NotificationService.getInstance();
        service.acceptBookingRequest(id);
        console.log("Accepted booking request:", id);
      },
      rejectBooking: (id: string) => {
        const service = NotificationService.getInstance();
        service.rejectBookingRequest(id);
        console.log("Rejected booking request:", id);
      },
      getRequests: () => {
        const service = NotificationService.getInstance();
        const requests = service.getPendingBookingRequests();
        console.log("Current booking requests:", requests);
        return requests;
      },
    };
  }, []);

  // Helper function to determine user type
  const getUserType = (): "screen_manager" | "ads_manager" => {
    const currentUser = authService.getCurrentUser();
    if (
      currentUser?.role === "venue_owner" ||
      currentUser?.roles?.includes("venue_owner")
    ) {
      return "screen_manager";
    }
    // Default to ads_manager for advertisers or any other users
    return "ads_manager";
  };

  const hideHeaderRoutes = [
    "/auth/login",
    "/auth/signup",
    "/auth/select-role",
    "/products/screen-manager",
    "/venue-dashboard",
    "/products/ads-manager",
    "/products/ads-manager/dashboard",
  ];
  const shouldShowHeader = !hideHeaderRoutes.includes(location.pathname);
  return (
    <ThemeProvider>
      <div className="min-h-screen bg-white">
        {shouldShowHeader && <Header />}
        {shouldShowHeader && <NotificationBar userType={getUserType()} />}
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<HomePage />} />
          <Route
            path="/products/screen-manager"
            element={<ScreenManagerPage />}
          />
          <Route
            path="/ScreenManagerDashboard"
            element={<ScreenManagerDashboard />}
          />

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

          {/* Map Routes */}
          <Route path="/map" element={<MapDemo />} />
          <Route path="/map-dashboard" element={<MapDashboardPage />} />
          <Route path="/map-analytics" element={<MapDashboardPage />} />
          <Route path="/map-locations" element={<MapDashboardPage />} />

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
            <Route
              path="/venue-dashboard"
              element={<ProfessionalVenueDashboard />}
            />
          </Route>

          {/* Protected Advertiser Routes */}
          <Route element={<ProtectedRoute allowedRoles={["advertiser"]} />}>
            <Route
              path="/ScreenManagerDashboard"
              element={<ScreenManagerDashboard />}
            />
            <Route path="/products/ads-manager" element={<AdsManagerPage />} />
            <Route
              path="/products/ads-manager/dashboard"
              element={<AdsManagerDashboard />}
            />
            <Route
              path="/products/ads-manager/campaigns/create"
              element={
                <CampaignCreationWorkflow
                  onClose={() => navigate("/products/ads-manager/dashboard")}
                  onCampaignCreated={() =>
                    navigate("/products/ads-manager/dashboard")
                  }
                />
              }
            />
          </Route>
        </Routes>

        {/* Quick Navigation for Maps - Available on all pages */}
        <MapQuickNav />
      </div>
    </ThemeProvider>
  );
}

export default App;
