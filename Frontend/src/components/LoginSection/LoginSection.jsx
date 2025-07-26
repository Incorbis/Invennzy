import React, { useState } from "react";
import { User, Shield, Settings, Eye, EyeOff } from "lucide-react";

const LoginSection = () => {
  const [activeTab, setActiveTab] = useState("admin");
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;
  console.log("Google Client ID:", client_id);

  const userTypes = [
    {
      id: "admin",
      name: "Admin",
      icon: Shield,
      color: "bg-red-500",
      hasSignup: true,
      endpoints: {
        login: "/api/auth/login",
        signup: "/api/auth/signup",
        forgotPassword: "/api/auth/forgot-password",
      },
    },
    {
      id: "labincharge",
      name: "Lab Incharge",
      icon: User,
      color: "bg-blue-500",
      hasSignup: false,
      endpoints: {
        login: "/api/auth/login",
        signup: null,
        forgotPassword: "/api/auth/forgot-password",
      },
    },
    {
      id: "labassistant",
      name: "Lab Assistant",
      icon: Settings,
      color: "bg-green-500",
      hasSignup: false,
      endpoints: {
        login: "/api/auth/login",
        signup: null,
        forgotPassword: "/api/auth/forgot-password",
      },
    },
  ];

  const getCurrentUserType = () => {
    return userTypes.find((type) => type.id === activeTab);
  };

  const makeApiCall = async (endpoint, data) => {
    setIsLoading(true);
    try {
      const response = await fetch(`http://localhost:3000${endpoint}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (response.ok) {
        if (result.token) {
          // This is a login response
          localStorage.setItem(`${activeTab}_token`, result.token);
          localStorage.setItem("userRole", activeTab);
          localStorage.setItem("userName", result.user.name);

          // Redirect based on the redirectUrl from backend
          if (result.redirectUrl) {
            window.location.href = result.redirectUrl;
          } else {
            // Fallback redirect logic
            const redirectUrls = {
              admin: "/admindash",
              labincharge: "/labinchargedash",
              labassistant: "/labassistantdash",
            };
            window.location.href = redirectUrls[activeTab] || "/";
          }
        } else if (result.redirectUrl) {
          // This is a signup response - show success message and redirect
          alert(result.message);
          window.location.href = result.redirectUrl;
        } else {
          // Generic success message
          alert(result.message);
        }
      } else {
        // Handle error response
        console.error("Error:", result.message);
        alert(result.message || "An error occurred");
      }
    } catch (error) {
      console.error("Network error:", error);
      alert("Network error. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUserType = getCurrentUserType();

    if (isSignUp) {
      // Only allow admin signup
      if (activeTab !== "admin") {
        alert(
          "Only admin accounts can be created through signup. Lab Incharge and Lab Assistant accounts are created by administrators."
        );
        return;
      }

      if (formData.password !== formData.confirmPassword) {
        alert("Passwords don't match!");
        return;
      }
      await makeApiCall(currentUserType.endpoints.signup, {
        name: formData.name, // You'll need to add name field
        email: formData.email,
        password: formData.password,
        role: activeTab,
      });
    } else {
      await makeApiCall(currentUserType.endpoints.login, {
        email: formData.email,
        password: formData.password,
        role: activeTab,
      });
    }
  };

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault();
    const currentUserType = getCurrentUserType();
    await makeApiCall(currentUserType.endpoints.forgotPassword, {
      email: formData.email,
      role: activeTab,
    });
  };

  const handleGoogleSignIn = async () => {
    // This will be handled by Google GSI
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      console.error("Google GSI not loaded");
      alert("Google Sign-In is not available. Please try again.");
    }
  };

  // Handle Google credential response
  const handleGoogleCredentialResponse = async (response) => {
    try {
      setIsLoading(true);
      const googleToken = response.credential;

      // Send the Google token to your backend for verification
      const apiResponse = await fetch(
        `http://localhost:3000/api/auth/google-signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            token: googleToken,
            role: activeTab,
          }),
        }
      );

      const result = await apiResponse.json();

      if (apiResponse.ok) {
        // Handle successful Google sign-in
        localStorage.setItem(`${activeTab}_token`, result.token);
        localStorage.setItem("userRole", activeTab);
        localStorage.setItem("userName", result.user.name);

        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        }
      } else {
        alert(result.message || "Google Sign-In failed");
      }
    } catch (error) {
      console.error("Google Sign-In error:", error);
      alert("Google Sign-In failed. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  // Initialize Google Sign-In when component mounts
  React.useEffect(() => {
    // Load Google GSI script
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;

    script.onload = () => {
      if (window.google && window.google.accounts) {
        window.google.accounts.id.initialize({
          client_id: client_id, // Replace with your actual Google Client ID
          callback: handleGoogleCredentialResponse,
          auto_select: false,
          cancel_on_tap_outside: true,
        });
      }
    };

    document.head.appendChild(script);

    return () => {
      // Cleanup
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  return (
    <div id="get-started" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Access Your Dashboard
          </h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to access the Invennzy management system
          </p>
        </div>
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-900 to-teal-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-8">
                Select Your Role
              </h3>
              <div className="space-y-4">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setActiveTab(type.id);
                      setIsSignUp(false);
                      setIsForgotPassword(false);
                      setFormData({
                        name: "",
                        email: "",
                        password: "",
                        confirmPassword: "",
                      });
                    }}
                    className={`w-full flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                      activeTab === type.id
                        ? "bg-white text-gray-900 shadow-lg"
                        : "text-white hover:bg-white/10"
                    }`}
                  >
                    <div className={`p-2 rounded-lg ${type.color}`}>
                      <type.icon className="w-6 h-6 text-white" />
                    </div>
                    <span className="font-semibold">{type.name}</span>
                  </button>
                ))}
              </div>
            </div>
            <div className="md:w-2/3 p-8">
              <div className="max-w-md mx-auto">
                {getCurrentUserType() && (
                  <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                      {React.createElement(getCurrentUserType().icon, {
                        className: "w-8 h-8 text-blue-600",
                      })}
                      <h3 className="text-2xl font-bold text-gray-900">
                        {getCurrentUserType().name}{" "}
                        {isSignUp
                          ? "Sign Up"
                          : isForgotPassword
                          ? "Forgot Password"
                          : "Login"}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {isSignUp
                        ? "Create your account"
                        : isForgotPassword
                        ? "Enter your email to receive a password reset link"
                        : "Enter your credentials to access your dashboard"}
                    </p>
                  </div>
                )}
                <div className="space-y-6">
                  {isForgotPassword ? (
                    <>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          placeholder="Enter your email"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <button
                        type="button"
                        onClick={handleForgotPasswordSubmit}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading ? "Sending..." : "Send Verification Email"}
                      </button>
                      <div className="text-center">
                        <button
                          type="button"
                          onClick={() => setIsForgotPassword(false)}
                          disabled={isLoading}
                          className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                        >
                          Back to Login
                        </button>
                      </div>
                    </>
                  ) : (
                    <>
                      {isSignUp && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Full Name
                          </label>
                          <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Enter your full name"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Email Address
                        </label>
                        <input
                          type="email"
                          name="email"
                          value={formData.email}
                          onChange={handleInputChange}
                          className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                          placeholder="Enter your email"
                          required
                          disabled={isLoading}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Password
                        </label>
                        <div className="relative">
                          <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 pr-12"
                            placeholder="Enter your password"
                            required
                            disabled={isLoading}
                          />
                          <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                            disabled={isLoading}
                          >
                            {showPassword ? (
                              <EyeOff className="w-5 h-5" />
                            ) : (
                              <Eye className="w-5 h-5" />
                            )}
                          </button>
                        </div>
                      </div>
                      {isSignUp && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Confirm Password
                          </label>
                          <input
                            type="password"
                            name="confirmPassword"
                            value={formData.confirmPassword}
                            onChange={handleInputChange}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200"
                            placeholder="Confirm your password"
                            required
                            disabled={isLoading}
                          />
                        </div>
                      )}
                      <button
                        type="button"
                        onClick={handleGoogleSignIn}
                        disabled={isLoading}
                        className="w-full bg-white border border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 shadow-sm hover:shadow-md flex items-center justify-center gap-3 disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <svg className="w-5 h-5" viewBox="0 0 24 24">
                          <path
                            fill="#4285F4"
                            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                          />
                          <path
                            fill="#34A853"
                            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                          />
                          <path
                            fill="#FBBC05"
                            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                          />
                          <path
                            fill="#EA4335"
                            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                          />
                        </svg>
                        {isSignUp
                          ? "Sign up with Google"
                          : "Sign in with Google"}
                      </button>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            or
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={handleSubmit}
                        disabled={isLoading}
                        className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
                      >
                        {isLoading
                          ? "Processing..."
                          : isSignUp
                          ? "Create Account"
                          : "Sign In"}
                      </button>
                      <div className="text-center">
                        {getCurrentUserType().hasSignup &&
                          activeTab === "admin" && (
                            <button
                              type="button"
                              onClick={() => setIsSignUp(!isSignUp)}
                              disabled={isLoading}
                              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                            >
                              {isSignUp
                                ? "Already have an account? Sign In"
                                : "Don't have an account? Sign Up"}
                            </button>
                          )}
                        {activeTab !== "admin" && (
                          <p className="text-sm text-gray-600 mb-4">
                            Lab Incharge and Lab Assistant accounts are created
                            by administrators.
                          </p>
                        )}
                        {!isSignUp && (
                          <div className="mt-4">
                            <button
                              type="button"
                              onClick={() => setIsForgotPassword(true)}
                              disabled={isLoading}
                              className="text-blue-600 hover:text-blue-700 font-medium disabled:opacity-50"
                            >
                              Forgot Password?
                            </button>
                          </div>
                        )}
                      </div>
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;
