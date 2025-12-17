require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// ------------------ CORS ------------------
const corsOptions = {
  origin: ["http://localhost:5174", "https://buynext-hwn9.vercel.app"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());

// ------------------ DATABASE CONNECTION (Vercel Optimized) ------------------
let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: false, // Set to false to prevent hanging on connection drops
      dbName: "buynext",
      serverSelectionTimeoutMS: 5000, // Fail fast (5s) instead of timing out Vercel (10s)
    }).then(m => m);
  }
  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null; // Reset if connection fails
    throw e;
  }
  return cached.conn;
}

// Initial connection
connectDB()
  .then(() => console.log("MongoDB Connected"))
  .catch(err => console.error("DB Connection Error:", err));

// ------------------ SCHEMAS ------------------
const cartschema = new mongoose.Schema({
  id: Number, 
  desc: String,
  img: String,
  price: Number,
  qty: Number,
  category: String,
}, { versionKey: false });

const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

const orderschema = new mongoose.Schema({
  userDetails: userSchema,
  items: Array, 
  total: Number,
  date: { type: Date, default: Date.now },
}, { versionKey: false });

const blogschema = new mongoose.Schema({
  newTitle: String,
  newContent: String,
  image: String,
  date: String,
  likes: { type: Number, default: 0 },
});

// ------------------ MODELS ------------------
const Cart = mongoose.models.Cart || mongoose.model("cartmod", cartschema, "buynext");
const Order = mongoose.models.Order || mongoose.model("ordermod", orderschema, "buynextorder");
const Blog = mongoose.models.Blog || mongoose.model("Blog", blogschema, "blogcollect");

// ------------------ ROUTES ------------------

app.get("/", (req, res) => res.send("BuyNext Backend is running!"));

// CART ROUTES
app.get("/cart", async (req, res) => {
  try {
    await connectDB();
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: "Database Connection Error" });
  }
});

app.post("/cart", async (req, res) => {
  try {
    await connectDB();
    const { id, desc } = req.body;

    const existing = await Cart.findOne({ $or: [{ id: id }, { desc: desc }] });

    if (existing) {
      existing.qty += 1;
      await existing.save();
      return res.json(existing);
    }

    const dataToSave = { ...req.body };
    delete dataToSave._id; // Prevent collision with MongoDB's auto-generated _id

    const item = new Cart(dataToSave);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(500).json({ message: "Cart POST error", error: err.message });
  }
});

