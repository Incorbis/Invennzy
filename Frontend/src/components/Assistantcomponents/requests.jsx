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
    <div className="fixed inset-0 bg-opacity-30 backdrop-blur-sm flex items-center justify-center z-50 p-4">
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
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
            >
              OK
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function ProgressBar({ steps, currentStep, completedSteps = 0 }) {
  const pct = useMemo(() => {
    // guard against negative widths when completedSteps is 0
    const clamped = Math.max(0, completedSteps - 1);
    return (clamped / (steps.length - 1)) * 100;
  }, [completedSteps]);

  return (
    <div className="w-full max-w-4xl mx-auto mb-8">
      <div className="relative">
        <div className="absolute top-6 left-0 w-full h-0.5 bg-gray-200"></div>
        <div
          className="absolute top-6 left-0 h-0.5 bg-blue-600 transition-all duration-500 ease-in-out"
          style={{ width: `${pct}%` }}
        />
        <div className="relative flex justify-between">
          {steps.map((step) => {
            const StepIcon = step.icon;
            const isCompleted = step.id <= completedSteps;
            const isActive = step.id === currentStep;
            const isCurrent = step.id === currentStep;
            const isAccessible = step.id <= Math.max(completedSteps, 2);
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
                  {isCompleted ? (
                    <CheckCircle className="w-6 h-6" />
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
  // removed unused FormData state
  const [currentStep, setCurrentStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });

  const isStepCompleted = (step) => {
    if (step === 5) {
      // ✅ Only count completed when Admin actually approves/rejects
      return (
        form?.adminApprovalStatus === "approved" ||
        form?.adminApprovalStatus === "rejected"
      );
    }

    const fields = stepFields[step];
    return fields.every(
      (field) => form[field] && form[field].toString().trim() !== ""
    );
  };

  const [form, setForm] = useState({
    // Steps 1–2
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
    // Steps 3–5 (read-only here, shown if present)
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
    adminApprovalStatus: "",
    adminApprovalDate: "",
  });

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
    5: ["adminApprovalStatus"], // NEW step
    6: [
      "completionRemarkLab",
      "labCompletionName",
      "labCompletionDate",
      "completionRemarkMaintenance",
      "maintenanceClosedDate",
    ],
  };

  const steps = [
    {
      id: 1,
      title: "Problem Details",
      subtitle: "Type & Date",
      icon: FileText,
      editable: true,
      role: "Lab In-charge",
    },
    {
      id: 2,
      title: "Submit Request",
      subtitle: "Originator Info",
      icon: User,
      editable: true,
      role: "Lab In-charge",
    },
    {
      id: 3,
      title: "Verification",
      subtitle: "Under Review",
      icon: Clock,
      editable: false,
      role: "Maintenance Team",
    },
    {
      id: 4,
      title: "Corrective Action",
      subtitle: "In Progress",
      icon: Settings,
      editable: false,
      role: "Maintenance Team",
    },
    {
      id: 5,
      title: "Admin Approval",
      subtitle:
        form?.adminApprovalStatus === "approved"
          ? "Approved"
          : form?.adminApprovalStatus === "rejected"
          ? "Rejected"
          : "Pending Review",
      icon: AlertCircle,
      role: "Admin",
    },
    {
      id: 6,
      title: "Closure",
      subtitle: "Completed",
      icon: CheckSquare,
      editable: false,
      role: "Maintenance Team",
    },
  ];

  const { requestId } = useParams();
  const isViewMode = !!requestId;
  // add a prop or detect role from pathname
  const isAssistant = window.location.pathname.includes("labassistantdash");

  const lockInitial = (!isAssistant && isViewMode) || completedSteps >= 2;

  const showModal = (type, title, message) =>
    setModal({ isOpen: true, type, title, message });
  const closeModal = () =>
    setModal({ isOpen: false, type: "", title: "", message: "" });

  const handleStep3Submit = async () => {
    try {
      await axios.put(`/api/requests/assistant/${requestId}/verification`, {
        currentStep: 4,
        completedSteps: 3,
        message: "Verification completed",
        assignedPerson: form.assignedPerson,
        inChargeDate: form.inChargeDate,
        verificationRemarks: form.verificationRemarks,
      });
      setCompletedSteps(3);
      setCurrentStep(4);
      showModal(
        "success",
        "Verification Saved",
        "Step 3 details have been saved successfully."
      );
    } catch (err) {
      console.error(err);
      showModal("info", "Error", "Failed to save verification.");
    }
  };

  const handleStep4Submit = async () => {
    try {
      await axios.put(`/api/requests/assistant/${requestId}/Corrective`, {
        currentStep: 5,
        completedSteps: 4,
        message: "Corrective action completed",
        materialsUsed: form.materialsUsed,
        resolvedInhouse: form.resolvedInhouse,
        resolvedRemark: form.resolvedRemark,
        consumablesNeeded: form.consumablesNeeded,
        consumableDetails: form.consumableDetails,
        externalAgencyNeeded: form.externalAgencyNeeded,
        agencyName: form.agencyName,
        approxExpenditure: form.approxExpenditure,
      });
      setCompletedSteps(4);
      setCurrentStep(5);
      showModal(
        "success",
        "Corrective Action Saved",
        "Step 4 details have been saved successfully."
      );
    } catch (err) {
      console.error(err);
      showModal("info", "Error", "Failed to save corrective action.");
    }
  };

  const handleStep5Submit = async () => {
    try {
      await axios.put(`/api/requests/assistant/${requestId}/closure`, {
        completionRemarkLab: form.completionRemarkLab,
        labCompletionName: form.labCompletionName,
        labCompletionSignature: form.labCompletionSignature,
        labCompletionDate: form.labCompletionDate,
        completionRemarkMaintenance: form.completionRemarkMaintenance,
        maintenanceClosedDate: form.maintenanceClosedDate,
        maintenanceClosedSignature: form.maintenanceClosedSignature,
        currentStep: 6, // stays 5 since closure is last
        completedSteps: 6,
        message: "Closure completed successfully",
      });

      setCompletedSteps(6);
      showModal(
        "success",
        "Closure Saved",
        "Step 5 (Closure) details have been saved successfully."
      );
    } catch (err) {
      console.error(err);
      showModal("info", "Error", "Failed to save closure.");
    }
  };

  const handleSubmitRequest = async () => {
    const staffId = localStorage.getItem("staffId");
    const cleanedForm = {
      ...form,
      recurringTimes:
        form.recurringComplaint === "yes" ? form.recurringTimes : null,
    };

    try {
      const res = await fetch("/api/requests/create", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ form: cleanedForm, staff_id: staffId }),
      });
      if (!res.ok) throw new Error("Submission failed");
      const data = await res.json();

      // after create, mark steps 1–2 as done, move to 3 locally
      setCompletedSteps(2);
      setCurrentStep(3);

      showModal(
        "info",
        "Request Submitted Successfully",
        `Your maintenance request has been submitted (Request ID: ${data.requestId}).`
      );
    } catch (err) {
      console.error("Submit error:", err);
      showModal("info", "Submission Failed", "Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => {
    if (currentStep < 6 && currentStep <= completedSteps) {
      setCurrentStep((prev) => {
        const next = prev + 1;
        // ✅ ensure completedSteps catches up with current
        if (next > completedSteps) {
          setCompletedSteps(next - 1);
        }
        return next;
      });
    }
  };

  const prevStep = () => {
    if (currentStep > 1) setCurrentStep((s) => s - 1);
  };

  useEffect(() => {
    const fetchRequest = async () => {
      if (!requestId) return;
      try {
        setLoading(true);
        const res = await axios.get(`/api/requests/${requestId}`);
        const data = res.data || {};
        // Set form data (as before)
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
          inChargeSignature: data.in_charge_signature || "",
          assignedPerson: data.assigned_person || "",
          verificationRemarks: data.verification_remarks || "",
          materialsUsed: data.materials_used || "",
          resolvedInhouse: data.resolved_inhouse || "yes",
          resolvedRemark: data.resolved_remark || "",
          consumablesNeeded: data.consumables_needed || "no",
          consumableDetails: data.consumable_details || "",
          externalAgencyNeeded: data.external_agency_needed || "no",
          agencyName: data.agency_name || "",
          approxExpenditure: data.approx_expenditure || "",
          completionRemarkLab: data.completion_remark_lab || "",
          labCompletionName: data.lab_completion_name || "",
          labCompletionSignature: data.lab_completion_signature || "",
          labCompletionDate: data.lab_completion_date
            ? String(data.lab_completion_date).split("T")[0]
            : "",
          completionRemarkMaintenance: data.completion_remark_maintenance || "",
          maintenanceClosedDate: data.maintenance_closed_date
            ? String(data.maintenance_closed_date).split("T")[0]
            : "",
          maintenanceClosedSignature: data.maintenance_closed_signature || "",
          adminApprovalStatus: data.admin_approval_status || "",
          adminApprovalDate: data.admin_approval_date
            ? String(data.admin_approval_date).split("T")[0]
            : "",
        });
        // Determine completed steps
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

  useEffect(() => {
    let maxCompleted = 0;
    for (let step = 1; step <= 6; step++) {
      if (isStepCompleted(step)) {
        maxCompleted = step;
      } else {
        break;
      }
    }
    setCompletedSteps(maxCompleted);
  }, [form]);

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
    doc.text("Maintenance Request Form - Lab In-charge Copy", 14, y);
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
    if (form.recurringComplaint === "yes")
      addText("Number of times", form.recurringTimes);
    addText("Lab Assistant", form.labAssistant);
    addText("Lab Assistant Date", form.labAssistantDate);
    addText("Head of Department", form.hod);
    addText("HOD Date", form.hodDate);

    doc.save("maintenance_request_lab_incharge.pdf");
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
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <FileText className="w-7 h-7 text-blue-600" />
                      Problem Details
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Please provide the basic information about the maintenance
                      issue
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Type of Problem <span className="text-red-500">*</span>
                      </label>
                      <select
                        name="typeOfProblem"
                        value={form.typeOfProblem}
                        onChange={handleChange}
                        required
                        disabled={
                          (!isAssistant && lockInitial) ||
                          (isAssistant && currentStep <= 2)
                        }
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <option value="">Select Problem Type</option>
                        <option value="System">System</option>
                        <option value="Furniture">Furniture</option>
                        <option value="Civil">Civil</option>
                        <option value="Electrical">Electrical</option>
                        <option value="Workshop">Workshop</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Date <span className="text-red-500">*</span>
                      </label>
                      <input
                        type="date"
                        name="date"
                        value={form.date}
                        onChange={handleChange}
                        required
                        disabled={
                          (!isAssistant && lockInitial) ||
                          (isAssistant && currentStep <= 2)
                        }
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 2 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <User className="w-7 h-7 text-blue-600" />
                      Request Details
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Complete the request information and submit for processing
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Department <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="department"
                        value={form.department}
                        onChange={handleChange}
                        required
                        disabled={
                          (!isAssistant && lockInitial) ||
                          (isAssistant && currentStep <= 2)
                        }
                        placeholder="Enter department name"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Location <span className="text-red-500">*</span>
                      </label>
                      <input
                        name="location"
                        value={form.location}
                        onChange={handleChange}
                        required
                        disabled={
                          (!isAssistant && lockInitial) ||
                          (isAssistant && currentStep <= 2)
                        }
                        placeholder="Enter specific location"
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Complaint Details <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      name="complaintDetails"
                      value={form.complaintDetails}
                      onChange={handleChange}
                      required
                      disabled={
                        (!isAssistant && lockInitial) ||
                        (isAssistant && currentStep <= 2)
                      }
                      placeholder="Describe the issue in detail..."
                      className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                        lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                      rows={4}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-2">
                        Recurring Complaint?
                      </label>
                      <select
                        name="recurringComplaint"
                        value={form.recurringComplaint}
                        onChange={handleChange}
                        disabled={
                          (!isAssistant && lockInitial) ||
                          (isAssistant && currentStep <= 2)
                        }
                        className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>

                    {form.recurringComplaint === "yes" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          How many times?
                        </label>
                        <input
                          type="number"
                          name="recurringTimes"
                          min="1"
                          value={form.recurringTimes}
                          onChange={handleChange}
                          disabled={
                            (!isAssistant && lockInitial) ||
                            (isAssistant && currentStep <= 2)
                          }
                          placeholder="Enter number"
                          className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                    )}
                  </div>

                  <div className="bg-gray-50 rounded-xl p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">
                      Approval Information
                    </h3>
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Lab Assistant Name
                        </label>
                        <input
                          name="labAssistant"
                          value={form.labAssistant}
                          onChange={handleChange}
                          disabled={
                            (!isAssistant && lockInitial) ||
                            (isAssistant && currentStep <= 2)
                          }
                          placeholder="Enter lab assistant name"
                          className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          name="labAssistantDate"
                          value={form.labAssistantDate}
                          onChange={handleChange}
                          disabled={
                            (!isAssistant && lockInitial) ||
                            (isAssistant && currentStep <= 2)
                          }
                          className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Head of Department
                        </label>
                        <input
                          name="hod"
                          value={form.hod}
                          onChange={handleChange}
                          disabled={
                            (!isAssistant && lockInitial) ||
                            (isAssistant && currentStep <= 2)
                          }
                          placeholder="Enter HOD name"
                          className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>

                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-2">
                          Date
                        </label>
                        <input
                          type="date"
                          name="hodDate"
                          value={form.hodDate}
                          onChange={handleChange}
                          disabled={
                            (!isAssistant && lockInitial) ||
                            (isAssistant && currentStep <= 2)
                          }
                          className={`w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {currentStep === 3 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <Clock className="w-7 h-7 text-orange-500" />
                      Verification Stage
                    </h2>
                    {!isAssistant && (
                      <p className="text-gray-500 mt-2">
                        Your request is being reviewed by the maintenance team
                      </p>
                    )}
                  </div>

                  {isAssistant && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Assigned Person
                        </label>
                        <input
                          name="assignedPerson"
                          value={form.assignedPerson}
                          onChange={handleChange}
                          placeholder="Enter assigned person"
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          In-Charge Date
                        </label>
                        <input
                          type="date"
                          name="inChargeDate"
                          value={form.inChargeDate}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                      </div>
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Verification Remarks
                        </label>
                        <textarea
                          name="verificationRemarks"
                          value={form.verificationRemarks}
                          onChange={handleChange}
                          rows={3}
                          placeholder="Enter remarks..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-3"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 4 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <Settings className="w-7 h-7 text-blue-500" />
                      Corrective Action
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Maintenance work is in progress. Fill in the details
                      below.
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <Settings className="w-6 h-6 text-blue-600" />
                      <h3 className="text-lg font-semibold text-blue-800">
                        Work in Progress
                      </h3>
                    </div>
                    <p className="text-blue-700">
                      The maintenance team is actively working on resolving the
                      issue. Fill in the details below.
                    </p>
                  </div>
                  {isAssistant && (
                    <div className="grid md:grid-cols-2 gap-6">
                      <div className="md:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Materials Used <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="materialsUsed"
                          value={form.materialsUsed || ""}
                          onChange={handleChange}
                          placeholder="List materials used..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resolved In-house?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="resolvedInhouse"
                          value={form.resolvedInhouse || "yes"}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Resolution Remark{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="resolvedRemark"
                          value={form.resolvedRemark || ""}
                          onChange={handleChange}
                          placeholder="Enter resolution remark..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Consumables Needed?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="consumablesNeeded"
                          value={form.consumablesNeeded || "no"}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      {form.consumablesNeeded === "yes" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Consumable Details{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="consumableDetails"
                            value={form.consumableDetails || ""}
                            onChange={handleChange}
                            placeholder="Enter consumable details..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          External Agency Needed?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="externalAgencyNeeded"
                          value={form.externalAgencyNeeded || "no"}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      {form.externalAgencyNeeded === "yes" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Agency Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="agencyName"
                            value={form.agencyName || ""}
                            onChange={handleChange}
                            placeholder="Enter agency name..."
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Approx. Expenditure
                        </label>
                        <input
                          name="approxExpenditure"
                          value={form.approxExpenditure || ""}
                          onChange={handleChange}
                          placeholder="Enter approximate expenditure..."
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {currentStep === 5 && (
                <div className="space-y-6">
                  <div className="pb-4">
                    <h2 className="text-2xl font-bold flex items-center gap-3">
                      <AlertCircle className="w-7 h-7 text-purple-500" />
                      Admin Approval
                    </h2>
                    <p className="text-gray-600 mt-2">
                      {form?.adminApprovalStatus === "approved"
                        ? "This request has been approved by Admin."
                        : form?.adminApprovalStatus === "rejected"
                        ? "This request was rejected by Admin."
                        : "This request is pending admin approval."}
                    </p>
                  </div>
                </div>
              )}

              {currentStep === 6 && (
                <div className="space-y-6">
                  <div className="border-b border-gray-200 pb-4">
                    <h2 className="text-2xl font-bold text-gray-900 flex items-center gap-3">
                      <CheckSquare className="w-7 h-7 text-green-500" />
                      Closure
                    </h2>
                    <p className="text-gray-600 mt-2">
                      Final completion and sign-off
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <CheckSquare className="w-6 h-6 text-green-600" />
                      <h3 className="text-lg font-semibold text-green-800">
                        Finalize Request
                      </h3>
                    </div>
                    <p className="text-green-700">
                      Complete the final details for this maintenance request.
                    </p>
                  </div>
                  {isAssistant && (
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Completion Remarks (Lab){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="completionRemarkLab"
                          value={form.completionRemarkLab || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          rows={3}
                        />
                      </div>
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Completed By (Lab){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="labCompletionName"
                            value={form.labCompletionName || ""}
                            onChange={handleChange}
                            placeholder="Enter name"
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-2">
                            Completion Date (Lab){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="labCompletionDate"
                            value={form.labCompletionDate || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Completion Remarks (Maintenance){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="completionRemarkMaintenance"
                          value={form.completionRemarkMaintenance || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                          rows={3}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Closed Date (Maintenance){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="maintenanceClosedDate"
                          value={form.maintenanceClosedDate || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all"
                        />
                      </div>
                    </div>
                  )}
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
                  {currentStep === 2 && !isViewMode && !isAssistant && (
                    <button
                      type="button"
                      className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all font-medium"
                      onClick={handleSubmitRequest}
                    >
                      🚀 Submit Request
                    </button>
                  )}
                  {currentStep < 6 && isAssistant && (
                    <button
                      type="button"
                      className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
                      onClick={nextStep}
                    >
                      Next →
                    </button>
                  )}
                  {currentStep === 3 && isAssistant && (
                    <button
                      type="button"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                      onClick={handleStep3Submit}
                    >
                      ✅ Verify & Save
                    </button>
                  )}
                  {currentStep === 4 && isAssistant && (
                    <button
                      type="button"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                      onClick={handleStep4Submit}
                    >
                      💾 Save Corrective Action
                    </button>
                  )}
                  {currentStep === 6 && isAssistant && (
                    <button
                      type="button"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium"
                      onClick={handleStep5Submit}
                    >
                      🔒 Save Closure
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

export default LabAssistantForm;
