import React, { useState, useEffect } from 'react';
import { Target, Users, Award, Lightbulb, ArrowLeft, Calendar, TrendingUp, Heart } from 'lucide-react';

const AboutUs = () => {
  const [isVisible, setIsVisible] = useState(false);
  const [activeValue, setActiveValue] = useState(0);
  const [timelineProgress, setTimelineProgress] = useState(0);

  useEffect(() => {
    setIsVisible(true);
    
    // Change active value every 3/4 seconds (3 seconds / 4 values)
    const valueInterval = setInterval(() => {
      setActiveValue((prev) => (prev + 1) % 4);
    }, 750);

    // Animate timeline progress over 3 seconds
    const progressInterval = setInterval(() => {
      setTimelineProgress((prev) => {
        if (prev >= 100) return 0;
        return prev + (100 / 60); // 100% over 3 seconds (60 intervals of 50ms each)
      });
    }, 50);

    return () => {
      clearInterval(valueInterval);
      clearInterval(progressInterval);
    };
  }, []);

  const handleGoBack = () => {
    window.history.back();
  };

  const values = [
    {
      icon: Target,
      title: 'Precision',
      description: 'We deliver accurate, reliable inventory management solutions that you can trust.',
      color: 'from-blue-500 to-blue-600'
    },
    {
      icon: Users,
      title: 'Collaboration',
      description: 'Built for teams, our platform enhances collaboration across all levels of your institution.',
      color: 'from-teal-500 to-teal-600'
    },
    {
      icon: Award,
      title: 'Excellence',
      description: 'We strive for excellence in every aspect of our service, from features to support.',
      color: 'from-purple-500 to-purple-600'
    },
    {
      icon: Lightbulb,
      title: 'Innovation',
      description: 'Continuously evolving with cutting-edge technology to meet your changing needs.',
      color: 'from-orange-500 to-orange-600'
    }
  ];



  return (
    <div id="about-us" className="bg-white">
      {/* Header Section with Clean Background */}
      <div className="bg-gradient-to-r from-blue-600 to-teal-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-start justify-between mb-8">
            <button
              onClick={handleGoBack}
              className="inline-flex items-center gap-2 px-4 py-2 text-white hover:text-gray-100 hover:bg-white/10 rounded-lg transition-all duration-200 group"
            >
              <ArrowLeft className="w-5 h-5 group-hover:-translate-x-1 transition-transform duration-200" />
              <span className="font-medium">Back</span>
            </button>
          </div>

          <div className={`text-center transition-all duration-1000 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`}>
            <h2 className="text-5xl font-bold mb-6">About Invennzy</h2>
            <p className="text-xl text-white/90 max-w-4xl mx-auto leading-relaxed">
              We're passionate about revolutionizing inventory management for educational institutions, 
              making complex processes simple and efficient through innovative technology.
            </p>
          </div>
        </div>
      </div>

      {/* Story Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Our Story</h3>
              <p className="text-lg text-gray-600 mb-4">
                Welcome to Invennzy – Smart Inventory, Simplified.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                At Invennzy, we believe that managing inventory for academic departments should be seamless, efficient, and stress-free. Born out of the need to streamline inventory operations within educational institutions, Invennzy is a powerful platform designed specifically for departmental-level asset and inventory management.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                We provide a centralized system that helps institutions track, manage, and organize all departmental assets—from lab equipment and electronics to furniture and consumables—with ease and precision.
              </p>
              <p className="text-lg text-gray-600">
                Our mission is to empower institutions with a smart, secure, and transparent inventory solution that eliminates manual errors, reduces redundancy, and enhances accountability.
              </p>
            </div>
            
            <div className={`relative transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <div className="bg-gradient-to-r from-blue-500 to-teal-500 rounded-2xl p-8 text-white hover:scale-105 transition-transform duration-300">
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
        </div>
      </div>

      {/* Values Section with Horizontal Timeline */}
      <div className="py-16 bg-gradient-to-b from-gray-50 to-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h3>
            <p className="text-xl text-gray-600">The principles that guide everything we do</p>
          </div>
          
          <div className="relative">
            {/* Animated horizontal line */}
            <div className="relative h-1 bg-gray-200 rounded-full mb-8">
              <div 
                className="absolute top-0 left-0 h-1 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full transition-all duration-100"
                style={{ width: `${timelineProgress}%` }}
              ></div>
            </div>
            
            {/* Values cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              {values.map((value, index) => (
                <div key={index} className="text-center">
                  <div className={`transition-all duration-500 ${isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'}`} style={{ transitionDelay: `${index * 300}ms` }}>
                    <div className={`bg-white rounded-xl p-6 shadow-lg hover:shadow-xl transition-all duration-300 hover:scale-105 ${activeValue === index ? 'ring-2 ring-blue-500' : ''}`}>
                      <div className={`bg-gradient-to-r ${value.color} w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4 hover:scale-110 transition-transform duration-300`}>
                        <value.icon className="w-8 h-8 text-white" />
                      </div>
                      <h4 className="text-xl font-semibold text-gray-900 mb-3">{value.title}</h4>
                      <p className="text-gray-600">{value.description}</p>
                    </div>
                  </div>
                  
                  {/* Value dot */}
                  <div className="relative -mt-4">
                    <div className="mx-auto w-4 h-4 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full border-4 border-white shadow-lg"></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Creative Conclusion Section with Image */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 -translate-x-8'}`}>
              <div className="relative">
                <div className="bg-gradient-to-br from-blue-50 to-teal-50 rounded-2xl p-8 h-80 flex items-center justify-center relative overflow-hidden">
                  {/* Abstract geometric shapes */}
                  <div className="absolute top-4 left-4 w-16 h-16 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full opacity-20"></div>
                  <div className="absolute bottom-4 right-4 w-12 h-12 bg-gradient-to-r from-teal-400 to-blue-400 rounded-full opacity-20"></div>
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-24 h-24 bg-gradient-to-r from-blue-500 to-teal-500 rounded-full opacity-10"></div>
                  
                  {/* Central illustration */}
                  <div className="text-center z-10">
                    <div className="bg-gradient-to-r from-blue-500 to-teal-500 w-24 h-24 rounded-2xl mx-auto mb-4 flex items-center justify-center shadow-xl">
                      <TrendingUp className="w-12 h-12 text-white" />
                    </div>
                    <div className="text-6xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-teal-600">
                      Future
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className={`transition-all duration-1000 ${isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-8'}`}>
              <h3 className="text-3xl font-bold text-gray-900 mb-6">Building Tomorrow, Today</h3>
              <p className="text-lg text-gray-600 mb-4">
                At Invennzy, we don’t just manage inventory — we shape the future of institutional operations. Every feature we develop, every interface we design, and every interaction we deliver is rooted in innovation, purpose, and foresight.
              </p>
              <p className="text-lg text-gray-600 mb-4">
                Our platform is built to grow with you — adapting to evolving departmental needs, integrating emerging technologies, and anticipating challenges before they arise. Invennzy isn't just a tool; it's a forward-thinking ecosystem designed to transform how institutions operate.
              </p>
              <p className="text-lg text-gray-600 mb-6">
                We’re not just solving today’s problems — we’re preparing you for what’s next.
                Join us on this journey of progress, where boundaries are redefined, possibilities are unlocked, and institutional efficiency reaches new heights.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="py-16 bg-gradient-to-r from-blue-600 to-teal-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="flex items-center justify-center mb-4">
            
            <h3 className="text-3xl font-bold">Ready to Transform Your Inventory Management?</h3>
          </div>
          <p className="text-xl text-white/90 mb-8 max-w-2xl mx-auto">
            Join hundreds of institutions already using Invennzy to streamline their operations
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition-all duration-300 transform hover:scale-105">
              Get Started Today
            </button>
            
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="col-span-2">
              <h3 className="text-2xl font-bold mb-4">Invennzy</h3>
              <p className="text-gray-300 mb-4">
                Streamlining inventory management for institutions with innovative solutions and reliable support.
              </p>
              <div className="flex space-x-4">
                <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">f</span>
                </div>
                <div className="w-8 h-8 bg-blue-400 rounded-full flex items-center justify-center hover:bg-blue-500 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">t</span>
                </div>
                <div className="w-8 h-8 bg-gradient-to-r from-pink-500 to-orange-500 rounded-full flex items-center justify-center hover:from-pink-600 hover:to-orange-600 transition-colors cursor-pointer">
                  <span className="text-sm font-bold text-white">ig</span>
                </div>
                <div className="w-8 h-8 bg-blue-700 rounded-full flex items-center justify-center hover:bg-blue-800 transition-colors cursor-pointer">
                  <span className="text-sm font-bold">in</span>
                </div>
              </div>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Quick Links</h4>
              <ul className="space-y-2 text-gray-300">
                <li><a href="#" className="hover:text-white transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Features</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-white transition-colors">Support</a></li>
              </ul>
            </div>
            
            <div>
              <h4 className="text-lg font-semibold mb-4">Contact</h4>
              <ul className="space-y-2 text-gray-300">
                <li>support@invennzy.com</li>
                <li>+1 (555) 123-4567</li>
                <li>123 Tech Street</li>
                <li>Innovation City</li>
              </ul>
            </div>
          </div>
          
          <div className="border-t border-gray-800 mt-8 pt-8 text-center text-gray-300">
            <p>&copy; 2025 Invennzy. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;