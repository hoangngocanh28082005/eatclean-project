import type { Meal } from '../../catalog/models/Meal'
import type { BodyProfile } from '../models/nutrition'

export const normalizeFood = (text: string) => text.normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/đ/g, 'd').trim()

export const foodTerms = (text = '') => text.split(/[,;\n]/).map(normalizeFood).filter(Boolean)

export function suggestMeals(catalog: Meal[], profile: BodyProfile, dailyKcal: number) {
  const budget = Math.round(dailyKcal * (profile.lunchPercent ?? 35) / 100)
  const dislikes = foodTerms(profile.dislikes)
  const allergies = foodTerms(profile.allergies)
  const favorites = foodTerms(profile.favorites)
  const suggestions = catalog.filter(meal => {
    const text = normalizeFood([meal.name, meal.description, ...(meal.ingredients ?? []), ...(meal.allergens ?? [])].join(' '))
    if (dislikes.some(term => text.includes(term))) return false
    // Unknown ingredient/cross-contact data must never be treated as allergy-safe.
    if (allergies.length && (!meal.allergenInfoVerified || allergies.some(term => text.includes(term)))) return false
    if (profile.diet === 'vegan' && meal.diet !== 'vegan') return false
    if (profile.diet === 'vegetarian' && !['vegetarian', 'vegan'].includes(meal.diet ?? '')) return false
    return true
  }).flatMap(meal => {
    const portions = [0.75, 1, 1.25].map(portion => ({ portion, kcal: Math.round(meal.calories * portion) }))
      .filter(option => option.kcal <= budget)
      .sort((a, b) => Math.abs(a.kcal - budget) - Math.abs(b.kcal - budget))
    const best = portions[0]
    if (!best) return []
    const text = normalizeFood([meal.name, meal.description, ...(meal.ingredients ?? [])].join(' '))
    const preferred = favorites.some(term => text.includes(term))
    const goalMatch = meal.tag === (profile.goal === 'lose' ? 'Giảm cân' : profile.goal === 'gain' ? 'Tăng cơ' : '')
    const score = Math.abs(best.kcal - budget) / budget - (preferred ? 0.12 : 0) - (goalMatch ? 0.08 : 0)
    return [{ meal, ...best, score, preferred, goalMatch, protein: Math.round(meal.protein * best.portion) }]
  }).sort((a, b) => a.score - b.score || a.meal.id.localeCompare(b.meal.id)).slice(0, 3)
  return { budget, suggestions }
}
