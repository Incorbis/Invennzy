import React from "react";
import {
  ArrowLeft,
  FileText,
  Users,
  Database,
  Settings,
  Eye,
  Zap,
  BarChart3,
  CheckCircle,
  Mail,
  Phone,
  Shield,
  Lock,
  AlertCircle,
  Smartphone,
  QrCode,
  Brain,
  MessageCircle,
} from "lucide-react";

const handleGoBack = () => {
  window.history.back();
};

const DocsPage = () => {
  const SectionCard = ({ icon, title, children, className = "" }) => (
    <div className={`bg-white rounded-xl shadow-lg p-8 ${className}`}>
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
          {icon}
        </div>
        <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      </div>
      {children}
    </div>
  );

  const RoleCard = ({ title, role, scope, responsibilities, color, emoji }) => (
    <div
      className="bg-white rounded-lg border-l-4 p-6 shadow-md"
      style={{ borderLeftColor: color }}
    >
      <div className="flex items-center space-x-2 mb-3">
        <span className="text-2xl">{emoji}</span>
        <h3 className="text-xl font-bold text-gray-800">{title}</h3>
      </div>
      <p className="text-sm text-gray-600 mb-2">
        <strong>Role:</strong> {role}
      </p>
      <p className="text-sm text-gray-600 mb-4">
        <strong>Access Scope:</strong> {scope}
      </p>
      <div>
        <p className="font-semibold text-gray-700 mb-2">Responsibilities:</p>
        <ul className="space-y-1">
          {responsibilities.map((resp, index) => (
            <li
              key={index}
              className="flex items-start space-x-2 text-sm text-gray-600"
            >
              <CheckCircle className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
              <span>{resp}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );

  const FeatureCard = ({ icon, title, description }) => (
    <div className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-6 border border-blue-100">
      <div className="flex items-center space-x-3 mb-3">
        <div className="p-2 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg text-white">
          {icon}
        </div>
        <h3 className="font-semibold text-gray-800">{title}</h3>
      </div>
      <p className="text-gray-600 text-sm">{description}</p>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between py-6">
            <button
              className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors invisible lg:visible"
              onClick={handleGoBack}
            >
              <ArrowLeft className="w-5 h-5" />
              <span>Back</span>
            </button>
            <div className="text-center">
              <h1 className="text-3xl font-bold">Invennzy Documentation</h1>
              <p className="text-blue-100 mt-1">
                Smart Inventory Management for Institutional Departments
              </p>
            </div>
            <div className="w-16"></div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Introduction */}
          <SectionCard
            icon={<Eye className="w-6 h-6" />}
            title="Introduction"
          >
            <p className="text-gray-600 leading-relaxed mb-4">
              Invennzy is a centralized and intelligent inventory management
              system purpose-built for educational institutions. It focuses on
              simplifying and streamlining the management of departmental assets
              — from individual lab equipment to infrastructure maintenance
              workflows.
            </p>
            <p className="text-gray-600 leading-relaxed">
              This platform ensures that institutions can track, maintain, and
              resolve issues related to lab resources with high efficiency and
              transparency, enabling better accountability at all levels of the
              institution.
            </p>
          </SectionCard>

          {/* Objective */}
          <SectionCard icon={<Zap className="w-6 h-6" />} title="Objective">
            <p className="text-gray-600 mb-4">
              The objective of Invennzy is to:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Digitize and automate departmental inventory tracking
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Establish clear responsibilities and workflows for asset
                    issue resolution
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Provide role-based access for enhanced security and
                    operational efficiency
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Generate data-driven maintenance insights to optimize
                    institutional operations
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Scope */}
          <SectionCard
            icon={<Database className="w-6 h-6" />}
            title="Scope of the System"
          >
            <p className="text-gray-600 leading-relaxed mb-4">
              Invennzy is designed to manage inventories at the departmental
              level in colleges or universities. For example, in a Computer
              Science department, the platform manages:
            </p>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Multiple Computer Laboratories
                </h4>
                <p className="text-sm text-gray-600">
                  Comprehensive lab management and tracking
                </p>
              </div>
              <div className="bg-cyan-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Inventory Items
                </h4>
                <p className="text-sm text-gray-600">
                  Computers, monitors, fans, projectors, chairs, and electronic
                  equipment
                </p>
              </div>
              <div className="bg-indigo-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Issue Management
                </h4>
                <p className="text-sm text-gray-600">
                  Reports and resolutions of technical faults and infrastructure
                  issues
                </p>
              </div>
            </div>
            <div className="mt-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Communication Channels
              </h4>
              <p className="text-sm text-gray-600">
                Between roles involved in lab maintenance for seamless
                coordination
              </p>
            </div>
          </SectionCard>

          {/* User Roles */}
          <SectionCard
            icon={<Users className="w-6 h-6" />}
            title="User Roles & Responsibilities"
          >
            <p className="text-gray-600 mb-6">
              Invennzy incorporates a hierarchical role-based access system to
              define accountability and streamline the reporting and resolution
              processes.
            </p>
            <div className="grid gap-6">
              <RoleCard
                title="Super Admin"
                role="IT Cell Head"
                scope="Institution-wide (All Departments)"
                emoji="🛡"
                responsibilities={[
                  "View and manage inventory data across all departments",
                  "Oversee submitted maintenance reports",
                  "Coordinate with external technicians or experts for complex repairs",
                  "Grant or revoke Admin access to department heads",
                  "Maintain global system integrity and ensure compliance with maintenance protocols",
                ]}
                color="#ef4444"
              />
              <RoleCard
                title="Admin"
                role="Head of Department (HOD)"
                scope="Department-specific (All Labs within the department)"
                emoji="🧑‍💼"
                responsibilities={[
                  "Manage department-specific inventory and assets",
                  "Review maintenance requests escalated by Lab Incharges",
                  "Validate and approve unresolved issues",
                  "Liaise with Super Admin for high-level interventions",
                  "Allocate or reassign Lab Incharges and Lab Assistants",
                ]}
                color="#f59e0b"
              />
              <RoleCard
                title="Lab Assistant"
                role="Department Technician or Support Staff"
                scope="Assigned labs only"
                emoji="🔧"
                responsibilities={[
                  "Inspect and attempt repair of reported issues",
                  "Mark issues as resolved when fixed",
                  "Report unresolved or hardware-level faults to the respective Lab Incharge",
                  "Maintain a log of repair activities per lab",
                ]}
                color="#10b981"
              />
              <RoleCard
                title="Lab Incharge"
                role="Faculty-in-charge for specific laboratories"
                scope="Assigned labs only"
                emoji="🧑‍🏫"
                responsibilities={[
                  "Conduct routine inspections and track lab assets",
                  "Report minor issues directly to the Lab Assistant",
                  "If unresolved, generate and submit a formal maintenance report",
                  "Ensure proper documentation of the issue, including actions taken and pending steps",
                  "Coordinate with Admin and Super Admin to ensure timely resolution",
                ]}
                color="#3b82f6"
              />
            </div>
          </SectionCard>

          {/* Workflow */}
          <SectionCard
            icon={<Settings className="w-6 h-6" />}
            title="Workflow: Issue Reporting to Resolution"
          >
            <p className="text-gray-600 mb-6">
              The following flow outlines the issue lifecycle within the
              Invennzy system:
            </p>
            <div className="space-y-4">
              {[
                {
                  step: 1,
                  title: "Issue Detection",
                  desc: "Lab Incharge identifies or is informed about a malfunctioning item",
                },
                {
                  step: 2,
                  title: "Initial Action",
                  desc: "Lab Assistant attempts to repair the issue",
                },
                {
                  step: 3,
                  title: "Escalation",
                  desc: "If unresolved, the Lab Incharge generates a Maintenance Report",
                },
                {
                  step: 4,
                  title: "Review",
                  desc: "Admin and Super Admin review the report",
                },
                {
                  step: 5,
                  title: "Expert Assignment",
                  desc: "Super Admin contacts or assigns an external technician if necessary",
                },
                {
                  step: 6,
                  title: "Resolution",
                  desc: "Issue is resolved and marked as closed in the system",
                },
                {
                  step: 7,
                  title: "Report Log",
                  desc: "Resolution data is saved for audit and future reference",
                },
              ].map((item, index) => (
                <div key={index} className="flex items-start space-x-4">
                  <div className="flex-shrink-0 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-white font-bold text-sm">
                    {item.step}
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      {item.title}
                    </h4>
                    <p className="text-gray-600 text-sm">{item.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </SectionCard>

          {/* Maintenance Report */}
          <SectionCard
            icon={<FileText className="w-6 h-6" />}
            title="Maintenance Report Details"
          >
            <p className="text-gray-600 mb-4">
              Each maintenance report includes the following:
            </p>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse">
                <thead>
                  <tr className="bg-gradient-to-r from-blue-50 to-cyan-50">
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                      Field
                    </th>
                    <th className="border border-gray-200 px-4 py-3 text-left font-semibold text-gray-800">
                      Description
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {[
                    ["Report ID", "Auto-generated unique identifier"],
                    ["Lab", "Lab name/number"],
                    ["Equipment Details", "Item name, asset ID, type"],
                    ["Problem Description", "Brief summary of the issue"],
                    [
                      "Repair Attempts",
                      "Summary of actions taken by Lab Assistant",
                    ],
                    [
                      "Recommendation",
                      "Suggested solution or expert intervention needed",
                    ],
                    ["Status", "Open / In Progress / Resolved"],
                    ["Generated By", "Lab Incharge name and ID"],
                    [
                      "Approval Signatures",
                      "Admin and Super Admin review timestamps",
                    ],
                  ].map(([field, desc], index) => (
                    <tr
                      key={index}
                      className={index % 2 === 0 ? "bg-gray-50" : "bg-white"}
                    >
                      <td className="border border-gray-200 px-4 py-3 font-medium text-gray-800">
                        {field}
                      </td>
                      <td className="border border-gray-200 px-4 py-3 text-gray-600">
                        {desc}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </SectionCard>

          {/* Key Features */}
          <SectionCard
            icon={<Zap className="w-6 h-6" />}
            title="Key Features"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                icon={<Lock className="w-5 h-5" />}
                title="Role-Based Access Control (RBAC)"
                description="Ensures appropriate permissions per role for enhanced security"
              />
              <FeatureCard
                icon={<BarChart3 className="w-5 h-5" />}
                title="Dynamic Inventory Dashboard"
                description="Real-time view of all items and their statuses"
              />
              <FeatureCard
                icon={<FileText className="w-5 h-5" />}
                title="Maintenance Logbook"
                description="Detailed history of issues and resolutions"
              />
              <FeatureCard
                icon={<AlertCircle className="w-5 h-5" />}
                title="Escalation Mechanism"
                description="Structured reporting hierarchy to ensure accountability"
              />
              <FeatureCard
                icon={<Mail className="w-5 h-5" />}
                title="Automated Notifications"
                description="Alerts for unresolved issues or status changes"
              />
              <FeatureCard
                icon={<FileText className="w-5 h-5" />}
                title="Report Generation"
                description="Periodic analytics and downloadable reports for audit and planning"
              />
            </div>
          </SectionCard>

          {/* Benefits */}
          <SectionCard
            icon={<CheckCircle className="w-6 h-6" />}
            title="Benefits"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Reduced downtime of lab equipment through faster issue
                    resolution
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Enhanced departmental accountability through structured
                    workflows
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Improved collaboration between faculty, IT staff, and
                    administrative teams
                  </span>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Paperless, trackable, and secure maintenance record-keeping
                  </span>
                </div>
                <div className="flex items-start space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                  <span className="text-gray-600">
                    Scalable for integration with QR/barcode asset tracking in
                    future upgrades
                  </span>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Future Enhancements */}
          <SectionCard
            icon={<Brain className="w-6 h-6" />}
            title="Future Enhancements"
          >
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              <FeatureCard
                icon={<QrCode className="w-5 h-5" />}
                title="Barcode/QR Integration"
                description="Integration of barcode/QR-based inventory tagging"
              />
              <FeatureCard
                icon={<Brain className="w-5 h-5" />}
                title="Predictive Analytics"
                description="Predictive analytics to preempt maintenance needs"
              />
              <FeatureCard
                icon={<MessageCircle className="w-5 h-5" />}
                title="Real-time Chat System"
                description="Real-time chat system between roles for faster resolution"
              />
              <FeatureCard
                icon={<Smartphone className="w-5 h-5" />}
                title="Mobile Application"
                description="Mobile application for on-the-go access and updates"
              />
              <FeatureCard
                icon={<Brain className="w-5 h-5" />}
                title="AI-based Detection"
                description="AI-based anomaly detection for asset health prediction"
              />
            </div>
          </SectionCard>

          {/* Technology Stack */}
          <SectionCard
            icon={<Settings className="w-6 h-6" />}
            title="Technology Stack"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Current Stack
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    <span className="text-gray-600">
                      <strong>Frontend:</strong> HTML, CSS, JavaScript
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-600">
                      <strong>Backend:</strong> Node.js with Express.js
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                    <span className="text-gray-600">
                      <strong>Database:</strong> MongoDB
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                    <span className="text-gray-600">
                      <strong>Authentication:</strong> Role-based session
                      handling
                    </span>
                  </div>
                </div>
              </div>
              <div>
                <h4 className="font-semibold text-gray-800 mb-3">
                  Planned Upgrades
                </h4>
                <div className="space-y-2">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-cyan-500 rounded-full"></div>
                    <span className="text-gray-600">
                      <strong>Frontend:</strong> React-based upgrade
                    </span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                    <span className="text-gray-600">
                      <strong>Auth:</strong> OAuth / Google Login
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </SectionCard>

          {/* Contact */}
          <SectionCard
            icon={<Mail className="w-6 h-6" />}
            title="Contact & Support"
          >
            <p className="text-gray-600 mb-4">
              For technical issues, support, or suggestions, please contact:
            </p>
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex items-center space-x-3 bg-blue-50 rounded-lg p-4">
                <Mail className="w-5 h-5 text-blue-600" />
                <span className="text-gray-700">📧 support@invennzy.com</span>
              </div>
              <div className="flex items-center space-x-3 bg-green-50 rounded-lg p-4">
                <Phone className="w-5 h-5 text-green-600" />
                <span className="text-gray-700">📞 +91-XXXXXXXXXX</span>
              </div>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default DocsPage;
