const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cors());

// MongoDB Connection
mongoose
  .connect("mongodb://127.0.0.1:27017/final")
  .then(() => console.log("DB connected.."))
  .catch((err) => console.log(err));

// Cart Schema
const cartschema = mongoose.Schema({
  _id: Number,
  desc: String,
  img: String,
  price: Number,
  qty: Number,
  category: String,
});

// User Details Schema
const userSchema = mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  address: String,
});

// Order Schema (with userDetails + items)
const orderschema = mongoose.Schema(
  {
    userDetails: userSchema, // ✅ added
    items: [cartschema],
    total: Number,
    date: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

// Models
const Cart = mongoose.model("cartmod", cartschema, "buynext");
const Order = mongoose.model("ordermod", orderschema, "buynextorder");

// Export models (optional if needed elsewhere)
module.exports = { Cart, Order };

// -------------------- CART ROUTES --------------------

// Get all cart items
app.get("/cart", async (req, res) => {
  try {
    const cartItems = await Cart.find();
    res.json(cartItems);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Add item to cart
app.post("/cart", async (req, res) => {
  try {
    const item = new Cart(req.body);
    const savedItem = await item.save();
    res.status(201).json(savedItem);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Update cart item qty
app.put("/cart/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const updated = await Cart.findByIdAndUpdate(id, req.body, { new: true });
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Delete cart item
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

// -------------------- ORDER ROUTES --------------------

// Get all orders
app.get("/orders", async (req, res) => {
  try {
    const ordered = await Order.find();
    res.json(ordered);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Place an order (add order to DB)
app.post("/orders", async (req, res) => {
  try {
    console.log("Received Order:", req.body); // ✅ debug log
    const ord = new Order(req.body);
    const savedord = await ord.save();
    res.status(201).json(savedord);
  } catch (err) {
    console.error("Error saving order:", err);
    res.status(500).json({ message: err.message });
  }
});

// -------------------- SERVER START --------------------
app.listen(4000, () => {
  console.log("Server Started..");
});
