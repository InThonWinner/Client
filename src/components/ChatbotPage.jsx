import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import './ChatbotPage.css'

function ChatbotPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [messages, setMessages] = useState([
    {
      id: 1,
      sender: 'User',
      text: '졸업하고 프론트 엔지니어로 일하고 싶어. 어떻게 공부하면 좋을까?',
      avatar: '/images/profile.png'
    },
    {
      id: 2,
      sender: 'KUnnect',
      text: `🧑‍💻 1. 선배들의 실제 경험을 기반으로 정리해드릴게요
고려대 정보대 졸업생 중 프론트엔지니어로 간 선배들은 이렇게 준비했어요:
React·TypeScript 기반의 개인 프로젝트 2~3개를 완성하며 실전 감각을 쌓았어요.
일부 선배들은 Next.js로 SSR 경험을 쌓아 면접에서 강점을 보여줬어요.
스터디, 동아리 활동을 통해 코드 리뷰 경험을 꾸준히 쌓은 것도 큰 도움이 됐다고 했어요.

💡 2. 알아두면 좋은 실전 팁도 있어요
선배들이 공통으로 추천한 학습 순서는 다음과 같아요.
• HTML/CSS/JavaScript 기초 다지기
• React + TypeScript 실전 프로젝트
• 컴포넌트 구조 설계 / 상태관리 경험 (Zustand, Recoil 등)
• Next.js 기반 프로젝트 1개 이상 만들기
• CI/CD로 배포 경험 쌓기 (Vercel, Netlify)

선배들의 자세한 경험을 보고 싶다면 여기 글을 참고해보세요.
👉 프론트엔드 취업 준비 실전 팁 모음 (글 원문 링크)

🤝 3. 더 궁금한 점이 있다면 이 선배들에게 직접 물어볼 수 있어요
아래는 해당 분야로 진출한 선배들이에요:
• 김OO (프론트엔드 엔지니어 @스타트업) → 프로필 보기 / 연결하기
• 박OO (FE 인턴 → 정규직 전환) → 프로필 보기 / 연결하기

필요하다면 비슷한 포트폴리오도 추천해드릴게요!`
    }
  ])
  const [inputMessage, setInputMessage] = useState('')
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setOpacity(1)
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const handleSendMessage = (e) => {
    e.preventDefault()
    if (!inputMessage.trim()) return

    const newMessage = {
      id: messages.length + 1,
      sender: 'User',
      text: inputMessage,
      avatar: '/images/profile.png'
    }

    setMessages([...messages, newMessage])
    setInputMessage('')

    // Simulate bot response (you can replace this with actual API call)
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        sender: 'KUnnect',
        text: '답변을 준비 중입니다...'
      }
      setMessages(prev => [...prev, botResponse])
    }, 1000)
  }

  return (
    <div className="chatbot-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Header */}
      <div className="chatbot-header">
        <div className="logo-section">
          <img src="/images/logo.png" alt="KUnnect Logo" className="chatbot-logo" />
        </div>
        <div className="header-nav">
          <button className="nav-link-btn" onClick={() => navigate('/portfolio')}>
            Portfolio
          </button>
          <button className="nav-link-btn" onClick={() => navigate('/feed')}>
            Feed
          </button>
        </div>
      </div>

      {/* Chat Messages */}
      <div className="chat-messages-container">
        <div className="chat-messages">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`message ${message.sender === 'User' ? 'user-message' : 'bot-message'}`}
            >
              <div className="message-avatar">
                {message.sender === 'User' ? (
                  <img src={message.avatar || '/images/profile.png'} alt="User" />
                ) : (
                  <div className="bot-avatar">K</div>
                )}
              </div>
              <div className="message-content">
                <div className="message-header">
                  <span className="message-sender">{message.sender}</span>
                </div>
                <div className="message-bubble">
                  <p className="message-text">{message.text}</p>
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      </div>

      {/* Input Prompt */}
      <div className="prompt-container">
        <form className="prompt-form" onSubmit={handleSendMessage}>
          <div className="prompt-input-wrapper">
            <button type="button" className="attach-button">
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M18 9.5L10 17.5L2 9.5" stroke="#9CA3AF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
            <input
              type="text"
              className="prompt-input"
              placeholder="졸업하고 프론트 엔지니어로 일하고 싶어. 어떻게 공부하면 좋을까?"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
            />
          </div>
          <button type="submit" className="send-button">
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M18 2L9 11M18 2L12 18L9 11M18 2L2 8L9 11" stroke="#FFFFFF" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
            </svg>
          </button>
        </form>
      </div>
    </div>
  )
}

export default ChatbotPage

