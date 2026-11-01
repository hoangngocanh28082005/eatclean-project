import { useEffect, useState, type FormEvent } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import type { Address } from '@/features/accounts/models/Account'
import { accountService } from '@/features/accounts/services/accountService'
import type { MenuMeal } from '@/features/catalog/models/Meal'
import { catalogService } from '@/features/catalog/services/catalogService'
import { AccountField, Feedback, fieldClass, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import { errorMessage } from '@/shared/services/httpClient'
import type { Subscription } from '../models/Order'
import { orderService, toDateInput } from '../services/orderService'

interface FormData {
  subscription: Subscription
  meals: MenuMeal[]
  addresses: Address[]
}

export default function OrderMealPage() {
  const { subscriptionId = '' } = useParams()
  const navigate = useNavigate()
  const [data, setData] = useState<FormData | null>(null)
  const [error, setError] = useState('')
  const [busy, setBusy] = useState(false)
  const [deliveryDate, setDeliveryDate] = useState('')
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
    Promise.all([orderService.subscription(subscriptionId), catalogService.meals(), accountService.addresses()])
      .then(([subscription, meals, addresses]) => {
        if (!active) return
        setData({ subscription, meals, addresses })
        setMealId(meals[0]?.id ?? '')
        setAddressId(String(addresses[0]?.addressId ?? ''))
      })
      .catch((e: unknown) => { if (active) setError(errorMessage(e)) })
    return () => { active = false }
  }, [subscriptionId])

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
            <label className="block text-sm font-semibold text-forest-900">
              <span className="mb-2 block">Món</span>
              <select value={mealId} onChange={(event) => setMealId(event.target.value)} className={fieldClass} required>
                {data.meals.map((meal) => (
                  <option key={meal.id} value={meal.id}>{meal.name} · {meal.calories} kcal</option>
                ))}
              </select>
            </label>
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
            <Button type="submit" disabled={busy} className="w-full">{busy ? 'Đang đặt…' : 'Đặt bữa'}</Button>
          </form>
        )}
      </div>
    </section>
  )
}
