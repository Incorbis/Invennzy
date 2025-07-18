import { motion } from "framer-motion";
import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote: "Invennzy has completely transformed our college's inventory management. It's intuitive and powerful.",
      author: "Dr. Sarah Johnson",
      position: "Head of IT, University of Tech",
    },
    {
      id: 2,
      quote: "The automated alerts have saved us countless hours. We never run out of lab equipment anymore.",
      author: "Prof. Michael Chen",
      position: "Science Department Chair",
    },
    {
      id: 3,
      quote: "Implementing Invennzy was the best decision we made for our campus inventory system this year.",
      author: "Lisa Rodriguez",
      position: "Facilities Manager",
    },
    {
      id: 4,
      quote: "The barcode scanning feature has reduced our equipment check-in time by 70%. Incredible efficiency!",
      author: "David Wilson",
      position: "Lab Coordinator",
    },
    {
      id: 5,
      quote: "Our inventory accuracy went from 78% to 99.5% after implementing Invennzy. Game changer.",
      author: "Emma Thompson",
      position: "Administrative Director",
    },
    {
      id: 6,
      quote: "The reporting dashboard gives us insights we never had before about equipment usage patterns.",
      author: "James Park",
      position: "Operations Manager",
    },
  ];

  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-4xl font-bold text-gray-900 mb-4">
            Trusted by Educational Institutions Nationwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Here's what administrators and faculty say about Invennzy Smart Inventory Management System
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              className="bg-white rounded-lg shadow-lg p-6 border border-gray-100 cursor-pointer hover:shadow-xl hover:border-gray-200 transition-all duration-300"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <blockquote className="text-gray-700 text-lg leading-relaxed mb-4">
                "{testimonial.quote}"
              </blockquote>
              <div className="text-center">
                <h4 className="font-bold text-gray-900">{testimonial.author}</h4>
                <p className="text-gray-600 text-sm">{testimonial.position}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default Testimonials;
