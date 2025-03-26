const express = require("express");
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

// ✅ Direct MongoDB Connection String (⚠ Ensure Credentials Are Correct)
const uri = "mongodb+srv://mujtabashahbaz:anushkashaukat1@cluster0.ydrmf.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0";

const client = new MongoClient(uri, {
    serverApi: {
        version: ServerApiVersion.v1,
        strict: true,
        deprecationErrors: true,
    }
});

// ✅ Connect to MongoDB
async function connectDB() {
    try {
        await client.connect();
        await client.db("admin").command({ ping: 1 });
        console.log("✅ Successfully connected to MongoDB!");
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
        process.exit(1);
    }
}
connectDB();

// ✅ Get all items (READ)
app.get("/items", async (req, res) => {
    const itemsCollection = client.db("test").collection("items");
    const items = await itemsCollection.find().toArray();
    res.json(items);
});

// ✅ Add a new item (CREATE)
app.post("/items", async (req, res) => {
    const itemsCollection = client.db("test").collection("items");
    const newItem = { name: req.body.name };
    await itemsCollection.insertOne(newItem);
    res.json(newItem);
});

// ✅ Start Server
const PORT = 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
