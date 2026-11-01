import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Address } from '@/features/accounts/models/Account'
import { accountService } from '@/features/accounts/services/accountService'
import { formatNutrition } from '@/features/catalog/data/labels'
import type { MenuMeal } from '@/features/catalog/models/Meal'
import { catalogService } from '@/features/catalog/services/catalogService'
import { AccountField, Feedback, fieldClass, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import { errorMessage } from '@/shared/services/httpClient'
import type { Subscription } from '../models/Order'
import { orderService, toDateInput } from '../services/orderService'

interface FormData {
  subscription: Subscription
  addresses: Address[]
}

export default function OrderMealPage() {
  const { subscriptionId = '' } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<FormData | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState('')
  const [menu, setMenu] = useState<{ date: string; meals: MenuMeal[] } | null>(null)
  const [mealId, setMealId] = useState('')
  const [addressId, setAddressId] = useState('')
  const [note, setNote] = useState('')
  const [earliest] = useState(() => {
    const tomorrow = new Date()
    tomorrow.setDate(tomorrow.getDate() + 1)
    return toDateInput(tomorrow)
  })

  useEffect(() => {
    let active = true
    Promise.all([orderService.subscription(subscriptionId), accountService.addresses()])
      .then(([subscription, addresses]) => {
        if (!active) return
        setData({ subscription, addresses })
        setAddressId(String(addresses[0]?.addressId ?? ''))
      })
      .catch((e: unknown) => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [subscriptionId])

  useEffect(() => {
    if (!deliveryDate) return
    let active = true
    catalogService.dailyMenu(deliveryDate)
      .then((meals) => {
        if (!active) return
        setMenu({ date: deliveryDate, meals })
        setMealId(meals[0]?.id ?? '')
        setError('')
      })
      .catch((e: unknown) => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [deliveryDate])

  const meals = menu?.date === deliveryDate ? menu.meals : null

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    if (!data) return
    setBusy(true)
    setError('')
    try {
      await orderService.createOrder({
        subscriptionId: data.subscription.subscriptionId,
        addressId: Number(addressId),
        deliveryDate,
        note,
        items: [{ mealId: Number(mealId), quantity: 1 }],
      })
      navigate('/don-hang')
    } catch (e) {
      setError(errorMessage(e))
      setBusy(false)
    }
  }

  const startDate = data?.subscription.startDate.slice(0, 10) ?? ''

  return (
    <section className="bg-cream-100 px-4 py-12">
      <div className="mx-auto max-w-xl space-y-6">
        <h1 className="text-3xl font-extrabold text-forest-900">Đặt bữa trong gói</h1>
        <Feedback error={error} />
        {!data ? (
          !error && <p role="status">Đang tải…</p>
        ) : !data.addresses.length ? (
          <div className={panelClass}>
            <p>Bạn cần thêm địa chỉ giao hàng trước khi đặt bữa.</p>
            <Button to="/tai-khoan">Thêm địa chỉ</Button>
          </div>
        ) : (
          <form className={panelClass} onSubmit={(event) => void submit(event)}>
            <p className="font-semibold">{data.subscription.packageName} · Còn {data.subscription.remainingMeals} bữa</p>
            <AccountField
              name="deliveryDate"
              label="Ngày giao"
              type="date"
              min={startDate > earliest ? startDate : earliest}
              max={data.subscription.endDate.slice(0, 10)}
              value={deliveryDate}
              onChange={(event) => setDeliveryDate(event.target.value)}
              required
            />
            {!deliveryDate ? (
              <p className="text-sm text-forest-900/70">Chọn ngày giao để xem thực đơn của ngày đó.</p>
            ) : !meals ? (
              !error && <p role="status">Đang tải thực đơn…</p>
            ) : meals.length ? (
              <label className="block text-sm font-semibold text-forest-900">
                <span className="mb-2 block">Món</span>
                <select value={mealId} onChange={(event) => setMealId(event.target.value)} className={fieldClass} required>
                  {meals.map((meal) => (
                    <option key={meal.id} value={meal.id}>{meal.name} · {formatNutrition(meal.calories, 'kcal')}</option>
                  ))}
                </select>
              </label>
            ) : (
              <p className="text-sm text-forest-900/70">Ngày này chưa có thực đơn. Vui lòng chọn ngày khác.</p>
            )}
            <label className="block text-sm font-semibold text-forest-900">
              <span className="mb-2 block">Địa chỉ giao</span>
              <select value={addressId} onChange={(event) => setAddressId(event.target.value)} className={fieldClass} required>
                {data.addresses.map((address) => (
                  <option key={address.addressId} value={address.addressId}>
                    {address.recipientName} · {[address.addressLine, address.ward, address.district, address.city].filter(Boolean).join(', ')}
                  </option>
                ))}
              </select>
            </label>
            <AccountField name="note" label="Ghi chú" maxLength={500} value={note} onChange={(event) => setNote(event.target.value)} />
            <Button type="submit" disabled={busy || !meals?.length} className="w-full">{busy ? 'Đang đặt…' : 'Đặt bữa'}</Button>
          </form>
        )}
      </div>
    </section>
  )
}
