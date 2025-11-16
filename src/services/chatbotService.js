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
   * Backend automatically saves user message, calls AI, and saves AI response
   * @param {string} sessionId - Session ID
   * @param {string} content - Message content
   * @returns {Promise} Response with userMessage, assistantMessage, and sources
   */
  async sendMessage(sessionId, content) {
    try {
      console.log(`=== chatbotService.sendMessage: Sending message to session ===`)
      console.log('Session ID:', sessionId)
      console.log('API endpoint:', API_ENDPOINTS.CHAT.SEND_MESSAGE(sessionId))
      console.log('Message content (first 100 chars):', content.substring(0, 100))
      
      // Backend expects: { content: "..." }
      // Backend automatically:
      // 1. Saves user message with role: USER
      // 2. Calls AI service
      // 3. Saves AI response with role: ASSISTANT
      // 4. Returns { userMessage, assistantMessage, sources }
      const requestBody = { 
        content: content
      }
      console.log('Request body:', JSON.stringify(requestBody, null, 2))
      
      const response = await apiClient.post(API_ENDPOINTS.CHAT.SEND_MESSAGE(sessionId), requestBody)
      console.log(`chatbotService.sendMessage: Response status:`, response.status)
      console.log(`chatbotService.sendMessage: Response data:`, response.data)
      
      // Backend returns: { userMessage, assistantMessage, sources }
      return response.data
    } catch (error) {
      console.error(`chatbotService.sendMessage: Error sending message:`, error)
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
   * Save a message to a chat session (legacy - kept for compatibility)
   * Note: This method is deprecated. Use sendMessage instead.
   * @deprecated Use sendMessage() instead - backend handles both user and assistant messages
   */
  async saveMessageToSession(sessionId, content, role = 'user') {
    // If role is 'assistant', we can't save it directly
    // Backend's sendMessage only accepts user messages and auto-saves assistant response
    if (role === 'assistant') {
      console.warn('chatbotService.saveMessageToSession: Cannot save assistant message directly. Backend auto-saves it when sending user message.')
      return null
    }
    
    // For user messages, use sendMessage (which handles everything)
    return this.sendMessage(sessionId, content)
  },


  /**
   * Chat with AI (direct AI endpoint)
   * @param {string} message - User message
   * @param {Array} conversationHistory - Optional conversation history
   * @param {string} sessionId - Optional session ID to save AI response automatically
   * @returns {Promise} AI response
   */
  async chatWithAI(message, conversationHistory = [], sessionId = null) {
    try {
      console.log('chatbotService.chatWithAI: Sending message to AI')
      console.log('API endpoint:', API_ENDPOINTS.AI.CHAT)
      console.log('Message:', message)
      console.log('History length:', conversationHistory.length)
      console.log('Session ID:', sessionId)
      
      // Backend expects 'question' field, not 'message'
      // Also include sessionId if provided so backend can save assistant response automatically
      const requestBody = {
        question: message,  // Use 'question' instead of 'message'
        history: conversationHistory
      }
      
      // Include sessionId if provided - backend might use this to save assistant response
      if (sessionId) {
        requestBody.sessionId = sessionId
      }
      
      console.log('Request body:', requestBody)
      
      const response = await apiClient.post(API_ENDPOINTS.AI.CHAT, requestBody)
      console.log('chatbotService.chatWithAI: Response status:', response.status)
      console.log('chatbotService.chatWithAI: Response data:', response.data)
      
      // Extract AI response from various possible response formats
      // Backend returns: { answer: "...", sources: [...] }
      const aiResponse = response.data?.answer ||  // Primary: 'answer' field
                         response.data?.response || 
                         response.data?.message || 
                         response.data?.content || 
                         response.data?.text ||
                         response.data?.data?.answer ||
                         response.data?.data?.response ||
                         response.data?.data?.message ||
                         response.data
      
      console.log('chatbotService.chatWithAI: Extracted AI response:', aiResponse)
      console.log('chatbotService.chatWithAI: Full response data:', response.data)
      
      // Return the answer string if found, otherwise return the full response
      if (typeof aiResponse === 'string') {
        return aiResponse
      } else if (response.data?.answer) {
        return response.data.answer
      }
      return response.data
    } catch (error) {
      console.error('chatbotService.chatWithAI: Error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status
      })
      throw error
    }
  }
}

