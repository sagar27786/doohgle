import { useState, useEffect } from "react";
import { venueService } from "../../services/venueService";
import ProofOfPlayForm from "./ProofOfPlayForm";

interface Booking {
  id: string;
  screen_name: string;
  start_time: string;
  end_time: string;
  status: "pending" | "accepted" | "rejected" | "completed";
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
      setError(err.message || "An error occurred while fetching bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const handleUpdateStatus = async (
    booking_id: string,
    status: "accepted" | "rejected"
  ) => {
    try {
      await venueService.updateBookingStatus({ booking_id, status });
      fetchBookings();
    } catch (err: any) {
      alert(`Failed to update status: ${err.message}`);
    }
  };

  if (loading) {
    return <div className="text-gray-600 text-sm">Loading bookings...</div>;
  }

  if (error) {
    return <div className="text-red-500 text-sm">Error: {error}</div>;
  }

  return (
    <div className="mt-6">
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4">
        Your Bookings
      </h2>

      {bookings.length === 0 ? (
        <p className="text-gray-500 text-sm">You have no bookings.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {bookings.map((booking) => (
            <div
              key={booking.id}
              className="p-4 sm:p-5 border border-gray-200 rounded-2xl shadow-sm hover:shadow-md bg-white transition-all flex flex-col justify-between"
            >
              <div className="mb-3">
                <p className="font-semibold text-gray-900 text-md truncate">
                  {booking.screen_name}
                </p>
                <p className="text-gray-600 text-sm mt-1">
                  Period: {new Date(booking.start_time).toLocaleString()} -{" "}
                  {new Date(booking.end_time).toLocaleString()}
                </p>
                <p className="mt-1 text-sm">
                  Status:{" "}
                  <span
                    className={`font-semibold ${
                      booking.status === "accepted"
                        ? "text-green-600"
                        : booking.status === "rejected"
                        ? "text-red-600"
                        : booking.status === "completed"
                        ? "text-gray-500"
                        : "text-yellow-500"
                    }`}
                  >
                    {booking.status}
                  </span>
                </p>
              </div>

              {/* Action Buttons */}
              {booking.status === "pending" && (
                <div className="mt-2 flex flex-wrap gap-2">
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "accepted")}
                    className="px-4 py-2 text-white bg-purple-600 rounded-lg hover:bg-purple-700 transition-colors text-sm sm:text-base flex-1"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "rejected")}
                    className="px-4 py-2 text-white bg-red-500 rounded-lg hover:bg-red-600 transition-colors text-sm sm:text-base flex-1"
                  >
                    Reject
                  </button>
                </div>
              )}

              {booking.status === "accepted" && (
                <div className="mt-3">
                  <ProofOfPlayForm
                    booking_id={booking.id}
                    onSuccess={fetchBookings}
                  />
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default BookingList;
