const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config(); // Optional, but doesn't require .env

const app = express();
app.use(express.json());
app.use(cors());

// ✅ MongoDB Connection (Using Render Environment Variable)
const uri = process.env.MONGO_URI; // Load from Render's environment variables

mongoose.connect(uri, {
    serverSelectionTimeoutMS: 5000, // Prevents long wait if connection fails
})
.then(() => console.log("✅ MongoDB Connected"))
.catch(err => console.log("❌ DB Connection Error:", err));

// ✅ Define Schema & Model
const ItemSchema = new mongoose.Schema({ name: String });
const Item = mongoose.model("Item", ItemSchema);

// ✅ Get all items (READ)
app.get("/items", async (req, res) => {
    try {
        const items = await Item.find();
        res.json(items);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Add a new item (CREATE)
app.post("/items", async (req, res) => {
    try {
        const newItem = new Item({ name: req.body.name });
        await newItem.save();
        res.json(newItem);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Update an item (UPDATE)
app.put("/items/:id", async (req, res) => {
    try {
        const updatedItem = await Item.findByIdAndUpdate(
            req.params.id, 
            { name: req.body.name }, 
            { new: true }
        );
        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Delete an item (DELETE)
app.delete("/items/:id", async (req, res) => {
    try {
        await Item.findByIdAndDelete(req.params.id);
        res.json({ message: "Item deleted" });
    } catch (error) {
        res.status(500).json({ error: "Internal Server Error" });
    }
});

// ✅ Start Server (Listen on all IPs, important for Render)
const PORT = process.env.PORT || 5000;
app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
