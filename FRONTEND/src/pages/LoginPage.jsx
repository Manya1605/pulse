import { useState } from 'react'
import { useApp, MOCK } from '../store/AppContext'
import { apiCall } from '../config/api'

export default function LoginPage() {
  const { setPage, showToast, setCurrentUser, setAccessToken, setRefreshToken } = useApp()
  const [form, setForm]       = useState({ identifier: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [showPass, setShowPass] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.identifier || !form.password) { showToast('Please fill all fields', '⚠️'); return }
    
    setLoading(true)
    try {
      const response = await apiCall('/auth/login', {
        method: 'POST',
        body: JSON.stringify({
          identifier: form.identifier,
          password: form.password
        })
      })
      
      // Backend returns user data directly in response
      if (response && response.accessToken) {
        // Save tokens
        setAccessToken(response.accessToken)
        setRefreshToken(response.refreshToken)
        
        // Set user data with all fields
        setCurrentUser({
          username: response.username,
          email: response.email,
          displayName: response.displayName,
          initials: response.initials,
          githubUsername: response.githubUsername,
          leetcodeUsername: response.leetcodeUsername,
          codeforcesHandle: response.codeforcesHandle,
          hackerrankUsername: response.hackerrankUsername,
        })
        
        showToast('Welcome back! 👋', '✓')
        setPage('welcome')
      } else {
        showToast(response?.message || 'Login failed', '❌')
      }
    } catch (error) {
      console.error('Login error:', error)
      showToast(error.message || 'Login failed', '❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-glow" style={{ top: -100, left: '50%', transform: 'translateX(-50%)' }} />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-dot" />
          <span className="auth-logo-text">DevPulse</span>
        </div>
        <div className="auth-subtitle">Sign in to your dashboard</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="auth-field">
            <label className="auth-label">Username or Email</label>
            <input className="auth-input" type="text" placeholder="arjunkumar" autoFocus
              value={form.identifier} onChange={e => setForm(p => ({ ...p, identifier: e.target.value }))} />
          </div>
          <div className="auth-field">
            <label className="auth-label">Password</label>
            <div style={{ position: 'relative' }}>
              <input className="auth-input" type={showPass ? 'text' : 'password'} placeholder="••••••••"
                value={form.password} onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
                style={{ paddingRight: 40 }} />
              <span onClick={() => setShowPass(p => !p)}
                style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', cursor: 'pointer', fontSize: 16 }}>
                {showPass ? '🙈' : '👁️'}
              </span>
            </div>
          </div>
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Signing in...' : 'Sign In →'}
          </button>
        </form>
        <div className="auth-divider">or</div>
        <button className="auth-submit" type="button"
          style={{ background: 'var(--bg3)', color: 'var(--text)', border: '1px solid var(--border2)' }}
          onClick={() => { setCurrentUser(MOCK.user); setPage('welcome') }}>
          🎭 Continue with Demo Account
        </button>
        <div className="auth-footer">
          Don't have an account?{' '}
          <span className="auth-link" onClick={() => setPage('register')}>Create one</span>
        </div>
      </div>
    </div>
  )
}
