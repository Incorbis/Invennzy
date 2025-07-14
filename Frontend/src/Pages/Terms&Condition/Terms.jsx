import React from 'react';
import { ArrowLeft, FileText, Users, Shield, Database, Settings, AlertTriangle, Phone, Mail } from 'lucide-react';

const handleGoBack = () => {
    window.history.back();
  };

const Terms = () => {
  return (
    <div>
        <div className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-500 text-white">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex items-center justify-between py-6">
                <button className="flex items-center space-x-2 text-white/80 hover:text-white transition-colors" onClick={handleGoBack}>
                  <ArrowLeft className="w-5 h-5" />
                  <span>Back</span>
                  
                </button>
                <div className="text-center">
                  <h1 className="text-3xl font-bold">🛡️ Invennzy Terms and Condition</h1>
                  <p className="text-blue-100 mt-1">Your Legal Agreement & Usage Guidelines</p>
                </div>
                <div className="w-16"></div>
              </div>
            </div>
          </div>
     )

      {/* Main Content */}
      <div className="max-w-6xl mx-auto p-8 space-y-8">
        {/* Introduction Card */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <FileText className="text-blue-600" size={28} />
            </div>
            <h2 className="text-2xl font-semibold text-gray-800">Terms and Conditions</h2>
          </div>
          <p className="text-gray-600 mb-6 text-lg">Last updated: 14/7/2025</p>
          <p className="text-gray-700 leading-relaxed text-lg">
            📜 Welcome to Invennzy! By accessing or using our smart inventory management system for educational institutions, 
            you agree to these Terms and Conditions. Please read them carefully before using the platform.
          </p>
        </div>

        {/* Acceptance of Terms */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Shield className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">1. Acceptance of Terms</h3>
          </div>
          <p className="text-gray-700 leading-relaxed text-lg">
            By accessing or using Invennzy, you agree to these Terms and Conditions. If you do not accept any part of these terms, you must not use the platform.
          </p>
        </div>

        {/* Eligibility */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Users className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">2. Eligibility</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">Access is restricted to verified users assigned by institutions in specific roles:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Super Admin (IT Cell Head)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Admin (Head of Department)</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Lab Incharge</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Lab Assistant</span>
            </div>
          </div>
          <p className="text-red-600 mt-6 text-lg font-medium">Unauthorized access or impersonation is strictly prohibited.</p>
        </div>

        {/* User Responsibilities */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-orange-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">3. User Responsibilities</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">Each user is responsible for:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Performing their role-based duties accurately</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Notifying Admin or Super Admin of unresolved issues</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Ensuring accurate maintenance logs and reporting</span>
            </div>
          </div>
          <p className="text-red-600 mt-6 text-lg font-medium">Deliberate misuse or data manipulation may result in access revocation.</p>
        </div>

        {/* Account Security */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <Shield className="text-red-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">4. Account Security</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">Users must:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Keep their login credentials confidential</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Avoid sharing accounts or session tokens</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Immediately report suspicious login activity</span>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-lg">Invennzy is not liable for any consequences arising from compromised accounts.</p>
        </div>

        {/* Permitted Use */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Settings className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">5. Permitted Use</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">You agree to use Invennzy only for institutional purposes, such as:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Managing lab inventories</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Reporting and tracking maintenance</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Generating departmental reports</span>
            </div>
          </div>
          <p className="text-red-600 mt-6 text-lg font-medium">Any attempt to misuse, disrupt, or exploit the platform is a violation of these terms.</p>
        </div>

        {/* Data Privacy */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
              <Database className="text-green-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">6. Data Privacy</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">Institutional data is owned by the respective college or university. Invennzy will:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Not sell or misuse your data</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Maintain security and confidentiality</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-green-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Use data only for operational or analytical improvements (with consent)</span>
            </div>
          </div>
          <p className="text-blue-600 mt-6 text-lg font-medium">Refer to our Privacy Policy for full details.</p>
        </div>

        {/* Platform Updates */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
              <Settings className="text-purple-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">7. Platform Updates</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">We may:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Introduce new features or remove outdated ones</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Perform scheduled maintenance</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-purple-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Notify users of significant changes</span>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-lg">We aim to minimize downtime and disruptions.</p>
        </div>

        {/* Limitation of Liability */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-yellow-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">8. Limitation of Liability</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">Invennzy is not responsible for:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Data entered incorrectly by users</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Delays in issue resolution</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Loss of access due to institutional decisions</span>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-lg">Use the platform at your own institutional discretion.</p>
        </div>

        {/* Termination of Access */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center">
              <AlertTriangle className="text-red-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">9. Termination of Access</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">We reserve the right to:</p>
          <div className="space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Revoke access for rule violations</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Suspend accounts that compromise system integrity</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-3 h-3 bg-red-500 rounded-full"></div>
              <span className="text-gray-700 text-lg">Notify institution heads of repeated misuse</span>
            </div>
          </div>
          <p className="text-gray-600 mt-6 text-lg">All decisions will be logged and, where necessary, escalated to authorities.</p>
        </div>

        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
              <Phone className="text-blue-600" size={28} />
            </div>
            <h3 className="text-xl font-semibold text-gray-800">10. Contact</h3>
          </div>
          <p className="text-gray-700 mb-6 text-lg">For support or inquiries:</p>
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <Mail className="text-blue-600" size={24} />
              <span className="text-gray-700 text-lg">legal@invennzy.com</span>
            </div>
            <div className="flex items-center gap-4">
              <Phone className="text-blue-600" size={24} />
              <span className="text-gray-700 text-lg">+91-XXXXXXXXXX</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Terms;