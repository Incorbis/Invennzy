import React, { useState, useEffect } from "react";
import { Menu, X, Package } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navItems = [
    { name: "ABOUTUS", path: "/aboutus" },
    { name: "SERVICES", path: "/services" },
    { name: "CONTACT", path: "/contactus" },
    { name: "DOCS", path: "/docs" },
  ];

  const handleNavClick = (path) => {
    navigate(path);
    setIsOpen(false);
    window.scrollTo(0, 0); // Scroll to the top of the page
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-500 ease-in-out ${
        isScrolled
          ? "bg-white/95 backdrop-blur-md shadow-lg border-b border-gray-100"
          : "bg-white/90 backdrop-blur-sm"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {/* Logo */}
          <div className="flex items-center space-x-3 group cursor-pointer">
            <div className="relative">
              <Package className="h-8 w-8 text-blue-600 transition-transform duration-300 group-hover:scale-110" />
              <div className="absolute -inset-1 bg-blue-600/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur"></div>
            </div>
            <span className="text-2xl font-bold text-gray-900 tracking-tight">
              Invennzy
            </span>
          </div>
          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-1">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className="relative px-4 py-2 text-sm font-medium text-gray-700 rounded-lg transition-all duration-300 hover:text-blue-600 hover:bg-blue-50 group"
                style={{
                  animationDelay: `${index * 100}ms`,
                }}
              >
                {item.name}
                <span className="absolute bottom-0 left-1/2 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full group-hover:left-0"></span>
              </button>
            ))}
            {/* CTA Button */}
            <button className="ml-6 px-6 py-2 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg hover:shadow-blue-600/25 transform hover:-translate-y-0.5">
              Get Started
            </button>
          </div>
          {/* Mobile menu button */}
          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 text-gray-700 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-all duration-300"
            >
              {isOpen ? (
                <X className="h-6 w-6 transition-transform duration-300" />
              ) : (
                <Menu className="h-6 w-6 transition-transform duration-300" />
              )}
            </button>
          </div>
        </div>
      </div>
      {/* Mobile Navigation */}
      <div
        className={`md:hidden overflow-hidden transition-all duration-500 ease-in-out ${
          isOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
        }`}
      >
        <div className="bg-white/95 backdrop-blur-md border-t border-gray-100 shadow-lg">
          <div className="px-4 py-4 space-y-2">
            {navItems.map((item, index) => (
              <button
                key={item.name}
                onClick={() => handleNavClick(item.path)}
                className={`block w-full text-left px-4 py-3 text-base font-medium text-gray-700 rounded-lg transition-all duration-300 hover:text-blue-600 hover:bg-blue-50 hover:translate-x-2 transform ${
                  isOpen
                    ? "translate-x-0 opacity-100"
                    : "translate-x-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isOpen ? `${index * 100}ms` : "0ms",
                }}
              >
                <div className="flex items-center space-x-3">
                  <div className="w-1 h-1 bg-blue-600 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  <span>{item.name}</span>
                </div>
              </button>
            ))}
            {/* Mobile CTA Button */}
            <div className="pt-4 border-t border-gray-100">
              <button
                className={`w-full px-4 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all duration-300 hover:bg-blue-700 hover:shadow-lg transform hover:-translate-y-0.5 ${
                  isOpen
                    ? "translate-y-0 opacity-100"
                    : "translate-y-4 opacity-0"
                }`}
                style={{
                  transitionDelay: isOpen
                    ? `${navItems.length * 100}ms`
                    : "0ms",
                }}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
