import React, { useState } from 'react'
import { UploadSection, SearchSection, ProtectedRoute, Header } from './components/index.js'
import { AuthProvider } from './context/AuthContext.js'
import { Toaster } from 'react-hot-toast'
import './styles.css'

const AppContent = () => {
  const [refreshKey, setRefreshKey] = useState(0)

  const handleUploadSuccess = (count: number) => {
    setRefreshKey((prev) => prev + 1)
  }

  return (
    <div className="app">
      <Header />
      <UploadSection onUploadSuccess={handleUploadSuccess} />
      <SearchSection key={refreshKey} />
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <Toaster position="top-right" />
      <ProtectedRoute>
        <AppContent />
      </ProtectedRoute>
    </AuthProvider>
  )
}
