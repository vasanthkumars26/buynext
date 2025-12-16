// frontend/src/components/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/Cartcon";
import AppTheme from "../common/Apptheme";
import { motion } from "framer-motion";

const BACKEND_ORDERS_URL = "https://buynext-backend.vercel.app/orders";

export default function OrdersPage() {
  const { orders: ctxOrders = [] } = useCart();
  const location = useLocation();
  const [orders, setOrders] = useState(Array.isArray(ctxOrders) ? ctxOrders : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchOrdersFromServer() {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(BACKEND_ORDERS_URL, {
        method: "GET",
        headers: { "Content-Type": "application/json" },
      });
      if (!resp.ok) throw new Error(`Server returned ${resp.status}`);
      const data = await resp.json();
      const list = Array.isArray(data) ? data : data.orders || [];
      setOrders(list);
    } catch (err) {
      setError("Unable to load orders.");
      if (Array.isArray(ctxOrders) && ctxOrders.length) setOrders(ctxOrders);
      else setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchOrdersFromServer();
  }, []);

  useEffect(() => {
    if (location.state?.order) {
      const t = setTimeout(() => fetchOrdersFromServer(), 600);
      return () => clearTimeout(t);
    }
  }, [location.state?.order]);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <p className="text-blue-500">Loading your orders…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center">
        <p className="text-red-400 mb-3">{error}</p>
        <button
          onClick={fetchOrdersFromServer}
          className="px-4 py-2 rounded bg-gray-700 text-white"
        >
          Retry
        </button>
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <h2 className="text-white text-center mt-[8%] text-xl">
        No orders yet
      </h2>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-5xl mx-auto mt-[7%] px-4"
    >
      <h1 className="text-3xl font-bold mb-6 text-black">Your Orders</h1>

      <div className="space-y-6">
        {orders.map((order, index) => {
          const id =
            order._id ||
            order.id ||
            order.orderId ||
            Math.random().toString(36).slice(2, 9);

          const date =
            order.placedAt ||
            order.date ||
            order.createdAt ||
            "";

          const items = order.items || order.cart || [];

          const total =
            order.total ??
            order.amount ??
            items.reduce(
              (s, i) => s + (i.price || 0) * (i.qty || 1),
              0
            );

          return (
            <motion.div
              key={id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.35,
                delay: index * 0.08,
                ease: "easeOut",
              }}
              className="bg-white/10 border border-white/6 p-4 rounded-lg shadow-md"
            >
              <div className="flex justify-between items-center mb-3 text-blue-600">
                <h2 className="font-semibold">Order #{id}</h2>
                <span className="text-sm">
                  {date ? new Date(date).toLocaleString() : ""}
                </span>
              </div>

              <div className="space-y-2">
                {items.map((item) => (
                  <div
                    key={item._id || item.id || `${id}-${item.desc}`}
                    className="flex justify-between items-center border-b pb-2"
                  >
                    <div>
                      <div className="font-medium">{item.desc}</div>
                      <div className="text-sm text-gray-600">
                        Qty: {item.qty ?? 1}
                      </div>
                    </div>
                    <div className="font-semibold">
                      ${((item.price ?? 0) * (item.qty ?? 1)).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>

              <div className="text-right font-bold mt-3 text-black">
                Total:{" "}
                <span className="text-blue-800">
                  ${Number(total).toFixed(2)}
                </span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
