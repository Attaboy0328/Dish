import { useCallback, useEffect, useMemo, useState } from 'react'
import recipesData from '../data/recipes.json'
import type { GameState, Recipe, RevealMode } from '../types/recipe'
import { buildPool, drawThree, getUnlockedIds } from '../lib/draw'
import { daysBetween, todayKey, yesterdayKey } from '../lib/rng'
import { defaultState, loadState, saveState } from '../lib/storage'

const recipes = recipesData as Recipe[]

export function useGameState() {
  const [state, setState] = useState<GameState>(() => loadState())

  const persist = useCallback((next: GameState) => {
    saveState(next)
    setState(next)
  }, [])

  /** Sync today slot when date changes */
  useEffect(() => {
    const today = todayKey()
    setState((prev) => {
      let next = { ...prev }

      // Move confirmed yesterday into yesterdayIds if rolling into new day
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

      // Check streak break (missed a day)
      if (next.lastCheckInDate && next.lastCheckInDate !== today) {
        const gap = daysBetween(next.lastCheckInDate, today)
        if (gap > 1) {
          next = { ...next, streak: 0 }
        }
      }

      // Ensure today draw exists
      if (!next.today) {
        const seed = `${today}#0`
        const unlocked = getUnlockedIds(recipes, next.streak)
        const allUnlocked = [...new Set([...unlocked, ...next.revealedUnlocks])]
        const yIds =
          next.avoidYesterday && next.yesterdayDate === yesterdayKey()
            ? next.yesterdayIds
            : next.avoidYesterday
              ? next.yesterdayIds
              : []
        const pool = buildPool(recipes, next.streak, allUnlocked, next.avoidYesterday, yIds)
        const picks = drawThree(pool.length >= 3 ? pool : recipes, seed)
        next = {
          ...next,
          today: {
            date: today,
            recipeIds: picks.map((p) => p.id),
            rerollsLeft: 1,
            confirmed: false,
            revealed: false,
          },
          revealedUnlocks: allUnlocked,
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

  const markRevealed = useCallback(() => {
    if (!state.today || state.today.revealed) return
    const next = {
      ...state,
      today: { ...state.today, revealed: true },
    }
    persist(next)
  }, [state, persist])

  const reroll = useCallback(() => {
    if (!state.today || state.today.rerollsLeft <= 0 || state.today.confirmed) return
    const today = todayKey()
    const attempt = 2 - state.today.rerollsLeft
    const seed = `${today}#${attempt}`
    const unlocked = [...new Set([...getUnlockedIds(recipes, state.streak), ...state.revealedUnlocks])]
    const yIds = state.avoidYesterday ? state.yesterdayIds : []
    const pool = buildPool(recipes, state.streak, unlocked, state.avoidYesterday, yIds)
    const picks = drawThree(pool.length >= 3 ? pool : recipes, seed)
    persist({
      ...state,
      today: {
        date: today,
        recipeIds: picks.map((p) => p.id),
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
    const newlyUnlocked = getUnlockedIds(recipes, streak)
    const revealedUnlocks = [...new Set([...state.revealedUnlocks, ...newlyUnlocked])]
    persist({
      ...state,
      streak,
      lastCheckInDate: today,
      revealedUnlocks,
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

  const reset = useCallback(() => {
    const fresh = defaultState()
    persist(fresh)
    // force redraw next tick
    const today = todayKey()
    const pool = buildPool(recipes, 0, [], true, [])
    const picks = drawThree(pool.length >= 3 ? pool : recipes, `${today}#0`)
    persist({
      ...fresh,
      today: {
        date: today,
        recipeIds: picks.map((p) => p.id),
        rerollsLeft: 1,
        confirmed: false,
        revealed: false,
      },
    })
  }, [persist])

  const isRecipeUnlocked = useCallback(
    (recipe: Recipe) => {
      if (recipe.unlockAtStreak === 0) return true
      if (state.streak >= recipe.unlockAtStreak) return true
      return state.revealedUnlocks.includes(recipe.id)
    },
    [state.streak, state.revealedUnlocks],
  )

  return {
    recipes,
    state,
    todayRecipes,
    markRevealed,
    reroll,
    confirm,
    setRevealMode,
    setAvoidYesterday,
    reset,
    isRecipeUnlocked,
  }
}

export type GameApi = ReturnType<typeof useGameState>
