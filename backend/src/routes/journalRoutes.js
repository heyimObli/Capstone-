const express = require("express");
const Journal = require("../models/Journal");
const auth = require("../middleware/auth");

const router = express.Router();

// Create a new journal entry for the logged-in user
router.post("/", auth, async (req, res) => {
  const { content, reflection } = req.body;

  if (!content || typeof content !== "string") {
    return res.status(400).json({ error: "Content is required." });
  }

  try {
    const entry = await Journal.create({
      userId: req.userId,
      content,
      reflection,
    });

    res.json({
      id: entry._id,
      content: entry.content,
      reflection: entry.reflection,
      createdAt: entry.createdAt,
    });
  } catch (err) {
    console.error("Error creating journal entry:", err.message);
    res.status(500).json({ error: "Failed to save journal entry." });
  }
});

// Get all journal entries for the logged-in user
router.get("/", auth, async (req, res) => {
  try {
    const entries = await Journal.find({ userId: req.userId })
      .sort({ createdAt: 1 })
      .lean();

    res.json({
      entries: entries.map((e) => ({
        id: e._id,
        content: e.content,
        reflection: e.reflection,
        createdAt: e.createdAt,
      })),
    });
  } catch (err) {
    console.error("Error fetching journal entries:", err.message);
    res.status(500).json({ error: "Failed to load journal entries." });
  }
});

module.exports = router;

