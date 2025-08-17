import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";

export default function RoleSelect() {
  const [role, setRole] = useState<
    "advertiser" | "venue_owner" | "screen_manager" | ""
  >("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const navigate = useNavigate();

  // Check if user is properly authenticated when component mounts
  useEffect(() => {
    const checkAuth = () => {
      const token = authService.getAuthToken();
      const user = authService.getCurrentUser();

      console.log("RoleSelect - Token exists:", !!token);
      console.log("RoleSelect - User data:", user);

      if (!token) {
        console.warn("RoleSelect - No token found, redirecting to login");
        setMessage("No authentication token found. Please log in.");
        setIsError(true);
        setTimeout(() => navigate("/auth/login"), 3000);
        return;
      }

      // If user already has a role, redirect them directly
      if (user?.roles && user.roles.length > 0) {
        console.log(
          "RoleSelect - User already has role, redirecting:",
          user.roles[0]
        );
        if (user.roles.includes("venue_owner")) {
          navigate("/venue-dashboard");
        } else if (user.roles.includes("advertiser")) {
          navigate("/products/ads-manager");
        } else if (user.roles.includes("screen_manager")) {
          navigate("/products/screen-manager");
        }
        return;
      }

      // Clear any existing error messages for new users
      setMessage("");
      setIsError(false);
      console.log("RoleSelect - Ready for role selection");
    };

    checkAuth();
  }, [navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    if (!role) {
      setMessage("Please select a role");
      setIsError(true);
      return;
    }
    try {
      setLoading(true);

      // Check if user has a token
      const token = authService.getAuthToken();
      console.log(
        "RoleSelect Submit - Current token:",
        token ? "exists" : "missing"
      );

      console.log("RoleSelect Submit - Setting role:", role);
      const { token: newToken, user } = await authService.setRole(role);
      console.log("RoleSelect Submit - Role set successfully, new user:", user);

      authService.setAuthData(newToken, user);

      // redirect based on role
      if (role === "venue_owner") {
        console.log("RoleSelect Submit - Redirecting to venue dashboard");
        navigate("/venue-dashboard");
      } else if (role === "advertiser") {
        console.log("RoleSelect Submit - Redirecting to ads manager");
        navigate("/products/ads-manager");
      } else if (role === "screen_manager") {
        console.log("RoleSelect Submit - Redirecting to screen manager");
        navigate("/products/screen-manager");
      }
    } catch (err: any) {
      console.error("Set role error:", err);
      console.error("Set role error response:", err?.response);
      console.error("Set role error status:", err?.response?.status);
      console.error("Set role error data:", err?.response?.data);

      let errorMessage = "Failed to set role";

      if (
        err?.code === "NETWORK_ERROR" ||
        err?.message?.includes("Network Error")
      ) {
        errorMessage =
          "Cannot connect to server. Please check if the backend is running.";
      } else if (err?.response?.status === 401) {
        errorMessage = "Authentication failed. Please try logging in again.";
      } else if (err?.response?.data?.message) {
        errorMessage = err.response.data.message;
      } else if (err?.message) {
        errorMessage = err.message;
      }

      setMessage(errorMessage);
      setIsError(true);

      // If token is invalid, redirect to login after showing error
      if (err?.response?.status === 401) {
        setTimeout(() => {
          navigate("/auth/login");
        }, 3000);
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-[80vh] flex items-center justify-center bg-gray-50 dark:bg-gray-900 px-4">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-xl p-8">
        <div className="mb-6 text-center">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Select your role
          </h2>
          <p className="mt-1 text-sm text-gray-600 dark:text-gray-300">
            Choose how you want to use Doohgle
          </p>
        </div>

        {message && (
          <div
            className={
              `mb-4 rounded-lg px-4 py-3 text-sm ` +
              (isError
                ? "bg-red-50 text-red-700 border border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800"
                : "bg-green-50 text-green-700 border border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800")
            }
          >
            {message}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-3">
            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="role"
                value="venue_owner"
                checked={role === "venue_owner"}
                onChange={() => setRole("venue_owner")}
                className="w-4 h-4 text-indigo-600"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  Venue Manager
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Manage your venue locations and bookings
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="role"
                value="advertiser"
                checked={role === "advertiser"}
                onChange={() => setRole("advertiser")}
                className="w-4 h-4 text-indigo-600"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  Ads Manager
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Create and manage advertising campaigns
                </div>
              </div>
            </label>

            <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors">
              <input
                type="radio"
                name="role"
                value="screen_manager"
                checked={role === "screen_manager"}
                onChange={() => setRole("screen_manager")}
                className="w-4 h-4 text-indigo-600"
              />
              <div>
                <div className="font-semibold text-gray-900 dark:text-gray-100">
                  Screen Manager
                </div>
                <div className="text-sm text-gray-600 dark:text-gray-300">
                  Manage digital screens and display content
                </div>
              </div>
            </label>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full inline-flex items-center justify-center rounded-lg bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white font-semibold px-4 py-2.5 transition-colors"
          >
            {loading ? "Saving…" : "Continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
