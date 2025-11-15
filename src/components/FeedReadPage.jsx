import { useState, useEffect } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { feedService } from '../services'
import './FeedReadPage.css'

function FeedReadPage() {
  const navigate = useNavigate()
  const { id } = useParams()
  const [opacity, setOpacity] = useState(0)
  const [post, setPost] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    setOpacity(1)
    loadPost()
  }, [id])

  const loadPost = async () => {
    setIsLoading(true)
    setError('')
    try {
      console.log('FeedReadPage: Loading post with id:', id)
      const data = await feedService.getFeedPost(id)
      console.log('FeedReadPage: Received post data:', data)
      if (data) {
        setPost(data)
      } else {
        console.warn('FeedReadPage: No data received')
        setError('글을 찾을 수 없습니다.')
      }
    } catch (err) {
      console.error('FeedReadPage: Error loading post:', err)
      console.error('FeedReadPage: Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      const errorMessage = err.response?.data?.message || err.message || '글을 불러오는데 실패했습니다.'
      setError(errorMessage)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="feed-read-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Background Rectangle */}
      <div className="feed-read-bg">
        {/* Close Button */}
        <button className="close-button" onClick={() => navigate('/feed')} aria-label="피드로 돌아가기">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M15 5L5 15M5 5L15 15" stroke="#862633" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
        </button>

        {isLoading ? (
          <div className="loading-state">로딩 중...</div>
        ) : error ? (
          <div className="error-state">
            {error}
            <button onClick={loadPost} className="retry-button">다시 시도</button>
          </div>
        ) : post ? (
          <>
            {/* Anonymous Label */}
            {post.isAnonymous && (
              <div className="anonymous-label">익명</div>
            )}

            {/* Title Display */}
            <div className="title-display">
              {post.title || '제목 없음'}
            </div>

            {/* Content Display */}
            <div className="content-display">
              {post.content || post.description || '내용이 없습니다.'}
            </div>
          </>
        ) : null}
      </div>
    </div>
  )
}

export default FeedReadPage

