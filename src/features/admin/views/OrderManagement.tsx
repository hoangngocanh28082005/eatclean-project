import { useCallback, useEffect, useState } from 'react'
import { orderLabels } from '@/features/orders/data/orderLabels'
import { formatDate, toDateInput } from '@/features/orders/services/orderService'
import { Feedback, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import { errorMessage } from '@/shared/services/httpClient'
import type { ManagedOrder } from '../models/ManagedOrder'
import { orderManagementService } from '../services/orderManagementService'

const nextStep: Record<string, { status: string; label: string }> = {
  Pending: { status: 'Confirmed', label: 'Xác nhận đơn' },
  Confirmed: { status: 'Delivering', label: 'Bắt đầu giao' },
  Delivering: { status: 'Delivered', label: 'Đánh dấu đã giao' },
}

const fullAddress = (order: ManagedOrder) =>
  [order.addressLine, order.ward, order.district, order.city].filter(Boolean).join(', ')

export default function OrderManagement() {
  const [today] = useState(() => toDateInput(new Date()))
  const [orders, setOrders] = useState<ManagedOrder[] | null>(null)
  const [showDone, setShowDone] = useState(false)
  const [busyId, setBusyId] = useState<number | null>(null)
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setOrders(await orderManagementService.all())
    } catch (e) {
      setError(errorMessage(e))
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  const advance = async (order: ManagedOrder) => {
    setBusyId(order.orderId)
    setError('')
    try {
      await orderManagementService.updateStatus(order.orderId, nextStep[order.status].status)
    } catch (e) {
      setError(errorMessage(e))
    }
    await load()
    setBusyId(null)
  }

  const visible = orders?.filter((order) => (order.status in nextStep) !== showDone)

  return (
    <div className={panelClass}>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-xl font-bold text-forest-900">Đơn hàng</h2>
        <Button size="sm" variant="outline" onClick={() => setShowDone(!showDone)}>
          {showDone ? 'Xem đơn đang xử lý' : 'Xem đơn đã xong'}
        </Button>
      </div>
      <Feedback error={error} />
      {!visible ? (
        !error && <p role="status">Đang tải…</p>
      ) : visible.length === 0 ? (
        <p>{showDone ? 'Chưa có đơn nào đã xong.' : 'Không có đơn nào đang xử lý.'}</p>
      ) : (
        <ul className="space-y-4">
          {visible.map((order) => {
            const step = nextStep[order.status]
            const notDueYet = step?.status === 'Delivered' && order.deliveryDate.slice(0, 10) > today
            return (
              <li key={order.orderId} className="space-y-2 rounded-2xl bg-cream-100 p-4">
                <div className="flex flex-wrap justify-between gap-2">
                  <span className="font-bold">Đơn #{order.orderId} · {formatDate(order.deliveryDate)}{order.deliverySlot && ` · ${order.deliverySlot}`}</span>
                  <span className="text-sm font-semibold text-forest-700">{orderLabels[order.status] ?? order.status}</span>
                </div>
                <p className="text-sm">{order.items.map((item) => `${item.mealName} × ${item.quantity}`).join(', ')}</p>
                <p className="text-sm break-words">
                  Giao cho {order.recipientName} · {order.recipientPhone} · {fullAddress(order)}
                </p>
                <p className="text-sm break-words text-forest-900/70">Khách: {order.customerName} · {order.customerEmail}</p>
                {order.note && <p className="text-sm text-forest-900/70">Ghi chú: {order.note}</p>}
                {step && (
                  <Button size="sm" disabled={busyId !== null || notDueYet} onClick={() => void advance(order)}>
                    {busyId === order.orderId ? 'Đang cập nhật…' : step.label}
                  </Button>
                )}
                {notDueYet && <p className="text-sm text-forest-900/70">Bấm được từ ngày {formatDate(order.deliveryDate)}.</p>}
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
