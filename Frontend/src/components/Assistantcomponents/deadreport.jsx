import React, { useState, useEffect, useMemo } from "react";
import { Search, Download, FileText, RefreshCw } from "lucide-react";

const EquipmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/fetch/deadstock");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();

      // Group items by deadstock_id
      const groupedData = {};
      data.forEach((item) => {
        if (!groupedData[item.deadstock_id]) {
          groupedData[item.deadstock_id] = [];
        }
        groupedData[item.deadstock_id].push(item);
      });

      const transformedData = [];
      Object.entries(groupedData).forEach(([deadstockId, items]) => {
        // Calculate totals for this deadstock group
        const totalValue = items.reduce(
          (sum, item) => sum + (parseFloat(item.cost) || 0),
          0
        );
        const totalQuantity = items.reduce(
          (sum, item) => sum + (parseInt(item.quantity) || 0),
          0
        );

        // Use data from first item for common fields
        const firstItem = items[0];
        const poNumbers = items.map((item) => item.po_no).join(", ");
        const equipmentNames = [
          ...new Set(items.map((item) => item.equipment_name)),
        ].join(", ");

        transformedData.push({
          deadstock_id: parseInt(deadstockId),
          totalItems: items.length,
          totalValue,
          po_no: poNumbers,
          quantity: totalQuantity,
          remark: firstItem.remark || "N/A",
          equipmentName: equipmentNames || "N/A",
          registeredBy: firstItem.name || "Unknown",
          date: firstItem.date_submitted
            ? new Date(firstItem.date_submitted).toLocaleDateString("en-IN", {
                year: "numeric",
                month: "short",
                day: "numeric",
              })
            : "N/A",
          category: firstItem.category || "Equipment",
          purchase_year: firstItem.purchase_year,
          ds_number: firstItem.ds_number,
        });
      });

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

  // Download detailed report for specific deadstock ID
  const handleDownload = async (
    deadstockId,
    { subtotalExclGst, gstAmount, totalInclGst }
  ) => {
    try {
      // mark this row as downloading
      setDownloadingIds((prev) => new Set([...prev, deadstockId]));

      // call backend API
      const response = await fetch(
        `/api/download/deadstock-report/${deadstockId}`,
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

      // convert response into a blob (PDF file)
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);

      // Use descriptive filename with GST info if available
      const fileName =
        subtotalExclGst && gstAmount && totalInclGst
          ? `Deadstock_Report_${deadstockId}_Total-${totalInclGst}.pdf`
          : `Deadstock_Report_${deadstockId}.pdf`;

      // create a temporary <a> tag to trigger download
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", fileName);
      document.body.appendChild(link);
      link.click();

      // cleanup
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Download failed:", err);
      alert("Failed to download report. Please try again.");
    } finally {
      // remove ID from "downloading" set
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(deadstockId);
        return newSet;
      });
    }
  };

  // Fetch data on component mount
  useEffect(() => {
    fetchEquipmentData();
  }, []);

  // Memoized summary statistics that update when equipmentData changes
  const summaryStats = useMemo(() => {
    const totalReports = equipmentData.length;

    return {
      totalReports,
    };
  }, [equipmentData]);

  const filteredData = useMemo(() => {
    return equipmentData.filter((item) => {
      const matchesSearch =
        String(item.deadstock_id)
          .toLowerCase()
          .includes(searchTerm.toLowerCase()) ||
        item.registeredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesSearch;
    });
  }, [equipmentData, searchTerm]);

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
          <div className="h-12 w-12 text-red-500 mx-auto mb-4 flex items-center justify-center">
            <svg
              className="w-full h-full"
              fill="currentColor"
              viewBox="0 0 20 20"
            >
              <path
                fillRule="evenodd"
                d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                clipRule="evenodd"
              />
            </svg>
          </div>
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
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              Dead Stock Reports
            </h1>
            <p className="text-gray-600">
              View and download your deadstock reports
            </p>
          </div>
          <button
            onClick={handleRefresh}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <RefreshCw className="h-4 w-4" />
            Refresh Data
          </button>
        </div>

        {/* Summary Card */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
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
        </div>

        {/* Search Section */}
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
                    Action
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredData.map((item) => (
                  <tr
                    key={item.deadstock_id}
                    className="hover:bg-gray-50 transition-colors"
                  >
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">
                        {item.deadstock_id}
                      </div>
                      <div className="text-sm text-gray-500">
                        {item.category} • {item.purchase_year}
                      </div>
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
                      ₹{item.totalValue.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      <button
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          downloadingIds.has(item.deadstock_id)
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
                        }`}
                        title="Download Detailed Report"
                        onClick={() =>
                          handleDownload(item.deadstock_id, {
                            subtotalExclGst: item.subtotalExclGst,
                            gstAmount: item.gstAmount,
                            totalInclGst: item.totalInclGst,
                          })
                        }
                        disabled={downloadingIds.has(item.deadstock_id)}
                      >
                        {downloadingIds.has(item.deadstock_id) ? (
                          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400 mr-2"></div>
                        ) : (
                          <Download className="h-4 w-4 mr-2" />
                        )}
                        {downloadingIds.has(item.deadstock_id)
                          ? "Downloading..."
                          : "Download PDF"}
                      </button>
                    </td>
                  </tr>
                ))}
                {filteredData.length === 0 && (
                  <tr>
                    <td
                      colSpan="6"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No deadstock reports found
                      {searchTerm ? (
                        <div className="mt-2 text-sm">
                          Try adjusting your search criteria
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
              Showing {filteredData.length} of {summaryStats.totalReports}{" "}
              deadstock reports
            </div>
            <div className="text-xs text-gray-500">
              Last updated: {new Date().toLocaleTimeString("en-IN")}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EquipmentDashboard;
