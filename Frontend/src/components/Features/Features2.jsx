import { useRef } from "react";
import React from "react";

const FeaturesMiddleSectionInventory = () => {
  const containerRef = useRef(null);

  const features = [
    {
      title: "Smart Inventory Management in Real Time",
      description:
        "Monitor devices like PCs, keyboards, and fans with instant updates. Invennzy gives you real-time visibility into stock levels and conditions, empowering precise, timely decisions across all labs.",
      icon: "📦",
      badge: "Core",
      color: "from-blue-600 to-cyan-500",
    },
    {
      title: "Issue Reporting & Resolution Workflow",
      description:
        "Simplify issue handling with a clear 3-step flow: Incharges report problems, Lab Assistants verify or fix them, and Admins resolve escalations—ensuring no issue is missed or delayed.",
      icon: "🛠️",
      badge: "Workflow",
      color: "from-indigo-600 to-purple-500",
    },
    {
      title: "Lab-Wise Asset Tracking",
      description:
        "Manage assets lab-wise for better control. View real-time status, stock, and pending issues per lab—enhancing organization, clarity, and accountability across departments.",
      icon: "🏷️",
      badge: "Lab",
      color: "from-teal-600 to-green-500",
    },
    {
      title: "Automated Low Stock Alerts",
      description:
        "Instant alerts when items like mice, cables, or keyboards run low—helping Lab Assistants or Incharges restock quickly and avoid downtime.",
      icon: "🔔",
      badge: "Smart",
      color: "from-orange-600 to-red-500",
    },
    {
      title: "Role-Based Dashboards",
      description:
        "Dedicated dashboards for Incharges, Lab Assistants, and Admins—each with tools tailored for their role, like reporting, approvals, and tracking.",
      icon: "👤",
      badge: "Access",
      color: "from-violet-600 to-pink-500",
    },
    {
      title: "Detailed Reports & Maintenance Logs",
      description:
        "Get clear insights into usage patterns and repairs. Make smarter purchase and maintenance decisions with real-time data.",
      icon: "📄",
      badge: "Insight",
      color: "from-emerald-600 to-blue-500",
    },
  ];

  const FeatureCard = ({ feature }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg relative group bg-white/80 backdrop-blur-sm border border-gray-200/50 h-full transform transition-all duration-500 hover:scale-105 hover:shadow-2xl hover:-translate-y-3">
      {/* Animated background glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-teal-50/50 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      {/* Floating particles effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-2 h-2 bg-blue-300/30 rounded-full animate-pulse opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <div className="absolute top-3/4 right-1/4 w-1 h-1 bg-teal-300/40 rounded-full animate-ping opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute bottom-1/3 left-1/3 w-1.5 h-1.5 bg-cyan-300/35 rounded-full animate-bounce opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      </div>

      <div className="p-4 sm:p-6 bg-gradient-to-br from-gray-50/90 to-white/90 backdrop-blur-sm rounded-2xl relative z-10 h-full flex flex-col group-hover:from-white/95 group-hover:to-gray-50/95 transition-all duration-500">
        <div className={`absolute top-2 right-2 px-3 py-1 text-xs font-semibold rounded-full border transition-all duration-300 group-hover:scale-110 bg-gradient-to-r ${feature.color} text-white shadow-lg`}>
          {feature.badge}
        </div>
        
        <div className="text-3xl sm:text-4xl mb-3 transform transition-all duration-500 group-hover:scale-125 group-hover:rotate-12 filter drop-shadow-lg">
          {feature.icon}
        </div>
        
        <h3 className="text-gray-800 text-lg sm:text-xl font-bold mb-2 group-hover:bg-gradient-to-r group-hover:from-blue-700 group-hover:to-teal-600 group-hover:bg-clip-text group-hover:text-transparent transition-all duration-500">
          {feature.title}
        </h3>
        
        <p className="text-gray-600 text-sm sm:text-base leading-relaxed flex-grow group-hover:text-gray-700 transition-colors duration-300">
          {feature.description}
        </p>
      </div>
      
      {/* Dynamic gradient border */}
      <div
        className="absolute inset-0 p-[2px] rounded-2xl opacity-70 group-hover:opacity-0 transition-opacity duration-500"
        style={{
          background: "linear-gradient(145deg, #3B82F6, #60A5FA)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
      <div
        className="absolute inset-0 p-[2px] rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{
          background: "linear-gradient(145deg, #1e40af, #0ea5e9, #14b8a6, #059669)",
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Slide 1: Inventory Overview */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 text-gray-800 px-4 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/4 w-32 h-32 bg-gradient-to-br from-blue-900 to-teal-700 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/3 w-24 h-24 bg-gradient-to-br from-teal-700 to-blue-900 rounded-full blur-xl animate-pulse animation-delay-1000" />
          <div className="absolute top-1/2 right-1/4 w-20 h-20 bg-gradient-to-br from-blue-800 to-cyan-600 rounded-full blur-xl animate-pulse animation-delay-2000" />
        </div>
        
        <div className="text-center w-full max-w-6xl relative z-10">
          <div className="mb-3 sm:mb-4 relative">
            <h2 className="text-2xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 bg-clip-text text-transparent drop-shadow-lg">
                Optimize
              </span>{" "}
              <span className="text-gray-800">Your Inventory</span>
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full" />
          </div>
          
          <p className="text-sm sm:text-lg bg-gradient-to-r from-blue-600 to-teal-600 bg-clip-text text-transparent font-medium mb-4 sm:mb-6">
            Experience real-time stock monitoring and automated reordering.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide 2: Advanced Analytics & Multi-Warehouse */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 px-4 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/3 right-1/4 w-36 h-36 bg-gradient-to-br from-indigo-900 to-purple-700 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/4 left-1/3 w-28 h-28 bg-gradient-to-br from-purple-700 to-pink-600 rounded-full blur-xl animate-pulse animation-delay-1500" />
          <div className="absolute top-1/2 left-1/4 w-22 h-22 bg-gradient-to-br from-blue-800 to-indigo-600 rounded-full blur-xl animate-pulse animation-delay-3000" />
        </div>
        
        <div className="text-center w-full max-w-6xl relative z-10">
          <div className="mb-3 sm:mb-4 relative">
            <h2 className="text-2xl sm:text-4xl font-bold">
              <span className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 bg-clip-text text-transparent drop-shadow-lg">
                Data-Driven
              </span>{" "}
              <span className="text-gray-800">Insights</span>
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
          </div>
          
          <p className="text-sm sm:text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent font-medium mb-4 sm:mb-6">
            Leverage comprehensive analytics and manage multiple warehouses effortlessly.
          </p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            {features.slice(3, 6).map((feature, index) => (
              <div key={index} className="animate-fade-in-up" style={{ animationDelay: `${index * 200}ms` }}>
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide 3: Call to Action */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 text-gray-800 px-4 relative overflow-hidden">
        {/* Animated background patterns */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-1/4 left-1/2 w-40 h-40 bg-gradient-to-br from-teal-900 to-cyan-700 rounded-full blur-xl animate-pulse" />
          <div className="absolute bottom-1/3 right-1/2 w-32 h-32 bg-gradient-to-br from-cyan-700 to-blue-600 rounded-full blur-xl animate-pulse animation-delay-2000" />
        </div>
        
        <div className="text-center w-full max-w-md sm:max-w-2xl relative z-10">
          <div className="mb-6 relative">
            <h2 className="text-2xl sm:text-4xl font-bold leading-tight">
              <span className="bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 bg-clip-text text-transparent drop-shadow-lg">
                Ready to Revolutionize
              </span>{" "}
              <span className="text-gray-800">Your Inventory?</span>
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-32 h-1 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full" />
          </div>
          
          <p className="text-sm sm:text-lg bg-gradient-to-r from-teal-600 to-cyan-600 bg-clip-text text-transparent font-medium mb-8">
            Transform your inventory management with our smart, efficient, and scalable solutions.
          </p>
          
          <button className="relative w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-teal-600 hover:from-blue-700 hover:via-blue-800 hover:to-teal-700 text-white rounded-xl font-semibold transition-all duration-300 text-sm sm:text-lg transform hover:scale-105 hover:shadow-xl shadow-lg overflow-hidden group">
            <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            <span className="relative z-10" 
              onClick={() =>
                document
                  .getElementById("get-started")
                  ?.scrollIntoView({ behavior: "smooth" })
              }
            >
              Get Started Today
            </span>
          </button>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fade-in-up {
          from {
            opacity: 0;
            transform: translateY(30px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        
        .animate-fade-in-up {
          animation: fade-in-up 0.6s ease-out forwards;
          opacity: 0;
        }
        
        .animation-delay-1000 {
          animation-delay: 1s;
        }
        
        .animation-delay-1500 {
          animation-delay: 1.5s;
        }
        
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        
        .animation-delay-3000 {
          animation-delay: 3s;
        }
      `}</style>
    </div>
  );
};

export default FeaturesMiddleSectionInventory;