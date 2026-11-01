import { useEffect, useState, type FormEvent } from 'react'
import { catalogService } from '@/features/catalog/services/catalogService'
import { toDateInput } from '@/features/orders/services/orderService'
import { AccountField, Feedback, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import { errorMessage } from '@/shared/services/httpClient'
import type { AdminMeal } from '../models/AdminMeal'
import { mealService } from '../services/mealService'

export default function DailyMenuManagement() {
  const [today] = useState(() => toDateInput(new Date()))
  const [date, setDate] = useState(today)
  const [meals, setMeals] = useState<AdminMeal[] | null>(null)
  const [menu, setMenu] = useState<{ date: string; mealIds: number[] } | null>(null)
  const [busy, setBusy] = useState(false)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  useEffect(() => {
    let active = true
    mealService.getAll()
      .then((result) => { if (active) setMeals(result.filter((meal) => meal.isAvailable)) })
      .catch((e: unknown) => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [])

  useEffect(() => {
    if (!date) return
    let active = true
    catalogService.dailyMenu(date)
      .then((result) => { if (active) setMenu({ date, mealIds: result.map((meal) => Number(meal.id)) }) })
      .catch((e: unknown) => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [date])

  const selected = menu?.date === date ? menu.mealIds : null

  const toggle = (mealId: number) => {
    if (!selected) return
    setMessage('')
    setMenu({ date, mealIds: selected.includes(mealId) ? selected.filter((id) => id !== mealId) : [...selected, mealId] })
  }

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!selected) return
    setBusy(true)
    setMessage('')
    setError('')
    try {
      const result = await mealService.updateDailyMenu(date, selected)
      setMessage(result.message)
    } catch (e) {
      setError(errorMessage(e))
    }
    setBusy(false)
  }

  return (
    <form className={panelClass} onSubmit={(event) => void submit(event)}>
      <h2 className="text-xl font-bold text-forest-900">Thực đơn theo ngày</h2>
      <Feedback message={message} error={error} />
      <AccountField
        name="menuDate"
        label="Ngày phục vụ"
        type="date"
        min={today}
        value={date}
        onChange={(event) => { setDate(event.target.value); setMessage('') }}
        required
      />
      {!meals || !selected ? (
        !error && date && <p role="status">Đang tải…</p>
      ) : meals.length === 0 ? (
        <p>Chưa có món nào đang bán.</p>
      ) : (
        <>
          <fieldset className="space-y-2">
            <legend className="mb-2 text-sm font-semibold text-forest-900">Món phục vụ trong ngày ({selected.length})</legend>
            {meals.map((meal) => (
              <label key={meal.mealId} className="flex items-center gap-3 rounded-xl bg-cream-100 p-3 text-sm">
                <input type="checkbox" checked={selected.includes(meal.mealId)} onChange={() => toggle(meal.mealId)} />
                <span>{meal.name} · {meal.calories} kcal</span>
              </label>
            ))}
          </fieldset>
          <Button type="submit" disabled={busy}>{busy ? 'Đang lưu…' : 'Lưu thực đơn'}</Button>
        </>
      )}
    </form>
  )
}
