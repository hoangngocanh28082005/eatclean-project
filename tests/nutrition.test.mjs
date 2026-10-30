import { test } from 'node:test'
import assert from 'node:assert/strict'
import { calcNutrition, calcMacros, isBodyProfile } from '../src/features/nutrition/services/nutritionCalculator.ts'
import { suggestMeals, normalizeFood } from '../src/features/nutrition/services/mealSuggestions.ts'
import { loadProfile, PROFILE_KEY } from '../src/features/nutrition/services/profileStorage.ts'

const profile = { gender: 'female', age: 28, heightCm: 165, weightKg: 58, goal: 'maintain', activity: 'sedentary', lunchPercent: 35 }
const meal = (id, calories, overrides = {}) => ({ id, name: id, description: '', calories, protein: 20, price: 89000, imageUrl: '', imageAlt: '', ...overrides })

test('known input computes resting energy, activity expenditure and daily macros', () => {
  const result = calcNutrition(profile)
  assert.equal(result.bmr, 1310)
  assert.equal(result.tdee, 1572)
  assert.equal(result.targetKcal, 1570)
  assert.deepEqual(calcMacros(2000), { proteinGrams: 150, carbGrams: 175, fatGrams: 78, proteinPct: 30, carbPct: 35, fatPct: 35 })
  assert.equal(calcNutrition({ ...profile, goal: 'lose' }).targetKcal, 1200)
  assert.equal(calcNutrition({ ...profile, goal: 'gain' }).targetKcal, 1820)
})

test('reject invalid, nonfinite, underage and malformed persisted profiles', () => {
  for (const invalid of [null, {}, { ...profile, age: 17 }, { ...profile, age: 28.5 }, { ...profile, heightCm: NaN }, { ...profile, weightKg: Infinity }, { ...profile, lunchPercent: 100 }, { ...profile, diet: 'invalid' }, { ...profile, allergies: [] }]) {
    assert.equal(isBodyProfile(invalid), false)
  }
  assert.throws(() => calcNutrition({ ...profile, weightKg: -1 }))
})

test('rank by portion budget instead of input order and never exceed lunch allowance', () => {
  const result = suggestMeals([meal('first', 100), meal('best', 560), meal('too-large', 2000)], profile, 2000)
  assert.equal(result.budget, 700)
  assert.equal(result.suggestions[0].meal.id, 'best')
  assert.equal(result.suggestions[0].portion, 1.25)
  assert.ok(result.suggestions.every(item => item.kcal <= result.budget))
  assert.ok(!result.suggestions.some(item => item.meal.id === 'too-large'))
})

test('exclude disliked ingredients and respect vegetarian/vegan filters without fallback', () => {
  const catalog = [meal('Gà', 500), meal('Rau', 500, { diet: 'vegan' }), meal('Trứng', 500, { diet: 'vegetarian' })]
  assert.equal(normalizeFood('ĐẬU PHỘNG'), 'dau phong')
  assert.deepEqual(suggestMeals(catalog, { ...profile, diet: 'vegan' }, 2000).suggestions.map(s => s.meal.id), ['Rau'])
  assert.equal(suggestMeals(catalog, { ...profile, diet: 'vegan', dislikes: 'rau' }, 2000).suggestions.length, 0)
  assert.ok(!suggestMeals(catalog, { ...profile, dislikes: 'ga; trung' }, 2000).suggestions.some(s => s.meal.id !== 'Rau'))
})

test('allergy filters exclude unknown and known allergens; preferences break equal-budget ties', () => {
  const catalog = [meal('unknown', 560), meal('nuts', 560, { allergenInfoVerified: true, allergens: ['Đậu phộng'] }), meal('rau', 560, { allergenInfoVerified: true, ingredients: ['rau'] })]
  assert.deepEqual(suggestMeals(catalog, { ...profile, allergies: 'dau phong' }, 2000).suggestions.map(s => s.meal.id), ['rau'])
  assert.equal(suggestMeals(catalog, { ...profile, favorites: 'rau' }, 2000).suggestions[0].meal.id, 'rau')
  assert.equal(suggestMeals([catalog[0]], { ...profile, allergies: 'sữa' }, 2000).suggestions.length, 0)
})

test('restore only validated saved data and tolerate broken or blocked browser storage', () => {
  const previous = Object.getOwnPropertyDescriptor(globalThis, 'localStorage')
  try {
    for (const [raw, expected] of [[JSON.stringify(profile), profile], ['{broken', null], [JSON.stringify({ ...profile, goal: 'invalid' }), null], [null, null]]) {
      Object.defineProperty(globalThis, 'localStorage', { configurable: true, value: { getItem: key => { assert.equal(key, PROFILE_KEY); return raw } } })
      assert.deepEqual(loadProfile(), expected)
    }
    Object.defineProperty(globalThis, 'localStorage', { configurable: true, get() { throw new Error('blocked') } })
    assert.equal(loadProfile(), null)
  } finally {
    if (previous) Object.defineProperty(globalThis, 'localStorage', previous)
    else delete globalThis.localStorage
  }
})
