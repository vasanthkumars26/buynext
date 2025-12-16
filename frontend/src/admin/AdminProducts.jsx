// frontend/src/admin/AdminProducts.jsx
import React, { useEffect, useState } from "react";
import auth from "../../config/firebase";

const LOCAL_PRODUCTS_KEY = "buynext_products_v1";
const ADMIN_UID = "CrA2flVHDlT53IqfpC036z4xpTQ2";
const BACKEND = "https://buynext-backend.vercel.app"; // adjust if needed

function uidShort() {
  return Math.random().toString(36).slice(2, 9);
}

const fileToDataUrl = (file) =>
  new Promise((res, rej) => {
    if (!file) return res(null);
    const reader = new FileReader();
    reader.onload = () => res(reader.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });

export default function AdminProducts({ onProductsChange } = {}) {
  const [admin, setAdmin] = useState(false);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // form state
  const [editingId, setEditingId] = useState(null);
  const [titleImageFile, setTitleImageFile] = useState(null);
  const [titleImagePreview, setTitleImagePreview] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);
  const [galleryPreviews, setGalleryPreviews] = useState([]);
  const [form, setForm] = useState({
    desc: "",
    name: "",
    price: 0,
    category: "",
    longDesc: "",
    qty: 1,
    img: "",
    images: [],
  });

  // auth + initial load
  useEffect(() => {
    const unsub = auth.onAuthStateChanged((user) => {
      if (user && user.uid === ADMIN_UID) setAdmin(true);
      else setAdmin(false);
    });

    loadProducts();

    return () => unsub && unsub();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function loadProducts() {
    setLoading(true);
    try {
      const res = await fetch(`${BACKEND}/products`);
      if (!res.ok) throw new Error(`Server ${res.status}`);
      const list = await res.json();
      setProducts(Array.isArray(list) ? list : []);
      // persist to localStorage as well (keeps previous behavior)
      try {
        localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(Array.isArray(list) ? list : []));
      } catch {}
    } catch (err) {
      // fallback to localStorage
      const raw = localStorage.getItem(LOCAL_PRODUCTS_KEY);
      try {
        setProducts(raw ? JSON.parse(raw) : []);
      } catch {
        setProducts([]);
      }
    } finally {
      setLoading(false);
    }
  }

  const persistLocal = (next) => {
    try {
      localStorage.setItem(LOCAL_PRODUCTS_KEY, JSON.stringify(next));
    } catch {}
    setProducts(next);
    if (typeof onProductsChange === "function") onProductsChange(next);
  };

  const onTitleFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setTitleImageFile(f);
    setTitleImagePreview(f ? URL.createObjectURL(f) : null);
  };

  const onGalleryChange = (e) => {
    const files = Array.from(e.target.files || []);
    setGalleryFiles(files);
    setGalleryPreviews(files.map((f) => URL.createObjectURL(f)));
  };

  const resetForm = () => {
    setEditingId(null);
    setTitleImageFile(null);
    setTitleImagePreview(null);
    setGalleryFiles([]);
    setGalleryPreviews([]);
    setForm({
      desc: "",
      name: "",
      price: 0,
      category: "",
      longDesc: "",
      qty: 1,
      img: "",
      images: [],
    });
  };

  const handleEdit = (id) => {
    const p = products.find((x) => String(x._id) === String(id));
    if (!p) return;
    setEditingId(id);
    setForm({
      desc: p.desc || "",
      name: p.name || "",
      price: p.price ?? 0,
      category: p.category || "",
      longDesc: p.longDesc || "",
      qty: p.qty ?? 1,
      img: p.img || "",
      images: p.images || [],
    });
    setTitleImageFile(null);
    setTitleImagePreview(p.img || null);
    setGalleryFiles([]);
    setGalleryPreviews(p.images || []);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!confirm("Delete this product?")) return;
    try {
      // Try server delete
      const res = await fetch(`${BACKEND}/products/${id}`, { method: "DELETE" });
      if (!res.ok) throw new Error("Server delete failed");
      // Reload from backend
      await loadProducts();
    } catch (err) {
      // fallback to local delete
      const next = products.filter((p) => String(p._id) !== String(id));
      persistLocal(next);
      setProducts(next);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.desc) return alert("Please enter product desc/title.");
    if (!form.category) return alert("Please enter category.");
    if (!editingId && !titleImageFile && !form.img) return alert("Choose a main image.");

    try {
      const mainDataUrl = titleImageFile ? await fileToDataUrl(titleImageFile) : form.img || null;
      let galleryDataUrls = form.images || [];
      if (galleryFiles && galleryFiles.length > 0) {
        const converted = await Promise.all(galleryFiles.map((f) => fileToDataUrl(f)));
        galleryDataUrls = [...(form.images || []), ...converted];
      }

      const payload = {
        desc: form.desc,
        name: form.name || form.desc,
        price: Number(form.price) || 0,
        category: form.category,
        longDesc: form.longDesc,
        qty: Number(form.qty) || 1,
        img: mainDataUrl,
        images: galleryDataUrls,
      };

      if (editingId) {
        // try server update
        try {
          const res = await fetch(`${BACKEND}/products/${editingId}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Server update failed");
          await loadProducts();
        } catch (err) {
          // fallback: update local
          const next = products.map((p) => (p._id === editingId ? { ...p, ...payload, updatedAt: new Date() } : p));
          persistLocal(next);
          setProducts(next);
        }
      } else {
        // create new
        try {
          const res = await fetch(`${BACKEND}/products`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(payload),
          });
          if (!res.ok) throw new Error("Server create failed");
          const saved = await res.json();
          // reload
          await loadProducts();
        } catch (err) {
          // fallback: add locally
          const newProduct = { _id: uidShort(), ...payload, createdAt: new Date().toISOString() };
          const next = [newProduct, ...products];
          persistLocal(next);
          setProducts(next);
        }
      }

      resetForm();
    } catch (err) {
      console.error("Error saving product:", err);
      alert("Error saving product.");
    }
  };

  const handleResetProducts = async () => {
    if (!confirm("Reset all products to empty list? This cannot be undone.")) return;
    try {
      const res = await fetch(`${BACKEND}/products`, { method: "DELETE" });
      if (res.ok) {
        setProducts([]);
        persistLocal([]);
      } else {
        throw new Error("Server reset failed");
      }
    } catch (err) {
      // fallback: clear local
      setProducts([]);
      persistLocal([]);
    }
  };

  // viewer mode for non-admin (read-only list from backend/local)
  if (!admin) {
    return (
      <div className="p-6">
        <h2 className="text-2xl font-semibold mb-4">Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {loading && <div>Loading…</div>}
          {!loading && products.length === 0 && <div className="p-4 bg-white/6 rounded">No products yet.</div>}
          {products.map((p) => (
            <div key={p._id} className="p-4 bg-white/5 rounded flex gap-4 items-start">
              <div className="w-28 h-20 rounded overflow-hidden bg-white/6">
                {p.img ? <img src={p.img} alt={p.desc} className="w-full h-full object-cover" /> : null}
              </div>
              <div className="flex-1">
                <p className="text-sm text-white/90 mb-1">{p.desc}</p>
                <p className="text-xs text-white/60 mb-2">${p.price}</p>
                <p className="text-xs text-white/60 mb-2">{p.category}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  // admin UI (form + list)
  return (
    <div className="p-6 ">
      <h2 className="text-2xl text-black font-semibold mb-4">Admin — Products</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded mb-6">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-2 text-black">Main Image</label>
          <div className="w-full h-48 bg-white/6 rounded overflow-hidden flex items-center justify-center border">
            {titleImagePreview ? (
              <img src={titleImagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : form.img ? (
              <img src={form.img} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-gray-400   px-3">No image selected</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={onTitleFileChange} className="mt-3 text-sm" />
        </div>

        <div className="md:col-span-2 flex flex-col gap-3">
          <label className="text-sm font-medium text-black">Product Details</label>

          <input
            placeholder="Short desc (shown on cards)"
            value={form.desc}
            onChange={(e) => setForm((s) => ({ ...s, desc: e.target.value }))}
            className="w-full p-2 rounded-full border bg-gray-200 text-black"
            required
          />

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input
              placeholder="Price"
              value={form.price}
              onChange={(e) => setForm((s) => ({ ...s, price: e.target.value }))}
              className="p-2 rounded-full border bg-gray-200 text-black"
              required
            />
            <input
              placeholder="Category"
              value={form.category}
              onChange={(e) => setForm((s) => ({ ...s, category: e.target.value }))}
              className="p-2 rounded-full border bg-gray-200 text-black"
              required
            />
            <input
              placeholder="Stock qty"
              value={form.qty}
              onChange={(e) => setForm((s) => ({ ...s, qty: e.target.value }))}
              className="p-2 rounded-full border bg-gray-200 text-black"
            />
          </div>

          <textarea
            placeholder="Long description (product details page)"
            value={form.longDesc}
            onChange={(e) => setForm((s) => ({ ...s, longDesc: e.target.value }))}
            className="w-full min-h-[120px] p-3 rounded border bg-gray-200 text-black outline-none"
          />

          <div>
            <label className="block text-sm font-medium mb-2 text-black ">Gallery images (optional)</label>
            <input type="file" accept="image/*" multiple onChange={onGalleryChange} className="text-sm" />
            <div className="mt-3 flex gap-2 overflow-auto">
              {(galleryPreviews.length ? galleryPreviews : form.images || []).map((g, idx) => (
                <div key={idx} className="w-20 h-20 rounded overflow-hidden">
                  <img src={g} alt={`g-${idx}`} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
          </div>

          <div className="flex gap-3 mt-2">
            <button type="submit" className="px-4 py-2 rounded-full bg-gray-300 text-black font-semibold">
              {editingId ? "Update Product" : "Add Product"}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 text-blue-700 rounded-full border border-gray-300">
              Reset
            </button>
            <button type="button" onClick={handleResetProducts} className="px-4 py-2 rounded-full border border-gray-300 text-red-500">
              Reset All
            </button>
          </div>
        </div>
      </form>

      {/* list */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-start  ">
        {products.length === 0 && <div className="p-4 bg-white/6 text-black rounded">No products yet.</div>}
        {products.map((p) => (
          <div key={p._id} className="p-4 bg-blue-700 rounded flex gap-4 items-start">
            <div className="w-28 h-20 rounded overflow-hidden bg-white/6">
              {p.img ? <img src={p.img} alt={p.desc} className="w-full h-full object-cover" /> : null}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/90 mb-1">{p.desc}</p>
              <p className="text-xs text-white/60 mb-2">${p.price}</p>
              <p className="text-xs text-white/60 mb-2">{p.category}</p>
              <div className="flex gap-2 mt-5 text-sm ">
                <button onClick={() => handleEdit(p._id)} className="ml-3 px-2 py-1 rounded-full border">Edit</button>
                <button onClick={() => handleDelete(p._id)} className="px-2 py-1 rounded-full border text-red-600">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
