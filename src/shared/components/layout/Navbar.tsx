import { useEffect, useState } from 'react'
import { Link, NavLink } from 'react-router-dom'
import { Menu, X, User, ShoppingBag, Bell } from 'lucide-react'
import BrandLogo from '@/shared/components/ui/BrandLogo'
import { navLinks } from '@/shared/data/navigation'
import Button from '@/shared/components/ui/Button'
import { useAuth } from '@/features/accounts/context/AuthContext'
import NotificationModal from '@/features/workouts/components/NotificationModal'
import { workoutProgressService } from '@/features/workouts/services/workoutProgressService'

const mobileMenuLinkClasses = ({ isActive }: { isActive: boolean }) =>
  `block rounded-xl px-4 py-3 text-base font-medium transition-colors duration-200 ${
    isActive
      ? 'bg-sage-100 text-forest-700 font-semibold'
      : 'text-forest-900/80 hover:bg-sage-100 hover:text-forest-700'
  }`

export default function Navbar() {
  const { user } = useAuth()
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const closeMenu = () => setIsMenuOpen(false)

  // In-app notifications state
  const [isNotifOpen, setIsNotifOpen] = useState(false)
  const [notifications, setNotifications] = useState(() => workoutProgressService.getNotifications())

  const unreadNotifsCount = notifications.filter((n) => !n.isRead).length

  const handleMarkNotifRead = (id: string) => {
    workoutProgressService.markNotificationAsRead(id)
    setNotifications(workoutProgressService.getNotifications())
  }

  const handleMarkAllNotifsRead = () => {
    workoutProgressService.markAllNotificationsAsRead()
    setNotifications(workoutProgressService.getNotifications())
  }

  // Lock body scroll while the mobile menu is open
  // (route changes close the menu via onClick on each NavLink)
  useEffect(() => {
    document.body.style.overflow = isMenuOpen ? 'hidden' : ''
    return () => {
      document.body.style.overflow = ''
    }
  }, [isMenuOpen])

  const iconButtonClasses =
    'flex size-10 items-center justify-center rounded-full text-forest-900 transition-colors duration-200 hover:bg-sage-100 hover:text-forest-700'

  return (
    <header className="sticky top-0 z-50 border-b border-sage-100 bg-white/90 backdrop-blur-md">
      <nav
        className="mx-auto flex h-24 max-w-7xl items-center justify-between gap-2 px-4 sm:gap-4 sm:px-6 lg:px-8"
        aria-label="Điều hướng chính"
      >
        {/* Logo */}
        <Link to="/" onClick={closeMenu} className="flex items-center gap-2" aria-label="OffiMeal - Trang chủ">
          <BrandLogo />
        </Link>

        {/* Desktop nav */}
        <ul className="hidden items-center gap-1 lg:flex">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                end={link.to === '/'}
                className={({ isActive }) =>
                  `rounded-full px-3 py-2 text-sm font-medium transition-colors duration-200 ${
                    isActive
                      ? 'bg-sage-100 text-forest-700 font-semibold'
                      : 'text-forest-900/80 hover:bg-sage-100 hover:text-forest-700'
                  }`
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right actions */}
        <div className="flex items-center gap-1 sm:gap-2">
          {/* Notification bell button */}
          <button
            type="button"
            onClick={() => setIsNotifOpen(true)}
            className={`relative ${iconButtonClasses}`}
            aria-label="Thông báo website"
            title="Xem thông báo"
          >
            <Bell className="size-5" aria-hidden />
            {unreadNotifsCount > 0 && (
              <span className="absolute top-1.5 right-1.5 flex size-4 items-center justify-center rounded-full bg-accent-500 text-[9px] font-bold text-white ring-2 ring-white">
                {unreadNotifsCount}
              </span>
            )}
          </button>

          <Link to={user ? '/tai-khoan' : '/dang-nhap'} onClick={closeMenu} className={iconButtonClasses} aria-label={user ? 'Tài khoản của bạn' : 'Đăng nhập'} title={user ? `Tài khoản: ${user.fullName}` : 'Đăng nhập / Đăng ký'}>
            <User className="size-5" aria-hidden />
          </Link>
          <button type="button" className={iconButtonClasses} aria-label="Giỏ hàng (sắp ra mắt)" disabled>
            <ShoppingBag className="size-5" aria-hidden />
            <span className="absolute hidden">0</span>
          </button>
          <Button to="/thuc-don" size="sm" className="hidden md:inline-flex">
            Xem thực đơn
          </Button>

          {/* Hamburger */}
          <button
            type="button"
            className={iconButtonClasses + ' lg:hidden'}
            aria-label={isMenuOpen ? 'Đóng menu' : 'Mở menu'}
            aria-expanded={isMenuOpen}
            onClick={() => setIsMenuOpen((open) => !open)}
          >
            {isMenuOpen ? <X className="size-6" aria-hidden /> : <Menu className="size-6" aria-hidden />}
          </button>
        </div>
      </nav>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="border-t border-sage-100 bg-white lg:hidden">
          <ul className="mx-auto max-w-7xl space-y-1 px-4 py-4 sm:px-6">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  end={link.to === '/'}
                  onClick={closeMenu}
                  className={mobileMenuLinkClasses}
                >
                  {link.label}
                </NavLink>
              </li>
            ))}
            <li className="pt-2">
              <Button to="/thuc-don" onClick={closeMenu} className="w-full">Xem thực đơn</Button>
            </li>
          </ul>
        </div>
      )}
      {/* Global In-App Notifications Modal */}
      <NotificationModal
        isOpen={isNotifOpen}
        onClose={() => setIsNotifOpen(false)}
        notifications={notifications}
        onMarkAsRead={handleMarkNotifRead}
        onMarkAllAsRead={handleMarkAllNotifsRead}
      />
    </header>
  )
}
