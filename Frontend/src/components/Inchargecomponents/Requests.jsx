import React, { useState } from "react";
import jsPDF from "jspdf";
import { CheckCircle, AlertCircle, X } from "lucide-react";

const steps = [
  "Type of Problem & Date",
  "Originator Details",
  "Verification",
  "Corrective Action",
  "Closure",
];

// Professional Modal Component
function Modal({ isOpen, onClose, type, title, message }) {
  if (!isOpen) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-8 h-8 text-green-500" />;
      case 'info':
        return <AlertCircle className="w-8 h-8 text-blue-500" />;
      default:
        return <AlertCircle className="w-8 h-8 text-gray-500" />;
    }
  };

  const getBgColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'info':
        return 'bg-blue-50 border-blue-200';
      default:
        return 'bg-gray-50 border-gray-200';
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
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

function LabInchargeForm() {
  const [step, setStep] = useState(1);
  const [modal, setModal] = useState({ isOpen: false, type: '', title: '', message: '' });
  const [form, setForm] = useState({
    typeOfProblem: "",
    date: "",
    department: "",
    location: "",
    complaintDetails: "",
    recurringComplaint: "no",
    recurringTimes: "",
    labAssistant: "",
    labAssistantSignature: "",
    labAssistantDate: "",
    hod: "",
    hodSignature: "",
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

  const showModal = (type, title, message) => {
    setModal({ isOpen: true, type, title, message });
  };

  const closeModal = () => {
    setModal({ isOpen: false, type: '', title: '', message: '' });
  };

  const handleSaveDetails = () => {
    showModal(
      'success',
      'Details Saved Successfully',
      'Your form details have been saved successfully. You can continue editing or raise an issue when ready.'
    );
  };

  const handleRaiseIssue = () => {
    showModal(
      'info',
      'Issue Raised Successfully',
      'Your maintenance request has been submitted and forwarded to the Lab Assistant for further processing. You will be notified of any updates on the progress.'
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, 5));
  const prevStep = () => setStep((prev) => Math.max(prev - 1, 1));

  const downloadPDF = () => {
    const doc = new jsPDF();
    let y = 12;
    function write(label, value) {
      doc.setFont("helvetica", "normal");
      doc.setFontSize(11);
      doc.text(`${label}: ${value || "-"}`, 14, y);
      y += 8;
    }
    doc.setFont("helvetica", "bold");
    doc.setFontSize(16);
    doc.text("Maintenance Report Form (Lab In-charge Copy)", 14, y);
    y += 10;
    doc.setLineWidth(0.5);
    doc.line(14, y, 195, y);
    y += 6;
    write("Type of Problem", form.typeOfProblem);
    write("Date", form.date);
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.text("-- Originator Details --", 14, y);
    y += 7;
    write("Department", form.department);
    write("Location", form.location);
    write("Complaint Details", form.complaintDetails);
    write("Recurring Complaint", form.recurringComplaint);
    if (form.recurringComplaint === "yes")
      write("Times", form.recurringTimes);
    write("Lab Assistant", form.labAssistant);
    write("Assistant Signature", form.labAssistantSignature);
    write("Date", form.labAssistantDate);
    write("Head of Dept.", form.hod);
    write("HoD Signature", form.hodSignature);
    write("Date", form.hodDate);

    doc.save("maintenance_report_incharge.pdf");
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center justify-center py-8 px-2">
      {/* Modal */}
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />

      {/* User Role Indicator */}
      <div className="w-full max-w-2xl mb-4">
        <div className="bg-blue-600 text-white px-4 py-2 rounded-lg text-center font-semibold">
          Lab In-charge Portal
        </div>
      </div>

      {/*--- Progress Bar ---*/}
      <div className="w-full max-w-2xl flex gap-2 justify-start items-center mb-6">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 flex flex-col items-center transition-all 
                ${i + 1 === step 
                  ? "bg-blue-600 text-white font-semibold shadow-lg"
                  : i + 1 <= 2
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-100 text-gray-400"} 
                rounded-md py-2 px-2 text-center 
                ${i + 1 > 2 ? "opacity-50" : ""}
                `}
            style={{ minWidth: "160px", maxWidth: "170px" }}
          >
            <span className="block text-sm">{i + 1}. {s}</span>
            {i + 1 > 2 && <span className="text-xs">(View Only)</span>}
          </div>
        ))}
      </div>

      {/*--- Form Container Card ---*/}
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 relative">
        <div className="space-y-6">
          {/* ---------- Step 1 ---------- */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-700">Step 1: Type of Problem & Date</h3>
              <div className="mb-4">
                <label className="block font-medium text-gray-700 mb-1">
                  Type of Problem
                </label>
                <select
                  name="typeOfProblem"
                  value={form.typeOfProblem}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                >
                  <option value="">Select</option>
                  <option value="System">System</option>
                  <option value="Furniture">Furniture</option>
                  <option value="Civil">Civil</option>
                  <option value="Electrical">Electrical</option>
                  <option value="Workshop">Workshop</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-700 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  name="date"
                  value={form.date}
                  onChange={handleChange}
                  required
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-400"
                />
              </div>
            </div>
          )}

          {/* ---------- Step 2 ---------- */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-700">Step 2: Originator Details</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block">Department</label>
                  <input
                    name="department"
                    value={form.department}
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block">Location</label>
                  <input
                    name="location"
                    value={form.location}
                    required
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block">Complaint Details</label>
                <textarea
                  name="complaintDetails"
                  value={form.complaintDetails}
                  required
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block">Recurring Complaint?</label>
                  <select
                    name="recurringComplaint"
                    value={form.recurringComplaint}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                </div>
                {form.recurringComplaint === "yes" && (
                  <div>
                    <label className="block">How many times?</label>
                    <input
                      type="number"
                      name="recurringTimes"
                      min="1"
                      value={form.recurringTimes}
                      onChange={handleChange}
                      className="w-full border border-gray-300 rounded px-3 py-2"
                    />
                  </div>
                )}
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block">Lab Assistant Name</label>
                  <input
                    name="labAssistant"
                    value={form.labAssistant}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block">Date</label>
                  <input
                    type="date"
                    name="labAssistantDate"
                    value={form.labAssistantDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block">HOD Name</label>
                  <input
                    name="hod"
                    value={form.hod}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block">Date</label>
                  <input
                    type="date"
                    name="hodDate"
                    value={form.hodDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
            </div>
          )}

          {/* ---------- Step 3 - View Only ---------- */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-500">Step 3: Verification (View Only)</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  This section will be filled by the maintenance team. You can view the form structure but cannot edit these fields.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500">Complaint Received Date</label>
                  <input
                    type="date"
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-500">Name of person to whom work is allotted</label>
                <input
                  value=""
                  disabled
                  className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                />
              </div>
              <div className="mt-4">
                <label className="block text-gray-500">Verification and remarks</label>
                <textarea
                  value=""
                  disabled
                  className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* ---------- Step 4 - View Only ---------- */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-500">Step 4: Corrective Action (View Only)</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  This section will be filled by the maintenance team. You can view the form structure but cannot edit these fields.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500">Materials Used</label>
                  <textarea
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                    rows={2}
                  />
                </div>
                <div>
                  <label className="block text-gray-500">Complaint resolved inhouse?</label>
                  <select
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  >
                    <option value="">Select</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-500">Resolved Remarks</label>
                <textarea
                  value=""
                  disabled
                  className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* ---------- Step 5 - View Only ---------- */}
          {step === 5 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-500">Step 5: Closure (View Only)</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  This section will be filled by the maintenance team. You can view the form structure but cannot edit these fields.
                </p>
              </div>
              <div>
                <label className="block text-gray-500">Completion Remarks (Lab)</label>
                <textarea
                  value=""
                  disabled
                  className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  rows={2}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-gray-500">Lab Completion Name</label>
                  <input
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-500">Date</label>
                  <input
                    type="date"
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
            </div>
          )}

          {/* --- Navigation/Actions --- */}
          <div className="flex justify-between items-center mt-8 gap-4">
            <button
              type="button"
              className={`px-6 py-2 bg-gray-300 text-gray-700 rounded hover:bg-gray-400 transition font-medium ${
                step === 1 ? "opacity-50 cursor-not-allowed" : ""
              }`}
              onClick={prevStep}
              disabled={step === 1}
            >
              Back
            </button>
            <div className="flex gap-4">
              {step <= 2 && (
                <button
                  type="button"
                  className="px-6 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 font-semibold"
                  onClick={handleSaveDetails}
                >
                  Save Details
                </button>
              )}
              {step === 2 && (
                <button
                  type="button"
                  className="px-6 py-2 bg-red-600 text-white rounded shadow hover:bg-red-700 font-semibold"
                  onClick={handleRaiseIssue}
                >
                  Raise Issue
                </button>
              )}
              {step < 5 ? (
                <button
                  type="button"
                  onClick={() => step < 5 && nextStep()}
                  className="px-8 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 font-semibold"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  className="px-8 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 font-semibold"
                  onClick={downloadPDF}
                >
                  Download PDF
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

