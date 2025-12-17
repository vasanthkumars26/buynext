// frontend/src/context/Cartcon.jsx
import React, { createContext, useContext, useEffect, useState } from "react";

const Cartcon = createContext();
const API_URL = "https://buynext-backend.vercel.app";

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
  const [orders, setOrders] = useState(() => safeJSONParse("orders"));

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
      const data = await res.json();
      if (Array.isArray(data)) setOrders(data);
    } catch (err) {
      console.error("Fetch orders error:", err);
    }
  };

  useEffect(() => {
    fetchCart();
    fetchOrders();
  }, []);

  /* ======================================================
     CART LOGIC (AMAZON / FLIPKART STYLE)
     ====================================================== */

  const addtoCart = (product) => {
    setCart((prev) => {
      const existing = prev.find((item) => item.id === product.id);

      // 🔁 EXISTING PRODUCT → INCREASE QTY
      if (existing) {
        const updated = prev.map((item) =>
          item.id === product.id
            ? { ...item, qty: item.qty + 1 }
            : item
        );

        // backend sync using _id
        if (existing._id) {
          fetch(`${API_URL}/cart/${existing._id}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ qty: existing.qty + 1 }),
          }).catch(console.error);
        }

        return updated;
      }

      // 🆕 NEW PRODUCT
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
        .catch(console.error);

      return [...prev, newItem];
    });
  };

  const updateqty = (productId, mongoId, qty) => {
    if (qty < 1) return;

    // ✅ FRONTEND UPDATE
    setCart((prev) =>
      prev.map((item) =>
        item.id === productId ? { ...item, qty } : item
      )
    );

    // ✅ BACKEND UPDATE
    if (mongoId) {
      fetch(`${API_URL}/cart/${mongoId}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ qty }),
      }).catch(console.error);
    }
  };

  const removeFromCart = (mongoId, productId) => {
    setCart((prev) => {
      if (mongoId) {
        return prev.filter((item) => item._id !== mongoId);
      }
      return prev.filter((item) => item.id !== productId);
    });

    if (mongoId) {
      fetch(`${API_URL}/cart/${mongoId}`, {
        method: "DELETE",
      }).catch(console.error);
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
    const order = {
      userDetails,
      items: cart,
      total: cart.reduce((s, i) => s + i.price * i.qty, 0),
    };

    try {
      const res = await fetch(`${API_URL}/orders`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(order),
      });

      if (res.ok) {
        setCart([]);
        localStorage.removeItem("cart");
        fetchOrders();
      }
    } catch (err) {
      console.error(err);
    }
  };

  /* ---------- Products ---------- */
  const allproducts = [
    { id: 101, img: "https://lacozt.myshopify.com/cdn/shop/products/Product10.jpg", desc: "Structured Fedora Hat", price: 18.47, category: "Caps" },
    { id: 102, img: "https://lacozt.myshopify.com/cdn/shop/products/Product9.jpg", desc: "Regular Fit T-Shirt", price: 8.47, category: "T-Shirts" },
    { id: 103, img: "https://lacozt.myshopify.com/cdn/shop/products/Product11.jpg", desc: "Long Sleeve Sweatshirts", price: 15.47, category: "Hoodies" },
    { id: 104, img: "https://lacozt.myshopify.com/cdn/shop/products/Product12.jpg", desc: "Cotton Adjustable Caps", price: 23.47, category: "Caps" },
    { id: 201, img: "https://lacozt.myshopify.com/cdn/shop/products/Product11.jpg", desc: "Pull Over Hoodie", price: 12.47, category: "Hoodies" },
    { id: 202, img: "https://diesel.ie/cdn/shop/files/FadiaTeeT25061FF_4_533x.jpg", desc: "Women's Ribbed T-Shirt", price: 19.37, category: "T-Shirts" },
    { id: 203, img: "https://cdn11.bigcommerce.com/s-1xod74bove/images/stencil/1280x1280/attribute_rule_images/23931_source.jpg", desc: "Men's Pullover Hoodie", price: 13.67, category: "Hoodies" },
    { id: 204, img: "https://lacozt.myshopify.com/cdn/shop/products/Men_sSweatPulloverHoodie3.jpg", desc: "Performance T-Shirt", price: 10.47, category: "T-Shirts" },
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
      }}
    >
      {children}
    </Cartcon.Provider>
  );
};

