import React, { useState, useEffect } from 'react';
import {
  Package,
  AlertTriangle,
  CheckCircle,
  Clock,
  TrendingUp,
  TrendingDown,
  Monitor,
  Wifi,
  Printer,
  Projector,
  Laptop,
  Smartphone,
  MapPin,
  Calendar,
  Users,
  Activity,
  RefreshCw,
  Filter,
  Download,
  Eye,
  Edit,
  Trash2,
  Plus
} from 'lucide-react';

const Overview = () => {
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedFilter, setSelectedFilter] = useState('all');
  const [refreshing, setRefreshing] = useState(false);

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockDevices = [
      {
        id: '1',
        name: 'Classroom Projector A1',
        type: 'projector',
        location: 'Room A-101',
        status: 'active',
        lastChecked: '2024-01-15T10:30:00Z',
        assignedTo: 'Prof. Smith'
      },
      {
        id: '2',
        name: 'Lab Computer #15',
        type: 'computer',
        location: 'Computer Lab B',
        status: 'maintenance',
        lastChecked: '2024-01-14T15:45:00Z'
      },
      {
        id: '3',
        name: 'WiFi Router - Floor 2',
        type: 'network',
        location: 'Floor 2 Corridor',
        status: 'critical',
        lastChecked: '2024-01-15T09:15:00Z'
      },
      {
        id: '4',
        name: 'Library Printer',
        type: 'printer',
        location: 'Main Library',
        status: 'active',
        lastChecked: '2024-01-15T11:00:00Z'
      },
      {
        id: '5',
        name: 'Student Laptop Cart',
        type: 'laptop',
        location: 'Storage Room C',
        status: 'inactive',
        lastChecked: '2024-01-13T16:20:00Z'
      }
    ];

    setTimeout(() => {
      setDevices(mockDevices);
      setLoading(false);
    }, 1000);
  }, []);

  const metrics = [
    {
      title: 'Total Devices',
      value: '1,247',
      change: '+12 this month',
      trend: 'up',
      icon: Package,
      color: 'bg-blue-500'
    },
    {
      title: 'Active Devices',
      value: '1,089',
      change: '87.3% operational',
      trend: 'up',
      icon: CheckCircle,
      color: 'bg-green-500'
    },
    {
      title: 'Maintenance Required',
      value: '23',
      change: '-5 from last week',
      trend: 'down',
      icon: AlertTriangle,
      color: 'bg-yellow-500'
    },
    {
      title: 'Critical Issues',
      value: '8',
      change: '+2 urgent',
      trend: 'up',
      icon: AlertTriangle,
      color: 'bg-red-500'
    }
  ];

  const getDeviceIcon = (type) => {
    switch (type) {
      case 'computer': return Monitor;
      case 'projector': return Projector;
      case 'printer': return Printer;
      case 'network': return Wifi;
      case 'laptop': return Laptop;
      default: return Package;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800';
      case 'inactive': return 'bg-gray-100 text-gray-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 2000);
  };

  const filteredDevices = devices.filter(device =>
    selectedFilter === 'all' || device.status === selectedFilter
  );

  const recentActivities = [
    {
      id: 1,
      action: 'Device Added',
      device: 'Smart Board - Room C-205',
      user: 'Admin',
      time: '2 hours ago',
      type: 'success'
    },
    {
      id: 2,
      action: 'Maintenance Completed',
      device: 'Lab Computer #12',
      user: 'Tech Support',
      time: '4 hours ago',
      type: 'info'
    },
    {
      id: 3,
      action: 'Critical Alert',
      device: 'Server Room AC Unit',
      user: 'System',
      time: '6 hours ago',
      type: 'error'
    },
    {
      id: 4,
      action: 'Device Relocated',
      device: 'Portable Projector #3',
      user: 'Prof. Johnson',
      time: '1 day ago',
      type: 'info'
    }
  ];

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
              <div className="animate-pulse">
                <div className="w-12 h-12 bg-gray-300 rounded-lg mb-4"></div>
                <div className="h-4 bg-gray-300 rounded mb-2"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-3 bg-gray-300 rounded w-2/3"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Inventory Overview</h2>
          <p className="text-gray-600">Monitor and manage all college devices and equipment</p>
        </div>
        <div className="flex items-center space-x-3">
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            <RefreshCw className={`mr-2 h-4 w-4 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Download className="mr-2 h-4 w-4" />
            Export
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
            <Plus className="mr-2 h-4 w-4" />
            Add Device
          </button>
        </div>
      </div>

      {/* Metrics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric, index) => (
          <div key={index} className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
            <div className="flex items-center justify-between">
              <div className={`${metric.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                <metric.icon className="text-white" size={24} />
              </div>
              <div className={`flex items-center text-sm ${
                metric.trend === 'up' ? 'text-green-600' :
                metric.trend === 'down' ? 'text-red-600' : 'text-gray-600'
              }`}>
                {metric.trend === 'up' ? <TrendingUp size={16} /> :
                 metric.trend === 'down' ? <TrendingDown size={16} /> : null}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-sm font-medium text-gray-600">{metric.title}</h3>
              <p className="text-2xl font-bold text-gray-900 mt-1">{metric.value}</p>
              <p className="text-sm text-gray-500 mt-1">{metric.change}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Device List */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
              <h3 className="text-lg font-semibold text-gray-900">Recent Devices</h3>
              <div className="flex items-center space-x-3">
                <select
                  value={selectedFilter}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="all">All Status</option>
                  <option value="active">Active</option>
                  <option value="maintenance">Maintenance</option>
                  <option value="inactive">Inactive</option>
                  <option value="critical">Critical</option>
                </select>
                <button className="p-2 border border-gray-300 rounded-lg hover:bg-gray-50">
                  <Filter size={16} />
                </button>
              </div>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Device</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Last Checked</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredDevices.map((device) => {
                  const DeviceIcon = getDeviceIcon(device.type);
                  return (
                    <tr key={device.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center mr-3">
                            <DeviceIcon className="text-gray-600" size={20} />
                          </div>
                          <div>
                            <div className="text-sm font-medium text-gray-900">{device.name}</div>
                            <div className="text-sm text-gray-500 capitalize">{device.type}</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="mr-1" size={14} />
                          {device.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full capitalize ${getStatusColor(device.status)}`}>
                          {device.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        <div className="flex items-center">
                          <Clock className="mr-1" size={14} />
                          {new Date(device.lastChecked).toLocaleDateString()}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex items-center space-x-2">
                          <button className="text-blue-600 hover:text-blue-900">
                            <Eye size={16} />
                          </button>
                          <button className="text-gray-600 hover:text-gray-900">
                            <Edit size={16} />
                          </button>
                          <button className="text-red-600 hover:text-red-900">
                            <Trash2 size={16} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Recent Activities */}
        <div className="bg-white rounded-xl border border-gray-200">
          <div className="p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 flex items-center">
              <Activity className="mr-2" size={20} />
              Recent Activities
            </h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`w-2 h-2 rounded-full mt-2 ${
                    activity.type === 'success' ? 'bg-green-500' :
                    activity.type === 'error' ? 'bg-red-500' : 'bg-blue-500'
                  }`}></div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900">{activity.action}</p>
                    <p className="text-sm text-gray-600">{activity.device}</p>
                    <div className="flex items-center mt-1 text-xs text-gray-500">
                      <Users className="mr-1" size={12} />
                      {activity.user} • {activity.time}
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <button className="w-full mt-4 text-sm text-blue-600 hover:text-blue-800 font-medium">
              View All Activities
            </button>
          </div>
        </div>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Device Categories</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">12</p>
            </div>
            <Package className="text-blue-500" size={32} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Computers</span>
              <span className="font-medium">342</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Projectors</span>
              <span className="font-medium">89</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Network Equipment</span>
              <span className="font-medium">156</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Locations</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">45</p>
            </div>
            <MapPin className="text-green-500" size={32} />
          </div>
          <div className="mt-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Classrooms</span>
              <span className="font-medium">28</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Labs</span>
              <span className="font-medium">12</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-600">Common Areas</span>
              <span className="font-medium">5</span>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900 mt-1">94%</p>
            </div>
            <TrendingUp className="text-purple-500" size={32} />
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm mb-2">
              <span className="text-gray-600">Uptime</span>
              <span className="font-medium">94.2%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div className="bg-purple-500 h-2 rounded-full" style={{ width: '94.2%' }}></div>
            </div>
            <p className="text-xs text-gray-500 mt-2">+2.1% from last month</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
