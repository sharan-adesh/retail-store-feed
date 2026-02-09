import React from 'react'
import { useUpload } from '../hooks/useUpload.js'
import { Button } from './index.js'

interface UploadSectionProps {
  onUploadSuccess?: (count: number) => void
}

export const UploadSection: React.FC<UploadSectionProps> = ({ onUploadSuccess }) => {
  const { file, loading, setFile, upload, reset } = useUpload()

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const count = await upload()
    if (count !== null) {
      onUploadSuccess?.(count)
      reset()
    }
  }

  return (
    <section className="card">
      <h2>Upload CSV</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '12px' }}>
          <label
            htmlFor="file-upload"
            style={{
              display: 'inline-block',
              padding: '10px 12px',
              backgroundColor: '#f8f9fa',
              border: '1px solid #ddd',
              borderRadius: '6px',
              cursor: loading ? 'not-allowed' : 'pointer',
              fontSize: '14px',
              color: '#495057',
              transition: 'all 0.2s ease',
              opacity: loading ? 0.6 : 1
            }}
          >
            Choose CSV File
          </label>
          <input
            id="file-upload"
            type="file"
            accept=".csv"
            onChange={(e) => setFile(e.target.files?.[0] || null)}
            disabled={loading}
            style={{ display: 'none' }}
          />
          {file && (
            <span style={{ marginLeft: '12px', fontSize: '14px', color: '#495057' }}>
              {file.name}
            </span>
          )}
        </div>
        <Button type="submit" disabled={loading || !file} variant="primary">
          {loading ? 'Uploading...' : 'Upload'}
        </Button>
      </form>
    </section>
  )
}
