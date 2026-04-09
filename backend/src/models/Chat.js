const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    // Each chat message pair can optionally belong to a specific user.
    // For now we keep this optional so messages are always stored,
    // even if auth headers are missing.
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: false,
    },
    userMessage: {
      type: String,
      required: true,
    },
    botResponse: {
      type: String,
      required: true,
    },
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Chat", chatSchema);

