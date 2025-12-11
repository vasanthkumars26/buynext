import React, { useState } from "react";
import { useCart } from "../context/Cartcon";
import { useNavigate } from "react-router-dom";
import AppTheme from "../common/Apptheme";

const CheckoutPage = () => {
  const { cart, placeOrderWithUser } = useCart();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      await placeOrderWithUser(formData); 
      navigate("/ordersuccess");
      alert("🚀 Order Placed Successfully!");
    } catch (err) {
      console.error("Error:", err);
      alert("Server Error. Try again later.");
    }
  };

  return (
  <AppTheme> <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
        <h2 className="text-3xl font-extrabold mb-6 text-center text-indigo-700">
          Checkout
        </h2>

        <form onSubmit={handleSubmit}  className="text-black space-y-5">
          <div>
            <label className="block font-medium text-gray-700 mb-1">Full Name</label>
            <input
              type="text"
              name="name"
              required
              value={formData.name}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Email</label>
            <input
              type="email"
              name="email"
              required
              value={formData.email}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Phone</label>
            <input
              type="tel"
              name="phone"
              required
              value={formData.phone}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition"
            />
          </div>

          <div>
            <label className="block font-medium text-gray-700 mb-1">Address</label>
            <textarea
              name="address"
              required
              value={formData.address}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:ring-2 focus:ring-indigo-400 focus:outline-none transition resize-none"
              rows={4}
            />
          </div>

          <button
            type="submit"
            className="w-full bg-indigo-600 text-white font-semibold py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Place Order
          </button>
        </form>
      </div>
    </div></AppTheme> 
  );
};

export default CheckoutPage;
