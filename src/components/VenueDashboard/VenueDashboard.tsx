import { useState } from "react";
import ScreenList from "./ScreenList";
import BookingList from "./BookingList";
import EarningsList from "./EarningsList";
import { venueService } from "../../services/venueService";
import {
  FaTv,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaPlus,
  FaEnvelope,
} from "react-icons/fa";
import IncomingCampaignRequests from "../Campaign/IncomingCampaignRequests";
import NotificationPanel from "../Campaign/NotificationPanel";

const AssetAndPricingForms = () => {
  const [screenId, setScreenId] = useState("");
  const [assetType, setAssetType] = useState("photo_day");
  const [assetUrl, setAssetUrl] = useState("");
  const [pricing, setPricing] = useState({
    hourly_rate: "",
    daily_rate: "",
    weekly_rate: "",
  });
  const [pricingMsg, setPricingMsg] = useState("");
  const [assetMsg, setAssetMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssetMsg("");
    setLoading(true);
    try {
      await venueService.uploadScreenAsset(Number(screenId), {
        asset_type: assetType,
        url: assetUrl,
      });
      setAssetMsg("Asset uploaded successfully!");
    } catch (err: any) {
      setAssetMsg(err?.response?.data?.message || "Failed to upload asset");
    } finally {
      setLoading(false);
    }
  };

  const handlePricingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPricingMsg("");
    setLoading(true);
    try {
      await venueService.setScreenPricing({
        screen_id: screenId,
        hourly_rate: pricing.hourly_rate,
        daily_rate: pricing.daily_rate,
        weekly_rate: pricing.weekly_rate,
      });
      setPricingMsg("Pricing updated successfully!");
    } catch (err: any) {
      setPricingMsg(err?.response?.data?.message || "Failed to set pricing");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-8 grid grid-cols-1 md:grid-cols-2 gap-8">
      <form onSubmit={handleAssetSubmit} className="p-4 border rounded-md">
        <h2 className="font-semibold mb-2">Upload Screen Asset</h2>
        <input
          type="text"
          placeholder="Screen ID"
          value={screenId}
          onChange={(e) => setScreenId(e.target.value)}
          className="mb-2 w-full border px-2 py-1 rounded"
          required
        />
        <select
          value={assetType}
          onChange={(e) => setAssetType(e.target.value as any)}
          className="mb-2 w-full border px-2 py-1 rounded"
        >
          <option value="photo_day">Photo (Day)</option>
          <option value="photo_night">Photo (Night)</option>
          <option value="video">Video</option>
        </select>
        <input
          type="text"
          placeholder="Asset URL"
          value={assetUrl}
          onChange={(e) => setAssetUrl(e.target.value)}
          className="mb-2 w-full border px-2 py-1 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Upload
        </button>
        {assetMsg && (
          <div className="mt-2 text-sm text-red-500">{assetMsg}</div>
        )}
      </form>

      <form onSubmit={handlePricingSubmit} className="p-4 border rounded-md">
        <h2 className="font-semibold mb-2">Set Screen Pricing</h2>
        <input
          type="text"
          placeholder="Screen ID"
          value={screenId}
          onChange={(e) => setScreenId(e.target.value)}
          className="mb-2 w-full border px-2 py-1 rounded"
          required
        />
        <input
          type="number"
          placeholder="Hourly Rate"
          value={pricing.hourly_rate}
          onChange={(e) =>
            setPricing({ ...pricing, hourly_rate: e.target.value })
          }
          className="mb-2 w-full border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Daily Rate"
          value={pricing.daily_rate}
          onChange={(e) =>
            setPricing({ ...pricing, daily_rate: e.target.value })
          }
          className="mb-2 w-full border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Weekly Rate"
          value={pricing.weekly_rate}
          onChange={(e) =>
            setPricing({ ...pricing, weekly_rate: e.target.value })
          }
          className="mb-2 w-full border px-2 py-1 rounded"
        />
        <button
          type="submit"
          className="bg-green-600 text-white px-4 py-2 rounded"
          disabled={loading}
        >
          Set Pricing
        </button>
        {pricingMsg && (
          <div className="mt-2 text-sm text-red-500">{pricingMsg}</div>
        )}
      </form>
    </div>
  );
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
  peak_viewing_hours: ["09:00-17:00"],

  // Assets
  assets: [{ asset_type: "photo_day", url: "" }],

  // Pricing
  pricing: {
    hourly_rate: "",
    daily_rate: "",
    weekly_rate: "",
    currency: "INR",
  },
};

