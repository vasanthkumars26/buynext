// frontend/src/common/Navbar.jsx
import { signOut } from "firebase/auth";
import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import auth from "../../config/firebase";
import {
  FaAddressCard,
  FaShoppingCart,
  FaHome,
  FaHeart,
  FaBars,
  FaTimes,
  FaSearch,
} from "react-icons/fa";
import { useCart } from "../context/Cartcon";

const Navbar = () => {
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const handlesearchbtn = () => {
    if (search.trim() !== "") {
      navigate(`/search?query=${encodeURIComponent(search)}`);
      setSearch("")
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") handlesearchbtn();
  };

  const { wishlist, cart, orders } = useCart();

  const [log, setLog] = useState(false);
  const [banner, setBanner] = useState(true);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    auth.onAuthStateChanged((user) => {
      if (user) {
        navigate("/home");
        setLog(true);
      }
    });
    // eslint-disable-next-line
  }, []);

  const logout = () => {
    signOut(auth)
      .then(() => {
        setLog(false);
        navigate("/");
      })
      .catch(console.log);
  };

  return (
    <div>
      {/* Top Banner */}
      {banner && (
        <div className="fixed top-0 left-0 z-50 w-full bg-[#0053E2] text-white text-sm flex justify-between items-center px-4 py-2">
          <p>FREE SHIPPING on orders above ₹499 🎉</p>
          <button onClick={() => setBanner(false)} className="font-bold">
            ✕
          </button>
        </div>
      )}

      {/* Navbar */}
      <div
        className={`fixed ${banner ? "top-9" : "top-0"
          } left-0 z-40 w-full bg-[#0053E2] shadow-md`}
      >
        <div className="flex items-center justify-between px-4 py-3">

          {/* Left */}
          <div className="flex items-center gap-3">
            <button onClick={() => setMenuOpen(true)} className="lg:hidden">
              <FaBars className="text-xl text-white" />
            </button>

            <Link to="/home" className="text-2xl font-bold text-white tracking-wide">
              BUYNEXT
            </Link>
          </div>

          {/* Desktop Search */}
          {log && (
            <div className="hidden md:flex items-center w-[40%] relative">
              <FaSearch
                onClick={handlesearchbtn}
                className="absolute right-3 text-gray-400 cursor-pointer"
              />

              <input
                value={search}
                onChange={(e) => {
                  const value = e.target.value;
                  setSearch(value);

                  if (value.trim() === "") {
                    navigate("/search?query=");
                  }
                }}

                onKeyDown={handleKeyDown}
                placeholder="Search for products"
                className="w-full pl-3 pr-4 py-2  rounded-md outline-none text-gray-800"
              />
            </div>
          )}


          {/* Desktop Icons */}
          <div className="hidden lg:flex items-center gap-6 text-white">
            {log && (
              <Link to="/" className="relative group hover:scale-110 transition">
                <FaHome className="text-2xl" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition whitespace-nowrap">
                  Home
                </span>
              </Link>
            )}


            {log && (
              <Link to="/wishlist" className="relative group hover:scale-110 transition">
                <FaHeart className="text-xl" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Wishlist
                </span>
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1">
                  {wishlist.length}
                </span>
              </Link>
            )}


            {log && (
              <Link to="/cart" className="relative group hover:scale-110 transition">
                <FaShoppingCart className="text-xl" />
                <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                  Cart
                </span>
                <span className="absolute -top-2 -right-3 bg-red-500 text-white text-xs rounded-full px-1">
                  {cart.length}
                </span>
              </Link>
            )}


            {log && (
              auth.currentUser && auth.currentUser.uid === "CrA2flVHDlT53IqfpC036z4xpTQ2" && (
                <Link to="/admin" className="relative group hover:scale-110 transition">
                  <FaAddressCard className="text-xl" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Admin
                  </span>
                </Link>
              )
            )}


            {log && (
              <Link to="/orders" className="text-sm font-semibold hover:underline">
                Orders ({orders.length})
              </Link>
            )}
          </div>

          {/* Login / Logout */}
          {log ? (
            <button
              onClick={logout}
              className="hidden md:block bg-white text-[#0053E2] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="bg-white text-[#0053E2] px-4 py-2 rounded-md font-semibold hover:bg-gray-100 transition"
            >
              Login
            </button>
          )}
        </div>

        {/* Mobile Search */}
        {log && (
          <div className="md:hidden px-4 pb-3 relative">
            <FaSearch
              onClick={handlesearchbtn}
              className="absolute left-7 top-1/2 -translate-y-1/2 text-gray-400"
            />

            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products"
              className="w-full pl-10 pr-4 py-2 rounded-md outline-none text-gray-800"
            />
          </div>
        )}

      </div>

      {/* Backdrop */}
      {menuOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40"
          onClick={() => setMenuOpen(false)}
        />
      )}

      {/* Side Menu */}
      <div
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-[#0053E2] text-white shadow-lg transform transition-transform ${menuOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center p-4 border-b border-white/20">
          <h2 className="font-bold text-lg">Menu</h2>
          <FaTimes onClick={() => setMenuOpen(false)} className="cursor-pointer" />
        </div>

        <ul className="p-4 space-y-4">
          <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
          {log && <li><Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist</Link></li>}
          {log && <li><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart</Link></li>}
           {log && (
              auth.currentUser && auth.currentUser.uid === "CrA2flVHDlT53IqfpC036z4xpTQ2" && (
                <Link to="/admin" className="relative group hover:scale-110 transition">
                  <FaAddressCard className="text-xl" />
                  <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 bg-black text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition">
                    Admin
                  </span>
                </Link>
              )
            )}
          {log && <li><Link to="/orders" onClick={() => setMenuOpen(false)}>Orders</Link></li>}
          <li>
            {log ? (
              <button onClick={logout} className="font-semibold">
                Logout
              </button>
            ) : (
              <button
                onClick={() => {
                  navigate("/login");
                  setMenuOpen(false);
                }}
                className="font-semibold"
              >
                Login
              </button>
            )}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Navbar;
