

import { useState } from 'react';
import ScreenList from './ScreenList';
import BookingList from './BookingList';
import { venueService } from '../../services/venueService';

const AssetAndPricingForms = () => {
  const [screenId, setScreenId] = useState('');
  const [assetType, setAssetType] = useState('photo_day');
  const [assetUrl, setAssetUrl] = useState('');
  const [pricing, setPricing] = useState({ hourly_rate: '', daily_rate: '', weekly_rate: '' });
  const [pricingMsg, setPricingMsg] = useState('');
  const [assetMsg, setAssetMsg] = useState('');
  const [loading, setLoading] = useState(false);

  const handleAssetSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setAssetMsg('');
    setLoading(true);
    try {
      await venueService.uploadScreenAsset(Number(screenId), { asset_type: assetType, url: assetUrl });
      setAssetMsg('Asset uploaded successfully!');
    } catch (err: any) {
      setAssetMsg(err?.response?.data?.message || 'Failed to upload asset');
    } finally {
      setLoading(false);
    }
  };

  const handlePricingSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPricingMsg('');
    setLoading(true);
    try {
      await venueService.setScreenPricing({
        screen_id: screenId,
        hourly_rate: pricing.hourly_rate,
        daily_rate: pricing.daily_rate,
        weekly_rate: pricing.weekly_rate,
      });
      setPricingMsg('Pricing updated successfully!');
    } catch (err: any) {
      setPricingMsg(err?.response?.data?.message || 'Failed to set pricing');
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
          onChange={e => setScreenId(e.target.value)}
          className="mb-2 w-full border px-2 py-1 rounded"
          required
        />
        <select value={assetType} onChange={e => setAssetType(e.target.value as any)} className="mb-2 w-full border px-2 py-1 rounded">
          <option value="photo_day">Photo (Day)</option>
          <option value="photo_night">Photo (Night)</option>
          <option value="video">Video</option>
        </select>
        <input
          type="text"
          placeholder="Asset URL"
          value={assetUrl}
          onChange={e => setAssetUrl(e.target.value)}
          className="mb-2 w-full border px-2 py-1 rounded"
          required
        />
        <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded" disabled={loading}>Upload</button>
        {assetMsg && <div className="mt-2 text-sm text-red-500">{assetMsg}</div>}
      </form>

      <form onSubmit={handlePricingSubmit} className="p-4 border rounded-md">
        <h2 className="font-semibold mb-2">Set Screen Pricing</h2>
        <input
          type="text"
          placeholder="Screen ID"
          value={screenId}
          onChange={e => setScreenId(e.target.value)}
          className="mb-2 w-full border px-2 py-1 rounded"
          required
        />
        <input
          type="number"
          placeholder="Hourly Rate"
          value={pricing.hourly_rate}
          onChange={e => setPricing({ ...pricing, hourly_rate: e.target.value })}
          className="mb-2 w-full border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Daily Rate"
          value={pricing.daily_rate}
          onChange={e => setPricing({ ...pricing, daily_rate: e.target.value })}
          className="mb-2 w-full border px-2 py-1 rounded"
        />
        <input
          type="number"
          placeholder="Weekly Rate"
          value={pricing.weekly_rate}
          onChange={e => setPricing({ ...pricing, weekly_rate: e.target.value })}
          className="mb-2 w-full border px-2 py-1 rounded"
        />
        <button type="submit" className="bg-green-600 text-white px-4 py-2 rounded" disabled={loading}>Set Pricing</button>
        {pricingMsg && <div className="mt-2 text-sm text-red-500">{pricingMsg}</div>}
      </form>
    </div>
  );
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
  width_px: '',
  height_px: '',
  resolution: '',
  orientation: 'landscape',
  device_type: 'smart_tv',
  device_model: '',
  ads_enabled: false,
  ad_frequency: 0,
  viewing_distance: 'close',
  typical_viewer_duration: '',
  peak_viewing_hours: ['09:00-17:00'],
  
  // Assets
  assets: [{ asset_type: 'photo_day', url: '' }],
  
  // Pricing
  pricing: {
    hourly_rate: '',
    daily_rate: '',
    weekly_rate: '',
    currency: 'INR'
  }
};

