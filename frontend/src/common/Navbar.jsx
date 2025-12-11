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
} from "react-icons/fa";
import { useCart } from "../context/Cartcon";
import Wishlist from "../components/Wishlist";

// Theme components — same import path you had
import { GlassCard, CTAButton, AccentText } from "./Apptheme";

const Navbar = () => {
  const [search, setSearch] = useState("");
  // handlesearchbtn — logic unchanged
  const handlesearchbtn = () => {
    if (search.trim !== "") {
      navigate(`/search?query=${encodeURIComponent(search)}`);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handlesearchbtn();
    }
  };

  const { wishlist, cart, orders } = useCart();

  const navigate = useNavigate();
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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const logout = () => {
    signOut(auth)
      .then((res) => {
        setLog(false);
        navigate("/");
      })
      .catch((err) => {
        console.log(err);
      });
  };

  return (
    <div>
      {/* banner — alignment & behavior preserved, visual restyle only */}
      {banner && (
        <div className="fixed top-0 left-0 z-50 w-full flex justify-center bg-white/6 text-sm text-white/90 py-2 glass">
          <p className="px-2">FREE SHIPPING for orders over $49 - Get some inspirational shirts for your loved one today!</p>
          <button onClick={() => setBanner(false)} className="hover:cursor-pointer px-3">
            X
          </button>
        </div>
      )}

      {/* main nav container
          - when banner is visible push navbar down using top-10 (same height as banner)
          - left-0 & w-full so the bar is flush with viewport */
      }
      <div
        className={`fixed ${banner ? "top-10" : "top-0"} left-0 z-40 w-full flex items-center justify-between md:justify-around glass border-b border-white/10 shadow-lg px-4 py-3`}
      >
        {/* menu toggle (mobile) */}
        <div className="mr-2 lg:hidden md:block">
          <button aria-label="Open menu" onClick={() => setMenuOpen(true)} className="text-white">
            <FaBars className="cursor-pointer text-xl" />
          </button>
        </div>

        {/* logo */}
        <div>
          <Link to="/home" className="mr-2 text-2xl font-bold inline-flex items-center gap-2">
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-cyan-300 to-indigo-400">BuyNext</span>
          </Link>
        </div>

        {/* desktop search (only visible md+) */}
        {log && (
          <div className="hidden md:flex items-center sm:items-stretch gap-2 w-full md:w-[40%] text-white">
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="Search products..."
              className="w-full sm:flex-1 rounded-2xl p-3 outline-none bg-transparent placeholder-white/60 border border-white/8"
            />
            <button
              onClick={handlesearchbtn}
              disabled={!search.trim()}
              className={`px-4 py-2 rounded-2xl text-sm sm:text-base font-semibold transition-transform transform ${!search.trim() ? "opacity-40 cursor-not-allowed" : "hover:scale-105"} bg-gradient-to-r from-cyan-400 to-indigo-500 text-gray-900`}
            >
              Search
            </button>
          </div>
        )}

        {/* icon group (desktop lg+) */}
        <div className="hidden lg:flex items-center gap-8">
          {log && (
            <div className="relative group">
              <Link to="/">
                <FaHome className="text-2xl" />
              </Link>
              <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Home
              </span>
            </div>
          )}

          {log && (
            <div className="relative group">
              <Link to="/wishlist" className="flex">
                <FaHeart className="text-2xl relative z-10" />
                <span className="absolute -top-2 -right-4 bg-white/6 rounded-full text-red-500 font-bold px-2 z-20">{wishlist.length}</span>
              </Link>
              <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Wishlist
              </span>
            </div>
          )}

          {log && (
            <div className="relative group">
              <Link to="/cart" className="flex">
                <FaShoppingCart className="text-2xl font-normal relative z-10" />
                <span className="absolute -top-2 -right-4 bg-white/6 rounded-full text-red-600 font-bold px-2 z-20">{cart.length}</span>
              </Link>
              <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Cart
              </span>
            </div>
          )}

          {log && (
            <div className="relative group">
              <Link to="/blogs">
                <FaAddressCard className="text-2xl" />
              </Link>
              <span className="absolute bottom-[-30px] left-1/2 -translate-x-1/2 bg-gray-900 text-white text-xs rounded px-2 py-1 opacity-0 group-hover:opacity-100 transition-opacity">
                Blogs
              </span>
            </div>
          )}

          {log && (
            <div className="bg-white/6 p-2 rounded-xl">
              <Link to="/orders" className="flex items-center">
                Your Orders!
                <span className="flex items-center text-red-600 font-extrabold rounded-full ml-2">({orders.length})</span>
              </Link>
            </div>
          )}
        </div>

        {/* login/logout button (kept behavior) */}
        <div>
          {log ? (
            <button
              onClick={logout}
              className="hidden md:block ml-6 bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 rounded-2xl text-gray-900 hover:scale-105 transition-transform shadow"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="ml-2 bg-gradient-to-r from-cyan-400 to-indigo-500 px-4 py-2 rounded-2xl text-gray-900 hover:scale-105 transition-transform shadow"
            >
              Login
            </button>
          )}
        </div>
      </div>

      {/* MOBILE SEARCH BAR (visible on small screens, hidden on md+) */}
      <div className="md:hidden px-4 py-2 bg-transparent" style={{ marginTop: banner ? 56 : 0 }}>
        <div className="w-full flex items-center gap-2">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Search products..."
            className="w-full rounded-2xl p-3 outline-none bg-white/6 placeholder-white/60 border border-white/8 text-sm"
            aria-label="Mobile search"
          />
          <button
            onClick={handlesearchbtn}
            disabled={!search.trim()}
            className={`px-3 py-2 rounded-2xl text-sm font-semibold ${!search.trim() ? "opacity-40 cursor-not-allowed" : "bg-gradient-to-r from-cyan-400 to-indigo-500 text-gray-900 hover:scale-105"}`}
            aria-label="Mobile search button"
          >
            Search
          </button>
        </div>
      </div>

      {/* Backdrop (when menu open) */}
      {menuOpen && (
        <div
          className="fixed inset-0 z-45 bg-black/40"
          onClick={() => setMenuOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* side menu — same structure, visual restyle only */}
      <div className={`fixed top-0 left-0 h-full w-64 z-50 transform transition-transform duration-300 ${menuOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <GlassCard className="h-full p-0">
          <div className="flex justify-between items-center p-4 border-b">
            <h2 className="text-xl font-bold">Menu</h2>
            <button onClick={() => setMenuOpen(false)} aria-label="Close menu">
              <FaTimes size={24} className="cursor-pointer" />
            </button>
          </div>
          <ul className="p-4 space-y-6 text-lg">
            <li><Link to="/" onClick={() => setMenuOpen(false)}>Home</Link></li>
            {log && <li><Link to="/wishlist" onClick={() => setMenuOpen(false)}>Wishlist ({wishlist.length})</Link></li>}
            {log && <li><Link to="/cart" onClick={() => setMenuOpen(false)}>Cart ({cart.length})</Link></li>}
            <li><Link to="/blogs" onClick={() => setMenuOpen(false)}>Blogs</Link></li>
            {log && <li><Link to="/orders" onClick={() => setMenuOpen(false)}>Orders ({orders.length})</Link></li>}
            <li>
              {log ? (
                <button onClick={logout} className="text-red-500">Logout</button>
              ) : (
                <button onClick={() => { navigate("/login"); setMenuOpen(false); }}>Login</button>
              )}
            </li>
          </ul>
        </GlassCard>
      </div>

      {/* small tooltip + glass styles (keeps file self-contained) */}
      <style>{`
        .glass { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.06); backdrop-filter: blur(6px); }
        .tooltip { position: absolute; bottom: -36px; left: 50%; transform: translateX(-50%); background: rgba(17,24,39,0.9); color: white; padding: 6px 8px; border-radius: 6px; font-size: 12px; opacity: 0; transition: opacity .18s; pointer-events: none; white-space: nowrap; }
        .group:hover .tooltip { opacity: 1; }
      `}</style>
    </div>
  );
};

export default Navbar;
