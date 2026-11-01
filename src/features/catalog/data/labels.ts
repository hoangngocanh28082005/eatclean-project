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
}

export const formatPrice = (price: number) => `${price.toLocaleString('vi-VN')}đ`
