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

export const CartProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => safeJSONParse("wishlist"));
  useEffect(() => {
    localStorage.setItem("wishlist", JSON.stringify(wishlist));
  }, [wishlist]);

  const [cart, setCart] = useState(() => {
    const storedcart = localStorage.getItem("cart");
    return storedcart ? JSON.parse(storedcart) : [];
  });

  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cart));
  }, [cart]);

  const fetchCart = async () => {
    try {
      const res = await fetch("http://localhost:4000/cart");
      const data = await res.json();
      console.log("Cart from server:", data);
      setCart(data);
    } catch (err) {
      console.log(err);
    }
  };

  const [orders, setOrders] = useState(() => {
    const storedOrder = localStorage.getItem("orders");
    return storedOrder ? JSON.parse(storedOrder) : [];
  });

  const fetchOrders = async () => {
    try {
      const res = await fetch("http://localhost:4000/orders");
      const data = await res.json();
      setOrders(data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const allproducts = [
    {
      _id: 1,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Product10.jpg?v=1597047059",
      desc: "Structured Fedora Hat",
      price: 18.47,
      category: "Caps",
    },
    {
      _id: 2,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Product9.jpg?v=1597046790",
      desc: "Regular Fit T-Shirt",
      price: 8.47,
      category: "T-Shirts",
    },
    {
      _id: 3,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Product11_329e9eaa-7056-4ee4-a8f8-1b6cd01a4ffe.jpg?v=1597047746",
      desc: "Long Sleeve Sweatshirts",
      price: 15.47,
      category: "Hoodies",
    },
    {
      _id: 4,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Product12_90960967-e37e-4f11-ab69-4e876a3704ff.jpg?v=1597047912",
      desc: "Cotton Adjustable Caps",
      price: 23.47,
      category: "Caps",
    },
    {
      _id: 5,
      img: "https://lacozt.myshopify.com/cdn/shop/products/PulloverHoodie.jpg?v=1681801550&width=360",
      desc: "Pull Over Hoodie",
      price: 12.47,
      category: "Hoodies",
    },
    {
      _id: 6,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Women_sRibbedT-Shirt3.jpg?v=1680848975&width=360",
      desc: "Women's Ribbed T-Shirt",
      price: 19.37,
      category: "T-Shirts",
    },
    {
      _id: 7,
      img: "https://lacozt.myshopify.com/cdn/shop/products/Men_sSweatPulloverHoodie3.jpg?v=1680848440&width=360",
      desc: "Men's Sweat Pullover Hoodie",
      price: 13.67,
      category: "Hoodies",
    },
    {
      _id: 8,
      img: "https://lacozt.myshopify.com/cdn/shop/products/PerformanceT-Shirt3.jpg?v=1680848622&width=360",
      desc: "Performance T-Shirt",
      price: 10.47,
      category: "T-Shirts",
    },
  ];

  // Add to cart
  const addtoCart = async (product) => {
    setCart((prev) => {
      const existing = prev.find((p) => p.pid === product._id);
      if (existing) {
        return prev.map((p) =>
          p.pid === product._id ? { ...p, qty: p.qty + 1 } : p
        );
      } else {
        return [...prev, { ...product, pid: product._id, qty: 1 }];
      }
    });

    const existing = cart.find((p) => p.pid === product._id);
    if (existing) {
      await fetch(`http://localhost:4000/cart/${existing._id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...existing, qty: existing.qty + 1 }),
      });
    } else {
      await fetch("http://localhost:4000/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...product, pid: product._id, qty: 1 }),
      });
    }
  };

  const removeFromCart = async (id) => {
    await fetch(`http://localhost:4000/cart/${id}`, { method: "DELETE" });
    fetchCart();
  };

  const updateqty = async (id, qty) => {
    const item = cart.find((p) => p._id === id);
    if (!item) return;
    const updated = { ...item, qty };
    await fetch(`http://localhost:4000/cart/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(updated),
    });
    fetchCart();
  };

  const addToWishlist = (product) => {
    setWishlist((prev) => {
      if (!prev.find((item) => item._id === product._id)) {
        return [...prev, product];
      }
      return prev;
    });
  };

  const removeFromWishlist = (id) => {
    setWishlist(wishlist.filter((item) => item._id !== id));
  };

  

  // placeorder
  const placeorder = async (userDetails) => {
    if (cart.length == 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
    const newOrder = {
      userDetails,
      id: Date.now(),
      items: cart,
      total,
      date: new Date().toLocaleString(),
    };

    await fetch("http://localhost:4000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    fetchOrders();
    setCart([]);
  };

  //2nd create pannathu
  const placeOrderWithUser = async (userDetails) => {
    if (cart.length === 0) return;

    const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);

    const newOrder = {
      userDetails, 
      items: cart,
      total,
      date: new Date(),
    };

    await fetch("http://localhost:4000/orders", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newOrder),
    });

    fetchOrders();
    setCart([]);
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
        placeorder,
        placeOrderWithUser,
        allproducts,
      }}
    >
      {children}
    </Cartcon.Provider>
  );
};

export const useCart = () => useContext(Cartcon);
