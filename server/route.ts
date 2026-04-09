
/**
 * MERN STACK REFERENCE CODE
 * File: server/routes/chat.js & journal.js
 * 
 * const express = require('express');
 * const { Chat, Journal } = require('../models');
 * const authMiddleware = require('../middleware/auth');
 * 
 * const chatRouter = express.Router();
 * const journalRouter = express.Router();
 * 
 * // --- CHAT ROUTES ---
 * chatRouter.post('/', authMiddleware, async (req, res) => {
 *   try {
 *     const { userMessage, botResponse, detectedEmotion, isCrisis } = req.body;
 *     
 *     const newChat = new Chat({
 *       userId: req.user.id,
 *       userMessage,
 *       botResponse,
 *       detectedEmotion,
 *       isCrisis: isCrisis || false // Explicitly store safety flag
 *     });
 *     
 *     await newChat.save();
 *     
 *     // Alert logic could be added here if isCrisis is true (e.g., email notification)
 *     
 *     res.status(201).json({ success: true, data: newChat });
 *   } catch (err) {
 *     res.status(500).json({ success: false, message: err.message });
 *   }
 * });
 * 
 * chatRouter.get('/mood-stats', authMiddleware, async (req, res) => {
 *   // ... same as before
 * });
 * 
 * // --- JOURNAL ROUTES ---
 * // ... same as before
 * 
 * module.exports = { chatRouter, journalRouter };
 */
