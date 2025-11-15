import { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { chatbotService } from '../services'
import './ChatbotPage.css'

function ChatbotPage() {
  const navigate = useNavigate()
  const [opacity, setOpacity] = useState(0)
  const [messages, setMessages] = useState([])
  const [inputMessage, setInputMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [sessionId, setSessionId] = useState(null)
  const messagesEndRef = useRef(null)

  useEffect(() => {
    setOpacity(1)
    initializeChat()
  }, [])

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  const initializeChat = async () => {
    try {
      // Try to get existing sessions first
      const sessions = await chatbotService.getSessions()
      if (sessions && sessions.length > 0) {
        // Use the most recent session
        const latestSession = Array.isArray(sessions) ? sessions[0] : sessions
        const id = latestSession.id || latestSession._id || latestSession.sessionId
        if (id) {
          setSessionId(id)
          await loadMessages(id)
          return
        }
      }
      // If no sessions exist, create a new one
      const newSession = await chatbotService.createSession()
      const id = newSession.id || newSession._id || newSession.sessionId
      if (id) {
        setSessionId(id)
      }
    } catch (err) {
      console.error('Error initializing chat:', err)
      // Fallback: use direct AI chat if session-based fails
    }
  }

  const loadMessages = async (sessionId) => {
    try {
      const sessionMessages = await chatbotService.getMessages(sessionId)
      if (sessionMessages && sessionMessages.length > 0) {
        // Transform API messages to component format
        const formattedMessages = sessionMessages.map((msg, index) => ({
          id: msg.id || msg._id || index,
          sender: msg.role === 'user' || msg.sender === 'user' ? 'User' : 'KUnnect',
          text: msg.content || msg.message || msg.text || '',
          avatar: msg.role === 'user' ? '/images/profile.png' : undefined
        }))
        setMessages(formattedMessages)
      }
    } catch (err) {
      console.error('Error loading messages:', err)
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage?.trim() || isLoading) return

    const userMessage = {
      id: Date.now(),
      sender: 'User',
      text: inputMessage,
      avatar: '/images/profile.png'
    }

    setMessages(prev => [...prev, userMessage])
    const currentInput = inputMessage
    setInputMessage('')
    setIsLoading(true)

    // Add loading message
    const loadingMessage = {
      id: Date.now() + 1,
      sender: 'KUnnect',
      text: '답변을 준비 중입니다...'
    }
    setMessages(prev => [...prev, loadingMessage])

    try {
      let response

      if (sessionId) {
        // Use session-based chat
        response = await chatbotService.sendMessage(sessionId, currentInput)
      } else {
        // Fallback to direct AI chat
        const conversationHistory = messages
          .filter(msg => msg.text) // Filter out messages without text
          .map(msg => ({
            role: msg.sender === 'User' ? 'user' : 'assistant',
            content: msg.text || ''
          }))
        response = await chatbotService.chatWithAI(currentInput, conversationHistory)
      }
      
      // Remove loading message and add actual response
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.id !== loadingMessage.id)
        return [...withoutLoading, {
          id: Date.now() + 2,
          sender: 'KUnnect',
          text: response.message || response.text || response.content || response.response || '답변을 받지 못했습니다.'
        }]
      })
    } catch (err) {
      // Remove loading message and add error message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.id !== loadingMessage.id)
        return [...withoutLoading, {
          id: Date.now() + 2,
          sender: 'KUnnect',
          text: '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.'
        }]
      })
      console.error('Chatbot error:', err)
    } finally {
      setIsLoading(false)
    }
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
              disabled={isLoading}
            />
          </div>
          <button type="submit" className="send-button" disabled={isLoading || !inputMessage?.trim()}>
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

