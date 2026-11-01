export interface AdminMeal {
    mealId: number
    name: string
    description: string | null
    mealType: string
    calories: number | null
    proteinG: number | null
    carbsG: number | null
    fatG: number | null
    price: number
    imageUrl: string | null
    isAvailable: boolean
    servingSize: string | null
    allergens: string | null
    goal: string | null
}

export interface MealRequest {
    name: string
    description: string
    mealType: string
    calories: number | null
    proteinG: number | null
    carbsG: number | null
    fatG: number | null
    price: number
    imageUrl: string
    servingSize: string
    allergens: string
    goal: string
    isAvailable: boolean
}