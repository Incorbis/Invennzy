import React, { useState, useEffect, useMemo } from "react";
import {
  Search,
  Download,
  FileText,
  RefreshCw,
  AlertCircle,
} from "lucide-react";

const EquipmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloading, setDownloading] = useState(false);
  const [staffId, setStaffId] = useState(
    parseInt(localStorage.getItem("staffId"))
  );
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Fetch data for the current staff ID
      const response = await fetch(`/api/fetch/deadstock?staffId=${staffId}`);
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform data for display with exact column mapping
      const transformedData = data.map((item, index) => ({
        sr_no: index + 1,
        po_no: item.po_no || "N/A",
        purchase_year: item.purchase_year || "N/A",
        equipment_name: item.equipment_name || "N/A",
        ds_no: item.ds_number || "N/A",
        quantity: item.quantity || 0,
        unit: "Nos",
        rate: parseFloat(item.subtotal_excl_gst) / parseInt(item.quantity) || 0,
        gst_percentage: parseFloat(item.gst_rate) || 0,
        cost: parseFloat(item.total_incl_gst) || parseFloat(item.cost) || 0,
        remark: item.remark || "N/A",
        id: item.id,
        deadstock_id: item.deadstock_id,
        date_submitted: item.date_submitted,
        name: item.name,
        staff_id: item.staff_id,
      }));

      setEquipmentData(transformedData);
    } catch (err) {
      console.error("Error fetching equipment data:", err);
      setError(
        err.name === "TypeError"
          ? "Network Error: Unable to connect to server. Please check your connection."
          : `Error: ${err.message}`
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadAll = async () => {
    try {
      setDownloading(true);
      const staffId = localStorage.getItem("staffId");
      const response = await fetch(
        `/api/download/deadstock-full-report?staffId=${staffId}`,
        {
          method: "GET",
          headers: {
            Accept: "application/pdf",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Failed to download report: ${response.statusText}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileName = `Deadstock_Full_Report_${staffId}_${new Date()
        .toISOString()
        .slice(0, 10)}.pdf`;

      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report. Please try again.");
    } finally {
      setDownloading(false);
    }
  };

  const handleRefresh = () => {
    fetchEquipmentData();
  };

  useEffect(() => {
    fetchEquipmentData();
    const interval = setInterval(fetchEquipmentData, 60000);
    return () => clearInterval(interval);
  }, [staffId]);

  const summaryStats = useMemo(() => {
    const totalReports = equipmentData.length;
    const totalItems = equipmentData.reduce(
      (sum, item) => sum + item.quantity,
      0
    );
    const totalCost = equipmentData.reduce((sum, item) => sum + item.cost, 0);
    return { totalReports, totalItems, totalCost };
  }, [equipmentData]);

  const filteredData = useMemo(() => {
    return equipmentData.filter(
      (item) =>
        item.sr_no.toString().includes(searchTerm) ||
        item.po_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.purchase_year.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipment_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ds_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.remark.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.deadstock_id.toString().includes(searchTerm) ||
        item.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [equipmentData, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

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
        <div className="mb-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dead Stock Reports
            </h1>
            <p className="text-gray-600">
              View and download your deadstock reports
            </p>
          </div>
          <div className="flex gap-4">
            <button
              onClick={handleRefresh}
              className="bg-white text-blue-600 border border-blue-600 px-4 py-2 rounded-lg hover:bg-blue-50 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh Data
            </button>
            <button
              onClick={handleDownloadAll}
              disabled={downloading}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                downloading
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-blue-600 text-white hover:bg-blue-700"
              }`}
            >
              {downloading ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Downloading...
                </>
              ) : (
                <>
                  <Download className="h-4 w-4" />
                  Download Full Report
                </>
              )}
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">
                  Total Reports
                </p>
                <p className="text-3xl font-bold text-gray-900">
                  {summaryStats.totalReports}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Items</p>
                <p className="text-3xl font-bold text-gray-900">
                  {summaryStats.totalItems}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Cost</p>
                <p className="text-3xl font-bold text-gray-900">
                  ₹{summaryStats.totalCost.toLocaleString("en-IN")}
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <FileText className="h-6 w-6 text-blue-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by any field..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        {/* Data Table with exact column headers */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr.No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Purchase Year
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment Name
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    DS No
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Rate (Rs)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    GST (%)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost (Rs)
                  </th>
                  <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remark
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => (
                  <tr
                    key={`${item.id}-${item.sr_no}`}
                    className="hover:bg-gray-50"
                  >
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.sr_no}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.po_no}
                      <div className="text-xs text-gray-500">
                        {item.date_submitted
                          ? new Date(item.date_submitted).toLocaleDateString(
                              "en-IN",
                              {
                                day: "2-digit",
                                month: "short",
                                year: "numeric",
                              }
                            )
                          : ""}
                      </div>
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.purchase_year}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.equipment_name}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.ds_no}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.quantity}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.rate.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.gst_percentage}%
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      ₹{item.cost.toFixed(2)}
                    </td>
                    <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                      {item.remark}
                    </td>
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan="11"
                      className="px-4 py-12 text-center text-gray-500"
                    >
                      {searchTerm ? (
                        <>
                          <p>No deadstock reports match your search</p>
                          <p className="mt-2 text-sm">
                            Try adjusting your search criteria
                          </p>
                        </>
                      ) : (
                        "No deadstock reports found"
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <div className="text-sm text-gray-700">
              Showing {paginatedData.length} of {filteredData.length} reports
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === 1
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Previous
              </button>
              {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                let page = 1;
                if (totalPages <= 5) {
                  page = i + 1;
                } else if (currentPage <= 3) {
                  page = i + 1;
                } else if (currentPage >= totalPages - 2) {
                  page = totalPages - 4 + i;
                } else {
                  page = currentPage - 2 + i;
                }
                return page <= totalPages ? (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-3 py-1 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-white border border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {page}
                  </button>
                ) : null;
              })}
              <button
                onClick={() =>
                  setCurrentPage((p) => Math.min(totalPages, p + 1))
                }
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded-lg ${
                  currentPage === totalPages
                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                    : "bg-white border border-gray-300 hover:bg-gray-50"
                }`}
              >
                Next
              </button>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="text-xs text-gray-500">
              Last updated:{" "}
              {new Date().toLocaleString("en-IN", {
                day: "numeric",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDashboard;
