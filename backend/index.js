require('dotenv').config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();


app.use(express.json());
app.use(
  cors({
    origin: [
      "http://localhost:5173",
      process.env.APPLICATION_URL, 
    ],
    methods: ["GET", "POST", "PUT", "DELETE"],
    credentials: true,
  })
);

// MongoDB Connection
const mongoUri = process.env.MONGO_URI;
if (!mongoUri) {
  console.error(" MONGO_URI is not defined!");
  process.exit(1);
}

mongoose
  .connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB Connected"))
  .catch((err) => console.error("MongoDB Connection Error:", err.message));

// Schemas
const cartSchema = mongoose.Schema({
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

const orderSchema = mongoose.Schema(
  {
    userDetails: userSchema,
    items: [cartSchema],
    total: Number,
    date: { type: Date, default: Date.now },
  },
  { versionKey: false }
);

const Cart = mongoose.model("cartmod", cartSchema, "buynext");
const Order = mongoose.model("ordermod", orderSchema, "buynextorder");

// Routes
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
    res.status(500).json({ message: err.message });
  }
});

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
    const ord = new Order(req.body);
    const savedOrd = await ord.save();
    res.status(201).json(savedOrd);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Server started on port ${PORT}..`));
