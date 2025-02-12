import React from "react";
import { Link } from "react-router-dom";
import Slider from "./Slider";
import { motion } from "framer-motion";
import Footer from "./Footer";

const LandingPage = () => {
  const texts = [
    {
      name: "Python IDE",
      desc: "A robust Python environment designed for seamless coding, debugging, and deployment. Perfect for AI, data science, and automation projects.",
      btnText: "Launch IDE",
      link: "/python",
    },
    {
      name: "SQL IDE",
      desc: "Query, visualize, and manage your databases effortlessly. Our SQL IDE provides powerful tools for handling structured data with precision.",
      btnText: "Launch IDE",
      link: "/sql",
    },
    {
      name: "JavaScript IDE",
      desc: "An advanced JavaScript coding environment with built-in debugging and real-time collaboration.",
      btnText: "Launch IDE",
      link: "/javascript",
    },
    {
      name: "C++ IDE",
      desc: "Compile and debug C++ applications with our high-performance development tools.",
      btnText: "Launch IDE",
      link: "/cpp",
    },
    {
      name: "Java IDE",
      desc: "A powerful Java development environment for enterprise-level applications and frameworks.",
      btnText: "Launch IDE",
      link: "/java",
    },
  ];

  return (
    <div className="bg-gray-50 min-h-full flex flex-col justify-center items-center px-4 md:px-8">
      <motion.div
        className="absolute inset-0 bg-gradient-to-tr from-yellow-200 via-yellow-400 to-indigo-700 opacity-40 z-10"
        animate={{ opacity: [0.1, 0.2, 0.3] }}
        transition={{
          duration: 5,
          ease: "easeInOut",
          repeat: Infinity,
          repeatType: "reverse",
        }}
      />

        
      <header className="text-center lg:block md:block flex flex-col items-center justify-center py-12 z-10">
        <motion.h1
          className="text-4xl sm:text-5xl font-bold text-indigo-600"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          Ignipulse
        </motion.h1>
        <motion.p
          className="mt-4 lg:text-lg md:text-lg text-xs lg:w-full md:w-full w-1/2 text-gray-600"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Empowering the next generation of innovators through technology and
          hands-on learning.
        </motion.p>
      </header>

      <main className="z-10 flex flex-col justify-center items-center space-y-8 sm:space-y-10 md:space-y-0 md:space-x-6 w-full">
        <motion.div
          className="w-full flex flex-col justify-center items-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1, duration: 1 }}
        >
          <Slider links={texts} />
        </motion.div>
      </main>
      <Footer/>
    </div>
  );
};

export default LandingPage;
