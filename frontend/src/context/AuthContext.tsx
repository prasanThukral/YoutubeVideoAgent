import { createContext, useContext, useState, type ReactNode } from 'react'
import { authApi } from '../api/auth'
import { storage } from '../utils/storage'
import { decodeJwt } from '../utils/jwt'
import type { LoginPayload, RegisterPayload, User } from '../types/auth'

interface AuthContextValue {
  user: User | null
  isAuthenticated: boolean
  login: (payload: LoginPayload) => Promise<void>
  register: (payload: RegisterPayload) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextValue | null>(null)

function userFromToken(token: string | null): User | null {
  if (!token) return null
  const payload = decodeJwt<{ userId: string; name: string }>(token)
  return payload ? { userId: payload.userId, name: payload.name } : null
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(() => userFromToken(storage.getAccessToken()))

  async function login(payload: LoginPayload) {
    const { accessToken, refreshToken } = await authApi.login(payload)
    storage.setTokens(accessToken, refreshToken)
    setUser(userFromToken(accessToken))
  }

  async function register(payload: RegisterPayload) {
    await authApi.register(payload)
  }

  async function logout() {
    const refreshToken = storage.getRefreshToken()
    storage.clearTokens()
    setUser(null)
    if (refreshToken) {
      await authApi.logout(refreshToken).catch(() => {})
    }
  }

  return (
    <AuthContext.Provider value={{ user, isAuthenticated: user !== null, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used within an AuthProvider')
  return ctx
}
