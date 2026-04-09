
export const SYSTEM_PROMPT = `
You are a compassionate and professional mental health assistant. 
You do not diagnose medical conditions.
You provide emotional support, grounding techniques, breathing exercises, and positive coping strategies.
Keep responses empathetic, calm, and under 150 words.
If a user expresses self-harm or suicidal thoughts, gently encourage seeking professional help or contacting a trusted person immediately.
Focus on being a listener first, then offering gentle guidance.
`;

export const JOURNAL_SYSTEM_PROMPT = `
You are a wise and compassionate journaling companion. 
Read the user's journal entry and provide a brief, insightful reflection (under 100 words).
Focus on identifying emotional themes, offering validation, and suggesting one gentle reflective question to help them go deeper.
Maintain a warm, non-judgmental, and therapeutic tone.
`;

export const CRISIS_KEYWORDS = [
  'suicide', 'kill myself', 'self harm', 'end my life', 'end it all', 
  'cutting myself', 'take my life', 'want to die', 'suicidal'
];

export const EMERGENCY_SUPPORT_MESSAGE = `
I'm very concerned about what you're sharing, and I want to make sure you have the support you need right now. You don't have to go through this alone.

Please reach out to one of these free, confidential professional helplines in India available 24/7:

• AASRA: 9820466726
• Vandrevala Foundation: 9999666555
• iCall (TISS): 022-25521111 (Mon-Sat, 8am-10pm)
• Kiran (National Helpline): 1800-599-0019

If you are in immediate danger, please call 112 or go to the nearest emergency room. You are important, and help is available.
`;

export const EMOTION_KEYWORDS = {
  happy: [
    'happy',
    'joy',
    'good',
    'great',
    'excited',
    'wonderful',
    'smiling',
    'thanks',
    'glad',
    'celebrate',
    'cheerful',
    'content',
    'grateful',
    'relieved',
    'optimistic',
    'hopeful'
  ],
  sad: [
    'sad',
    'unhappy',
    'crying',
    'depressed',
    'lonely',
    'hopeless',
    'heartbroken',
    'grief',
    'pain',
    'down',
    'blue',
    'miserable',
    'worthless',
    'empty',
    'hurt',
    'tears'
  ],
  anxious: [
    'anxious',
    'worried',
    'panic',
    'panicking',
    'nervous',
    'scared',
    'shaking',
    'fear',
    'dread',
    'tense',
    'on edge',
    'uneasy',
    'overthinking',
    'restless'
  ],
  angry: [
    'angry',
    'mad',
    'furious',
    'annoyed',
    'pissed',
    'frustrated',
    'irritated',
    'hate',
    'rage',
    'livid',
    'upset',
    'offended',
    'snapped',
    'short tempered'
  ],
  stressed: [
    'stressed',
    'overwhelmed',
    'busy',
    'tired',
    'burnout',
    'burned out',
    'pressure',
    'exhausted',
    'deadline',
    'drained',
    'swamped',
    'overloaded',
    'worn out'
  ]
};

export const EMOTION_PROMPTS: Record<string, string> = {
  happy: "The user seems to be in a good mood. Acknowledge their joy, celebrate with them briefly, and encourage them to savor this positive moment.",
  sad: "The user seems sad or grieving. Use a very gentle, validating tone. Let them know it's okay to feel this way and offer a comforting presence.",
  anxious: "The user is expressing anxiety. Use grounding language. Include a very brief '5-4-3-2-1' grounding exercise or a deep breath prompt.",
  angry: "The user is frustrated or angry. Validate their right to feel this emotion without judgment. Suggest a safe way to release tension, like a quick walk or tensing/relaxing muscles.",
  stressed: "The user feels overwhelmed. Help them break things down into one small, manageable step. Emphasize that they don't have to carry everything at once.",
  neutral: "Provide standard compassionate support and active listening."
};

export const COLORS = {
  bgPrimary: 'bg-emerald-50',
  bgSecondary: 'bg-white',
  accent: 'emerald',
  userBubble: 'bg-emerald-600 text-white',
  botBubble: 'bg-slate-100 text-slate-800',
  warning: 'bg-amber-50 text-amber-800 border-amber-200'
};
