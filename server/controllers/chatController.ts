
import { aiService } from "../services/geminiService";
import { detectCrisis, classifyEmotion } from "../utils/analysis";
import { EMERGENCY_SUPPORT_MESSAGE } from "../../constants";

/**
 * MERN Architecture: Controller Layer
 * Manages the flow of data for chat-related requests.
 */

export const chatController = {
  async handleMessage(req: { message: string, history: any[] }) {
    const { message, history } = req;

    // 1. Safety Check (Utils)
    const isCrisis = detectCrisis(message);
    if (isCrisis) {
      return {
        botResponse: EMERGENCY_SUPPORT_MESSAGE,
        detectedEmotion: 'neutral',
        isCrisis: true
      };
    }

    // 2. Emotion Analysis (Utils)
    const emotion = classifyEmotion(message);

    // 3. AI Response (Services)
    const response = await aiService.generateChatResponse(message, history, emotion);

    // 4. Persistence would happen here:
    // await Chat.create({ userMessage: message, botResponse: response, ... });

    return {
      botResponse: response,
      detectedEmotion: emotion,
      isCrisis: false
    };
  }
};
