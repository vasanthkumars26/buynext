import React, { useState, useEffect } from "react";
import {
  FaClock,
  FaMoneyBillWave,
  FaRocket,
} from "react-icons/fa";
import { motion } from "framer-motion";
import Belhome from "./Belhome";

const Home = () => {
  const images = [
    "https://lacozt.myshopify.com/cdn/shop/files/slider1.jpg?v=1614294035",
    "https://lacozt.myshopify.com/cdn/shop/files/slider2.jpg?v=1614294052",
    "https://lacozt.myshopify.com/cdn/shop/files/slider3.jpg?v=1614294052",
  ];

  const desc = [
    {
      stitle: "Revealing the summer",
      title: "Fabrics That Matches Your Personality",
      btn1: "Shop now",
      btn2: "Read More",
    },
    {
      stitle: "Inspire with Style",
      title: "Trendy Outfits For Every Occasion",
      btn1: "Explore",
      btn2: "Discover",
    },
    {
      stitle: "Hot Deals",
      title: "Get Up To 50% Off On Selected Items",
      btn1: "Grab Now",
      btn2: "Details",
    },
  ];

  const imagefooter = [
    {
      heading: "FREE SHIPPING",
      subhead: "Design On Order Over $99",
      icon: <FaRocket />,
    },
    {
      heading: "ORDER ONLINE",
      subhead: "Easy 24/7 Online Ordering",
      icon: <FaClock />,
    },
    {
      heading: "SHOP AND SAVE",
      subhead: "For all special and Heart",
      icon: <FaMoneyBillWave />,
    },
    {
      heading: "SHOP AND SAVE",
      subhead: "For all special and Heart",
      icon: <FaMoneyBillWave />,
    },
  ];

  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      nextSlide(); // Autoplay forward instead of backward
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-[40%] md:mt-[10%] px-2 sm:px-6">
      
      <img
        src={images[current]}
        alt="carousel"
        className="w-full h-[300px] sm:h-[400px] md:h-[500px] lg:h-[600px] object-cover rounded-lg shadow-lg transition-all duration-500"
      />

      
     <motion.div
  className={`absolute top-16 sm:top-24 md:top-32 lg:top-40 
    ${current === 0 || current === images.length - 1 ? "right-4 sm:right-8 md:right-16 lg:right-24 text-right" : "left-4 sm:left-8 md:left-16 lg:left-24 text-left"} 
    bg-clip-text text-transparent bg-gradient-to-r from-green-600 to-black`}
  key={current}
  initial={{ opacity: 0, x: 50 }}
  animate={{ opacity: 1, x: 0 }}
  exit={{ opacity: 0, x: -50 }}
  transition={{ duration: 0.8, ease: "easeInOut" }}
>
  <p className="text-sm sm:text-lg md:text-3xl lg:text-5xl font-bold">
    {desc[current].stitle}
  </p>
  <h1 className="mt-2 sm:mt-4 text-xs sm:text-base md:text-xl lg:text-2xl font-semibold">
    {desc[current].title}
  </h1>
  <div className="flex flex-col sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6 justify-end">
    <button className="bg-gradient-to-r from-purple-900 to-green-900 text-gray-300 border p-2 text-xs sm:text-sm md:text-lg hover:-translate-y-0.5 transition-transform rounded">
      {desc[current].btn1}
    </button>
    <button className="bg-gradient-to-r from-green-900 to-purple-900 text-gray-300 border p-2 text-xs sm:text-sm md:text-lg hover:-translate-y-0.5 transition-transform rounded">
      {desc[current].btn2}
    </button>
  </div>
</motion.div>


      {/* Navigation Arrows */}
      {/* <button
        onClick={prevSlide}
        className="absolute top-1/2 left-2 sm:left-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-600 transition"
      >
        <FaArrowLeft />
      </button>

      <button
        onClick={nextSlide}
        className="absolute top-1/2 right-2 sm:right-4 transform -translate-y-1/2 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-600 transition"
      >
        <FaArrowRight />
      </button> */}

      {/* Carousel Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer transition-colors ${
              idx === current ? "bg-green-700" : "bg-gray-300"
            }`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>

      {/* Footer Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4 mt-8 px-2">
        {imagefooter.map((item, idx) => (
          <div
            key={idx}
            className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-600 to-gray-600 rounded-lg shadow-md"
          >
            <div className="text-3xl sm:text-4xl">{item.icon}</div>
            <div>
              <h2 className="text-lg sm:text-xl font-bold">{item.heading}</h2>
              <p className="text-sm sm:text-base">{item.subhead}</p>
            </div>
          </div>
        ))}
      </div>

      <Belhome />
    </div>
  );
};

export default Home;
