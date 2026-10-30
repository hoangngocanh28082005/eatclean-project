import { useCallback, useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '@/features/accounts/context/AuthContext'
import { AccountField, Feedback, panelClass } from '@/shared/components/forms/AccountFields'
import Button from '@/shared/components/ui/Button'
import { errorMessage } from '@/shared/services/httpClient'
import { accountService } from '../services/accountService'
import { authService } from '../services/authService'
import type { Address, Order } from '../models/Account'

const orderLabels: Record<string, string> = { Pending: 'Chờ xác nhận', Confirmed: 'Đã xác nhận', Preparing: 'Đang chuẩn bị', Delivering: 'Đang giao', Delivered: 'Đã giao', Cancelled: 'Đã hủy' }
export default function AccountPage() {
  const { user, loading, error: sessionError, refresh, logout } = useAuth()
  const [addresses, setAddresses] = useState<Address[]>([])
  const [orders, setOrders] = useState<Order[]>([])
  const [editing, setEditing] = useState<Address | null>(null)
  const [formVersion, setFormVersion] = useState(0)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')
  const [busy, setBusy] = useState(false)
  const [dataLoading, setDataLoading] = useState(true)
  const [dataError, setDataError] = useState('')
  const [cooldown, setCooldown] = useState(0)
  const navigate = useNavigate()
  const loadData = useCallback(async () => {
    setDataError(''); setDataLoading(true)
    try {
      const [savedAddresses, savedOrders] = await Promise.all([accountService.addresses(), accountService.orders()])
      setAddresses(savedAddresses); setOrders(savedOrders)
    } catch (e) { setDataError(errorMessage(e)) }
    finally { setDataLoading(false) }
  }, [])
  const userId = user?.userId
  useEffect(() => { if (userId) void Promise.resolve().then(loadData) }, [userId, loadData])
  useEffect(() => {
    if (!cooldown) return
    const timer = window.setTimeout(() => setCooldown(value => value - 1), 1000)
    return () => window.clearTimeout(timer)
  }, [cooldown])
  const action = async (work: () => Promise<void>) => {
    setBusy(true); setError(''); setMessage('')
    try { await work() } catch (e) { setError(errorMessage(e)) } finally { setBusy(false) }
  }
  const form = (event: FormEvent<HTMLFormElement>) => { event.preventDefault(); return Object.fromEntries(new FormData(event.currentTarget).entries()) }
  if (loading) return <p role="status" className="p-12 text-center">Đang kiểm tra phiên đăng nhập…</p>
  if (sessionError) return <div className="mx-auto max-w-lg p-8"><Feedback error={sessionError} /><Button onClick={() => void refresh()}>Thử lại kết nối</Button></div>
  if (!user) return <section className="mx-auto max-w-lg space-y-5 p-8"><h1 className="text-2xl font-bold">Tài khoản của bạn</h1><p>Vui lòng đăng nhập để quản lý thông tin và địa chỉ.</p><Button to="/dang-nhap">Đăng nhập</Button><Link to="/dang-ky" className="ml-4 underline">Tạo tài khoản</Link></section>
  return <section className="bg-cream-100 px-4 py-12"><div className="mx-auto max-w-5xl space-y-7">
    <div className="flex flex-wrap items-start justify-between gap-4"><div><h1 className="text-3xl font-extrabold text-forest-900">Tài khoản của bạn</h1><p className="mt-2 text-forest-900/70">Xin chào, {user.fullName} · {user.role === 'Admin' ? 'Quản trị viên' : user.role === 'Staff' ? 'Nhân viên' : 'Khách hàng'}</p></div><Button variant="outline" disabled={busy} onClick={() => void action(async () => { await logout(); navigate('/dang-nhap') })}>Đăng xuất</Button></div>
    <Feedback error={error} message={message} />
    {!user.emailConfirmed && <div className={panelClass}><h2 className="text-xl font-bold">Xác minh email</h2><p>Email {user.email} chưa được xác minh. Hãy xác minh trước khi thêm hoặc sửa địa chỉ giao hàng.</p><p className="text-sm text-forest-900/70">Ở chế độ kiểm thử, mở liên kết trong tệp thư tại server/OffiMeal.Api/App_Data/mail. Khi cấu hình SMTP, thư sẽ được gửi tới hộp thư thật.</p><div className="flex flex-wrap gap-3"><Button disabled={busy || cooldown > 0} onClick={() => void action(async () => { const result = await authService.resendVerification(); setMessage(result.message); setCooldown(60) })}>{cooldown ? `Gửi lại sau ${cooldown}s` : 'Gửi lại thư xác minh'}</Button><Button variant="outline" disabled={busy} onClick={() => void refresh()}>Tôi đã xác minh, cập nhật trạng thái</Button></div></div>}
    <div className="grid items-start gap-7 lg:grid-cols-2">
      <form className={panelClass} key={user.fullName + user.phone} onSubmit={event => { const fields = form(event); void action(async () => { await accountService.update(fields); await refresh(); setMessage('Đã cập nhật thông tin cá nhân.') }) }}>
        <h2 className="text-xl font-bold">Thông tin cá nhân</h2>
        <p className="break-all text-sm">{user.email} · {user.emailConfirmed ? 'Đã xác minh' : 'Chưa xác minh'}</p>
        <AccountField name="fullName" label="Họ và tên" defaultValue={user.fullName} maxLength={100} autoComplete="name" required />
        <AccountField name="phone" label="Số điện thoại" type="tel" defaultValue={user.phone ?? ''} maxLength={20} autoComplete="tel" />
        <Button type="submit" disabled={busy}>Lưu thông tin</Button>
      </form>
      <form className={panelClass} onSubmit={event => {
        const fields = form(event)
        if (fields.password !== fields.confirmPassword) { setError('Mật khẩu xác nhận chưa trùng khớp.'); return }
        void action(async () => { await accountService.changePassword(fields); await refresh(); navigate('/dang-nhap?changed=1') })
      }}><h2 className="text-xl font-bold">Đổi mật khẩu</h2><AccountField name="currentPassword" label="Mật khẩu hiện tại" type="password" maxLength={128} autoComplete="current-password" required /><AccountField name="password" label="Mật khẩu mới (10–128 ký tự)" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /><AccountField name="confirmPassword" label="Xác nhận mật khẩu mới" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /><p className="text-sm text-forest-900/70">Đổi mật khẩu sẽ kết thúc tất cả các phiên đăng nhập hiện có.</p><Button type="submit" disabled={busy}>Đổi mật khẩu</Button></form>
    </div>
    <div className={panelClass}><h2 className="text-xl font-bold">Địa chỉ giao hàng</h2>
      {dataLoading ? <p role="status">Đang tải địa chỉ và đơn hàng…</p> : dataError ? <><Feedback error={dataError} /><Button onClick={() => void loadData()}>Tải lại dữ liệu</Button></> : <>
        {!addresses.length && <p>Bạn chưa có địa chỉ giao hàng.</p>}
        <ul className="grid gap-4 sm:grid-cols-2">{addresses.map(address => <li key={address.addressId} className="space-y-2 rounded-2xl border border-sage-200 p-4"><p className="font-bold">{address.recipientName} {address.isDefault && <span className="text-xs text-forest-600">· Mặc định</span>}</p><p className="text-sm">{address.recipientPhone}</p><p className="text-sm">{[address.addressLine, address.ward, address.district, address.city].filter(Boolean).join(', ')}</p>{address.note && <p className="text-sm text-forest-900/70">{address.note}</p>}<div className="flex gap-4"><button type="button" disabled={busy || !user.emailConfirmed} className="font-semibold underline disabled:opacity-50" onClick={() => { setEditing(address); setFormVersion(v => v + 1) }}>Sửa</button><button type="button" disabled={busy || !user.emailConfirmed} className="font-semibold text-red-700 underline disabled:opacity-50" onClick={() => { if (window.confirm('Xóa địa chỉ giao hàng này?')) void action(async () => { await accountService.deleteAddress(address.addressId); if (editing?.addressId === address.addressId) { setEditing(null); setFormVersion(v => v + 1) }; await loadData(); setMessage('Đã xóa địa chỉ.') }) }}>Xóa</button></div></li>)}</ul>
      </>}
      {user.emailConfirmed && <form key={formVersion} className="grid gap-4 border-t border-sage-200 pt-5 sm:grid-cols-2" onSubmit={event => {
        const fields = form(event)
        void action(async () => { await accountService.saveAddress(editing?.addressId ?? null, fields); setEditing(null); setFormVersion(v => v + 1); await loadData(); setMessage('Đã lưu địa chỉ giao hàng.') })
      }}><h3 className="font-bold sm:col-span-2">{editing ? 'Cập nhật địa chỉ' : 'Thêm địa chỉ mới'}</h3><AccountField name="recipientName" label="Tên người nhận" defaultValue={editing?.recipientName ?? user.fullName} maxLength={100} required /><AccountField name="recipientPhone" label="Điện thoại người nhận" type="tel" defaultValue={editing?.recipientPhone ?? user.phone ?? ''} maxLength={20} required /><AccountField name="addressLine" label="Số nhà, đường" defaultValue={editing?.addressLine} maxLength={300} required /><AccountField name="ward" label="Phường/xã" defaultValue={editing?.ward ?? ''} maxLength={100} /><AccountField name="district" label="Quận/huyện (nếu có)" defaultValue={editing?.district ?? ''} maxLength={100} /><AccountField name="city" label="Tỉnh/thành phố" defaultValue={editing?.city} maxLength={100} required /><AccountField name="note" label="Ghi chú giao hàng" defaultValue={editing?.note ?? ''} maxLength={300} /><label className="flex items-center gap-2 text-sm"><input name="isDefault" type="checkbox" defaultChecked={editing?.isDefault} />Đặt làm địa chỉ mặc định</label><div className="flex gap-3 sm:col-span-2"><Button type="submit" disabled={busy}>Lưu địa chỉ</Button>{editing && <Button variant="outline" type="button" onClick={() => { setEditing(null); setFormVersion(v => v + 1) }}>Hủy sửa</Button>}</div></form>}
    </div>
    <div className={panelClass}><h2 className="text-xl font-bold">Đơn hàng của bạn</h2>{dataLoading ? <p>Đang tải…</p> : dataError ? <p>Chưa tải được đơn hàng. Vui lòng thử lại ở phần địa chỉ phía trên.</p> : orders.length ? <ul className="space-y-3">{orders.map(order => <li key={order.orderId} className="flex flex-wrap justify-between gap-2 rounded-xl bg-cream-100 p-4"><span>Đơn #{order.orderId} · {new Date(order.deliveryDate).toLocaleDateString('vi-VN')}</span><span>{orderLabels[order.status] ?? order.status} · {order.totalAmount.toLocaleString('vi-VN')}đ</span></li>)}</ul> : <p>Bạn chưa có đơn hàng.</p>}</div>
    {user.role === 'Admin' && <Button to="/quan-tri">Kiểm tra quyền quản trị</Button>}
  </div></section>
}
