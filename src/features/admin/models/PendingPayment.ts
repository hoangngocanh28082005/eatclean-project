export interface PendingPayment {
  paymentId: number
  subscriptionId: number | null
  packageName: string | null
  customerName: string
  customerEmail: string
  customerPhone: string | null
  amount: number
  createdAt: string
}
