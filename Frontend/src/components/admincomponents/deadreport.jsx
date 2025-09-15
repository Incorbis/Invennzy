import React, { useState, useEffect } from 'react';
import { Search, Download, FileText, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw, Check, X } from 'lucide-react';

const EquipmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [processingIds, setProcessingIds] = useState(new Set());
  const [modalOpen, setModalOpen] = useState(false);
  const [modalData, setModalData] = useState(null);

  // Normalize status strings for consistent comparison
  const normalizeStatus = (status) => {
    if (!status) return 'pending';
    return status.toString().toLowerCase().trim();
  };

  // Fetch grouped deadstock reports from backend
  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const response = await fetch('/api/fetch/deadstock');
      
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      
      const data = await response.json();
      
      // Transform the grouped data for summary display only
      const transformedData = [];
      Object.keys(data).forEach(deadstockId => {
        const group = data[deadstockId];
        if (group && group.length > 0) {
          // Calculate group total
          const totalItems = group.length;
          const totalValue = group.reduce((sum, item) => sum + (parseFloat(item.cost) || 0), 0);
          const status = group[0].status || 'Pending';
          const registeredBy = group[0].registered_by || 'Unknown';
          const createdAt = group[0].date_submitted;

          transformedData.push({
            deadstock_id: deadstockId,
            totalItems,
            totalValue,
            status: status, // Keep original status format
            registeredBy: group[0].assistant_name || 'Unknown',
            date: createdAt
              ? new Date(createdAt).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric'
                })
              : 'N/A',
            category: group[0].category || 'Equipment',
            purchase_year: group[0].purchase_year
          });
        }
      });
      
      setEquipmentData(transformedData);
    } catch (err) {
      console.error('Error fetching equipment data:', err);
      if (err.name === 'TypeError') {
        setError('Network Error: Unable to connect to server. Please check your connection.');
      } else {
        setError(`Error: ${err.message}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Download detailed report for specific deadstock ID
  const handleDownload = async (deadstockId) => {
    try {
      setDownloadingIds(prev => new Set([...prev, deadstockId]));

      const response = await fetch(`/api/download/deadstock-report/${deadstockId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileName = `Deadstock_Report_${deadstockId}.pdf`;

      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download report. Please try again.');
    } finally {
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(deadstockId);
        return newSet;
      });
    }
  };

  // Handle status update
  const handleStatusUpdate = async (deadstockId, newStatus) => {
    try {
      setProcessingIds(prev => new Set([...prev, deadstockId]));

      const response = await fetch(`/api/update/deadstock-status/${deadstockId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error(`Failed to update status: ${response.statusText}`);
      }

      // Update local state
      setEquipmentData(prev =>
        prev.map(item =>
          item.deadstock_id === deadstockId
            ? { ...item, status: newStatus }
            : item
        )
      );

      // Close modal
      setModalOpen(false);
      setModalData(null);

    } catch (err) {
      console.error("Status update failed:", err);
      alert("Failed to update status. Please try again.");
    } finally {
      setProcessingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(deadstockId);
        return newSet;
      });
    }
  };

  // Open confirmation modal
  const openConfirmationModal = (deadstockId, action, registeredBy) => {
    setModalData({
      deadstockId,
      action,
      registeredBy
    });
    setModalOpen(true);
  };

  // Close modal
  const closeModal = () => {
    setModalOpen(false);
    setModalData(null);
  };

  // Confirm action
  const confirmAction = () => {
    if (modalData) {
      const newStatus = modalData.action === 'approve' ? 'Approved' : 'Rejected';
      handleStatusUpdate(modalData.deadstockId, newStatus);
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEquipmentData();
  
    const interval = setInterval(() => {
      fetchEquipmentData();
    }, 10000); // every 10s
  
    return () => clearInterval(interval);
  }, []);

  // Calculate summary statistics with normalized status comparison
  const totalReports = equipmentData.length;
  const approvedReports = equipmentData.filter(item => normalizeStatus(item.status) === 'approved').length;
  const rejectedReports = equipmentData.filter(item => normalizeStatus(item.status) === 'rejected').length;
  const pendingReports = equipmentData.filter(item => normalizeStatus(item.status) === 'pending').length;

  // Filter data based on search and status
  const filteredData = equipmentData.filter(item => {
    const matchesSearch = item.deadstock_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.registeredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.category.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Normalize status comparison for filtering as well
    const matchesStatus = statusFilter === 'All Statuses' || 
                         normalizeStatus(item.status) === normalizeStatus(statusFilter);
    return matchesSearch && matchesStatus;
  });

  // Fixed getStatusColor function with proper case matching
  const getStatusColor = (status) => {
    const normalizedStatus = normalizeStatus(status);
    switch (normalizedStatus) {
      case 'approved':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'rejected':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = () => {
    fetchEquipmentData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading deadstock reports...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <p className="text-gray-600 mb-4">{error}</p>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Dead Stock Reports</h1>
            <p className="text-gray-600">View and download your deadstock reports</p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Reports</p>
                <p className="text-3xl font-bold text-gray-900">{totalReports}</p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Approved Reports</p>
                <p className="text-3xl font-bold text-green-600">{approvedReports}</p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Rejected Reports</p>
                <p className="text-3xl font-bold text-red-600">{rejectedReports}</p>
              </div>
              <div className="h-12 w-12 bg-red-100 rounded-lg flex items-center justify-center">
                <XCircle className="h-6 w-6 text-red-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Pending Reports</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingReports}</p>
              </div>
              <div className="h-12 w-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Clock className="h-6 w-6 text-yellow-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search and Filter Section */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search deadstock ID, registered by, or category..."
                className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4">
              <select
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                <option>All Statuses</option>
                <option>Approved</option>
                <option>Pending</option>
                <option>Rejected</option>
              </select>
            </div>
          </div>
        </div>

        {/* Reports Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadstock ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Total Value
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr key={item.deadstock_id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.deadstock_id}</div>
                      <div className="text-sm text-gray-500">{item.category} • {item.purchase_year}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.registeredBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.totalItems} items
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      ₹{item.totalValue.toLocaleString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {normalizeStatus(item.status) === 'pending' ? (
                        <div className="flex gap-2">
                          <button
                            onClick={() => openConfirmationModal(item.deadstock_id, 'approve', item.registeredBy)}
                            disabled={processingIds.has(item.deadstock_id)}
                            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                              processingIds.has(item.deadstock_id)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-green-100 text-green-800 hover:bg-green-200'
                            }`}
                          >
                            <Check className="h-3 w-3 mr-1" />
                            Approve
                          </button>
                          <button
                            onClick={() => openConfirmationModal(item.deadstock_id, 'reject', item.registeredBy)}
                            disabled={processingIds.has(item.deadstock_id)}
                            className={`inline-flex items-center px-3 py-1 text-xs font-medium rounded-full transition-colors ${
                              processingIds.has(item.deadstock_id)
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-red-100 text-red-800 hover:bg-red-200'
                            }`}
                          >
                            <X className="h-3 w-3 mr-1" />
                            Reject
                          </button>
                        </div>
                      ) : (
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                          {item.status}
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button 
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          downloadingIds.has(item.deadstock_id)
                            ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                            : 'bg-blue-600 text-white hover:bg-blue-700'
                        }`}
                        title="Download Detailed Report"
                        onClick={() => handleDownload(item.deadstock_id)}
                        disabled={downloadingIds.has(item.deadstock_id)}
                      >
                        {downloadingIds.has(item.deadstock_id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        {downloadingIds.has(item.deadstock_id) ? 'Downloading...' : 'Download PDF'}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td colSpan="7" className="px-6 py-12 text-center text-gray-500">
                      No deadstock reports found
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table Footer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {filteredData.length} of {totalReports} deadstock reports
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString()}
            </div>
          </div>
        </div>

        {/* Confirmation Modal */}
        {modalOpen && modalData && (
          <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 border border-gray-300 shadow-lg">
              <div className="flex items-center mb-4">
                {modalData.action === 'approve' ? (
                  <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mr-4">
                    <Check className="h-6 w-6 text-green-600" />
                  </div>
                ) : (
                  <div className="h-12 w-12 bg-red-100 rounded-full flex items-center justify-center mr-4">
                    <X className="h-6 w-6 text-red-600" />
                  </div>
                )}
                <div>
                  <h3 className="text-lg font-medium text-gray-900">
                    {modalData.action === 'approve' ? 'Approve Report' : 'Reject Report'}
                  </h3>
                  <p className="text-sm text-gray-500">This action cannot be undone</p>
                </div>
              </div>
              
              <div className="mb-6">
                <p className="text-sm text-gray-700 mb-2">
                  Are you sure you want to <strong>{modalData.action}</strong> the deadstock report?
                </p>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-sm">
                    <p><strong>Deadstock ID:</strong> {modalData.deadstockId}</p>
                    <p><strong>Registered By:</strong> {modalData.registeredBy}</p>
                  </div>
                </div>
              </div>

              <div className="flex gap-3 justify-end">
                <button
                  onClick={closeModal}
                  disabled={processingIds.has(modalData.deadstockId)}
                  className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmAction}
                  disabled={processingIds.has(modalData.deadstockId)}
                  className={`px-4 py-2 text-sm font-medium text-white rounded-lg transition-colors disabled:opacity-50 ${
                    modalData.action === 'approve'
                      ? 'bg-green-600 hover:bg-green-700'
                      : 'bg-red-600 hover:bg-red-700'
                  }`}
                >
                  {processingIds.has(modalData.deadstockId) ? (
                    <div className="flex items-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Processing...
                    </div>
                  ) : (
                    `Yes, ${modalData.action === 'approve' ? 'Approve' : 'Reject'}`
                  )}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDashboard;