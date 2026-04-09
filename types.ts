
export type Role = 'user' | 'bot' | 'system';

export interface User {
  id: string;
  name: string;
  email: string;
  createdAt: Date;
}

export type ViewState = 'login' | 'signup' | 'chat' | 'dashboard' | 'journal';

export interface AuthState {
  user: User | null;
  token: string | null;
  view: ViewState;
}

export interface Message {
  id: string;
  role: Role;
  content: string;
  timestamp: Date;
  emotion?: Emotion;
  isCrisis?: boolean; // Flag to identify high-risk messages
}

export interface JournalEntry {
  id: string;
  content: string;
  reflection?: string;
  createdAt: Date;
}

export type Emotion = 'happy' | 'sad' | 'anxious' | 'angry' | 'stressed' | 'neutral';

export interface EmotionStat {
  emotion: Emotion;
  count: number;
  color: string;
}

export interface ChatSession {
  messages: Message[];
  isLoading: boolean;
}

export interface ChatThread {
  id: string;
  title: string;
  createdAt: Date;
  messages: Message[];
}

/**
 * Backend Schema Reference (for MERN developers)
 */
export interface MongoChatRecord {
  _id?: string;
  userId: string;
  userMessage: string;
  botResponse: string;
  createdAt: Date;
  detectedEmotion: Emotion;
  isCrisis: boolean; // Added for crisis tracking in DB
}

export interface MongoJournalRecord {
  _id?: string;
  userId: string;
  content: string;
  reflection: string;
  createdAt: Date;
}

export interface MongoUserRecord {
  _id?: string;
  name: string;
  email: string;
  password?: string;
  createdAt: Date;
}
