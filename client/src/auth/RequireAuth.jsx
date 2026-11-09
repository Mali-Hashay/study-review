import { Navigate } from 'react-router'
import { useAuth } from './useAuth.js'

export function RequireAuth({ children }) {
  const { user, checking } = useAuth()

  if (checking) return <p style={{ padding: 'var(--space-5)' }}>טוען...</p>
  if (!user) return <Navigate to="/login" replace />

  return children
}
