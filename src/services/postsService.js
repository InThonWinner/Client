import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'

export const postsService = {
  /**
   * Get all posts
   * @param {Object} params - Query parameters (page, limit, etc.)
   * @returns {Promise} Posts data
   */
  async getAllPosts(params = {}) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.POSTS.GET_ALL, { params })
      return response.data
    } catch (error) {
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
  }
}

