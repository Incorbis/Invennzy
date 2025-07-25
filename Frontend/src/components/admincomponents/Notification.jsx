import React, { useState, useEffect } from 'react';
import {
  Bell,
  AlertTriangle,
  CheckCircle,
  Clock,
  X,
  Eye,
  Check,
  XCircle,
  User,
  UserCheck,
  Calendar,
  MapPin,
  Package,
  Wrench,
  Wifi,
  Monitor,
  Projector,
  Zap,
  Fan,
  Filter,
  Search,
  Plus,
  MessageSquare,
  FileText,
  Send
} from 'lucide-react';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [selectedNotification, setSelectedNotification] = useState(null);
  const [showApprovalModal, setShowApprovalModal] = useState(false);
  const [approvalAction, setApprovalAction] = useState(null);
  const [adminNotes, setAdminNotes] = useState('');
  const [rejectionReason, setRejectionReason] = useState('');

  // Mock data - in real app, this would come from API
  useEffect(() => {
    const mockNotifications = [
      {
        id: '1',
        title: 'Projector Replacement Required',
        description: 'The main projector in CS-101 has stopped working completely. Students are unable to view presentations clearly. This is affecting daily classes.',
        category: 'equipment',
        priority: 'high',
        status: 'pending',
        raisedBy: {
          name: 'Dr. Sarah Johnson',
          role: 'incharge',
          email: 'sarah.johnson@college.edu',
          phone: '+1-555-0101'
        },
        labInfo: {
          labNo: 'CS-101',
          labName: 'Computer Science Lab 1',
          building: 'Block A',
          floor: '1st Floor'
        },
        equipmentType: 'Projector',
        quantity: 1,
        estimatedCost: 1200,
        urgencyReason: 'Daily classes are being disrupted',
        createdAt: '2024-01-15T09:30:00Z',
        updatedAt: '2024-01-15T09:30:00Z'
      },
      {
        id: '2',
        title: 'Air Conditioning Maintenance',
        description: 'The AC unit in Physics Lab is making unusual noises and not cooling properly. Temperature is affecting sensitive equipment.',
        category: 'maintenance',
        priority: 'medium',
        status: 'pending',
        raisedBy: {
          name: 'Lisa Wang',
          role: 'assistant',
          email: 'lisa.wang@college.edu',
          phone: '+1-555-0202'
        },
        labInfo: {
          labNo: 'PHY-201',
          labName: 'Physics Laboratory',
          building: 'Block B',
          floor: '2nd Floor'
        },
        urgencyReason: 'Equipment overheating concerns',
        createdAt: '2024-01-14T14:20:00Z',
        updatedAt: '2024-01-15T10:15:00Z'
      },
      {
        id: '3',
        title: 'Additional Monitors Request',
        description: 'Need 5 additional monitors for the new batch of students. Current monitors are insufficient for the increased class size.',
        category: 'request',
        priority: 'medium',
        status: 'pending',
        raisedBy: {
          name: 'Dr. Ahmed Hassan',
          role: 'incharge',
          email: 'ahmed.hassan@college.edu',
          phone: '+1-555-0401'
        },
        labInfo: {
          labNo: 'EE-401',
          labName: 'Electrical Engineering Lab',
          building: 'Block D',
          floor: '4th Floor'
        },
        equipmentType: 'Monitor',
        quantity: 5,
        estimatedCost: 2500,
        createdAt: '2024-01-13T11:45:00Z',
        updatedAt: '2024-01-14T16:30:00Z'
      },
      {
        id: '4',
        title: 'WiFi Connectivity Issues',
        description: 'Students are experiencing frequent disconnections and slow internet speeds. This is hampering online research and cloud-based assignments.',
        category: 'urgent',
        priority: 'critical',
        status: 'approved',
        raisedBy: {
          name: 'James Wilson',
          role: 'assistant',
          email: 'james.wilson@college.edu',
          phone: '+1-555-0302'
        },
        labInfo: {
          labNo: 'CHEM-301',
          labName: 'Chemistry Lab',
          building: 'Block C',
          floor: '3rd Floor'
        },
        urgencyReason: 'Critical for online assignments and research',
        createdAt: '2024-01-15T08:15:00Z',
        updatedAt: '2024-01-15T11:45:00Z',
        approvedBy: 'Admin',
        approvedAt: '2024-01-15T11:45:00Z',
        adminNotes: 'IT team dispatched immediately. Router replacement in progress.'
      },
      {
        id: '5',
        title: 'Faulty Switch Board',
        description: 'One of the switch boards is sparking occasionally. This poses a safety risk to students and equipment.',
        category: 'urgent',
        priority: 'critical',
        status: 'pending',
        raisedBy: {
          name: 'David Kim',
          role: 'assistant',
          email: 'david.kim@college.edu',
          phone: '+1-555-0502'
        },
        labInfo: {
          labNo: 'BIO-501',
          labName: 'Biology Laboratory',
          building: 'Block E',
          floor: '5th Floor'
        },
        urgencyReason: 'Safety hazard - immediate attention required',
        createdAt: '2024-01-12T16:30:00Z',
        updatedAt: '2024-01-13T14:20:00Z'
      },
      {
        id: '6',
        title: 'Laboratory Cleaning Supplies',
        description: 'Running low on essential cleaning supplies including disinfectants, paper towels, and safety equipment.',
        category: 'request',
        priority: 'low',
        status: 'rejected',
        raisedBy: {
          name: 'Mike Chen',
          role: 'assistant',
          email: 'mike.chen@college.edu',
          phone: '+1-555-0102'
        },
        labInfo: {
          labNo: 'CS-101',
          labName: 'Computer Science Lab 1',
          building: 'Block A',
          floor: '1st Floor'
        },
        quantity: 1,
        estimatedCost: 150,
        createdAt: '2024-01-11T13:20:00Z',
        updatedAt: '2024-01-12T09:45:00Z',
        rejectionReason: 'Supplies were restocked last week. Please check storage room.',
        adminNotes: 'Contact facilities management for existing supplies.'
      },
      {
        id: '7',
        title: 'New Computer Setup Request',
        description: 'Request for setting up 10 new computers in the upgraded computer lab. Need installation and configuration.',
        category: 'request',
        priority: 'medium',
        status: 'pending',
        raisedBy: {
          name: 'Dr. Maria Garcia',
          role: 'incharge',
          email: 'maria.garcia@college.edu',
          phone: '+1-555-0601'
        },
        labInfo: {
          labNo: 'CS-102',
          labName: 'Computer Science Lab 2',
          building: 'Block A',
          floor: '2nd Floor'
        },
        equipmentType: 'Computer',
        quantity: 10,
        estimatedCost: 15000,
        createdAt: '2024-01-16T10:00:00Z',
        updatedAt: '2024-01-16T10:00:00Z'
      },
      {
        id: '8',
        title: 'Printer Maintenance Required',
        description: 'The main printer is jamming frequently and print quality has deteriorated. Students cannot print their assignments properly.',
        category: 'maintenance',
        priority: 'high',
        status: 'pending',
        raisedBy: {
          name: 'Jennifer Lee',
          role: 'assistant',
          email: 'jennifer.lee@college.edu',
          phone: '+1-555-0701'
        },
        labInfo: {
          labNo: 'LIB-001',
          labName: 'Library Computer Section',
          building: 'Library Block',
          floor: 'Ground Floor'
        },
        urgencyReason: 'Students unable to print assignments',
        createdAt: '2024-01-16T14:30:00Z',
        updatedAt: '2024-01-16T14:30:00Z'
      }
    ];
    setTimeout(() => {
      setNotifications(mockNotifications);
      setLoading(false);
    }, 1000);
  }, []);

  const getStatusColor = (status) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'approved': return 'bg-blue-100 text-blue-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'in-progress': return 'bg-purple-100 text-purple-800';
      case 'completed': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'low': return 'bg-gray-100 text-gray-800';
      case 'medium': return 'bg-blue-100 text-blue-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'critical': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryIcon = (category) => {
    switch (category) {
      case 'maintenance': return Wrench;
      case 'equipment': return Package;
      case 'urgent': return AlertTriangle;
      case 'request': return FileText;
      case 'report': return MessageSquare;
      default: return Bell;
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return Clock;
      case 'approved': return CheckCircle;
      case 'rejected': return XCircle;
      case 'in-progress': return Clock;
      case 'completed': return CheckCircle;
      default: return Clock;
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch =
      notification.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.labInfo.labNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      notification.raisedBy.name.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = filterStatus === 'all' || notification.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || notification.priority === filterPriority;
    const matchesCategory = filterCategory === 'all' || notification.category === filterCategory;

    return matchesSearch && matchesStatus && matchesPriority && matchesCategory;
  });

  const handleApproval = (notification, action) => {
    setSelectedNotification(notification);
    setApprovalAction(action);
    setShowApprovalModal(true);
  };

  const submitApproval = () => {
    if (!selectedNotification || !approvalAction) return;
    const updatedNotification = {
      ...selectedNotification,
      status: approvalAction === 'approve' ? 'approved' : 'rejected',
      updatedAt: new Date().toISOString(),
      approvedBy: 'Admin',
      approvedAt: new Date().toISOString(),
      adminNotes: adminNotes || undefined,
      rejectionReason: approvalAction === 'reject' ? rejectionReason : undefined
    };
    setNotifications(notifications.map(n =>
      n.id === selectedNotification.id ? updatedNotification : n
    ));
    setShowApprovalModal(false);
    setSelectedNotification(null);
    setApprovalAction(null);
    setAdminNotes('');
    setRejectionReason('');
  };

  const getNotificationStats = () => {
    const stats = {
      total: notifications.length,
      pending: notifications.filter(n => n.status === 'pending').length,
      approved: notifications.filter(n => n.status === 'approved').length,
      rejected: notifications.filter(n => n.status === 'rejected').length,
      critical: notifications.filter(n => n.priority === 'critical').length
    };
    return stats;
  };

  const stats = getNotificationStats();

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="bg-white p-6 rounded-xl border border-gray-200">
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

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Notifications</h2>
          <p className="text-gray-600">Manage requests and reports from lab staff</p>
        </div>
      </div>
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
              <Bell className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Total</p>
              <p className="text-2xl font-bold text-gray-900">{stats.total}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-yellow-500 rounded-lg flex items-center justify-center">
              <Clock className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Pending</p>
              <p className="text-2xl font-bold text-gray-900">{stats.pending}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-green-500 rounded-lg flex items-center justify-center">
              <CheckCircle className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Approved</p>
              <p className="text-2xl font-bold text-gray-900">{stats.approved}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-red-500 rounded-lg flex items-center justify-center">
              <XCircle className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Rejected</p>
              <p className="text-2xl font-bold text-gray-900">{stats.rejected}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
          <div className="flex items-center justify-between">
            <div className="w-12 h-12 bg-red-600 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-white" size={24} />
            </div>
            <div className="text-right">
              <p className="text-sm font-medium text-gray-600">Critical</p>
              <p className="text-2xl font-bold text-gray-900">{stats.critical}</p>
            </div>
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
              placeholder="Search notifications by title, description, lab, or staff name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
          <div className="flex flex-wrap gap-3">
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Status</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
              <option value="in-progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Priority</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
              <option value="critical">Critical</option>
            </select>
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="all">All Categories</option>
              <option value="maintenance">Maintenance</option>
              <option value="equipment">Equipment</option>
              <option value="urgent">Urgent</option>
              <option value="request">Request</option>
              <option value="report">Report</option>
            </select>
          </div>
        </div>
      </div>
      {/* Notifications List */}
      <div className="space-y-4">
        {filteredNotifications.map((notification) => {
          const CategoryIcon = getCategoryIcon(notification.category);
          const StatusIcon = getStatusIcon(notification.status);

          return (
            <div key={notification.id} className="bg-white rounded-xl border border-gray-200 hover:shadow-lg transition-shadow">
              <div className="p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-start space-x-4">
                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${
                      notification.priority === 'critical' ? 'bg-red-500' :
                      notification.priority === 'high' ? 'bg-orange-500' :
                      notification.priority === 'medium' ? 'bg-blue-500' : 'bg-gray-500'
                    }`}>
                      <CategoryIcon className="text-white" size={24} />
                    </div>
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{notification.title}</h3>
                      <p className="text-gray-600 mb-3">{notification.description}</p>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center">
                          <MapPin className="mr-1" size={14} />
                          {notification.labInfo.labNo} - {notification.labInfo.building}
                        </div>
                        <div className="flex items-center">
                          {notification.raisedBy.role === 'incharge' ?
                            <UserCheck className="mr-1" size={14} /> :
                            <User className="mr-1" size={14} />
                          }
                          {notification.raisedBy.name} ({notification.raisedBy.role})
                        </div>
                        <div className="flex items-center">
                          <Calendar className="mr-1" size={14} />
                          {new Date(notification.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      {notification.equipmentType && (
                        <div className="mt-3 flex items-center text-sm text-gray-600">
                          <Package className="mr-1" size={14} />
                          {notification.equipmentType}
                          {notification.quantity && ` (Qty: ${notification.quantity})`}
                          {notification.estimatedCost && ` - $${notification.estimatedCost}`}
                        </div>
                      )}
                      {notification.urgencyReason && (
                        <div className="mt-2 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-800">
                            <AlertTriangle className="inline mr-1" size={14} />
                            <strong>Urgency:</strong> {notification.urgencyReason}
                          </p>
                        </div>
                      )}
                      {notification.adminNotes && (
                        <div className="mt-2 p-3 bg-blue-50 rounded-lg">
                          <p className="text-sm text-blue-800">
                            <MessageSquare className="inline mr-1" size={14} />
                            <strong>Admin Notes:</strong> {notification.adminNotes}
                          </p>
                        </div>
                      )}
                      {notification.rejectionReason && (
                        <div className="mt-2 p-3 bg-red-50 rounded-lg">
                          <p className="text-sm text-red-800">
                            <XCircle className="inline mr-1" size={14} />
                            <strong>Rejection Reason:</strong> {notification.rejectionReason}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="flex flex-col items-end space-y-2">
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getPriorityColor(notification.priority)}`}>
                        {notification.priority}
                      </span>
                      <span className={`inline-flex items-center px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(notification.status)}`}>
                        <StatusIcon size={12} className="mr-1" />
                        {notification.status}
                      </span>
                    </div>
                    {/* Approve/Decline buttons for ALL requests */}
                    <div className="flex items-center space-x-2 mt-3">
                      <button
                        onClick={() => handleApproval(notification, 'approve')}
                        disabled={notification.status === 'approved'}
                        className={`flex items-center px-3 py-1 text-sm rounded-lg transition-colors ${
                          notification.status === 'approved'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        <Check size={14} className="mr-1" />
                        {notification.status === 'approved' ? 'Approved' : 'Approve'}
                      </button>
                      <button
                        onClick={() => handleApproval(notification, 'reject')}
                        disabled={notification.status === 'rejected'}
                        className={`flex items-center px-3 py-1 text-sm rounded-lg transition-colors ${
                          notification.status === 'rejected'
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-red-600 text-white hover:bg-red-700'
                        }`}
                      >
                        <X size={14} className="mr-1" />
                        {notification.status === 'rejected' ? 'Rejected' : 'Decline'}
                      </button>
                    </div>
                    {notification.approvedAt && (
                      <p className="text-xs text-gray-500">
                        {notification.status === 'approved' ? 'Approved' : 'Updated'}: {new Date(notification.approvedAt).toLocaleDateString()}
                      </p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
      {filteredNotifications.length === 0 && (
        <div className="text-center py-12">
          <Bell className="mx-auto text-gray-400 mb-4" size={48} />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications found</h3>
          <p className="text-gray-500">Try adjusting your search or filter criteria.</p>
        </div>
      )}
      {/* Approval Modal */}
      {showApprovalModal && selectedNotification && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-gray-200">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-semibold text-gray-900">
                  {approvalAction === 'approve' ? 'Approve' : 'Decline'} Request
                </h3>
                <button
                  onClick={() => {
                    setShowApprovalModal(false);
                    setSelectedNotification(null);
                    setApprovalAction(null);
                    setAdminNotes('');
                    setRejectionReason('');
                  }}
                  className="p-2 hover:bg-gray-100 rounded-lg"
                >
                  <X size={20} />
                </button>
              </div>
            </div>
            <div className="p-6 space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedNotification.title}</h4>
                <p className="text-gray-600 text-sm">{selectedNotification.description}</p>
                <div className="mt-2 text-sm text-gray-500">
                  <span className="font-medium">Lab:</span> {selectedNotification.labInfo.labNo} - {selectedNotification.labInfo.labName}
                </div>
                <div className="text-sm text-gray-500">
                  <span className="font-medium">Raised by:</span> {selectedNotification.raisedBy.name} ({selectedNotification.raisedBy.role})
                </div>
              </div>
              {approvalAction === 'reject' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Decline Reason <span className="text-red-500">*</span>
                  </label>
                  <textarea
                    value={rejectionReason}
                    onChange={(e) => setRejectionReason(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows={3}
                    placeholder="Please provide a reason for declining this request..."
                    required
                  />
                </div>
              )}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Admin Notes {approvalAction === 'approve' && '(Optional)'}
                </label>
                <textarea
                  value={adminNotes}
                  onChange={(e) => setAdminNotes(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                  rows={3}
                  placeholder={approvalAction === 'approve' ?
                    "Add any additional notes or instructions..." :
                    "Add any additional comments..."}
                />
              </div>
            </div>
            <div className="p-6 border-t border-gray-200 flex justify-end space-x-3">
              <button
                onClick={() => {
                  setShowApprovalModal(false);
                  setSelectedNotification(null);
                  setApprovalAction(null);
                  setAdminNotes('');
                  setRejectionReason('');
                }}
                className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={submitApproval}
                disabled={approvalAction === 'reject' && !rejectionReason.trim()}
                className={`flex items-center px-4 py-2 text-white rounded-lg transition-colors ${
                  approvalAction === 'approve'
                    ? 'bg-green-600 hover:bg-green-700'
                    : 'bg-red-600 hover:bg-red-700'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                <Send className="mr-2" size={16} />
                {approvalAction === 'approve' ? 'Approve' : 'Decline'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notifications;
