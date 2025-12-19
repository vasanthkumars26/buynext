// frontend/src/pages/CheckoutPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import AppTheme from "../common/Apptheme";
import { useCart } from "../context/Cartcon";

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const incomingProduct = location.state?.product ?? null;

  // keep your existing context hooks (added addtoCart and cart helpers)
  const { cart = [], addtoCart, placeOrderWithUser, updateqty, removeFromCart } = useCart();

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    phone: "",
  });

  const [submitting, setSubmitting] = useState(false);

  // If user arrived from ProductDetails with a product, ensure it's in cart
  useEffect(() => {
    if (!incomingProduct) return;

    const already = Array.isArray(cart) && cart.find((c) => String(c._id) === String(incomingProduct._id));
    if (!already) {
      // addtoCart shape assumed to add default qty = 1; adjust if your addtoCart signature differs
      addtoCart({ ...incomingProduct, qty: 1 });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [incomingProduct]);

  const handleChange = (e) => {
    setFormData((s) => ({ ...s, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!cart || cart.length === 0) {
      alert("Your cart is empty. Add items before placing an order.");
      return;
    }

    setSubmitting(true);

    // Build payload that merges form data + cart items + simple totals
    const payload = {
      customer: {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        address: formData.address,
      },
      items: cart.map((it) => ({
        _id: it._id,
        desc: it.desc,
        price: it.price,
        qty: it.qty ?? 1,
      })),
      total: cart.reduce((sum, it) => sum + (it.price || 0) * (it.qty ?? 1), 0),
      // optional: add metadata, timestamp, etc.
      placedAt: new Date().toISOString(),
    };

    try {
      // Try calling your provided placeOrderWithUser helper.
      // Many implementations expect (formData, cart) or a single payload — this wrapper attempts both patterns.
      let result;
      if (!placeOrderWithUser) {
        throw new Error("placeOrderWithUser not available in cart context");
      }

      // Try the common signatures in order:
      // 1) placeOrderWithUser(payload)
      // 2) placeOrderWithUser(formData, cart)
      // 3) placeOrderWithUser(payload, { rawCart: cart })
      try {
        result = await placeOrderWithUser(payload);
      } catch (err1) {
        try {
          result = await placeOrderWithUser(formData, cart);
        } catch (err2) {
          result = await placeOrderWithUser(payload, { rawCart: cart });
        }
      }

      // on success: navigate and show success message (you had both navigate + alert)
      navigate("/ordersuccess", { state: { order: result ?? payload } });
      alert("🚀 Order Placed Successfully!");
    } catch (err) {
      console.error("Place order error:", err);
      alert("Server Error. Try again later.");
    } finally {
      setSubmitting(false);
    }
  };

  // small helpers for UI qty changes — use your context if available
  const decQty = (it) => updateqty?.(it._id, Math.max(1, (it.qty ?? 1) - 1));
  const incQty = (it) => updateqty?.(it._id, (it.qty ?? 1) + 1);

  return (
    
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br p-4">
        <div className="w-full max-w-4xl bg-white rounded-2xl shadow-lg p-6 sm:p-8 md:p-10">
          <h2 className="text-3xl font-extrabold mb-6 text-center text-black">Checkout</h2>

          {/* Order summary */}
          <div className="mb-6 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold mb-3 text-black">Order summary</h3>
            {!cart || cart.length === 0 ? (
              <p className="text-sm text-gray-600">Your cart is empty.</p>
            ) : (
              <div className="space-y-3">
                {cart.map((it) => (
                  <div key={it._id || it.id} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-14 h-14 rounded overflow-hidden bg-gray-100">
                        <img
                          src={it.img ?? it.images?.[0]}
                          alt={it.desc}
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <div className="font-medium text-black">{it.desc}</div>
                        <div className="text-sm text-gray-700">${it.price}</div>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        onClick={() => decQty(it)}
                        className="px-2 py-1 bg-gray-300 text-black rounded"
                      >
                        -
                      </button>
                      <div className="w-6 text-center text-black">{it.qty ?? 1}</div>
                      <button
                        type="button"
                        onClick={() => incQty(it)}
                        className="px-2 py-1 bg-gray-300 text-black rounded"
                      >
                        +
                      </button>
                      <button
                        type="button"
                        onClick={() => removeFromCart?.(it._id)}
                        className="ml-3 text-sm text-red-600"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))}

                <div className="pt-3 border-t border-gray-100 text-right">
                  <div className="text-sm text-black">Total</div>
                  <div className="text-xl text-black font-bold">${cart.reduce((s, i) => s + (i.price || 0) * (i.qty ?? 1), 0)}</div>
                </div>
              </div>
            )}
          </div>

          {/* Checkout form */}
          <form onSubmit={handleSubmit} className="text-black space-y-5 text-start">
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
              className="w-fit bg-blue-700 text-gray-300 mx-auto font-semibold py-3 px-4 flex justify-center rounded-lg hover:bg-blue-600 hover:text-black transition disabled:opacity-60"
              disabled={submitting}
            >
              {submitting ? "Placing order..." : "Place Order"}
            </button>
          </form>
        </div>
      </div>
    
  );
};

export default CheckoutPage;
