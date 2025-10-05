import React from "react";
import { useCart } from "../context/Cartcon";

const OrdersPage = () => {
  const { orders } = useCart();

  if (orders.length === 0) {
    return <h2 className="text-center mt-[10%] text-xl">No orders yet</h2>;
  }

  return (
    <div className="max-w-5xl mx-auto sm:mt-[10%] md:mt-[9%] lg:mt-[10%] ">
      <h1 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-700 to-black bg-clip-text text-transparent">
        Your Orders
      </h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="border border-gray-500 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-semibold">Order #{order.id}</h2>
              <span className="text-sm text-gray-500">{order.date}</span>
            </div>

            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2"
                >
                  <span>
                    {item.desc} <span className="text-red-500">(x{item.qty ?? 0})</span>
                  </span>
                  <span>${((item.price ?? 0) * (item.qty ?? 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="text-right font-bold mt-3 text-green-500">
              Total: ${(order.total ?? 0).toFixed(2)}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
