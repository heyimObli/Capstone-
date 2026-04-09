const express = require("express");
const axios = require("axios");
const Chat = require("../models/Chat");
const auth = require("../middleware/auth");

const router = express.Router();

const SYSTEM_PROMPT = `
You are a compassionate and professional mental health assistant. 
You do not diagnose medical conditions.
You provide emotional support, grounding techniques, breathing exercises, and positive coping strategies.
Keep responses empathetic, calm, and under 150 words.
If a user expresses self-harm or suicidal thoughts, gently encourage seeking professional help or contacting a trusted person.
`.trim();

function buildMoodInstruction(message) {
  const lower = message.toLowerCase();
  const lines = [];

  if (lower.includes("anxious")) {
    lines.push(
      "The user mentioned feeling anxious. Include a simple breathing exercise they can try right now."
    );
  }
  if (lower.includes("sad")) {
    lines.push(
      "The user mentioned feeling sad. Provide a very comforting, validating message."
    );
  }
  if (lower.includes("angry")) {
    lines.push(
      "The user mentioned feeling angry. Suggest a calming technique or grounding exercise."
    );
  }

  if (!lines.length) return "";
  return "\n\nAdditional guidance:\n" + lines.join("\n");
}

// Main chat route (currently unused by the React app, but kept for future expansion).
// Protected: user must send JWT
router.post("/", auth, async (req, res) => {
  const { message } = req.body;
  const userId = req.userId;

  if (!message || typeof message !== "string") {
    return res.status(400).json({ error: "Message is required." });
  }

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: "OPENAI_API_KEY is not set on server." });
  }

  try {
    const systemMessage = SYSTEM_PROMPT + buildMoodInstruction(message);

    const openaiRes = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: systemMessage },
          { role: "user", content: message },
        ],
        temperature: 0.7,
        max_tokens: 250,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${apiKey}`,
        },
      }
    );

    const botReply =
      openaiRes.data.choices?.[0]?.message?.content?.trim() ||
      "I'm here with you. I'm having trouble forming a full response right now, but your feelings are valid.";

    await Chat.create({
      userId,
      userMessage: message,
      botResponse: botReply,
    });

    res.json({ reply: botReply });
  } catch (err) {
    console.error("Error in /api/chat:", err.response?.data || err.message);
    res
      .status(500)
      .json({ error: "Something went wrong talking to the assistant." });
  }
});

// Simple logging route used by the current React frontend.
// Protected so we can associate each chat with the logged-in user.
router.post("/log", auth, async (req, res) => {
  const { userMessage, botResponse } = req.body;

  if (!userMessage || !botResponse) {
    return res
      .status(400)
      .json({ error: "userMessage and botResponse are required." });
  }

  try {
    const doc = await Chat.create({
      userId: req.userId,
      userMessage,
      botResponse,
    });
    res.json({ success: true, id: doc._id });
  } catch (err) {
    console.error("Error logging chat:", err.message);
    res.status(500).json({ error: "Failed to log chat message." });
  }
});

// Get history for the logged-in user only.
router.get("/history", auth, async (req, res) => {
  const chats = await Chat.find({ userId: req.userId })
    .sort({ createdAt: 1 })
    .lean();
  res.json({ chats });
});

module.exports = router;

