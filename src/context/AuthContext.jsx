import React, { createContext, useContext, useState, useEffect } from 'react'
import axios from 'axios'
import { jwtDecode } from 'jwt-decode'

axios.defaults.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:8080'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used within an AuthProvider')
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const token = localStorage.getItem('accessToken')
    if (token) {
      try {
        const decoded = jwtDecode(token)
        const isExpired = decoded.exp * 1000 < Date.now()
        if (isExpired) {
          localStorage.removeItem('accessToken')
          localStorage.removeItem('refreshToken')
        } else {
          setUser({ email: decoded.sub, role: decoded.role, userId: decoded.userId, userName: decoded.userName })
          setIsAuthenticated(true)
          axios.defaults.headers.common['Authorization'] = `Bearer ${token}`
        }
      } catch {
        localStorage.removeItem('accessToken')
        localStorage.removeItem('refreshToken')
      }
    }
    setLoading(false)
  }, [])

  const login = async (userName, password) => {
  try {
    const response = await axios.post('/api/v1/authentication/login', { userName, password })
    const { accessToken, refreshToken } = response.data

    const decoded = jwtDecode(accessToken)
    localStorage.setItem('accessToken', accessToken)
    localStorage.setItem('refreshToken', refreshToken)
    axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`

    setUser({ email: decoded.sub, role: decoded.role, userId: decoded.userId, userName: decoded.userName })
    setIsAuthenticated(true)

    return { success: true, role: decoded.role }
  } catch (error) {
    return {
      success: false,
      error: error.response?.data?.message || 'Invalid username or password',
    }
  }
}

  const register = async (userData) => {
    try {
      const response = await axios.post('/api/v1/users/register', userData)
      return { success: true, data: response.data }
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.message || 'Registration failed'
      }
    }
  }

  const logout = async () => {
    try {
      const refreshToken = localStorage.getItem('refreshToken')
      if (refreshToken) {
        await axios.post('/api/v1/authentication/logout', { refreshToken })
      }
    } catch (e) { /* ignore */ }

    localStorage.removeItem('accessToken')
    localStorage.removeItem('refreshToken')
    delete axios.defaults.headers.common['Authorization']
    setUser(null)
    setIsAuthenticated(false)
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
