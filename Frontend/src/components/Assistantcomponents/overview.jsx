import React, { useState } from "react";
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
  User,
  MapPin,
  Bell,
  ClipboardList,
  Wrench, // Import an existing icon to replace Tool
} from "lucide-react";

const Overview = ({ inventory = [], labs = [], userRole = "assistant" }) => {
  const [selectedTimeframe, setSelectedTimeframe] = useState("today");

  // Core statistics
  const activeItems = inventory.filter(
    (item) => item.status === "active"
  ).length;
  const maintenanceItems = inventory.filter(
    (item) => item.status === "maintenance"
  ).length;
  const damagedItems = inventory.filter(
    (item) => item.status === "damaged"
  ).length;
  const inactiveItems = inventory.filter(
    (item) => item.status === "inactive"
  ).length;

  // Lab assistant specific metrics
  const pendingTasks = inventory.filter(
    (item) => item.status === "maintenance" || item.status === "damaged"
  ).length;
  const todaysSchedule = inventory.filter(
    (item) => item.nextMaintenance && isToday(item.nextMaintenance)
  ).length;
  const overdueItems = inventory.filter(
    (item) => item.nextMaintenance && isPastDue(item.nextMaintenance)
  ).length;
  const myAssignedLabs = labs.filter((lab) => lab.assistant === "current_user"); // In a real app, this would be dynamic

  const categoryStats = {
    monitors: inventory.filter((item) => item.category === "monitors").length,
    projectors: inventory.filter((item) => item.category === "projectors")
      .length,
    fans: inventory.filter((item) => item.category === "fans").length,
    wifi: inventory.filter((item) => item.category === "wifi").length,
    "switch-boards": inventory.filter(
      (item) => item.category === "switch-boards"
    ).length,
  };

  // Helper functions for date checking
  function isToday(dateString) {
    const today = new Date();
    const checkDate = new Date(dateString);
    return today.toDateString() === checkDate.toDateString();
  }

  function isPastDue(dateString) {
    const today = new Date();
    const checkDate = new Date(dateString);
    return checkDate < today;
  }

  const StatCard = ({
    title,
    value,
    icon: Icon,
    color,
    bgColor,
    action,
    priority,
  }) => (
    <div
      className={`bg-white rounded-xl shadow-sm border-2 ${
        priority === "high" ? "border-red-200" : "border-gray-200"
      } p-6 hover:shadow-md transition-all cursor-pointer`}
    >
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
          {action && (
            <p className="text-xs text-blue-600 mt-1 hover:underline">
              {action}
            </p>
          )}
        </div>
        <div className={`p-3 rounded-lg ${bgColor} relative`}>
          <Icon className={`w-6 h-6 ${color}`} />
          {priority === "high" && (
            <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full animate-pulse"></div>
          )}
        </div>
      </div>
    </div>
  );

  const TaskCard = ({ title, count, icon: Icon, color, urgency, onClick }) => (
    <div
      className={`bg-white rounded-lg border-2 ${
        urgency === "urgent" ? "border-red-200 bg-red-50" : "border-gray-200"
      } p-4 hover:shadow-sm transition-all cursor-pointer`}
      onClick={onClick}
    >
      <div className="flex items-center space-x-3">
        <div className={`p-2 rounded-lg ${color} relative`}>
          <Icon className="w-5 h-5 text-white" />
          {urgency === "urgent" && (
            <Bell className="w-3 h-3 text-red-500 absolute -top-1 -right-1" />
          )}
        </div>
        <div>
          <p
            className={`text-sm ${
              urgency === "urgent" ? "text-red-700" : "text-gray-600"
            }`}
          >
            {title}
          </p>
          <p className="text-xl font-bold text-gray-900">{count}</p>
          {urgency === "urgent" && (
            <p className="text-xs text-red-600 font-medium">Needs Attention</p>
          )}
        </div>
      </div>
    </div>
  );

  const LabCard = ({ lab, isAssigned }) => {
    const labItems = inventory.filter((item) => item.lab === lab.name);
    const activeLabItems = labItems.filter((item) => item.status === "active");
    const issueItems = labItems.filter(
      (item) => item.status === "damaged" || item.status === "maintenance"
    );

    return (
      <div
        className={`p-4 border-2 ${
          isAssigned ? "border-blue-200 bg-blue-50" : "border-gray-200"
        } rounded-lg hover:bg-gray-50 transition-colors cursor-pointer`}
      >
        <div className="flex items-center justify-between">
          <div>
            <div className="flex items-center space-x-2">
              <h4 className="font-medium text-gray-900">{lab.name}</h4>
              {isAssigned && (
                <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
                  Assigned
                </span>
              )}
            </div>
            <p className="text-sm text-gray-600 flex items-center mt-1">
              <MapPin className="w-3 h-3 mr-1" />
              {lab.building} • Floor {lab.floor}
            </p>
            <p className="text-xs text-gray-500 flex items-center">
              <User className="w-3 h-3 mr-1" />
              Incharge: {lab.incharge}
            </p>
          </div>
          <div className="text-right">
            <p className="text-lg font-bold text-gray-900">{labItems.length}</p>
            <p className="text-sm text-gray-600">Total Items</p>
            <div className="flex space-x-2 text-xs mt-1">
              <span className="text-green-600">
                {activeLabItems.length} Active
              </span>
              {issueItems.length > 0 && (
                <span className="text-red-600">{issueItems.length} Issues</span>
              )}
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="space-y-6">
      {/* Priority Tasks - Lab Assistant Focused */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Pending Tasks"
          value={pendingTasks}
          icon={ClipboardList}
          color="text-orange-600"
          bgColor="bg-orange-100"
          priority={pendingTasks > 5 ? "high" : "normal"}
        />
        <StatCard
          title="Total Equipment"
          value={activeItems}
          icon={Package}
          color="text-blue-600"
          bgColor="bg-blue-100"
        />
        <StatCard
          title="Overdue Items"
          value={overdueItems}
          icon={AlertTriangle}
          color="text-red-600"
          bgColor="bg-red-100"
          priority={overdueItems > 0 ? "high" : "normal"}
        />
        <StatCard
          title="Active Equipment"
          value={activeItems}
          icon={CheckCircle}
          color="text-green-600"
          bgColor="bg-green-100"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Immediate Action Required */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">
              Immediate Actions
            </h3>
            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
              Priority
            </span>
          </div>
          <div className="grid grid-cols-1 gap-4">
            <TaskCard
              title="Maintenance Due"
              count={maintenanceItems}
              icon={Wrench} // Use the imported Wrench icon
              color="bg-yellow-500"
              urgency={maintenanceItems > 3 ? "urgent" : "normal"}
              onClick={() => console.log("Navigate to maintenance tasks")}
            />
            <TaskCard
              title="Equipment Issues"
              count={damagedItems}
              icon={AlertTriangle}
              color="bg-red-500"
              urgency={damagedItems > 0 ? "urgent" : "normal"}
              onClick={() => console.log("Navigate to damaged items")}
            />
            <TaskCard
              title="Scheduled Today"
              count={todaysSchedule}
              icon={Clock}
              color="bg-blue-500"
              onClick={() => console.log("Navigate to today's schedule")}
            />
          </div>
        </div>

        {/* Equipment Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Equipment Status
          </h3>
          <div className="grid grid-cols-1 gap-3">
            {Object.entries(categoryStats).map(([category, count]) => {
              const categoryIcons = {
                monitors: Monitor,
                projectors: Projector,
                fans: Fan,
                wifi: Wifi,
                "switch-boards": Zap,
              };
              const categoryColors = {
                monitors: "bg-blue-500",
                projectors: "bg-purple-500",
                fans: "bg-cyan-500",
                wifi: "bg-green-500",
                "switch-boards": "bg-orange-500",
              };
              const Icon = categoryIcons[category];
              const issuesInCategory = inventory.filter(
                (item) =>
                  item.category === category &&
                  (item.status === "damaged" || item.status === "maintenance")
              ).length;
              return (
                <div
                  key={category}
                  className="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div className="flex items-center space-x-3">
                    <div
                      className={`p-2 rounded-lg ${categoryColors[category]}`}
                    >
                      <Icon className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900 capitalize">
                        {category.replace("-", " ")}
                      </p>
                      <p className="text-xs text-gray-500">
                        {count} total items
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    {issuesInCategory > 0 && (
                      <span className="px-2 py-1 bg-red-100 text-red-700 text-xs rounded-full">
                        {issuesInCategory} issues
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Today's Activity Log */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">
            Today's Activity
          </h3>
          <select
            value={selectedTimeframe}
            onChange={(e) => setSelectedTimeframe(e.target.value)}
            className="text-sm border border-gray-300 rounded-md px-3 py-1"
          >
            <option value="today">Today</option>
            <option value="week">This Week</option>
            <option value="month">This Month</option>
          </select>
        </div>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg border-l-4 border-green-400">
            <CheckCircle className="w-5 h-5 text-green-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium">
                Completed maintenance: Monitor #M-045
              </p>
              <p className="text-xs text-gray-500">
                Computer Lab A • 30 minutes ago
              </p>
            </div>
            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
              Completed
            </span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg border-l-4 border-blue-400">
            <Wrench className="w-5 h-5 text-blue-500" />{" "}
            {/* Use the imported Wrench icon */}
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium">
                Started maintenance: Projector #P-012
              </p>
              <p className="text-xs text-gray-500">Physics Lab • 1 hour ago</p>
            </div>
            <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full">
              In Progress
            </span>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg border-l-4 border-yellow-400">
            <AlertTriangle className="w-5 h-5 text-yellow-500" />
            <div className="flex-1">
              <p className="text-sm text-gray-900 font-medium">
                Reported issue: WiFi connectivity problems
              </p>
              <p className="text-xs text-gray-500">
                Chemistry Lab • 2 hours ago
              </p>
            </div>
            <span className="px-2 py-1 bg-yellow-100 text-yellow-700 text-xs rounded-full">
              Pending
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
