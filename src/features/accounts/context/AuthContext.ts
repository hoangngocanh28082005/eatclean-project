import { createContext, useContext } from 'react'
import type { AccountUser } from '../models/Account'
interface AuthState { user: AccountUser | null; loading: boolean; error: string; refresh: () => Promise<void>; logout: () => Promise<void> }
export const AuthContext = createContext<AuthState | null>(null)
export function useAuth() {
  const value = useContext(AuthContext)
  if (!value) throw new Error('AuthProvider is missing')
  return value
}
