import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

const LandingPage = () => {
  const texts = [
    {
      name: "Python",
      desc: "A robust Python environment designed for seamless coding, debugging, and deployment. Perfect for AI, data science, and automation projects.",
      btnText: "Play",
      link: "/python",
      color: "text-green-400",
      bgColor: "bg-green-500",
      hoverBg: "hover:bg-green-600",
      shadowColor: "hover:shadow-green-500/50",
    },
    {
      name: "SQL ",
      desc: "Query, visualize, and manage your databases effortlessly. Our SQL IDE provides powerful tools for handling structured data with precision.",
      btnText: "Play",
      link: "/sql",
      color: "text-blue-400",
      bgColor: "bg-blue-500",
      hoverBg: "hover:bg-blue-600",
      shadowColor: "hover:shadow-blue-500/50",
    },
  ];

  return (
    
    <div className="relative bg-gradient-to-r from-blue-950 to-purple-900 text-white min-h-screen flex flex-col items-center p-6 font-urbanist">
      {/* Website Name */}
      <motion.h1
        className="text-6xl font-extrabold text-white mb-8 tracking-widest drop-shadow-lg relative z-10"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        igniUp
      </motion.h1>

      {/* Motivational Quote */}
      <motion.h2
        className="text-3xl italic text-center mb-12 max-w-3xl text-gray-300 bg-gray-800/80 px-8 py-6 rounded-lg shadow-xl border border-gray-700 relative z-10"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        “Empowering the next generation of innovators through technology and
        hands-on learning.”
      </motion.h2>

      {/* IDE Cards Section */}
      <div className="grid md:grid-cols-2 gap-12 w-full max-w-6xl relative z-10">
        {texts.map((ide, index) => (
          <motion.div
            key={index}
            className={`bg-gray-900/90 p-10 rounded-3xl shadow-lg flex flex-col items-center transition-transform transform hover:scale-105 border border-gray-700 ${ide.shadowColor}`}
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 + index * 0.2 }}
          >
            <h3 className={`text-4xl font-bold ${ide.color}`}>{ide.name}</h3>
            <p className="text-gray-400 text-center mt-6 text-lg leading-relaxed">
              {ide.desc}
            </p>
            <NavLink
              to={ide.link}
              className={`mt-8 ${ide.bgColor} ${ide.hoverBg} text-white text-xl py-3 px-10 rounded-lg shadow-md transition-all ${ide.shadowColor}`}
            >
              Open {ide.name} IDE
            </NavLink>
          </motion.div>
        ))}
      </div>

      <footer className="mt-16 text-gray-400 text-sm text-center border-t border-gray-700 w-full py-4">
        © 2025 Ignipulse. Empowering IT education and innovation, one line of
        code at a time.
      </footer>
    </div>
  );
};

export default LandingPage;