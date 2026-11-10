import { useState } from 'react'
import { Navigate, useNavigate } from 'react-router'
import { useAuth } from '../auth/useAuth.js'
import styles from './LoginPage.module.css'

const EMPTY_FORM = { name: '', email: '', password: '', registrationCode: '' }

export function LoginPage() {
  const { user, login, register } = useAuth()
  const navigate = useNavigate()
  const [mode, setMode] = useState('login')
  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState(null)
  const [submitting, setSubmitting] = useState(false)

  if (user) return <Navigate to="/" replace />

  const isRegister = mode === 'register'

  function updateField(event) {
    setForm({ ...form, [event.target.name]: event.target.value })
  }

  function switchMode(newMode) {
    setMode(newMode)
    setError(null)
  }

  async function handleSubmit(event) {
    event.preventDefault()
    setError(null)
    setSubmitting(true)
    try {
      if (isRegister) await register(form)
      else await login(form.email, form.password)
      navigate('/')
    } catch (err) {
      setError(err)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className={styles.page}>
      <div className={styles.card}>
        <header className={styles.header}>
          <h1>Study&amp;Review</h1>
          <p>
            הדרך שלנו לעבודת החלומות <span className={styles.smile}>:)</span>
          </p>
        </header>

        <div className={styles.tabs} role="tablist">
          <button
            type="button"
            role="tab"
            aria-selected={!isRegister}
            className={!isRegister ? styles.activeTab : styles.tab}
            onClick={() => switchMode('login')}
          >
            התחברות
          </button>
          <button
            type="button"
            role="tab"
            aria-selected={isRegister}
            className={isRegister ? styles.activeTab : styles.tab}
            onClick={() => switchMode('register')}
          >
            הרשמה
          </button>
        </div>

        <form className={styles.form} onSubmit={handleSubmit} noValidate>
          {isRegister && (
            <label className={styles.field}>
              שם
              <input name="name" value={form.name} onChange={updateField} autoComplete="name" />
            </label>
          )}

          <label className={styles.field}>
            אימייל
            <input
              name="email"
              type="email"
              dir="ltr"
              value={form.email}
              onChange={updateField}
              autoComplete="email"
            />
          </label>

          <label className={styles.field}>
            סיסמה
            <input
              name="password"
              type="password"
              dir="ltr"
              value={form.password}
              onChange={updateField}
              autoComplete={isRegister ? 'new-password' : 'current-password'}
            />
          </label>

          {isRegister && (
            <label className={styles.field}>
              קוד הזמנה
              <input
                name="registrationCode"
                dir="ltr"
                value={form.registrationCode}
                onChange={updateField}
              />
            </label>
          )}

          {error && (
            <div className={styles.error} role="alert">
              <p>{error.message}</p>
              {error.details && (
                <ul>
                  {error.details.map((detail) => (
                    <li key={detail.field}>{detail.message}</li>
                  ))}
                </ul>
              )}
            </div>
          )}

          <button type="submit" className={styles.submit} disabled={submitting}>
            {submitting ? 'אנא המתיני...' : isRegister ? 'הרשמה' : 'התחברות'}
          </button>
        </form>
      </div>
    </div>
  )
}
