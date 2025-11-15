import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './PortfolioPage.css'

function PortfolioPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [where, setWhere] = useState('SK telecom')
  const [infoFields, setInfoFields] = useState(['', '', '', ''])

  useEffect(() => {
    setOpacity(1)
  }, [])

  const handleInfoFieldChange = (index, value) => {
    const newFields = [...infoFields]
    newFields[index] = value
    setInfoFields(newFields)
  }

  const handleEdit = () => {
    navigate('/portfolio/edit')
  }

  return (
    <div className="portfolio-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Edit Button */}
      <button className="edit-button" onClick={handleEdit}>
        <svg className="edit-icon" width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M11.05 3.00002L4.20831 10.2417C3.94998 10.5167 3.69998 11.0584 3.64998 11.4334L3.34165 14.1334C3.23331 15.1084 3.93331 15.775 4.89998 15.6084L7.58331 15.15C7.95831 15.0834 8.48331 14.8084 8.74165 14.525L15.5833 7.28335C16.7666 6.03335 17.3 4.60835 15.4583 2.86668C13.625 1.14168 12.2333 1.75002 11.05 3.00002Z" stroke="#FFFFFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M9.90833 4.20831C10.2667 6.50831 12.1333 8.26665 14.45 8.49998" stroke="#FFFFFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
          <path d="M2.5 18.3334H17.5" stroke="#FFFFFF" strokeWidth="1.5" strokeMiterlimit="10" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
        <span>Edit</span>
      </button>

      <div className="portfolio-wrapper">
        {/* Left Profile Section */}
        <div className="profile-section">
          {/* Profile Image */}
          <div className="profile-image-container">
            <div className="profile-circle-bg"></div>
            <img src="/images/profile.png" alt="Profile" className="profile-image" />
          </div>

          {/* Name */}
          <h1 className="profile-name">김호이</h1>

          {/* Contact Info */}
          <div className="contact-info">
            <div className="contact-item">
              <svg className="contact-icon" width="32" height="25" viewBox="0 0 32 25" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M0 4C0 1.79086 1.79086 0 4 0H28C30.2091 0 32 1.79086 32 4V21C32 23.2091 30.2091 25 28 25H4C1.79086 25 0 23.2091 0 21V4Z" fill="white"/>
                <path d="M16 13L4 6V21H28V6L16 13Z" fill="#862633"/>
              </svg>
            </div>
            <div className="contact-item">
              <svg className="contact-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M6.5 2C4.01472 2 2 4.01472 2 6.5V23.5C2 25.9853 4.01472 28 6.5 28H23.5C25.9853 28 28 25.9853 28 23.5V6.5C28 4.01472 25.9853 2 23.5 2H6.5Z" stroke="white" strokeWidth="0.49"/>
                <path d="M9 9L15 15L21 9" stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </div>
            <div className="contact-item">
              <svg className="contact-icon" width="30" height="30" viewBox="0 0 30 30" fill="none" xmlns="http://www.w3.org/2000/svg">
                <circle cx="15" cy="15" r="14" fill="white"/>
                <path d="M15 8C11.134 8 8 11.134 8 15C8 18.866 11.134 22 15 22C18.866 22 22 18.866 22 15C22 11.134 18.866 8 15 8Z" fill="#862633"/>
              </svg>
            </div>
            <div className="contact-item">
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
              readOnly
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
                readOnly
              />
            ))}
          </div>
        </div>

        {/* Right Content Sections */}
        <div className="content-sections">
          {/* 기술스택 Section */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">기술스택</h3>
            </div>
            <div className="section-content">
              {/* Content */}
            </div>
          </div>

          {/* 경력 Section */}
          <div className="section-card">
            <div className="section-header">
              <h3 className="section-title">경력</h3>
            </div>
            <div className="section-content">
              {/* Content */}
            </div>
          </div>

          {/* Bottom row - 프로젝트 and 활동 및 수상 경력 */}
          <div className="bottom-sections">
            {/* 프로젝트 Section */}
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">프로젝트</h3>
              </div>
              <div className="section-content">
                {/* Content */}
              </div>
            </div>

            {/* 활동 및 수상 경력 Section */}
            <div className="section-card">
              <div className="section-header">
                <h3 className="section-title">활동 및 수상 경력</h3>
              </div>
              <div className="section-content">
                {/* Content */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PortfolioPage
