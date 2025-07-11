import React, { useState, useEffect } from "react";
import { Menu, X, Package } from "lucide-react";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
    setIsOpen(false);
  };

  return (
    <nav
      className={`fixed w-full z-50 transition-all duration-300 ${
        isScrolled ? "bg-white shadow-lg" : "bg-transparent"
      }`}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-2">
            <Package
              className={`h-8 w-8 ${
                isScrolled ? "text-blue-600" : "text-white"
              }`}
            />
            <span
              className={`text-2xl font-bold ${
                isScrolled ? "text-gray-900" : "text-white"
              }`}
            >
              Invennzy
            </span>
          </div>

          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-8">
              {["ABOUTUS", "CONTACTUS", "SERVICES", "DOCS"].map((item) => (
                <Link to={`/${item.toLowerCase()}`}>
                  <button
                    key={item}
                    className={`px-3 py-2 rounded-md text-sm font-medium transition-colors duration-200 ${
                      isScrolled
                        ? "text-gray-700 hover:text-blue-600 hover:bg-blue-50"
                        : "text-white hover:text-blue-200 hover:bg-white/10"
                    }`}
                  >
                    {item}
                  </button>
                </Link>
              ))}
            </div>
          </div>

          <div className="md:hidden">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={`p-2 rounded-md ${
                isScrolled ? "text-gray-700" : "text-white"
              }`}
            >
              {isOpen ? (
                <X className="h-6 w-6" />
              ) : (
                <Menu className="h-6 w-6" />
              )}
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="md:hidden bg-white shadow-lg">
          <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
            {["ABOUTUS", "CONTACTUS", "SERVICES", "DOCS"].map((item) => (
              <Link to={`/${item.toLowerCase()}`}>
                <button
                  key={item}
                  className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-blue-600 hover:bg-blue-50 w-full text-left rounded-md transition-colors duration-200"
                >
                  {item}
                </button>
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
