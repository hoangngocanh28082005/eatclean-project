import { api } from '@/shared/services/httpClient'
import type { ManagedOrder } from '../models/ManagedOrder'

export const orderManagementService = {
  all: () => api<ManagedOrder[]>('/api/orders/manage'),
  updateStatus: (id: number, status: string) =>
    api<{ message: string }>(`/api/orders/${id}/status`, {
      method: 'PATCH',
      body: JSON.stringify({ status }),
    }),
}
