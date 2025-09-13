import { useState } from 'react';
import { venueService } from '../../services/venueService';

interface ProofOfPlayFormProps {
  booking_id: string;
  onSuccess: () => void;
}

const ProofOfPlayForm: React.FC<ProofOfPlayFormProps> = ({ booking_id, onSuccess }) => {
  const [url, setUrl] = useState('');
  const [type, setType] = useState<'image' | 'video'>('image');
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    if (!url) {
      setError('URL is required.');
      return;
    }

    try {
      await venueService.addProofOfPlay({
        booking_id,
        url,
        type,
        captured_at: new Date().toISOString(),
      });
      alert('Proof of play submitted successfully!');
      onSuccess();
    } catch (err: any) {
      setError(err.message || 'Failed to submit proof of play.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4 p-4 border-t">
      <h3 className="font-semibold">Add Proof of Play</h3>
      <div className="mt-2">
        <label htmlFor="pop-url" className="block text-sm font-medium">Media URL</label>
        <input
          id="pop-url"
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          placeholder="https://example.com/proof.jpg"
        />
      </div>
      <div className="mt-2">
        <label htmlFor="pop-type" className="block text-sm font-medium">Type</label>
        <select
          id="pop-type"
          value={type}
          onChange={(e) => setType(e.target.value as 'image' | 'video')}
          className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
        >
          <option value="image">Image</option>
          <option value="video">Video</option>
        </select>
      </div>
      {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      <button type="submit" className="mt-4 px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
        Submit Proof
      </button>
    </form>
  );
};

export default ProofOfPlayForm;
