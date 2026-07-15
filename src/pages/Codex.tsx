import { useMemo, useState } from 'react'
import type { GameApi } from '../hooks/useGameState'
import type { Category, Recipe } from '../types/recipe'
import { RecipeDrawer } from '../components/RecipeDrawer'
import styles from './Codex.module.css'

type Props = { game: GameApi }

const FILTERS: Array<'全部' | Category | '稀有'> = [
  '全部',
  '荤菜',
  '素菜',
  '汤羹',
  '主食',
  '凉菜',
  '稀有',
]

export function Codex({ game }: Props) {
  const { recipes, isRecipeUnlocked } = game
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('全部')
  const [selected, setSelected] = useState<Recipe | null>(null)

  const unlockedCount = useMemo(
    () => recipes.filter((r) => isRecipeUnlocked(r)).length,
    [recipes, isRecipeUnlocked],
  )

  const list = useMemo(() => {
    return recipes.filter((r) => {
      if (filter === '全部') return true
      if (filter === '稀有') return r.rarity !== 'common'
      return r.category === filter
    })
  }, [recipes, filter])

  return (
    <div className={styles.page}>
      <p className={styles.intro}>
        三百道家常菜图鉴。稀有与传说菜需连吃打卡解锁后才进奖池。
      </p>
      <div className={styles.stats}>
        <span className={styles.stat}>
          已解锁 {unlockedCount} / {recipes.length}
        </span>
        <span className={styles.stat}>连吃 {game.state.streak} 天</span>
      </div>

      <div className={styles.filters}>
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.filter} ${filter === f ? styles.on : ''}`}
            onClick={() => setFilter(f)}
          >
            {f}
          </button>
        ))}
      </div>

      <div className={styles.grid}>
        {list.map((r) => {
          const unlocked = isRecipeUnlocked(r)
          return (
            <button
              key={r.id}
              type="button"
              className={`${styles.cell} ${unlocked ? '' : styles.locked}`}
              onClick={() => setSelected(r)}
            >
              <span className={`${styles.rarityDot} ${styles[r.rarity] ?? ''}`} />
              {!unlocked && (
                <span className={styles.lockTag}>{r.unlockAtStreak}天</span>
              )}
              <span className={styles.cellEmoji}>{unlocked ? r.emoji : '🔒'}</span>
              <span className={styles.cellName}>{unlocked ? r.name : '？？？'}</span>
            </button>
          )
        })}
      </div>

      <RecipeDrawer
        recipe={selected}
        unlocked={selected ? isRecipeUnlocked(selected) : true}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
