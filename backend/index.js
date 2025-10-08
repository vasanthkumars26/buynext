require('dotenv').config(); // Load .env variables at the top
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

// Middleware
app.use(express.json());

// CORS setup: allow all origins
app.use(cors()); // simpler and works for all origins

// MongoDB Connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); 
    console.log("✅ MongoDB Connected");
  } catch (err) {
    console.error("MongoDB connection error:", err.message);
    process.exit(1);
  }
};
connectDB();

// Schemas
const cartschema = mongoose.Schema({
  _id: Number,
  desc: String,
  img: String,
  price: Number,
  qty: Number,
  category: String,
});

const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

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
const Cart = mongoose.model("cartmod", cartschema, "buynext");
const Order = mongoose.model("ordermod", orderschema, "buynextorder");

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

// SERVER START
const PORT = process.env.PORT || 4000;
app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}..`);
});

module.exports = app; 
