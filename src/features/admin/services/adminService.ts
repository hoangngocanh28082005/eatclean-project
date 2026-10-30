import { api } from '@/shared/services/httpClient'

export const adminService = {
  checkAccess: () => api<{ message: string }>('/api/admin/access'),
}
