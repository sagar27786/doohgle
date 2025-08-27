import React, { useState, useEffect } from 'react';
import { Clock, User, MapPin, DollarSign, Calendar, CheckCircle, XCircle, MessageSquare } from 'lucide-react';

interface BookingRequest {
  id: number;
  booking_id: number;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  company_name: string;
  start_date: string;
  end_date: string;
  total_amount: number;
  urgency: 'low' | 'medium' | 'high';
  message: string;
  location: string;
  status: 'pending' | 'accepted' | 'rejected';
  created_at: string;
  is_expired?: boolean;
}

interface BookingRequestsResponse {
  success: boolean;
  requests: BookingRequest[];
  total: number;
}

const BookingRequests: React.FC = () => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingId, setProcessingId] = useState<number | null>(null);

  const fetchBookingRequests = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:4000/api/bookings/requests', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch booking requests');
      }

      const data: BookingRequestsResponse = await response.json();
      setBookingRequests(data.requests || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unknown error');
    } finally {
      setLoading(false);
    }
  };

  const processBookingRequest = async (requestId: number, approved: boolean, ownerMessage: string = '') => {
    try {
      setProcessingId(requestId);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`http://localhost:4000/api/bookings/requests/${requestId}/process`, {
        method: 'PATCH',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          approved,
          ownerMessage,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to process booking request');
      }

      // Refresh the list
      await fetchBookingRequests();
      
      // Show success message
      alert(`Booking request ${approved ? 'approved' : 'rejected'} successfully!`);
    } catch (err) {
      alert(`Error: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setProcessingId(null);
    }
  };

  useEffect(() => {
    fetchBookingRequests();
  }, []);

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'high': return 'text-red-600 bg-red-50';
      case 'medium': return 'text-yellow-600 bg-yellow-50';
      case 'low': return 'text-green-600 bg-green-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'accepted': return 'text-green-600 bg-green-50';
      case 'rejected': return 'text-red-600 bg-red-50';
      case 'pending': return 'text-blue-600 bg-blue-50';
      default: return 'text-gray-600 bg-gray-50';
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="text-red-600 font-medium">Error loading booking requests</div>
        <div className="text-red-500 text-sm mt-1">{error}</div>
        <button
          onClick={fetchBookingRequests}
          className="mt-3 bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700"
        >
          Retry
        </button>
      </div>
    );
  }

  if (bookingRequests.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm p-8 text-center">
        <div className="text-gray-400 text-lg mb-2">No booking requests yet</div>
        <div className="text-gray-500 text-sm">
          When customers book screens in your location, requests will appear here
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold text-gray-900">
          Booking Requests ({bookingRequests.length})
        </h2>
        <button
          onClick={fetchBookingRequests}
          className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm hover:bg-blue-700 flex items-center gap-2"
        >
          <Clock size={16} />
          Refresh
        </button>
      </div>

      <div className="grid gap-6">
        {bookingRequests.map((request) => (
          <div
            key={request.id}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
          >
            <div className="flex items-start justify-between">
              <div className="flex-1">
                <div className="flex items-center gap-3 mb-3">
                  <h3 className="text-lg font-medium text-gray-900">{request.customer_name}</h3>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getUrgencyColor(request.urgency)}`}
                  >
                    {request.urgency.toUpperCase()} PRIORITY
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(request.status)}`}
                  >
                    {request.status.toUpperCase()}
                  </span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <User size={16} />
                      <span>{request.customer_email}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <span>{request.customer_phone}</span>
                    </div>
                    {request.company_name && (
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <span>{request.company_name}</span>
                      </div>
                    )}
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <MapPin size={16} />
                      <span>{request.location}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <Calendar size={16} />
                      <span>
                        {new Date(request.start_date).toLocaleDateString()} - {new Date(request.end_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <DollarSign size={16} />
                      <span className="font-medium">₹{request.total_amount.toLocaleString()}</span>
                    </div>
                  </div>
                </div>

                {request.message && (
                  <div className="bg-gray-50 rounded-lg p-3 mb-4">
                    <div className="flex items-start gap-2">
                      <MessageSquare size={16} className="text-gray-500 mt-0.5" />
                      <div>
                        <div className="text-sm font-medium text-gray-700 mb-1">Customer Message:</div>
                        <div className="text-sm text-gray-600">{request.message}</div>
                      </div>
                    </div>
                  </div>
                )}

                <div className="text-xs text-gray-500">
                  Received: {new Date(request.created_at).toLocaleString()}
                  {request.is_expired && (
                    <span className="text-orange-500 ml-2">(Expired - over 7 days old)</span>
                  )}
                </div>
              </div>

              {request.status === 'pending' && (
                <div className="flex gap-2 ml-4">
                  <button
                    onClick={() => processBookingRequest(request.id, false)}
                    disabled={processingId === request.id}
                    className="bg-red-600 text-white px-4 py-2 rounded-md text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    <XCircle size={16} />
                    Reject
                  </button>
                  <button
                    onClick={() => processBookingRequest(request.id, true)}
                    disabled={processingId === request.id}
                    className="bg-green-600 text-white px-4 py-2 rounded-md text-sm hover:bg-green-700 disabled:opacity-50 flex items-center gap-1"
                  >
                    <CheckCircle size={16} />
                    Accept
                  </button>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default BookingRequests;
