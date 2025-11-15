import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import './LandingPage.css'

function LandingPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)

  useEffect(() => {
    setOpacity(1)
  }, [])

  const handleLogin = (e) => {
    e.preventDefault()
    navigate('/login')
  }

  const handleSignup = (e) => {
    e.preventDefault()
    navigate('/signup')
  }

  const handleStart = () => {
    console.log('시작하기 button clicked')
    navigate('/chatbot')
  }

  return (
    <div className="landing-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Header */}
      <header className="header">
        <div className="logo-container">
          <img src="/images/logo.png" alt="KUnnect Logo" className="logo-img" />
          <span className="logo-text">KUnnect</span>
        </div>
        <nav className="nav">
          <a href="#" className="nav-link" onClick={handleLogin}>Login</a>
          <a href="#" className="nav-link" onClick={handleSignup}>Signup</a>
        </nav>
      </header>

      {/* Main Content */}
      <main className="main-content">
        <div className="content-left">
          <h1 className="main-title">
            포트폴리오 관리와<br />
            경험 데이터 기반 챗봇 서비스
          </h1>
          <p className="subtitle">
            고려대학교 정보대학 학생들과 선배들의 실제 경험을 기반으로,<br />
            지금 무엇을 해야 하는지 구체적으로 알려주는 실무 성장 가이드 서비스
          </p>
          <button className="primary-button" onClick={handleStart}>시작하기</button>
        </div>
        <div className="content-right">
          <img src="/images/emblem.png" alt="정보대학 엠블럼" className="emblem-img" />
        </div>
      </main>
    </div>
  )
}

export default LandingPage

