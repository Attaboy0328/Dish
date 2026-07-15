import { NavLink, Outlet } from 'react-router-dom'
import styles from './Layout.module.css'
import type { GameApi } from '../hooks/useGameState'

type Props = {
  game: GameApi
}

export function Layout({ game }: Props) {
  const { streak } = game.state
  const checkedIn = game.state.today?.confirmed

  return (
    <div className={styles.shell}>
      <header className={styles.header}>
        <div>
          <h1 className={styles.brand}>开饭盒子</h1>
          <p className={styles.tagline}>今天吃啥就交给运气</p>
        </div>
        <div className={styles.streak} title={checkedIn ? '今日已打卡' : '确认菜单后打卡'}>
          <span className={styles.streakNum}>{streak}</span>
          <span className={styles.streakLabel}>{checkedIn ? '连吃 · 已打卡' : '连吃天数'}</span>
        </div>
      </header>

      <main className={styles.main}>
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
          <span className={styles.navIcon}>🍱</span>
          今日
        </NavLink>
        <NavLink
          to="/codex"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <span className={styles.navIcon}>📖</span>
          图鉴
        </NavLink>
        <NavLink
          to="/settings"
          className={({ isActive }) =>
            isActive ? `${styles.navLink} ${styles.navLinkActive}` : styles.navLink
          }
        >
          <span className={styles.navIcon}>⚙️</span>
          设置
        </NavLink>
      </nav>
    </div>
  )
}
