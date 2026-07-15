import { useState } from 'react'
import type { GameApi } from '../hooks/useGameState'
import type { RevealMode } from '../types/recipe'
import styles from './Settings.module.css'

type Props = { game: GameApi }

const MODES: { id: RevealMode; icon: string; label: string }[] = [
  { id: 'box', icon: '🎁', label: '盲盒' },
  { id: 'flip', icon: '🃏', label: '翻牌' },
  { id: 'wheel', icon: '🎡', label: '转盘' },
]

export function Settings({ game }: Props) {
  const { state, setRevealMode, setAvoidYesterday, reset } = game
  const [confirmReset, setConfirmReset] = useState(false)

  return (
    <div className={styles.page}>
      <section className={styles.block}>
        <h3>揭晓方式</h3>
        <p className={styles.desc}>只换演出，不改抽奖结果。默认盲盒最有仪式感。</p>
        <div className={styles.modes}>
          {MODES.map((m) => (
            <button
              key={m.id}
              type="button"
              className={`${styles.mode} ${state.revealMode === m.id ? styles.on : ''}`}
              onClick={() => setRevealMode(m.id)}
            >
              <span className={styles.modeIcon}>{m.icon}</span>
              {m.label}
            </button>
          ))}
        </div>
      </section>

      <section className={styles.block}>
        <h3>避开昨天</h3>
        <div className={styles.toggleRow}>
          <p className={styles.desc} style={{ margin: 0 }}>
            抽奖时排除昨天确认过的菜，少重复。
          </p>
          <button
            type="button"
            className={`${styles.toggle} ${state.avoidYesterday ? styles.on : ''}`}
            onClick={() => setAvoidYesterday(!state.avoidYesterday)}
            aria-pressed={state.avoidYesterday}
            aria-label="避开昨天"
          >
            <span className={styles.knob} />
          </button>
        </div>
      </section>

      <section className={styles.block}>
        <h3>本地进度</h3>
        <p className={styles.desc}>
          连吃 {state.streak} 天 · 数据只存在本机浏览器。
        </p>
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
            确认重置？此操作不可恢复
          </button>
        )}
      </section>

      <p className={styles.note}>
        开饭盒子 · 300 道家常菜 · 每天三道，够吃不纠结。
      </p>
    </div>
  )
}
