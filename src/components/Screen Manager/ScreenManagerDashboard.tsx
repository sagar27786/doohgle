import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { createScreen, getMyScreens, ScreenPayload, ScreenAsset, ScreenPricing, ScreenAvailability } from '../../api/screens';
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
  LogOut
} from 'lucide-react';
import BookingList from '../VenueDashboard/BookingList';
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
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
        <span className="flex-1 text-sm font-medium text-gray-900 text-left">Sadashiv T...</span>
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
      if (appMenuRef.current && !appMenuRef.current.contains(e.target as Node)) {
        setAppMenuOpen(false);
      }
    }
    if (appMenuOpen) document.addEventListener('mousedown', onDocClick);
    return () => document.removeEventListener('mousedown', onDocClick);
  }, [appMenuOpen]);
  const navigationItems: NavigationItem[] = [
    { id: 'gallery', label: 'Gallery', icon: Grid },
    { id: 'discover', label: 'Discover', icon: Search },
  { id: 'your_screens', label: 'Your Screens', icon: Tv },
    { id: 'screens', label: 'Screens', icon: Monitor },
  { id: 'your_bookings', label: 'Your Bookings', icon: Building2 },
    { id: 'locations', label: 'Locations', icon: MapPin },
    { id: 'earn', label: 'Earn Money', icon: DollarSign, hasSubmenu: true },
    { id: 'upgrade', label: 'Upgrade Plan', icon: ArrowUp },
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
                  navigate('/products/ads-manager');
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
                  ? 'bg-blue-50 text-blue-600'
                  : 'text-gray-700 hover:bg-gray-50'
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
  { id: 'all', label: 'Show all' },
  { id: 'screen', label: 'Screen Manager' },
  { id: 'ads', label: 'Ads Manager' },
  { id: 'content', label: 'Content' },
  { id: 'framen', label: 'Doohgle' },
];

const tabDummyContent: Record<string, string[]> = {
  all: [
    'All Content Block 1',
    'All Content Block 2',
    'All Content Block 3',
  ],
  screen: [
    'Screen Manager Content 1',
    'Screen Manager Content 2',
  ],
  ads: [
    'Ads Manager Content 1',
    'Ads Manager Content 2',
  ],
  content: [
    'Content Tab Example 1',
    'Content Tab Example 2',
  ],
  framen: [
    'Doohgle Tab Example 1',
    'Doohgle Tab Example 2',
  ],
};

const MainContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('all');

  return (
    <div className="flex flex-col w-full h-full bg-gray-50">
      {/* Tab Bar */}
      <div className="px-8 pt-6 pb-2 bg-white">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-6">Select:</span>
          <div className="flex flex-1 justify-evenly">
            {TABS.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 mx-2 px-4 py-2 text-sm rounded-full transition-colors font-medium text-center ${
                  activeTab === tab.id
                    ? 'bg-gray-200 text-gray-900'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
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
          {tabDummyContent[activeTab].map((content, idx) => (
            <div key={idx} className="bg-white rounded-xl shadow p-8 text-lg text-gray-800">
              {content}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Screen Registration Form
const ScreenRegistrationForm: React.FC = () => {
  const [form, setForm] = useState({
    // Basic Details
    screen_name: '',
    location_in_venue: '',
    screen_size_inches: '',
    resolution: '',
    orientation: 'landscape' as const,
    device_type: 'smart_tv' as const,
    device_model: '',
    ads_enabled: false,
    ad_frequency: 0,
    viewing_distance: 'close' as const,
    typical_viewer_duration: '',
    peak_viewing_hours: [] as string[],
    // Assets
    assets: [] as Array<{ asset_type: 'photo_day' | 'photo_night' | 'video'; url: string }>,
    // Pricing
    pricing: {
      hourly_rate: 0,
      daily_rate: 0,
      weekly_rate: 0,
      currency: 'INR'
    },
    // Availability
    availability: [] as Array<{ date: string; is_available: boolean }>
  });
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState<{ text: string; error: boolean } | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const target = e.target as HTMLInputElement & HTMLSelectElement;
    const name = target.name;
    const isCheckbox = (target as HTMLInputElement).type === 'checkbox';
    const value: any = isCheckbox ? (target as HTMLInputElement).checked : target.value;
    setForm(prev => ({
      ...prev,
      [name]: value,
    }));
  };

  const updatePeakHour = (idx: number, value: string) => {
    setForm(prev => {
      const list = [...prev.peak_viewing_hours];
      list[idx] = value;
      return { ...prev, peak_viewing_hours: list };
    });
  };
  const addPeakHour = () => setForm(prev => ({ ...prev, peak_viewing_hours: [...prev.peak_viewing_hours, ''] }));
  const removePeakHour = (idx: number) => setForm(prev => ({ ...prev, peak_viewing_hours: prev.peak_viewing_hours.filter((_, i) => i !== idx) }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setMsg(null);
    try {
      const payload: ScreenPayload = {
        screen_name: form.screen_name.trim(),
        location_in_venue: form.location_in_venue.trim(),
        screen_size_inches: form.screen_size_inches ? Number(form.screen_size_inches) : null,
        resolution: form.resolution.trim() || null,
        orientation: form.orientation,
        device_type: form.device_type,
        device_model: form.device_model.trim() || null,
        ads_enabled: !!form.ads_enabled,
        ad_frequency: Number(form.ad_frequency) || 0,
        viewing_distance: form.viewing_distance,
        typical_viewer_duration: form.typical_viewer_duration.trim() || null,
        peak_viewing_hours: form.peak_viewing_hours.filter(hour => hour.trim()),
        assets: form.assets,
        pricing: {
          hourly_rate: form.pricing.hourly_rate || undefined,
          daily_rate: form.pricing.daily_rate || undefined,
          weekly_rate: form.pricing.weekly_rate || undefined,
          currency: form.pricing.currency
        },
        availability: form.availability.map(a => ({
          date: a.date,
          is_available: a.is_available
        }))
      };
      const { ok, data } = await createScreen(payload);
      if (ok) {
        setMsg({ text: data?.message || 'Screen registered successfully!', error: false });
      } else {
        setMsg({ text: data?.message || 'Failed to register screen', error: true });
      }
    } catch (err) {
      setMsg({ text: 'Something went wrong. Please try again.', error: true });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-gray-50">
      <div className="max-w-3xl mx-auto bg-white rounded-2xl shadow-lg ring-1 ring-gray-100 p-8 md:p-10">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">Register a Screen</h2>
          <p className="mt-1 text-sm text-gray-500">Add basic details about your display to start managing content and ads.</p>
        </div>
        {msg && (
          <div className={`mb-6 rounded-lg border px-4 py-3 text-sm ${msg.error ? 'bg-red-50 text-red-700 border-red-200' : 'bg-green-50 text-green-700 border-green-200'}`}>{msg.text}</div>
        )}
        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Screen name</label>
            <input name="screen_name" value={form.screen_name} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" placeholder="Reception Display #1" required />
          </div>
          <div className="md:col-span-1">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Location in venue</label>
            <input name="location_in_venue" value={form.location_in_venue} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" placeholder="Main Reception" required />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Screen size (inches)</label>
            <input name="screen_size_inches" type="number" min={1} value={form.screen_size_inches} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" placeholder="55" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Resolution</label>
            <input name="resolution" value={form.resolution} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" placeholder="1920x1080" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Orientation</label>
            <select name="orientation" value={form.orientation} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition">
              <option value="landscape">Landscape</option>
              <option value="portrait">Portrait</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Device type</label>
            <select name="device_type" value={form.device_type} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition">
              <option value="smart_tv">Smart TV</option>
              <option value="media_player">Media Player</option>
              <option value="custom">Custom</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Device model</label>
            <input name="device_model" value={form.device_model} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" placeholder="Samsung TU7000" />
          </div>
          <div className="flex items-center space-x-3 mt-1">
            <input id="ads_enabled" name="ads_enabled" type="checkbox" checked={form.ads_enabled} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
            <label htmlFor="ads_enabled" className="text-sm text-gray-700">Enable Ads</label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Ad Frequency (%)</label>
            <input name="ad_frequency" type="number" min={0} max={100} value={form.ad_frequency} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Viewing distance</label>
            <select name="viewing_distance" value={form.viewing_distance} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition">
              <option value="close">Close</option>
              <option value="medium">Medium</option>
              <option value="far">Far</option>
            </select>
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Typical viewer duration</label>
            <input name="typical_viewer_duration" value={form.typical_viewer_duration} onChange={handleChange} className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" placeholder="2-5 minutes" />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1.5">Peak viewing hours</label>
            <div className="space-y-2">
              {form.peak_viewing_hours.map((h, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <input value={h} onChange={(e) => updatePeakHour(idx, e.target.value)} className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5 text-gray-900 placeholder:text-gray-400 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition" placeholder="09:00-11:00" />
                  <button type="button" onClick={() => removePeakHour(idx)} className="px-3 py-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50 rounded-lg transition">Remove</button>
                </div>
              ))}
              <button type="button" onClick={addPeakHour} className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition">+ Add time range</button>
            </div>
          </div>

          {/* Assets Section */}
          <div className="md:col-span-2 border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Screen Assets</h3>
            <div className="space-y-4">
              {form.assets.map((asset, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <select 
                    value={asset.asset_type}
                    onChange={(e) => {
                      const newAssets = [...form.assets];
                      newAssets[idx] = { ...asset, asset_type: e.target.value as any };
                      setForm(prev => ({ ...prev, assets: newAssets }));
                    }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="photo_day">Day Photo</option>
                    <option value="photo_night">Night Photo</option>
                    <option value="video">Video</option>
                  </select>
                  <input
                    type="url"
                    value={asset.url}
                    onChange={(e) => {
                      const newAssets = [...form.assets];
                      newAssets[idx] = { ...asset, url: e.target.value };
                      setForm(prev => ({ ...prev, assets: newAssets }));
                    }}
                    placeholder="Asset URL"
                    className="flex-[2] rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        assets: prev.assets.filter((_, i) => i !== idx)
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
                  setForm(prev => ({
                    ...prev,
                    assets: [...prev.assets, { asset_type: 'photo_day', url: '' }]
                  }));
                }}
                className="px-3 py-2 text-sm text-blue-600 hover:text-blue-700 hover:bg-blue-50 rounded-lg transition"
              >
                + Add Asset
              </button>
            </div>
          </div>

          {/* Pricing Section */}
          <div className="md:col-span-2 border-t pt-6 mt-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">Screen Pricing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Hourly Rate</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricing.hourly_rate}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, hourly_rate: Number(e.target.value) }
                  }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Daily Rate</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricing.daily_rate}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, daily_rate: Number(e.target.value) }
                  }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Weekly Rate</label>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={form.pricing.weekly_rate}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, weekly_rate: Number(e.target.value) }
                  }))}
                  className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1.5">Currency</label>
                <select
                  value={form.pricing.currency}
                  onChange={(e) => setForm(prev => ({
                    ...prev,
                    pricing: { ...prev.pricing, currency: e.target.value }
                  }))}
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
            <h3 className="text-lg font-medium text-gray-900 mb-4">Screen Availability</h3>
            <div className="space-y-4">
              {form.availability.map((avail, idx) => (
                <div key={idx} className="flex items-center gap-4">
                  <input
                    type="date"
                    value={avail.date}
                    onChange={(e) => {
                      const newAvail = [...form.availability];
                      newAvail[idx] = { ...avail, date: e.target.value };
                      setForm(prev => ({ ...prev, availability: newAvail }));
                    }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  />
                  <select
                    value={avail.is_available.toString()}
                    onChange={(e) => {
                      const newAvail = [...form.availability];
                      newAvail[idx] = { ...avail, is_available: e.target.value === 'true' };
                      setForm(prev => ({ ...prev, availability: newAvail }));
                    }}
                    className="flex-1 rounded-lg border border-gray-300 bg-white px-3 py-2.5"
                  >
                    <option value="true">Available</option>
                    <option value="false">Not Available</option>
                  </select>
                  <button
                    type="button"
                    onClick={() => {
                      setForm(prev => ({
                        ...prev,
                        availability: prev.availability.filter((_, i) => i !== idx)
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
                  const today = new Date().toISOString().split('T')[0];
                  setForm(prev => ({
                    ...prev,
                    availability: [...prev.availability, { date: today, is_available: true }]
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
              {saving ? 'Saving...' : 'Register Screen'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
  
// My Screens Grid
const MyScreensGrid: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [screens, setScreens] = useState<Array<{
    id: number;
    screen_name: string;
    location_in_venue: string;
  }>>([]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      setLoading(true);
      setError(null);
      const { ok, data } = await getMyScreens();
      if (!mounted) return;
      if (ok && data?.screens) {
        setScreens(data.screens);
      } else {
        setError(data?.message || 'Failed to load screens');
      }
      setLoading(false);
    })();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="flex-1 overflow-y-auto p-8 md:p-10 bg-gray-50">
      <div className="max-w-6xl mx-auto">
        <div className="mb-6">
          <h2 className="text-2xl font-semibold text-gray-900 tracking-tight">My Screens</h2>
          <p className="mt-1 text-sm text-gray-500">Your registered screens appear here.</p>
        </div>
        {loading && (
          <div className="text-gray-600">Loading screens...</div>
        )}
        {error && (
          <div className="mb-4 rounded-lg border px-4 py-3 text-sm bg-red-50 text-red-700 border-red-200">{error}</div>
        )}
        {!loading && !error && (
          screens.length === 0 ? (
            <div className="text-gray-600">No screens found.</div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {screens.map((s) => (
                <div key={s.id} className="bg-white rounded-2xl shadow ring-1 ring-gray-100 overflow-hidden">
                  {/* Image area (3/4th of the card) */}
                  <div className="aspect-video bg-gray-100">
                    <img
                      src={`https://picsum.photos/seed/screen-${s.id}/640/360`}
                      alt={s.screen_name}
                      className="w-full h-full object-cover"
                      loading="lazy"
                    />
                  </div>
                  {/* Footer */}
                  <div className="px-4 py-3 border-t border-gray-100">
                    <div className="text-sm font-medium text-gray-900 truncate">{s.screen_name}</div>
                    <div className="text-sm text-gray-500 truncate">{s.location_in_venue}</div>
                  </div>
                </div>
              ))}
            </div>
          )
        )}
      </div>
    </div>
  );
};

// Main Screen Manager Dashboard Component
const ScreenManagerDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('gallery');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);

  return (
    <div className="flex h-screen bg-gray-100 font-sans relative">
      {/* Sidebar with transition */}
      <div
        className={`transition-all duration-300 h-full ${sidebarOpen ? 'w-80' : 'w-0'} overflow-hidden relative`}
        style={{ minWidth: sidebarOpen ? '20rem' : '0' }}
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
        <Sidebar activeTab={activeTab} onTabChange={setActiveTab} sidebarOpen={sidebarOpen} />
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
        {activeTab === 'screens' ? (
          <ScreenRegistrationForm />
        ) : activeTab === 'your_screens' ? (
          <MyScreensGrid />
        ) : activeTab === 'your_bookings' ? (
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
