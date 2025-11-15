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
  const [sessions, setSessions] = useState([])
  const [isChatHistoryOpen, setIsChatHistoryOpen] = useState(true)
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
      console.log('ChatbotPage: Initializing chat...')
      // Load all sessions for sidebar
      const allSessions = await chatbotService.getSessions()
      console.log('ChatbotPage: Received sessions:', allSessions)
      
      if (allSessions && Array.isArray(allSessions) && allSessions.length > 0) {
        setSessions(allSessions)
        // Use the most recent session
        const latestSession = allSessions[0]
        const id = latestSession.id || latestSession._id || latestSession.sessionId
        console.log('ChatbotPage: Using existing session:', id)
        if (id) {
          setSessionId(id)
          await loadMessages(id)
          return
        }
      } else if (allSessions && !Array.isArray(allSessions) && allSessions) {
        // Handle single session object
        setSessions([allSessions])
        const id = allSessions.id || allSessions._id || allSessions.sessionId
        console.log('ChatbotPage: Using single session:', id)
        if (id) {
          setSessionId(id)
          await loadMessages(id)
          return
        }
      }
      // If no sessions exist, create a new one
      console.log('ChatbotPage: No existing sessions, creating new one...')
      const newSession = await chatbotService.createSession()
      console.log('ChatbotPage: Created new session:', newSession)
      const id = newSession.id || newSession._id || newSession.sessionId || newSession.data?.id
      if (id) {
        setSessionId(id)
        setSessions([newSession])
        console.log('ChatbotPage: New session initialized with id:', id)
      } else {
        console.warn('ChatbotPage: New session created but no ID found:', newSession)
      }
    } catch (err) {
      console.error('ChatbotPage: Error initializing chat:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      // Fallback: use direct AI chat if session-based fails
    }
  }

  const handleSessionClick = async (session) => {
    const id = session.id || session._id || session.sessionId
    if (id) {
      setSessionId(id)
      await loadMessages(id)
    }
  }

  const loadMessages = async (sessionId) => {
    try {
      console.log('ChatbotPage: Loading messages for session:', sessionId)
      const sessionMessages = await chatbotService.getMessages(sessionId)
      console.log('ChatbotPage: Received messages:', sessionMessages)
      
      if (sessionMessages && sessionMessages.length > 0) {
        // Transform API messages to component format
        const formattedMessages = sessionMessages.map((msg, index) => {
          // Determine sender
          let sender = 'KUnnect'
          if (msg.role === 'user' || msg.role === 'USER' || msg.sender === 'user' || msg.sender === 'User') {
            sender = 'User'
          } else if (msg.role === 'assistant' || msg.role === 'ASSISTANT' || msg.sender === 'assistant' || msg.sender === 'bot') {
            sender = 'KUnnect'
          }
          
          return {
            id: msg.id || msg._id || `msg-${index}`,
            sender: sender,
            text: msg.content || msg.message || msg.text || '',
            avatar: sender === 'User' ? '/images/profile.png' : undefined
          }
        })
        console.log('ChatbotPage: Formatted messages:', formattedMessages)
        setMessages(formattedMessages)
      } else {
        console.log('ChatbotPage: No messages found for session')
        setMessages([])
      }
    } catch (err) {
      console.error('ChatbotPage: Error loading messages:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
    }
  }

  const handleSendMessage = async (e) => {
    e.preventDefault()
    if (!inputMessage?.trim() || isLoading) return

    const currentInput = inputMessage.trim()
    setInputMessage('')
    setIsLoading(true)

    // Add loading message
    const loadingMessage = {
      id: Date.now() + 1,
      sender: 'KUnnect',
      text: '답변을 준비 중입니다...'
    }
    setMessages(prev => [...prev, {
      id: Date.now(),
      sender: 'User',
      text: currentInput,
      avatar: '/images/profile.png'
    }, loadingMessage])

    try {
      // Ensure we have a session before sending message
      let currentSessionId = sessionId
      if (!currentSessionId) {
        console.log('ChatbotPage: No session ID, creating new session...')
        const newSession = await chatbotService.createSession()
        const id = newSession.id || newSession._id || newSession.sessionId || newSession.data?.id
        if (id) {
          currentSessionId = id
          setSessionId(id)
          // Update sessions list
          const updatedSessions = await chatbotService.getSessions()
          setSessions(updatedSessions || [newSession])
          console.log('ChatbotPage: Created and set new session:', id)
        } else {
          throw new Error('Failed to create session')
        }
      }

      // Send message via session
      console.log('ChatbotPage: Sending message via session:', currentSessionId)
      const response = await chatbotService.sendMessage(currentSessionId, currentInput)
      console.log('ChatbotPage: Received response from session:', response)
      
      // Wait a bit for server to process and save the message
      // Then reload messages from server to get the complete conversation history
      console.log('ChatbotPage: Waiting for server to save message...')
      await new Promise(resolve => setTimeout(resolve, 500)) // 500ms delay
      
      console.log('ChatbotPage: Reloading messages from server...')
      // Retry loading messages up to 3 times in case server needs more time
      let retries = 3
      let loadedMessages = []
      while (retries > 0) {
        try {
          loadedMessages = await chatbotService.getMessages(currentSessionId)
          console.log(`ChatbotPage: Loaded messages (attempt ${4 - retries}):`, loadedMessages)
          
          // Check if our message is in the loaded messages
          const hasUserMessage = loadedMessages.some(msg => {
            const content = msg.content || msg.message || msg.text || ''
            return content.trim() === currentInput.trim()
          })
          
          if (hasUserMessage || loadedMessages.length > 0) {
            console.log('ChatbotPage: Messages found, stopping retry')
            break
          }
          
          retries--
          if (retries > 0) {
            console.log(`ChatbotPage: Message not found yet, retrying in 500ms... (${retries} retries left)`)
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        } catch (loadErr) {
          console.error('ChatbotPage: Error loading messages:', loadErr)
          retries--
          if (retries > 0) {
            await new Promise(resolve => setTimeout(resolve, 500))
          }
        }
      }
      
      // Update messages with server data
      await loadMessages(currentSessionId)
      
      // Also refresh sessions list to get updated session info
      try {
        const updatedSessions = await chatbotService.getSessions()
        if (updatedSessions && Array.isArray(updatedSessions)) {
          setSessions(updatedSessions)
        }
      } catch (sessionErr) {
        console.warn('ChatbotPage: Failed to refresh sessions list:', sessionErr)
      }
      
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
      console.error('ChatbotPage: Error sending message:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="chatbot-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      {/* Sidebar - Recent Chats */}
      <div className="chatbot-sidebar">
        <div className="sidebar-header">
          <div className="sidebar-header-content">
            <h2 className="sidebar-title">Recent Chats</h2>
            <button 
              className="sidebar-toggle"
              onClick={() => setIsChatHistoryOpen(!isChatHistoryOpen)}
            >
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M5 7.5L10 12.5L15 7.5" stroke="#475569" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </button>
          </div>
        </div>
        {isChatHistoryOpen && (
          <div className="sidebar-sessions">
            {sessions.map((session, index) => {
              const id = session.id || session._id || session.sessionId
              const isActive = id === sessionId
              const title = session.title || session.name || `채팅 ${index + 1}`
              
              return (
                <button
                  key={id || index}
                  className={`session-item ${isActive ? 'active' : ''}`}
                  onClick={() => handleSessionClick(session)}
                >
                  <span className="session-title">{title}</span>
                </button>
              )
            })}
          </div>
        )}
      </div>

      {/* Main Content Area */}
      <div className="chatbot-main">
        {/* Header */}
        <div className="chatbot-header">

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
            {messages.length === 0 ? (
              <div className="empty-state">
                <p>채팅을 시작해보세요!</p>
              </div>
            ) : (
              messages.map((message) => (
                <div
                  key={message.id}
                  className={`message ${message.sender === 'User' ? 'user-message' : 'bot-message'}`}
                >
                  <div className="message-avatar">
                    {message.sender === 'User' ? (
                      <img src={message.avatar || '/images/profile.png'} alt="User" />
                    ) : (
                      <img src="/images/logo.png" alt="KUnnect" className="bot-avatar-img" />
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
              ))
            )}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Input Prompt */}
        <div className="prompt-container">
          <form className="prompt-form" onSubmit={handleSendMessage}>
            <div className="prompt-input-wrapper">
              <button type="button" className="attach-button">
                <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7.5 12.5L10 10L12.5 12.5M10 10V17.5M4.0625 15.9375C3.25 15.125 2.75 14.0625 2.75 12.875V5.125C2.75 3.75 3.875 2.625 5.25 2.625H14.75C16.125 2.625 17.25 3.75 17.25 5.125V12.875C17.25 14.0625 16.75 15.125 15.9375 15.9375L10 10L4.0625 15.9375Z" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
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
    </div>
  )
}

export default ChatbotPage

