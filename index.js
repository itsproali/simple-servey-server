const express = require("express");
require("dotenv").config();
const { MongoClient, ServerApiVersion } = require("mongodb");
const cors = require("cors");
const PORT = process.env.PORT || 5000;
const app = express();

// Middleware
app.use(cors());
app.use(express.json());

const uri = process.env.DATABASE;
const client = new MongoClient(uri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  serverApi: ServerApiVersion.v1,
});

const connect = async () => {
  try {
    await client.connect();
  } catch (err) {
    await client.close();
  }
};
connect();

// Collections
const db = client.db("Simple_Survey");
const sectorCollection = db.collection("sectors");
const userCollection = db.collection("users");

// Default route
app.get("/", async (req, res) => {
  res
    .status(200)
    .send({ success: true, message: "Welcome to Simple Survey Back Side" });
});

// Get All Sector
app.get("/sectors", async (req, res) => {
  const data = await sectorCollection.find({}).toArray();
  res.status(200).send({ success: true, data });
});

// Update User Data
app.put("/save", async (req, res) => {
  const { email } = req.body;
  const filter = { email };
  const updateDoc = { $set: req.body };
  const options = { upsert: true };
  const result = await userCollection.updateOne(filter, updateDoc, options);
  res.status(200).send({ success: true, message: "Data saved successfully" });
});

app.listen(PORT, () => console.log("Server Running on: ", PORT));
