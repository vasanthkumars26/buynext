import React, { useState } from "react";
import { useCart } from "../context/Cartcon";
import { useNavigate } from "react-router-dom";

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
      alert("🚀Order Placed Successfully!")
    } catch (err) {
      console.error("Error:", err);
      alert("Server Error. Try again later.");
    }
  };

  return (
    <div className="max-w-lg mx-auto mt-[20%] sm:mt-[12%] md:mt-[9%] p-6 border rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-center">Checkout</h2>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block font-semibold">Full Name</label>
          <input
            type="text"
            name="name"
            required
            value={formData.name}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Email</label>
          <input
            type="email"
            name="email"
            required
            value={formData.email}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Phone</label>
          <input
            type="tel"
            name="phone"
            required
            value={formData.phone}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <div>
          <label className="block font-semibold">Address</label>
          <textarea
            name="address"
            required
            value={formData.address}
            onChange={handleChange}
            className="w-full border rounded px-3 py-2"
          />
        </div>

        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
        >
          Place Order
        </button>
      </form>
    </div>
  );
};

export default CheckoutPage;