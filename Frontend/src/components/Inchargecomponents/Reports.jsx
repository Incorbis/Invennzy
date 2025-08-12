import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BarChart3,
  FileText,
  Clock,
  CheckCircle,
  AlertTriangle,
  Calendar,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Reports = () => {
  const [reports, setReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
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

  const getTypeIcon = (type) => {
    switch (type) {
      case "query":
        return FileText;
      case "maintenance":
        return Clock;
      case "audit":
        return CheckCircle;
      case "issue":
        return AlertTriangle;
      default:
        return FileText;
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const filteredReports = reports
    .filter(
      (report) =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.description.toLowerCase().includes(searchQuery.toLowerCase())
    )
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

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Search Reports
          </h3>
        </div>
        <div>
          <input
            type="text"
            placeholder="Search reports..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Query History
              </h3>
              <p className="text-gray-600 mt-1">
                Track all reports and their resolution status
              </p>
            </div>
            <p className="text-sm text-gray-600">
              Showing {filteredReports.length} of {totalReports} reports
            </p>
          </div>
        </div>
        <div className="divide-y divide-gray-200">
          {filteredReports.length === 0 ? (
            <div className="p-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                No reports found
              </h3>
              <p className="text-gray-600">Try adjusting your search query.</p>
            </div>
          ) : (
            filteredReports.map((report) => {
              const TypeIcon = getTypeIcon(report.type);
              return (
                <div
                  key={report.id}
                  className="p-6 hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-start space-x-4">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <TypeIcon className="w-5 h-5 text-gray-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center space-x-3 mb-2">
                            <h4 className="text-lg font-semibold text-gray-900">
                              {report.title}
                            </h4>
                            <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                                report.status
                              )}`}
                            >
                              {report.status.charAt(0).toUpperCase() +
                                report.status.slice(1).replace("-", " ")}
                            </span>
                          </div>
                          <p className="text-gray-600 mb-3">
                            {report.description}
                          </p>
                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <div className="flex items-center space-x-1">
                              <Calendar className="w-4 h-4" />
                              <span>
                                Created: {formatDate(report.createdAt)}
                              </span>
                            </div>
                            {report.resolvedAt && (
                              <span>
                                Resolved: {formatDate(report.resolvedAt)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2 ml-4">
                          <button
                            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                            onClick={() =>
                              navigate(`/labinchargedash/requests/${report.id}`)
                            }
                          >
                            Check Status
                          </button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default Reports;
