import { api } from '@/shared/services/httpClient'
import type { PendingPayment } from '../models/PendingPayment'

export const paymentService = {
  pending: () => api<PendingPayment[]>('/api/payments/pending'),
  confirm: (id: number, transactionCode: string) =>
    api<{ message: string }>(`/api/payments/${id}/confirm`, {
      method: 'POST',
      body: JSON.stringify({ transactionCode: transactionCode || null }),
    }),
}
