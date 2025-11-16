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
  const messagesContainerRef = useRef(null)
  const shouldAutoScrollRef = useRef(true) // Track if we should auto-scroll
  const lastMessageCountRef = useRef(0) // Track message count to detect new messages

  useEffect(() => {
    setOpacity(1)
    initializeChat()
  }, [])

  // Check if user is near the bottom of the chat
  const isNearBottom = () => {
    const container = messagesContainerRef.current
    if (!container) return true
    
    // Check if user is within 150px of the bottom
    const threshold = 150
    const scrollTop = container.scrollTop
    const scrollHeight = container.scrollHeight
    const clientHeight = container.clientHeight
    
    return scrollHeight - scrollTop - clientHeight < threshold
  }

  // Handle scroll event to detect if user scrolled up
  const handleScroll = () => {
    shouldAutoScrollRef.current = isNearBottom()
  }

  useEffect(() => {
    // Only auto-scroll if:
    // 1. User is near the bottom (or hasn't scrolled)
    // 2. New messages were actually added (not just session list update)
    const hasNewMessages = messages.length > lastMessageCountRef.current
    
    if (shouldAutoScrollRef.current && hasNewMessages) {
      // Small delay to ensure DOM is updated
      setTimeout(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
      }, 100)
    }
    
    // Update message count
    lastMessageCountRef.current = messages.length
  }, [messages])

  const initializeChat = async () => {
    try {
      console.log('ChatbotPage: Initializing chat...')
      // Start with empty messages - don't auto-load any session
      setMessages([])
      setSessionId(null)
      
      // Load all sessions for sidebar only (don't load messages)
      const allSessions = await chatbotService.getSessions()
      console.log('ChatbotPage: Received sessions:', allSessions)
      
      if (allSessions && Array.isArray(allSessions) && allSessions.length > 0) {
        // Sort sessions: newest first
        const sortedSessions = [...allSessions].sort((a, b) => {
          if (a.createdAt && b.createdAt) {
            return new Date(b.createdAt) - new Date(a.createdAt)
          }
          return 0
        })
        setSessions(sortedSessions)
        console.log('ChatbotPage: Loaded sessions for sidebar, starting with empty chat')
      } else if (allSessions && !Array.isArray(allSessions) && allSessions) {
        // Handle single session object
        setSessions([allSessions])
        console.log('ChatbotPage: Loaded single session for sidebar, starting with empty chat')
      } else {
        // No sessions exist - start with empty state
        setSessions([])
        console.log('ChatbotPage: No existing sessions, starting with empty chat')
      }
    } catch (err) {
      console.error('ChatbotPage: Error initializing chat:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status
      })
      // Start with empty state even if loading sessions fails
      setMessages([])
      setSessions([])
    }
  }

  const handleNewChat = async () => {
    try {
      console.log('ChatbotPage: Starting new chat...')
      // Clear current messages first
      setMessages([])
      setSessionId(null)
      // Reset auto-scroll for new chat
      shouldAutoScrollRef.current = true
      lastMessageCountRef.current = 0
      
      // Create new session
      const newSession = await chatbotService.createSession()
      console.log('ChatbotPage: Created new session:', newSession)
      const id = newSession.id || newSession._id || newSession.sessionId || newSession.data?.id
      
      if (id) {
        setSessionId(id)
        // Refresh sessions list and put new session at the top
        const updatedSessions = await chatbotService.getSessions()
        if (updatedSessions && Array.isArray(updatedSessions)) {
          // Sort sessions: newest first (by createdAt or id)
          const sortedSessions = [...updatedSessions].sort((a, b) => {
            // Try to sort by createdAt (newest first)
            if (a.createdAt && b.createdAt) {
              return new Date(b.createdAt) - new Date(a.createdAt)
            }
            // If no createdAt, put the new session (with matching id) first
            if (a.id === id || a._id === id || a.sessionId === id) return -1
            if (b.id === id || b._id === id || b.sessionId === id) return 1
            return 0
          })
          setSessions(sortedSessions)
        } else {
          // If no sessions list, just use the new session
          setSessions([newSession])
        }
        // Ensure messages are empty (don't load any messages for new session)
        setMessages([])
        console.log('ChatbotPage: New chat started with empty screen, session:', id)
      } else {
        throw new Error('Failed to create new session')
      }
    } catch (err) {
      console.error('ChatbotPage: Error starting new chat:', err)
      alert('새 채팅을 시작하는데 실패했습니다. 다시 시도해주세요.')
      // Ensure messages are cleared even on error
      setMessages([])
    }
  }

  const handleSessionClick = async (session) => {
    const id = session.id || session._id || session.sessionId
    if (id) {
      console.log('ChatbotPage: Loading session:', id)
      setSessionId(id)
      // Enable auto-scroll when switching sessions
      shouldAutoScrollRef.current = true
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
        // Use server message IDs to ensure uniqueness and replace temporary messages
        const formattedMessages = sessionMessages.map((msg, index) => {
          // Log raw message for debugging
          console.log(`Message ${index}:`, {
            id: msg.id || msg._id,
            role: msg.role,
            sender: msg.sender,
            content: msg.content || msg.message || msg.text
          })
          
          // Determine sender based on role (case-insensitive)
          // Backend returns role as 'USER' or 'ASSISTANT' (uppercase)
          let sender = 'KUnnect' // Default to assistant
          const role = (msg.role || '').toLowerCase()
          const msgSender = (msg.sender || '').toLowerCase()
          
          console.log(`  Parsing role: "${msg.role}" -> lowercase: "${role}"`)
          
          if (role === 'user') {
            sender = 'User'
            console.log(`  -> Determined as User`)
          } else if (role === 'assistant') {
            sender = 'KUnnect'
            console.log(`  -> Determined as KUnnect (assistant)`)
          } else {
            // If role is not clear, log warning and default to assistant
            console.warn(`  -> Message ${index} has unclear role: "${msg.role}", defaulting to KUnnect`)
            sender = 'KUnnect'
          }
          
          // Use server message ID - ensure it's unique and not a temporary ID
          const messageId = msg.id || msg._id
          if (!messageId) {
            console.warn(`Message ${index} has no ID, generating fallback ID`)
          }
          
          return {
            id: messageId || `server-msg-${Date.now()}-${index}-${Math.random().toString(36).substr(2, 9)}`,
            sender: sender,
            text: msg.content || msg.message || msg.text || '',
            avatar: sender === 'User' ? '/images/profile.png' : undefined
          }
        })
        console.log('ChatbotPage: Formatted messages with roles:', formattedMessages.map(m => ({ sender: m.sender, text: m.text.substring(0, 50) + '...' })))
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

    // Generate unique temporary IDs for optimistic UI updates
    const tempUserMessageId = `temp-user-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    const tempLoadingMessageId = `temp-loading-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    
    // Add loading message
    const loadingMessage = {
      id: tempLoadingMessageId,
      sender: 'KUnnect',
      text: '답변을 준비 중입니다...'
    }
    setMessages(prev => [...prev, {
      id: tempUserMessageId,
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

      // Step 1: Send user message to backend
      // Backend automatically:
      // 1. Saves user message with role: USER
      // 2. Calls AI service
      // 3. Saves AI response with role: ASSISTANT
      // 4. Returns { userMessage, assistantMessage, sources }
      console.log('ChatbotPage: Step 1 - Sending message to backend (auto-handles AI):', currentSessionId)
      let sendResult
      try {
        sendResult = await chatbotService.sendMessage(currentSessionId, currentInput)
        console.log('ChatbotPage: Backend response:', sendResult)
        console.log('ChatbotPage: User message saved:', sendResult?.userMessage)
        console.log('ChatbotPage: Assistant message saved:', sendResult?.assistantMessage)
      } catch (sendErr) {
        console.error('ChatbotPage: Failed to send message:', sendErr)
        throw new Error('메시지를 전송하는데 실패했습니다.')
      }

      // Step 5: Reload all messages from server to get updated conversation
      console.log('ChatbotPage: Step 5 - Reloading messages from server...')
      // Enable auto-scroll when new message is sent
      shouldAutoScrollRef.current = true
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
      // Remove loading message
      setMessages(prev => {
        const withoutLoading = prev.filter(msg => msg.id !== loadingMessage.id)
        
        // Determine error message based on error type
        let errorMessage = '죄송합니다. 오류가 발생했습니다. 다시 시도해주세요.'
        
        if (err.response) {
          // Server responded with error
          const status = err.response.status
          const errorData = err.response.data
          
          if (status === 401) {
            errorMessage = '인증이 필요합니다. 다시 로그인해주세요.'
          } else if (status === 404) {
            errorMessage = '서비스를 찾을 수 없습니다. 서버를 확인해주세요.'
          } else if (status === 500) {
            errorMessage = '서버 오류가 발생했습니다. 잠시 후 다시 시도해주세요.'
          } else if (errorData?.message) {
            errorMessage = errorData.message
          } else if (errorData?.error) {
            errorMessage = errorData.error
          }
        } else if (err.message) {
          // Network error or other error
          if (err.message.includes('Network') || err.message.includes('network')) {
            errorMessage = '서버에 연결할 수 없습니다. 인터넷 연결을 확인해주세요.'
          } else {
            errorMessage = err.message
          }
        }
        
        return [...withoutLoading, {
          id: `error-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          sender: 'KUnnect',
          text: errorMessage
        }]
      })
      
      console.error('ChatbotPage: Error sending message:', err)
      console.error('Error details:', {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
        url: err.config?.url,
        method: err.config?.method
      })
      
      // Try to reload messages to show at least the user message if it was saved
      if (sessionId) {
        try {
          await loadMessages(sessionId)
        } catch (loadErr) {
          console.error('ChatbotPage: Failed to reload messages after error:', loadErr)
        }
      }
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
          <button 
            className="new-chat-button"
            onClick={handleNewChat}
            title="새 채팅 시작"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M10 4V16M4 10H16" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
            새 채팅
          </button>
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
        <div 
          className="chat-messages-container"
          ref={messagesContainerRef}
          onScroll={handleScroll}
        >
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

