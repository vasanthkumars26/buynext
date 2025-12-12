// frontend/src/components/Home.jsx
import React, { useState, useEffect } from "react";
import { FaClock, FaMoneyBillWave, FaRocket } from "react-icons/fa";
import { motion } from "framer-motion";
import Belhome from "./Belhome";
import AppTheme, { GlassCard, CTAButton, AccentText } from "../common/Apptheme";
import NewArrivals from "../common/NewArrivals";


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
      nextSlide(); // Autoplay forward
    }, 3000);
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    
    <div className="w-full  mx-auto ">
      {/* hero area */}
      <div className="relative mt-[40%] md:mt-[10%]">
        <img
          src={images[current]}
          alt="carousel"
          className="w-full h-[300px] sm:h-[380px] md:h-[480px] lg:h-[620px] object-cover rounded-xl shadow-2xl transition-all duration-700"
        />

        {/* Overlay content (glass card) with stronger contrast */}
        <motion.div
          key={current}
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 18 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className={`absolute top-8 sm:top-12 md:top-16 lg:top-20
            ${current === 0 || current === images.length - 1 ? "right-4 sm:right-8 md:right-12 lg:right-16 text-right" : "left-4 sm:left-8 md:left-12 lg:left-16 text-left"}
            bg-black/50 glass-strong border border-white/12 rounded-2xl p-5 md:p-8 max-w-xs sm:max-w-sm md:max-w-md`}
        >
          <p className="text-sm sm:text-lg md:text-2xl lg:text-3xl font-bold text-white drop-shadow-lg">
            {desc[current].stitle}
          </p>
          <h1 className="mt-2 sm:mt-3 text-sm sm:text-lg md:text-xl lg:text-2xl font-semibold text-white drop-shadow-lg">
            {desc[current].title}
          </h1>

          <div className="flex flex-row sm:flex-row gap-2 sm:gap-4 mt-4 sm:mt-6 justify-end">
            <button className="px-3 py-2 rounded-xl text-sm sm:text-base font-semibold bg-black text-gray-300 shadow hover:-translate-y-0.5 transition-transform">
              {desc[current].btn1}
            </button>
            <button className="px-3 py-2 rounded-xl text-sm sm:text-base font-semibold bg-white/8 text-white/95 border border-white/12 shadow hover:-translate-y-0.5 transition-transform">
              {desc[current].btn2}
            </button>
          </div>
        </motion.div>

        {/* Left / Right arrow controls for accessibility */}
        <button
          onClick={prevSlide}
          aria-label="previous"
          className="hidden md:flex items-center justify-center absolute left-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/8 hover:scale-105 transition"
        >
          ‹
        </button>
        <button
          onClick={nextSlide}
          aria-label="next"
          className="hidden md:flex items-center justify-center absolute right-4 top-1/2 transform -translate-y-1/2 w-10 h-10 rounded-full glass border border-white/8 hover:scale-105 transition"
        >
          ›
        </button>
      </div>

      {/* Dots */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, idx) => (
          <button
            key={idx}
            aria-label={`go to slide ${idx + 1}`}
            className={`w-3 h-3 rounded-full transition-colors focus:outline-none ${idx === current ? "bg-red-700" : "bg-white/30"}`}
            onClick={() => setCurrent(idx)}
          />
        ))}
      </div>

      {/* Footer cards */}
      <div className="
  grid 
  grid-cols-1 
  xs:grid-cols-1 
  sm:grid-cols-2 
  md:grid-cols-3 
  lg:grid-cols-4 
  xl:grid-cols-4 
  gap-4 
  mt-8 
  px-2
">
  {imagefooter.map((item, idx) => (
    <div
      key={idx}
      className="
        flex 
        items-center 
        gap-4 
        p-4 
        rounded-xl 
        glass 
        border 
        border-white/8 
        shadow-sm
      "
    >
      <div className="text-3xl  text-red-700">
        {item.icon}
      </div>

      <div>
        <h2 className="text-base sm:text-lg md:text-xl font-bold text-gray-300">
          {item.heading}
        </h2>
        <p className="text-xs sm:text-sm md:text-base text-gray-300">
          {item.subhead}
        </p>
      </div>
    </div>
  ))}
</div>


      {/* Belhome component (keeps same) */}
      <div className="mt-8">
        <Belhome />
      </div>
          <div><NewArrivals limit={6} /></div>
      {/* Small inline glass styles for immediate consistency */}
      <style>{`
        .glass { background: rgba(255,255,255,0.04); backdrop-filter: blur(6px); }
        .glass-strong { background: rgba(0,0,0,0.45); backdrop-filter: blur(8px); border-radius: 1rem; }
      `}</style>
    </div>
  );
};

export default Home;
