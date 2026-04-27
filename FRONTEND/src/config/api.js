// API Configuration
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8001/api'

export default API_BASE_URL

// Helper function to refresh access token
async function refreshAccessToken() {
  const refreshToken = localStorage.getItem('refreshToken')
  
  if (!refreshToken) {
    throw new Error('No refresh token available')
  }
  
  const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ refreshToken }),
  })
  
  const data = await response.json()
  
  if (!response.ok) {
    // Clear tokens if refresh fails
    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    throw new Error(data.message || 'Token refresh failed')
  }
  
  // Store new access token
  localStorage.setItem('accessToken', data.accessToken)
  
  return data.accessToken
}

// Helper function for API calls
export async function apiCall(endpoint, options = {}, retryCount = 0) {
  const url = `${API_BASE_URL}${endpoint}`
  const token = localStorage.getItem('accessToken')
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  }
  
  if (token) {
    headers.Authorization = `Bearer ${token}`
  }
  
  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })
    
    const data = await response.json()
    
    if (!response.ok) {
      // Handle token expiration with automatic refresh
      if (response.status === 401 && data.message === 'Token expired' && retryCount === 0) {
        try {
          await refreshAccessToken()
          // Retry the original request with new token
          return apiCall(endpoint, options, retryCount + 1)
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError.message)
          // Redirect to login by throwing error (app will handle via useEffect)
          throw new Error('Session expired. Please login again.')
        }
      }
      
      const error = new Error(data.message || `API error: ${response.status}`)
      error.status = response.status
      error.data = data
      throw error
    }
    
    return data
  } catch (error) {
    console.error(`API Call Error [${endpoint}]:`, error)
    throw error
  }
}
