import { useState } from 'react'
import type { GameApi } from '../hooks/useGameState'
import styles from './Settings.module.css'

type Props = { game: GameApi }

export function Settings({ game }: Props) {
  const { state, reset } = game
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className={styles.page}>
      <header className={styles.pageHeader}>
        <p>设置</p>
        <h2>数据与关于</h2>
      </header>

      <section className={styles.block}>
        <div className={styles.row}>
          <span>连续打卡</span>
          <strong>{state.streak} 天</strong>
        </div>
        <div className={styles.separator} />
        <div className={styles.row}>
          <span>菜谱数量</span>
          <strong>{game.recipes.length} 道</strong>
        </div>
        <div className={styles.separator} />
        <div className={styles.row}>
          <span>数据存储</span>
          <strong>仅此设备</strong>
        </div>
      </section>

      <section className={styles.block}>
        <div className={styles.blockCopy}>
          <h3>重置进度</h3>
          <p>清除打卡、偏好与今日菜单。此操作无法撤销。</p>
        </div>
        {!confirmReset ? (
          <button type="button" className={styles.danger} onClick={() => setConfirmReset(true)}>
            重置全部进度
          </button>
        ) : (
          <button
            type="button"
            className={styles.danger}
            onClick={() => {
              reset()
              setConfirmReset(false)
            }}
          >
            确认清除全部数据
          </button>
        )}
        {confirmReset && (
          <button type="button" className={styles.cancel} onClick={() => setConfirmReset(false)}>
            取消
          </button>
        )}
      </section>

      <footer className={styles.note}>
        <strong>开饭盒子</strong>
        <span>版本 1.3 · 几道随你选，够吃不纠结</span>
      </footer>
    </div>
  )
}
