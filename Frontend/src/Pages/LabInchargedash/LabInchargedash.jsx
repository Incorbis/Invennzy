import React, { useState, useEffect } from "react";
import { Link, Outlet, useNavigate } from "react-router-dom";
import {
  Home,
  Bell,
  Package,
  ClipboardList,
  BarChart3,
  Settings,
  Menu,
  X,
  Search,
  User,
  ChevronDown,
  LogOut,
  HelpCircle,
  Plus,
} from "lucide-react";

const SkeletonLoader = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="flex h-screen">
        <div className="w-64 bg-white p-4 border-r border-gray-200">
          <div className="flex items-center space-x-3 mb-8">
            <div className="w-10 h-10 rounded-lg bg-gray-300 animate-pulse"></div>
            <div className="h-6 w-32 rounded bg-gray-300 animate-pulse"></div>
          </div>
          <div className="space-y-2">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="flex items-center space-x-3 p-3 rounded-lg"
              >
                <div className="w-6 h-6 rounded bg-gray-300 animate-pulse"></div>
                <div className="h-4 flex-1 rounded bg-gray-300 animate-pulse"></div>
              </div>
            ))}
          </div>
        </div>
        <div className="flex-1 overflow-auto">
          <div className="bg-white p-4 border-b border-gray-200 flex justify-between items-center">
            <div className="h-8 w-48 rounded bg-gray-300 animate-pulse"></div>
            <div className="flex items-center space-x-4">
              <div className="h-10 w-64 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
              <div className="w-10 h-10 rounded-full bg-gray-300 animate-pulse"></div>
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
            {[...Array(4)].map((_, i) => (
              <div
                key={i}
                className="bg-white p-5 rounded-xl border border-gray-200"
              >
                <div className="flex justify-between">
                  <div className="w-12 h-12 rounded-lg bg-gray-300 animate-pulse"></div>
                  <div className="h-6 w-16 rounded bg-gray-300 animate-pulse"></div>
                </div>
                <div className="mt-4">
                  <div className="h-6 w-24 rounded bg-gray-300 animate-pulse"></div>
                  <div className="h-8 w-32 mt-2 rounded bg-gray-300 animate-pulse"></div>
                </div>
              </div>
            ))}
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 px-6 pb-6">
            <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-gray-200">
              <div className="h-6 w-32 mb-6 rounded bg-gray-300 animate-pulse"></div>
              <div className="h-64 rounded-lg bg-gray-300 animate-pulse"></div>
            </div>
            <div className="bg-white p-5 rounded-xl border border-gray-200">
              <div className="h-6 w-32 mb-6 rounded bg-gray-300 animate-pulse"></div>
              <div className="space-y-4">
                {[...Array(4)].map((_, i) => (
                  <div key={i}>
                    <div className="h-4 w-full rounded bg-gray-300 animate-pulse"></div>
                    <div className="h-3 w-16 mt-2 rounded bg-gray-300 animate-pulse"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("overview");
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications] = useState(5);
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [isMobile, setIsMobile] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth < 768);
      if (window.innerWidth >= 1024) {
        setSidebarOpen(true);
      } else {
        setSidebarOpen(false);
      }
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/dashboard" },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      path: "/dashboard/inventory",
    },
    {
      id: "add-items",
      label: "Add Items",
      icon: Plus,
      path: "/dashboard/additems",
    },
    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      path: "/dashboard/reports",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/dashboard/notifications",
    },
    {
      id: "requests",
      label: "Requests",
      icon: ClipboardList,
      path: "/dashboard/requests",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/dashboard/settings",
    },
  ];

  const handleMenuClick = (item) => {
    setActiveTab(item.id);
    if (isMobile) {
      setSidebarOpen(false);
    }
    navigate(item.path);
  };

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  if (isLoading) {
    return <SkeletonLoader />;
  }

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar */}
      <aside
        className={`fixed lg:relative z-50 w-64 h-full bg-white shadow-lg transform transition-all duration-300 ease-in-out border-r border-gray-200
        ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        }`}
      >
        <div className="flex flex-col h-full">
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center">
                <Package className="text-white" size={20} />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-800">
                  Smart Inventory
                </h1>
                <p className="text-xs text-gray-500">College Management</p>
              </div>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden p-1 rounded-lg hover:bg-gray-100"
            >
              <X className="text-gray-500" size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto p-4 space-y-2">
            {menuItems.map((item) => (
              <Link
                key={item.id}
                to={item.path}
                onClick={() => handleMenuClick(item)}
                className={`flex items-center w-full p-3 rounded-lg transition-all duration-200
                  ${
                    activeTab === item.id
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`}
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-3 font-medium">{item.label}</span>
              </Link>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="text-white" size={18} />
              </div>
              <div>
                <p className="text-sm font-semibold text-gray-800">
                  Lab Assistant
                </p>
                <p className="text-xs text-gray-500">Laboratory Manager</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center w-full p-3 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
            >
              <LogOut size={18} className="flex-shrink-0" />
              <span className="ml-3">Log Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Overlay for closing sidebar on outside click */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <header className="bg-white shadow-sm z-40 border-b border-gray-200">
          <div className="flex items-center justify-between px-6 py-4">
            <div className="flex items-center">
              <button
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="p-2 mr-3 rounded-lg hover:bg-gray-100 lg:hidden"
              >
                <Menu className="text-gray-500" size={20} />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-800">
                  {menuItems.find((item) => item.id === activeTab)?.label ||
                    "Dashboard"}
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome back, Lab Incharge
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="text-gray-400" size={18} />
                </div>
                <input
                  type="text"
                  placeholder="Search inventory..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 pr-4 py-2 w-64 rounded-lg border border-gray-300 bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>
              <button className="p-2 relative rounded-lg hover:bg-gray-100">
                <Bell className="text-gray-500" size={20} />
                {notifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {notifications}
                  </span>
                )}
              </button>
              <div className="relative">
                <button
                  onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100"
                >
                  <div className="w-8 h-8 rounded-full bg-blue-500 flex items-center justify-center">
                    <User className="text-white" size={16} />
                  </div>
                  <ChevronDown
                    className={`text-gray-500 transition-transform ${
                      profileDropdownOpen ? "transform rotate-180" : ""
                    }`}
                    size={16}
                  />
                </button>
                {profileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-50 border border-gray-200">
                    <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                      <User size={16} className="mr-3" />
                      <span>Profile</span>
                    </button>
                    <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                      <Settings size={16} className="mr-3" />
                      <span>Settings</span>
                    </button>
                    <button className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-50 w-full text-left">
                      <HelpCircle size={16} className="mr-3" />
                      <span>Help</span>
                    </button>
                    <div className="border-t border-gray-200 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="flex items-center px-4 py-2 text-red-600 hover:bg-red-50 w-full text-left"
                    >
                      <LogOut size={16} className="mr-3" />
                      <span>Log Out</span>
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>
      </div>
    </div>
  );
};

export default Dashboard;
