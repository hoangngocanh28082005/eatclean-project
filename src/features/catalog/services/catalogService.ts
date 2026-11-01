import { api } from '@/shared/services/httpClient'
import { goalLabels } from '../data/labels'
import type { MealPackage } from '../models/MealPackage'
import type { MenuMeal } from '../models/Meal'

type MealDto = Omit<MenuMeal, 'allergens' | 'tag'> & { allergens: string | null }

const toMenuMeal = ({ allergens, ...meal }: MealDto): MenuMeal => ({
  ...meal,
  tag: meal.goal ? goalLabels[meal.goal] : undefined,
  allergens: allergens ? allergens.split(',').map((item) => item.trim()) : undefined,
})

export const catalogService = {
  meals: async () => (await api<MealDto[]>('/api/meals')).map(toMenuMeal),
  meal: async (id: string) => toMenuMeal(await api<MealDto>(`/api/meals/${id}`)),
  dailyMenu: async (date: string) => (await api<MealDto[]>(`/api/meals/daily/${date}`)).map(toMenuMeal),
  packages: () => api<MealPackage[]>('/api/packages'),
  packageById: (id: string) => api<MealPackage>(`/api/packages/${id}`),
}
