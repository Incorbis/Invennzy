import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import {
  Package,
  AlertTriangle,
  TrendingUp,
  TrendingDown,
  MapPin,
  Users,
  RefreshCw,
  Building,
  FileText,
  Calendar,
  CheckCircle,
  XCircle,
  Monitor,
  Projector,
  Zap,
  Fan,
  Wifi,
} from "lucide-react";

const Overview = () => {
  const navigate = useNavigate();
  const [equipmentTotals, setEquipmentTotals] = useState({
    monitors: 0,
    projectors: 0,
    switchBoards: 0,
    fans: 0,
    wifi: 0,
    totalDevices: 0,
    totalLabs: 0,
  });
  const [labsData, setLabsData] = useState([]);
  const [reportsData, setReportsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Fetch real-time equipment data from the same source as Inventory
  const fetchEquipmentTotals = async () => {
    try {
      // Get adminId from localStorage (same as Inventory component)
      const adminId = localStorage.getItem("adminId");

      if (!adminId) {
        throw new Error("Admin ID not found. Please log in again.");
      }

      // Fetch labs data using the same endpoint as Inventory
      const response = await axios.get(
        `http://localhost:3000/api/labs/admin/${adminId}`
      );

      const labs = response.data;

      // Calculate totals exactly like in Inventory component
      const totals = labs.reduce(
        (acc, lab) => ({
          monitors: acc.monitors + (lab.monitors || 0),
          projectors: acc.projectors + (lab.projectors || 0),
          switchBoards: acc.switchBoards + (lab.switch_boards || 0),
          fans: acc.fans + (lab.fans || 0),
          wifi: acc.wifi + (lab.wifi || 0),
        }),
        { monitors: 0, projectors: 0, switchBoards: 0, fans: 0, wifi: 0 }
      );

      // Calculate additional metrics
      const totalDevices =
        totals.monitors +
        totals.projectors +
        totals.switchBoards +
        totals.fans +
        totals.wifi;
      const totalLabs = labs.length;
      const activeLabs = labs.filter((lab) => lab.status === "active").length;

      setEquipmentTotals({
        ...totals,
        totalDevices,
        totalLabs,
        activeLabs,
      });

      setLabsData(labs);
      return { totals, labs };
    } catch (err) {
      console.error("Error fetching equipment totals:", err);
      throw err;
    }
  };

  // Fetch reports data
  const fetchReportsData = async () => {
    try {
      const response = await axios.get(
        "http://localhost:3000/api/admin/reports"
      );

      // Filter only approved or rejected reports (completed actions)
      const completedReports = response.data.filter(
        (notification) =>
          notification.adminApprovalStatus === "approved" ||
          notification.adminApprovalStatus === "rejected"
      );

      // Sort by date (newest first) and get only first 3
      const recentReports = completedReports
        .sort(
          (a, b) =>
            new Date(b.created_at || b.date) - new Date(a.created_at || a.date)
        )
        .slice(0, 3);

      setReportsData(recentReports);

      return {
        recent: recentReports,
        total: completedReports.length,
        approved: completedReports.filter(
          (r) => r.adminApprovalStatus === "approved"
        ).length,
        rejected: completedReports.filter(
          (r) => r.adminApprovalStatus === "rejected"
        ).length,
      };
    } catch (err) {
      console.error("Error fetching reports:", err);
      setReportsData([]);
      return { recent: [], total: 0, approved: 0, rejected: 0 };
    }
  };

  // Main data fetching function
  const fetchAllData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Fetch both equipment and reports data
      await Promise.all([fetchEquipmentTotals(), fetchReportsData()]);

      setLastRefresh(new Date());
      setError(null);
    } catch (err) {
      console.error("Error loading overview data:", err);
      setError(
        err.response?.data?.message || err.message || "Failed to load data"
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchAllData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchAllData(true); // Show refresh indicator
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchAllData(true);
  };

  // Calculate device categories count
  const deviceCategories = 5; // monitors, projectors, switchBoards, fans, wifi

  // Updated metrics with real-time data from the same source as Inventory
  const metrics = [
    {
      title: "Total Devices",
      value: equipmentTotals.totalDevices.toString(),
      change: `${equipmentTotals.activeLabs || 0} active labs`,
      trend: "up",
      icon: Package,
      color: "bg-blue-500",
      description: "All registered equipment across labs",
    },
    {
      title: "Device Categories",
      value: deviceCategories.toString(),
      change: "Equipment types",
      trend: "stable",
      icon: Building,
      color: "bg-purple-500",
      description: "Monitors, Projectors, Switches, Fans, WiFi",
    },
    {
      title: "Total Labs",
      value: equipmentTotals.totalLabs.toString(),
      change: `${equipmentTotals.activeLabs || 0} active labs`,
      trend: equipmentTotals.totalLabs > 0 ? "up" : "stable",
      icon: MapPin,
      color: "bg-orange-500",
      description: "Laboratory locations",
    },
    {
      title: "Recent Reports",
      value: reportsData.length.toString(),
      change: "Processed reports",
      trend: reportsData.length > 0 ? "up" : "stable",
      icon: FileText,
      color: "bg-green-500",
      description: "Latest processed reports",
    },
  ];

  const getReportStatusColor = (status) => {
    switch (status) {
      case "approved":
        return "bg-green-100 text-green-800 border-green-200";
      case "rejected":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getReportStatusIcon = (status) => {
    switch (status) {
      case "approved":
        return <CheckCircle size={16} className="text-green-600" />;
      case "rejected":
        return <XCircle size={16} className="text-red-600" />;
      default:
        return <AlertTriangle size={16} className="text-gray-600" />;
    }
  };

  const formatDate = (dateString) => {
    if (!dateString) return "N/A";
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6 bg-gray-50 min-h-screen p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-sm border border-gray-200 p-6"
            >
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Overview
          </h2>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => fetchAllData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 bg-gray-50 min-h-screen p-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">
            College Inventory Overview
          </h1>
          <p className="text-gray-600 mt-1">
            Real-time equipment tracking and laboratory management
          </p>
        </div>
        <div className="flex flex-col space-y-2 sm:flex-row sm:items-center sm:space-y-0 sm:space-x-3">
          {lastRefresh && (
            <p className="text-sm text-gray-500 text-center sm:text-left">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
          <div className="flex items-center space-x-3">
            <button
              onClick={handleManualRefresh}
              disabled={refreshing}
              className={`flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors ${
                refreshing ? "opacity-75" : ""
              }`}
            >
              <RefreshCw
                className={`mr-2 w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
              />
              {refreshing ? "Refreshing..." : "Refresh"}
            </button>
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between">
              <div
                className={`${metric.color} w-14 h-14 rounded-xl flex items-center justify-center shadow-lg`}
              >
                <metric.icon className="text-white" size={28} />
              </div>
              <div
                className={`flex items-center text-sm px-2 py-1 rounded-full ${
                  metric.trend === "up"
                    ? "text-green-600 bg-green-50"
                    : metric.trend === "down"
                    ? "text-red-600 bg-red-50"
                    : "text-gray-600 bg-gray-50"
                }`}
              >
                {metric.trend === "up" ? (
                  <TrendingUp size={14} className="mr-1" />
                ) : metric.trend === "down" ? (
                  <TrendingDown size={14} className="mr-1" />
                ) : null}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-semibold text-gray-600 uppercase tracking-wide">
                {metric.title}
              </h3>
              <p className="text-3xl font-bold text-gray-900 mt-2">
                {metric.value}
              </p>
              <p className="text-sm text-gray-500 mt-1">{metric.change}</p>
              <p className="text-xs text-gray-400 mt-1">{metric.description}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Equipment Breakdown Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <Package className="mr-2 text-blue-600" size={20} />
            Equipment Distribution
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Real-time data from labs</span>
          </div>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div className="text-center p-4 bg-blue-50 rounded-lg border border-blue-200 hover:shadow-sm transition-shadow">
            <Monitor className="mx-auto text-blue-500 mb-3" size={32} />
            <p className="text-2xl font-bold text-gray-900">
              {equipmentTotals.monitors}
            </p>
            <p className="text-sm text-gray-600 font-medium">Monitors</p>
          </div>
          <div className="text-center p-4 bg-purple-50 rounded-lg border border-purple-200 hover:shadow-sm transition-shadow">
            <Projector className="mx-auto text-purple-500 mb-3" size={32} />
            <p className="text-2xl font-bold text-gray-900">
              {equipmentTotals.projectors}
            </p>
            <p className="text-sm text-gray-600 font-medium">Projectors</p>
          </div>
          <div className="text-center p-4 bg-yellow-50 rounded-lg border border-yellow-200 hover:shadow-sm transition-shadow">
            <Zap className="mx-auto text-yellow-500 mb-3" size={32} />
            <p className="text-2xl font-bold text-gray-900">
              {equipmentTotals.switchBoards}
            </p>
            <p className="text-sm text-gray-600 font-medium">Switch Boards</p>
          </div>
          <div className="text-center p-4 bg-green-50 rounded-lg border border-green-200 hover:shadow-sm transition-shadow">
            <Fan className="mx-auto text-green-500 mb-3" size={32} />
            <p className="text-2xl font-bold text-gray-900">
              {equipmentTotals.fans}
            </p>
            <p className="text-sm text-gray-600 font-medium">Fans</p>
          </div>
          <div className="text-center p-4 bg-indigo-50 rounded-lg border border-indigo-200 hover:shadow-sm transition-shadow">
            <Wifi className="mx-auto text-indigo-500 mb-3" size={32} />
            <p className="text-2xl font-bold text-gray-900">
              {equipmentTotals.wifi}
            </p>
            <p className="text-sm text-gray-600 font-medium">WiFi Points</p>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="text-center">
            <p className="text-lg font-semibold text-gray-900">
              Total Equipment: {equipmentTotals.totalDevices} devices across{" "}
              {equipmentTotals.totalLabs} labs
            </p>
            <p className="text-sm text-gray-500 mt-1">
              Data synchronized with laboratory inventory system
            </p>
          </div>
        </div>
      </div>

      {/* Recent Reports Section */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 flex items-center">
            <FileText className="mr-2 text-blue-600" size={20} />
            Recent Reports
          </h3>
          <div className="flex items-center space-x-2 text-sm text-gray-500">
            <RefreshCw
              className={`w-4 h-4 ${refreshing ? "animate-spin" : ""}`}
            />
            <span>Auto-refreshes every 30s</span>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {reportsData.map((report) => (
            <div
              key={report.id}
              className="border border-gray-200 rounded-lg p-4 hover:shadow-sm transition-all duration-200 hover:border-gray-300"
            >
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 text-sm mb-2">
                    {report.complaint_details
                      ? report.complaint_details.length > 60
                        ? `${report.complaint_details.substring(0, 60)}...`
                        : report.complaint_details
                      : `Report #${report.id}`}
                  </h4>
                  <div className="flex items-center space-x-2">
                    {getReportStatusIcon(report.adminApprovalStatus)}
                    <span
                      className={`inline-flex px-2 py-1 text-xs font-medium rounded-full capitalize border ${getReportStatusColor(
                        report.adminApprovalStatus
                      )}`}
                    >
                      {report.adminApprovalStatus}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center text-xs text-gray-500">
                  <Users className="w-3 h-3 mr-2" />
                  <span>
                    By:{" "}
                    {report.assistant_name ||
                      report.lab_assistant ||
                      "Assistant"}
                  </span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Building className="w-3 h-3 mr-2" />
                  <span>Dept: {report.department || "N/A"}</span>
                </div>
                <div className="flex items-center text-xs text-gray-500">
                  <Calendar className="w-3 h-3 mr-2" />
                  <span>
                    Processed: {formatDate(report.created_at || report.date)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between mt-4 pt-3 border-t border-gray-100">
                <span className="text-xs text-gray-500">
                  Report ID: {report.id}
                </span>
              </div>
            </div>
          ))}
        </div>

        {reportsData.length === 0 && (
          <div className="text-center text-gray-500 py-8">
            <FileText className="w-8 h-8 mx-auto mb-2 text-gray-400" />
            <p className="text-sm">No recent reports available</p>
            <p className="text-xs text-gray-400 mt-1">
              Processed reports will appear here as they are completed
            </p>
          </div>
        )}

        {reportsData.length > 0 && (
          <div className="mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center text-sm">
              <span className="text-gray-600">
                Showing latest {reportsData.length} processed reports
              </span>
              <button
                onClick={() => navigate("/admindash/reports")}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                View All Reports →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Overview;
