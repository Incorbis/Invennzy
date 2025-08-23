import React, { useState, useEffect } from "react";
import axios from "axios";

import {
  Monitor,
  Projector,
  Zap,
  Fan,
  Wifi,
  Search,
  Filter,
  Edit,
  CheckCircle,
  AlertTriangle,
  Clock,
  Eye,
  EyeOff,
  Printer,
  HardDrive,
  Router,
  Camera,
  Laptop,
  Save,
  Loader,
} from "lucide-react";

const LabEquipmentManager = () => {
  const [equipmentState, setEquipmentState] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [filterType, setFilterType] = useState("all");
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  const [saving, setSaving] = useState(false);
  const [saveError, setSaveError] = useState(null);

  // Initialize all categories as collapsed
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    const types = ["monitors", "projectors", "switch_boards", "fans", "wifi"];
    return Object.fromEntries(types.map((type) => [type, true]));
  });

  useEffect(() => {
    // Debug: Check all localStorage keys
    const localStorageKeys = Object.keys(localStorage);
    console.log("All localStorage keys:", localStorageKeys);

    // Check common key variations
    const possibleKeys = ["staffId", "id"];
    const foundKeys = {};

    possibleKeys.forEach((key) => {
      const value = localStorage.getItem(key);
      if (value) {
        foundKeys[key] = value;
        console.log(`Found ${key}:`, value);
      }
    });

    // ✅ Verify it
    console.log("User ID set to:", localStorage.getItem("staffId"));

    setDebugInfo({
      allKeys: localStorageKeys,
      possibleUserKeys: foundKeys,
    });

    // Try to get staffId with different possible key names
    let staffId = localStorage.getItem("staffId") || localStorage.getItem("id");

    // Also try to parse user object if stored as JSON
    const userObj = localStorage.getItem("user");
    if (userObj && !staffId) {
      try {
        const parsed = JSON.parse(userObj);
        staffId =
          parsed.id || parsed.staffId || parsed.staffId || parsed.staff_id;
        console.log("Parsed user object:", parsed);
        console.log("Extracted staffId from user object:", staffId);
      } catch (e) {
        console.log("Failed to parse user object:", e);
      }
    }

    // Try other possible JSON objects
    if (!staffId) {
      const possibleJsonKeys = [
        "currentUser",
        "loggedInUser",
        "authUser",
        "session",
      ];
      for (const key of possibleJsonKeys) {
        const jsonStr = localStorage.getItem(key);
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr);
            staffId =
              parsed.id || parsed.staffId || parsed.staffId || parsed.staff_id;
            if (staffId) {
              console.log(`Found staffId in ${key}:`, staffId);
              break;
            }
          } catch (e) {
            console.log(`Failed to parse ${key}:`, e);
          }
        }
      }
    }
    localStorage.setItem("staffId", "4");

    if (!staffId) {
      console.error("No staffId found in localStorage");
      console.log("Available localStorage keys:", localStorageKeys);
      console.log("Searched for keys:", possibleKeys);
      console.log("Found values:", foundKeys);

      setError(
        "No user ID found. Please login again. Debug info: " +
          JSON.stringify(foundKeys)
      );
      setLoading(false);
      return;
    }

    console.log("Using staffId:", staffId);

    const fetchEquipment = async () => {
  try {
    setLoading(true);

    // --- get staffId (robust from localStorage) ---
    let staffId = localStorage.getItem("staffId") || localStorage.getItem("id");
    const userObj = localStorage.getItem("user");
    if (!staffId && userObj) {
      try {
        const parsed = JSON.parse(userObj);
        staffId = parsed.id || parsed.staffId || parsed.staff_id;
      } catch (e) {
        /* ignore */
      }
    }
    if (!staffId) throw new Error("No staffId found in localStorage");

    // --- fetch equipment by staffId (new API) ---
    console.log("Fetching equipment for staffId:", staffId);
    const equipResponse = await axios.get(`/api/labinchargeassistant/labs/equipment/by-staff/${staffId}`);
    const equipData = equipResponse.data;
    console.log("Raw equipment response:", equipData);

    // --- normalize backend response into countsByType and detailsByType ---
    const types = ["monitors", "projectors", "switch_boards", "fans", "wifi"];
    const countsByType = equipData.counts || {};
    const detailsByType = equipData.grouped || {};

    // Ensure every type has numeric count and array
    types.forEach((t) => {
      countsByType[t] = Number(countsByType[t] || 0);
      detailsByType[t] = detailsByType[t] || [];
    });

    // --- Map DB status -> frontend status ---
    const mapStatus = (dbStatus) => {
      if (dbStatus === "0" || dbStatus === 0) return "active";
      if (dbStatus === "2" || dbStatus === 2) return "maintenance";
      if (dbStatus === "1" || dbStatus === 1) return "damaged";
      if (["active", "working", "ok"].includes(String(dbStatus).toLowerCase())) return "active";
      if (["maintenance", "repair"].includes(String(dbStatus).toLowerCase())) return "maintenance";
      if (["damaged", "broken", "inactive"].includes(String(dbStatus).toLowerCase())) return "damaged";
      return "active";
    };

    // --- Build final equipment list ---
    const equipmentList = [];
    types.forEach((key) => {
      const detailsArr = detailsByType[key] || [];
      detailsArr.forEach((detail, i) => {
        const item = {
          id: detail.equipment_id,
          type: key,
          name: detail.equipment_name || `${key} ${i + 1}`,
          code: detail.equipment_code || `${key.toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
          status: mapStatus(detail.equipment_status || detail.status),
          password: detail.equipment_password || "",
          description: detail.equipment_description || `${key} unit ${i + 1}`,
          icon:
            key === "monitors" ? Monitor :
            key === "projectors" ? Projector :
            key === "switch_boards" ? Zap :
            key === "wifi" ? Wifi : Fan,
          color:
            key === "monitors" ? "blue" :
            key === "projectors" ? "purple" :
            key === "switch_boards" ? "yellow" :
            key === "wifi" ? "indigo" : "green",
        };
        equipmentList.push(item);
      });
    });

    console.log("Final equipment list:", equipmentList);
    setEquipmentState(equipmentList);
    setError(null);
  } catch (err) {
    console.error("Error loading equipment:", err);
    setError(err.response?.data?.message || err.message);
  } finally {
    setLoading(false);
  }
};

    fetchEquipment();
  }, []);

  const togglePasswordVisibility = (itemId) => {
    setShowPasswords((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleCategory = (category) => {
    setCollapsedCategories((prev) => {
      const isCurrentlyCollapsed = prev[category];
      // Collapse all categories first
      const newCollapsed = Object.fromEntries(
        Object.keys(prev).map((key) => [key, true])
      );
      // Toggle the clicked one
      return {
        ...newCollapsed,
        [category]: !isCurrentlyCollapsed,
      };
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "damaged":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "active":
        return CheckCircle;
      case "maintenance":
        return Clock;
      case "damaged":
        return AlertTriangle;
      default:
        return AlertTriangle;
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem({ ...item }); // Create a copy to avoid direct mutation
    setShowModal(true);
    setEditMode(false);
    setSaveError(null);
  };

  // Add this helper function inside your LabEquipmentManager component
  const mapBackendStatus = (dbStatus) => {
      switch (String(dbStatus)) {
          case '0': return 'active';
          case '2': return 'maintenance';
          case '1': return 'damaged';
          default: return 'active';
      }
  };

  // Updated save function to integrate with backend API using axios
  // Updated save function to integrate with backend API using axios
  const handleSaveEdit = async () => {
    if (saving) return; // ✅ prevents double save clicks
    if (!selectedItem || !selectedItem.id) {
      setSaveError("Invalid equipment selected");
      return;
    }

    setSaving(true);
    setSaveError(null);

    const numericId = selectedItem.id;

    try {
      setTimeout(() => {
      setSelectedItem(null);
      }, 2000);
      console.log("Updating equipment:", numericId);

      const updateData = {
        equipment_name: selectedItem.name,
        equipment_code: selectedItem.code,
        equipment_status: selectedItem.status,
        equipment_password: selectedItem.password,
        equipment_description: selectedItem.description,
      };

      const response = await axios.put(
        `/api/labinchargeassistant/equipment/${numericId}`,
        updateData,
        { headers: { "Content-Type": "application/json" } }
      );

      const result = response.data;
      if (result?.success && result?.equipment) {
        // ✅ close modal & edit mode instantly
        setEditMode(false);
        setShowModal(false);

        // ✅ refresh the page after short delay (to get latest data from backend)
        setTimeout(() => {
          window.location.reload();
        }, 500);
      }
      else {
        throw new Error(result?.message || "Update failed");
      }
    } catch (error) {
      console.error("Error updating equipment:", error);

      let errorMessage = "Failed to update equipment";
      if (error.response) {
        errorMessage =
          error.response.data?.error || error.response.data?.message || errorMessage;
      } else if (error.request) {
        errorMessage = "No response from server. Please check your connection.";
      } else {
        errorMessage = error.message;
      }

      setSaveError(errorMessage);
    } finally {
      setSaving(false); // ✅ spinner always stops
    }
  };


  const filteredEquipment = equipmentState.filter((item) => {
    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus =
      filterStatus === "all" || item.status === filterStatus;
    const matchesType = filterType === "all" || item.type === filterType;

    return matchesSearch && matchesStatus && matchesType;
  });

  const getUniqueTypes = () => {
    const types = ["monitors", "projectors", "switch_boards", "fans", "wifi"];
    return types;
  };

  const groupEquipmentByType = (equipmentList) => {
  const grouped = {};
  const types = getUniqueTypes();

    types.forEach((type) => {
      grouped[type] = equipmentList
        .filter((item) => item.type === type)
        .sort((a, b) => {
          // Extract number from name first, fallback to code
          const numA =
            parseInt(a.name.match(/\d+/)?.[0]) ||
            parseInt(a.code.match(/\d+/)?.[0]) ||
            0;
          const numB =
            parseInt(b.name.match(/\d+/)?.[0]) ||
            parseInt(b.code.match(/\d+/)?.[0]) ||
            0;
          return numA - numB;
        });
    });

    return grouped;
  };


  const getTypeSummary = () => {
    const summary = {};
    equipmentState.forEach((item) => {
      if (!summary[item.type]) {
        summary[item.type] = {
          total: 0,
          active: 0,
          maintenance: 0,
          damaged: 0,
        };
      }
      summary[item.type].total++;
      summary[item.type][item.status]++;
    });
    return summary;
  };

  const typeSummary = getTypeSummary();
  const groupedEquipment = groupEquipmentByType(filteredEquipment);

  const getCategoryDisplayName = (type) => {
    const names = {
      monitors: "Monitors",
      projectors: "Projectors",
      switch_boards: "Switch Boards",
      fans: "Fans",
      wifi: "WiFi Routers",
    };
    return names[type] || type;
  };

  const getCategoryIcon = (type) => {
    const icons = {
      monitors: Monitor,
      projectors: Projector,
      switch_boards: Zap,
      fans: Fan,
      wifi: Wifi,
    };
    return icons[type] || Monitor;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading equipment data...</p>
          {Object.keys(debugInfo).length > 0 && (
            <div className="mt-2 text-xs text-gray-500">
              <p>
                Debug: Found localStorage keys: {debugInfo.allKeys?.join(", ")}
              </p>
              <p>
                User keys:{" "}
                {Object.keys(debugInfo.possibleUserKeys || {}).join(", ")}
              </p>
            </div>
          )}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Equipment
          </h2>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">
              Debug Information:
            </h3>
            <div className="bg-gray-100 p-3 rounded text-xs text-left">
              <p>
                <strong>Available localStorage keys:</strong>
              </p>
              <p>{debugInfo.allKeys?.join(", ") || "None found"}</p>
              <p className="mt-2">
                <strong>Possible user data:</strong>
              </p>
              <pre>{JSON.stringify(debugInfo.possibleUserKeys, null, 2)}</pre>
            </div>
          </div>
          <button
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Lab Equipment Management System
          </h1>
          <p className="text-gray-600 mb-4">
            Individual equipment tracking with unique codes and credentials
          </p>

          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">
                {equipmentState.length}
              </div>
              <div className="text-sm text-blue-800">Total Equipment</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {equipmentState.filter((e) => e.status === "active").length}
              </div>
              <div className="text-sm text-green-800">Active</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {
                  equipmentState.filter((e) => e.status === "maintenance")
                    .length
                }
              </div>
              <div className="text-sm text-yellow-800">Maintenance</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {equipmentState.filter((e) => e.status === "damaged").length}
              </div>
              <div className="text-sm text-red-800">Damaged</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search by name or code..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="flex flex-col sm:flex-row gap-3">
              <select
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Types</option>
                {getUniqueTypes().map((type) => (
                  <option key={type} value={type}>
                    {getCategoryDisplayName(type)}
                  </option>
                ))}
              </select>
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="all">All Status</option>
                <option value="active">Active</option>
                <option value="maintenance">Maintenance</option>
                <option value="damaged">Damaged</option>
              </select>
            </div>
          </div>
        </div>

        {/* Equipment Categories */}
        <div className="space-y-4">
          {getUniqueTypes().map((type) => {
            const categoryEquipment = groupedEquipment[type];
            const CategoryIcon = getCategoryIcon(type);
            const isCollapsed = collapsedCategories[type];
            const categoryTotal = categoryEquipment.length;
            const categoryActive = categoryEquipment.filter(
              (item) => item.status === "active"
            ).length;

            if (categoryTotal === 0) return null;

            return (
              <div
                key={type}
                className="bg-white rounded-xl border border-gray-200"
              >
                {/* Category Header */}
                <div
                  className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(type)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div
                        className={`w-10 h-10 bg-${categoryEquipment[0]?.color}-100 rounded-lg flex items-center justify-center`}
                      >
                        <CategoryIcon
                          className={`text-${categoryEquipment[0]?.color}-600`}
                          size={20}
                        />
                      </div>
                      <div>
                        <h3 className="text-lg font-semibold text-gray-900">
                          {getCategoryDisplayName(type)}
                        </h3>
                        <p className="text-sm text-gray-600">
                          {categoryTotal} items • {categoryActive} active
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <div className="flex space-x-2">
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {
                            categoryEquipment.filter(
                              (item) => item.status === "active"
                            ).length
                          }{" "}
                          Active
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {
                            categoryEquipment.filter(
                              (item) => item.status === "maintenance"
                            ).length
                          }{" "}
                          Maintenance
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {
                            categoryEquipment.filter(
                              (item) => item.status === "damaged"
                            ).length
                          }{" "}
                          Damaged
                        </span>
                      </div>
                      <div
                        className={`transform transition-transform ${
                          isCollapsed ? "rotate-180" : ""
                        }`}
                      >
                        ▼
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Content */}
                {!isCollapsed && (
                  <div className="p-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                      {categoryEquipment.map((item) => {
                        const Icon = item.icon;
                        const StatusIcon = getStatusIcon(item.status);

                        return (
                          <div
                            key={item.id}
                            className="bg-gray-50 rounded-lg border border-gray-200 hover:shadow-md transition-all cursor-pointer"
                            onClick={() => handleItemClick(item)}
                          >
                            <div className="p-4">
                              {/* Header */}
                              <div className="flex items-center justify-between mb-3">
                                <div
                                  className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}
                                >
                                  <Icon
                                    className={`text-${item.color}-600`}
                                    size={16}
                                  />
                                </div>
                                <div
                                  className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                                    item.status
                                  )}`}
                                >
                                  <div className="flex items-center space-x-1">
                                    <StatusIcon size={10} />
                                    <span className="capitalize">
                                      {item.status}
                                    </span>
                                  </div>
                                </div>
                              </div>

                              {/* Equipment Info */}
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 text-sm">
                                  {item.name}
                                </h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Code:</span>
                                    <span className="font-mono">
                                      {item.code}
                                    </span>
                                  </div>
                                  {(item.type === "monitors" || item.type === "projectors") && (
                                    <div className="flex justify-between items-center">
                                      <span>Password:</span>
                                      <div className="flex items-center space-x-1">
                                        <span className="font-mono">
                                          {showPasswords[item.id] && item.password
                                            ? item.password
                                            : "••••••••"}
                                        </span>
                                        <button
                                          onClick={(e) => {
                                            e.stopPropagation();
                                            togglePasswordVisibility(item.id);
                                          }}
                                          className="text-gray-400 hover:text-gray-600"
                                        >
                                          {showPasswords[item.id] ? <EyeOff size={10} /> : <Eye size={10} />}
                                        </button>
                                      </div>
                                    </div>
                                  )}
                                  {item.description && (
                                    <div className="pt-2 border-t border-gray-200">
                                      <p className="text-xs text-gray-500 line-clamp-2">
                                        {item.description}
                                      </p>
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Equipment Details Modal - Updated with backend integration */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black/30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editMode ? "Edit Equipment" : "Equipment Details"}
                </h3>
                <div className="flex space-x-2">
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                      disabled={saving}
                    >
                      <Edit size={14} className="inline mr-1" />
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                      setSelectedItem(null);
                      setSaveError(null);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={saving}
                  >
                    Close
                  </button>
                </div>
              </div>

              <div className="p-6 space-y-4">
                {/* Show save error if any */}
                {saveError && (
                  <div className="bg-red-50 border border-red-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <AlertTriangle className="text-red-500" size={16} />
                      <span className="text-red-700 text-sm">{saveError}</span>
                    </div>
                  </div>
                )}

                {/* Show success message briefly after save */}
                {!editMode && !saveError && saving === false && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="text-green-500" size={16} />
                      <span className="text-green-700 text-sm">
                        Equipment updated successfully!
                      </span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Equipment Name
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedItem.name}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{selectedItem.name}</p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Equipment Code
                    </label>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedItem.code}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            code: e.target.value,
                          })
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      />
                    ) : (
                      <p className="mt-1 text-gray-900 font-mono">
                        {selectedItem.code}
                      </p>
                    )}
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700">
                      Status
                    </label>
                    {editMode ? (
                      <select
                        value={selectedItem.status}
                        onChange={(e) =>
                          setSelectedItem({
                            ...selectedItem,
                            status: e.target.value,
                          })
                        }
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={saving}
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    ) : (
                      <div className="mt-1">
                        <span
                          className={`inline-flex items-center px-2 py-1 rounded-full text-sm font-medium ${getStatusColor(
                            selectedItem.status
                          )}`}
                        >
                          {React.createElement(
                            getStatusIcon(selectedItem.status),
                            { size: 12, className: "mr-1" }
                          )}
                          <span className="capitalize">
                            {selectedItem.status}
                          </span>
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Password field - only for wifi and monitors */}
                  {(selectedItem.type === "monitors" || selectedItem.type === "wifi") && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Password
                      </label>
                      {editMode ? (
                        <input
                          type="text"
                          value={selectedItem.password || ""}
                          onChange={(e) =>
                            setSelectedItem({
                              ...selectedItem,
                              password: e.target.value,
                            })
                          }
                          className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                          disabled={saving}
                        />
                      ) : (
                        <div className="mt-1 flex items-center space-x-2">
                          <span className="font-mono text-gray-900">
                            {showPasswords[selectedItem.id] && selectedItem.password
                              ? selectedItem.password
                              : "••••••••"}
                          </span>
                          <button
                            onClick={() => togglePasswordVisibility(selectedItem.id)}
                            className="text-gray-400 hover:text-gray-600"
                          >
                            {showPasswords[selectedItem.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Description
                  </label>
                  {editMode ? (
                    <textarea
                      value={selectedItem.description || ""}
                      onChange={(e) =>
                        setSelectedItem({
                          ...selectedItem,
                          description: e.target.value,
                        })
                      }
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add description for this equipment..."
                      disabled={saving}
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">
                      {selectedItem.description || "No description available"}
                    </p>
                  )}
                </div>
              </div>

              {editMode && (
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    onClick={() => {
                      setEditMode(false);
                      setSaveError(null);
                      // Reset selectedItem to original state by finding it in equipmentState
                      const original = equipmentState.find(
                        (item) => item.id === selectedItem.id
                      );
                      if (original) {
                        setSelectedItem({ ...original });
                      }
                    }}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                    disabled={saving}
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    disabled={saving}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                  >
                    {saving ? (
                      <>
                        <Loader className="animate-spin" size={16} />
                        <span>Saving...</span>
                      </>
                    ) : (
                      <>
                        <Save size={16} />
                        <span>Save Changes</span>
                      </>
                    )}
                  </button>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default LabEquipmentManager;