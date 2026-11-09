import { useCallback, useEffect, useState } from 'react'
import { api, getToken, setToken } from '../api/api.js'
import { AuthContext } from './useAuth.js'

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  // True while we check a token saved from a previous visit
  const [checking, setChecking] = useState(() => Boolean(getToken()))

  const logout = useCallback(() => {
    setToken(null)
    setUser(null)
  }, [])

  useEffect(() => {
    if (!getToken()) return
    api('/auth/me')
      .then((data) => setUser(data.user))
      .catch(() => logout())
      .finally(() => setChecking(false))
  }, [logout])

  useEffect(() => {
    window.addEventListener('auth:unauthorized', logout)
    return () => window.removeEventListener('auth:unauthorized', logout)
  }, [logout])

  async function login(email, password) {
    const data = await api('/auth/login', { method: 'POST', body: { email, password } })
    setToken(data.token)
    setUser(data.user)
  }

  async function register(fields) {
    const data = await api('/auth/register', { method: 'POST', body: fields })
    setToken(data.token)
    setUser(data.user)
  }

  return (
    <AuthContext.Provider value={{ user, checking, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}
