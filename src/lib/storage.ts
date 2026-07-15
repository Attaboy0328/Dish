import type { GameState, RevealMode } from '../types/recipe'

export const STORAGE_KEY = 'kai-fan-box:v1'

export const defaultState = (): GameState => ({
  streak: 0,
  lastCheckInDate: null,
  revealedUnlocks: [],
  revealMode: 'box',
  avoidYesterday: true,
  yesterdayIds: [],
  yesterdayDate: null,
  today: null,
})

export function loadState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as GameState
    return { ...defaultState(), ...parsed }
  } catch {
    return defaultState()
  }
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
