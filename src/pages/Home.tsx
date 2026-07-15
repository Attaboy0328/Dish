import { useState } from 'react'
import type { GameApi } from '../hooks/useGameState'
import type { Recipe } from '../types/recipe'
import { BlindBoxReveal } from '../components/BlindBoxReveal'
import { FlipCardReveal } from '../components/FlipCardReveal'
import { WheelReveal } from '../components/WheelReveal'
import { RecipeDrawer } from '../components/RecipeDrawer'
import { TodayControls } from '../components/TodayControls'
import styles from './Home.module.css'

type Props = { game: GameApi }

export function Home({ game }: Props) {
  const {
    state,
    todayRecipes,
    markRevealed,
    reroll,
    setRevealMode,
    setIncludeColdDishes,
    setIncludeSeafood,
    setDishCount,
  } = game
  const [selected, setSelected] = useState<Recipe | null>(null)
  const revealed = state.today?.revealed ?? false
  const mode = state.revealMode
  const count = state.dishCount

  const Reveal =
    mode === 'flip' ? FlipCardReveal : mode === 'wheel' ? WheelReveal : BlindBoxReveal

  return (
    <div className={styles.page}>
      <header className={styles.hero}>
        <div className={styles.heroCopy}>
          <p className={styles.eyebrow}>今日菜单</p>
          <h2 className={styles.headline}>今天吃啥交给运气</h2>
        </div>
        <span className={`${styles.status} ${revealed ? styles.statusDone : ''}`}>
          {revealed ? '已揭晓' : '待揭晓'}
        </span>
      </header>

      <TodayControls
        mode={mode}
        includeColdDishes={state.includeColdDishes}
        includeSeafood={state.includeSeafood}
        dishCount={count}
        onModeChange={setRevealMode}
        onIncludeColdChange={setIncludeColdDishes}
        onIncludeSeafoodChange={setIncludeSeafood}
        onDishCountChange={setDishCount}
      />

      <section className={styles.stage}>
        {todayRecipes.length > 0 && (
          <Reveal
            key={`${state.today?.date}-${state.today?.drawAttempt}-${mode}-${count}-${state.includeColdDishes}-${state.includeSeafood}`}
            recipes={todayRecipes}
            alreadyRevealed={revealed}
            onComplete={markRevealed}
            onSelect={setSelected}
          />
        )}
      </section>

      {revealed && (
        <div className={styles.actions}>
          <button type="button" className={styles.secondary} onClick={reroll}>
            换一组菜单
          </button>
        </div>
      )}

      <RecipeDrawer recipe={selected} onClose={() => setSelected(null)} />
    </div>
  )
}
