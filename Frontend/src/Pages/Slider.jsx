import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Slider = ({ links }) => {
  
  return (
    <div className="relative w-full overflow-hidden px-8">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {links.map((link, index) => (
          <motion.div
            key={index}
            className="w-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5, delay: index * 0.2 }}
          >
            <div className="shadow-lg flex flex-col items-end rounded-lg p-6 h-full bg-black/90">
              <h2 className="text-xl w-full sm:text-2xl font-semibold text-white">
                {link.name}
              </h2>
              <p className="h-2/2 text-gray-400 text-sm sm:text-base">
                {link.desc}
              </p>
              <Link
                to={link.link}
                className=" bg-indigo-600 text-white px-6 py-2 rounded-full hover:bg-indigo-700 transition"
              >
                Launch IDE
              </Link>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Slider;
