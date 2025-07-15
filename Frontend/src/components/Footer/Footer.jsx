import React from "react";
import {
  FaTwitter,
  FaFacebookF,
  FaLinkedinIn,
  FaInstagram,
} from "react-icons/fa";
import { Package, Mail, Phone, MapPin } from "lucide-react";
import { useNavigate } from "react-router-dom";
import logo2 from "../../assets/logo2.png";

const Footer = () => {
  const footerSections = [
    {
      title: "Company",
      links: [
        { name: "AboutUs", href: "/aboutus" },
        { name: "ContactUs", href: "/contactus" },
        { name: "Services", href: "/services" },
      ],
    },
    {
      title: "Resources",
      links: [
        { name: "Documentation", href: "/docs" },
        { name: "FAQ", href: "/faq" },
        { name: "Privacy Policy", href: "/privacy" },
        { name: "Terms & Conditions", href: "/terms" },
      ],
    },
  ];

  const navigate = useNavigate();

  const socialLinks = [
    {
      icon: FaTwitter,
      href: "https://x.com/incorbis?t=yRcNnKknmtATHWpOXWnA6w&s=09",
      label: "Twitter",
    },
    {
      icon: FaFacebookF,
      href: "https://www.facebook.com/profile.php?id=61570261174985&mibextid=ZbWKwL",
      label: "Facebook",
    },
    {
      icon: FaLinkedinIn,
      href: "https://www.linkedin.com/company/incorbis",
      label: "LinkedIn",
    },
    {
      icon: FaInstagram,
      href: "https://www.instagram.com/incorbis.official?igsh=OTlyb2VmZWVpdWly",
      label: "Instagram",
    },
  ];

  const handleLinkClick = (href) => {
    navigate(href);
    window.scrollTo(0, 0);
  };

  return (
    <footer className="bg-gray-100 text-gray-800 relative">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-blue-500 to-transparent"></div>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <div>
            <div className="flex items-center space-x-3 mb-6 group">
              <div className="relative">
                <div className="h-9 w-13 text-blue-600 transition-transform duration-300 group-hover:scale-110">
                  <img src={logo2}></img>
                </div>
              </div>
              <span className="text-2xl font-bold text-gray-900 tracking-tight">
                Invennzy
              </span>
            </div>
            <p className="text-gray-600 mb-6 max-w-md leading-relaxed">
              Revolutionizing inventory management for educational institutions
              with smart, secure, and efficient solutions that streamline
              operations.
            </p>
            <div className="space-y-3">
              <div className="flex items-center space-x-3 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                <Mail className="h-4 w-4 text-blue-600" />
                <span>support@invennzy.com</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                <Phone className="h-4 w-4 text-blue-600" />
                <span>+91 9373617934</span>
              </div>
              <div className="flex items-center space-x-3 text-sm text-gray-600 hover:text-blue-600 transition-colors duration-200 cursor-pointer">
                <MapPin className="h-4 w-4 text-blue-600" />
                <span>Pimpri, Maharashtra, India</span>
              </div>
            </div>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
            {footerSections.map((section, index) => (
              <div key={index} className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-900 border-b border-gray-300 pb-2">
                  {section.title}
                </h3>
                <ul className="space-y-3">
                  {section.links.map((link, linkIndex) => (
                    <li key={linkIndex}>
                      <button
                        onClick={() => handleLinkClick(link.href)}
                        className="text-gray-600 hover:text-blue-600 transition-all duration-300 hover:translate-x-1 transform text-left block w-full"
                      >
                        {link.name}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
            <div className="flex space-x-4">
              {socialLinks.map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  className="group bg-gray-200 hover:bg-blue-600 p-3 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-600/25 transform hover:-translate-y-1"
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <social.icon className="h-5 w-5 text-gray-600 group-hover:text-white transition-colors duration-300" />
                </a>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-gray-300">
          <div className="flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
            <div className="text-gray-500 text-sm">
              © 2023 Invennzy. All rights reserved.
            </div>
            <div className="flex items-center space-x-6">
              <div className="text-gray-500 text-sm">
                Powered by{" "}
                <span className="text-blue-600 font-medium">Incorbis</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
