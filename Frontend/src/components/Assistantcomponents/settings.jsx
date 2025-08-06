import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  User,
  Bell,
  Save,
  Mail,
  Lock,
  Eye,
  EyeOff,
  AlertTriangle,
  Check,
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
    email: false,
    push: false,
    sms: false,
  });
  const [profile, setProfile] = useState({
    name: "",
    email: "",
    phone: "",
    department: "",
    role: "",
  });

  const handleUpdatePassword = async () => {
    if (!passwords.current || !passwords.new || !passwords.confirm) {
      return toast.error("All password fields are required.");
    }
    if (passwords.new !== passwords.confirm) {
      return toast.error("New passwords do not match.");
    }
    try {
      const token = localStorage.getItem("token");
      const response = await axios.put(
        "/api/settings/labassistant/password",
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
      toast.success(response.data.message || "Password updated successfully");
      setPasswords({ current: "", new: "", confirm: "" });
    } catch (error) {
      console.error("Error updating password:", error);
      toast.error(
        error?.response?.data?.message || "Failed to update password"
      );
    }
  };

  useEffect(() => {
    const fetchNotificationSettings = async () => {
      try {
        const token = localStorage.getItem("token");
        const response = await axios.get(
          "/api/settings/labassistant/notifications",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        const data = response.data.notifications;

        // Map database values to boolean and rename keys
        setNotifications({
          email: Boolean(data.notify_email),
          push: Boolean(data.notify_push),
          sms: Boolean(data.notify_sms),
        });
      } catch (error) {
        console.error("Error fetching notification settings:", error);
      }
    };

    if (activeSection === "notifications") {
      fetchNotificationSettings();
    }
  }, [activeSection]);

  const fetchProfileData = async () => {
    setIsLoading(true);
    try {
      const token = localStorage.getItem("token");
      const response = await axios.get("/api/settings/labassistant/profile", {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      const data = response.data;
      const profileData = data.profile || data;
      setProfile({
        name: profileData.name || "",
        email: profileData.email || "",
        phone: profileData.phone || "",
        department: profileData.department || "",
        role: profileData.role || "",
      });
      if (profileData.profile_picture && profileData.profile_picture.data) {
        const byteArray = new Uint8Array(profileData.profile_picture.data);
        const blob = new Blob([byteArray], { type: "image/jpeg" }); // or image/png
        const imageUrl = URL.createObjectURL(blob);
        setProfileImagePreview(imageUrl);
      }
    } catch (error) {
      console.error("Error fetching profile data:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchProfileData();
  }, []);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith("image/")) {
        toast.error("Please select a valid image file");
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        toast.error("File size must be less than 5MB");
        return;
      }
      setProfileImage(file);
      const reader = new FileReader();
      reader.onload = (e) => {
        setProfileImagePreview(e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleChangePhoto = () => {
    fileInputRef.current?.click();
  };

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
    if (!profile.name.trim() || !profile.email.trim()) {
      toast.error("Name and email are required fields");
      return;
    }
    setIsLoading(true);
    try {
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
      } else {
        requestData = {
          name: profile.name.trim(),
          email: profile.email.trim(),
          phone: profile.phone.trim() || null,
          department: profile.department.trim() || null,
          role: profile.role,
        };
        headers["Content-Type"] = "application/json";
      }
      await axios.put("/api/settings/assistantsetting", requestData, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
          ...headers,
        },
      });

      await axios.put(
        "/api/settings/labassistant/notifications",
        {
          notify_email: notifications.email,
          notify_push: notifications.push,
          notify_sms: notifications.sms,
        },
        {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      toast.success("Settings saved successfully!");
      if (profileImage) {
        setProfileImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = "";
        }
      }
    } catch (error) {
      console.error("Error saving settings:", error);
      toast.error("Failed to save settings. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

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
        <div className="flex-1">
          {renderContent()}
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
      <ToastContainer />
    </div>
  );
};

export default SettingsPage;
