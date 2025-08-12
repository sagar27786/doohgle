import axios from 'axios';

const API_URL = (import.meta as any).env?.VITE_API_URL || 'http://localhost:3001/api';

export interface SignupData {
  email: string;
  password: string;
  confirmPassword: string;
  otp?: string;
}
 
 // Shared types for auth responses
 interface AuthUser {
   id: number;
   email: string;
   roles: string[];
 }
 
 interface AuthResponse {
   token: string;
   user: AuthUser;
 }

export const authService = {
  // Request OTP for signup
  async requestOTP(email: string): Promise<{ message: string }> {
    const response = await axios.post<{ message: string }>(`${API_URL}/auth/send-otp`, { email });
    return response.data;
  },

  // Verify OTP and complete signup
  async verifyOTPAndSignup(data: SignupData): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/verify-signup`, data);
    return response.data;
  },

  // Login
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post<AuthResponse>(`${API_URL}/auth/login`, { email, password });
    return response.data;
  },

  // Store auth data in localStorage
  setAuthData(token: string, user: any) {
    localStorage.setItem('token', token);
    localStorage.setItem('user', JSON.stringify(user));
  },

  // Clear auth data
  clearAuthData() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
  },

  // Get current user
  getCurrentUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  },

  // Get auth token
  getAuthToken() {
    return localStorage.getItem('token');
  },

  // Check if user is authenticated
  isAuthenticated() {
    return !!this.getAuthToken();
  },

  // Set up axios auth header
  setupAxiosInterceptors() {
    axios.interceptors.request.use(
      (config) => {
        const token = this.getAuthToken();
        if (token) {
          // Ensure headers is initialized and set Authorization header
          config.headers = config.headers || {};
          (config.headers as any)["Authorization"] = `Bearer ${token}`;
        }
        return config;
      },
      (error: unknown) => {
        return Promise.reject(error);
      }
    );
  }
};
