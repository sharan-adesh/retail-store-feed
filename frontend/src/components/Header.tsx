import React from 'react'
import { useAuth } from '../context/AuthContext.js'
import { Button } from './index.js'

export const Header: React.FC = () => {
  const { logout, user } = useAuth()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h1>Retail Pricing Feed Platform</h1>
      <div style={{ fontSize: 12, display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>Logged in as: {user?.email}</span>
        <Button onClick={logout} variant="danger">
          Logout
        </Button>
      </div>
    </div>
  )
}
