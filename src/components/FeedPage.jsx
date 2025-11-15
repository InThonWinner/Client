import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { feedService } from '../services'
import './FeedPage.css'

function FeedPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [feedData, setFeedData] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setOpacity(1)
    loadFeed()
  }, [])

  const loadFeed = async () => {
    setIsLoading(true)
    setError('')
    try {
      const data = await feedService.getFeed()
      setFeedData(Array.isArray(data) ? data : data.posts || data.items || [])
    } catch (err) {
      console.error('Error loading feed:', err)
      setError('피드를 불러오는데 실패했습니다.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="feed-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      <div className="feed-header">
        <div className="logo-section">
          <img src="/images/logo.png" alt="KUnnect Logo" className="feed-logo" />
        </div>
        <div className="header-nav">
          <button className="nav-link-btn" onClick={() => navigate('/portfolio')}>
            Portfolio
          </button>
          <button className="nav-link-btn active" onClick={() => navigate('/feed')}>
            Feed
          </button>
        </div>
      </div>
      <div className="feed-content">
        {isLoading ? (
          <div style={{ textAlign: 'center', padding: '50px' }}>로딩 중...</div>
        ) : error ? (
          <div style={{ textAlign: 'center', padding: '50px', color: '#ff4444' }}>
            {error}
            <button onClick={loadFeed} style={{ marginLeft: '10px', padding: '5px 10px' }}>
              다시 시도
            </button>
          </div>
        ) : feedData.length > 0 ? (
          <div>
            {feedData.map((item, index) => (
              <div key={item.id || index} style={{ marginBottom: '20px', padding: '15px', border: '1px solid #ddd', borderRadius: '5px' }}>
                <h3>{item.title || '제목 없음'}</h3>
                <p>{item.content || item.description || ''}</p>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '50px' }}>
            <h1>Feed Page</h1>
            <p>피드가 비어있습니다.</p>
          </div>
        )}
      </div>
    </div>
  )
}

export default FeedPage

