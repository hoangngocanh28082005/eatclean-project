export interface StepInfo {
  step: number
  title: string
  description: string
}

export const howItWorksSteps: StepInfo[] = [
  {
    step: 1,
    title: 'Chọn mục tiêu dinh dưỡng',
    description:
      'Nhập hồ sơ và chọn mục tiêu giảm cân, duy trì cân nặng hoặc tăng cơ để xem gợi ý.',
  },
  {
    step: 2,
    title: 'Tham khảo món và gói ăn',
    description:
      'Xem món ăn mẫu và so sánh gói 5 hoặc 20 bữa. Chức năng đặt gói đang được hoàn thiện.',
  },
  {
    step: 3,
    title: 'Tìm hiểu lịch giao bữa trưa',
    description:
      'Dịch vụ hướng tới giao trước 11:30 vào ngày phục vụ. Lịch và khu vực giao sẽ được xác nhận khi đăng ký gói.',
  },
]
