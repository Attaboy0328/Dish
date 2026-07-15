import { useState } from 'react'
import type { GameApi } from '../hooks/useGameState'
import type { Recipe } from '../types/recipe'
import { BlindBoxReveal } from '../components/BlindBoxReveal'
import { FlipCardReveal } from '../components/FlipCardReveal'
import { WheelReveal } from '../components/WheelReveal'
import { RecipeCard } from '../components/RecipeCard'
import { RecipeDrawer } from '../components/RecipeDrawer'
import { TodayControls } from '../components/TodayControls'
import { CheckIcon } from '../components/Icons'
import styles from './Home.module.css'

type Props = { game: GameApi }

export function Home({ game }: Props) {
  const {
    state,
    todayRecipes,
    markRevealed,
    reroll,
    confirm,
    setRevealMode,
    setIncludeColdDishes,
    setIncludeSeafood,
    setDishCount,
  } = game
  const [selected, setSelected] = useState<Recipe | null>(null)
  const revealed = state.today?.revealed ?? false
  const confirmed = state.today?.confirmed ?? false
  const mode = state.revealMode
  const count = state.dishCount
  const canReroll = (state.today?.rerollsLeft ?? 0) > 0

  const Reveal =
    mode === 'flip' ? FlipCardReveal : mode === 'wheel' ? WheelReveal : BlindBoxReveal

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>{confirmed ? '今日菜单已确定' : '今日菜单'}</p>
          <h2 className={styles.headline}>
            {confirmed ? '安心开饭吧' : '今天吃啥交给运气'}
          </h2>
        </div>
        <span className={`${styles.status} ${confirmed ? styles.statusDone : ''}`}>
          {confirmed && <CheckIcon size={15} />}
          {confirmed ? '已打卡' : '待揭晓'}
        </span>
      </header>

      <TodayControls
        mode={mode}
        includeColdDishes={state.includeColdDishes}
        includeSeafood={state.includeSeafood}
        dishCount={count}
        disabled={confirmed}
        onModeChange={setRevealMode}
        onIncludeColdChange={setIncludeColdDishes}
        onIncludeSeafoodChange={setIncludeSeafood}
        onDishCountChange={setDishCount}
      />

      <section className={styles.stage}>
        {todayRecipes.length > 0 && (
          <Reveal
            key={`${state.today?.date}-${state.today?.rerollsLeft}-${mode}-${count}-${state.includeColdDishes}-${state.includeSeafood}`}
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
            确认菜单并打卡
          </button>
          {canReroll && (
            <button type="button" className={styles.secondary} onClick={reroll}>
              换一组菜单
            </button>
          )}
        </div>
      )}

      {confirmed && (
        <div className={styles.done}>
          <span className={styles.doneIcon}><CheckIcon size={18} /></span>
          <div>
            <strong>今日打卡完成</strong>
            <p>菜单已保存，明天见。</p>
          </div>
        </div>
      )}

      <RecipeDrawer recipe={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
