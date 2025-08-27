import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  Mail,
  Phone,
  Lock,
  Eye,
  EyeOff,
  ArrowLeft,
  ArrowRight,
  Check,
  Loader2,
} from "lucide-react";
import { authService } from "../../services/authService";

interface LoginFormData {
  identifier: string;
  otp: string;
  password: string;
}

const EnhancedLoginDesign: React.FC = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isEmailMode, setIsEmailMode] = useState(false); // Phone first by default
  const [animationClass, setAnimationClass] = useState("animate-slideInLeft");

  const [formData, setFormData] = useState<LoginFormData>({
    identifier: "",
    otp: "",
    password: "",
  });

  // Animation effect on mount
  useEffect(() => {
    setAnimationClass("animate-fadeIn");
  }, []);

  const handleStepTransition = (nextStep: number) => {
    setAnimationClass("animate-slideOutRight");
    setTimeout(() => {
      setCurrentStep(nextStep);
      setAnimationClass("animate-slideInLeft");
    }, 300);
  };

  const handleInputChange = (field: keyof LoginFormData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setError(null);
  };

  const validateEmail = (email: string) => {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  };

  const validatePhone = (phone: string) => {
    return /^[+]?[\d\s\-()]{10,}$/.test(phone);
  };

  const handleSendOTP = async () => {
    if (!formData.identifier.trim()) {
      setError(`Please enter your ${isEmailMode ? "email" : "phone number"}`);
      return;
    }

    if (isEmailMode && !validateEmail(formData.identifier)) {
      setError("Please enter a valid email address");
      return;
    }

    if (!isEmailMode && !validatePhone(formData.identifier)) {
      setError("Please enter a valid phone number");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = isEmailMode
        ? { email: formData.identifier }
        : { phone: formData.identifier };

      await authService.requestOTP(payload);
      setSuccess("OTP sent successfully!");
      setTimeout(() => {
        handleStepTransition(2);
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Failed to send OTP. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleVerifyOTP = async () => {
    if (!formData.otp.trim() || formData.otp.length !== 6) {
      setError("Please enter a valid 6-digit OTP");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...(isEmailMode
          ? { email: formData.identifier }
          : { phone: formData.identifier }),
        otp: formData.otp,
      };

      await authService.verifyOTP(payload);
      setSuccess("OTP verified successfully!");
      setTimeout(() => {
        handleStepTransition(3);
        setSuccess(null);
      }, 1500);
    } catch (err: any) {
      setError(err.response?.data?.message || "Invalid OTP. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleFinalLogin = async () => {
    if (!formData.password.trim()) {
      setError("Please enter your password");
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const payload = {
        ...(isEmailMode
          ? { email: formData.identifier }
          : { phone: formData.identifier }),
        password: formData.password,
      };

      const response = await authService.login(payload);
      setSuccess("Login successful! Redirecting...");

      setTimeout(() => {
        const userRole = response.user?.role;
        if (userRole === "venue_owner") {
          navigate("/venue-dashboard");
        } else {
          navigate("/dashboard");
        }
      }, 1500);
    } catch (err: any) {
      setError(
        err.response?.data?.message || "Login failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  const renderStep1 = () => (
    <div className={`transition-all duration-300 ${animationClass}`}>
      <div className="text-center mb-8">
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Welcome Back
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your {isEmailMode ? "email" : "phone number"} to continue
        </p>
      </div>

      <div className="mb-6">
        <div className="flex bg-gray-100 dark:bg-slate-800 rounded-lg p-1 mb-4">
          <button
            type="button"
            onClick={() => setIsEmailMode(true)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              isEmailMode
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Mail className="w-4 h-4" />
            Email
          </button>
          <button
            type="button"
            onClick={() => setIsEmailMode(false)}
            className={`flex-1 flex items-center justify-center gap-2 py-2 px-3 rounded-md text-sm font-medium transition-colors ${
              !isEmailMode
                ? "bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-sm"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            <Phone className="w-4 h-4" />
            Phone
          </button>
        </div>

        <div className="relative">
          <input
            type={isEmailMode ? "email" : "tel"}
            value={formData.identifier}
            onChange={(e) => handleInputChange("identifier", e.target.value)}
            placeholder={
              isEmailMode ? "Enter your email" : "Enter your phone number"
            }
            className="w-full pl-12 pr-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            {isEmailMode ? (
              <Mail className="h-5 w-5 text-gray-400" />
            ) : (
              <Phone className="h-5 w-5 text-gray-400" />
            )}
          </div>
        </div>
      </div>

      <button
        onClick={handleSendOTP}
        disabled={isLoading}
        className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
      >
        {isLoading ? (
          <Loader2 className="w-5 h-5 animate-spin" />
        ) : (
          <>
            Send OTP
            <ArrowRight className="w-5 h-5" />
          </>
        )}
      </button>
    </div>
  );

  const renderStep2 = () => (
    <div className={`transition-all duration-300 ${animationClass}`}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-indigo-100 dark:bg-indigo-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Mail className="w-8 h-8 text-indigo-600 dark:text-indigo-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Verify OTP
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter the 6-digit code sent to {formData.identifier}
        </p>
      </div>

      <div className="mb-6">
        <input
          type="text"
          value={formData.otp}
          onChange={(e) =>
            handleInputChange(
              "otp",
              e.target.value.replace(/\D/g, "").slice(0, 6)
            )
          }
          placeholder="Enter OTP"
          className="w-full px-4 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 text-center text-2xl tracking-widest font-mono"
          maxLength={6}
          disabled={isLoading}
        />
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleStepTransition(1)}
          disabled={isLoading}
          className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleVerifyOTP}
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Verify
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  const renderStep3 = () => (
    <div className={`transition-all duration-300 ${animationClass}`}>
      <div className="text-center mb-8">
        <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
          <Check className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
          Enter Password
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          Enter your password to complete login
        </p>
      </div>

      <div className="mb-6">
        <div className="relative">
          <input
            type={showPassword ? "text" : "password"}
            value={formData.password}
            onChange={(e) => handleInputChange("password", e.target.value)}
            placeholder="Enter your password"
            className="w-full pl-12 pr-12 py-3 border border-gray-300 dark:border-slate-600 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent bg-white dark:bg-slate-800 text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400"
            disabled={isLoading}
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Lock className="h-5 w-5 text-gray-400" />
          </div>
          <button
            type="button"
            onClick={() => setShowPassword(!showPassword)}
            className="absolute inset-y-0 right-0 pr-3 flex items-center"
          >
            {showPassword ? (
              <EyeOff className="h-5 w-5 text-gray-400" />
            ) : (
              <Eye className="h-5 w-5 text-gray-400" />
            )}
          </button>
        </div>
      </div>

      <div className="flex gap-3">
        <button
          onClick={() => handleStepTransition(2)}
          disabled={isLoading}
          className="flex-1 bg-gray-100 dark:bg-slate-800 text-gray-700 dark:text-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-200 dark:hover:bg-slate-700 transition-colors flex items-center justify-center gap-2"
        >
          <ArrowLeft className="w-5 h-5" />
          Back
        </button>
        <button
          onClick={handleFinalLogin}
          disabled={isLoading}
          className="flex-1 bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 dark:focus:ring-offset-slate-900 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center gap-2"
        >
          {isLoading ? (
            <Loader2 className="w-5 h-5 animate-spin" />
          ) : (
            <>
              Login
              <Check className="w-5 h-5" />
            </>
          )}
        </button>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-indigo-900 flex items-center justify-center p-4">
      <div className="w-full max-w-6xl flex bg-white dark:bg-slate-900 rounded-2xl shadow-2xl overflow-hidden">
        {/* Left Side - Image/Brand */}
        <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-indigo-600 to-purple-700 relative overflow-hidden">
          <div className="absolute inset-0 bg-black/20"></div>
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url('https://images.unsplash.com/photo-1560472354-b33ff0c44a43?q=80&w=2126&auto=format&fit=crop')`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          ></div>

          {/* Animated Background Elements */}
          <div className="absolute top-10 left-10 w-32 h-32 bg-white/10 rounded-full animate-pulse"></div>
          <div className="absolute bottom-20 right-20 w-24 h-24 bg-white/10 rounded-full animate-bounce"></div>
          <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-white/10 rounded-full animate-ping"></div>

          {/* Content Overlay */}
          <div className="relative z-10 flex flex-col justify-center items-center text-center text-white p-12">
            <div className="animate-fadeInUp">
              <h1 className="text-5xl font-bold mb-6 leading-tight">
                Welcome to
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-pink-400">
                  Doohgle
                </span>
              </h1>
              <p className="text-xl text-white/90 mb-8 leading-relaxed">
                Your gateway to premium digital advertising solutions. Connect,
                engage, and grow your business with our innovative platform.
              </p>
              <div className="flex justify-center space-x-8">
                <div className="text-center animate-float">
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">🚀</span>
                  </div>
                  <p className="text-sm">Launch Campaigns</p>
                </div>
                <div
                  className="text-center animate-float"
                  style={{ animationDelay: "0.5s" }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">📈</span>
                  </div>
                  <p className="text-sm">Track Performance</p>
                </div>
                <div
                  className="text-center animate-float"
                  style={{ animationDelay: "1s" }}
                >
                  <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-2">
                    <span className="text-2xl">💼</span>
                  </div>
                  <p className="text-sm">Grow Business</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Side - Login Form */}
        <div className="w-full lg:w-1/2 p-8 lg:p-16 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            {/* Progress Indicator */}
            <div className="mb-8">
              <div className="flex justify-center items-center space-x-4">
                {[1, 2, 3].map((step) => (
                  <div key={step} className="flex items-center">
                    <div
                      className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-medium transition-all duration-300 ${
                        step < currentStep
                          ? "bg-green-500 text-white"
                          : step === currentStep
                          ? "bg-indigo-600 text-white scale-110"
                          : "bg-gray-200 dark:bg-slate-700 text-gray-500"
                      }`}
                    >
                      {step < currentStep ? (
                        <Check className="w-5 h-5" />
                      ) : (
                        step
                      )}
                    </div>
                    {step < 3 && (
                      <div
                        className={`w-12 h-1 mx-2 transition-all duration-300 ${
                          step < currentStep
                            ? "bg-green-500"
                            : "bg-gray-200 dark:bg-slate-700"
                        }`}
                      ></div>
                    )}
                  </div>
                ))}
              </div>
              <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>Contact</span>
                <span>Verify</span>
                <span>Password</span>
              </div>
            </div>

            {/* Form Content */}
            <div className="relative overflow-hidden">
              {currentStep === 1 && renderStep1()}
              {currentStep === 2 && renderStep2()}
              {currentStep === 3 && renderStep3()}
            </div>

            {/* Error/Success Messages */}
            {error && (
              <div className="mt-4 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg animate-slideInUp">
                <p className="text-red-600 dark:text-red-400 text-sm">
                  {error}
                </p>
              </div>
            )}

            {success && (
              <div className="mt-4 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg animate-slideInUp">
                <p className="text-green-600 dark:text-green-400 text-sm flex items-center gap-2">
                  <Check className="w-4 h-4" />
                  {success}
                </p>
              </div>
            )}

            {/* Footer */}
            <div className="mt-8 text-center">
              <p className="text-sm text-gray-600 dark:text-gray-400">
                Don't have an account?{" "}
                <Link
                  to="/signup"
                  className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 font-medium transition-colors"
                >
                  Sign up here
                </Link>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* CSS for custom animations */}
      <style>{`
        @keyframes slideInLeft {
          from { transform: translateX(-100%); opacity: 0; }
          to { transform: translateX(0); opacity: 1; }
        }
        
        @keyframes slideOutRight {
          from { transform: translateX(0); opacity: 1; }
          to { transform: translateX(100%); opacity: 0; }
        }
        
        @keyframes slideInUp {
          from { transform: translateY(100%); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        @keyframes fadeInUp {
          from { transform: translateY(30px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        .animate-slideInLeft { animation: slideInLeft 0.3s ease-out; }
        .animate-slideOutRight { animation: slideOutRight 0.3s ease-in; }
        .animate-slideInUp { animation: slideInUp 0.3s ease-out; }
        .animate-fadeIn { animation: fadeIn 0.5s ease-out; }
        .animate-fadeInUp { animation: fadeInUp 0.6s ease-out; }
        .animate-float { animation: float 3s ease-in-out infinite; }
      `}</style>
    </div>
  );
};

export default EnhancedLoginDesign;
