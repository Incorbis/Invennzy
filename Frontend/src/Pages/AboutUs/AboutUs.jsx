import React from 'react';
import { Target, Users, Award, Lightbulb } from 'lucide-react';

const AboutUs = () => {
  const stats = [
    { number: '500+', label: 'Institutions Served' },
    { number: '10K+', label: 'Inventory Items Managed' },
    { number: '99.9%', label: 'Uptime Guarantee' },
    { number: '24/7', label: 'Support Available' }
  ];

  const values = [
    {
      icon: Target,
      title: 'Precision',
      description: 'We deliver accurate, reliable inventory management solutions that you can trust.'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Built for teams, our platform enhances collaboration across all levels of your institution.'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from features to support.'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Continuously evolving with cutting-edge technology to meet your changing needs.'
    }
  ];

  return (
    <div id="about-us" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">About Invennzy</h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            We're passionate about revolutionizing inventory management for educational institutions, 
            making complex processes simple and efficient.
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-16">
          {stats.map((stat, index) => (
            <div key={index} className="text-center">
              <div className="text-3xl md:text-4xl font-bold text-blue-600 mb-2">{stat.number}</div>
              <div className="text-gray-600 font-medium">{stat.label}</div>
            </div>
          ))}
        </div>

        {/* Story Section */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-16">
          <div>
            <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
            <p className="text-lg text-gray-600 mb-4">
              Founded in 2020, Invennzy emerged from the recognition that educational institutions 
              needed a modern, efficient way to manage their growing inventory needs. What started 
              as a simple tracking system has evolved into a comprehensive platform.
            </p>
            <p className="text-lg text-gray-600 mb-4">
              Today, we serve hundreds of colleges and universities worldwide, helping them 
              streamline their operations, reduce costs, and improve accountability in their 
              inventory management processes.
            </p>
            <p className="text-lg text-gray-600">
              Our mission is to empower educational institutions with technology that makes 
              inventory management effortless, allowing them to focus on what matters most - education.
            </p>
          </div>
          <div className="relative">
            <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white">
              <h4 className="text-2xl font-bold mb-4">Why Choose Invennzy?</h4>
              <ul className="space-y-3">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Designed specifically for educational institutions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Intuitive interface that anyone can use
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Comprehensive reporting and analytics
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-white rounded-full mr-3"></div>
                  Dedicated support team
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Values Section */}
        <div>
          <h3 className="text-3xl font-bold text-gray-900 text-center mb-12">Our Values</h3>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {values.map((value, index) => (
              <div key={index} className="text-center">
                <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                  <value.icon className="w-8 h-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                <p className="text-gray-600">{value.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AboutUs;