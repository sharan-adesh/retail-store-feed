import React from 'react'
import { useUpload } from '../hooks/useUpload.js'

interface UploadSectionProps {
  onUploadSuccess?: (count: number) => void
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUploadSuccess }) => {
  const { file, loading, error, success, setFile, upload, reset } = useUpload()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const count = await upload()
    if (count !== null) {
      onUploadSuccess?.(count)
      alert(`Successfully inserted ${count} records`)
      reset()
    }
  }

  return (
    <section className="card">
      <h2>Upload CSV</h2>
      <form onSubmit={handleSubmit}>
        <input
          type="file"
          accept=".csv"
          onChange={(e) => setFile(e.target.files?.[0] || null)}
          disabled={loading}
        />
        <button type="submit" disabled={loading || !file}>
          {loading ? 'Uploading...' : 'Upload'}
        </button>
      </form>
      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
      {success && <p style={{ color: 'green', marginTop: '8px' }}>Upload successful!</p>}
    </section>
  )
}
