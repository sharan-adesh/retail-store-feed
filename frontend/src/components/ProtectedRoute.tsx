import React from 'react'
import { useAuth } from '../context/AuthContext.js'
import { LoginPage } from '../pages/LoginPage.js'

interface ProtectedRouteProps {
  children: React.ReactNode
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth()

  if (isLoading) {
    return <div style={{ padding: 20, textAlign: 'center' }}>Loading...</div>
  }

  if (!isAuthenticated) {
    return <LoginPage />
  }

  return <>{children}</>
}
