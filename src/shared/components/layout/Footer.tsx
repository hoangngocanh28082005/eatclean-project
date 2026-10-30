import { Link } from 'react-router-dom'
import { ArrowRight } from 'lucide-react'
import BrandLogo from '@/shared/components/ui/BrandLogo'
import { navLinks } from '@/shared/data/navigation'

const currentYear = new Date().getFullYear()

type IconProps = { className?: string }

function FacebookIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M13.5 21v-7.2h2.4l.36-2.8H13.5V9.2c0-.8.22-1.36 1.38-1.36h1.48V5.36c-.26-.03-1.14-.11-2.16-.11-2.14 0-3.6 1.3-3.6 3.7V11H8.4v2.8h2.2V21h2.9Z" />
    </svg>
  )
}

function InstagramIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden className={className}>
      <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
      <circle cx="12" cy="12" r="3.5" />
      <circle cx="16.8" cy="7.2" r="0.4" fill="currentColor" />
    </svg>
  )
}

function YoutubeIcon({ className }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden className={className}>
      <path d="M21.2 8.2a2.4 2.4 0 0 0-1.7-1.7C18 6.1 12 6.1 12 6.1s-6 0-7.5.4A2.4 2.4 0 0 0 2.8 8.2 25 25 0 0 0 2.4 12c0 1.3.13 2.6.4 3.8a2.4 2.4 0 0 0 1.7 1.7c1.5.4 7.5.4 7.5.4s6 0 7.5-.4a2.4 2.4 0 0 0 1.7-1.7c.27-1.2.4-2.5.4-3.8s-.13-2.6-.4-3.8ZM10.2 15V9l5 3-5 3Z" />
    </svg>
  )
}
const supportLinks = [
  { label: 'Câu hỏi thường gặp' },
  { label: 'Chính sách bảo mật' },
  { label: 'Điều khoản sử dụng' },
  { label: 'Chính sách giao hàng' },
]

const socialLinks = [
  { label: 'Facebook', icon: FacebookIcon },
  { label: 'Instagram', icon: InstagramIcon },
  { label: 'YouTube', icon: YoutubeIcon },
]

export default function Footer() {
  return (
    <footer className="bg-forest-700 text-sage-100">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 sm:px-6 lg:grid-cols-4 lg:px-8">
        {/* Brand */}
        <div className="space-y-4">
          <Link to="/" className="flex items-center gap-2" aria-label="OffiMeal - Trang chủ">
            <BrandLogo footer />
          </Link>
          <p className="text-sm leading-relaxed text-sage-100/80">
            OffiMeal hướng tới bữa trưa tiện lợi cho người đi làm, kết hợp gợi ý dinh dưỡng và bài tập theo mục tiêu.
          </p>
          <div className="flex gap-3 pt-1">
            {socialLinks.map(({ label, icon: Icon }) => (
              <span
                key={label}
                role="img"
                aria-label={`${label}: chưa có liên kết chính thức`}
                title={`${label}: chưa có liên kết chính thức`}
                className="flex size-10 items-center justify-center rounded-full bg-forest-600 text-sage-100 transition-colors duration-200 hover:bg-sage-500 hover:text-forest-700"
              >
                <Icon className="size-5" aria-hidden />
              </span>
            ))}
          </div>
        </div>

        {/* Quick links */}
        <nav aria-label="Liên kết nhanh">
          <h3 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
            Liên kết nhanh
          </h3>
          <ul className="space-y-2.5">
            {navLinks.map((link) => (
              <li key={link.to}>
                <Link
                  to={link.to}
                  className="group inline-flex items-center gap-1.5 text-sm text-sage-100/85 transition-colors hover:text-accent-400"
                >
                  {link.label}
                  <ArrowRight
                    className="size-3.5 opacity-0 transition-all group-hover:translate-x-0.5 group-hover:opacity-100"
                    aria-hidden
                  />
                </Link>
              </li>
            ))}
          </ul>
        </nav>

        {/* Support */}
        <nav aria-label="Hỗ trợ khách hàng">
          <h3 className="mb-4 text-sm font-bold tracking-wider text-white uppercase">
            Hỗ trợ khách hàng
          </h3>
          <ul className="space-y-2.5">
            {supportLinks.map((link) => (
              <li key={link.label}>
                <span
                  className="text-sm text-sage-100/85"
                >
                  {link.label} <span className="text-xs text-sage-100/60">(sắp cập nhật)</span>
                </span>
              </li>
            ))}
          </ul>
        </nav>

        {/* Newsletter blurb */}
        <div className="space-y-4">
          <h3 className="text-sm font-bold tracking-wider text-white uppercase">
            Cùng ăn lành mạnh
          </h3>
          <p className="text-sm leading-relaxed text-sage-100/80">
            Nhập hồ sơ thể trạng để xem nhu cầu năng lượng và gợi ý bữa trưa.
          </p>
          {/* Liên kết tới công cụ dinh dưỡng đang hoạt động */}
          <Link
            to="/dinh-duong-ca-nhan"
            className="inline-flex items-center gap-2 rounded-full bg-sage-500 px-5 py-2.5 text-sm font-semibold text-forest-700 transition-colors duration-200 hover:bg-accent-400"
          >
            Xem gợi ý dinh dưỡng
          </Link>
        </div>
      </div>

      <div className="border-t border-forest-600">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-6 text-xs text-sage-100/70 sm:flex-row sm:px-6 lg:px-8">
          <p>© {currentYear} OffiMeal. Bảo lưu mọi quyền.</p>
          <p>Ăn lành mạnh, sống nhẹ nhàng hơn.</p>
        </div>
      </div>
    </footer>
  )
}
