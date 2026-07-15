import { useCallback, useEffect, useMemo, useState } from 'react'
import recipesData from '../data/recipes.json'
import type { DishCount, GameState, Recipe, RevealMode } from '../types/recipe'
import { buildPool, drawRecipes } from '../lib/draw'
import { todayKey, yesterdayKey } from '../lib/rng'
import { defaultState, loadState, normalizeDishCount, saveState } from '../lib/storage'

const recipes = recipesData as Recipe[]

function yesterdayIdsFor(state: GameState): string[] {
  if (state.yesterdayDate === yesterdayKey()) return state.yesterdayIds
  return state.yesterdayIds
}

function fallbackPool(state: GameState) {
  return recipes.filter((r) => {
    if (!state.includeColdDishes && r.category === '凉菜') return false
    if (!state.includeSeafood && r.protein === '海鲜') return false
    return true
  })
}

function drawForState(state: GameState, seed: string) {
  const pool = buildPool(recipes, {
    yesterdayIds: yesterdayIdsFor(state),
    includeColdDishes: state.includeColdDishes,
    includeSeafood: state.includeSeafood,
  })
  const count = normalizeDishCount(state.dishCount)
  const source = pool.length >= count ? pool : fallbackPool(state)
  return drawRecipes(source.length >= count ? source : recipes, seed, count)
}

function todaySlot(
  state: GameState,
  recipeIds: string[],
  drawAttempt: number,
  revealed = false,
) {
  return {
    date: todayKey(),
    recipeIds,
    dishCount: normalizeDishCount(state.dishCount),
    includeColdDishes: state.includeColdDishes,
    includeSeafood: state.includeSeafood,
    drawAttempt,
    revealed,
  }
}

function seedFor(state: GameState, attempt: number) {
  const today = todayKey()
  return `${today}#opt${state.dishCount}${state.includeColdDishes ? 'c' : 'n'}${state.includeSeafood ? 's' : 'x'}#${attempt}`
}

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadState())

  const persist = useCallback((next: GameState) => {
    saveState(next)
    setState(next)
  }, [])

  useEffect(() => {
    const today = todayKey()
    setState((prev) => {
      let next = { ...prev }

      if (prev.today && prev.today.date !== today) {
        next = {
          ...next,
          yesterdayIds: prev.today.recipeIds,
          yesterdayDate: prev.today.date,
          today: null,
        }
      }

      if (!next.today) {
        const picks = drawForState(next, seedFor(next, 0))
        next = {
          ...next,
          today: todaySlot(next, picks.map((p) => p.id), 0),
        }
      }

      saveState(next)
      return next
    })
  }, [])

  const todayRecipes = useMemo(() => {
    if (!state.today) return [] as Recipe[]
    return state.today.recipeIds
      .map((id) => recipes.find((r) => r.id === id))
      .filter(Boolean) as Recipe[]
  }, [state.today])

  const redrawToday = useCallback(
    (base: GameState) => {
      const attempt = (base.today?.drawAttempt ?? 0) + 1
      const picks = drawForState(base, seedFor(base, attempt))
      const next = {
        ...base,
        today: todaySlot(base, picks.map((p) => p.id), attempt, false),
      }
      persist(next)
      return next
    },
    [persist],
  )

  const markRevealed = useCallback(() => {
    if (!state.today || state.today.revealed) return
    persist({
      ...state,
      today: { ...state.today, revealed: true },
    })
  }, [state, persist])

  const reroll = useCallback(() => {
    if (!state.today) return
    redrawToday(state)
  }, [state, redrawToday])

  const setRevealMode = useCallback(
    (mode: RevealMode) => {
      persist({ ...state, revealMode: mode })
    },
    [state, persist],
  )

  const setIncludeColdDishes = useCallback(
    (value: boolean) => {
      redrawToday({ ...state, includeColdDishes: value })
    },
    [state, redrawToday],
  )

  const setIncludeSeafood = useCallback(
    (value: boolean) => {
      redrawToday({ ...state, includeSeafood: value })
    },
    [state, redrawToday],
  )

  const setDishCount = useCallback(
    (count: DishCount) => {
      redrawToday({ ...state, dishCount: count })
    },
    [state, redrawToday],
  )

  const reset = useCallback(() => {
    const fresh = defaultState()
    const picks = drawForState(fresh, seedFor(fresh, 0))
    persist({
      ...fresh,
      today: todaySlot(fresh, picks.map((p) => p.id), 0),
    })
  }, [persist])

  return {
    recipes,
    state,
    todayRecipes,
    markRevealed,
    reroll,
    setRevealMode,
    setIncludeColdDishes,
    setIncludeSeafood,
    setDishCount,
    reset,
  }
}

export type GameApi = ReturnType<typeof useGameState>
