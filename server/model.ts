
/**
 * MERN STACK REFERENCE CODE
 * File: server/models/Chat.js, User.js, & Journal.js
 * 
 * const mongoose = require('mongoose');
 * 
 * // USER SCHEMA
 * // ... same as before
 * 
 * // CHAT SCHEMA
 * const ChatSchema = new mongoose.Schema({
 *   userId: { 
 *     type: mongoose.Schema.Types.ObjectId, 
 *     ref: 'User', 
 *     required: true 
 *   },
 *   userMessage: { type: String, required: true },
 *   botResponse: { type: String, required: true },
 *   detectedEmotion: { 
 *     type: String, 
 *     enum: ['happy', 'sad', 'anxious', 'angry', 'stressed', 'neutral'], 
 *     default: 'neutral' 
 *   },
 *   isCrisis: { type: Boolean, default: false }, // Safety flag for emergency tracking
 *   createdAt: { type: Date, default: Date.now }
 * });
 * 
 * // JOURNAL SCHEMA
 * const JournalSchema = new mongoose.Schema({
 *   userId: { 
 *     type: mongoose.Schema.Types.ObjectId, 
 *     ref: 'User', 
 *     required: true 
 *   },
 *   content: { type: String, required: true },
 *   reflection: { type: String }, // Store AI summary/reflection
 *   createdAt: { type: Date, default: Date.now }
 * });
 * 
 * const User = mongoose.model('User', UserSchema);
 * const Chat = mongoose.model('Chat', ChatSchema);
 * const Journal = mongoose.model('Journal', JournalSchema);
 * 
 * module.exports = { User, Chat, Journal };
 */
