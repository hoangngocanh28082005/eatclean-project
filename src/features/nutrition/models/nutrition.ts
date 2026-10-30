export type Gender = 'male' | 'female'
export type Goal = 'lose' | 'maintain' | 'gain'
export type ActivityLevel = 'sedentary' | 'light' | 'moderate'

export interface BodyProfile {
  gender: Gender
  age: number
  heightCm: number
  weightKg: number
  goal: Goal
  activity: ActivityLevel
  diet?: 'all' | 'vegetarian' | 'vegan'
  favorites?: string
  dislikes?: string
  allergies?: string
  lunchPercent?: number
}

export interface MacroSplit {
  proteinGrams: number
  carbGrams: number
  fatGrams: number
  proteinPct: number
  carbPct: number
  fatPct: number
}

export interface NutritionResult {
  /** Basal metabolic rate (kcal/day) */
  bmr: number
  /** Total daily energy expenditure with activity factor (kcal/day) */
  tdee: number
  /** Recommended daily intake adjusted for the goal (kcal/day) */
  targetKcal: number
  macros: MacroSplit
}
