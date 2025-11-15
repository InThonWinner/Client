import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './SignupPage.css'

function SignupPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [formData, setFormData] = useState({
    name: '',
    nickname: '',
    phoneNumber: '',
    type: '',
    studentNumber: ''
  })
  const [isTypeOpen, setIsTypeOpen] = useState(false)
  const [selectedType, setSelectedType] = useState('')

  useEffect(() => {
    setOpacity(1)
  }, [])

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleTypeToggle = () => {
    setIsTypeOpen(!isTypeOpen)
  }

  const handleTypeSelect = (type) => {
    setSelectedType(type)
    setFormData(prev => ({
      ...prev,
      type: type
    }))
    setIsTypeOpen(false)
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    console.log('Signup form data:', formData)
    // Add your signup logic here
    alert('회원가입이 완료되었습니다! (콘솔에서 데이터 확인 가능)')
    // Optionally navigate to another page
    // navigate('/')
  }

  return (
    <div className="signup-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      <div className="signup-form-container">
        <form className="signup-form" onSubmit={handleSubmit}>
          {/* Name Input */}
          <div className="input-wrapper">
            <input
              type="text"
              className="signup-input"
              placeholder="Name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
            />
          </div>

          {/* Nickname Input */}
          <div className="input-wrapper">
            <input
              type="text"
              className="signup-input"
              placeholder="Nickname"
              value={formData.nickname}
              onChange={(e) => handleInputChange('nickname', e.target.value)}
            />
          </div>

          {/* Phone Number Input */}
          <div className="input-wrapper">
            <input
              type="tel"
              className="signup-input"
              placeholder="Phone number"
              value={formData.phoneNumber}
              onChange={(e) => handleInputChange('phoneNumber', e.target.value)}
            />
          </div>

          {/* Type Accordion/Dropdown */}
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
                  stroke="#626262" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            {isTypeOpen && (
              <div className="accordion-content">
                <div className="accordion-option" onClick={() => handleTypeSelect('Student')}>
                  Student
                </div>
                <div className="accordion-option" onClick={() => handleTypeSelect('Alumni')}>
                  Alumni
                </div>
                <div className="accordion-option" onClick={() => handleTypeSelect('Professor')}>
                  Professor
                </div>
              </div>
            )}
          </div>

          {/* Student Number Input */}
          <div className="input-wrapper">
            <input
              type="text"
              className="signup-input"
              placeholder="student number"
              value={formData.studentNumber}
              onChange={(e) => handleInputChange('studentNumber', e.target.value)}
            />
          </div>

          {/* Sign Up Button */}
          <button type="submit" className="signup-button">
            Sign Up
          </button>
        </form>
      </div>
    </div>
  )
}

export default SignupPage

