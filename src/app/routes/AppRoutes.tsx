import { Route, Routes } from 'react-router-dom'
import MainLayout from '@/shared/components/layout/MainLayout'
import HomePage from '@/features/home/views/HomePage'
import MenuPage from '@/features/catalog/views/MenuPage'
import PlansPage from '@/features/catalog/views/PlansPage'
import NutritionPage from '@/features/nutrition/views/NutritionPage'
import WorkoutsPage from '@/features/workouts/views/WorkoutsPage'
import AboutPage from '@/features/about/views/AboutPage'
import NotFoundPage from '@/shared/views/NotFoundPage'
import AuthPage from '@/features/accounts/views/AuthPage'
import AccountPage from '@/features/accounts/views/AccountPage'
import AdminAccessPage from '@/features/admin/views/AdminAccessPage'

export default function AppRoutes() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/dang-nhap" element={<AuthPage key="login" mode="login" />} />
        <Route path="/dang-ky" element={<AuthPage key="register" mode="register" />} />
        <Route path="/quen-mat-khau" element={<AuthPage key="forgot" mode="forgot" />} />
        <Route path="/dat-lai-mat-khau" element={<AuthPage key="reset" mode="reset" />} />
        <Route path="/xac-minh-email" element={<AuthPage key="verify" mode="verify" />} />
        <Route path="/tai-khoan" element={<AccountPage />} />
        <Route path="/quan-tri" element={<AdminAccessPage />} />
        <Route index element={<HomePage />} />
        <Route path="/thuc-don" element={<MenuPage />} />
        <Route path="/goi-an" element={<PlansPage />} />
        <Route path="/dinh-duong-ca-nhan" element={<NutritionPage />} />
        <Route path="/bai-tap" element={<WorkoutsPage />} />
        <Route path="/ve-chung-toi" element={<AboutPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  )
}
