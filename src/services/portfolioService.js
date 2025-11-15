import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'

export const portfolioService = {
  /**
   * Get current user's portfolio
   * @returns {Promise} Portfolio data
   */
  async getMyPortfolio() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.GET_ME)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get portfolio by user ID
   * @param {string} userId - User ID
   * @returns {Promise} Portfolio data
   */
  async getPortfolioByUserId(userId) {
    try {
      const response = await apiClient.get(API_ENDPOINTS.PORTFOLIO.GET_BY_USER_ID(userId))
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Create new portfolio
   * @param {Object} portfolioData - Portfolio data
   * @returns {Promise} Created portfolio data
   */
  async createPortfolio(portfolioData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.PORTFOLIO.CREATE, portfolioData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update tech stack
   * @param {Object} techStackData - Tech stack data
   * @returns {Promise} Updated portfolio data
   */
  async updateTechStack(techStackData) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_TECH_STACK, techStackData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update career
   * @param {Object} careerData - Career data
   * @returns {Promise} Updated portfolio data
   */
  async updateCareer(careerData) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_CAREER, careerData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update projects
   * @param {Object} projectsData - Projects data
   * @returns {Promise} Updated portfolio data
   */
  async updateProjects(projectsData) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_PROJECTS, projectsData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update activities and awards
   * @param {Object} activitiesData - Activities and awards data
   * @returns {Promise} Updated portfolio data
   */
  async updateActivitiesAwards(activitiesData) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_ACTIVITIES_AWARDS, activitiesData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update display name
   * @param {string} displayName - Display name
   * @returns {Promise} Updated portfolio data
   */
  async updateDisplayName(displayName) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_DISPLAY_NAME, { displayName })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update contact information
   * @param {Object} contactData - Contact information
   * @returns {Promise} Updated portfolio data
   */
  async updateContact(contactData) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_CONTACT, contactData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Update affiliation
   * @param {string} affiliation - Affiliation
   * @returns {Promise} Updated portfolio data
   */
  async updateAffiliation(affiliation) {
    try {
      const response = await apiClient.patch(API_ENDPOINTS.PORTFOLIO.UPDATE_AFFILIATION, { affiliation })
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Get user's portfolio (convenience method - defaults to current user)
   * @param {string} userId - Optional user ID
   * @returns {Promise} Portfolio data
   */
  async getPortfolio(userId = null) {
    if (userId) {
      return this.getPortfolioByUserId(userId)
    }
    return this.getMyPortfolio()
  },

  /**
   * Save portfolio (convenience method that creates or updates)
   * @param {Object} portfolioData - Portfolio data
   * @returns {Promise} Portfolio data
   */
  async savePortfolio(portfolioData) {
    try {
      // Try to get existing portfolio first
      await this.getMyPortfolio()
      // If exists, we need to update individual sections
      // For now, create a new one (you may want to implement update logic)
      return this.createPortfolio(portfolioData)
    } catch (error) {
      // If portfolio doesn't exist, create it
      if (error.response?.status === 404) {
        return this.createPortfolio(portfolioData)
      }
      throw error
    }
  }
}

