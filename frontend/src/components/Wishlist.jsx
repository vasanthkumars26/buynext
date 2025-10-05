import React, { useEffect } from "react";
import { useCart } from "../context/Cartcon";
import { FaTrash, FaPlus, FaMinus, FaShoppingCart } from "react-icons/fa";


const Wishlist = () => {
  const { wishlist, removeFromWishlist,addtoCart } = useCart();

  if (wishlist.length === 0) {
    return <h2 className="text-center mt-[28%] md:mt-[10%] text-xl">No products in your Wishlist</h2>;
  }

  const moveToCart = (item)=>{
    addtoCart(item);
    removeFromWishlist(item._id);
  }

  return (
    <div className="max-w-5xl mx-auto sm:mt-[10%] md:mt-[9%] lg:mt-[8%]">
      <h1 className="text-3xl font-bold mb-6">Your Wishlist</h1>
      <div className="space-y-6">
        {wishlist.map((item) => (
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

              <div className="flex items-center gap-4" >
                <button className="p-2 bg-green-500 text-white rounded flex items-center gap-1" onClick={()=>moveToCart(item)} ><FaShoppingCart/>Add</button>
              </div>

            <div className="flex items-center gap-4">
              <button
                onClick={() => removeFromWishlist(item._id)}
                className="p-2 bg-red-500 text-white rounded"
              >
                <FaTrash />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};


export default Wishlist;
