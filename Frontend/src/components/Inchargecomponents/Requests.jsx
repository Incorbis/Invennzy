import React, { useEffect, useState } from "react";
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
    title: "Closure",
    subtitle: "Completed",
    icon: CheckSquare,
    editable: false,
    role: "Maintenance Team",
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

function LabInchargeForm() {
  const [requests, setRequests] = useState([]);
  const [currentStep, setCurrentStep] = useState(1);
  const [completedSteps, setCompletedSteps] = useState(0);
  const [modal, setModal] = useState({
    isOpen: false,
    type: "",
    title: "",
    message: "",
  });
  const [form, setForm] = useState({
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
  });
  const { requestId } = useParams();

  const showModal = (type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: "", title: "", message: "" });
  };

  const handleSaveDetails = () => {
    showModal(
      "success",
      "Details Saved Successfully",
      "Your form details have been saved successfully. You can continue editing or submit the request when ready."
    );
  };

  const handleSubmitRequest = async () => {
    const staffId = localStorage.getItem("staffId");
    const cleanedForm = {
      ...form,
      recurringTimes:
        form.recurringComplaint === "yes" ? form.recurringTimes : null,
    };
    try {
      const response = await fetch("/api/requests/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          form: cleanedForm,
          staff_id: staffId,
        }),
      });
      if (!response.ok) throw new Error("Submission failed");
      const data = await response.json();
      setCompletedSteps(2);
      setCurrentStep(3);
      showModal(
        "info",
        "Request Submitted Successfully",
        `Your maintenance request has been submitted (Request ID: ${data.requestId}).`
      );
    } catch (error) {
      console.error("Submit error:", error);
      showModal("info", "Submission Failed", "Please try again.");
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
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
    if (form.recurringComplaint === "yes") {
      addText("Number of times", form.recurringTimes);
    }
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
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    required
                    onChange={handleChange}
                    placeholder="Enter department name"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Location <span className="text-red-500">*</span>
                  </label>
                  <input
                    name="location"
                    value={form.location}
                    required
                    onChange={handleChange}
                    placeholder="Enter specific location"
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                  required
                  onChange={handleChange}
                  placeholder="Describe the issue in detail..."
                  className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                    className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      placeholder="Enter number"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
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
                      placeholder="Enter lab assistant name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                      placeholder="Enter HOD name"
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
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
                      className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all bg-white"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {currentStep === 3 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-500 flex items-center gap-3">
                  <Clock className="w-7 h-7 text-orange-500" />
                  Verification Stage
                </h2>
                <p className="text-gray-500 mt-2">
                  Your request is being reviewed by the maintenance team
                </p>
              </div>
              <div className="bg-orange-50 border border-orange-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <Clock className="w-6 h-6 text-orange-600" />
                  <h3 className="text-lg font-semibold text-orange-800">
                    Under Review
                  </h3>
                </div>
                <p className="text-orange-700">
                  The maintenance team is currently reviewing your request. They
                  will verify the details and assign the work to appropriate
                  personnel. You will be notified once this step is completed.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 opacity-50">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Assigned Person (Pending)
                  </label>
                  <input
                    value=""
                    disabled
                    placeholder="Will be assigned by maintenance team"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Verification Date (Pending)
                  </label>
                  <input
                    type="date"
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {currentStep === 4 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-500 flex items-center gap-3">
                  <Settings className="w-7 h-7 text-blue-500" />
                  Corrective Action
                </h2>
                <p className="text-gray-500 mt-2">
                  Maintenance work is in progress
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
                  The maintenance team is actively working on resolving your
                  issue. This section will be updated with materials used and
                  progress details.
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-6 opacity-50">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Materials Used
                  </label>
                  <textarea
                    value=""
                    disabled
                    placeholder="Will be filled by maintenance team"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                    rows={3}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Resolution Status
                  </label>
                  <select
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                  >
                    <option value="">Pending Assessment</option>
                  </select>
                </div>
              </div>
            </div>
          )}

          {currentStep === 5 && (
            <div className="space-y-6">
              <div className="border-b border-gray-200 pb-4">
                <h2 className="text-2xl font-bold text-gray-500 flex items-center gap-3">
                  <CheckSquare className="w-7 h-7 text-green-500" />
                  Closure
                </h2>
                <p className="text-gray-500 mt-2">
                  Final completion and sign-off
                </p>
              </div>
              <div className="bg-green-50 border border-green-200 rounded-xl p-6">
                <div className="flex items-center gap-3 mb-4">
                  <CheckSquare className="w-6 h-6 text-green-600" />
                  <h3 className="text-lg font-semibold text-green-800">
                    Awaiting Completion
                  </h3>
                </div>
                <p className="text-green-700">
                  Once the maintenance work is completed, this section will
                  contain the final remarks and completion details from both lab
                  and maintenance teams.
                </p>
              </div>
              <div className="space-y-4 opacity-50">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-2">
                    Completion Remarks
                  </label>
                  <textarea
                    value=""
                    disabled
                    placeholder="Will be filled upon completion"
                    className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                    rows={3}
                  />
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Completed By
                    </label>
                    <input
                      value=""
                      disabled
                      placeholder="Maintenance team member"
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-400 mb-2">
                      Completion Date
                    </label>
                    <input
                      type="date"
                      value=""
                      disabled
                      className="w-full border border-gray-200 rounded-lg px-4 py-3 bg-gray-50 cursor-not-allowed"
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
              {currentStep === 2 && (
                <button
                  type="button"
                  className="px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all font-medium"
                  onClick={handleSubmitRequest}
                >
                  🚀 Submit Request
                </button>
              )}
              {currentStep < 5 && currentStep < 3 && (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium"
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
        </div>
      </div>
    </div>
  );
}

export default LabInchargeForm;
