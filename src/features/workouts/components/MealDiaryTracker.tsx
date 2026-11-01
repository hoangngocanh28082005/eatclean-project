import { useState } from 'react'
import { Utensils, CheckCircle, Clock, Info, Check } from 'lucide-react'
import type { MealLogItem } from '../models/Workout.ts'

interface MealDiaryTrackerProps {
  currentDate: string
  onDateChange: (date: string) => void
  meals: MealLogItem[]
  onToggleMeal: (id: string) => void
}

const mealTypeNames: Record<MealLogItem['mealType'], string> = {
  breakfast: 'Bữa sáng',
  lunch: 'Bữa trưa (OffiMeal)',
  snack: 'Bữa phụ / Xế chiều',
  dinner: 'Bữa tối',
}

export default function MealDiaryTracker({
  currentDate,
  onDateChange,
  meals,
  onToggleMeal,
}: MealDiaryTrackerProps) {
  const [todayStr] = useState(() => new Date().toISOString().split('T')[0])

  const confirmedCount = meals.filter((m) => m.isConsumed).length
  const totalCaloriesPlanned = meals.reduce((acc, m) => acc + (m.calories || 0), 0)
  const consumedCalories = meals
    .filter((m) => m.isConsumed)
    .reduce((acc, m) => acc + (m.calories || 0), 0)

  const isToday = currentDate === todayStr

  // Quick helper to format date
  const dateObj = new Date(currentDate + 'T00:00:00')
  const dateFormatted = dateObj.toLocaleDateString('vi-VN', {
    weekday: 'long',
    day: '2-digit',
    month: '2-digit',
    year: 'numeric',
  })

  const setYesterday = () => {
    const d = new Date()
    d.setDate(d.getDate() - 1)
    onDateChange(d.toISOString().split('T')[0])
  }

  const setToday = () => {
    onDateChange(todayStr)
  }

  return (
    <div className="space-y-6">
      {/* Date Switcher Bar */}
      <div className="flex flex-col gap-4 rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sage-200 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <span className="text-xs font-bold tracking-wider text-forest-700 uppercase">
            Nhật ký theo ngày
          </span>
          <h3 className="text-lg font-bold text-forest-900 capitalize">
            {isToday ? `Hôm nay (${dateFormatted})` : dateFormatted}
          </h3>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={setToday}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              isToday
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-cream-100 text-forest-900/80 hover:bg-sage-100'
            }`}
          >
            Hôm nay
          </button>
          <button
            type="button"
            onClick={setYesterday}
            className={`rounded-xl px-3 py-1.5 text-xs font-bold transition-all ${
              !isToday
                ? 'bg-forest-800 text-white shadow-xs'
                : 'bg-cream-100 text-forest-900/80 hover:bg-sage-100'
            }`}
          >
            Hôm qua
          </button>
          <div className="relative inline-flex items-center">
            <input
              type="date"
              value={currentDate}
              onChange={(e) => onDateChange(e.target.value)}
              className="rounded-xl border border-sage-200 bg-white px-3 py-1.5 text-xs font-medium text-forest-900 focus:outline-none focus:ring-1 focus:ring-forest-600"
            />
          </div>
        </div>
      </div>

      {/* Policy and Explanation Note */}
      <div className="flex items-start gap-3 rounded-2xl bg-amber-50/80 p-4 ring-1 ring-amber-200/60">
        <Info className="mt-0.5 size-5 shrink-0 text-amber-700" />
        <div className="text-xs leading-relaxed text-amber-900">
          <strong className="font-bold">Nguyên tắc xác nhận nhật ký bữa ăn OffiMeal:</strong>
          <p className="mt-0.5">
            Hệ thống <em>không tự động suy ra</em> bạn đã ăn chỉ từ việc đơn hàng đã chuyển trạng thái
            “Giao thành công”. Để tính toán calo thực tế chính xác nhất, bạn vui lòng tự tay bấm{' '}
            <strong>“Xác nhận đã dùng bữa”</strong> sau khi dùng xong bữa ăn của mình.
          </p>
        </div>
      </div>

      {/* Daily Progress Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sage-200">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-bold tracking-wider uppercase">Tiến độ ăn uống trong ngày</span>
            <Utensils className="size-4.5 text-forest-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-forest-900">{confirmedCount}</span>
            <span className="text-sm font-semibold text-forest-900/60">/ {meals.length} bữa</span>
          </div>
          <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-cream-100">
            <div
              className="h-full rounded-full bg-forest-700 transition-all duration-500"
              style={{ width: `${(confirmedCount / (meals.length || 1)) * 100}%` }}
            />
          </div>
        </div>

        <div className="rounded-3xl bg-white p-5 shadow-sm ring-1 ring-sage-200">
          <div className="flex items-center justify-between text-forest-700">
            <span className="text-xs font-bold tracking-wider uppercase">Nạp năng lượng thực tế</span>
            <Clock className="size-4.5 text-forest-600" />
          </div>
          <div className="mt-2 flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-forest-900">{consumedCalories}</span>
            <span className="text-sm font-semibold text-forest-900/60">
              / {totalCaloriesPlanned} kcal kế hoạch
            </span>
          </div>
          <p className="mt-2 text-xs text-forest-900/60">
            {confirmedCount === meals.length
              ? 'Tuyệt vời! Bạn đã hoàn thành 100% nhật ký ăn uống cho ngày này.'
              : 'Hãy đánh dấu sau khi bạn đã dùng xong từng bữa ăn.'}
          </p>
        </div>
      </div>

      {/* Meal Items Checklist */}
      <div className="rounded-3xl bg-white p-6 shadow-sm ring-1 ring-sage-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-bold text-forest-900">
              Danh sách bữa ăn {isToday ? 'hôm nay' : `ngày ${currentDate}`}
            </h3>
            <p className="text-xs text-forest-900/60">
              Nhấn nút xác nhận để lưu lại thời điểm bạn đã nạp năng lượng
            </p>
          </div>
        </div>

        <div className="mt-6 space-y-3">
          {meals.map((meal) => (
            <div
              key={meal.id}
              className={`flex flex-col gap-3 rounded-2xl p-4 transition-all sm:flex-row sm:items-center sm:justify-between ${
                meal.isConsumed
                  ? 'bg-sage-100/60 ring-1 ring-sage-200'
                  : 'bg-cream-100/50 ring-1 ring-sage-100'
              }`}
            >
              <div className="flex items-start gap-3">
                <button
                  type="button"
                  onClick={() => onToggleMeal(meal.id)}
                  className={`mt-0.5 flex size-6 shrink-0 items-center justify-center rounded-lg transition-colors ${
                    meal.isConsumed
                      ? 'bg-forest-800 text-white'
                      : 'border-2 border-forest-900/30 bg-white hover:border-forest-700'
                  }`}
                  aria-label={`Xác nhận đã dùng: ${meal.mealTitle}`}
                >
                  {meal.isConsumed && <Check className="size-4" strokeWidth={3} />}
                </button>

                <div>
                  <div className="flex items-center gap-2">
                    <span className="rounded-md bg-white px-2 py-0.5 text-[11px] font-bold text-forest-700 shadow-xs">
                      {mealTypeNames[meal.mealType]}
                    </span>
                    {meal.calories && (
                      <span className="text-xs font-semibold text-forest-900/70">
                        {meal.calories} kcal
                      </span>
                    )}
                  </div>

                  <h4
                    className={`mt-1 text-sm font-bold ${
                      meal.isConsumed ? 'text-forest-900 line-through opacity-75' : 'text-forest-900'
                    }`}
                  >
                    {meal.mealTitle}
                  </h4>

                  {meal.note && <p className="mt-0.5 text-xs text-forest-900/60">{meal.note}</p>}
                </div>
              </div>

              {/* Status / Confirmation Button */}
              <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0">
                {meal.isConsumed ? (
                  <span className="inline-flex items-center gap-1 text-xs font-bold text-forest-800">
                    <CheckCircle className="size-4 text-forest-700" />
                    Đã dùng lúc {meal.confirmedAt || 'trong ngày'}
                  </span>
                ) : (
                  <button
                    type="button"
                    onClick={() => onToggleMeal(meal.id)}
                    className="rounded-xl bg-forest-800 px-3.5 py-1.5 text-xs font-bold text-white transition-colors hover:bg-forest-700"
                  >
                    Xác nhận đã ăn
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
