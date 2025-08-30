import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Download, 
  Search, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Calendar,
  RefreshCw,
  User,
  Building,
  ChevronDown,
  X,
  XCircle
} from 'lucide-react';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  // Fetch reports from the same API endpoint as notifications
  useEffect(() => {
    const fetchReports = async () => {
      try {
        setLoading(true);
        const response = await axios.get('/api/admin/notifications');
        
        // Filter only approved or rejected reports (completed actions)
        const completedReports = response.data.filter(
          notification => notification.adminApprovalStatus === 'approved' || 
                        notification.adminApprovalStatus === 'rejected'
        );
        
        setReports(completedReports);
        setFilteredReports(completedReports);
      } catch (error) {
        console.error("Error fetching reports:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchReports();
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.complaint_details?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.department?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.assistant_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.id.toString().includes(searchQuery)
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.adminApprovalStatus === statusFilter);
    }

    setFilteredReports(filtered);
  }, [searchQuery, statusFilter, reports]);

  const getStatusColor = (status) => {
    const colors = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getStatusIcon = (status) => {
    const icons = {
      approved: CheckCircle,
      rejected: XCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon size={16} />;
  };

  const handleExportPDF = (report) => {
    const content = `
Report ID: ${report.id}
Assistant Name: ${report.assistant_name || 'N/A'}
Department: ${report.department || 'N/A'}
Status: ${report.adminApprovalStatus}

Complaint Details:
${report.complaint_details || 'N/A'}

Date Submitted: ${report.created_at ? new Date(report.created_at).toLocaleString() : 'N/A'}
Date Processed: ${report.updated_at ? new Date(report.updated_at).toLocaleString() : 'N/A'}

Additional Information:
${JSON.stringify(report, null, 2)}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `report-${report.id}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      
    });
  };

  if (loading) {
    return (
      <div className="p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-12 bg-gray-200 rounded"></div>
          {[...Array(5)].map((_, i) => (
            <div key={i} className="h-24 bg-gray-200 rounded"></div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Assistant Reports</h1>
        <p className="text-gray-600">View processed corrective actions submitted by assistants</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Total Reports</p>
              <p className="text-2xl font-bold text-gray-900">{reports.length}</p>
            </div>
            <FileText className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.adminApprovalStatus === 'approved').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-red-600">
                {reports.filter(r => r.adminApprovalStatus === 'rejected').length}
              </p>
            </div>
            <XCircle className="h-8 w-8 text-red-600" />
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 mb-6">
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between space-y-4 lg:space-y-0 lg:space-x-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search reports by ID, complaint details, department, or assistant name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
          <div className="flex space-x-3">
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>
        </div>
      </div>

      {/* Reports Table */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Report Details
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Submitter
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredReports.map((report) => (
                <tr key={report.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                          <FileText className="h-5 w-5 text-blue-600" />
                        </div>
                      </div>
                      <div className="ml-4">
                        <div className="text-sm font-medium text-gray-900">
                          {report.complaint_details ? 
                            (report.complaint_details.length > 50 ? 
                              `${report.complaint_details.substring(0, 50)}...` : 
                              report.complaint_details
                            ) : 'No details available'
                          }
                        </div>
                        <div className="text-sm text-gray-500">ID: {report.id}</div>
                        <div className="text-xs text-gray-400">Dept: {report.department || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">
                          {report.lab_assistant || 'Assistant'}
                        </div>
                        <div className="text-sm text-gray-500">Assistant</div>
                        <div className="text-xs text-gray-400">{report.department || 'N/A'}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.adminApprovalStatus)}`}>
                      {getStatusIcon(report.adminApprovalStatus)}
                      <span className="ml-1 capitalize">{report.adminApprovalStatus}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formatDate(report.date)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex space-x-2">
                      <button
                        onClick={() => {
                          setSelectedReport(report);
                          setShowModal(true);
                        }}
                        className="text-blue-600 hover:text-blue-900 p-1 rounded"
                        title="View Details"
                      >
                        <Eye size={16} />
                      </button>
                      <button
                        onClick={() => handleExportPDF(report)}
                        className="text-green-600 hover:text-green-900 p-1 rounded"
                        title="Export Report"
                      >
                        <Download size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredReports.length === 0 && (
          <div className="text-center py-12">
            <FileText className="mx-auto h-12 w-12 text-gray-400" />
            <h3 className="mt-2 text-sm font-medium text-gray-900">No reports found</h3>
            <p className="mt-1 text-sm text-gray-500">
              {searchQuery || statusFilter !== 'all'
                ? 'Try adjusting your search criteria.'
                : 'No processed reports available yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal for Report Details */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 backdrop-blur-sm overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-11/12 max-w-4xl shadow-lg rounded-md bg-white">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Report Details</h3>
              <button
                onClick={() => setShowModal(false)}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Left Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Report Information</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Report ID:</span>
                      <p className="text-sm text-gray-900">{selectedReport.id}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Complaint Details:</span>
                      <p className="text-sm text-gray-900">{selectedReport.complaint_details || 'N/A'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Department:</span>
                      <p className="text-sm text-gray-900">{selectedReport.department || 'N/A'}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Additional Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-2 text-sm text-gray-700">
                    {Object.entries(selectedReport).map(([key, value]) => {
                      if (['id', 'complaint_details', 'department', 'assistant_name', 'adminApprovalStatus', 'created_at', 'updated_at'].includes(key)) {
                        return null; // Skip already displayed fields
                      }
                      return (
                        <div key={key} className="border-b border-gray-100 pb-2">
                          <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                          <span>{value !== null ? value.toString() : "N/A"}</span>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Submission Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Submitted By:</span>
                      <p className="text-sm text-gray-900">{selectedReport.assistant_name || 'Assistant'}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Role:</span>
                      <p className="text-sm text-gray-900">Assistant</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Current Status:</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedReport.adminApprovalStatus)}`}>
                        {getStatusIcon(selectedReport.adminApprovalStatus)}
                        <span className="ml-1 capitalize">{selectedReport.adminApprovalStatus}</span>
                      </span>
                    </div>
                  </div>
                </div>
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Timeline</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Date Created:</span>
                      <p className="text-sm text-gray-900">{formatDate(selectedReport.created_at)}</p>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-600">Date Processed:</p>
                      <p className="text-sm text-gray-900">
                        {selectedReport.date ? selectedReport.date : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;