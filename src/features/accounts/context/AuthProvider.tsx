import { useCallback, useEffect, useState, type ReactNode } from 'react'
import { ApiError, errorMessage } from '@/shared/services/httpClient'
import { AuthContext } from './AuthContext'
import type { AccountUser } from '../models/Account'
import { authService } from '../services/authService'
export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AccountUser | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const refresh = useCallback(async () => {
    setError('')
    try { setUser(await authService.currentUser()) }
    catch (e) { setUser(null); if (!(e instanceof ApiError && e.status === 401)) setError(errorMessage(e)) }
    finally { setLoading(false) }
  }, [])
  useEffect(() => { void Promise.resolve().then(refresh) }, [refresh])
  const logout = async () => {
    await authService.logout()
    setUser(null)
  }
  return <AuthContext.Provider value={{ user, loading, error, refresh, logout }}>{children}</AuthContext.Provider>
}
