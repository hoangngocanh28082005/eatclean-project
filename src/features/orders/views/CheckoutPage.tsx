import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useAuth } from '@/features/accounts/context/AuthContext'
import { formatPrice } from '@/features/catalog/data/labels'
import type { MealPackage } from '@/features/catalog/models/MealPackage'
import { catalogService } from '@/features/catalog/services/catalogService'
import { AccountField, Feedback, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import { errorMessage } from '@/shared/services/httpClient'
import { orderService, toDateInput } from '../services/orderService'

export default function CheckoutPage() {
  const { packageId = '' } = useParams()
  const { user, loading } = useAuth()
  const navigate = useNavigate()
  const [today] = useState(() => toDateInput(new Date()))
  const [item, setItem] = useState<MealPackage | null>(null)
  const [startDate, setStartDate] = useState(today)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)

  useEffect(() => {
    let active = true
    catalogService.packageById(packageId)
      .then((result) => { if (active) setItem(result) })
      .catch((e: unknown) => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [packageId])

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!item) return
    setBusy(true)
    setError('')
    try {
      await orderService.createSubscription(item.id, startDate)
      navigate('/don-hang')
    } catch (e) {
      setError(errorMessage(e))
      setBusy(false)
    }
  }

  return (
    <section className="bg-cream-100 px-4 py-12">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-3xl font-extrabold text-forest-900">Đăng ký gói ăn</h1>
        <Feedback error={error} />
        {loading || (!item && !error) ? (
          <p role="status">Đang tải…</p>
        ) : !item ? (
          <Button to="/goi-an" variant="outline">Về trang gói ăn</Button>
        ) : !user ? (
          <div className={panelClass}>
            <p>Vui lòng đăng nhập để đăng ký {item.name}.</p>
            <Button to="/dang-nhap">Đăng nhập</Button>
          </div>
        ) : !user.emailConfirmed ? (
          <div className={panelClass}>
            <p>Bạn cần xác minh email trước khi đăng ký gói.</p>
            <Button to="/tai-khoan">Đến trang tài khoản</Button>
          </div>
        ) : (
          <form className={panelClass} onSubmit={(event) => void submit(event)}>
            <div>
              <h2 className="text-xl font-bold text-forest-900">{item.name}</h2>
              <p className="text-sm text-forest-900/70">{item.mealCount} bữa trong {item.durationDays} ngày</p>
            </div>
            <AccountField
              name="startDate"
              label="Ngày bắt đầu"
              type="date"
              min={today}
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
            <div className="flex items-center justify-between border-t border-sage-200 pt-4">
              <span className="font-semibold">Tổng tiền</span>
              <span className="text-2xl font-extrabold text-forest-700">{formatPrice(item.price)}</span>
            </div>
            <p className="text-sm text-forest-900/70">Thanh toán bằng chuyển khoản. Gói được kích hoạt sau khi OffiMeal xác nhận đã nhận tiền, rồi bạn chọn món và ngày giao.</p>
            <Button type="submit" disabled={busy} className="w-full">{busy ? 'Đang tạo…' : 'Xác nhận đăng ký'}</Button>
          </form>
        )}
      </div>
    </section>
  )
}
