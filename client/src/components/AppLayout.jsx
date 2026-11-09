import { NavLink, Outlet } from 'react-router'
import { useAuth } from '../auth/useAuth.js'
import styles from './AppLayout.module.css'

export function AppLayout() {
  const { user, logout } = useAuth()

  return (
    <div className={styles.app}>
      <header className={styles.header}>
        <span className={styles.logo}>Study&amp;Review</span>
        <nav className={styles.nav}>
          <NavLink to="/" end className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            השבוע
          </NavLink>
          <NavLink to="/progress" className={({ isActive }) => (isActive ? styles.activeLink : styles.link)}>
            התקדמות
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
