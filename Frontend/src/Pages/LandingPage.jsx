import React from "react";
import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";
import { Rocket, Code, Lightbulb } from "lucide-react";
import py from '../assets/py.svg'
import sql from '../assets/sql.svg'

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
      name: "SQL",
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
    
    <div className="relative bg-white text-black min-h-screen flex flex-col items-center justify-center gap-y-6 p-4 font-urbanist">
      {/* Website Name */}
      <motion.h1
        className="text-6xl font-extrabold text-black tracking-wide drop-shadow-md flex items-center gap-2"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
      >
        <Rocket size={50} className="text-blue-700" /> igniUp
      </motion.h1>

      {/* Motivational Quote */}
      <motion.h2
        className="text-lg italic text-center max-w-xl tracking-wide text-gray-700 bg-black/10 px-6 py-4 rounded-xl shadow-md flex items-center gap-2"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 1, delay: 0.5 }}
      >
        <Lightbulb className="w-6 h-6 text-yellow-500" /> “Empowering the next generation of innovators through technology and hands-on learning.”
      </motion.h2>

      {/* IDE Cards Section */}
      <div className="grid md:grid-cols-2 gap-6 w-full max-w-3xl relative mt-3">
        {texts.map((ide, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 px-6 py-2 rounded-2xl shadow-lg flex flex-col items-end transition-transform transform hover:scale-[1.009] border border-blue-700/50 cursor-pointer hover:shadow-xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 1 + index * 0.2 }}
          >
            <div className="w-full grid place-items-center">
            {ide.name === "Python" ? <img src={py} alt="py" /> : ide.name === "SQL" ? <img src={sql} alt="sql" />: null}
            </div>
            <h3 className="w-full text-center text-2xl font-bold text-blue-700">{ide.name}</h3>
            <p className="w-full text-gray-700 text-center mt-3 text-base leading-relaxed">
              {ide.desc}
            </p>
            <div className="h-full py-4">
              <NavLink to={ide.link} className="bg-blue-500 text-white px-10 py-2 rounded-br-2xl">{ide.btnText}</NavLink>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Footer */}
      {/* <footer className="text-gray-700 text-xs text-center border-t border-gray-300 w-full py-3 mt-8">
        © 2025 Ignipulse. Empowering IT education and innovation, one line of code at a time.
      </footer> */}
    </div>
  );
};

export default LandingPage;