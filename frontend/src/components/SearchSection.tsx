import React, { useState } from 'react'
import { usePrices } from '../hooks/usePrices.js'
import { SearchQuery } from '../types/index.js'
import { PriceTable, EditModal, ConfirmDeleteModal } from './index.js'
import { PriceRecord } from '../types/index.js'

export const SearchSection: React.FC = () => {
  const { query, results, loading, error, setQuery, search, editRecord, deleteRecord } = usePrices()
  const [localQuery, setLocalQuery] = useState<SearchQuery>(query)

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    setQuery(localQuery)
    search(localQuery)
  }

  const handleInputChange = (key: keyof SearchQuery, value: string) => {
    setLocalQuery((prev) => ({ ...prev, [key]: value }))
  }

  const [editing, setEditing] = useState<PriceRecord | null>(null)
  const [deleting, setDeleting] = useState<PriceRecord | null>(null)
  const [message, setMessage] = useState<string | null>(null)

  const handleEdit = (id: number) => {
    const row = results.find((r) => r.id === id)
    if (!row) return
    setEditing(row)
  }

  const handleEditSave = async (updates: { product_name?: string; price?: string }) => {
    if (!editing) return false
    const success = await editRecord(editing, updates)
    if (success) {
      setMessage('Record updated')
      setEditing(null)
      setTimeout(() => setMessage(null), 2500)
    }
    return success
  }

  const handleDelete = (id: number) => {
    const row = results.find((r) => r.id === id)
    if (!row) return
    setDeleting(row)
  }

  const handleDeleteConfirm = async () => {
    if (!deleting) return false
    const success = await deleteRecord(deleting.id)
    if (success) {
      setMessage('Record deleted')
      setDeleting(null)
      setTimeout(() => setMessage(null), 2500)
    }
    return success
  }

  return (
    <section className="card">
      <h2>Search</h2>
      <form onSubmit={handleSubmit} className="search-form">
        <input
          placeholder="Store ID"
          value={localQuery.store_id || ''}
          onChange={(e) => handleInputChange('store_id', e.target.value)}
          disabled={loading}
        />
        <input
          placeholder="SKU"
          value={localQuery.sku || ''}
          onChange={(e) => handleInputChange('sku', e.target.value)}
          disabled={loading}
        />
        <input
          placeholder="Product Name"
          value={localQuery.product_name || ''}
          onChange={(e) => handleInputChange('product_name', e.target.value)}
          disabled={loading}
        />
        <button type="submit" disabled={loading}>
          {loading ? 'Searching...' : 'Search'}
        </button>
      </form>

      {error && <p style={{ color: 'red', marginTop: '8px' }}>{error}</p>}
      {message && <p style={{ color: 'green', marginTop: '8px' }}>{message}</p>}

      <PriceTable records={results} onEdit={handleEdit} onDelete={handleDelete} loading={loading} />

      <EditModal open={!!editing} record={editing} onClose={() => setEditing(null)} onSave={handleEditSave} />
      <ConfirmDeleteModal open={!!deleting} record={deleting} onClose={() => setDeleting(null)} onConfirm={handleDeleteConfirm} />
    </section>
  )
}
