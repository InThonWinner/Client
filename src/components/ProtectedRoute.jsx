import { Navigate } from 'react-router-dom'
import { authService } from '../services'

/**
 * Protected Route Component
 * 로그인되지 않은 사용자를 로그인 페이지로 리다이렉트합니다.
 */
function ProtectedRoute({ children }) {
  const isAuthenticated = authService.isAuthenticated()

  if (!isAuthenticated) {
    // 로그인되지 않은 경우 로그인 페이지로 리다이렉트
    return <Navigate to="/login" replace />
  }

  // 로그인된 경우 자식 컴포넌트 렌더링
  return children
}

export default ProtectedRoute

