import React, { useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { Hero3DModel } from "./Hero3d";
import { Suspense } from "react";

const HeroSection = () => {
  useEffect(() => {
    // Add keyframes and font import
    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
      
      .professional-font {
        font-family: 'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', sans-serif;
      }
      
      .tagline-font {
        font-family: 'Poppins', sans-serif;
        font-weight: 500;
      }
      
      @keyframes fadeInUp {
        from { 
          opacity: 0; 
          transform: translateY(40px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      @keyframes fadeIn {
        from { 
          opacity: 0; 
          transform: translateY(30px); 
        }
        to { 
          opacity: 1; 
          transform: translateY(0); 
        }
      }
      
      .animate-fadeInUp {
        animation: fadeInUp 0.8s ease-out;
      }
      
      .animate-fadeIn {
        animation: fadeIn 0.8s ease-out;
      }
      
      .delay-200 {
        animation-delay: 200ms;
      }
      
      .delay-400 {
        animation-delay: 400ms;
      }
      
      .delay-600 {
        animation-delay: 600ms;
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.head.removeChild(style);
    };
  }, []);

  return (
    <section
      id="home"
      className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900 text-white overflow-hidden"
    >
      <div className="container mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          {/* Content Section */}
          <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20">
            <div className="flex flex-col items-start space-y-6 lg:space-y-8 order-2 lg:order-1">
              <div className="space-y-4 lg:space-y-6 mt-10">
                <h1 className="professional-font text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-tight text-white animate-fadeInUp">
                  Smart Inventory
                  <span className="block text-blue-300">Management</span>
                </h1>
                <div className="tagline-font text-xl sm:text-2xl lg:text-3xl text-emerald-300 leading-relaxed animate-fadeInUp delay-200">
                  "Where Every Lab Tells a Story, and Every Asset Finds Its
                  Voice."
                </div>
              </div>
              <p className="professional-font text-lg sm:text-xl text-slate-300 leading-relaxed max-w-2xl animate-fadeIn delay-400">
                Keep track of every item, report every issue, and never lose
                sight of what matters. Invennzy simplifies your lab's daily
                operations with precision and ease.
              </p>
            </div>
            {/* Add any additional content or image here if needed */}
          </div>

          {/* 3D Canvas Section */}
          <div className="w-full h-[400px] sm:h-[500px] lg:h-[600px] xl:h-[700px] order-1 lg:order-2  delay-400 mb-10">
            <Canvas
              camera={{ position: [3, 2, 5], fov: 30 }}
              gl={{ preserveDrawingBuffer: true }}
              className="rounded-lg"
            >
              <ambientLight intensity={0.6} />
              <directionalLight position={[2, 5, 3]} intensity={1} />
              <Suspense fallback={null}>
                <Hero3DModel />
              </Suspense>
            </Canvas>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
