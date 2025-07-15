import { useRef } from "react";
import React from "react";

const FeaturesMiddleSectionInventory = () => {
  const containerRef = useRef(null);

  const features = [
    {
      title: "Smart Inventory Management in Real Time",
      description:
        "Track hardware components like PCs, keyboards, and fans with real-time updates. Monitor stock levels, usage, and condition instantly across all labs, enabling precise and timely decisions.",
      icon: "📦",
      badge: "Core",
    },
    {
      title: "Issue Reporting & Resolution Workflow",
      description:
        "Streamline issue resolution with a clear 3-level workflow: Lab Incharge reports issues, Lab Assistant verifies and resolves or escalates to Admin. Ensure no hardware problems go unnoticed.",
      icon: "🛠️",
      badge: "Workflow",
    },
    {
      title: "Lab-Wise Asset Tracking",
      description:
        "Maintain separate inventories per lab. Get detailed overviews of assets, status, and pending issues for each lab, improving organization and accountability across locations.",
      icon: "🏷️",
      badge: "Lab",
    },
    {
      title: "Automated Low Stock Alerts",
      description:
        "Receive automated alerts when essential items like mice, cables, or keyboards run low. Lab Assistants or Incharges can take immediate action to prevent downtime.",
      icon: "🔔",
      badge: "Smart",
    },
    {
      title: "Role-Based Dashboards",
      description:
        "Three customized dashboards for Lab Incharges, Lab Assistants, and Admins. Each user gets access to role-specific features, such as issue reporting, verification, or final approvals.",
      icon: "👤",
      badge: "Access",
    },
    {
      title: "Detailed Reports & Maintenance Logs",
      description:
        "Track hardware usage patterns and repair history with detailed reports. Make informed purchasing and maintenance decisions based on real data.",
      icon: "📄",
      badge: "Insight",
    },
  ];

  const FeatureCard = ({ feature }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg relative group bg-white border border-gray-200 h-full">
      <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl relative z-10 h-full flex flex-col">
        <div className="absolute top-2 right-2 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded-full border border-blue-200">
          {feature.badge}
        </div>
        <div className="text-3xl sm:text-4xl mb-3">{feature.icon}</div>
        <h3 className="text-gray-800 text-lg sm:text-xl font-bold mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-snug flex-grow">
          {feature.description}
        </p>
      </div>
      <div
        className="absolute inset-0 p-[2px] rounded-2xl"
        style={{
          background: "linear-gradient(145deg, #3B82F6, #60A5FA)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          maskComposite: "exclude",
        }}
      />
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Slide 1: Inventory Overview */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-white text-gray-800 px-4">
        <div className="text-center w-full max-w-6xl">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
            <span className="text-blue-600">Optimize</span> Your Inventory
          </h2>
          <p className="text-sm sm:text-lg text-blue-500 mb-4 sm:mb-6">
            Experience real-time stock monitoring and automated reordering.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.slice(0, 3).map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Slide 2: Advanced Analytics & Multi-Warehouse */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-white text-gray-800 px-4">
        <div className="text-center w-full max-w-6xl">
          <h2 className="text-2xl sm:text-4xl font-bold mb-3 sm:mb-4">
            <span className="text-blue-600">Data-Driven</span> Insights
          </h2>
          <p className="text-sm sm:text-lg text-blue-500 mb-4 sm:mb-6">
            Leverage comprehensive analytics and manage multiple warehouses
            effortlessly.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {features.slice(3, 6).map((feature, index) => (
              <FeatureCard key={index} feature={feature} />
            ))}
          </div>
        </div>
      </div>

      {/* Slide 3: Call to Action */}
      <div className="sticky top-0 h-screen flex items-center justify-center bg-white text-gray-800 px-4">
        <div className="text-center w-full max-w-md sm:max-w-2xl">
          <h2 className="text-2xl sm:text-4xl font-bold mb-4">
            Ready to Revolutionize Your Inventory?
          </h2>
          <p className="text-sm sm:text-lg text-blue-500 mb-6">
            Transform your inventory management with our smart, efficient, and
            scalable solutions.
          </p>
          <button className="w-full sm:w-auto px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all text-sm sm:text-lg">
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesMiddleSectionInventory;
