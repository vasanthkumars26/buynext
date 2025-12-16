// frontend/src/components/CartPage.jsx
import React from "react";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcon";
import { motion } from "framer-motion";
import AppTheme from "../common/Apptheme";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateqty, removeFromCart, placeorder, setCart } = useCart();

  const handlecheckout = () => {
    navigate("/checkout");
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  if (cart.length === 0) {
    return (
      <motion.h2
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="text-center mt-[34%] md:mt-[10%] text-xl text-black"
      >
        Your cart is empty
      </motion.h2>
    );
  }

  return (
    <motion.div
      className="max-w-5xl mt-[32%] mx-auto sm:mt-[16%] md:mt-[10%] lg:mt-[10%] px-4"
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
        Your Cart
      </motion.h1>

      <motion.div
        className="space-y-6 text-start"
        initial="hidden"
        animate="visible"
        variants={{
          hidden: {},
          visible: {
            transition: { staggerChildren: 0.08 }
          }
        }}
      >
        {cart.map((item) => (
          <motion.div
            key={item._id}
            variants={{
              hidden: { opacity: 0, y: 25 },
              visible: { opacity: 1, y: 0 }
            }}
            transition={{ duration: 0.45, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-start sm:items-center justify-between bg-slate-100 rounded-2xl p-4 gap-4"
          >
            <div className="flex items-center gap-4 w-full sm:w-auto">
              <img
                src={item.img}
                alt={item.desc}
                className="w-full max-w-[120px] h-28 object-cover rounded-lg"
              />
              <div className="flex-1">
                <h2 className="font-semibold text-black">{item.desc}</h2>
                <p className="text-blue-900 font-bold mt-1">${item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() =>
                  updateqty(item._id, item.qty > 1 ? item.qty - 1 : 1)
                }
                className="p-2 rounded-full glass-btn hover:scale-105 transition"
                aria-label="decrease quantity"
              >
                <FaMinus />
              </button>

              <div className="px-3 py-1 rounded-full text-black">
                {item.qty}
              </div>

              <button
                onClick={() => updateqty(item._id, item.qty + 1)}
                className="p-2 rounded-full glass-btn hover:scale-105 transition"
                aria-label="increase quantity"
              >
                <FaPlus />
              </button>

              <button
                onClick={() => removeFromCart(item._id)}
                className="p-2 rounded-full bg-red-600 text-white hover:bg-red-700 transition"
                aria-label="remove item"
                title="Remove item"
              >
                <FaTrash />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        className="mt-6 flex flex-col sm:flex-row items-center sm:items-end justify-between gap-4"
        initial={{ opacity: 0, y: 25 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
      >
        <div className="text-left">
          <h2 className="text-xl font-bold text-black">Total:</h2>
          <div className="text-2xl font-extrabold text-blue-900">
            ${totalPrice.toFixed(2)}
          </div>
        </div>

        <div className="flex gap-3 items-center">
          <button
            onClick={handlecheckout}
            className="px-6 py-2 rounded-2xl bg-gray-300 text-gray-900 font-semibold shadow-lg hover:scale-105 transition-transform"
          >
            Proceed to Checkout
          </button>

          <button
            onClick={() => {
              setCart([]);
            }}
            className="px-4 py-2 rounded-2xl bg-white/6 text-black border border-white/8 hover:bg-white/8 transition"
          >
            Clear
          </button>
        </div>
      </motion.div>

      <style>{`
        .glass { background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(6px); }
        .glass-btn { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); width: 40px; height: 40px; display: inline-flex; align-items: center; justify-content: center; }
      `}</style>
    </motion.div>
  );
};

export default CartPage;
