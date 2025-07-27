import React, { useState, useRef } from "react";
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
  const [message, setMessage] = useState({ text: "", type: "" });
  const googleButtonRef = useRef(null);
  const googleInitialized = useRef(false);
  const activeTabRef = useRef(activeTab);
  const client_id = import.meta.env.VITE_GOOGLE_CLIENT_ID;

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

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
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
          localStorage.setItem(`token`, result.token);
          localStorage.setItem("userRole", activeTab);
          localStorage.setItem("userName", result.user.name);
          if (result.redirectUrl) {
            window.location.href = result.redirectUrl;
          } else {
            const redirectUrls = {
              admin: "/admindash",
              labincharge: "/labinchargedash",
              labassistant: "/labassistantdash",
            };
            window.location.href = redirectUrls[activeTab] || "/";
          }
        } else if (result.redirectUrl) {
          setMessage({ text: result.message, type: "success" });
          window.location.href = result.redirectUrl;
        } else {
          setMessage({ text: result.message, type: "success" });
        }
      } else {
        setMessage({
          text: result.message || "An error occurred",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({ text: "Network error. Please try again.", type: "error" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const currentUserType = getCurrentUserType();
    if (isSignUp) {
      if (activeTab !== "admin") {
        alert(
          "Only admin accounts can be created through signup. Lab Incharge and Lab Assistant accounts are created by administrators."
        );
        return;
      }
      if (formData.password !== formData.confirmPassword) {
        setMessage({ text: "Passwords don't match!", type: "error" });
        return;
      }
      await makeApiCall(currentUserType.endpoints.signup, {
        name: formData.name,
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

  const handleGoogleCredentialResponse = async (response) => {
    try {
      setIsLoading(true);
      const googleToken = response.credential;
      const currentRole = activeTabRef.current;
      const requestPayload = {
        token: googleToken,
        role: currentRole,
      };
      const apiResponse = await fetch(
        `http://localhost:3000/api/auth/google-signin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestPayload),
        }
      );
      const result = await apiResponse.json();
      if (apiResponse.ok) {
        localStorage.setItem(`token`, result.token);
        localStorage.setItem("userRole", result.user.role);
        localStorage.setItem("userName", result.user.name);
        if (result.redirectUrl) {
          window.location.href = result.redirectUrl;
        }
      } else {
        setMessage({
          text: result.message || "Google Sign-In failed",
          type: "error",
        });
      }
    } catch (error) {
      setMessage({
        text: "Google Sign-In failed. Please try again.",
        type: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const initializeGoogleSignIn = React.useCallback(() => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.initialize({
        client_id: client_id,
        callback: handleGoogleCredentialResponse,
        ux_mode: "popup",
        auto_select: false,
        cancel_on_tap_outside: true,
      });
      googleInitialized.current = true;
    }
  }, [activeTab]);

  const renderGoogleButton = () => {
    if (window.google && window.google.accounts && googleButtonRef.current) {
      googleButtonRef.current.innerHTML = "";
      window.google.accounts.id.renderButton(googleButtonRef.current, {
        theme: "outline",
        size: "large",
        text: "signin_with",
        shape: "pill",
        width: "100%",
      });
    }
  };

  const handleGoogleSignIn = () => {
    if (window.google && window.google.accounts) {
      window.google.accounts.id.prompt();
    } else {
      setMessage({
        text: "Google Sign-In is not available. Please try again.",
        type: "error",
      });
    }
  };

  React.useEffect(() => {
    if (message.text) {
      const timer = setTimeout(() => {
        setMessage({ text: "", type: "" });
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  React.useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = () => {
      initializeGoogleSignIn();
      renderGoogleButton();
    };
    document.head.appendChild(script);
    return () => {
      if (document.head.contains(script)) {
        document.head.removeChild(script);
      }
    };
  }, []);

  React.useEffect(() => {
    activeTabRef.current = activeTab;
    const timer = setTimeout(() => {
      initializeGoogleSignIn();
      renderGoogleButton();
    }, 100);
    return () => clearTimeout(timer);
  }, [activeTab, initializeGoogleSignIn]);

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
                      activeTabRef.current = type.id;
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
                  {message.text && (
                    <div
                      className={`p-4 mb-4 text-sm rounded-lg ${
                        message.type === "error"
                          ? "bg-red-100 text-red-700"
                          : "bg-green-100 text-green-700"
                      }`}
                    >
                      {message.text}
                    </div>
                  )}
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
                      <div
                        ref={googleButtonRef}
                        className="w-full flex justify-center"
                      ></div>
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <div className="w-full border-t border-gray-300"></div>
                        </div>
                        <div className="relative flex justify-center text-sm">
                          <span className="px-2 bg-white text-gray-500">
                            or continue with email
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
