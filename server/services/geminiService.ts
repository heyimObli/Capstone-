
import { GoogleGenAI } from "@google/genai";
import { SYSTEM_PROMPT, EMOTION_PROMPTS, JOURNAL_SYSTEM_PROMPT } from "../../constants";
import { Emotion } from "../../types";
/**
 * MERN Architecture: Service Layer
 * Direct integration with external APIs (Gemini).
 *
 * IMPORTANT:
 * This project is bundled with Vite, so code here actually runs in the browser.
 * That means Node-style `process.env.API_KEY` will be undefined.
 *
 * Vite only exposes environment variables that start with `VITE_`.
 * We therefore read the key from `import.meta.env.VITE_GEMINI_API_KEY`.
 */

const getAI = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY as string | undefined;

  // Fail fast with a clear error message if the key is missing.
  if (!apiKey) {
    throw new Error(
      "GEMINI API key is missing. Set VITE_GEMINI_API_KEY in your .env (or .env.local) file."
    );
  }

  return new GoogleGenAI({ apiKey });
};

export const aiService = {
  /**
   * Generates a compassionate response based on chat history and detected emotion.
   */
  async generateChatResponse(
    userMessage: string, 
    history: {role: string, parts: {text: string}[]}[],
    detectedEmotion: Emotion = 'neutral'
  ) {
    const ai = getAI();
    const dynamicInstruction = `${SYSTEM_PROMPT}\n\nCURRENT CONTEXT: ${EMOTION_PROMPTS[detectedEmotion]}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [
        ...history,
        { role: 'user', parts: [{ text: userMessage }] }
      ],
      config: {
        systemInstruction: dynamicInstruction,
        temperature: 0.7,
        maxOutputTokens: 500,
      }
    });

    return response.text;
  },

  /**
   * Generates a reflective summary for journal entries.
   */
  async generateReflection(entryContent: string) {
    const ai = getAI();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: [{ role: 'user', parts: [{ text: entryContent }] }],
      config: {
        systemInstruction: JOURNAL_SYSTEM_PROMPT,
        temperature: 0.6,
        maxOutputTokens: 300,
      }
    });

    return response.text;
  }
};
