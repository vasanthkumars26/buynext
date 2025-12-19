import React, { createContext, useContext, useEffect, useState } from "react";

const Cartcon = createContext();

/* ---------- AUTO API URL ---------- */
const API_URL =
  window.location.hostname === "localhost"
    ? "http://localhost:4000"
    : "https://buynext-backend.vercel.app";

/* ---------- Safe LocalStorage ---------- */
const safeJSONParse = (key) => {
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    localStorage.removeItem(key);
    return [];
  }
};

export const CartProvider = ({ children }) => {
  /* ---------- State ---------- */
  const [wishlist, setWishlist] = useState(() => safeJSONParse("wishlist"));
  const [cart, setCart] = useState(() => safeJSONParse("cart"));
  const [orders, setOrders] = useState([]);

  /* ---------- Persist ---------- */
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  /* ---------- Fetch Cart ---------- */
  const fetchCart = async () => {
    try {
      const res = await fetch(`${API_URL}/cart`);
      const data = await res.json();
      if (Array.isArray(data)) setCart(data);
    } catch (err) {
      console.error("Fetch cart error:", err);
    }
  };

  /* ---------- Fetch Orders ---------- */
  const fetchOrders = async () => {
    try {
      const res = await fetch(`${API_URL}/orders`);
      const result = await res.json();

      if (Array.isArray(result?.data)) {
        setOrders(result.data);
      } else if (Array.isArray(result)) {
        setOrders(result);
      } else {
        setOrders([]);
      }
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchOrders();
  }, []);

  /* ---------- Cart Logic ---------- */
  const addtoCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      if (existing) {
        const updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );

        if (existing._id) {
          fetch(`${API_URL}/cart/${existing._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qty: existing.qty + 1 }),
          }).catch(() => {});
        }

        return updated;
      }

      const newItem = { ...product, qty: 1 };

      fetch(`${API_URL}/cart`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newItem),
      })
        .then((res) => res.json())
        .then((saved) => {
          setCart((curr) =>
            curr.map((i) =>
              i.id === product.id ? { ...i, _id: saved._id } : i
            )
          );
        })
        .catch(() => {});

      return [...prev, newItem];
    });
  };

  const updateqty = (productId, mongoId, qty) => {
    if (qty < 1) return;

    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty } : item
      )
    );

    if (mongoId) {
      fetch(`${API_URL}/cart/${mongoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      }).catch(() => {});
    }
  };

  const removeFromCart = (mongoId, productId) => {
    setCart((prev) =>
      mongoId
        ? prev.filter((item) => item._id !== mongoId)
        : prev.filter((item) => item.id !== productId)
    );

    if (mongoId) {
      fetch(`${API_URL}/cart/${mongoId}`, {
        method: "DELETE",
      }).catch(() => {});
    }
  };

  /* ---------- Wishlist ---------- */
  const addToWishlist = (product) => {
    setWishlist((prev) =>
      prev.find((p) => p.id === product.id) ? prev : [...prev, product]
    );
  };

  const removeFromWishlist = (id) => {
    setWishlist((prev) =>
      prev.filter((item) => item.id !== id && item._id !== id)
    );
  };

  /* ---------- Orders ---------- */
  const placeOrderWithUser = async (userDetails) => {
    const cleanItems = cart.map(({ _id, ...rest }) => rest);

    const order = {
      userDetails,
      items: cleanItems,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (!res.ok) throw new Error("Order failed");

      const savedOrder = await res.json();
      setCart([]);
      localStorage.removeItem("cart");
      setOrders((prev) => [savedOrder, ...prev]);
      fetchOrders();
    } catch (err) {
      console.error("Place order error:", err);
    }
  };

  const allproducts = [
    { id: 101, img: "https://lacozt.myshopify.com/cdn/shop/products/Product10.jpg", desc: "Structured Fedora Hat", price: 18.47, category: "Caps" },
    { id: 102, img: "https://lacozt.myshopify.com/cdn/shop/products/Product9.jpg", desc: "Regular Fit T-Shirt", price: 8.47, category: "T-Shirts" },
    { id: 103, img: "https://lacozt.myshopify.com/cdn/shop/products/Product11.jpg", desc: "Long Sleeve Sweatshirts", price: 15.47, category: "Hoodies" },
    { id: 104, img: "https://lacozt.myshopify.com/cdn/shop/products/Product12.jpg", desc: "Cotton Adjustable Caps", price: 23.47, category: "Caps" },
  ];

  return (
    <Cartcon.Provider
      value={{
        cart,
        wishlist,
        orders,
        addtoCart,
        updateqty,
        removeFromCart,
        addToWishlist,
        removeFromWishlist,
        placeOrderWithUser,
        allproducts,
        setCart,
        fetchOrders,
        fetchCart,
      }}
    >
      {children}
    </Cartcon.Provider>
  );
};

export const useCart = () => useContext(Cartcon);
