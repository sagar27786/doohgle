

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


const VenueDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Venue Owner Dashboard</h1>
      <p>Welcome to your dashboard. Here you can manage your screens, bookings, assets, pricing, and more.</p>
      <AssetAndPricingForms />
      <ScreenList />
      <BookingList />
    </div>
  );
};

export default VenueDashboard;
