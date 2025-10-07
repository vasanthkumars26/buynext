import React, { createContext, useContext, useEffect, useState } from "react";

const Cartcon = createContext();

// Vite env variable
const BASE_URL = import.meta.env.VITE_API_URL;

const safeJSONParse = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error(`Invalid JSON in localStorage for ${key}:`, e);
    localStorage.removeItem(key);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => safeJSONParse("wishlist"));
  const [cart, setCart] = useState(() => safeJSONParse("cart"));
  const [orders, setOrders] = useState(() => safeJSONParse("orders"));
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => localStorage.setItem("wishlist", JSON.stringify(wishlist)), [wishlist]);
  useEffect(() => localStorage.setItem("cart", JSON.stringify(cart)), [cart]);

  const fetchCart = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(`${BASE_URL}/cart`);
      if (!res.ok) throw new Error("Failed to fetch cart");
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Fetch Cart Error:", err);
      setError("Failed to load cart. Try again later.");
      setCart([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchOrders = async () => {
    try {
      const res = await fetch(`${BASE_URL}/orders`);
      if (!res.ok) throw new Error("Failed to fetch orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Fetch Orders Error:", err);
    }
  };

  useEffect(() => {
    fetchOrders();
    fetchCart();
  }, []);

  const allproducts = [
    { _id: 1, img: "https://lacozt.myshopify.com/cdn/shop/products/Product10.jpg?v=1597047059", desc: "Structured Fedora Hat", price: 18.47, category: "Caps" },
    { _id: 2, img: "https://lacozt.myshopify.com/cdn/shop/products/Product9.jpg?v=1597046790", desc: "Regular Fit T-Shirt", price: 8.47, category: "T-Shirts" },
    { _id: 3, img: "https://lacozt.myshopify.com/cdn/shop/products/Product11_329e9eaa-7056-4ee4-a8f8-1b6cd01a4ffe.jpg?v=1597047746", desc: "Long Sleeve Sweatshirts", price: 15.47, category: "Hoodies" },
    { _id: 4, img: "https://lacozt.myshopify.com/cdn/shop/products/Product12_90960967-e37e-4f11-ab69-4e876a3704ff.jpg?v=1597047912", desc: "Cotton Adjustable Caps", price: 23.47, category: "Caps" },
    { _id: 5, img: "https://lacozt.myshopify.com/cdn/shop/products/PulloverHoodie.jpg?v=1681801550&width=360", desc: "Pull Over Hoodie", price: 12.47, category: "Hoodies" },
    { _id: 6, img: "https://lacozt.myshopify.com/cdn/shop/products/Women_sRibbedT-Shirt3.jpg?v=1680848975&width=360", desc: "Women's Ribbed T-Shirt", price: 19.37, category: "T-Shirts" },
    { _id: 7, img: "https://lacozt.myshopify.com/cdn/shop/products/Men_sSweatPulloverHoodie3.jpg?v=1680848440&width=360", desc: "Men's Sweat Pullover Hoodie", price: 13.67, category: "Hoodies" },
    { _id: 8, img: "https://lacozt.myshopify.com/cdn/shop/products/PerformanceT-Shirt3.jpg?v=1680848622&width=360", desc: "Performance T-Shirt", price: 10.47, category: "T-Shirts" },
  ];

  const addtoCart = async (product) => {
    setLoading(true);
    setError(null);
    setCart((prev) => {
      const existing = prev.find((p) => p._id === product._id);
      if (existing) {
        return prev.map((p) => (p._id === product._id ? { ...p, qty: p.qty + 1 } : p));
      } else {
        return [...prev, { ...product, qty: 1 }];
      }
    });

    try {
      const existing = cart.find((p) => p._id === product._id);
      if (existing) {
        await fetch(`${BASE_URL}/cart/${existing._id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...existing, qty: existing.qty + 1 }),
        });
      } else {
        await fetch(`${BASE_URL}/cart`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ ...product, qty: 1 }),
        });
      }
      fetchCart();
    } catch (err) {
      console.error("Add to cart error:", err);
      setError("Failed to add to cart. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const removeFromCart = async (id) => {
    setLoading(true);
    setError(null);
    try {
      await fetch(`${BASE_URL}/cart/${id}`, { method: "DELETE" });
      fetchCart();
    } catch (err) {
      console.error("Remove from cart error:", err);
      setError("Failed to remove item. Try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateqty = async (id, qty) => {
    setLoading(true);
    setError(null);
    const item = cart.find((p) => p._id === id);
    if (!item) return;

    try {
      await fetch(`${BASE_URL}/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...item, qty }),
      });
      fetchCart();
    } catch (err) {
      console.error("Update quantity error:", err);
      setError("Failed to update quantity.");
    } finally {
      setLoading(false);
    }
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => (!prev.find((i) => i._id === product._id) ? [...prev, product] : prev));
  };
  const removeFromWishlist = (id) => setWishlist(wishlist.filter((item) => item._id !== id));

  const placeOrderWithUser = async (userDetails) => {
    if (cart.length === 0) return;
    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const newOrder = {
      userDetails,
      items: cart,
      total,
      date: new Date(),
    };

    setLoading(true);
    setError(null);

    try {
      await fetch(`${BASE_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      setCart([]);
      fetchOrders();
    } catch (err) {
      console.error("Place order error:", err);
      setError("Failed to place order.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Cartcon.Provider
      value={{
        wishlist,
        addToWishlist,
        removeFromWishlist,
        cart,
        addtoCart,
        setCart,
        updateqty,
        removeFromCart,
        orders,
        placeOrderWithUser,
        allproducts,
        loading,
        error,
      }}
    >
      {children}
    </Cartcon.Provider>
  );
};

export const useCart = () => useContext(Cartcon);
