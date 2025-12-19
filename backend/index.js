require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

/* ------------------ CORS ------------------ */
app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true
}));
app.options(/.*/, cors());
app.use(express.json());

/* ------------------ DATABASE ------------------ */
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      dbName: "buynext",
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}

connectDB().then(() => console.log("MongoDB Connected")).catch(console.error);

/* ------------------ SCHEMAS ------------------ */

// ✅ FIXED CART SCHEMA (DO NOT disable _id)
const cartSchema = new mongoose.Schema({
  id: Number,          // product id (frontend)
  desc: String,
  img: String,
  price: Number,
  qty: Number,
  category: String
}, { versionKey: false });

// untouched
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

const orderSchema = new mongoose.Schema({
  userDetails: userSchema,
  items: [cartSchema],
  total: Number,
  date: { type: Date, default: Date.now },
}, { versionKey: false });

const blogSchema = new mongoose.Schema({
  newTitle: String,
  newContent: String,
  image: String,
  date: String,
  likes: { type: Number, default: 0 },
});

const productSchema = new mongoose.Schema({
  desc: String,
  name: String,
  price: Number,
  category: String,
  longDesc: String,
  qty: Number,
  img: String,
  images: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
});

/* ------------------ MODELS ------------------ */
const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema, "carts");
const Order = mongoose.models.Order || mongoose.model("Order", orderSchema, "orders");
const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema, "blogcollect");
const Product = mongoose.models.Product || mongoose.model("Product", productSchema, "products");

/* ------------------ CART ------------------ */

// GET cart
app.get("/cart", async (req, res) => {
  const items = await Cart.find();
  res.json(items);
});

// ADD to cart
app.post("/cart", async (req, res) => {
  const { id } = req.body;

  let item = await Cart.findOne({ id });

  if (item) {
    item.qty += 1;
    await item.save();
    return res.json(item);
  }

  item = new Cart(req.body);
  await item.save();
  res.status(201).json(item);
});


// UPDATE cart item (use MongoDB _id)
app.put("/cart/:id", async (req, res) => {
  try {
    const updatedItem = await Cart.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json(updatedItem);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// DELETE cart item
app.delete("/cart/:id", async (req, res) => {
  try {
    const deletedItem = await Cart.findByIdAndDelete(req.params.id);

    if (!deletedItem) {
      return res.status(404).json({ message: "Item not found" });
    }

    res.json({ message: "Deleted successfully", deletedItem });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

/* ------------------ ORDERS ------------------ */
// ------------------ ORDERS ------------------
app.get("/orders", async (req, res) => {
  try {
    // Connect to DB (if not already connected)
    await connectDB();

    // Ensure the collection exists, fetch all orders
    const rawOrders = await mongoose.connection.db
      .collection("orders")
      .find({})
      .toArray();

    // Return JSON with count and data
    res.json({
      count: Array.isArray(rawOrders) ? rawOrders.length : 0,
      data: Array.isArray(rawOrders) ? rawOrders : [],
    });
  } catch (err) {
    console.error("Error fetching orders:", err);

    // Return JSON instead of HTML for errors
    res.status(500).json({
      error: "Failed to fetch orders",
      details: err.message,
    });
  }
});

app.post("/orders", async (req, res) => {
  try {
    await connectDB();

    const { userDetails, items } = req.body;
    if (!userDetails || !items || !Array.isArray(items)) {
      return res.status(400).json({ error: "Invalid order payload" });
    }

    const total = items.reduce((sum, i) => sum + i.price * i.qty, 0);
    const order = new Order({
      userDetails,
      items,
      total,
      date: new Date(),
    });

    const savedOrder = await order.save();
    res.status(201).json(savedOrder);
  } catch (err) {
    console.error("Error creating order:", err);
    res.status(500).json({ error: "Failed to create order", details: err.message });
  }
});

/* ------------------ BLOG ------------------ */
app.get("/api/blogs", async (req, res) => {
  res.json(await Blog.find());
});

app.post("/api/blogs", async (req, res) => {
  const { newTitle, newContent, image, date } = req.body.newblog;
  const blog = new Blog({ newTitle, newContent, image, date });
  res.json(await blog.save());
});

app.patch("/api/blogs/like/:id", async (req, res) => {
  res.json(await Blog.findByIdAndUpdate(
    req.params.id,
    { $inc: { likes: 1 } },
    { new: true }
  ));
});

/* ------------------ PRODUCTS ------------------ */
// app.get("/admin/products", async (req, res) => {
//   res.json(await Product.find().sort({ createdAt: -1 }));
// });

// app.get("/admin/products/:id", async (req, res) => {
//   const product = await Product.findById(req.params.id);
//   if (!product) return res.status(404).json({ message: "Product not found" });
//   res.json(product);
// });

// app.post("/admin/products", async (req, res) => {
//   res.status(201).json(await new Product(req.body).save());
// });

// app.put("/admin/products/:id", async (req, res) => {
//   res.json(await Product.findByIdAndUpdate(
//     req.params.id,
//     { ...req.body, updatedAt: new Date() },
//     { new: true }
//   ));
// });

// app.delete("/admin/products/:id", async (req, res) => {
//   await Product.findByIdAndDelete(req.params.id);
//   res.json({ message: "Deleted successfully" });
// });

/* ------------------ PRODUCTS ------------------ */

// USER SIDE
app.get("/products", async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("GET /products", err);
    res.status(500).json({ error: "Failed to fetch products" });
  }
});

// ADMIN SIDE
app.get("/admin/products", async (req, res) => {
  try {
    await connectDB();
    const products = await Product.find().sort({ createdAt: -1 });
    res.json(products);
  } catch (err) {
    console.error("GET /admin/products", err);
    res.status(500).json({ error: "Admin products failed" });
  }
});

app.post("/admin/products", async (req, res) => {
  try {
    await connectDB();
    const product = new Product(req.body);
    const saved = await product.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("POST /admin/products", err);
    res.status(500).json({ error: "Create product failed" });
  }
});

app.put("/admin/products/:id", async (req, res) => {
  try {
    await connectDB();
    const updated = await Product.findByIdAndUpdate(
      req.params.id,
      { ...req.body, updatedAt: new Date() },
      { new: true }
    );
    res.json(updated);
  } catch (err) {
    console.error("PUT /admin/products", err);
    res.status(500).json({ error: "Update failed" });
  }
});

app.delete("/admin/products/:id", async (req, res) => {
  try {
    await connectDB();
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Deleted" });
  } catch (err) {
    console.error("DELETE /admin/products", err);
    res.status(500).json({ error: "Delete failed" });
  }
});

/* ------------------ SERVER ------------------ */
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
