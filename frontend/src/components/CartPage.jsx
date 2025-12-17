import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useCart } from "../context/Cartcon";

const CartPage = () => {
  const navigate = useNavigate();

  // IMPORTANT: updateqty(productId, mongoId, qty)
  const { cart, updateqty, removeFromCart, setCart } = useCart();

  const handleCheckout = () => navigate("/checkout");

  const totalPrice = cart.reduce(
    (sum, item) => sum + item.price * item.qty,
    0
  );

  /* ---------------- EMPTY CART ---------------- */
  if (!cart || cart.length === 0) {
    return (
      <motion.div
        className="flex flex-col items-center justify-center min-h-[60vh]"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h2 className="text-2xl font-semibold text-gray-500">
          Your cart is empty
        </h2>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-2 bg-blue-900 text-white rounded-full"
        >
          Go Shopping
        </button>
      </motion.div>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mt-[32%] mx-auto sm:mt-[16%] md:mt-[10%] px-4 pb-20"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
    >
      <h1 className="text-3xl font-extrabold mb-8">Your Cart</h1>

      {/* ---------------- CART ITEMS ---------------- */}
      <div className="space-y-4">
        {cart.map((item, index) => (
          <motion.div
            key={`${item._id || "local"}-${item.id}`} // ✅ SAFE UNIQUE KEY
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.05 }}
            className="flex flex-col sm:flex-row items-center justify-between bg-white border rounded-2xl p-4 shadow-sm gap-4"
          >
            {/* Product Info */}
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={item.img}
                alt={item.desc}
                className="w-24 h-24 object-cover rounded-xl"
              />
              <div>
                <h2 className="font-bold text-lg">{item.desc}</h2>
                <p className="text-sm text-gray-500">{item.category}</p>
                <p className="font-extrabold text-blue-900">
                  ${item.price.toFixed(2)}
                </p>
              </div>
            </div>

            {/* Quantity Controls */}
            <div className="flex items-center gap-6">
              <div className="flex items-center bg-gray-100 rounded-full px-2">
                <button
                  onClick={() =>
                    updateqty(item.id, item._id, item.qty - 1)
                  }
                  disabled={item.qty <= 1}
                  className="p-2 disabled:opacity-30"
                >
                  <FaMinus size={12} />
                </button>

                <span className="px-4 font-bold">{item.qty}</span>

                <button
                  onClick={() =>
                    updateqty(item.id, item._id, item.qty + 1)
                  }
                  className="p-2"
                >
                  <FaPlus size={12} />
                </button>
              </div>

              {/* Remove Item */}
              <button
                onClick={() =>
                  removeFromCart(item._id, item.id)
                }
                className="p-3 rounded-full bg-red-50 text-red-600 hover:bg-red-600 hover:text-white transition"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </div>

      {/* ---------------- FOOTER ---------------- */}
      <motion.div
        className="mt-10 p-6 bg-slate-900 rounded-3xl text-white flex flex-col sm:flex-row items-center justify-between gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <div>
          <p className="text-gray-400 text-sm">Order Total</p>
          <h2 className="text-3xl font-black">
            ${totalPrice.toFixed(2)}
          </h2>
        </div>

        <div className="flex gap-4">
          <button
            onClick={() => setCart([])}
            className="px-6 py-3 border border-white/20 rounded-xl"
          >
            Clear Cart
          </button>

          <button
            onClick={handleCheckout}
            className="px-10 py-3 bg-white text-slate-900 font-bold rounded-xl"
          >
            Checkout
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CartPage;
