import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Eye,
  Search,
  Filter,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedMonth, setSelectedMonth] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const fetchReports = async () => {
      const storedStaffId = localStorage.getItem("staffId");
      if (!storedStaffId) {
        console.error("No staff_id found in localStorage");
        return;
      }
      try {
        const res = await axios.get(`/api/requests/lic/${storedStaffId}`);
        const data = res.data.map((item) => ({
          ...item,
          title: item.type_of_problem || "Untitled",
          description: item.complaint_details || "",
          type: "maintenance",
          status: getStatusFromSteps(item.current_step, item.completed_steps),
          priority: "medium",
          createdAt: item.date,
          createdBy: item.created_by || "Unknown",
          resolvedAt: item.maintenanceClosedDate || null,
          equipmentName: item.equipment_name || "N/A",
          equipmentId: item.equipment_id || "N/A",
        }));
        setReports(data);
      } catch (err) {
        console.error("Error fetching reports", err);
      }
    };
    fetchReports();
  }, []);

  const getStatusFromSteps = (currentStep, completedSteps) => {
    if (completedSteps >= 5) return "closed";
    if (completedSteps >= 4) return "resolved";
    if (completedSteps >= 2) return "in-progress";
    return "open";
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "open":
        return "text-blue-700 bg-blue-100";
      case "in-progress":
        return "text-yellow-700 bg-yellow-100";
      case "resolved":
        return "text-green-700 bg-green-100";
      case "closed":
        return "text-gray-700 bg-gray-100";
      default:
        return "text-gray-700 bg-gray-100";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "open":
        return AlertTriangle;
      case "in-progress":
        return Clock;
      case "resolved":
        return CheckCircle;
      case "closed":
        return CheckCircle;
      default:
        return FileText;
    }
  };

  const formatTimestamp = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
    });
  };

  const getMonthOptions = () => {
    const months = [
      { value: "", label: "All Months" },
      { value: "01", label: "January" },
      { value: "02", label: "February" },
      { value: "03", label: "March" },
      { value: "04", label: "April" },
      { value: "05", label: "May" },
      { value: "06", label: "June" },
      { value: "07", label: "July" },
      { value: "08", label: "August" },
      { value: "09", label: "September" },
      { value: "10", label: "October" },
      { value: "11", label: "November" },
      { value: "12", label: "December" },
    ];
    return months;
  };

  const filteredReports = reports
    .filter(
      (report) =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.equipmentName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.equipmentId.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((report) => {
      if (!selectedMonth) return true;
      const reportMonth = new Date(report.createdAt).getMonth() + 1;
      const formattedMonth = reportMonth.toString().padStart(2, "0");
      return formattedMonth === selectedMonth;
    })
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const totalReports = reports.length;
  const openReports = reports.filter((r) => r.status === "open").length;
  const inProgressReports = reports.filter(
    (r) => r.status === "in-progress"
  ).length;
  const resolvedReports = reports.filter((r) => r.status === "resolved").length;

  return (
    <div className="space-y-6 p-6">
      {/* Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-blue-100 rounded-lg">
              <BarChart3 className="w-6 h-6 text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{totalReports}</p>
              <p className="text-sm text-gray-600">Total Reports</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-red-100 rounded-lg">
              <AlertTriangle className="w-6 h-6 text-red-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">{openReports}</p>
              <p className="text-sm text-gray-600">Open</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-yellow-100 rounded-lg">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {inProgressReports}
              </p>
              <p className="text-sm text-gray-600">In Progress</p>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-green-100 rounded-lg">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-gray-900">
                {resolvedReports}
              </p>
              <p className="text-sm text-gray-600">Resolved</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar and Monthly Filter */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Search & Filter Reports
          </h3>
        </div>
        <div className="flex gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search reports..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="pl-10 pr-8 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-colors bg-white min-w-[180px]"
            >
              {getMonthOptions().map((month) => (
                <option key={month.value} value={month.value}>
                  {month.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Reports Overview
              </h3>
              <p className="text-gray-600 mt-1">
                Manage and track all maintenance reports
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredReports.length} of {totalReports} reports
            </p>
          </div>
        </div>

        {filteredReports.length === 0 ? (
          <div className="p-12 text-center">
            <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No reports found
            </h3>
            <p className="text-gray-600">Try adjusting your search query.</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr. No.
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Type of Problem
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment Details
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Timestamp
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Current Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredReports.map((report, index) => {
                  const StatusIcon = getStatusIcon(report.status);
                  return (
                    <tr
                      key={report.id}
                      className="hover:bg-gray-50 transition-colors"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                        {index + 1}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {report.title}
                        </div>
                        <div className="text-sm text-gray-500 max-w-xs truncate">
                          {report.description}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        <div className="text-sm font-medium text-gray-900">
                          {report.equipmentName}
                        </div>
                        <div className="text-sm text-gray-500">
                          ID: {report.equipmentId}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">
                          {formatTimestamp(report.createdAt)}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center space-x-2">
                          <StatusIcon className="w-4 h-4 text-gray-500" />
                          <span
                            className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                              report.status
                            )}`}
                          >
                            {report.status.charAt(0).toUpperCase() +
                              report.status.slice(1).replace("-", " ")}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <button
                          onClick={() =>
                            navigate(`/labinchargedash/requests/${report.id}`)
                          }
                          className="inline-flex items-center space-x-1 text-blue-600 hover:text-blue-900 transition-colors"
                        >
                          <Eye className="w-4 h-4" />
                          <span>View</span>
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Reports;
