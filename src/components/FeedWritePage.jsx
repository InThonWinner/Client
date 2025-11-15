import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { feedService } from '../services'
import './FeedWritePage.css'

function FeedWritePage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [title, setTitle] = useState('')
  const [content, setContent] = useState('')
  const [postType, setPostType] = useState('글 유형')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setOpacity(1)
  }, [])

  // Map Korean post type to API category
  const getCategoryFromPostType = (type) => {
    const categoryMap = {
      '글 유형': 'STUDY_PATH',
      '진로/공부 방향': 'STUDY_PATH',
      '수업/과목 관련': 'COURSE',
      '프로젝트/활동': 'PROJECT',
      '취업/인턴': 'CAREER',
      '기타': 'ETC'
    }
    return categoryMap[type] || 'STUDY_PATH'
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')

    if (!title.trim()) {
      setError('제목을 입력해주세요.')
      return
    }

    if (!content.trim()) {
      setError('내용을 입력해주세요.')
      return
    }

    if (postType === '글 유형') {
      setError('글 유형을 선택해주세요.')
      return
    }

    setIsLoading(true)
    try {
      const category = getCategoryFromPostType(postType)
      await feedService.createPost({
        category: category,
        title: title.trim(),
        content: content.trim(),
        isAnonymous: isAnonymous
      })
      navigate('/feed')
    } catch (err) {
      console.error('Error creating post:', err)
      setError('글 작성에 실패했습니다. 다시 시도해주세요.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="feed-write-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Background Rectangle */}
      <div className="feed-write-bg">
        {/* Close Button */}
        <button className="close-button" onClick={() => navigate('/feed')} aria-label="피드로 돌아가기">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="#862633" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {/* Post Type Dropdown */}
        <div className="post-type-dropdown">
          <select 
            value={postType} 
            onChange={(e) => setPostType(e.target.value)}
            className="post-type-select"
          >
            <option value="글 유형">글 유형</option>
            <option value="진로/공부 방향">진로/공부 방향</option>
            <option value="수업/과목 관련">수업/과목 관련</option>
            <option value="프로젝트/활동">프로젝트/활동</option>
            <option value="취업/인턴">취업/인턴</option>
            <option value="기타">기타</option>
          </select>
        </div>

        {/* Anonymous Toggle */}
        <div className="anonymous-toggle-wrapper">
          <label className="anonymous-label" htmlFor="anonymous-toggle">익명</label>
          <button
            id="anonymous-toggle"
            type="button"
            className={`anonymous-toggle ${isAnonymous ? 'active' : ''}`}
            onClick={() => setIsAnonymous(!isAnonymous)}
            aria-label="익명 작성"
            aria-pressed={isAnonymous}
          >
            <div className="toggle-slider"></div>
          </button>
        </div>

        {/* Title Input */}
        <input
          type="text"
          className="title-input"
          placeholder="제목"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          disabled={isLoading}
        />

        {/* Content Textarea */}
        <textarea
          className="content-textarea"
          placeholder="내용을 입력하세요..."
          value={content}
          onChange={(e) => setContent(e.target.value)}
          disabled={isLoading}
        />

        {/* Error Message */}
        {error && <div className="error-message">{error}</div>}

        {/* Save Button */}
        <div className="save-button-wrapper">
          <button
            type="button"
            className="save-button"
            onClick={handleSubmit}
            disabled={isLoading || !title.trim() || !content.trim()}
          >
            save
          </button>
        </div>
      </div>
    </div>
  )
}

export default FeedWritePage

