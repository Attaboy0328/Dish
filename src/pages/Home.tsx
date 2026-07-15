import { useMemo, useState } from 'react'
import type { GameApi } from '../hooks/useGameState'
import type { Recipe } from '../types/recipe'
import { BlindBoxReveal } from '../components/BlindBoxReveal'
import { FlipCardReveal } from '../components/FlipCardReveal'
import { WheelReveal } from '../components/WheelReveal'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeDrawer } from '../components/RecipeDrawer'
import styles from './Home.module.css'

type Props = { game: GameApi }

const modeLabel = { box: '盲盒', flip: '翻牌', wheel: '转盘' } as const
const MILESTONES = [3, 7, 14, 30]

export function Home({ game }: Props) {
  const { state, todayRecipes, markRevealed, reroll, confirm, isRecipeUnlocked } = game
  const [selected, setSelected] = useState<Recipe | null>(null)
  const revealed = state.today?.revealed ?? false
  const confirmed = state.today?.confirmed ?? false
  const mode = state.revealMode

  const unlockMsg = useMemo(() => {
    if (!confirmed) return null
    if (MILESTONES.includes(state.streak)) {
      return `连吃 ${state.streak} 天！一批稀有菜已解锁，去图鉴看看～`
    }
    return null
  }, [confirmed, state.streak])

  const Reveal =
    mode === 'flip' ? FlipCardReveal : mode === 'wheel' ? WheelReveal : BlindBoxReveal

  return (
    <div className={styles.page}>
      <div className={styles.status}>
        <span className={`${styles.pill} ${confirmed ? styles.ok : ''}`}>
          {confirmed ? '✓ 今日已定菜打卡' : '今日还未确认菜单'}
        </span>
        <span className={styles.mode}>揭晓方式：{modeLabel[mode]}</span>
      </div>

      <section className={styles.stage}>
        {todayRecipes.length === 3 && (
          <Reveal
            key={`${state.today?.date}-${state.today?.rerollsLeft}-${mode}`}
            recipes={todayRecipes}
            alreadyRevealed={revealed}
            onComplete={markRevealed}
            onSelect={setSelected}
          />
        )}
      </section>

      {revealed && (
        <div className={styles.list}>
          {todayRecipes.map((r) => (
            <RecipeCard key={r.id} recipe={r} onClick={() => setSelected(r)} />
          ))}
        </div>
      )}

      {revealed && !confirmed && (
        <div className={styles.actions}>
          <button type="button" className={styles.primary} onClick={confirm}>
            确认这三道 · 打卡
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={reroll}
            disabled={(state.today?.rerollsLeft ?? 0) <= 0}
          >
            再抽一次（剩 {state.today?.rerollsLeft ?? 0}）
          </button>
        </div>
      )}

      {confirmed && <p className={styles.done}>今天就做这三道，明天见～</p>}
      {unlockMsg && <p className={styles.unlockToast}>{unlockMsg}</p>}

      <RecipeDrawer
        recipe={selected}
        unlocked={selected ? isRecipeUnlocked(selected) : true}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
