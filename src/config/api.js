// API Configuration
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'https://nestjs-app-5cg35pg3yq-uc.a.run.app';
// API Endpoints
export const API_ENDPOINTS = {
  // User/Authentication
  USER: {
    REGISTER: '/api/user/register',
    LOGIN: '/api/user/login',
    LOGOUT: '/api/user/logout',
    ME: '/api/user/me'
  },
  // Portfolio
  PORTFOLIO: {
    CREATE: '/portfolio',
    GET_ME: '/portfolio/me',
    GET_BY_USER_ID: (userId) => `/portfolio/user/${userId}`,
    UPDATE_TECH_STACK: '/portfolio/tech-stack',
    UPDATE_CAREER: '/portfolio/career',
    UPDATE_PROJECTS: '/portfolio/projects',
    UPDATE_ACTIVITIES_AWARDS: '/portfolio/activities-awards',
    UPDATE_DISPLAY_NAME: '/portfolio/display-name',
    UPDATE_CONTACT: '/portfolio/contact',
    UPDATE_AFFILIATION: '/portfolio/affiliation'
  },
  // Chat
  CHAT: {
    CREATE_SESSION: '/chat/sessions',
    GET_SESSIONS: '/chat/sessions',
    GET_SESSION: (sessionId) => `/chat/sessions/${sessionId}`,
    DELETE_SESSION: (sessionId) => `/chat/sessions/${sessionId}`,
    GET_MESSAGES: (sessionId) => `/chat/sessions/${sessionId}/messages`,
    SEND_MESSAGE: (sessionId) => `/chat/sessions/${sessionId}/messages`
  },
  // AI
  AI: {
    CHAT: '/ai/chat'
  },
  // Posts
  POSTS: {
    GET_ALL: '/posts',
    GET_BY_ID: (id) => `/posts/${id}`,
    CREATE: '/posts',
    UPDATE: (id) => `/posts/${id}`,
    DELETE: (id) => `/posts/${id}`
  }
}

