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
