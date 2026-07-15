import type { RevealMode } from '../types/recipe'
import { CardsIcon, GiftIcon, WheelIcon } from './Icons'
import styles from './TodayControls.module.css'

type Props = {
  mode: RevealMode
  avoidYesterday: boolean
  disabled?: boolean
  onModeChange: (mode: RevealMode) => void
  onAvoidChange: (value: boolean) => void
}

const modes = [
  { id: 'box' as const, label: '盲盒', icon: GiftIcon },
  { id: 'flip' as const, label: '翻牌', icon: CardsIcon },
  { id: 'wheel' as const, label: '转盘', icon: WheelIcon },
]

export function TodayControls({
  mode,
  avoidYesterday,
  disabled = false,
  onModeChange,
  onAvoidChange,
}: Props) {
  return (
    <section className={styles.panel} aria-label="今日抽取偏好">
      <div className={styles.controlHeader}>
        <div>
          <h2>揭晓方式</h2>
          <p>{disabled ? '今天已定菜，明天继续生效' : '选择今天的开饭仪式'}</p>
        </div>
        <label className={styles.avoid}>
          <span className={styles.avoidText}>
            <strong>避开昨日</strong>
            <small>下次抽取生效</small>
          </span>
          <input
            type="checkbox"
            checked={avoidYesterday}
            disabled={disabled}
            onChange={(event) => onAvoidChange(event.target.checked)}
          />
          <span className={styles.switch} aria-hidden="true">
            <span />
          </span>
        </label>
      </div>

      <div className={styles.segmented} role="group" aria-label="选择揭晓方式">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.segment} ${mode === id ? styles.selected : ''}`}
            aria-pressed={mode === id}
            disabled={disabled}
            onClick={() => onModeChange(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>
    </section>
  )
}
