import axios from 'axios'
import { API_BASE_URL } from '../config/api'

// Create axios instance with default config
const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Request interceptor - Add auth token if available
apiClient.interceptors.request.use(
  (config) => {
    console.log('API Request:', config.method?.toUpperCase(), config.url)
    console.log('Base URL:', config.baseURL)
    console.log('Full URL:', `${config.baseURL}${config.url}`)
    console.log('Request data:', config.data)
    
    const token = localStorage.getItem('authToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
      console.log('Auth token added to request')
    } else {
      console.warn('No auth token found in localStorage')
    }
    
    // If data is FormData, remove Content-Type header to let browser set it with boundary
    if (config.data instanceof FormData) {
      delete config.headers['Content-Type']
    }
    return config
  },
  (error) => {
    console.error('Request interceptor error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor - Handle errors globally
apiClient.interceptors.response.use(
  (response) => {
    console.log('API Response:', response.status, response.config.url)
    console.log('Response data:', response.data)
    return response
  },
  (error) => {
    console.error('API Error:', {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data,
      message: error.message,
      baseURL: error.config?.baseURL,
      fullURL: `${error.config?.baseURL}${error.config?.url}`
    })
    
    // Handle network errors (no response from server)
    if (!error.response) {
      console.error('Network Error - Server may be unreachable:', {
        message: error.message,
        baseURL: API_BASE_URL,
        url: error.config?.url
      })
      return Promise.reject(new Error(`서버에 연결할 수 없습니다. 서버가 실행 중인지 확인해주세요. (${API_BASE_URL})`))
    }
    
    // Handle 401 Unauthorized - redirect to login
    if (error.response?.status === 401) {
      console.warn('401 Unauthorized - Token may be invalid or expired')
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      // You can add navigation here if needed
      // window.location.href = '/login'
    }
    
    // Handle other errors
    const errorMessage = error.response?.data?.message || error.message || 'An error occurred'
    return Promise.reject(new Error(errorMessage))
  }
)

export default apiClient

