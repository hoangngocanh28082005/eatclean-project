import { useCallback, useEffect, useMemo, useState } from 'react'
import { Feedback, fieldClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import SectionHeading from '@/shared/components/ui/SectionHeading'
import { errorMessage } from '@/shared/services/httpClient'
import MealCard from '../components/MealCard'
import { goalLabels, mealTypeLabels } from '../data/labels'
import type { MenuMeal } from '../models/Meal'
import { catalogService } from '../services/catalogService'

export default function MenuPage() {
  const [meals, setMeals] = useState<MenuMeal[] | null>(null)
  const [error, setError] = useState('')
  const [search, setSearch] = useState('')
  const [mealType, setMealType] = useState('')
  const [goal, setGoal] = useState('')

  const load = useCallback(async () => {
    setError('')
    try {
      setMeals(await catalogService.meals())
    } catch (e) {
      setError(errorMessage(e))
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  const filtered = useMemo(() => {
    const keyword = search.trim().toLowerCase()
    return (meals ?? []).filter(
      (meal) =>
        (!keyword || `${meal.name} ${meal.description}`.toLowerCase().includes(keyword)) &&
        (!mealType || meal.mealType === mealType) &&
        (!goal || meal.goal === goal),
    )
  }, [meals, search, mealType, goal])

  return (
    <section className="bg-cream-100">
      <div className="mx-auto max-w-7xl space-y-10 px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <SectionHeading
          eyebrow="Thực đơn"
          title="Các món đang phục vụ"
          description="Xem thành phần dinh dưỡng của từng món trước khi chọn bữa trong gói ăn."
        />

        <div className="grid gap-4 sm:grid-cols-3">
          <input
            type="search"
            aria-label="Tìm món"
            placeholder="Tìm món..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            className={fieldClass}
          />
          <select aria-label="Loại bữa" value={mealType} onChange={(event) => setMealType(event.target.value)} className={fieldClass}>
            <option value="">Tất cả loại bữa</option>
            {Object.entries(mealTypeLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
          <select aria-label="Chế độ ăn" value={goal} onChange={(event) => setGoal(event.target.value)} className={fieldClass}>
            <option value="">Tất cả chế độ ăn</option>
            {Object.entries(goalLabels).map(([value, label]) => (
              <option key={value} value={value}>{label}</option>
            ))}
          </select>
        </div>

        {error ? (
          <div className="space-y-4">
            <Feedback error={error} />
            <Button onClick={() => void load()}>Thử lại</Button>
          </div>
        ) : !meals ? (
          <p role="status" className="text-center">Đang tải thực đơn…</p>
        ) : filtered.length ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filtered.map((meal) => (
              <MealCard key={meal.id} meal={meal} to={`/thuc-don/${meal.id}`} linkLabel="Xem chi tiết" />
            ))}
          </div>
        ) : (
          <p className="text-center">{meals.length ? 'Không có món phù hợp với bộ lọc.' : 'Thực đơn đang được cập nhật.'}</p>
        )}
      </div>
    </section>
  )
}
