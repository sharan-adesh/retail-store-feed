import React, { useState } from 'react'
import axios from 'axios'
import { useAuth } from '../context/AuthContext.js'
import { Input, Button } from '../components/index.js'

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

        {error && <div style={{ color: '#dc3545', marginBottom: 12, padding: '8px 12px', background: '#ffe6e6', borderRadius: '6px', fontSize: '14px' }}>{error}</div>}

        <form onSubmit={handleSubmit}>
          <Input
            type="email"
            label="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            disabled={loading}
            error={!!error}
          />

          <Input
            type="password"
            label="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            error={!!error}
            helperText={isRegister ? 'Password must be at least 6 characters' : error || undefined}
          />

          <Button
            type="submit"
            disabled={loading}
            variant="primary"
            fullWidth
            style={{ marginTop: '8px' }}
          >
            {loading ? 'Loading...' : isRegister ? 'Sign Up' : 'Login'}
          </Button>
        </form>

        <p style={{ marginTop: 16, textAlign: 'center', fontSize: '14px' }}>
          {isRegister ? 'Already have an account?' : "Don't have an account?"}
          <button
            type="button"
            onClick={() => {
              setIsRegister(!isRegister)
              setError(null)
              setEmail('')
              setPassword('')
            }}
            style={{
              border: 'none',
              background: 'none',
              color: '#007bff',
              cursor: 'pointer',
              marginLeft: 4,
              textDecoration: 'underline',
              fontSize: '14px',
              fontWeight: '500',
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
