import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'
import { BookIcon, SettingsIcon, TodayIcon } from './Icons'

export function Layout() {
  const dayLabel = new Intl.DateTimeFormat('zh-CN', {
    month: 'long',
    day: 'numeric',
    weekday: 'short',
  }).format(new Date())

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div className={styles.brandGroup}>
          <p className={styles.date}>{dayLabel}</p>
          <h1 className={styles.brand}>开饭盒子</h1>
        </div>
      </header>

      <main id="main-content" className={styles.main}>
        <Outlet />
      </main>

      <nav className={styles.nav} aria-label="主导航">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <TodayIcon className={styles.navIcon} />
          今日
        </NavLink>
        <NavLink
          to="/codex"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <BookIcon className={styles.navIcon} />
          图鉴
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <SettingsIcon className={styles.navIcon} />
          设置
        </NavLink>
      </nav>
    </div>
  )
}
