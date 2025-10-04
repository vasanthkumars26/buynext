import React from "react";
import { useLocation } from "react-router-dom";
import { useCart } from "../context/Cartcon";
import { FaHeart, FaShoppingBag,FaShoppingCart } from "react-icons/fa";

const SearchPage = () => {
  const {wishlist,addToWishlist,removeFromWishlist,allproducts,addtoCart } = useCart(); 
  const location = useLocation();

  // extract search query
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query")?.toLowerCase() || "";

  // filter products
  const filtered = allproducts.filter(
    (item) =>
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
  );

 const WishlistButton = ({ product }) => {
    const isWishlisted = wishlist.find((item) => item._id === product._id);
    return (
      <button
        onClick={() =>
          isWishlisted
            ? removeFromWishlist(product._id)
            : addToWishlist(product)
        }
        className={`flex items-center gap-1 p-2 rounded-2xl ${
          isWishlisted
            ? "bg-red-500 text-white"
            : "bg-gradient-to-r from-green-300 to-green-600"
        }`}
      >
         <FaHeart />
      </button>
    );
  };

  return (
    <div className="p-5 mt-[8%]">
      <h1 className="text-2xl font-bold mb-4">Search Results for "{query}"</h1>
      {filtered.length > 0 ? (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {filtered.map((item) => (
            <div key={item._id} className="border p-2 rounded">
              <img src={item.img} alt={item.desc} className="w-full h-40 object-cover" />
              <h2 className="mt-2 font-semibold">{item.desc}</h2>
              <p className="text-green-600 font-bold">${item.price}</p>
                <div className='flex gap-4 text-sm mt-2'>
                            <WishlistButton product={item}/>
                            <button onClick={()=>addtoCart(item)} className='flex items-center gap-1 border border-green-600 p-2 rounded-3xl hover:bg-green-300 hover:transition-transform transition-all'>{item.btn2}<FaShoppingCart/> </button></div>
            </div>
          ))}
        </div>
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
};

export default SearchPage;
