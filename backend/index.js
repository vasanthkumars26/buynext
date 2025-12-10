require('dotenv').config(); 
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

const corsOptions = {
  origin: ["http://localhost:5174","https://buynext-hwn9.vercel.app"], 
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));
app.use(express.json());


app.use((req, res, next) => {
  if (req.method === "OPTIONS") {
    res.header("Access-Control-Allow-Origin", corsOptions.origin.join(","));
    res.header("Access-Control-Allow-Methods", corsOptions.methods.join(","));
    res.header("Access-Control-Allow-Headers", corsOptions.allowedHeaders.join(","));
    return res.sendStatus(200);
  }
  next();
});


let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

async function connectDB() {
  if (cached.conn) return cached.conn;
  if (!cached.promise) {
    cached.promise = mongoose.connect(process.env.MONGO_URI, {
      bufferCommands: true, 
      dbName: "buynext"
    }).then(m => m);
  }
  cached.conn = await cached.promise;
  return cached.conn;
}


connectDB().then(() => console.log("MongoDB Connected")).catch(err => console.error(err));

// Cart Schema
const cartschema = mongoose.Schema({
  _id: Number,
  desc: String,
  img: String,
  price: Number,
  qty: Number,
  category: String,
});

// User Schema
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

// Order Schema
const orderschema = mongoose.Schema(
  {
    userDetails: userSchema,
    items: [cartschema],
    total: Number,
    date: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// Models
const Cart = mongoose.models.Cart || mongoose.model("cartmod", cartschema, "buynext");
const Order = mongoose.models.Order || mongoose.model("ordermod", orderschema, "buynextorder");

// CART ROUTES
app.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/cart", async (req, res) => {
  try {
    const item = new Cart(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

app.put("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.delete("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await Cart.findByIdAndDelete(id);
    res.json({ message: "DELETED SUCCESSFULLY" });
  } catch (err) {
    console.error("Delete error:", err);
    res.status(500).json({ message: err.message });
  }
});

// ORDER ROUTES
app.get("/orders", async (req, res) => {
  try {
    const ordered = await Order.find();
    res.json(ordered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

app.post("/orders", async (req, res) => {
  try {
    console.log("Received Order:", req.body);
    const ord = new Order(req.body);
    const savedord = await ord.save();
    res.status(201).json(savedord);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: err.message });
  }
});

// Local only
if (process.env.NODE_ENV !== "production") {
  const PORT = process.env.PORT || 4000;
  app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}..`);
  });
}

module.exports = app;
