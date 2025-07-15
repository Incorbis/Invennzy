import React from "react";
import {
  ArrowLeft,
  Shield,
  Database,
  Eye,
  Lock,
  Users,
  Settings,
  AlertCircle,
  Mail,
  Phone,
  CheckCircle,
} from "lucide-react";

const handleGoBack = () => {
  window.history.back();
};

const PrivacyPolicy = () => {
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
              <h1 className="text-3xl font-bold">Invennzy Privacy Policy</h1>
              <p className="text-blue-100 mt-1">
                Your Privacy & Data Protection
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
            icon={<Shield className="w-6 h-6" />}
            title="Privacy Policy"
            className="mb-8"
          >
            <div className="text-center mb-6">
              <p className="text-gray-600">
                Last updated: {new Date().toLocaleDateString()}
              </p>
            </div>
            <p className="text-gray-600 leading-relaxed">
              At Invennzy, we are committed to protecting your privacy and
              ensuring the security of your personal information. This Privacy
              Policy explains how we collect, use, disclose, and safeguard your
              information when you use our smart inventory management system for
              educational institutions.
            </p>
          </SectionCard>

          {/* Information We Collect */}
          <SectionCard
            icon={<Database className="w-6 h-6" />}
            title="Information We Collect"
          >
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Personal Information
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Name, email address, and contact information
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Employee ID and department affiliation
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Role and access permissions within the institution
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Institution and department details
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  System Usage Data
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Login timestamps and session information
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Actions performed within the system
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Maintenance reports and issue tracking data
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Inventory management activities and asset interactions
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Technical Information
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      IP address and device information
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      Browser type and operating system
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                    <span className="text-gray-600">
                      System performance and error logs
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* How We Use Information */}
          <SectionCard
            icon={<Eye className="w-6 h-6" />}
            title="How We Use Your Information"
          >
            <div className="grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Primary Uses
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                    <span className="text-gray-600">
                      Provide and maintain inventory management services
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                    <span className="text-gray-600">
                      Authenticate users and manage role-based access
                      permissions
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                    <span className="text-gray-600">
                      Track and resolve maintenance issues and asset problems
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                    <span className="text-gray-600">
                      Generate maintenance reports and documentation
                    </span>
                  </li>
                </ul>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-800 mb-3">
                  Secondary Uses
                </h3>
                <ul className="space-y-2">
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500 mt-1" />
                    <span className="text-gray-600">
                      Generate analytics and reports for institutional planning
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500 mt-1" />
                    <span className="text-gray-600">
                      Improve system performance and user experience
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500 mt-1" />
                    <span className="text-gray-600">
                      Ensure compliance with institutional policies and
                      procedures
                    </span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <CheckCircle className="w-4 h-4 text-cyan-500 mt-1" />
                    <span className="text-gray-600">
                      Send notifications about system updates and maintenance
                    </span>
                  </li>
                </ul>
              </div>
            </div>
          </SectionCard>

          {/* Data Security */}
          <SectionCard
            icon={<Lock className="w-6 h-6" />}
            title="Data Security & Protection"
          >
            <p className="text-gray-600 mb-4">
              We implement comprehensive security measures to protect your
              information:
            </p>
            <div className="grid md:grid-cols-3 gap-4 mb-6">
              <div className="bg-red-50 rounded-lg p-4 border border-red-100">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🔐 Encryption
                </h4>
                <p className="text-sm text-gray-600">
                  All data is encrypted in transit using TLS 1.3 and at rest
                  using AES-256 encryption
                </p>
              </div>
              <div className="bg-yellow-50 rounded-lg p-4 border border-yellow-100">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🛡️ Access Control
                </h4>
                <p className="text-sm text-gray-600">
                  Role-based access control ensures users only access
                  information relevant to their responsibilities
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h4 className="font-semibold text-gray-800 mb-2">
                  📊 Monitoring
                </h4>
                <p className="text-sm text-gray-600">
                  Continuous monitoring for unauthorized access attempts and
                  security threats
                </p>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🔄 Regular Backups
                </h4>
                <p className="text-sm text-gray-600">
                  Automated daily backups with secure off-site storage
                </p>
              </div>
              <div className="bg-purple-50 rounded-lg p-4 border border-purple-100">
                <h4 className="font-semibold text-gray-800 mb-2">
                  🔍 Audit Trails
                </h4>
                <p className="text-sm text-gray-600">
                  Comprehensive logging of all system activities for security
                  auditing
                </p>
              </div>
            </div>
          </SectionCard>

          {/* Information Sharing */}
          <SectionCard
            icon={<Users className="w-6 h-6" />}
            title="Information Sharing & Disclosure"
          >
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
              <div className="flex items-start space-x-2">
                <AlertCircle className="w-5 h-5 text-yellow-600 mt-0.5" />
                <p className="text-yellow-800 font-medium">
                  We do not sell, trade, or rent your personal information to
                  third parties.
                </p>
              </div>
            </div>
            <p className="text-gray-600 mb-4">
              Information may be shared only in the following circumstances:
            </p>
            <ul className="space-y-2">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-gray-600">
                  With authorized personnel within your institution as required
                  for system functionality and role-based access
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-gray-600">
                  With IT administrators and Super Admins for system maintenance
                  and support
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-gray-600">
                  When required by law, legal process, or government regulations
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-gray-600">
                  To protect the rights, property, or safety of Invennzy, users,
                  or others
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-green-500 mt-1" />
                <span className="text-gray-600">
                  In case of business transfer, merger, or acquisition (with
                  prior notice)
                </span>
              </li>
            </ul>
          </SectionCard>

          {/* User Rights */}
          <SectionCard
            icon={<Settings className="w-6 h-6" />}
            title="Your Rights & Controls"
          >
            <p className="text-gray-600 mb-4">
              You have the following rights regarding your personal information:
            </p>
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Eye className="w-5 h-5 text-blue-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Right to Access
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request access to your personal information and data
                      processing activities
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Settings className="w-5 h-5 text-green-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Right to Correction
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request correction of inaccurate or incomplete information
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Shield className="w-5 h-5 text-purple-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Right to Deletion
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request deletion of your personal information (subject to
                      legal requirements)
                    </p>
                  </div>
                </div>
              </div>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Lock className="w-5 h-5 text-red-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Right to Portability
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request transfer of your data in a portable,
                      machine-readable format
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <AlertCircle className="w-5 h-5 text-orange-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Right to Object
                    </h4>
                    <p className="text-sm text-gray-600">
                      Object to certain types of data processing activities
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Settings className="w-5 h-5 text-indigo-500 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-800">
                      Right to Restrict
                    </h4>
                    <p className="text-sm text-gray-600">
                      Request restriction of processing under certain
                      circumstances
                    </p>
                  </div>
                </div>
              </div>
            </div>
            <div className="mt-6 bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-sm text-blue-800">
                <strong>How to Exercise Your Rights:</strong> Contact us at
                privacy@invennzy.com or through your institution's IT
                administrator. We will respond to your request within 30 days.
              </p>
            </div>
          </SectionCard>

          {/* Data Retention */}
          <SectionCard
            icon={<Database className="w-6 h-6" />}
            title="Data Retention & Storage"
          >
            <p className="text-gray-600 mb-4">
              We retain your information for as long as necessary to provide our
              services and comply with legal obligations:
            </p>
            <div className="space-y-3 mb-6">
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <span className="text-gray-600">
                  <strong>User account information:</strong> Retained while
                  account is active and for 2 years after deactivation
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <span className="text-gray-600">
                  <strong>Maintenance records:</strong> Retained for 7 years for
                  audit purposes and institutional compliance
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <span className="text-gray-600">
                  <strong>System logs:</strong> Retained for 2 years for
                  security monitoring and troubleshooting
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <span className="text-gray-600">
                  <strong>Inventory data:</strong> Retained as long as assets
                  are active in the system
                </span>
              </div>
              <div className="flex items-start space-x-3">
                <CheckCircle className="w-5 h-5 text-green-500 mt-1" />
                <span className="text-gray-600">
                  <strong>Analytics data:</strong> Aggregated and anonymized
                  data may be retained indefinitely
                </span>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <p className="text-sm text-gray-600">
                <strong>Data Location:</strong> All data is stored on secure
                servers located in India, with backup systems in compliance with
                local data protection regulations.
              </p>
            </div>
          </SectionCard>

          {/* Cookies and Tracking */}
          <SectionCard
            icon={<Eye className="w-6 h-6" />}
            title="Cookies & Tracking Technologies"
          >
            <p className="text-gray-600 mb-4">
              We use cookies and similar technologies to enhance your
              experience:
            </p>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Essential Cookies
                </h4>
                <p className="text-sm text-gray-600">
                  Required for authentication, session management, and core
                  functionality
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <h4 className="font-semibold text-gray-800 mb-2">
                  Performance Cookies
                </h4>
                <p className="text-sm text-gray-600">
                  Help us understand system usage and improve performance
                </p>
              </div>
            </div>
            <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <p className="text-sm text-yellow-800">
                <strong>Cookie Control:</strong> You can manage cookie
                preferences through your browser settings. Note that disabling
                essential cookies may affect system functionality.
              </p>
            </div>
          </SectionCard>

          {/* Changes to Policy */}
          <SectionCard
            icon={<AlertCircle className="w-6 h-6" />}
            title="Changes to This Privacy Policy"
          >
            <p className="text-gray-600 mb-4">
              We may update this Privacy Policy from time to time to reflect
              changes in our practices or legal requirements. We will notify you
              of any material changes by:
            </p>
            <ul className="space-y-2 mb-4">
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                <span className="text-gray-600">
                  Posting the updated Privacy Policy on this page with a new
                  "Last updated" date
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                <span className="text-gray-600">
                  Sending an email notification to all registered users
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                <span className="text-gray-600">
                  Displaying a prominent notice within the Invennzy application
                </span>
              </li>
              <li className="flex items-start space-x-2">
                <CheckCircle className="w-4 h-4 text-blue-500 mt-1" />
                <span className="text-gray-600">
                  Notifying institutional administrators for organization-wide
                  updates
                </span>
              </li>
            </ul>
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
              <p className="text-blue-800 text-sm">
                Your continued use of Invennzy after any changes indicates your
                acceptance of the updated Privacy Policy. If you disagree with
                the changes, please discontinue use and contact us to delete
                your account.
              </p>
            </div>
          </SectionCard>

          {/* Contact Information */}
          <SectionCard icon={<Mail className="w-6 h-6" />} title="Contact Us">
            <p className="text-gray-600 mb-4">
              If you have any questions about this Privacy Policy, our data
              practices, or wish to exercise your rights, please contact us:
            </p>
            <div className="grid md:grid-cols-2 gap-4 mb-6">
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-100">
                <div className="flex items-center space-x-3 mb-2">
                  <Mail className="w-5 h-5 text-blue-600" />
                  <h4 className="font-semibold text-gray-800">
                    Privacy Officer
                  </h4>
                </div>
                <p className="text-gray-600">privacy@invennzy.com</p>
                <p className="text-sm text-gray-500 mt-1">
                  For privacy-related inquiries and data protection matters
                </p>
              </div>
              <div className="bg-green-50 rounded-lg p-4 border border-green-100">
                <div className="flex items-center space-x-3 mb-2">
                  <Phone className="w-5 h-5 text-green-600" />
                  <h4 className="font-semibold text-gray-800">Support Team</h4>
                </div>
                <p className="text-gray-600">+91-XXXXXXXXXX</p>
                <p className="text-sm text-gray-500 mt-1">
                  Business hours: 9:00 AM - 6:00 PM IST, Monday to Friday
                </p>
              </div>
            </div>
            <div className="bg-gray-50 rounded-lg p-4">
              <h4 className="font-semibold text-gray-800 mb-2">
                Mailing Address
              </h4>
              <p className="text-gray-600 text-sm">
                Invennzy Privacy Department
                <br />
                [Your Company Address]
                <br />
                [City, State, PIN Code]
                <br />
                India
              </p>
            </div>
            <div className="mt-4 bg-yellow-50 rounded-lg p-4 border border-yellow-100">
              <p className="text-sm text-yellow-800">
                <strong>Response Time:</strong> We aim to respond to all
                privacy-related inquiries within 72 hours. For complex requests,
                we may take up to 30 days as permitted by applicable data
                protection laws.
              </p>
            </div>
          </SectionCard>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicy;
