import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  createScreen,
  getMyScreens,
  ScreenPayload,
  ScreenAsset,
  ScreenPricing,
  ScreenAvailability,
} from "../../api/screens";
import ScreenVisibilityService from "../../services/screenVisibilityService";
import { ImageUploadService } from "../../services/imageUploadService";
import {
  Grid,
  Search,
  Tv,
  Monitor,
  MapPin,
  DollarSign,
  ArrowUp,
  HelpCircle,
  Settings,
  ChevronRight,
  ChevronLeft,
  Sparkles,
  User,
  Building2,
  LogOut,
  RefreshCw,
} from "lucide-react";
import BookingList from "../VenueDashboard/BookingList";
import NotificationBar from "../Notifications/NotificationBar";
import BookingRequests from "../Booking/BookingRequests";
interface NavigationItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  hasSubmenu?: boolean;
}

interface TabItem {
  id: string;
  label: string;
}

const UserProfileDropdown: React.FC = () => {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        className="flex items-center w-full px-2 py-2 bg-white rounded-lg shadow border border-gray-200 hover:bg-gray-50 transition-all"
        onClick={() => setOpen((prev) => !prev)}
      >
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center mr-3">
          <span className="text-sm font-medium text-gray-700">S</span>
        </div>
        <span className="flex-1 text-sm font-medium text-gray-900 text-left">
          Sadashiv T...
        </span>
        <Settings size={16} className="text-gray-400 ml-2" />
      </button>
      {open && (
        <div className="absolute bottom-12 left-0 w-56 bg-white rounded-xl shadow-lg border border-gray-100 z-50 flex flex-col py-2 animate-fade-in">
          <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-base">
            <User size={20} className="mr-3 text-gray-400" />
            Profile
          </button>
          <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-base">
            <Building2 size={20} className="mr-3 text-gray-400" />
            Organisation
          </button>
          <button className="flex items-center px-4 py-3 text-gray-700 hover:bg-gray-50 transition-colors text-base">
            <LogOut size={20} className="mr-3 text-gray-400" />
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
};

// Components
const Sidebar: React.FC<{
  activeTab: string;
  onTabChange: (tab: string) => void;
  sidebarOpen?: boolean;
}> = ({ activeTab, onTabChange }) => {
  const [appMenuOpen, setAppMenuOpen] = useState(false);
  const appMenuRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    function onDocClick(e: MouseEvent) {
      if (
        appMenuRef.current &&
        !appMenuRef.current.contains(e.target as Node)
      ) {
        setAppMenuOpen(false);
      }
    }
    if (appMenuOpen) document.addEventListener("mousedown", onDocClick);
    return () => document.removeEventListener("mousedown", onDocClick);
  }, [appMenuOpen]);
  const navigationItems: NavigationItem[] = [
    { id: "gallery", label: "Gallery", icon: Grid },
    { id: "discover", label: "Discover", icon: Search },
    { id: "your_screens", label: "Your Screens", icon: Tv },
    { id: "screens", label: "Screens", icon: Monitor },
    { id: "your_bookings", label: "Your Bookings", icon: Building2 },
    { id: "locations", label: "Locations", icon: MapPin },
    { id: "earn", label: "Earn Money", icon: DollarSign, hasSubmenu: true },
    { id: "upgrade", label: "Upgrade Plan", icon: ArrowUp },
  ];

  return (
    <div className="w-80 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200" ref={appMenuRef}>
        <div className="flex items-center space-x-2 relative">
          <div className="w-8 h-8 bg-blue-600 rounded flex items-center justify-center">
            <Grid className="w-4 h-4 text-white" />
          </div>
          <button
            type="button"
            onClick={() => setAppMenuOpen((v) => !v)}
            className="text-left"
            aria-haspopup="menu"
            aria-expanded={appMenuOpen}
          >
            <h1 className="font-semibold text-gray-900">DOOHGLE</h1>
            <p className="text-sm text-gray-500">Screen Manager</p>
          </button>

          {appMenuOpen && (
            <div
              role="menu"
              className="absolute top-12 left-0 w-64 bg-white rounded-xl shadow-lg border border-gray-200 z-50 overflow-hidden"
            >
              <button
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                onClick={() => {
                  setAppMenuOpen(false);
                  // stay on same page
                }}
              >
                Screen Manager Dashboard
              </button>
              <button
                className="w-full text-left px-4 py-3 text-sm hover:bg-gray-50"
                onClick={() => {
                  setAppMenuOpen(false);
                  navigate("/products/ads-manager");
                }}
              >
                Advertiser Dashboard
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 p-4">
        <nav className="space-y-2">
          {navigationItems.map((item) => (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                activeTab === item.id
                  ? "bg-blue-50 text-blue-600"
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <item.icon size={20} />
              <span className="flex-1">{item.label}</span>
              {item.hasSubmenu && (
                <ChevronRight size={16} className="text-gray-400" />
              )}
            </button>
          ))}
        </nav>
      </div>

      {/* Ask AI Button */}
      <div className="p-4 border-t border-gray-200">
        <button className="w-full flex items-center space-x-2 px-4 py-3 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all">
          <Sparkles size={16} />
          <span>Ask AI</span>
        </button>
      </div>

      {/* User Profile Dropdown */}
      <div className="p-4 border-t border-gray-200 relative">
        <UserProfileDropdown />
      </div>

      {/* Help & Support */}
      <div className="p-4">
        <button className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 transition-colors">
          <HelpCircle size={16} />
          <span className="text-sm">Help & Support</span>
        </button>
      </div>
    </div>
  );
};

const TABS = [
  { id: "all", label: "Show all" },
  { id: "screen", label: "Screen Manager" },
  { id: "ads", label: "Ads Manager" },
  { id: "bookings", label: "Booking Requests" },
  { id: "content", label: "Content" },
  { id: "framen", label: "Doohgle" },
];

const tabDummyContent: Record<string, string[]> = {
  all: ["All Content Block 1", "All Content Block 2", "All Content Block 3"],
  screen: ["Screen Tab Example 1", "Screen Tab Example 2"],
  ads: ["Ads Tab Example 1", "Ads Tab Example 2"],
  bookings: [], // Handled by BookingRequests component
  content: ["Content Tab Example 1", "Content Tab Example 2"],
  framen: ["Doohgle Tab Example 1", "Doohgle Tab Example 2"],
};

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("all");

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Tab Bar */}
      <div className="px-8 pt-6 pb-2 bg-white">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-6">Select:</span>
          <div className="flex flex-1 justify-evenly">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 mx-2 px-4 py-2 text-sm rounded-full transition-colors font-medium text-center ${
                  activeTab === tab.id
                    ? "bg-gray-200 text-gray-900"
                    : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-8">
        <div className="max-w-4xl mx-auto space-y-6">
          {activeTab === "bookings" ? (
            <BookingRequests />
          ) : (
            tabDummyContent[activeTab]?.map((content, idx) => (
              <div
                key={idx}
                className="bg-white rounded-xl shadow p-8 text-lg text-gray-800"
              >
                {content}
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// Screen Registration Form
const ScreenRegistrationForm: React.FC = () => {
  const [form, setForm] = useState({
    // Basic Details
    screen_name: "",
    location_in_venue: "",
    city: "",
    screen_size_inches: "",
    resolution: "",
    orientation: "landscape" as const,
    device_type: "smart_tv" as const,
    device_model: "",
    ads_enabled: true, // Enable ads by default for better visibility
    ad_frequency: 20, // Default 20% ad frequency
    viewing_distance: "close" as const,
    typical_viewer_duration: "",
    peak_viewing_hours: [] as string[],
    // Image fields for AWS integration (future)
    day_photo_url: "",
    night_photo_url: "",
    promotional_video_url: "",
    // Assets
    assets: [] as Array<{
      asset_type: "photo_day" | "photo_night" | "video";
      url: string;
    }>,
    // Pricing
    pricing: {
      hourly_rate: 500, // Default pricing
      daily_rate: 3000,
      weekly_rate: 18000,
      currency: "INR",
    },
    // Availability
    availability: [] as Array<{ date: string; is_available: boolean }>,
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; error: boolean } | null>(null);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const target = e.target as HTMLInputElement & HTMLSelectElement;
    const name = target.name;
    const isCheckbox = (target as HTMLInputElement).type === "checkbox";
    const value: any = isCheckbox
      ? (target as HTMLInputElement).checked
      : target.value;
    setForm((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePeakHour = (idx: number, value: string) => {
    setForm((prev) => {
      const list = [...prev.peak_viewing_hours];
      list[idx] = value;
      return { ...prev, peak_viewing_hours: list };
    });
  };
  const addPeakHour = () =>
    setForm((prev) => ({
      ...prev,
      peak_viewing_hours: [...prev.peak_viewing_hours, ""],
    }));
  const removePeakHour = (idx: number) =>
    setForm((prev) => ({
      ...prev,
      peak_viewing_hours: prev.peak_viewing_hours.filter((_, i) => i !== idx),
    }));

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files) return;

    const newFiles = Array.from(files);

    // Validate files
    const validation = ImageUploadService.validateImages(newFiles);
    if (!validation.valid) {
      setMsg({
        text: validation.errors.join(", "),
        error: true,
      });
      return;
    }

    // Add to selected images for preview (don't upload yet)
    setSelectedImages((prev) => [...prev, ...newFiles]);
    setMsg({
      text: `${newFiles.length} image(s) selected. They will be uploaded when you create the screen.`,
      error: false,
    });
  };

  const removeImage = (index: number) => {
    setSelectedImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const files = e.dataTransfer.files;
    if (!files) return;

    const newFiles = Array.from(files).filter((file) =>
      file.type.startsWith("image/")
    );

    if (newFiles.length === 0) {
      setMsg({
        text: "Please drop only image files",
        error: true,
      });
      return;
    }

    // Validate files
    const validation = ImageUploadService.validateImages(newFiles);
    if (!validation.valid) {
      setMsg({
        text: validation.errors.join(", "),
        error: true,
      });
      return;
    }

    setSelectedImages((prev) => [...prev, ...newFiles]);
    setMsg({
      text: `${newFiles.length} image(s) selected. They will be uploaded when you create the screen.`,
      error: false,
    });
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload: ScreenPayload = {
        screen_name: form.screen_name.trim(),
        location_in_venue: form.location_in_venue.trim(),
        city: form.city.trim() || null,
        screen_size_inches: form.screen_size_inches
          ? Number(form.screen_size_inches)
          : null,
        resolution: form.resolution.trim() || null,
        orientation: form.orientation,
        device_type: form.device_type,
        device_model: form.device_model.trim() || null,
        ads_enabled: !!form.ads_enabled,
        ad_frequency: Number(form.ad_frequency) || 0,
        viewing_distance: form.viewing_distance,
        typical_viewer_duration: form.typical_viewer_duration.trim() || null,
        peak_viewing_hours: form.peak_viewing_hours.filter((hour) =>
          hour.trim()
        ),
        assets: form.assets, // Keep existing form assets, don't add images yet
        pricing: {
          hourly_rate: form.pricing.hourly_rate || undefined,
          daily_rate: form.pricing.daily_rate || undefined,
          weekly_rate: form.pricing.weekly_rate || undefined,
          currency: form.pricing.currency,
        },
        availability: form.availability.map((a) => ({
          date: a.date,
          is_available: a.is_available,
        })),
      };
      const { ok, data } = await createScreen(payload);
      if (ok) {
        console.log("✅ Screen created successfully:", data);

        // If we have images selected, upload them to the newly created screen
        if (selectedImages.length > 0 && data?.screen?.id) {
          console.log(
            `📸 Uploading ${selectedImages.length} images to screen ${data.screen.id}`
          );
          const uploadResult = await ImageUploadService.uploadImages(
            selectedImages,
            data.screen.id.toString()
          );

          if (uploadResult.success) {
            console.log("✅ Images uploaded successfully to screen");
            setMsg({
              text: `Screen registered successfully with ${
                uploadResult.data?.count || 0
              } images!`,
              error: false,
            });
          } else {
            console.warn(
              "⚠️ Screen created but image upload failed:",
              uploadResult.error
            );
            setMsg({
              text: `Screen registered successfully, but image upload failed: ${uploadResult.error}`,
              error: false, // Still success since screen was created
            });
          }
        } else {
          setMsg({
            text: data?.message || "Screen registered successfully!",
            error: false,
          });
        }

        // 🎯 CRITICAL: Refresh ads manager visibility after screen creation
        try {
          const visibilityService = ScreenVisibilityService.getInstance();
          await visibilityService.refreshAfterScreenCreation();
          console.log(
            "✅ Screen successfully added to ads manager visibility!"
          );
        } catch (refreshError) {
          console.warn("⚠️ Failed to refresh ads manager:", refreshError);
        }

        // Clear the form after successful registration
        setForm({
          screen_name: "",
          location_in_venue: "",
          city: "",
          screen_size_inches: "",
          resolution: "",
          orientation: "landscape" as const,
          device_type: "smart_tv" as const,
          device_model: "",
          ads_enabled: true,
          ad_frequency: 20,
          viewing_distance: "close" as const,
          typical_viewer_duration: "",
          peak_viewing_hours: [] as string[],
          day_photo_url: "",
          night_photo_url: "",
          promotional_video_url: "",
          assets: [] as Array<{
            asset_type: "photo_day" | "photo_night" | "video";
            url: string;
          }>,
          pricing: {
            hourly_rate: 500,
            daily_rate: 3000,
            weekly_rate: 18000,
            currency: "INR",
          },
          availability: [] as Array<{ date: string; is_available: boolean }>,
        });
        setSelectedImages([]); // Clear selected images
      } else {
        setMsg({
          text: data?.message || "Failed to register screen",
          error: true,
        });
      }
    } catch (err) {
      setMsg({ text: "Something went wrong. Please try again.", error: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-8 md:p-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
            Register a Screen
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Add basic details about your display to start managing content and
            ads.
          </p>
        </div>
        {msg && (
          <div
            className={`mb-6 rounded-lg border px-4 py-3 text-sm ${
              msg.error
                ? "bg-red-50 text-red-700 border-red-200"
                : "bg-green-50 text-green-700 border-green-200"
            }`}
          >
            {msg.text}
          </div>
        )}
        <form
          onSubmit={handleSubmit}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Screen name
            </label>
            <input
              name="screen_name"
              value={form.screen_name}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="Reception Display #1"
              required
            />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Location in venue
            </label>
            <input
              name="location_in_venue"
              value={form.location_in_venue}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="Main Reception"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              City
            </label>
            <input
              name="city"
              value={form.city}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="Mumbai, Delhi, Bangalore, etc."
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Screen size (inches)
            </label>
            <input
              name="screen_size_inches"
              type="number"
              min={1}
              value={form.screen_size_inches}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="55"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Resolution
            </label>
            <input
              name="resolution"
              value={form.resolution}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="1920x1080"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Orientation
            </label>
            <select
              name="orientation"
              value={form.orientation}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
            >
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Device type
            </label>
            <select
              name="device_type"
              value={form.device_type}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
            >
              <option value="smart_tv">Smart TV</option>
              <option value="media_player">Media Player</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Device model
            </label>
            <input
              name="device_model"
              value={form.device_model}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="Samsung TU7000"
            />
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <input
              id="ads_enabled"
              name="ads_enabled"
              type="checkbox"
              checked={form.ads_enabled}
              onChange={handleChange}
              className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
            />
            <label htmlFor="ads_enabled" className="text-sm text-gray-700">
              Enable Ads
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Ad Frequency (%)
            </label>
            <input
              name="ad_frequency"
              type="number"
              min={0}
              max={100}
              value={form.ad_frequency}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Viewing distance
            </label>
            <select
              name="viewing_distance"
              value={form.viewing_distance}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
            >
              <option value="close">Close</option>
              <option value="medium">Medium</option>
              <option value="far">Far</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Typical viewer duration
            </label>
            <input
              name="typical_viewer_duration"
              value={form.typical_viewer_duration}
              onChange={handleChange}
              className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
              placeholder="2-5 minutes"
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Peak viewing hours
            </label>
            <div className="space-y-2">
              {form.peak_viewing_hours.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input
                    value={h}
                    onChange={(e) => updatePeakHour(idx, e.target.value)}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition"
                    placeholder="09:00-11:00"
                  />
                  <button
                    type="button"
                    onClick={() => removePeakHour(idx)}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={addPeakHour}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
              >
                + Add time range
              </button>
            </div>
          </div>

          {/* Image Upload Section */}
          <div className="md:col-span-2 border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Screen Images
            </h3>
            <p className="text-sm text-gray-500 mb-4">
              Upload images to showcase your screen (Day photos, Night photos,
              etc.)
            </p>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Upload Images
                </label>
                <div
                  className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:border-gray-400 transition-colors cursor-pointer"
                  onDrop={handleDrop}
                  onDragOver={handleDragOver}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <div className="space-y-1 text-center">
                    <svg
                      className="mx-auto h-12 w-12 text-gray-400"
                      stroke="currentColor"
                      fill="none"
                      viewBox="0 0 48 48"
                      aria-hidden="true"
                    >
                      <path
                        d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                        strokeWidth={2}
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    <div className="flex text-sm text-gray-600">
                      <span className="font-medium text-blue-600 hover:text-blue-500">
                        Click to upload
                      </span>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PNG, JPG, GIF up to 10MB
                    </p>
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  className="hidden"
                  onChange={handleImageUpload}
                />

                {/* Selected Images Preview */}
                {selectedImages.length > 0 && (
                  <div className="mt-4">
                    <h4 className="text-sm font-medium text-gray-700 mb-2">
                      Selected Images ({selectedImages.length})
                      <span className="text-blue-600 ml-2">
                        • Ready for upload
                      </span>
                    </h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {selectedImages.map((file, index) => (
                        <div key={index} className="relative group">
                          <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                            <img
                              src={URL.createObjectURL(file)}
                              alt={`Preview ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <button
                            type="button"
                            onClick={() => removeImage(index)}
                            className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                          >
                            ×
                          </button>
                          <p className="text-xs text-gray-500 mt-1 truncate">
                            {file.name}
                          </p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="md:col-span-2 border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Screen Pricing
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Hourly Rate
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricing.hourly_rate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      pricing: {
                        ...prev.pricing,
                        hourly_rate: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Daily Rate
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricing.daily_rate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      pricing: {
                        ...prev.pricing,
                        daily_rate: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Weekly Rate
                </label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricing.weekly_rate}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      pricing: {
                        ...prev.pricing,
                        weekly_rate: Number(e.target.value),
                      },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">
                  Currency
                </label>
                <select
                  value={form.pricing.currency}
                  onChange={(e) =>
                    setForm((prev) => ({
                      ...prev,
                      pricing: { ...prev.pricing, currency: e.target.value },
                    }))
                  }
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                >
                  <option value="INR">INR</option>
                  <option value="USD">USD</option>
                  <option value="EUR">EUR</option>
                </select>
              </div>
            </div>
          </div>

          {/* Availability Section */}
          <div className="md:col-span-2 border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Screen Availability
            </h3>
            <div className="space-y-4">
              {form.availability.map((avail, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <input
                    type="date"
                    value={avail.date}
                    onChange={(e) => {
                      const newAvail = [...form.availability];
                      newAvail[idx] = { ...avail, date: e.target.value };
                      setForm((prev) => ({ ...prev, availability: newAvail }));
                    }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                  <select
                    value={avail.is_available.toString()}
                    onChange={(e) => {
                      const newAvail = [...form.availability];
                      newAvail[idx] = {
                        ...avail,
                        is_available: e.target.value === "true",
                      };
                      setForm((prev) => ({ ...prev, availability: newAvail }));
                    }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setForm((prev) => ({
                        ...prev,
                        availability: prev.availability.filter(
                          (_, i) => i !== idx
                        ),
                      }));
                    }}
                    className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition"
                  >
                    Remove
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => {
                  const today = new Date().toISOString().split("T")[0];
                  setForm((prev) => ({
                    ...prev,
                    availability: [
                      ...prev.availability,
                      { date: today, is_available: true },
                    ],
                  }));
                }}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
              >
                + Add Date
              </button>
            </div>
          </div>

          <div className="md:col-span-2 border-t pt-6 mt-6">
            <button
              type="submit"
              disabled={saving}
              className="inline-flex items-center px-5 py-2.5 bg-blue-600 text-white rounded-lg shadow-sm hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 disabled:opacity-60"
            >
              {saving ? "Saving..." : "Register Screen"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// My Screens Grid
const MyScreensGrid: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screens, setScreens] = useState<
    Array<{
      id: number;
      screen_name: string;
      location_in_venue: string;
      image_url?: string;
      image_urls?: string;
      city?: string;
      created_at?: string;
    }>
  >([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { ok, data } = await getMyScreens();
        if (!mounted) return;

        if (ok && data?.screens) {
          console.log(`✅ Loaded ${data.screens.length} user screens`);
          setScreens(data.screens);
        } else {
          console.error("❌ Failed to load screens:", data?.message);
          setError(data?.message || "Failed to load screens");
        }
      } catch (err) {
        if (!mounted) return;
        console.error("❌ Error loading screens:", err);
        const errorMessage =
          err instanceof Error ? err.message : "Failed to load screens";
        setError(errorMessage);
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const refreshScreens = async () => {
    setLoading(true);
    setError(null);
    try {
      const { ok, data } = await getMyScreens();

      if (ok && data?.screens) {
        console.log(`✅ Refreshed: ${data.screens.length} user screens`);
        setScreens(data.screens);
      } else {
        console.error("❌ Failed to refresh screens:", data?.message);
        setError(data?.message || "Failed to load screens");
      }
    } catch (err) {
      console.error("❌ Error refreshing screens:", err);
      const errorMessage =
        err instanceof Error ? err.message : "Failed to load screens";
      setError(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">
              My Screens
            </h2>
            <p className="mt-1 text-sm text-gray-500">
              Your registered screens appear here.
            </p>
          </div>
          <button
            onClick={refreshScreens}
            disabled={loading}
            className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            <RefreshCw size={16} className={loading ? "animate-spin" : ""} />
            <span>Refresh</span>
          </button>
        </div>
        {loading && <div className="text-gray-600">Loading screens...</div>}
        {error && (
          <div className="mb-4 rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-700 border-red-200">
            {error}
          </div>
        )}
        {!loading &&
          !error &&
          (screens.length === 0 ? (
            <div className="text-gray-600">No screens found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {screens.map((s) => {
                // Helper function to get the primary image URL
                const getPrimaryImageUrl = (screen: any): string => {
                  // Check if we have uploaded images in image_urls
                  if (screen.image_urls) {
                    try {
                      const urls = JSON.parse(screen.image_urls);
                      if (Array.isArray(urls) && urls.length > 0) {
                        // Use first uploaded image
                        const imageUrl = urls[0];
                        // Convert relative paths to full URLs
                        if (imageUrl.startsWith("/api/")) {
                          return `http://localhost:4000${imageUrl}`;
                        }
                        return imageUrl;
                      }
                    } catch (e) {
                      console.warn("Failed to parse image_urls:", e);
                    }
                  }

                  // Check if we have a primary image_url
                  if (screen.image_url) {
                    // Convert relative paths to full URLs
                    if (screen.image_url.startsWith("/api/")) {
                      return `http://localhost:4000${screen.image_url}`;
                    }
                    return screen.image_url;
                  }

                  // No fallback image - return empty string to show placeholder
                  return "";
                };

                return (
                  <div
                    key={s.id}
                    className="bg-white rounded-2xl shadow ring-1 ring-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
                  >
                    {/* Image area (3/4th of the card) */}
                    <div className="aspect-video bg-gray-100 relative">
                      {getPrimaryImageUrl(s) ? (
                        <img
                          src={getPrimaryImageUrl(s)}
                          alt={s.screen_name}
                          className="w-full h-full object-cover"
                          loading="lazy"
                          onError={(e) => {
                            // Hide image on error and show placeholder
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center bg-gray-50 border-2 border-dashed border-gray-300">
                          <div className="text-center text-gray-500">
                            <div className="mb-2">📷</div>
                            <div className="text-sm font-medium">No Image Available</div>
                            <div className="text-xs">Upload images to display</div>
                          </div>
                        </div>
                      )}
                      {/* Upload indicator for screens with custom images */}
                      {(s.image_urls || s.image_url) && (
                        <div className="absolute top-2 right-2 bg-green-500 text-white px-2 py-1 rounded-full text-xs font-medium">
                          ✓ Custom Image
                        </div>
                      )}
                    </div>
                    {/* Footer */}
                    <div className="px-4 py-3 border-t border-gray-100">
                      <div className="text-sm font-medium text-gray-900 truncate">
                        {s.screen_name}
                      </div>
                      <div className="text-sm text-gray-500 truncate">
                        {s.location_in_venue}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ))}
      </div>
    </div>
  );
};

// Main Screen Manager Dashboard Component
const ScreenManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>("gallery");
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen bg-gray-100 font-sans relative">
      {/* NotificationBar for Screen Managers - Fixed position */}
      <div className="fixed top-4 right-4 z-50">
        <NotificationBar userType="screen_manager" />
      </div>

      {/* Sidebar with transition */}
      <div
        className={`transition-all duration-300 h-full ${
          sidebarOpen ? "w-80" : "w-0"
        } overflow-hidden relative`}
        style={{ minWidth: sidebarOpen ? "20rem" : "0" }}
      >
        {/* Toggle button inside sidebar when open */}
        {sidebarOpen && (
          <button
            className="absolute top-6 right-4 z-50 bg-white border border-gray-200 shadow rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300 ring-2 ring-white"
            onClick={() => setSidebarOpen(false)}
            aria-label="Collapse sidebar"
          >
            <ChevronLeft className="text-gray-500" />
          </button>
        )}
        <Sidebar
          activeTab={activeTab}
          onTabChange={setActiveTab}
          sidebarOpen={sidebarOpen}
        />
      </div>
      {/* Toggle button at screen edge when sidebar is closed */}
      {!sidebarOpen && (
        <button
          className="fixed top-6 left-2 z-50 bg-white border border-gray-200 shadow rounded-full w-10 h-10 flex items-center justify-center transition-all duration-300"
          onClick={() => setSidebarOpen(true)}
          aria-label="Expand sidebar"
        >
          <ChevronRight className="text-gray-500" />
        </button>
      )}
      {/* Main Content */}
      <div className="flex-1 flex flex-col">
        {activeTab === "screens" ? (
          <ScreenRegistrationForm />
        ) : activeTab === "your_screens" ? (
          <MyScreensGrid />
        ) : activeTab === "your_bookings" ? (
          <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-gray-50">
            <div className="max-w-6xl mx-auto">
              <BookingList />
            </div>
          </div>
        ) : (
          <MainContent />
        )}
      </div>
    </div>
  );
};

export default ScreenManagerDashboard;
