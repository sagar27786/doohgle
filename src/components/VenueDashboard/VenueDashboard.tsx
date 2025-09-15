import React, { useEffect, useState } from "react";
import ScreenList from "./ScreenList";
import BookingList from "./BookingList";
import BookingRequestsPanel from "./BookingRequestsPanel";
import EarningsList from "./EarningsList";
import { venueService } from "../../services/venueService";
import {
  FaTv,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaPlus,
  FaBell,
} from "react-icons/fa";
import MapPicker from "./MapPicker";

type UploadingFlags = {
  day_photo: boolean;
  night_photo: boolean;
  video: boolean;
};

const screenInitialState = {
  // Basic Info
  screen_name: "",
  location_in_venue: "",
  description: "",

  // Address
  address_line1: "",
  address_line2: "",
  city: "",
  state: "",
  country: "",
  postal_code: "",
  latitude: "",
  longitude: "",

  // Technical Specs
  width_px: "",
  height_px: "",
  resolution: "",
  orientation: "landscape",
  device_type: "smart_tv",
  device_model: "",
  ads_enabled: false,
  ad_frequency: 0,
  viewing_distance: "close",
  typical_viewer_duration: "",
  peak_viewing_hours: ["09:00-17:00"] as string[],

  // Assets (URLs will be filled after upload)
  day_photo_url: "",
  night_photo_url: "",
  video_url: "",

  // Pricing
  pricing: {
    hourly_rate: "",
    daily_rate: "",
    weekly_rate: "",
    currency: "INR",
  },
};

const VenueDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<
    "screens" | "bookings" | "booking-requests" | "earnings"
  >("screens");
  const [showAddScreen, setShowAddScreen] = useState(false);

  // Sidebar UI-only state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Theme state
  const [theme, setTheme] = useState<"light" | "dark">("dark");

  // Form + UX states
  const [screen, setScreen] =
    useState<typeof screenInitialState>(screenInitialState);
  const [screenMsg, setScreenMsg] = useState("");
  const [screenLoading, setScreenLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFlags>({
    day_photo: false,
    night_photo: false,
    video: false,
  });

  const handleMapSelect = (coords: { lat: number; lng: number }) => {
    setScreen((prev) => ({
      ...prev,
      latitude: String(coords.lat),
      longitude: String(coords.lng),
    }));
  };

  const handleTabChange = (
    tab: "screens" | "bookings" | "booking-requests" | "earnings"
  ) => {
    setActiveTab(tab);
    setShowAddScreen(false);
  };

  const handleAddScreenClick = () => {
    setShowAddScreen(true);
  };

  const handleScreenChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value, type } = e.target;

    if (name === "ads_enabled" && type === "checkbox") {
      const checked = (e.target as HTMLInputElement).checked;
      setScreen((prev) => ({ ...prev, [name]: checked as any }));
      return;
    }

    // Numbers stored as strings here; converted before submit
    setScreen((prev) => ({ ...prev, [name]: value as any }));
  };

  const handlePricingChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const value = e.target.value;
    setScreen((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [e.target.name]: value },
    }));
  };

  const handlePeakViewingHoursChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const selectedHours = Array.from(e.target.selectedOptions).map(
      (option) => option.value
    );
    setScreen((prev) => ({
      ...prev,
      peak_viewing_hours: selectedHours,
    }));
  };

  const handleFileUpload = async (
    file: File,
    mediaType: "day_photo" | "night_photo" | "video"
  ) => {
    if (!file) return;

    setUploadingFiles((prev) => ({ ...prev, [mediaType]: true }));

    try {
      const formData = new FormData();
      formData.append(mediaType, file);

      const response = await fetch(
        "https://doohgle-backend.onrender.com/api/upload/screen-media",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Upload failed");
      }

      const data = await response.json();
      const urlField = `${mediaType}_url` as
        | "day_photo_url"
        | "night_photo_url"
        | "video_url";

      setScreen((prev) => ({
        ...prev,
        [urlField]: data.urls[mediaType] || "",
      }));
    } catch (error) {
      console.error("Upload error:", error);
      setScreenMsg("Failed to upload file. Please try again.");
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [mediaType]: false }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: "day_photo" | "night_photo" | "video"
  ) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, mediaType);
  };

  const handleScreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScreenMsg("");
    setScreenLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem("user") || "{}");

      const screenData = {
        ...screen,
        width_px: screen.width_px ? Number(screen.width_px) : undefined,
        height_px: screen.height_px ? Number(screen.height_px) : undefined,
        latitude: screen.latitude ? Number(screen.latitude) : undefined,
        longitude: screen.longitude ? Number(screen.longitude) : undefined,
        ad_frequency: screen.ad_frequency ? Number(screen.ad_frequency) : 0,
        typical_viewer_duration: screen.typical_viewer_duration
          ? String(screen.typical_viewer_duration)
          : "",
        user_id: userData.id,
        pricing: {
          ...screen.pricing,
          hourly_rate: screen.pricing.hourly_rate
            ? Number(screen.pricing.hourly_rate)
            : undefined,

          // Remove duplicate hourly_rate property since it's already defined above

          daily_rate: screen.pricing.daily_rate
            ? Number(screen.pricing.daily_rate)
            : undefined,
          weekly_rate: screen.pricing.weekly_rate
            ? Number(screen.pricing.weekly_rate)
            : undefined,
        },
        day_photo_url: screen.day_photo_url,
        night_photo_url: screen.night_photo_url,
        video_url: screen.video_url,
      };

      await venueService.createScreen(screenData);
      setScreenMsg("Screen registered successfully!");
      setScreen(screenInitialState);
      setShowAddScreen(false);
      setActiveTab("screens");
    } catch (err: any) {
      setScreenMsg(err?.response?.data?.message || "Failed to register screen");
    } finally {
      setScreenLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 text-gray-900 overflow-hidden">
      {/* Decorative gradient blobs for light theme */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-64 w-64 rounded-full bg-gradient-to-r from-blue-400/20 to-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-r from-indigo-400/20 to-purple-400/20 blur-3xl" />
      <div className="pointer-events-none absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 h-96 w-96 rounded-full bg-gradient-to-r from-pink-300/10 to-orange-300/10 blur-3xl" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <div className="relative z-10 flex min-h-screen">
          {/* Mobile overlay */}
          {isSidebarOpen && (
            <div
              className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden"
              onClick={() => setIsSidebarOpen(false)}
              aria-hidden="true"
            />
          )}

          {/* Sidebar */}
          <aside
            className={`
      fixed inset-y-0 left-0 z-40 flex h-screen flex-col
      transform transition-all duration-300 ease-in-out
      md:relative md:h-auto md:translate-x-0
      bg-white/80 backdrop-blur-xl supports-[backdrop-filter]:bg-white/70
      border-r border-gray-200/60 shadow-2xl
      ${isSidebarOpen ? "translate-x-0 w-72" : "-translate-x-full"}
      ${isSidebarOpen ? "md:w-72" : "md:w-20"}
    `}
          >
            {/* Sidebar Header */}
            <div
              className={`flex items-center border-b border-gray-100 transition-all duration-200 ${
                isSidebarOpen
                  ? "justify-between p-5"
                  : "justify-center p-3 md:p-5"
              }`}
            >
              <h2
                className={`text-xl font-bold text-purple-600 tracking-tight transition-all duration-200 ${
                  isSidebarOpen
                    ? "opacity-100"
                    : "opacity-0 pointer-events-none absolute"
                }`}
              >
                Venue Dashboard
              </h2>

              {/* --- MODIFIED: Responsive Toggle Button --- */}
              <button
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                className={`rounded-full p-2 text-gray-600 hover:bg-gray-200 transition-colors`}
                aria-label={
                  isSidebarOpen ? "Collapse sidebar" : "Expand sidebar"
                }
              >
                {/* Mobile: Hamburger/Close Icons */}
                <div className="md:hidden">
                  {!isSidebarOpen ? (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M4 6h16M4 12h16M4 18h16"
                      />
                    </svg>
                  ) : (
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M6 18L18 6M6 6l12 12"
                      />
                    </svg>
                  )}
                </div>

                {/* Desktop: Chevron Icons */}
                <div className="hidden md:block">
                  {isSidebarOpen ? (
                    // Collapse Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M15 19l-7-7 7-7"
                      />
                    </svg>
                  ) : (
                    // Expand Icon
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                      strokeWidth={2}
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            {/* Navigation */}
            <nav
              className={`flex-1 pb-6 pt-4 transition-all duration-200 ${
                isSidebarOpen ? "px-3" : "px-1 md:px-3"
              }`}
            >
              <ul className="space-y-2">
                <li>
                  <button
                    className={`group flex items-center w-full text-left rounded-xl transition-all duration-200 text-[15px] font-medium ${
                      activeTab === "screens" && !showAddScreen
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } ${
                      isSidebarOpen
                        ? "gap-3 px-4 py-3"
                        : "justify-center px-2 py-3 md:gap-3 md:px-4 md:justify-start"
                    }`}
                    onClick={() => handleTabChange("screens")}
                    title={!isSidebarOpen ? "My Screens" : ""}
                  >
                    <span
                      className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg transition-all ${
                        activeTab === "screens" && !showAddScreen
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800"
                      }`}
                    >
                      <FaTv size={18} />
                    </span>
                    <span
                      className={`transition-all duration-200 whitespace-nowrap ${
                        isSidebarOpen
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      My Screens
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    className={`group flex items-center w-full text-left rounded-xl transition-all duration-200 text-[15px] font-medium ${
                      activeTab === "bookings" && !showAddScreen
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } ${
                      isSidebarOpen
                        ? "gap-3 px-4 py-3"
                        : "justify-center px-2 py-3 md:gap-3 md:px-4 md:justify-start"
                    }`}
                    onClick={() => handleTabChange("bookings")}
                    title={!isSidebarOpen ? "My Bookings" : ""}
                  >
                    <span
                      className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg transition-all ${
                        activeTab === "bookings" && !showAddScreen
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800"
                      }`}
                    >
                      <FaCalendarCheck size={18} />
                    </span>
                    <span
                      className={`transition-all duration-200 whitespace-nowrap ${
                        isSidebarOpen
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      My Bookings
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    className={`group flex items-center w-full text-left rounded-xl transition-all duration-200 text-[15px] font-medium ${
                      activeTab === "booking-requests" && !showAddScreen
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } ${
                      isSidebarOpen
                        ? "gap-3 px-4 py-3"
                        : "justify-center px-2 py-3 md:gap-3 md:px-4 md:justify-start"
                    }`}
                    onClick={() => handleTabChange("booking-requests")}
                    title={!isSidebarOpen ? "Booking Requests" : ""}
                  >
                    <span
                      className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg transition-all ${
                        activeTab === "booking-requests" && !showAddScreen
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800"
                      }`}
                    >
                      <FaBell size={18} />
                    </span>
                    <span
                      className={`transition-all duration-200 whitespace-nowrap ${
                        isSidebarOpen
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      Booking Requests
                    </span>
                  </button>
                </li>
                <li>
                  <button
                    className={`group flex items-center w-full text-left rounded-xl transition-all duration-200 text-[15px] font-medium ${
                      activeTab === "earnings" && !showAddScreen
                        ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25"
                        : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                    } ${
                      isSidebarOpen
                        ? "gap-3 px-4 py-3"
                        : "justify-center px-2 py-3 md:gap-3 md:px-4 md:justify-start"
                    }`}
                    onClick={() => handleTabChange("earnings")}
                    title={!isSidebarOpen ? "My Earnings" : ""}
                  >
                    <span
                      className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg transition-all ${
                        activeTab === "earnings" && !showAddScreen
                          ? "bg-white/20 text-white"
                          : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800"
                      }`}
                    >
                      <FaMoneyBillWave size={18} />
                    </span>
                    <span
                      className={`transition-all duration-200 whitespace-nowrap ${
                        isSidebarOpen
                          ? "opacity-100"
                          : "opacity-0 pointer-events-none"
                      }`}
                    >
                      My Earnings
                    </span>
                  </button>
                </li>
              </ul>

              <div
                className={`mt-6 pt-6 border-t border-gray-200 transition-all duration-200 ${
                  isSidebarOpen ? "" : "mx-1 md:mx-0"
                }`}
              >
                <button
                  className={`group flex items-center w-full text-left rounded-xl transition-all duration-200 text-[15px] font-semibold ${
                    showAddScreen
                      ? "bg-purple-600 hover:bg-purple-700 text-white shadow-lg shadow-purple-600/25"
                      : "text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                  } ${
                    isSidebarOpen
                      ? "gap-3 px-4 py-3"
                      : "justify-center px-2 py-3 md:gap-3 md:px-4 md:justify-start"
                  }`}
                  onClick={handleAddScreenClick}
                  title={!isSidebarOpen ? "List New Screen" : ""}
                >
                  <span
                    className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg transition-all ${
                      showAddScreen
                        ? "bg-white/20 text-white"
                        : "bg-gray-100 text-gray-600 group-hover:bg-gray-200 group-hover:text-gray-800"
                    }`}
                  >
                    <FaPlus size={18} />
                  </span>
                  <span
                    className={`transition-all duration-200 whitespace-nowrap ${
                      isSidebarOpen
                        ? "opacity-100"
                        : "opacity-0 pointer-events-none"
                    }`}
                  >
                    List New Screen
                  </span>
                </button>
              </div>
            </nav>
          </aside>
        </div>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header
            className={`pt-4 sticky top-0 bg-white/80 ${
              !isSidebarOpen
                ? "backdrop-blur-md supports-[backdrop-filter]:bg-white/70"
                : "md:backdrop-blur-md md:supports-[backdrop-filter]:bg-white/70"
            } border-b border-gray-200 shadow-sm`}
          >
            <div className="mx-auto max-w-6xl px-4 sm:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              {/* Left Section */}
              <div className="flex items-center gap-3">
                {/* Mobile menu button */}
                <button
                  onClick={() => setIsSidebarOpen(true)}
                  className="md:hidden rounded-lg p-2 text-gray-600 hover:bg-gray-100 hover:text-gray-900 transition-colors"
                  aria-label="Open sidebar"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    strokeWidth={2}
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M4 6h16M4 12h16M4 18h16"
                    />
                  </svg>
                </button>
                <div>
                  <h1 className="text-xl sm:text-2xl md:text-3xl font-semibold text-gray-900">
                    Venue Owner Dashboard
                  </h1>
                  <p className="text-sm text-gray-500 mt-1">
                    Manage your screens, bookings, and earnings with ease
                  </p>
                </div>
              </div>

              {/* Right Section */}
              <div className="flex items-center gap-2 sm:gap-3">
                {/* Hidden on mobile */}
                <button
                  onClick={handleAddScreenClick}
                  className="hidden md:inline-flex items-center gap-1.5 sm:gap-2 rounded-lg bg-purple-600 text-white px-3 sm:px-4 py-2 shadow-md hover:bg-purple-700 transition-all duration-200 active:scale-[0.98] font-medium text-sm sm:text-base"
                >
                  <FaPlus size={14} className="shrink-0" />
                  <span className="hidden sm:inline">Register Screen</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-6xl w-full px-6 py-8 space-y-8">
            {!showAddScreen && activeTab === "screens" && (
              <section
                className={`rounded-2xl bg-white/90 ${
                  !isSidebarOpen
                    ? "backdrop-blur-md supports-[backdrop-filter]:bg-white/70"
                    : "md:backdrop-blur-md md:supports-[backdrop-filter]:bg-white/70"
                } border border-gray-200 shadow-md transition-all`}
              >
                {/* Header */}
                <div className="p-5 border-b border-gray-200 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaTv className="text-purple-600" />
                    My Screens
                  </h2>
                </div>

                {/* Body */}
                <div className="p-5">
                  <ScreenList />
                </div>
              </section>
            )}

            {!showAddScreen && activeTab === "bookings" && (
              <section className="rounded-2xl bg-white/90 backdrop-blur-md supports-[backdrop-filter]:bg-white/70 border border-gray-200 shadow-lg transition-all w-full max-w-6xl mx-auto my-4">
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-100 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-4">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaCalendarCheck className="text-purple-600" />
                    My Bookings
                  </h2>
                  {/* Optional: Add a filter or action button on the right */}
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <BookingList />
                </div>
              </section>
            )}

            {!showAddScreen && activeTab === "booking-requests" && (
              <section
                className={`rounded-2xl bg-gray-50/90 backdrop-blur-md border border-gray-200 shadow-lg transition-all w-full`}
              >
                {/* Header */}
                <div className="p-4 sm:p-6 border-b border-gray-200 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2 sm:gap-0">
                  <h2 className="text-lg sm:text-xl font-semibold text-gray-900 flex items-center gap-2">
                    <FaBell className="text-orange-600" />
                    Booking Requests
                  </h2>
                </div>

                {/* Content */}
                <div className="p-4 sm:p-6">
                  <BookingRequestsPanel />
                </div>
              </section>
            )}

            {!showAddScreen && activeTab === "earnings" && (
              <section
                className={`rounded-2xl bg-white/80 ${
                  !isSidebarOpen
                    ? "backdrop-blur-xl supports-[backdrop-filter]:bg-white/70"
                    : "md:backdrop-blur-xl md:supports-[backdrop-filter]:bg-white/70"
                } border border-gray-200/60 shadow-xl transition-all`}
              >
                <div className="p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaMoneyBillWave className="text-emerald-600" />
                    My Earnings
                  </h2>
                </div>
                <div className="p-6">
                  <EarningsList />
                </div>
              </section>
            )}

            {showAddScreen && (
              <section className="rounded-xl bg-white border border-gray-200 shadow-lg transition-all">
                <div className="p-4 sm:p-6 border-b border-gray-100 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-gray-900 flex items-center gap-2">
                    <FaPlus className="text-emerald-600" />
                    Register New Screen
                  </h2>
                  <button
                    className="rounded-lg px-3 py-2 text-gray-600 hover:text-red-600 hover:bg-red-50 transition-all duration-200 font-medium text-sm sm:text-base"
                    onClick={() => setShowAddScreen(false)}
                    aria-label="Close registration form"
                  >
                    Close
                  </button>
                </div>

                <div className="p-4 sm:p-6">
                  <form onSubmit={handleScreenSubmit} className="space-y-6">
                    {/* Basic Information */}
                    <div className="bg-blue-50 rounded-xl p-4 sm:p-6 border border-blue-100">
                      <h3 className="text-sm font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                        Basic Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label
                            htmlFor="screen_name"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Screen Name
                          </label>
                          <input
                            type="text"
                            id="screen_name"
                            name="screen_name"
                            value={screen.screen_name}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                            placeholder="Enter screen name"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="location_in_venue"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Location Type
                          </label>
                          <select
                            id="location_in_venue"
                            name="location_in_venue"
                            value={screen.location_in_venue || ""}
                            onChange={handleScreenChange}
                            required
                            className="block w-full rounded-lg border border-gray-300 bg-white text-gray-900 px-3 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="" disabled>
                              Select location type
                            </option>
                            <option value="indoor">Indoor</option>
                            <option value="outdoor">Outdoor</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-6">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700 mb-2"
                        >
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={screen.description}
                          onChange={handleScreenChange}
                          rows={3}
                          className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          placeholder="Describe your screen location and features"
                        />
                      </div>
                    </div>

                    {/* Address Information */}
                    <div className="bg-emerald-50 rounded-xl p-4 sm:p-6 border border-emerald-100">
                      <h3 className="text-sm font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-emerald-500 rounded-full"></div>
                        Address Information
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                        <div>
                          <label
                            htmlFor="address_line1"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            id="address_line1"
                            name="address_line1"
                            value={screen.address_line1}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            placeholder="Street address"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="address_line2"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            id="address_line2"
                            name="address_line2"
                            value={screen.address_line2}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            placeholder="Apartment, suite, etc."
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="city"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={screen.city}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            placeholder="City name"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="state"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={screen.state}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            placeholder="State/Province"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="country"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Country
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={screen.country}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            placeholder="Country"
                            required
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="postal_code"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postal_code"
                            name="postal_code"
                            value={screen.postal_code}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
                            placeholder="ZIP/Postal code"
                            required
                          />
                        </div>
                      </div>
                      <div className="mt-4 sm:mt-6">
                        <label className="block text-sm font-medium text-gray-700 mb-3">
                          Pinpoint Location on Map
                        </label>
                        <div className="rounded-lg overflow-hidden border border-gray-300 shadow-sm">
                          <MapPicker
                            selectedLocation={
                              screen.latitude && screen.longitude
                                ? {
                                    lat: Number(screen.latitude),
                                    lng: Number(screen.longitude),
                                  }
                                : null
                            }
                            onMapSelect={handleMapSelect}
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6 mt-4 sm:mt-6">
                        <div>
                          <label
                            htmlFor="latitude"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Latitude
                          </label>
                          <input
                            type="text"
                            id="latitude"
                            name="latitude"
                            value={screen.latitude}
                            onChange={handleScreenChange}
                            readOnly
                            className="block w-full border border-gray-300 bg-gray-50 rounded-lg shadow-sm p-3 text-gray-700"
                            placeholder="Auto-filled from map"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="longitude"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Longitude
                          </label>
                          <input
                            type="text"
                            id="longitude"
                            name="longitude"
                            value={screen.longitude}
                            onChange={handleScreenChange}
                            readOnly
                            className="block w-full border border-gray-300 bg-gray-50 rounded-lg shadow-sm p-3 text-gray-700"
                            placeholder="Auto-filled from map"
                          />
                        </div>
                      </div>
                    </div>

                    {/* Technical Specs */}
                    <div className="bg-purple-50 rounded-xl p-4 sm:p-6 border border-purple-100">
                      <h3 className="text-sm font-semibold mb-4 text-gray-800 flex items-center gap-2">
                        <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                        Technical Specifications
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <label
                            htmlFor="width_px"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Width (px)
                          </label>
                          <input
                            type="number"
                            id="width_px"
                            name="width_px"
                            value={screen.width_px}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            placeholder="1920"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="height_px"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Height (px)
                          </label>
                          <input
                            type="number"
                            id="height_px"
                            name="height_px"
                            value={screen.height_px}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                            placeholder="1080"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="resolution"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Resolution
                          </label>
                          <input
                            type="text"
                            id="resolution"
                            name="resolution"
                            value={screen.resolution}
                            onChange={handleScreenChange}
                            placeholder="e.g., 1080p"
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="orientation"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Orientation
                          </label>
                          <select
                            id="orientation"
                            name="orientation"
                            value={screen.orientation}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          >
                            <option value="landscape">Landscape</option>
                            <option value="portrait">Portrait</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="device_type"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Device Type
                          </label>
                          <select
                            id="device_type"
                            name="device_type"
                            value={screen.device_type}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          >
                            <option value="smart_tv">Smart TV</option>
                            <option value="media_player">Media Player</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="device_model"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Device Model
                          </label>
                          <input
                            type="text"
                            id="device_model"
                            name="device_model"
                            value={screen.device_model}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="ads_enabled"
                            name="ads_enabled"
                            checked={screen.ads_enabled}
                            onChange={handleScreenChange}
                            className="h-5 w-5 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                          />
                          <label
                            htmlFor="ads_enabled"
                            className="text-sm text-gray-700"
                          >
                            Ads enabled
                          </label>
                        </div>

                        <div>
                          <label
                            htmlFor="ad_frequency"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Ad Frequency (per hour)
                          </label>
                          <input
                            type="number"
                            id="ad_frequency"
                            name="ad_frequency"
                            value={screen.ad_frequency}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          />
                        </div>

                        <div>
                          <label
                            htmlFor="viewing_distance"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Viewing Distance
                          </label>
                          <select
                            id="viewing_distance"
                            name="viewing_distance"
                            value={screen.viewing_distance}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          >
                            <option value="close">Close</option>
                            <option value="medium">Medium</option>
                            <option value="far">Far</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="typical_viewer_duration"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Typical Viewer Duration (e.g., 30s)
                          </label>
                          <input
                            type="text"
                            id="typical_viewer_duration"
                            name="typical_viewer_duration"
                            value={screen.typical_viewer_duration}
                            onChange={handleScreenChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          />
                        </div>

                        <div className="sm:col-span-2 lg:col-span-3">
                          <label
                            htmlFor="peak_viewing_hours"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Peak Viewing Hours (multi-select)
                          </label>
                          <select
                            id="peak_viewing_hours"
                            name="peak_viewing_hours"
                            multiple
                            value={screen.peak_viewing_hours}
                            onChange={handlePeakViewingHoursChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all duration-200"
                          >
                            <option value="06:00-09:00">06:00-09:00</option>
                            <option value="09:00-12:00">09:00-12:00</option>
                            <option value="12:00-15:00">12:00-15:00</option>
                            <option value="15:00-18:00">15:00-18:00</option>
                            <option value="18:00-21:00">18:00-21:00</option>
                            <option value="21:00-24:00">21:00-24:00</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Media Upload */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-900">
                        Media Upload
                      </h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Day Photo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "day_photo")}
                            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-purple-600 hover:file:bg-blue-200"
                          />
                          {uploadingFiles.day_photo && (
                            <p className="text-xs text-gray-600 mt-2">
                              Uploading day photo...
                            </p>
                          )}
                          {screen.day_photo_url && (
                            <p className="text-xs text-green-600 mt-2">
                              Uploaded
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Night Photo
                          </label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, "night_photo")}
                            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-purple-600 hover:file:bg-blue-200"
                          />
                          {uploadingFiles.night_photo && (
                            <p className="text-xs text-gray-600 mt-2">
                              Uploading night photo...
                            </p>
                          )}
                          {screen.night_photo_url && (
                            <p className="text-xs text-green-600 mt-2">
                              Uploaded
                            </p>
                          )}
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Promotional Video
                          </label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, "video")}
                            className="w-full text-sm text-gray-700 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-100 file:text-purple-600 hover:file:bg-blue-200"
                          />
                          {uploadingFiles.video && (
                            <p className="text-xs text-gray-600 mt-2">
                              Uploading video...
                            </p>
                          )}
                          {screen.video_url && (
                            <p className="text-xs text-green-600 mt-2">
                              Uploaded
                            </p>
                          )}
                        </div>
                      </div>
                    </div>

                    {/* Pricing */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-900">
                        Pricing
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
                        <div>
                          <label
                            htmlFor="hourly_rate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Hourly Rate
                          </label>
                          <input
                            type="number"
                            id="hourly_rate"
                            name="hourly_rate"
                            value={screen.pricing.hourly_rate}
                            onChange={handlePricingChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="daily_rate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Daily Rate
                          </label>
                          <input
                            type="number"
                            id="daily_rate"
                            name="daily_rate"
                            value={screen.pricing.daily_rate}
                            onChange={handlePricingChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="weekly_rate"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Weekly Rate
                          </label>
                          <input
                            type="number"
                            id="weekly_rate"
                            name="weekly_rate"
                            value={screen.pricing.weekly_rate}
                            onChange={handlePricingChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          />
                        </div>
                        <div>
                          <label
                            htmlFor="currency"
                            className="block text-sm font-medium text-gray-700 mb-2"
                          >
                            Currency
                          </label>
                          <select
                            id="currency"
                            name="currency"
                            value={screen.pricing.currency}
                            onChange={handlePricingChange}
                            className="block w-full border border-gray-300 bg-white rounded-lg shadow-sm p-3 text-gray-900 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                          >
                            <option value="INR">INR</option>
                            <option value="USD">USD</option>
                            <option value="EUR">EUR</option>
                            <option value="GBP">GBP</option>
                          </select>
                        </div>
                      </div>
                    </div>

                    {/* Status / Actions */}
                    {screenMsg && (
                      <div
                        className={`rounded-lg p-3 text-sm ${
                          screenMsg.toLowerCase().includes("success")
                            ? "bg-green-100 text-green-800 border border-green-200"
                            : "bg-red-100 text-red-800 border border-red-200"
                        }`}
                      >
                        {screenMsg}
                      </div>
                    )}

                    <div className="flex flex-col sm:flex-row justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddScreen(false)}
                        className="px-4 py-2.5 rounded-lg font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={screenLoading}
                        className="px-4 py-2.5 rounded-lg font-medium text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-60 transition-colors"
                      >
                        {screenLoading ? "Saving..." : "Register Screen"}
                      </button>
                    </div>
                  </form>
                </div>
              </section>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default VenueDashboard;
