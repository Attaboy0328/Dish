import { useState } from 'react'
import { AnimatePresence, motion } from 'motion/react'
import type { Recipe } from '../types/recipe'
import styles from './BlindBoxReveal.module.css'

type Props = {
  recipes: Recipe[]
  alreadyRevealed: boolean
  onComplete: () => void
  onSelect?: (recipe: Recipe) => void
}

export function BlindBoxReveal({ recipes, alreadyRevealed, onComplete, onSelect }: Props) {
  const n = recipes.length
  const [opened, setOpened] = useState<boolean[]>(
    alreadyRevealed ? Array(n).fill(true) : Array(n).fill(false),
  )
  const [started, setStarted] = useState(alreadyRevealed)

  const openAll = async () => {
    if (started) return
    setStarted(true)
    for (let i = 0; i < n; i++) {
      await new Promise((r) => setTimeout(r, 380))
      setOpened((prev) => {
        const next = [...prev]
        next[i] = true
        return next
      })
    }
    onComplete()
  }

  return (
    <div className={styles.wrap}>
      <div className={`${styles.boxes} ${n > 3 ? styles.boxesWrap : ''}`}>
        {recipes.map((recipe, i) => (
          <button
            key={recipe.id}
            type="button"
            className={styles.box}
            onClick={() => opened[i] && onSelect?.(recipe)}
            aria-label={opened[i] ? recipe.name : `盲盒 ${i + 1}`}
          >
            <motion.div
              className={styles.boxInner}
              animate={
                opened[i]
                  ? { rotateY: 0, scale: 1 }
                  : started
                    ? { y: [0, -12, 0], rotateZ: [0, -4, 4, 0] }
                    : { y: 0 }
              }
              transition={{ duration: 0.45 }}
            >
              <AnimatePresence mode="wait">
                {!opened[i] ? (
                  <motion.div
                    key="lid"
                    className={styles.lid}
                    exit={{ y: -40, opacity: 0, rotate: -8 }}
                    transition={{ duration: 0.35 }}
                  >
                    <span>🎁</span>
                    <span className={styles.seal}>开饭</span>
                  </motion.div>
                ) : (
                  <motion.div
                    key="content"
                    className={styles.content}
                    initial={{ scale: 0.5, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ type: 'spring', stiffness: 280, damping: 18 }}
                  >
                    <span className={styles.contentEmoji}>{recipe.emoji}</span>
                    <span className={styles.contentName}>{recipe.name}</span>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </button>
        ))}
      </div>

      {!alreadyRevealed && !started && (
        <>
          <p className={styles.hint}>点下按钮，开 {n} 只今日盲盒</p>
          <button type="button" className={styles.startBtn} onClick={openAll}>
            开盒定菜
          </button>
        </>
      )}
      {started && !opened.every(Boolean) && <p className={styles.hint}>盒子打开中…</p>}
      {opened.every(Boolean) && <p className={styles.hint}>点菜名可看做法</p>}
    </div>
  )
}
