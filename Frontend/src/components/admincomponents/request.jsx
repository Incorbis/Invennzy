import React, { useEffect, useState, useMemo } from "react";
import jsPDF from "jspdf";
import {
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  User,
  FileText,
  Settings,
  CheckSquare,
} from "lucide-react";
import { useParams } from "react-router-dom";
import axios from "axios";

function AdminDashboard() {
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [form, setForm] = useState({
    /* same as your existing form state */
  });
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const { requestId } = useParams();

  const steps = [
    {
      id: 1,
      title: "Problem Details",
      subtitle: "Type & Date",
      icon: FileText,
      role: "Lab In-charge",
    },
    {
      id: 2,
      title: "Submit Request",
      subtitle: "Originator Info",
      icon: User,
      role: "Lab In-charge",
    },
    {
      id: 3,
      title: "Verification",
      subtitle: "Under Review",
      icon: Clock,
      role: "Maintenance Team",
    },
    {
      id: 4,
      title: "Corrective Action",
      subtitle: "In Progress",
      icon: Settings,
      role: "Maintenance Team",
    },
    {
      id: 5,
      title: "Admin Approval",
      subtitle: "Pending Review",
      icon: AlertCircle,
      role: "Admin",
    },
    {
      id: 6,
      title: "Closure",
      subtitle: "Completed",
      icon: CheckSquare,
      role: "Maintenance Team",
    },
  ];

  const isStepCompleted = (step) => {
    if (step === 5) {
      return (
        form.adminApprovalStatus === "approved" ||
        form.adminApprovalStatus === "rejected"
      );
    }
    const fields = stepFields[step];
    return fields.every(
      (field) => form[field] && form[field].toString().trim() !== ""
    );
  };

  const stepFields = {
    1: ["typeOfProblem", "date"],
    2: [
      "department",
      "location",
      "complaintDetails",
      "labAssistant",
      "labAssistantDate",
      "hod",
      "hodDate",
    ],
    3: ["assignedPerson", "inChargeDate", "verificationRemarks"],
    4: ["materialsUsed", "resolvedInhouse", "resolvedRemark"],
    5: ["adminApprovalStatus"],
    6: [
      "completionRemarkLab",
      "labCompletionName",
      "labCompletionDate",
      "completionRemarkMaintenance",
      "maintenanceClosedDate",
    ],
  };

  const showModal = (type, title, message) =>
    setModal({ isOpen: true, type, title, message });
  const closeModal = () =>
    setModal({ isOpen: false, type: "", title: "", message: "" });

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      try {
        setLoading(true);
        const res = await axios.get(`/api/requests/${requestId}`);
        const data = res.data || {};
        setForm({
          typeOfProblem: data.type_of_problem || "",
          date: data.date ? String(data.date).split("T")[0] : "",
          department: data.department || "",
          location: data.location || "",
          complaintDetails: data.complaint_details || "",
          recurringComplaint: data.recurring_complaint || "no",
          recurringTimes: data.recurring_times ?? "",
          labAssistant: data.lab_assistant || "",
          labAssistantDate: data.lab_assistant_date
            ? String(data.lab_assistant_date).split("T")[0]
            : "",
          hod: data.hod || "",
          hodDate: data.hod_date ? String(data.hod_date).split("T")[0] : "",
          inChargeDate: data.in_charge_date
            ? String(data.in_charge_date).split("T")[0]
            : "",
          assignedPerson: data.assigned_person || "",
          verificationRemarks: data.verification_remarks || "",
          materialsUsed: data.materials_used || "",
          resolvedInhouse: data.resolved_inhouse || "yes",
          resolvedRemark: data.resolved_remark || "",
          adminApprovalStatus: data.admin_approval_status || "",
          adminApprovalDate: data.admin_approval_date
            ? String(data.admin_approval_date).split("T")[0]
            : "",
          completionRemarkLab: data.completion_remark_lab || "",
          labCompletionName: data.lab_completion_name || "",
          labCompletionDate: data.lab_completion_date
            ? String(data.lab_completion_date).split("T")[0]
            : "",
          completionRemarkMaintenance: data.completion_remark_maintenance || "",
          maintenanceClosedDate: data.maintenance_closed_date
            ? String(data.maintenance_closed_date).split("T")[0]
            : "",
        });
        let maxCompleted = 0;
        for (let step = 1; step <= 6; step++) {
          if (isStepCompleted(step)) {
            maxCompleted = step;
          } else {
            break;
          }
        }
        setCompletedSteps(maxCompleted);
        setCurrentStep(data.current_step || 1);
      } catch (err) {
        console.error("Error fetching request:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);

  const nextStep = () => {
    if (currentStep < 6 && currentStep <= completedSteps) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  const handleAdminApproval = async (status) => {
    try {
      await axios.put(`/api/requests/admin/${requestId}/approval`, {
        adminApprovalStatus: status,
        adminApprovalDate: new Date().toISOString().split("T")[0],
        currentStep: 6,
        completedSteps: 5,
      });
      setForm((prev) => ({ ...prev, adminApprovalStatus: status }));
      setCompletedSteps(5);
      showModal("success", "Approval Updated", `Request has been ${status}.`);
    } catch (err) {
      console.error(err);
      showModal("info", "Error", "Failed to update approval status.");
    }
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const addText = (label, value) => {
      doc.text(`${label}: ${value || "-"}`, 14, y);
      y += 7;
    };
    doc.text("Maintenance Request Form - Admin Copy", 14, y);
    y += 10;
    addText("Type of Problem", form.typeOfProblem);
    addText("Date", form.date);
    addText("Department", form.department);
    addText("Location", form.location);
    addText("Complaint Details", form.complaintDetails);
    addText("Admin Approval Status", form.adminApprovalStatus);
    doc.save("maintenance_request_admin.pdf");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-8 px-4">
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
      <div className="max-w-4xl mx-auto">
        <ProgressBar
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {loading ? (
            <div className="animate-pulse text-gray-500">Loading request…</div>
          ) : (
            <>
              {currentStep === 1 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <FileText className="w-7 h-7 text-blue-600" /> Problem
                    Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type of Problem
                      </label>
                      <input
                        type="text"
                        value={form.typeOfProblem}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date
                      </label>
                      <input
                        type="text"
                        value={form.date}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <User className="w-7 h-7 text-blue-600" /> Request Details
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Department
                      </label>
                      <input
                        type="text"
                        value={form.department}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location
                      </label>
                      <input
                        type="text"
                        value={form.location}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Complaint Details
                    </label>
                    <textarea
                      value={form.complaintDetails}
                      disabled
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      rows={4}
                    />
                  </div>
                </div>
              )}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <Clock className="w-7 h-7 text-orange-500" /> Verification
                    Stage
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Assigned Person
                      </label>
                      <input
                        type="text"
                        value={form.assignedPerson}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        In-Charge Date
                      </label>
                      <input
                        type="text"
                        value={form.inChargeDate}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Verification Remarks
                      </label>
                      <textarea
                        value={form.verificationRemarks}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <Settings className="w-7 h-7 text-blue-500" /> Corrective
                    Action
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="md:col-span-2">
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Materials Used
                      </label>
                      <textarea
                        value={form.materialsUsed}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resolved In-house?
                      </label>
                      <input
                        type="text"
                        value={form.resolvedInhouse}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Resolution Remark
                      </label>
                      <input
                        type="text"
                        value={form.resolvedRemark}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                      />
                    </div>
                  </div>
                </div>
              )}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold flex items-center gap-3">
                    <AlertCircle className="w-7 h-7 text-purple-500" /> Admin
                    Approval
                  </h2>
                  <p className="text-gray-600 mt-2">
                    {form.adminApprovalStatus === "approved"
                      ? "This request has been approved."
                      : form.adminApprovalStatus === "rejected"
                      ? "This request was rejected."
                      : "This request is pending admin approval."}
                  </p>
                  {!form.adminApprovalStatus && (
                    <div className="flex gap-3 mt-4">
                      <button
                        type="button"
                        className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                        onClick={() => handleAdminApproval("approved")}
                      >
                        ✅ Approve
                      </button>
                      <button
                        type="button"
                        className="px-6 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-all font-medium"
                        onClick={() => handleAdminApproval("rejected")}
                      >
                        ❌ Reject
                      </button>
                    </div>
                  )}
                </div>
              )}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                    <CheckSquare className="w-7 h-7 text-green-500" /> Closure
                  </h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Completion Remarks (Lab)
                      </label>
                      <textarea
                        value={form.completionRemarkLab}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                        rows={3}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-2">
                        Completion Remarks (Maintenance)
                      </label>
                      <textarea
                        value={form.completionRemarkMaintenance}
                        disabled
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 bg-gray-100"
                        rows={3}
                      />
                    </div>
                  </div>
                </div>
              )}
              <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className={`px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium ${
                    currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  ← Previous
                </button>
                <div className="flex gap-3">
                  {currentStep < 6 && currentStep <= completedSteps + 1 && (
                    <button
                      type="button"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
                      onClick={nextStep}
                    >
                      Next →
                    </button>
                  )}
                  {completedSteps >= 2 && (
                    <button
                      type="button"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all font-medium"
                      onClick={downloadPDF}
                    >
                      📄 Download PDF
                    </button>
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default AdminDashboard;
