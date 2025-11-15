import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'

export const chatbotService = {
  /**
   * Create a new chat session
   * @returns {Promise} Session data
   */
  async createSession() {
    try {
      const response = await apiClient.post(API_ENDPOINTS.CHAT.CREATE_SESSION)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get all chat sessions for current user
   * @returns {Promise} Array of sessions
   */
  async getSessions() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.CHAT.GET_SESSIONS)
      return response.data
    } catch (error) {
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
      const response = await apiClient.get(API_ENDPOINTS.CHAT.GET_MESSAGES(sessionId))
      return response.data
    } catch (error) {
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
      const response = await apiClient.post(API_ENDPOINTS.CHAT.SEND_MESSAGE(sessionId), {
        message
      })
      return response.data
    } catch (error) {
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

