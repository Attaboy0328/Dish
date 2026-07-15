export type Category = '荤菜' | '素菜' | '汤羹' | '主食' | '凉菜'
export type Protein = '猪肉' | '牛肉' | '羊肉' | '禽类' | '海鲜' | '蛋豆' | '素' | '其他'
export type RevealMode = 'box' | 'flip' | 'wheel'
export type DishCount = 2 | 3 | 4 | 5

export type Recipe = {
  id: string
  name: string
  category: Category
  protein: Protein
  timeMinutes: number
  difficulty: 1 | 2 | 3
  tags: string[]
  ingredients: string[]
  steps: string[]
  emoji: string
}

export type GameState = {
  revealMode: RevealMode
  includeColdDishes: boolean
  includeSeafood: boolean
  dishCount: DishCount
  yesterdayIds: string[]
  yesterdayDate: string | null
  today: {
    date: string
    recipeIds: string[]
    dishCount: DishCount
    includeColdDishes: boolean
    includeSeafood: boolean
    /** Seed counter for today's draws */
    drawAttempt: number
    revealed: boolean
  } | null
}
