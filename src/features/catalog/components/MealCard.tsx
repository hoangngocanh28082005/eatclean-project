import { Link } from 'react-router-dom'
import { Flame, Drumstick } from 'lucide-react'
import type { Meal } from '@/features/catalog/models/Meal'
import ImageWithFallback from '../../../shared/components/ui/ImageWithFallback'

interface MealCardProps {
  meal: Meal
}

const formatPrice = (price: number) => `${price.toLocaleString('vi-VN')}đ`

export default function MealCard({ meal }: MealCardProps) {
  return (
    <article className="group flex h-full flex-col overflow-hidden rounded-3xl bg-white shadow-sm ring-1 ring-sage-200 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg">
      <div className="relative aspect-[4/3] overflow-hidden">
        <ImageWithFallback
          src={meal.imageUrl}
          alt={meal.imageAlt}
          className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
        />
        {meal.tag && (
          <span className="absolute top-4 left-4 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-forest-700 shadow-sm backdrop-blur-sm">
            {meal.tag}
          </span>
        )}
      </div>

      <div className="flex flex-1 flex-col gap-3 p-5">
        <h3 className="text-lg font-bold text-forest-900">{meal.name}</h3>
        <p className="line-clamp-2 text-sm text-forest-900/70">
          {meal.description}
        </p>

        <div className="flex items-center gap-4 text-sm text-forest-900/80">
          <span className="flex items-center gap-1.5">
            <Flame className="size-4 text-accent-600" aria-hidden />
            {meal.calories} kcal
          </span>
          <span className="flex items-center gap-1.5">
            <Drumstick className="size-4 text-forest-500" aria-hidden />
            {meal.protein} g đạm
          </span>
        </div>

        <div className="mt-auto flex items-center justify-between border-t border-sage-100 pt-4">
          <p className="text-lg font-extrabold text-forest-700">
            {formatPrice(meal.price)}
          </p>
          <Link
            to="/thuc-don"
            className="rounded-full border border-forest-700 px-4 py-2 text-sm font-semibold text-forest-700 transition-colors duration-200 hover:bg-forest-700 hover:text-white"
          >
            Xem thực đơn
          </Link>
        </div>
      </div>
    </article>
  )
}
