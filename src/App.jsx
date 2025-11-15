import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import LandingPage from './components/LandingPage'
import PortfolioPage from './components/PortfolioPage'
import PortfolioEditPage from './components/PortfolioEditPage'
import SignupPage from './components/SignupPage'
import LoginPage from './components/LoginPage'
import ChatbotPage from './components/ChatbotPage'
import FeedPage from './components/FeedPage'
import './App.css'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/portfolio" element={<PortfolioPage />} />
        <Route path="/portfolio/edit" element={<PortfolioEditPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/chatbot" element={<ChatbotPage />} />
        <Route path="/feed" element={<FeedPage />} />
      </Routes>
    </Router>
  )
}

export default App