const VenueDashboard = () => {
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [screenForm, setScreenForm] = useState(screenInitialState);
  const [screenMsg, setScreenMsg] = useState('');
  const [screenLoading, setScreenLoading] = useState(false);

  const handleScreenChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement> | { target: { name: string; value: any } }) => {
    const { name, value } = e.target;
    setScreenForm(prev => {
      if (name === 'pricing') {
        return { ...prev, pricing: { ...prev.pricing, ...value } };
      }
      if (name === 'assets') {
        return { ...prev, assets: value };
      }
      return { ...prev, [name]: value };
    });
  };

  const handleScreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScreenMsg('');
    setScreenLoading(true);
    try {
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      const screenData = {
        ...screenForm,
        width_px: screenForm.width_px ? Number(screenForm.width_px) : undefined,
        height_px: screenForm.height_px ? Number(screenForm.height_px) : undefined,
        latitude: screenForm.latitude ? Number(screenForm.latitude) : undefined,
        longitude: screenForm.longitude ? Number(screenForm.longitude) : undefined,
        user_id: userData.id,
        pricing: {
          ...screenForm.pricing,
          hourly_rate: screenForm.pricing.hourly_rate ? Number(screenForm.pricing.hourly_rate) : undefined,
          daily_rate: screenForm.pricing.daily_rate ? Number(screenForm.pricing.daily_rate) : undefined,
          weekly_rate: screenForm.pricing.weekly_rate ? Number(screenForm.pricing.weekly_rate) : undefined,
        },
        assets: screenForm.assets.filter(asset => asset.url.trim() !== '')
      };
      await venueService.createScreen(screenData);
      setScreenMsg('Screen registered successfully!');
      setScreenForm(screenInitialState);
      setShowAddScreen(false);
    } catch (err: any) {
      setScreenMsg(err?.response?.data?.message || 'Failed to register screen');
    } finally {
      setScreenLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-100 border-r flex flex-col p-6">
        <h2 className="text-lg font-bold mb-6">Menu</h2>
        <button
          className="mb-4 px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"
          onClick={() => setShowAddScreen(true)}
        >
          Add Screens
        </button>
        {/* ...other sidebar options can go here... */}
      </aside>

      {/* Main Content */}
      <main className="flex-1 p-8">
        <h1 className="text-2xl font-bold">Venue Owner Dashboard</h1>
        <p>Welcome to your dashboard. Here you can manage your screens, bookings, assets, pricing, and more.</p>

        {showAddScreen && (
          <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl relative">
              <button
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                onClick={() => setShowAddScreen(false)}
              >
                &times;
              </button>
              <h2 className="text-xl font-semibold mb-4">Register New Screen</h2>
              <form onSubmit={handleScreenSubmit} className="max-h-[80vh] overflow-y-auto">
                {/* Basic Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="screen_name" value={screenForm.screen_name} onChange={handleScreenChange} 
                           placeholder="Screen Name" required className="border rounded px-3 py-2" />
                    <input name="location_in_venue" value={screenForm.location_in_venue} onChange={handleScreenChange}
                           placeholder="Location in Venue" required className="border rounded px-3 py-2" />
                    <textarea name="description" value={screenForm.description} onChange={handleScreenChange as any}
                            placeholder="Description" className="border rounded px-3 py-2 md:col-span-2" rows={3} />
                  </div>
                </div>

                {/* Address Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Address Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="address_line1" value={screenForm.address_line1} onChange={handleScreenChange}
                           placeholder="Address Line 1" className="border rounded px-3 py-2 md:col-span-2" />
                    <input name="address_line2" value={screenForm.address_line2} onChange={handleScreenChange}
                           placeholder="Address Line 2" className="border rounded px-3 py-2 md:col-span-2" />
                    <input name="city" value={screenForm.city} onChange={handleScreenChange}
                           placeholder="City" className="border rounded px-3 py-2" />
                    <input name="state" value={screenForm.state} onChange={handleScreenChange}
                           placeholder="State" className="border rounded px-3 py-2" />
                    <input name="country" value={screenForm.country} onChange={handleScreenChange}
                           placeholder="Country" className="border rounded px-3 py-2" />
                    <input name="postal_code" value={screenForm.postal_code} onChange={handleScreenChange}
                           placeholder="Postal Code" className="border rounded px-3 py-2" />
                    <input name="latitude" value={screenForm.latitude} onChange={handleScreenChange}
                           placeholder="Latitude" type="number" step="any" className="border rounded px-3 py-2" />
                    <input name="longitude" value={screenForm.longitude} onChange={handleScreenChange}
                           placeholder="Longitude" type="number" step="any" className="border rounded px-3 py-2" />
                  </div>
                </div>

                {/* Technical Specifications */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Technical Specifications</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input name="width_px" value={screenForm.width_px} onChange={handleScreenChange}
                           placeholder="Width (px)" type="number" className="border rounded px-3 py-2" />
                    <input name="height_px" value={screenForm.height_px} onChange={handleScreenChange}
                           placeholder="Height (px)" type="number" className="border rounded px-3 py-2" />
                    <input name="resolution" value={screenForm.resolution} onChange={handleScreenChange}
                           placeholder="Resolution (e.g., 1920x1080)" className="border rounded px-3 py-2" />
                    <select name="orientation" value={screenForm.orientation} onChange={handleScreenChange}
                            className="border rounded px-3 py-2">
                      <option value="landscape">Landscape</option>
                      <option value="portrait">Portrait</option>
                    </select>
                    <select name="device_type" value={screenForm.device_type} onChange={handleScreenChange}
                            className="border rounded px-3 py-2">
                      <option value="smart_tv">Smart TV</option>
                      <option value="media_player">Media Player</option>
                      <option value="custom">Custom</option>
                    </select>
                    <input name="device_model" value={screenForm.device_model} onChange={handleScreenChange}
                           placeholder="Device Model" className="border rounded px-3 py-2" />
                    <div className="flex items-center gap-2">
                      <input type="checkbox" name="ads_enabled" checked={screenForm.ads_enabled}
                             onChange={e => handleScreenChange({
                               target: { name: 'ads_enabled', value: e.target.checked }
                             } as any)} id="ads_enabled" />
                      <label htmlFor="ads_enabled">Enable Ads</label>
                    </div>
                    <input name="ad_frequency" value={screenForm.ad_frequency} onChange={handleScreenChange}
                           placeholder="Ad Frequency (%)" type="number" min="0" max="100" className="border rounded px-3 py-2" />
                    <select name="viewing_distance" value={screenForm.viewing_distance} onChange={handleScreenChange}
                            className="border rounded px-3 py-2">
                      <option value="close">Close</option>
                      <option value="medium">Medium</option>
                      <option value="far">Far</option>
                    </select>
                    <input name="typical_viewer_duration" value={screenForm.typical_viewer_duration} onChange={handleScreenChange}
                           placeholder="Typical Viewer Duration" className="border rounded px-3 py-2" />
                  </div>
                </div>

                {/* Screen Assets */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Screen Assets</h3>
                  <div className="space-y-3">
                    {screenForm.assets.map((asset, index) => (
                      <div key={index} className="flex gap-2">
                        <select value={asset.asset_type} onChange={(e) => {
                          const newAssets = [...screenForm.assets];
                          newAssets[index] = { ...asset, asset_type: e.target.value as any };
                          handleScreenChange({ target: { name: 'assets', value: newAssets } } as any);
                        }} className="border rounded px-3 py-2">
                          <option value="photo_day">Photo (Day)</option>
                          <option value="photo_night">Photo (Night)</option>
                          <option value="video">Video</option>
                        </select>
                        <input type="url" value={asset.url} onChange={(e) => {
                          const newAssets = [...screenForm.assets];
                          newAssets[index] = { ...asset, url: e.target.value };
                          handleScreenChange({ target: { name: 'assets', value: newAssets } } as any);
                        }} placeholder="Asset URL" className="border rounded px-3 py-2 flex-1" />
                        <button type="button" onClick={() => {
                          const newAssets = screenForm.assets.filter((_, i) => i !== index);
                          handleScreenChange({ target: { name: 'assets', value: newAssets } } as any);
                        }} className="px-3 py-2 text-red-600 hover:bg-red-50 rounded">Remove</button>
                      </div>
                    ))}
                    <button type="button" onClick={() => {
                      handleScreenChange({
                        target: {
                          name: 'assets',
                          value: [...screenForm.assets, { asset_type: 'photo_day', url: '' }]
                        }
                      } as any);
                    }} className="px-3 py-2 text-blue-600 hover:bg-blue-50 rounded">+ Add Asset</button>
                  </div>
                </div>

                {/* Pricing Information */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold mb-4 text-gray-700">Pricing Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <input type="number" value={screenForm.pricing.hourly_rate} onChange={(e) => {
                      handleScreenChange({
                        target: {
                          name: 'pricing',
                          value: { ...screenForm.pricing, hourly_rate: e.target.value }
                        }
                      } as any);
                    }} placeholder="Hourly Rate" className="border rounded px-3 py-2" />
                    <input type="number" value={screenForm.pricing.daily_rate} onChange={(e) => {
                      handleScreenChange({
                        target: {
                          name: 'pricing',
                          value: { ...screenForm.pricing, daily_rate: e.target.value }
                        }
                      } as any);
                    }} placeholder="Daily Rate" className="border rounded px-3 py-2" />
                    <input type="number" value={screenForm.pricing.weekly_rate} onChange={(e) => {
                      handleScreenChange({
                        target: {
                          name: 'pricing',
                          value: { ...screenForm.pricing, weekly_rate: e.target.value }
                        }
                      } as any);
                    }} placeholder="Weekly Rate" className="border rounded px-3 py-2" />
                    <select value={screenForm.pricing.currency} onChange={(e) => {
                      handleScreenChange({
                        target: {
                          name: 'pricing',
                          value: { ...screenForm.pricing, currency: e.target.value }
                        }
                      } as any);
                    }} className="border rounded px-3 py-2">
                      <option value="INR">INR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                    </select>
                  </div>
                </div>

                <div className="sticky bottom-0 bg-white py-4 border-t mt-6">
                  <button type="submit" 
                          className="w-full bg-green-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-green-700 transition-colors" 
                          disabled={screenLoading}>
                    {screenLoading ? 'Registering Screen...' : 'Register Screen'}
                  </button>
                  {screenMsg && (
                    <div className={`mt-2 text-sm text-center ${
                      screenMsg.includes('successfully') ? 'text-green-600' : 'text-red-600'
                    }`}>
                      {screenMsg}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        )}

        <AssetAndPricingForms />
        <ScreenList />
        <BookingList />
      </main>
    </div>
  );
};

export default VenueDashboard;
