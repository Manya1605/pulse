import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { apiCall } from '../config/api'

const Field = ({ k, label, type = 'text', ph, value, onChange, error }) => (
  <div className="auth-field">
    <label className="auth-label">{label}</label>
    <input className={`auth-input${error ? ' error' : ''}`} type={type} placeholder={ph}
      value={value} onChange={onChange} />
    {error && <span className="auth-err">{error}</span>}
  </div>
)

export default function RegisterPage() {
  const { setPage, showToast, setCurrentUser, setAccessToken, setRefreshToken } = useApp()
  const [form, setForm]     = useState({ displayName: '', username: '', email: '', password: '' })
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(false)

  const validate = () => {
    const e = {}
    if (form.username.length < 3) e.username = 'Min 3 characters'
    if (!form.email.includes('@'))  e.email    = 'Invalid email'
    if (form.password.length < 8)  e.password  = 'Min 8 characters'
    setErrors(e)
    return !Object.keys(e).length
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!validate()) return
    
    setLoading(true)
    try {
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          displayName: form.displayName || form.username
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
        
        showToast('Account created! 🎉', '✓')
        setPage('welcome')
      } else {
        showToast(response?.message || 'Registration failed', '❌')
      }
    } catch (error) {
      console.error('Registration error:', error)
      showToast(error.message || 'Registration failed', '❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="auth-page">
      <div className="auth-bg" />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-logo-dot" />
          <span className="auth-logo-text">DevPulse</span>
        </div>
        <div className="auth-subtitle">Create your developer account</div>
        <form className="auth-form" onSubmit={handleSubmit}>
          <Field 
            k="displayName" 
            label="Display Name" 
            ph="Arjun Kumar"
            value={form.displayName}
            onChange={e => setForm(p => ({ ...p, displayName: e.target.value }))}
            error={errors.displayName}
          />
          <Field 
            k="username" 
            label="Username" 
            ph="arjunkumar"
            value={form.username}
            onChange={e => setForm(p => ({ ...p, username: e.target.value }))}
            error={errors.username}
          />
          <Field 
            k="email" 
            label="Email" 
            type="email" 
            ph="arjun@example.com"
            value={form.email}
            onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
            error={errors.email}
          />
          <Field 
            k="password" 
            label="Password" 
            type="password" 
            ph="••••••••"
            value={form.password}
            onChange={e => setForm(p => ({ ...p, password: e.target.value }))}
            error={errors.password}
          />
          <button className="auth-submit" type="submit" disabled={loading}>
            {loading ? 'Creating account...' : 'Create Account →'}
          </button>
        </form>
        <div className="auth-footer">
          Already have an account?{' '}
          <span className="auth-link" onClick={() => setPage('login')}>Sign in</span>
        </div>
      </div>
    </div>
  )
}
