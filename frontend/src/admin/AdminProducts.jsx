// frontend/src/admin/components/AdminProducts.jsx
// frontend/src/admin/components/AdminProducts.jsx
import React, { useEffect, useState } from "react";

const API = "https://buynext-backend.vercel.app";

export default function AdminProducts({ onProductsChange }) {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    desc: "",
    price: "",
    category: "",
    img: "",
    images: [],
    longDesc: "",
    qty: 1,
  });

  /* ---------- LOAD PRODUCTS ---------- */
  const loadProducts = async () => {
    try {
      const res = await fetch(`${API}/admin/products`);
      const data = await res.json();
      setProducts(data || []);
      onProductsChange && onProductsChange();
    } catch (err) {
      console.error("Failed to load admin products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    loadProducts();
  }, []);

  /* ---------- ADD / EDIT PRODUCT ---------- */
  const submit = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      price: Number(form.price),
      images: form.images.length ? form.images : [form.img],
    };

    try {
      if (editingId) {
        await fetch(`${API}/admin/products/${editingId}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      } else {
        await fetch(`${API}/admin/products`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
      }

      resetForm();
      loadProducts();
    } catch (err) {
      alert("Error saving product.");
      console.error(err);
    }
  };

  /* ---------- DELETE PRODUCT ---------- */
  const remove = async (id) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`${API}/admin/products/${id}`, { method: "DELETE" });
    loadProducts();
  };

  /* ---------- EDIT PRODUCT ---------- */
  const edit = (p) => {
    setEditingId(p._id);
    setForm({
      desc: p.desc || "",
      price: p.price || "",
      category: p.category || "",
      img: p.img || "",
      images: p.images || [],
      longDesc: p.longDesc || "",
      qty: p.qty || 1,
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetForm = () => {
    setEditingId(null);
    setForm({
      desc: "",
      price: "",
      category: "",
      img: "",
      images: [],
      longDesc: "",
      qty: 1,
    });
  };

  return (
    <div className="p-6 space-y-8 w-full">
      <h2 className="text-3xl font-bold text-blue-700 mb-4">Admin — Products</h2>

      {/* ---------- FORM ---------- */}
      <form
        onSubmit={submit}
        className="grid md:grid-cols-2 gap-6 p-6 "
      >
        <div className="flex flex-col  w-full gap-4 mx-auto">
          <input
            placeholder="Product Name"
            value={form.desc}
            onChange={(e) => setForm({ ...form, desc: e.target.value })}
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            type="number"
            placeholder="Price"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: e.target.value })}
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
            required
          />
          <input
            placeholder="Category"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Main Image URL"
            value={form.img}
            onChange={(e) => setForm({ ...form, img: e.target.value })}
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <textarea
            placeholder="Long Description"
            value={form.longDesc}
            onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />
          <input
            placeholder="Gallery URLs (comma separated)"
            value={form.images.join(",")}
            onChange={(e) =>
              setForm({ ...form, images: e.target.value.split(",").map(u => u.trim()) })
            }
            className="p-3 border rounded-lg shadow-sm focus:ring-2 focus:ring-blue-400"
          />

          <div className="flex gap-4 mt-2">
            <button
              type="submit"
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              {editingId ? "Update Product" : "Add Product"}
            </button>
            <button
              type="button"
              onClick={resetForm}
              className="px-6 py-2 bg-gray-200 text-black rounded-lg hover:bg-gray-300 transition"
            >
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* ---------- PRODUCTS LIST ---------- */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p._id}
            className="bg-white rounded-xl shadow hover:shadow-lg transition overflow-hidden"
          >
            <div className="w-full h-50 object-contain bg-gray-100 overflow-hidden">
              {p.img && (
                <img
                  src={p.img}
                  alt={p.desc}
                  className="w-full h-full object-cover"
                />
              )}
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h3 className="font-semibold text-black">{p.desc}</h3>
              <p className="text-blue-700 font-bold">₹{p.price}</p>
              <p className="text-gray-500 text-sm">{p.category}</p>
              <div className="flex gap-2 mt-2">
                <button
                  onClick={() => edit(p)}
                  className="flex-1 px-2 py-1 bg-blue-400 text-black hover:text-white rounded hover:bg-blue-500 transition"
                >
                  Edit
                </button>
                <button
                  onClick={() => remove(p._id)}
                  className="flex-1 px-2 py-1 bg-red-500 text-black rounded hover:bg-red-600 transition"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}




// frontend/src/admin/components/AdminProducts.jsx
// import React, { useEffect, useState } from "react";

// const API = "https://buynext-backend.vercel.app";

// export default function AdminProducts({ onProductsChange }) {
//   const [form, setForm] = useState({
//     desc: "",
//     price: "",
//     category: "",
//     img: "",
//     images: [],
//     longDesc: "",
//     qty: 1,
//   });

//   const [products, setProducts] = useState([]);

//   // fetch admin products
//   const loadProducts = async () => {
//     const res = await fetch(`${API}/admin/products`);
//     const data = await res.json();
//     setProducts(data);
//     onProductsChange && onProductsChange();
//   };

//   useEffect(() => {
//     loadProducts();
//   }, []);

//   const submit = async (e) => {
//     e.preventDefault();

//     await fetch(`${API}/admin/products`, {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({
//         ...form,
//         price: Number(form.price),
//         images: form.images.length ? form.images : [form.img],
//       }),
//     });

//     setForm({
//       desc: "",
//       price: "",
//       category: "",
//       img: "",
//       images: [],
//       longDesc: "",
//       qty: 1,
//     });

//     loadProducts();
//   };

//   const remove = async (id) => {
//     if (!confirm("Delete product?")) return;
//     await fetch(`${API}/admin/products/${id}`, { method: "DELETE" });
//     loadProducts();
//   };

//   return (
//     <div className="space-y-6">
//       {/* ADD PRODUCT */}
//       <form onSubmit={submit} className="space-y-3">
//         <input
//           placeholder="Product name"
//           value={form.desc}
//           onChange={(e) => setForm({ ...form, desc: e.target.value })}
//           className="w-full p-2 rounded"
//           required
//         />

//         <input
//           placeholder="Price"
//           type="number"
//           value={form.price}
//           onChange={(e) => setForm({ ...form, price: e.target.value })}
//           className="w-full p-2 rounded"
//           required
//         />

//         <input
//           placeholder="Category"
//           value={form.category}
//           onChange={(e) => setForm({ ...form, category: e.target.value })}
//           className="w-full p-2 rounded"
//         />

//         <input
//           placeholder="Main image URL"
//           value={form.img}
//           onChange={(e) => setForm({ ...form, img: e.target.value })}
//           className="w-full p-2 rounded"
//         />

//         <textarea
//           placeholder="Long description"
//           value={form.longDesc}
//           onChange={(e) => setForm({ ...form, longDesc: e.target.value })}
//           className="w-full p-2 rounded"
//         />

//         <button className="px-4 py-2 bg-blue-600 rounded text-white">
//           Add Product
//         </button>
//       </form>

//       {/* PRODUCTS LIST */}
//       <div className="grid grid-cols-1 gap-3">
//         {products.map((p) => (
//           <div key={p._id} className="flex justify-between bg-white/10 p-3 rounded">
//             <div>
//               <div className="font-semibold">{p.desc}</div>
//               <div className="text-sm">₹{p.price}</div>
//             </div>
//             <button
//               onClick={() => remove(p._id)}
//               className="text-red-500"
//             >
//               Delete
//             </button>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }

