import type { Recipe, Rarity } from '../types/recipe'
import { createRng } from './rng'

const RARITY_WEIGHT: Record<Rarity, number> = {
  common: 80,
  rare: 15,
  legendary: 5,
}

function weightOf(r: Recipe): number {
  return RARITY_WEIGHT[r.rarity]
}

export function isUnlocked(recipe: Recipe, streak: number, unlockedIds: Set<string>): boolean {
  if (recipe.unlockAtStreak === 0) return true
  if (streak >= recipe.unlockAtStreak) return true
  return unlockedIds.has(recipe.id)
}

export function getUnlockedIds(recipes: Recipe[], streak: number): string[] {
  return recipes
    .filter((r) => r.unlockAtStreak > 0 && streak >= r.unlockAtStreak)
    .map((r) => r.id)
}

export function buildPool(
  recipes: Recipe[],
  streak: number,
  unlockedIds: string[],
  avoidYesterday: boolean,
  yesterdayIds: string[],
): Recipe[] {
  const unlockSet = new Set(unlockedIds)
  return recipes.filter((r) => {
    if (!isUnlocked(r, streak, unlockSet)) return false
    if (avoidYesterday && yesterdayIds.includes(r.id)) return false
    return true
  })
}

function pickWeighted(pool: Recipe[], rng: () => number): Recipe | null {
  if (pool.length === 0) return null
  const total = pool.reduce((s, r) => s + weightOf(r), 0)
  let roll = rng() * total
  for (const r of pool) {
    roll -= weightOf(r)
    if (roll <= 0) return r
  }
  return pool[pool.length - 1]
}

/** Prefer at least one non-素菜 dish when possible */
export function drawThree(pool: Recipe[], seed: string): Recipe[] {
  const rng = createRng(seed)
  const remaining = [...pool]
  const picks: Recipe[] = []

  for (let i = 0; i < 3; i++) {
    if (remaining.length === 0) break
    const pick = pickWeighted(remaining, rng)
    if (!pick) break
    picks.push(pick)
    const idx = remaining.findIndex((r) => r.id === pick.id)
    if (idx >= 0) remaining.splice(idx, 1)
  }

  const allVeg = picks.length === 3 && picks.every((p) => p.category === '素菜' || p.protein === '素')
  if (allVeg) {
    const meat = remaining.find((r) => r.category === '荤菜' || (r.protein !== '素' && r.category !== '凉菜'))
    if (meat) {
      picks[2] = meat
    }
  }

  return picks
}
