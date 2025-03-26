const express = require("express");
const { MongoClient, ServerApiVersion, ObjectId } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors({ origin: "*" })); // Allows access from any IP

// ✅ MongoDB Connection
const uri = "mongodb+srv://mujtabashahbaz:anushkashaukat1@cluster0.ydrmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true }
});

let collection;

// ✅ Connect to MongoDB & Start Server
async function startServer() {
    try {
        await client.connect();
        collection = client.db("test").collection("items"); // Change "test" to your actual DB name
        console.log("✅ Connected to MongoDB");

        const PORT = process.env.PORT || 5000;
        app.listen(PORT, "0.0.0.0", () => console.log(`🚀 Server running on port ${PORT}`));
    } catch (err) {
        console.error("❌ MongoDB Connection Error:", err);
        process.exit(1);
    }
}

// ✅ Get all items (READ)
app.get("/items", async (req, res) => {
    try {
        const items = await collection.find().toArray();
        res.json(items);
    } catch (err) {
        res.status(500).json({ error: "Error fetching items" });
    }
});

// ✅ Add a new item (CREATE)
app.post("/items", async (req, res) => {
    try {
        const newItem = { name: req.body.name };
        const result = await collection.insertOne(newItem);
        res.json({ _id: result.insertedId, ...newItem });
    } catch (err) {
        res.status(500).json({ error: "Error adding item" });
    }
});

// ✅ Update an item (UPDATE)
app.put("/items/:id", async (req, res) => {
    try {
        const updatedItem = await collection.findOneAndUpdate(
            { _id: new ObjectId(req.params.id) },
            { $set: { name: req.body.name } },
            { returnDocument: "after" }
        );
        res.json(updatedItem);
    } catch (err) {
        res.status(500).json({ error: "Error updating item" });
    }
});

// ✅ Delete an item (DELETE)
app.delete("/items/:id", async (req, res) => {
    try {
        await collection.deleteOne({ _id: new ObjectId(req.params.id) });
        res.json({ message: "Item deleted" });
    } catch (err) {
        res.status(500).json({ error: "Error deleting item" });
    }
});

startServer();
