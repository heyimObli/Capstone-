
import { Emotion } from "../../types";
import { EMOTION_KEYWORDS, CRISIS_KEYWORDS } from "../../constants";

/**
 * MERN Architecture: Utils Layer
 * Dedicated logic for processing and analyzing user input.
 */

export const classifyEmotion = (text: string): Emotion => {
  const lower = text.toLowerCase();
  // Cast Object.entries to resolve type inference for keywords.some()
  for (const [emotion, keywords] of Object.entries(EMOTION_KEYWORDS) as [string, string[]][]) {
    if (keywords.some(k => lower.includes(k))) return emotion as Emotion;
  }
  return 'neutral';
};

export const detectCrisis = (text: string): boolean => {
  const lower = text.toLowerCase();
  return CRISIS_KEYWORDS.some(keyword => lower.includes(keyword));
};
