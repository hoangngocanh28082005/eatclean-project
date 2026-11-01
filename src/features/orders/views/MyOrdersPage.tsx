import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/features/accounts/context/AuthContext'
import { formatPrice } from '@/features/catalog/data/labels'
import { Feedback, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import { errorMessage } from '@/shared/services/httpClient'
import BankTransferPanel from '../components/BankTransferPanel'
import { orderLabels } from '../data/orderLabels'
import type { MealOrder, Payment, Subscription } from '../models/Order'
import { formatDate, orderService } from '../services/orderService'

const subscriptionLabels: Record<string, string> = {
  Pending: 'Chờ thanh toán',
  Active: 'Đang hoạt động',
  Paused: 'Tạm dừng',
  Completed: 'Đã kết thúc',
  Cancelled: 'Đã hủy',
}

interface OrdersData {
  subscriptions: Subscription[]
  payments: Payment[]
  orders: MealOrder[]
}

export default function MyOrdersPage() {
  const { user, loading } = useAuth()
  const [data, setData] = useState<OrdersData | null>(null)
  const [error, setError] = useState('')
  const [actionError, setActionError] = useState('')
  const [busyOrderId, setBusyOrderId] = useState<number | null>(null)

  const load = useCallback(async () => {
    setError('')
    try {
      const [subscriptions, payments, orders] = await Promise.all([orderService.subscriptions(), orderService.payments(), orderService.orders()])
      setData({ subscriptions, payments, orders })
    } catch (e) {
      setError(errorMessage(e))
    }
  }, [])

  const userId = user?.userId
  useEffect(() => {
    if (userId) void Promise.resolve().then(load)
  }, [userId, load])

  if (loading) return <p role="status" className="p-12 text-center">Đang kiểm tra phiên đăng nhập…</p>
  if (!user) {
    return (
      <section className="mx-auto max-w-lg space-y-5 p-8">
        <h1 className="text-2xl font-bold">Đơn hàng của bạn</h1>
        <p>Vui lòng đăng nhập để xem gói ăn và đơn hàng.</p>
        <Button to="/dang-nhap">Đăng nhập</Button>
      </section>
    )
  }

  const pendingPayment = (subscription: Subscription) =>
    data?.payments.find((payment) => payment.subscriptionId === subscription.subscriptionId && payment.status === 'Pending')

  const confirmReceived = async (orderId: number) => {
    setBusyOrderId(orderId)
    setActionError('')
    try {
      await orderService.confirmReceived(orderId)
    } catch (e) {
      setActionError(errorMessage(e))
    }
    await load()
    setBusyOrderId(null)
  }

  return (
    <section className="bg-cream-100 px-4 py-12">
      <div className="mx-auto max-w-4xl space-y-7">
        <h1 className="text-3xl font-extrabold text-forest-900">Đơn hàng của bạn</h1>
        {error ? (
          <div className="space-y-4">
            <Feedback error={error} />
            <Button onClick={() => void load()}>Thử lại</Button>
          </div>
        ) : !data ? (
          <p role="status">Đang tải…</p>
        ) : (
          <>
            <div className={panelClass}>
              <h2 className="text-xl font-bold">Gói ăn</h2>
              {data.subscriptions.length ? (
                <ul className="space-y-4">
                  {data.subscriptions.map((subscription) => {
                    const payment = pendingPayment(subscription)
                    return (
                      <li key={subscription.subscriptionId} className="space-y-2 rounded-2xl bg-cream-100 p-4">
                        <div className="flex flex-wrap justify-between gap-2">
                          <span className="font-bold">{subscription.packageName}</span>
                          <span className="text-sm font-semibold text-forest-700">{subscriptionLabels[subscription.status] ?? subscription.status}</span>
                        </div>
                        <p className="text-sm">
                          {formatDate(subscription.startDate)} – {formatDate(subscription.endDate)} · Còn {subscription.remainingMeals}/{subscription.mealCount} bữa · {formatPrice(subscription.totalPrice)}
                        </p>
                        {payment && <BankTransferPanel payment={payment} />}
                        {subscription.status === 'Active' && subscription.remainingMeals > 0 && (
                          <Button to={`/don-hang/dat-bua/${subscription.subscriptionId}`} size="sm">Đặt bữa</Button>
                        )}
                      </li>
                    )
                  })}
                </ul>
              ) : (
                <>
                  <p>Bạn chưa đăng ký gói ăn nào.</p>
                  <Button to="/goi-an">Xem các gói ăn</Button>
                </>
              )}
            </div>

            <div className={panelClass}>
              <h2 className="text-xl font-bold">Lịch giao</h2>
              <Feedback error={actionError} />
              {data.orders.length ? (
                <ul className="space-y-3">
                  {data.orders.map((order) => (
                    <li key={order.orderId} className="space-y-2 rounded-xl bg-cream-100 p-4">
                      <div className="flex flex-wrap justify-between gap-2">
                        <span className="font-semibold">Đơn #{order.orderId} · {formatDate(order.deliveryDate)}</span>
                        <span className="text-sm">{orderLabels[order.status] ?? order.status}</span>
                      </div>
                      <p className="text-sm">{order.items.map((item) => `${item.mealName} × ${item.quantity}`).join(', ')}</p>
                      {order.note && <p className="text-sm text-forest-900/70">Ghi chú: {order.note}</p>}
                      {order.status === 'Delivering' && (
                        <Button size="sm" disabled={busyOrderId !== null} onClick={() => void confirmReceived(order.orderId)}>
                          {busyOrderId === order.orderId ? 'Đang xác nhận…' : 'Đã nhận hàng'}
                        </Button>
                      )}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>Bạn chưa đặt bữa nào.</p>
              )}
            </div>
          </>
        )}
      </div>
    </section>
  )
}
