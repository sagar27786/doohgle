

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
  screen_name: '',
  location_in_venue: '',
  description: '',
  address_line1: '',
  address_line2: '',
  city: '',
  state: '',
  country: '',
  postal_code: '',
  latitude: '',
  longitude: '',
  width_px: '',
  height_px: '',
  resolution: '',
  orientation: '',
};

const VenueDashboard = () => {
  const [showAddScreen, setShowAddScreen] = useState(false);
  const [screenForm, setScreenForm] = useState(screenInitialState);
  const [screenMsg, setScreenMsg] = useState('');
  const [screenLoading, setScreenLoading] = useState(false);

  const handleScreenChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setScreenForm({ ...screenForm, [e.target.name]: e.target.value });
  };

  const handleScreenSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setScreenMsg('');
    setScreenLoading(true);
    try {
      await venueService.createScreen({
        ...screenForm,
        width_px: screenForm.width_px ? Number(screenForm.width_px) : undefined,
        height_px: screenForm.height_px ? Number(screenForm.height_px) : undefined,
        latitude: screenForm.latitude ? Number(screenForm.latitude) : undefined,
        longitude: screenForm.longitude ? Number(screenForm.longitude) : undefined,
        user_id: /* TODO: Replace with actual user id, e.g. from context or props */ 1,
      });
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
              <form onSubmit={handleScreenSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input name="screen_name" value={screenForm.screen_name} onChange={handleScreenChange} placeholder="Screen Name" required className="border rounded px-2 py-1" />
                <input name="location_in_venue" value={screenForm.location_in_venue} onChange={handleScreenChange} placeholder="Location in Venue" required className="border rounded px-2 py-1" />
                <input name="description" value={screenForm.description} onChange={handleScreenChange} placeholder="Description" className="border rounded px-2 py-1" />
                <input name="address_line1" value={screenForm.address_line1} onChange={handleScreenChange} placeholder="Address Line 1" className="border rounded px-2 py-1" />
                <input name="address_line2" value={screenForm.address_line2} onChange={handleScreenChange} placeholder="Address Line 2" className="border rounded px-2 py-1" />
                <input name="city" value={screenForm.city} onChange={handleScreenChange} placeholder="City" className="border rounded px-2 py-1" />
                <input name="state" value={screenForm.state} onChange={handleScreenChange} placeholder="State" className="border rounded px-2 py-1" />
                <input name="country" value={screenForm.country} onChange={handleScreenChange} placeholder="Country" className="border rounded px-2 py-1" />
                <input name="postal_code" value={screenForm.postal_code} onChange={handleScreenChange} placeholder="Postal Code" className="border rounded px-2 py-1" />
                <input name="latitude" value={screenForm.latitude} onChange={handleScreenChange} placeholder="Latitude" className="border rounded px-2 py-1" />
                <input name="longitude" value={screenForm.longitude} onChange={handleScreenChange} placeholder="Longitude" className="border rounded px-2 py-1" />
                <input name="width_px" value={screenForm.width_px} onChange={handleScreenChange} placeholder="Width (px)" className="border rounded px-2 py-1" />
                <input name="height_px" value={screenForm.height_px} onChange={handleScreenChange} placeholder="Height (px)" className="border rounded px-2 py-1" />
                <input name="resolution" value={screenForm.resolution} onChange={handleScreenChange} placeholder="Resolution" className="border rounded px-2 py-1" />
                <input name="orientation" value={screenForm.orientation} onChange={handleScreenChange} placeholder="Orientation" className="border rounded px-2 py-1" />
                <button type="submit" className="col-span-2 bg-green-600 text-white px-4 py-2 rounded mt-4" disabled={screenLoading}>Register Screen</button>
                {screenMsg && <div className="col-span-2 text-sm text-red-500 mt-2">{screenMsg}</div>}
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
