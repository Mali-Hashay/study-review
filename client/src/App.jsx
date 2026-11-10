import { Navigate, Route, Routes } from 'react-router'
import { RequireAuth } from './auth/RequireAuth.jsx'
import { AppLayout } from './components/AppLayout.jsx'
import { LoginPage } from './pages/LoginPage.jsx'
import { ManagementPage } from './pages/management/ManagementPage.jsx'
import { ProgressPage } from './pages/ProgressPage.jsx'
import { WeekPage } from './pages/WeekPage.jsx'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        element={
          <RequireAuth>
            <AppLayout />
          </RequireAuth>
        }
      >
        <Route path="/" element={<WeekPage />} />
        <Route path="/progress" element={<ProgressPage />} />
        <Route path="/management" element={<ManagementPage />} />
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
