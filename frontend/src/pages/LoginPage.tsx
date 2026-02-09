import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.js'

interface LoginResponse {
  token: string
  user: {
    id: number
    email: string
  }
}

export const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [loading, setLoading] = useState(false)
  const [isRegister, setIsRegister] = useState(false)
  const { login } = useAuth()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setError(null)
    setLoading(true)

    try {
      const endpoint = isRegister ? '/api/auth/register' : '/api/auth/login'
      const response = await axios.post<LoginResponse>(endpoint, { email, password })

      login(response.data.token, response.data.user)
    } catch (err: any) {
      const message = err.response?.data?.error || err.message || 'Authentication failed'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div style={containerStyle}>
      <div style={formStyle}>
        <h2>{isRegister ? 'Create Account' : 'Login'}</h2>

        {error && <p style={{ color: 'red', marginBottom: 12 }}>{error}</p>}

        <form onSubmit={handleSubmit}>
          <div style={{ marginBottom: 12 }}>
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
            />
          </div>

          <div style={{ marginBottom: 12 }}>
            <label>Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              disabled={loading}
              style={{ width: '100%', padding: 8, boxSizing: 'border-box' }}
            />
          </div>

          {isRegister && (
            <p style={{ fontSize: 12, color: '#666', marginBottom: 12 }}>Password must be at least 6 characters</p>
          )}

          <button
            type="submit"
            disabled={loading}
            style={{
              width: '100%',
              padding: 10,
              background: '#007BFF',
              color: 'white',
              border: 'none',
              borderRadius: 4,
              cursor: loading ? 'not-allowed' : 'pointer',
              opacity: loading ? 0.6 : 1,
            }}
          >
            {loading ? 'Loading...' : isRegister ? 'Sign Up' : 'Login'}
          </button>
        </form>

        <p style={{ marginTop: 16, textAlign: 'center' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            onClick={() => {
              setIsRegister(!isRegister)
              setError(null)
              setEmail('')
              setPassword('')
            }}
            style={{
              border: 'none',
              background: 'none',
              color: '#007BFF',
              cursor: 'pointer',
              marginLeft: 4,
              textDecoration: 'underline',
            }}
          >
            {isRegister ? 'Login' : 'Sign Up'}
          </button>
        </p>
      </div>
    </div>
  )
}

const containerStyle: React.CSSProperties = {
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  height: '100vh',
  background: '#f5f5f5',
}

const formStyle: React.CSSProperties = {
  background: 'white',
  padding: 32,
  borderRadius: 8,
  boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
  width: 360,
}
