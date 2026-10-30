export interface Benefit {
  icon: 'balance' | 'clock' | 'utensils' | 'leaf'
  title: string
  description: string
}

export const benefits: Benefit[] = [
  {
    icon: 'balance',
    title: 'Bữa ăn cân bằng dinh dưỡng',
    description:
      'Tham khảo năng lượng và lượng đạm của từng món để lựa chọn bữa ăn phù hợp.',
  },
  {
    icon: 'clock',
    title: 'Tiết kiệm thời gian',
    description:
      'Tham khảo gói ăn theo tuần hoặc tháng để lên kế hoạch bữa trưa thuận tiện hơn.',
  },
  {
    icon: 'utensils',
    title: 'Thực đơn đa dạng',
    description:
      'Khám phá các món ăn gợi ý và lựa chọn theo sở thích, mục tiêu dinh dưỡng của bạn.',
  },
  {
    icon: 'leaf',
    title: 'Bao bì thân thiện môi trường',
    description:
      'OffiMeal hướng tới sử dụng hộp thủy tinh hoặc hộp bã mía để giảm rác thải nhựa.',
  },
]
