import React, { useEffect, useState } from "react";
import { CheckCircle, XCircle, Eye, Download, Search, AlertCircle, Clock } from "lucide-react";

const Notification = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentAction, setCurrentAction] = useState(null);
  const [confirmationModal, setConfirmationModal] = useState({
    isOpen: false,
    action: null,
    requestId: null,
    requestDetails: null
  });

  // Fetch assistant-provided corrective action details
  useEffect(() => {
    const fetchAssistantDetails = async () => {
      try {
        setLoading(true);
        const res = await fetch("/api/admin/notifications");
        const data = await res.json();
        setNotifications(data);
      } catch (err) {
        console.error("Error fetching assistant details:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchAssistantDetails();
  }, []);

  // Calculate summary statistics
  const totalNotifications = notifications.length;
  const approvedCount = notifications.filter(n => n.adminApprovalStatus === "approved").length;
  const rejectedCount = notifications.filter(n => n.adminApprovalStatus === "rejected").length;
  const pendingCount = notifications.filter(n => !n.adminApprovalStatus || n.adminApprovalStatus === "pending").length;

  // Filter notifications based on search term
  const filteredNotifications = notifications.filter(n => 
    n.complaint_details?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.department?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    n.id.toString().includes(searchTerm)
  );

  // Open confirmation modal
  const openConfirmationModal = (action, requestId) => {
    const request = notifications.find(n => n.id === requestId);
    setConfirmationModal({
      isOpen: true,
      action,
      requestId,
      requestDetails: request
    });
  };

  // Close confirmation modal
  const closeConfirmationModal = () => {
    setConfirmationModal({
      isOpen: false,
      action: null,
      requestId: null,
      requestDetails: null
    });
  };

  // Handle approval/rejection after confirmation
  const handleApproval = async (requestId, status) => {
    try {
      await fetch(`/api/assistant/details/${requestId}/approval`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminApprovalStatus: status }),
      });

      // Update local state instantly
      setNotifications((prev) =>
        prev.map((n) =>
          n.id === requestId ? { ...n, adminApprovalStatus: status } : n
        )
      );

      setCurrentAction(null);
      closeConfirmationModal();
    } catch (err) {
      console.error("Approval error:", err);
    }
  };

  const handleView = (request) => {
    setSelectedRequest(request);
    setIsModalOpen(true);
  };

  const handleDownload = (request) => {
    const dataStr = JSON.stringify(request, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `notification_${request.id}_details.json`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedRequest(null);
  };

  if (loading) {
    return (
      <div className="p-6 text-center text-gray-600">Loading notifications...</div>
    );
  }

  return (
    <div className="space-y-6 p-6">
      {/* Summary Boxes */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Total Notifications</h3>
              <p className="text-2xl font-bold text-gray-900">{totalNotifications}</p>
            </div>
            <div className="p-3 bg-blue-100 rounded-full">
              <AlertCircle className="w-6 h-6 text-blue-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Approved</h3>
              <p className="text-2xl font-bold text-green-600">{approvedCount}</p>
            </div>
            <div className="p-3 bg-green-100 rounded-full">
              <CheckCircle className="w-6 h-6 text-green-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Rejected</h3>
              <p className="text-2xl font-bold text-red-600">{rejectedCount}</p>
            </div>
            <div className="p-3 bg-red-100 rounded-full">
              <XCircle className="w-6 h-6 text-red-600" />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm font-medium text-gray-500">Pending</h3>
              <p className="text-2xl font-bold text-yellow-600">{pendingCount}</p>
            </div>
            <div className="p-3 bg-yellow-100 rounded-full">
              <Clock className="w-6 h-6 text-yellow-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
          <input
            type="text"
            placeholder="Search notifications by ID, complaint details, or department..."
            className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">
            Assistant Corrective Actions
          </h3>
          <p className="text-gray-600 mt-1">
            Review and approve or reject corrective actions submitted by assistants.
          </p>
        </div>

        {filteredNotifications.length === 0 ? (
          <div className="p-12 text-center">
            <XCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchTerm ? "No matching notifications found" : "No corrective actions found"}
            </h3>
            <p className="text-gray-600">
              {searchTerm ? "Try adjusting your search terms" : "All caught up for now!"}
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Sr No
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Notification
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    View
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredNotifications.map((n, index) => (
                  <tr key={n.id} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {index + 1}
                    </td>
                    <td className="px-6 py-4 text-sm text-gray-900">
                      <div className="max-w-xs">
                        <p className="font-medium">ID: {n.id}</p>
                        <p className="text-gray-600 truncate">{n.complaint_details || "-"}</p>
                        <p className="text-xs text-gray-500 mt-1">Dept: {n.department || "-"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex flex-col space-y-2">
                        {n.adminApprovalStatus === "approved" && (
                          <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-green-100 text-green-800 whitespace-nowrap">
                            Approved
                          </span>
                        )}
                        {n.adminApprovalStatus === "rejected" && (
                          <span className="inline-flex items-center justify-center px-3 py-1 text-xs font-medium rounded-full bg-red-100 text-red-800 whitespace-nowrap">
                            Rejected
                          </span>
                        )}
                        {(!n.adminApprovalStatus || n.adminApprovalStatus === "pending") && (
                          <div className="space-y-1">
                            <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-yellow-100 text-yellow-700 mb-2">
                              Pending
                            </span>
                            <div className="flex space-x-1">
                              <button
                                onClick={() => openConfirmationModal("approved", n.id)}
                                className="px-2 py-1 text-xs text-white bg-green-600 rounded hover:bg-green-700"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => openConfirmationModal("rejected", n.id)}
                                className="px-2 py-1 text-xs text-white bg-red-600 rounded hover:bg-red-700"
                              >
                                Reject
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </td>

                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <button
                        onClick={() => handleView(n)}
                        className="px-3 py-1 text-sm text-white bg-blue-600 rounded-lg hover:bg-blue-700 inline-flex items-center"
                      >
                        <Eye className="w-4 h-4 mr-1" /> View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {confirmationModal.isOpen && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-md p-6">
            <div className="flex items-center mb-4">
              {confirmationModal.action === "approved" ? (
                <CheckCircle className="w-8 h-8 text-green-600 mr-3" />
              ) : (
                <XCircle className="w-8 h-8 text-red-600 mr-3" />
              )}
              <h2 className="text-xl font-bold text-gray-900">
                Confirm {confirmationModal.action === "approved" ? "Approval" : "Rejection"}
              </h2>
            </div>
            
            <div className="mb-6">
              <p className="text-gray-700 mb-4">
                Are you sure you want to <strong>{confirmationModal.action === "approved" ? "approve" : "reject"}</strong> this corrective action?
              </p>
              
              {confirmationModal.requestDetails && (
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="text-sm">
                    <span className="font-semibold">ID:</span> {confirmationModal.requestDetails.id}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Department:</span> {confirmationModal.requestDetails.department || "-"}
                  </div>
                  <div className="text-sm">
                    <span className="font-semibold">Details:</span> 
                    <span className="block mt-1 text-gray-600">
                      {confirmationModal.requestDetails.complaint_details || "No details available"}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3">
              <button
                onClick={closeConfirmationModal}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => handleApproval(confirmationModal.requestId, confirmationModal.action)}
                className={`px-4 py-2 text-white rounded-lg transition-colors ${
                  confirmationModal.action === "approved"
                    ? "bg-green-600 hover:bg-green-700"
                    : "bg-red-600 hover:bg-red-700"
                }`}
              >
                {confirmationModal.action === "approved" ? "Approve" : "Reject"}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Viewing Request Details */}
      {isModalOpen && selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center backdrop-blur-sm z-50">
          <div className="bg-white rounded-xl shadow-lg w-11/12 max-w-3xl p-6 overflow-y-auto max-h-[90vh]">
            <h2 className="text-xl font-bold mb-4">Request Details (ID: {selectedRequest.id})</h2>
            <div className="space-y-2 text-sm text-gray-700">
              {Object.entries(selectedRequest).map(([key, value]) => (
                <div key={key} className="border-b border-gray-100 pb-2">
                  <span className="font-semibold capitalize">{key.replace(/([A-Z])/g, ' $1')}: </span>
                  <span>{value !== null ? value.toString() : "-"}</span>
                </div>
              ))}
            </div>
            <div className="mt-6 flex justify-end space-x-2">
              <button
                onClick={() => handleDownload(selectedRequest)}
                className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 inline-flex items-center"
              >
                <Download className="w-4 h-4 mr-1" /> Download
              </button>
              <button
                onClick={closeModal}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Notification;