export const useCart = () => useContext(Cartcon);


// frontend/src/context/Cartcon.jsx
// import React, { createContext, useContext, useEffect, useState } from "react";

// const Cartcon = createContext();

// const API_URL = "https://buynext-backend.vercel.app";

// // Utility to safely parse localStorage
// const safeJSONParse = (key) => {
//   try {
//     const data = localStorage.getItem(key);
//     return data ? JSON.parse(data) : [];
//   } catch (e) {
//     console.error(`Invalid JSON in localStorage for ${key}:`, e);
//     localStorage.removeItem(key);
//     return [];
//   }
// };

// export const CartProvider = ({ children }) => {
//   // Wishlist
//   const [wishlist, setWishlist] = useState(() => safeJSONParse("wishlist"));
//   useEffect(() => {
//     localStorage.setItem("wishlist", JSON.stringify(wishlist));
//   }, [wishlist]);

//   // Cart
//   const [cart, setCart] = useState(() => safeJSONParse("cart"));
//   useEffect(() => {
//     localStorage.setItem("cart", JSON.stringify(cart));
//   }, [cart]);

//   // Orders
//   const [orders, setOrders] = useState(() => safeJSONParse("orders"));

//   // Fetch cart safely
//   const fetchCart = async () => {
//     try {
//       const res = await fetch(`${API_URL}/cart`);
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const data = await res.json();
//       setCart(data);
//     } catch (err) {
//       console.error("Failed to fetch cart, using localStorage fallback:", err);
//       setCart(safeJSONParse("cart"));
//     }
//   };

//   // Fetch orders safely
//   const fetchOrders = async () => {
//     try {
//       const res = await fetch(`${API_URL}/orders`);
//       if (!res.ok) throw new Error(`Server error: ${res.status}`);
//       const data = await res.json();
//       setOrders(data);
//     } catch (err) {
//       console.error("Failed to fetch orders, using localStorage fallback:", err);
//       setOrders(safeJSONParse("orders"));
//     }
//   };

//   useEffect(() => {
//     fetchCart();
//     fetchOrders();
//   }, []);

//   // ------------------ CART FUNCTIONS ------------------

//   const addtoCart = async (product) => {
//     setCart((prev) => {
//       const existing = prev.find((p) => p._id === product._id);
//       if (existing) {
//         // Optimistic update
//         const updatedCart = prev.map((p) =>
//           p._id === product._id ? { ...p, qty: p.qty + 1 } : p
//         );
//         // Update backend asynchronously
//         fetch(`${API_URL}/cart/${existing._id}`, {
//           method: "PUT",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify({ ...existing, qty: existing.qty + 1 }),
//         }).catch(console.error);
//         return updatedCart;
//       } else {
//         const newItem = { ...product, qty: 1 };
//         // Add backend asynchronously
//         fetch(`${API_URL}/cart`, {
//           method: "POST",
//           headers: { "Content-Type": "application/json" },
//           body: JSON.stringify(newItem),
//         }).catch(console.error);
//         return [...prev, newItem];
//       }
//     });
//   };

//   const removeFromCart = (id) => {
//     // Optimistic: remove from state immediately
//     setCart((prev) => prev.filter((item) => item._id !== id));

//     // Async backend delete
//     fetch(`${API_URL}/cart/${id}`, { method: "DELETE" }).catch(console.error);
//   };

//   const updateqty = (id, qty) => {
//     // Optimistic update
//     setCart((prev) =>
//       prev.map((item) => (item._id === id ? { ...item, qty } : item))
//     );

//     // Async backend update
//     fetch(`${API_URL}/cart/${id}`, {
//       method: "PUT",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ _id: id, qty }),
//     }).catch(console.error);
//   };

