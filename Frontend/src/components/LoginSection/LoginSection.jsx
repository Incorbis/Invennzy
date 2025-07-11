import React, { useState } from 'react';
import { User, Shield, Settings, Eye, EyeOff } from 'lucide-react';

const LoginSection = () => {
  const [activeTab, setActiveTab] = useState('admin');
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [isSignUp, setIsSignUp] = useState(false);

  const userTypes = [
    { id: 'admin', name: 'Admin', icon: Shield, color: 'bg-red-500', hasSignup: true },
    { id: 'lab-incharge', name: 'Lab Incharge', icon: User, color: 'bg-blue-500', hasSignup: false },
    { id: 'lab-assistant', name: 'Lab Assistant', icon: Settings, color: 'bg-green-500', hasSignup: false }
  ];

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Handle login/signup logic here
    console.log('Form submitted:', formData);
  };

  return (
    <div id="get-started" className="py-20 bg-gray-50">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Access Your Dashboard</h2>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Choose your role to access the Invennzy management system
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl overflow-hidden">
          {/* Tab Navigation */}
          <div className="flex flex-col md:flex-row">
            <div className="md:w-1/3 bg-gradient-to-br from-blue-900 to-teal-700 p-8">
              <h3 className="text-2xl font-bold text-white mb-8">Select Your Role</h3>
              <div className="space-y-4">
                {userTypes.map((type) => (
                  <button
                    key={type.id}
                    onClick={() => {
                      setActiveTab(type.id);
                      setIsSignUp(false);
                    }}
                    className={`w-full flex items-center space-x-4 p-4 rounded-lg transition-all duration-300 ${
                      activeTab === type.id 
                        ? 'bg-white text-gray-900 shadow-lg' 
                        : 'text-white hover:bg-white/10'
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

            {/* Form Section */}
            <div className="md:w-2/3 p-8">
              <div className="max-w-md mx-auto">
                {userTypes.find(type => type.id === activeTab) && (
                  <div className="mb-8">
                    <div className="flex items-center space-x-4 mb-4">
                      {React.createElement(userTypes.find(type => type.id === activeTab).icon, {
                        className: "w-8 h-8 text-blue-600"
                      })}
                      <h3 className="text-2xl font-bold text-gray-900">
                        {userTypes.find(type => type.id === activeTab).name} {isSignUp ? 'Sign Up' : 'Login'}
                      </h3>
                    </div>
                    <p className="text-gray-600">
                      {isSignUp ? 'Create your admin account' : 'Enter your credentials to access your dashboard'}
                    </p>
                  </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-6">
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
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Password
                    </label>
                    <div className="relative">
                      <input
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        value={formData.password}
                        onChange={handleInputChange}
                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors duration-200 pr-12"
                        placeholder="Enter your password"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                      >
                        {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
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
                      />
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full bg-gradient-to-r from-blue-600 to-teal-600 text-white py-3 rounded-lg font-semibold hover:from-blue-700 hover:to-teal-700 transform hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-xl"
                  >
                    {isSignUp ? 'Create Account' : 'Sign In'}
                  </button>

                  {activeTab === 'admin' && (
                    <div className="text-center">
                      <button
                        type="button"
                        onClick={() => setIsSignUp(!isSignUp)}
                        className="text-blue-600 hover:text-blue-700 font-medium"
                      >
                        {isSignUp ? 'Already have an account? Sign In' : "Don't have an account? Sign Up"}
                      </button>
                    </div>
                  )}
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSection;