export interface User {
  id: number
  email: string
  password_hash: string
  created_at?: string
  updated_at?: string
}

export interface RegisterRequest {
  email: string
  password: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface AuthResponse {
  token: string
  user: {
    id: number
    email: string
  }
}
