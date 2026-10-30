import { BrowserRouter } from 'react-router-dom'
import AppRoutes from '@/app/routes/AppRoutes'
import { AuthProvider } from '@/features/accounts/context/AuthProvider'

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider><AppRoutes /></AuthProvider>
    </BrowserRouter>
  )
}
