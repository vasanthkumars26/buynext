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

  return (
    <div className="p-4 md:p-8">
      <h1 className="text-2xl font-semibold text-white mb-6">Your Orders</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {orders.map((order, idx) => (
          <div
            key={idx}
            className="bg-gray-800 p-4 rounded-lg shadow-md text-white"
          >
            <h3 className="font-semibold mb-2">
              Order #{order._id || idx + 1}
            </h3>
            <p className="text-sm mb-2">
              {/* Added optional chaining ?. just in case items is missing */}
              Total Items: {order.items?.length || 0} 
            </p>
            <p className="text-sm mb-2">
              {/* ✅ FIXED LINE BELOW: Added (order.total || 0) fallback */}
              Total Price: ${(Number(order.total) || 0).toFixed(2)}
            </p>
            <p className="text-xs text-gray-400 mb-2">
              Date: {new Date(order.date).toLocaleString()}
            </p>
            <div className="mt-2">
              {order.items && order.items.map((item, i) => (
                <div key={i} className="flex items-center mb-1">
                  <img
                    src={item.img}
                    alt={item.desc}
                    className="w-10 h-10 rounded mr-2 object-cover"
                  />
                  <span className="text-sm">{item.desc} x {item.qty}</span>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;