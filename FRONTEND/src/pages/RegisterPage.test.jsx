// TEST FILE - Simple registration form to debug the issue
// Save this as FRONTEND/src/pages/RegisterPage.test.jsx

import { useState } from 'react'
import { useApp } from '../store/AppContext'
import { apiCall } from '../config/api'

export default function RegisterPageTest() {
  const { setPage, showToast, setCurrentUser, setAccessToken, setRefreshToken } = useApp()
  const [form, setForm] = useState({ displayName: '', username: '', email: '', password: '' })
  const [loading, setLoading] = useState(false)
  const [debug, setDebug] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    console.log('✅ Form submitted!', form)
    setDebug('Form submitted! Calling API...')
    
    if (!form.username || !form.email || !form.password) {
      setDebug('❌ Missing fields!')
      return
    }
    
    setLoading(true)
    setDebug('Loading... sending request to backend')
    
    try {
      console.log('📤 Sending to backend:', form)
      const response = await apiCall('/auth/register', {
        method: 'POST',
        body: JSON.stringify({
          username: form.username,
          email: form.email,
          password: form.password,
          displayName: form.displayName || form.username
        })
      })
      
      console.log('✅ Response received:', response)
      setDebug('✅ Response received! ' + JSON.stringify(response).substring(0, 100))
      
      if (response && response.accessToken) {
        setAccessToken(response.accessToken)
        setRefreshToken(response.refreshToken)
        setCurrentUser({
          username: response.username,
          email: response.email,
          displayName: response.displayName,
          initials: response.initials
        })
        setDebug('✅ SUCCESS! Redirecting to welcome page...')
        showToast('Account created! 🎉', '✓')
        setPage('welcome')
      } else {
        setDebug('❌ No accessToken in response: ' + JSON.stringify(response))
      }
    } catch (error) {
      console.error('❌ Error:', error)
      setDebug('❌ ERROR: ' + error.message)
      showToast(error.message || 'Registration failed', '❌')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: '0 auto' }}>
      <h1>🧪 Registration Debug Form</h1>
      
      <div style={{ 
        background: '#f0f0f0', 
        padding: '20px', 
        borderRadius: '8px', 
        marginBottom: '20px',
        fontFamily: 'monospace',
        fontSize: '12px',
        whiteSpace: 'pre-wrap',
        wordBreak: 'break-all'
      }}>
        {debug || 'Waiting for form submission...'}
      </div>
      
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '15px' }}>
          <label>Display Name:</label>
          <input 
            type="text" 
            placeholder="Test User"
            value={form.displayName}
            onChange={(e) => setForm(p => ({ ...p, displayName: e.target.value }))}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Username:</label>
          <input 
            type="text" 
            placeholder="testuser999"
            value={form.username}
            onChange={(e) => setForm(p => ({ ...p, username: e.target.value }))}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Email:</label>
          <input 
            type="email" 
            placeholder="test@example.com"
            value={form.email}
            onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <div style={{ marginBottom: '15px' }}>
          <label>Password:</label>
          <input 
            type="password" 
            placeholder="password123"
            value={form.password}
            onChange={(e) => setForm(p => ({ ...p, password: e.target.value }))}
            style={{ display: 'block', width: '100%', padding: '8px', marginTop: '5px' }}
          />
        </div>

        <button 
          type="submit" 
          disabled={loading}
          style={{
            padding: '10px 20px',
            background: loading ? '#ccc' : '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: loading ? 'not-allowed' : 'pointer',
            fontSize: '16px'
          }}
        >
          {loading ? 'Creating account...' : 'Create Account →'}
        </button>
      </form>

      <div style={{ marginTop: '30px', background: '#fff8dc', padding: '15px', borderRadius: '4px' }}>
        <strong>Debug Info:</strong>
        <pre style={{ fontSize: '12px', marginTop: '10px' }}>
Form data:
{JSON.stringify(form, null, 2)}

API URL: http://localhost:8001/api/auth/register
Loading: {loading.toString()}
        </pre>
      </div>
    </div>
  )
}
