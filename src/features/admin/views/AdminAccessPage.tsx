import { useEffect, useState } from 'react'
import { useAuth } from '@/features/accounts/context/AuthContext'
import { errorMessage } from '@/shared/services/httpClient'
import { adminService } from '../services/adminService'
import { Feedback } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
export default function AdminAccessPage() {
  const { user, loading } = useAuth()
  const [message, setMessage] = useState('')
  const [error, setError] = useState('')
  useEffect(() => { if (user?.role === 'Admin') void adminService.checkAccess().then(r => setMessage(r.message)).catch(e => setError(errorMessage(e))) }, [user?.role])
  return <section className="mx-auto max-w-2xl space-y-5 px-4 py-12"><h1 className="text-3xl font-bold">Quyền quản trị</h1>{loading ? <p>Đang kiểm tra…</p> : user?.role !== 'Admin' ? <p>Bạn cần tài khoản quản trị viên để truy cập khu vực này.</p> : <><Feedback message={message} error={error} /><p>Quyền được xác nhận bởi backend. Các màn hình quản lý món và đơn hàng sẽ được bổ sung theo phân công.</p></>}<Button to="/tai-khoan">Về tài khoản</Button></section>
}
