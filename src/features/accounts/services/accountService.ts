import { api } from '@/shared/services/httpClient'
import type { AccountUser, Address, FormValues, MessageResponse, Order } from '../models/Account'

export const accountService = {
  addresses: () => api<Address[]>('/api/account/addresses'),
  orders: () => api<Order[]>('/api/account/orders'),
  update: (fields: FormValues) => api<AccountUser>('/api/account/me', { method: 'PUT', body: JSON.stringify(fields) }),
  changePassword: (fields: FormValues) => api<MessageResponse>('/api/account/change-password', { method: 'POST', body: JSON.stringify(fields) }),
  saveAddress: (id: number | null, fields: FormValues) => api<Address>('/api/account/addresses' + (id === null ? '' : `/${id}`), {
    method: id === null ? 'POST' : 'PUT', body: JSON.stringify({ ...fields, isDefault: fields.isDefault === 'on' }),
  }),
  deleteAddress: (id: number) => api<void>(`/api/account/addresses/${id}`, { method: 'DELETE' }),
}
