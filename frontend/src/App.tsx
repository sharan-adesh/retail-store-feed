import React, { useState } from 'react'
import { UploadSection, SearchSection, ProtectedRoute } from './components/index.js'
import { AuthProvider, useAuth } from './context/AuthContext.js'
import './styles.css'

const AppContent = () => {
  const [refreshKey, setRefreshKey] = useState(0)
  const { logout, user } = useAuth()

  const handleUploadSuccess = (count: number) => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="app">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h1>Retail Pricing</h1>
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
      <UploadSection onUploadSuccess={handleUploadSuccess} />
      <SearchSection key={refreshKey} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
