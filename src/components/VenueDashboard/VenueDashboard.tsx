import React, { useEffect, useState } from 'react';
import ScreenList from './ScreenList';
import BookingList from './BookingList';
import BookingRequestsPanel from './BookingRequestsPanel';
import EarningsList from './EarningsList';
import { venueService } from '../../services/venueService';
import {
  FaTv,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaPlus,
  FaBars,
  FaSun,
  FaMoon,
  FaBell,
} from 'react-icons/fa';
import MapPicker from './MapPicker';

type UploadingFlags = {
  day_photo: boolean;
  night_photo: boolean;
  video: boolean;
};

const screenInitialState = {
  // Basic Info
  screen_name: '',
  location_in_venue: '',
  description: '',

  // Address
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  latitude: '',
  longitude: '',

  // Technical Specs
  width_px: "",
  height_px: "",
  resolution: "",
  orientation: "landscape",
  device_type: "smart_tv",
  device_model: "",
  ads_enabled: false,
  ad_frequency: 0,
  viewing_distance: 'close',
  typical_viewer_duration: '',
  peak_viewing_hours: ['09:00-17:00'] as string[],

  // Assets (URLs will be filled after upload)
  day_photo_url: '',
  night_photo_url: '',
  video_url: '',

  // Pricing
  pricing: {
    hourly_rate: '',
    daily_rate: '',
    weekly_rate: '',
    currency: 'INR',
  },
};

const VenueDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'screens' | 'bookings' | 'booking-requests' | 'earnings'>('screens');
  const [showAddScreen, setShowAddScreen] = useState(false);

  // Sidebar UI-only state
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');

  // Form + UX states
  const [screen, setScreen] = useState<typeof screenInitialState>(screenInitialState);
  const [screenMsg, setScreenMsg] = useState('');
  const [screenLoading, setScreenLoading] = useState(false);
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [uploadingFiles, setUploadingFiles] = useState<UploadingFlags>({
    day_photo: false,
    night_photo: false,
    video: false,
  });

  const handleMapSelect = (coords: { lat: number; lng: number }) => {
    setScreen(prev => ({
      ...prev,
      latitude: String(coords.lat),
      longitude: String(coords.lng),
    }));
  };

  useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
  }, [theme]);

  const toggleSidebar = () => setIsSidebarOpen((prev) => !prev);
  const toggleTheme = () => setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));

  const handleTabChange = (tab: 'screens' | 'bookings' | 'booking-requests' | 'earnings') => {
    setActiveTab(tab);
    setShowAddScreen(false);
  };

  const handleAddScreenClick = () => {
    setShowAddScreen(true);
  };

  const handleScreenChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value, type } = e.target;

    if (name === 'ads_enabled' && type === 'checkbox') {
      const checked = (e.target as HTMLInputElement).checked;
      setScreen((prev) => ({ ...prev, [name]: checked as any }));
      return;
    }

    // Numbers stored as strings here; converted before submit
    setScreen((prev) => ({ ...prev, [name]: value as any }));
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const value = e.target.value;
    setScreen((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [e.target.name]: value },
    }));
  };

  const handlePeakViewingHoursChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedHours = Array.from(e.target.selectedOptions).map((option) => option.value);
    setScreen((prev) => ({
      ...prev,
      peak_viewing_hours: selectedHours,
    }));
  };

  const handleFileUpload = async (file: File, mediaType: 'day_photo' | 'night_photo' | 'video') => {
    if (!file) return;

    setUploadingFiles((prev) => ({ ...prev, [mediaType]: true }));

    try {
      const formData = new FormData();
      formData.append(mediaType, file);

      const response = await fetch('http://localhost:4001/api/upload/screen-media', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('token')}`,
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error('Upload failed');
      }

      const data = await response.json();
      const urlField = `${mediaType}_url` as
        | 'day_photo_url'
        | 'night_photo_url'
        | 'video_url';

      setScreen((prev) => ({
        ...prev,
        [urlField]: data.urls[mediaType] || '',
      }));
    } catch (error) {
      console.error('Upload error:', error);
      setScreenMsg('Failed to upload file. Please try again.');
    } finally {
      setUploadingFiles((prev) => ({ ...prev, [mediaType]: false }));
    }
  };

  const handleFileChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    mediaType: 'day_photo' | 'night_photo' | 'video'
  ) => {
    const file = e.target.files?.[0];
    if (file) handleFileUpload(file, mediaType);
  };

  const handleScreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScreenMsg("");
    setScreenLoading(true);

    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');

      const screenData = {
        ...screen,
        width_px: screen.width_px ? Number(screen.width_px) : undefined,
        height_px: screen.height_px ? Number(screen.height_px) : undefined,
        latitude: screen.latitude ? Number(screen.latitude) : undefined,
        longitude: screen.longitude ? Number(screen.longitude) : undefined,
        ad_frequency: screen.ad_frequency ? Number(screen.ad_frequency) : 0,
        typical_viewer_duration: screen.typical_viewer_duration
          ? String(screen.typical_viewer_duration)
          : '',
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
      setScreenMsg('Screen registered successfully!');
      setScreen(screenInitialState);
      setShowAddScreen(false);
      setActiveTab('screens');
    } catch (err: any) {
      setScreenMsg(err?.response?.data?.message || "Failed to register screen");
    } finally {
      setScreenLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen bg-gray-900 text-gray-100 overflow-hidden">
      {/* Decorative gradient blobs for dark theme */}
      <div className="pointer-events-none absolute -top-32 -left-24 h-64 w-64 rounded-full bg-blue-600/20 blur-3xl" />
      <div className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-indigo-600/20 blur-3xl" />

      <div className="relative z-10 flex min-h-screen">
        {/* Sidebar */}
        <aside
          className={`${
            isSidebarOpen ? 'w-72' : 'w-20'
          } transition-all duration-300 ease-in-out bg-gray-900/70 dark:bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border-r border-gray-800 shadow-xl flex flex-col`}
        >
          <div className="flex items-center justify-between p-5">
            <h2
              className={`text-xl font-bold text-gray-100 tracking-tight transition-opacity duration-200 ${
                isSidebarOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
              }`}
            >
              Venue Dashboard
            </h2>
            <button
              onClick={toggleSidebar}
              className="p-2 rounded-lg text-gray-200 hover:bg-gray-800 transition-colors"
              aria-label="Toggle sidebar"
              title="Toggle sidebar"
            >
              <FaBars />
            </button>
          </div>

          <nav className="px-3 pb-6">
            <ul className="space-y-2">
              <li>
                <button
                  className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-[15px] font-medium ${
                    activeTab === 'screens' && !showAddScreen
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-200 hover:bg-gray-800'
                  }`}
                  onClick={() => handleTabChange('screens')}
                >
                  <span
                    className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg ${
                      activeTab === 'screens' && !showAddScreen
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-800 text-gray-200 group-hover:bg-gray-700'
                    }`}
                  >
                    <FaTv size={18} />
                  </span>
                  <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity`}>
                    My Screens
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-[15px] font-medium ${
                    activeTab === 'bookings' && !showAddScreen
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-200 hover:bg-gray-800'
                  }`}
                  onClick={() => handleTabChange('bookings')}
                >
                  <span
                    className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg ${
                      activeTab === 'bookings' && !showAddScreen
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-800 text-gray-200 group-hover:bg-gray-700'
                    }`}
                  >
                    <FaCalendarCheck size={18} />
                  </span>
                  <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity`}>
                    My Bookings
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-[15px] font-medium ${
                    activeTab === 'booking-requests' && !showAddScreen
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-200 hover:bg-gray-800'
                  }`}
                  onClick={() => handleTabChange('booking-requests')}
                >
                  <span
                    className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg ${
                      activeTab === 'booking-requests' && !showAddScreen
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-800 text-gray-200 group-hover:bg-gray-700'
                    }`}
                  >
                    <FaBell size={18} />
                  </span>
                  <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity`}>
                    Booking Requests
                  </span>
                </button>
              </li>
              <li>
                <button
                  className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-[15px] font-medium ${
                    activeTab === 'earnings' && !showAddScreen
                      ? 'bg-blue-600 text-white shadow-lg'
                      : 'text-gray-200 hover:bg-gray-800'
                  }`}
                  onClick={() => handleTabChange('earnings')}
                >
                  <span
                    className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg ${
                      activeTab === 'earnings' && !showAddScreen
                        ? 'bg-white/20 text-white'
                        : 'bg-gray-800 text-gray-200 group-hover:bg-gray-700'
                    }`}
                  >
                    <FaMoneyBillWave size={18} />
                  </span>
                  <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity`}>
                    My Earnings
                  </span>
                </button>
              </li>
            </ul>

            <div className="mt-6 pt-6 border-t border-gray-800">
              <button
                className={`group flex items-center gap-3 w-full text-left px-4 py-3 rounded-xl transition-all duration-200 text-[15px] font-semibold ${
                  showAddScreen ? 'bg-green-600 text-white shadow-lg' : 'text-green-300 hover:bg-gray-800'
                }`}
                onClick={handleAddScreenClick}
              >
                <span
                  className={`shrink-0 grid place-items-center h-8 w-8 rounded-lg ${
                    showAddScreen ? 'bg-white/20 text-white' : 'bg-gray-800 text-green-300 group-hover:bg-gray-700'
                  }`}
                >
                  <FaPlus size={18} />
                </span>
                <span className={`${isSidebarOpen ? 'opacity-100' : 'opacity-0 hidden'} transition-opacity`}>
                  List New Screen
                </span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Main Content */}
        <main className="flex-1 flex flex-col">
          {/* Header */}
          <header className="sticky top-0 z-20 bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border-b border-gray-800">
            <div className="mx-auto max-w-6xl px-6 py-4 flex items-center justify-between">
              <div>
                <h1 className="text-2xl md:text-3xl font-extrabold text-white">Venue Owner Dashboard</h1>
                <p className="text-sm text-gray-400 mt-1">Manage your screens, bookings, and earnings</p>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={toggleTheme}
                  className="inline-flex items-center gap-2 rounded-xl bg-gray-800 text-gray-200 px-3 py-2 shadow hover:bg-gray-700 transition-colors"
                  title="Toggle theme"
                >
                  {theme === 'dark' ? <FaSun /> : <FaMoon />}
                  <span className="hidden sm:inline">{theme === 'dark' ? 'Light' : 'Dark'}</span>
                </button>

                <button
                  onClick={handleAddScreenClick}
                  className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 text-white px-4 py-2.5 shadow-lg hover:shadow-xl transition-all active:scale-[0.98]"
                >
                  <FaPlus size={14} /> <span className="hidden sm:inline">Register</span>
                </button>
              </div>
            </div>
          </header>

          {/* Content */}
          <div className="mx-auto max-w-6xl w-full px-6 py-8 space-y-8">
            {!showAddScreen && activeTab === 'screens' && (
              <section className="rounded-2xl bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border border-gray-800 shadow-xl transition-all">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">My Screens</h2>
                </div>
                <div className="p-6">
                  <ScreenList />
                </div>
              </section>
            )}

            {!showAddScreen && activeTab === 'bookings' && (
              <section className="rounded-2xl bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border border-gray-800 shadow-xl transition-all">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">My Bookings</h2>
                </div>
                <div className="p-6">
                  <BookingList />
                </div>
              </section>
            )}

            {!showAddScreen && activeTab === 'booking-requests' && (
              <section className="rounded-2xl bg-white border border-gray-200 shadow-xl transition-all">
                <div className="p-6">
                  <BookingRequestsPanel />
                </div>
              </section>
            )}

            {!showAddScreen && activeTab === 'earnings' && (
              <section className="rounded-2xl bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border border-gray-800 shadow-xl transition-all">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">My Earnings</h2>
                </div>
                <div className="p-6">
                  <EarningsList />
                </div>
              </section>
            )}

            {showAddScreen && (
              <section className="rounded-2xl bg-gray-900/70 backdrop-blur supports-[backdrop-filter]:bg-gray-900/60 border border-gray-800 shadow-xl transition-all">
                <div className="p-6 border-b border-gray-800 flex items-center justify-between">
                  <h2 className="text-lg font-semibold text-white">Register New Screen</h2>
                  <button
                    className="rounded-lg px-3 py-1.5 text-gray-300 hover:text-red-400 hover:bg-red-900/20 transition-colors"
                    onClick={() => setShowAddScreen(false)}
                    aria-label="Close registration form"
                  >
                    Close
                  </button>
                </div>

                <div className="p-6">
                  <form onSubmit={handleScreenSubmit} className="space-y-8">
                    {/* Basic Information */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-200">Basic Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="screen_name" className="block text-xs font-medium text-gray-400">
                            Screen Name
                          </label>
                          <input
                            type="text"
                            id="screen_name"
                            name="screen_name"
                            value={screen.screen_name}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="location_in_venue" className="block text-xs font-medium text-gray-400">
                            Location in Venue
                          </label>
                          <select
                            id="location_in_venue"
                            name="location_in_venue"
                            value={screen.location_in_venue || ''}
                            onChange={handleScreenChange}
                            required
                            className="mt-1 block w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
                          >
                            <option value="" disabled>Select location type</option>
                            <option value="indoor">Indoor</option>
                            <option value="outdoor">Outdoor</option>
                          </select>
                        </div>
                      </div>
                      <div className="mt-4">
                        <label htmlFor="description" className="block text-xs font-medium text-gray-400">
                          Description
                        </label>
                        <textarea
                          id="description"
                          name="description"
                          value={screen.description}
                          onChange={handleScreenChange}
                          rows={3}
                          className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100 placeholder-gray-500 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition"
                        />
                      </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Address Information */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-200">Address Information</h3>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label htmlFor="address_line1" className="block text-xs font-medium text-gray-400">
                            Address Line 1
                          </label>
                          <input
                            type="text"
                            id="address_line1"
                            name="address_line1"
                            value={screen.address_line1}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="address_line2" className="block text-xs font-medium text-gray-400">
                            Address Line 2
                          </label>
                          <input
                            type="text"
                            id="address_line2"
                            name="address_line2"
                            value={screen.address_line2}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>
                        <div>
                          <label htmlFor="city" className="block text-xs font-medium text-gray-400">
                            City
                          </label>
                          <input
                            type="text"
                            id="city"
                            name="city"
                            value={screen.city}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="state" className="block text-xs font-medium text-gray-400">
                            State
                          </label>
                          <input
                            type="text"
                            id="state"
                            name="state"
                            value={screen.state}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="country" className="block text-xs font-medium text-gray-400">
                            Country
                          </label>
                          <input
                            type="text"
                            id="country"
                            name="country"
                            value={screen.country}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                            required
                          />
                        </div>
                        <div>
                          <label htmlFor="postal_code" className="block text-xs font-medium text-gray-400">
                            Postal Code
                          </label>
                          <input
                            type="text"
                            id="postal_code"
                            name="postal_code"
                            value={screen.postal_code}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                            required
                          />
                        </div>
                        </div>
                        <div className="mt-6">
                            <label className="block text-xs font-medium text-gray-400 mb-2">Pinpoint Location on Map</label>
                            <MapPicker
                                selectedLocation={screen.latitude && screen.longitude ? { lat: Number(screen.latitude), lng: Number(screen.longitude) } : null}
                                onMapSelect={handleMapSelect}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-6 mt-4">
                        <div>
                          <label htmlFor="latitude" className="block text-xs font-medium text-gray-400">
                            Latitude
                          </label>
                          <input
                            type="text"
                            id="latitude"
                            name="latitude"
                            value={screen.latitude}
                            onChange={handleScreenChange}
                            readOnly
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>
                        <div>
                          <label htmlFor="longitude" className="block text-xs font-medium text-gray-400">
                            Longitude
                          </label>
                          <input
                            type="text"
                            id="longitude"
                            name="longitude"
                            value={screen.longitude}
                            onChange={handleScreenChange}
                            readOnly
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Technical Specs */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-200">Technical Specifications</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label htmlFor="width_px" className="block text-xs font-medium text-gray-400">
                            Width (px)
                          </label>
                          <input
                            type="number"
                            id="width_px"
                            name="width_px"
                            value={screen.width_px}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>
                        <div>
                          <label htmlFor="height_px" className="block text-xs font-medium text-gray-400">
                            Height (px)
                          </label>
                          <input
                            type="number"
                            id="height_px"
                            name="height_px"
                            value={screen.height_px}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>
                        <div>
                          <label htmlFor="resolution" className="block text-xs font-medium text-gray-400">
                            Resolution
                          </label>
                          <input
                            type="text"
                            id="resolution"
                            name="resolution"
                            value={screen.resolution}
                            onChange={handleScreenChange}
                            placeholder="e.g., 1080p"
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100 placeholder-gray-500"
                          />
                        </div>

                        <div>
                          <label htmlFor="orientation" className="block text-xs font-medium text-gray-400">
                            Orientation
                          </label>
                          <select
                            id="orientation"
                            name="orientation"
                            value={screen.orientation}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          >
                            <option value="landscape">Landscape</option>
                            <option value="portrait">Portrait</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="device_type" className="block text-xs font-medium text-gray-400">
                            Device Type
                          </label>
                          <select
                            id="device_type"
                            name="device_type"
                            value={screen.device_type}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          >
                            <option value="smart_tv">Smart TV</option>
                            <option value="media_player">Media Player</option>
                            <option value="other">Other</option>
                          </select>
                        </div>

                        <div>
                          <label htmlFor="device_model" className="block text-xs font-medium text-gray-400">
                            Device Model
                          </label>
                          <input
                            type="text"
                            id="device_model"
                            name="device_model"
                            value={screen.device_model}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>

                        <div className="flex items-center gap-3">
                          <input
                            type="checkbox"
                            id="ads_enabled"
                            name="ads_enabled"
                            checked={screen.ads_enabled}
                            onChange={handleScreenChange}
                            className="h-5 w-5 rounded border-gray-700 bg-gray-900 text-blue-600 focus:ring-blue-500"
                          />
                          <label htmlFor="ads_enabled" className="text-sm text-gray-300">
                            Ads enabled
                          </label>
                        </div>

                        <div>
                          <label htmlFor="ad_frequency" className="block text-xs font-medium text-gray-400">
                            Ad Frequency (per hour)
                          </label>
                          <input
                            type="number"
                            id="ad_frequency"
                            name="ad_frequency"
                            value={screen.ad_frequency}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>

                        <div>
                          <label htmlFor="viewing_distance" className="block text-xs font-medium text-gray-400">
                            Viewing Distance
                          </label>
                          <select
                            id="viewing_distance"
                            name="viewing_distance"
                            value={screen.viewing_distance}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          >
                            <option value="close">Close</option>
                            <option value="medium">Medium</option>
                            <option value="far">Far</option>
                          </select>
                        </div>

                        <div>
                          <label
                            htmlFor="typical_viewer_duration"
                            className="block text-xs font-medium text-gray-400"
                          >
                            Typical Viewer Duration (e.g., 30s)
                          </label>
                          <input
                            type="text"
                            id="typical_viewer_duration"
                            name="typical_viewer_duration"
                            value={screen.typical_viewer_duration}
                            onChange={handleScreenChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>

                        <div className="md:col-span-3">
                          <label htmlFor="peak_viewing_hours" className="block text-xs font-medium text-gray-400">
                            Peak Viewing Hours (multi-select)
                          </label>
                          <select
                            id="peak_viewing_hours"
                            name="peak_viewing_hours"
                            multiple
                            value={screen.peak_viewing_hours}
                            onChange={handlePeakViewingHoursChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
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

                    <hr className="border-gray-800" />

                    {/* Media Upload */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-200">Media Upload</h3>
                      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-2">Day Photo</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'day_photo')}
                            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-900/40 file:text-blue-200 hover:file:bg-blue-900/60"
                          />
                          {uploadingFiles.day_photo && (
                            <p className="text-xs text-gray-400 mt-2">Uploading day photo...</p>
                          )}
                          {screen.day_photo_url && (
                            <p className="text-xs text-green-300 mt-2">Uploaded</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-2">Night Photo</label>
                          <input
                            type="file"
                            accept="image/*"
                            onChange={(e) => handleFileChange(e, 'night_photo')}
                            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-900/40 file:text-blue-200 hover:file:bg-blue-900/60"
                          />
                          {uploadingFiles.night_photo && (
                            <p className="text-xs text-gray-400 mt-2">Uploading night photo...</p>
                          )}
                          {screen.night_photo_url && (
                            <p className="text-xs text-green-300 mt-2">Uploaded</p>
                          )}
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-400 mb-2">Promotional Video</label>
                          <input
                            type="file"
                            accept="video/*"
                            onChange={(e) => handleFileChange(e, 'video')}
                            className="w-full text-sm text-gray-300 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-900/40 file:text-blue-200 hover:file:bg-blue-900/60"
                          />
                          {uploadingFiles.video && (
                            <p className="text-xs text-gray-400 mt-2">Uploading video...</p>
                          )}
                          {screen.video_url && <p className="text-xs text-green-300 mt-2">Uploaded</p>}
                        </div>
                      </div>
                    </div>

                    <hr className="border-gray-800" />

                    {/* Pricing */}
                    <div>
                      <h3 className="text-sm font-semibold mb-3 text-gray-200">Pricing</h3>
                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                        <div>
                          <label htmlFor="hourly_rate" className="block text-xs font-medium text-gray-400">
                            Hourly Rate
                          </label>
                          <input
                            type="number"
                            id="hourly_rate"
                            name="hourly_rate"
                            value={screen.pricing.hourly_rate}
                            onChange={handlePricingChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>
                        <div>
                          <label htmlFor="daily_rate" className="block text-xs font-medium text-gray-400">
                            Daily Rate
                          </label>
                          <input
                            type="number"
                            id="daily_rate"
                            name="daily_rate"
                            value={screen.pricing.daily_rate}
                            onChange={handlePricingChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>
                        <div>
                          <label htmlFor="weekly_rate" className="block text-xs font-medium text-gray-400">
                            Weekly Rate
                          </label>
                          <input
                            type="number"
                            id="weekly_rate"
                            name="weekly_rate"
                            value={screen.pricing.weekly_rate}
                            onChange={handlePricingChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
                          />
                        </div>
                        <div>
                          <label htmlFor="currency" className="block text-xs font-medium text-gray-400">
                            Currency
                          </label>
                          <select
                            id="currency"
                            name="currency"
                            value={screen.pricing.currency}
                            onChange={handlePricingChange}
                            className="mt-1 block w-full border border-gray-700 bg-gray-900/60 rounded-lg shadow-sm p-3 text-gray-100"
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
                          screenMsg.toLowerCase().includes('success')
                            ? 'bg-green-900/30 text-green-200 border border-green-800'
                            : 'bg-red-900/30 text-red-200 border border-red-800'
                        }`}
                      >
                        {screenMsg}
                      </div>
                    )}

                    <div className="flex justify-end gap-3">
                      <button
                        type="button"
                        onClick={() => setShowAddScreen(false)}
                        className="px-5 py-2.5 rounded-xl font-semibold text-gray-200 bg-gray-800 hover:bg-gray-700 transition-colors"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={screenLoading}
                        className="px-5 py-2.5 rounded-xl font-semibold text-white bg-blue-600 hover:bg-blue-700 disabled:opacity-60 transition-colors"
                      >
                        {screenLoading ? 'Saving...' : 'Register Screen'}
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