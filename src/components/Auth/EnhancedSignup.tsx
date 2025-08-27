import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../../services/authService";
import {
  Eye,
  EyeOff,
  Mail,
  Phone,
  Lock,
  Shield,
  User,
  Target,
  Monitor,
} from "lucide-react";

interface EnhancedSignupProps {
  onSwitch: () => void;
}

const EnhancedSignup: React.FC<EnhancedSignupProps> = ({ onSwitch }) => {
  const navigate = useNavigate();
  const [step, setStep] = useState<"details" | "otp">("details");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    role: "" as "advertiser" | "venue_owner" | "",
    otp: "",
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");
    setIsError(false);
    setLoading(true);

    try {
      if (step === "details") {
        // Validation - phone is now mandatory
        if (
          !formData.name ||
          !formData.phone ||
          !formData.password ||
          !formData.confirmPassword ||
          !formData.role
        ) {
          throw new Error(
            "Please fill in all required fields (name, phone, password, role)"
          );
        }
        if (formData.password !== formData.confirmPassword) {
          throw new Error("Passwords do not match");
        }
        if (formData.password.length < 8) {
          throw new Error("Password must be at least 8 characters long");
        }
        if (formData.role !== "advertiser" && formData.role !== "venue_owner") {
          throw new Error("Please select a role");
        }
        // Validate phone number format (basic validation)
        const phoneRegex = /^[+]?[\d\s\-\(\)]{10,}$/;
        if (!phoneRegex.test(formData.phone)) {
          throw new Error("Please enter a valid phone number");
        }

        // Request OTP for phone-based signup
        await authService.requestOTP({ phone: formData.phone });
        setMessage(
          `OTP sent to ${formData.phone}! Check console for the OTP code.`
        );
        setStep("otp");
      } else if (step === "otp") {
        // Verify OTP and complete signup
        await authService.verifyOTPAndSignup({
          name: formData.name,
          email: formData.email || "", // Optional email, fallback to empty string
          phone: formData.phone,
          password: formData.password,
          confirmPassword: formData.confirmPassword,
          otp: formData.otp,
        });

        // Set role after successful signup
        await authService.setRole(
          formData.role as "advertiser" | "venue_owner"
        );

        setMessage("Account created successfully!");

        // Redirect based on role
        setTimeout(() => {
          if (formData.role === "venue_owner") {
            navigate("/venue-dashboard");
          } else {
            navigate("/products/ads-manager/dashboard");
          }
        }, 1000);
      }
    } catch (err: any) {
      setMessage(
        err?.response?.data?.message || err.message || "An error occurred"
      );
      setIsError(true);
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleRoleChange = (role: "advertiser" | "venue_owner") => {
    setFormData((prev) => ({ ...prev, role }));
  };

  const resetForm = () => {
    setStep("details");
    setFormData({
      name: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",
      role: "",
      otp: "",
    });
    setMessage("");
    setIsError(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-50 to-pink-100 dark:from-gray-900 dark:to-gray-800 px-4 py-8">
      <div className="w-full max-w-md">
        <div className="bg-white dark:bg-gray-800 shadow-2xl rounded-2xl p-8 border border-gray-200 dark:border-gray-700">
          <div className="mb-8 text-center">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">
              Create Account
            </h2>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              {step === "details" &&
                "Fill in your details to get started (Phone is required)"}
              {step === "otp" && "Enter the OTP sent to your phone number"}
            </p>
          </div>

          {message && (
            <div
              className={`mb-4 rounded-lg px-4 py-3 text-sm border ${
                isError
                  ? "bg-red-50 text-red-700 border-red-200 dark:bg-red-900/30 dark:text-red-200 dark:border-red-800"
                  : "bg-green-50 text-green-700 border-green-200 dark:bg-green-900/30 dark:text-green-200 dark:border-green-800"
              }`}
            >
              {message}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {step === "details" && (
              <>
                {/* Name */}
                <div>
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Full Name
                  </label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="name"
                      name="name"
                      type="text"
                      required
                      value={formData.name}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your full name"
                    />
                  </div>
                </div>

                {/* Phone - now mandatory */}
                <div>
                  <label
                    htmlFor="phone"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Phone Number *
                  </label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="phone"
                      name="phone"
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your phone number (+91xxxxxxxxxx)"
                    />
                  </div>
                </div>

                {/* Email - now optional */}
                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Email Address (Optional)
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your email (optional)"
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="password"
                      name="password"
                      type={showPassword ? "text" : "password"}
                      required
                      value={formData.password}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Enter your password"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Confirm Password */}
                <div>
                  <label
                    htmlFor="confirmPassword"
                    className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                  >
                    Confirm Password
                  </label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                    <input
                      id="confirmPassword"
                      name="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      required
                      value={formData.confirmPassword}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-12 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white"
                      placeholder="Confirm your password"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
                    >
                      {showConfirmPassword ? <EyeOff /> : <Eye />}
                    </button>
                  </div>
                </div>

                {/* Role Selection */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-3">
                    I want to...
                  </label>
                  <div className="space-y-3">
                    <label
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.role === "advertiser"
                          ? "border-purple-500 bg-purple-50 dark:bg-purple-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleRoleChange("advertiser")}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="advertiser"
                        checked={formData.role === "advertiser"}
                        onChange={() => handleRoleChange("advertiser")}
                        className="text-purple-600"
                      />
                      <div className="flex items-center gap-3">
                        <Target className="h-6 w-6 text-purple-500" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            Advertise
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Create and manage ad campaigns
                          </div>
                        </div>
                      </div>
                    </label>

                    <label
                      className={`flex items-center gap-3 p-4 border rounded-lg cursor-pointer transition-colors ${
                        formData.role === "venue_owner"
                          ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                          : "border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700"
                      }`}
                      onClick={() => handleRoleChange("venue_owner")}
                    >
                      <input
                        type="radio"
                        name="role"
                        value="venue_owner"
                        checked={formData.role === "venue_owner"}
                        onChange={() => handleRoleChange("venue_owner")}
                        className="text-blue-600"
                      />
                      <div className="flex items-center gap-3">
                        <Monitor className="h-6 w-6 text-blue-500" />
                        <div>
                          <div className="font-semibold text-gray-900 dark:text-gray-100">
                            Rent Screens
                          </div>
                          <div className="text-sm text-gray-600 dark:text-gray-300">
                            Manage and monetize your screens
                          </div>
                        </div>
                      </div>
                    </label>
                  </div>
                </div>
              </>
            )}

            {step === "otp" && (
              <div>
                <label
                  htmlFor="otp"
                  className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                >
                  OTP Code
                </label>
                <div className="relative">
                  <Shield className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="otp"
                    name="otp"
                    type="text"
                    required
                    maxLength={6}
                    value={formData.otp}
                    onChange={handleInputChange}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 dark:border-gray-600 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent dark:bg-gray-700 dark:text-white text-center text-lg tracking-widest"
                    placeholder="000000"
                  />
                </div>
              </div>
            )}

            <div className="flex space-x-3">
              {step !== "details" && (
                <button
                  type="button"
                  onClick={resetForm}
                  className="flex-1 py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-lg text-gray-700 dark:text-gray-300 font-medium hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
                >
                  Back
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 px-4 bg-purple-600 hover:bg-purple-700 disabled:opacity-50 text-white font-medium rounded-lg transition-colors"
              >
                {loading
                  ? "Processing..."
                  : step === "details"
                  ? "Send OTP"
                  : "Create Account"}
              </button>
            </div>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Already have an account?{" "}
              <button
                onClick={onSwitch}
                className="text-purple-600 dark:text-purple-400 hover:text-purple-700 font-medium"
              >
                Sign in
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EnhancedSignup;