app.put("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined") return res.status(400).json({ message: "Invalid ID provided" });

    await connectDB();
    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };

    const updated = await Cart.findOneAndUpdate(filter, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    if (!id || id === "undefined") return res.status(400).json({ message: "Invalid ID provided" });

    await connectDB();
    const filter = mongoose.Types.ObjectId.isValid(id) ? { _id: id } : { id: id };

    await Cart.findOneAndDelete(filter);
    res.json({ message: "DELETED SUCCESSFULLY" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ORDER ROUTES
app.get("/orders", async (req, res) => {
  try {
    await connectDB();
    const ordered = await Order.find().sort({ date: -1 });
    res.json(ordered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/orders", async (req, res) => {
  try {
    await connectDB();
    
    // Strip _id from cart items to avoid duplication errors when saving into Order collection
    const orderData = {
        ...req.body,
        items: req.body.items.map(item => {
            const { _id, ...rest } = item;
            return rest;
        })
    };
    
    const ord = new Order(orderData);
    const savedord = await ord.save();

    await Cart.deleteMany({}); 

    res.status(201).json(savedord);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// BLOG ROUTES
app.get("/api/blogs", async (req, res) => {
  try {
    await connectDB();
    const blogs = await Blog.find({});
    res.json(blogs);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/api/blogs", async (req, res) => {
  try {
    await connectDB();
    const { newTitle, newContent, image, date } = req.body.newblog;
    const newBlog = new Blog({ newTitle, newContent, image, date, likes: 0 });
    await newBlog.save();
    res.json(newBlog);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.patch("/api/blogs/like/:id", async (req, res) => {
  try {
    await connectDB();
    const updated = await Blog.findByIdAndUpdate(
      req.params.id,
      { $inc: { likes: 1 } },
      { new: true }
    );
    if (!updated) return res.status(404).json({ message: "Blog not found" });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: "Error liking blog" });
  }
});

if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
  });
}

module.exports = app;

// require('dotenv').config();
// const express = require("express");
// const cors = require("cors");
// const mongoose = require("mongoose");

// const app = express();

// // ------------------ CORS ------------------
// const corsOptions = {
//   origin: ["http://localhost:5174", "https://buynext-hwn9.vercel.app"],
//   methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
//   allowedHeaders: ["Content-Type", "Authorization"],
//   credentials: true,
// };
// app.use(cors(corsOptions));
// app.use(express.json());                                     

// // Handle OPTIONS
// app.use((req, res, next) => {
//   if (req.method === "OPTIONS") {
//     res.header("Access-Control-Allow-Origin", corsOptions.origin.join(","));
//     res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
//     res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
//     return res.sendStatus(200);
//   }
//   next();
// });

// // ------------------ DATABASE CONNECTION ------------------
// let cached = global.mongoose;
// if (!cached) cached = global.mongoose = { conn: null, promise: null };

// async function connectDB() {
//   if (cached.conn) return cached.conn;
//   if (!cached.promise) {
//     cached.promise = mongoose.connect(process.env.MONGO_URI, {
//       bufferCommands: true,
//       dbName: "buynext"
//     }).then(m => m);
//   }
//   cached.conn = await cached.promise;
//   return cached.conn;
// }

// connectDB()
//   .then(() => console.log("MongoDB Connected"))
//   .catch(err => console.error(err));

// // ------------------ SCHEMAS ------------------

// // CART SCHEMA
// const cartSchema = new mongoose.Schema({
//   desc: String,
//   img: String,
//   price: Number,
//   qty: Number,
//   category: String
// }, { versionKey: false });

// // ORDER SCHEMA
// const userSchema = new mongoose.Schema({
//   name: String,
//   email: String,
//   phone: String,
//   address: String,
// });

// const orderSchema = new mongoose.Schema({
//   userDetails: userSchema,
//   items: [cartSchema],
//   total: Number,
//   date: { type: Date, default: Date.now },
// }, { versionKey: false });

// // BLOG SCHEMA
// const blogSchema = new mongoose.Schema({
//   newTitle: String,
//   newContent: String,
//   image: String,
//   date: String,
//   likes: { type: Number, default: 0 },
// });

// // PRODUCT SCHEMA
// const productSchema = new mongoose.Schema({
//   desc: String,
//   name: String,
//   price: Number,
//   category: String,
//   longDesc: String,
//   qty: Number,
//   img: String,
//   images: [String],
//   createdAt: { type: Date, default: Date.now },
//   updatedAt: { type: Date, default: Date.now },
// });

// // ------------------ MODELS ------------------
// const Cart = mongoose.models.Cart || mongoose.model("Cart", cartSchema, "buynextcart");
// const Order = mongoose.models.Order || mongoose.model("Order", orderSchema, "buynextorder");
// const Blog = mongoose.models.Blog || mongoose.model("Blog", blogSchema, "blogcollect");
// const Product = mongoose.models.Product || mongoose.model("Product", productSchema, "products");

// // ------------------ CART ROUTES ------------------
// app.get("/cart", async (req, res) => {
//   try {
//     const items = await Cart.find().lean();
//     res.json(items);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });

// app.post("/cart", async (req, res) => {
//   try {
//     const item = new Cart(req.body);
//     const savedItem = await item.save();
//     res.status(201).json(savedItem);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });

// app.put("/cart/:id", async (req, res) => {
//   try {
//     const updated = await Cart.findByIdAndUpdate(req.params.id, req.body, { new: true });
//     res.json(updated);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });

// app.delete("/cart/:id", async (req, res) => {
//   try {
//     await Cart.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ------------------ ORDER ROUTES ------------------
// app.get("/orders", async (req, res) => {
//   try {
//     const orders = await Order.find();
//     res.json(orders);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.post("/orders", async (req, res) => {
//   try {
//     const ord = new Order(req.body);
//     const savedOrd = await ord.save();
//     res.status(201).json(savedOrd);
//   } catch (err) {
//     console.error(err);
//     res.status(500).json({ message: err.message });
//   }
// });

// // ------------------ BLOG ROUTES ------------------
// app.get("/api/blogs", async (req, res) => {
//   try {
//     const blogs = await Blog.find({});
//     res.json(blogs);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.post("/api/blogs", async (req, res) => {
//   try {
//     const { newTitle, newContent, image, date } = req.body.newblog;
//     const blog = new Blog({ newTitle, newContent, image, date, likes: 0 });
//     await blog.save();
//     res.json(blog);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.patch("/api/blogs/like/:id", async (req, res) => {
//   try {
//     const updated = await Blog.findByIdAndUpdate(req.params.id, { $inc: { likes: 1 } }, { new: true });
//     if (!updated) return res.status(404).json({ message: "Blog not found" });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: "Error liking blog" });
//   }
// });

// // ------------------ PRODUCT ROUTES ------------------
// app.get("/admin/products", async (req, res) => {
//   try {
//     const products = await Product.find().sort({ createdAt: -1 });
//     res.json(products);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // GET product by ID (for ProductDetails.jsx)
// app.get("/admin/products/:id", async (req, res) => {
//   try {
//     const product = await Product.findById(req.params.id);
//     if (!product) return res.status(404).json({ message: "Product not found" });
//     res.json(product);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.post("/admin/products", async (req, res) => {
//   try {
//     const product = new Product(req.body);
//     const saved = await product.save();
//     res.status(201).json(saved);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.put("/admin/products/:id", async (req, res) => {
//   try {
//     const updated = await Product.findByIdAndUpdate(req.params.id, { ...req.body, updatedAt: new Date() }, { new: true });
//     res.json(updated);
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// app.delete("/admin/products/:id", async (req, res) => {
//   try {
//     await Product.findByIdAndDelete(req.params.id);
//     res.json({ message: "Deleted successfully" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // DELETE all products
// app.delete("/admin/products", async (req, res) => {
//   try {
//     await Product.deleteMany({});
//     res.json({ message: "All products deleted" });
//   } catch (err) {
//     res.status(500).json({ message: err.message });
//   }
// });

// // ------------------ SERVER ------------------
// const PORT = process.env.PORT || 4000;
// app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

// module.exports = app;

