import { useEffect, useRef } from 'react'
import { motion, AnimatePresence, useReducedMotion } from 'motion/react'
import type { Recipe } from '../types/recipe'
import { CloseIcon } from './Icons'
import styles from './RecipeDrawer.module.css'

type Props = {
  recipe: Recipe | null
  onClose: () => void
}

export function RecipeDrawer({ recipe, onClose }: Props) {
  const panelRef = useRef<HTMLDivElement>(null)
  const closeRef = useRef<HTMLButtonElement>(null)
  const reduceMotion = useReducedMotion()

  useEffect(() => {
    if (!recipe) return
    const previousOverflow = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    closeRef.current?.focus()

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
      if (event.key !== 'Tab' || !panelRef.current) return

      const focusable = panelRef.current.querySelectorAll<HTMLElement>(
        'button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])',
      )
      if (!focusable.length) return
      const first = focusable[0]
      const last = focusable[focusable.length - 1]
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.body.style.overflow = previousOverflow
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [recipe, onClose])

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
            ref={panelRef}
            className={styles.panel}
            initial={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            animate={{ y: 0 }}
            exit={reduceMotion ? { opacity: 0 } : { y: '100%' }}
            transition={
              reduceMotion
                ? { duration: 0.12 }
                : { type: 'spring', stiffness: 360, damping: 36, mass: 0.9 }
            }
            drag={reduceMotion ? false : 'y'}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.35 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 110 || info.velocity.y > 650) onClose()
            }}
            onClick={(e) => e.stopPropagation()}
            role="dialog"
            aria-modal
            aria-labelledby="recipe-title"
            tabIndex={-1}
          >
            <div className={styles.handle} />
            <div className={styles.head}>
              <span className={styles.emoji}>{recipe.emoji}</span>
              <div>
                <h2 id="recipe-title" className={styles.title}>
                  {recipe.name}
                </h2>
                <p className={styles.sub}>
                  {recipe.category} · {recipe.protein} · {recipe.timeMinutes} 分钟 · 难度{' '}
                  {recipe.difficulty}
                </p>
              </div>
              <button
                ref={closeRef}
                type="button"
                className={styles.close}
                onClick={onClose}
                aria-label="关闭菜谱"
              >
                <CloseIcon size={18} />
              </button>
            </div>

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
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
