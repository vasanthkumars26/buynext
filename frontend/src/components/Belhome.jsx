// // frontend/src/components/Belhome.jsx
// import React, { useState } from "react";
// import {
//   FaShoppingCart,
//   FaTemperatureHigh,
//   FaWater,
//   FaShoppingBag,
//   FaHeart,
// } from "react-icons/fa";
// import { Link } from "react-router-dom";
// import { motion } from "framer-motion";
// import { useCart } from "../context/Cartcon";
// import Wishlist from "./Wishlist";

// const Belhome = () => {
//   // NOTE: added `cart` to the destructure so we can detect items already added.
//   // No functions were changed.
//   const { addToWishlist, removeFromWishlist, addtoCart, allproducts, wishlist, cart } = useCart();

//   const costumes = [
//     { _id: 1, img: "https://lacozt.myshopify.com/cdn/shop/products/Product10.jpg?v=1597047059", desc: "Structured Fedora Hat", price: 18.47, category: "Caps", btn1: "Wishlist", btn2: "Add to Cart", },
//     { _id: 2, img: "https://lacozt.myshopify.com/cdn/shop/products/Product9.jpg?v=1597046790", desc: "Regular Fit T-Shirt", price: 8.47, category: "T-Shirts", btn1: "Wishlist", btn2: "Add to Cart", },
//     { _id: 3, img: "https://lacozt.myshopify.com/cdn/shop/products/Product11_329e9eaa-7056-4ee4-a8f8-1b6cd01a4ffe.jpg?v=1597047746", desc: "Long Sleeve Sweatshirts", price: 15.47, category: "Hoodies", btn1: "Wishlist", btn2: "Add to Cart", },
//     { _id: 4, img: "https://lacozt.myshopify.com/cdn/shop/products/Product12_90960967-e37e-4f11-ab69-4e876a3704ff.jpg?v=1597047912", desc: "Cotton Adjustable Caps", price: 23.47, category: "Caps", btn1: "Wishlist", btn2: "Add to Cart", },
//   ];

//   const fimage1 = [{ img: "https://lacozt.myshopify.com/cdn/shop/files/section-bgimage1.jpg?v=1614294611", desc: "BigSale up to 30% off", titl: "Shop for great Selection of T-Shirts", btna: "Shop now", }];

//   const fimage = [
//     { img: "https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg", desc: "NEW ARRIVALS", titl: "TOUCH OF COLOR", btna: "Shop now", },
//     { img: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg", desc: "DISCOVER THEM ALL", titl: "THIS SEASON'S BOMBER JACKETS", btna: "Shop now", },
//   ];

//   const imagefooter = [
//     { heading: "Order online & get it today", btn: "Shop now >", },
//     { heading: "BACO 50% off Branded Tees", btn: "Shop now >", },
//     { heading: "20% off on Export Tees", btn: "Shop now >", },
//   ];

//   const imagefooter2 = [
//     { heading: "FREE SHIPPING", subhead: "Gentle or Delicate Washing", icon: <FaWater /> },
//     { heading: "Ironing Temparature", subhead: "Iron at maximum 150C or 300F", icon: <FaTemperatureHigh /> },
//     { heading: "Water Temparature", subhead: "Wash at Below 30C or 80F", icon: <FaWater /> },
//   ];

//   const pow = [
//     { _id: 5, img: "https://lacozt.myshopify.com/cdn/shop/products/Product11_329e9eaa-7056-4ee4-a8f8-1b6cd01a4ffe.jpg?v=1597047746", desc: "Pull Over Hoodie", price: 12.47, category: "Hoodies", btn1: "Wishlist", btn2: "Add to Cart", },
//     { _id: 6, img: "https://diesel.ie/cdn/shop/files/FadiaTeeT25061FF_4_533x.jpg?v=1741710096", desc: "Women's Ribbed T-Shirt", price: 19.37, category: "T-Shirts", btn1: "Wishlist", btn2: "Add to Cart", },
//     { _id: 7, img: "https://cdn11.bigcommerce.com/s-1xod74bove/images/stencil/1280x1280/attribute_rule_images/23931_source_1736466569.jpg", desc: "Men's Pullover Hoodie", price: 13.67, category: "Hoodies", btn1: "Wishlist", btn2: "Add to Cart", },
//     { _id: 8, img: "https://lacozt.myshopify.com/cdn/shop/products/Men_sSweatPulloverHoodie3.jpg?v=1680848440&width=360", desc: "Performance T-Shirt", price: 10.47, category: "T-Shirts", btn1: "Wishlist", btn2: "Add to Cart", },
//   ];

