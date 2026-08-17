import { request } from './client'
import type { LoginPayload, LoginResponse, RegisterPayload } from '../types/auth'

export const authApi = {
  register(payload: RegisterPayload) {
    return request<{ success: string }>('/auth/registration', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  login(payload: LoginPayload) {
    return request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify(payload),
    })
  },

  logout(refreshToken: string) {
    return request<{ success: string }>('/auth/logout', {
      method: 'DELETE',
      body: JSON.stringify({ refreshToken }),
    })
  },
}
