import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { portfolioService, authService } from '../services'
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
  
  // Visibility states for each section
  const [sectionVisibility, setSectionVisibility] = useState({
    techStack: true,
    career: true,
    projects: true,
    activitiesAwards: true,
    contact: true,
    affiliation: true
  })
  
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
      console.log('[PortfolioPage] Loading portfolio...')
      
      // Load user info to get realName
      let userRealName = null
      try {
        const userProfile = await authService.getProfile()
        console.log('[PortfolioPage] User profile:', userProfile)
        console.log('[PortfolioPage] User profile keys:', Object.keys(userProfile || {}))
        // Try different possible field names
        userRealName = userProfile?.realName || 
                      userProfile?.name || 
                      userProfile?.userName || 
                      userProfile?.user?.realName ||
                      userProfile?.user?.name ||
                      userProfile?.data?.realName ||
                      userProfile?.data?.name ||
                      null
        console.log('[PortfolioPage] Extracted realName:', userRealName)
      } catch (err) {
        console.warn('[PortfolioPage] Failed to load user profile:', err)
      }
      
      const portfolio = await portfolioService.getMyPortfolio()
      console.log('[PortfolioPage] Received portfolio:', portfolio)
      console.log('[PortfolioPage] Portfolio keys:', Object.keys(portfolio || {}))
      
      // Check if portfolio has user info embedded
      if (portfolio?.user) {
        console.log('[PortfolioPage] Portfolio has user info:', portfolio.user)
        userRealName = portfolio.user.realName || portfolio.user.name || userRealName
      }
      
      if (portfolio) {
        // Priority: userRealName -> portfolio.displayName -> portfolio.name -> default
        // Always prefer realName from user profile if available
        const finalName = userRealName || portfolio.displayName || portfolio.name || '김호이'
        console.log('[PortfolioPage] Setting displayName to:', finalName)
        console.log('[PortfolioPage] userRealName:', userRealName)
        console.log('[PortfolioPage] portfolio.displayName:', portfolio.displayName)
        console.log('[PortfolioPage] portfolio.name:', portfolio.name)
        setDisplayName(finalName)
        setAffiliation(portfolio.affiliation || 'SK telecom')
        
        // Parse contact - Backend returns contact as array of { type: string, value: string } objects
        // Convert to our flat object format for UI
        const contactData = {
          email: '',
          phone: '',
          github: '',
          linkedin: ''
        }
        
        if (portfolio.contact && Array.isArray(portfolio.contact)) {
          // Backend returns contact as array
          portfolio.contact.forEach((item) => {
            if (item && item.type && item.value) {
              const type = item.type.toLowerCase()
              if (type === 'email') {
                contactData.email = item.value
              } else if (type === 'phone') {
                contactData.phone = item.value
              } else if (type === 'github') {
                contactData.github = item.value
              } else if (type === 'linkedin') {
                contactData.linkedin = item.value
              }
            }
          })
        } else if (portfolio.contact && typeof portfolio.contact === 'object') {
          // Fallback: handle if backend returns as object (legacy format)
          contactData.email = portfolio.contact.email || portfolio.email || ''
          contactData.phone = portfolio.contact.phone || portfolio.phone || ''
          contactData.github = portfolio.contact.github || portfolio.github || ''
          contactData.linkedin = portfolio.contact.linkedin || portfolio.linkedin || ''
        } else {
          // Fallback: try flat fields
          contactData.email = portfolio.email || ''
          contactData.phone = portfolio.phone || ''
          contactData.github = portfolio.github || ''
          contactData.linkedin = portfolio.linkedin || ''
        }
        
        console.log('[PortfolioPage] Parsed contact data:', contactData)
        console.log('[PortfolioPage] Original portfolio.contact:', portfolio.contact)
        setContact(contactData)
        
        setTechStack(portfolio.techStack || '')
        setCareer(portfolio.career || '')
        setProjects(portfolio.projects || '')
        setActivitiesAwards(portfolio.activitiesAwards || portfolio.activities || '')
        
        // Load section visibility from portfolio - use showXxx fields from backend
        setSectionVisibility({
          techStack: portfolio.showTechStack !== false,
          career: portfolio.showCareer !== false,
          projects: portfolio.showProjects !== false,
          activitiesAwards: portfolio.showActivitiesAwards !== false,
          contact: portfolio.showContact !== false,
          affiliation: portfolio.showAffiliation !== false
        })
      }
    } catch (err) {
      console.error('[PortfolioPage] Error loading portfolio:', err)
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
    console.log(`[PortfolioPage] Starting edit for ${section}`)
    console.log(`[PortfolioPage] Current values:`, currentValues)
    setEditValues(currentValues)
    setEditingSection(section)
  }

  const handleCancelEdit = () => {
    setEditingSection(null)
    setEditValues({})
  }

  const handleSaveSection = async (section) => {
    try {
      console.log(`[PortfolioPage] Saving ${section}`)
      console.log(`[PortfolioPage] editValues:`, editValues)
      console.log(`[PortfolioPage] editValues[${section}]:`, editValues[section])
      console.log(`[PortfolioPage] Current state for ${section}:`, {
        projects,
        techStack,
        career,
        activitiesAwards
      })
      
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
          response = await portfolioService.updateAffiliation(editValues.affiliation, {
            showAffiliation: sectionVisibility.affiliation
          })
          break
        case 'contact':
          // Use editValues.contact if available, otherwise fallback to current contact state
          const contactValue = editValues.contact !== undefined ? editValues.contact : contact
          console.log(`[PortfolioPage] Updating contact with value:`, contactValue)
          console.log(`[PortfolioPage] editValues.contact:`, editValues.contact)
          console.log(`[PortfolioPage] current contact state:`, contact)
          
          // Backend expects contact as array of { type: string, value: string } objects
          // Convert our flat object format to backend's array format
          const contactArray = []
          if (contactValue?.email) {
            contactArray.push({ type: 'email', value: contactValue.email })
          }
          if (contactValue?.phone) {
            contactArray.push({ type: 'phone', value: contactValue.phone })
          }
          if (contactValue?.github) {
            contactArray.push({ type: 'github', value: contactValue.github })
          }
          if (contactValue?.linkedin) {
            contactArray.push({ type: 'linkedin', value: contactValue.linkedin })
          }
          
          const contactData = {
            contact: contactArray.length > 0 ? contactArray : null,
            showContact: sectionVisibility.contact
          }
          console.log(`[PortfolioPage] Request body for contact (backend format):`, contactData)
          response = await portfolioService.updateContact(contactData)
          break
        case 'techStack':
          const techStackValue = editValues.techStack !== undefined ? editValues.techStack : techStack
          console.log(`[PortfolioPage] Updating techStack with value:`, techStackValue)
          response = await portfolioService.updateTechStack({ 
            techStack: techStackValue || '',
            showTechStack: sectionVisibility.techStack
          })
          break
        case 'career':
          const careerValue = editValues.career !== undefined ? editValues.career : career
          console.log(`[PortfolioPage] Updating career with value:`, careerValue)
          response = await portfolioService.updateCareer({ 
            career: careerValue || '',
            showCareer: sectionVisibility.career
          })
          break
        case 'projects':
          const projectsValue = editValues.projects !== undefined ? editValues.projects : projects
          console.log(`[PortfolioPage] Updating projects with value:`, projectsValue)
          console.log(`[PortfolioPage] Request body:`, { 
            projects: projectsValue || '',
            showProjects: sectionVisibility.projects
          })
          response = await portfolioService.updateProjects({ 
            projects: projectsValue || '',
            showProjects: sectionVisibility.projects
          })
          break
        case 'activitiesAwards':
          const activitiesAwardsValue = editValues.activitiesAwards !== undefined ? editValues.activitiesAwards : activitiesAwards
          console.log(`[PortfolioPage] Updating activitiesAwards with value:`, activitiesAwardsValue)
          response = await portfolioService.updateActivitiesAwards({ 
            activitiesAwards: activitiesAwardsValue || '',
            showActivitiesAwards: sectionVisibility.activitiesAwards
          })
          break
        default:
          console.warn(`[PortfolioPage] Unknown section: ${section}`)
          return
      }
      
      console.log(`[PortfolioPage] Save response for ${section}:`, response)
      
      // 저장 성공 후 전체 포트폴리오 다시 로드
      await loadPortfolio()
      
      setEditingSection(null)
      setEditValues({})
      console.log(`[PortfolioPage] Successfully saved ${section}`)
    } catch (err) {
      console.error(`[PortfolioPage] Error saving ${section}:`, err)
      alert(`저장에 실패했습니다: ${err.message || '알 수 없는 오류'}`)
    }
  }

  const handleToggleVisibility = async (section) => {
    const newVisibility = !sectionVisibility[section]
    setSectionVisibility(prev => ({
      ...prev,
      [section]: newVisibility
    }))
    
    try {
      // Map section names to backend showXxx field names
      const sectionToShowField = {
        'techStack': 'showTechStack',
        'career': 'showCareer',
        'projects': 'showProjects',
        'activitiesAwards': 'showActivitiesAwards',
        'contact': 'showContact',
        'affiliation': 'showAffiliation'
      }
      
      const showField = sectionToShowField[section]
      if (!showField) {
        console.error(`[PortfolioPage] Unknown section for visibility toggle: ${section}`)
        return
      }
      
      // Update visibility in backend using the appropriate endpoint
      if (section === 'contact') {
        // For contact, we need to preserve existing contact data
        const contactValue = editValues.contact !== undefined ? editValues.contact : contact
        const contactArray = []
        if (contactValue?.email) {
          contactArray.push({ type: 'email', value: contactValue.email })
        }
        if (contactValue?.phone) {
          contactArray.push({ type: 'phone', value: contactValue.phone })
        }
        if (contactValue?.github) {
          contactArray.push({ type: 'github', value: contactValue.github })
        }
        if (contactValue?.linkedin) {
          contactArray.push({ type: 'linkedin', value: contactValue.linkedin })
        }
        await portfolioService.updateContact({ 
          contact: contactArray.length > 0 ? contactArray : null,
          [showField]: newVisibility 
        })
      } else if (section === 'affiliation') {
        await portfolioService.updateAffiliation(affiliation, { [showField]: newVisibility })
      } else if (section === 'techStack') {
        await portfolioService.updateTechStack({ 
          techStack: techStack || '',
          [showField]: newVisibility 
        })
      } else if (section === 'career') {
        await portfolioService.updateCareer({ 
          career: career || '',
          [showField]: newVisibility 
        })
      } else if (section === 'projects') {
        await portfolioService.updateProjects({ 
          projects: projects || '',
          [showField]: newVisibility 
        })
      } else if (section === 'activitiesAwards') {
        await portfolioService.updateActivitiesAwards({ 
          activitiesAwards: activitiesAwards || '',
          [showField]: newVisibility 
        })
      }
      
      console.log(`[PortfolioPage] Successfully toggled ${section} visibility to ${newVisibility}`)
    } catch (err) {
      console.error(`[PortfolioPage] Error toggling visibility for ${section}:`, err)
      // Revert on error
      setSectionVisibility(prev => ({
        ...prev,
        [section]: !newVisibility
      }))
      alert(`공개 설정 변경에 실패했습니다: ${err.message || '알 수 없는 오류'}`)
    }
  }

  const handleEditValueChange = (section, field, value) => {
    console.log(`[PortfolioPage] Editing ${section}${field ? `.${field}` : ''} with value:`, value)
    setEditValues(prev => {
      if (field) {
        // Nested field (e.g., contact.email)
        const updated = {
          ...prev,
          [section]: {
            ...(prev[section] || {}),
            [field]: value
          }
        }
        console.log(`[PortfolioPage] Updated editValues (nested):`, updated)
        return updated
      } else {
        // Direct field
        const updated = {
          ...prev,
          [section]: value
        }
        console.log(`[PortfolioPage] Updated editValues (direct):`, updated)
        return updated
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
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <label className="toggle-switch">
                    <input 
                      type="checkbox" 
                      checked={sectionVisibility.contact}
                      onChange={() => handleToggleVisibility('contact')}
                    />
                    <span className="toggle-slider"></span>
                  </label>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionVisibility.techStack}
                        onChange={() => handleToggleVisibility('techStack')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                    <label className="toggle-switch">
                      <input 
                        type="checkbox" 
                        checked={sectionVisibility.career}
                        onChange={() => handleToggleVisibility('career')}
                      />
                      <span className="toggle-slider"></span>
                    </label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={sectionVisibility.projects}
                          onChange={() => handleToggleVisibility('projects')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
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
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                      <label className="toggle-switch">
                        <input 
                          type="checkbox" 
                          checked={sectionVisibility.activitiesAwards}
                          onChange={() => handleToggleVisibility('activitiesAwards')}
                        />
                        <span className="toggle-slider"></span>
                      </label>
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
