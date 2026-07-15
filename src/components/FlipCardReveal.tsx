import { useState } from 'react'
import { motion } from 'motion/react'
import type { Recipe } from '../types/recipe'
import styles from './FlipCardReveal.module.css'

type Props = {
  recipes: Recipe[]
  alreadyRevealed: boolean
  onComplete: () => void
  onSelect?: (recipe: Recipe) => void
}

export function FlipCardReveal({ recipes, alreadyRevealed, onComplete, onSelect }: Props) {
  const [flipped, setFlipped] = useState<boolean[]>(
    alreadyRevealed ? [true, true, true] : [false, false, false],
  )
  const [started, setStarted] = useState(alreadyRevealed)

  const flipAll = async () => {
    if (started) return
    setStarted(true)
    for (let i = 0; i < 3; i++) {
      await new Promise((r) => setTimeout(r, 380))
      setFlipped((prev) => {
        const next = [...prev]
        next[i] = true
        return next
      })
    }
    onComplete()
  }

  return (
    <div className={styles.wrap}>
      <div className={styles.row}>
        {recipes.map((recipe, i) => (
          <button
            key={recipe.id}
            type="button"
            className={styles.card}
            onClick={() => flipped[i] && onSelect?.(recipe)}
            aria-label={flipped[i] ? `查看${recipe.name}做法` : `待揭晓菜牌 ${i + 1}`}
          >
            <motion.div
              className={styles.inner}
              animate={{ rotateY: flipped[i] ? 180 : 0 }}
              transition={{ duration: 0.55, ease: [0.22, 1, 0.36, 1] }}
              style={{ transformStyle: 'preserve-3d' }}
            >
              <div className={`${styles.face} ${styles.back}`}>吃</div>
              <div className={`${styles.face} ${styles.front} ${styles[recipe.rarity] ?? ''}`}>
                <span className={styles.emoji}>{recipe.emoji}</span>
                <span className={styles.name}>{recipe.name}</span>
              </div>
            </motion.div>
          </button>
        ))}
      </div>

      {!alreadyRevealed && !started && (
        <>
          <p className={styles.hint}>翻开三张牌，定今日菜单</p>
          <button type="button" className={styles.startBtn} onClick={flipAll}>
            开始翻牌
          </button>
        </>
      )}
      {started && !flipped.every(Boolean) && <p className={styles.hint}>翻牌中…</p>}
    </div>
  )
}
