import { useState, useEffect } from 'react'
import { portfolioService } from '../services'
import './PortfolioEditPage.css'

function PortfolioEditPage() {
  const [opacity, setOpacity] = useState(0)
  const [where, setWhere] = useState('SK telecom')
  const [infoFields, setInfoFields] = useState(['', '', '', ''])
  const [toggles, setToggles] = useState({
    techStack: true,
    career: true,
    projects: true,
    activities: true
  })
  const [isLoading, setIsLoading] = useState(false)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [userName, setUserName] = useState('김호이')

  useEffect(() => {
    setOpacity(1)
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    setIsLoading(true)
    try {
      const portfolio = await portfolioService.getPortfolio()
      // Update state with loaded portfolio data
      if (portfolio) {
        setWhere(portfolio.where || 'SK telecom')
        setInfoFields(portfolio.infoFields || ['', '', '', ''])
        setToggles(portfolio.sections || {
          techStack: true,
          career: true,
          projects: true,
          activities: true
        })
        if (portfolio.name) setUserName(portfolio.name)
      }
    } catch (err) {
      console.error('Error loading portfolio:', err)
      // Don't show error if portfolio doesn't exist yet
      if (err.message && !err.message.includes('404')) {
        setError('포트폴리오를 불러오는데 실패했습니다.')
      }
    } finally {
      setIsLoading(false)
    }
  }

  const handleInfoFieldChange = (index, value) => {
    const newFields = [...infoFields]
    newFields[index] = value
    setInfoFields(newFields)
  }

  const handleToggle = (section) => {
    setToggles(prev => ({
      ...prev,
      [section]: !prev[section]
    }))
  }

  const handleSave = async () => {
    setError('')
    setSuccess('')
    setIsSaving(true)

    const formData = {
      name: userName,
      where: where,
      infoFields: infoFields,
      sections: {
        techStack: {
          visible: toggles.techStack,
          content: ''
        },
        career: {
          visible: toggles.career,
          content: ''
        },
        projects: {
          visible: toggles.projects,
          content: ''
        },
        activities: {
          visible: toggles.activities,
          content: ''
        }
      }
    }
    
    try {
      await portfolioService.savePortfolio(formData)
      setSuccess('포트폴리오가 저장되었습니다!')
      setTimeout(() => setSuccess(''), 3000)
    } catch (err) {
      setError(err.message || '포트폴리오 저장에 실패했습니다.')
      console.error('Save portfolio error:', err)
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="portfolio-edit-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
        <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
      </div>
    )
  }

  return (
    <div className="portfolio-edit-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Save Button */}
      <button className="save-button" onClick={handleSave} disabled={isSaving}>
        {isSaving ? '저장 중...' : 'Save'}
      </button>

      {/* Success/Error Messages */}
      {success && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          background: '#4CAF50', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {success}
        </div>
      )}
      {error && (
        <div style={{ 
          position: 'fixed', 
          top: '20px', 
          right: '20px', 
          background: '#ff4444', 
          color: 'white', 
          padding: '10px 20px', 
          borderRadius: '5px',
          zIndex: 1000
        }}>
          {error}
        </div>
      )}

      {/* Left Profile Section */}
      <div className="profile-section">
        {/* Profile Image */}
        <div className="profile-image-container">
          <div className="profile-circle-bg"></div>
          <img src="/images/profile.png" alt="Profile" className="profile-image" />
        </div>
      </div>

      {/* Name - positioned separately */}
      <h1 className="profile-name">{userName}</h1>

      {/* Contact Info */}
      <div className="contact-info">
          <div className="contact-item email">
            <svg className="contact-icon" width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V21C32 23.2091 30.2091 25 28 25H4C1.79086 25 0 23.2091 0 21V4Z" fill="white"/>
              <path d="M16 13L4 6V21H28V6L16 13Z" fill="#862633"/>
            </svg>
          </div>
          <div className="contact-item phone">
            <svg className="contact-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M6.5 2C4.01472 2 2 4.01472 2 6.5V23.5C2 25.9853 4.01472 28 6.5 28H23.5C25.9853 28 28 25.9853 28 23.5V6.5C28 4.01472 25.9853 2 23.5 2H6.5Z" stroke="white" strokeWidth="0.49"/>
              <path d="M9 9L15 15L21 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <div className="contact-item github">
            <svg className="contact-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
              <circle cx="15" cy="15" r="14" fill="white"/>
              <path d="M15 8C11.134 8 8 11.134 8 15C8 18.866 11.134 22 15 22C18.866 22 22 18.866 22 15C22 11.134 18.866 8 15 8Z" fill="#862633"/>
            </svg>
          </div>
          <div className="contact-item linkedin">
            <svg className="contact-icon" width="85" height="24" viewBox="0 0 85 24" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0 3.72H9.35V20.47H0V3.72Z" fill="white"/>
              <path d="M10.72 3.2H14.42V7.25H10.72V3.2Z" fill="white"/>
              <path d="M10.99 9.3H14.39V20.47H10.99V9.3Z" fill="white"/>
              <path d="M16.09 3.72H38.19V7.25H16.09V3.72Z" fill="white"/>
              <path d="M37.34 3.72H60.29V7.25H37.34V3.72Z" fill="white"/>
              <path d="M63.69 0H84.94V24.19H63.69V0Z" fill="white"/>
            </svg>
          </div>
        </div>

      {/* Company/Where */}
        <div className="where-input">
          <input 
            type="text" 
            value={where} 
            className="where-text"
            onChange={(e) => setWhere(e.target.value)}
          />
        </div>

        {/* Additional Info Fields */}
        <div className="info-fields">
          {infoFields.map((value, index) => (
            <input
              key={index}
              type="text"
              className="info-field"
              placeholder=""
              value={value}
              onChange={(e) => handleInfoFieldChange(index, e.target.value)}
              onFocus={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.9)'}
              onBlur={(e) => e.target.style.background = 'rgba(255, 255, 255, 0.7)'}
            />
          ))}
        </div>

      {/* Right Content Sections */}
      <div className="content-sections">
        {/* 기술스택 Section */}
        <div className="section-card full-width">
          <div className="section-header">
            <h3 className="section-title">기술스택</h3>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={toggles.techStack}
                onChange={() => handleToggle('techStack')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          {toggles.techStack && (
            <div className="section-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
              {/* Content */}
            </div>
          )}
        </div>

        {/* 경력 Section */}
        <div className="section-card full-width">
          <div className="section-header">
            <h3 className="section-title">경력</h3>
            <label className="toggle-switch">
              <input 
                type="checkbox" 
                checked={toggles.career}
                onChange={() => handleToggle('career')}
              />
              <span className="toggle-slider"></span>
            </label>
          </div>
          {toggles.career && (
            <div className="section-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
              {/* Content */}
            </div>
          )}
        </div>

        {/* Bottom row - 프로젝트 and 활동 및 수상 경력 */}
        <div className="bottom-sections-row">
          {/* 프로젝트 Section */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">프로젝트</h3>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={toggles.projects}
                  onChange={() => handleToggle('projects')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            {toggles.projects && (
              <div className="section-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
                {/* Content */}
              </div>
            )}
          </div>

          {/* 활동 및 수상 경력 Section */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">활동 및 수상 경력</h3>
              <label className="toggle-switch">
                <input 
                  type="checkbox" 
                  checked={toggles.activities}
                  onChange={() => handleToggle('activities')}
                />
                <span className="toggle-slider"></span>
              </label>
            </div>
            {toggles.activities && (
              <div className="section-content" style={{ animation: 'fadeIn 0.3s ease-in' }}>
                {/* Content */}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioEditPage

