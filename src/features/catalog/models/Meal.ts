export interface Meal {
  id: string
  name: string
  description: string
  calories: number
  protein: number
  price: number
  imageUrl: string
  imageAlt: string
  tag?: string
  ingredients?: string[]
  allergens?: string[]
  allergenInfoVerified?: boolean
  diet?: 'all' | 'vegetarian' | 'vegan'
}

/** Món đọc từ API, có đủ thông tin cho trang thực đơn. */
export interface MenuMeal extends Meal {
  mealType: string
  carbs: number
  fat: number
  servingSize: string | null
  goal: string | null
}
