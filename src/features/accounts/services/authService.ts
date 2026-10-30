import { api } from '@/shared/services/httpClient'
import type { AccountUser, AuthMode, FormValues, MessageResponse } from '../models/Account'

const authPaths: Record<AuthMode, string> = {
  login: 'login', register: 'register', forgot: 'forgot-password', reset: 'reset-password', verify: 'verify-email',
}

export const authService = {
  currentUser: () => api<AccountUser>('/api/account/me'),
  logout: () => api<MessageResponse>('/api/auth/logout', { method: 'POST' }),
  deliveryMode: () => api<{ localMail: boolean }>('/api/auth/delivery-mode'),
  submit: (mode: AuthMode, fields: FormValues, token: string) =>
    api<Partial<MessageResponse>>('/api/auth/' + authPaths[mode], { method: 'POST', body: JSON.stringify({ ...fields, token }) }),
  resendVerification: () => api<MessageResponse>('/api/auth/resend-verification', { method: 'POST' }),
}
