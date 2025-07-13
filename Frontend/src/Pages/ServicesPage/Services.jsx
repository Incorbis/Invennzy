import React from 'react';
import { ArrowLeft, Check, BarChart3, Package, TrendingUp, Facebook, Twitter, Instagram, Linkedin } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const Services = () => {
  const navigate = useNavigate();

  const services = [
    {
      icon: Package,
      title: "Smart Inventory Tracking",
      description: "Advanced tracking system that monitors your educational resources in real-time, providing complete visibility into your institution's inventory.",
      features: [
        "Real-time asset monitoring",
        "Automated alerts and notifications", 
        "Barcode and QR code integration",
        "Location-based tracking"
      ],
      image: "/lovable-uploads/ecfe848a-4f61-4a7b-a567-424b70adf584.png"
    },
    {
      icon: TrendingUp,
      title: "Automated Procurement",
      description: "Streamlined procurement process that automatically manages purchase orders, vendor relationships, and budget allocation for educational supplies.",
      features: [
        "Automated purchase orders",
        "Vendor management system",
        "Budget tracking and alerts",
        "Approval workflow automation"
      ],
      image: "/lovable-uploads/ecfe848a-4f61-4a7b-a567-424b70adf584.png"
    },
    {
      icon: BarChart3,
      title: "Analytics & Reporting", 
      description: "Comprehensive analytics dashboard that provides insights into usage patterns, cost optimization, and predictive maintenance for better decision-making.",
      features: [
        "Usage pattern analysis",
        "Cost optimization insights",
        "Predictive maintenance alerts",
        "Custom report generation"
      ],
      image: "/lovable-uploads/ecfe848a-4f61-4a7b-a567-424b70adf584.png"
    }
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section - Updated to match the blue gradient theme */}
      <section className="relative bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-400 text-white overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0">
          <div className="absolute -top-1/2 -left-1/2 w-[200%] h-[200%] bg-gradient-radial from-white/10 via-transparent to-transparent animate-pulse"></div>
        </div>
        
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="absolute top-8 left-8 flex items-center gap-2 text-white/90 hover:text-white transition-all duration-300 hover:-translate-x-1 z-10"
        >
          <ArrowLeft className="w-5 h-5" />
          <span className="font-medium">Back</span>
        </button>

        <div className="relative z-10 container mx-auto px-6 py-20 md:py-32">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 animate-fade-in">
              Our Services
            </h1>
            <p className="text-lg md:text-xl text-white/95 leading-relaxed animate-fade-in [animation-delay:200ms]">
              We're passionate about revolutionizing inventory management for educational institutions, 
              making complex processes simple and efficient through innovative technology.
            </p>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section className="relative py-20 md:py-32 bg-slate-50">
        {/* Decorative top shape - Updated to match theme */}
        <div className="absolute top-0 left-0 right-0 h-24 bg-gradient-to-r from-blue-500 via-blue-600 to-cyan-400" 
             style={{ clipPath: 'polygon(0 0, 100% 0, 100% 50%, 0 100%)' }}>
        </div>

        <div className="container mx-auto px-6 relative z-10">
          {/* Section Header */}
          <div className="text-center mb-16 md:mb-20 animate-fade-in [animation-delay:100ms]">
            <h2 className="text-3xl md:text-5xl font-bold text-slate-900 mb-4 relative">
              What We Offer
              <div className="absolute -bottom-3 left-1/2 transform -translate-x-1/2 w-20 h-1 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-full"></div>
            </h2>
            <p className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mt-6">
              Comprehensive solutions designed to streamline your inventory management processes
            </p>
          </div>

          {/* Services Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
            {services.map((service, index) => (
              <div
                key={service.title}
                className="group bg-white rounded-2xl p-8 shadow-lg hover:shadow-2xl transition-all duration-500 hover:-translate-y-2 animate-fade-in relative overflow-hidden"
                style={{ animationDelay: `${(index + 2) * 100}ms` }}
              >
                {/* Hover gradient line - Updated to match theme */}
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-blue-500 to-cyan-400 transform -translate-x-full group-hover:translate-x-0 transition-transform duration-500"></div>
                
                {/* Service Image */}
                <div className="w-full h-48 bg-gradient-to-br from-blue-50 to-cyan-50 rounded-xl mb-6 overflow-hidden group-hover:scale-105 transition-transform duration-300">
                  <img 
                    src={service.image} 
                    alt={service.title}
                    className="w-full h-full object-cover"
                  />
                </div>

                {/* Service Icon */}
                <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                  <service.icon className="w-8 h-8 text-blue-600" />
                </div>

                <h3 className="text-xl md:text-2xl font-semibold text-slate-900 mb-4">
                  {service.title}
                </h3>
                
                <p className="text-slate-600 mb-6 leading-relaxed">
                  {service.description}
                </p>

                <ul className="space-y-3">
                  {service.features.map((feature, featureIndex) => (
                    <li key={featureIndex} className="flex items-center gap-3 text-slate-700">
                      <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      <span>{feature}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-white">
        <div className="container mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-12">
            {/* Company Info */}
            <div>
              <h3 className="text-2xl font-bold text-white mb-6">Invennzy</h3>
              <p className="text-slate-300 mb-6 leading-relaxed">
                Streamlining inventory management for institutions with innovative solutions and reliable support.
              </p>
              <div className="flex gap-4">
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700 transition-colors duration-300"
                >
                  <Facebook className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-cyan-400 rounded-full flex items-center justify-center text-white hover:bg-cyan-500 transition-colors duration-300"
                >
                  <Twitter className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-pink-500 rounded-full flex items-center justify-center text-white hover:bg-pink-600 transition-colors duration-300"
                >
                  <Instagram className="w-5 h-5" />
                </a>
                <a
                  href="#"
                  className="w-10 h-10 bg-blue-800 rounded-full flex items-center justify-center text-white hover:bg-blue-900 transition-colors duration-300"
                >
                  <Linkedin className="w-5 h-5" />
                </a>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Quick Links</h3>
              <ul className="space-y-3">
                <li>
                  <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">
                    About Us
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">
                    Features
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">
                    Pricing
                  </a>
                </li>
                <li>
                  <a href="#" className="text-slate-300 hover:text-cyan-400 transition-colors duration-300">
                    Support
                  </a>
                </li>
              </ul>
            </div>

            {/* Contact */}
            <div>
              <h3 className="text-lg font-semibold text-white mb-6">Contact</h3>
              <div className="space-y-3 text-slate-300">
                <p>support@invennzy.com</p>
                <p>+1 (555) 123-4567</p>
                <p>123 Tech Street</p>
                <p>Innovation City</p>
              </div>
            </div>
          </div>

          {/* Footer Bottom */}
          <div className="border-t border-slate-700 pt-6 text-center text-slate-400">
            <p>&copy; 2025 Invennzy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Services;