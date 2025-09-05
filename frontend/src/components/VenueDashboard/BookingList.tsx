import { useState, useEffect } from 'react';
import { venueService } from '../../services/venueService';
import ProofOfPlayForm from './ProofOfPlayForm';

interface Booking {
  id: string;
  screen_name: string;
  start_time: string;
  end_time: string;
  status: 'pending' | 'accepted' | 'rejected' | 'completed';
}

const BookingList = () => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchBookings = async () => {
    try {
      setLoading(true);
      const data = await venueService.getVenueBookings();
      setBookings(data);
    } catch (err: any) {
      setError(err.message || 'An error occurred while fetching bookings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (booking_id: string, status: 'accepted' | 'rejected') => {
    try {
      await venueService.updateBookingStatus({ booking_id, status });
      // Refresh the list to show the updated status
      fetchBookings();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  if (loading) {
    return <div>Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-8">
      <h2 className="text-xl font-semibold">Your Bookings</h2>
      {bookings.length === 0 ? (
        <p>You have no bookings.</p>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <div key={booking.id} className="p-4 border rounded-md">
              <p className="font-bold">{booking.screen_name}</p>
              <p>Status: <span className={`font-semibold ${booking.status === 'accepted' ? 'text-green-500' : booking.status === 'rejected' ? 'text-red-500' : 'text-yellow-500'}`}>{booking.status}</span></p>
              <p>Period: {new Date(booking.start_time).toLocaleString()} - {new Date(booking.end_time).toLocaleString()}</p>
              {booking.status === 'pending' && (
                <div className="mt-2 space-x-2">
                  <button 
                    onClick={() => handleUpdateStatus(booking.id, 'accepted')}
                    className="px-4 py-2 text-white bg-green-500 rounded hover:bg-green-600"
                  >
                    Accept
                  </button>
                  <button 
                    onClick={() => handleUpdateStatus(booking.id, 'rejected')}
                    className="px-4 py-2 text-white bg-red-500 rounded hover:bg-red-600"
                  >
                    Reject
                  </button>
                </div>
              )}
              {booking.status === 'accepted' && (
                <ProofOfPlayForm booking_id={booking.id} onSuccess={fetchBookings} />
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;
