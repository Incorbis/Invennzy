import React, { useState, useEffect } from "react";
import {
  X,
  Search,
  AlertCircle,
  CheckCircle,
  Clock,
  Wrench,
  Calendar,
} from "lucide-react";
import axios from "axios";
import { toast } from "react-toastify";

const EquipmentDetailsModal = ({
  isOpen,
  onClose,
  labId,
  equipmentType,
  labName,
}) => {
  const [equipment, setEquipment] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const equipmentTypeLabels = {
    monitor: "Monitors",
    projector: "Projectors",
    switch_board: "Switch Boards",
    fan: "Fans",
    wifi: "WiFi Points",
    other: "Other Equipment",
  };

  const getStatusConfig = (status) => {
    switch (status) {
      case "0":
        return {
          label: "Working",
          color: "bg-green-100 text-green-800",
          icon: CheckCircle,
        };
      case "1":
        return {
          label: "Faulty",
          color: "bg-red-100 text-red-800",
          icon: AlertCircle,
        };
      case "2":
        return {
          label: "Repairing",
          color: "bg-yellow-100 text-yellow-800",
          icon: Wrench,
        };
      default:
        return {
          label: "Unknown",
          color: "bg-gray-100 text-gray-800",
          icon: AlertCircle,
        };
    }
  };

  useEffect(() => {
    if (isOpen && labId && equipmentType) {
      fetchEquipmentDetails();
    }
  }, [isOpen, labId, equipmentType]);

  const fetchEquipmentDetails = async () => {
    try {
      setLoading(true);
      const adminId = localStorage.getItem("adminId");
      const response = await axios.get(
        `http://localhost:3000/api/labs/equipment/${adminId}/${labId}/${equipmentType}`
      );
      setEquipment(response.data);
    } catch (error) {
      console.error("Error fetching equipment details:", error);
      toast.error("Failed to fetch equipment details");
    } finally {
      setLoading(false);
    }
  };

  const filteredEquipment = equipment.filter((item) => {
    if (!searchQuery) return true;

    const searchLower = searchQuery.toLowerCase();
    return (
      item.equipment_name?.toLowerCase().includes(searchLower) ||
      item.equipment_code?.toLowerCase().includes(searchLower) ||
      item.company_name?.toLowerCase().includes(searchLower) ||
      item.specification?.toLowerCase().includes(searchLower) ||
      item.current_location?.toLowerCase().includes(searchLower)
    );
  });

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-xl max-w-6xl w-full max-h-[90vh] overflow-hidden shadow-2xl border border-gray-300 ring-1 ring-gray-200">
        {/* Header */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900">
                {equipmentTypeLabels[equipmentType]} - {labName}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                Equipment details and status information
              </p>
            </div>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <X size={20} />
            </button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="p-4 sm:p-6 border-b border-gray-200 bg-gray-50">
          <div className="relative">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={18}
            />
            <input
              type="text"
              placeholder="Search by name, code, company, specification, or location..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 shadow-sm"
            />
          </div>
          {searchQuery && (
            <p className="mt-2 text-sm text-gray-600">
              Found {filteredEquipment.length} of {equipment.length} items
            </p>
          )}
        </div>

        {/* Content */}
        <div className="overflow-y-auto max-h-[60vh]">
          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="ml-3 text-gray-600">
                Loading equipment details...
              </span>
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-12">
              <div className="w-16 h-16 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <AlertCircle className="text-gray-400" size={32} />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {equipment.length === 0
                  ? "No Equipment Found"
                  : "No Matching Results"}
              </h3>
              <p className="text-gray-600">
                {equipment.length === 0
                  ? `No ${equipmentTypeLabels[
                      equipmentType
                    ].toLowerCase()} are registered for this lab.`
                  : "Try adjusting your search criteria to find equipment."}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Equipment Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Code
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Company Name
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Specification
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Current Location
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Created At
                    </th>
                    <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Updated At
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {filteredEquipment.map((item) => {
                    const statusConfig = getStatusConfig(item.equipment_status);
                    const StatusIcon = statusConfig.icon;

                    return (
                      <tr
                        key={item.equipment_id}
                        className="hover:bg-gray-50 transition-colors"
                      >
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="font-medium text-gray-900">
                            {item.equipment_name || "Unnamed Equipment"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="text-sm text-gray-900 font-mono">
                            {item.equipment_code || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <span
                            className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${statusConfig.color}`}
                          >
                            <StatusIcon size={12} className="mr-1" />
                            {statusConfig.label}
                          </span>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {item.company_name || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {item.specification || "No specification available"}
                          </div>
                        </td>
                        <td className="px-4 py-4">
                          <div className="text-sm text-gray-900 max-w-xs truncate">
                            {item.current_location || "N/A"}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar size={14} className="mr-1" />
                            {formatDate(item.created_at)}
                          </div>
                        </td>
                        <td className="px-4 py-4 whitespace-nowrap">
                          <div className="flex items-center text-sm text-gray-500">
                            <Clock size={14} className="mr-1" />
                            {formatDate(item.updated_at)}
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Footer */}
        {filteredEquipment.length > 0 && (
          <div className="px-4 py-3 border-t border-gray-200 bg-gray-50">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>
                Showing {filteredEquipment.length} of {equipment.length} items
              </span>
              <span>Lab ID: {labId}</span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default EquipmentDetailsModal;
