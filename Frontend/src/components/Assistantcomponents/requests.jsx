import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import jsPDF from "jspdf";
import {
  CheckCircle,
  AlertCircle,
  X,
  Clock,
  Settings,
  CheckSquare,
} from "lucide-react";
const steps = [
  {
    id: 1,
    title: "Problem Details",
    subtitle: "Completed",
    icon: CheckCircle,
    editable: false,
    role: "Lab In-charge",
  },
  {
    id: 2,
    title: "Request Submitted",
    subtitle: "Completed",
    icon: CheckCircle,
    editable: false,
    role: "Lab In-charge",
  },
  {
    id: 3,
    title: "Verification",
    subtitle: "Review & Assign",
    icon: Clock,
    editable: true,
    role: "Lab Assistant",
  },
  {
    id: 4,
    title: "Corrective Action",
    subtitle: "Execute Work",
    icon: Settings,
    editable: true,
    role: "Lab Assistant",
  },
  {
    id: 5,
    title: "Closure",
    subtitle: "Final Report",
    icon: CheckSquare,
    editable: true,
    role: "Lab Assistant",
  },
];
function Modal({ isOpen, onClose, type, title, message }) {
  if (!isOpen) return null;
  const getIcon = () => {
    switch (type) {
      case "success":
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case "info":
        return <AlertCircle className="w-8 h-8 text-blue-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-500" />;
    }
  };
  const getBgColor = () => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200";
      case "info":
        return "bg-blue-50 border-blue-200";
      default:
        return "bg-gray-50 border-gray-200";
    }
  };
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full mx-4">
        <div className="p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              {getIcon()}
              <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className={`p-4 rounded-lg border ${getBgColor()}`}>
            <p className="text-gray-700">{message}</p>
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
function ProgressBar({ currentStep, completedSteps = 2 }) {
  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
        <div
          className="absolute top-6 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-in-out"
          style={{
            width: `${((completedSteps - 1) / (steps.length - 1)) * 100}%`,
          }}
        ></div>
        <div className="relative flex justify-between">
          {steps.map((step, index) => {
            const StepIcon = step.icon;
            const isCompleted = step.id <= completedSteps;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= Math.max(completedSteps, 5);
            return (
              <div key={step.id} className="flex flex-col items-center group">
                <div
                  className={`relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300
                    ${
                      isCompleted
                        ? "bg-blue-600 border-blue-600 text-white shadow-lg"
                        : isCurrent
                        ? "bg-white border-blue-600 text-blue-600 shadow-lg ring-4 ring-blue-100"
                        : isAccessible
                        ? "bg-white border-gray-300 text-gray-400"
                        : "bg-gray-100 border-gray-200 text-gray-300"
                    }
                  `}
                >
                  {step.id <= 2 || isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
                  ) : isCurrent ? (
                    <StepIcon className="w-5 h-5" />
                  ) : (
                    <StepIcon className="w-5 h-5" />
                  )}
                </div>
                <div className="mt-3 text-center max-w-24">
                  <p
                    className={`text-sm font-semibold ${
                      isCurrent
                        ? "text-blue-700"
                        : isCompleted
                        ? "text-blue-600"
                        : "text-gray-500"
                    }`}
                  >
                    {step.title}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrent
                        ? "text-blue-600"
                        : isCompleted
                        ? "text-blue-500"
                        : "text-gray-400"
                    }`}
                  >
                    {step.subtitle}
                  </p>
                  <p
                    className={`text-xs mt-1 ${
                      isCurrent
                        ? "text-blue-500"
                        : isCompleted
                        ? "text-blue-400"
                        : "text-gray-400"
                    }`}
                  >
                    ({step.role})
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
const LabAssistantForm = () => {
  const { requestId } = useParams();
  const navigate = useNavigate();
  const [staffId, setStaffId] = useState(localStorage.getItem("staffId"));
  const [formData, setFormData] = useState({
    typeOfProblem: "",
    date: "",
    department: "",
    location: "",
    complaintDetails: "",
    recurringComplaint: "no",
    recurringTimes: "",
    labAssistant: "",
    labAssistantDate: "",
    hod: "",
    hodDate: "",
    inChargeDate: "",
    inChargeSignature: "",
    assignedPerson: "",
    verificationRemarks: "",
    materialsUsed: "",
    resolvedInhouse: "yes",
    resolvedRemark: "",
    consumablesNeeded: "no",
    consumableDetails: "",
    externalAgencyNeeded: "no",
    agencyName: "",
    approxExpenditure: "",
    completionRemarkLab: "",
    labCompletionName: "",
    labCompletionSignature: "",
    labCompletionDate: "",
    completionRemarkMaintenance: "",
    maintenanceClosedDate: "",
    maintenanceClosedSignature: "",
  });
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(2);
  const [loading, setLoading] = useState(false);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      try {
        setLoading(true);
        const res = await axios.get(`/api/requests/${requestId}`);
        const data = res.data || {};
        setFormData({
          typeOfProblem: data.type_of_problem || "",
          date: data.date ? data.date.split("T")[0] : "",
          department: data.department || "",
          location: data.location || "",
          complaintDetails: data.complaint_details || "",
          recurringComplaint: data.recurring_complaint || "no",
          recurringTimes: data.recurring_times || "",
          labAssistant: data.lab_assistant || "",
          labAssistantDate: data.lab_assistant_date
            ? data.lab_assistant_date.split("T")[0]
            : "",
          hod: data.hod || "",
          hodDate: data.hod_date ? data.hod_date.split("T")[0] : "",
          inChargeDate: data.inChargeDate || "",
          inChargeSignature: data.inChargeSignature || "",
          assignedPerson: data.assignedPerson || "",
          verificationRemarks: data.verificationRemarks || "",
          materialsUsed: data.materialsUsed || "",
          resolvedInhouse: data.resolvedInhouse || "yes",
          resolvedRemark: data.resolvedRemark || "",
          consumablesNeeded: data.consumablesNeeded || "no",
          consumableDetails: data.consumableDetails || "",
          externalAgencyNeeded: data.externalAgencyNeeded || "no",
          agencyName: data.agencyName || "",
          approxExpenditure: data.approxExpenditure || "",
          completionRemarkLab: data.completionRemarkLab || "",
          labCompletionName: data.labCompletionName || "",
          labCompletionSignature: data.labCompletionSignature || "",
          labCompletionDate: data.labCompletionDate || "",
          completionRemarkMaintenance: data.completionRemarkMaintenance || "",
          maintenanceClosedDate: data.maintenanceClosedDate || "",
          maintenanceClosedSignature: data.maintenanceClosedSignature || "",
        });
        setCompletedSteps(data.completed_steps || 0);
        setCurrentStep(data.current_step || 1);
      } catch (err) {
        console.error("Error fetching request:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchRequest();
  }, [requestId]);
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };
  const showModal = (type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  };
  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
  };
  const createRequest = async () => {
    if (!staffId) throw new Error("staffId is required to create request");
    const payload = { form: formData, staff_id: staffId };
    const res = await axios.post("/api/requests", payload);
    return res.data.requestId;
  };
  const updateRequest = async () => {
    if (!requestId) throw new Error("No requestId to update");
    await axios.put(`/api/requests/${requestId}`, {
      ...formData,
      currentStep,
      completedSteps,
    });
  };
  const updateStep = async (step, completed, message) => {
    if (!requestId) throw new Error("No requestId to update step");
    await axios.put(`/api/requests/assistant/${requestId}/step`, {
      currentStep: step,
      completedSteps: completed,
      message,
    });
  };
  const handleSaveProgress = async () => {
    try {
      if (requestId) {
        await updateRequest();
      } else {
        const newId = await createRequest();
        navigate(`/labassistantdash/requests/${newId}`);
        return;
      }
      showModal("success", "Progress Saved", "Progress saved successfully.");
    } catch (err) {
      console.error(err);
      showModal("info", "Save Failed", "Could not save progress.");
    }
  };
  const handleCreateAndSubmit = async () => {
    try {
      const newId = await createRequest();
      showModal("success", "Request Created", "Request created successfully.");
      navigate(`/labassistantdash/requests/${newId}`);
    } catch (err) {
      console.error(err);
      showModal("info", "Create Failed", "Could not create request.");
    }
  };
  const handleCompleteVerification = async () => {
    try {
      if (requestId) await updateRequest();
      await updateStep(3, 3, "Verification completed by assistant");
      setCompletedSteps(3);
      setCurrentStep(4);
      showModal("success", "Verification Completed", "Verification completed.");
    } catch (err) {
      console.error(err);
      showModal("info", "Action Failed", "Could not complete verification.");
    }
  };
  const handleCompleteAction = async () => {
    try {
      if (requestId) await updateRequest();
      await updateStep(4, 4, "Corrective action completed by assistant");
      setCompletedSteps(4);
      setCurrentStep(5);
      showModal("success", "Action Completed", "Corrective action completed.");
    } catch (err) {
      console.error(err);
      showModal("info", "Action Failed", "Could not complete action.");
    }
  };
  const handleCompleteClosure = async () => {
    try {
      if (requestId) await updateRequest();
      await updateStep(5, 5, "Request closed by assistant");
      setCompletedSteps(5);
      setCurrentStep(5);
      showModal("success", "Request Closed", "Maintenance request closed.");
    } catch (err) {
      console.error(err);
      showModal("info", "Action Failed", "Could not close request.");
    }
  };
  const nextStep = () => {
    if (currentStep < 2) {
      setCurrentStep((prev) => prev + 1);
    }
  };
  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };
  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 20;
    const addText = (label, value, isBold = false) => {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(11);
      doc.text(`${label}: ${value || "-"}`, 14, y);
      y += 7;
    };
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Maintenance Report Form - Complete", 14, y);
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(14, y, 195, y);
    y += 10;
    addText("Type of Problem", formData.typeOfProblem, true);
    addText("Date", formData.date);
    addText("Department", formData.department);
    addText("Location", formData.location);
    addText("Complaint Details", formData.complaintDetails);
    addText("Recurring Complaint", formData.recurringComplaint);
    if (formData.recurringComplaint === "yes") {
      addText("Number of times", formData.recurringTimes);
    }
    y += 5;
    addText("Verification Details", "", true);
    addText("Assigned Person", formData.assignedPerson);
    addText("Verification Remarks", formData.verificationRemarks);
    addText("Materials Used", formData.materialsUsed);
    y += 5;
    addText("Corrective Action", "", true);
    addText("Resolved In-house", formData.resolvedInhouse);
    addText("Resolution Remarks", formData.resolvedRemark);
    doc.save("maintenance_report_complete.pdf");
  };
  const StepComponent = () => {
    switch (currentStep) {
      case 1:
        const readOnly = !!requestId;
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-blue-700">
                Problem Details
              </h2>
              <p className="text-gray-600 mt-2">
                Enter problem details (Step 1)
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Type of Problem
                </label>
                <input
                  name="typeOfProblem"
                  value={formData.typeOfProblem}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={formData.date}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Department
                </label>
                <input
                  name="department"
                  value={formData.department}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Location
                </label>
                <input
                  name="location"
                  value={formData.location}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
              <div className="md:col-span-2">
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint Details
                </label>
                <textarea
                  name="complaintDetails"
                  value={formData.complaintDetails}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Recurring Complaint?
                </label>
                <select
                  name="recurringComplaint"
                  value={formData.recurringComplaint}
                  onChange={handleChange}
                  disabled={readOnly}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="no">No</option>
                  <option value="yes">Yes</option>
                </select>
              </div>
              {formData.recurringComplaint === "yes" && (
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Number of times
                  </label>
                  <input
                    name="recurringTimes"
                    value={formData.recurringTimes}
                    onChange={handleChange}
                    disabled={readOnly}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              )}
            </div>
          </div>
        );
      case 2:
        const isCreate = !requestId;
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-blue-700">
                Request Submission
              </h2>
              <p className="text-gray-600 mt-2">
                Review and submit the request.
              </p>
            </div>
            <div className="bg-gray-50 border border-gray-200 rounded-xl p-6">
              <p>
                <strong>Type:</strong> {formData.typeOfProblem || "-"}
              </p>
              <p>
                <strong>Date:</strong> {formData.date || "-"}
              </p>
              <p>
                <strong>Department:</strong> {formData.department || "-"}
              </p>
              <p>
                <strong>Location:</strong> {formData.location || "-"}
              </p>
              <p className="mt-2">
                <strong>Complaint:</strong> {formData.complaintDetails || "-"}
              </p>
            </div>
            {isCreate ? (
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium"
                >
                  ← Previous
                </button>
                <button
                  onClick={handleCreateAndSubmit}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
                >
                  Submit Request
                </button>
              </div>
            ) : (
              <div className="flex gap-3">
                <button
                  onClick={() => setCurrentStep(1)}
                  className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium"
                >
                  ← Previous
                </button>
                <button
                  onClick={() => setCurrentStep(3)}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        );
      case 3:
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
                <Clock className="w-7 h-7 text-orange-500" />
                Verification & Assignment
              </h2>
              <p className="text-gray-600 mt-2">
                Review the request and assign work to appropriate personnel
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint Received Date
                </label>
                <input
                  type="date"
                  name="inChargeDate"
                  value={formData.inChargeDate}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Your Signature
                </label>
                <input
                  name="inChargeSignature"
                  value={formData.inChargeSignature}
                  onChange={handleChange}
                  placeholder="Enter your signature/name"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Assigned Person
              </label>
              <input
                name="assignedPerson"
                value={formData.assignedPerson}
                onChange={handleChange}
                placeholder="Name of person assigned to handle this work"
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Verification Remarks
              </label>
              <textarea
                name="verificationRemarks"
                value={formData.verificationRemarks}
                onChange={handleChange}
                placeholder="Your remarks on the complaint verification and work assignment..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                rows={4}
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Materials/Tools to be Used
              </label>
              <textarea
                name="materialsUsed"
                value={formData.materialsUsed}
                onChange={handleChange}
                placeholder="List of materials, tools, or components that will be used for repair..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                rows={3}
              />
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(2)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium"
              >
                ← Previous
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition-all font-medium"
              >
                💾 Save Progress
              </button>
              <button
                onClick={handleCompleteVerification}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
              >
                ✓ Complete Verification
              </button>
            </div>
          </div>
        );
      case 4:
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
                <Settings className="w-7 h-7 text-blue-500" />
                Corrective Action
              </h2>
              <p className="text-gray-600 mt-2">
                Execute the maintenance work and document the actions taken
              </p>
            </div>
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-blue-800 mb-3">
                Work Execution
              </h3>
              <p className="text-blue-700">
                Document all corrective actions taken, materials used, and
                whether additional resources are needed.
              </p>
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Complaint Resolved In-house?
                </label>
                <select
                  name="resolvedInhouse"
                  value={formData.resolvedInhouse}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded-lg px-4 py-3"
                >
                  <option value="yes">Yes - Resolved Internally</option>
                  <option value="no">No - External Help Required</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Resolution Status
                </label>
                <select className="w-full border border-gray-300 rounded-lg px-4 py-3">
                  <option value="completed">Completed</option>
                  <option value="in-progress">In Progress</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Work Completion Remarks
              </label>
              <textarea
                name="resolvedRemark"
                value={formData.resolvedRemark}
                onChange={handleChange}
                placeholder="Detailed description of work performed, issues encountered, and final status..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                rows={4}
              />
            </div>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Purchase of Consumables Required?
                  </label>
                  <select
                    name="consumablesNeeded"
                    value={formData.consumablesNeeded}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {formData.consumablesNeeded === "yes" && (
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Consumable Details
                    </label>
                    <textarea
                      name="consumableDetails"
                      value={formData.consumableDetails}
                      onChange={handleChange}
                      placeholder="Description, quantity, estimated cost..."
                      className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      rows={3}
                    />
                  </div>
                )}
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    External Agency Required?
                  </label>
                  <select
                    name="externalAgencyNeeded"
                    value={formData.externalAgencyNeeded}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {formData.externalAgencyNeeded === "yes" && (
                  <div className="space-y-3">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Agency Name
                      </label>
                      <input
                        name="agencyName"
                        value={formData.agencyName}
                        onChange={handleChange}
                        placeholder="Name of external service provider"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Expected Expenditure (₹)
                      </label>
                      <input
                        type="number"
                        min="0"
                        name="approxExpenditure"
                        value={formData.approxExpenditure}
                        onChange={handleChange}
                        placeholder="Estimated cost"
                        className="w-full border border-gray-300 rounded-lg px-4 py-3"
                      />
                    </div>
                  </div>
                )}
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setCurrentStep(3)}
                className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium"
              >
                ← Previous
              </button>
              <button
                onClick={handleSaveProgress}
                className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition-all font-medium"
              >
                💾 Save Progress
              </button>
              <button
                onClick={handleCompleteAction}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
              >
                ✓ Complete Action
              </button>
            </div>
          </div>
        );
      case 5:
        return (
          <div className="space-y-6">
            <div className="border-b border-gray-200 pb-4">
              <h2 className="text-2xl font-bold text-blue-700 flex items-center gap-3">
                <CheckSquare className="w-7 h-7 text-green-500" />
                Final Closure
              </h2>
              <p className="text-gray-600 mt-2">
                Complete the maintenance request with final documentation and
                sign-off
              </p>
            </div>
            <div className="bg-green-50 border border-green-200 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">
                Final Documentation
              </h3>
              <p className="text-green-700">
                Complete all final remarks, signatures, and closure
                documentation for this maintenance request.
              </p>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Lab Completion Remarks
              </label>
              <textarea
                name="completionRemarkLab"
                value={formData.completionRemarkLab}
                onChange={handleChange}
                placeholder="Final remarks from lab/class in-charge regarding work completion and satisfaction..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                rows={4}
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Lab Assistant Sign-off
              </h3>
              <div className="grid md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Name
                  </label>
                  <input
                    name="labCompletionName"
                    value={formData.labCompletionName}
                    onChange={handleChange}
                    placeholder="Lab assistant name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Signature
                  </label>
                  <input
                    name="labCompletionSignature"
                    value={formData.labCompletionSignature}
                    onChange={handleChange}
                    placeholder="Digital signature"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Date
                  </label>
                  <input
                    type="date"
                    name="labCompletionDate"
                    value={formData.labCompletionDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-2">
                Maintenance Section Completion Remarks
              </label>
              <textarea
                name="completionRemarkMaintenance"
                value={formData.completionRemarkMaintenance}
                onChange={handleChange}
                placeholder="Final remarks from maintenance section regarding work completion, quality, and future recommendations..."
                className="w-full border border-gray-300 rounded-lg px-4 py-3"
                rows={4}
              />
            </div>
            <div className="bg-gray-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">
                Maintenance Section Closure
              </h3>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Complaint Closed Date
                  </label>
                  <input
                    type="date"
                    name="maintenanceClosedDate"
                    value={formData.maintenanceClosedDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    In-charge Signature
                  </label>
                  <input
                    name="maintenanceClosedSignature"
                    value={formData.maintenanceClosedSignature}
                    onChange={handleChange}
                    placeholder="Maintenance in-charge signature"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3"
                  />
                </div>
              </div>
            </div>
          </div>
        );
      default:
        return <p>Invalid step.</p>;
    }
  };
  if (loading) return <div className="p-6 text-lg">Loading...</div>;
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
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          <StepComponent />
        </div>
      </div>
      <div className="flex justify-between items-center mt-8 pt-6 border-t border-gray-200">
        <button
          type="button"
          className={`px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium ${
            currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
          }`}
          onClick={() => setCurrentStep(currentStep - 1)}
          disabled={currentStep === 1}
        >
          ← Previous
        </button>
        <div className="flex gap-3">
          {currentStep >= 3 && currentStep < 5 && (
            <button
              type="button"
              className="px-6 py-2 bg-yellow-500 text-white rounded-lg shadow hover:bg-yellow-600 transition-all font-medium"
              onClick={handleSaveProgress}
            >
              💾 Save Progress
            </button>
          )}
          {currentStep === 3 && (
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
              onClick={handleCompleteVerification}
            >
              ✓ Complete Verification
            </button>
          )}
          {currentStep === 4 && (
            <button
              type="button"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
              onClick={handleCompleteAction}
            >
              ✓ Complete Action
            </button>
          )}
          {currentStep === 5 && (
            <>
              <button
                type="button"
                className="px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all font-medium"
                onClick={handleCompleteClosure}
              >
                ✓ Close Request
              </button>
              <button
                type="button"
                className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
                onClick={downloadPDF}
              >
                📄 Download Report
              </button>
            </>
          )}
          {currentStep < 5 && currentStep >= 1 && currentStep !== 5 && (
            <button
              type="button"
              onClick={() => setCurrentStep(currentStep + 1)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
            >
              Next →
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
export default LabAssistantForm;
