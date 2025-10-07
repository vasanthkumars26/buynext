import React, { createContext, useContext, useEffect, useState } from "react";

const Cartcon = createContext();

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

// Use localhost API
const API_URL = "http://localhost:4000";

export const CartProvider = ({ children }) => {
  // Wishlist
  const [wishlist, setWishlist] = useState(() => safeJSONParse("wishlist"));
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  // Cart
  const [cart, setCart] = useState(() => safeJSONParse("cart"));
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  // Orders
  const [orders, setOrders] = useState(() => safeJSONParse("orders"));

  // Fetch cart from server
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart`);
      const data = await res.json();
      setCart(data);
    } catch (err) {
      console.error("Error fetching cart:", err);
    }
  };

  // Fetch orders from server
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.error("Error fetching orders:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchOrders();
  }, []);

  // All products (example)
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

  // Add to Cart
  const addtoCart = async (product) => {
    try {
      setCart((prev) => {
        const existing = prev.find((p) => p._id === product._id);
        if (existing) {
          // Update quantity
          fetch(`${API_URL}/cart/${existing._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...existing, qty: existing.qty + 1 }),
          }).catch(console.error);

          return prev.map((p) =>
            p._id === product._id ? { ...p, qty: p.qty + 1 } : p
          );
        } else {
          // Add new item
          fetch(`${API_URL}/cart`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...product, qty: 1 }),
          }).catch(console.error);

          return [...prev, { ...product, qty: 1 }];
        }
      });
    } catch (err) {
      console.error("Error adding to cart:", err);
    }
  };

  // Remove from Cart
  const removeFromCart = async (id) => {
    try {
      await fetch(`${API_URL}/cart/${id}`, { method: "DELETE" });
      fetchCart();
    } catch (err) {
      console.error("Error removing cart item:", err);
    }
  };

  // Update quantity
  const updateqty = async (id, qty) => {
    const item = cart.find((p) => p._id === id);
    if (!item) return;
    const updated = { ...item, qty };
    try {
      await fetch(`${API_URL}/cart/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updated),
      });
      fetchCart();
    } catch (err) {
      console.error("Error updating qty:", err);
    }
  };

  // Wishlist
  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (!prev.find((item) => item._id === product._id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) => prev.filter((item) => item._id !== id));
  };

  // Place Order
  const placeOrderWithUser = async (userDetails) => {
    if (cart.length === 0) throw new Error("Cart is empty");

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const newOrder = {
      userDetails,
      items: cart.map(item => ({
        _id: item._id,
        desc: item.desc,
        price: item.price,
        qty: item.qty,
      })),
      total,
      date: new Date(),
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newOrder),
      });

      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || "Server error while placing order");
      }

      fetchOrders();
      setCart([]);
    } catch (err) {
      console.error(err);
      throw err;
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
      }}
    >
      {children}
    </Cartcon.Provider>
  );
};

export const useCart = () => useContext(Cartcon);
