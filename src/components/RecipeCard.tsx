import type { Recipe } from '../types/recipe'
import styles from './RecipeCard.module.css'

const rarityLabel = {
  common: '家常',
  rare: '稀有',
  legendary: '传说',
} as const

type Props = {
  recipe: Recipe
  onClick?: () => void
}

export function RecipeCard({ recipe, onClick }: Props) {
  const accent =
    recipe.rarity === 'legendary'
      ? 'var(--legendary)'
      : recipe.rarity === 'rare'
        ? 'var(--rare)'
        : 'var(--chili)'

  return (
    <button
      type="button"
      className={styles.card}
      style={{ ['--accent' as string]: accent }}
      onClick={onClick}
    >
      <div className={styles.top}>
        <span className={styles.emoji} aria-hidden>
          {recipe.emoji}
        </span>
        <div className={styles.meta}>
          <h3 className={styles.name}>{recipe.name}</h3>
          <p className={styles.sub}>
            {recipe.category} · {recipe.timeMinutes} 分钟 · 难度 {recipe.difficulty}
          </p>
        </div>
        <span className={`${styles.badge} ${styles[recipe.rarity]}`}>
          {rarityLabel[recipe.rarity]}
        </span>
      </div>
      <div className={styles.tags}>
        {recipe.tags.slice(0, 3).map((t) => (
          <span key={t} className={styles.tag}>
            {t}
          </span>
        ))}
      </div>
    </button>
  )
}
