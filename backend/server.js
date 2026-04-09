const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const mongoose = require("mongoose");

dotenv.config();

const app = express();

const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;
const CLIENT_ORIGIN = process.env.CLIENT_ORIGIN || "http://localhost:5173";

app.use(
  cors({
    origin: CLIENT_ORIGIN,
    methods: ["GET", "POST"],
  })
);

app.use(express.json());

async function connectDB() {
  if (!MONGO_URI) {
    console.error("Missing MONGO_URI in backend/.env");
    process.exit(1);
  }
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ Connected to MongoDB");
  } catch (err) {
    console.error("❌ MongoDB connection error:", err.message);
    process.exit(1);
  }
}

// Routes
const authRoutes = require("./src/routes/authRoutes");
const chatRoutes = require("./src/routes/chatRoutes");
const journalRoutes = require("./src/routes/journalRoutes");

app.use("/api/auth", authRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/journal", journalRoutes);

app.get("/api/health", (req, res) => {
  res.json({ status: "ok" });
});

connectDB().then(() => {
  app.listen(PORT, () => {
    console.log(`🚀 Backend listening on port ${PORT}`);
  });
});

