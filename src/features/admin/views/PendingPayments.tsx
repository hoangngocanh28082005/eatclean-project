import { useCallback, useEffect, useState } from 'react'
import { formatPrice } from '@/features/catalog/data/labels'
import { formatDate } from '@/features/orders/services/orderService'
import { Feedback, fieldClass, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import { errorMessage } from '@/shared/services/httpClient'
import type { PendingPayment } from '../models/PendingPayment'
import { paymentService } from '../services/paymentService'

export default function PendingPayments() {
  const [payments, setPayments] = useState<PendingPayment[] | null>(null)
  const [codes, setCodes] = useState<Record<number, string>>({})
  const [busyId, setBusyId] = useState<number | null>(null)
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')

  const load = useCallback(async () => {
    try {
      setPayments(await paymentService.pending())
    } catch (e) {
      setError(errorMessage(e))
    }
  }, [])

  useEffect(() => {
    void Promise.resolve().then(load)
  }, [load])

  const confirm = async (payment: PendingPayment) => {
    if (!window.confirm(`Xác nhận đã nhận ${formatPrice(payment.amount)} với nội dung OFFIMEAL${payment.paymentId}? Gói của khách sẽ được kích hoạt.`)) return
    setBusyId(payment.paymentId)
    setMessage('')
    setError('')
    try {
      const result = await paymentService.confirm(payment.paymentId, codes[payment.paymentId]?.trim() ?? '')
      setMessage(`OFFIMEAL${payment.paymentId}: ${result.message}`)
    } catch (e) {
      setError(errorMessage(e))
    }
    await load()
    setBusyId(null)
  }

  return (
    <div className={panelClass}>
      <h2 className="text-xl font-bold text-forest-900">Thanh toán chờ xác nhận</h2>
      <Feedback message={message} error={error} />
      {!payments ? (
        !error && <p role="status">Đang tải…</p>
      ) : payments.length === 0 ? (
        <p>Không có khoản nào đang chờ xác nhận.</p>
      ) : (
        <ul className="space-y-4">
          {payments.map((payment) => (
            <li key={payment.paymentId} className="space-y-3 rounded-2xl bg-cream-100 p-4">
              <div className="flex flex-wrap justify-between gap-2">
                <span className="font-bold">OFFIMEAL{payment.paymentId}</span>
                <span className="font-bold text-forest-700">{formatPrice(payment.amount)}</span>
              </div>
              <p className="text-sm break-words">
                {payment.packageName ?? 'Đơn lẻ'} · {payment.customerName} · {payment.customerEmail}
                {payment.customerPhone && ` · ${payment.customerPhone}`} · Tạo ngày {formatDate(payment.createdAt)}
              </p>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  aria-label={`Mã giao dịch ngân hàng của OFFIMEAL${payment.paymentId}`}
                  placeholder="Mã giao dịch ngân hàng (không bắt buộc)"
                  maxLength={150}
                  className={fieldClass}
                  value={codes[payment.paymentId] ?? ''}
                  onChange={(event) => setCodes((previous) => ({ ...previous, [payment.paymentId]: event.target.value }))}
                />
                <Button size="sm" disabled={busyId !== null} onClick={() => void confirm(payment)}>
                  {busyId === payment.paymentId ? 'Đang xác nhận…' : 'Xác nhận đã nhận tiền'}
                </Button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  )
}
