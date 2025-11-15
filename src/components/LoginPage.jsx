import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './LoginPage.css'

function LoginPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const [isPasswordFocused, setIsPasswordFocused] = useState(false)

  useEffect(() => {
    setOpacity(1)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Login form data:', formData)
    // Add your login logic here
    alert('로그인이 완료되었습니다! (콘솔에서 데이터 확인 가능)')
    // Optionally navigate to another page after successful login
    // navigate('/portfolio')
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

          {/* Login Button */}
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  )
}

export default LoginPage

