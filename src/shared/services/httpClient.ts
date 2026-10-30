export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) { super(message); this.status = status }
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const headers = new Headers(options.headers)
  if (options.body) headers.set('Content-Type', 'application/json')
  if (options.method && !['GET', 'HEAD'].includes(options.method.toUpperCase())) {
    const csrfResponse = await fetch('/api/auth/csrf', { credentials: 'same-origin', cache: 'no-store' })
    if (!csrfResponse.ok) throw new ApiError('Không lấy được phiên bảo mật. Kiểm tra backend và thử lại.', csrfResponse.status)
    if (!csrfResponse.headers.get('content-type')?.includes('json')) throw new ApiError('Chưa kết nối đúng API. Hãy khởi động backend và khởi động lại npm run dev.', 502)
    const { token } = await csrfResponse.json() as { token: string }
    headers.set('X-CSRF-TOKEN', token)
  }
  const response = await fetch(path, { ...options, headers, credentials: 'same-origin', cache: 'no-store' })
  if (response.status === 204) return undefined as T
  if (!response.headers.get('content-type')?.includes('json')) throw new ApiError('Chưa kết nối đúng API. Hãy khởi động backend và khởi động lại npm run dev.', 502)
  const data = await response.json().catch(() => null)
  if (!response.ok) throw new ApiError(data?.message ?? (response.status === 401 ? 'Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.' : response.status === 403 ? 'Bạn chưa có quyền thực hiện thao tác này. Hãy kiểm tra trạng thái xác minh email.' : response.status === 429 ? 'Bạn gửi yêu cầu quá nhiều lần. Vui lòng thử lại sau.' : 'Không thể xử lý yêu cầu. Kiểm tra kết nối backend và thử lại.'), response.status)
  return data as T
}

export const errorMessage = (error: unknown) => error instanceof ApiError ? error.message : 'Không kết nối được máy chủ. Kiểm tra backend và thử lại.'
