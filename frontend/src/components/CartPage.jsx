import React, { useEffect, useState } from "react";
import { useCart } from "../context/Cartcon";
import { FaTrash, FaPlus, FaMinus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const CartPage = () => {
  const navigate = useNavigate();
  const { cart, updateqty, removeFromCart, fetchCart } = useCart();
  const [loading, setLoading] = useState(true);

  const handlecheckout = () => {
    navigate("/checkout");
  };

  const totalPrice = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

  useEffect(() => {
    const loadCart = async () => {
      setLoading(true);
      await fetchCart();
      setLoading(false);
    };
    loadCart();
  }, [fetchCart]);

  if (loading) {
    return (
      <h2 className="text-center mt-[28%] md:mt-[10%] text-xl animate-pulse">
        Loading your cart...
      </h2>
    );
  }

  if (cart.length === 0) {
    return <h2 className="text-center mt-[28%] md:mt-[10%] text-xl">Your cart is empty</h2>;
  }

  return (
    <div className="max-w-5xl mt-[24%] mx-auto sm:mt-[14%] md:mt-[9%] lg:mt-[8%]">
      <h1 className="text-3xl font-bold mb-6">Your Cart</h1>
      <div className="space-y-6">
        {cart.map((item) => (
          <div
            key={item._id}
            className="flex items-center justify-between border p-4 rounded-lg"
          >
            <div className="flex items-center gap-4">
              <img
                src={item.img}
                alt={item.desc}
                className="w-24 h-24 object-cover rounded"
              />
              <div>
                <h2 className="font-semibold">{item.desc}</h2>
                <p className="text-green-600">${item.price}</p>
              </div>
            </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => updateqty(item._id, item.qty > 1 ? item.qty - 1 : 1)}
                className="p-2 bg-gray-200 rounded"
              >
                <FaMinus />
              </button>
              <span>{item.qty}</span>

              <button
                onClick={() => updateqty(item._id, item.qty + 1)}
                className="p-2 bg-gray-200 rounded"
              >
                <FaPlus />
              </button>

              <button
                onClick={() => removeFromCart(item._id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 text-right m-2">
        <h2 className="text-2xl font-bold">Total: ${totalPrice.toFixed(2)}</h2>
        <button
          onClick={handlecheckout}
          className="mt-4 px-6 py-2 bg-green-600 text-white rounded hover:bg-green-700"
        >
          Proceed to Checkout
        </button>
      </div>
    </div>
  );
};

export default CartPage;
