// frontend/src/admin/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import AdminProducts from "./AdminProducts";
import AdminBlogs from "./AdminBlogs";
import auth from "../../config/firebase";

const ADMIN_UID = "CrA2flVHDlT53IqfpC036z4xpTQ2";
const LOCAL_PRODUCTS_KEY = "buynext_products_v1";

export default function AdminDashboard() {
  const [tab, setTab] = useState("products");
  const [admin, setAdmin] = useState(false);
  const [productsPreview, setProductsPreview] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(null);

  // auth check
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((u) => {
      setAdmin(!!(u && u.uid === ADMIN_UID));
    });
    return () => unsub && unsub();
  }, []);

  // load products for preview area (reads same localStorage key used by AdminProducts)
  useEffect(() => {
    const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
    try {
      const parsed = raw ? JSON.parse(raw) : [];
      setProductsPreview(Array.isArray(parsed) ? parsed : []);
      // if nothing selected, default to first product (for preview)
      if (!selectedProductId && Array.isArray(parsed) && parsed.length > 0) {
        setSelectedProductId(parsed[0]._id);
      }
    } catch {
      setProductsPreview([]);
    }

    // watch storage changes (sync across tabs/components)
    function onStorage(e) {
      if (e.key === LOCAL_PRODUCTS_KEY) {
        try {
          const parsed = e.newValue ? JSON.parse(e.newValue) : [];
          setProductsPreview(Array.isArray(parsed) ? parsed : []);
        } catch {
          setProductsPreview([]);
        }
      }
    }
    window.addEventListener("storage", onStorage);
    return () => window.removeEventListener("storage", onStorage);
  }, [selectedProductId]);

  if (!admin) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold">Admin</h2>
        <p className="mt-4">You are not authorized to access the admin dashboard.</p>
      </div>
    );
  }

  // convenience: selected product object (for details preview)
  const selectedProduct = productsPreview.find((p) => String(p._id) === String(selectedProductId)) ?? productsPreview[0] ?? null;

  return (
    <div className="p-6">
      <header className="mb-6">
        <h1 className="text-3xl font-extrabold mb-1 mt-12">Admin Dashboard</h1>
        <p className="text-sm text-white/70">Manage Products and Blogs — add images, edit details, and preview changes below.</p>
      </header>

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
        {/* Main content area (form + list) */}
        <div className="lg:col-span-2">
          <div className="p-4 bg-white/5 rounded-2xl glass border border-white/6">
            {tab === "products" ? (
              // AdminProducts contains the Add/Edit form and the list — drop it here
              <AdminProducts />
            ) : (
              <AdminBlogs />
            )}
          </div>
        </div>

        {/* Right column: quick controls + preview selector */}
        <aside className="lg:col-span-1 space-y-4">
          <div className="p-4 bg-white/5 rounded-2xl glass border border-white/6">
            <h3 className="font-semibold mb-2 text-black">Preview selector</h3>
            {productsPreview.length === 0 ? (
              <div className="text-sm text-black">No products available to preview.</div>
            ) : (
              <div className="space-y-2 max-h-64 overflow-auto">
                {productsPreview.map((p) => (
                  <button
                    key={p._id}
                    onClick={() => setSelectedProductId(p._id)}
                    className={`w-full text-left p-2 rounded ${String(p._id) === String(selectedProductId) ? "bg-blue-700" : "hover:bg-black/4"}`}
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-12 rounded overflow-hidden bg-white/6">
                        {p.img ? <img src={p.img} alt={p.desc} className="w-full h-full object-cover" /> : null}
                      </div>
                      <div className="flex-1">
                        <div className="font-medium text-sm text-white/95 truncate">{p.desc}</div>
                        <div className="text-xs text-white/60">${p.price}</div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Details / preview area (under the add pictures & details section per your request) */}
          <div className="p-4 bg-white/5 rounded-2xl glass border border-white/6 text-start">
            <h3 className="font-semibold mb-3 text-black">Product details preview</h3>

            {!selectedProduct ? (
              <div className="text-sm text-black">Select a product to preview its details here.</div>
            ) : (
              <div className="space-y-3">
                <div className="w-full h-48 rounded overflow-hidden bg-white/6">
                  {selectedProduct.images && selectedProduct.images.length > 0 ? (
                    <img src={selectedProduct.images[0]} alt={selectedProduct.desc} className="w-full h-full object-cover" />
                  ) : selectedProduct.img ? (
                    <img src={selectedProduct.img} alt={selectedProduct.desc} className="w-full h-full object-cover" />
                  ) : (
                    <div className="flex items-center justify-center h-full text-white/60">No image</div>
                  )}
                </div>

                <div>
                  <div className="text-lg font-semibold text-black">{selectedProduct.desc}</div>
                  <div className="text-sm text-black   mt-1">{selectedProduct.category}</div>
                  <div className="text-xl font-bold text-blue-900 mt-2">${selectedProduct.price}</div>
                </div>

                <div className="text-sm text-black">
                  {selectedProduct.longDesc || selectedProduct.desc}
                </div>

                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      // navigate to edit: scroll AdminProducts to top and trigger edit by writing editingId to localStorage
                      // This is a small convenience hack: AdminProducts listens only to user edit buttons,
                      // so for a stronger integration, consider lifting editingId state into AdminDashboard.
                      localStorage.setItem("__admin_autofocus_product__", selectedProduct._id);
                      window.scrollTo({ top: 0, behavior: "smooth" });
                      alert("Product id stored for quick-edit. Click Edit on the form to load it (or refresh Admin page).");
                    }}
                    className="px-2 py-1 rounded-full bg-gray-400 text-black font-semibold"
                  >
                    Quick edit
                  </button>

                  <button
                    onClick={() => {
                      if (!confirm("Delete this product?")) return;
                      const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
                      let parsed = [];
                      try { parsed = raw ? JSON.parse(raw) : []; } catch {}
                      const next = parsed.filter((x) => String(x._id) !== String(selectedProduct._id));
                      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(next));
                      setProductsPreview(next);
                      setSelectedProductId(next.length ? next[0]._id : null);
                    }}
                    className="px-2 py-1 rounded-full border text-red-600"
                  >
                    Delete
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
