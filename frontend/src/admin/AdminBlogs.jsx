// frontend/src/admin/AdminBlogs.jsx
import React, { useEffect, useState } from "react";
import auth from "../../config/firebase";

const LOCAL_KEY = "buynext_blogs_v1";
const ADMIN_UID = "CrA2flVHDlT53IqfpC036z4xpTQ2"; // same admin UID you used earlier

function uidShort() {
  return Math.random().toString(36).slice(2, 9);
}

export default function AdminBlogs() {
  const [admin, setAdmin] = useState(false);
  const [blogs, setBlogs] = useState([]);

  // form state
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [content, setContent] = useState("");

  // edit state
  const [editingId, setEditingId] = useState(null);

  useEffect(() => {
    // auth check (same pattern)
    const unsub = auth.onAuthStateChanged((user) => {
      if (user && user.uid === ADMIN_UID) setAdmin(true);
      else setAdmin(false);
    });

    // load blogs from localStorage
    const raw = localStorage.getItem(LOCAL_KEY);
    if (raw) {
      try {
        setBlogs(JSON.parse(raw) || []);
      } catch {
        setBlogs([]);
      }
    }

    return () => unsub && unsub();
  }, []);

  // helper: persist to localStorage
  const persist = (next) => {
    localStorage.setItem(LOCAL_KEY, JSON.stringify(next));
    setBlogs(next);
  };

  // handle file selection + preview
  const onFileChange = (e) => {
    const f = e.target.files?.[0] ?? null;
    setImageFile(f);
    if (f) {
      const url = URL.createObjectURL(f);
      setImagePreview(url);
    } else {
      setImagePreview(null);
    }
  };

  // convert file to DataURL (so we can store in localStorage)
  const fileToDataUrl = (file) =>
    new Promise((res, rej) => {
      if (!file) return res(null);
      const reader = new FileReader();
      reader.onload = () => res(reader.result);
      reader.onerror = (e) => rej(e);
      reader.readAsDataURL(file);
    });

  const resetForm = () => {
    setImageFile(null);
    setImagePreview(null);
    setContent("");
    setEditingId(null);
  };

  // add or update blog
  const handleSubmit = async (e) => {
    e.preventDefault();
    // for edit, imageFile can be null meaning keep existing image
    if (!editingId && !imageFile) return alert("Please choose an image for the blog.");

    try {
      const dataUrl = imageFile ? await fileToDataUrl(imageFile) : null;
      const today = new Date();
      const date = today.toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });

      if (editingId) {
        // update existing
        const next = blogs.map((b) =>
          b._id === editingId
            ? {
                ...b,
                img: dataUrl || b.img,
                content,
                date,
              }
            : b
        );
        persist(next);
        resetForm();
      } else {
        // add new
        const newBlog = {
          _id: uidShort(),
          title: "", // title is replaced by image, leave blank or let admin set a small title if you wish
          content,
          img: dataUrl,
          date,
          likes: 0,
        };
        const next = [newBlog, ...blogs];
        persist(next);
        resetForm();
      }
    } catch (err) {
      console.error(err);
      alert("Error saving blog.");
    }
  };

  const handleEdit = (id) => {
    const b = blogs.find((x) => x._id === id);
    if (!b) return;
    setEditingId(id);
    setContent(b.content || "");
    setImageFile(null);
    setImagePreview(b.img || null);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = (id) => {
    if (!confirm("Delete this blog?")) return;
    const next = blogs.filter((b) => b._id !== id);
    persist(next);
  };

  const handleLike = (id) => {
    const next = blogs.map((b) => (b._id === id ? { ...b, likes: (b.likes || 0) + 1 } : b));
    persist(next);
  };

  if (!admin) {
    return (
      <div className="p-6 min-h-screen">
        <h2 className="text-2xl font-semibold mb-4">{admin ? "Admin Panel —" : "Blogs"}</h2>
        {/* <div className="p-6 bg-white/5 rounded-md max-w-2xl">
          <p className="text-yellow-200">You are not authorized to access admin features.</p>
        </div> */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.length === 0 && <div className="p-4 bg-white/6 rounded">No blogs yet.</div>}
        {blogs.map((b) => (
          <div key={b._id} className="p-4 bg-white/5 rounded flex gap-4 items-start">
            <div className="w-28 h-20 rounded overflow-hidden bg-white/6">
              {b.img ? <img src={b.img} alt="b" className="w-full h-full object-cover" /> : null}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/90 mb-1">{b.title || "Blog"}</p>
              <p className="text-xs text-white/60 mb-2">{b.date}</p>
              <div className="flex gap-2 items-center">
                <button onClick={() => handleLike(b._id)} className="px-2 py-1 rounded bg-red-400/30">❤️</button>
                <span className="text-sm">Likes: {b.likes || 0}</span>
                {/* <button onClick={() => handleEdit(b._id)} className="ml-3 px-2 py-1 rounded border">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="px-2 py-1 rounded border text-red-400">Delete</button> */}
              </div>
            </div>
          </div>
        ))}
      </div>
      </div>
      
    );
  }

  return (
    <div className="p-6 min-h-screen">
      <h2 className="text-2xl font-semibold mb-4">Admin Panel — Manage Blogs</h2>

      <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-3 gap-4 bg-white/5 p-4 rounded">
        <div className="md:col-span-1">
          <label className="block text-sm font-medium mb-2">Title Image</label>
          <div className="w-full h-48 bg-white/6 rounded overflow-hidden flex items-center justify-center border">
            {imagePreview ? (
              <img src={imagePreview} alt="preview" className="w-full h-full object-cover" />
            ) : (
              <span className="text-white/70 px-3">No image selected</span>
            )}
          </div>
          <input type="file" accept="image/*" onChange={onFileChange} className="mt-3" />
        </div>

        <div className="md:col-span-2 flex flex-col gap-3">
          <label className="text-sm font-medium">Content</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            className="w-full min-h-[120px] p-3 rounded border bg-white/3 text-black"
            placeholder="Write blog content..."
            required
          />
          <div className="flex gap-3">
            <button type="submit" className="px-4 py-2 rounded bg-cyan-400 text-black font-semibold">
              {editingId ? "Update Blog" : "Add Blog"}
            </button>
            <button type="button" onClick={resetForm} className="px-4 py-2 rounded border">
              Reset
            </button>
          </div>
        </div>
      </form>

      {/* list */}
      <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
        {blogs.length === 0 && <div className="p-4 bg-white/6 rounded">No blogs yet.</div>}
        {blogs.map((b) => (
          <div key={b._id} className="p-4 bg-white/5 rounded flex gap-4 items-start">
            <div className="w-28 h-20 rounded overflow-hidden bg-white/6">
              {b.img ? <img src={b.img} alt="b" className="w-full h-full object-cover" /> : null}
            </div>
            <div className="flex-1">
              <p className="text-sm text-white/90 mb-1">{b.title || "Blog"}</p>
              <p className="text-xs text-white/60 mb-2">{b.date}</p>
              <div className="flex gap-2 items-center">
                <button onClick={() => handleLike(b._id)} className="px-2 py-1 rounded bg-red-400/30">❤️</button>
                <span className="text-sm">Likes: {b.likes || 0}</span>
                <button onClick={() => handleEdit(b._id)} className="ml-3 px-2 py-1 rounded border">Edit</button>
                <button onClick={() => handleDelete(b._id)} className="px-2 py-1 rounded border text-red-400">Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
