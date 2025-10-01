import React, { useState, useEffect } from "react";
import {
  Search,
  Download,
  FileText,
  AlertCircle,
  RefreshCw,
  IndianRupee,
  Package,
  Calendar,
} from "lucide-react";

const EquipmentDashboard = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [equipmentData, setEquipmentData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [downloadingIds, setDownloadingIds] = useState(new Set());

  // Fetch grouped deadstock reports from backend
  const fetchEquipmentData = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch("/api/fetch/deadstock");

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      // Transform the grouped data for display
      const transformedData = [];
      data.forEach((value, index) => {
        const group = value;
        console.log("Processing group:", group);
        const totalItems = data.length;
        if (group && Object.keys(group).length > 0) {
          const totalValue = parseFloat(group.cost) || 0;
          const registeredBy = group.name || "Unknown";
          const createdAt = group.date_submitted;
          const po_no = group.po_no || "N/A";
          const quantity = group.quantity || 1;
          const remark = group.remark || "N/A";
          const equipmentName = group.equipment_name || "N/A";
          transformedData.push({
            deadstock_id: group.deadstock_id,
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
      if (err.name === "TypeError") {
        setError(
          "Network Error: Unable to connect to server. Please check your connection."
        );
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
      setDownloadingIds((prev) => new Set([...prev, deadstockId]));

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

  // Fetch data on component mount
  useEffect(() => {
    fetchEquipmentData();

    const interval = setInterval(() => {
      fetchEquipmentData();
    }, 10000); // every 10s

    return () => clearInterval(interval);
  }, []);

  // Calculate summary statistics
  const totalReports = equipmentData.length;
  const totalValue = equipmentData.reduce(
    (sum, item) => sum + item.totalValue,
    0
  );
  const totalItems = equipmentData.reduce(
    (sum, item) => sum + (item.quantity || 1),
    0
  );

  // Filter data based on search
  const filteredData = equipmentData.filter((item) => {
    const matchesSearch =
      item.deadstock_id.toString().includes(searchTerm.toLowerCase()) ||
      item.registeredBy.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.equipmentName.toLowerCase().includes(searchTerm.toLowerCase());

    return matchesSearch;
  });

  const handleRefresh = () => {
    fetchEquipmentData();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
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
            className="bg-gray-900 text-white px-4 py-2 rounded-lg hover:bg-gray-800 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-semibold text-gray-900">Dead Stock Reports</h1>
          <p className="text-gray-600 mt-1">Monitor and manage laboratory inventory reports</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Reports</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{totalReports}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-blue-50 flex items-center justify-center">
                <FileText className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Items</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">{totalItems}</p>
              </div>
              <div className="w-12 h-12 rounded-full bg-amber-50 flex items-center justify-center">
                <Package className="w-6 h-6 text-amber-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600 font-medium">Total Value</p>
                <p className="text-3xl font-semibold text-gray-900 mt-2">
                  ₹{(totalValue / 100000).toFixed(1)}L
                </p>
              </div>
              <div className="w-12 h-12 rounded-full bg-emerald-50 flex items-center justify-center">
                <IndianRupee className="w-6 h-6 text-emerald-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Search Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search by ID, name, category, or equipment..."
                className="pl-10 pr-4 py-2.5 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-gray-900"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <button
              onClick={handleRefresh}
              className="bg-blue-500 text-white px-4 py-2.5 rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-2"
            >
              <RefreshCw className="h-4 w-4" />
              Refresh
            </button>
          </div>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {filteredData.map((item) => (
            <div
              key={item.deadstock_id}
              className="bg-white rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 border border-gray-200 overflow-hidden"
            >
              {/* Header Section */}
              <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-900">
                      {item.deadstock_id}
                    </h3>
                    <p className="text-sm text-gray-600 mt-0.5">{item.equipmentName}</p>
                  </div>
                  <span className="inline-flex items-center px-2.5 py-1 rounded-md text-xs font-medium bg-green-50 text-green-700 border border-green-200">
                    active
                  </span>
                </div>
              </div>

              {/* Body Section */}
              <div className="px-6 py-5">
                {/* Info Grid */}
                <div className="space-y-3 mb-5">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Block:</span>
                    <span>{item.category}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Package className="w-4 h-4 text-gray-400" />
                    <span className="font-medium">Capacity:</span>
                    <span>{item.quantity} items</span>
                  </div>
                </div>

                {/* Stats Icons */}
                <div className="grid grid-cols-6 gap-3 mb-5 pb-5 border-b border-gray-200">
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-blue-50 flex items-center justify-center mb-1">
                      <FileText className="w-4 h-4 text-blue-600" />
                    </div>
                    <span className="text-xs text-gray-900 font-medium">{item.quantity}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-purple-50 flex items-center justify-center mb-1">
                      <Package className="w-4 h-4 text-purple-600" />
                    </div>
                    <span className="text-xs text-gray-900 font-medium">-</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-yellow-50 flex items-center justify-center mb-1">
                      <IndianRupee className="w-4 h-4 text-yellow-600" />
                    </div>
                    <span className="text-xs text-gray-900 font-medium">₹{(item.totalValue / 1000).toFixed(0)}K</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-green-50 flex items-center justify-center mb-1">
                      <Calendar className="w-4 h-4 text-green-600" />
                    </div>
                    <span className="text-xs text-gray-900 font-medium">{item.purchase_year}</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center mb-1">
                      <FileText className="w-4 h-4 text-indigo-600" />
                    </div>
                    <span className="text-xs text-gray-900 font-medium">-</span>
                  </div>
                  <div className="flex flex-col items-center">
                    <div className="w-8 h-8 rounded-lg bg-pink-50 flex items-center justify-center mb-1">
                      <Package className="w-4 h-4 text-pink-600" />
                    </div>
                    <span className="text-xs text-gray-900 font-medium">-</span>
                  </div>
                </div>

                {/* Additional Info */}
                <div className="space-y-2.5 mb-5">
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">In-charge:</span>
                    <span className="text-gray-900 font-medium">{item.registeredBy}</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm">
                    <span className="text-gray-600">Assistant:</span>
                    <span className="text-gray-500">Not assigned</span>
                  </div>
                </div>

                {/* Footer */}
                <div className="flex items-center justify-between text-xs text-gray-500 mb-4">
                  <span>Updated: {item.date}</span>
                  <div className="flex items-center gap-2">
                    <button className="p-1.5 hover:bg-gray-100 rounded">
                      <AlertCircle className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Download Button */}
                <button
                  onClick={() => handleDownload(item.deadstock_id)}
                  disabled={downloadingIds.has(item.deadstock_id)}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-2.5 text-sm font-medium rounded-lg transition-colors duration-200 ${
                    downloadingIds.has(item.deadstock_id)
                      ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                      : "bg-red-500 hover:bg-red-600 text-white"
                  }`}
                >
                  {downloadingIds.has(item.deadstock_id) ? (
                    <>
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-gray-400"></div>
                      Downloading...
                    </>
                  ) : (
                    <>
                      <Download className="w-4 h-4" />
                      Download PDF
                    </>
                  )}
                </button>
              </div>
            </div>
          ))}

          {filteredData.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500">
              No deadstock reports found
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default EquipmentDashboard;