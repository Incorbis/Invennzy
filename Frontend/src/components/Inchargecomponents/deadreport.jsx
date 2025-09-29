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
  const [downloadingIds, setDownloadingIds] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await fetch("/api/fetch/deadstock");
      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
      const data = await response.json();
      const transformedData = [];
      data.forEach((value, index) => {
        const group = value;
        console.log("Processing group:", group);
        const totalItems = data.length;
        if (group && Object.keys(group).length > 0) {
          // const totalValue = group.reduce(
          //   (sum, item) => sum + (parseFloat(item.cost) || 0),
          //   0
          // );
          const totalValue = parseFloat(group.cost) || 0;
          const registeredBy = group.name || "Unknown";
          const createdAt = group.date_submitted;
          const po_no = group.po_no || "N/A";
          const quantity = group.quantity || 1;
          const remark = group.remark || "N/A";
          const equipmentName = group.equipment_name || "N/A";
          console.log("Group Data:", group, value, index);
          transformedData.push({
            deadstock_id: group.deadstock_id,
            // totalItems,
            totalValue,
            po_no,
            quantity,
            remark,
            equipmentName,
            registeredBy,
            date: createdAt
              ? new Date(createdAt).toLocaleDateString("en-IN", {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })
              : "N/A",
            category: group.category || "Equipment",
            purchase_year: group.purchase_year,
          });
        }
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

  const handleDownload = async (deadstockId) => {
    try {
      setDownloadingIds((prev) => new Set([...prev, deadstockId]));
      const response = await fetch(
        `/api/download/deadstock-report/${deadstockId}`,
        {
          method: "GET",
          headers: { Accept: "application/pdf" },
        }
      );
      if (!response.ok)
        throw new Error(`Failed to download report: ${response.statusText}`);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const fileName = `Deadstock_Report_${deadstockId}.pdf`;
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
      setDownloadingIds((prev) => {
        const newSet = new Set(prev);
        newSet.delete(deadstockId);
        return newSet;
      });
    }
  };

  useEffect(() => {
    fetchEquipmentData();
    const interval = setInterval(fetchEquipmentData, 10000);
    return () => clearInterval(interval);
  }, []);

  const summaryStats = useMemo(() => {
    const totalReports = equipmentData.length;
    console.log("Calculating summary stats:", equipmentData);
    const totalItems = equipmentData.reduce(
      (sum, item) => sum + item.totalItems,
      0
    );
    const totalCost = equipmentData.reduce(
      (sum, item) => sum + item.totalValue,
      0
    );
    return { totalReports, totalItems, totalCost };
  }, [equipmentData]);

  const filteredData = useMemo(() => {
    return equipmentData.filter(
      (item) =>
        item.deadstock_id.toString().includes(searchTerm.toLowerCase()) ||
        item.registeredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.po_no.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.remark.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [equipmentData, searchTerm]);

  const paginatedData = useMemo(() => {
    const startIndex = (currentPage - 1) * itemsPerPage;
    return filteredData.slice(startIndex, startIndex + itemsPerPage);
  }, [filteredData, currentPage]);

  const totalPages = Math.ceil(filteredData.length / itemsPerPage);

  const handleRefresh = () => fetchEquipmentData();

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
            <RefreshCw className="h-4 w-4" /> Refresh Data
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
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

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-6">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <input
              type="text"
              placeholder="Search by ID, name, category, equipment, PO, or remark..."
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setCurrentPage(1);
              }}
            />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden mb-6">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Deadstock ID
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    PO Number
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Equipment Name
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Registered By
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Qty
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Cost
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Remarks
                  </th>
                  {/* <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Action
                  </th> */}
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {paginatedData.map((item) => (
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
                      {item.po_no}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.equipmentName}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {item.registeredBy}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {item.date}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {item.quantity}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      ₹{item.totalValue.toLocaleString("en-IN")}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {item.remark}
                    </td>
                    {/* <td className="px-6 py-4 whitespace-nowrap">
                      <button
                        className={`inline-flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors ${
                          downloadingIds.has(item.deadstock_id)
                            ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                            : "bg-blue-600 text-white hover:bg-blue-700"
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
                        {downloadingIds.has(item.deadstock_id)
                          ? "Downloading..."
                          : "Download PDF"}
                      </button>
                    </td> */}
                  </tr>
                ))}
                {paginatedData.length === 0 && (
                  <tr>
                    <td
                      colSpan="9"
                      className="px-6 py-12 text-center text-gray-500"
                    >
                      No deadstock reports found
                      {searchTerm && (
                        <div className="mt-2 text-sm">
                          Try adjusting your search criteria
                        </div>
                      )}
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 flex justify-center">
            <nav className="inline-flex gap-2">
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`px-4 py-2 rounded-lg ${
                      currentPage === page
                        ? "bg-blue-600 text-white"
                        : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                    }`}
                  >
                    {page}
                  </button>
                )
              )}
            </nav>
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-4">
          <div className="flex justify-between items-center">
            <div className="text-sm text-gray-700">
              Showing {paginatedData.length} of {filteredData.length} deadstock
              reports
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
