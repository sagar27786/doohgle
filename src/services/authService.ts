const API_URL = "http://localhost:4000/api";

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
  message?: string;
  success?: boolean;
}

export interface LoginData {
  email?: string;
  phone?: string;
  password: string;
}

export interface SignupData {
  name: string;
  email?: string;
  phone?: string;
  password: string;
  confirmPassword: string;
  role: "advertiser" | "venue_owner" | "screen_manager" | "admin";
}

export interface PasswordResetData {
  token: string;
  password: string;
  confirmPassword: string;
}

// Simple fetch-based API calls
async function makeRequest<T>(endpoint: string, data?: any): Promise<T> {
  try {
    const response = await fetch(`${API_URL}${endpoint}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: data ? JSON.stringify(data) : undefined,
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('API request failed:', error);
    throw error;
  }
}

export const authService = {
  async login(loginData: LoginData): Promise<AuthResponse> {
    try {
      const response = await makeRequest<AuthResponse>(
        "/auth/login",
        loginData
      );

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error("Login failed:", error);
      throw error;
    }
  },

  async signup(signupData: SignupData): Promise<AuthResponse> {
    try {
      const response = await makeRequest<AuthResponse>(
        "/auth/signup",
        signupData
      );

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error("Signup failed:", error);
      throw error;
    }
  },

  async sendOTP(contact: { email?: string; phone?: string }): Promise<void> {
    try {
      await makeRequest<{ message: string }>(
        "/auth/send-otp",
        contact
      );
    } catch (error) {
      console.error("Send OTP failed:", error);
      throw error;
    }
  },

  async verifyOTP(data: {
    email?: string;
    phone?: string;
    otp: string;
  }): Promise<boolean> {
    try {
      const response = await makeRequest<{ verified: boolean }>(
        "/auth/verify-otp",
        data
      );
      return response.verified;
    } catch (error) {
      console.error("OTP verification failed:", error);
      throw error;
    }
  },

  async completeProfile(profileData: {
    name: string;
    password: string;
    confirmPassword: string;
    role: "advertiser" | "venue_owner" | "screen_manager" | "admin";
  }): Promise<AuthResponse> {
    try {
      const response = await makeRequest<AuthResponse>(
        "/auth/complete-profile",
        profileData
      );

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error("Complete profile failed:", error);
      throw error;
    }
  },

  logout(): void {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  },

  getCurrentUser(): User | null {
    try {
      const userStr = localStorage.getItem("user");
      return userStr ? JSON.parse(userStr) : null;
    } catch {
      return null;
    }
  },

  getToken(): string | null {
    return localStorage.getItem("token");
  },

  isAuthenticated(): boolean {
    return !!this.getToken() && !!this.getCurrentUser();
  },

  async requestPasswordReset(contact: {
    email?: string;
    phone?: string;
  }): Promise<void> {
    try {
      await makeRequest<void>("/auth/request-password-reset", contact);
    } catch (error) {
      console.error("Password reset request failed:", error);
      throw error;
    }
  },

  async resetPassword(data: PasswordResetData): Promise<void> {
    try {
      await makeRequest<void>("/auth/reset-password", data);
    } catch (error) {
      console.error("Password reset failed:", error);
      throw error;
    }
  },

  async socialLogin(data: {
    provider: "google" | "facebook";
    token: string;
    role: "advertiser" | "venue_owner" | "screen_manager" | "admin";
  }): Promise<AuthResponse> {
    try {
      const response = await makeRequest<AuthResponse>(
        `/auth/social-login/${data.provider}`,
        { token: data.token, role: data.role }
      );

      if (response.token) {
        localStorage.setItem("token", response.token);
        localStorage.setItem("user", JSON.stringify(response.user));
      }

      return response;
    } catch (error) {
      console.error("Social login failed:", error);
      throw error;
    }
  },
};

export default authService;
