import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'

export const feedService = {
  /**
   * Get all posts
   * @param {Object} params - Query parameters (page, limit, etc.)
   * @returns {Promise} Posts data
   */
  async getFeed(params = {}) {
    try {
      console.log('feedService.getFeed called with params:', params)
      console.log('API endpoint:', API_ENDPOINTS.POSTS.GET_ALL)
      const response = await apiClient.get(API_ENDPOINTS.POSTS.GET_ALL, { params })
      console.log('feedService response status:', response.status)
      console.log('feedService response data:', response.data)
      return response.data
    } catch (error) {
      console.error('feedService.getFeed error:', error)
      throw error
    }
  },

  /**
   * Create a new post
   * @param {Object} postData - Post data
   * @returns {Promise} Created post data
   */
  async createPost(postData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.POSTS.CREATE, postData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update a post
   * @param {string} id - Post ID
   * @param {Object} postData - Updated post data
   * @returns {Promise} Updated post data
   */
  async updatePost(id, postData) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.POSTS.UPDATE(id), postData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Delete a post
   * @param {string} id - Post ID
   * @returns {Promise}
   */
  async deletePost(id) {
    try {
      const response = await apiClient.delete(API_ENDPOINTS.POSTS.DELETE(id))
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get specific feed post by ID
   * @param {string|number} id - Post ID
   * @returns {Promise} Post data
   */
  async getFeedPost(id) {
    try {
      console.log('feedService.getFeedPost called with id:', id)
      console.log('API endpoint:', API_ENDPOINTS.POSTS.GET_BY_ID(id))
      const response = await apiClient.get(API_ENDPOINTS.POSTS.GET_BY_ID(id))
      console.log('feedService.getFeedPost response status:', response.status)
      console.log('feedService.getFeedPost response data:', response.data)
      return response.data
    } catch (error) {
      console.error('feedService.getFeedPost error:', error)
      console.error('Error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        url: error.config?.url
      })
      throw error
    }
  }
}

