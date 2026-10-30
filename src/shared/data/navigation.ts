export interface NavLink {
  label: string
  to: string
}

export const navLinks: NavLink[] = [
  { label: 'Trang chủ', to: '/' },
  { label: 'Thực đơn', to: '/thuc-don' },
  { label: 'Gói ăn', to: '/goi-an' },
  { label: 'Dinh dưỡng cá nhân', to: '/dinh-duong-ca-nhan' },
  { label: 'Bài tập', to: '/bai-tap' },
  { label: 'Về chúng tôi', to: '/ve-chung-toi' },
]
