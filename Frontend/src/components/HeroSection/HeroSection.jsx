import React from 'react';
import { ArrowRight, Shield, Zap, Users } from 'lucide-react';

const Hero = () => {
  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-teal-700 overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-20 w-72 h-72 bg-blue-500/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-teal-500/20 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-64 h-64 bg-orange-500/20 rounded-full blur-3xl animate-pulse delay-500"></div>
      </div>
      
      {/* Animated Grid Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-10"></div>
      
      <div className="relative z-10 flex items-center justify-center min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="animate-fade-in-up">
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight">
              Smart Inventory
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-teal-400 to-orange-400">
                Management
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-blue-100 mb-8 max-w-3xl mx-auto leading-relaxed">
              Revolutionize your college department's inventory management with Invennzy. 
              Track, manage, and optimize your resources with intelligent automation.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <button 
                onClick={() => document.getElementById('get-started')?.scrollIntoView({ behavior: 'smooth' })}
                className="bg-orange-500 hover:bg-orange-600 text-white px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl flex items-center gap-2"
              >
                Get Started <ArrowRight className="w-5 h-5" />
              </button>
              <button 
                onClick={() => document.getElementById('about-us')?.scrollIntoView({ behavior: 'smooth' })}
                className="border-2 border-white text-white hover:bg-white hover:text-blue-900 px-8 py-4 rounded-lg text-lg font-semibold transition-all duration-300 transform hover:scale-105"
              >
                Learn More
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
              {[
                { icon: Shield, title: "Secure", desc: "Bank-level security for your data" },
                { icon: Zap, title: "Fast", desc: "Lightning-fast inventory tracking" },
                { icon: Users, title: "Collaborative", desc: "Multi-user access management" }
              ].map((feature, index) => (
                <div key={index} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 hover:bg-white/20 transition-all duration-300 transform hover:scale-105">
                  <feature.icon className="w-8 h-8 text-teal-400 mb-4 mx-auto" />
                  <h3 className="text-white font-semibold text-lg mb-2">{feature.title}</h3>
                  <p className="text-blue-100 text-sm">{feature.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Hero;