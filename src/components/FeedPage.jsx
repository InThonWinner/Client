import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './FeedPage.css'

function FeedPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setOpacity(1)
  }, [])

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
        <h1>Feed Page</h1>
        <p>피드 페이지가 여기에 표시됩니다.</p>
      </div>
    </div>
  )
}

export default FeedPage

