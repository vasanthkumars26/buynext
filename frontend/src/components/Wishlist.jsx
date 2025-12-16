// frontend/src/components/Wishlist.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/Cartcon";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";
import AppTheme, { GlassCard, CTAButton, AccentText } from "../common/Apptheme";

const Wishlist = () => {
  const { wishlist = [], removeFromWishlist, addtoCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!wishlist || wishlist.length === 0) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="min-h-[60vh] flex items-center justify-center px-4"
      >
        <h2 className="text-center mt-8 md:mt-0 text-xl md:text-2xl font-semibold text-black">
          No products in your Wishlist
        </h2>
      </motion.div>
    );
  }

  const moveToCart = (item) => {
    addtoCart(item);
    removeFromWishlist(item._id);
  };

  return (
    <motion.div
      className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 mt-[7%]"
      initial={{ opacity: 0, y: 40 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6, ease: "easeOut" }}
    >
      <motion.h1
        className="text-3xl font-extrabold mb-6 text-black"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
      >
        Your Wishlist
      </motion.h1>

      <motion.div
        className="space-y-6"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 }
          }
        }}
      >
        {wishlist.map((item) => (
          <motion.div
            key={item._id}
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-4 rounded-2xl glass border border-white/8 shadow-sm"
          >
            {/* LEFT: clickable product */}
            <Link
              to={`/product/${item._id}`}
              state={{ product: item }}
              className="flex items-start sm:items-center gap-4 w-full sm:w-auto no-underline"
            >
              <div className="w-28 h-28 flex-shrink-0 rounded-xl overflow-hidden bg-white/4">
                <img
                  src={item.img}
                  alt={item.desc}
                  className="w-full h-full object-cover transform transition-transform duration-500 hover:scale-105"
                />
              </div>

              <div className="flex-1 min-w-0 text-start">
                <h2 className="font-semibold text-lg text-black truncate">
                  {item.desc}
                </h2>
                <p className="text-blue-900 font-bold mt-1">
                  ${item.price}
                </p>
                <p className="text-sm text-white/70 mt-1 hidden sm:block">
                  {item.category || ""}
                </p>
              </div>
            </Link>

            {/* RIGHT: actions */}
            <div className="flex items-center gap-3 mt-3 sm:mt-0">
              <button
                onClick={() => moveToCart(item)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium bg-gray-300 text-black shadow hover:scale-105 transition-transform"
              >
                <FaShoppingCart /> Add
              </button>

              <button
                onClick={() => removeFromWishlist(item._id)}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium bg-red-600 text-white shadow hover:scale-105 transition-transform"
              >
                <FaTrash /> Remove
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
  );
};

export default Wishlist;
