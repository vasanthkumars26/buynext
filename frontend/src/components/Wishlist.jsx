// frontend/src/components/Wishlist.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useCart } from "../context/Cartcon";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { motion } from "framer-motion";

const Wishlist = () => {
  const { wishlist = [], removeFromWishlist, addtoCart } = useCart();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  if (!wishlist || wishlist.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center px-4 text-center">
        <h2 className="text-2xl font-semibold text-gray-800">Your Wishlist is empty</h2>
        <p className="mt-2 text-gray-600">Add your favorite products to see them here!</p>
      </div>
    );
  }

  const moveToCart = (item) => {
    addtoCart(item);
    removeFromWishlist(item);
  };

  return (
    <div className="max-w-6xl mx-auto py-8 px-4 sm:px-6 lg:px-8 mt-8">
      <h1 className="text-3xl font-bold mb-6 text-gray-800">Wishlist</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {wishlist.map((item) => (
          <motion.div
            key={item._id || item.id}
            className="border rounded-lg shadow-sm bg-white hover:shadow-lg transition-shadow duration-300 flex flex-col"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Product Image */}
            <Link
              to={`/product/${item._id}`}
              state={{ product: item }}
              className="block p-4"
            >
              <div className="w-full h-48 bg-gray-100 rounded-lg overflow-hidden flex items-center justify-center">
                <img
                  src={item.img}
                  alt={item.desc}
                  className="object-contain max-h-full transition-transform duration-300 hover:scale-105"
                />
              </div>
              <h2 className="mt-3 text-lg font-medium text-gray-900 truncate">
                {item.desc}
              </h2>
              <p className="mt-1 text-gray-700 font-semibold">${item.price}</p>
              <p className="mt-1 text-gray-500 text-sm">{item.category}</p>
            </Link>

            {/* Actions */}
            <div className="flex justify-between items-center p-4 border-t">
              <button
                onClick={() => moveToCart(item)}
                className="flex items-center gap-2 bg-blue-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-blue-700 transition-colors"
              >
                <FaShoppingCart /> Add to Cart
              </button>
              <button
                onClick={() => removeFromWishlist(item)}
                className="flex items-center gap-2 bg-red-600 text-white px-3 py-2 rounded-md text-sm font-medium hover:bg-red-700 transition-colors"
              >
                <FaTrash /> Remove
              </button>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Wishlist;