//   const [filter, setFilter] = useState("All");

//   const filtered = filter === "All" ? allproducts : allproducts.filter((item) => item.category === filter);

//   const WishlistButton = ({ product }) => {
//     const isWishlisted = wishlist.find((item) => item._id === product._id);
//     return (
//       <motion.button
//         whileHover={{ scale: 1.03 }}
//         whileTap={{ scale: 0.97 }}
//         onClick={() => (isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product))}
//         className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-shadow focus:outline-none ${isWishlisted ? "bg-red-500 text-white" : "bg-gray-100 text-black  shadow-md"}`}
//       >
//         <FaHeart />
//       </motion.button>
//     );
//   };

//   return (
//     // prevent horizontal overflow at page-level and ensure full-bleed gradient from AppTheme doesn't create scroll
//     <div className="overflow-x-hidden">
//       <div className="mt-6   mx-auto w-full text-white box-border">
//         <header className="text-center mb-4">
//           <h1 className="text-2xl sm:text-3xl text-gray-300 md:text-4xl font-bold">Summer Collection</h1>
//           <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-300 mt-2 text-white/95">Clothes & Accessories</p>
//         </header>

//         <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 text-gray-300">
//           {["All", "Hoodies", "T-Shirts", "Caps"].map((cat) => (
//             <button
//               key={cat}
//               onClick={() => setFilter(cat)}
//               className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm md:text-sm font-medium transition-all ${filter === cat ? "bg-gray-300 text-black shadow-lg" : "bg-white/6 text-white/90 hover:bg-white/10"}`}
//             >
//               {cat}
//             </button>
//           ))}
//         </div>

//         {/* Products grid */}
//         <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
//           {filtered.map((costume) => {
//             const isInCart = Array.isArray(cart) && cart.find((c) => c._id === costume._id);
//             return (
//               <motion.article
//                 key={costume._id}
//                 whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(2,6,23,0.5)" }}
//                 transition={{ type: "spring", stiffness: 200, damping: 18 }}
//                 className="bg-transparent glass-dark rounded-2xl p-3 w-full"
//               >
//                 {/* CLICKABLE: image + title open product details route (passes product in state). This does NOT change add-to-cart/wishlist behaviour */}
//                 <Link to={`/product/${costume._id}`} state={{ product: costume }} className="block">
//                   <div className="w-full aspect-[1/1] overflow-hidden rounded-xl">
//                     <img
//                       src={costume.img}
//                       alt={costume.desc}
//                       className="w-full h-full object-cover block max-w-full"
//                     />
//                   </div>

//                   <h2 className="mt-3 font-semibold text-white/100 text-sm sm:text-base text-start">{costume.desc}</h2>
//                 </Link>

//                 <p className="text-gray-300 font-bold mt-1 text-sm sm:text-base text-start">${costume.price}</p>

//                 <div className="flex gap-2 sm:gap-3 mt-3">
//                   <WishlistButton product={costume} />
//                   <motion.button
//                     whileHover={{ scale: isInCart ? 1 : 1.03 }}
//                     whileTap={{ scale: 0.97 }}
//                     onClick={() => { if (!isInCart) addtoCart(costume); }}
//                     className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm font-medium ${isInCart ? "bg-green-500 text-white cursor-default" : "bg-white/6 text-white/90 border border-white/8 hover:shadow-md"}`}
//                     aria-pressed={!!isInCart}
//                   >
//                     {isInCart ? "Added" : "Add to Cart"} <FaShoppingCart />
//                   </motion.button>
//                 </div>
//               </motion.article>
//             );
//           })}
//         </section>

