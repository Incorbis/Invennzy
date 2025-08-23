import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  Monitor,
  Projector,
  Fan,
  Wifi,
  Zap,
  Loader,
  RefreshCw,
  Building,
  User,
  UserCheck,
  MapPin,
  Users,
} from "lucide-react";

const Overview = () => {
  const [equipmentState, setEquipmentState] = useState([]);
  const [labsData, setLabsData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Fetch lab details assigned to the current staff member
  const fetchLabsData = async () => {
    try {
      const adminId = localStorage.getItem("adminId");
      const labsResponse = await axios.get(
        `http://localhost:3000/api/labs/admin/${adminId}`
      );

      const allLabs = labsResponse.data || [];

      // get current user info
      const staffName = localStorage.getItem("userName");
      const staffEmail = JSON.parse(localStorage.getItem("user"))?.email;

      // filter labs where this staff is incharge or assistant
      const assignedLabs = allLabs.filter(
        lab =>
          lab.incharge_name?.toLowerCase() === staffName?.toLowerCase() ||
          lab.incharge_email === staffEmail ||
          lab.assistant_name?.toLowerCase() === staffName?.toLowerCase() ||
          lab.assistant_email === staffEmail
      );

      console.log("Assigned labs:", assignedLabs);
      return assignedLabs;
    } catch (err) {
      console.error("Error fetching labs:", err);
      throw err;
    }
  };

  // Fetch equipment data
  const fetchEquipmentData = async (showRefreshIndicator = false) => {
    try {
      if (showRefreshIndicator) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      // Get staffId from localStorage with multiple fallback options
      let staffId = localStorage.getItem("staffId") || 
                   localStorage.getItem("id") || 
                   localStorage.getItem("adminId");
      
      const userObj = localStorage.getItem("user");
      if (!staffId && userObj) {
        try {
          const parsed = JSON.parse(userObj);
          staffId = parsed.id || parsed.staffId || parsed.staff_id || parsed.adminId;
        } catch (e) {
          console.warn("Failed to parse user object:", e);
        }
      }

      // Hardcode for testing if no ID found
      if (!staffId) {
        console.warn("No staffId found, using fallback ID");
        staffId = "4"; // Remove this line in production
      }

      console.log("Using staffId for overview:", staffId);

      // Fetch both equipment and labs data
      const [equipData, labsData] = await Promise.all([
        staffId ? 
          axios.get(`/api/labinchargeassistant/labs/equipment/by-staff/${staffId}`)
            .catch(err => {
              console.warn("Equipment endpoint failed:", err);
              return { data: { counts: {}, grouped: {} } };
            }) 
          : Promise.resolve({ data: { counts: {}, grouped: {} } }),
        staffId ? fetchLabsData(staffId) : []
      ]);

      // Process equipment data
      let equipmentList = [];
      if (equipData && equipData.data) {
        const types = ["monitors", "projectors", "switch_boards", "fans", "wifi"];
        const countsByType = equipData.data.counts || {};
        const detailsByType = equipData.data.grouped || {};

        // Ensure every type has numeric count and array
        types.forEach((t) => {
          countsByType[t] = Number(countsByType[t] || 0);
          detailsByType[t] = detailsByType[t] || [];
        });

        // Map DB status -> frontend status
        const mapStatus = (dbStatus) => {
          if (dbStatus === "0" || dbStatus === 0) return "active";
          if (dbStatus === "2" || dbStatus === 2) return "maintenance";
          if (dbStatus === "1" || dbStatus === 1) return "damaged";
          if (["active", "working", "ok"].includes(String(dbStatus).toLowerCase())) return "active";
          if (["maintenance", "repair"].includes(String(dbStatus).toLowerCase())) return "maintenance";
          if (["damaged", "broken", "inactive"].includes(String(dbStatus).toLowerCase())) return "damaged";
          return "active";
        };

        // Build final equipment list
        types.forEach((key) => {
          const detailsArr = detailsByType[key] || [];
          detailsArr.forEach((detail, i) => {
            const item = {
              id: detail.equipment_id,
              type: key,
              category: key,
              name: detail.equipment_name || `${key} ${i + 1}`,
              code: detail.equipment_code || `${key.toUpperCase()}-${String(i + 1).padStart(3, "0")}`,
              status: mapStatus(detail.equipment_status || detail.status),
              password: detail.equipment_password || "",
              description: detail.equipment_description || `${key} unit ${i + 1}`,
              lab: detail.lab_name || "Unknown Lab",
              lab_no: detail.lab_no || "Unknown",
              building: detail.building || "Unknown Building",
              floor: detail.floor || "Unknown Floor",
              incharge: detail.incharge_name || "Unknown",
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
      }

      console.log("Final equipment list for overview:", equipmentList);
      setEquipmentState(equipmentList);

      // Process labs data - handle both admin and staff response formats
      console.log("Raw labs data:", labsData);
      
      const processedLabs = labsData.map(lab => {
        // Handle different response formats
        const labData = {
          id: lab.id,
          lab_no: lab.lab_no || lab.labNo,
          name: lab.lab_name || lab.labName || lab.name,
          building: lab.building,
          floor: lab.floor,
          capacity: lab.capacity || 0,
          incharge_name: lab.incharge_name || lab.inchargeName || "Not assigned",
          assistant_name: lab.assistant_name || lab.assistantName || "Not assigned",
          status: lab.status || "active",
          equipmentCount: 0, // Will be calculated from equipment data
          activeEquipmentCount: 0, // Will be calculated from equipment data
          last_updated: lab.last_updated || lab.lastUpdated || new Date().toISOString()
        };

        // Calculate equipment counts for this lab from the equipment data
        const labEquipment = equipmentList.filter(item => 
          item.lab_no === labData.lab_no || 
          item.lab === labData.name ||
          item.lab === labData.lab_no
        );
        
        labData.equipmentCount = labEquipment.length;
        labData.activeEquipmentCount = labEquipment.filter(item => item.status === "active").length;

        return labData;
      });

      console.log("Processed labs data:", processedLabs);
      setLabsData(processedLabs);
      setError(null);
      setLastRefresh(new Date());
      
    } catch (err) {
      console.error("Error loading overview data:", err);
      setError(err.response?.data?.message || err.message || "Failed to load data");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchEquipmentData();
  }, []);

  // Auto-refresh every 30 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      fetchEquipmentData(true); // Show refresh indicator
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Manual refresh function
  const handleManualRefresh = () => {
    fetchEquipmentData(true);
  };

  // Calculate statistics
  const activeItems = equipmentState.filter(
    (item) => item.status === "active"
  ).length;
  const maintenanceItems = equipmentState.filter(
    (item) => item.status === "maintenance"
  ).length;
  const damagedItems = equipmentState.filter(
    (item) => item.status === "damaged"
  ).length;
  const inactiveItems = equipmentState.filter(
    (item) => item.status === "inactive"
  ).length;

  const categoryStats = {
    monitors: equipmentState.filter((item) => item.category === "monitors").length,
    projectors: equipmentState.filter((item) => item.category === "projectors").length,
    fans: equipmentState.filter((item) => item.category === "fans").length,
    wifi: equipmentState.filter((item) => item.category === "wifi").length,
    "switch_boards": equipmentState.filter((item) => item.category === "switch_boards").length,
  };

  const StatCard = ({ title, value, icon: Icon, color, bgColor }) => (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className={`p-3 rounded-lg ${bgColor}`}>
          <Icon className={`w-6 h-6 ${color}`} />
        </div>
      </div>
    </div>
  );

  const CategoryCard = ({ title, count, icon: Icon, color }) => (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-sm transition-shadow">
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color}`}>
          <Icon className="w-5 h-5 text-white" />
        </div>
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-xl font-bold text-gray-900">{count}</p>
        </div>
      </div>
    </div>
  );

  const getStatusColor = (status) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800 border-green-200";
      case "maintenance":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "inactive":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  // Loading state
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading overview data...</p>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center max-w-md">
          <AlertTriangle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Error Loading Overview
          </h2>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <button
            onClick={() => fetchEquipmentData()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header with refresh button */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard Overview</h1>
          <p className="text-gray-600">Real-time equipment and lab statistics</p>
        </div>
        <div className="flex items-center space-x-3">
          {lastRefresh && (
            <p className="text-sm text-gray-500">
              Last updated: {lastRefresh.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={handleManualRefresh}
            disabled={refreshing}
            className="flex items-center space-x-2 px-3 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
            <span>{refreshing ? 'Refreshing...' : 'Refresh'}</span>
          </button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={equipmentState.length}
          icon={Package}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Active"
          value={activeItems}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-100"
        />
        <StatCard
          title="Maintenance"
          value={maintenanceItems}
          icon={Clock}
          color="text-yellow-600"
          bgColor="bg-yellow-100"
        />
        <StatCard
          title="Issues"
          value={damagedItems + inactiveItems}
          icon={AlertTriangle}
          color="text-red-600"
          bgColor="bg-red-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Equipment Categories */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Equipment Categories
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <CategoryCard
              title="Monitors"
              count={categoryStats.monitors}
              icon={Monitor}
              color="bg-blue-500"
            />
            <CategoryCard
              title="Projectors"
              count={categoryStats.projectors}
              icon={Projector}
              color="bg-purple-500"
            />
            <CategoryCard
              title="Fans"
              count={categoryStats.fans}
              icon={Fan}
              color="bg-cyan-500"
            />
            <CategoryCard
              title="WiFi"
              count={categoryStats.wifi}
              icon={Wifi}
              color="bg-green-500"
            />
            <CategoryCard
              title="Switch Boards"
              count={categoryStats["switch_boards"]}
              icon={Zap}
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Labs Overview - Enhanced to show all lab details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Building className="w-5 h-5 mr-2 text-blue-600" />
            My Assigned Labs ({labsData.length})
          </h3>
          <div className="space-y-4 max-h-96 overflow-y-auto">
            {labsData.length > 0 ? (
              labsData.slice(0, 10).map((lab) => (
                <div
                  key={lab.id}
                  className="flex flex-col p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  {/* Lab Header */}
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <h4 className="font-semibold text-gray-900 text-base">
                          {lab.lab_no}
                        </h4>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getStatusColor(lab.status)}`}>
                          {lab.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-800 font-medium mb-1">
                        {lab.name}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <MapPin className="w-3 h-3 mr-1" />
                        {lab.building} • Floor {lab.floor}
                        {lab.capacity > 0 && (
                          <>
                            <Users className="w-3 h-3 ml-2 mr-1" />
                            Capacity: {lab.capacity}
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                  
                  {/* Staff Information */}
                  <div className="border-t pt-3 space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <UserCheck className="w-4 h-4 mr-2 text-green-600" />
                        <span className="font-medium text-gray-700">Lab In-charge:</span>
                      </div>
                      <span className="text-gray-900 truncate ml-2 max-w-40">
                        {lab.incharge_name}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <User className="w-4 h-4 mr-2 text-blue-600" />
                        <span className="font-medium text-gray-700">Lab Assistant:</span>
                      </div>
                      <span className="text-gray-900 truncate ml-2 max-w-40">
                        {lab.assistant_name}
                      </span>
                    </div>
                  </div>

                  {/* Equipment Summary for this lab */}
                  {(lab.monitors > 0 || lab.projectors > 0 || lab.fans > 0 || lab.wifi > 0 || lab.switch_boards > 0) && (
                    <div className="border-t pt-3 mt-3">
                      <p className="text-xs font-medium text-gray-700 mb-2">Equipment Inventory:</p>
                      <div className="flex items-center space-x-4 text-xs">
                        {lab.monitors > 0 && (
                          <div className="flex items-center text-blue-600">
                            <Monitor className="w-3 h-3 mr-1" />
                            <span className="font-medium">{lab.monitors}</span>
                          </div>
                        )}
                        {lab.projectors > 0 && (
                          <div className="flex items-center text-purple-600">
                            <Projector className="w-3 h-3 mr-1" />
                            <span className="font-medium">{lab.projectors}</span>
                          </div>
                        )}
                        {lab.switch_boards > 0 && (
                          <div className="flex items-center text-yellow-600">
                            <Zap className="w-3 h-3 mr-1" />
                            <span className="font-medium">{lab.switch_boards}</span>
                          </div>
                        )}
                        {lab.fans > 0 && (
                          <div className="flex items-center text-green-600">
                            <Fan className="w-3 h-3 mr-1" />
                            <span className="font-medium">{lab.fans}</span>
                          </div>
                        )}
                        {lab.wifi > 0 && (
                          <div className="flex items-center text-indigo-600">
                            <Wifi className="w-3 h-3 mr-1" />
                            <span className="font-medium">{lab.wifi}</span>
                          </div>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Last Updated */}
                  {lab.last_updated && (
                    <div className="mt-3 pt-2 border-t">
                      <p className="text-xs text-gray-500">
                        Last updated: {new Date(lab.last_updated).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className="text-center text-gray-500 py-8">
                <Building className="w-8 h-8 mx-auto mb-2 text-gray-400" />
                <p className="text-sm">No labs assigned to you</p>
                <p className="text-xs text-gray-400 mt-1">Contact admin to get lab assignments</p>
              </div>
            )}
            {labsData.length > 10 && (
              <div className="text-center pt-2">
                <p className="text-xs text-gray-500">
                  Showing 10 of {labsData.length} assigned labs
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Recent Activity - Dynamic based on equipment status changes */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Equipment Status Summary
        </h3>
        <div className="space-y-3">
          {equipmentState.filter(item => item.status === "maintenance").slice(0, 3).map((item, index) => (
            <div key={`maintenance-${index}`} className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
              <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {item.name} in {item.lab} requires maintenance
                </p>
                <p className="text-xs text-gray-500">Code: {item.code} • {item.building} - {item.floor}</p>
              </div>
            </div>
          ))}
          
          {equipmentState.filter(item => item.status === "damaged").slice(0, 2).map((item, index) => (
            <div key={`damaged-${index}`} className="flex items-center space-x-4 p-3 bg-red-50 rounded-lg">
              <div className="w-2 h-2 bg-red-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {item.name} in {item.lab} is damaged
                </p>
                <p className="text-xs text-gray-500">Code: {item.code} • {item.building} - {item.floor}</p>
              </div>
            </div>
          ))}

          {equipmentState.filter(item => item.status === "active").slice(0, 2).map((item, index) => (
            <div key={`active-${index}`} className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <div className="flex-1">
                <p className="text-sm text-gray-900">
                  {item.name} in {item.lab} is operational
                </p>
                <p className="text-xs text-gray-500">Code: {item.code} • {item.building} - {item.floor}</p>
              </div>
            </div>
          ))}

          {equipmentState.length === 0 && (
            <div className="text-center text-gray-500 py-4">
              <p>No equipment data available</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Overview;