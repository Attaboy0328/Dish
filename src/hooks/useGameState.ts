import { useCallback, useEffect, useMemo, useState } from 'react'
import recipesData from '../data/recipes.json'
import type { DishCount, GameState, Recipe, RevealMode } from '../types/recipe'
import { buildPool, drawRecipes } from '../lib/draw'
import { daysBetween, todayKey, yesterdayKey } from '../lib/rng'
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

function todaySlot(state: GameState, recipeIds: string[], drawAttempt: number) {
  return {
    date: todayKey(),
    recipeIds,
    dishCount: normalizeDishCount(state.dishCount),
    includeColdDishes: state.includeColdDishes,
    includeSeafood: state.includeSeafood,
    drawAttempt,
    confirmed: false,
    revealed: false,
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
        if (prev.today.confirmed) {
          next = {
            ...next,
            yesterdayIds: prev.today.recipeIds,
            yesterdayDate: prev.today.date,
          }
        }
        next.today = null
      }

      if (next.lastCheckInDate && next.lastCheckInDate !== today) {
        const gap = daysBetween(next.lastCheckInDate, today)
        if (gap > 1) {
          next = { ...next, streak: 0 }
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
      if (base.today?.confirmed) return base
      const attempt = (base.today?.drawAttempt ?? 0) + 1
      const picks = drawForState(base, seedFor(base, attempt))
      const next = {
        ...base,
        today: todaySlot(base, picks.map((p) => p.id), attempt),
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
    if (!state.today || state.today.confirmed) return
    redrawToday(state)
  }, [state, redrawToday])

  const confirm = useCallback(() => {
    if (!state.today || state.today.confirmed || !state.today.revealed) return
    const today = todayKey()
    let streak = state.streak
    if (state.lastCheckInDate === yesterdayKey()) {
      streak = state.streak + 1
    } else if (state.lastCheckInDate === today) {
      streak = state.streak
    } else {
      streak = 1
    }
    persist({
      ...state,
      streak,
      lastCheckInDate: today,
      yesterdayIds: state.today.recipeIds,
      yesterdayDate: today,
      today: { ...state.today, confirmed: true },
    })
  }, [state, persist])

  const setRevealMode = useCallback(
    (mode: RevealMode) => {
      persist({ ...state, revealMode: mode })
    },
    [state, persist],
  )

  const setIncludeColdDishes = useCallback(
    (value: boolean) => {
      if (state.today?.confirmed) {
        persist({ ...state, includeColdDishes: value })
        return
      }
      redrawToday({ ...state, includeColdDishes: value })
    },
    [state, persist, redrawToday],
  )

  const setIncludeSeafood = useCallback(
    (value: boolean) => {
      if (state.today?.confirmed) {
        persist({ ...state, includeSeafood: value })
        return
      }
      redrawToday({ ...state, includeSeafood: value })
    },
    [state, persist, redrawToday],
  )

  const setDishCount = useCallback(
    (count: DishCount) => {
      if (state.today?.confirmed) {
        persist({ ...state, dishCount: count })
        return
      }
      redrawToday({ ...state, dishCount: count })
    },
    [state, persist, redrawToday],
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
    confirm,
    setRevealMode,
    setIncludeColdDishes,
    setIncludeSeafood,
    setDishCount,
    reset,
  }
}

export type GameApi = ReturnType<typeof useGameState>
