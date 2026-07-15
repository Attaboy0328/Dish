import { motion, AnimatePresence } from 'motion/react'
import type { Recipe } from '../types/recipe'
import styles from './RecipeDrawer.module.css'

type Props = {
  recipe: Recipe | null
  unlocked: boolean
  onClose: () => void
}

export function RecipeDrawer({ recipe, unlocked, onClose }: Props) {
  return (
    <AnimatePresence>
      {recipe && (
        <motion.div
          className={styles.overlay}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={styles.panel}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', stiffness: 320, damping: 32 }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
            aria-label={recipe.name}
          >
            <div className={styles.handle} />
            <div className={styles.head}>
              <span className={styles.emoji}>{unlocked ? recipe.emoji : '❔'}</span>
              <div>
                <h2 className={styles.title}>{unlocked ? recipe.name : '未解锁菜谱'}</h2>
                <p className={styles.sub}>
                  {unlocked
                    ? `${recipe.category} · ${recipe.protein} · ${recipe.timeMinutes} 分钟 · 难度 ${recipe.difficulty}`
                    : `连吃 ${recipe.unlockAtStreak} 天解锁`}
                </p>
              </div>
              <button type="button" className={styles.close} onClick={onClose} aria-label="关闭">
                ✕
              </button>
            </div>

            {!unlocked ? (
              <p className={styles.lock}>坚持打卡连吃，稀有菜会进入今日奖池。</p>
            ) : (
              <>
                <section className={styles.section}>
                  <h4>食材</h4>
                  <ul className={styles.ing}>
                    {recipe.ingredients.map((ing) => (
                      <li key={ing}>{ing}</li>
                    ))}
                  </ul>
                </section>
                <section className={styles.section}>
                  <h4>做法</h4>
                  <ol className={styles.steps}>
                    {recipe.steps.map((step, i) => (
                      <li key={i}>{step}</li>
                    ))}
                  </ol>
                </section>
              </>
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
