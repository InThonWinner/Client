import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setOpacity(1)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    // Clear error when user starts typing
    if (error) setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      console.log('LoginPage: Starting login...')
      console.log('LoginPage: Form data:', { email: formData.email, hasPassword: !!formData.password })
      
      const result = await authService.login(formData)
      console.log('LoginPage: Login successful, result:', result)
      console.log('LoginPage: Token in localStorage:', localStorage.getItem('authToken'))
      
      // Check if we have a token before navigating
      const token = localStorage.getItem('authToken')
      if (!token) {
        console.warn('LoginPage: No token found after login, but continuing anyway...')
      }
      
      // Navigate to chatbot page after successful login
      console.log('LoginPage: About to navigate to /chatbot')
      setTimeout(() => {
        console.log('LoginPage: Executing navigation now')
        navigate('/chatbot', { replace: true })
      }, 100)
    } catch (err) {
      console.error('LoginPage: Login error:', err)
      console.error('LoginPage: Error response:', err.response)
      
      // Extract error message
      let errorMessage = '로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.'
      if (err.response?.data) {
        const errorData = err.response.data
        if (errorData.message) {
          errorMessage = Array.isArray(errorData.message) 
            ? errorData.message.join(', ') 
            : errorData.message
        } else if (errorData.error) {
          errorMessage = errorData.error
        } else if (typeof errorData === 'string') {
          errorMessage = errorData
        }
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="login-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      <div className="login-form-container">
        <form className="login-form" onSubmit={handleSubmit}>
          {/* Email Input */}
          <div className="input-wrapper">
            <input
              type="email"
              className="login-input"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
            />
          </div>

          {/* Password Input */}
          <div className="input-wrapper">
            <input
              type="password"
              className={`login-input password-input ${isPasswordFocused ? 'active' : ''}`}
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              onFocus={() => setIsPasswordFocused(true)}
              onBlur={() => setIsPasswordFocused(false)}
            />
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message" style={{ 
              color: '#ff4444', 
              fontSize: '14px', 
              marginBottom: '10px',
              textAlign: 'center'
            }}>
              {error}
            </div>
          )}

          {/* Login Button */}
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? '로그인 중...' : 'Login'}
          </button>
        </form>
        
        {/* Signup Link */}
        <div className="signup-link-container">
          <span className="signup-link-text">회원이 아니신가요? </span>
          <a 
            href="#" 
            className="signup-link" 
            onClick={(e) => {
              e.preventDefault()
              navigate('/signup')
            }}
          >
            회원가입 바로가기
          </a>
        </div>
      </div>
    </div>
  )
}

export default LoginPage

