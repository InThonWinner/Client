import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import PortfolioPage from './components/PortfolioPage'
import PortfolioEditPage from './components/PortfolioEditPage'
import SignupPage from './components/SignupPage'
import CertificationPage from './components/CertificationPage'
import LoginPage from './components/LoginPage'
import ChatbotPage from './components/ChatbotPage'
import FeedPage from './components/FeedPage'
import FeedWritePage from './components/FeedWritePage'
import FeedReadPage from './components/FeedReadPage'
import ProtectedRoute from './components/ProtectedRoute'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/signup/certification" element={<CertificationPage />} />
        <Route path="/login" element={<LoginPage />} />
        {/* 보호된 라우트 - 로그인 필요 */}
        <Route 
          path="/portfolio" 
          element={
            <ProtectedRoute>
              <PortfolioPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/portfolio/edit" 
          element={
            <ProtectedRoute>
              <PortfolioEditPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/chatbot" 
          element={
            <ProtectedRoute>
              <ChatbotPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feed" 
          element={
            <ProtectedRoute>
              <FeedPage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feed/write" 
          element={
            <ProtectedRoute>
              <FeedWritePage />
            </ProtectedRoute>
          } 
        />
        <Route 
          path="/feed/:id" 
          element={
            <ProtectedRoute>
              <FeedReadPage />
            </ProtectedRoute>
          } 
        />
      </Routes>
    </Router>
  )
}

export default App

