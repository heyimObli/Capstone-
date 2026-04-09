const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || "dev-secret-key";

router.post("/register", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "Name, email, and password are required." });
  }

  const existing = await User.findOne({ email });
  if (existing) {
    return res.status(400).json({ error: "Email is already in use." });
  }

  const passwordHash = await bcrypt.hash(password, 10);

  const user = await User.create({ name, email, passwordHash });
  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  const isValid = await bcrypt.compare(password, user.passwordHash);
  if (!isValid) {
    return res.status(400).json({ error: "Invalid email or password." });
  }

  const token = jwt.sign({ userId: user._id }, JWT_SECRET, { expiresIn: "7d" });

  res.json({
    token,
    user: { id: user._id, name: user.name, email: user.email },
  });
});

module.exports = router;

