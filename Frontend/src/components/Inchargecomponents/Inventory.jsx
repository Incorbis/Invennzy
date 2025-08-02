import React, { useState, useMemo } from 'react';
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
  Laptop
} from 'lucide-react';

const LabEquipmentManager = () => {
  // Generate random equipment data - using useMemo to prevent regeneration
  const equipment = useMemo(() => {
    const types = [
      { name: 'monitors', icon: Monitor, color: 'blue', count: Math.floor(Math.random() * 15) + 8 },
      { name: 'projectors', icon: Projector, color: 'purple', count: Math.floor(Math.random() * 6) + 3 },
      { name: 'switch_boards', icon: Zap, color: 'yellow', count: Math.floor(Math.random() * 8) + 4 },
      { name: 'fans', icon: Fan, color: 'green', count: Math.floor(Math.random() * 12) + 8 },
      { name: 'wifi_routers', icon: Wifi, color: 'indigo', count: Math.floor(Math.random() * 8) + 4 },
    ];

    const monitorDescriptions = [
      "24-inch LED monitor with 1920x1080 resolution, ideal for programming and design work",
      "27-inch 4K UHD monitor with IPS panel, perfect for detailed graphics and video editing",
      "22-inch budget-friendly monitor with VGA and HDMI inputs for basic computing tasks",
      "32-inch curved monitor with ultra-wide aspect ratio for immersive viewing experience",
      "21.5-inch compact monitor with adjustable stand, suitable for space-constrained setups",
      "25-inch gaming monitor with 144Hz refresh rate and low input lag for smooth performance",
      "23-inch professional monitor with color accuracy certification for design work",
      "28-inch monitor with USB-C connectivity and built-in speakers for modern workstations",
      "26-inch monitor with blue light filter and flicker-free technology for eye comfort",
      "29-inch ultrawide monitor with split-screen functionality for multitasking"
    ];

    const statuses = ['Active', 'Maintenance', 'Damaged'];
    const locations = ['Lab A', 'Lab B', 'Lab C', 'Conference Room', 'Server Room', 'Reception', 'Office 101', 'Office 102'];
    
    const generateCode = (type, index) => {
      const prefix = type.toUpperCase().substring(0, 3);
      return `${prefix}-${String(index + 1).padStart(3, '0')}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
    };

    const generatePassword = () => {
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
      return Array.from({length: 8}, () => chars[Math.floor(Math.random() * chars.length)]).join('');
    };

    let equipmentList = [];
    
    types.forEach(type => {
      for (let i = 0; i < type.count; i++) {
        const randomStatus = statuses[Math.floor(Math.random() * statuses.length)];
        const hasPassword = ['monitors', 'wifi_routers'].includes(type.name);
        
        equipmentList.push({
          id: `${type.name}_${i + 1}`,
          type: type.name,
          name: `${type.name.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())} ${i + 1}`,
          code: generateCode(type.name, i),
          status: randomStatus.toLowerCase(), // Convert to lowercase for consistency
          location: locations[Math.floor(Math.random() * locations.length)],
          password: hasPassword ? generatePassword() : null,
          description: type.name === 'monitors' ? monitorDescriptions[i % monitorDescriptions.length] : null,
          lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
          purchaseDate: new Date(Date.now() - Math.random() * 1095 * 24 * 60 * 60 * 1000).toISOString(),
          warranty: Math.random() > 0.5,
          notes: Math.random() > 0.7 ? 'Requires attention' : '',
          icon: type.icon,
          color: type.color
        });
      }
    });

    return equipmentList.sort((a, b) => a.type.localeCompare(b.type));
  }, []); // Empty dependency array ensures this only runs once

  const [equipmentState, setEquipmentState] = useState(equipment);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [editMode, setEditMode] = useState(false);
  
  // Initialize all categories as collapsed
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    const types = ['monitors', 'projectors', 'switch_boards', 'fans', 'wifi_routers'];
    return Object.fromEntries(types.map(type => [type, true]));
  });

  const togglePasswordVisibility = (itemId) => {
    setShowPasswords(prev => ({
      ...prev,
      [itemId]: !prev[itemId]
    }));
  };

  const toggleCategory = (category) => {
    setCollapsedCategories(prev => {
      const isCurrentlyCollapsed = prev[category];
      // Collapse all categories first
      const newCollapsed = Object.fromEntries(
        Object.keys(prev).map(key => [key, true])
      );
      // Toggle the clicked one
      return {
        ...newCollapsed,
        [category]: !isCurrentlyCollapsed
      };
    });
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return 'bg-green-100 text-green-800 border-green-200';
      case 'maintenance': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'damaged': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active': return CheckCircle;
      case 'maintenance': return Clock;
      case 'damaged': return AlertTriangle;
      default: return AlertTriangle;
    }
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
    setShowModal(true);
    setEditMode(false);
  };

  const handleSaveEdit = () => {
    if (selectedItem) {
      setEquipmentState(prev => prev.map(item => 
        item.id === selectedItem.id ? selectedItem : item
      ));
      setEditMode(false);
    }
  };

  const filteredEquipment = equipmentState.filter(item => {
    const matchesSearch = 
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.location.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || item.status === filterStatus;
    const matchesType = filterType === 'all' || item.type === filterType;
    
    return matchesSearch && matchesStatus && matchesType;
  });

  const getUniqueTypes = () => {
    const types = ['monitors', 'projectors', 'switch_boards', 'fans', 'wifi_routers'];
    return types;
  };

  const groupEquipmentByType = (equipmentList) => {
    const grouped = {};
    const types = getUniqueTypes();
    
    types.forEach(type => {
      grouped[type] = equipmentList.filter(item => item.type === type);
    });
    
    return grouped;
  };

  const getTypeSummary = () => {
    const summary = {};
    equipmentState.forEach(item => {
      if (!summary[item.type]) {
        summary[item.type] = { total: 0, active: 0, maintenance: 0, damaged: 0 };
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
      'monitors': 'Monitors',
      'projectors': 'Projectors', 
      'switch_boards': 'Switch Boards',
      'fans': 'Fans',
      'wifi_routers': 'WiFi Routers',
    };
    return names[type] || type;
  };

  const getCategoryIcon = (type) => {
    const icons = {
      'monitors': Monitor,
      'projectors': Projector,
      'switch_boards': Zap,
      'fans': Fan,
      'wifi_routers': Wifi,
    };
    return icons[type] || Monitor;
  };

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Lab Equipment Management System</h1>
          <p className="text-gray-600 mb-4">Individual equipment tracking with unique codes and credentials</p>
          
          {/* Summary Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-blue-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{equipmentState.length}</div>
              <div className="text-sm text-blue-800">Total Equipment</div>
            </div>
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {equipmentState.filter(e => e.status === 'active').length}
              </div>
              <div className="text-sm text-green-800">Active</div>
            </div>
            <div className="bg-yellow-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">
                {equipmentState.filter(e => e.status === 'maintenance').length}
              </div>
              <div className="text-sm text-yellow-800">Maintenance</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-2xl font-bold text-red-600">
                {equipmentState.filter(e => e.status === 'damaged').length}
              </div>
              <div className="text-sm text-red-800">Damaged</div>
            </div>
          </div>
        </div>

        {/* Search and Filters */}
        <div className="bg-white p-6 rounded-xl border border-gray-200">
          <div className="flex flex-col lg:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                placeholder="Search by name, code, or location..."
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
                {getUniqueTypes().map(type => (
                  <option key={type} value={type}>
                    {type.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase())}
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
          {getUniqueTypes().map(type => {
            const categoryEquipment = groupedEquipment[type];
            const CategoryIcon = getCategoryIcon(type);
            const isCollapsed = collapsedCategories[type];
            const categoryTotal = categoryEquipment.length;
            const categoryActive = categoryEquipment.filter(item => item.status === 'active').length;
            
            if (categoryTotal === 0) return null;
            
            return (
              <div key={type} className="bg-white rounded-xl border border-gray-200">
                {/* Category Header */}
                <div 
                  className="p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 transition-colors"
                  onClick={() => toggleCategory(type)}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className={`w-10 h-10 bg-${equipmentState.find(e => e.type === type)?.color}-100 rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className={`text-${equipmentState.find(e => e.type === type)?.color}-600`} size={20} />
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
                          {categoryEquipment.filter(item => item.status === 'active').length} Active
                        </span>
                        <span className="px-2 py-1 bg-yellow-100 text-yellow-800 text-xs rounded-full">
                          {categoryEquipment.filter(item => item.status === 'maintenance').length} Maintenance
                        </span>
                        <span className="px-2 py-1 bg-red-100 text-red-800 text-xs rounded-full">
                          {categoryEquipment.filter(item => item.status === 'damaged').length} Damaged
                        </span>
                      </div>
                      <div className={`transform transition-transform ${isCollapsed ? 'rotate-180' : ''}`}>
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
                                <div className={`w-8 h-8 bg-${item.color}-100 rounded-lg flex items-center justify-center`}>
                                  <Icon className={`text-${item.color}-600`} size={16} />
                                </div>
                                <div className={`px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(item.status)}`}>
                                  <div className="flex items-center space-x-1">
                                    <StatusIcon size={10} />
                                    <span className="capitalize">{item.status}</span>
                                  </div>
                                </div>
                              </div>

                              {/* Equipment Info */}
                              <div className="space-y-2">
                                <h4 className="font-medium text-gray-900 text-sm">{item.name}</h4>
                                <div className="text-xs text-gray-600 space-y-1">
                                  <div className="flex justify-between">
                                    <span>Code:</span>
                                    <span className="font-mono">{item.code}</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Location:</span>
                                    <span>{item.location}</span>
                                  </div>
                                  {item.password && (
                                    <div className="flex justify-between items-center">
                                      <span>Password:</span>
                                      <div className="flex items-center space-x-1">
                                        <span className="font-mono">
                                          {showPasswords[item.id] ? item.password : '••••••••'}
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

        {/* Equipment Details Modal */}
        {showModal && selectedItem && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <div className="p-6 border-b border-gray-200 flex justify-between items-center">
                <h3 className="text-xl font-semibold text-gray-900">
                  {editMode ? 'Edit Equipment' : 'Equipment Details'}
                </h3>
                <div className="flex space-x-2">
                  {!editMode && (
                    <button
                      onClick={() => setEditMode(true)}
                      className="px-3 py-1 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                    >
                      Edit
                    </button>
                  )}
                  <button
                    onClick={() => {
                      setShowModal(false);
                      setEditMode(false);
                      setSelectedItem(null);
                    }}
                    className="px-3 py-1 text-sm border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Close
                  </button>
                </div>
              </div>
              
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Equipment Name</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedItem.name}
                        onChange={(e) => setSelectedItem({...selectedItem, name: e.target.value})}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{selectedItem.name}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Equipment Code</label>
                    <p className="mt-1 text-gray-900 font-mono">{selectedItem.code}</p>
                  </div>
                  
                  {selectedItem.description && (
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700">Description</label>
                      <p className="mt-1 text-gray-900 text-sm">{selectedItem.description}</p>
                    </div>
                  )}
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Status</label>
                    {editMode ? (
                      <select
                        value={selectedItem.status}
                        onChange={(e) => setSelectedItem({...selectedItem, status: e.target.value})}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      >
                        <option value="active">Active</option>
                        <option value="maintenance">Maintenance</option>
                        <option value="damaged">Damaged</option>
                      </select>
                    ) : (
                      <p className="mt-1 text-gray-900 capitalize">{selectedItem.status}</p>
                    )}
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Location</label>
                    {editMode ? (
                      <input
                        type="text"
                        value={selectedItem.location}
                        onChange={(e) => setSelectedItem({...selectedItem, location: e.target.value})}
                        className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      />
                    ) : (
                      <p className="mt-1 text-gray-900">{selectedItem.location}</p>
                    )}
                  </div>
                  
                  {selectedItem.password && (
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Password</label>
                      <div className="mt-1 flex items-center space-x-2">
                        <span className="font-mono text-gray-900">
                          {showPasswords[selectedItem.id] ? selectedItem.password : '••••••••'}
                        </span>
                        <button
                          onClick={() => togglePasswordVisibility(selectedItem.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          {showPasswords[selectedItem.id] ? <EyeOff size={16} /> : <Eye size={16} />}
                        </button>
                      </div>
                    </div>
                  )}
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Last Maintenance</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedItem.lastMaintenance).toLocaleDateString()}
                    </p>
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700">Notes</label>
                  {editMode ? (
                    <textarea
                      value={selectedItem.notes}
                      onChange={(e) => setSelectedItem({...selectedItem, notes: e.target.value})}
                      rows={3}
                      className="mt-1 w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="Add any notes about this equipment..."
                    />
                  ) : (
                    <p className="mt-1 text-gray-900">{selectedItem.notes || 'No notes available'}</p>
                  )}
                </div>
              </div>
              
              {editMode && (
                <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
                  <button
                    onClick={() => setEditMode(false)}
                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSaveEdit}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                  >
                    Save Changes
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