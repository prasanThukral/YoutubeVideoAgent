export interface User {
  userId: string
  name: string
}

export interface RegisterPayload {
  username: string
  password: string
  birth_year: number
  email: string
}

export interface LoginPayload {
  email: string
  password: string
}

export interface LoginResponse {
  accessToken: string
  refreshToken: string
}
