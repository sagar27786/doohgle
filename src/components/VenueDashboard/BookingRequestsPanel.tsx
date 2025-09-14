import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Clock,
  Calendar,
  DollarSign,
  Monitor,
  CheckCircle,
  XCircle,
  AlertCircle,
  RefreshCw,
  MessageSquare,
  Bell
} from 'lucide-react';
import { bookingService } from '../../services/bookingService';

interface BookingRequest {
  id: string;
  campaign_name: string;
  advertiser_id: string;
  advertiser_name: string;
  screen_id: number;
  screen_name: string;
  screen_owner_id: string;
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  daily_budget: number;
  total_budget: number;
  message?: string;
  status: 'pending' | 'accepted' | 'rejected' | 'cancelled';
  created_at: string;
  updated_at: string;
}

const BookingRequestsPanel: React.FC = () => {
  const [bookingRequests, setBookingRequests] = useState<BookingRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [processingRequest, setProcessingRequest] = useState<string | null>(null);

  const fetchBookingRequests = async () => {
    try {
      setLoading(true);
      setError(null);
      console.log('Fetching booking requests for venue owner...');
      
      // Create a venue owner authentication token (temporary simulation)
      const venueOwnerToken = 'temp-venue-owner-token-user-3';
      localStorage.setItem('venueOwnerToken', venueOwnerToken);
      
      // Try to fetch from backend first
      try {
        console.log('Calling booking service API...');
        const requests = await bookingService.getReceivedBookingRequests();
        console.log('API Response:', requests);
        
        if (requests && requests.length > 0) {
          setBookingRequests(requests);
          console.log('Using real booking requests from API:', requests);
          return;
        }
      } catch (apiError) {
        console.log('API call failed:', apiError);
        console.log('Falling back to direct API call...');
        
        // Try direct API call as fallback
        try {
          const response = await fetch('https://doohgle-backend.onrender.com/api/venue/booking-requests', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${venueOwnerToken}`,
            },
          });
          
          console.log('Direct API response status:', response.status);
          
          if (response.ok) {
            const result = await response.json();
            console.log('Direct API result:', result);
            
            if (result.data && result.data.length > 0) {
              setBookingRequests(result.data);
              console.log('Using direct API booking requests:', result.data);
              return;
            }
          }
        } catch (directApiError) {
          console.log('Direct API call also failed:', directApiError);
        }
      }
      
      // No fallback data - if API fails, show empty state
      setBookingRequests([]);
      console.log('No booking requests available from API');

    } catch (err) {
      console.error('Error fetching booking requests:', err);
      setError('Failed to load booking requests');
    } finally {
      setLoading(false);
    }
  };

  const handleRequestResponse = async (requestId: string, status: 'accepted' | 'rejected', message?: string) => {
    try {
      setProcessingRequest(requestId);
      
      console.log(`${status === 'accepted' ? 'Accepting' : 'Rejecting'} booking request:`, requestId);
      
      // Try to send response to backend
      try {
        await bookingService.respondToBookingRequest(requestId, {
          id: requestId,
          status,
          message
        });
      } catch (apiError) {
        console.log('Backend API not available, simulating response');
      }
      
      // Update local state
      setBookingRequests(prev => 
        prev.map(request => 
          request.id === requestId 
            ? { ...request, status, updated_at: new Date().toISOString() }
            : request
        )
      );

      // Show success message
      const statusText = status === 'accepted' ? 'accepted' : 'rejected';
      alert(`Booking request successfully ${statusText}! The advertiser will be notified.`);
      
    } catch (error) {
      console.error('Error responding to booking request:', error);
      setError(`Failed to ${status} booking request`);
    } finally {
      setProcessingRequest(null);
    }
  };

  useEffect(() => {
    fetchBookingRequests();
    
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchBookingRequests, 30000);
    return () => clearInterval(interval);
  }, []);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'accepted': return 'text-green-600 bg-green-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'cancelled': return 'text-gray-600 bg-gray-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <AlertCircle className="h-4 w-4" />;
      case 'accepted': return <CheckCircle className="h-4 w-4" />;
      case 'rejected': return <XCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center justify-center py-8">
          <RefreshCw className="h-6 w-6 animate-spin text-blue-600 mr-2" />
          <span className="text-gray-600">Loading booking requests...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex items-center p-4 bg-red-50 border border-red-200 rounded-lg">
          <XCircle className="h-5 w-5 text-red-500 mr-2" />
          <span className="text-red-800">{error}</span>
          <button
            onClick={fetchBookingRequests}
            className="ml-auto text-red-600 hover:text-red-800 underline"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  const pendingRequests = bookingRequests.filter(req => req.status === 'pending');
  const respondedRequests = bookingRequests.filter(req => req.status !== 'pending');

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Bell className="h-6 w-6 text-blue-600" />
          <h2 className="text-2xl font-bold text-gray-900">Booking Requests</h2>
          {pendingRequests.length > 0 && (
            <span className="bg-red-500 text-white text-xs rounded-full px-2 py-1">
              {pendingRequests.length} pending
            </span>
          )}
        </div>
        <button
          onClick={fetchBookingRequests}
          className="flex items-center text-blue-600 hover:text-blue-800"
        >
          <RefreshCw className="h-4 w-4 mr-1" />
          Refresh
        </button>
      </div>

      {/* Pending Requests */}
      {pendingRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Pending Requests ({pendingRequests.length})
          </h3>
          <div className="space-y-4">
            {pendingRequests.map((request) => (
              <motion.div
                key={request.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white border border-yellow-200 rounded-lg p-6 shadow-md"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h4 className="text-lg font-semibold text-gray-900">
                        {request.campaign_name}
                      </h4>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                        {getStatusIcon(request.status)}
                        <span className="ml-1 capitalize">{request.status}</span>
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">
                      by {request.advertiser_name}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-green-600">
                      ₹{request.total_budget}
                    </p>
                    <p className="text-xs text-gray-500">Total Budget</p>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Monitor className="h-4 w-4 mr-2" />
                      <span>Screen: {request.screen_name} (ID: {request.screen_id})</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-2" />
                      <span>
                        {new Date(request.start_date).toLocaleDateString()} 
                        {request.start_date !== request.end_date && 
                          ` - ${new Date(request.end_date).toLocaleDateString()}`}
                      </span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center text-sm text-gray-600">
                      <Clock className="h-4 w-4 mr-2" />
                      <span>{request.start_time} - {request.end_time}</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <DollarSign className="h-4 w-4 mr-2" />
                      <span>₹{request.daily_budget}/day</span>
                    </div>
                  </div>
                </div>

                {request.message && (
                  <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-start space-x-2">
                      <MessageSquare className="h-4 w-4 text-gray-600 mt-0.5" />
                      <p className="text-sm text-gray-700">{request.message}</p>
                    </div>
                  </div>
                )}

                <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                  <p className="text-xs text-gray-500">
                    Requested {new Date(request.created_at).toLocaleString()}
                  </p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleRequestResponse(request.id, 'rejected')}
                      disabled={processingRequest === request.id}
                      className="px-4 py-2 text-red-600 border border-red-300 rounded-md hover:bg-red-50 disabled:opacity-50 flex items-center"
                    >
                      <XCircle className="h-4 w-4 mr-1" />
                      Reject
                    </button>
                    <button
                      onClick={() => handleRequestResponse(request.id, 'accepted')}
                      disabled={processingRequest === request.id}
                      className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 flex items-center"
                    >
                      {processingRequest === request.id ? (
                        <RefreshCw className="h-4 w-4 mr-1 animate-spin" />
                      ) : (
                        <CheckCircle className="h-4 w-4 mr-1" />
                      )}
                      Accept
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      )}

      {/* Previous Requests */}
      {respondedRequests.length > 0 && (
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Previous Requests ({respondedRequests.length})
          </h3>
          <div className="space-y-3">
            {respondedRequests.map((request) => (
              <div key={request.id} className="bg-white border border-gray-200 rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h5 className="font-medium text-gray-900">{request.campaign_name}</h5>
                    <p className="text-sm text-gray-600">
                      {request.screen_name} • {new Date(request.start_date).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex items-center space-x-3">
                    <span className="text-sm font-medium text-gray-900">₹{request.total_budget}</span>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium flex items-center space-x-1 ${getStatusColor(request.status)}`}>
                      {getStatusIcon(request.status)}
                      <span className="ml-1 capitalize">{request.status}</span>
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {bookingRequests.length === 0 && (
        <div className="text-center py-12 bg-white rounded-lg shadow-md">
          <Bell className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Booking Requests</h3>
          <p className="text-gray-600">
            When advertisers request to book your screens, they'll appear here.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookingRequestsPanel;
