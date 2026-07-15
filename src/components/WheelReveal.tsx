import { useState } from 'react'
import { motion, useAnimation } from 'motion/react'
import type { Recipe } from '../types/recipe'
import styles from './WheelReveal.module.css'

type Props = {
  recipes: Recipe[]
  alreadyRevealed: boolean
  onComplete: () => void
  onSelect?: (recipe: Recipe) => void
}

export function WheelReveal({ recipes, alreadyRevealed, onComplete, onSelect }: Props) {
  const n = recipes.length
  const controls = useAnimation()
  const [shown, setShown] = useState<Recipe[]>(alreadyRevealed ? recipes : [])
  const [spinning, setSpinning] = useState(false)
  const [round, setRound] = useState(alreadyRevealed ? n : 0)
  const slice = n > 0 ? 360 / n : 120

  const spin = async () => {
    if (spinning || shown.length >= n) return
    setSpinning(true)
    const nextIndex = shown.length
    const spins = 4 + nextIndex
    const extra = 30 + nextIndex * 45
    await controls.start({
      rotate: 360 * spins + extra,
      transition: { duration: 1.5, ease: [0.15, 0.85, 0.2, 1] },
    })
    const next = [...shown, recipes[nextIndex]]
    setShown(next)
    setRound(next.length)
    setSpinning(false)
    if (next.length === n) onComplete()
  }

  const startAll = async () => {
    if (spinning || alreadyRevealed) return
    for (let i = shown.length; i < n; i++) {
      setSpinning(true)
      const spins = 4 + i
      const extra = 30 + i * 45
      await controls.start({
        rotate: 360 * spins + extra + i * 360,
        transition: { duration: 1.3, ease: [0.15, 0.85, 0.2, 1] },
      })
      setShown((prev) => [...prev, recipes[i]])
      setRound(i + 1)
      setSpinning(false)
      await new Promise((r) => setTimeout(r, 220))
    }
    onComplete()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.stage}>
        <div className={styles.pointer} aria-hidden />
        <motion.div className={styles.wheel} animate={controls} initial={{ rotate: 0 }}>
          <div className={styles.labels}>
            {recipes.map((r, i) => (
              <span
                key={r.id}
                className={styles.label}
                style={{ transform: `rotate(${i * slice + 10}deg)` }}
              >
                {r.emoji} {r.name.slice(0, 4)}
              </span>
            ))}
          </div>
        </motion.div>
        <div className={styles.hub}>🥢</div>
      </div>

      {!alreadyRevealed && round < n && (
        <>
          <p className={styles.hint}>
            {spinning ? `第 ${round + 1} 道菜旋转中…` : `转盘定菜 · 还差 ${n - round} 道`}
          </p>
          <button
            type="button"
            className={styles.startBtn}
            disabled={spinning}
            onClick={round === 0 ? startAll : spin}
          >
            {round === 0 ? '开始转盘' : '再转一次'}
          </button>
        </>
      )}

      {shown.length > 0 && (
        <div className={styles.results}>
          {shown.map((r) => (
            <button
              key={r.id}
              type="button"
              className={styles.chip}
              onClick={() => onSelect?.(r)}
            >
              <span className={styles.chipEmoji}>{r.emoji}</span>
              <div>
                <div className={styles.chipName}>{r.name}</div>
                <div className={styles.chipMeta}>
                  {r.category} · {r.timeMinutes} 分钟
                </div>
              </div>
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
