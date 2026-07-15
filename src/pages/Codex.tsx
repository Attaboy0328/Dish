import { useMemo, useState } from 'react'
import type { GameApi } from '../hooks/useGameState'
import type { Category, Recipe } from '../types/recipe'
import { RecipeDrawer } from '../components/RecipeDrawer'
import styles from './Codex.module.css'

type Props = { game: GameApi }

const FILTERS: Array<'全部' | Category> = [
  '全部',
  '荤菜',
  '素菜',
  '汤羹',
  '主食',
  '凉菜',
]

export function Codex({ game }: Props) {
  const { recipes } = game
  const [filter, setFilter] = useState<(typeof FILTERS)[number]>('全部')
  const [selected, setSelected] = useState<Recipe | null>(null)

  const list = useMemo(() => {
    return recipes.filter((r) => {
      if (filter === '全部') return true
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
        <strong>{recipes.length}<span> 道</span></strong>
      </header>

      <section className={styles.progress} aria-label={`共 ${recipes.length} 道菜`}>
        <p>
          图鉴收录全部家常菜。凉菜默认不进今日抽奖，可在「今日」勾选「包含凉菜」。当前连吃{' '}
          {game.state.streak} 天。
        </p>
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
        {list.map((r) => (
          <button
            key={r.id}
            type="button"
            className={styles.cell}
            onClick={() => setSelected(r)}
            aria-label={`查看${r.name}`}
          >
            <span className={styles.cellEmoji}>{r.emoji}</span>
            <span className={styles.cellName}>{r.name}</span>
            <span className={styles.cellCat}>{r.category}</span>
          </button>
        ))}
      </div>

      <RecipeDrawer recipe={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
