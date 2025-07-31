import React, { useState } from "react";
import jsPDF from "jspdf";

const steps = [
  "Type of Problem & Date",
  "Originator Details",
  "Verification",
  "Corrective Action",
  "Closure",
];

function MaintenanceReportForm() {
  const [step, setStep] = useState(1);
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

  const handleSaveDetails = () => {
    localStorage.setItem("maintenanceForm", JSON.stringify(form));
    alert("Details saved!");
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

      {/*--- Progress Bar (NOW above and OUTSIDE card) ---*/}
      <div className="w-full max-w-2xl flex gap-2 justify-start items-center mb-6 mr-30">
        {steps.map((s, i) => (
          <div
            key={s}
            className={`flex-1 flex flex-col items-center transition-all 
                ${i + 1 === step 
                  ? "bg-blue-600 text-white font-semibold shadow-lg"
                  : "bg-gray-200 text-gray-700"} 
                rounded-md py-2 px-2 text-center 
                `}
            style={{ minWidth: "160px", maxWidth: "170px" }}
          >
            <span className="block">{i + 1}. {s}</span>
          </div>
        ))}
      </div>

      {/*--- Form Container Card ---*/}
      <div className="w-full max-w-2xl bg-white shadow-xl rounded-2xl p-8 relative">
        <form
          className="space-y-6"
          onSubmit={(e) => {
            e.preventDefault();
            if (step === steps.length) downloadPDF();
            else nextStep();
          }}
        >
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
                  <label className="block">Signature</label>
                  <input
                    name="labAssistantSignature"
                    value={form.labAssistantSignature}
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
                  <label className="block">Signature</label>
                  <input
                    name="hodSignature"
                    value={form.hodSignature}
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

          {/* ---------- Step 3 ---------- */}
          {step === 3 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-700">Step 3: Verification</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block">Complaint Received Date</label>
                  <input
                    type="date"
                    name="inChargeDate"
                    value={form.inChargeDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block">Signature</label>
                  <input
                    name="inChargeSignature"
                    value={form.inChargeSignature}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block">Name of person to whom work is allotted</label>
                <input
                  name="assignedPerson"
                  value={form.assignedPerson}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                />
              </div>
              <div className="mt-4">
                <label className="block">Verification and remarks</label>
                <textarea
                  name="verificationRemarks"
                  value={form.verificationRemarks}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>
              <div className="mt-4">
                <label className="block">Materials replaced/repaired/used</label>
                <textarea
                  name="materialsUsed"
                  value={form.materialsUsed}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
                  rows={2}
                />
              </div>
            </div>
          )}

          {/* ---------- Step 4 ---------- */}
          {step === 4 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-700">Step 4: Corrective Action</h3>
              <div className="grid sm:grid-cols-2 gap-4">
                <div>
                  <label className="block">Complaint resolved and closed inhouse?</label>
                  <select
                    name="resolvedInhouse"
                    value={form.resolvedInhouse}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                      className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                      />
                      <input
                        type="number"
                        min="0"
                        name="approxExpenditure"
                        value={form.approxExpenditure}
                        onChange={handleChange}
                        placeholder="Expected approx. expenditure"
                        className="w-full border border-gray-300 rounded px-3 py-2 mt-2"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* ---------- Step 5 ---------- */}
          {step === 5 && (
            <div>
              <h3 className="text-xl font-bold mb-4 text-blue-700">Step 5: Maintenance Report Closure</h3>
              <div>
                <label className="block">Remark on work completion (Lab/class in charge)</label>
                <textarea
                  name="completionRemarkLab"
                  value={form.completionRemarkLab}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block">Signature</label>
                  <input
                    name="labCompletionSignature"
                    value={form.labCompletionSignature}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block">Date</label>
                  <input
                    type="date"
                    name="labCompletionDate"
                    value={form.labCompletionDate}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
              </div>
              <div className="mt-4">
                <label className="block">Remark on work completion (Maintenance section)</label>
                <textarea
                  name="completionRemarkMaintenance"
                  value={form.completionRemarkMaintenance}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded px-3 py-2"
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
                    className="w-full border border-gray-300 rounded px-3 py-2"
                  />
                </div>
                <div>
                  <label className="block">Signature</label>
                  <input
                    name="maintenanceClosedSignature"
                    value={form.maintenanceClosedSignature}
                    onChange={handleChange}
                    className="w-full border border-gray-300 rounded px-3 py-2"
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
              {step === steps.length && (
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
                  type="submit"
                  className="px-8 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700 font-semibold"
                >
                  Next
                </button>
              ) : (
                <button
                  type="submit"
                  className="px-8 py-2 bg-green-600 text-white rounded shadow hover:bg-green-700 font-semibold"
                >
                  Download PDF
                </button>
              )}
            </div>
          </div>

        </form>
      </div>
    </div>
  );
}

export default MaintenanceReportForm;
