import { Navigate, Route, Routes } from 'react-router'
import { RequireAuth } from './auth/RequireAuth.jsx'
import { useAuth } from './auth/useAuth.js'
import { LoginPage } from './pages/LoginPage.jsx'

function TodayPlaceholder() {
  const { user, logout } = useAuth()
  return (
    <main style={{ padding: 'var(--space-5)' }}>
      <h1>שלום {user.name}</h1>
      <p>כאן יהיה מסך "היום".</p>
      <button type="button" onClick={logout}>
        התנתקות
      </button>
    </main>
  )
}

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          <RequireAuth>
            <TodayPlaceholder />
          </RequireAuth>
        }
      />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
