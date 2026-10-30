import { isBodyProfile, type BodyProfile } from './nutritionCalculator.ts'

export const PROFILE_KEY = 'offimeal.nutrition-profile.v1'
export function loadProfile(): BodyProfile | null {
  try {
    const value: unknown = JSON.parse(localStorage.getItem(PROFILE_KEY) ?? 'null')
    return isBodyProfile(value) ? value : null
  } catch { return null }
}
