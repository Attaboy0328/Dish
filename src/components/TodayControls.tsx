import type { DishCount, RevealMode } from '../types/recipe'
import { CardsIcon, GiftIcon, WheelIcon } from './Icons'
import styles from './TodayControls.module.css'

type Props = {
  mode: RevealMode
  includeColdDishes: boolean
  includeSeafood: boolean
  dishCount: DishCount
  onModeChange: (mode: RevealMode) => void
  onIncludeColdChange: (value: boolean) => void
  onIncludeSeafoodChange: (value: boolean) => void
  onDishCountChange: (count: DishCount) => void
}

const modes = [
  { id: 'box' as const, label: '盲盒', icon: GiftIcon },
  { id: 'flip' as const, label: '翻牌', icon: CardsIcon },
  { id: 'wheel' as const, label: '转盘', icon: WheelIcon },
]

const counts: DishCount[] = [2, 3, 4, 5]

export function TodayControls({
  mode,
  includeColdDishes,
  includeSeafood,
  dishCount,
  onModeChange,
  onIncludeColdChange,
  onIncludeSeafoodChange,
  onDishCountChange,
}: Props) {
  return (
    <section className={styles.panel} aria-label="今日抽取偏好">
      <div className={styles.controlHeader}>
        <div>
          <h2>抽几道菜</h2>
          <p>今日份数，可随时调整</p>
        </div>
      </div>

      <div className={`${styles.segmented} ${styles.countSeg}`} role="group" aria-label="选择菜品数量">
        {counts.map((n) => (
          <button
            key={n}
            type="button"
            className={`${styles.segment} ${dishCount === n ? styles.selected : ''}`}
            aria-pressed={dishCount === n}
            onClick={() => onDishCountChange(n)}
          >
            {n} 道
          </button>
        ))}
      </div>

      <div className={styles.controlHeader}>
        <div>
          <h2>揭晓方式</h2>
          <p>选择今天的开饭仪式</p>
        </div>
      </div>

      <div className={styles.segmented} role="group" aria-label="选择揭晓方式">
        {modes.map(({ id, label, icon: Icon }) => (
          <button
            key={id}
            type="button"
            className={`${styles.segment} ${mode === id ? styles.selected : ''}`}
            aria-pressed={mode === id}
            onClick={() => onModeChange(id)}
          >
            <Icon size={18} />
            <span>{label}</span>
          </button>
        ))}
      </div>

      <div className={styles.toggles}>
        <label className={styles.avoid}>
          <span className={styles.avoidText}>
            <strong>包含凉菜</strong>
            <small>默认不抽凉菜</small>
          </span>
          <input
            type="checkbox"
            checked={includeColdDishes}
            onChange={(event) => onIncludeColdChange(event.target.checked)}
          />
          <span className={styles.switch} aria-hidden="true">
            <span />
          </span>
        </label>

        <label className={styles.avoid}>
          <span className={styles.avoidText}>
            <strong>包含海鲜</strong>
            <small>默认不抽海鲜</small>
          </span>
          <input
            type="checkbox"
            checked={includeSeafood}
            onChange={(event) => onIncludeSeafoodChange(event.target.checked)}
          />
          <span className={styles.switch} aria-hidden="true">
            <span />
          </span>
        </label>
      </div>
    </section>
  )
}
