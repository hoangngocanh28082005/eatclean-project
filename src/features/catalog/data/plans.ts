import type { SubscriptionPlan } from '../models/SubscriptionPlan'
export type { SubscriptionPlan } from '../models/SubscriptionPlan'

export const subscriptionPlans: SubscriptionPlan[] = [
  {
    id: 'goi-tuan',
    name: 'Gói tuần',
    priceLabel: '350.000đ',
    periodLabel: '5 bữa / 1 tuần',
    description: 'Dành cho ai muốn trải nghiệm trước khi cam kết dài hạn.',
    features: [
      '5 bữa trưa lành mạnh',
      'Tham khảo thực đơn theo tuần',
      'Phí và khu vực giao sẽ được xác nhận',
    ],
  },
  {
    id: 'goi-thang',
    name: 'Gói tháng',
    priceLabel: '1.300.000đ',
    periodLabel: '20 bữa / 1 tháng',
    description: 'Phù hợp với người muốn lên kế hoạch bữa trưa theo tháng.',
    features: [
      '20 bữa trưa lành mạnh',
      'Theo dõi lịch 20 bữa trong gói',
      'Phí và khu vực giao sẽ được xác nhận',
      'Tham khảo gợi ý dinh dưỡng theo mục tiêu',
    ],
    highlight: true,
  },
]
