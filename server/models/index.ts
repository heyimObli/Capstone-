
/**
 * MERN Architecture: Models Layer
 * Definitive schemas for MongoDB storage.
 */

export interface UserSchema {
  name: string;
  email: string;
  passwordHash: string;
  createdAt: Date;
}

export interface ChatSchema {
  userId: string;
  userMessage: string;
  botResponse: string;
  detectedEmotion: string;
  isCrisis: boolean;
  createdAt: Date;
}

export interface JournalSchema {
  userId: string;
  content: string;
  reflection: string;
  createdAt: Date;
}

// In a real MERN app, you would use:
// const mongoose = require('mongoose');
// const User = mongoose.model('User', userSchema);
// ...
