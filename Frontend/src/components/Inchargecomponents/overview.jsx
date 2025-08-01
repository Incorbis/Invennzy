import React from "react";
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
} from "lucide-react";

const Overview = ({ inventory = [], labs = [] }) => {
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

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatCard
          title="Total Items"
          value={inventory.length}
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
              count={categoryStats["switch-boards"]}
              icon={Zap}
              color="bg-orange-500"
            />
          </div>
        </div>

        {/* Labs Overview */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Labs Overview
          </h3>
          <div className="space-y-4">
            {labs.slice(0, 5).map((lab) => {
              const labItems = inventory.filter(
                (item) => item.lab === lab.name
              );
              const activeLabItems = labItems.filter(
                (item) => item.status === "active"
              );

              return (
                <div
                  key={lab.id}
                  className="flex items-center justify-between p-4 border border-gray-200 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <div>
                    <h4 className="font-medium text-gray-900">{lab.name}</h4>
                    <p className="text-sm text-gray-600">
                      {lab.building} • Floor {lab.floor}
                    </p>
                    <p className="text-xs text-gray-500">
                      Incharge: {lab.incharge}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-bold text-gray-900">
                      {labItems.length}
                    </p>
                    <p className="text-sm text-gray-600">Total Items</p>
                    <p className="text-xs text-green-600">
                      {activeLabItems.length} Active
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Recent Activity
        </h3>
        <div className="space-y-3">
          <div className="flex items-center space-x-4 p-3 bg-blue-50 rounded-lg">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                New monitor added to Computer Lab A
              </p>
              <p className="text-xs text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-yellow-50 rounded-lg">
            <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                Samsung monitor scheduled for maintenance
              </p>
              <p className="text-xs text-gray-500">5 hours ago</p>
            </div>
          </div>
          <div className="flex items-center space-x-4 p-3 bg-green-50 rounded-lg">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm text-gray-900">
                WiFi router issue resolved in Physics Lab
              </p>
              <p className="text-xs text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
