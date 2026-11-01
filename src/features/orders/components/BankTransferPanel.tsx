import { formatPrice } from '@/features/catalog/data/labels'
import { bankAccount } from '../data/bankAccount'
import type { Payment } from '../models/Order'

export default function BankTransferPanel({ payment }: { payment: Payment }) {
  const content = `OFFIMEAL${payment.paymentId}`
  const { bankCode, bankName, accountNumber, accountName } = bankAccount

  if (!bankCode || !accountNumber) {
    return (
      <p role="alert" className="rounded-xl bg-red-50 p-4 text-sm text-red-800">
        OffiMeal chưa cấu hình tài khoản nhận tiền. Vui lòng chưa chuyển khoản và liên hệ OffiMeal.
      </p>
    )
  }

  const query = new URLSearchParams({ amount: String(Math.round(payment.amount)), addInfo: content, accountName })
  const rows = [
    ['Ngân hàng', bankName],
    ['Số tài khoản', accountNumber],
    ['Chủ tài khoản', accountName],
    ['Số tiền', formatPrice(payment.amount)],
    ['Nội dung', content],
  ]

  return (
    <div className="flex flex-col gap-4 rounded-xl bg-white p-4 sm:flex-row sm:items-center">
      <img
        src={`https://img.vietqr.io/image/${bankCode}-${accountNumber}-compact2.png?${query}`}
        alt={`Mã QR chuyển khoản ${formatPrice(payment.amount)}, nội dung ${content}`}
        className="mx-auto h-52 w-52 shrink-0 object-contain"
      />
      <div className="min-w-0 flex-1 space-y-3">
        <dl className="space-y-1 text-sm">
          {rows.map(([label, value]) => (
            <div key={label} className="flex justify-between gap-4">
              <dt className="text-forest-900/70">{label}</dt>
              <dd className="text-right font-semibold break-all">{value}</dd>
            </div>
          ))}
        </dl>
        <p className="text-sm text-forest-900/70">Quét mã bằng ứng dụng ngân hàng hoặc chuyển khoản đúng nội dung trên. Gói được kích hoạt sau khi OffiMeal xác nhận đã nhận tiền.</p>
      </div>
    </div>
  )
}
