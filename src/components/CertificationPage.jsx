import { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { authService } from '../services'
import './CertificationPage.css'

function CertificationPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [opacity, setOpacity] = useState(0)
  const [selectedFile, setSelectedFile] = useState(null)
  const [preview, setPreview] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    setOpacity(1)
    // If no user data, redirect to signup
    if (!location.state?.userData) {
      navigate('/signup')
    }
  }, [location, navigate])

  const handleFileChange = (e) => {
    const file = e.target.files[0]
    if (file) {
      // Validate file type (jpg, jpeg, png, pdf)
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf']
      if (!allowedTypes.includes(file.type)) {
        setError('jpg, jpeg, png, pdf 파일만 업로드 가능합니다.')
        return
      }
      
      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        setError('파일 크기는 5MB 이하여야 합니다.')
        return
      }

      setSelectedFile(file)
      setError('')
      
      // Create preview (only for images, not PDFs)
      if (file.type.startsWith('image/')) {
        const reader = new FileReader()
        reader.onloadend = () => {
          setPreview(reader.result)
        }
        reader.readAsDataURL(file)
      } else {
        setPreview(null)
      }
    }
  }

  const handleFileRemove = () => {
    setSelectedFile(null)
    setPreview(null)
    setError('')
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!selectedFile) {
      setError('이미지를 첨부해주세요.')
      return
    }

    setError('')
    setIsLoading(true)

    try {
      const userData = location.state?.userData
      if (!userData) {
        setError('회원가입 정보가 없습니다.')
        navigate('/signup')
        return
      }

      // Validate required fields
      if (!userData.email || !userData.password || !userData.realName || !userData.nickname || !userData.role) {
        setError('필수 항목이 누락되었습니다. 회원가입 페이지로 돌아갑니다.')
        setTimeout(() => navigate('/signup'), 2000)
        return
      }

      // Create FormData with all signup data and verification image
      const formData = new FormData()
      const trimmedEmail = (userData.email || '').trim()
      
      // Ensure all required fields have values
      if (!trimmedEmail || !userData.password || !userData.realName?.trim() || !userData.nickname?.trim() || !userData.role) {
        setError('필수 항목이 올바르게 입력되지 않았습니다.')
        console.error('Missing required fields:', {
          email: trimmedEmail,
          hasPassword: !!userData.password,
          realName: userData.realName,
          nickname: userData.nickname,
          role: userData.role
        })
        return
      }
      
      formData.append('email', trimmedEmail)
      formData.append('password', userData.password)
      formData.append('realName', userData.realName?.trim() || '')
      formData.append('nickname', userData.nickname?.trim() || '')
      if (userData.phone) formData.append('phone', userData.phone?.trim() || '')
      if (userData.studentId) formData.append('studentId', userData.studentId?.trim() || '')
      if (userData.affiliation) formData.append('affiliation', userData.affiliation?.trim() || '')
      formData.append('role', userData.role)
      formData.append('verificationImage', selectedFile)
      
      // Debug: Log form data (without password)
      console.log('Submitting signup with:', {
        email: trimmedEmail,
        realName: userData.realName.trim(),
        nickname: userData.nickname.trim(),
        role: userData.role,
        hasFile: !!selectedFile,
        fileType: selectedFile?.type,
        fileSize: selectedFile?.size
      })
      
      // Debug: Log FormData contents
      for (let pair of formData.entries()) {
        if (pair[0] !== 'password' && pair[0] !== 'verificationImage') {
          console.log(`${pair[0]}:`, pair[1])
        } else if (pair[0] === 'verificationImage') {
          console.log(`${pair[0]}:`, pair[1].name, pair[1].type, pair[1].size)
        }
      }
      
      // Submit signup with verification image
      await authService.signupWithVerification(formData)
      
      alert('회원가입이 완료되었습니다. 인증은 수동으로 확인되며 최대 2-3일 소요될 수 있습니다.')
      navigate('/login')
    } catch (err) {
      // Extract error message from response
      let errorMessage = '인증 요청 제출에 실패했습니다. 다시 시도해주세요.'
      
      if (err.response?.data) {
        // Try different possible error message fields
        errorMessage = err.response.data.message || 
                      err.response.data.error || 
                      (Array.isArray(err.response.data.message) ? err.response.data.message.join(', ') : err.response.data.message) ||
                      err.response.data.msg ||
                      JSON.stringify(err.response.data)
      } else if (err.message) {
        errorMessage = err.message
      }
      
      setError(errorMessage)
      console.error('Certification upload error:', err)
      console.error('Error response:', err.response?.data)
      console.error('Error status:', err.response?.status)
      console.error('User data:', { email: userData?.email, hasPassword: !!userData?.password })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="certification-container" style={{ opacity, transition: 'opacity 0.5s ease-in' }}>
      <div className="certification-form-container">
        <form className="certification-form" onSubmit={handleSubmit}>
          {/* Title */}
          <h2 className="certification-title">
            고려대학교 정보대학 재학생 또는 졸업생임을<br />
            확인할 수 있는 이미지를 첨부해주세요
          </h2>

          {/* Description */}
          <p className="certification-description">
            (포털 학적사항/학생증/졸업증명서 등)<br />
            *인증은 수동으로 확인되며 최대 2-3일 소요될 수 있습니다*
          </p>

          {/* File Upload */}
          <div className="file-upload-wrapper">
            <input
              type="file"
              id="certification-file"
              accept="image/jpeg,image/jpg,image/png,application/pdf"
              onChange={handleFileChange}
              className="file-input"
              disabled={isLoading}
            />
            <label htmlFor="certification-file" className="file-upload-label">
              {preview ? (
                <div className="file-preview">
                  <img src={preview} alt="Preview" className="preview-image" />
                  <button
                    type="button"
                    className="remove-file-btn"
                    onClick={(e) => {
                      e.preventDefault()
                      handleFileRemove()
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : selectedFile ? (
                <div className="file-upload-placeholder">
                  <span>{selectedFile.name}</span>
                  <button
                    type="button"
                    className="remove-file-btn-inline"
                    onClick={(e) => {
                      e.preventDefault()
                      handleFileRemove()
                    }}
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <div className="file-upload-placeholder">
                  <span>이미지 첨부하기</span>
                </div>
              )}
            </label>
          </div>

          {/* Error Message */}
          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {/* Submit Button */}
          <button type="submit" className="certification-button" disabled={isLoading || !selectedFile}>
            {isLoading ? '제출 중...' : 'Sign Up'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default CertificationPage

