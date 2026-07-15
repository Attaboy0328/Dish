import type { Recipe } from '../types/recipe'
import { ChevronIcon } from './Icons'
import styles from './RecipeCard.module.css'

type Props = {
  recipe: Recipe
  onClick?: () => void
}

export function RecipeCard({ recipe, onClick }: Props) {
  return (
    <button
      type="button"
      className={styles.card}
      onClick={onClick}
      aria-label={`查看${recipe.name}做法`}
    >
      <span className={styles.emoji} aria-hidden>
        {recipe.emoji}
      </span>
      <div className={styles.meta}>
        <h3 className={styles.name}>{recipe.name}</h3>
        <p className={styles.sub}>
          {recipe.category} · {recipe.timeMinutes} 分钟 · 难度 {recipe.difficulty}
        </p>
      </div>
      <ChevronIcon className={styles.chevron} size={18} />
    </button>
  )
}
