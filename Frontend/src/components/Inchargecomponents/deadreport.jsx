import React, { useState, useEffect, useMemo } from 'react';
import { Search, Download, FileText, CheckCircle, XCircle, Clock, AlertCircle, RefreshCw } from 'lucide-react';

const EquipmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All Statuses');
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  // Fetch grouped deadstock reports from backend
  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Using fetch instead of axios for React component compatibility
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
          const status = group[0].status || 'Pending'; // Assume all items in group have same status
          const registeredBy = group[0].registered_by || 'Unknown';
          const createdAt = group[0].date_submitted;

          transformedData.push({
            deadstock_id: deadstockId,
            totalItems,
            totalValue,
            status,
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
      // mark this row as downloading
      setDownloadingIds(prev => new Set([...prev, deadstockId]));

      // call backend API
      const response = await fetch(`/api/download/deadstock-report/${deadstockId}`, {
        method: 'GET',
        headers: {
          'Accept': 'application/pdf',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.statusText}`);
      }

      // convert response into a blob (PDF file)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Use meaningful filename
      const fileName = `Deadstock_Report_${deadstockId}.pdf`;

      // create a temporary <a> tag to trigger download
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(url);

    } catch (err) {
      console.error('Download failed:', err);
      alert('Failed to download report. Please try again.');
    } finally {
      // remove ID from "downloading" set
      setDownloadingIds(prev => {
        const newSet = new Set(prev);
        newSet.delete(deadstockId);
        return newSet;
      });
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

  // Memoized summary statistics that update when equipmentData changes
  const summaryStats = useMemo(() => {
    const totalReports = equipmentData.length;
    
    // Use case-insensitive comparison for status matching
    const approvedReports = equipmentData.filter(item => 
      item.status?.toLowerCase() === 'approved'
    ).length;
    
    const rejectedReports = equipmentData.filter(item => 
      item.status?.toLowerCase() === 'rejected'
    ).length;
    
    const pendingReports = equipmentData.filter(item => 
      item.status?.toLowerCase() === 'pending'
    ).length;

    return {
      totalReports,
      approvedReports,
      rejectedReports,
      pendingReports
    };
  }, [equipmentData]);

  // Filter data based on search and status
  const filteredData = useMemo(() => {
    return equipmentData.filter(item => {
      const matchesSearch = item.deadstock_id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.registeredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           item.category.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Use case-insensitive comparison for status filtering
      const matchesStatus = statusFilter === 'All Statuses' || 
                           item.status?.toLowerCase() === statusFilter.toLowerCase();
      
      return matchesSearch && matchesStatus;
    });
  }, [equipmentData, searchTerm, statusFilter]);

  const getStatusColor = (status) => {
    switch (status?.toLowerCase()) {
      case 'approved':
        return 'bg-green-100 text-green-800 border border-green-200';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border border-yellow-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border border-red-200';
      default:
        return 'bg-gray-100 text-gray-800 border border-gray-200';
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
                <p className="text-3xl font-bold text-gray-900">{summaryStats.totalReports}</p>
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
                <p className="text-3xl font-bold text-green-600">{summaryStats.approvedReports}</p>
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
                <p className="text-3xl font-bold text-red-600">{summaryStats.rejectedReports}</p>
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
                <p className="text-3xl font-bold text-yellow-600">{summaryStats.pendingReports}</p>
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
                  <tr key={item.deadstock_id} className="hover:bg-gray-50 transition-colors">
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
                      ₹{item.totalValue.toLocaleString('en-IN')}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                        {item.status}
                      </span>
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
                      {searchTerm || statusFilter !== 'All Statuses' ? (
                        <div className="mt-2 text-sm">
                          Try adjusting your search or filter criteria
                        </div>
                      ) : null}
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
              Showing {filteredData.length} of {summaryStats.totalReports} deadstock reports
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString('en-IN')}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDashboard;