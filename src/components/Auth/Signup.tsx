import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authService } from '../../services/authService';

export default function Signup({ onSwitch }: { onSwitch: () => void }) {
  const [form, setForm] = useState({ email: '', password: '', confirmPassword: '' });
  const [message, setMessage] = useState('');
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [otp, setOtp] = useState('');
  const [showOtpField, setShowOtpField] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Step 1: Request OTP for the provided email
  const handleRequestOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    if (!form.email) {
      setMessage('Email is required');
      setIsError(true);
      return;
    }
    try {
      setLoading(true);
      await authService.requestOTP(form.email);
      setShowOtpField(true);
      setMessage('OTP sent to your email');
      setIsError(false);
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Failed to send OTP');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  // Step 2: Verify OTP and complete signup
  const handleSignup = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage('');
    setIsError(false);
    if (form.password !== form.confirmPassword) {
      setMessage('Passwords do not match');
      setIsError(true);
      return;
    }
    try {
      setLoading(true);
      const { token, user } = await authService.verifyOTPAndSignup({
        email: form.email,
        password: form.password,
        confirmPassword: form.confirmPassword,
        otp,
      });
      authService.setAuthData(token, user);
      authService.setupAxiosInterceptors();
      setMessage('Signup complete!');
      setIsError(false);
      navigate('/products/screen-manager');
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Signup failed');
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Create your account</h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">Sign up to get started</p>
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

        <form onSubmit={showOtpField ? handleSignup : handleRequestOTP} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              placeholder="you@example.com"
              autoComplete="email"
              required
              disabled={showOtpField}
              className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
            />
          </div>

          {showOtpField && (
            <>
              <div>
                <label htmlFor="otp" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Enter OTP
                </label>
                <input
                  id="otp"
                  name="otp"
                  type="text"
                  value={otp}
                  onChange={(e) => setOtp(e.target.value)}
                  placeholder="6-digit code"
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={form.password}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>

              <div>
                <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 dark:text-gray-200 mb-1">
                  Confirm password
                </label>
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type="password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  placeholder="••••••••"
                  autoComplete="new-password"
                  required
                  className="w-full rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-900 text-gray-900 dark:text-gray-100 px-3 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition"
                />
              </div>
            </>
          )}

          

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 transition-colors"
          >
            {loading ? 'Processing…' : showOtpField ? 'Sign up' : 'Send OTP'}
          </button>
        </form>

        <div className="mt-6 text-center text-sm text-gray-600 dark:text-gray-300">
          Already have an account?{' '}
          <button
            type="button"
            onClick={onSwitch}
            className="font-semibold text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300"
          >
            Log in
          </button>
        </div>
      </div>
    </div>
  );
}
