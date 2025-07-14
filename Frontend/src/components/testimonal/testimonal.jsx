import { motion } from "framer-motion";
import React from "react";

const Testimonials = () => {
  const testimonials = [
    {
      id: 1,
      quote:
        "Invennzy has completely transformed our college's inventory management. It's intuitive and powerful.",
      author: "Dr. Sarah Johnson",
      position: "Head of IT, University of Tech",
    },
    {
      id: 2,
      quote:
        "The automated alerts have saved us countless hours. We never run out of lab equipment anymore.",
      author: "Prof. Michael Chen",
      position: "Science Department Chair",
    },
    {
      id: 3,
      quote:
        "Implementing Invennzy was the best decision we made for our campus inventory system this year.",
      author: "Lisa Rodriguez",
      position: "Facilities Manager",
    },
    {
      id: 4,
      quote:
        "The barcode scanning feature has reduced our equipment check-in time by 70%. Incredible efficiency!",
      author: "David Wilson",
      position: "Lab Coordinator",
    },
    {
      id: 5,
      quote:
        "Our inventory accuracy went from 78% to 99.5% after implementing Invennzy. Game changer.",
      author: "Emma Thompson",
      position: "Administrative Director",
    },
    {
      id: 6,
      quote:
        "The reporting dashboard gives us insights we never had before about equipment usage patterns.",
      author: "James Park",
      position: "Operations Manager",
    },
  ];

  return (
    <section className="py-16 px-4 bg-white">
      <div className="max-w-7xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-4xl font-bold text-gray-800 mb-4">
            Trusted by Educational Institutions Nationwide
          </h2>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Here's what administrators and faculty say about Invennzy Smart
            Inventory Management System
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-gray-50 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className="flex items-start mb-4">
                <span className="text-2xl mr-3 text-gray-400">
                  "{testimonial.id}"
                </span>
                <p className="text-gray-700 text-lg italic">
                  "{testimonial.quote}"
                </p>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <p className="font-semibold text-gray-800">
                  {testimonial.author}
                </p>
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
