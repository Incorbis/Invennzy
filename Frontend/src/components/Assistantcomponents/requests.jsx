import React, { useState } from "react";
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
                  className={`
                    relative z-10 w-12 h-12 rounded-full border-2 flex items-center justify-center transition-all duration-300
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

function LabAssistantForm() {
  const [currentStep, setCurrentStep] = useState(3);
  const [completedSteps, setCompletedSteps] = useState(2);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const [form, setForm] = useState({
    typeOfProblem: "System",
    date: "2024-08-01",
    department: "Computer Science",
    location: "Lab Room 101",
    complaintDetails: "Computer not starting properly",
    recurringComplaint: "no",
    recurringTimes: "",
    labAssistant: "John Smith",
    labAssistantDate: "2024-08-01",
    hod: "Dr. Johnson",
    hodDate: "2024-08-01",
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

  const showModal = (type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
  };

  const handleSaveProgress = () => {
    showModal(
      "success",
      "Progress Saved Successfully",
      "Your maintenance work progress has been saved successfully. You can continue working on the form or come back to it later."
    );
  };

  const handleCompleteVerification = () => {
    setCompletedSteps(3);
    setCurrentStep(4);
    showModal(
      "success",
      "Verification Completed",
      "Verification step has been completed successfully. The work has been assigned and you can now proceed with corrective actions."
    );
  };

  const handleCompleteAction = () => {
    setCompletedSteps(4);
    setCurrentStep(5);
    showModal(
      "success",
      "Corrective Action Completed",
      "Corrective action has been completed successfully. Please proceed to final closure of the maintenance request."
    );
  };

  const handleCompleteClosure = () => {
    setCompletedSteps(5);
    showModal(
      "success",
      "Maintenance Request Closed",
      "The maintenance request has been successfully completed and closed. The Lab In-charge will be notified of the completion."
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < 5) {
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

    addText("Type of Problem", form.typeOfProblem, true);
    addText("Date", form.date);
    addText("Department", form.department);
    addText("Location", form.location);
    addText("Complaint Details", form.complaintDetails);
    addText("Recurring Complaint", form.recurringComplaint);
    if (form.recurringComplaint === "yes") {
      addText("Number of times", form.recurringTimes);
    }

    y += 5;
    addText("Verification Details", "", true);
    addText("Assigned Person", form.assignedPerson);
    addText("Verification Remarks", form.verificationRemarks);
    addText("Materials Used", form.materialsUsed);

    y += 5;
    addText("Corrective Action", "", true);
    addText("Resolved In-house", form.resolvedInhouse);
    addText("Resolution Remarks", form.resolvedRemark);
    addText("Consumables Needed", form.consumablesNeeded);
    if (form.consumablesNeeded === "yes") {
      addText("Consumable Details", form.consumableDetails);
    }

    y += 5;
    addText("Closure Details", "", true);
    addText("Lab Completion Remarks", form.completionRemarkLab);
    addText("Maintenance Completion Remarks", form.completionRemarkMaintenance);
    addText("Closure Date", form.maintenanceClosedDate);
    doc.save("maintenance_report_complete.pdf");
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
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
          {currentStep === 1 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-500 flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-green-500" />
                  Problem Details (Completed)
                </h2>
                <p className="text-gray-500 mt-2">
                  This information was provided by the Lab In-charge
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">
                    Request Received
                  </h3>
                </div>
                <p className="text-blue-700">
                  The maintenance request has been successfully submitted by the
                  Lab In-charge and is ready for processing.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Type of Problem
                  </label>
                  <input
                    value={form.typeOfProblem}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Date Reported
                  </label>
                  <input
                    value={form.date}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 2 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-500 flex items-center gap-3">
                  <CheckCircle className="w-7 h-7 text-green-500" />
                  Request Details (Completed)
                </h2>
                <p className="text-gray-500 mt-2">
                  Complete request information from Lab In-charge
                </p>
              </div>
              <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckCircle className="w-6 h-6 text-blue-600" />
                  <h3 className="text-lg font-semibold text-blue-800">
                    Request Submitted
                  </h3>
                </div>
                <p className="text-blue-700">
                  All request details have been provided and approved. You can
                  now proceed with verification and work assignment.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Department
                  </label>
                  <input
                    value={form.department}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-500 mb-2">
                    Location
                  </label>
                  <input
                    value={form.location}
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500 mb-2">
                  Complaint Details
                </label>
                <textarea
                  value={form.complaintDetails}
                  disabled
                  className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  rows={3}
                />
              </div>
              <div className="bg-gray-50 rounded-xl p-6">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Approval Information
                </h3>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Lab Assistant
                    </label>
                    <input
                      value={form.labAssistant}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-500 mb-2">
                      Head of Department
                    </label>
                    <input
                      value={form.hod}
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
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
                    Complaint Received Date{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="date"
                    name="inChargeDate"
                    value={form.inChargeDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Your Signature
                  </label>
                  <input
                    name="inChargeSignature"
                    value={form.inChargeSignature}
                    onChange={handleChange}
                    placeholder="Enter your signature/name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Assigned Person <span className="text-red-500">*</span>
                </label>
                <input
                  name="assignedPerson"
                  value={form.assignedPerson}
                  onChange={handleChange}
                  placeholder="Name of person assigned to handle this work"
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Verification Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="verificationRemarks"
                  value={form.verificationRemarks}
                  onChange={handleChange}
                  placeholder="Your remarks on the complaint verification and work assignment..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={4}
                />
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Materials/Tools to be Used
                </label>
                <textarea
                  name="materialsUsed"
                  value={form.materialsUsed}
                  onChange={handleChange}
                  placeholder="List of materials, tools, or components that will be used for repair..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows={3}
                />
              </div>
            </div>
          )}

          {currentStep === 4 && (
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
                    Complaint Resolved In-house?{" "}
                    <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="resolvedInhouse"
                    value={form.resolvedInhouse}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  >
                    <option value="yes">Yes - Resolved Internally</option>
                    <option value="no">No - External Help Required</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Resolution Status
                  </label>
                  <select className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all">
                    <option value="completed">Completed</option>
                    <option value="in-progress">In Progress</option>
                    <option value="pending">Pending</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Work Completion Remarks{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="resolvedRemark"
                  value={form.resolvedRemark}
                  onChange={handleChange}
                  placeholder="Detailed description of work performed, issues encountered, and final status..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      value={form.consumablesNeeded}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  {form.consumablesNeeded === "yes" && (
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Consumable Details
                      </label>
                      <textarea
                        name="consumableDetails"
                        value={form.consumableDetails}
                        onChange={handleChange}
                        placeholder="Description, quantity, estimated cost..."
                        className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      value={form.externalAgencyNeeded}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </select>
                  </div>
                  {form.externalAgencyNeeded === "yes" && (
                    <div className="space-y-3">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Agency Name
                        </label>
                        <input
                          name="agencyName"
                          value={form.agencyName}
                          onChange={handleChange}
                          placeholder="Name of external service provider"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                          value={form.approxExpenditure}
                          onChange={handleChange}
                          placeholder="Estimated cost"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
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
                  Lab Completion Remarks <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="completionRemarkLab"
                  value={form.completionRemarkLab}
                  onChange={handleChange}
                  placeholder="Final remarks from lab/class in-charge regarding work completion and satisfaction..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      Name <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="labCompletionName"
                      value={form.labCompletionName}
                      onChange={handleChange}
                      placeholder="Lab assistant name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Signature
                    </label>
                    <input
                      name="labCompletionSignature"
                      value={form.labCompletionSignature}
                      onChange={handleChange}
                      placeholder="Digital signature"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="labCompletionDate"
                      value={form.labCompletionDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              </div>
              <div>
                <label className="block text-sm font-semibold text-gray-700 mb-2">
                  Maintenance Section Completion Remarks{" "}
                  <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="completionRemarkMaintenance"
                  value={form.completionRemarkMaintenance}
                  onChange={handleChange}
                  placeholder="Final remarks from maintenance section regarding work completion, quality, and future recommendations..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      Complaint Closed Date{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      type="date"
                      name="maintenanceClosedDate"
                      value={form.maintenanceClosedDate}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      In-charge Signature{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <input
                      name="maintenanceClosedSignature"
                      value={form.maintenanceClosedSignature}
                      onChange={handleChange}
                      placeholder="Maintenance in-charge signature"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
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
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
                >
                  Next →
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LabAssistantForm;
