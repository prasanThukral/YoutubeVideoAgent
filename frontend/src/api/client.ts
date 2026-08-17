import { API_BASE_URL } from './config'
import { storage } from '../utils/storage'

export class ApiError extends Error {
  status: number
  constructor(message: string, status: number) {
    super(message)
    this.status = status
  }
}

async function parseResponse<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const message = (data && data.message) || `Request failed with status ${res.status}`
    throw new ApiError(message, res.status)
  }
  return data as T
}

async function refreshAccessToken(): Promise<string | null> {
  const refreshToken = storage.getRefreshToken()
  if (!refreshToken) return null

  const res = await fetch(`${API_BASE_URL}/auth/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refreshToken }),
  })
  const data = await res.json().catch(() => null)
  if (!data?.authToken) return null

  storage.setAccessToken(data.authToken)
  return data.authToken as string
}

interface RequestOptions extends RequestInit {
  auth?: boolean
}

export async function request<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const { auth = false, headers: extraHeaders, ...rest } = options

  const headers = new Headers(extraHeaders)
  headers.set('Content-Type', 'application/json')
  if (auth) {
    const token = storage.getAccessToken()
    if (token) headers.set('Authorization', `Bearer ${token}`)
  }

  const res = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers })

  if (auth && (res.status === 401 || res.status === 403)) {
    const newToken = await refreshAccessToken()
    if (newToken) {
      headers.set('Authorization', `Bearer ${newToken}`)
      const retryRes = await fetch(`${API_BASE_URL}${path}`, { ...rest, headers })
      return parseResponse<T>(retryRes)
    }
    storage.clearTokens()
  }

  return parseResponse<T>(res)
}
