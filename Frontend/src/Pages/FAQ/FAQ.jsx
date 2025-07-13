import React, { useState } from 'react';
import { ChevronDown, ChevronUp, HelpCircle, Search, Book, Users, Shield, Settings, ArrowLeft } from 'lucide-react';

const FAQ = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [activeCategory, setActiveCategory] = useState('general');
  const [openItems, setOpenItems] = useState([]);

  const toggleItem = (index) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(item => item !== index)
        : [...prev, index]
    );
  };

  const categories = [
    { id: 'general', name: 'General', icon: HelpCircle },
    { id: 'getting-started', name: 'Getting Started', icon: Book },
    { id: 'user-management', name: 'User Management', icon: Users },
    { id: 'security', name: 'Security', icon: Shield },
    { id: 'technical', name: 'Technical', icon: Settings }
  ];

  const faqData = {
    general: [
      {
        question: "What is Invennzy?",
        answer: "Invennzy is a comprehensive smart inventory management system designed specifically for educational institutions. It helps college departments track, manage, and optimize their inventory resources with intelligent automation, real-time analytics, and collaborative features."
      },
      {
        question: "Which types of educational institutions can use Invennzy?",
        answer: "Invennzy is designed for colleges, universities, technical institutes, and research institutions. It's particularly useful for departments with laboratories, workshops, libraries, and any facility that manages physical inventory items."
      },
      {
        question: "What types of inventory can be managed with Invennzy?",
        answer: "You can manage any type of inventory including laboratory equipment, computers, furniture, books, consumables, chemicals, tools, and any other physical assets your department owns or maintains."
      },
      {
        question: "Is Invennzy cloud-based or on-premise?",
        answer: "Invennzy is a cloud-based solution, which means your data is securely stored in the cloud and accessible from anywhere with an internet connection. This ensures automatic backups, updates, and 24/7 availability."
      },
      {
        question: "How much does Invennzy cost?",
        answer: "We offer flexible pricing plans based on the size of your institution and the number of users. Contact our sales team for a customized quote that fits your budget and requirements."
      }
    ],
    'getting-started': [
      {
        question: "How do I get started with Invennzy?",
        answer: "Getting started is easy! First, an Admin needs to sign up for an account. Once registered, you can set up your department, add inventory items, and invite Lab Incharges and Lab Assistants to join your system."
      },
      {
        question: "What information do I need to set up my inventory?",
        answer: "For each inventory item, you'll typically need: item name, description, category, location, purchase date, cost, condition, and any relevant specifications. You can also add photos and maintenance schedules."
      },
      {
        question: "How long does it take to implement Invennzy?",
        answer: "Basic setup can be completed in a few hours. However, the time to fully implement depends on the size of your inventory. Most departments are fully operational within 1-2 weeks, including staff training and data migration."
      },
      {
        question: "Do you provide training for our staff?",
        answer: "Yes! We provide comprehensive training including video tutorials, documentation, live training sessions, and ongoing support to ensure your team can effectively use all features of Invennzy."
      },
      {
        question: "Can I import existing inventory data?",
        answer: "Absolutely! We support data import from Excel spreadsheets, CSV files, and other common formats. Our support team can help you migrate your existing inventory data seamlessly."
      }
    ],
    'user-management': [
      {
        question: "What are the different user roles in Invennzy?",
        answer: "Invennzy has three main user roles: Admin (full system access, user management, reporting), Lab Incharge (inventory management, issue tracking, user supervision), and Lab Assistant (basic inventory operations, issue reporting)."
      },
      {
        question: "How do I add new users to the system?",
        answer: "Admins can add new users by going to the User Management section, clicking 'Add User', entering their details, and assigning appropriate roles. New users will receive an email invitation to set up their account."
      },
      {
        question: "Can I change user roles after they're created?",
        answer: "Yes, Admins can modify user roles at any time through the User Management interface. Changes take effect immediately, and users will be notified of any role modifications."
      },
      {
        question: "What happens if a user forgets their password?",
        answer: "Users can reset their password using the 'Forgot Password' link on the login page. They'll receive a secure reset link via email. Admins can also reset passwords for users if needed."
      },
      {
        question: "Can I set up approval workflows?",
        answer: "Yes! You can configure approval workflows for various actions like adding new inventory, disposing items, or making significant changes. This ensures proper oversight and accountability."
      }
    ],
    security: [
      {
        question: "How secure is my data in Invennzy?",
        answer: "We take security very seriously. Your data is protected with bank-level encryption, secure data centers, regular security audits, and compliance with industry standards. We also provide role-based access control and audit trails."
      },
      {
        question: "Who can access my inventory data?",
        answer: "Only authorized users from your institution can access your data. Access is controlled through role-based permissions, and you have complete control over who can view, edit, or manage different aspects of your inventory."
      },
      {
        question: "Is my data backed up?",
        answer: "Yes, your data is automatically backed up multiple times daily to secure, geographically distributed servers. We maintain multiple backup copies to ensure your data is never lost."
      },
      {
        question: "Can I export my data?",
        answer: "Absolutely! You can export your inventory data at any time in various formats including Excel, CSV, and PDF reports. This ensures you always have access to your data and can use it with other systems if needed."
      },
      {
        question: "What happens if there's a system outage?",
        answer: "We maintain 99.9% uptime with redundant systems and automatic failover. In the rare event of an outage, our systems are designed to restore service quickly, and no data is lost due to our robust backup systems."
      }
    ],
    technical: [
      {
        question: "What browsers are supported?",
        answer: "Invennzy works on all modern browsers including Chrome, Firefox, Safari, and Edge. We recommend using the latest version of your preferred browser for the best experience."
      },
      {
        question: "Is there a mobile app?",
        answer: "While we don't have a dedicated mobile app yet, Invennzy is fully responsive and works excellently on mobile devices through your web browser. A native mobile app is in development."
      },
      {
        question: "Can Invennzy integrate with other systems?",
        answer: "Yes! We offer API integrations and can connect with existing ERP systems, accounting software, and other institutional management systems. Contact our technical team to discuss specific integration needs."
      },
      {
        question: "What if I need custom features?",
        answer: "We're always open to feedback and feature requests. Many of our current features came from user suggestions. For custom development needs, we offer enterprise solutions with tailored features."
      },
      {
        question: "How do I report bugs or technical issues?",
        answer: "You can report issues through our support portal, email support@invennzy.com, or use the in-app help feature. Our technical support team responds to all issues within 24 hours, with critical issues addressed immediately."
      }
    ]
  };

  const filteredFAQs = faqData[activeCategory].filter(
    faq => 
      faq.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-900 to-teal-700 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Back Button */}
          <div className="mb-8">
            <button
              onClick={() => window.history.back()}
              className="flex items-center space-x-2 text-white hover:text-blue-100 transition-colors duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
          </div>
          
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Frequently Asked Questions
            </h1>
            <p className="text-xl text-blue-100 max-w-3xl mx-auto">
              Find answers to common questions about Invennzy and how it can help manage your institution's inventory
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-2xl mx-auto">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
            <input
              type="text"
              placeholder="Search for answers..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-4 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent text-lg"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-4 gap-8">
          {/* Category Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-lg p-6 sticky top-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Categories</h3>
              <div className="space-y-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setActiveCategory(category.id)}
                    className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-colors duration-200 ${
                      activeCategory === category.id
                        ? 'bg-blue-100 text-blue-700 border-l-4 border-blue-500'
                        : 'text-gray-600 hover:bg-gray-50'
                    }`}
                  >
                    <category.icon className="w-5 h-5" />
                    <span className="font-medium">{category.name}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* FAQ Content */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-xl shadow-lg">
              <div className="p-6 border-b border-gray-200">
                <h2 className="text-2xl font-bold text-gray-900">
                  {categories.find(cat => cat.id === activeCategory)?.name} Questions
                </h2>
                <p className="text-gray-600 mt-1">
                  {filteredFAQs.length} question{filteredFAQs.length !== 1 ? 's' : ''} found
                </p>
              </div>

              <div className="divide-y divide-gray-200">
                {filteredFAQs.length === 0 ? (
                  <div className="p-8 text-center">
                    <HelpCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No questions found</h3>
                    <p className="text-gray-600">Try adjusting your search terms or browse other categories.</p>
                  </div>
                ) : (
                  filteredFAQs.map((faq, index) => (
                    <div key={index} className="p-6">
                      <button
                        onClick={() => toggleItem(index)}
                        className="w-full flex justify-between items-start text-left"
                      >
                        <h3 className="text-lg font-semibold text-gray-900 pr-4">
                          {faq.question}
                        </h3>
                        {openItems.includes(index) ? (
                          <ChevronUp className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                        ) : (
                          <ChevronDown className="w-5 h-5 text-gray-500 flex-shrink-0 mt-1" />
                        )}
                      </button>
                      
                      {openItems.includes(index) && (
                        <div className="mt-4 pr-8">
                          <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                        </div>
                      )}
                    </div>
                  ))
                )}
              </div>
            </div>

            {/* Still have questions section */}
            <div className="mt-8 bg-gradient-to-r from-blue-50 to-teal-50 rounded-xl p-8 text-center">
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Still have questions?</h3>
              <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
                Can't find the answer you're looking for? Our support team is here to help you get the most out of Invennzy.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <button 
                  onClick={() => window.open('/contact', '_blank')}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200"
                >
                  Contact Support
                </button>
                <button className="border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-6 py-3 rounded-lg font-semibold transition-colors duration-200">
                  Schedule a Demo
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FAQ;