const VenueDashboard = () => {
  const [activeTab, setActiveTab] = useState("screens");
  const [showAddScreen, setShowAddScreen] = useState(false); // To control the modal for adding screens
  const [showNotifications, setShowNotifications] = useState(false);

  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setShowAddScreen(false); // Close the add screen modal if open when changing tabs
  };

  const handleAddScreenClick = () => {
    setShowAddScreen(true);
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
    peak_viewing_hours: ["09:00-17:00"],

    // Assets
    assets: [{ asset_type: "photo_day", url: "" }],

    // Pricing
    pricing: {
      hourly_rate: "",
      daily_rate: "",
      weekly_rate: "",
      currency: "INR",
    },
  };

  const [screen, setScreen] = useState(screenInitialState);
  const [screenMsg, setScreenMsg] = useState("");
  const [screenLoading, setScreenLoading] = useState(false);

  const handleScreenChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
  ) => {
    const { name, value } = e.target;
    setScreen((prev) => ({ ...prev, [name]: value }));
  };

  const handlePricingChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setScreen((prev) => ({
      ...prev,
      pricing: { ...prev.pricing, [name]: value },
    }));
  };

  const handleAssetChange = (
    index: number,
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    const newAssets = [...screen.assets];
    // @ts-ignore
    newAssets[index][name] = value;
    setScreen((prev) => ({ ...prev, assets: newAssets }));
  };

  const addAssetField = () => {
    setScreen((prev) => ({
      ...prev,
      assets: [...prev.assets, { asset_type: "photo_day", url: "" }],
    }));
  };

  const removeAssetField = (index: number) => {
    setScreen((prev) => ({
      ...prev,
      assets: prev.assets.filter((_, i) => i !== index),
    }));
  };

  const handlePeakViewingHoursChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { value, selectedOptions } = e.target;
    const selectedHours = Array.from(selectedOptions).map(
      (option) => option.value
    );
    setScreen((prev) => ({
      ...prev,
      peak_viewing_hours: selectedHours,
    }));
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
        user_id: userData.id,
        pricing: {
          ...screen.pricing,
          hourly_rate: screen.pricing.hourly_rate
            ? Number(screen.pricing.hourly_rate)
            : undefined,
          daily_rate: screen.pricing.daily_rate
            ? Number(screen.pricing.daily_rate)
            : undefined,
          weekly_rate: screen.pricing.weekly_rate
            ? Number(screen.pricing.weekly_rate)
            : undefined,
        },
        assets: screen.assets.filter((asset) => asset.url.trim() !== ""),
      };
      await venueService.createScreen(screenData);
      setScreenMsg("Screen registered successfully!");
      setScreen(screenInitialState); // Reset form
      setShowAddScreen(false); // Close modal on success
      setActiveTab("screens"); // Go to screens list
    } catch (err: any) {
      setScreenMsg(err?.response?.data?.message || "Failed to register screen");
    } finally {
      setScreenLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-gradient-to-br from-gray-50 to-blue-100">
      {/* Sidebar */}
      <aside className="w-72 bg-white shadow-xl p-8 flex flex-col min-h-screen border-r border-blue-100">
        <div className="flex justify-between items-center mb-10">
          <h2 className="text-2xl font-bold text-blue-700 tracking-tight">
            Venue Dashboard
          </h2>
          <button
            onClick={() => setShowNotifications(true)}
            className="relative p-2 text-blue-600 hover:bg-blue-100 rounded-full transition-colors"
            title="Notifications"
          >
            <FaEnvelope size={20} />
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              3
            </span>
          </button>
        </div>
        <nav>
          <ul className="space-y-3">
            <li>
              <button
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-150 text-lg font-medium ${
                  activeTab === "screens" && !showAddScreen
                    ? "bg-blue-600 text-white shadow"
                    : "text-blue-700 hover:bg-blue-100"
                }`}
                onClick={() => handleTabChange("screens")}
              >
                <FaTv size={24} /> My Screens
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-150 text-lg font-medium ${
                  activeTab === "bookings" && !showAddScreen
                    ? "bg-blue-600 text-white shadow"
                    : "text-blue-700 hover:bg-blue-100"
                }`}
                onClick={() => handleTabChange("bookings")}
              >
                <FaCalendarCheck size={24} /> My Bookings
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-150 text-lg font-medium ${
                  activeTab === "earnings" && !showAddScreen
                    ? "bg-blue-600 text-white shadow"
                    : "text-blue-700 hover:bg-blue-100"
                }`}
                onClick={() => handleTabChange("earnings")}
              >
                <FaMoneyBillWave size={24} /> My Earnings
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-150 text-lg font-medium ${
                  activeTab === "campaign-requests" && !showAddScreen
                    ? "bg-blue-600 text-white shadow"
                    : "text-blue-700 hover:bg-blue-100"
                } relative`}
                onClick={() => handleTabChange("campaign-requests")}
              >
                <FaEnvelope size={24} /> Campaign Requests
                <span className="absolute top-1 right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                  !
                </span>
              </button>
            </li>
            <li>
              <button
                className={`flex items-center gap-3 w-full text-left px-4 py-3 rounded-lg transition-all duration-150 text-lg font-medium ${
                  showAddScreen
                    ? "bg-green-600 text-white shadow"
                    : "text-green-700 hover:bg-green-100"
                }`}
                onClick={handleAddScreenClick}
              >
                <FaPlus size={24} /> Register New Screen
              </button>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-10 flex flex-col items-center">
        <div className="w-full max-w-4xl">
          <h1 className="text-3xl font-extrabold text-blue-800 mb-2">
            Venue Owner Dashboard
          </h1>
          <p className="mb-8 text-gray-600">
            Welcome! Manage your screens, bookings, earnings, and more below.
          </p>

          {/* Registration form as right pane content, not modal */}
          <div className="mt-2">
            {showAddScreen ? (
              <div className="bg-white rounded-2xl shadow-2xl p-10 w-full relative border border-blue-100 animate-fade-in">
                <button
                  className="absolute top-4 right-4 text-gray-400 hover:text-red-500 text-2xl"
                  onClick={() => setShowAddScreen(false)}
                  aria-label="Close registration form"
                >
                  &times;
                </button>
                <h2 className="text-2xl font-bold mb-6 text-blue-700">
                  Register New Screen
                </h2>
                <form onSubmit={handleScreenSubmit} className="space-y-8">
                  {/* Basic Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">
                      Basic Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="screen_name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Screen Name
                        </label>
                        <input
                          type="text"
                          id="screen_name"
                          name="screen_name"
                          value={screen.screen_name}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="location_in_venue"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Location in Venue
                        </label>
                        <input
                          type="text"
                          id="location_in_venue"
                          name="location_in_venue"
                          value={screen.location_in_venue}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                    <div className="mt-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Description
                      </label>
                      <textarea
                        id="description"
                        name="description"
                        value={screen.description}
                        onChange={handleScreenChange}
                        rows={3}
                        className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                      ></textarea>
                    </div>
                  </div>
                  <hr className="my-4 border-blue-100" />
                  {/* Address Info */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">
                      Address Information
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="address_line1"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address Line 1
                        </label>
                        <input
                          type="text"
                          id="address_line1"
                          name="address_line1"
                          value={screen.address_line1}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="address_line2"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Address Line 2
                        </label>
                        <input
                          type="text"
                          id="address_line2"
                          name="address_line2"
                          value={screen.address_line2}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="city"
                          className="block text-sm font-medium text-gray-700"
                        >
                          City
                        </label>
                        <input
                          type="text"
                          id="city"
                          name="city"
                          value={screen.city}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="state"
                          className="block text-sm font-medium text-gray-700"
                        >
                          State
                        </label>
                        <input
                          type="text"
                          id="state"
                          name="state"
                          value={screen.state}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="country"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Country
                        </label>
                        <input
                          type="text"
                          id="country"
                          name="country"
                          value={screen.country}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="postal_code"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Postal Code
                        </label>
                        <input
                          type="text"
                          id="postal_code"
                          name="postal_code"
                          value={screen.postal_code}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="latitude"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Latitude
                        </label>
                        <input
                          type="text"
                          id="latitude"
                          name="latitude"
                          value={screen.latitude}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="longitude"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Longitude
                        </label>
                        <input
                          type="text"
                          id="longitude"
                          name="longitude"
                          value={screen.longitude}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                    </div>
                  </div>
                  <hr className="my-4 border-blue-100" />
                  {/* Technical Specs */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">
                      Technical Specifications
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div>
                        <label
                          htmlFor="width_px"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Width (px)
                        </label>
                        <input
                          type="number"
                          id="width_px"
                          name="width_px"
                          value={screen.width_px}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="height_px"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Height (px)
                        </label>
                        <input
                          type="number"
                          id="height_px"
                          name="height_px"
                          value={screen.height_px}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="resolution"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Resolution
                        </label>
                        <input
                          type="text"
                          id="resolution"
                          name="resolution"
                          value={screen.resolution}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          placeholder="e.g., 1920x1080"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="orientation"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Orientation
                        </label>
                        <select
                          id="orientation"
                          name="orientation"
                          value={screen.orientation}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="landscape">Landscape</option>
                          <option value="portrait">Portrait</option>
                        </select>
                      </div>
                      <div>
                        <label
                          htmlFor="device_type"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Device Type
                        </label>
                        <input
                          type="text"
                          id="device_type"
                          name="device_type"
                          value={screen.device_type}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="device_model"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Device Model
                        </label>
                        <input
                          type="text"
                          id="device_model"
                          name="device_model"
                          value={screen.device_model}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div className="flex items-center mt-2">
                        <input
                          type="checkbox"
                          id="ads_enabled"
                          name="ads_enabled"
                          checked={screen.ads_enabled}
                          onChange={(e) =>
                            setScreen((prev) => ({
                              ...prev,
                              ads_enabled: e.target.checked,
                            }))
                          }
                          className="h-4 w-4 text-blue-600 border-gray-300 rounded focus:ring-2 focus:ring-blue-400"
                        />
                        <label
                          htmlFor="ads_enabled"
                          className="ml-2 block text-sm font-medium text-gray-700"
                        >
                          Ads Enabled
                        </label>
                      </div>
                      <div>
                        <label
                          htmlFor="ad_frequency"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Ad Frequency (per hour)
                        </label>
                        <input
                          type="number"
                          id="ad_frequency"
                          name="ad_frequency"
                          value={screen.ad_frequency}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="viewing_distance"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Viewing Distance
                        </label>
                        <input
                          type="text"
                          id="viewing_distance"
                          name="viewing_distance"
                          value={screen.viewing_distance}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="typical_viewer_duration"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Typical Viewer Duration
                        </label>
                        <input
                          type="text"
                          id="typical_viewer_duration"
                          name="typical_viewer_duration"
                          value={screen.typical_viewer_duration}
                          onChange={handleScreenChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="peak_viewing_hours"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Peak Viewing Hours
                        </label>
                        <select
                          id="peak_viewing_hours"
                          name="peak_viewing_hours"
                          multiple
                          value={screen.peak_viewing_hours}
                          onChange={handlePeakViewingHoursChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 h-24 focus:ring-2 focus:ring-blue-400"
                        >
                          <option value="00:00-01:00">00:00-01:00</option>
                          <option value="01:00-02:00">01:00-02:00</option>
                          <option value="02:00-03:00">02:00-03:00</option>
                          <option value="03:00-04:00">03:00-04:00</option>
                          <option value="04:00-05:00">04:00-05:00</option>
                          <option value="05:00-06:00">05:00-06:00</option>
                          <option value="06:00-07:00">06:00-07:00</option>
                          <option value="07:00-08:00">07:00-08:00</option>
                          <option value="08:00-09:00">08:00-09:00</option>
                          <option value="09:00-10:00">09:00-10:00</option>
                          <option value="10:00-11:00">10:00-11:00</option>
                          <option value="11:00-12:00">11:00-12:00</option>
                          <option value="12:00-13:00">12:00-13:00</option>
                          <option value="13:00-14:00">13:00-14:00</option>
                          <option value="14:00-15:00">14:00-15:00</option>
                          <option value="15:00-16:00">15:00-16:00</option>
                          <option value="16:00-17:00">16:00-17:00</option>
                          <option value="17:00-18:00">17:00-18:00</option>
                          <option value="18:00-19:00">18:00-19:00</option>
                          <option value="19:00-20:00">19:00-20:00</option>
                          <option value="20:00-21:00">20:00-21:00</option>
                          <option value="21:00-22:00">21:00-22:00</option>
                          <option value="22:00-23:00">22:00-23:00</option>
                          <option value="23:00-24:00">23:00-24:00</option>
                        </select>
                      </div>
                    </div>
                  </div>
                  <hr className="my-4 border-blue-100" />
                  {/* Assets */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">
                      Assets
                    </h3>
                    {screen.assets.map((asset, index) => (
                      <div
                        key={index}
                        className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4 items-end"
                      >
                        <div>
                          <label
                            htmlFor={`asset_type_${index}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Asset Type
                          </label>
                          <select
                            id={`asset_type_${index}`}
                            name="asset_type"
                            value={asset.asset_type}
                            onChange={(e) => handleAssetChange(index, e)}
                            className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          >
                            <option value="photo_day">Photo (Day)</option>
                            <option value="photo_night">Photo (Night)</option>
                            <option value="video">Video</option>
                          </select>
                        </div>
                        <div className="md:col-span-2">
                          <label
                            htmlFor={`asset_url_${index}`}
                            className="block text-sm font-medium text-gray-700"
                          >
                            Asset URL
                          </label>
                          <input
                            type="url"
                            id={`asset_url_${index}`}
                            name="url"
                            value={asset.url}
                            onChange={(e) => handleAssetChange(index, e)}
                            className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                            required
                          />
                        </div>
                        {screen.assets.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeAssetField(index)}
                            className="ml-2 p-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                          >
                            Remove
                          </button>
                        )}
                      </div>
                    ))}
                    <button
                      type="button"
                      onClick={addAssetField}
                      className="mb-4 px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                    >
                      Add Asset
                    </button>
                  </div>
                  <hr className="my-4 border-blue-100" />
                  {/* Pricing */}
                  <div>
                    <h3 className="text-lg font-semibold mb-2 text-blue-600">
                      Pricing
                    </h3>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div>
                        <label
                          htmlFor="hourly_rate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Hourly Rate
                        </label>
                        <input
                          type="number"
                          id="hourly_rate"
                          name="hourly_rate"
                          value={screen.pricing.hourly_rate}
                          onChange={handlePricingChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="daily_rate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Daily Rate
                        </label>
                        <input
                          type="number"
                          id="daily_rate"
                          name="daily_rate"
                          value={screen.pricing.daily_rate}
                          onChange={handlePricingChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                      <div>
                        <label
                          htmlFor="weekly_rate"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Weekly Rate
                        </label>
                        <input
                          type="number"
                          id="weekly_rate"
                          name="weekly_rate"
                          value={screen.pricing.weekly_rate}
                          onChange={handlePricingChange}
                          className="mt-1 block w-full border border-blue-200 rounded-lg shadow-sm p-3 focus:ring-2 focus:ring-blue-400"
                          required
                        />
                      </div>
                    </div>
                  </div>
                  {screenMsg && (
                    <div className="mt-4 p-2 text-center text-green-700 bg-green-100 rounded-md">
                      {screenMsg}
                    </div>
                  )}
                  <button
                    type="submit"
                    className="mt-6 w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-semibold text-lg hover:bg-blue-700 transition duration-300 shadow"
                    disabled={screenLoading}
                  >
                    {screenLoading ? "Registering..." : "Register Screen"}
                  </button>
                </form>
              </div>
            ) : (
              <>
                {activeTab === "screens" && <ScreenList />}
                {activeTab === "bookings" && <BookingList />}
                {activeTab === "earnings" && <EarningsList />}
                {activeTab === "campaign-requests" && (
                  <IncomingCampaignRequests />
                )}
              </>
            )}

            {/* Notification Panel */}
            <NotificationPanel
              isOpen={showNotifications}
              onClose={() => setShowNotifications(false)}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default VenueDashboard;
