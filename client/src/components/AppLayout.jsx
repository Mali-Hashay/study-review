import { NavLink, Outlet, useLocation } from 'react-router'
import { useAuth } from '../auth/useAuth.js'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { user, logout } = useAuth()
  const { pathname } = useLocation()

  // The week screen stays on white; the other screens get a light tint so white cards stand out
  const tinted = pathname !== '/'

  return (
    <div className={tinted ? `${styles.app} ${styles.tinted}` : styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>Study&amp;Review</span>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            השבוע
          </NavLink>
          <NavLink to="/progress" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            התקדמות
          </NavLink>
          <NavLink to="/management" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            ניהול
          </NavLink>
        </nav>
        <div className={styles.user}>
          <span>{user.name}</span>
          <button type="button" className={styles.logout} onClick={logout}>
            התנתקות
          </button>
        </div>
      </header>
      <main className={styles.main}>
        <Outlet />
      </main>
    </div>
  )
}
