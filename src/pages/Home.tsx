import { useMemo, useState } from 'react'
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

const MILESTONES = [3, 7, 14, 30]

export function Home({ game }: Props) {
  const {
    state,
    todayRecipes,
    markRevealed,
    reroll,
    confirm,
    isRecipeUnlocked,
    setRevealMode,
    setAvoidYesterday,
  } = game
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
      <header className={styles.hero}>
        <div>
          <p className={styles.eyebrow}>{confirmed ? '今日菜单已确定' : '今日菜单'}</p>
          <h2>{confirmed ? '安心开饭吧' : '三道菜，交给一点运气'}</h2>
        </div>
        <span className={`${styles.status} ${confirmed ? styles.statusDone : ''}`}>
          {confirmed && <CheckIcon size={15} />}
          {confirmed ? '已打卡' : '待揭晓'}
        </span>
      </header>

      <TodayControls
        mode={mode}
        avoidYesterday={state.avoidYesterday}
        disabled={confirmed}
        onModeChange={setRevealMode}
        onAvoidChange={setAvoidYesterday}
      />

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
            确认菜单并打卡
          </button>
          <button
            type="button"
            className={styles.secondary}
            onClick={reroll}
            disabled={(state.today?.rerollsLeft ?? 0) <= 0}
          >
            {state.today?.rerollsLeft ? '换一组菜单' : '今日已换过一次'}
          </button>
        </div>
      )}

      {confirmed && (
        <div className={styles.done}>
          <span className={styles.doneIcon}><CheckIcon size={18} /></span>
          <div>
            <strong>今日打卡完成</strong>
            <p>菜单已保存，明天会避开这些菜。</p>
          </div>
        </div>
      )}
      {unlockMsg && <p className={styles.unlockToast}>{unlockMsg}</p>}

      <RecipeDrawer
        recipe={selected}
        unlocked={selected ? isRecipeUnlocked(selected) : true}
        onClose={() => setSelected(null)}
      />
    </div>
  )
}
