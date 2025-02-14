import React from "react";
import { Link } from "react-router-dom";
import Slider from "./Slider";
import { motion } from "framer-motion";
import Footer from "./Footer";

const LandingPage = () => {
  const texts = [
    {
      name: "Python Playground",
      desc: "A robust Python environment designed for seamless coding, debugging, and deployment. Perfect for AI, data science, and automation projects.",
      btnText: "Play",
      link: "/python",
    },
    {
      name: "SQL Playground",
      desc: "Query, visualize, and manage your databases effortlessly. Our SQL IDE provides powerful tools for handling structured data with precision.",
      btnText: "Play",
      link: "/sql",
    },
    // {
    //   name: "JavaScript IDE",
    //   desc: "An advanced JavaScript coding environment with built-in debugging and real-time collaboration.",
    //   btnText: "Launch IDE",
    //   link: "/javascript",
    // },
    // {
    //   name: "C++ IDE",
    //   desc: "Compile and debug C++ applications with our high-performance development tools.",
    //   btnText: "Launch IDE",
    //   link: "/cpp",
    // },
    // {
    //   name: "Java IDE",
    //   desc: "A powerful Java development environment for enterprise-level applications and frameworks.",
    //   btnText: "Launch IDE",
    //   link: "/java",
    // },
  ];

  return (
    <div className="bg-gray-900 h-screen w-full flex flex-col justify-center items-center">
          
      <header className="text-center flex flex-col items-center justify-center w-full lg:h-1/3 md:h-1/3 h-1/2 gap-y-4">
        <motion.h1
          className="lg:text-7xl md:text-5xl text-5xl font-bold text-white"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
        >
          IgniUp
        </motion.h1>
        <motion.p
          className="lg:w-1/4 md:w-1/4 w-full px-4 text-gray-400 text-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5, duration: 1 }}
        >
          Empowering the next generation of innovators through technology and
          hands-on learning.
        </motion.p>
      </header>

      <main className="flex flex-col lg:justify-center md:justify-center justify-start items-center h-full w-full">
        <motion.div
          className="w-full h-full flex flex-col justify-center items-center"
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
