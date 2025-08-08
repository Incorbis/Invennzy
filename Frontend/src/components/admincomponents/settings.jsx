import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import {
  User,
  Bell,
  Shield,
  Database,
  Download,
  Upload,
  Trash2,
  Save,
  RefreshCw,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
  Package,
  Globe,
  Smartphone,
  Monitor,
  Camera,
} from "lucide-react";

const SettingsPage = () => {
  const [activeSection, setActiveSection] = useState("profile");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const fileInputRef = useRef(null);
  const [passwords, setPasswords] = useState({
    current: "",
    new: "",
    confirm: "",
  });

  const [notifications, setNotifications] = useState({
    email: true,
    push: false,
    sms: true,
    lowStock: true,
    newRequests: true,
    systemUpdates: false,
    weeklyReports: true,
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
  });

  // Fetch profile data from API
  useEffect(() => {
    const fetchProfileData = async () => {
      try {
        const token = localStorage.getItem("token");
        if (!token) return console.warn("No token found");

        const response = await axios.get("/api/settings/admin/profile", {
          headers: {
            Authorization: `Bearer ${token}`,
            userId: localStorage.getItem("userId"),
          },
        });

        console.log("✅ Received:", response.data);
        const p = response.data.profile;
        setProfile({
          name: p.name || "",
          email: p.email || "",
          phone: p.phone || "",
          department: p.department || "",
          role: p.role || "",
        });

        if (p.profile_picture) {
          setProfileImagePreview(`http://localhost:3000${p.profile_picture}`);
        }
      } catch (err) {
        console.error("❌ Error fetching profile:", err);
      }
    };

    fetchProfileData();
  }, []);

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return alert("All password fields are required.");
    }
    if (passwords.new !== passwords.confirm) {
      return alert("New passwords do not match.");
    }

    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/settings/admin/password",
        {
          currentPassword: passwords.current,
          newPassword: passwords.new,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert(response.data.message || "Password updated successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      alert(error?.response?.data?.message || "Failed to update password");
    }
  };

  // Handle file selection for profile photo
  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select a valid image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("File size must be less than 5MB");
        return;
      }

      setProfileImage(file);

      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle change photo button click
  const handleChangePhoto = () => {
    fileInputRef.current?.click();
  };

  // Handle remove photo
  const handleRemovePhoto = () => {
    setProfileImage(null);
    setProfileImagePreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const sections = [
    { id: "profile", label: "Profile", icon: User },
    { id: "notifications", label: "Notifications", icon: Bell },
  ];

  const handleNotificationChange = (key) => {
    setNotifications((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  const handleSaveSettings = async () => {
    // Validate required fields
    if (!profile.name.trim() || !profile.email.trim()) {
      alert("Name and email are required fields");
      return;
    }

    setIsLoading(true);
    try {
      // Create FormData for multipart/form-data if there's an image
      let requestData;
      let headers = {};

      if (profileImage) {
        requestData = new FormData();
        requestData.append("name", profile.name.trim());
        requestData.append("email", profile.email.trim());
        requestData.append("phone", profile.phone.trim() || "");
        requestData.append("department", profile.department.trim() || "");
        requestData.append("role", profile.role);
        requestData.append("profileImage", profileImage);
        // Don't set Content-Type header for FormData, let browser set it
      } else {
        requestData = {
          name: profile.name.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim() || null, // Can be blank
          department: profile.department.trim() || null, // Can be blank
          role: profile.role,
        };
        headers["Content-Type"] = "application/json";
      }

      axios.put("/api/settings/settingadmin", requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      });
      alert("Settings saved successfully!");

      // Reset the file input after successful save
      if (profileImage) {
        setProfileImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      alert("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderGeneralSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Globe className="mr-2" size={20} />
          System Preferences
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Currency
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="GBP">GBP (£)</option>
              <option value="INR">INR (₹)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Timezone
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="UTC-5">UTC-5 (Eastern)</option>
              <option value="UTC-6">UTC-6 (Central)</option>
              <option value="UTC-7">UTC-7 (Mountain)</option>
              <option value="UTC-8">UTC-8 (Pacific)</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Language
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="English">English</option>
              <option value="Spanish">Spanish</option>
              <option value="French">French</option>
              <option value="German">German</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Theme
            </label>
            <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
              <option value="light">Light</option>
              <option value="dark">Dark</option>
              <option value="auto">Auto</option>
            </select>
          </div>
        </div>
      </div>
    </div>
  );

  const renderProfileSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <User className="mr-2" size={20} />
          Profile Information
          {isLoading && (
            <span className="ml-2 text-sm text-gray-500">Loading...</span>
          )}
        </h3>
        <div className="flex items-center mb-6">
          <div className="w-20 h-20 rounded-full bg-blue-500 flex items-center justify-center mr-6 overflow-hidden">
            {profileImagePreview ? (
              <img
                src={profileImagePreview}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            ) : (
              <User className="text-white" size={32} />
            )}
          </div>
          <div>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleFileSelect}
              accept="image/*"
              className="hidden"
            />
            <div className="flex items-center space-x-4">
              <button
                onClick={handleChangePhoto}
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2"
              >
                <Camera size={16} />
                <span>Change Photo</span>
              </button>
              <button
                onClick={handleRemovePhoto}
                className="border border-gray-300 text-gray-700 px-4 py-2 rounded-lg hover:bg-gray-50"
              >
                Remove
              </button>
            </div>
          </div>
        </div>
        {profileImage && (
          <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700 flex items-center">
              <Check size={16} className="mr-2" />
              New photo selected: {profileImage.name} (
              {(profileImage.size / 1024 / 1024).toFixed(2)} MB)
            </p>
            <p className="text-xs text-green-600 mt-1">
              Don't forget to save your changes to upload the new photo.
            </p>
          </div>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Full Name <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={profile.name}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, name: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email <span className="text-red-500">*</span>
            </label>
            <input
              type="email"
              value={profile.email}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, email: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Phone
            </label>
            <input
              type="tel"
              value={profile.phone}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, phone: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Department
            </label>
            <input
              type="text"
              value={profile.department}
              onChange={(e) =>
                setProfile((prev) => ({ ...prev, department: e.target.value }))
              }
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Lock className="mr-2" size={20} />
          Change Password
        </h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Current Password
            </label>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10"
                placeholder="Enter current password"
                value={passwords.current}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, current: e.target.value }))
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                {showPassword ? (
                  <EyeOff size={20} className="text-gray-400" />
                ) : (
                  <Eye size={20} className="text-gray-400" />
                )}
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                New Password
              </label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter new password"
                value={passwords.new}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, new: e.target.value }))
                }
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confirm New Password
              </label>
              <input
                type="password"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Confirm new password"
                value={passwords.confirm}
                onChange={(e) =>
                  setPasswords((prev) => ({ ...prev, confirm: e.target.value }))
                }
              />
            </div>
          </div>

          <button
            onClick={handleUpdatePassword}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700"
          >
            Update Password
          </button>
        </div>
      </div>
    </div>
  );

  const renderNotificationSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Bell className="mr-2" size={20} />
          Notification Preferences
        </h3>
        <div className="space-y-6">
          <div>
            <h4 className="font-medium text-gray-800 mb-3 flex items-center">
              <Mail className="mr-2" size={16} />
              Delivery Methods
            </h4>
            <div className="space-y-3">
              {Object.entries({
                email: "Email Notifications",
                push: "Push Notifications",
                sms: "SMS Notifications",
              }).map(([key, label]) => (
                <div
                  key={key}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                >
                  <span className="text-gray-700">{label}</span>
                  <button
                    onClick={() => handleNotificationChange(key)}
                    className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                      notifications[key] ? "bg-blue-600" : "bg-gray-300"
                    }`}
                  >
                    <span
                      className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                        notifications[key] ? "translate-x-6" : "translate-x-1"
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderInventorySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Package className="mr-2" size={20} />
          Inventory Configuration
        </h3>
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Low Stock Threshold
              </label>
              <input
                type="number"
                className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                min="1"
              />
              <p className="text-xs text-gray-500 mt-1">
                Alert when stock falls below this number
              </p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Items Per Page
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value={10}>10 items</option>
                <option value={25}>25 items</option>
                <option value={50}>50 items</option>
                <option value={100}>100 items</option>
              </select>
            </div>
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-blue-800">Auto Reorder</h4>
                <p className="text-sm text-blue-600">
                  Automatically reorder items when stock is low
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-300">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Default Reorder Quantity
            </label>
            <input
              type="number"
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              min="1"
            />
          </div>
        </div>
      </div>
    </div>
  );

  const renderSecuritySettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Shield className="mr-2" size={20} />
          Security Settings
        </h3>
        <div className="space-y-6">
          <div className="bg-red-50 p-4 rounded-lg border border-red-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-red-800">
                  Two-Factor Authentication
                </h4>
                <p className="text-sm text-red-600">
                  Add an extra layer of security to your account
                </p>
              </div>
              <button className="relative inline-flex h-6 w-11 items-center rounded-full transition-colors bg-gray-300">
                <span className="inline-block h-4 w-4 transform rounded-full bg-white transition-transform translate-x-1" />
              </button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Session Timeout (minutes)
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value={15}>15 minutes</option>
                <option value={30}>30 minutes</option>
                <option value={60}>1 hour</option>
                <option value={120}>2 hours</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Max Login Attempts
              </label>
              <select className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                <option value={3}>3 attempts</option>
                <option value={5}>5 attempts</option>
                <option value={10}>10 attempts</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">
          Active Sessions
        </h3>
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Monitor size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Current Session</p>
                <p className="text-sm text-gray-500">
                  Chrome on Windows • 192.168.1.100
                </p>
              </div>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
              Active
            </span>
          </div>
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div className="flex items-center space-x-3">
              <Smartphone size={20} className="text-gray-600" />
              <div>
                <p className="font-medium text-gray-800">Mobile App</p>
                <p className="text-sm text-gray-500">
                  iPhone • Last active 2 hours ago
                </p>
              </div>
            </div>
            <button className="text-red-600 hover:text-red-700 text-sm">
              Revoke
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDataSettings = () => (
    <div className="space-y-6">
      <div className="bg-white rounded-xl p-6 border border-gray-200">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center">
          <Database className="mr-2" size={20} />
          Data Management
        </h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50">
              <Download size={20} className="text-gray-600" />
              <span className="text-gray-700">Export All Data</span>
            </button>
            <button className="flex items-center justify-center space-x-2 p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50">
              <Upload size={20} className="text-gray-600" />
              <span className="text-gray-700">Import Data</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      case "profile":
        return renderProfileSettings();
      case "notifications":
        return renderNotificationSettings();
      default:
        return renderProfileSettings();
    }
  };

  return (
    <div className="max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row gap-6">
        {/* Settings Navigation */}
        <div className="lg:w-64 flex-shrink-0">
          <div className="bg-white rounded-xl p-4 border border-gray-200 sticky top-6">
            <h2 className="font-semibold text-gray-800 mb-4">Settings</h2>
            <nav className="space-y-1">
              {sections.map((section) => (
                <button
                  key={section.id}
                  onClick={() => setActiveSection(section.id)}
                  className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-200 ${
                    activeSection === section.id
                      ? "bg-blue-50 text-blue-600 shadow-sm transform scale-105"
                      : "text-gray-700 hover:bg-gray-50 hover:transform hover:scale-102"
                  }`}
                >
                  <section.icon size={18} />
                  <span className="text-sm font-medium">{section.label}</span>
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Settings Content */}
        <div className="flex-1">
          {renderContent()}

          {/* Save Button */}
          <div className="mt-6 bg-white rounded-xl p-6 border border-gray-200">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium text-gray-800">Save Changes</h4>
                <p className="text-sm text-gray-500">
                  Make sure to save your changes before leaving this page.
                </p>
              </div>
              <div className="flex items-center space-x-3">
                <button className="px-6 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                  Cancel
                </button>
                <button
                  onClick={handleSaveSettings}
                  disabled={isLoading}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 flex items-center space-x-2 disabled:opacity-50"
                >
                  <Save size={16} />
                  <span>{isLoading ? "Saving..." : "Save Settings"}</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;