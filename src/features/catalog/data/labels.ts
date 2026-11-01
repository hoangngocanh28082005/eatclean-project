export const mealTypeLabels: Record<string, string> = {
  Breakfast: 'Bữa sáng',
  Lunch: 'Bữa trưa',
  Dinner: 'Bữa tối',
  Snack: 'Bữa phụ',
}

export const goalLabels: Record<string, string> = {
  EatClean: 'Eat clean',
  Keto: 'Keto',
  LowCarb: 'Ít tinh bột',
  Balanced: 'Cân bằng',
  Vegetarian: 'Món chay',
}

/** Số liệu chưa có thì nói rõ, không hiển thị thành 0. */
export const formatNutrition = (value: number | null, unit: string) =>
  value === null ? 'Chưa có thông tin' : `${value} ${unit}`

export const formatPrice = (price: number) => `${price.toLocaleString('vi-VN')}đ`
