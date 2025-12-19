import React, { useEffect, useState } from "react";
import AdminProducts from "./AdminProducts";
import AdminBlogs from "./AdminBlogs";
import auth from "../../config/firebase";

const ADMIN_UID = "CrA2flVHDlT53IqfpC036z4xpTQ2";

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const [admin, setAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  /* ---------- AUTH CHECK ---------- */
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      setAdmin(!!(user && user.uid === ADMIN_UID));
    });
    return () => unsub && unsub();
  }, []);

  /* ---------- LOAD PRODUCTS FROM API ---------- */
  const refreshProducts = async () => {
    try {
      const res = await fetch("https://buynext-backend.vercel.app/admin/products");
      const data = await res.json();
      setProducts(data || []);
      // Auto-select first product if nothing is selected
      if (!selectedProductId && Array.isArray(data) && data.length > 0) {
        setSelectedProductId(data[0]._id);
      }
    } catch (err) {
      console.error("Failed to fetch products:", err);
      setProducts([]);
    }
  };

  useEffect(() => {
    refreshProducts();
  }, []);

  if (!admin) {
    return (
      <div className="p-6 mt-20%">
        <h2 className="text-2xl text-black font-semibold">Admin</h2>
        <p className="mt-4 text-black">You are not authorized to access the admin dashboard.</p>
      </div>
    );
  }

  const selectedProduct = products.find((p) => String(p._id) === String(selectedProductId)) ?? null;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1 mt-12">Admin Dashboard</h1>
        <p className="text-sm text-white/70">Manage Products and Blogs — add images, edit details, and preview changes below.</p>
      </header>

      {/* TAB SWITCH */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => setTab("products")}
          className={`px-4 py-2 rounded ${tab === "products" ? "bg-white/8" : "bg-white/4"}`}
        >
          Products
        </button>
        <button
          onClick={() => setTab("blogs")}
          className={`px-4 py-2 rounded ${tab === "blogs" ? "bg-white/8" : "bg-white/4"}`}
        >
          Blogs
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* MAIN CONTENT */}
        <div className="lg:col-span-2">
          <div className="p-4 bg-white/5 rounded-2xl glass border border-white/6">
            {tab === "products" ? <AdminProducts onProductsChange={refreshProducts} /> : <AdminBlogs />}
          </div>
        </div>

        {/* PREVIEW PANEL */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl glass border border-white/6">
            <h3 className="font-semibold mb-2 text-black">Preview Selector</h3>
            {products.length === 0 ? (
              <div className="text-sm text-black">No products available.</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-auto">
                {products.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => setSelectedProductId(p._id)}
                    className={`w-full text-left p-2 rounded flex items-center gap-3 ${
                      String(p._id) === String(selectedProductId) ? "bg-blue-700" : "hover:bg-black/4"
                    }`}
                  >
                    <div className="w-12 h-12 rounded overflow-hidden bg-white/6">
                      {p.img && <img src={p.img} alt={p.desc} className="w-full h-full object-cover" />}
                    </div>
                    <div className="flex-1">
                      <div className="font-medium text-sm text-white/95 truncate">{p.desc}</div>
                      <div className="text-xs text-white/60">${p.price}</div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          <div className="p-4 bg-white/5 rounded-2xl glass border border-white/6 text-start">
            <h3 className="font-semibold mb-3 text-black">Product Details Preview</h3>
            {!selectedProduct ? (
              <div className="text-sm text-black">Select a product to preview its details here.</div>
            ) : (
              <div className="space-y-3">
                <div className="w-full h-48 rounded overflow-hidden bg-white/6">
                  {selectedProduct.images?.[0] ? (
                    <img src={selectedProduct.images[0]} alt={selectedProduct.desc} className="w-full h-full object-cover" />
                  ) : selectedProduct.img ? (
                    <img src={selectedProduct.img} alt={selectedProduct.desc} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/60">No image</div>
                  )}
                </div>

                <div>
                  <div className="text-lg font-semibold text-black">{selectedProduct.desc}</div>
                  <div className="text-sm text-black mt-1">{selectedProduct.category}</div>
                  <div className="text-xl font-bold text-blue-900 mt-2">${selectedProduct.price}</div>
                </div>

                <div className="text-sm text-black">{selectedProduct.longDesc || selectedProduct.desc}</div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      alert("Click Edit on the form to load this product.");
                    }}
                    className="px-2 py-1 rounded-full bg-gray-400 text-black font-semibold"
                  >
                    Quick Edit
                  </button>
                </div>
              </div>
            )}
          </div>
        </aside>
      </div>
    </div>
  );
}