//         {/* Featured banner */}
//         {fimage1.map((img, index) => (
//           <div key={index} className="relative mt-10 rounded-2xl overflow-hidden w-full">
//             <img src={img.img} alt="fimage" className="w-full h-40 sm:h-48 md:h-64 object-cover block max-w-full" />
//             <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-12 bg-gradient-to-r from-black/35 to-black/10">
//               <p className="text-sm md:text-lg font-semibold text-gray-300">{img.desc}</p>
//               <p className="text-base sm:text-lg md:text-2xl font-bold text-white mt-2">{img.titl}</p>
//               <Link to="/" className="mt-4 inline-block px-3 py-2 rounded-2xl bg-gray-300 text-gray-900 font-semibold text-xs sm:text-sm">
//                 {img.btna}
//               </Link>
//             </div>
//           </div>
//         ))}

//         {/* Image footer (three promotions) */}
//         <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
//           {imagefooter.map((item, index) => (
//             <div key={index} className="glass-dark rounded-xl p-4 flex flex-col items-start">
//               <h3 className="text-gray-300 font-semibold text-base sm:text-lg md:text-xl">{item.heading}</h3>
//               <button className="mt-2 text-red-600 text-sm sm:text-base">{item.btn}</button>
//             </div>
//           ))}
//         </div>

//         {/* Top View in This Week */}
//         <section className="mt-10">
//           <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Top View in This Week</h2>
//           <p className="text-base sm:text-lg md:text-xl font-bold mt-2">Product of the Week</p>

//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
//             {costumes.map((costume) => {
//               const isInCart = Array.isArray(cart) && cart.find((c) => c._id === costume._id);
//               return (
//                 <motion.article
//                   key={costume._id}
//                   whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(2,6,23,0.5)" }}
//                   transition={{ type: "spring", stiffness: 200, damping: 18 }}
//                   className="bg-transparent glass-dark rounded-2xl p-3 w-full"
//                 >
//                   {/* CLICKABLE: image + title open product details route */}
//                   <Link to={`/product/${costume._id}`} state={{ product: costume }} className="block">
//                     <div className="w-full aspect-[1/1] overflow-hidden rounded-xl">
//                       <img src={costume.img} alt={costume.desc} className="w-full h-full object-cover block max-w-full" />
//                     </div>
//                     <h2 className="mt-3 font-semibold text-white/100 text-sm sm:text-base text-start">{costume.desc}</h2>
//                   </Link>

//                   <p className="text-gray-300 font-bold mt-1 text-sm sm:text-base text-start">${costume.price}</p>
//                   <div className="flex gap-2 sm:gap-3 mt-3">
//                     <WishlistButton product={costume} />
//                     <motion.button
//                       whileHover={{ scale: isInCart ? 1 : 1.03 }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={() => { if (!isInCart) addtoCart(costume); }}
//                       className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm font-medium ${isInCart ? "bg-green-500 text-white cursor-default" : "bg-white/6 text-white/90 border border-white/8 hover:shadow-md"}`}
//                       aria-pressed={!!isInCart}
//                     >
//                       {isInCart ? "Added" : "Add to Cart"} <FaShoppingCart />
//                     </motion.button>
//                   </div>
//                 </motion.article>
//               );
//             })}
//           </div>

//           {/* More products (pow) */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
//             {pow.map((costume) => {
//               const isInCart = Array.isArray(cart) && cart.find((c) => c._id === costume._id);
//               return (
//                 <motion.article
//                   key={costume._id}
//                   whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(2,6,23,0.5)" }}
//                   transition={{ type: "spring", stiffness: 200, damping: 18 }}
//                   className="bg-transparent glass-dark rounded-2xl p-3 w-full"
//                 >
//                   {/* CLICKABLE: image + title open product details route */}
//                   <Link to={`/product/${costume._id}`} state={{ product: costume }} className="block">
//                     <div className="w-full aspect-[1/1] overflow-hidden rounded-xl">
//                       <img src={costume.img} alt={costume.desc} className="w-full h-full object-cover block max-w-full" />
//                     </div>
//                     <h2 className="mt-3 font-semibold text-white/100 text-sm sm:text-base text-start">{costume.desc}</h2>
//                   </Link>

