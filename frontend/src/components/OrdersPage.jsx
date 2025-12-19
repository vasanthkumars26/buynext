// frontend/src/pages/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { useCart } from "../context/Cartcon";

const OrdersPage = () => {
  const { orders, fetchOrders } = useCart();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadOrders = async () => {
    setLoading(true);
    setError("");
    try {
      await fetchOrders();
    } catch (err) {
      console.error("Load orders failed:", err);
      setError("Failed to load orders. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadOrders();
  }, []);

  if (loading) {
    return (
      <h2 className="text-black text-center mt-[28%] md:mt-[10%] text-xl">
        Loading orders...
      </h2>
    );
  }

  if (error) {
    return (
      <h2 className="text-red-500 text-center mt-[28%] md:mt-[10%] text-xl">
        {error}
      </h2>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <h2 className="text-black text-center mt-[28%] md:mt-[10%] text-xl">
        No orders yet
      </h2>
    );
  }

  // Sort newest order first
  const sortedOrders = [...orders].sort(
    (a, b) => new Date(b.date) - new Date(a.date)
  );

  return (
    <div className="p-4 md:p-8 flex justify-center">
      <div className="w-full max-w-4xl flex flex-col gap-6">
        <h1 className="text-3xl font-bold text-black mb-6 text-center">
          Your Orders
        </h1>

        {sortedOrders.map((order, idx) => (
          <div
            key={idx}
            className="bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-blue-600 text-white px-4 py-2 flex justify-between items-center">
              <span className="font-semibold">Order #{order._id || idx + 1}</span>
              <span className="text-sm">
                {new Date(order.date).toLocaleDateString()} -{" "}
                {new Date(order.date).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </span>
            </div>

            {/* Order Summary */}
            <div className="p-4 space-y-2">
              

              {/* Products List */}
              <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
                {order.items?.map((item, i) => (
                  <div
                    key={i}
                    className="flex items-center gap-3 border p-2 rounded-lg hover:shadow-lg transition"
                  >
                    <img
                      src={item.img}
                      alt={item.desc}
                      className="w-16 h-16 object-cover rounded"
                    />
                    <div className="flex flex-col justify-center">
                      <span className="font-medium text-gray-800">{item.desc}</span>
                      <span className="text-sm text-gray-600">Qty: {item.qty}</span>
                      <span className="text-sm text-gray-600">₹{item.price}</span>
                    </div>
                    
                  </div>
                ))}
              </div>
              <p className="text-gray-700 text-end font-medium">
                Total Items: {order.items?.length || 0}
              </p>
              <p className="text-gray-700 text-end font-medium">
                Total Price: ₹{(Number(order.total) || 0).toFixed(2)}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