//   // ------------------ WISHLIST ------------------
//   const addToWishlist = (product) => {
//     setWishlist((prev) => {
//       if (!prev.find((item) => item._id === product._id)) return [...prev, product];
//       return prev;
//     });
//   };

//   const removeFromWishlist = (id) => {
//     setWishlist((prev) => prev.filter((item) => item._id !== id));
//   };

//   // ------------------ PLACE ORDER ------------------
//   const placeOrderWithUser = async (userDetails) => {
//     if (cart.length === 0) throw new Error("Cart is empty");
//     const total = cart.reduce((sum, item) => sum + item.price * item.qty, 0);
//     const newOrder = { userDetails, items: cart, total, date: new Date() };

//     try {
//       const res = await fetch(`${API_URL}/orders`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify(newOrder),
//       });

//       if (!res.ok) throw new Error("Server error while placing order");

//       const savedOrder = await res.json();
//       setOrders((prev) => [...prev, savedOrder]);
//       setCart([]);
//     } catch (err) {
//       console.error("Failed to place order, using local fallback:", err);
//       setOrders((prev) => [...prev, newOrder]);
//       setCart([]);
//     }
//   };

//   // ------------------ ALL PRODUCTS EXAMPLE ------------------
//   const allproducts = [
//     { _id: "1", img: "https://lacozt.myshopify.com/cdn/shop/products/Product10.jpg", desc: "Structured Fedora Hat", price: 18.47, category: "Caps" },
//     { _id: "2", img: "https://lacozt.myshopify.com/cdn/shop/products/Product9.jpg", desc: "Regular Fit T-Shirt", price: 8.47, category: "T-Shirts" },
//     { _id: "3", img: "https://media.istockphoto.com/id/1142211733/photo/front-of-sweatshirt-with-hood-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=inMPwtP-ebqhXD9_A3bHETPkyC37x0rFNSLYgf6rLMM=", desc: "Long Sleeve Sweatshirts", price: 15.47, category: "Hoodies" },
//     { _id: "4", img: "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBwgHBgkIBwgKCgkLDRYPDQwMDRsUFRAWIB0iIiAdHx8kKDQsJCYxJx8fLT0tMTU3Ojo6Iys/RD84QzQ5OjcBCgoKDQwNGg8PGjclHyU3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3Nzc3N//AABEIAJQA4QMBIgACEQEDEQH/xAAcAAEAAQUBAQAAAAAAAAAAAAAABAIDBQYHAQj/xAA6EAABAwIEAggCCQMFAAAAAAABAAIDBBEFEiExBkEHEyJRYXGBkTKxFCMzQlKhwdHwFWJyJHOS4fH/xAAVAQEBAAAAAAAAAAAAAAAAAAAAAf/EABQRAQAAAAAAAAAAAAAAAAAAAAD/2gAMAwEAAhEDEQA/AO4oiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIiICIiAiIgIsXiuO0GFWbVzgSOF2xtF3LUMV6SGCJww6mdcGwe/UuPc1o+ZQdCui4nUccY7PKM1VNG5/wsa0Bo9Qr9PxtjMNh9MfL3veBb2Qdlui43VdIOMzvaxkkUb2fgFsxU2i4/wAUpS19Q5lQ370TmgG3gUHWEWtYZxtg9fG1xmNO42zNlG3qthimjmYHxPa9p5tN0FxERAREQEREBERAREQEREBERAREQEREBEQ6IPCtL4s41hw5j6ehdnn2zcgo3SDxaaCb+mUT7SZQZnt5X+77arlOJ1zpHucHkk8zugl1+LyvfI+eUy1M25JzZVjHVkjJXshu4tBANtL21KiR5r5i7V2jR496mQ0kYb1PWkteLukEgJA56eKKv0ks0sRkmGjxZgB+6FUHgkZNbd/NUSztjadb2FmjwViKQlwc8AWCC/M+zQXtsO+9lDijdFKXRTSWJ0a5xKmOkDo7EC/cQrUcOdhc8kW0t3oJVPUuhu64uN7jRZnAeKJcFxBzgXtiAuQ06EeXl8vJay4jq3MJ21vdW5pXM6l1gQQQ4eF9kH0bguM0+KxfVkCVoDiy+47x4LKLhfD2NVFJSRvp3H6RCcrLHmNLfIepXXeGsagx3DI6uAgP+GWPmx3MIjLol0QEREBERAREQEREBERAREQEREBRsSrI6Cgnq5iAyJhcf2Uk7LTOkvEOpw6GjB+1d1j/APFuvzt7IOUYzVTVlfU1cws+Vxc4nvPJYSYdokXN1Mrp5JhLpa+o8Vi3PlZclpJA7PeCiq87y8kENYwW0UhtRIIm57Ev7RNuXJQpA/IxuYC5DXC26vGRpebGwFgEFT5XFxDtx+QVTJm2DXO0PMo7LICPvA7lRp4bNJaSeeiCc6QsFr5hdW+vfc2cADyBUASlgs8nwsq2yWyn5Iid8YcL28F62Fr42ZzYhxIPdoo0UpJ1NxvZWqhz5JomX7LLuLQUGx0ThAHkEfalwI2Og/VZ7DcdqMExeOrox9VJZs8XJ/8A33LUIqgsaGP+J4zEE7H+aLItnE8RbG4XzXHoivoWjqI6umhqITmjlYHtPeCr60/oxrzVYDJTvdd1LM5gH9p7Q+ZHotwRBERAREQEREBERAREQEREBEXl0Bzg1pc4gAC5J5LivG3EhxzF5YsMZJLTxHq88Y0fb+46DW63bjbiCkfSSYXBI6VzyBP1TrDL+G47+dlzmoqXW6puSJjdA1jQGtHcABogwNVS4i8WY2livs2SZxd+TSoD6PEqXNnpGSOOzo5r297a+i2EzxRCzW5i46uOqoMwfZrtAfxGyK1+neIZQypY6KU79c2wH6KaYqZzTlIzEW7x7q8JHZ3i+cX2IuFZlo4HWdG007ybkx6t9W7e1kFnqzETbN5pUNytY5hvm3vyXkplo/tGiSMbSMuW+o5fJeueJYQ/MLaEa6FBDnjD3OI0Kssux9nakbKW5jjJoqZm2bckHx5oj2EG+Yi4I71TE2OSQvymxPM6m38CuUhbJDMTq5ouB6K5SH6h7+zmaA0Agbn/AMQW3OAcXOFidlJwycsqowdAXC/grNWwskaNLWCjwOd17Tf7yK7J0TS2rcSiOhLGH2uulLlXRYD/AFqpcQ4EtI8Nh+66qiCIiAiIgIiICIiAiIgIisVdVFSQOmmdlY0ep8kFySVkTHPkcGsaLuc42AC5txlx0XZqPCCREfjm1Bd5dwUXi3iOoxWR1OySOmpm2tG993O8Tb+BahNTxFxBroTexDe0b+wQQJcTmkJ7bje9yNSfVR/pEjnXzGwFzd2g9Vk5MOdLFlgqIX2GuuU+yx8uHTxG0jS0WttuivW1oZ8Tb62zB3Lko01SXva4jQ30VuogcXHNYbAgHU2VGrWuzNI7QtlQT6WUhl7XzcyqZpBe4sCVDEmRpa0XykjKP3VL5Glo33QSjI+1m3vbksfNC4n/AE1onncX7JP6K+2fIFZfKXuzc7IiPFVPje2OqYWPvoeR9VOIEzGk635hR5Q2aPI9oIta3JRA2el7UJMjAdWE6jyQZKntDK9xbcFpAb3qYxsc7SyMBl3fILDR4iXva27mFo1B5rLSzNjpnOYDme32v/Cgj1Mhmm00YNAV7TxjOdQQFaiuW3Lde4qdSAGRuZoDc13Hw5orq/RZEDUTyM1HVBztNidLezV0dax0eYcKHh2J5H1lSTK4+GzR7BbOiCIiAiIgIiICIiAiIgiYpXQ4bQy1dQbMYNhuTyAXFuK+NsSxnEv6bh1PLUVLjZtJTkkN8HEbnvsu2V9HT19K+mq4+sifuLkfmNlgsP4JwPDHF1BRthcdS693HzJ1KDTOEejWsnezEOMarrHHtR4bA60Tf9wj4j4a+ZXUoqeCKNrIoY2MaLNa1oAHkFRT0ohADXE28VIQQ6zCsPrm2rKKnm/zjBPutexHgfDXtc6gklo3fhDi+P8A4n9FtqsVHwkIOLcR8Muo5D9IjYxg2niBcw+Y3atZqMOkisR2mO+Eg3Dl2nHaQzROHeFzPEIJ8MkdljzwOPbYG3/L9tUVqMweH2ubg3I2Vh4OUXO4v4LPT0EdUwy0Di62pad/TvWFnAIIcDnacpO1kFg3vvcW5apcX1BRwOthqSvXsIsCHd2iIqYzNqDrv5BXpITHlNtSV5S9W12aQ693JZCho6rFK6Olpoy5732HO2nPwQZPhfhaPGZfpDqZsuQ2ALdM3j6LOV/RhXOYHUs2UDaMjQeq6ZwngEOC4XFAGguAuSRuTuVnrDmEHzbiXC+O4e9xno3FoOjo9QvMJw7EK2ujpqWklkkccuXLoPEr6QfDG/442u8wvIqeGIkxQxsJ3LWgII+D0hoMMpKRzg50MTWEjmQFNXlgvUBERAREQEREBERAREQEREBERAVLm3VSIIk9G2VpHeFruKcOiYG7dLLbV5ZBxzFuD56eQz0V2vvct5O81rFfRipkMU0Zp6sHd2z/AD/dfQ8kEcgs9oKxGJ8LYViTSKmnaboPnWqw+akkDZWWG4PI+KsyXcGttzXc5ujmkLgafEKiMD7rmh4/NVU/RxhjJGvqJTKQb9mFrUVxjDcDrsVq2Q0cD3Zj8WwXb+CuDqfh+na+QB9U4dty2LDsMpMOiEdJC1gHPmVMRHi9REBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQEREBERAREQf/9k=", desc: "Cotton Adjustable Caps", price: 23.47, category: "Caps" },
//     { _id: "20", img: "https://5.imimg.com/data5/SELLER/Default/2024/4/408698097/GN/IJ/OI/13470856/men-t-shirts.jpg", desc: "Regular Fit T-Shirt", price: 8.47, category: "T-Shirts" },
//     { _id: "21", img: "https://media.istockphoto.com/id/1142211733/photo/front-of-sweatshirt-with-hood-isolated-on-white-background.jpg?s=612x612&w=0&k=20&c=inMPwtP-ebqhXD9_A3bHETPkyC37x0rFNSLYgf6rLMM=", desc: "Long Sleeve Sweatshirts", price: 15.47, category: "Hoodies" },
//     { _id: "22", img: "https://i.pinimg.com/736x/4c/f2/ac/4cf2ac9f5644b924d284028607d67066.jpg", desc: "Long Sleeve tshirt", price: 15.47, category: "Hoodies" },
//     { _id: "23", img: "https://assets.myntassets.com/dpr_1.5,q_30,w_400,c_limit,fl_progressive/assets/images/2025/SEPTEMBER/26/b7Kz7sOE_9f387c2f2efe4b05ab9135e724a096af.jpg", desc: "Long Sleeve tshirt", price: 15.47, category: "Hoodies" },

//   ];

//   return (
//     <Cartcon.Provider
//       value={{
//         wishlist,
//         addToWishlist,
//         removeFromWishlist,
//         cart,
//         addtoCart,
//         setCart,
//         updateqty,
//         removeFromCart,
//         orders,
//         placeOrderWithUser,
//         allproducts,
//       }}
//     >
//       {children}
//     </Cartcon.Provider>
//   );
// };

// export const useCart = () => useContext(Cartcon);
