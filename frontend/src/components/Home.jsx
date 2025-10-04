import React, { useState,useEffect } from "react";
import { FaArrowLeft, FaArrowRight, FaClock, FaDollarSign, FaMoneyBill, FaMoneyBillWave, FaRocket, FaTemperatureHigh, FaTimes, FaWater } from "react-icons/fa";
import {motion} from 'framer-motion'
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

const imagefooter = [{
    heading:"FREE SHIPPING",
    subhead:"Design On Order Over $99",
    icon:<FaRocket/>
},{
    heading:"ORDER ONLINE",
    subhead:"Easy 24/7 Online Ordering",
    icon:<FaClock/>
},{
    heading:"SHOP AND SAVE",
    subhead:"For all special and Heart",
    icon:<FaMoneyBillWave/>

},{
    heading:"SHOP AND SAVE",
    subhead:"For all special and Heart",
    icon:<FaMoneyBillWave/>
}
]


  const [current, setCurrent] = useState(0);

  const prevSlide = () => {
    setCurrent((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const nextSlide = () => {
    setCurrent((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

   useEffect(() => {
    const interval = setInterval(()=>{
        prevSlide()
    },3000)
    return () => clearInterval(interval); // cleanup on unmount
  }, []);

  return (
    <div className="relative w-full max-w-7xl mx-auto mt-10">
      {/* Image */}
      <img
        src={images[current]}
        alt="carousel"
        className="mt-40 w-full h-[100%] object-cover rounded-lg shadow-lg transition-all duration-500"
      />

        
      <div className="" >
       <motion.div className="absolute top-8 sm:top-10 left-56 md:top-42 md:left-96 lg:top-52 bg-gradient-to-r from-green-600 to-black bg-clip-text text-transparent ml-20 " 
        key={current} // important for re-triggering animation when slide changes
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: -30 }}
        exit={{ opacity: 0, x:-50 }}
        transition={{ duration: 0.8, ease: "easeInOut" }}
        
      > <p className=" font-bold md:text-3xl lg:text-5xl" >{desc[current].stitle}</p>
        <h1 className=" md:text-xl font-semibold mt-5" >{desc[current].title}</h1>
        <div className="flex justify-center gap-3 mt-10">
            <button className=" md:text-xl bg-gradient-to-r from-purple-900 to-green-900 border p-2  text-gray-300 hover:-translate-y-0.5" >{desc[current].btn1}</button>
            <button className="md:text-xl bg-gradient-to-r from-green-900 to-purple-900   text-gray-300 hover:-translate-y-0.5 border p-2">{desc[current].btn2}</button>
        </div></motion.div>
      </div>

      {/* Left Arrow */}
      <button
        onClick={prevSlide}
        className="absolute md:top-1/5 left-5 -translate-y-28  transform  lg:-translate-y-1/5 bg-gray-800 text-white p-3 rounded-full hover:bg-gray-600"
      >
        <FaArrowLeft />
      </button>

      {/* Right Arrow */}
      <button
        onClick={nextSlide}
        className="absolute md:top-1/5 right-5 -translate-y-28 transform  lg:-translate-y-1/5 text-sm bg-gray-800 text-white p-3 rounded-full hover:bg-gray-600"
      >
        <FaArrowRight />
      </button>

      {/* Dots Indicator */}
      <div className="flex justify-center mt-4 space-x-2">
        {images.map((_, idx) => (
          <span
            key={idx}
            className={`w-3 h-3 rounded-full cursor-pointer ${
              idx === current ? "bg-green-700" : "bg-gray-300"
            }`}
            onClick={() => setCurrent(idx)}
          ></span>
        ))}
      </div>
      <div className="ml-10 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4" >
        {imagefooter.map((item,idx)=>(
            <div key={idx} className="flex">
           <div className="bg-gradient-to-r from-green-600 to-gray-600 w-[90%]  m-2 p-3 px-5 py-6 items-center flex gap-6"> <h1 className="text-xl" >{item.icon}</h1>
           <div><h1 className="text-xl md:text-2xl font-bold ">{item.heading}</h1>
            <h1>{item.subhead}</h1></div></div> </div> 
        ))}</div>
       <Belhome/>
    </div>
  );
};

export default Home;