//                   <p className="text-gray-300 font-bold mt-1 text-sm sm:text-base text-start">${costume.price}</p>
//                   <div className="flex gap-2 sm:gap-3 mt-3">
//                     <WishlistButton product={costume} />
//                     <motion.button
//                       whileHover={{ scale: isInCart ? 1 : 1.03 }}
//                       whileTap={{ scale: 0.97 }}
//                       onClick={() => { if (!isInCart) addtoCart(costume); }}
//                       className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm font-medium ${isInCart ? "bg-green-500 text-white cursor-default" : "bg-white/6 text-white/90 border border-white/8 hover:shadow-md"}`}
//                       aria-pressed={!!isInCart}
//                     >
//                       {isInCart ? "Added" : "Add to Cart"} <FaShoppingCart />
//                     </motion.button>
//                   </div>
//                 </motion.article>
//               );
//             })}
//           </div>

//           {/* Two large feature images */}
//           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-start">
//             {fimage.map((img, index) => (
//               <div key={index} className="relative rounded-2xl overflow-hidden w-full">
//                 <img src={img.img} alt="fimage" className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover block max-w-full" />
//                 <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-12 bg-gradient-to-r from-black/35 to-transparent">
//                   <p className="text-white font-bold text-sm sm:text-base md:text-lg">{img.desc}</p>
//                   <p className="text-white text-lg sm:text-2xl md:text-3xl font-bold mt-2">{img.titl}</p>
//                   <Link to="/" className="mt-4 inline-block px-3 py-2 rounded-2xl bg-gray-300 text-gray-900 font-semibold text-xs sm:text-sm">
//                     {img.btna}
//                   </Link>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* bottom icons/footer info */}
//           <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-start">
//             {imagefooter2.map((item, index) => (
//               <div key={index} className="glass-dark rounded-xl p-4 flex gap-4 items-center">
//                 <p className="text-red-600 text-2xl">{item.icon}</p>
//                 <div>
//                   <h1 className="text-white/95 font-semibold md:text-lg">{item.heading}</h1>
//                   <p className="text-white/80 text-sm md:text-base">{item.subhead}</p>
//                 </div>
//               </div>
//             ))}
//           </div>
//         </section>

//         {/* inline styles for glass effect (keeps consistent with AppTheme) */}
//         <style>{`
//           /* darker glass for contrast, prevents the blue background from making text hard to read */
//           .glass-dark { background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(6px); }
//           .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(6px); }
//           /* ensure no elements can cause horizontal scroll */
//           :root, body, #root { overflow-x: hidden; }
//         `}</style>
//       </div>
//     </div>
//   );
// };

// export default Belhome;


