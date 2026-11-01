import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Feedback, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import ImageWithFallback from '@/shared/components/ui/ImageWithFallback'
import { errorMessage } from '@/shared/services/httpClient'
import { formatNutrition, formatPrice, goalLabels, mealTypeLabels } from '../data/labels'
import type { MenuMeal } from '../models/Meal'
import { catalogService } from '../services/catalogService'

export default function MealDetailPage() {
  const { id = '' } = useParams()
  const [meal, setMeal] = useState<MenuMeal | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    catalogService.meal(id)
      .then((result) => { if (active) setMeal(result) })
      .catch((e: unknown) => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [id])

  const nutrition = meal && [
    ['Năng lượng', formatNutrition(meal.calories, 'kcal')],
    ['Đạm', formatNutrition(meal.protein, 'g')],
    ['Tinh bột', formatNutrition(meal.carbs, 'g')],
    ['Chất béo', formatNutrition(meal.fat, 'g')],
  ]

  return (
    <section className="bg-cream-100 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-6">
        <Button to="/thuc-don" variant="ghost" size="sm">← Về thực đơn</Button>
        {error ? (
          <Feedback error={error} />
        ) : !meal ? (
          <p role="status" className="text-center">Đang tải món ăn…</p>
        ) : (
          <div className={panelClass}>
            <ImageWithFallback src={meal.imageUrl} alt={meal.imageAlt} className="aspect-[16/9] w-full rounded-2xl object-cover" />
            <div>
              <p className="text-sm font-semibold text-forest-600">
                {[mealTypeLabels[meal.mealType] ?? meal.mealType, meal.goal && goalLabels[meal.goal], meal.servingSize].filter(Boolean).join(' · ')}
              </p>
              <h1 className="mt-1 text-3xl font-extrabold text-forest-900">{meal.name}</h1>
              <p className="mt-3 text-forest-900/70">{meal.description}</p>
            </div>
            <dl className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              {nutrition?.map(([label, value]) => (
                <div key={label} className="rounded-2xl bg-cream-100 p-4">
                  <dt className="text-sm text-forest-900/70">{label}</dt>
                  <dd className="text-lg font-bold text-forest-900">{value}</dd>
                </div>
              ))}
            </dl>
            <p className="rounded-xl bg-sage-100 p-4 text-sm text-forest-900">
              {meal.allergens?.length
                ? `Thành phần cần lưu ý: ${meal.allergens.join(', ')}. Thông tin chưa được xác minh đầy đủ, người bị dị ứng vui lòng hỏi lại trước khi dùng.`
                : 'Chưa có thông tin dị ứng đã xác minh cho món này. Người bị dị ứng vui lòng hỏi lại trước khi dùng.'}
            </p>
            <p className="text-sm text-forest-900/70">Giá tham khảo khi mua lẻ: {formatPrice(meal.price)}. Món được chọn trong gói ăn.</p>
            <Button to="/goi-an">Xem các gói ăn</Button>
          </div>
        )}
      </div>
    </section>
  )
}
