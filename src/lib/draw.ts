import type { Recipe } from '../types/recipe'
import { createRng } from './rng'

export function buildPool(
  recipes: Recipe[],
  avoidYesterday: boolean,
  yesterdayIds: string[],
  includeColdDishes: boolean,
): Recipe[] {
  return recipes.filter((r) => {
    if (!includeColdDishes && r.category === '凉菜') return false
    if (avoidYesterday && yesterdayIds.includes(r.id)) return false
    return true
  })
}

function pickOne(pool: Recipe[], rng: () => number): Recipe | null {
  if (pool.length === 0) return null
  return pool[Math.floor(rng() * pool.length)] ?? null
}

/** Prefer at least one non-vegetarian dish when possible */
export function drawRecipes(pool: Recipe[], seed: string, count: number): Recipe[] {
  const rng = createRng(seed)
  const remaining = [...pool]
  const picks: Recipe[] = []
  const n = Math.max(1, Math.min(count, remaining.length))

  for (let i = 0; i < n; i++) {
    if (remaining.length === 0) break
    const pick = pickOne(remaining, rng)
    if (!pick) break
    picks.push(pick)
    const idx = remaining.findIndex((r) => r.id === pick.id)
    if (idx >= 0) remaining.splice(idx, 1)
  }

  const allVeg =
    picks.length >= 2 &&
    picks.every((p) => p.category === '素菜' || p.protein === '素')
  if (allVeg) {
    const meat = remaining.find(
      (r) => r.category === '荤菜' || (r.protein !== '素' && r.category !== '凉菜' && r.category !== '素菜'),
    )
    if (meat) {
      picks[picks.length - 1] = meat
    }
  }

  return picks
}
