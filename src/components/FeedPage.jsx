import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { AiFillCaretDown } from 'react-icons/ai'
import { feedService } from '../services'
import './FeedPage.css'

function FeedPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [feedData, setFeedData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('')
  const [isDropdownOpen, setIsDropdownOpen] = useState(false)

  const categoryOptions = [
    { value: '', label: '글 유형' },
    { value: 'STUDY_PATH', label: '진로/공부 방향' },
    { value: 'COURSE', label: '수업/과목 관련' },
    { value: 'PROJECT', label: '프로젝트/활동' },
    { value: 'CAREER', label: '취업/인턴' },
    { value: 'ETC', label: '기타' }
  ]

  const loadFeed = async () => {
    setIsLoading(true)
    setError('')
    try {
      const params = {}
      if (selectedCategory) {
        params.category = selectedCategory
      }
      // Pagination parameters (optional, can be added later)
      // params.skip = 0
      // params.take = 20
      console.log('Fetching feed with params:', params)
      const data = await feedService.getFeed(params)
      console.log('Raw API response:', data)
      console.log('Response type:', typeof data)
      console.log('Is array?', Array.isArray(data))
      console.log('Has posts?', data?.posts)
      console.log('Has items?', data?.items)
      
      const posts = Array.isArray(data) ? data : data.posts || data.items || data.data || []
      console.log('Parsed posts:', posts)
      console.log('Posts length:', posts.length)
      setFeedData(posts)
    } catch (err) {
      console.error('Error loading feed:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      setError('피드를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    setOpacity(1)
    loadFeed()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedCategory])

  const handleCategorySelect = (category) => {
    setSelectedCategory(category)
    setIsDropdownOpen(false)
  }

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isDropdownOpen && !event.target.closest('.filter-dropdown-wrapper')) {
        setIsDropdownOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isDropdownOpen])

  return (
    <div className="feed-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Header */}
      <div className="feed-header">
        <div className="logo-section">
          <img src="/images/logo.png" alt="KUnnect Logo" className="feed-logo" />
          {/* <span className="logo-text">KUnnect</span> */}
        </div>
        <button className="close-button" onClick={() => navigate('/chatbot')} aria-label="챗봇으로 돌아가기">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="#862633" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>
      </div>

      {/* Filter Dropdown */}
      <div className="filter-section">
        <div className="filter-dropdown-wrapper">
          <button 
            className={`filter-dropdown ${isDropdownOpen ? 'open' : ''}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="filter-label">
              {categoryOptions.find(opt => opt.value === selectedCategory)?.label || '글 유형'}
            </span>
            <AiFillCaretDown className="dropdown-indicator" />
          </button>
          {isDropdownOpen && (
            <div className="dropdown-menu">
              {categoryOptions.map((option) => (
                <button
                  key={option.value}
                  className={`dropdown-item ${selectedCategory === option.value ? 'active' : ''}`}
                  onClick={() => handleCategorySelect(option.value)}
                >
                  {option.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Feed Content Area */}
      <div className="feed-content-wrapper">
        <div className="feed-content-bg">
          {isLoading ? (
            <div className="loading-state">로딩 중...</div>
          ) : error ? (
            <div className="error-state">
              {error}
              <button onClick={loadFeed} className="retry-button">다시 시도</button>
            </div>
          ) : feedData.length > 0 ? (
            <div className="posts-container">
              {feedData.map((item, index) => {
                const postId = item.id || item._id
                if (!postId) return null
                return (
                  <div 
                    key={postId} 
                    className="post-card"
                    onClick={(e) => {
                      e.preventDefault()
                      e.stopPropagation()
                      console.log('Post card clicked, navigating to:', `/feed/${postId}`)
                      navigate(`/feed/${postId}`)
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <h3 className="post-title">{item.title || '제목 없음'}</h3>
                  </div>
                )
              })}
            </div>
          ) : (
            <div className="empty-state">
              <p>아직 작성된 글이 없습니다.</p>
            </div>
          )}
        </div>
      </div>

      {/* Write Button */}
      <button className="write-button" onClick={() => navigate('/feed/write')} aria-label="글쓰기">
        <svg width="50" height="50" viewBox="0 0 50 50" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M25 15V35M15 25H35" stroke="#FFFFFF" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"/>
        </svg>
      </button>
    </div>
  )
}

export default FeedPage