// frontend/src/components/Belhome.jsx
import React, { useState } from "react";
import {
  FaShoppingCart,
  FaTemperatureHigh,
  FaWater,
  FaShoppingBag,
  FaHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/Cartcon";
import Wishlist from "./Wishlist";

const Belhome = () => {
  // NOTE: added safe defaults for arrays so .map/.filter won't crash if context is still loading
  const {
    addToWishlist,
    removeFromWishlist,
    addtoCart,
    allproducts = [],
    wishlist = [],
    cart = [],
  } = useCart();

  const costumes = [
    { _id: 1, img: "https://lacozt.myshopify.com/cdn/shop/products/Product10.jpg?v=1597047059", desc: "Structured Fedora Hat", price: 18.47, category: "Caps", btn1: "Wishlist", btn2: "Add to Cart", },
    { _id: 2, img: "https://lacozt.myshopify.com/cdn/shop/products/Product9.jpg?v=1597046790", desc: "Regular Fit T-Shirt", price: 8.47, category: "T-Shirts", btn1: "Wishlist", btn2: "Add to Cart", },
    { _id: 3, img: "https://lacozt.myshopify.com/cdn/shop/products/Product11_329e9eaa-7056-4ee4-a8f8-1b6cd01a4ffe.jpg?v=1597047746", desc: "Long Sleeve Sweatshirts", price: 15.47, category: "Hoodies", btn1: "Wishlist", btn2: "Add to Cart", },
    { _id: 4, img: "https://lacozt.myshopify.com/cdn/shop/products/Product12_90960967-e37e-4f11-ab69-4e876a3704ff.jpg?v=1597047912", desc: "Cotton Adjustable Caps", price: 23.47, category: "Caps", btn1: "Wishlist", btn2: "Add to Cart", },
  ];

  const fimage1 = [{ img: "https://lacozt.myshopify.com/cdn/shop/files/section-bgimage1.jpg?v=1614294611", desc: "BigSale up to 30% off", titl: "Shop for great Selection of T-Shirts", btna: "Shop now", }];

  const fimage = [
    { img: "https://images.pexels.com/photos/102129/pexels-photo-102129.jpeg", desc: "NEW ARRIVALS", titl: "TOUCH OF COLOR", btna: "Shop now", },
    { img: "https://images.pexels.com/photos/325876/pexels-photo-325876.jpeg", desc: "DISCOVER THEM ALL", titl: "THIS SEASON'S BOMBER JACKETS", btna: "Shop now", },
  ];

  const imagefooter = [
    { heading: "Order online & get it today", btn: "Shop now >", },
    { heading: "BACO 50% off Branded Tees", btn: "Shop now >", },
    { heading: "20% off on Export Tees", btn: "Shop now >", },
  ];

  const imagefooter2 = [
    { heading: "FREE SHIPPING", subhead: "Gentle or Delicate Washing", icon: <FaWater /> },
    { heading: "Ironing Temparature", subhead: "Iron at maximum 150C or 300F", icon: <FaTemperatureHigh /> },
    { heading: "Water Temparature", subhead: "Wash at Below 30C or 80F", icon: <FaWater /> },
  ];

  const pow = [
    { _id: 5, img: "https://lacozt.myshopify.com/cdn/shop/products/Product11_329e9eaa-7056-4ee4-a8f8-1b6cd01a4ffe.jpg?v=1597047746", desc: "Pull Over Hoodie", price: 12.47, category: "Hoodies", btn1: "Wishlist", btn2: "Add to Cart", },
    { _id: 6, img: "https://diesel.ie/cdn/shop/files/FadiaTeeT25061FF_4_533x.jpg?v=1741710096", desc: "Women's Ribbed T-Shirt", price: 19.37, category: "T-Shirts", btn1: "Wishlist", btn2: "Add to Cart", },
    { _id: 7, img: "https://cdn11.bigcommerce.com/s-1xod74bove/images/stencil/1280x1280/attribute_rule_images/23931_source_1736466569.jpg", desc: "Men's Pullover Hoodie", price: 13.67, category: "Hoodies", btn1: "Wishlist", btn2: "Add to Cart", },
    { _id: 8, img: "https://lacozt.myshopify.com/cdn/shop/products/Men_sSweatPulloverHoodie3.jpg?v=1680848440&width=360", desc: "Performance T-Shirt", price: 10.47, category: "T-Shirts", btn1: "Wishlist", btn2: "Add to Cart", },
  ];

  const [filter, setFilter] = useState("All");

  // guard allproducts in case it's not yet loaded
  const safeAllProducts = Array.isArray(allproducts) ? allproducts : [];
  const filtered = filter === "All" ? safeAllProducts : safeAllProducts.filter((item) => item.category === filter);

  const WishlistButton = ({ product }) => {
    const isWishlisted = Array.isArray(wishlist) && wishlist.find((item) => item._id === product._id);
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => (isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product))}
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-shadow focus:outline-none ${isWishlisted ? "bg-red-500 text-white" : "bg-gray-100 text-black  shadow-md"}`}
      >
        <FaHeart />
      </motion.button>
    );
  };

  return (
    // prevent horizontal overflow at page-level and ensure full-bleed gradient from AppTheme doesn't create scroll
    <div className="overflow-x-hidden">
      <div className="mt-6   mx-auto w-full text-white box-border">
        <header className="text-center mb-4">
          <h1 className="text-2xl sm:text-3xl text-gray-300 md:text-4xl font-bold">Summer Collection</h1>
          <p className="text-base sm:text-lg md:text-xl font-semibold text-gray-300 mt-2 text-white/95">Clothes & Accessories</p>
        </header>

        <div className="flex flex-wrap justify-center gap-3 sm:gap-6 mb-6 text-gray-300">
          {["All", "Hoodies", "T-Shirts", "Caps"].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilter(cat)}
              className={`px-3 sm:px-4 py-2 rounded-full text-xs sm:text-sm md:text-sm font-medium transition-all ${filter === cat ? "bg-gray-300 text-black shadow-lg" : "bg-white/6 text-white/90 hover:bg-white/10"}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Products grid */} 
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((costume) => {
            const isInCart = Array.isArray(cart) && cart.find((c) => c._id === costume._id);
            return (
              <motion.article
                key={costume._id}
                whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(2,6,23,0.5)" }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="bg-transparent glass-dark rounded-2xl p-3 w-full"
              >
                {/* CLICKABLE: image + title open product details route (passes product in state). This does NOT change add-to-cart/wishlist behaviour */}
                <Link to={`/product/${costume._id}`} state={{ product: costume }} className="block">
                  <div className="w-full aspect-[1/1] overflow-hidden rounded-xl">
                    <img
                      src={costume.img}
                      alt={costume.desc}
                      className="w-full h-full object-cover block max-w-full"
                    />
                  </div>

                  <h2 className="mt-3 font-semibold text-white/100 text-sm sm:text-base text-start">{costume.desc}</h2>
                </Link>

                <p className="text-gray-300 font-bold mt-1 text-sm sm:text-base text-start">${costume.price}</p>

                <div className="flex gap-2 sm:gap-3 mt-3">
                  <WishlistButton product={costume} />
                  <motion.button
                    whileHover={{ scale: isInCart ? 1 : 1.03 }}
                    whileTap={{ scale: 0.97 }}
                    onClick={() => { if (!isInCart) addtoCart(costume); }}
                    className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm font-medium ${isInCart ? "bg-green-500 text-white cursor-default" : "bg-white/6 text-white/90 border border-white/8 hover:shadow-md"}`}
                    aria-pressed={!!isInCart}
                  >
                    {isInCart ? "Added" : "Add to Cart"} <FaShoppingCart />
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </section>

        {/* Featured banner */} 
        {fimage1.map((img, index) => (
          <div key={index} className="relative mt-10 rounded-2xl overflow-hidden w-full">
            <img src={img.img} alt="fimage" className="w-full h-40 sm:h-48 md:h-64 object-cover block max-w-full" />
            <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-12 bg-gradient-to-r from-black/35 to-black/10">
              <p className="text-sm md:text-lg font-semibold text-gray-300">{img.desc}</p>
              <p className="text-base sm:text-lg md:text-2xl font-bold text-white mt-2">{img.titl}</p>
              <Link to="/" className="mt-4 inline-block px-3 py-2 rounded-2xl bg-gray-300 text-gray-900 font-semibold text-xs sm:text-sm">
                {img.btna}
              </Link>
            </div>
          </div>
        ))}

        {/* Image footer (three promotions) */} 
        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {imagefooter.map((item, index) => (
            <div key={index} className="glass-dark rounded-xl p-4 flex flex-col items-start">
              <h3 className="text-gray-300 font-semibold text-base sm:text-lg md:text-xl">{item.heading}</h3>
              <button className="mt-2 text-red-600 text-sm sm:text-base">{item.btn}</button>
            </div>
          ))}
        </div>

        {/* Top View in This Week */} 
        <section className="mt-10">
          <h2 className="text-lg sm:text-xl md:text-2xl font-semibold">Top View in This Week</h2>
          <p className="text-base sm:text-lg md:text-xl font-bold mt-2">Product of the Week</p>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
            {costumes.map((costume) => {
              const isInCart = Array.isArray(cart) && cart.find((c) => c._id === costume._id);
              return (
                <motion.article
                  key={costume._id}
                  whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(2,6,23,0.5)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="bg-transparent glass-dark rounded-2xl p-3 w-full"
                >
                  {/* CLICKABLE: image + title open product details route */} 
                  <Link to={`/product/${costume._id}`} state={{ product: costume }} className="block">
                    <div className="w-full aspect-[1/1] overflow-hidden rounded-xl">
                      <img src={costume.img} alt={costume.desc} className="w-full h-full object-cover block max-w-full" />
                    </div>
                    <h2 className="mt-3 font-semibold text-white/100 text-sm sm:text-base text-start">{costume.desc}</h2>
                  </Link>

                  <p className="text-gray-300 font-bold mt-1 text-sm sm:text-base text-start">${costume.price}</p>
                  <div className="flex gap-2 sm:gap-3 mt-3">
                    <WishlistButton product={costume} />
                    <motion.button
                      whileHover={{ scale: isInCart ? 1 : 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { if (!isInCart) addtoCart(costume); }}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm font-medium ${isInCart ? "bg-green-500 text-white cursor-default" : "bg-white/6 text-white/90 border border-white/8 hover:shadow-md"}`}
                      aria-pressed={!!isInCart}
                    >
                      {isInCart ? "Added" : "Add to Cart"} <FaShoppingCart />
                    </motion.button>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* More products (pow) */} 
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 mt-4">
            {pow.map((costume) => {
              const isInCart = Array.isArray(cart) && cart.find((c) => c._id === costume._id);
              return (
                <motion.article
                  key={costume._id}
                  whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(2,6,23,0.5)" }}
                  transition={{ type: "spring", stiffness: 200, damping: 18 }}
                  className="bg-transparent glass-dark rounded-2xl p-3 w-full"
                >
                  {/* CLICKABLE: image + title open product details route */} 
                  <Link to={`/product/${costume._id}`} state={{ product: costume }} className="block">
                    <div className="w-full aspect-[1/1] overflow-hidden rounded-xl">
                      <img src={costume.img} alt={costume.desc} className="w-full h-full object-cover block max-w-full" />
                    </div>
                    <h2 className="mt-3 font-semibold text-white/100 text-sm sm:text-base text-start">{costume.desc}</h2>
                  </Link>

                  <p className="text-gray-300 font-bold mt-1 text-sm sm:text-base text-start">${costume.price}</p>
                  <div className="flex gap-2 sm:gap-3 mt-3">
                    <WishlistButton product={costume} />
                    <motion.button
                      whileHover={{ scale: isInCart ? 1 : 1.03 }}
                      whileTap={{ scale: 0.97 }}
                      onClick={() => { if (!isInCart) addtoCart(costume); }}
                      className={`flex items-center gap-2 px-2 sm:px-3 py-2 rounded-2xl text-xs sm:text-sm font-medium ${isInCart ? "bg-green-500 text-white cursor-default" : "bg-white/6 text-white/90 border border-white/8 hover:shadow-md"}`}
                      aria-pressed={!!isInCart}
                    >
                      {isInCart ? "Added" : "Add to Cart"} <FaShoppingCart />
                    </motion.button>
                  </div>
                </motion.article>
              );
            })}
          </div>

          {/* Two large feature images */} 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8 text-start">
            {fimage.map((img, index) => (
              <div key={index} className="relative rounded-2xl overflow-hidden w-full">
                <img src={img.img} alt="fimage" className="w-full h-48 sm:h-64 md:h-72 lg:h-80 object-cover block max-w-full" />
                <div className="absolute inset-0 flex flex-col justify-center items-start p-4 sm:p-6 md:p-12 bg-gradient-to-r from-black/35 to-transparent">
                  <p className="text-white font-bold text-sm sm:text-base md:text-lg">{img.desc}</p>
                  <p className="text-white text-lg sm:text-2xl md:text-3xl font-bold mt-2">{img.titl}</p>
                  <Link to="/" className="mt-4 inline-block px-3 py-2 rounded-2xl bg-gray-300 text-gray-900 font-semibold text-xs sm:text-sm">
                    {img.btna}
                  </Link>
                </div>
              </div>
            ))}
          </div>

          {/* bottom icons/footer info */} 
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 mt-8 text-start">
            {imagefooter2.map((item, index) => (
              <div key={index} className="glass-dark rounded-xl p-4 flex gap-4 items-center">
                <p className="text-red-600 text-2xl">{item.icon}</p>
                <div>
                  <h1 className="text-white/95 font-semibold md:text-lg">{item.heading}</h1>
                  <p className="text-white/80 text-sm md:text-base">{item.subhead}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* inline styles for glass effect (keeps consistent with AppTheme) */} 
        <style>{`
          /* darker glass for contrast, prevents the blue background from making text hard to read */
          .glass-dark { background: rgba(0,0,0,0.35); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(6px); }
          .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(6px); }
          /* ensure no elements can cause horizontal scroll */
          :root, body, #root { overflow-x: hidden; }
        `}</style>
      </div>
    </div>
  );
};

export default Belhome;
