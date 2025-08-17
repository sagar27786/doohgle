import axios from "axios";
import apiClient from "../api/client";

const API_URL =
  (import.meta as any).env?.VITE_API_URL || "http://localhost:4000/api";

// ...existing code...

export interface User {
  id: number;
  name?: string;
  email?: string;
  phone?: string;
  roles?: string[];
  role?: "advertiser" | "venue_owner" | "screen_manager" | "admin";
}

export interface AuthResponse {
  user: User;
  token: string;
}

// Rename the local AuthResponse to AuthResponseV2 to avoid conflict

const getAuthToken = (): string | null => localStorage.getItem("token");
const setAuthToken = (token: string): void =>
  localStorage.setItem("token", token);
const removeAuthToken = (): void => localStorage.removeItem("token");
const isAuthenticated = (): boolean => !!getAuthToken();
const getCurrentUser = (): User | null => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};
const setCurrentUser = (user: User): void =>
  localStorage.setItem("user", JSON.stringify(user));
const removeCurrentUser = (): void => localStorage.removeItem("user");
const signUp = async (userData: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  role: "advertiser" | "venue_owner" | "screen_manager";
}): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/signup`,
    userData
  );
  const { user, token } = response.data;
  setAuthToken(token);
  setCurrentUser(user);
  return { user, token };
};

const login = async (credentials: {
  email?: string;
  phone?: string;
  password: string;
}): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/login`,
    credentials
  );
  const { user, token } = response.data;
  setAuthToken(token);
  setCurrentUser(user);
  return { user, token };
};

const logout = (): void => {
  removeAuthToken();
  removeCurrentUser();
};

const requestOTP = async (contact: {
  email?: string;
  phone?: string;
}): Promise<{ message: string }> => {
  const response = await axios.post<{ message: string }>(
    `${API_URL}/auth/send-otp`,
    contact
  );
  return response.data;
};

const verifyOTP = async (otpData: {
  email?: string;
  phone?: string;
  otp: string;
}): Promise<{ verified: boolean }> => {
  const response = await axios.post<{ verified: boolean }>(
    `${API_URL}/auth/verify-otp`,
    otpData
  );
  return response.data;
};

const verifySignupOTP = async (otpData: {
  email?: string;
  phone?: string;
  otp: string;
  name: string;
  password: string;
  confirmPassword: string;
  role: "advertiser" | "venue_owner" | "screen_manager";
}): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/verify-signup-otp`,
    otpData
  );
  const { user, token } = response.data;
  setAuthToken(token);
  setCurrentUser(user);
  return { user, token };
};

const getProfile = async (): Promise<User> => {
  const response = await apiClient.get<User>(`/auth/me`);
  const user = response.data;
  setCurrentUser(user);
  return user;
};

const updateProfile = async (
  updates: Partial<{
    name: string;
    email: string;
    phone: string;
    currentPassword: string;
    newPassword: string;
  }>
): Promise<User> => {
  const response = await apiClient.patch<User>(`/auth/me`, updates);
  const user = response.data;
  setCurrentUser(user);
  return user;
};

const requestPasswordReset = async (contact: {
  email?: string;
  phone?: string;
}): Promise<void> => {
  await axios.post(`${API_URL}/auth/request-password-reset`, contact);
};

const resetPassword = async (data: {
  email?: string;
  phone?: string;
  otp: string;
  newPassword: string;
  confirmPassword: string;
}): Promise<void> => {
  await axios.post(`${API_URL}/auth/reset-password`, data);
};

const verifyOTPAndSignup = async (data: {
  name: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  otp: string;
}): Promise<AuthResponse> => {
  const response = await axios.post<AuthResponse>(
    `${API_URL}/auth/verify-signup`,
    data
  );
  const { user, token } = response.data;
  setAuthToken(token);
  setCurrentUser(user);
  return { user, token };
};

export const authService = {
  getAuthToken,
  setAuthToken,
  removeAuthToken,
  isAuthenticated,
  getCurrentUser,
  setCurrentUser,
  removeCurrentUser,
  signUp,
  login,
  logout,
  requestOTP,
  verifyOTP,
  verifySignupOTP,
  verifyOTPAndSignup,
  getProfile,
  updateProfile,
  requestPasswordReset,
  resetPassword,
  setRole: async (
    role: "advertiser" | "venue_owner" | "screen_manager"
  ): Promise<AuthResponse> => {
    const response = await apiClient.post<AuthResponse>(`/auth/set-role`, {
      role,
    });
    const { user, token } = response.data;
    setAuthToken(token);
    setCurrentUser(user);
    return { user, token };
  },
  setAuthData: (token: string, user: User): void => {
    setAuthToken(token);
    setCurrentUser(user);
  },
};

// Remove all code below this line (leftover interfaces, objects, and functions)

// Removed duplicate API_URL declaration
