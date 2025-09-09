import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function RoleSelect() {
  const [role, setRole] = useState<'advertiser' | 'venue_owner' | ''>('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();
  
  // Check if token is manually provided and set it
  // useEffect(() => {
  //   // Hardcoded token from user input
  //   const manualToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6NywiZW1haWwiOiJrQGdtYWlsLmNvbSIsInBob25lIjoiNzAxOTU4MzEyMyIsInJvbGVzIjpbXSwiaWF0IjoxNzU3MDc5MjYzLCJleHAiOjE3NTcxNjU2NjN9.m_ilChcl_3p5ECx-dwms3dhwJ45viYnsxJChPZAXt_I';
  //   const manualUser = '{"id":7,"email":"k@gmail.com","phone":"7019583123","roles":[]}';
    
  //   // Set the token and user directly in localStorage and in authService
  //   console.log('Setting manual token:', manualToken);
  //   localStorage.setItem('token', manualToken);
  //   authService.setAuthToken(manualToken);
    
  //   try {
  //     const userData = JSON.parse(manualUser);
  //     console.log('Setting manual user:', userData);
  //     localStorage.setItem('user', manualUser);
  //     authService.setCurrentUser(userData);
  //   } catch (e) {
  //     console.error('Failed to parse user data:', e);
  //   }
    
  //   // Verify the token was set correctly
  //   const storedToken = authService.getAuthToken();
  //   console.log('Verified token from authService:', storedToken);
  //   const storedUser = authService.getCurrentUser();
  //   console.log('Verified user from authService:', storedUser);
  // }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    if (!role) {
      setMessage('Please select a role');
      setIsError(true);
      return;
    }
    try {
      setLoading(true);
      console.log('Current token before request:', authService.getAuthToken());
      const { token, user } = await authService.setRole(role);
      authService.setAuthData(token, user);
      // redirect based on role
      if (role === 'venue_owner') {
        navigate('/venue-dashboard');
      } else if (role === 'advertiser') {
        navigate('/products/ads-manager/dashboard');
      }
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to set role');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Select your role</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Choose how you want to use Doohgle</p>
        </div>

        {message && (
          <div
            className={
              `mb-4 rounded-lg px-4 py-3 text-sm ` +
              (isError
                ? 'bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800'
                : 'bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800')
            }
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer dark:border-gray-700">
              <input
                type="radio"
                name="role"
                value="venue_owner"
                checked={role === 'venue_owner'}
                onChange={() => setRole('venue_owner')}
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Venue owner</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Manage your screens and locations</div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer dark:border-gray-700">
              <input
                type="radio"
                name="role"
                value="advertiser"
                checked={role === 'advertiser'}
                onChange={() => setRole('advertiser')}
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">Advertiser</div>
                <div className="text-sm text-gray-600 dark:text-gray-300">Create and manage ad campaigns</div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 transition-colors"
          >
            {loading ? 'Saving…' : 'Continue'}
          </button>
        </form>
      </div>
    </div>
  );
}
