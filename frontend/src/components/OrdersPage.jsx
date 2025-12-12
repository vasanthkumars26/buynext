// import React from "react";
// import { useCart } from "../context/Cartcon";
// import AppTheme from "../common/Apptheme";

// const OrdersPage = () => {
//   const { orders } = useCart();

//   if (orders.length === 0) {
//     return <h2 className="text-white text-center mt-[28%] md:mt-[10%] text-xl">No orders yet</h2> ;
//   }

//   return (
//     <div className="max-w-5xl mt-[32%] mx-auto sm:mt-[16%] md:mt-[10%] lg:mt-[10%]  ">
//       <h1 className="text-3xl font-bold mb-6 text-gray-300">
//         Your Orders
//       </h1>
//       <div className="space-y-6">
//         {orders.map((order) => (
//           <div key={order.id} className="bg-gray-300 border-gray-500 p-4 rounded-lg shadow-md">
//             <div className="flex justify-between items-center mb-3 text-black">
//               <h2 className="font-semibold">Order #{order.id}</h2>
//               <span className="text-sm text-black ">{order.date}</span> 
//             </div>

//             <div className="space-y-2">
//               {order.items?.map((item) => (
//                 <div
//                   key={item._id}
//                   className="flex justify-between items-center border-b pb-2 text-black"
//                 >
//                   <span>
//                     {item.desc} <span className="text-red-500 font-semibold">(x{item.qty ?? 0})</span>
//                   </span>
//                   <span>${((item.price ?? 0) * (item.qty ?? 0)).toFixed(2)}</span>
//                 </div>
//               ))}
//             </div>

//             <div className="text-right font-bold mt-3 text-black">
//               Total: $ <span className="text-red-500 font-bold" >{(order.total ?? 0).toFixed(2)}</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// };

// export default OrdersPage;

// frontend/src/components/OrdersPage.jsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/Cartcon";
import AppTheme from "../common/Apptheme";

const BACKEND_ORDERS_URL = "https://buynext-backend.vercel.app/orders"; // <-- change to your real endpoint

export default function OrdersPage() {
  const { orders: ctxOrders = [] } = useCart(); // safe default
  const location = useLocation();
  const [orders, setOrders] = useState(Array.isArray(ctxOrders) ? ctxOrders : []);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function fetchOrdersFromServer() {
    setLoading(true);
    setError("");
    try {
      const resp = await fetch(BACKEND_ORDERS_URL, { method: "GET", headers: { "Content-Type": "application/json" }});
      if (!resp.ok) {
        const txt = await resp.text().catch(() => "");
        throw new Error(`Server returned ${resp.status} ${txt}`);
      }
      const data = await resp.json();
      // Expect data to be an array; normalize if backend returns single object
      const list = Array.isArray(data) ? data : (data.orders || []);
      setOrders(list);
      console.log("Fetched orders from server:", list);
    } catch (err) {
      console.error("Failed to fetch orders:", err);
      setError("Unable to load orders. Check console for details.");
      // fallback to context orders if available
      if (Array.isArray(ctxOrders) && ctxOrders.length) setOrders(ctxOrders);
      else setOrders([]);
    } finally {
      setLoading(false);
    }
  }

  // 1) On mount fetch server orders (this ensures page reflects server DB)
  useEffect(() => {
    fetchOrdersFromServer();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2) If we navigated here with a new order in state (after placing order), re-fetch
  useEffect(() => {
    if (location.state?.order) {
      // small delay to let backend finish any DB writes (optional)
      const t = setTimeout(() => fetchOrdersFromServer(), 600);
      return () => clearTimeout(t);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.state?.order]);

  // render states
  if (loading) {
    return (
      <AppTheme>
        <div className="min-h-[60vh] flex items-center justify-center">
          <p className="text-gray-300">Loading your orders…</p>
        </div>
      </AppTheme>
    );
  }

  if (error) {
    return (
      <AppTheme>
        <div className="min-h-[60vh] flex flex-col items-center justify-center">
          <p className="text-red-400 mb-3">{error}</p>
          <button onClick={fetchOrdersFromServer} className="px-4 py-2 rounded bg-gray-700 text-white">Retry</button>
        </div>
      </AppTheme>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <AppTheme>
        <h2 className="text-white text-center mt-[8%] text-xl">No orders yet</h2>
      </AppTheme>
    );
  }

  return (
    <AppTheme>
      <div className="max-w-5xl mx-auto mt-12 px-4">
        <h1 className="text-3xl font-bold mb-6 text-gray-300">Your Orders</h1>
        <div className="space-y-6">
          {orders.map((order) => {
            // normalize fields (some backends use _id or id)
            const id = order._id || order.id || order.orderId || Math.random().toString(36).slice(2,9);
            const date = order.placedAt || order.date || order.createdAt || "";
            const items = order.items || order.cart || [];
            const total = order.total ?? order.amount ?? items.reduce((s,i)=> s + ((i.price||0)*(i.qty||1)), 0);

            return (
              <div key={id} className="bg-white/10 border border-white/6 p-4 rounded-lg shadow-md">
                <div className="flex justify-between items-center mb-3 text-white">
                  <h2 className="font-semibold">Order #{id}</h2>
                  <span className="text-sm">{date ? new Date(date).toLocaleString() : ""}</span>
                </div>

                <div className="space-y-2">
                  {items.map((item) => (
                    <div key={item._id || item.id || `${id}-${item.desc}`} className="flex justify-between items-center border-b pb-2">
                      <div>
                        <div className="font-medium">{item.desc}</div>
                        <div className="text-sm text-gray-300">Qty: {item.qty ?? 1}</div>
                      </div>
                      <div className="font-semibold">${((item.price ?? 0) * (item.qty ?? 1)).toFixed(2)}</div>
                    </div>
                  ))}
                </div>

                <div className="text-right font-bold mt-3 text-white">
                  Total: <span className="text-red-400">${Number(total).toFixed(2)}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </AppTheme>
  );
}

