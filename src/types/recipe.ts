export type Category = '荤菜' | '素菜' | '汤羹' | '主食' | '凉菜'
export type Protein = '猪肉' | '牛肉' | '羊肉' | '禽类' | '海鲜' | '蛋豆' | '素' | '其他'
export type Rarity = 'common' | 'rare' | 'legendary'
export type UnlockStreak = 0 | 3 | 7 | 14 | 30
export type RevealMode = 'box' | 'flip' | 'wheel'

export type Recipe = {
  id: string
  name: string
  category: Category
  protein: Protein
  timeMinutes: number
  difficulty: 1 | 2 | 3
  rarity: Rarity
  unlockAtStreak: UnlockStreak
  tags: string[]
  ingredients: string[]
  steps: string[]
  emoji: string
}

export type GameState = {
  streak: number
  lastCheckInDate: string | null
  revealedUnlocks: string[]
  revealMode: RevealMode
  avoidYesterday: boolean
  yesterdayIds: string[]
  yesterdayDate: string | null
  today: {
    date: string
    recipeIds: string[]
    rerollsLeft: number
    confirmed: boolean
    revealed: boolean
  } | null
}
