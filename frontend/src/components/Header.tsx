import React from 'react'
import { useAuth } from '../context/AuthContext.js'

export const Header: React.FC = () => {
  const { logout, user } = useAuth()

  return (
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
      <h1>Retail Pricing Feed Platform</h1>
      <div style={{ fontSize: 12 }}>
        <span>Logged in as: {user?.email}</span>
        <button
          onClick={logout}
          style={{
            marginLeft: 16,
            padding: '6px 12px',
            background: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          Logout
        </button>
      </div>
    </div>
  )
}
