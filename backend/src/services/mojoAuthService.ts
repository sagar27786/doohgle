import axios from "axios";

// MojoAuth configuration for backend
const MOJOAUTH_API_KEY = "test-3c805d83-38f1-4a3d-96a2-5f0e721d2162";
const MOJOAUTH_BASE_URL = "https://api.mojoauth.com";

// MojoAuth interfaces
export interface MojoAuthEmailRequest {
  email: string;
  language?: string;
  template?: string;
}

export interface MojoAuthVerifyRequest {
  state_id: string;
  otp: string;
}

export interface MojoAuthUser {
  identifier: string;
  oauth: {
    access_token: string;
    expires_in: number;
    id_token: string;
    refresh_token: string;
  };
  user_profile: {
    email: string;
    name?: string;
    [key: string]: any;
  };
}

class MojoAuthBackendService {
  private apiKey: string;
  private baseUrl: string;

  constructor() {
    this.apiKey = MOJOAUTH_API_KEY;
    this.baseUrl = MOJOAUTH_BASE_URL;
  }

  /**
   * Send OTP to email address using MojoAuth
   */
  async sendEmailOTP(
    email: string,
    language: string = "en"
  ): Promise<{ state_id: string; message: string }> {
    try {
      const response = await axios.post<any>(
        `${this.baseUrl}/users/emailotp`,
        {
          email,
          language,
        },
        {
          headers: {
            "X-API-Key": this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("MojoAuth send OTP response:", response.data);

      if (response.data && response.data.state_id) {
        return {
          state_id: response.data.state_id,
          message: "OTP sent successfully to your email",
        };
      }

      throw new Error("Failed to send OTP");
    } catch (error: any) {
      console.error("MojoAuth send OTP error:", error);

      // Handle different error types
      if (error.response) {
        console.error("MojoAuth API error response:", error.response.data);
        const errorMessage =
          error.response.data?.description ||
          error.response.data?.message ||
          "Failed to send OTP";
        throw new Error(errorMessage);
      }

      throw new Error("Network error while sending OTP");
    }
  }

  /**
   * Verify OTP using MojoAuth
   */
  async verifyEmailOTP(stateId: string, otp: string): Promise<MojoAuthUser> {
    try {
      const response = await axios.post<any>(
        `${this.baseUrl}/users/emailotp/verify`,
        {
          state_id: stateId,
          otp,
        },
        {
          headers: {
            "X-API-Key": this.apiKey,
            "Content-Type": "application/json",
          },
        }
      );

      console.log("MojoAuth verify OTP response:", response.data);

      if (response.data && response.data.authenticated) {
        return {
          identifier: response.data.user_profile?.email || "",
          oauth: response.data.oauth,
          user_profile: response.data.user_profile,
        };
      }

      throw new Error("Invalid OTP or verification failed");
    } catch (error: any) {
      console.error("MojoAuth verify OTP error:", error);

      // Handle different error types
      if (error.response) {
        console.error("MojoAuth API error response:", error.response.data);
        const errorMessage =
          error.response.data?.description ||
          error.response.data?.message ||
          "Invalid OTP";
        throw new Error(errorMessage);
      }

      throw new Error("Network error while verifying OTP");
    }
  }

  /**
   * Verify MojoAuth JWT token
   */
  async verifyToken(token: string): Promise<any> {
    try {
      const response = await axios.post<any>(
        `${this.baseUrl}/users/verify`,
        {},
        {
          headers: {
            "X-API-Key": this.apiKey,
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      return response.data;
    } catch (error: any) {
      console.error("MojoAuth verify token error:", error);
      throw new Error("Invalid or expired token");
    }
  }

  /**
   * Get user profile using access token
   */
  async getUserProfile(accessToken: string): Promise<any> {
    try {
      const response = await axios.get<any>(`${this.baseUrl}/users/profile`, {
        headers: {
          "X-API-Key": this.apiKey,
          Authorization: `Bearer ${accessToken}`,
          "Content-Type": "application/json",
        },
      });

      return response.data;
    } catch (error: any) {
      console.error("MojoAuth get profile error:", error);
      throw new Error("Failed to get user profile");
    }
  }
}

// Create singleton instance
export const mojoAuthBackendService = new MojoAuthBackendService();

// Export default
export default mojoAuthBackendService;
