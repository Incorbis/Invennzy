import { useRef } from "react";
import React from "react";

const FeaturesMiddleSectionInventory = () => {
  const containerRef = useRef(null);

  // Define features data for inventory management system
  const features = [
    {
      title: "Real-Time Stock Monitoring",
      description:
        "Monitor inventory levels as they change. Our system provides real-time updates so you can make immediate decisions to avoid overstocking or shortages.",
      icon: "📊",
      badge: "Core",
    },
    {
      title: "Automated Reordering",
      description:
        "Set thresholds for your inventory and let our automated system generate purchase orders when items run low—minimizing manual tasks.",
      icon: "🔄",
      badge: "Smart",
    },
    {
      title: "Supplier Integration",
      description:
        "Connect seamlessly with multiple suppliers. Our platform ensures your order management and delivery tracking are efficient and transparent.",
      icon: "🤝",
      badge: "Pro",
    },
    {
      title: "Comprehensive Analytics",
      description:
        "Gain deep insights into stock trends and performance metrics with interactive dashboards and tailored reports for data-driven decision-making.",
      icon: "📈",
      badge: "Insight",
    },
    {
      title: "Multi-Warehouse Management",
      description:
        "Manage inventory across different warehouses under one roof. Coordinate stock transfers and maintain real-time visibility across your locations.",
      icon: "🏭",
      badge: "Advanced",
    },
    {
      title: "Real-Time Alerts & Notifications",
      description:
        "Never miss a beat. Our system sends instant alerts for critical inventory events, ensuring you stay ahead of potential issues.",
      icon: "🔔",
      badge: "Alert",
    },
  ];

  // FeatureCard Component displays an individual feature in a card layout.
  const FeatureCard = ({ feature }) => (
    <div className="rounded-2xl overflow-hidden shadow-lg relative group bg-white border border-gray-200">
      <div className="p-4 sm:p-6 bg-gray-50 rounded-2xl relative z-10">
        <div className="absolute top-2 right-2 px-2 py-1 text-xs sm:text-sm bg-blue-100 text-blue-700 rounded-full border border-blue-200">
          {feature.badge}
        </div>
        <div className="text-3xl sm:text-4xl mb-3">{feature.icon}</div>
        <h3 className="text-gray-800 text-lg sm:text-2xl font-bold mb-1 sm:mb-2">
          {feature.title}
        </h3>
        <p className="text-gray-600 text-sm sm:text-base leading-snug">
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard feature={features[0]} />
            <FeatureCard feature={features[1]} />
            <FeatureCard feature={features[2]} />
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
            <FeatureCard feature={features[3]} />
            <FeatureCard feature={features[4]} />
            <FeatureCard feature={features[5]} />
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
