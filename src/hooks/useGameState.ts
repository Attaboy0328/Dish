import { useCallback, useEffect, useMemo, useState } from 'react'
import recipesData from '../data/recipes.json'
import type { DishCount, GameState, Recipe, RevealMode } from '../types/recipe'
import { buildPool, drawRecipes } from '../lib/draw'
import { daysBetween, todayKey, yesterdayKey } from '../lib/rng'
import { defaultState, loadState, normalizeDishCount, saveState } from '../lib/storage'

const recipes = recipesData as Recipe[]

function yesterdayIdsFor(state: GameState): string[] {
  if (!state.avoidYesterday) return []
  if (state.yesterdayDate === yesterdayKey()) return state.yesterdayIds
  return state.yesterdayIds
}

function drawForState(state: GameState, seed: string) {
  const yIds = yesterdayIdsFor(state)
  const pool = buildPool(recipes, state.avoidYesterday, yIds, state.includeColdDishes)
  const count = normalizeDishCount(state.dishCount)
  const source = pool.length >= count ? pool : buildPool(recipes, false, [], state.includeColdDishes)
  return drawRecipes(source.length >= count ? source : recipes.filter((r) => state.includeColdDishes || r.category !== '凉菜'), seed, count)
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
        const picks = drawForState(next, `${today}#0`)
        next = {
          ...next,
          today: {
            date: today,
            recipeIds: picks.map((p) => p.id),
            dishCount: normalizeDishCount(next.dishCount),
            includeColdDishes: next.includeColdDishes,
            rerollsLeft: 1,
            confirmed: false,
            revealed: false,
          },
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
    (base: GameState, keepRerolls?: number) => {
      if (base.today?.confirmed) return base
      const today = todayKey()
      const rerollsLeft = keepRerolls ?? base.today?.rerollsLeft ?? 1
      const attempt = Math.max(0, 1 - rerollsLeft)
      const picks = drawForState(base, `${today}#opt${base.dishCount}${base.includeColdDishes ? 'c' : 'n'}#${attempt}`)
      const next = {
        ...base,
        today: {
          date: today,
          recipeIds: picks.map((p) => p.id),
          dishCount: normalizeDishCount(base.dishCount),
          includeColdDishes: base.includeColdDishes,
          rerollsLeft,
          confirmed: false,
          revealed: false,
        },
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
    if (!state.today || state.today.rerollsLeft <= 0 || state.today.confirmed) return
    const today = todayKey()
    const attempt = 2 - state.today.rerollsLeft
    const picks = drawForState(state, `${today}#${attempt}`)
    persist({
      ...state,
      today: {
        date: today,
        recipeIds: picks.map((p) => p.id),
        dishCount: normalizeDishCount(state.dishCount),
        includeColdDishes: state.includeColdDishes,
        rerollsLeft: state.today.rerollsLeft - 1,
        confirmed: false,
        revealed: false,
      },
    })
  }, [state, persist])

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

  const setAvoidYesterday = useCallback(
    (value: boolean) => {
      persist({ ...state, avoidYesterday: value })
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
    const today = todayKey()
    const picks = drawForState(fresh, `${today}#0`)
    persist({
      ...fresh,
      today: {
        date: today,
        recipeIds: picks.map((p) => p.id),
        dishCount: 3,
        includeColdDishes: false,
        rerollsLeft: 1,
        confirmed: false,
        revealed: false,
      },
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
    setAvoidYesterday,
    setIncludeColdDishes,
    setDishCount,
    reset,
  }
}

export type GameApi = ReturnType<typeof useGameState>
