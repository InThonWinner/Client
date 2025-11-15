import apiClient from './api'
import { API_ENDPOINTS } from '../config/api'

export const authService = {
  /**
   * Login user
   * @param {Object} credentials - { email, password }
   * @returns {Promise} User data and token
   */
  async login(credentials) {
    try {
      console.log('Login request to:', API_ENDPOINTS.USER.LOGIN)
      console.log('Login data:', { email: credentials.email, hasPassword: !!credentials.password })
      
      const response = await apiClient.post(API_ENDPOINTS.USER.LOGIN, credentials)
      console.log('Login response status:', response.status)
      console.log('Login response headers:', response.headers)
      console.log('Login response data:', response.data)
      
      // Handle 204 No Content response (no body, check headers for token)
      if (response.status === 204) {
        console.log('Received 204 response, checking headers for token...')
        console.log('All response headers:', response.headers)
        
        // Axios converts header names to lowercase
        // Check common token header locations
        const headers = response.headers
        const authToken = 
          headers['authorization']?.replace(/^Bearer\s+/i, '') ||
          headers['x-auth-token'] ||
          headers['x-access-token'] ||
          headers['token'] ||
          headers['access-token'] ||
          headers['access_token']
        
        console.log('Extracted token:', authToken ? 'Found' : 'Not found')
        
        if (authToken) {
          localStorage.setItem('authToken', authToken)
          console.log('Token stored from headers successfully')
          return { success: true, token: authToken }
        } else {
          console.warn('204 response but no token found in headers')
          console.warn('Available headers:', Object.keys(headers))
          // Even without token, return success for 204
          return { success: true }
        }
      }
      
      // Handle 200 OK response (with body)
      // Backend returns: { success: true, message: '로그인 성공', data: { accessToken, user: {...} } }
      const responseData = response.data || {}
      const { accessToken, user } = responseData.data || responseData
      
      console.log('Response structure:', {
        hasData: !!responseData.data,
        hasAccessToken: !!accessToken,
        hasUser: !!user,
        fullResponse: responseData
      })
      
      // Store accessToken
      if (accessToken) {
        localStorage.setItem('authToken', accessToken)
        console.log('AccessToken stored successfully')
      } else {
        console.warn('200 response but no accessToken found in response')
        console.warn('Response data structure:', responseData)
      }
      
      // Store user data
      if (user) {
        localStorage.setItem('user', JSON.stringify(user))
        console.log('User data stored:', { id: user.id, email: user.email, nickname: user.nickname })
      } else {
        console.warn('200 response but no user data found in response')
      }
      
      return responseData
    } catch (error) {
      console.error('Login error details:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        statusText: error.response?.statusText,
        headers: error.response?.headers
      })
      throw error
    }
  },

  /**
   * Sign up new user
   * @param {Object} userData - { email, password, realName, nickname, phone, role, studentId, affiliation }
   * @returns {Promise} User data
   */
  async signup(userData) {
    try {
      const response = await apiClient.post(API_ENDPOINTS.USER.REGISTER, userData)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Sign up new user with verification image
   * @param {FormData} formData - FormData containing all user data and verificationImage
   * @returns {Promise} User data
   */
  async signupWithVerification(formData) {
    try {
      // Don't set Content-Type header manually - let axios set it automatically with boundary
      // When using FormData, axios will automatically set Content-Type to multipart/form-data with boundary
      const response = await apiClient.post(API_ENDPOINTS.USER.REGISTER, formData, {
        headers: {
          // Remove Content-Type to let browser set it automatically with boundary
        },
        // Override default JSON content type
        transformRequest: [(data) => data] // Don't transform FormData
      })
      return response.data
    } catch (error) {
      // Preserve original error for better debugging
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        throw error
      } else if (error.request) {
        // The request was made but no response was received
        throw new Error('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.')
      } else {
        // Something happened in setting up the request that triggered an Error
        throw error
      }
    }
  },

  /**
   * Logout user
   * @returns {Promise}
   */
  async logout() {
    try {
      await apiClient.post(API_ENDPOINTS.USER.LOGOUT)
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
    } catch (error) {
      // Even if API call fails, clear local storage
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      throw error
    }
  },

  /**
   * Get current user profile
   * @returns {Promise} User data
   */
  async getProfile() {
    try {
      const response = await apiClient.get(API_ENDPOINTS.USER.ME)
      return response.data
    } catch (error) {
      throw error
    }
  },

  /**
   * Check if user is authenticated
   * @returns {boolean}
   */
  isAuthenticated() {
    return !!localStorage.getItem('authToken')
  },

  /**
   * Get stored user data
   * @returns {Object|null}
   */
  getStoredUser() {
    const userStr = localStorage.getItem('user')
    return userStr ? JSON.parse(userStr) : null
  },

  /**
   * Upload certification image
   * @param {FormData} formData - FormData containing the certification image
   * @returns {Promise} Upload response
   */
  async uploadCertification(formData) {
    try {
      const token = localStorage.getItem('authToken')
      const response = await apiClient.post('/api/user/certification', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          ...(token && { Authorization: `Bearer ${token}` })
        }
      })
      return response.data
    } catch (error) {
      throw error
    }
  }
}

