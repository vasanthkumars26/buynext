import React, { useEffect } from "react";
import { useLocation, useNavigate, Link } from "react-router-dom";
import { useCart } from "../context/Cartcon";
import { FaHeart, FaShoppingCart, FaLongArrowAltLeft } from "react-icons/fa";
import { motion } from "framer-motion";

const SearchPage = () => {
  const {
    wishlist = [],
    addToWishlist,
    removeFromWishlist,
    allproducts = [],
    addtoCart,
    cart = [],
  } = useCart();

  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // get query
  const queryParams = new URLSearchParams(location.search);
  const query = queryParams.get("query")?.toLowerCase() || "";

  // filter products
  const filtered = allproducts.filter(
    (item) =>
      item.desc.toLowerCase().includes(query) ||
      item.category.toLowerCase().includes(query)
  );

  const WishlistButton = ({ product }) => {
    const isWishlisted = wishlist.find((w) => w._id === product._id);

    return (
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={() =>
          isWishlisted
            ? removeFromWishlist(product._id)
            : addToWishlist(product)
        }
        className={`flex items-center gap-2 px-3 py-2 rounded-full text-sm font-medium ${
          isWishlisted
            ? "bg-red-500 text-white"
            : "bg-gray-100 text-black shadow-md"
        }`}
      >
        <FaHeart />
      </motion.button>
    );
  };

  return (
    <div className="mt-[8%] px-4 sm:px-6 md:px-8">
      {/* Back */}
      <p
        onClick={() => navigate("/home")}
        className="font-bold text-3xl cursor-pointer hover:-translate-y-1 transition inline-block"
      >
        <FaLongArrowAltLeft />
      </p>

      <h1 className="text-3xl font-bold my-6 text-center text-black">
        Search Results for "{query}"
      </h1>

      {filtered.length === 0 ? (
        <p className="text-center text-gray-500 text-lg mt-20">
          No products found.
        </p>
      ) : (
        <section className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5">
          {filtered.map((product) => {
            const isInCart = cart.find((c) => c._id === product._id);

            return (
              <motion.article
                key={product._id}
                whileHover={{ y: -6 }}
                transition={{ type: "spring", stiffness: 200, damping: 18 }}
                className="glass-dark rounded-2xl p-3"
              >
                {/* Product link */}
                <Link
                  to={`/product/${product._id}`}
                  state={{ product }}
                  className="block"
                >
                  <div className="w-full aspect-[1/1] overflow-hidden rounded-xl">
                    <img
                      src={product.img}
                      alt={product.desc}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <h2 className="mt-3 font-semibold text-black text-sm sm:text-base">
                    {product.desc}
                  </h2>
                </Link>

                <p className="text-blue-900 font-bold mt-1">
                  ${product.price}
                </p>

                <div className="flex gap-3 mt-3">
                  <WishlistButton product={product} />

                  <motion.button
                    whileHover={{ scale: isInCart ? 1 : 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => {
                      if (!isInCart) addtoCart(product);
                    }}
                    className={`flex items-center gap-2 px-3 py-2 rounded-2xl text-sm font-medium ${
                      isInCart
                        ? "bg-green-500 text-white cursor-default"
                        : "bg-white/6 text-black border border-gray-300 hover:shadow-md"
                    }`}
                  >
                    {isInCart ? "Added" : "Add to Cart"} <FaShoppingCart />
                  </motion.button>
                </div>
              </motion.article>
            );
          })}
        </section>
      )}

      {/* Same glass style as your app */}
      <style>{`
        .glass-dark {
          background: rgba(255,255,255,0.85);
          border: 1px solid rgba(0,0,0,0.06);
          backdrop-filter: blur(6px);
        }
      `}</style>
    </div>
  );
};

export default SearchPage;
