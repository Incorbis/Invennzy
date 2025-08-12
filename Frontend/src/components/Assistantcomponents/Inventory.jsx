import React, { useState, useEffect } from 'react';

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
  const [equipmentState, setEquipmentState] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterType, setFilterType] = useState('all');
  const [selectedItem, setSelectedItem] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [showPasswords, setShowPasswords] = useState({});
  const [editMode, setEditMode] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [debugInfo, setDebugInfo] = useState({});
  
  // Initialize all categories as collapsed
  const [collapsedCategories, setCollapsedCategories] = useState(() => {
    const types = ['monitors', 'projectors', 'switch_boards', 'fans', 'wifi'];
    return Object.fromEntries(types.map(type => [type, true]));
  });

  useEffect(() => {
    // Debug: Check all localStorage keys
    const localStorageKeys = Object.keys(localStorage);
    console.log('All localStorage keys:', localStorageKeys);
    
    // Check common key variations
    const possibleKeys = ['userId', 'user_id', 'id', 'staffId', 'staff_id', 'userID'];
    const foundKeys = {};
    
    possibleKeys.forEach(key => {
      const value = localStorage.getItem(key);
      if (value) {
        foundKeys[key] = value;
        console.log(`Found ${key}:`, value);
      }
    });

    // Store user ID in localStorage
    localStorage.setItem('userId', 7);

    // ✅ Verify it
    console.log('User ID set to:', localStorage.getItem('userId'));

    
    setDebugInfo({
      allKeys: localStorageKeys,
      possibleUserKeys: foundKeys
    });

    // Try to get userId with different possible key names
    let userId = localStorage.getItem('userId') || 
                 localStorage.getItem('user_id') || 
                 localStorage.getItem('id') || 
                 localStorage.getItem('staff_id');

    // Also try to parse user object if stored as JSON
    const userObj = localStorage.getItem('user');
    if (userObj && !userId) {
      try {
        const parsed = JSON.parse(userObj);
        userId = parsed.id || parsed.userId || parsed.user_id || parsed.staffId || parsed.staff_id;
        console.log('Parsed user object:', parsed);
        console.log('Extracted userId from user object:', userId);
      } catch (e) {
        console.log('Failed to parse user object:', e);
      }
    }

    // Try other possible JSON objects
    if (!userId) {
      const possibleJsonKeys = ['currentUser', 'loggedInUser', 'authUser', 'session'];
      for (const key of possibleJsonKeys) {
        const jsonStr = localStorage.getItem(key);
        if (jsonStr) {
          try {
            const parsed = JSON.parse(jsonStr);
            userId = parsed.id || parsed.userId || parsed.user_id || parsed.staffId || parsed.staff_id;
            if (userId) {
              console.log(`Found userId in ${key}:`, userId);
              break;
            }
          } catch (e) {
            console.log(`Failed to parse ${key}:`, e);
          }
        }
      }
    }

    if (!userId) {
      console.error('No userId found in localStorage');
      console.log('Available localStorage keys:', localStorageKeys);
      console.log('Searched for keys:', possibleKeys);
      console.log('Found values:', foundKeys);
      
      setError('No user ID found. Please login again. Debug info: ' + JSON.stringify(foundKeys));
      setLoading(false);
      return;
    }

    console.log('Using userId:', userId);

    const fetchEquipment = async () => {
      try {
        setLoading(true);
        
        // Step 1: Get lab information for this staff member
        console.log('Fetching lab info for userId:', userId);
        
        // Try multiple possible endpoints based on your API structure
        let labRes;
        let labData;
        
        // First try the existing endpoint
        try {
          labRes = await fetch(`/api/labstaff/incharge/${userId}/lab`);
          console.log('Lab response status (incharge endpoint):', labRes.status);
          
          if (labRes.ok) {
            labData = await labRes.json();
            console.log('Lab data from incharge endpoint:', labData);
          }
        } catch (e) {
          console.log('Incharge endpoint failed:', e);
        }
        
        // If that fails, try getting staff info first
        if (!labData || !labData.lab_id) {
          console.log('Trying staff endpoint...');
          try {
            const staffRes = await fetch(`/api/labstaff/${userId}`);
            console.log('Staff response status:', staffRes.status);
            
            if (staffRes.ok) {
              const staffData = await staffRes.json();
              console.log('Staff data:', staffData);
              
              if (staffData.lab_id) {
                labData = {
                  lab_id: staffData.lab_id,
                  lab_name: staffData.lab_name,
                  lab_no: staffData.lab_no,
                  building: staffData.building,
                  floor: staffData.floor
                };
                console.log('Constructed lab data from staff:', labData);
              }
            }
          } catch (e) {
            console.log('Staff endpoint failed:', e);
          }
        }
        
        if (!labData || !labData.lab_id) {
          throw new Error('No lab found for this user. Please check if you are assigned to a lab.');
        }

        // Step 2: Get equipment for the lab
        console.log('Fetching equipment for lab_id:', labData.lab_id);
        const equipRes = await fetch(`/api/labs/equipment/${labData.lab_id}`);
        console.log('Equipment response status:', equipRes.status);
        
        if (!equipRes.ok) {
          const errorText = await equipRes.text();
          console.error('Equipment fetch error:', errorText);
          throw new Error(`Failed to fetch equipment data: ${equipRes.status} - ${errorText}`);
        }
        
        const equipData = await equipRes.json();
        console.log('Equipment data received:', equipData);

        // Step 3: Convert equipment counts into individual equipment items
        const equipmentTypes = [
          { key: 'monitors', color: 'blue', icon: Monitor, displayName: 'Monitor' },
          { key: 'projectors', color: 'purple', icon: Projector, displayName: 'Projector' },
          { key: 'switch_boards', color: 'yellow', icon: Zap, displayName: 'Switch Board' },
          { key: 'fans', color: 'green', icon: Fan, displayName: 'Fan' },
          { key: 'wifi', color: 'indigo', icon: Wifi, displayName: 'WiFi Router' }
        ];

        let equipmentList = [];

        equipmentTypes.forEach(({ key, color, icon, displayName }) => {
          const count = equipData[key] || 0;
          console.log(`${key}: ${count} items`);
          
          for (let i = 1; i <= count; i++) {
            const hasPassword = key === 'wifi';
            equipmentList.push({
              id: `${key}_${i}`,
              type: key,
              name: `${displayName} ${i}`,
              code: `${key.toUpperCase()}-${String(i).padStart(3, '0')}`,
              status: Math.random() > 0.8 ? (Math.random() > 0.5 ? 'maintenance' : 'damaged') : 'active',
              location: `${labData.lab_name || `Lab ${labData.lab_no}`} (${labData.building} - Floor ${labData.floor})`,
              password: hasPassword ? `wifi${String(i).padStart(3, '0')}@lab` : null,
              description: `${displayName} unit ${i} in ${labData.lab_name || `Lab ${labData.lab_no}`}`,
              lastMaintenance: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString(),
              purchaseDate: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
              warranty: Math.random() > 0.3,
              notes: '',
              icon: icon,
              color: color
            });
          }
        });

        console.log('Generated equipment list:', equipmentList);
        setEquipmentState(equipmentList);
        setError(null);
      } catch (err) {
        console.error('Error loading equipment:', err);
        setError(err.message + ` (Debug: Looking for userId in localStorage, found keys: ${Object.keys(debugInfo.possibleUserKeys || {}).join(', ')})`);
      } finally {
        setLoading(false);
      }
    };

    fetchEquipment();
  }, []);

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
    const types = ['monitors', 'projectors', 'switch_boards', 'fans', 'wifi'];
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
      'wifi': 'WiFi Routers',
    };
    return names[type] || type;
  };

  const getCategoryIcon = (type) => {
    const icons = {
      'monitors': Monitor,
      'projectors': Projector,
      'switch_boards': Zap,
      'fans': Fan,
      'wifi': Wifi,
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
              <p>Debug: Found localStorage keys: {debugInfo.allKeys?.join(', ')}</p>
              <p>User keys: {Object.keys(debugInfo.possibleUserKeys || {}).join(', ')}</p>
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
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Error Loading Equipment</h2>
          <p className="text-gray-600 mb-4 text-sm">{error}</p>
          <div className="mb-4">
            <h3 className="text-sm font-medium text-gray-700 mb-2">Debug Information:</h3>
            <div className="bg-gray-100 p-3 rounded text-xs text-left">
              <p><strong>Available localStorage keys:</strong></p>
              <p>{debugInfo.allKeys?.join(', ') || 'None found'}</p>
              <p className="mt-2"><strong>Possible user data:</strong></p>
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
                      <div className={`w-10 h-10 bg-${categoryEquipment[0]?.color}-100 rounded-lg flex items-center justify-center`}>
                        <CategoryIcon className={`text-${categoryEquipment[0]?.color}-600`} size={20} />
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
                                    <span className="truncate ml-2">{item.location}</span>
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
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Purchase Date</label>
                    <p className="mt-1 text-gray-900">
                      {new Date(selectedItem.purchaseDate).toLocaleDateString()}
                    </p>
                  </div>
                  
                  <div>
                    <label className="block text-sm font-medium text-gray-700">Warranty Status</label>
                    <p className="mt-1">
                      <span className={`px-2 py-1 rounded-full text-xs ${selectedItem.warranty ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                        {selectedItem.warranty ? 'Under Warranty' : 'Warranty Expired'}
                      </span>
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