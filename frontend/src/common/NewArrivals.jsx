// frontend/src/common/NewArrivals.jsx
import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaRegHeart, FaHeart } from "react-icons/fa";
import { useCart } from "../context/Cartcon";

const API = "https://buynext-backend.vercel.app";

export default function NewArrivals() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const { cart = [], wishlist = [], addtoCart, addToWishlist, removeFromWishlist } = useCart();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API}/admin/products`);
      if (!res.ok) throw new Error(`Server error ${res.status}`);
      const data = await res.json();
      setProducts(data || []);
    } catch (err) {
      console.error(err);
      setProducts([]);
    } finally {
      setLoading(false);
    }
  };

  const WishlistButton = ({ product }) => {
    const isWishlisted = wishlist.some((item) => item._id === product._id);
    return (
      <motion.button
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.97 }}
        onClick={() => (isWishlisted ? removeFromWishlist(product._id) : addToWishlist(product))}
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium transition-shadow focus:outline-none ${
          isWishlisted ? "bg-red-500 text-white" : "bg-gray-100 text-black shadow-md"
        }`}
      >
        {isWishlisted ? <FaHeart /> : <FaRegHeart />}
      </motion.button>
    );
  };

  if (loading) return <div className="p-6 text-center">Loading new arrivals...</div>;
  if (!products.length) return <div className="p-6 text-center">No new arrivals yet.</div>;

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-6 text-black">New Arrivals</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
        {products.map((product) => {
          const isInCart = cart.some((c) => c._id === product._id);
          return (
            <motion.article
              key={product._id}
              whileHover={{ y: -6, boxShadow: "0 10px 30px rgba(0,0,0,0.1)" }}
              className="bg-slate-100 rounded-2xl p-3 w-full shadow-md border border-gray-200"
            >
              <Link to={`/product/${product._id}`} state={{ product }} className="block">
                <div className="w-full aspect-square overflow-hidden rounded-xl bg-white">
                  <img src={product.img} alt={product.desc} className="w-full h-full object-cover" />
                </div>
                <h2 className="mt-3 font-semibold text-blue-700 text-sm sm:text-base">{product.desc}</h2>
              </Link>
              <p className="text-blue-900 font-bold mt-1">₹{product.price}</p>
              <div className="flex gap-2 mt-3">
                <WishlistButton product={product} />
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  onClick={() => !isInCart && addtoCart(product)}
                  className={`flex-1 flex items-center justify-center gap-2 py-2 rounded-xl text-xs sm:text-sm font-medium transition-colors ${
                    isInCart ? "bg-green-500 text-white cursor-default" : "bg-blue-600 text-white hover:bg-blue-700"
                  }`}
                >
                  {isInCart ? "Added" : "Add to Cart"} <FaShoppingCart />
                </motion.button>
              </div>
            </motion.article>
          );
        })}
      </div>
    </div>
  );
}
