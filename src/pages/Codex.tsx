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
      <header className={styles.header}>
        <div>
          <p>我的图鉴</p>
          <h2>家常菜收藏</h2>
        </div>
        <strong>{unlockedCount}<span> / {recipes.length}</span></strong>
      </header>

      <section className={styles.progress} aria-label={`已解锁 ${unlockedCount} 道菜`}>
        <div className={styles.progressTrack}>
          <span style={{ width: `${(unlockedCount / recipes.length) * 100}%` }} />
        </div>
        <p>连续打卡可解锁更多稀有菜，目前连吃 {game.state.streak} 天。</p>
      </section>

      <div className={styles.filters} role="group" aria-label="菜谱分类">
        {FILTERS.map((f) => (
          <button
            key={f}
            type="button"
            className={`${styles.filter} ${filter === f ? styles.on : ''}`}
            onClick={() => setFilter(f)}
            aria-pressed={filter === f}
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
              aria-label={unlocked ? `查看${r.name}` : `未解锁，连吃${r.unlockAtStreak}天解锁`}
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
