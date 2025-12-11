import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useCart } from "../context/Cartcon";
import { FaDoorOpen, FaHeart, FaLongArrowAltLeft, FaShoppingCart } from "react-icons/fa";
import AppTheme from "../common/Apptheme";

const SearchPage = () => {
  const { wishlist, addToWishlist, removeFromWishlist, allproducts, addtoCart } = useCart(); 
  const location = useLocation();
  const navigate = useNavigate()

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
        className={`flex items-center justify-center gap-1 px-3 py-2 rounded-full text-sm font-medium transition-all ${
          isWishlisted
            ? "bg-red-500 text-white hover:bg-red-600"
            : "bg-gradient-to-r from-indigo-300 to-cyan-500 text-white hover:from-cyan-400 hover:to-indigo-600"
        }`}
      >
        <FaHeart />
      </button>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br p-4 sm:p-6 md:p-8 mt-[8%]" >
      <p onClick={()=>navigate("/home")} className="font-bold text-3xl hover:underline cursor-pointer hover:-translate-y-1 transition transform" ><FaLongArrowAltLeft/></p>
      <h1 className="text-3xl font-bold mb-6 text-center text-white">
        Search Results for "{query}"
      </h1>

      {filtered.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filtered.map((item) => (
            <div
              key={item._id}
              className="bg-white rounded-2xl shadow-md overflow-hidden hover:shadow-xl transition-shadow"
            >
              <img
                src={item.img}
                alt={item.desc}
                className="w-full h-48 sm:h-52 md:h-56 object-contain"
              />
              <div className="p-4 flex flex-col gap-2">
                <h2 className="font-semibold text-lg text-gray-800">{item.desc}</h2>
                <p className="text-indigo-600 font-bold text-md">${item.price}</p>
                <div className="flex gap-3 mt-2">
                  <WishlistButton className='text-blue-400' product={item} />
                  <button
                    onClick={() => addtoCart(item)}
                    className="flex items-center justify-center gap-2 px-3 py-2 rounded-full border border-cyan-600 text-indigo-600 font-medium hover:bg-indigo-200 transition"
                  >
                    {item.btn2} <FaShoppingCart />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-500 mt-10 text-lg">
          No products found.
        </p>
      )}
    </div>
  );
};

export default SearchPage;
