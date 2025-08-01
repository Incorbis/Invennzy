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

function LabAssistantForm() {
  const [step, setStep] = useState(1); // Start from step 1 but allow viewing
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
      'Your maintenance form details have been saved successfully. You can continue working on the form or come back to it later.'
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const nextStep = () => setStep((prev) => Math.min(prev + 1, steps.length));
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
    doc.text("Maintenance Report Form", 14, y);
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
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.text("-- Verification --", 14, y);
    y += 7;
    write("Maintenance In Charge Date", form.inChargeDate);
    write("In Charge Signature", form.inChargeSignature);
    write("Assigned to", form.assignedPerson);
    write("Verification Remarks", form.verificationRemarks);
    write("Materials Used", form.materialsUsed);
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.text("-- Corrective Action --", 14, y);
    y += 7;
    write("Resolved Inhouse", form.resolvedInhouse);
    write("Remark", form.resolvedRemark);
    write("Consumables Needed", form.consumablesNeeded);
    if (form.consumablesNeeded === "yes")
      write("Consumable Details", form.consumableDetails);
    write("External Agency Needed", form.externalAgencyNeeded);
    if (form.externalAgencyNeeded === "yes") {
      write("Agency", form.agencyName);
      write("Approx. Expenditure", form.approxExpenditure);
    }
    y += 3;
    doc.setFont("helvetica", "bold");
    doc.text("-- Report Closure --", 14, y);
    y += 7;
    write("Lab Completion Remark", form.completionRemarkLab);
    write("Lab Completion By", form.labCompletionName);
    write("Lab Completion Signature", form.labCompletionSignature);
    write("Lab Completion Date", form.labCompletionDate);
    write("Maintenance Completion Remark", form.completionRemarkMaintenance);
    write("Maintenance Closure Date", form.maintenanceClosedDate);
    write("Maintenance Closure Signature", form.maintenanceClosedSignature);

    doc.save("maintenance_report_form.pdf");
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
        <div className="bg-green-600 text-white px-4 py-2 rounded-lg text-center font-semibold">
          Lab Assistant Portal
        </div>
      </div>

      {/*--- Progress Bar ---*/}
      <div className="w-full max-w-2xl flex gap-2 justify-start items-center mb-6">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 flex flex-col items-center transition-all 
                ${i + 1 === step 
                  ? "bg-green-600 text-white font-semibold shadow-lg"
                  : i + 1 >= 3
                  ? "bg-gray-200 text-gray-700"
                  : "bg-gray-100 text-gray-400"} 
                rounded-md py-2 px-2 text-center 
                ${i + 1 < 3 ? "opacity-50" : ""}
                `}
            style={{ minWidth: "160px", maxWidth: "170px" }}
          >
            <span className="block text-sm">{i + 1}. {s}</span>
            {i + 1 < 3 && <span className="text-xs">(View Only)</span>}
          </div>
        ))}
      </div>

      {/*--- Form Container Card ---*/}
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 relative">
        <div className="space-y-6">
          {/* ---------- Step 1 - View Only ---------- */}
          {step === 1 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-500">Step 1: Type of Problem & Date (View Only)</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  This section was filled by the Lab In-charge. You can view the details but cannot edit them.
                </p>
              </div>
              <div className="mb-4">
                <label className="block font-medium text-gray-500 mb-1">
                  Type of Problem
                </label>
                <select
                  value=""
                  disabled
                  className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                >
                  <option value="">Not specified</option>
                </select>
              </div>
              <div>
                <label className="block font-medium text-gray-500 mb-1">
                  Date
                </label>
                <input
                  type="date"
                  value=""
                  disabled
                  className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                />
              </div>
            </div>
          )}

          {/* ---------- Step 2 - View Only ---------- */}
          {step === 2 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-gray-500">Step 2: Originator Details (View Only)</h3>
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-yellow-800 text-sm">
                  <AlertCircle className="inline w-4 h-4 mr-1" />
                  This section was filled by the Lab In-charge. You can view the details but cannot edit them.
                </p>
              </div>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-gray-500">Department</label>
                  <input
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <div>
                  <label className="block text-gray-500">Location</label>
                  <input
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block text-gray-500">Complaint Details</label>
                <textarea
                  value=""
                  disabled
                  className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  rows={2}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block text-gray-500">Recurring Complaint?</label>
                  <select
                    value=""
                    disabled
                    className="w-full border border-gray-200 rounded px-3 py-2 bg-gray-50 cursor-not-allowed"
                  >
                    <option value="">Not specified</option>
                  </select>
                </div>
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-gray-500">Lab Assistant Name</label>
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
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block text-gray-500">HOD Name</label>
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

          {/* ---------- Step 3 - Editable ---------- */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-700">Step 3: Verification</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block">Complaint Received Date</label>
                  <input
                    type="date"
                    name="inChargeDate"
                    value={form.inChargeDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block">Name of person to whom work is allotted</label>
                <input
                  name="assignedPerson"
                  value={form.assignedPerson}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                />
              </div>
              <div className="mt-4">
                <label className="block">Verification and remarks</label>
                <textarea
                  name="verificationRemarks"
                  value={form.verificationRemarks}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows={2}
                />
              </div>
              <div className="mt-4">
                <label className="block">Materials replaced/repaired/used</label>
                <textarea
                  name="materialsUsed"
                  value={form.materialsUsed}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* ---------- Step 4 - Editable ---------- */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-700">Step 4: Corrective Action</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block">Complaint resolved and closed inhouse?</label>
                  <select
                    name="resolvedInhouse"
                    value={form.resolvedInhouse}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>
                <div>
                  <label className="block">Remark</label>
                  <textarea
                    name="resolvedRemark"
                    value={form.resolvedRemark}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                    rows={2}
                  />
                </div>
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block">Purchase of consumables required/recommended?</label>
                  <select
                    name="consumablesNeeded"
                    value={form.consumablesNeeded}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  {form.consumablesNeeded === "yes" && (
                    <textarea
                      name="consumableDetails"
                      value={form.consumableDetails}
                      onChange={handleChange}
                      placeholder="Description/quantity/cost"
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      rows={2}
                    />
                  )}
                </div>
                <div>
                  <label className="block">Recommended maintenance from external agency?</label>
                  <select
                    name="externalAgencyNeeded"
                    value={form.externalAgencyNeeded}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  >
                    <option value="no">No</option>
                    <option value="yes">Yes</option>
                  </select>
                  {form.externalAgencyNeeded === "yes" && (
                    <div>
                      <input
                        name="agencyName"
                        value={form.agencyName}
                        onChange={handleChange}
                        placeholder="Agency Name"
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                      <input
                        type="number"
                        min="0"
                        name="approxExpenditure"
                        value={form.approxExpenditure}
                        onChange={handleChange}
                        placeholder="Expected approx. expenditure"
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---------- Step 5 - Editable ---------- */}
          {step === 5 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-green-700">Step 5: Maintenance Report Closure</h3>
              <div>
                <label className="block">Remark on work completion (Lab/class in charge)</label>
                <textarea
                  name="completionRemarkLab"
                  value={form.completionRemarkLab}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows={2}
                />
              </div>
              <div className="grid sm:grid-cols-3 gap-4 mt-4">
                <div>
                  <label className="block">Lab Assistant Name</label>
                  <input
                    name="labCompletionName"
                    value={form.labCompletionName}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block">Signature</label>
                  <input
                    name="labCompletionSignature"
                    value={form.labCompletionSignature}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block">Date</label>
                  <input
                    type="date"
                    name="labCompletionDate"
                    value={form.labCompletionDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block">Remark on work completion (Maintenance section)</label>
                <textarea
                  name="completionRemarkMaintenance"
                  value={form.completionRemarkMaintenance}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  rows={2}
                />
              </div>
              <div className="grid sm:grid-cols-2 gap-4 mt-4">
                <div>
                  <label className="block">
                    Maintenance section in-charge complaint closed date
                  </label>
                  <input
                    type="date"
                    name="maintenanceClosedDate"
                    value={form.maintenanceClosedDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
                  />
                </div>
                <div>
                  <label className="block">Signature</label>
                  <input
                    name="maintenanceClosedSignature"
                    value={form.maintenanceClosedSignature}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-green-400"
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
              {step >= 3 && (
                <button
                  type="button"
                  className="px-6 py-2 bg-yellow-500 text-white rounded shadow hover:bg-yellow-600 font-semibold"
                  onClick={handleSaveDetails}
                >
                  Save Details
                </button>
              )}
              {step < steps.length ? (
                <button
                  type="button"
                  onClick={nextStep}
                  className="px-8 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 font-semibold"
                >
                  Next
                </button>
              ) : (
                <button
                  type="button"
                  onClick={downloadPDF}
                  className="px-8 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 font-semibold"
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

export default LabAssistantForm;