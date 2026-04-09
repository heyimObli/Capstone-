
/**
 * MERN Architecture: Routes Layer
 * Standard API route map for a MERN application.
 */

export const API_ROUTES = {
  AUTH: {
    LOGIN: '/api/auth/login',
    SIGNUP: '/api/auth/signup',
  },
  CHAT: {
    SEND: '/api/chat',
    STATS: '/api/chat/mood-stats',
  },
  JOURNAL: {
    SAVE: '/api/journal',
    GET_ALL: '/api/journal',
  }
};
