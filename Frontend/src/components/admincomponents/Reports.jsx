import React, { useState, useEffect } from 'react';
import { 
  FileText, 
  Download, 
  Filter, 
  Search, 
  Eye, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users, 
  Calendar,
  RefreshCw,
  User,
  Building,
  Wrench,
  ChevronDown,
  X
} from 'lucide-react';

const ReportsPage = () => {
  const [reports, setReports] = useState([]);
  const [filteredReports, setFilteredReports] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [priorityFilter, setPriorityFilter] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const [filterDropdownOpen, setFilterDropdownOpen] = useState(false);

  // Mock data - replace with actual API calls
  const mockReports = [
    {
      id: 'RPT-2025-001',
      title: 'Network Equipment Malfunction',
      description: 'Router in Lab A is not providing internet connectivity to workstations.',
      submittedBy: 'Dr. Sarah Johnson',
      role: 'Lab Incharge',
      department: 'Computer Science',
      lab: 'Computer Lab A',
      priority: 'high',
      status: 'pending',
      dateSubmitted: '2025-01-15T09:30:00Z',
      lastUpdated: '2025-01-15T09:30:00Z',
      assignedTo: 'Mike Chen',
      assignedRole: 'Lab Assistant',
      equipment: 'Cisco Router WRT3200',
      issueCategory: 'Network',
      expectedResolution: '2025-01-16T17:00:00Z',
      attachments: ['network-diagram.pdf', 'error-log.txt']
    },
    {
      id: 'RPT-2025-002',
      title: 'Microscope Calibration Issue',
      description: 'Microscope Model XYZ-500 requires calibration. Focus mechanism is not working properly.',
      submittedBy: 'Prof. Michael Brown',
      role: 'Lab Incharge',
      department: 'Biology',
      lab: 'Biology Lab B',
      priority: 'medium',
      status: 'in_progress',
      dateSubmitted: '2025-01-14T14:20:00Z',
      lastUpdated: '2025-01-15T10:45:00Z',
      assignedTo: 'Admin',
      assignedRole: 'System Administrator',
      equipment: 'Microscope XYZ-500',
      issueCategory: 'Equipment',
      expectedResolution: '2025-01-18T16:00:00Z',
      attachments: ['microscope-manual.pdf']
    },
    {
      id: 'RPT-2025-003',
      title: 'Chemical Fume Hood Ventilation',
      description: 'Fume hood ventilation system is making unusual noise and airflow seems reduced.',
      submittedBy: 'Dr. Emily Davis',
      role: 'Lab Incharge',
      department: 'Chemistry',
      lab: 'Chemistry Lab C',
      priority: 'high',
      status: 'completed',
      dateSubmitted: '2025-01-13T11:15:00Z',
      lastUpdated: '2025-01-15T16:30:00Z',
      assignedTo: 'John Smith',
      assignedRole: 'Lab Assistant',
      equipment: 'Fume Hood FH-200',
      issueCategory: 'Safety Equipment',
      expectedResolution: '2025-01-15T17:00:00Z',
      attachments: ['safety-report.pdf', 'ventilation-specs.pdf']
    },
    {
      id: 'RPT-2025-004',
      title: 'Projector Display Issues',
      description: 'Classroom projector is showing distorted colors and flickering intermittently.',
      submittedBy: 'Prof. Robert Wilson',
      role: 'Lab Incharge',
      department: 'Physics',
      lab: 'Physics Lab D',
      priority: 'low',
      status: 'pending',
      dateSubmitted: '2025-01-15T16:45:00Z',
      lastUpdated: '2025-01-15T16:45:00Z',
      assignedTo: 'Lisa Wang',
      assignedRole: 'Lab Assistant',
      equipment: 'Epson PowerLite 5050',
      issueCategory: 'Audio/Visual',
      expectedResolution: '2025-01-17T15:00:00Z',
      attachments: ['projector-image.jpg']
    },
    {
      id: 'RPT-2025-005',
      title: 'Spectrometer Software Update',
      description: 'Mass spectrometer requires software update and recalibration after recent maintenance.',
      submittedBy: 'Dr. Amanda Lee',
      role: 'Lab Assistant',
      department: 'Chemistry',
      lab: 'Advanced Chemistry Lab',
      priority: 'medium',
      status: 'escalated',
      dateSubmitted: '2025-01-12T08:30:00Z',
      lastUpdated: '2025-01-15T12:20:00Z',
      assignedTo: 'Admin',
      assignedRole: 'System Administrator',
      equipment: 'Mass Spectrometer MS-400',
      issueCategory: 'Software',
      expectedResolution: '2025-01-19T14:00:00Z',
      attachments: ['software-requirements.pdf', 'calibration-log.xlsx']
    }
  ];

  useEffect(() => {
    // Simulate API call
    const timer = setTimeout(() => {
      setReports(mockReports);
      setFilteredReports(mockReports);
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    let filtered = reports;

    // Search filter
    if (searchQuery) {
      filtered = filtered.filter(report =>
        report.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.submittedBy.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.department.toLowerCase().includes(searchQuery.toLowerCase()) ||
        report.equipment.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    // Status filter
    if (statusFilter !== 'all') {
      filtered = filtered.filter(report => report.status === statusFilter);
    }

    // Priority filter
    if (priorityFilter !== 'all') {
      filtered = filtered.filter(report => report.priority === priorityFilter);
    }

    setFilteredReports(filtered);
  }, [searchQuery, statusFilter, priorityFilter, reports]);

  const getStatusColor = (status) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-200',
      completed: 'bg-green-100 text-green-800 border-green-200',
      escalated: 'bg-red-100 text-red-800 border-red-200'
    };
    return colors[status] || 'bg-gray-100 text-gray-800 border-gray-200';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      high: 'text-red-600',
      medium: 'text-yellow-600',
      low: 'text-green-600'
    };
    return colors[priority] || 'text-gray-600';
  };

  const getStatusIcon = (status) => {
    const icons = {
      pending: Clock,
      in_progress: RefreshCw,
      completed: CheckCircle,
      escalated: AlertCircle
    };
    const Icon = icons[status] || Clock;
    return <Icon size={16} />;
  };

  const handleStatusChange = (reportId, newStatus) => {
    setReports(prevReports =>
      prevReports.map(report =>
        report.id === reportId
          ? { ...report, status: newStatus, lastUpdated: new Date().toISOString() }
          : report
      )
    );
    setShowModal(false);
  };

  const handleExportPDF = (report) => {
    // Simulate PDF generation and download
    const content = `
      Report ID: ${report.id}
      Title: ${report.title}
      Submitted By: ${report.submittedBy} (${report.role})
      Department: ${report.department}
      Lab: ${report.lab}
      Equipment: ${report.equipment}
      Priority: ${report.priority}
      Status: ${report.status}
      
      Description:
      ${report.description}
      
      Date Submitted: ${new Date(report.dateSubmitted).toLocaleString()}
      Last Updated: ${new Date(report.lastUpdated).toLocaleString()}
      Assigned To: ${report.assignedTo} (${report.assignedRole})
      Expected Resolution: ${new Date(report.expectedResolution).toLocaleString()}
    `;
    
    const blob = new Blob([content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${report.id}-report.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
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
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Issue Reports</h1>
        <p className="text-gray-600">Manage and track laboratory equipment and facility issues</p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
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
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-yellow-600">
                {reports.filter(r => r.status === 'pending').length}
              </p>
            </div>
            <Clock className="h-8 w-8 text-yellow-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">In Progress</p>
              <p className="text-2xl font-bold text-blue-600">
                {reports.filter(r => r.status === 'in_progress').length}
              </p>
            </div>
            <RefreshCw className="h-8 w-8 text-blue-600" />
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Completed</p>
              <p className="text-2xl font-bold text-green-600">
                {reports.filter(r => r.status === 'completed').length}
              </p>
            </div>
            <CheckCircle className="h-8 w-8 text-green-600" />
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
              placeholder="Search reports by title, submitter, department, or equipment..."
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
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
              <option value="escalated">Escalated</option>
            </select>
            <select
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="all">All Priority</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
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
                  Priority
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Date Submitted
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
                        <div className="text-sm font-medium text-gray-900">{report.title}</div>
                        <div className="text-sm text-gray-500">{report.id}</div>
                        <div className="text-xs text-gray-400">{report.lab} - {report.equipment}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <User size={16} className="text-gray-400 mr-2" />
                      <div>
                        <div className="text-sm font-medium text-gray-900">{report.submittedBy}</div>
                        <div className="text-sm text-gray-500">{report.role}</div>
                        <div className="text-xs text-gray-400">{report.department}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`text-sm font-medium capitalize ${getPriorityColor(report.priority)}`}>
                      {report.priority}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(report.status)}`}>
                      {getStatusIcon(report.status)}
                      <span className="ml-1 capitalize">{report.status.replace('_', ' ')}</span>
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar size={16} className="mr-1" />
                      {formatDate(report.dateSubmitted)}
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
                        title="Export PDF"
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
              {searchQuery || statusFilter !== 'all' || priorityFilter !== 'all'
                ? 'Try adjusting your search criteria.'
                : 'No reports have been submitted yet.'}
            </p>
          </div>
        )}
      </div>

      {/* Modal for Report Details */}
      {showModal && selectedReport && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
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
                      <span className="text-sm font-medium text-gray-600">Title:</span>
                      <p className="text-sm text-gray-900">{selectedReport.title}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Description:</span>
                      <p className="text-sm text-gray-900">{selectedReport.description}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Category:</span>
                      <p className="text-sm text-gray-900">{selectedReport.issueCategory}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Equipment Details</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Equipment:</span>
                      <p className="text-sm text-gray-900">{selectedReport.equipment}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Lab:</span>
                      <p className="text-sm text-gray-900">{selectedReport.lab}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Department:</span>
                      <p className="text-sm text-gray-900">{selectedReport.department}</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div className="space-y-6">
                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Assignment & Status</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Submitted By:</span>
                      <p className="text-sm text-gray-900">{selectedReport.submittedBy} ({selectedReport.role})</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Assigned To:</span>
                      <p className="text-sm text-gray-900">{selectedReport.assignedTo} ({selectedReport.assignedRole})</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Priority:</span>
                      <span className={`ml-2 text-sm font-medium capitalize ${getPriorityColor(selectedReport.priority)}`}>
                        {selectedReport.priority}
                      </span>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Current Status:</span>
                      <span className={`ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium border ${getStatusColor(selectedReport.status)}`}>
                        {getStatusIcon(selectedReport.status)}
                        <span className="ml-1 capitalize">{selectedReport.status.replace('_', ' ')}</span>
                      </span>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Timeline</h4>
                  <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                    <div>
                      <span className="text-sm font-medium text-gray-600">Date Submitted:</span>
                      <p className="text-sm text-gray-900">{formatDate(selectedReport.dateSubmitted)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Last Updated:</span>
                      <p className="text-sm text-gray-900">{formatDate(selectedReport.lastUpdated)}</p>
                    </div>
                    <div>
                      <span className="text-sm font-medium text-gray-600">Expected Resolution:</span>
                      <p className="text-sm text-gray-900">{formatDate(selectedReport.expectedResolution)}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h4 className="text-lg font-semibold text-gray-800 mb-3">Attachments</h4>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    {selectedReport.attachments.map((attachment, index) => (
                      <div key={index} className="flex items-center justify-between py-2">
                        <span className="text-sm text-gray-900">{attachment}</span>
                        <button className="text-blue-600 hover:text-blue-900 text-sm">
                          Download
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            {/* Status Update Section */}
            <div className="mt-8 p-4 bg-blue-50 rounded-lg">
              <h4 className="text-lg font-semibold text-gray-800 mb-4">Update Status</h4>
              <div className="flex flex-wrap gap-3">
                {['pending', 'in_progress', 'completed', 'escalated'].map((status) => (
                  <button
                    key={status}
                    onClick={() => handleStatusChange(selectedReport.id, status)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                      selectedReport.status === status
                        ? 'bg-blue-600 text-white'
                        : 'bg-white text-gray-700 hover:bg-gray-100 border border-gray-300'
                    }`}
                  >
                    {status.charAt(0).toUpperCase() + status.slice(1).replace('_', ' ')}
                  </button>
                ))}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="mt-6 flex justify-end space-x-3">
              <button
                onClick={() => handleExportPDF(selectedReport)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors flex items-center"
              >
                <Download size={16} className="mr-2" />
                Export PDF
              </button>
              <button
                onClick={() => setShowModal(false)}
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ReportsPage;