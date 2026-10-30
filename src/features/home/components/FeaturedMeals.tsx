import { ArrowRight } from 'lucide-react'
import Button from '@/shared/components/ui/Button'
import MealCard from '@/features/catalog/components/MealCard'
import SectionHeading from '@/shared/components/ui/SectionHeading'
import { meals } from '@/features/catalog/data/meals'

export default function FeaturedMeals() {
  return (
    <section aria-labelledby="featured-meals-title" className="bg-cream-100">
      <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8 lg:py-24">
        <div className="flex flex-col items-center justify-between gap-6 sm:flex-row sm:items-end">
          <SectionHeading
            align="left"
            eyebrow="Thực đơn nổi bật"
            title="Ăn ngon mỗi ngày, không lo nhàm chán"
            description="Các món mẫu để bạn tham khảo. Giá và thông tin dinh dưỡng sẽ được xác nhận khi dịch vụ mở đăng ký."
          />
          <Button to="/thuc-don" variant="ghost" className="hidden shrink-0 sm:inline-flex">
            Xem tất cả
            <ArrowRight className="size-4" aria-hidden />
          </Button>
        </div>

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {meals.slice(0, 6).map((meal) => (
            <MealCard key={meal.id} meal={meal} />
          ))}
        </div>

        <div className="mt-10 text-center sm:hidden">
          <Button to="/thuc-don" variant="outline">Xem tất cả món ăn</Button>
        </div>
      </div>
    </section>
  )
}
