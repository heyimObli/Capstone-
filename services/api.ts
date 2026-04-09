
import axios from "axios";
import { chatController } from "../server/controllers/chatController";
import { aiService } from "../server/services/geminiService";
import { Message, JournalEntry, User } from "../types";
import { v4 as uuidv4 } from "uuid";

const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL || "http://localhost:5000";

/**
 * Frontend Service Layer
 * The UI components talk ONLY to this service.
 */

export const api = {
  /**
   * Sends a message to the "backend" and returns the processed response.
   */
  async sendMessage(text: string, messages: Message[], token?: string | null) {
    const history = messages.slice(-10).map(m => ({
      role: m.role === 'bot' ? 'model' : 'user',
      parts: [{ text: m.content }]
    }));

    // Generate the bot response locally (Gemini + controller logic)
    const result = await chatController.handleMessage({ message: text, history });

    const botContent =
      result.botResponse || "I'm here for you. Tell me more.";

    // Fire-and-forget log to real backend so MongoDB stores this conversation.
    // This does not affect the UI if it fails.
    if (token) {
      try {
        await axios.post(
          `${API_BASE_URL}/api/chat/log`,
          {
            userMessage: text,
            botResponse: botContent,
          },
          {
            headers: {
              Authorization: `Bearer ${token}`,
              "Content-Type": "application/json",
            },
          }
        );
      } catch (e) {
        console.warn("Logging chat to backend failed (UI will still work):", e);
      }
    }

    return {
      id: uuidv4(),
      role: "bot" as const,
      content: botContent,
      timestamp: new Date(),
      isCrisis: result.isCrisis,
    };
  },

  /**
   * Processes and saves a journal entry (content + reflection) to the backend.
   */
  async saveJournalEntry(
    content: string,
    token: string | null
  ): Promise<JournalEntry> {
    if (!token) {
      throw new Error("You must be logged in to save journal entries.");
    }

    // Generate reflection client-side using Gemini
    const reflection = await aiService.generateReflection(content);

    // Persist to backend so it goes into MongoDB (journal collection)
    const res = await axios.post(
      `${API_BASE_URL}/api/journal`,
      {
        content,
        reflection: reflection || undefined,
      },
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    return {
      id: res.data.id,
      content: res.data.content,
      reflection: res.data.reflection,
      createdAt: new Date(res.data.createdAt),
    };
  },

  /**
   * Real authentication calls against the Express backend.
   */
  async authenticate(
    view: "login" | "signup",
    credentials: any
  ): Promise<{ user: User; token: string }> {
    const endpoint = view === "signup" ? "/api/auth/register" : "/api/auth/login";

    const res = await axios.post(`${API_BASE_URL}${endpoint}`, credentials, {
      headers: { "Content-Type": "application/json" },
    });

    return {
      user: {
        id: res.data.user.id,
        name: res.data.user.name,
        email: res.data.user.email,
        createdAt: new Date(),
      },
      token: res.data.token,
    };
  },

  /**
   * Fetch chat history for the logged-in user from the backend.
   */
  async getChatHistory(token: string) {
    const res = await axios.get(`${API_BASE_URL}/api/chat/history`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.chats as {
      _id: string;
      userMessage: string;
      botResponse: string;
      createdAt: string;
    }[];
  },

  /**
   * Fetch journal entries for the logged-in user.
   */
  async getJournalEntries(token: string) {
    const res = await axios.get(`${API_BASE_URL}/api/journal`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
    return res.data.entries as {
      id: string;
      content: string;
      reflection?: string;
      createdAt: string;
    }[];
  },
};
