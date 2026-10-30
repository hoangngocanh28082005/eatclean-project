import { useEffect, useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Button from '@/shared/components/ui/Button'
import { useAuth } from '@/features/accounts/context/AuthContext'
import { AccountField, Feedback, panelClass } from '@/shared/components/forms/AccountFields'
import { errorMessage } from '@/shared/services/httpClient'
import { authService } from '../services/authService'
import type { AuthMode } from '../models/Account'

type Mode = AuthMode
const titles: Record<Mode, string> = { login: 'Đăng nhập', register: 'Tạo tài khoản OffiMeal', forgot: 'Quên mật khẩu', reset: 'Đặt lại mật khẩu', verify: 'Xác minh email' }
export default function AuthPage({ mode }: { mode: Mode }) {
  const [token] = useState(() => new URLSearchParams(window.location.hash.slice(1)).get('token') ?? '')
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState(() => mode === 'login' && new URLSearchParams(window.location.search).has('changed') ? 'Đã đổi mật khẩu. Vui lòng đăng nhập lại.' : '')
  const [done, setDone] = useState(false)
  const [localMail, setLocalMail] = useState(false)
  const { refresh } = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (window.location.hash) window.history.replaceState(null, '', window.location.pathname + window.location.search)
    void authService.deliveryMode().then(result => setLocalMail(result.localMail)).catch(() => {})
  }, [])
  const submit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault(); setError(''); setMessage(''); setBusy(true)
    const fields = Object.fromEntries(new FormData(event.currentTarget).entries())
    if (['register', 'reset'].includes(mode) && fields.password !== fields.confirmPassword) {
      setError('Mật khẩu xác nhận chưa trùng khớp.'); setBusy(false); return
    }
    try {
      const result = await authService.submit(mode, fields, token)
      if (mode === 'login') { await refresh(); navigate('/tai-khoan', { replace: true }) }
      else {
        setMessage(result.message ?? 'Đã hoàn tất yêu cầu.')
        if (mode === 'reset' || mode === 'verify' || mode === 'register') setDone(true)
        if (mode === 'verify') await refresh()
      }
    } catch (e) { setError(errorMessage(e)) }
    finally { setBusy(false) }
  }
  return <section className="bg-cream-100 px-4 py-12 sm:py-16"><div className="mx-auto max-w-lg">
    <h1 className="mb-3 text-3xl font-extrabold text-forest-900">{titles[mode]}</h1>
    <p className="mb-8 text-sm text-forest-900/70">{mode === 'verify' ? 'Bấm xác nhận để xác minh email. Liên kết có hiệu lực 24 giờ và chỉ dùng một lần.' : mode === 'reset' ? 'Liên kết khôi phục có hiệu lực 30 phút và chỉ dùng một lần.' : 'Quản lý thông tin cá nhân và địa chỉ giao hàng của bạn.'}</p>
    <form onSubmit={submit} className={panelClass}>
      <Feedback error={error} message={message} />
      {(!done || mode === 'login' || mode === 'forgot') && <>
        {mode === 'register' && <AccountField name="fullName" label="Họ và tên" autoComplete="name" maxLength={100} required />}
        {['register', 'login', 'forgot'].includes(mode) && <AccountField name="email" label="Email" type="email" autoComplete="email" maxLength={255} required />}
        {['register', 'login', 'reset'].includes(mode) && <AccountField name="password" label={mode === 'reset' ? 'Mật khẩu mới' : 'Mật khẩu'} type="password" minLength={mode === 'login' ? 1 : 10} maxLength={128} autoComplete={mode === 'login' ? 'current-password' : 'new-password'} required />}
        {['register', 'reset'].includes(mode) && <><AccountField name="confirmPassword" label="Xác nhận mật khẩu" type="password" minLength={10} maxLength={128} autoComplete="new-password" required /><p className="text-xs text-forest-900/70">Dùng mật khẩu từ 10 đến 128 ký tự.</p></>}
        {['verify', 'reset'].includes(mode) && !token && <p role="alert" className="text-sm text-red-800">Thiếu mã xác nhận. Vui lòng mở đầy đủ liên kết trong thư.</p>}
        <Button type="submit" className="w-full" disabled={busy || (['reset', 'verify'].includes(mode) && !token)}>{busy ? 'Đang xử lý…' : mode === 'forgot' ? 'Gửi hướng dẫn khôi phục' : mode === 'verify' ? 'Xác nhận email' : titles[mode]}</Button>
      </>}
      <div className="flex flex-wrap gap-4 text-sm font-semibold text-forest-700">
        {mode !== 'login' && <Link to="/dang-nhap" className="underline">Đăng nhập</Link>}
        {mode === 'login' && <><Link to="/dang-ky" className="underline">Tạo tài khoản</Link><Link to="/quen-mat-khau" className="underline">Quên mật khẩu?</Link></>}
        {mode === 'verify' && done && <Link to="/tai-khoan" className="underline">Về tài khoản</Link>}
      </div>
    </form>
    {localMail && <p className="mt-5 rounded-2xl bg-white p-4 text-sm text-forest-900/70">Chế độ kiểm thử: thư được lưu trong thư mục <code>server/OffiMeal.Api/App_Data/mail</code>, chưa gửi tới hộp thư thật. Mở trường <code>link</code> trong tệp thư để xác minh hoặc khôi phục.</p>}
  </div></section>
}
