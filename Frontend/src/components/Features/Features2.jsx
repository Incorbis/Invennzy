import { useRef } from "react";
import React from "react";

const FeaturesMiddleSectionInventory = () => {
  const containerRef = useRef(null);

  const features = [
    {
      title: "Smart Inventory",
      description: "Track PCs, keyboards, fans in real-time across all labs.",
      icon: "📦",
      badge: "Core",
      color: "from-blue-600 to-cyan-500",
    },
    {
      title: "Issue Management",
      description: "3-step workflow: Report → Verify → Resolve issues.",
      icon: "🛠️",
      badge: "Workflow",
      color: "from-indigo-600 to-purple-500",
    },
    {
      title: "Lab Asset Tracking",
      description: "Monitor equipment status and stock by department.",
      icon: "🏷️",
      badge: "Lab",
      color: "from-teal-600 to-green-500",
    },
    {
      title: "Stock Alerts",
      description: "Get notified when items run low to prevent shortages.",
      icon: "🔔",
      badge: "Smart",
      color: "from-orange-600 to-red-500",
    },
    {
      title: "Role Dashboards",
      description: "Custom views for Incharges, Assistants, and Admins.",
      icon: "👤",
      badge: "Access",
      color: "from-violet-600 to-pink-500",
    },
    {
      title: "Reports & Analytics",
      description: "Data-driven insights for better decision making.",
      icon: "📄",
      badge: "Insight",
      color: "from-emerald-600 to-blue-500",
    },
  ];

  const FeatureCard = ({ feature }) => (
    <div className="rounded-xl overflow-hidden shadow-md relative group bg-white border border-gray-200 h-full transition-all duration-300 hover:scale-[1.02] hover:shadow-lg">
      <div className="p-4 sm:p-5 bg-white rounded-xl relative z-10 h-full flex flex-col">
        <div
          className={`absolute top-2 right-2 px-2 py-1 text-xs font-semibold rounded-full bg-gradient-to-r ${feature.color} text-white`}
        >
          {feature.badge}
        </div>

        <div className="text-3xl mb-3">{feature.icon}</div>

        <h3 className="text-gray-800 text-base sm:text-lg font-bold mb-2 md:bg-gradient-to-r md:from-blue-700 md:to-teal-600 md:bg-clip-text md:text-transparent">
          {feature.title}
        </h3>

        <p className="text-gray-600 text-sm leading-relaxed flex-grow">
          {feature.description}
        </p>
      </div>
    </div>
  );

  return (
    <div className="relative" ref={containerRef}>
      {/* Fixed navbar offset */}
      <div className="sticky top-0 h-[60px] z-0"></div>

      {/* Slide 1: Inventory Overview */}
      <div className="sticky top-[60px] h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-slate-50 via-blue-50 to-teal-50 text-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
          <div className="mb-4 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              <span className="text-blue-900">Optimize</span>{" "}
              <span className="text-gray-800">Your Inventory</span>
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-blue-600 to-teal-600 rounded-full" />
          </div>

          <p className="text-sm sm:text-base text-teal-600 font-medium mb-6">
            Experience real-time stock monitoring and automated insights.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.slice(0, 3).map((feature, index) => (
              <div key={index}>
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide 2: Advanced Analytics & Multi-Warehouse */}
      <div className="sticky top-[60px] h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 text-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full max-w-md sm:max-w-2xl md:max-w-4xl lg:max-w-6xl">
          <div className="mb-4 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              <span className="text-blue-900 ">Data-Driven</span>{" "}
              <span className="text-gray-800">Insights</span>
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full" />
          </div>

          <p className="text-sm sm:text-base text-purple-600  font-medium mb-6">
            Leverage comprehensive analytics and manage multiple labs
            effortlessly.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {features.slice(3, 6).map((feature, index) => (
              <div key={index}>
                <FeatureCard feature={feature} />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Slide 3: Call to Action */}
      <div className="sticky top-[60px] h-[calc(100vh-60px)] flex items-center justify-center bg-gradient-to-br from-teal-50 via-cyan-50 to-blue-50 text-gray-800 px-4 sm:px-6 lg:px-8">
        <div className="text-center w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-2xl">
          <div className="mb-6 relative">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold leading-tight">
              <span className="text-blue-800">Ready to Revolutionize</span>{" "}
              <span className="text-gray-800">Your Inventory?</span>
            </h2>
            <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-24 h-0.5 bg-gradient-to-r from-teal-600 to-cyan-600 rounded-full" />
          </div>

          <p className="text-sm sm:text-base text-cyan-600 font-medium mb-8">
            Transform your inventory management with smart, efficient, and
            scalable solutions.
          </p>

          <button
            className="px-6 py-3 bg-gradient-to-r from-blue-600 to-teal-600 text-white rounded-lg font-semibold transition-all duration-300 text-base hover:shadow-lg"
            onClick={() =>
              document
                .getElementById("get-started")
                ?.scrollIntoView({ behavior: "smooth" })
            }
          >
            Get Started Today
          </button>
        </div>
      </div>
    </div>
  );
};

export default FeaturesMiddleSectionInventory;
