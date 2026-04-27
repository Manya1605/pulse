import { useApp } from '../store/AppContext'
import { apiCall } from '../config/api'

export function useApiCall() {
  const { handleLogout, showToast } = useApp()

  const makeApiCall = async (endpoint, options = {}) => {
    try {
      return await apiCall(endpoint, options)
    } catch (error) {
      // Handle session expiration
      if (error.message === 'Session expired. Please login again.') {
        showToast('Session expired. Please login again.', '⏰')
        handleLogout()
        throw error
      }
      throw error
    }
  }

  return { apiCall: makeApiCall }
}
