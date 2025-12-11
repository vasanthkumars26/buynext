import React from "react";
import { useCart } from "../context/Cartcon";
import AppTheme from "../common/Apptheme";

const OrdersPage = () => {
  const { orders } = useCart();

  if (orders.length === 0) {
    return <AppTheme><h2 className="text-white text-center mt-[28%] md:mt-[10%] text-xl">No orders yet</h2></AppTheme> ;
  }

  return (
    <div className="max-w-5xl mt-[32%] mx-auto sm:mt-[16%] md:mt-[10%] lg:mt-[10%]  ">
      <h1 className="text-3xl font-bold mb-6 text-white">
        Your Orders
      </h1>
      <div className="space-y-6">
        {orders.map((order) => (
          <div key={order.id} className="bg-gradient-to-b from-slate-300 to-blue-400 border border-gray-500 p-4 rounded-lg shadow-md">
            <div className="flex justify-between items-center mb-3 text-black">
              <h2 className="font-semibold">Order #{order.id}</h2>
              <span className="text-sm text-black ">{order.date}</span> 
            </div>

            <div className="space-y-2">
              {order.items?.map((item) => (
                <div
                  key={item._id}
                  className="flex justify-between items-center border-b pb-2 text-black"
                >
                  <span>
                    {item.desc} <span className="text-red-500 font-semibold">(x{item.qty ?? 0})</span>
                  </span>
                  <span>${((item.price ?? 0) * (item.qty ?? 0)).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="text-right font-bold mt-3 text-black">
              Total: $ <span className="text-red-500 font-bold" >{(order.total ?? 0).toFixed(2)}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrdersPage;
