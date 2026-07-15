import type { DishCount, GameState, RevealMode } from '../types/recipe'

export const STORAGE_KEY = 'kai-fan-box:v4'

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

type LegacyToday = NonNullable<GameState['today']> & { rerollsLeft?: number }

function normalizeToday(today: unknown): GameState['today'] {
  if (!today || typeof today !== 'object') return null
  const t = today as LegacyToday
  if (!t.date || !Array.isArray(t.recipeIds)) return null
  const drawAttempt =
    typeof t.drawAttempt === 'number'
      ? t.drawAttempt
      : typeof t.rerollsLeft === 'number'
        ? Math.max(0, 1 - t.rerollsLeft)
        : 0
  return {
    date: t.date,
    recipeIds: t.recipeIds,
    dishCount: normalizeDishCount(t.dishCount),
    includeColdDishes: Boolean(t.includeColdDishes),
    includeSeafood: Boolean(t.includeSeafood),
    drawAttempt,
    confirmed: Boolean(t.confirmed),
    revealed: Boolean(t.revealed),
  }
}

export function loadState(): GameState {
  try {
    const raw =
      localStorage.getItem(STORAGE_KEY) ??
      localStorage.getItem('kai-fan-box:v3') ??
      localStorage.getItem('kai-fan-box:v2')
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as Partial<GameState>
    const next = {
      ...defaultState(),
      ...parsed,
      dishCount: normalizeDishCount(parsed.dishCount),
      includeColdDishes: Boolean(parsed.includeColdDishes),
      includeSeafood: Boolean(parsed.includeSeafood),
      today: normalizeToday(parsed.today),
    }
    saveState(next)
    return next
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
