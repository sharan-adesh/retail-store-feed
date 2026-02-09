import axios from 'axios'

const API_URL = '/api'

const authClient = axios.create({
  baseURL: API_URL,
})

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

export const register = async (req: RegisterRequest): Promise<AuthResponse> => {
  const response = await authClient.post<AuthResponse>('/auth/register', req)
  return response.data
}

export const login = async (req: LoginRequest): Promise<AuthResponse> => {
  const response = await authClient.post<AuthResponse>('/auth/login', req)
  return response.data
}
