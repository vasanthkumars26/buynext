// frontend/src/common/NewArrivals.jsx
import React, { useEffect, useState } from "react";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcon";

const LOCAL_PRODUCTS_KEY = "buynext_products_v1";

export default function NewArrivals({ limit = 6 }) {
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const { cart = [], wishlist = [], addtoCart, addToWishlist, removeFromWishlist } = useCart();

  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      // prefer createdAt if available, else fallback to _id sorting
      const sorted = Array.isArray(parsed)
        ? parsed.slice().sort((a, b) => {
            if (a.createdAt && b.createdAt) return new Date(b.createdAt) - new Date(a.createdAt);
            return (b._id || "").localeCompare(a._id || "");
          })
        : [];
      setProducts(sorted.slice(0, limit));
    } catch {
      setProducts([]);
    }
  }, [limit]);

  if (!products.length) return null;

  const isWishlisted = (p) => Array.isArray(wishlist) && wishlist.some((w) => String(w._id) === String(p._id));
  const isInCart = (p) => Array.isArray(cart) && cart.some((c) => String(c._id) === String(p._id));

  return (
    <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
      <h2 className="text-2xl font-bold text-black mb-4">New Arrivals</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 text-start ">
        {products.map((p) => (
          <div
            key={p._id}
            className="relative  rounded-2xl p-3 cursor-pointer hover:scale-105 transition bg-slate-100 shadow-md"
            onClick={() => navigate(`/product/${p._id}`, { state: { product: p } })}
          >
            {/* Wishlist icon top-right */}
            <button
              onClick={(e) => {
                e.stopPropagation();
                if (isWishlisted(p)) removeFromWishlist(p._id);
                else addToWishlist(p);
              }}
              className={`absolute top-3 right-3 z-10 p-2 rounded-full transition ${
                isWishlisted(p) ? "bg-red-500 text-white" : "border border-black text-xs  bg-white/6 "
              }`}
              title={isWishlisted(p) ? "Remove from wishlist" : "Add to wishlist"}
            >
              <FaHeart />
            </button>

            {/* Product image */}
            <div className="w-full h-40 rounded overflow-hidden bg-white/6 mb-2">
              <img
                src={p.images?.[0] || p.img}
                alt={p.desc}
                className="w-full h-full object-cover"
              />
            </div>

            {/* Product info */}
            <div className="text-blue-600 font-semibold truncate">{p.desc}</div>
            <div className="text-blue-900 font-bold mt-1">${p.price}</div>

            {/* Actions (Add to cart) */}
            <div className="mt-3 flex items-center justify-between gap-2">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  if (!isInCart(p)) addtoCart(p);
                }}
                className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium transition ${
                  isInCart(p) ? "bg-green-500 text-white cursor-default" : "bg-white/6 text-black"
                }`}
                title={isInCart(p) ? "Already in cart" : "Add to cart"}
                aria-pressed={isInCart(p)}
              >
                <FaShoppingCart />
                <span className="hidden sm:inline">{isInCart(p) ? "Added" : "Add"}</span>
              </button>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  // quick view: navigate but keep behavior consistent (same as card click)
                  navigate(`/product/${p._id}`, { state: { product: p } });
                }}
                className="px-3 py-2 text-sm rounded-2xl bg-white/6"
              >
                View
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
