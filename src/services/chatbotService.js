import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'

export const chatbotService = {
  /**
   * Create a new chat session
   * @returns {Promise} Session data
   */
  async createSession() {
    try {
      console.log('chatbotService.createSession: Creating new session')
      console.log('API endpoint:', API_ENDPOINTS.CHAT.CREATE_SESSION)
      const response = await apiClient.post(API_ENDPOINTS.CHAT.CREATE_SESSION)
      console.log('chatbotService.createSession: Response status:', response.status)
      console.log('chatbotService.createSession: Response data:', response.data)
      return response.data
    } catch (error) {
      console.error('chatbotService.createSession: Error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  /**
   * Get all chat sessions for current user
   * @returns {Promise} Array of sessions
   */
  async getSessions() {
    try {
      console.log('chatbotService.getSessions: Fetching sessions')
      console.log('API endpoint:', API_ENDPOINTS.CHAT.GET_SESSIONS)
      const response = await apiClient.get(API_ENDPOINTS.CHAT.GET_SESSIONS)
      console.log('chatbotService.getSessions: Response status:', response.status)
      console.log('chatbotService.getSessions: Response data:', response.data)
      // Handle different response formats
      const data = response.data
      if (Array.isArray(data)) {
        return data
      } else if (data?.sessions) {
        return data.sessions
      } else if (data?.data) {
        return Array.isArray(data.data) ? data.data : [data.data]
      }
      return data || []
    } catch (error) {
      console.error('chatbotService.getSessions: Error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  /**
   * Get specific chat session
   * @param {string} sessionId - Session ID
   * @returns {Promise} Session data
   */
  async getSession(sessionId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHAT.GET_SESSION(sessionId))
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete a chat session
   * @param {string} sessionId - Session ID
   * @returns {Promise}
   */
  async deleteSession(sessionId) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.CHAT.DELETE_SESSION(sessionId))
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get messages for a session
   * @param {string} sessionId - Session ID
   * @returns {Promise} Array of messages
   */
  async getMessages(sessionId) {
    try {
      console.log('chatbotService.getMessages: Fetching messages for session:', sessionId)
      console.log('API endpoint:', API_ENDPOINTS.CHAT.GET_MESSAGES(sessionId))
      const response = await apiClient.get(API_ENDPOINTS.CHAT.GET_MESSAGES(sessionId))
      console.log('chatbotService.getMessages: Response status:', response.status)
      console.log('chatbotService.getMessages: Response data:', response.data)
      // Handle different response formats
      const data = response.data
      if (Array.isArray(data)) {
        return data
      } else if (data?.messages) {
        return data.messages
      } else if (data?.data) {
        return Array.isArray(data.data) ? data.data : [data.data]
      }
      return data || []
    } catch (error) {
      console.error('chatbotService.getMessages: Error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  },

  /**
   * Send message to a chat session
   * @param {string} sessionId - Session ID
   * @param {string} message - Message content
   * @returns {Promise} Response data
   */
  async sendMessage(sessionId, message) {
    try {
      console.log('chatbotService.sendMessage: Sending message to session:', sessionId)
      console.log('API endpoint:', API_ENDPOINTS.CHAT.SEND_MESSAGE(sessionId))
      console.log('Message content:', message)
      
      // Try different possible request body formats
      // Common formats: { message }, { content }, { text }, { message: content }
      const requestBody = { 
        message: message,
        content: message  // Also send as content in case backend expects it
      }
      console.log('Request body:', requestBody)
      
      const response = await apiClient.post(API_ENDPOINTS.CHAT.SEND_MESSAGE(sessionId), requestBody)
      console.log('chatbotService.sendMessage: Response status:', response.status)
      console.log('chatbotService.sendMessage: Response data:', response.data)
      console.log('chatbotService.sendMessage: Full response:', JSON.stringify(response.data, null, 2))
      return response.data
    } catch (error) {
      console.error('chatbotService.sendMessage: Error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url,
        requestData: error.config?.data
      })
      throw error
    }
  },

  /**
   * Chat with AI (direct AI endpoint)
   * @param {string} message - User message
   * @param {Array} conversationHistory - Optional conversation history
   * @returns {Promise} AI response
   */
  async chatWithAI(message, conversationHistory = []) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.AI.CHAT, {
        message,
        history: conversationHistory
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

