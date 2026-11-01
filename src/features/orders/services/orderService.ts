import { api } from '@/shared/services/httpClient'
import type { CreateOrderInput, MealOrder, Payment, Subscription } from '../models/Order'

export const orderService = {
  subscriptions: () => api<Subscription[]>('/api/subscriptions'),
  subscription: (id: string) => api<Subscription>(`/api/subscriptions/${id}`),
  createSubscription: (packageId: number, startDate: string) =>
    api<{ subscriptionId: number; paymentId: number; amount: number }>('/api/subscriptions', {
      method: 'POST',
      body: JSON.stringify({ packageId, startDate }),
    }),
  payments: () => api<Payment[]>('/api/payments'),
  orders: () => api<MealOrder[]>('/api/orders'),
  createOrder: (input: CreateOrderInput) =>
    api<{ orderId: number; remainingMeals: number }>('/api/orders', {
      method: 'POST',
      body: JSON.stringify(input),
    }),
  confirmReceived: (id: number) =>
    api<{ message: string }>(`/api/orders/${id}/received`, { method: 'POST' }),
}

/** Ngày theo giờ máy người dùng, dạng dùng được cho input type="date". */
export const toDateInput = (date: Date) =>
  new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, 10)

export const formatDate = (value: string) => new Date(value).toLocaleDateString('vi-VN')
