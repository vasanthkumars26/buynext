// frontend/src/components/ProductDetails.jsx
import React, { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { FaShoppingCart, FaHeart, FaChevronLeft } from "react-icons/fa";
import { useCart } from "../context/Cartcon";

const API = "https://buynext-backend.vercel.app";

export default function ProductDetails() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const {
    cart = [],
    wishlist = [],
    addtoCart,
    addToWishlist,
    removeFromWishlist,
  } = useCart();

  const [product, setProduct] = useState(location.state?.product ?? null);
  const [loading, setLoading] = useState(false);
  const [activeImage, setActiveImage] = useState(0);

  /* ---------- IMAGE GALLERY (SAFE) ---------- */
  const getGallery = (prod) => {
    if (!prod) return ["https://via.placeholder.com/400"];
    if (Array.isArray(prod.images) && prod.images.length) return prod.images;
    if (prod.img) return [prod.img];
    return ["https://via.placeholder.com/400"];
  };

  const gallery = getGallery(product);

  /* ---------- FETCH PRODUCT FROM ADMIN PRODUCTS ---------- */
  useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });

    const fetchAdminProduct = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API}/admin/products`);
        if (!res.ok) throw new Error("Failed to fetch products");
        const data = await res.json();

        const found = data.find(
          (p) => String(p._id) === String(id) || String(p.id) === String(id)
        );
        setProduct(found || null);
      } catch (err) {
        console.error("Product fetch error:", err);
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    // If location state has product (from list click), use it
    if (
      location.state?.product &&
      (String(location.state.product._id) === String(id) ||
        String(location.state.product.id) === String(id))
    ) {
      setProduct(location.state.product);
      setLoading(false);
    } else {
      fetchAdminProduct();
    }
  }, [id, location.key, location.state]);

  useEffect(() => {
    document.title = product ? `${product.desc} — Shop` : "Product — Shop";
  }, [product]);

  /* ---------- STATES ---------- */
  if (loading) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-gray-200"
        >
          <FaChevronLeft /> Back
        </button>
        <p className="text-black">Loading product…</p>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="p-6 max-w-4xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center gap-2 mb-4 px-3 py-2 rounded-lg bg-gray-200"
        >
          <FaChevronLeft /> Back
        </button>
        <h2 className="text-lg font-semibold text-black">Product not found</h2>
        <p className="text-sm text-gray-600 mt-2">
          We couldn't find that product. It may have been removed or the ID is incorrect.
        </p>
        <Link to="/" className="mt-4 inline-block text-blue-600 underline">
          Return to shop
        </Link>
      </div>
    );
  }

  /* ---------- CART & WISHLIST CHECK ---------- */
  const isWishlisted = wishlist.some(
    (w) => String(w._id) === String(product._id)
  );
  const isInCart = cart.some((c) => String(c._id) === String(product._id));

  return (
    <div className="p-6 max-w-6xl mx-auto mt-[7%]">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-2 mb-6 px-3 py-2 rounded-lg bg-gray-200"
      >
        <FaChevronLeft /> Back
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* ---------- LEFT: IMAGE ---------- */}
        <div>
          <div className="rounded-2xl p-4 bg-white shadow">
            <img
              src={gallery[activeImage]}
              alt={product.desc}
              className="w-full h-auto rounded-xl object-cover"
            />
          </div>

          <div className="flex gap-3 mt-3">
            {gallery.map((img, idx) => (
              <div
                key={idx}
                onClick={() => setActiveImage(idx)}
                className={`w-20 h-20 cursor-pointer rounded-xl overflow-hidden border-2 ${
                  idx === activeImage ? "border-blue-500" : "border-transparent"
                }`}
              >
                <img src={img} alt="thumb" className="w-full h-full object-cover" />
              </div>
            ))}
          </div>
        </div>

        {/* ---------- RIGHT: DETAILS ---------- */}
        <div className="bg-white p-6 rounded-2xl shadow">
          <h1 className="text-2xl md:text-3xl font-bold text-black">
            {product.desc}
          </h1>

          <p className="text-sm text-gray-500 mt-1">Category: {product.category}</p>

          <p className="text-3xl font-extrabold text-blue-700 mt-4">
            ₹{product.price}
          </p>

          <div className="flex gap-3 mt-5">
            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() =>
                isWishlisted
                  ? removeFromWishlist(product)
                  : addToWishlist(product)
              }
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                isWishlisted ? "bg-red-500 text-white" : "bg-gray-200"
              }`}
            >
              <FaHeart /> {isWishlisted ? "Wishlisted" : "Add to Wishlist"}
            </motion.button>

            <motion.button
              whileTap={{ scale: 0.95 }}
              onClick={() => !isInCart && addtoCart(product)}
              className={`px-4 py-2 rounded-full flex items-center gap-2 ${
                isInCart ? "bg-green-500 text-white" : "bg-blue-600 text-white"
              }`}
            >
              <FaShoppingCart /> {isInCart ? "Added" : "Add to Cart"}
            </motion.button>
          </div>

          <div className="mt-6">
            <h3 className="font-semibold text-lg">Product details</h3>
            <p className="text-sm text-gray-600 mt-2">
              {product.longDesc || product.desc}
            </p>
          </div>

          <div className="flex gap-3 mt-6">
            <Link to="/" className="px-4 py-2 bg-gray-200 rounded-lg">
              Continue shopping
            </Link>
            <button
              onClick={() => {
                if (!isInCart) addtoCart(product);
                navigate("/checkout");
              }}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg"
            >
              Go to checkout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
