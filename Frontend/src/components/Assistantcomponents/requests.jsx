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
  const [equipmentList, setEquipmentList] = useState([]);
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
    equipment_id: "",
    equipmentStatus: "",
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
    ...(form?.resolvedInhouse === "yes"
      ? []
      : [
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
        ]),
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

  useEffect(() => {
    const fetchEquipments = async () => {
      try {
        const staffId = localStorage.getItem("staffId");
        const res = await axios.get(`/api/labs/equipment/by-staff/${staffId}`);

        // ✅ Use flat array (items)
        if (res.data && Array.isArray(res.data.items)) {
          setEquipmentList(res.data.items);
        } else {
          setEquipmentList([]);
        }
      } catch (err) {
        console.error("Error fetching equipments:", err);
        setEquipmentList([]);
      }
    };

    fetchEquipments();
  }, []);

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
      const res = await axios.put(
        `/api/requests/assistant/${requestId}/corrective`,
        {
          materialsUsed: form.materialsUsed,
          resolvedInhouse: form.resolvedInhouse,
          resolvedRemark: form.resolvedRemark,
          consumablesNeeded: form.consumablesNeeded,
          consumableDetails: form.consumableDetails,
          externalAgencyNeeded: form.externalAgencyNeeded,
          agencyName: form.agencyName,
          approxExpenditure: form.approxExpenditure,
        }
      );

      if (res.data.skippedAdmin) {
        setCompletedSteps(6);
        setCurrentStep(6);
        showModal(
          "success",
          "Resolved In-House",
          "Issue resolved in-house. Skipped Admin Approval and moved directly to Closure."
        );
      } else {
        setCompletedSteps(4);
        setCurrentStep(5);
        showModal(
          "success",
          "Corrective Action Saved",
          "Step 4 details saved successfully. Waiting for Admin Approval."
        );
      }
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
        currentStep: 6,
        completedSteps: 6,
        message: "Closure completed successfully",
        equipmentStatus: form.equipmentStatus,
      });

      setCompletedSteps(6);
      // ✅ Re-fetch request from backend to sync updated status
      const res = await axios.get(`/api/requests/${requestId}`);
      const data = res.data;
      setForm((prev) => ({
        ...prev,
        equipmentStatus:
          Number(data.equipment_status) === 0
            ? "active"
            : Number(data.equipment_status) === 1
            ? "damaged"
            : "maintenance",
      }));
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

  const userRole = localStorage.getItem("userRole");

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
    const stepIds = steps.map((s) => s.id); // dynamic step order
    const currentIndex = stepIds.indexOf(currentStep);

    if (currentIndex < stepIds.length - 1) {
      const next = stepIds[currentIndex + 1];
      setCurrentStep(next);
      if (next > completedSteps) {
        setCompletedSteps(next);
      }
    }
  };

  const prevStep = () => {
    const stepIds = steps.map((s) => s.id);
    const currentIndex = stepIds.indexOf(currentStep);

    if (currentIndex > 0) {
      const prev = stepIds[currentIndex - 1];
      setCurrentStep(prev);
    }
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
          equipment_id: res.data.equipment_id
            ? res.data.equipment_id.toString()
            : "",
          equipmentStatus:
            Number(data.equipment_status) === 0
              ? "active"
              : Number(data.equipment_status) === 1
              ? "damaged"
              : "maintenance",
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

  const downloadPDF = async () => {
  const doc = new jsPDF();

  // Page dimensions
  const pageWidth = doc.internal.pageSize.width;
  const pageHeight = doc.internal.pageSize.height;
  const margin = 8;

  // Helper function to draw a rectangle with text
  const drawBox = (
    x,
    y,
    width,
    height,
    text,
    fontSize = 10,
    isBold = false,
    align = "left"
  ) => {
    doc.rect(x, y, width, height);
    if (text) {
      doc.setFont("helvetica", isBold ? "bold" : "normal");
      doc.setFontSize(fontSize);
      const textY = y + height / 2 + fontSize / 3;
      if (align === "center") {
        doc.text(text, x + width / 2, textY, { align: "center" });
      } else {
        doc.text(text, x + 2, textY);
      }
    }
  };

  // Header section with logos and institution info
  let currentY = 10;

  // Main header box - compact for single page
  const headerHeight = 30;
  drawBox(
    margin,
    currentY,
    pageWidth - 2 * margin,
    headerHeight,
    "",
    10,
    false
  );

  // Logo dimensions - smaller and more compact
  const logoSize = 26;
  
  // Function to convert image to base64
  const getBase64Image = (imgPath) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = 'Anonymous';
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);
        const dataURL = canvas.toDataURL('image/jpeg');
        resolve(dataURL);
      };
      img.onerror = reject;
      img.src = imgPath;
    });
  };

  // Load and add logos - positioned closer to edges
  try {
    // Left Logo - positioned at left edge with small padding
    const leftLogoData = await getBase64Image('/left_logo.jpg');
    doc.addImage(leftLogoData, 'JPEG', margin + 3, currentY + 2, logoSize, logoSize);
  } catch (error) {
    console.error('Error loading left logo:', error);
  }

  try {
    // Right Logo - positioned at right edge with small padding
    const rightLogoData = await getBase64Image('/right_logo.png');
    doc.addImage(rightLogoData, 'PNG', pageWidth - margin - logoSize - 3, currentY + 2, logoSize, logoSize);
  } catch (error) {
    console.error('Error loading right logo:', error);
  }

  doc.line(margin + logoSize + 6, currentY, margin + logoSize + 6, currentY + headerHeight);  // after left logo
  doc.line(pageWidth - margin - logoSize - 6, currentY, pageWidth - margin - logoSize - 6, currentY + headerHeight);  // before right logo

  // Center text area (between logos) - adjusted spacing
  const centerX = margin + logoSize + 6;
  const centerWidth = pageWidth - 2 * margin - 2 * logoSize - 12;
  const textStartY = currentY + 5;

  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Pimpri Chinchwad Education Trust's",
    centerX + centerWidth / 2,
    textStartY,
    { align: "center" }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(9);
  doc.text(
    "Pimpri Chinchwad College of Engineering & Research",
    centerX + centerWidth / 2,
    textStartY + 4.5,
    { align: "center" }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("Ravet, Pune", centerX + centerWidth / 2, textStartY + 9, {
    align: "center",
  });

  doc.setFont("helvetica", "normal");
  doc.setFontSize(6);
  doc.text(
    "An Autonomous Institute | NBA Accredited (4 UG Programs) | NAAC A++ Accredited | ISO 21001:2018 Certified",
    centerX + centerWidth / 2,
    textStartY + 13,
    { align: "center" }
  );

  doc.setFont("helvetica", "bold");
  doc.setFontSize(7.5);
  doc.text("IQAC PCCOER", centerX + centerWidth / 2, textStartY + 18.5, {
    align: "center",
  });

  currentY += headerHeight;

  // Second row - Academic year and IT/R/03
  const row2Height = 8;
  const yearWidth = 45;
  const termWidth = 25;
  const titleWidth = pageWidth - 2 * margin - yearWidth - termWidth - 35;

  drawBox(
    margin,
    currentY,
    yearWidth,
    row2Height,
    "A. Year: 2025-26",
    8,
    true
  );
  drawBox(
    margin + yearWidth,
    currentY,
    termWidth,
    row2Height,
    "Term: I/II",
    8,
    false
  );
  drawBox(
    margin + yearWidth + termWidth,
    currentY,
    titleWidth,
    row2Height,
    "Maintenance Report",
    9,
    true,
    "center"
  );
  drawBox(
    pageWidth - margin - 35,
    currentY,
    35,
    row2Height,
    "IT/R/03",
    8,
    true,
    "center"
  );

  currentY += row2Height;

  // Date field
  const dateHeight = 8;
  drawBox(
    pageWidth - margin - 55,
    currentY,
    55,
    dateHeight,
    `Date: ${form.date || "  /  /"}`,
    8,
    false
  );

  currentY += dateHeight;

  // Type of problem
  const typeHeight = 8;
  drawBox(
    margin,
    currentY,
    pageWidth - 2 * margin,
    typeHeight,
    `Type of problem: ${
      form.typeOfProblem || "System/Furniture/Civil/Electrical/Workshop"
    }`,
    8,
    false
  );

  currentY += typeHeight;

  // Main form section - Originator (reduced height)
  const originatorHeight = 55;
  const leftColWidth = 40;

  // Left column label
  drawBox(margin, currentY, leftColWidth, originatorHeight, "", 8, false);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    "Originator",
    margin + leftColWidth / 2,
    currentY + originatorHeight / 2,
    { align: "center" }
  );

  // Department and Location
  const rightStartX = margin + leftColWidth;
  const rightWidth = pageWidth - 2 * margin - leftColWidth;
  const deptWidth = rightWidth * 0.5;
  const locationWidth = rightWidth * 0.5;

  drawBox(rightStartX, currentY, deptWidth, 8, `Department:`, 7, false);
  doc.setFont("helvetica", "normal");
  doc.text(form.department || "", rightStartX + 28, currentY + 6);

  drawBox(
    rightStartX + deptWidth,
    currentY,
    locationWidth,
    8,
    `Location:`,
    7,
    false
  );
  doc.text(form.location || "", rightStartX + deptWidth + 22, currentY + 6);

  // Complaint details
  const complaintY = currentY + 8;
  const complaintHeight = 20;
  drawBox(rightStartX, complaintY, rightWidth, complaintHeight, "", 7, false);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text("Complaint details:", rightStartX + 2, complaintY + 4);
  doc.setFontSize(7);
  const complaintText = form.complaintDetails || "";
  doc.text(complaintText, rightStartX + 2, complaintY + 10, {
    maxWidth: rightWidth - 4,
  });

  // Recurring complaint
  const recurringY = complaintY + complaintHeight;
  const recurringHeight = 8;
  const recurringWidth = rightWidth * 0.5;

  drawBox(
    rightStartX,
    recurringY,
    recurringWidth,
    recurringHeight,
    `Recurring complaint: ${form.recurringComplaint || "Yes/No"}`,
    7,
    false
  );
  drawBox(
    rightStartX + recurringWidth,
    recurringY,
    rightWidth - recurringWidth,
    recurringHeight,
    `If Yes, how many times: ${form.recurringTimes || ""}`,
    7,
    false
  );

  // Signature boxes
  const sigY = recurringY + recurringHeight;
  const sigHeight = 19;
  const sigWidth = rightWidth / 2;

  drawBox(rightStartX, sigY, sigWidth, sigHeight, "", 7, false);
  doc.setFontSize(7);
  doc.text(
    "In charge/Lab Assistant",
    rightStartX + sigWidth / 2,
    sigY + sigHeight / 2 - 2,
    { align: "center" }
  );
  doc.text(
    "Name and Signature with Date",
    rightStartX + sigWidth / 2,
    sigY + sigHeight / 2 + 3,
    { align: "center" }
  );

  drawBox(rightStartX + sigWidth, sigY, sigWidth, sigHeight, "", 7, false);
  doc.text(
    "Head of Department",
    rightStartX + sigWidth + sigWidth / 2,
    sigY + sigHeight / 2 - 2,
    { align: "center" }
  );
  doc.text(
    "Signature with Date",
    rightStartX + sigWidth + sigWidth / 2,
    sigY + sigHeight / 2 + 3,
    { align: "center" }
  );

  currentY += originatorHeight;

  // Verification section (reduced height)
  const verificationHeight = 42;
  drawBox(margin, currentY, leftColWidth, verificationHeight, "", 8, false);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    "Verification",
    margin + leftColWidth / 2,
    currentY + verificationHeight / 2,
    { align: "center" }
  );

  // Name of person allotted
  drawBox(
    rightStartX,
    currentY,
    rightWidth,
    8,
    "Name of the person to whom work is allotted:",
    7,
    false
  );

  // Maintenance section boxes
  const maintY = currentY + 8;
  const maintHeight = verificationHeight - 8;
  const maintLeftWidth = rightWidth * 0.45;

  drawBox(rightStartX, maintY, maintLeftWidth, maintHeight, "", 7, false);
  doc.setFontSize(6.5);
  doc.text("Maintenance Section In charge", rightStartX + 2, maintY + 5);
  doc.text(
    "Complaint received Date with Signature",
    rightStartX + 2,
    maintY + 10
  );
  doc.text("Verification and remarks:", rightStartX + 2, maintY + 18);

  drawBox(
    rightStartX + maintLeftWidth,
    maintY,
    rightWidth - maintLeftWidth,
    maintHeight,
    "",
    7,
    false
  );
  doc.text(
    "Material replaced/repaired/used",
    rightStartX + maintLeftWidth + 2,
    maintY + 5
  );
  doc.text(
    "for attending complaint:",
    rightStartX + maintLeftWidth + 2,
    maintY + 10
  );

  currentY += verificationHeight;

  // Corrective Action section (reduced height)
  const correctiveHeight = 55;
  drawBox(margin, currentY, leftColWidth, correctiveHeight, "", 8, false);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    "Corrective",
    margin + leftColWidth / 2,
    currentY + correctiveHeight / 2 - 4,
    { align: "center" }
  );
  doc.text(
    "Action",
    margin + leftColWidth / 2,
    currentY + correctiveHeight / 2 + 2,
    { align: "center" }
  );

  // Three rows for corrective actions
  const actionRowHeight = correctiveHeight / 3;
  const actionLeftWidth = rightWidth * 0.5;

  // Row 1: Complaint resolved
  drawBox(
    rightStartX,
    currentY,
    actionLeftWidth,
    actionRowHeight,
    "",
    7,
    false
  );
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(
    "Complaint resolved and closed inhouse",
    rightStartX + 2,
    currentY + actionRowHeight / 2
  );

  drawBox(
    rightStartX + actionLeftWidth,
    currentY,
    rightWidth - actionLeftWidth,
    actionRowHeight,
    "",
    7,
    false
  );
  doc.text(
    "Remark:",
    rightStartX + actionLeftWidth + 2,
    currentY + actionRowHeight / 2
  );

  // Row 2: Purchase required
  const row2Y = currentY + actionRowHeight;
  drawBox(rightStartX, row2Y, actionLeftWidth, actionRowHeight, "", 7, false);
  doc.text(
    "Purchase of consumable required",
    rightStartX + 2,
    row2Y + actionRowHeight / 2 - 2
  );
  doc.text(
    "recommended",
    rightStartX + 2,
    row2Y + actionRowHeight / 2 + 3
  );

  drawBox(
    rightStartX + actionLeftWidth,
    row2Y,
    rightWidth - actionLeftWidth,
    actionRowHeight,
    "",
    7,
    false
  );
  doc.text(
    "Details (Description/Qty./cost):",
    rightStartX + actionLeftWidth + 2,
    row2Y + actionRowHeight / 2
  );

  // Row 3: External agency
  const row3Y = row2Y + actionRowHeight;
  drawBox(rightStartX, row3Y, actionLeftWidth, actionRowHeight, "", 7, false);
  doc.text(
    "Recommended Maintenance from",
    rightStartX + 2,
    row3Y + actionRowHeight / 2 - 2
  );
  doc.text(
    "external agency",
    rightStartX + 2,
    row3Y + actionRowHeight / 2 + 3
  );

  drawBox(
    rightStartX + actionLeftWidth,
    row3Y,
    rightWidth - actionLeftWidth,
    actionRowHeight,
    "",
    7,
    false
  );
  doc.text("Agency Name:", rightStartX + actionLeftWidth + 2, row3Y + 7);
  doc.text(
    "Expected Approx. Expenditure:",
    rightStartX + actionLeftWidth + 2,
    row3Y + 13
  );

  currentY += correctiveHeight;

  // Maintenance Report closure section
  const closureHeight = 45;
  drawBox(margin, currentY, leftColWidth, closureHeight, "", 9, false);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(8);
  doc.text(
    "Maintenance",
    margin + leftColWidth / 2,
    currentY + closureHeight / 2 - 7,
    { align: "center" }
  );
  doc.text(
    "Report",
    margin + leftColWidth / 2,
    currentY + closureHeight / 2,
    { align: "center" }
  );
  doc.text(
    "closure",
    margin + leftColWidth / 2,
    currentY + closureHeight / 2 + 7,
    { align: "center" }
  );

  const closureRowHeight = closureHeight / 2;

  // Row 1: Lab assistant remark
  drawBox(rightStartX, currentY, rightWidth, closureRowHeight, "", 8, false);
  doc.setFont("helvetica", "normal");
  doc.setFontSize(8);
  doc.text(
    "Remark on work completion by person In charge of lab/class:",
    rightStartX + 2,
    currentY + 8
  );
  doc.text(
    "In charge/Lab Assistant",
    rightStartX + rightWidth - 55,
    currentY + 14
  );
  doc.text(
    "Name and Signature with Date",
    rightStartX + rightWidth - 55,
    currentY + 19
  );

  // Row 2: Maintenance section remark
  const closure2Y = currentY + closureRowHeight;
  drawBox(rightStartX, closure2Y, rightWidth, closureRowHeight, "", 8, false);
  doc.text(
    "Remark on work completion by maintenance section In charge:",
    rightStartX + 2,
    closure2Y + 8
  );
  doc.text(
    "Maintenance Section Incharge",
    rightStartX + rightWidth - 60,
    closure2Y + 14
  );
  doc.text(
    "Complaint closed Date with Signature",
    rightStartX + rightWidth - 60,
    closure2Y + 19
  );

  currentY += closureHeight;

  // Footer - ensure it's visible
  currentY += 8;
  doc.setFont("helvetica", "normal");
  doc.setFontSize(7);
  doc.text(`Rev.: 00    Date: 03.07.2023`, margin, currentY);

  doc.save("maintenance_report_form.pdf");
};

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-4 px-2 sm:py-8 sm:px-4">
      <Modal
        isOpen={modal.isOpen}
        onClose={closeModal}
        type={modal.type}
        title={modal.title}
        message={modal.message}
      />
      <div className="max-w-4xl mx-auto w-full">
        <ProgressBar
          steps={steps}
          currentStep={currentStep}
          completedSteps={completedSteps}
        />
        <div className="bg-white rounded-xl sm:rounded-2xl shadow-lg p-4 sm:p-8 border border-gray-100">
          {loading ? (
            <div className="animate-pulse text-gray-500 text-center py-6 sm:py-8">
              Loading request...
            </div>
          ) : (
            <>
              {/* Step 1: Problem Details */}
              {currentStep === 1 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <FileText className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                      Problem Details
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      Please provide the basic information about the maintenance
                      issue
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
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
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
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
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
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
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                    <div className="sm:col-span-2 mt-4 sm:mt-6">
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
                        Equipment
                      </label>
                      <input
                        type="text"
                        value={
                          equipmentList.find(
                            (eq) => eq.equipment_id == form.equipment_id
                          )
                            ? `${
                                equipmentList.find(
                                  (eq) => eq.equipment_id == form.equipment_id
                                ).equipment_name
                              } (${
                                equipmentList.find(
                                  (eq) => eq.equipment_id == form.equipment_id
                                ).equipment_type
                              }) - ${
                                equipmentList.find(
                                  (eq) => eq.equipment_id == form.equipment_id
                                ).equipment_code
                              }`
                            : "Not Assigned"
                        }
                        disabled
                        className="block border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-2 w-full bg-gray-100 text-gray-600 text-sm sm:text-base"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 2: Request Details */}
              {currentStep === 2 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <User className="w-5 h-5 sm:w-7 sm:h-7 text-blue-600" />
                      Request Details
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      Complete the request information and submit for processing
                    </p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
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
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
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
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
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
                      className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                        lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                      }`}
                      rows={3}
                    />
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                    <div>
                      <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
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
                        className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                          lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                        }`}
                      >
                        <option value="no">No</option>
                        <option value="yes">Yes</option>
                      </select>
                    </div>
                    {form.recurringComplaint === "yes" && (
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1 sm:mb-2">
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
                          className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                    )}
                  </div>
                  <div className="bg-gray-50 rounded-lg sm:rounded-xl p-4 sm:p-6 mt-4 sm:mt-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
                      Approval Information
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                          className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-white ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                          className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-white ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                          className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-white ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-gray-700 mb-1">
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
                          className={`w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base bg-white ${
                            lockInitial ? "bg-gray-50 cursor-not-allowed" : ""
                          }`}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Verification Stage */}
              {currentStep === 3 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <Clock className="w-5 h-5 sm:w-7 sm:h-7 text-orange-500" />
                      Verification Stage
                    </h2>
                    {!isAssistant && (
                      <p className="text-gray-500 mt-1 sm:mt-2 text-sm sm:text-base">
                        Your request is being reviewed by the maintenance team
                      </p>
                    )}
                  </div>
                  {isAssistant && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Assigned Person
                        </label>
                        <input
                          name="assignedPerson"
                          value={form.assignedPerson}
                          onChange={handleChange}
                          placeholder="Enter assigned person"
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          In-Charge Date
                        </label>
                        <input
                          type="date"
                          name="inChargeDate"
                          value={form.inChargeDate}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
                        />
                      </div>
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Verification Remarks
                        </label>
                        <textarea
                          name="verificationRemarks"
                          value={form.verificationRemarks}
                          onChange={handleChange}
                          rows={2}
                          placeholder="Enter remarks..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 4: Corrective Action */}
              {currentStep === 4 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <Settings className="w-5 h-5 sm:w-7 sm:h-7 text-blue-500" />
                      Corrective Action
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      Maintenance work is in progress. Fill in the details
                      below.
                    </p>
                  </div>
                  <div className="bg-blue-50 border border-blue-200 rounded-lg sm:rounded-xl p-4 sm:p-6 mb-4 sm:mb-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <Settings className="w-4 h-4 sm:w-6 sm:h-6 text-blue-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-blue-800">
                        Work in Progress
                      </h3>
                    </div>
                    <p className="text-blue-700 text-sm sm:text-base">
                      The maintenance team is actively working on resolving the
                      issue. Fill in the details below.
                    </p>
                  </div>
                  {isAssistant && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                      <div className="sm:col-span-2">
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Materials Used <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="materialsUsed"
                          value={form.materialsUsed || ""}
                          onChange={handleChange}
                          placeholder="List materials used..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Resolved In-house?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="resolvedInhouse"
                          value={form.resolvedInhouse || "yes"}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        >
                          <option value="yes">Yes</option>
                          <option value="no">No</option>
                        </select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Resolution Remark{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          name="resolvedRemark"
                          value={form.resolvedRemark || ""}
                          onChange={handleChange}
                          placeholder="Enter resolution remark..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Consumables Needed?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="consumablesNeeded"
                          value={form.consumablesNeeded || "no"}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      {form.consumablesNeeded === "yes" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Consumable Details{" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="consumableDetails"
                            value={form.consumableDetails || ""}
                            onChange={handleChange}
                            placeholder="Enter consumable details..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          External Agency Needed?{" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <select
                          name="externalAgencyNeeded"
                          value={form.externalAgencyNeeded || "no"}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        >
                          <option value="no">No</option>
                          <option value="yes">Yes</option>
                        </select>
                      </div>
                      {form.externalAgencyNeeded === "yes" && (
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Agency Name <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="agencyName"
                            value={form.agencyName || ""}
                            onChange={handleChange}
                            placeholder="Enter agency name..."
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                          />
                        </div>
                      )}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Approx. Expenditure
                        </label>
                        <input
                          name="approxExpenditure"
                          value={form.approxExpenditure || ""}
                          onChange={handleChange}
                          placeholder="Enter approximate expenditure..."
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Step 5: Admin Approval */}

              {currentStep === 5 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <AlertCircle className="w-5 h-5 sm:w-7 sm:h-7 text-purple-500" />
                      Admin Approval
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      {form?.adminApprovalStatus === "approved"
                        ? "This request has been approved by Admin."
                        : form?.adminApprovalStatus === "rejected"
                        ? "This request was rejected by Admin."
                        : "This request is pending admin approval."}
                    </p>
                  </div>
                </div>
              )}

              {/* Step 6: Closure */}
              {currentStep === 6 && (
                <div className="space-y-4 sm:space-y-6">
                  <div className="border-b border-gray-200 pb-3 sm:pb-4">
                    <h2 className="text-xl sm:text-2xl font-bold text-gray-900 flex items-center gap-2 sm:gap-3">
                      <CheckSquare className="w-5 h-5 sm:w-7 sm:h-7 text-green-500" />
                      Closure
                    </h2>
                    <p className="text-gray-600 mt-1 sm:mt-2 text-sm sm:text-base">
                      Final completion and sign-off
                    </p>
                  </div>
                  <div className="bg-green-50 border border-green-200 rounded-lg sm:rounded-xl p-4 sm:p-6">
                    <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                      <CheckSquare className="w-4 h-4 sm:w-6 sm:h-6 text-green-600" />
                      <h3 className="text-base sm:text-lg font-semibold text-green-800">
                        Finalize Request
                      </h3>
                    </div>
                    {currentStep === 6 && form.resolvedInhouse === "yes" && (
                      <div className="p-3 mb-4 rounded-lg bg-green-50 border border-green-200 text-green-700 text-sm">
                        This issue was resolved in-house, so{" "}
                        <strong>Admin Approval was not required</strong>.
                      </div>
                    )}
                    <p className="text-green-700 text-sm sm:text-base">
                      Complete the final details for this maintenance request.
                    </p>
                  </div>
                  <div className="mt-3 sm:mt-4 bg-gray-50 border border-gray-200 rounded-lg sm:rounded-xl p-3 sm:p-4">
                    <h3 className="text-sm font-semibold text-gray-800 mb-2 sm:mb-3">
                      Equipment Status
                    </h3>
                    <p className="inline-block bg-yellow-100 text-yellow-800 text-xs font-semibold px-2 py-1 sm:px-3 sm:py-1 rounded-full mb-2 sm:mb-3">
                      Current Status:{" "}
                      {form.equipmentStatus === "active"
                        ? "Active"
                        : form.equipmentStatus === "damaged"
                        ? "Damaged"
                        : "In Maintenance"}
                    </p>
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-6">
                      <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="equipmentStatus"
                          value="active"
                          checked={form.equipmentStatus === "active"}
                          onChange={handleChange}
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-green-600 border-gray-300 focus:ring-green-500"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Active
                        </span>
                      </label>
                      <label className="flex items-center gap-1.5 sm:gap-2 cursor-pointer">
                        <input
                          type="radio"
                          name="equipmentStatus"
                          value="damaged"
                          checked={form.equipmentStatus === "damaged"}
                          onChange={handleChange}
                          className="h-3.5 w-3.5 sm:h-4 sm:w-4 text-red-600 border-gray-300 focus:ring-red-500"
                        />
                        <span className="text-xs sm:text-sm font-medium text-gray-700">
                          Damaged
                        </span>
                      </label>
                    </div>
                  </div>
                  {isAssistant && (
                    <div className="space-y-3 sm:space-y-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Completion Remarks (Lab){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="completionRemarkLab"
                          value={form.completionRemarkLab || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                          rows={2}
                        />
                      </div>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Completed By (Lab){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            name="labCompletionName"
                            value={form.labCompletionName || ""}
                            onChange={handleChange}
                            placeholder="Enter name"
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                          />
                        </div>
                        <div>
                          <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                            Completion Date (Lab){" "}
                            <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="labCompletionDate"
                            value={form.labCompletionDate || ""}
                            onChange={handleChange}
                            className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                          />
                        </div>
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Completion Remarks (Maintenance){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <textarea
                          name="completionRemarkMaintenance"
                          value={form.completionRemarkMaintenance || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                          rows={2}
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1 sm:mb-2">
                          Closed Date (Maintenance){" "}
                          <span className="text-red-500">*</span>
                        </label>
                        <input
                          type="date"
                          name="maintenanceClosedDate"
                          value={form.maintenanceClosedDate || ""}
                          onChange={handleChange}
                          className="w-full border border-gray-300 rounded-lg px-3 py-2 sm:px-4 sm:py-3 focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all text-sm sm:text-base"
                        />
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* Navigation Buttons */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-3 mt-6 sm:mt-8 pt-4 sm:pt-6 border-t border-gray-200">
                <button
                  type="button"
                  className={`w-full sm:w-auto px-4 sm:px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-all font-medium text-sm sm:text-base ${
                    currentStep === 1 ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                  onClick={prevStep}
                  disabled={currentStep === 1}
                >
                  ← Previous
                </button>
                <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full sm:w-auto">
                  {currentStep === 2 && !isViewMode && !isAssistant && (
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-red-600 text-white rounded-lg shadow hover:bg-red-700 transition-all font-medium text-sm sm:text-base"
                      onClick={handleSubmitRequest}
                    >
                      🚀 Submit Request
                    </button>
                  )}
                  {currentStep < 6 && isAssistant && (
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-blue-600 text-white rounded-lg shadow hover:bg-blue-700 transition-all font-medium text-sm sm:text-base"
                      onClick={nextStep}
                    >
                      Next →
                    </button>
                  )}
                  {currentStep === 3 && isAssistant && (
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm sm:text-base"
                      onClick={handleStep3Submit}
                    >
                      ✅ Verify & Save
                    </button>
                  )}
                  {currentStep === 4 && isAssistant && (
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm sm:text-base"
                      onClick={handleStep4Submit}
                    >
                      💾 Save Corrective Action
                    </button>
                  )}
                  {currentStep === 6 && isAssistant && (
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-all font-medium text-sm sm:text-base"
                      onClick={handleStep5Submit}
                    >
                      🔒 Save Closure
                    </button>
                  )}
                  {completedSteps >= 2 && (
                    <button
                      type="button"
                      className="w-full sm:w-auto px-4 sm:px-6 py-2 bg-green-600 text-white rounded-lg shadow hover:bg-green-700 transition-all font-medium text-sm sm:text-base"
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
