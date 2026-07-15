import type { DishCount, GameState, RevealMode } from '../types/recipe'

export const STORAGE_KEY = 'kai-fan-box:v3'

export const defaultState = (): GameState => ({
  streak: 0,
  lastCheckInDate: null,
  revealMode: 'box',
  includeColdDishes: false,
  includeSeafood: false,
  dishCount: 3,
  yesterdayIds: [],
  yesterdayDate: null,
  today: null,
})

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<GameState>
    return {
      ...defaultState(),
      ...parsed,
      dishCount: normalizeDishCount(parsed.dishCount),
      includeColdDishes: Boolean(parsed.includeColdDishes),
      includeSeafood: Boolean(parsed.includeSeafood),
    }
  } catch {
    return defaultState()
  }
}

export function normalizeDishCount(value: unknown): DishCount {
  const n = Number(value)
  if (n === 2 || n === 3 || n === 4 || n === 5) return n
  return 3
}

export function saveState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function resetState(): GameState {
  const s = defaultState()
  saveState(s)
  return s
}

export function setRevealMode(state: GameState, mode: RevealMode): GameState {
  const next = { ...state, revealMode: mode }
  saveState(next)
  return next
}
