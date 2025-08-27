import React, { useState, useEffect } from "react";
import { NavLink, Outlet, useNavigate, useLocation } from "react-router-dom";
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
import logo2 from "../../assets/logo2.png";

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
        </div>
      </div>
    </div>
  );
};

const labinchargedash = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [showLogoutModal, setShowLogoutModal] = useState(false);
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

  const name = localStorage.getItem("userName");

  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const staffId = localStorage.getItem("staffId");
        const res = await fetch(
          `/api/notifications/labincharge/${staffId}?t=${Date.now()}`
        );
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Failed to fetch notifications", err);
      }
    };
    fetchNotifications();
  }, []);

  const unreadCount = notifications.filter((n) => !n.is_read).length;

  const menuItems = [
    { id: "overview", label: "Overview", icon: Home, path: "/labinchargedash" },
    {
      id: "inventory",
      label: "Inventory",
      icon: Package,
      path: "/labinchargedash/inventory",
    },

    {
      id: "reports",
      label: "Reports",
      icon: BarChart3,
      path: "/labinchargedash/reports",
    },
    {
      id: "notifications",
      label: "Notifications",
      icon: Bell,
      path: "/labinchargedash/notifications",
    },
    {
      id: "requests",
      label: "Request Form",
      icon: ClipboardList,
      path: "/labinchargedash/requests",
    },
    {
      id: "settings",
      label: "Settings",
      icon: Settings,
      path: "/labinchargedash/settings",
    },
  ];

  const location = useLocation();
  const currentMenu = menuItems.find((item) => location.pathname.startsWith(item.path));

  const handleMenuClick = (item) => {
    setActiveTab(item.id);
    if (isMobile) {
      setSidebarOpen(false);
    }
    navigate(item.path);
  };

  const handleLogout = () => {
    setShowLogoutModal(true);
  };

  const handleConfirmLogout = () => {
    localStorage.clear();
    navigate("/");
  };

  const handleCancelLogout = () => {
    setShowLogoutModal(false);
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
              <div className="w-10 h-10 rounded-lg flex items-center justify-center">
                <div className="h-9 w-13 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                  <img src={logo2}></img>
                </div>
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
              <NavLink
                key={item.id}
                to={item.path}
                end
                className={({ isActive }) =>
                  `flex items-center w-full p-3 rounded-lg transition-all duration-200 ${
                    isActive
                      ? "bg-blue-50 text-blue-600 border-r-2 border-blue-500"
                      : "text-gray-700 hover:bg-gray-50"
                  }`
                }
              >
                <item.icon size={20} className="flex-shrink-0" />
                <span className="ml-3 font-medium">{item.label}</span>
              </NavLink>
            ))}
          </nav>
          <div className="p-4 border-t border-gray-200">
            <div className="flex items-center space-x-3 mb-4">
              <div className="w-10 h-10 rounded-full bg-blue-500 flex items-center justify-center">
                <User className="text-white" size={18} />
              </div>
              <div>
                <h2 className="text-sm font-semibold text-gray-800">
                  {name || "Lab Incharge"}
                </h2>
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
                  {currentMenu?.label || "Dashboard"}
                </h1>
                <p className="text-sm text-gray-500">
                  Welcome Back, {name || "LabInCharge"}!
                </p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative hidden md:block"></div>
              <button className="p-2 relative rounded-lg hover:bg-gray-100">
                <NavLink to="/labinchargedash/notifications" className="p-2 relative rounded-lg hover:bg-gray-100">
                  <Bell className="text-gray-500" size={20} />
                  {unreadCount > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {unreadCount}
                    </span>
                  )}
                </NavLink>
              </button>
            </div>
          </div>
        </header>

        {showLogoutModal && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-[9999]">
            <div className="w-[400px] p-8 bg-white border border-gray-300 shadow-2xl rounded-2xl">
              <h2 className="text-xl font-bold text-gray-800 mb-4 text-center">
                Confirm Logout
              </h2>
              <p className="text-base text-gray-600 mb-6 text-center">
                Are you sure you want to log out?
              </p>
              <div className="flex justify-center gap-6">
                <button
                  onClick={handleCancelLogout}
                  className="px-6 py-2 rounded-lg bg-gray-200 hover:bg-gray-300 text-sm font-medium"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmLogout}
                  className="px-6 py-2 rounded-lg bg-red-500 hover:bg-red-600 text-white text-sm font-medium"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        )}

        <main className="flex-1 overflow-y-auto p-6 bg-gray-50">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default labinchargedash;
