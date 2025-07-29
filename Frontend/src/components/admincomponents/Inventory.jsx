import React, { useState, useEffect } from "react";
import {
  Monitor,
  Projector,
  Zap,
  Fan,
  Wifi,
  Plus,
  Search,
  Filter,
  Edit,
  Trash2,
  Eye,
  Users,
  MapPin,
  Building,
  X,
  Save,
  User,
  UserCheck,
  AlertCircle,
  CheckCircle,
  Clock,
  Download,
  Upload,
} from "lucide-react";
import axios from "axios";

const Inventory = () => {
  const [labs, setLabs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingLab, setEditingLab] = useState(null);
  const [viewingLab, setViewingLab] = useState(null);
  const [error, setError] = useState(null);

  // Form state for adding/editing labs
  const [formData, setFormData] = useState({
    labNo: "",
    labName: "",
    building: "",
    floor: "",
    capacity: 0,
    monitors: 0,
    projectors: 0,
    switchBoards: 0,
    fans: 0,
    wifi: 0,
    inchargeName: "",
    inchargeEmail: "",
    inchargePhone: "",
    assistantName: "",
    assistantEmail: "",
    assistantPhone: "",
    status: "active",
  });

  // Fetch labs from API
  useEffect(() => {
  const fetchLabs = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get("/api/labs", {
        timeout: 5000 // 5 second timeout
      });
      
      if (!response.data || !Array.isArray(response.data)) {
        throw new Error("Invalid data received from server");
      }
      
      setLabs(response.data);
    } catch (err) {
      let errorMessage = "Failed to fetch labs";
      
      if (err.code === 'ECONNABORTED') {
        errorMessage = "Request timeout - backend not responding";
      } else if (err.code === 'ECONNREFUSED') {
        errorMessage = "Backend server is not running";
      } else if (err.response) {
        errorMessage = err.response.data.error || err.message;
      }
      
      setError(errorMessage);
      console.error("API Error:", err);
    } finally {
      setLoading(false);
    }
  };

  fetchLabs();
}, []);

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "maintenance":
        return Clock;
      case "inactive":
        return AlertCircle;
      default:
        return AlertCircle;
    }
  };

  const filteredLabs = labs.filter((lab) => {
    const matchesSearch =
      lab.lab_no.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.lab_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lab.building.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesFilter = filterStatus === "all" || lab.status === filterStatus;
    return matchesSearch && matchesFilter;
  });

  const resetForm = () => {
    setFormData({
      labNo: "",
      labName: "",
      building: "",
      floor: "",
      capacity: 0,
      monitors: 0,
      projectors: 0,
      switchBoards: 0,
      fans: 0,
      wifi: 0,
      inchargeName: "",
      inchargeEmail: "",
      inchargePhone: "",
      assistantName: "",
      assistantEmail: "",
      assistantPhone: "",
      status: "active",
    });
  };

  const handleAddLab = async () => {
    try {
      const response = await axios.post("/api/labs", {
        labNo: formData.labNo,
        labName: formData.labName,
        building: formData.building,
        floor: formData.floor,
        capacity: formData.capacity,
        monitors: formData.monitors,
        projectors: formData.projectors,
        switchBoards: formData.switchBoards,
        fans: formData.fans,
        wifi: formData.wifi,
        inchargeName: formData.inchargeName,
        inchargeEmail: formData.inchargeEmail,
        inchargePhone: formData.inchargePhone,
        assistantName: formData.assistantName,
        assistantEmail: formData.assistantEmail,
        assistantPhone: formData.assistantPhone,
        status: formData.status,
      });

      // Refresh the labs list
      const labsResponse = await axios.get("/api/labs");
      setLabs(labsResponse.data);
      
      setShowAddModal(false);
      resetForm();
    } catch (err) {
      setError("Failed to add lab. Please try again.");
      console.error(err);
    }
  };

  const handleEditLab = (lab) => {
    setEditingLab(lab);
    setFormData({
      labNo: lab.lab_no,
      labName: lab.lab_name,
      building: lab.building,
      floor: lab.floor,
      capacity: lab.capacity,
      monitors: lab.equipment.monitors,
      projectors: lab.equipment.projectors,
      switchBoards: lab.equipment.switch_boards,
      fans: lab.equipment.fans,
      wifi: lab.equipment.wifi,
      inchargeName: lab.staff.incharge_name,
      inchargeEmail: lab.staff.incharge_email,
      inchargePhone: lab.staff.incharge_phone,
      assistantName: lab.staff.assistant_name,
      assistantEmail: lab.staff.assistant_email,
      assistantPhone: lab.staff.assistant_phone,
      status: lab.status,
    });
    setShowAddModal(true);
  };

  const handleUpdateLab = async () => {
    if (!editingLab) return;

    try {
      await axios.put(`/api/labs/${editingLab.id}`, {
        labNo: formData.labNo,
        labName: formData.labName,
        building: formData.building,
        floor: formData.floor,
        capacity: formData.capacity,
        monitors: formData.monitors,
        projectors: formData.projectors,
        switchBoards: formData.switchBoards,
        fans: formData.fans,
        wifi: formData.wifi,
        inchargeName: formData.inchargeName,
        inchargeEmail: formData.inchargeEmail,
        inchargePhone: formData.inchargePhone,
        assistantName: formData.assistantName,
        assistantEmail: formData.assistantEmail,
        assistantPhone: formData.assistantPhone,
        status: formData.status,
      });

      // Refresh the labs list
      const response = await axios.get("/api/labs");
      setLabs(response.data);
      
      setShowAddModal(false);
      setEditingLab(null);
      resetForm();
    } catch (err) {
      setError("Failed to update lab. Please try again.");
      console.error(err);
    }
  };

  const handleDeleteLab = async (labId) => {
    if (window.confirm("Are you sure you want to delete this lab?")) {
      try {
        await axios.delete(`/api/labs/${labId}`);
        setLabs(labs.filter((lab) => lab.id !== labId));
      } catch (err) {
        setError("Failed to delete lab. Please try again.");
        console.error(err);
      }
    }
  };

  const totalEquipment = labs.reduce(
    (acc, lab) => ({
      monitors: acc.monitors + (lab.equipment?.monitors || 0),
      projectors: acc.projectors + (lab.equipment?.projectors || 0),
      switchBoards: acc.switchBoards + (lab.equipment?.switch_boards || 0),
      fans: acc.fans + (lab.equipment?.fans || 0),
      wifi: acc.wifi + (lab.equipment?.wifi || 0),
    }),
    { monitors: 0, projectors: 0, switchBoards: 0, fans: 0, wifi: 0 }
  );

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {[...Array(5)].map((_, i) => (
            <div
              key={i}
              className="bg-white p-6 rounded-xl border border-gray-200"
            >
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 text-red-700 rounded-lg">
        {error}
        <button 
          onClick={() => setError(null)} 
          className="ml-4 text-red-900 font-bold"
        >
          Dismiss
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            Laboratory Inventory
          </h2>
          <p className="text-gray-600">
            Manage all college laboratory equipment and staff
          </p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="mr-2 h-4 w-4" />
            Add Lab
          </button>
        </div>
      </div>

      {/* Equipment Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Monitor className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Monitors</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalEquipment.monitors}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
              <Projector className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Projectors</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalEquipment.projectors}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Zap className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Switch Boards</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalEquipment.switchBoards}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <Fan className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Fans</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalEquipment.fans}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-indigo-500 rounded-lg flex items-center justify-center">
              <Wifi className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">WiFi Points</p>
              <p className="text-2xl font-bold text-gray-900">
                {totalEquipment.wifi}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="bg-white p-6 rounded-xl border border-gray-200">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <Search
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
              size={20}
            />
            <input
              type="text"
              placeholder="Search labs by number, name, or building..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex items-center space-x-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="active">Active</option>
              <option value="maintenance">Maintenance</option>
              <option value="inactive">Inactive</option>
            </select>
            <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
              <Filter size={20} />
            </button>
          </div>
        </div>
      </div>

      {/* Labs Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
        {filteredLabs.map((lab) => {
          const StatusIcon = getStatusIcon(lab.status);
          return (
            <div
              key={lab.id}
              className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow"
            >
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {lab.lab_no}
                    </h3>
                    <p className="text-gray-600">{lab.lab_name}</p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(
                        lab.status
                      )}`}
                    >
                      <StatusIcon size={12} className="mr-1" />
                      {lab.status}
                    </span>
                  </div>
                </div>

                <div className="space-y-3 mb-4">
                  <div className="flex items-center text-sm text-gray-600">
                    <Building className="mr-2" size={16} />
                    {lab.building} - {lab.floor}
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <Users className="mr-2" size={16} />
                    Capacity: {lab.capacity} students
                  </div>
                </div>

                {/* Equipment Grid */}
                <div className="grid grid-cols-5 gap-2 mb-4">
                  <div className="text-center">
                    <Monitor className="mx-auto text-blue-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">
                      {lab.equipment?.monitors || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <Projector
                      className="mx-auto text-purple-500 mb-1"
                      size={16}
                    />
                    <p className="text-xs text-gray-600">
                      {lab.equipment?.projectors || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <Zap className="mx-auto text-yellow-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">
                      {lab.equipment?.switch_boards || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <Fan className="mx-auto text-green-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">
                      {lab.equipment?.fans || 0}
                    </p>
                  </div>
                  <div className="text-center">
                    <Wifi className="mx-auto text-indigo-500 mb-1" size={16} />
                    <p className="text-xs text-gray-600">
                      {lab.equipment?.wifi || 0}
                    </p>
                  </div>
                </div>

                {/* Staff Info */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex items-center text-sm">
                    <UserCheck className="mr-2 text-green-600" size={14} />
                    <span className="font-medium">In-charge:</span>
                    <span className="ml-1 text-gray-600">
                      {lab.staff?.incharge_name || "Not assigned"}
                    </span>
                  </div>
                  <div className="flex items-center text-sm">
                    <User className="mr-2 text-blue-600" size={14} />
                    <span className="font-medium">Assistant:</span>
                    <span className="ml-1 text-gray-600">
                      {lab.staff?.assistant_name || "Not assigned"}
                    </span>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center justify-between mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Updated: {new Date(lab.last_updated).toLocaleDateString()}
                  </p>
                  <div className="flex items-center space-x-2">
                    <button
                      onClick={() => setViewingLab(lab)}
                      className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                    >
                      <Eye size={16} />
                    </button>
                    <button
                      onClick={() => handleEditLab(lab)}
                      className="p-2 text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
                    >
                      <Edit size={16} />
                    </button>
                    <button
                      onClick={() => handleDeleteLab(lab.id)}
                      className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Add/Edit Lab Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editingLab ? "Edit Laboratory" : "Add New Laboratory"}
                </h3>
                <button
                  onClick={() => {
                    setShowAddModal(false);
                    setEditingLab(null);
                    resetForm();
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Basic Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Basic Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lab Number
                    </label>
                    <input
                      type="text"
                      value={formData.labNo}
                      onChange={(e) =>
                        setFormData({ ...formData, labNo: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., CS-101"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Lab Name
                    </label>
                    <input
                      type="text"
                      value={formData.labName}
                      onChange={(e) =>
                        setFormData({ ...formData, labName: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Computer Science Lab 1"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Building
                    </label>
                    <input
                      type="text"
                      value={formData.building}
                      onChange={(e) =>
                        setFormData({ ...formData, building: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., Block A"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Floor
                    </label>
                    <input
                      type="text"
                      value={formData.floor}
                      onChange={(e) =>
                        setFormData({ ...formData, floor: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="e.g., 1st Floor"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Capacity
                    </label>
                    <input
                      type="number"
                      value={formData.capacity}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          capacity: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Number of students"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Status
                    </label>
                    <select
                      value={formData.status}
                      onChange={(e) =>
                        setFormData({ ...formData, status: e.target.value })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                      <option value="active">Active</option>
                      <option value="maintenance">Maintenance</option>
                      <option value="inactive">Inactive</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Equipment Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Equipment Inventory
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Monitor className="inline mr-1" size={16} />
                      Monitors
                    </label>
                    <input
                      type="number"
                      value={formData.monitors}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          monitors: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Projector className="inline mr-1" size={16} />
                      Projectors
                    </label>
                    <input
                      type="number"
                      value={formData.projectors}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          projectors: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Zap className="inline mr-1" size={16} />
                      Switch Boards
                    </label>
                    <input
                      type="number"
                      value={formData.switchBoards}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          switchBoards: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Fan className="inline mr-1" size={16} />
                      Fans
                    </label>
                    <input
                      type="number"
                      value={formData.fans}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          fans: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      <Wifi className="inline mr-1" size={16} />
                      WiFi Points
                    </label>
                    <input
                      type="number"
                      value={formData.wifi}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          wifi: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>

              {/* Staff Information */}
              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Staff Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h5 className="text-md font-medium text-gray-800 mb-3">
                      Lab In-charge
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.inchargeName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inchargeName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Dr. John Doe"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.inchargeEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inchargeEmail: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="john.doe@college.edu"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.inchargePhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              inchargePhone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1-555-0123"
                        />
                      </div>
                    </div>
                  </div>
                  <div>
                    <h5 className="text-md font-medium text-gray-800 mb-3">
                      Lab Assistant
                    </h5>
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Name
                        </label>
                        <input
                          type="text"
                          value={formData.assistantName}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              assistantName: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="Jane Smith"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Email
                        </label>
                        <input
                          type="email"
                          value={formData.assistantEmail}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              assistantEmail: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="jane.smith@college.edu"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Phone
                        </label>
                        <input
                          type="tel"
                          value={formData.assistantPhone}
                          onChange={(e) =>
                            setFormData({
                              ...formData,
                              assistantPhone: e.target.value,
                            })
                          }
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          placeholder="+1-555-0124"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowAddModal(false);
                  setEditingLab(null);
                  resetForm();
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={editingLab ? handleUpdateLab : handleAddLab}
                className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Save className="mr-2" size={16} />
                {editingLab ? "Update Lab" : "Add Lab"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* View Lab Modal */}
      {viewingLab && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {viewingLab.lab_no} - {viewingLab.lab_name}
                </h3>
                <button
                  onClick={() => setViewingLab(null)}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-600">Building</p>
                  <p className="text-lg text-gray-900">{viewingLab.building}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Floor</p>
                  <p className="text-lg text-gray-900">{viewingLab.floor}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Capacity</p>
                  <p className="text-lg text-gray-900">
                    {viewingLab.capacity} students
                  </p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Status</p>
                  <span
                    className={`inline-flex px-2 py-1 text-sm font-semibold rounded-full ${getStatusColor(
                      viewingLab.status
                    )}`}
                  >
                    {viewingLab.status}
                  </span>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Equipment Details
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
                  <div className="text-center p-4 bg-blue-50 rounded-lg">
                    <Monitor className="mx-auto text-blue-500 mb-2" size={24} />
                    <p className="text-2xl font-bold text-gray-900">
                      {viewingLab.equipment?.monitors || 0}
                    </p>
                    <p className="text-sm text-gray-600">Monitors</p>
                  </div>
                  <div className="text-center p-4 bg-purple-50 rounded-lg">
                    <Projector
                      className="mx-auto text-purple-500 mb-2"
                      size={24}
                    />
                    <p className="text-2xl font-bold text-gray-900">
                      {viewingLab.equipment?.projectors || 0}
                    </p>
                    <p className="text-sm text-gray-600">Projectors</p>
                  </div>
                  <div className="text-center p-4 bg-yellow-50 rounded-lg">
                    <Zap className="mx-auto text-yellow-500 mb-2" size={24} />
                    <p className="text-2xl font-bold text-gray-900">
                      {viewingLab.equipment?.switch_boards || 0}
                    </p>
                    <p className="text-sm text-gray-600">Switch Boards</p>
                  </div>
                  <div className="text-center p-4 bg-green-50 rounded-lg">
                    <Fan className="mx-auto text-green-500 mb-2" size={24} />
                    <p className="text-2xl font-bold text-gray-900">
                      {viewingLab.equipment?.fans || 0}
                    </p>
                    <p className="text-sm text-gray-600">Fans</p>
                  </div>
                  <div className="text-center p-4 bg-indigo-50 rounded-lg">
                    <Wifi className="mx-auto text-indigo-500 mb-2" size={24} />
                    <p className="text-2xl font-bold text-gray-900">
                      {viewingLab.equipment?.wifi || 0}
                    </p>
                    <p className="text-sm text-gray-600">WiFi Points</p>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-lg font-medium text-gray-900 mb-4">
                  Staff Information
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="p-4 bg-green-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <UserCheck className="text-green-600 mr-2" size={20} />
                      <h5 className="font-medium text-gray-900">
                        Lab In-charge
                      </h5>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Name:</span>{" "}
                        {viewingLab.staff?.incharge_name || "Not assigned"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {viewingLab.staff?.incharge_email || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span>{" "}
                        {viewingLab.staff?.incharge_phone || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="p-4 bg-blue-50 rounded-lg">
                    <div className="flex items-center mb-3">
                      <User className="text-blue-600 mr-2" size={20} />
                      <h5 className="font-medium text-gray-900">
                        Lab Assistant
                      </h5>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm">
                        <span className="font-medium">Name:</span>{" "}
                        {viewingLab.staff?.assistant_name || "Not assigned"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Email:</span>{" "}
                        {viewingLab.staff?.assistant_email || "N/A"}
                      </p>
                      <p className="text-sm">
                        <span className="font-medium">Phone:</span>{" "}
                        {viewingLab.staff?.assistant_phone || "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="text-center text-sm text-gray-500">
                Last updated:{" "}
                {new Date(viewingLab.last_updated).toLocaleString()}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Inventory;