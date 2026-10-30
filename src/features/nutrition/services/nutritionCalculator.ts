import type { ActivityLevel, BodyProfile, Goal, MacroSplit, NutritionResult } from '../models/nutrition'
export type { ActivityLevel, BodyProfile, Gender, Goal, MacroSplit, NutritionResult } from '../models/nutrition'

export function isBodyProfile(value: unknown): value is BodyProfile {
  if (!value || typeof value !== 'object') return false
  const p = value as BodyProfile
  return ['male', 'female'].includes(p.gender) &&
    Number.isInteger(p.age) && p.age >= 18 && p.age <= 90 &&
    Number.isFinite(p.heightCm) && p.heightCm >= 120 && p.heightCm <= 220 &&
    Number.isFinite(p.weightKg) && p.weightKg >= 30 && p.weightKg <= 200 &&
    ['lose', 'maintain', 'gain'].includes(p.goal) &&
    ['sedentary', 'light', 'moderate'].includes(p.activity) &&
    (p.diet === undefined || ['all', 'vegetarian', 'vegan'].includes(p.diet)) &&
    [p.favorites, p.dislikes, p.allergies].every(v => v === undefined || (typeof v === 'string' && v.length <= 300)) &&
    (p.lunchPercent === undefined || (Number.isInteger(p.lunchPercent) && p.lunchPercent >= 25 && p.lunchPercent <= 40))
}

const MIN_KCAL = 1200

const activityFactors: Record<ActivityLevel, number> = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
}

/** Daily kcal adjustment per goal — kept gentle and office-worker friendly. */
const goalAdjustments: Record<Goal, number> = {
  lose: -400,
  maintain: 0,
  gain: 250,
}

/** Mifflin-St Jeor equation — client-side demo calculation. */
export function calcNutrition(profile: BodyProfile): NutritionResult {
  if (!isBodyProfile(profile)) throw new Error('Thông tin hồ sơ không hợp lệ.')
  const base = 10 * profile.weightKg + 6.25 * profile.heightCm - 5 * profile.age
  const bmr = Math.round(profile.gender === 'male' ? base + 5 : base - 161)
  const tdee = Math.round(bmr * activityFactors[profile.activity])
  const targetKcal = Math.max(
    MIN_KCAL,
    Math.round((tdee + goalAdjustments[profile.goal]) / 10) * 10,
  )

  return { bmr, tdee, targetKcal, macros: calcMacros(targetKcal) }
}

/** Balanced split: 30% protein, 35% carbs, 35% fat. */
export function calcMacros(kcal: number): MacroSplit {
  const protein = 0.3
  const carb = 0.35
  const fat = 0.35
  return {
    proteinGrams: Math.round((kcal * protein) / 4),
    carbGrams: Math.round((kcal * carb) / 4),
    fatGrams: Math.round((kcal * fat) / 9),
    proteinPct: protein * 100,
    carbPct: carb * 100,
    fatPct: fat * 100,
  }
}

export const MIN_KCAL_LIMIT = MIN_KCAL

export const goalLabels: Record<Goal, string> = {
  lose: 'Giảm cân',
  maintain: 'Duy trì cân nặng',
  gain: 'Tăng cơ',
}

export const activityLabels: Record<ActivityLevel, string> = {
  sedentary: 'Ít vận động (ngồi nhiều, ít tập luyện)',
  light: 'Vận động nhẹ (tập 1–2 buổi/tuần)',
  moderate: 'Vận động vừa (tập 3–4 buổi/tuần)',
}
