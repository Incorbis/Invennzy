import React from 'react';
import { BarChart3, Shield, Zap, Users, Bell, Database, Smartphone, Settings } from 'lucide-react';

const Features = () => {
  const features = [
    {
      icon: BarChart3,
      title: "Real-time Analytics",
      description: "Track inventory levels, usage patterns, and generate detailed reports instantly.",
      color: "from-blue-500 to-teal-500"
    },
    {
      icon: Shield,
      title: "Secure Access Control",
      description: "Role-based permissions ensure only authorized personnel can access specific inventory.",
      color: "from-purple-500 to-pink-500"
    },
    {
      icon: Zap,
      title: "Automated Alerts",
      description: "Get notified when inventory levels are low or when maintenance is due.",
      color: "from-orange-500 to-red-500"
    },
    {
      icon: Users,
      title: "Multi-user Collaboration",
      description: "Seamless collaboration between admins, lab incharges, and assistants.",
      color: "from-green-500 to-blue-500"
    },
    {
      icon: Bell,
      title: "Issue Tracking",
      description: "Report and track issues with inventory items through our integrated system.",
      color: "from-yellow-500 to-orange-500"
    },
    {
      icon: Database,
      title: "Cloud Storage",
      description: "Secure cloud-based storage ensures your data is always accessible and backed up.",
      color: "from-indigo-500 to-purple-500"
    },
    {
      icon: Smartphone,
      title: "Mobile Friendly",
      description: "Access your inventory management system from any device, anywhere.",
      color: "from-pink-500 to-red-500"
    },
    {
      icon: Settings,
      title: "Customizable",
      description: "Adapt the system to your specific department needs with flexible configurations.",
      color: "from-teal-500 to-green-500"
    }
  ];

  return (
    <div id="services" className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">Powerful Features</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Discover how Invennzy transforms inventory management with cutting-edge features designed for modern educational institutions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group relative bg-white rounded-xl p-6 shadow-lg hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-2 border border-gray-100"
              style={{ animationDelay: `${index * 100}ms` }}
            >
              <div className={`w-12 h-12 rounded-lg bg-gradient-to-r ${feature.color} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                <feature.icon className="w-6 h-6 text-white" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
              <p className="text-gray-600 leading-relaxed">{feature.description}</p>
              
              {/* Animated background effect */}
              <div className={`absolute inset-0 bg-gradient-to-r ${feature.color} opacity-0 group-hover:opacity-5 rounded-xl transition-opacity duration-300`}></div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-gradient-to-r from-blue-900 to-teal-700 rounded-2xl p-8 md:p-12 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">Ready to Transform Your Inventory Management?</h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Join hundreds of educational institutions already using Invennzy to streamline their operations.
          </p>
          <button className="bg-white text-blue-900 px-8 py-4 rounded-lg font-semibold hover:bg-blue-50 transition-colors duration-300 transform hover:scale-105 shadow-lg">
            Start Your Free Trial
          </button>
        </div>
      </div>
    </div>
  );
};

export default Features;