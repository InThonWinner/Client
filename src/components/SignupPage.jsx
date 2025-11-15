import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { authService } from '../services'
import './SignupPage.css'

function SignupPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    realName: '',
    nickname: '',
    phone: '',
    role: '',
    studentId: '',
    affiliation: ''
  })
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('')
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

  const handleTypeToggle = () => {
    setIsTypeOpen(!isTypeOpen)
  }

  const handleTypeSelect = (type) => {
    // Map Korean to API role values
    const roleMap = {
      '재학생': 'STUDENT',
      '졸업생': 'ALUMNI'
    }
    setSelectedType(type)
    setFormData(prev => ({
      ...prev,
      role: roleMap[type] || ''
    }))
    setIsTypeOpen(false)
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setIsLoading(true)

    try {
      // Validate required fields
      if (!formData.email || !formData.password || !formData.realName || !formData.nickname || !formData.role) {
        setError('필수 항목을 모두 입력해주세요.')
        setIsLoading(false)
        return
      }
      
      // Navigate to certification page with form data
      // We'll submit everything together including the image
      navigate('/signup/certification', { state: { userData: formData } })
    } catch (err) {
      setError(err.message || '회원가입에 실패했습니다. 입력 정보를 확인해주세요.')
      console.error('Signup error:', err)
      setIsLoading(false)
    }
  }

  return (
    <div className="signup-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      <div className="signup-form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Email Input - First field according to Figma */}
          <div className="input-wrapper">
            <input
              type="email"
              className="signup-input"
              placeholder="Email"
              value={formData.email}
              onChange={(e) => handleInputChange('email', e.target.value)}
              required
            />
          </div>

          {/* Password Input - Second field according to Figma */}
          <div className="input-wrapper">
            <input
              type="password"
              className="signup-input"
              placeholder="Password"
              value={formData.password}
              onChange={(e) => handleInputChange('password', e.target.value)}
              required
            />
          </div>

          {/* Real Name Input - Third field according to Figma */}
          <div className="input-wrapper">
            <input
              type="text"
              className="signup-input"
              placeholder="realName"
              value={formData.realName}
              onChange={(e) => handleInputChange('realName', e.target.value)}
              required
            />
          </div>

          {/* Nickname Input - Fourth field according to Figma */}
          <div className="input-wrapper">
            <input
              type="text"
              className="signup-input"
              placeholder="Nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
              required
            />
          </div>

          {/* Phone Number Input - Fifth field according to Figma */}
          <div className="input-wrapper">
            <input
              type="tel"
              className="signup-input"
              placeholder="Phone number"
              value={formData.phone}
              onChange={(e) => handleInputChange('phone', e.target.value)}
            />
          </div>

          {/* Type Accordion/Dropdown - Sixth field according to Figma */}
          <div className="type-accordion">
            <div className="accordion-header" onClick={handleTypeToggle}>
              <span className="accordion-title">{selectedType || 'type'}</span>
              <svg 
                className={`accordion-chevron ${isTypeOpen ? 'open' : ''}`}
                width="20" 
                height="20" 
                viewBox="0 0 20 20" 
                fill="none" 
                xmlns="http://www.w3.org/2000/svg"
              >
                <path 
                  d="M5 7.5L10 12.5L15 7.5" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className={`accordion-content ${isTypeOpen ? 'open' : ''}`}>
              <div className="accordion-option" onClick={() => handleTypeSelect('재학생')}>
                재학생
              </div>
              <div className="accordion-option" onClick={() => handleTypeSelect('졸업생')}>
                졸업생
              </div>
            </div>
          </div>

          {/* Student ID Input - Seventh field according to Figma */}
          <div className="input-wrapper">
            <input
              type="text"
              className="signup-input"
              placeholder="studentId"
              value={formData.studentId}
              onChange={(e) => handleInputChange('studentId', e.target.value)}
            />
          </div>

          {/* Affiliation Input - Eighth field according to Figma */}
          <div className="input-wrapper">
            <input
              type="text"
              className="signup-input"
              placeholder="affiliation"
              value={formData.affiliation}
              onChange={(e) => handleInputChange('affiliation', e.target.value)}
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

          {/* Next Button - According to Figma design */}
          <button type="submit" className="signup-button" disabled={isLoading}>
            {isLoading ? '가입 중...' : 'Next'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage

