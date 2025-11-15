import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { portfolioService } from '../services'
import './PortfolioPage.css'

function PortfolioPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  
  // Portfolio data states
  const [displayName, setDisplayName] = useState('김호이')
  const [affiliation, setAffiliation] = useState('SK telecom')
  const [contact, setContact] = useState({ email: '', phone: '', github: '', linkedin: '' })
  const [techStack, setTechStack] = useState('')
  const [career, setCareer] = useState('')
  const [projects, setProjects] = useState('')
  const [activitiesAwards, setActivitiesAwards] = useState('')
  
  // Edit mode states for each section
  const [editingSection, setEditingSection] = useState(null)
  
  // Temporary edit values
  const [editValues, setEditValues] = useState({})

  useEffect(() => {
    setOpacity(1)
    loadPortfolio()
  }, [])

  const loadPortfolio = async () => {
    try {
      const portfolio = await portfolioService.getMyPortfolio()
      if (portfolio) {
        setDisplayName(portfolio.displayName || portfolio.name || '김호이')
        setAffiliation(portfolio.affiliation || 'SK telecom')
        setContact({
          email: portfolio.email || portfolio.contact?.email || '',
          phone: portfolio.phone || portfolio.contact?.phone || '',
          github: portfolio.github || portfolio.contact?.github || '',
          linkedin: portfolio.linkedin || portfolio.contact?.linkedin || ''
        })
        setTechStack(portfolio.techStack || '')
        setCareer(portfolio.career || '')
        setProjects(portfolio.projects || '')
        setActivitiesAwards(portfolio.activitiesAwards || portfolio.activities || '')
      }
    } catch (err) {
      console.error('Error loading portfolio:', err)
      // Keep default values if portfolio doesn't exist
    }
  }

  const handleEditSection = (section) => {
    // Set current values as edit values
    const currentValues = {
      displayName,
      affiliation,
      contact: { ...contact },
      techStack,
      career,
      projects,
      activitiesAwards
    }
    setEditValues(currentValues)
    setEditingSection(section)
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setEditValues({})
  }

  const handleSaveSection = async (section) => {
    try {
      console.log(`Saving ${section} with values:`, editValues[section])
      
      let response
      switch (section) {
        case 'displayName':
          if (!editValues.displayName) {
            alert('이름을 입력해주세요.')
            return
          }
          response = await portfolioService.updateDisplayName(editValues.displayName)
          break
        case 'affiliation':
          if (!editValues.affiliation) {
            alert('소속을 입력해주세요.')
            return
          }
          response = await portfolioService.updateAffiliation(editValues.affiliation)
          break
        case 'contact':
          if (!editValues.contact) {
            alert('연락처 정보를 입력해주세요.')
            return
          }
          response = await portfolioService.updateContact(editValues.contact)
          break
        case 'techStack':
          response = await portfolioService.updateTechStack({ techStack: editValues.techStack || '' })
          break
        case 'career':
          response = await portfolioService.updateCareer({ career: editValues.career || '' })
          break
        case 'projects':
          response = await portfolioService.updateProjects({ projects: editValues.projects || '' })
          break
        case 'activitiesAwards':
          response = await portfolioService.updateActivitiesAwards({ activitiesAwards: editValues.activitiesAwards || '' })
          break
        default:
          return
      }
      
      console.log(`Save response for ${section}:`, response)
      
      // 저장 성공 후 전체 포트폴리오 다시 로드
      await loadPortfolio()
      
      setEditingSection(null)
      setEditValues({})
    } catch (err) {
      console.error(`Error saving ${section}:`, err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      alert(`저장에 실패했습니다: ${err.userMessage || err.message || '알 수 없는 오류가 발생했습니다.'}`)
    }
  }

  const handleEditValueChange = (section, field, value) => {
    setEditValues(prev => {
      if (field) {
        // Nested field (e.g., contact.email)
        return {
          ...prev,
          [section]: {
            ...(prev[section] || {}),
            [field]: value
          }
        }
      } else {
        // Direct field
        return {
          ...prev,
          [section]: value
        }
      }
    })
  }

  return (
    <div className="portfolio-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Top Right Buttons */}
      <div className="top-buttons">
        <button className="close-button" onClick={() => navigate('/chatbot')} aria-label="챗봇으로 돌아가기">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      <div className="portfolio-wrapper">
        {/* Left Profile Image */}
        <div className="profile-image-section">
          <div className="profile-image-container">
            <div className="profile-circle-bg"></div>
            <img src="/images/profile.png" alt="Profile" className="profile-image" />
          </div>
        </div>

        {/* Right Content Area */}
        <div className="content-area">
          {/* Upper Section: Name, Affiliation, Contact */}
          <div className="upper-section">
            <div className="upper-section-bg"></div>
            
            {/* Name */}
            <div className="name-section">
              <h1 className="profile-name">{displayName}</h1>
            </div>

            {/* Affiliation */}
            <div className="affiliation-section">
              <div className="affiliation-header">
                {editingSection === 'affiliation' ? (
                  <button className="section-save-btn" onClick={() => handleSaveSection('affiliation')}>
                    Save
                  </button>
                ) : (
                  <button className="section-edit-btn" onClick={() => handleEditSection('affiliation')}>
                    Edit
                  </button>
                )}
              </div>
              <div className="affiliation-input">
                <input 
                  type="text" 
                  value={editingSection === 'affiliation' ? (editValues.affiliation || affiliation) : affiliation} 
                  className="affiliation-text"
                  onChange={(e) => handleEditValueChange('affiliation', null, e.target.value)}
                  readOnly={editingSection !== 'affiliation'}
                />
              </div>
            </div>

            {/* Contact */}
            <div className="contact-section">
              <div className="contact-label-text">contact</div>
              <div className="contact-header">
                {editingSection === 'contact' ? (
                  <button className="section-save-btn" onClick={() => handleSaveSection('contact')}>
                    Save
                  </button>
                ) : (
                  <button className="section-edit-btn" onClick={() => handleEditSection('contact')}>
                    Edit
                  </button>
                )}
              </div>
              <div className="info-fields">
                <input
                  type="text"
                  className="info-field"
                  placeholder="Email"
                  value={editingSection === 'contact' ? (editValues.contact?.email || contact.email) : contact.email}
                  onChange={(e) => handleEditValueChange('contact', 'email', e.target.value)}
                  readOnly={editingSection !== 'contact'}
                />
                <input
                  type="text"
                  className="info-field"
                  placeholder="Phone"
                  value={editingSection === 'contact' ? (editValues.contact?.phone || contact.phone) : contact.phone}
                  onChange={(e) => handleEditValueChange('contact', 'phone', e.target.value)}
                  readOnly={editingSection !== 'contact'}
                />
                <input
                  type="text"
                  className="info-field"
                  placeholder="GitHub"
                  value={editingSection === 'contact' ? (editValues.contact?.github || contact.github) : contact.github}
                  onChange={(e) => handleEditValueChange('contact', 'github', e.target.value)}
                  readOnly={editingSection !== 'contact'}
                />
                <input
                  type="text"
                  className="info-field"
                  placeholder="LinkedIn"
                  value={editingSection === 'contact' ? (editValues.contact?.linkedin || contact.linkedin) : contact.linkedin}
                  onChange={(e) => handleEditValueChange('contact', 'linkedin', e.target.value)}
                  readOnly={editingSection !== 'contact'}
                />
              </div>
            </div>
          </div>

        </div>

        {/* Down Section: Tech Stack, Career, Projects, Activities */}
        <div className="down-section">
          <div className="down-section-bg"></div>
          
          <div className="down-content">
              {/* 기술스택 Section */}
              <div className="section-card full-width">
                <div className="section-header">
                  <h3 className="section-title">기술스택</h3>
                  {editingSection === 'techStack' ? (
                    <button className="section-save-btn" onClick={() => handleSaveSection('techStack')}>
                      Save
                    </button>
                  ) : (
                    <button className="section-edit-btn" onClick={() => handleEditSection('techStack')}>
                      Edit
                    </button>
                  )}
                </div>
                <div className="section-content">
                  {editingSection === 'techStack' ? (
                    <textarea
                      className="section-textarea"
                      value={editValues.techStack !== undefined ? editValues.techStack : techStack}
                      onChange={(e) => handleEditValueChange('techStack', null, e.target.value)}
                      placeholder="기술스택을 입력하세요"
                    />
                  ) : (
                    <p className="section-text">{techStack || '기술스택을 입력하세요'}</p>
                  )}
                </div>
              </div>

              {/* 경력 Section */}
              <div className="section-card full-width">
                <div className="section-header">
                  <h3 className="section-title">경력</h3>
                  {editingSection === 'career' ? (
                    <button className="section-save-btn" onClick={() => handleSaveSection('career')}>
                      Save
                    </button>
                  ) : (
                    <button className="section-edit-btn" onClick={() => handleEditSection('career')}>
                      Edit
                    </button>
                  )}
                </div>
                <div className="section-content">
                  {editingSection === 'career' ? (
                    <textarea
                      className="section-textarea"
                      value={editValues.career !== undefined ? editValues.career : career}
                      onChange={(e) => handleEditValueChange('career', null, e.target.value)}
                      placeholder="경력을 입력하세요"
                    />
                  ) : (
                    <p className="section-text">{career || '경력을 입력하세요'}</p>
                  )}
                </div>
              </div>

              {/* Bottom row - 프로젝트 and 활동 및 수상 경력 */}
              <div className="bottom-sections">
                {/* 프로젝트 Section */}
                <div className="section-card">
                  <div className="section-header">
                    <h3 className="section-title">프로젝트</h3>
                    {editingSection === 'projects' ? (
                      <button className="section-save-btn" onClick={() => handleSaveSection('projects')}>
                        Save
                      </button>
                    ) : (
                      <button className="section-edit-btn" onClick={() => handleEditSection('projects')}>
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="section-content">
                    {editingSection === 'projects' ? (
                      <textarea
                        className="section-textarea"
                        value={editValues.projects !== undefined ? editValues.projects : projects}
                        onChange={(e) => handleEditValueChange('projects', null, e.target.value)}
                        placeholder="프로젝트를 입력하세요"
                      />
                    ) : (
                      <p className="section-text">{projects || '프로젝트를 입력하세요'}</p>
                    )}
                  </div>
                </div>

                {/* 활동 및 수상 경력 Section */}
                <div className="section-card">
                  <div className="section-header">
                    <h3 className="section-title">활동 및 수상 경력</h3>
                    {editingSection === 'activitiesAwards' ? (
                      <button className="section-save-btn" onClick={() => handleSaveSection('activitiesAwards')}>
                        Save
                      </button>
                    ) : (
                      <button className="section-edit-btn" onClick={() => handleEditSection('activitiesAwards')}>
                        Edit
                      </button>
                    )}
                  </div>
                  <div className="section-content">
                    {editingSection === 'activitiesAwards' ? (
                      <textarea
                        className="section-textarea"
                        value={editValues.activitiesAwards !== undefined ? editValues.activitiesAwards : activitiesAwards}
                        onChange={(e) => handleEditValueChange('activitiesAwards', null, e.target.value)}
                        placeholder="활동 및 수상 경력을 입력하세요"
                      />
                    ) : (
                      <p className="section-text">{activitiesAwards || '활동 및 수상 경력을 입력하세요'}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    
  )
}

export default PortfolioPage
